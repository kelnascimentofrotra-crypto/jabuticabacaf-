// Edge Function "ai" — geração de respostas, variações, simulação e avaliação.
// A chave da Anthropic fica apenas aqui, como secret: `supabase secrets set ANTHROPIC_API_KEY=...`.
import Anthropic from 'npm:@anthropic-ai/sdk@0.128.0';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { buildUserMessage, InputError, normalizeEvaluation, SCHEMAS, SYSTEM_PROMPT, TASKS, type Task } from './prompts.ts';

const MODEL = Deno.env.get('AI_MODEL') ?? 'claude-opus-5-5';
const EFFORT = (Deno.env.get('AI_EFFORT') ?? 'medium') as 'low' | 'medium' | 'high' | 'xhigh' | 'max';
const DAILY_LIMIT = Number(Deno.env.get('AI_DAILY_LIMIT') ?? '200');
const API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

const anthropic = API_KEY ? new Anthropic({ apiKey: API_KEY }) : null;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  // Usuário autenticado (o gateway do Supabase já valida o JWT; aqui obtemos o id).
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: 'Sessão inválida. Entre novamente.' }, 401);
  const userId = userData.user.id;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Corpo da requisição inválido.' }, 400);
  }

  const task = body.task as string;
  if (task === 'status') {
    return json({ configured: Boolean(anthropic), model: anthropic ? MODEL : undefined, reason: anthropic ? undefined : 'Secret ANTHROPIC_API_KEY não definido na Edge Function.' });
  }
  if (!TASKS.includes(task as Task)) return json({ error: 'Tarefa desconhecida.' }, 400);
  if (!anthropic) return json({ error: 'IA não configurada no servidor.' }, 503);

  let userMessage: string;
  try {
    userMessage = buildUserMessage(task as Task, body);
  } catch (e) {
    if (e instanceof InputError) return json({ error: e.message }, 400);
    throw e;
  }

  // Limite diário por usuário (conta tentativas das últimas 24 horas).
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count, error: countError } = await admin
    .from('usage_events')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('event', 'ai_request')
    .gte('created_at', since);
  if (countError) return json({ error: 'Não foi possível verificar o limite de uso.' }, 500);
  if ((count ?? 0) >= DAILY_LIMIT) {
    return json({ error: `Limite diário de ${DAILY_LIMIT} usos da IA atingido. Use a biblioteca ou tente amanhã.` }, 429);
  }
  await admin.from('usage_events').insert({ user_id: userId, event: 'ai_request', item_kind: task });

  try {
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      output_config: {
        effort: EFFORT,
        format: { type: 'json_schema', schema: SCHEMAS[task as Task] },
      },
      messages: [{ role: 'user', content: userMessage }],
    });

    if (response.stop_reason === 'refusal') {
      return json({ error: 'A IA não respondeu a este pedido. Reformule a mensagem ou use a biblioteca.' }, 422);
    }
    if (response.stop_reason === 'max_tokens') {
      return json({ error: 'A resposta da IA ficou incompleta. Tente novamente.' }, 502);
    }

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('');
    const parsed = JSON.parse(text) as Record<string, unknown>;
    return json(task === 'evaluate' ? normalizeEvaluation(parsed) : parsed);
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: 'A IA está com muitas solicitações agora. Tente em instantes.' }, 429);
    if (e instanceof Anthropic.AuthenticationError) return json({ error: 'Chave da IA inválida no servidor.' }, 500);
    if (e instanceof Anthropic.APIError) return json({ error: `Erro da IA (${e.status ?? 'sem status'}).` }, 502);
    if (e instanceof SyntaxError) return json({ error: 'A IA retornou um formato inesperado. Tente novamente.' }, 502);
    console.error(e);
    return json({ error: 'Erro inesperado na função de IA.' }, 500);
  }
}

Deno.serve(handler);
