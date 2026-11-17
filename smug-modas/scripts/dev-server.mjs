// Servidor local para testar o site, o painel e a API sem a Vercel.
// Uso: npm run dev  (abre em http://localhost:3000; painel em /admin/)
// Os dados ficam em .local-blob/ (ignorado pelo Git). Código de ativação: SMUG-TESTE.
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
process.env.SMUG_LOCAL_BLOB_DIR ||= path.join(ROOT, '.local-blob');
process.env.SMUG_SESSION_SECRET ||= 'segredo-local-de-teste';
process.env.ADMIN_SETUP_CODE ||= 'SMUG-TESTE';
delete process.env.BLOB_READ_WRITE_TOKEN;
const PORT = Number(process.env.PORT || 3000);

// Mesmos cabeçalhos de segurança da Vercel (vercel.json), menos os que só valem em HTTPS
const vercel = JSON.parse(await fs.readFile(path.join(ROOT, 'vercel.json'), 'utf8'));
const SECURITY = Object.fromEntries(
  (vercel.headers.find((h) => h.source === '/(.*)')?.headers || [])
    .filter((h) => h.key !== 'Strict-Transport-Security')
    .map((h) => [h.key, h.key === 'Content-Security-Policy' ? h.value.replace(/;\s*upgrade-insecure-requests/, '') : h.value])
);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

async function serveFile(res, file) {
  try {
    const stat = await fs.stat(file);
    if (stat.isDirectory()) return serveFile(res, path.join(file, 'index.html'));
    let data = await fs.readFile(file);
    res.writeHead(200, { ...SECURITY, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    // Como na Vercel: endereço inexistente mostra a página 404 do site
    const page = await fs.readFile(path.join(ROOT, '404.html')).catch(() => 'Não encontrado');
    res.writeHead(404, { ...SECURITY, 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/conteudo.json') pathname = '/api/site'; // mesma regra do vercel.json

  if (pathname.startsWith('/api/')) {
    const name = pathname.slice(5).replace(/[^\w-]/g, '');
    try {
      const { default: fn } = await import(path.join(ROOT, 'api', `${name}.js`));
      if (/json/.test(req.headers['content-type'] || '')) {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const text = Buffer.concat(chunks).toString('utf8');
        req.body = text ? JSON.parse(text) : {};
      }
      return await fn(req, res);
    } catch (error) {
      console.error(error);
      res.writeHead(error.code === 'ERR_MODULE_NOT_FOUND' ? 404 : 500);
      return res.end();
    }
  }
  if (pathname.startsWith('/_local-blob/')) {
    return serveFile(res, path.join(process.env.SMUG_LOCAL_BLOB_DIR, pathname.slice('/_local-blob/'.length).replace(/\.\.+/g, '')));
  }
  const file = path.join(ROOT, pathname.replace(/\.\.+/g, ''));
  if (!file.startsWith(ROOT) || /node_modules|\.local-blob/.test(file)) {
    res.writeHead(404);
    return res.end();
  }
  return serveFile(res, file);
});

server.listen(PORT, '127.0.0.1', () => console.log(`SMUG MODAS em http://localhost:${PORT} (painel: /admin/, código de ativação: ${process.env.ADMIN_SETUP_CODE})`));
