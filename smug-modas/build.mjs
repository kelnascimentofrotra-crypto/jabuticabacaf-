// Gera index.html a partir de src/content.json e monta public/ — só os arquivos que o
// navegador usa (site, painel e o render compartilhado), sem o código do servidor (api/).
// Uso: node build.mjs   (sem dependências; Node 20+)
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderPage, pendingList } from './src/render.mjs';

const content = JSON.parse(readFileSync(new URL('./src/content.json', import.meta.url), 'utf8'));

const out = fileURLToPath(new URL('./index.html', import.meta.url));
writeFileSync(out, renderPage(content));
console.log(`✔ index.html gerado (${out})`);

// Saída publicada pela Vercel (vercel.json → outputDirectory: "public")
const pub = (path) => fileURLToPath(new URL(`./public/${path}`, import.meta.url));
const here = (path) => fileURLToPath(new URL(`./${path}`, import.meta.url));
rmSync(pub(''), { recursive: true, force: true });
mkdirSync(pub('src'), { recursive: true });
for (const path of ['index.html', 'assets', 'admin', 'src/components', 'src/lib.mjs', 'src/render.mjs', 'src/content.json']) {
  cpSync(here(path), pub(path), { recursive: true });
}
console.log('✔ public/ montado (site + painel)');

const todo = pendingList(content);
if (todo.length) {
  console.log(`\n⚠ ${todo.length} pendência(s) antes de publicar:`);
  for (const item of todo) console.log(`  • ${item.field} — ${item.text}`);
}
