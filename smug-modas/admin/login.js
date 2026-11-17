// Entrada no painel (mesmo layout do painel do Marcos): formulário à esquerda, foto da loja à direita.
// Primeiro acesso: ativação com o código guardado na Vercel. Depois: e-mail e senha.
import { api } from './api.js';
import { ico, isEmail, BRAND } from './ui.js';

const passwordField = (id, label, autocomplete, placeholder) => `
  <label class="field">
    <span>${label}</span>
    <span class="pass">
      <input id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" required placeholder="${placeholder}">
      <button class="pass-toggle" type="button" aria-pressed="false" aria-label="Mostrar senha" title="Mostrar senha" data-toggle="${id}">${ico('eye')}</button>
    </span>
  </label>`;

const loginForm = () => `
  <h1 id="login-title">PAINEL ADMINISTRATIVO</h1>
  <p class="login-sub">Entre com a sua conta de administrador para publicar postagens e cuidar dos produtos do site.</p>
  <form novalidate data-form="login">
    <label class="field">
      <span>E-mail</span>
      <input id="email" name="email" type="email" inputmode="email" autocomplete="username" required spellcheck="false" placeholder="voce@smugmodas.com.br">
    </label>
    ${passwordField('password', 'Senha', 'current-password', 'Sua senha')}
    <p class="form-msg" role="alert" data-error></p>
    <button class="btn btn-primary btn-block btn-lg" type="submit" data-submit><span>ENTRAR</span></button>
    <button class="link-btn" type="button" data-forgot>Esqueci minha senha</button>
  </form>`;

const codeForm = (reset) => `
  <h1 id="login-title">${reset ? 'NOVO ACESSO' : 'PRIMEIRO ACESSO'}</h1>
  <p class="login-sub">${
    reset
      ? 'Esqueceu a senha? Digite o código de acesso da loja e crie um e-mail e uma senha novos.'
      : 'Digite o código de acesso da loja e crie o e-mail e a senha que serão usados para entrar.'
  }</p>
  <form novalidate data-form="setup">
    <label class="field">
      <span>Código de acesso</span>
      <input id="code" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="SMUG-XXXX-XXXX">
    </label>
    <label class="field">
      <span>E-mail</span>
      <input id="email" name="email" type="email" inputmode="email" autocomplete="username" required spellcheck="false" placeholder="voce@smugmodas.com.br">
    </label>
    ${passwordField('password', 'Senha (mínimo 8 caracteres)', 'new-password', 'Crie uma senha')}
    ${passwordField('confirm', 'Confirmar senha', 'new-password', 'Repita a senha')}
    <p class="form-msg" role="alert" data-error></p>
    <button class="btn btn-primary btn-block btn-lg" type="submit" data-submit><span>${reset ? 'CRIAR NOVO ACESSO' : 'ATIVAR E ENTRAR'}</span></button>
    ${reset ? '<button class="link-btn" type="button" data-back>Voltar para entrar</button>' : ''}
  </form>
  <p class="login-help">O código de acesso não expira: guarde em lugar seguro. Ele serve sempre que você esquecer a senha.</p>`;

export function renderLogin(root, status, { onSuccess, themeButton = () => '', reset = false }) {
  const setup = Boolean(status?.setupRequired) || reset;
  root.innerHTML = `
    <main class="login">
      ${themeButton()}
      <section class="login-card" aria-labelledby="login-title">
        <div class="login-brand" role="img" aria-label="SMUG MODAS">${BRAND}</div>
        ${setup ? codeForm(reset && !status?.setupRequired) : loginForm()}
        <p class="login-foot">${ico('lock')}<span>Acesso restrito ao administrador da loja.</span></p>
        <a class="login-back" href="../">${ico('left')}<span>Voltar para o site</span></a>
      </section>
      <div class="login-art" aria-hidden="true"></div>
    </main>`;
  const form = root.querySelector('form');
  const error = root.querySelector('[data-error]');
  const submit = root.querySelector('[data-submit]');
  const label = submit.querySelector('span').textContent;

  root.querySelectorAll('[data-toggle]').forEach((button) =>
    button.addEventListener('click', () => {
      const input = root.querySelector(`#${button.dataset.toggle}`);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      const text = show ? 'Esconder senha' : 'Mostrar senha';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', text);
      button.title = text;
      button.innerHTML = ico(show ? 'eyeOff' : 'eye');
    })
  );
  const again = (options) => renderLogin(root, status, { onSuccess, themeButton, ...options });
  root.querySelector('[data-forgot]')?.addEventListener('click', () => again({ reset: true }));
  root.querySelector('[data-back]')?.addEventListener('click', () => again({ reset: false }));

  const fail = (message, input) => {
    error.textContent = message;
    input?.focus();
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = form.elements;
    const email = f.email.value.trim();
    if (setup && !f.code.value.trim()) return fail('Digite o código de ativação.', f.code);
    if (!isEmail(email)) return fail('Digite um e-mail válido.', f.email);
    if (!f.password.value) return fail('Digite a senha.', f.password);
    if (setup && f.password.value.length < 8) return fail('A senha precisa ter pelo menos 8 caracteres.', f.password);
    if (setup && f.password.value !== f.confirm.value) return fail('As senhas não conferem.', f.confirm);
    error.textContent = '';
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>${setup ? 'ATIVANDO…' : 'ENTRANDO…'}</span>`;
    try {
      const result = setup ? await api.setup(f.code.value, email, f.password.value) : await api.login(email, f.password.value);
      await onSuccess(result.email);
    } catch (err) {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.innerHTML = `<span>${label}</span>`;
      if (err.data?.setupRequired) return renderLogin(root, { setupRequired: true }, { onSuccess, themeButton });
      f.password.value = '';
      fail(err.message, setup && err.status === 403 ? f.code : f.password);
    }
  });
  (setup ? form.elements.code : form.elements.email).focus();
}
