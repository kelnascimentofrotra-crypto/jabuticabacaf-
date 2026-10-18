// Painel da SMUG MODAS — estado, rascunho e navegação.
import * as db from './db.js';
import * as github from './github.js';
import { renderPage, pendingList } from '../src/render.mjs';
import { toast, confirmDialog, isUrl, isEmail, esc } from './ui.js';
import { overviewView } from './views/overview.js';
import { productsView, productFormView } from './views/products.js';
import { categoriesView } from './views/categories.js';
import { storeView } from './views/store.js';
import { textsView } from './views/texts.js';
import { ordersView, orderFormView } from './views/orders.js';
import { customersView, customerFormView } from './views/customers.js';
import { messagesView } from './views/messages.js';
import { publishView } from './views/publish.js';
import { settingsView } from './views/settings.js';

const DEFAULT_SETTINGS = {
  owner: 'kelnascimentofrotra-crypto',
  repo: 'jabuticabacaf-',
  branch: 'claude/busy-galileo-x8mcr4',
  dir: 'smug-modas',
  inboxUrl: '',
};
const TOKEN_KEY = 'smug-admin-token';

const SECTION_LABELS = {
  site: 'Endereço do site e SEO',
  contact: 'Dados de contato',
  form: 'Formulário de contato',
  heroBenefits: 'Condições comerciais',
  nav: 'Menu do site',
  headerActions: 'Ações do header',
  hero: 'Textos da abertura',
  marquee: 'Faixa em movimento',
  products: 'Produtos',
  store: 'Nossa loja',
  categories: 'Categorias',
  about: 'Sobre a Fabielly',
  contactSection: 'Seção de contato',
  footer: 'Rodapé',
};

const ROUTES = [
  [/^inicio$/, overviewView, 'Visão geral', 'inicio'],
  [/^produtos$/, productsView, 'Produtos', 'produtos'],
  [/^produtos\/(.+)$/, productFormView, 'Produto', 'produtos'],
  [/^categorias$/, categoriesView, 'Categorias', 'categorias'],
  [/^pedidos$/, ordersView, 'Pedidos', 'pedidos'],
  [/^pedidos\/(.+)$/, orderFormView, 'Pedido', 'pedidos'],
  [/^clientes$/, customersView, 'Clientes', 'clientes'],
  [/^clientes\/(.+)$/, customerFormView, 'Cliente', 'clientes'],
  [/^mensagens$/, messagesView, 'Mensagens', 'mensagens'],
  [/^loja$/, storeView, 'Dados da loja', 'loja'],
  [/^textos$/, textsView, 'Textos do site', 'textos'],
  [/^publicar$/, publishView, 'Publicar', 'publicar'],
  [/^config$/, settingsView, 'Configurações', 'config'],
];

const stringify = (content) => `${JSON.stringify(content, null, 2)}\n`;

