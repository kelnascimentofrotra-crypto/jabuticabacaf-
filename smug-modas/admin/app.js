// Painel da SMUG MODAS — acesso, navegação (4 seções) e publicação direta no site.
import { api } from './api.js';
import { renderLogin } from './login.js';
import { toast, confirmDialog, esc, ico } from './ui.js';
import { inicioView } from './views/inicio.js';
import { postagensView, postagemFormView } from './views/postagens.js';
import { produtosView, produtoFormView, categoriasView } from './views/produtos.js';
import { configuracoesView } from './views/configuracoes.js';

const NAV = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'postagens', label: 'Postagens', icon: 'posts' },
  { id: 'produtos', label: 'Produtos', icon: 'hanger' },
  { id: 'configuracoes', label: 'Configurações', icon: 'gear' },
];

const ROUTES = [
  [/^inicio$/, inicioView, 'inicio', 'Início'],
  [/^postagens$/, postagensView, 'postagens', 'Postagens'],
  [/^postagens\/(.+)$/, postagemFormView, 'postagens', 'Postagem'],
  [/^produtos$/, produtosView, 'produtos', 'Produtos'],
  [/^produtos\/categorias$/, categoriasView, 'produtos', 'Categorias'],
  [/^produtos\/(.+)$/, produtoFormView, 'produtos', 'Produto'],
  [/^configuracoes$/, configuracoesView, 'configuracoes', 'Configurações'],
];

const $ = (selector) => document.querySelector(selector);

export const app = {
  email: '',
  content: null,
  version: '',
  formDirty: false,

  async reload() {
    const { content, version } = await api.content();
    this.content = content;
    this.version = version;
  },

  // Publica uma alteração no site: aplica numa cópia do conteúdo, envia e só então atualiza o painel.
  async publish(mutator, { success = 'Publicado! O site já foi atualizado.' } = {}) {
    const next = structuredClone(this.content);
    mutator(next);
    try {
      const { version } = await api.publish(next, this.version);
      this.content = { ...next, updatedAt: version };
      this.version = version;
      this.formDirty = false;
      toast(success, 'success');
      return true;
    } catch (error) {
      if (error.status === 401) {
        toast('Sua sessão expirou. Entre de novo para continuar.', 'error', 7000);
        showLogin({ setupRequired: false });
      } else if (error.status === 409) {
        await this.reload().catch(() => {});
        toast('O site foi atualizado em outro aparelho. Carregamos a versão mais nova: confira e salve de novo.', 'error', 9000);
      } else {
        toast(error.message, 'error', 8000);
      }
      return false;
    }
  },

  imageUrl(src) {
    if (!src) return '';
    return /^(https?:|data:|\/)/.test(src) ? src : `../${src}`;
  },

  setTitle(title) {
    document.title = `${title} — Painel SMUG MODAS`;
  },

  go(hash) {
    location.hash = hash;
  },
};

/* ---------- Navegação ---------- */
function buildNav() {
  $('[data-nav]').innerHTML = NAV.map((item) => `<a class="app-nav__link" href="#/${item.id}" data-nav-id="${item.id}">${esc(item.label)}</a>`).join('');
  $('[data-tabbar]').innerHTML = NAV.map(
    (item) => `<a class="tabbar__link" href="#/${item.id}" data-nav-id="${item.id}">${ico(item.icon)}<span>${esc(item.label)}</span></a>`
  ).join('');
}

let currentHash = '';
let ignoreHash = false;

async function route() {
  if (ignoreHash) {
    ignoreHash = false;
    return;
  }
  const hash = location.hash.replace(/^#\/?/, '') || 'inicio';
  if (app.formDirty && `#/${hash}` !== currentHash) {
    const leave = await confirmDialog({
      title: 'Sair sem salvar?',
      text: 'As alterações deste formulário ainda não foram publicadas.',
      confirm: 'Sair sem salvar',
      cancel: 'Continuar editando',
      danger: true,
    });
    if (!leave) {
      ignoreHash = true;
      location.hash = currentHash;
      return;
    }
  }
  app.formDirty = false;
  currentHash = `#/${hash}`;
  const path = hash.split('?')[0];
  const [re, view, nav, title] = ROUTES.find(([pattern]) => pattern.test(path)) || ROUTES[0];
  const params = (path.match(re) || []).slice(1);
  document.querySelectorAll('[data-nav-id]').forEach((link) => {
    if (link.dataset.navId === nav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  app.setTitle(title);
  const main = $('#main');
  window.scrollTo(0, 0);
  try {
    await view(app, main, ...params);
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="container empty"><h2>Algo deu errado</h2><p>${esc(error.message)}</p><a class="btn btn--wine" href="#/inicio">Voltar ao início</a></div>`;
  }
  main.focus({ preventScroll: true });
}

/* ---------- Entrada e saída ---------- */
function showLogin(status) {
  $('[data-app]').hidden = true;
  $('[data-boot]').hidden = true;
  $('[data-login]').hidden = false;
  document.body.classList.add('is-login');
  app.setTitle('Entrar');
  renderLogin($('[data-login-card]'), status, { onSuccess: enterApp });
}

async function enterApp(email) {
  app.email = email;
  await app.reload();
  $('[data-login]').hidden = true;
  $('[data-login-card]').innerHTML = ''; // sem campos de senha escondidos na página
  $('[data-boot]').hidden = true;
  $('[data-app]').hidden = false;
  document.body.classList.remove('is-login');
  await route();
}

$('[data-logout]').addEventListener('click', async () => {
  if (app.formDirty && !(await confirmDialog({ title: 'Sair sem salvar?', text: 'As alterações deste formulário ainda não foram publicadas.', confirm: 'Sair', danger: true }))) return;
  app.formDirty = false;
  await api.logout().catch(() => {});
  toast('Você saiu do painel.');
  showLogin({ setupRequired: false });
});

window.addEventListener('hashchange', () => {
  if (!$('[data-app]').hidden) route();
});
window.addEventListener('beforeunload', (event) => {
  if (app.formDirty) event.preventDefault();
});

async function start() {
  buildNav();
  let status;
  try {
    status = await api.status();
  } catch (error) {
    $('[data-boot]').innerHTML = `<span class="boot__mark" aria-hidden="true">S</span><p>${esc(error.message)}</p><a class="btn btn--line" href="../">Voltar ao site</a>`;
    return;
  }
  if (status.authenticated) {
    try {
      await enterApp(status.email);
    } catch (error) {
      $('[data-boot]').innerHTML = `<span class="boot__mark" aria-hidden="true">S</span><p>${esc(error.message)}</p>`;
    }
  } else showLogin(status);
}

export { showLogin };
start();
