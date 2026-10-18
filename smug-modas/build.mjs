// Gera index.html a partir de src/content.mjs e src/components/*.
// Uso: node build.mjs   (sem dependências; Node 18+)
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as siteContent from './src/content.mjs';
import { esc } from './src/lib.mjs';
import { header, mobileMenu } from './src/components/header.mjs';
import { hero } from './src/components/hero.mjs';
import { highlightsStrip } from './src/components/highlights.mjs';
import { products } from './src/components/products.mjs';
import { categories } from './src/components/categories.mjs';
import { store } from './src/components/store.mjs';
import { about } from './src/components/about.mjs';
import { contactSection, contactChannels } from './src/components/contact.mjs';
import { footer, whatsappFloat } from './src/components/footer.mjs';

// Dados estruturados apenas com o que está confirmado (sem preços, avaliações ou estoque).
const structuredData = ({ site, contact }) => {
  const abs = (path) => (site.url ? `${site.url}/${path}` : path);
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

const head = (content) => {
  const { site, hero: h } = content;
  const abs = (path) => (site.url ? `${site.url}/${path}` : path);
  return `
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
<link rel="preload" href="${esc(h.background.src)}" as="image" type="image/webp" fetchpriority="high">
<link rel="preload" href="${esc(h.photo.src)}" as="image" type="image/webp" fetchpriority="high">
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
<script type="application/ld+json">${structuredData(content)}</script>`;
};

// Ordem: hero → faixa de diferenciais → produtos reais (se houver) → categorias →
// nossa loja → sobre a Fabielly → contato → rodapé.
export const renderPage = (content) =>
  `<!doctype html>
<html lang="${content.site.lang}">
<head>${head(content)}
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header(content)}
${mobileMenu(content)}
<main id="conteudo" tabindex="-1">
${hero(content)}
${highlightsStrip(content)}
${products(content)}
${categories(content)}
${store(content)}
${about(content)}
${contactSection(content)}
</main>
${footer(content)}
${whatsappFloat(content)}
</body>
</html>
`.replace(/\n{3,}/g, '\n\n');

// Pendências que precisam ser resolvidas antes da publicação.
export const pendingList = (content) => {
  const { site, contact, form, catalog, products: p, commercialHighlights } = content;
  const list = [];
  if (!site.url) list.push('site.url — URL pública (canonical, Open Graph, dados estruturados).');
  if (!contact.whatsapp.number)
    list.push('contact.whatsapp — número oficial. Sem ele: sem botão flutuante, categorias sem link e "Falar com a loja" leva ao contato.');
  if (!contact.email.address) list.push('contact.email — e-mail de atendimento.');
  if (!contact.address.lines.length) list.push('contact.address.lines — endereço da loja.');
  if (!contact.address.mapsUrl) list.push('contact.address.mapsUrl — link do mapa (habilita "Venha nos visitar").');
  if (!contact.hours.lines.length) list.push('contact.hours — horário de atendimento.');
  if (!contact.social.instagram) list.push('contact.social.instagram — perfil (opcional).');
  if (!form.endpoint) list.push('form.endpoint — serviço de envio. Sem ele o formulário não aparece.');
  if (!catalog.url && !p.items.length)
    list.push('catalog.url / products.items — sem catálogo nem produtos: "Conhecer a coleção" leva às categorias e "Escolhas da semana" fica oculta.');
  for (const item of commercialHighlights)
    if (!item.confirmed) list.push(`commercialHighlights — "${item.title}: ${item.text}" oculto até confirmação (confirmed: true).`);
  list.push('categories.items — confirmar se Roupas, Vestidos, Calçados e Acessórios correspondem ao acervo.');
  if (!contactChannels(contact).length && !form.endpoint)
    list.push('Contato — nenhum canal configurado: a seção mostra apenas o aviso de canais em breve.');
  return list;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = fileURLToPath(new URL('./index.html', import.meta.url));
  writeFileSync(out, renderPage(siteContent));
  console.log(`✔ index.html gerado (${out})`);

  const todo = pendingList(siteContent);
  if (todo.length) {
    console.log(`\n⚠ ${todo.length} pendência(s) antes de publicar:`);
    for (const item of todo) console.log(`  • ${item}`);
  }
}
