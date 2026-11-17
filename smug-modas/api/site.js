// /api/site (servido como /conteudo.json) — conteúdo publicado que o site lê ao abrir.
// Sem nenhuma publicação ainda, devolve o conteúdo original do deploy (nunca 404).
// A Vercel guarda a resposta por alguns segundos (s-maxage): poucas chamadas, site sempre rápido.
import { send, fail, handler } from './_lib/http.js';
import { storageReady } from './_lib/store.js';
import { currentContent } from './_lib/content.js';

export default handler(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return fail(res, 405, 'Método não permitido.');
  if (!storageReady()) return fail(res, 503, 'Armazenamento não configurado.');
  const { content } = await currentContent();
  return send(res, 200, content, { 'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=60' });
});
