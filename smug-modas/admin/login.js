// Telas de acesso: criar acesso (primeira vez neste aparelho), entrar e "esqueci minha senha".
import * as auth from './auth.js';
import * as db from './db.js';
import { esc, isEmail, confirmDialog } from './ui.js';

const EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.6A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.9 3.7M6.6 6.6C3.9 8.3 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.3-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>';
const STRENGTH = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];

const passwordField = (id, label, autocomplete, extra = '') => `
  <div class="field">
    <label for="${id}">${label}</label>
    <div class="password">
      <input id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" required ${extra}>
      <button class="password__toggle" type="button" aria-label="Mostrar senha" aria-pressed="false" data-toggle="${id}">${EYE}</button>
    </div>
  </div>`;

const frame = (body) => `
  <div class="auth-screen">
    <aside class="auth-art" aria-hidden="true">
      <img src="../assets/img/loja-ambiente.webp" alt="" width="851" height="612">
      <div class="auth-art__text">
        <p class="auth-art__brand">SMUG</p>
        <p class="auth-art__script">Mais que moda, é você.</p>
      </div>
    </aside>
    <main class="auth-main">
      <div class="auth-card">
        <div class="auth-brand">
          <span class="brand-mark" aria-hidden="true">S</span>
          <span class="auth-brand__text"><strong>SMUG MODAS</strong><span>Painel administrativo</span></span>
        </div>
        ${body}
        <p class="auth-foot">${LOCK}<span>Os dados do painel ficam criptografados neste aparelho.</span></p>
      </div>
    </main>
  </div>`;

const loginView = (lockMessage) =>
  frame(`
    <h1 class="auth-title">Entrar</h1>
    <p class="auth-text">Acesse com o e-mail e a senha do painel.</p>
    ${lockMessage ? `<p class="auth-notice" role="status">${esc(lockMessage)}</p>` : ''}
    <form class="auth-form" novalidate data-login>
      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" inputmode="email" autocomplete="username" required spellcheck="false">
      </div>
      ${passwordField('password', 'Senha', 'current-password')}
      <p class="auth-error" role="alert" data-error></p>
      <button class="btn btn--primary btn--lg auth-submit" type="submit" data-submit>Entrar</button>
    </form>
    <button class="auth-link" type="button" data-forgot>Esqueci minha senha</button>`);

const setupView = () =>
  frame(`
    <h1 class="auth-title">Criar acesso ao painel</h1>
    <p class="auth-text">Primeiro acesso neste aparelho. Defina o e-mail e a senha que serão usados para entrar.</p>
    <form class="auth-form" novalidate data-setup>
      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" inputmode="email" autocomplete="username" required spellcheck="false">
      </div>
      ${passwordField('password', 'Senha', 'new-password', 'minlength="8" aria-describedby="strength"')}
      <div class="strength" id="strength" aria-live="polite"><span class="strength__bar"><span data-bar></span></span><span data-label>Use pelo menos 8 caracteres.</span></div>
      ${passwordField('confirm', 'Confirmar senha', 'new-password')}
      <p class="auth-hint">Guarde bem a sua senha: por segurança ela <strong>não pode ser recuperada</strong>. Se esquecer, os dados deste aparelho (pedidos e clientes) precisam ser apagados — o site não é afetado.</p>
      <p class="auth-error" role="alert" data-error></p>
      <button class="btn btn--primary btn--lg auth-submit" type="submit" data-submit>Criar acesso e entrar</button>
    </form>`);

const LOGOUT_MESSAGES = {
  idle: 'Você saiu automaticamente após 1 hora sem uso.',
  logout: 'Você saiu do painel.',
  password: 'Senha alterada. Entre com a nova senha.',
};

// Tentativas erradas: a partir da 5ª, espera crescente (30 s, 1 min, 2 min… até 15 min).
async function lockState() {
  const state = (await db.kv.get('authFail')) || { count: 0, until: 0 };
  return state;
}
async function registerFailure() {
  const state = await lockState();
  const count = state.count + 1;
  const until = count >= 5 ? Date.now() + Math.min(15 * 60, 30 * 2 ** (count - 5)) * 1000 : 0;
  await db.kv.set('authFail', { count, until });
  return { count, until };
}
const waitText = (until) => {
  const s = Math.ceil((until - Date.now()) / 1000);
  return s > 60 ? `${Math.ceil(s / 60)} min` : `${s} s`;
};

