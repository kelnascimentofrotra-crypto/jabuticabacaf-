// Gera ../index.html: um único arquivo com CSS (Tailwind compilado), fonte e imagens embutidos.
// Uso: node build.mjs   (precisa do tailwindcss 3: TAILWIND=/caminho/para/tailwindcss ou npx)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), 'gse-'));
const cssOut = join(tmp, 'out.css');
const tw = process.env.TAILWIND;
const args = ['-c', join(dir, 'tailwind.config.js'), '-i', join(dir, 'estilo.css'), '-o', cssOut, '--minify'];
if (tw) execFileSync(tw, args, { stdio: 'inherit' });
else execFileSync('npx', ['--yes', 'tailwindcss@3.4.17', ...args], { stdio: 'inherit' });

const b64 = (file, mime) => `data:${mime};base64,${readFileSync(join(dir, file)).toString('base64')}`;
const favicon = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="12 0 104 104"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f78e6"/><stop offset="1" stop-color="#1546a8"/></linearGradient><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd84f"/><stop offset="1" stop-color="#f6a80c"/></linearGradient><clipPath id="c"><path d="M81.11 86.43A38 38 0 1 1 42.16 25.29Z"/></clipPath></defs><g transform="translate(2.7 -1.72)" fill="url(#s)"><path d="M41.89 20.21L43.65 2.58L50.2 19.04ZM55.72 19.16L61.08 7.75L62.42 20.28ZM67.69 21.97L79.24 8.54L75.16 25.77ZM79.62 29.05L90.55 22.77L84.47 33.81ZM87.82 38.21L104.98 33.83L91.75 45.61ZM93.53 50.85L106.08 51.98L94.77 57.53ZM94.99 63.05L111.55 69.31L93.97 71.38ZM92.41 76.69L102.05 84.81L89.6 82.87ZM86.61 87.52L96.59 102.15L81 93.75Z"/><path d="M42.16 25.29A38 38 0 0 1 81.11 86.43Z"/></g><path d="M81.11 86.43A38 38 0 1 1 42.16 25.29Z" fill="url(#b)"/><g clip-path="url(#c)" fill="none" stroke="#0c2350" stroke-width="2.8" stroke-linecap="round"><path transform="rotate(24 52 62)" d="M52 24A15 38 0 0 1 52 100M52 24A15 38 0 0 0 52 100M52 24A30 38 0 0 1 52 100M52 24A30 38 0 0 0 52 100M52 24V100M19.09 43A32.91 9.87 0 0 0 84.91 43M14 62A38 11.4 0 0 0 90 62M19.09 81A32.91 9.87 0 0 0 84.91 81"/></g></svg>`);

let css = readFileSync(cssOut, 'utf8')
  .replace('__FONT__', b64('fonts/red-hat-display-latin.woff2', 'font/woff2'))
  .replace('__BG__', b64('img/hero-fundo.jpg', 'image/jpeg'));
const mime = (f) => f.endsWith('.webp') ? 'image/webp' : f.endsWith('.png') ? 'image/png' : f.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg';
const inlineImgs = (t) => t.replace(/__IMG:([\w.-]+)__/g, (_, f) => b64('img/' + f, mime(f)));
css = inlineImgs(css);
const html = inlineImgs(readFileSync(join(dir, 'index.html'), 'utf8'))
  .replace('__CSS__', () => css)
  .replace('__THUMB__', () => b64('img/card-placas.jpg', 'image/jpeg'))
  .replace('__FAVICON__', () => favicon);
writeFileSync(join(dir, '..', 'index.html'), html);
console.log('ok:', (html.length / 1024).toFixed(0) + ' KB');
