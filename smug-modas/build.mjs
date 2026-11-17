// Gera index.html, 404.html, robots.txt e sitemap.xml a partir de src/content.json e monta
// public/ — só os arquivos que o navegador usa (site, painel e o render compartilhado),
// sem o código do servidor (api/).
// Uso: node build.mjs   (sem dependências; Node 20+)
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { renderPage, pendingList, BOOT_SCRIPT } from './src/render.mjs';
import { esc, logo } from './src/lib.mjs';

const content = JSON.parse(readFileSync(new URL('./src/content.json', import.meta.url), 'utf8'));
const here = (path) => fileURLToPath(new URL(`./${path}`, import.meta.url));
const { site } = content;

// Política de segurança (CSP): o único script embutido na página é liberado pelo hash dele.
// Em computador local o build atualiza o vercel.json; na Vercel, um hash desatualizado para o build.
const bootHash = `'sha256-${createHash('sha256').update(BOOT_SCRIPT).digest('base64')}'`;
const vercel = JSON.parse(readFileSync(here('vercel.json'), 'utf8'));
const cspHeader = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy');
if (!cspHeader.value.includes(bootHash)) {
  if (process.env.VERCEL) throw new Error(`vercel.json: o hash do script do <head> mudou. Rode "npm run build" no computador e publique de novo (${bootHash}).`);
  cspHeader.value = cspHeader.value.replace(/script-src 'self'( 'sha256-[^']+')?/, `script-src 'self' ${bootHash}`);
  writeFileSync(here('vercel.json'), `${JSON.stringify(vercel, null, 2)}\n`);
  console.log(`✔ vercel.json: hash do script do <head> atualizado (${bootHash})`);
}

writeFileSync(here('index.html'), renderPage(content));
console.log(`✔ index.html gerado (${here('index.html')})`);

// Página 404: mesma identidade do site, com caminho de volta para o início
const page404 = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>Página não encontrada — ${esc(site.name)}</title>
<meta name="description" content="Esta página não existe ou mudou de endereço. Volte para o início do site da ${esc(site.name)}.">
<meta name="theme-color" content="${esc(site.themeColor)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<style>
@font-face { font-family: 'Playfair Display'; font-display: swap; font-weight: 400 900; src: url('/assets/fonts/playfair-display-latin-wght-normal.woff2') format('woff2'); }
@font-face { font-family: 'Jost'; font-display: swap; font-weight: 100 900; src: url('/assets/fonts/jost-latin-wght-normal.woff2') format('woff2'); }
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 32px 20px; background: radial-gradient(60% 50% at 80% 10%, rgba(255, 226, 168, 0.5), transparent 70%), #efe3d2; color: #2e1d16; font: 17px/1.6 Jost, system-ui, sans-serif; text-align: center; }
main { max-width: 520px; display: grid; justify-items: center; gap: 18px; }
.logo { display: inline-flex; align-items: center; gap: 14px; color: #9c7240; text-decoration: none; }
.logo__mark { font-family: 'Playfair Display', serif; font-size: 2.6rem; line-height: 1; }
.logo__mark::before { content: none; }
.logo__rule { width: 1px; height: 36px; background: currentColor; opacity: 0.6; }
.logo__type { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.logo__name { font-family: 'Playfair Display', serif; font-size: 1.5rem; letter-spacing: 0.08em; }
.logo__sub { margin-top: 5px; font-size: 0.55rem; letter-spacing: 0.62em; margin-right: -0.62em; }
.code { margin: 8px 0 0; font-family: 'Playfair Display', serif; font-size: clamp(5rem, 22vw, 9rem); line-height: 1; color: #641c29; }
h1 { margin: 0; font-family: 'Playfair Display', serif; font-weight: 400; font-size: clamp(1.8rem, 6vw, 2.4rem); color: #641c29; }
p { margin: 0; color: #57443a; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 52px; padding: 0 28px; border-radius: 6px; background: #641c29; color: #faf2e7; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.26em; text-transform: uppercase; text-decoration: none; }
.btn:hover { background: #4b1320; }
:focus-visible { outline: 2px solid #641c29; outline-offset: 3px; }
</style>
</head>
<body>
<main>
  ${logo({ href: '/' })}
  <p class="code" aria-hidden="true">404</p>
  <h1>Página não encontrada</h1>
  <p>Este endereço não existe ou mudou. Que tal voltar para o início e ver as novidades da loja?</p>
  <a class="btn" href="/">Voltar ao início</a>
</main>
</body>
</html>
`;
writeFileSync(here('404.html'), page404);

// robots.txt e sitemap.xml (o painel e a API ficam de fora das buscas)
const base = site.url ? site.url.replace(/\/+$/, '') : '';
writeFileSync(here('robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n${base ? `\nSitemap: ${base}/sitemap.xml\n` : ''}`);
if (base) {
  const lastmod = new Date().toISOString().slice(0, 10);
  writeFileSync(
    here('sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${esc(base)}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
  );
}
console.log(`✔ 404.html, robots.txt${base ? ' e sitemap.xml' : ''} gerados`);

// Saída publicada pela Vercel (vercel.json → outputDirectory: "public")
const pub = (path) => fileURLToPath(new URL(`./public/${path}`, import.meta.url));
rmSync(pub(''), { recursive: true, force: true });
mkdirSync(pub('src'), { recursive: true });
const files = ['index.html', '404.html', 'robots.txt', 'favicon.ico', 'assets', 'admin', 'src/components', 'src/lib.mjs', 'src/render.mjs', 'src/content.json'];
if (base) files.push('sitemap.xml');
for (const path of files) cpSync(here(path), pub(path), { recursive: true });
console.log('✔ public/ montado (site + painel)');

const todo = pendingList(content);
if (todo.length) {
  console.log(`\n⚠ ${todo.length} pendência(s) antes de publicar:`);
  for (const item of todo) console.log(`  • ${item.field} — ${item.text}`);
}
