// NexaWeb AI assistant (ChatGPT). Runs as a Vercel Edge Function.
// Needs the OPENAI_API_KEY environment variable; OPENAI_MODEL is optional.
import { ASSISTANT_SYSTEM, ASSISTANT_MAX_TOKENS } from '../lib/nexa-ai-prompts.js';

export const config = { runtime: 'edge' };


const LIMITS = { messages: 16, chars: 4000 };
const hits = new Map();

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  if (!sameOrigin(req)) return json({ error: 'Origem não permitida.' }, 403);
  if (limited(req, 20)) return json({ error: 'Muitas perguntas em pouco tempo. Aguarde um minuto.' }, 429);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return json({ error: 'missing_key', message: 'Configure OPENAI_API_KEY nas variáveis de ambiente da Vercel.' }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'JSON inválido.' }, 400); }
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-LIMITS.messages)
    .map(m => ({ role: m.role, content: m.content.slice(0, LIMITS.chars) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') return json({ error: 'Envie uma pergunta.' }, 400);

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: ASSISTANT_SYSTEM }, ...messages],
      max_completion_tokens: ASSISTANT_MAX_TOKENS,
      stream: true,
    }),
  }).catch(() => null);
  if (!upstream) return json({ error: 'Não foi possível falar com a OpenAI agora.' }, 502);
  if (!upstream.ok) return json({ error: await upstreamError(upstream, 'OpenAI') }, 502);

  return streamText(upstream.body, data => {
    if (data === '[DONE]') return '';
    const event = JSON.parse(data);
    if (event.error) throw new Error(event.error.message || 'Erro da OpenAI');
    return event.choices?.[0]?.delta?.content || '';
  });
}

// Turns an upstream SSE stream into a plain text stream of the extracted deltas.
function streamText(source, extract) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  const reader = source.getReader();
  const stream = new ReadableStream({
    async pull(controller) {
      try {
        // Keep reading until there is text to send: a pull that enqueues
        // nothing is not called again, which would stall the stream.
        for (;;) {
          const { value, done } = await reader.read();
          if (done) return controller.close();
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();
          let out = '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            out += extract(line.slice(5).trim());
          }
          if (out) return controller.enqueue(encoder.encode(out));
        }
      } catch (error) {
        controller.enqueue(encoder.encode(`\n\n[nexa-error] ${error.message || 'A resposta foi interrompida.'}`));
        controller.close();
        reader.cancel().catch(() => {});
      }
    },
    cancel() { reader.cancel().catch(() => {}); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } });
}

async function upstreamError(res, provider) {
  let detail = '';
  try { const data = await res.json(); detail = data?.error?.message || ''; } catch {}
  if (res.status === 401) return `Chave da ${provider} inválida. Confira a variável de ambiente na Vercel.`;
  if (res.status === 429) return `Limite ou saldo da ${provider} atingido. ${detail}`.trim();
  return `${provider} respondeu com erro ${res.status}. ${detail}`.trim();
}

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

// Best-effort burst limit per IP (per edge instance).
function limited(req, perMinute) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > perMinute;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
