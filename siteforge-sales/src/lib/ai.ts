import { supabase } from './supabase';
import type { EvaluationScores } from './evaluator';

/**
 * Cliente da Edge Function "ai". A chave da IA fica somente no servidor
 * (secret do Supabase); o navegador envia apenas o JWT do usuário logado.
 */

export interface AIStatus {
  configured: boolean;
  model?: string;
  reason?: string;
}

export interface AIGenerated {
  natural: string;
  estrategica: string;
  comercial: string;
  observacao?: string;
}

export interface AIEvaluation {
  notas: EvaluationScores;
  pontosFortes: string[];
  erros: string[];
  alternativa: string;
  justificativa: string;
}

async function invoke<T>(task: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!supabase) throw new Error('IA indisponível no modo local. Configure o Supabase e a Edge Function "ai".');
  const { data, error } = await supabase.functions.invoke('ai', { body: { task, ...payload } });
  if (error) {
    let message = error.message;
    try {
      const ctx = (error as { context?: Response }).context;
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      }
    } catch {
      /* mantém a mensagem original */
    }
    throw new Error(message);
  }
  if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

export async function getAIStatus(): Promise<AIStatus> {
  if (!supabase) return { configured: false, reason: 'Modo local: sem servidor para guardar a chave da IA.' };
  try {
    return await invoke<AIStatus>('status');
  } catch (e) {
    return { configured: false, reason: `Edge Function "ai" não respondeu (${(e as Error).message}).` };
  }
}

export function aiGenerate(payload: {
  nicho?: string;
  servico?: string;
  preco?: string;
  mensagem: string;
  historico?: string;
  objetivo: string;
  tom: string;
  referencia?: string;
}) {
  return invoke<AIGenerated>('generate', payload);
}

export function aiVariant(payload: { tipo: string; texto: string; contexto: string; tom?: string }) {
  return invoke<{ texto: string }>('variant', payload);
}

export function aiRoleplay(payload: { persona: string; contexto: string; objetivo: string; historico: { autor: string; texto: string }[] }) {
  return invoke<{ cliente: string }>('roleplay', payload);
}

export function aiEvaluate(payload: { persona: string; contexto: string; cliente: string; resposta: string; referencia?: string }) {
  return invoke<AIEvaluation>('evaluate', payload);
}
