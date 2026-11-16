// /api/upload — recebe uma foto já otimizada pelo painel (WebP/JPEG/PNG) e devolve o endereço público.
import { send, fail, sameOrigin, readBody, handler } from './_lib/http.js';
import { currentAdmin } from './_lib/auth.js';
import { storageReady, putFile } from './_lib/store.js';

const TYPES = {
  'image/webp': { ext: 'webp', check: (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP' },
  'image/jpeg': { ext: 'jpg', check: (b) => b[0] === 0xff && b[1] === 0xd8 },
  'image/png': { ext: 'png', check: (b) => b.subarray(1, 4).toString('latin1') === 'PNG' },
};

const slug = (text) =>
  String(text || 'foto')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'foto';

export default handler(async (req, res) => {
  if (!storageReady()) return fail(res, 503, 'O armazenamento do painel ainda não foi configurado na Vercel.');
  if (req.method !== 'POST') return fail(res, 405, 'Método não permitido.');
  if (!sameOrigin(req)) return fail(res, 403, 'Origem não permitida.');
  if (!(await currentAdmin(req))) return fail(res, 401, 'Sua sessão expirou. Entre de novo.');

  const body = await readBody(req, 4.4 * 1024 * 1024);
  const match = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.dataUrl || ''));
  if (!match) return fail(res, 400, 'Envie uma foto em WebP, JPEG ou PNG.');
  const type = TYPES[match[1]];
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > 3 * 1024 * 1024) return fail(res, 413, 'A foto precisa ter até 3 MB.');
  if (!type.check(buffer)) return fail(res, 400, 'O arquivo não é uma imagem válida.');

  const folder = ['posts', 'produtos', 'categorias'].includes(body.folder) ? body.folder : 'outros';
  const { url } = await putFile(`uploads/${folder}/${slug(body.name)}.${type.ext}`, buffer, match[1]);
  return send(res, 200, { url });
});
