import type { ToneId } from '../content/taxonomy';
import { normalize } from './normalize';

const INTERJECTIONS = /^(Boa|Show|Legal|Bacana|Que legal|Massa|Top|Opa|Beleza)!\s*/;

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+["”]?|[^.!?]+$/g)?.map((s) => s.trim()) ?? [text];
}

/**
 * Ajuste de tom determinístico, aplicado ao conteúdo da biblioteca.
 * Não reescreve o argumento: só troca marcas de informalidade ou encurta.
 */
export function applyTone(text: string, tone: ToneId): string {
  if (tone === 'proximo') return text;
  let t = text;
  if (tone === 'profissional' || tone === 'formal') {
    t = t
      .replace(INTERJECTIONS, tone === 'formal' ? 'Entendo. ' : 'Ótimo. ')
      .replace(/\bpra\b/g, 'para')
      .replace(/\bPra\b/g, 'Para')
      .replace(/\bpro\b/g, 'para o')
      .replace(/\btá\b/g, 'está')
      .replace(/\bTá\b/g, 'Está')
      .replace(/\brapidinho\b/g, 'rapidamente')
      .replace(/\bnum\b/g, 'em um')
      .replace(/\bnuma\b/g, 'em uma');
  }
  if (tone === 'formal') {
    t = t
      .replace(/^Oi,?\s*/i, 'Olá, ')
      .replace(/\bTranquilo!/g, 'Sem problemas.')
      .replace(/\bSuper entendo\b/g, 'Compreendo')
      .replace(/\bsuper\s/gi, 'muito ')
      .replace(/!\s/g, '. ')
      .replace(/!$/g, '.');
  }
  if (tone === 'direto') {
    t = t.replace(INTERJECTIONS, '');
    const parts = splitSentences(t);
    if (parts.length > 2) {
      const question = [...parts].reverse().find((p) => p.endsWith('?'));
      const first = parts[0];
      t = question && question !== first ? `${first} ${question}` : parts.slice(0, 2).join(' ');
    }
  }
  return t.replace(/\s{2,}/g, ' ').trim();
}

/** Lista os campos entre colchetes que o vendedor precisa preencher. */
export function placeholders(text: string): string[] {
  return [...new Set(text.match(/\[[^\]]+\]/g) ?? [])];
}

const REFUSAL_PATTERNS = [
  'nao tenho interesse',
  'nao tenho mais interesse',
  'nao quero mais',
  'nao me mande mais',
  'nao me manda mais',
  'pare de me mandar',
  'para de me mandar',
  'pare de mandar',
  'nao me procure',
  'nao entre mais em contato',
  'remova meu contato',
  'tira meu numero',
  'me tira da lista',
  'nao vou contratar',
  'ja fechei com outro',
  'fechei com outra pessoa',
  'nao precisa mais me chamar',
];

/** Detecta recusa explícita — nesse caso a recomendação é encerrar, nunca insistir. */
export function detectExplicitRefusal(...texts: (string | undefined)[]): boolean {
  const n = normalize(texts.filter(Boolean).join(' '));
  return REFUSAL_PATTERNS.some((p) => n.includes(p));
}

export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function uid(prefix = ''): string {
  const rnd =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}${Date.now().toString(36)}${rnd}`;
}
