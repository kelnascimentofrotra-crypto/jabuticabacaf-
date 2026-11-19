/**
 * Gera dist-standalone/fv-construcoes.html: um único arquivo com CSS, JS, fonte e imagens
 * embutidos (abre direto no navegador, sem servidor). Requer `npm run build` antes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');
const outDir = path.join(root, 'dist-standalone');
const pub = (p) => path.join(root, 'public', p);
const dataUri = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;

// Uma largura por imagem, suficiente para telas comuns, mantendo o arquivo leve.
const pick = {
  'hero-industrial': 1080,
  fachada: 1280,
  'fachada-panorama': 1200,
  'produto-eletricas': 716,
  'produto-bombas': 648,
  'produto-jardinagem': 696,
  'produto-maquinas': 756,
  'produto-acessorios': 744,
};
const images = Object.fromEntries(
  Object.entries(pick).map(([name, w]) => [name, dataUri(pub(`img/${name}-${w}.webp`), 'image/webp')])
);
images['logo-fv'] = dataUri(pub('img/logo-fv.webp'), 'image/webp');

// Renderiza o HTML já com as imagens embutidas (igual ao que o cliente vai hidratar).
execSync('npx vite build --ssr src/entry-server.jsx --outDir .ssr', { cwd: root, stdio: 'ignore' });
globalThis.__FV_IMG__ = images;
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const appHtml = render();
fs.rmSync(ssrDir, { recursive: true, force: true });

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const assets = path.join(dist, 'assets');
const cssFile = fs.readdirSync(assets).find((f) => f.endsWith('.css'));
const jsFile = fs.readdirSync(assets).find((f) => f.endsWith('.js'));
const css = fs.readFileSync(path.join(assets, cssFile), 'utf8');
const js = fs.readFileSync(path.join(assets, jsFile), 'utf8').replace(/<\/script/gi, '<\\/script');

const start = html.indexOf('<div id="root">');
const end = html.lastIndexOf('</body>');
html = `${html.slice(0, start)}<div id="root">${appHtml}</div>\n    <script>window.__FV_IMG__=${JSON.stringify(images)}</script>\n    <script type="module">${js}</script>\n  ${html.slice(end)}`;

html = html
  .replace(/\s*<script type="module" crossorigin src="[^"]+"><\/script>/, '')
  .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, `<style>${css}</style>`)
  .replace(/\s*<link\s+rel="preload"[\s\S]*?\/>/g, '')
  .replace(/\s*<link rel="manifest"[^>]*>/, '')
  .replace(/url\(['"]?fonts\/archivo-variable-latin\.woff2['"]?\)/g, `url('${dataUri(pub('fonts/archivo-variable-latin.woff2'), 'font/woff2')}')`)
  .replace(/href="favicon\.png"/, `href="${dataUri(pub('favicon.png'), 'image/png')}"`)
  .replace(/\s*<link rel="icon" type="image\/png" sizes="32x32"[^>]*>/, '')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '');

fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'fv-construcoes.html');
fs.writeFileSync(out, html);
console.log(`Arquivo único gerado: ${path.relative(root, out)} (${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
