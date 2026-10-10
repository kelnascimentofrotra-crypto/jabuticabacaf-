import type { ScenarioRound } from '../types';
import { normalize, stem, tokens } from './normalize';

export interface EvaluationScores {
  clareza: number;
  empatia: number;
  diagnostico: number;
  valor: number;
  conducao: number;
}

export interface Evaluation {
  notas: EvaluationScores;
  /** 0–100 */
  media: number;
  pontosFortes: string[];
  erros: string[];
  alternativa: string;
  justificativa: string;
  modo: 'regras' | 'ia';
}

export const CRITERIA: { key: keyof EvaluationScores; label: string; descricao: string }[] = [
  { key: 'clareza', label: 'Clareza', descricao: 'Mensagem fácil de entender, no tamanho certo para o canal.' },
  { key: 'empatia', label: 'Empatia', descricao: 'Reconhece o ponto de vista do cliente antes de argumentar.' },
  { key: 'diagnostico', label: 'Diagnóstico', descricao: 'Faz perguntas que revelam a necessidade real.' },
  { key: 'valor', label: 'Argumentação de valor', descricao: 'Liga a solução a algo concreto do negócio do cliente.' },
  { key: 'conducao', label: 'Condução comercial', descricao: 'Propõe um próximo passo claro, sem pressão.' },
];

const EMPATHY = [
  'entendo', 'faz sentido', 'compreendo', 'justo', 'imagino', 'concordo', 'boa pergunta', 'otima pergunta', 'que bom', 'obrigad',
  'valido', 'legitim', 'normal', 'verdade', 'com certeza', 'sinto muito', 'tranquilo', 'sem problema', 'respeito', 'claro',
];
const DISMISSIVE = [
  'voce esta errado', 'nao e bem assim', 'voce nao entende', 'amador', 'ultrapassado', 'horrivel', 'qualquer um', 'besteira',
  'bobagem', 'nao sabe o que', 'porcaria', 'lixo',
];
const QUESTION_WORDS = ['como', 'quanto', 'quantos', 'quantas', 'qual', 'quais', 'o que', 'quando', 'onde', 'por que', 'me conta', 'me fala', 'me diz'];
const NEXT_STEP = [
  'posso te mostrar', 'posso mostrar', 'que tal', 'podemos', 'marcar', 'agendar', 'chamada', 'conversa', 'reuniao', 'te mando',
  'te envio', 'proposta', 'exemplo', 'demonstra', 'minutos', 'qual horario', 'qual dia', 'amanha', 'semana', 'combinado',
  'pode ser', 'quer ver', 'quer que eu', 'te retorno', 'visita', 'teste',
];
const PRESSURE = [
  'so hoje', 'ultima chance', 'ultima vaga', 'promocao acaba', 'fecha agora', 'fechar hoje', 'agora ou nunca', 'vai perder',
  'esta perdendo', 'voce perde', 'nao pode perder', 'corre que',
];
const PROMISES = [
  'garanto', 'garantido', 'garantia de venda', '100', 'vai dobrar', 'dobrar suas', 'vai vender mais', 'sem risco', 'certeza que vai',
  'triplicar', 'primeira posicao', 'primeiro lugar no google', 'nunca vai dar problema', 'totalmente seguro',
];
const JARGON = ['api', 'backend', 'frontend', 'deploy', 'framework', 'cms', 'dns', 'ssl', 'stack', 'responsividade', 'ux', 'ui', 'sprint', 'crud'];

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n * 10) / 10));
const countIn = (text: string, list: string[]) => list.filter((w) => text.includes(w)).length;

