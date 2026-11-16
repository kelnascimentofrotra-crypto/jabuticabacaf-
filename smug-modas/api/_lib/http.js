// Respostas JSON e utilitários de requisição (funcionam na Vercel e no servidor local).

export function send(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(data));
}

export const fail = (res, status, message, extra = {}) => send(res, status, { error: message, ...extra });

// Escritas só aceitam pedidos vindos do próprio site (proteção contra CSRF).
export function sameOrigin(req) {
  try {
    return new URL(req.headers.origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export async function readBody(req, limit = 6 * 1024 * 1024) {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('too large'), { status: 413 });
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

export const clientIp = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

// Envolve o handler: erros inesperados viram 500 com mensagem amigável (detalhes só no log).
export const handler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (error instanceof SyntaxError) return fail(res, 400, 'Dados inválidos.');
    if (error.status === 413) return fail(res, 413, 'Arquivo grande demais.');
    console.error(error);
    return fail(res, 500, 'Erro no servidor. Tente de novo em instantes.');
  }
};
