import type {
  ContentKind,
  ContentOverride,
  FollowUpSequence,
  Niche,
  Objection,
  ProspectStage,
  QuickReply,
  Scenario,
  Service,
} from '../types';
import { OBJECTIONS } from '../content/objections';
import { NICHES } from '../content/niches';
import { SERVICES } from '../content/services';
import { SCENARIOS } from '../content/scenarios';
import { FOLLOWUPS } from '../content/followups';
import { PROSPECT_STAGES } from '../content/prospecting';
import { QUICK_REPLIES } from '../content/quick';

export interface ContentBundle {
  objections: Objection[];
  niches: Niche[];
  services: Service[];
  scenarios: Scenario[];
  followups: FollowUpSequence[];
  prospect: ProspectStage[];
  quick: QuickReply[];
}

export const BASE_CONTENT: ContentBundle = {
  objections: OBJECTIONS,
  niches: NICHES,
  services: SERVICES,
  scenarios: SCENARIOS,
  followups: FOLLOWUPS,
  prospect: PROSPECT_STAGES,
  quick: QUICK_REPLIES,
};

export const KIND_TO_KEY: Record<ContentKind, keyof ContentBundle> = {
  objection: 'objections',
  niche: 'niches',
  service: 'services',
  scenario: 'scenarios',
  followup: 'followups',
  prospect: 'prospect',
  quick: 'quick',
};

export const KIND_LABEL: Record<ContentKind, string> = {
  objection: 'Objeção',
  niche: 'Nicho',
  service: 'Serviço',
  scenario: 'Cenário de treino',
  followup: 'Sequência de follow-up',
  prospect: 'Etapa de prospecção',
  quick: 'Resposta rápida',
};

const isStr = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
const isArr = (v: unknown) => Array.isArray(v);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Validação mínima para que um conteúdo editado não quebre a interface. */
export function validateContent(kind: ContentKind, data: unknown): string[] {
  const errs: string[] = [];
  if (!isObj(data)) return ['O conteúdo precisa ser um objeto.'];
  if (!isStr(data.id)) errs.push('Campo "id" obrigatório.');
  switch (kind) {
    case 'objection': {
      if (!isStr(data.frase)) errs.push('Campo "frase" obrigatório.');
      if (!['geral', 'sistema'].includes(data.biblioteca as string)) errs.push('"biblioteca" deve ser "geral" ou "sistema".');
      if (!isStr(data.categoria)) errs.push('Campo "categoria" obrigatório.');
      const r = data.respostas;
      if (!isObj(r) || !isStr(r.curta) || !isStr(r.consultiva) || !isStr(r.persuasiva)) errs.push('Respostas curta, consultiva e persuasiva são obrigatórias.');
      for (const k of ['gatilhos', 'etapas', 'servicos', 'objetivos', 'significados', 'descobrir', 'alternativas', 'naoDizer', 'relacionadas']) {
        if (!isArr(data[k])) errs.push(`Campo "${k}" deve ser uma lista.`);
      }
      if (!isObj(data.variacoes)) errs.push('Campo "variacoes" deve ser um objeto.');
      break;
    }
    case 'niche': {
      if (!isStr(data.nome)) errs.push('Campo "nome" obrigatório.');
      if (!isStr(data.categoria)) errs.push('Campo "categoria" obrigatório.');
      for (const k of ['comoClientesChegam', 'dores', 'solucoes', 'argumentos', 'perguntas', 'objecoes', 'conversa', 'cuidados']) {
        if (!isArr(data[k])) errs.push(`Campo "${k}" deve ser uma lista.`);
      }
      if (!isObj(data.angulos)) errs.push('Campo "angulos" deve ser um objeto.');
      break;
    }
    case 'service':
      if (!isStr(data.nome)) errs.push('Campo "nome" obrigatório.');
      if (!['site', 'landing', 'loja', 'sistema', 'recorrente'].includes(data.grupo as string)) errs.push('"grupo" inválido.');
      for (const k of ['entregaveis', 'argumentos', 'objecoes']) if (!isArr(data[k])) errs.push(`Campo "${k}" deve ser uma lista.`);
      break;
    case 'scenario':
      if (!isStr(data.titulo)) errs.push('Campo "titulo" obrigatório.');
      if (!isArr(data.rodadas) || !(data.rodadas as unknown[]).length) errs.push('Informe ao menos uma rodada.');
      if (!isArr(data.dicas)) errs.push('Campo "dicas" deve ser uma lista.');
      break;
    case 'followup':
      if (!isStr(data.nome)) errs.push('Campo "nome" obrigatório.');
      if (!isArr(data.mensagens)) errs.push('Campo "mensagens" deve ser uma lista.');
      if (!isStr(data.encerramento)) errs.push('Campo "encerramento" obrigatório.');
      if (!isArr(data.principios) || !isArr(data.naoFazer)) errs.push('"principios" e "naoFazer" devem ser listas.');
      break;
    case 'prospect':
      if (!isStr(data.nome)) errs.push('Campo "nome" obrigatório.');
      if (!isObj(data.mensagens)) errs.push('Campo "mensagens" deve ser um objeto.');
      break;
    case 'quick':
      if (!isStr(data.titulo) || !isStr(data.texto)) errs.push('Título e texto são obrigatórios.');
      break;
  }
  return errs;
}

export function mergeContent(base: ContentBundle, overrides: ContentOverride[]): { content: ContentBundle; invalid: ContentOverride[] } {
  const invalid: ContentOverride[] = [];
  const out = { ...base } as ContentBundle;
  const byKind = new Map<ContentKind, ContentOverride[]>();
  for (const o of overrides) {
    if (!KIND_TO_KEY[o.kind]) continue;
    if (!o.deleted && validateContent(o.kind, o.data).length) {
      invalid.push(o);
      continue;
    }
    byKind.set(o.kind, [...(byKind.get(o.kind) ?? []), o]);
  }
  for (const [kind, list] of byKind) {
    const key = KIND_TO_KEY[kind];
    const items = [...(out[key] as { id: string }[])];
    for (const o of list) {
      const idx = items.findIndex((i) => i.id === o.id);
      if (o.deleted) {
        if (idx >= 0) items.splice(idx, 1);
      } else if (idx >= 0) items[idx] = o.data as { id: string };
      else items.push(o.data as { id: string });
    }
    (out as unknown as Record<string, unknown>)[key] = items;
  }
  return { content: out, invalid };
}

export function isBaseItem(kind: ContentKind, id: string): boolean {
  return (BASE_CONTENT[KIND_TO_KEY[kind]] as { id: string }[]).some((i) => i.id === id);
}