export function evaluateByRules(resposta: string, round: ScenarioRound): Evaluation {
  const raw = resposta.trim();
  const n = ` ${normalize(raw)} `;
  const words = raw.split(/\s+/).filter(Boolean);
  const wc = words.length;
  const sentenceCount = Math.max(1, (raw.match(/[.!?]+/g) ?? []).length);
  const avgSentence = wc / sentenceCount;
  const questions = (raw.match(/\?/g) ?? []).length;

  const pontosFortes: string[] = [];
  const erros: string[] = [];

  // Clareza
  let clareza = wc < 6 ? 3 : wc < 15 ? 6 : wc <= 90 ? 9 : wc <= 140 ? 7 : 4.5;
  if (avgSentence > 35) clareza -= 2;
  const jargon = JARGON.filter((j) => n.includes(` ${j} `));
  clareza -= Math.min(3, jargon.length);
  if (/!{2,}/.test(raw) || (raw.length > 12 && raw === raw.toUpperCase())) clareza -= 1;
  if (wc > 140) erros.push('Mensagem longa demais para o canal: o cliente tende a não ler tudo. Divida em mensagens curtas ou proponha uma conversa.');
  if (wc < 6) erros.push('Resposta curta demais: não reconhece a objeção nem conduz a conversa.');
  if (jargon.length) erros.push(`Termos técnicos sem explicação (${jargon.join(', ')}). Fale a língua do negócio do cliente.`);
  if (wc >= 15 && wc <= 90 && !jargon.length) pontosFortes.push('Tamanho adequado e linguagem acessível.');

  // Empatia
  const emp = countIn(n, EMPATHY);
  let empatia = emp === 0 ? 3 : 6 + Math.min(4, (emp - 1) * 1.5 + 1);
  const dismissive = countIn(n, DISMISSIVE);
  empatia -= dismissive * 3;
  if (emp > 0) pontosFortes.push('Reconheceu o ponto de vista do cliente antes de argumentar.');
  else erros.push('Faltou reconhecer a preocupação do cliente ("entendo", "faz sentido") antes de responder.');
  if (dismissive) erros.push('Expressões que desqualificam o cliente ou a solução atual dele geram defensividade.');

  // Diagnóstico
  let diagnostico = questions === 0 ? 2 : questions === 1 ? 7 : questions === 2 ? 8.5 : 6;
  if (questions > 0 && countIn(n, QUESTION_WORDS) > 0) diagnostico += 1.5;
  if (questions === 0) erros.push('Nenhuma pergunta: você respondeu sem descobrir o motivo real da objeção.');
  else if (questions >= 3) erros.push('Perguntas demais numa só mensagem: escolha a mais importante.');
  else pontosFortes.push('Fez pergunta para entender melhor a situação.');

  // Valor
  const answerStems = new Set(tokens(raw));
  const valueHits = round.palavrasValor.filter((p) => {
    const pn = normalize(p);
    if (pn.includes(' ')) return n.includes(` ${pn} `) || n.includes(pn);
    return answerStems.has(stem(pn));
  });
  let valor = valueHits.length === 0 ? 2 : valueHits.length === 1 ? 5 : valueHits.length === 2 ? 7 : Math.min(10, 7.5 + valueHits.length * 0.5);
  const promises = PROMISES.filter((p) => (p === '100' ? /100\s?%/.test(raw) : n.includes(p)));
  valor -= promises.length * 4;
  if (valueHits.length >= 2) pontosFortes.push(`Conectou a solução a pontos concretos do cliente (${valueHits.slice(0, 3).join(', ')}).`);
  else erros.push('Argumento pouco ligado ao negócio do cliente. Use detalhes do contexto dele.');
  if (promises.length) erros.push('Promessa de resultado ou segurança absoluta: isso destrói a confiança e você não controla o resultado.');

  // Condução
  const steps = countIn(n, NEXT_STEP);
  // Uma boa pergunta de diagnóstico já mantém a conversa andando; sem pergunta nem próximo passo, a conversa morre.
  let conducao = steps === 0 ? (questions > 0 ? 5.5 : 2.5) : 6.5 + Math.min(3.5, (steps - 1) * 1.2);
  const pressure = countIn(n, PRESSURE);
  conducao -= pressure * 4;
  if (n.includes('desconto') && !/(escopo|fase|etapa|versao|enxut)/.test(n)) {
    conducao -= 2;
    erros.push('Ofereceu desconto sem ajustar escopo: isso ensina o cliente a sempre pedir abatimento.');
  }
  if (steps > 0 && pressure === 0) pontosFortes.push('Propôs um próximo passo claro e sem pressão.');
  if (steps === 0 && questions === 0) erros.push('Faltou um próximo passo (mostrar exemplo, marcar conversa, enviar proposta).');
  else if (steps === 0) erros.push('Quando o cliente mostrar abertura, proponha um próximo passo pequeno (mostrar um exemplo, conversa de 15 minutos).');
  if (pressure) erros.push('Pressão ou urgência artificial afasta o cliente e prejudica sua reputação.');

  const notas: EvaluationScores = {
    clareza: clamp(clareza),
    empatia: clamp(empatia),
    diagnostico: clamp(diagnostico),
    valor: clamp(valor),
    conducao: clamp(conducao),
  };
  const media = Math.round(((notas.clareza + notas.empatia + notas.diagnostico + notas.valor + notas.conducao) / 5) * 10);

  return {
    notas,
    media,
    pontosFortes: pontosFortes.length ? pontosFortes : ['Você respondeu ao cliente — agora refine com as sugestões abaixo.'],
    erros,
    alternativa: round.respostaModelo,
    justificativa: round.porque,
    modo: 'regras',
  };
}
