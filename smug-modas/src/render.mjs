// Monta o index.html a partir do conteúdo (src/content.json).
// Módulo sem dependências do Node: é usado pelo build.mjs e também pelo painel
// (admin/), que gera a mesma página no navegador para a prévia e a publicação.
import { esc } from './lib.mjs';
import { header, mobileMenu, demoToast } from './components/header.mjs';
import { hero, marquee } from './components/hero.mjs';
import { products, visibleProducts } from './components/products.mjs';
import { store } from './components/store.mjs';
import { categories } from './components/categories.mjs';
import { about } from './components/about.mjs';
import { contactSection, formMode } from './components/contact.mjs';
import { footer } from './components/footer.mjs';

// Dados estruturados apenas com o que está confirmado (sem preços, estoque ou avaliações).
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
  const { site } = content;
  const abs = (path) => (site.url ? `${site.url}/${path}` : path);
  return `
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}">
<meta name="theme-color" content="${esc(site.themeColor)}">
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
    // Tema escolhido pelo visitante (escuro é o padrão)
    try {
      var theme = localStorage.getItem('smug-theme');
      if (theme === 'light' || theme === 'dark') d.setAttribute('data-theme', theme);
    } catch (e) {}
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

// "Novidades" entra no menu logo após "Início" quando há produtos visíveis.
const withProductsNav = (content) =>
  visibleProducts(content).length
    ? { ...content, nav: [content.nav[0], { id: 'novidades', label: content.products.eyebrow }, ...content.nav.slice(1)] }
    : content;

export const renderPage = (data) => {
  const content = withProductsNav(data);
  return `<!doctype html>
<html lang="${esc(content.site.lang)}" data-theme="dark">
<head>${head(content)}
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<span class="scroll-progress" aria-hidden="true"></span>
${header(content)}
${mobileMenu(content)}
${demoToast(content)}
<main id="conteudo" tabindex="-1">
${hero(content)}
${marquee(content)}
${products(content)}
${store(content)}
${categories(content)}
${about(content)}
${contactSection(content)}
</main>
${footer(content)}
</body>
</html>
`.replace(/\n{3,}/g, '\n\n');
};

// Pendências que precisam ser resolvidas antes da publicação.
// Cada item: { field, text } — `field` é o caminho no content.json (usado pelo painel).
export const pendingList = (content) => {
  const { site, contact } = content;
  const list = [];
  const add = (field, text) => list.push({ field, text });
  if (!site.url) add('site.url', 'URL pública do site (canonical, Open Graph, dados estruturados).');
  if (!contact.whatsapp.number) add('contact.whatsapp', 'Número de WhatsApp (o site não gera link sem ele).');
  if (!contact.email.address) add('contact.email', 'E-mail de atendimento.');
  if (!contact.address.lines.length) add('contact.address', 'Endereço da loja.');
  if (!contact.address.mapsUrl) add('contact.address.mapsUrl', 'Link do mapa ("Venha nos visitar" leva ao contato enquanto isso).');
  if (!contact.hours.lines.length) add('contact.hours', 'Horário de atendimento.');
  const mode = formMode(content);
  const modes = { whatsapp: 'hoje as mensagens vão pelo WhatsApp', email: 'hoje as mensagens vão por e-mail', unavailable: 'hoje o formulário não envia' };
  if (mode !== 'endpoint') add('form.endpoint', `Serviço de envio do formulário (${modes[mode]}).`);
  for (const b of content.heroBenefits)
    if (!b.confirmed) add('heroBenefits', `Confirmar a condição comercial "${b.title}: ${b.text}".`);
  if (!content.categories.catalogUrl && content.categories.items.every((i) => !i.url))
    add('categories.catalogUrl', 'Sem catálogo: os cards de categoria levam ao formulário com o interesse preenchido.');
  return list;
};