export const app = {
  content: null, // rascunho em edição
  originalText: '', // content.json publicado, base de comparação
  uploads: {}, // fotos novas ainda não publicadas: { 'assets/img/…': { dataUrl, width, height } }
  justPublished: {}, // fotos publicadas nesta sessão (para exibir antes de o servidor atualizar)
  settings: { ...DEFAULT_SETTINGS },
  token: '',
  remoteNotice: '',
  formDirty: false,
  db,
  github,

  /* ---------- Rascunho ---------- */
  contentText() {
    return stringify(this.content);
  },
  referencedUploads() {
    const text = JSON.stringify(this.content);
    return Object.keys(this.uploads).filter((path) => text.includes(JSON.stringify(path)));
  },
  isDirty() {
    return this.contentText() !== this.originalText || this.referencedUploads().length > 0;
  },
  changes() {
    const before = JSON.parse(this.originalText || '{}');
    const list = [];
    for (const key of Object.keys({ ...before, ...this.content })) {
      if (key === 'products') continue;
      if (JSON.stringify(before[key]) !== JSON.stringify(this.content[key])) list.push(SECTION_LABELS[key] || key);
    }
    const oldItems = new Map((before.products?.items || []).map((p) => [p.id, p]));
    const newItems = new Map((this.content.products?.items || []).map((p) => [p.id, p]));
    for (const [id, p] of newItems) {
      if (!oldItems.has(id)) list.push(`Produto novo: ${p.name}`);
      else if (JSON.stringify(oldItems.get(id)) !== JSON.stringify(p)) list.push(`Produto alterado: ${p.name}`);
    }
    for (const [id, p] of oldItems) if (!newItems.has(id)) list.push(`Produto removido: ${p.name}`);
    const { items: _a, ...beforeSection } = before.products || {};
    const { items: _b, ...afterSection } = this.content.products || {};
    if (JSON.stringify(beforeSection) !== JSON.stringify(afterSection)) list.push('Textos da vitrine de produtos');
    const photos = this.referencedUploads().length;
    if (photos) list.push(`${photos} foto(s) nova(s)`);
    return list;
  },
  // Aplica uma alteração ao rascunho e salva neste navegador.
  update(mutator) {
    mutator(this.content);
    this.persist();
    this.refreshBadges();
  },
  addUpload(path, image) {
    this.uploads[path] = image;
    this.persist();
  },
  dropUnusedUploads() {
    const used = new Set(this.referencedUploads());
    for (const path of Object.keys(this.uploads)) if (!used.has(path)) delete this.uploads[path];
  },
  persistTimer: 0,
  persist() {
    clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => {
      this.dropUnusedUploads();
      db.kv
        .set('draft', { content: this.content, uploads: this.uploads, originalText: this.originalText, savedAt: new Date().toISOString() })
        .catch(() => toast('Não foi possível salvar o rascunho neste navegador.', 'error'));
    }, 250);
  },
  async discardDraft() {
    this.content = JSON.parse(this.originalText);
    this.uploads = {};
    await db.kv.del('draft');
    this.refreshBadges();
  },
  async markPublished(text) {
    this.originalText = text;
    this.content = JSON.parse(text);
    Object.assign(this.justPublished, this.uploads);
    this.uploads = {};
    await db.kv.del('draft');
    this.refreshBadges();
  },

  /* ---------- Site gerado ---------- */
  // Fotos enviadas pelo painel ficam em assets/img/produtos|categorias. Se o painel estiver aberto
  // numa versão antiga do site, elas ainda não existem ali: usamos a cópia da branch no GitHub.
  isPanelImage: (src) => /^assets\/img\/(produtos|categorias)\//.test(src),
  remoteImageUrl(src) {
    const { owner, repo, branch, dir } = this.settings;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${dir}/${src}`;
  },
  imageUrl(src) {
    if (!src) return '';
    return this.uploads[src]?.dataUrl || this.justPublished[src]?.dataUrl || `../${src}`;
  },
  // Atributos de <img> com reserva: se o arquivo local não existir, tenta a branch no GitHub.
  imgAttrs(src) {
    const url = this.imageUrl(src);
    const fallback = this.isPanelImage(src) && url.startsWith('../') ? ` data-fallback="${esc(this.remoteImageUrl(src))}"` : '';
    return `src="${esc(url)}"${fallback}`;
  },
  pageHtml() {
    return renderPage(this.content);
  },
  // Para a prévia: fotos ainda não publicadas entram como data URL.
  previewHtml() {
    let html = renderPage(this.content);
    const images = { ...this.justPublished, ...this.uploads };
    for (const [path, image] of Object.entries(images)) html = html.split(`"${path}"`).join(`"${image.dataUrl}"`);
    // fotos do painel publicadas em outra sessão: lidas direto da branch
    return html.replace(/"(assets\/img\/(?:produtos|categorias)\/[^"]+)"/g, (m, src) => `"${this.remoteImageUrl(src)}"`);
  },
  pending() {
    return pendingList(this.content);
  },
  validate() {
    const c = this.content;
    const issues = [];
    const error = (text, route) => issues.push({ level: 'error', text, route });
    const warn = (text, route) => issues.push({ level: 'warning', text, route });
    const n = c.contact.whatsapp.number;
    if (n && !/^\d{12,13}$/.test(n)) error('Número de WhatsApp inválido: use DDI + DDD + número (ex.: 5511912345678).', '#/loja');
    if (c.contact.email.address && !isEmail(c.contact.email.address)) error('E-mail de atendimento inválido.', '#/loja');
    const urls = [
      [c.site.url, 'Endereço do site'],
      [c.contact.address.mapsUrl, 'Link do mapa'],
      [c.contact.social.instagram, 'Instagram'],
      [c.form.endpoint, 'Serviço do formulário'],
      [c.categories.catalogUrl, 'Catálogo'],
    ];
    for (const [value, label] of urls) if (value && !isUrl(value)) error(`${label}: o link precisa começar com https://`, '#/loja');
    if (c.site.url.endsWith('/')) error('Endereço do site: remova a barra "/" do final.', '#/loja');
    for (const p of c.products.items) {
      if (!p.name) error('Há um produto sem nome.', '#/produtos');
      if (!p.image?.src) error(`O produto "${p.name || 'sem nome'}" está sem foto.`, `#/produtos/${p.id}`);
      if (p.url && !isUrl(p.url)) error(`Link do produto "${p.name}" precisa começar com https://`, `#/produtos/${p.id}`);
    }
    for (const cat of c.categories.items) {
      if (!cat.name) error('Há uma categoria sem nome.', '#/categorias');
      if (!cat.image?.src) error(`A categoria "${cat.name || 'sem nome'}" está sem foto.`, '#/categorias');
      if (cat.url && !isUrl(cat.url)) error(`Link da categoria "${cat.name}" precisa começar com https://`, '#/categorias');
    }
    if (!c.products.items.some((p) => p.status !== 'oculto')) warn('Nenhum produto visível: a vitrine "Escolhas da semana" não aparece no site.', '#/produtos');
    return issues;
  },

  /* ---------- GitHub ---------- */
  setToken(token, remember) {
    this.token = token;
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  },
  tokenRemembered: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  async saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    await db.kv.set('settings', this.settings);
  },
  sitePath(path) {
    return `${this.settings.dir.replace(/\/+$/, '')}/${path}`.replace(/^\/+/, '');
  },

  /* ---------- Interface ---------- */
  setTitle(title) {
    document.querySelector('[data-page-title]').textContent = title;
    document.title = `${title} — Painel SMUG MODAS`;
  },
  refreshBadges() {
    const count = this.content ? this.changes().length : 0;
    const badge = document.querySelector('[data-changes-badge]');
    const pill = document.querySelector('[data-changes-pill]');
    badge.hidden = !count;
    badge.textContent = count;
    pill.hidden = !count;
    pill.textContent = count === 1 ? '1 alteração não publicada' : `${count} alterações não publicadas`;
  },
  go(hash) {
    location.hash = hash;
  },
};

