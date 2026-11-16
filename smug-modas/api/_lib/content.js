// Conteúdo do site publicado pelo painel. O arquivo fica público (o site o lê ao abrir);
// sem nenhuma publicação ainda, vale o src/content.json que veio no deploy.
import { promises as fs } from 'node:fs';
import { readJson, writeJson } from './store.js';

export const CONTENT_PATH = 'site/content.json';

let bundledCache;
export async function bundledContent() {
  if (!bundledCache) {
    // relativo a este arquivo: na Vercel a função roda em /var/task e o projeto fica numa subpasta
    bundledCache = JSON.parse(await fs.readFile(new URL('../../src/content.json', import.meta.url), 'utf8'));
  }
  return structuredClone(bundledCache);
}

// → { content, etag } (etag null quando ainda não houve publicação)
export async function currentContent() {
  const stored = await readJson(CONTENT_PATH);
  if (stored) return { content: stored.data, etag: stored.etag };
  return { content: await bundledContent(), etag: null };
}

export const saveContent = (content, etag) => writeJson(CONTENT_PATH, content, { etag, cacheSeconds: 60 });

/* ---------- Validação ---------- */
const SECTIONS = ['site', 'contact', 'form', 'heroBenefits', 'nav', 'headerActions', 'hero', 'marquee', 'products', 'posts', 'store', 'categories', 'about', 'contactSection', 'footer'];
const LINK_KEYS = new Set(['url', 'mapsUrl', 'instagram', 'endpoint', 'catalogUrl', 'src', 'shareImage']);
const SAFE_LINK = /^(https?:\/\/|assets\/|\/_local-blob\/|#)/i;

export function validateContent(content) {
  const errors = [];
  if (!content || typeof content !== 'object' || Array.isArray(content)) return ['Conteúdo inválido.'];
  for (const key of SECTIONS) if (!(key in content)) errors.push(`Falta a seção "${key}".`);
  for (const [section, max] of [['products', 300], ['posts', 300]]) {
    const items = content[section]?.items;
    if (!Array.isArray(items)) errors.push(`A lista de ${section} é inválida.`);
    else if (items.length > max) errors.push(`Limite de ${max} itens em ${section}.`);
  }
  if (!Array.isArray(content.categories?.items)) errors.push('A lista de categorias é inválida.');

  const walk = (value, key, trail) => {
    if (errors.length > 20) return;
    if (typeof value === 'string') {
      if (value.length > 20000) errors.push(`Texto longo demais em ${trail}.`);
      if (LINK_KEYS.has(key) && value && !SAFE_LINK.test(value)) errors.push(`Link inválido em ${trail}: use um endereço que comece com https://`);
    } else if (Array.isArray(value)) value.forEach((item, i) => walk(item, key, `${trail}[${i}]`));
    else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, k, trail ? `${trail}.${k}` : k);
  };
  // "live" é definido pelo servidor a cada publicação: não vem do painel
  for (const [key, value] of Object.entries(content)) if (key !== 'live') walk(value, key, key);
  return errors;
}
