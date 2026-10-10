import type { Niche, NicheObjection, Objection, ObjectiveId, Service } from '../types';
import { CATEGORY_TO_ANGLE, OBJECTIVES, type ToneId } from '../content/taxonomy';
import { search, matchLabel, type SearchHit, buildIndex } from './search';
import { applyTone, detectExplicitRefusal } from './text';

export interface ComposeInput {
  mensagem: string;
  nicheId?: string;
  serviceId?: string;
  preco?: string;
  historico?: string;
  objetivo: ObjectiveId;
  tom: ToneId;
  /** Força o uso de um resultado específico da busca (chave do documento). */
  forcedKey?: string;
}

export type ResponseKind = 'natural' | 'estrategica' | 'comercial';

export interface ComposedResponse {
  tipo: ResponseKind;
  titulo: string;
  descricao: string;
  versoes: string[];
}

export interface ComposeResult {
  recusaExplicita: boolean;
  match?: {
    score: number;
    label: ReturnType<typeof matchLabel>;
    objection?: Objection;
    niche?: Niche;
    nicheObjection?: NicheObjection;
  };
  outros: SearchHit[];
  respostas: ComposedResponse[];
  porque?: string;
  variacaoServico?: string;
  anguloNicho?: string;
  cuidados: string[];
  dicaPreco?: string;
}

const TITLES: Record<ResponseKind, { titulo: string; descricao: string }> = {
  natural: { titulo: 'Natural', descricao: 'Curta e humana, para responder no WhatsApp.' },
  estrategica: { titulo: 'Estratégica', descricao: 'Investiga o motivo real da objeção antes de argumentar.' },
  comercial: { titulo: 'Comercial', descricao: 'Apresenta valor e sugere um próximo passo.' },
};

function make(tipo: ResponseKind, versoes: string[], tom: ToneId): ComposedResponse {
  const unique = [...new Set(versoes.map((v) => applyTone(v, tom)).filter(Boolean))];
  return { tipo, ...TITLES[tipo], versoes: unique };
}

type Index = ReturnType<typeof buildIndex>;

export function compose(
  input: ComposeInput,
  ctx: { index: Index; niches: Niche[]; services: Service[] },
): ComposeResult {
  const niche = ctx.niches.find((n) => n.id === input.nicheId);
  const service = ctx.services.find((s) => s.id === input.serviceId);
  const recusaExplicita = detectExplicitRefusal(input.mensagem, input.historico);
  const objetivo: ObjectiveId = recusaExplicita ? 'encerrar' : input.objetivo;
  const fechamentos = OBJECTIVES[objetivo].fechamentos;

  let hits = search(ctx.index, input.mensagem, 12, 0.14);
  // Prioriza objeções do nicho escolhido e da biblioteca adequada ao serviço.
  hits = hits
    .filter((h) => h.doc.kind === 'objection' || h.doc.niche?.id === input.nicheId)
    .map((h) => {
      let score = h.score;
      if (h.doc.kind === 'niche-objection') score += 0.08;
      if (h.doc.objection && service) {
        if (h.doc.objection.servicos.includes(service.grupo)) score += 0.04;
        if (h.doc.objection.servicosRelacionados?.includes(service.id)) score += 0.04;
      }
      return { ...h, score };
    })
    .sort((a, b) => b.score - a.score);

  if (input.forcedKey) {
    const forced = hits.find((h) => h.doc.key === input.forcedKey);
    if (forced) hits = [forced, ...hits.filter((h) => h !== forced)];
  }

  const top = hits[0];
  const topGeneral = hits.find((h) => h.doc.kind === 'objection');
  const cuidados = [...(niche?.cuidados ?? [])];
  const result: ComposeResult = { recusaExplicita, outros: hits.slice(1, 5), respostas: [], cuidados };

  if (input.preco) {
    result.dicaPreco = `Proposta de ${input.preco}: se o cliente achar alto, não reduza o mesmo escopo — ofereça uma versão Essencial ou divida em fases no Montador de Propostas.`;
  }

  if (recusaExplicita) {
    result.respostas = [
      make('natural', [fechamentos[0]], input.tom),
      make(
        'estrategica',
        [`Obrigado por me dizer com clareza. Se puder me contar o principal motivo, me ajuda a melhorar. ${fechamentos[1]}`],
        input.tom,
      ),
      make('comercial', [fechamentos[1], fechamentos[0]], input.tom),
    ];
    result.porque =
      'O cliente recusou de forma explícita. A recomendação é encerrar com respeito, sem novos argumentos e sem follow-up, preservando a reputação e a possibilidade de indicação futura.';
    return result;
  }

  if (!top) return result;

  result.match = {
    score: top.score,
    label: matchLabel(top.score),
    objection: top.doc.objection,
    niche: top.doc.niche,
    nicheObjection: top.doc.nicheObjection,
  };

  const general = top.doc.objection ?? topGeneral?.doc.objection;

  if (top.doc.nicheObjection && top.doc.niche) {
    const no = top.doc.nicheObjection;
    const n = top.doc.niche;
    const persuasiva = general?.respostas.persuasiva;
    result.respostas = [
      make('natural', [no.resposta, ...(general ? [general.respostas.curta] : [])], input.tom),
      make(
        'estrategica',
        [`Faz sentido. ${no.pergunta}`, ...(general ? [general.respostas.consultiva] : [])],
        input.tom,
      ),
      make(
        'comercial',
        fechamentos.map((f, i) => `${i === 0 || !persuasiva ? n.argumentos[i % n.argumentos.length] : persuasiva}\n\n${f}`),
        input.tom,
      ),
    ];
    result.porque = `${no.porTras} Próximo passo sugerido: ${no.proximoPasso}`;
    result.anguloNicho = n.angulos[CATEGORY_TO_ANGLE[general?.categoria ?? 'necessidade']];
  } else if (general) {
    const o = general;
    result.respostas = [
      make('natural', [o.respostas.curta, ...o.alternativas], input.tom),
      make(
        'estrategica',
        [o.respostas.consultiva, `Entendo. Posso te fazer uma pergunta para te ajudar melhor? ${o.perguntaEstrategica}`],
        input.tom,
      ),
      make(
        'comercial',
        fechamentos.map((f) => `${o.respostas.persuasiva}\n\n${f}`),
        input.tom,
      ),
    ];
    result.porque = `${o.estrategia} Próximo passo: ${o.proximoPasso}`;
    if (niche) result.anguloNicho = niche.angulos[CATEGORY_TO_ANGLE[o.categoria]];
  }

  if (general && service) result.variacaoServico = general.variacoes[service.grupo];
  return result;
}
