// Teste de integração da Edge Function com Supabase e Anthropic simulados.
// Rode: deno test --allow-net --allow-env --allow-read supabase/functions/ai/index.test.ts
import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1.0.13';

type Captured = { headers: Headers; body: Record<string, unknown> };

const state = {
  aiCount: 0,
  inserts: 0,
  reply: 'ok' as 'ok' | 'refusal' | 'evaluate',
  lastAnthropic: null as Captured | null,
};

const mock = Deno.serve({ port: 0, onListen() {} }, async (req) => {
  const url = new URL(req.url);
  if (url.pathname === '/auth/v1/user') {
    const auth = req.headers.get('Authorization') ?? '';
    if (auth !== 'Bearer token-valido') return Response.json({ msg: 'invalid JWT' }, { status: 401 });
    return Response.json({ id: 'user-1', email: 'vendedor@exemplo.com', aud: 'authenticated', role: 'authenticated' });
  }
  if (url.pathname === '/rest/v1/usage_events') {
    if (req.method === 'HEAD' || req.method === 'GET') {
      return new Response(null, { status: 200, headers: { 'Content-Range': `*/${state.aiCount}` } });
    }
    state.inserts++;
    return new Response(null, { status: 201 });
  }
  if (url.pathname === '/v1/messages') {
    state.lastAnthropic = { headers: req.headers, body: await req.json() };
    const base = { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', stop_sequence: null, usage: { input_tokens: 10, output_tokens: 20 } };
    if (state.reply === 'refusal') {
      return Response.json({ ...base, content: [], stop_reason: 'refusal', stop_details: { type: 'refusal', category: null, explanation: null } });
    }
    const payload =
      state.reply === 'evaluate'
        ? { notas: { clareza: 12, empatia: 7.25, diagnostico: -1, valor: 8, conducao: 9 }, pontosFortes: ['Boa pergunta'], erros: [], alternativa: 'Alt', justificativa: 'Porque' }
        : { natural: 'Resposta natural', estrategica: 'Resposta estratégica?', comercial: 'Resposta comercial.', observacao: 'Dica' };
    return Response.json({
      ...base,
      content: [
        { type: 'thinking', thinking: '', signature: 'sig' },
        { type: 'text', text: JSON.stringify(payload) },
      ],
      stop_reason: 'end_turn',
    });
  }
  return new Response('not found', { status: 404 });
});

const base = `http://localhost:${(mock.addr as Deno.NetAddr).port}`;
Deno.env.set('SUPABASE_URL', base);
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service-role-teste');
Deno.env.set('ANTHROPIC_API_KEY', 'sk-ant-teste');
Deno.env.set('ANTHROPIC_BASE_URL', base);
Deno.env.set('AI_DAILY_LIMIT', '5');

const { handler } = await import('./index.ts');

function call(body: unknown, token = 'token-valido') {
  return handler(
    new Request('http://localhost/ai', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
}

const opts = { sanitizeOps: false, sanitizeResources: false };

Deno.test({ name: 'status informa IA configurada e modelo', ...opts, async fn() {
  const res = await call({ task: 'status' });
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { configured: true, model: 'claude-opus-5-5' });
} });

Deno.test({ name: 'rejeita sessão inválida', ...opts, async fn() {
  const res = await call({ task: 'status' }, 'token-errado');
  assertEquals(res.status, 401);
} });

Deno.test({ name: 'generate envia pedido correto e devolve as três respostas', ...opts, async fn() {
  state.reply = 'ok';
  state.aiCount = 0;
  const before = state.inserts;
  const res = await call({ task: 'generate', mensagem: 'Achei caro', nicho: 'Barbearias', objetivo: 'Conseguir uma reunião', tom: 'Profissional' });
  assertEquals(res.status, 200);
  const data = await res.json();
  assertEquals(data.natural, 'Resposta natural');
  assertEquals(data.comercial, 'Resposta comercial.');
  assertEquals(state.inserts, before + 1, 'registra o uso da IA');

  const sent = state.lastAnthropic!;
  assertEquals(sent.headers.get('x-api-key'), 'sk-ant-teste');
  assertStringIncludes(sent.headers.get('anthropic-beta') ?? '', 'server-side-fallback-2026-07-01');
  assertEquals(sent.body.model, 'claude-opus-5-5');
  assertEquals(sent.body.fallbacks, 'default');
  const oc = sent.body.output_config as { effort: string; format: { type: string; schema: { required: string[] } } };
  assertEquals(oc.effort, 'medium');
  assertEquals(oc.format.type, 'json_schema');
  assertEquals(oc.format.schema.required, ['natural', 'estrategica', 'comercial', 'observacao']);
  const msg = (sent.body.messages as { content: string }[])[0].content;
  assertStringIncludes(msg, '<dados>');
  assertStringIncludes(msg, 'Achei caro');
  assertStringIncludes(msg, 'Barbearias');
  assert(typeof sent.body.system === 'string' && (sent.body.system as string).includes('Não prometa resultados'));
} });

Deno.test({ name: 'valida entrada obrigatória', ...opts, async fn() {
  const res = await call({ task: 'generate', mensagem: '   ' });
  assertEquals(res.status, 400);
} });

Deno.test({ name: 'tarefa desconhecida é rejeitada', ...opts, async fn() {
  const res = await call({ task: 'apagar-tudo' });
  assertEquals(res.status, 400);
} });

Deno.test({ name: 'limite diário devolve 429 sem chamar a IA', ...opts, async fn() {
  state.aiCount = 5;
  state.lastAnthropic = null;
  const res = await call({ task: 'variant', texto: 'Oi' });
  assertEquals(res.status, 429);
  assertEquals(state.lastAnthropic, null);
  state.aiCount = 0;
} });

Deno.test({ name: 'recusa do modelo vira erro amigável', ...opts, async fn() {
  state.reply = 'refusal';
  const res = await call({ task: 'variant', texto: 'Oi, tudo bem?' });
  assertEquals(res.status, 422);
  assertStringIncludes((await res.json()).error, 'biblioteca');
  state.reply = 'ok';
} });

Deno.test({ name: 'avaliação tem notas limitadas entre 0 e 10', ...opts, async fn() {
  state.reply = 'evaluate';
  const res = await call({ task: 'evaluate', resposta: 'Entendo! Posso te mostrar um exemplo?', cliente: 'Já tenho Instagram' });
  assertEquals(res.status, 200);
  const data = await res.json();
  assertEquals(data.notas.clareza, 10);
  assertEquals(data.notas.diagnostico, 0);
  assertEquals(data.notas.empatia, 7.3);
  state.reply = 'ok';
} });

Deno.test({ name: 'roleplay exige histórico', ...opts, async fn() {
  const res = await call({ task: 'roleplay', historico: [] });
  assertEquals(res.status, 400);
} });

Deno.test({ name: 'preflight CORS', ...opts, async fn() {
  const res = await handler(new Request('http://localhost/ai', { method: 'OPTIONS' }));
  assertEquals(res.status, 200);
  assertStringIncludes(res.headers.get('Access-Control-Allow-Headers') ?? '', 'authorization');
  await res.body?.cancel();
} });
