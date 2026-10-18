// Gera index.html a partir de src/content.json (editável à mão ou pelo painel em admin/).
// Uso: node build.mjs   (sem dependências; Node 18+)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderPage, pendingList } from './src/render.mjs';

const content = JSON.parse(readFileSync(new URL('./src/content.json', import.meta.url), 'utf8'));

const out = fileURLToPath(new URL('./index.html', import.meta.url));
writeFileSync(out, renderPage(content));
console.log(`✔ index.html gerado (${out})`);

const todo = pendingList(content);
if (todo.length) {
  console.log(`\n⚠ ${todo.length} pendência(s) antes de publicar:`);
  for (const item of todo) console.log(`  • ${item.field} — ${item.text}`);
}
