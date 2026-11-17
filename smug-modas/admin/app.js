// Painel da SMUG MODAS — mesmo layout do painel do Marcos: menu lateral (4 opções), topo com
// modo claro/escuro, conta e "Sair". Cada "Salvar" publica direto no site (via /api).
import { api } from './api.js';
import { renderLogin } from './login.js';
import { toast, confirmDialog, esc, ico, BRAND } from './ui.js';
import { inicioView } from './views/inicio.js';
import { postagensView, postagemFormView } from './views/postagens.js';
import { produtosView, produtoFormView, categoriasView } from './views/produtos.js';
import { configuracoesView, contaView } from './views/configuracoes.js';

const NAV = [
  { id: 'inicio', label: 'Dashboard', icon: 'dash' },
  { id: 'postagens', label: 'Postagens', icon: 'posts' },
  { id: 'produtos', label: 'Produtos', icon: 'hanger' },
  { id: 'configuracoes', label: 'Configurações', icon: 'gear' },
];

const ROUTES = [
  [/^inicio$/, inicioView, 'inicio', 'Dashboard'],
  [/^postagens$/, postagensView, 'postagens', 'Postagens'],
  [/^postagens\/(.+)$/, postagemFormView, 'postagens', 'Postagem'],
  [/^produtos$/, produtosView, 'produtos', 'Produtos'],
  [/^produtos\/categorias$/, categoriasView, 'produtos', 'Categorias'],
  [/^produtos\/(.+)$/, produtoFormView, 'produtos', 'Produto'],
  [/^configuracoes$/, configuracoesView, 'configuracoes', 'Configurações'],
  [/^conta$/, contaView, '', 'Minha conta'],
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
        toast('Sua sessão terminou. Entre de novo para continuar.', 'error', 7000);
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

/* ---------- Tema claro / escuro (igual ao painel do Marcos) ---------- */
const isDark = () => document.documentElement.dataset.theme === 'dark';
function paintThemeButtons() {
  document.querySelectorAll('[data-theme-btn]').forEach((button) => {
    const label = isDark() ? 'Usar modo claro' : 'Usar modo escuro';
    button.innerHTML = ico(isDark() ? 'sun' : 'moon');
    button.setAttribute('aria-label', label);
    button.title = label;
  });
  $('meta[name="theme-color"]').content = isDark() ? '#1a100d' : '#f7f3ec';
}
document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-theme-btn]')) return;
  document.documentElement.dataset.theme = isDark() ? 'light' : 'dark';
  try {
    localStorage.setItem('smug:admin-tema', isDark() ? 'escuro' : 'claro');
  } catch {
    /* sem armazenamento: vale só nesta visita */
  }
  paintThemeButtons();
});

/* ---------- Estrutura: menu lateral + topo ---------- */
function buildShell() {
  document.querySelectorAll('[data-brand]').forEach((el) => (el.innerHTML = BRAND));
  $('[data-nav]').innerHTML = NAV.map((item) => `<a href="#/${item.id}" data-nav-id="${item.id}">${ico(item.icon)}<span>${esc(item.label)}</span></a>`).join('');
  $('[data-site-link]').innerHTML = `${ico('external')}<span>Ver o site</span>`;
  $('[data-menu]').innerHTML = ico('menu');
  $('[data-logout]').innerHTML = `${ico('out')}<span>Sair</span>`;
  paintThemeButtons();
}

const toggleDrawer = (open = !document.body.classList.contains('drawer-open')) => {
  document.body.classList.toggle('drawer-open', open);
  $('[data-menu]').setAttribute('aria-expanded', String(open));
};
$('[data-menu]').addEventListener('click', () => toggleDrawer());
$('[data-close-drawer]').addEventListener('click', () => toggleDrawer(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('drawer-open')) toggleDrawer(false);
});

function paintIdentity() {
  $('[data-email]').textContent = app.email;
  $('[data-avatar]').textContent = (app.email[0] || 'S').toUpperCase();
}
app.paintIdentity = paintIdentity;

/* ---------- Navegação ---------- */
let currentHash = '';
let ignoreHash = false;

async function route() {
  if (ignoreHash) {
    ignoreHash = false;
    return;
  }
  toggleDrawer(false);
  const hash = location.hash.replace(/^#\/?/, '') || 'inicio';
  if (app.formDirty && `#/${hash}` !== currentHash) {
    const leave = await confirmDialog({
      title: 'Sair sem salvar?',
      text: 'Existem alterações que não foram salvas.',
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
    const on = link.dataset.navId === nav;
    link.classList.toggle('is-on', on);
    if (on) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  app.setTitle(title);
  // página nova a cada rota: nenhum evento da tela anterior continua ligado
  const old = $('#main');
  const main = old.cloneNode(false);
  old.replaceWith(main);
  window.scrollTo(0, 0);
  try {
    await view(app, main, ...params);
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="state state--error"><span class="state-ico">${ico('alert')}</span><h3>Algo deu errado</h3><p>${esc(error.message)}</p><div class="state-actions"><a class="btn btn-primary" href="#/inicio">Voltar ao Dashboard</a></div></div>`;
  }
  main.focus({ preventScroll: true });
}

/* ---------- Entrada e saída ---------- */
function showLogin(status) {
  $('[data-app]').hidden = true;
  $('[data-boot]').hidden = true;
  const root = $('[data-login]');
  root.hidden = false;
  app.setTitle('Entrar');
  const themeButton = () => {
    const label = isDark() ? 'Usar modo claro' : 'Usar modo escuro';
    return `<button class="btn icon-btn theme-btn theme-float" type="button" data-theme-btn aria-label="${label}" title="${label}">${ico(isDark() ? 'sun' : 'moon')}</button>`;
  };
  renderLogin(root, status, { onSuccess: enterApp, themeButton });
}

async function enterApp(email) {
  app.email = email;
  await app.reload();
  const login = $('[data-login]');
  login.hidden = true;
  login.innerHTML = ''; // sem campos de senha escondidos na página
  $('[data-boot]').hidden = true;
  $('[data-app]').hidden = false;
  paintIdentity();
  await route();
}

$('[data-logout]').addEventListener('click', async () => {
  if (app.formDirty && !(await confirmDialog({ title: 'Sair sem salvar?', text: 'Existem alterações que não foram salvas.', confirm: 'Sair', danger: true }))) return;
  app.formDirty = false;
  await api.logout().catch(() => {});
  toast('Você saiu do painel.', 'info');
  showLogin({ setupRequired: false });
});

window.addEventListener('hashchange', () => {
  if (!$('[data-app]').hidden) route();
});
window.addEventListener('beforeunload', (event) => {
  if (app.formDirty) event.preventDefault();
});

function fatal(message) {
  $('[data-boot]').innerHTML = `<span class="state-ico">${ico('alert')}</span><p>${esc(message)}</p><a class="btn" href="../">Voltar para o site</a>`;
}

async function start() {
  buildShell();
  let status;
  try {
    status = await api.status();
  } catch (error) {
    fatal(error.message);
    return;
  }
  if (status.authenticated) {
    try {
      await enterApp(status.email);
    } catch (error) {
      fatal(error.message);
    }
  } else showLogin(status);
}

export { showLogin };
start();