export function ensureAuth() {
  const root = document.querySelector('[data-auth]');
  const shell = document.querySelector('.shell');

  return new Promise((resolve) => {
    const finish = () => {
      root.hidden = true;
      root.innerHTML = '';
      shell.hidden = false;
      document.body.classList.remove('is-auth');
      resolve();
    };

    const bindCommon = () => {
      root.querySelectorAll('[data-toggle]').forEach((btn) =>
        btn.addEventListener('click', () => {
          const input = root.querySelector(`#${btn.dataset.toggle}`);
          const show = input.type === 'password';
          input.type = show ? 'text' : 'password';
          btn.setAttribute('aria-pressed', String(show));
          btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
          btn.innerHTML = show ? EYE_OFF : EYE;
        })
      );
    };

    const showError = (text) => {
      const box = root.querySelector('[data-error]');
      box.textContent = text;
    };
    const busy = (on, label) => {
      const btn = root.querySelector('[data-submit]');
      btn.disabled = on;
      btn.setAttribute('aria-busy', String(on));
      if (label) btn.textContent = label;
    };

    const showSetup = () => {
      root.innerHTML = setupView();
      bindCommon();
      const form = root.querySelector('[data-setup]');
      const bar = root.querySelector('[data-bar]');
      const label = root.querySelector('[data-label]');
      form.password.addEventListener('input', () => {
        const value = form.password.value;
        const score = auth.passwordStrength(value);
        bar.style.width = `${value ? (score + 1) * 20 : 0}%`;
        bar.dataset.score = score;
        label.textContent = value.length < 8 ? 'Use pelo menos 8 caracteres.' : `Força: ${STRENGTH[score]}`;
      });
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;
        if (!isEmail(email)) return showError('Digite um e-mail válido.'), form.email.focus();
        if (password.length < 8) return showError('A senha precisa ter pelo menos 8 caracteres.'), form.password.focus();
        if (password !== form.confirm.value) return showError('As senhas não conferem.'), form.confirm.focus();
        showError('');
        busy(true, 'Criando acesso…');
        try {
          const { key, record } = await auth.createAuth(email, password);
          await auth.startSession(key, record.email);
          await db.saveAuth(record);
          await db.kv.del('authFail');
          finish();
        } catch (error) {
          busy(false, 'Criar acesso e entrar');
          showError(`Não foi possível criar o acesso: ${error.message}`);
        }
      });
      form.email.focus();
    };

    const showLogin = (record, message = '') => {
      root.innerHTML = loginView(message);
      bindCommon();
      const form = root.querySelector('[data-login]');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;
        if (!email || !password) return showError('Preencha e-mail e senha.');
        const lock = await lockState();
        if (lock.until > Date.now()) return showError(`Muitas tentativas. Tente de novo em ${waitText(lock.until)}.`);
        showError('');
        busy(true, 'Entrando…');
        const key = await auth.checkPassword(record, email, password);
        if (!key) {
          const state = await registerFailure();
          busy(false, 'Entrar');
          form.password.value = '';
          form.password.focus();
          return showError(
            state.until ? `E-mail ou senha incorretos. Aguarde ${waitText(state.until)} para tentar de novo.` : 'E-mail ou senha incorretos.'
          );
        }
        await db.kv.del('authFail');
        await auth.startSession(key, record.email);
        finish();
      });
      root.querySelector('[data-forgot]').addEventListener('click', async () => {
        const ok = await confirmDialog({
          title: 'Esqueceu a senha?',
          text: 'A senha protege os dados guardados neste aparelho com criptografia, por isso ela não pode ser recuperada. Você pode apagar os dados deste aparelho (pedidos, clientes, respostas prontas, rascunho e token do GitHub) e criar uma senha nova. O site publicado <strong>não</strong> é afetado. Se tiver um backup, poderá importá-lo depois.',
          confirm: 'Apagar dados e criar nova senha',
          cancel: 'Voltar',
          danger: true,
        });
        if (!ok) return;
        await db.resetDevice();
        auth.endSession();
        showSetup();
      });
      form.email.focus();
    };

    (async () => {
      document.body.classList.add('is-auth');
      root.hidden = false;
      shell.hidden = true;
      if (!auth.supported()) {
        root.innerHTML = frame('<h1 class="auth-title">Conexão não segura</h1><p class="auth-text">Abra o painel por um endereço <strong>https://</strong> para que a criptografia dos dados funcione.</p>');
        return;
      }
      let record;
      try {
        record = await db.getAuth();
      } catch (error) {
        root.innerHTML = frame(`<h1 class="auth-title">Não foi possível abrir o painel</h1><p class="auth-text">${esc(error.message)}</p>`);
        return;
      }
      if (!record) return showSetup();
      if (await auth.resumeSession(record)) return finish();
      showLogin(record, LOGOUT_MESSAGES[auth.takeLogoutReason()] || '');
    })();
  });
}
