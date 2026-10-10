import type { FollowUpSequence } from '../types';

export interface PlannedMessage {
  dia: number;
  data: string; // ISO yyyy-mm-dd
  objetivo: string;
  texto: string;
  encerramento: boolean;
}

export interface ScheduleOptions {
  /** Quantidade total de mensagens, incluindo a de encerramento. */
  quantidade: number;
  modo: 'sugerido' | 'intervalo';
  intervaloDias: number;
  inicio: string; // yyyy-mm-dd
}

export function maxMessages(seq: FollowUpSequence): number {
  return seq.mensagens.length + 1;
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/**
 * Monta a sequência respeitando a quantidade escolhida: as primeiras
 * mensagens da sequência e, sempre, a mensagem de encerramento no final.
 */
export function schedule(seq: FollowUpSequence, opts: ScheduleOptions): PlannedMessage[] {
  const total = Math.max(1, Math.min(opts.quantidade, maxMessages(seq)));
  const body = seq.mensagens.slice(0, total - 1);
  const out: PlannedMessage[] = [];
  let dia = 0;
  body.forEach((m, i) => {
    dia = opts.modo === 'sugerido' ? m.diaSugerido : i === 0 ? Math.min(m.diaSugerido, opts.intervaloDias) : dia + opts.intervaloDias;
    out.push({ dia, data: addDays(opts.inicio, dia), objetivo: m.objetivo, texto: m.texto, encerramento: false });
  });
  const lastSuggested = seq.mensagens[seq.mensagens.length - 1]?.diaSugerido ?? 0;
  const closeDay =
    opts.modo === 'sugerido'
      ? (body.length ? body[body.length - 1].diaSugerido : 0) + Math.max(5, Math.round(lastSuggested / 2) || 5)
      : (body.length ? dia : 0) + opts.intervaloDias;
  out.push({
    dia: closeDay,
    data: addDays(opts.inicio, closeDay),
    objetivo: 'Encerrar com respeito e deixar a porta aberta',
    texto: seq.encerramento,
    encerramento: true,
  });
  return out;
}

export function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
