// /api/content — GET: conteúdo atual do site (público). PUT: publica (só com login).
// Publicação com controle de versão: se outro aparelho publicou antes, devolve 409.
import { send, fail, sameOrigin, readBody, handler } from './_lib/http.js';
import { currentAdmin } from './_lib/auth.js';
import { storageReady, ConflictError } from './_lib/store.js';
import { currentContent, bundledContent, saveContent, validateContent } from './_lib/content.js';

export default handler(async (req, res) => {
  if (!storageReady()) return fail(res, 503, 'O armazenamento do painel ainda não foi configurado na Vercel.');

  if (req.method === 'GET') {
    const { content } = await currentContent();
    return send(res, 200, { content, version: content.updatedAt || '' });
  }
  if (req.method !== 'PUT') return fail(res, 405, 'Método não permitido.');
  if (!sameOrigin(req)) return fail(res, 403, 'Origem não permitida.');
  if (!(await currentAdmin(req))) return fail(res, 401, 'Sua sessão expirou. Entre de novo.');

  const body = await readBody(req, 2 * 1024 * 1024);
  const errors = validateContent(body.content);
  if (errors.length) return fail(res, 400, errors[0], { errors });

  const { content: current, etag } = await currentContent();
  const currentVersion = current.updatedAt || '';
  if ((body.baseVersion || '') !== currentVersion) {
    return fail(res, 409, 'O site foi atualizado em outro aparelho. Recarregue para ver a versão mais nova.', { version: currentVersion });
  }

  const next = { ...body.content, live: (await bundledContent()).live, updatedAt: new Date().toISOString() };
  try {
    await saveContent(next, etag);
  } catch (error) {
    if (error instanceof ConflictError) return fail(res, 409, 'O site foi atualizado em outro aparelho. Recarregue e tente de novo.');
    throw error;
  }
  return send(res, 200, { version: next.updatedAt });
});
