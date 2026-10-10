import type { Niche, NicheObjection, Objection } from '../types';
import { CATEGORIES } from '../content/taxonomy';
import { normalize, sentences, similarity, stem, tokens } from './normalize';

/** Sinônimos comuns em conversas de venda (chave e valores já normalizados). */
const SYNONYMS: Record<string, string[]> = {
  caro: ['preco', 'valor', 'salgado', 'puxado', 'alto', 'orcamento', 'pesado', 'dinheiro', 'investimento'],
  preco: ['caro', 'valor', 'custa', 'quanto', 'orcamento', 'tabela'],
  valor: ['preco', 'caro', 'custa', 'quanto'],
  quanto: ['preco', 'valor', 'custa'],
  dinheiro: ['grana', 'caixa', 'orcamento', 'apertado'],
  grana: ['dinheiro', 'caixa', 'orcamento'],
  insta: ['instagram', 'rede', 'social'],
  instagram: ['insta', 'rede', 'social', 'facebook'],
  zap: ['whatsapp', 'whats'],
  whats: ['whatsapp', 'zap'],
  whatsapp: ['zap', 'whats'],
  site: ['pagina', 'website', 'web'],
  pagina: ['site', 'landing'],
  sistema: ['software', 'plataforma', 'programa', 'app', 'aplicativo'],
  software: ['sistema', 'erp', 'programa'],
  app: ['aplicativo', 'celular', 'sistema'],
  socio: ['esposa', 'marido', 'diretoria', 'parceiro', 'consultar', 'aprovacao'],
  esposa: ['socio', 'marido', 'consultar'],
  marido: ['socio', 'esposa', 'consultar'],
  pensar: ['analisar', 'avaliar', 'pensando', 'retorno', 'aviso'],
  sobrinho: ['filho', 'primo', 'amigo', 'conhecido', 'parente'],
  filho: ['sobrinho', 'parente'],
  mensalidade: ['mensal', 'mes', 'assinatura', 'recorrente', 'fixo'],
  planilha: ['excel', 'sheets', 'controle'],
  excel: ['planilha'],
  google: ['busca', 'pesquisa', 'seo'],
  garantia: ['garante', 'garantir', 'resultado', 'promessa'],
  confiar: ['confianca', 'golpe', 'medo', 'entregar', 'sumir'],
  golpe: ['confiar', 'medo', 'entregar'],
  depois: ['proximo', 'mais', 'frente', 'futuro'],
  tempo: ['corrido', 'ocupado', 'correria'],
  dados: ['backup', 'seguranca', 'lgpd', 'informacoe'],
  ia: ['inteligencia', 'artificial', 'chatgpt', 'gpt'],
  chatgpt: ['ia', 'inteligencia', 'artificial'],
  proposta: ['orcamento', 'pdf', 'material'],
  orcamento: ['proposta', 'preco', 'valor'],
  contrato: ['assinar', 'papel', 'burocracia'],
  portfolio: ['trabalho', 'exemplo', 'referencia'],
  agencia: ['empresa', 'grande'],
  barato: ['menor', 'menos', 'metade', 'preco'],
};

export interface SearchDoc {
  key: string;
  kind: 'objection' | 'niche-objection';
  /** Frases principais (frase da objeção + variações). */
  phrases: string[];
  /** Texto de apoio com peso menor. */
  body: string;
  objection?: Objection;
  niche?: Niche;
  nicheObjection?: NicheObjection;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

interface IndexedDoc {
  doc: SearchDoc;
  phraseTokens: Set<string>;
  bodyTokens: Set<string>;
}

export function buildIndex(objections: Objection[], niches: Niche[]): IndexedDoc[] {
  const docs: SearchDoc[] = [];
  for (const o of objections) {
    docs.push({
      key: `o:${o.id}`,
      kind: 'objection',
      phrases: [o.frase, ...o.gatilhos],
      body: [CATEGORIES[o.categoria].label, ...o.significados, o.estrategia].join(' '),
      objection: o,
    });
  }
  for (const n of niches) {
    for (const no of n.objecoes) {
      docs.push({
        key: `n:${n.id}:${no.id}`,
        kind: 'niche-objection',
        phrases: [no.frase],
        body: [n.nome, no.porTras].join(' '),
        niche: n,
        nicheObjection: no,
      });
    }
  }
  return docs.map((doc) => ({
    doc,
    phraseTokens: new Set(doc.phrases.flatMap((p) => tokens(p))),
    bodyTokens: new Set(tokens(doc.body)),
  }));
}

function expand(queryTokens: string[]): { token: string; weight: number }[] {
  const out = new Map<string, number>();
  for (const t of queryTokens) {
    out.set(t, Math.max(out.get(t) ?? 0, 1));
    const syn = SYNONYMS[t] ?? SYNONYMS[normalize(t)];
    if (syn) for (const s of syn) {
      const st = stem(s);
      out.set(st, Math.max(out.get(st) ?? 0, 0.6));
    }
  }
  return [...out.entries()].map(([token, weight]) => ({ token, weight }));
}

function scoreDoc(ix: IndexedDoc, queryParts: string[], expanded: { token: string; weight: number }[], qTokenCount: number): number {
  // 1) similaridade de frase (melhor combinação entre partes da mensagem e frases do documento)
  let best = 0;
  for (const q of queryParts) {
    for (const p of ix.doc.phrases) {
      const s = similarity(q, p);
      if (s > best) best = s;
    }
  }
  // 2) sobreposição de termos
  let overlap = 0;
  for (const { token, weight } of expanded) {
    if (ix.phraseTokens.has(token)) overlap += 3 * weight;
    else if (ix.bodyTokens.has(token)) overlap += 0.6 * weight;
    else if (token.length >= 4) {
      for (const pt of ix.phraseTokens) {
        if (pt.startsWith(token) || token.startsWith(pt)) {
          overlap += 1.4 * weight;
          break;
        }
      }
    }
  }
  const overlapNorm = qTokenCount ? overlap / (3 * qTokenCount) : 0;
  return best * 0.55 + Math.min(overlapNorm, 1.2) * 0.45;
}

export function search(index: IndexedDoc[], query: string, limit = 20, minScore = 0.16): SearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const parts = [q, ...sentences(q)].slice(0, 12);
  const qTokens = [...new Set(tokens(q))];
  const expanded = expand(qTokens);
  const hits: SearchHit[] = [];
  for (const ix of index) {
    const score = scoreDoc(ix, parts, expanded, Math.max(qTokens.length, 1));
    if (score >= minScore) hits.push({ doc: ix.doc, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

/** Grau de confiança legível para exibir ao usuário. */
export function matchLabel(score: number): 'forte' | 'provável' | 'possível' {
  if (score >= 0.5) return 'forte';
  if (score >= 0.3) return 'provável';
  return 'possível';
}
