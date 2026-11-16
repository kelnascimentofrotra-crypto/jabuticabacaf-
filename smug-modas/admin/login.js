// Acesso ao painel: ativação no primeiro acesso (com o código da Vercel) e login.
import { api } from './api.js';
import { ico, isEmail } from './ui.js';

const passwordField = (id, label, autocomplete) => `
  <div class="field">
    <label for="${id}">${label}</label>
    <div class="password">
      <input id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" required>
      <button class="password__toggle" type="button" aria-label="Mostrar senha" aria-pressed="false" data-toggle="${id}">${ico('eye')}</button>
    </div>
  </div>`;

const loginForm = () => `
  <p class="eyebrow eyebrow--line">Painel da loja</p>
  <h1 class="login-card__title" id="login-title">Entrar</h1>
  <p class="login-card__text">Acesse para publicar postagens e cuidar dos produtos do site.</p>
  <form class="login-form" novalidate data-form="login">
    <div class="field">
      <label for="email">E-mail</label>
      <input id="email" name="email" type="email" inputmode="email" autocomplete="username" required spellcheck="false">
    </div>
    ${passwordField('password', 'Senha', 'current-password')}
    <p class="form-error" role="alert" data-error></p>
    <button class="btn btn--wine btn--block" type="submit" data-submit><span>Entrar</span></button>
  </form>
  <p class="login-card__foot">${ico('lock')}<span>Esqueceu a senha? Fale com o responsável pelo site para liberar um novo acesso.</span></p>`;

const setupForm = () => `
  <p class="eyebrow eyebrow--line">Primeiro acesso</p>
  <h1 class="login-card__title" id="login-title">Ativar o painel</h1>
  <p class="login-card__text">Digite o código de ativação e crie o e-mail e a senha que serão usados para entrar.</p>
  <form class="login-form" novalidate data-form="setup">
    <div class="field">
      <label for="code">Código de ativação</label>
      <input id="code" name="code" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" required>
    </div>
    <div class="field">
      <label for="email">E-mail</label>
      <input id="email" name="email" type="email" inputmode="email" autocomplete="username" required spellcheck="false">
    </div>
    ${passwordField('password', 'Senha (mínimo 8 caracteres)', 'new-password')}
    ${passwordField('confirm', 'Confirmar senha', 'new-password')}
    <p class="form-error" role="alert" data-error></p>
    <button class="btn btn--wine btn--block" type="submit" data-submit><span>Ativar e entrar</span></button>
  </form>`;

export function renderLogin(card, status, { onSuccess }) {
  const setup = Boolean(status?.setupRequired);
  card.innerHTML = `<div class="login-card__inner">${setup ? setupForm() : loginForm()}</div>`;
  const form = card.querySelector('form');
  const error = card.querySelector('[data-error]');
  const submit = card.querySelector('[data-submit]');
  const label = submit.querySelector('span').textContent;

  card.querySelectorAll('[data-toggle]').forEach((button) =>
    button.addEventListener('click', () => {
      const input = card.querySelector(`#${button.dataset.toggle}`);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      button.innerHTML = ico(show ? 'eyeOff' : 'eye');
    })
  );

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
    submit.querySelector('span').textContent = setup ? 'Ativando…' : 'Entrando…';
    try {
      const result = setup ? await api.setup(f.code.value, email, f.password.value) : await api.login(email, f.password.value);
      await onSuccess(result.email);
    } catch (err) {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.querySelector('span').textContent = label;
      if (err.data?.setupRequired) return renderLogin(card, { setupRequired: true }, { onSuccess });
      if (setup && err.status === 409) return renderLogin(card, { setupRequired: false }, { onSuccess });
      f.password.value = '';
      fail(err.message, setup && err.status === 403 ? f.code : f.password);
    }
  });
  (setup ? form.elements.code : form.elements.email).focus();
}
