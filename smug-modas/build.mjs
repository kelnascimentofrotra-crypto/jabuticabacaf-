// Gera index.html a partir de src/content.mjs e src/components/*.
// Uso: node build.mjs   (sem dependências; Node 18+)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as content from './src/content.mjs';
import { esc } from './src/lib.mjs';
import { header, mobileMenu } from './src/components/header.mjs';
import { hero } from './src/components/hero.mjs';
import { store } from './src/components/store.mjs';
import { categories } from './src/components/categories.mjs';
import { about } from './src/components/about.mjs';
import { contactSection, formMode } from './src/components/contact.mjs';
import { footer } from './src/components/footer.mjs';

const { site, contact } = content;
const abs = (path) => (site.url ? `${site.url}/${path}` : path);

const structuredData = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: site.name,
    description: site.description,
    image: abs(site.shareImage),
  };
  if (site.url) data.url = site.url;
  if (contact.whatsapp.number) data.telephone = `+${contact.whatsapp.number}`;
  if (contact.email.address) data.email = contact.email.address;
  if (contact.address.lines.length) data.address = contact.address.lines.join(', ');
  if (contact.social.instagram) data.sameAs = [contact.social.instagram];
  return JSON.stringify(data).replace(/</g, '\\u003c');
};

const head = () => `
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}">
<meta name="theme-color" content="${site.themeColor}">
${site.url ? `<link rel="canonical" href="${esc(site.url)}/">` : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(site.title)}">
<meta property="og:description" content="${esc(site.description)}">
<meta property="og:image" content="${esc(abs(site.shareImage))}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${site.url ? `<meta property="og:url" content="${esc(site.url)}/">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="preload" href="assets/fonts/playfair-display-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/jost-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/styles.css">
<script>
  // Habilita as animações de entrada e o header em dois estados apenas quando o JS está disponível.
  // Se o main.js não iniciar em 2,5 s, o conteúdo é exibido e o header fica no estado completo.
  (function (d) {
    if (!('IntersectionObserver' in window)) return;
    d.classList.add('js');
    setTimeout(function () {
      if (window.__smugReady) return;
      d.classList.add('reveal-fallback');
      var header = document.querySelector('[data-header]');
      if (header) header.classList.add('is-past-hero');
    }, 2500);
  })(document.documentElement);
</script>
<script type="module" src="assets/js/main.js"></script>
<script type="application/ld+json">${structuredData()}</script>`;

const page = () => `<!doctype html>
<html lang="${site.lang}">
<head>${head()}
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header(content)}
${mobileMenu(content)}
<main id="conteudo" tabindex="-1">
${hero(content)}
${store(content)}
${categories(content)}
${about(content)}
${contactSection(content)}
</main>
${footer(content)}
</body>
</html>
`;

// Pendências que precisam ser resolvidas antes da publicação.
const pending = () => {
  const list = [];
  if (!site.url) list.push('site.url — URL pública (canonical, Open Graph, dados estruturados).');
  if (!contact.whatsapp.number) list.push('contact.whatsapp — número real (o site não gera link sem ele).');
  if (!contact.email.address) list.push('contact.email — e-mail real de atendimento.');
  if (!contact.address.lines.length) list.push('contact.address — endereço real da loja.');
  if (!contact.address.mapsUrl) list.push('contact.address.mapsUrl — link do mapa ("Venha nos visitar" leva ao contato enquanto isso).');
  if (!contact.hours.lines.length) list.push('contact.hours — horário de atendimento confirmado.');
  const mode = formMode(content);
  if (mode !== 'endpoint')
    list.push(`form.endpoint — integração de envio do formulário (modo atual: ${mode}).`);
  for (const b of content.heroBenefits)
    if (!b.confirmed) list.push(`heroBenefits — confirmar condição comercial "${b.title}: ${b.text}".`);
  if (!content.categories.catalogUrl && content.categories.items.every((i) => !i.url))
    list.push('categories.catalogUrl — sem catálogo: os cards levam ao formulário com o interesse preenchido.');
  return list;
};

const out = fileURLToPath(new URL('./index.html', import.meta.url));
writeFileSync(out, page().replace(/\n{3,}/g, '\n\n'));
console.log(`✔ index.html gerado (${out})`);

const todo = pending();
if (todo.length) {
  console.log(`\n⚠ ${todo.length} pendência(s) antes de publicar:`);
  for (const item of todo) console.log(`  • ${item}`);
}
