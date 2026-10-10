// NexaWeb landing page writer (Claude Opus): returns the page content as JSON,
// which the app renders with the NexaWeb template. Runs as a Vercel Edge Function.
// Needs the ANTHROPIC_API_KEY environment variable; ANTHROPIC_MODEL is optional.
import { LANDING_SYSTEM, LANDING_MAX_TOKENS, cleanLandingFields, landingBrief } from '../lib/nexa-ai-prompts.js';

export const config = { runtime: 'edge' };

const hits = new Map();

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  if (!sameOrigin(req)) return json({ error: 'Origem não permitida.' }, 403);
  if (limited(req, 4)) return json({ error: 'Muitas páginas em pouco tempo. Aguarde um minuto.' }, 429);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: 'missing_key', message: 'Configure ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel.' }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'JSON inválido.' }, 400); }
  const f = cleanLandingFields(body);
  if (!f.business || !f.segment) return json({ error: 'Informe o nome do negócio e o segmento.' }, 400);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-5-5',
      max_tokens: LANDING_MAX_TOKENS,
      system: LANDING_SYSTEM,
      messages: [{ role: 'user', content: landingBrief(f) }],
      stream: true,
    }),
  }).catch(() => null);
  if (!upstream) return json({ error: 'Não foi possível falar com a Anthropic agora.' }, 502);
  if (!upstream.ok) return json({ error: await upstreamError(upstream, 'Anthropic') }, 502);

  return streamText(upstream.body, data => {
    const event = JSON.parse(data);
    if (event.type === 'error') throw new Error(event.error?.message || 'Erro da Anthropic');
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') return event.delta.text || '';
    if (event.type === 'message_delta' && event.delta?.stop_reason === 'max_tokens') throw new Error('A resposta ficou grande demais e foi cortada. Gere de novo.');
    return '';
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