/* ---------- Carregamento ---------- */
async function loadContent() {
  let siteText = '';
  try {
    const response = await fetch('../src/content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    siteText = await response.text();
  } catch {
    /* tenta o GitHub abaixo */
  }
  // Com token, a fonte mais atual é a branch no GitHub (sem atraso de cache do servidor).
  if (app.token) {
    try {
      siteText = (await github.readFile(app.settings, app.token, app.sitePath('src/content.json'))).text;
    } catch (error) {
      app.remoteNotice = `Não foi possível ler a versão do GitHub (${error.message}). Usando a cópia do site.`;
    }
  }
  if (!siteText) throw new Error('Não foi possível carregar o conteúdo do site (src/content.json).');

  const draft = await db.kv.get('draft').catch(() => null);
  const draftHasChanges = draft && (stringify(draft.content) !== draft.originalText || Object.keys(draft.uploads || {}).length);
  if (draftHasChanges) {
    app.content = draft.content;
    app.uploads = draft.uploads || {};
    app.originalText = draft.originalText;
    if (draft.originalText !== siteText) {
      app.remoteNotice =
        'O site foi atualizado depois que este rascunho foi criado. Ao publicar, o painel avisará antes de substituir a versão atual.';
    }
  } else {
    app.originalText = siteText;
    app.content = JSON.parse(siteText);
    app.uploads = {};
  }
}

/* ---------- Navegação ---------- */
let currentHash = '';
let ignoreNextHash = false;

async function route() {
  if (ignoreNextHash) {
    ignoreNextHash = false;
    return;
  }
  const hash = location.hash.replace(/^#\/?/, '') || 'inicio';
  if (app.formDirty && `#/${hash}` !== currentHash) {
    const leave = await confirmDialog({
      title: 'Sair sem salvar?',
      text: 'As alterações deste formulário ainda não foram salvas.',
      confirm: 'Sair sem salvar',
      cancel: 'Continuar editando',
      danger: true,
    });
    if (!leave) {
      ignoreNextHash = true;
      location.hash = currentHash;
      return;
    }
  }
  app.formDirty = false;
  currentHash = `#/${hash}`;
  closeNav();

  const path = hash.split('?')[0];
  const match = ROUTES.find(([re]) => re.test(path));
  const [re, view, title, nav] = match || ROUTES[0];
  const params = (path.match(re) || []).slice(1);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  app.setTitle(title);
  const main = document.getElementById('main');
  main.scrollTop = 0;
  window.scrollTo(0, 0);
  try {
    await view(app, main, ...params);
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="empty"><h2>Algo deu errado</h2><p>${esc(error.message)}</p><a class="btn btn--primary" href="#/inicio">Voltar ao início</a></div>`;
  }
  main.focus({ preventScroll: true });
}

/* ---------- Menu lateral (celular) ---------- */
const sidebar = () => document.getElementById('sidebar');
function openNav() {
  sidebar().classList.add('is-open');
  document.querySelector('.sidebar-scrim').hidden = false;
  document.querySelector('[data-action="open-nav"]').setAttribute('aria-expanded', 'true');
  sidebar().querySelector('a, button')?.focus();
}
function closeNav() {
  if (!sidebar().classList.contains('is-open')) return;
  sidebar().classList.remove('is-open');
  document.querySelector('.sidebar-scrim').hidden = true;
  const toggle = document.querySelector('[data-action="open-nav"]');
  toggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'open-nav') openNav();
  if (action === 'close-nav') {
    closeNav();
    document.querySelector('[data-action="open-nav"]').focus();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar().classList.contains('is-open')) {
    closeNav();
    document.querySelector('[data-action="open-nav"]').focus();
  }
});
// Imagem que não carregou: tenta a reserva (data-fallback) uma única vez
document.addEventListener(
  'error',
  (event) => {
    const img = event.target;
    if (img.tagName === 'IMG' && img.dataset.fallback && !img.dataset.triedFallback) {
      img.dataset.triedFallback = '1';
      img.src = img.dataset.fallback;
    }
  },
  true
);
window.addEventListener('beforeunload', (event) => {
  if (app.formDirty) event.preventDefault();
});

/* ---------- Início ---------- */
async function start() {
  const main = document.getElementById('main');
  try {
    app.settings = { ...DEFAULT_SETTINGS, ...((await db.kv.get('settings')) || {}) };
  } catch (error) {
    toast(error.message, 'error', 8000);
  }
  app.token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
  try {
    await loadContent();
  } catch (error) {
    main.innerHTML = `<div class="empty"><h2>Não foi possível abrir o painel</h2><p>${esc(error.message)}</p><p class="muted">Abra o painel pelo endereço do site (…/admin/), não direto do arquivo.</p></div>`;
    return;
  }
  app.refreshBadges();
  window.addEventListener('hashchange', route);
  await route();
}

start();
