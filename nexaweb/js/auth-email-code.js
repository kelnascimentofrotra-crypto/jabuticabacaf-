(() => {
  const button = document.querySelector('#cleanCloudAuth .cloud-auth-submit');
  if (!button || location.protocol === 'file:') return;
  const authPanel = document.getElementById('cleanCloudAuth');
  const captchaArea = document.createElement('div');
  captchaArea.className = 'clean-auth-captcha';
  captchaArea.innerHTML = '<div class="clean-auth-captcha-widget"></div><p class="clean-auth-captcha-status" role="status" aria-live="polite"></p>';
  button.before(captchaArea);
  const captchaMount = captchaArea.querySelector('.clean-auth-captcha-widget');
  const captchaStatus = captchaArea.querySelector('.clean-auth-captcha-status');
  let captchaScriptPromise;
  let captchaRenderPromise;
  let captchaWidgetId = null;

  const style = document.createElement('style');
  style.textContent = `
    #cleanCloudAuth .clean-auth-captcha{width:100%;margin:12px 0 10px}
    #cleanCloudAuth .clean-auth-captcha-widget{max-width:100%;min-height:65px}
    #cleanCloudAuth .clean-auth-captcha-status{min-height:18px;margin:5px 0 0;color:#ffaaa2;font-size:12px;line-height:1.45}
    #cleanEmailCodeGate{position:fixed;inset:0;z-index:100000;display:none;place-items:center;overflow:auto;padding:20px;background:rgba(2,10,9,.94);backdrop-filter:blur(18px);font-family:Manrope,Arial,sans-serif;color:#f0fafa}
    #cleanEmailCodeGate.open{display:grid}
    #cleanEmailCodeGate .email-gate-card{width:min(460px,100%);padding:32px;border:1px solid rgba(0,184,179,.28);border-radius:24px;background:linear-gradient(155deg,#041f20,#050f10 76%);box-shadow:0 30px 100px #000a}
    #cleanEmailCodeGate .email-gate-brand{display:flex;align-items:center;gap:11px;margin-bottom:28px;font-weight:900;letter-spacing:.09em}
    #cleanEmailCodeGate .email-gate-mark{display:grid;place-items:center;width:42px;height:42px;border:1px solid #00867e;border-radius:13px;background:linear-gradient(145deg,#005551,#001f1e);color:#3dcec0;font-size:20px}
    #cleanEmailCodeGate h2{margin:0 0 8px;font-size:27px;letter-spacing:-.04em}
    #cleanEmailCodeGate p{margin:0;color:#92b1af;font-size:14px;line-height:1.65}
    #cleanEmailCodeGate .email-gate-address{color:#e1f5f2;font-weight:700;overflow-wrap:anywhere}
    #cleanEmailCodeGate .email-code-label{display:block;margin:23px 0 9px;color:#d4f1ef;font-size:12px;font-weight:750}
    #cleanEmailCodeGate .email-code-stage{position:relative;isolation:isolate;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));align-items:center;gap:7px;width:min(390px,100%);height:82px;margin:0 auto 12px}
    #cleanEmailCodeGate .email-code-slot{position:relative;z-index:1;display:grid;place-items:center;min-width:0;height:64px;border:1px solid #04665e;border-radius:13px;background:linear-gradient(155deg,#00403d,#001e1d 75%);box-shadow:0 12px 24px #0005,inset 0 1px #ffffff1a;transform-origin:center;transition:transform 560ms cubic-bezier(.2,.75,.17,1),border-color 220ms ease,background 220ms ease,box-shadow 220ms ease}
    #cleanEmailCodeGate .email-code-slot.filled{border-color:#00c3b6}
    #cleanEmailCodeGate .email-code-slot.current{border-color:#00beb2;box-shadow:0 0 0 3px #00afa828,0 12px 26px #0006}
    #cleanEmailCodeGate .email-code-slot.pop{animation:emailCodeDigitPop 230ms ease-out}
    #cleanEmailCodeGate .email-code-digit{color:#f0fafa;font-size:27px;font-weight:800;line-height:1}
    #cleanEmailCodeGate .email-code-stage.merging .email-code-slot{transform:translateX(var(--email-code-dx)) rotate(var(--email-code-tilt)) scale(.95)}
    #cleanEmailCodeGate .email-code-stage.merging .email-code-digit{opacity:0}
    #cleanEmailCodeGate .email-code-seal{position:absolute;z-index:10;top:50%;left:50%;display:grid;place-items:center;width:73px;height:73px;border:1px solid #1ecbbb;border-radius:17px;background:linear-gradient(145deg,#008177,#003331);box-shadow:0 18px 35px #0009,0 0 28px #00b1a851;opacity:0;transform:translate(-50%,-50%) scale(.72);transition:opacity 260ms ease,transform 360ms cubic-bezier(.2,.8,.2,1),background 220ms ease,box-shadow 220ms ease;pointer-events:none}
    #cleanEmailCodeGate .email-code-seal-glyph{color:#fff;font-size:29px;font-weight:800;line-height:1}
    #cleanEmailCodeGate .email-code-stage.checking .email-code-seal,#cleanEmailCodeGate .email-code-stage.success .email-code-seal,#cleanEmailCodeGate .email-code-stage.error .email-code-seal{opacity:1;transform:translate(-50%,-50%) scale(1)}
    #cleanEmailCodeGate .email-code-stage.checking .email-code-seal-glyph{animation:emailCodeChecking 650ms ease-in-out infinite alternate}
    #cleanEmailCodeGate .email-code-stage.success .email-code-slot,#cleanEmailCodeGate .email-code-stage.success .email-code-seal{border-color:#64e0a9;background:linear-gradient(145deg,#147b61,#0b372e);box-shadow:0 15px 35px #0008,0 0 31px #64e0a94a}
    #cleanEmailCodeGate .email-code-stage.error .email-code-slot,#cleanEmailCodeGate .email-code-stage.error .email-code-seal{border-color:#ff777a;background:linear-gradient(145deg,#9c3544,#461b2a);box-shadow:0 15px 35px #0008,0 0 28px #ff777a4a}
    #cleanEmailCodeGate .email-code-stage.error{animation:emailCodeErrorShake 330ms ease-in-out}
    #cleanEmailCodeGate .email-code-input{position:absolute;z-index:20;inset:0;width:100%;height:100%;padding:0;border:0;background:transparent;color:transparent;caret-color:transparent;opacity:.01;font-size:24px;cursor:text}
    #cleanEmailCodeGate .email-code-input:focus-visible{outline:2px solid #3fcfbe;outline-offset:4px;border-radius:14px}
    #cleanEmailCodeGate .email-gate-actions{display:grid;gap:9px}
    #cleanEmailCodeGate button{min-height:46px;border:1px solid #005551;border-radius:12px;background:#042120;color:#d4f1ef;font:700 13px Manrope,Arial,sans-serif;cursor:pointer}
    #cleanEmailCodeGate button.primary{border-color:#00a098;background:linear-gradient(135deg,#009996,#007575);color:#fff}
    #cleanEmailCodeGate button:disabled{opacity:.55;cursor:wait}
    #cleanEmailCodeGate .email-gate-status{min-height:21px;margin:12px 0 0;color:#58d1cb;font-size:12px}
    #cleanEmailCodeGate .email-gate-status.error{color:#ffaaa2}
    #cleanEmailCodeGate .email-gate-status.success{color:#64e0a9}
    #cleanEmailCodeGate .email-gate-footer{display:flex;justify-content:space-between;gap:10px;margin-top:14px}
    #cleanEmailCodeGate .email-gate-footer button{min-height:36px;padding:0 9px;border:0;background:none;color:#8aaba9;font-size:11px}
    @keyframes emailCodeDigitPop{50%{transform:translateY(-5px) scale(1.045)}}
    @keyframes emailCodeChecking{to{opacity:.45;transform:scale(.82)}}
    @keyframes emailCodeErrorShake{25%{translate:-5px}75%{translate:5px}}
    @media(max-width:520px){#cleanEmailCodeGate{padding:14px}#cleanEmailCodeGate .email-gate-card{padding:25px 20px;border-radius:20px}#cleanEmailCodeGate .email-code-stage{gap:5px}#cleanEmailCodeGate .email-code-slot{height:clamp(50px,12vw,64px)}#cleanEmailCodeGate .email-code-digit{font-size:clamp(21px,5vw,27px)}}
    @media(prefers-reduced-motion:reduce){#cleanEmailCodeGate .email-code-slot,#cleanEmailCodeGate .email-code-seal{transition:none}#cleanEmailCodeGate .email-code-slot.pop,#cleanEmailCodeGate .email-code-stage.error,#cleanEmailCodeGate .email-code-stage.checking .email-code-seal-glyph{animation:none}}
  `;
  document.head.append(style);

  const gate = document.createElement('div');
  gate.id = 'cleanEmailCodeGate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'cleanEmailGateTitle');
  gate.innerHTML = `
    <section class="email-gate-card">
      <div class="email-gate-brand"><span class="email-gate-mark">N</span><span>NEXA<span style="color:#00c8bb">WEB</span></span></div>
      <h2 id="cleanEmailGateTitle">Confirme seu acesso</h2>
      <p>Enviamos um código de seis números para <span class="email-gate-address"></span>. Digite-o para abrir sua conta.</p>
      <form class="email-gate-form" novalidate>
        <label class="email-code-label" for="cleanEmailCodeInput">Código de verificação</label>
        <div class="email-code-stage">
          <span class="email-code-slot" aria-hidden="true"><span class="email-code-digit"></span></span>
          <span class="email-code-slot" aria-hidden="true"><span class="email-code-digit"></span></span>
          <span class="email-code-slot" aria-hidden="true"><span class="email-code-digit"></span></span>
          <span class="email-code-slot" aria-hidden="true"><span class="email-code-digit"></span></span>
          <span class="email-code-slot" aria-hidden="true"><span class="email-code-digit"></span></span>
          <span class="email-code-slot" aria-hidden="true"><span class="email-code-digit"></span></span>
          <span class="email-code-seal" aria-hidden="true"><span class="email-code-seal-glyph">···</span></span>
          <input id="cleanEmailCodeInput" class="email-code-input" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" aria-describedby="cleanEmailCodeStatus" required>
        </div>
        <div class="email-gate-actions"><button class="primary email-gate-verify" type="submit">Validar código e entrar</button></div>
      </form>
      <p id="cleanEmailCodeStatus" class="email-gate-status" role="status" aria-live="polite"></p>
      <div class="email-gate-footer"><button type="button" class="email-gate-resend">Enviar outro código</button><button type="button" class="email-gate-logout">Sair da conta</button></div>
    </section>`;
  document.body.append(gate);

  const address = gate.querySelector('.email-gate-address');
  const input = gate.querySelector('input');
  const form = gate.querySelector('form');
  const verifyButton = gate.querySelector('.email-gate-verify');
  const resendButton = gate.querySelector('.email-gate-resend');
  const logoutButton = gate.querySelector('.email-gate-logout');
  const status = gate.querySelector('.email-gate-status');
  const codeStage = gate.querySelector('.email-code-stage');
  const codeSlots = [...gate.querySelectorAll('.email-code-slot')];
  const codeDigits = codeSlots.map(slot => slot.querySelector('.email-code-digit'));
  const codeSeal = gate.querySelector('.email-code-seal-glyph');
  let configPromise;
  let ephemeralClient;
  let persistentClient;
  let authSubscription;
  let currentSession = null;
  let currentUser = null;
  let activeSessionId = '';
  const verifiedInPage = new Set();
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const waitForMotion = ms => new Promise(resolve => setTimeout(resolve, reducedMotion?.matches ? 0 : ms));
  let verifying = false;
  function renderCode(animate = false) {
    const code = input.value.replace(/\D/g, '').slice(0, 6);
    if (input.value !== code) input.value = code;
    codeDigits.forEach((digit, index) => {
      const next = code[index] || '';
      if (animate && next && digit.textContent !== next) {
        codeSlots[index].classList.remove('pop');
        void codeSlots[index].offsetWidth;
        codeSlots[index].classList.add('pop');
      }
      digit.textContent = next;
      codeSlots[index].classList.toggle('filled', !!next);
      codeSlots[index].classList.toggle('current', !verifying && document.activeElement === input && index === Math.min(code.length, 5));
    });
    return code;
  }
  function resetCodeCards(clear = false) {
    codeStage.classList.remove('merging', 'checking', 'success', 'error');
    if (clear) input.value = '';
    codeSeal.textContent = '···';
    renderCode();
  }
  function mergeCodeCards() {
    const bounds = codeStage.getBoundingClientRect();
    const center = bounds.left + bounds.width / 2;
    codeSlots.forEach((slot, index) => {
      const rect = slot.getBoundingClientRect();
      slot.style.setProperty('--email-code-dx', `${center - (rect.left + rect.width / 2)}px`);
      slot.style.setProperty('--email-code-tilt', `${[-8, -5, -2, 2, 5, 8][index]}deg`);
      slot.style.zIndex = String(index + 1);
    });
    codeStage.classList.add('merging');
  }
  const reveal = (email, message = 'Enviamos um código de acesso para seu e-mail.') => {
    address.textContent = email || 'seu e-mail cadastrado';
    resetCodeCards(true);
    input.setAttribute('aria-invalid', 'false');
    say(message);
    gate.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { input.focus(); renderCode(); }, 80);
  };
  const say = (message, error = false, success = false) => {
    status.textContent = message;
    status.classList.toggle('error', error);
    status.classList.toggle('success', success);
    status.setAttribute('role', error ? 'alert' : 'status');
  };
  input.addEventListener('input', () => {
    renderCode(true);
    input.setAttribute('aria-invalid', 'false');
    if (status.classList.contains('error')) say('Digite o código e pressione Enter para verificar.');
  });
  input.addEventListener('focus', () => renderCode());
  input.addEventListener('blur', () => renderCode());
  async function config() {
    if (!configPromise) configPromise = fetch('/api/supabase-config').then(async response => {
      if (!response.ok) throw Error('Não foi possível carregar a configuração de login.');
      const value = await response.json();
      if (!value?.url || !value?.key) throw Error('A configuração do Supabase está incompleta.');
      return value;
    }).catch(error => { configPromise = null; throw error; });
    return configPromise;
  }
  async function prepareCaptcha() {
    if (captchaWidgetId !== null) return captchaWidgetId;
    if (captchaRenderPromise) return captchaRenderPromise;
    captchaRenderPromise = (async () => {
      const settings = await config();
      if (!settings.turnstileSiteKey) throw Error('A verificação de segurança ainda não está configurada.');
      if (!window.turnstile) {
        if (!captchaScriptPromise) captchaScriptPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(Error('Não foi possível carregar a verificação de segurança. Atualize a página.'));
          document.head.append(script);
        });
        await captchaScriptPromise;
      }
      captchaWidgetId = window.turnstile.render(captchaMount, {
        sitekey: settings.turnstileSiteKey,
        theme: 'dark',
        size: 'flexible',
        callback: () => { captchaStatus.textContent = ''; },
        'expired-callback': () => { captchaStatus.textContent = 'A verificação expirou. Confirme novamente.'; },
        'error-callback': () => { captchaStatus.textContent = 'Não foi possível confirmar a verificação. Tente novamente.'; },
      });
      if (captchaWidgetId === undefined || captchaWidgetId === null) throw Error('Não foi possível iniciar a verificação de segurança.');
      return captchaWidgetId;
    })().catch(error => { captchaRenderPromise = null; throw error; });
    return captchaRenderPromise;
  }
  const captchaVisible = () => authPanel?.classList.contains('open') || authPanel?.getAttribute('aria-hidden') === 'false';
  const captchaObserver = new MutationObserver(() => {
    if (captchaVisible()) prepareCaptcha().catch(error => { captchaStatus.textContent = error.message; });
  });
  captchaObserver.observe(authPanel, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });
  if (captchaVisible()) prepareCaptcha().catch(error => { captchaStatus.textContent = error.message; });
  async function captchaToken() {
    const widgetId = await prepareCaptcha();
    const token = window.turnstile.getResponse(widgetId);
    if (!token) throw Error('Confirme a verificação de segurança para continuar.');
    return token;
  }
  async function clients() {
    if (!persistentClient) persistentClient = await window.cleanGetAccountClient();
    const settings = await config();
    if (!ephemeralClient) ephemeralClient = window.supabase.createClient(settings.url, settings.key, { auth: { storageKey: 'clean-leads-email-verification-pending', persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    if (!authSubscription) {
      authSubscription = persistentClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) setTimeout(() => startChallenge({ ...session, persisted: true }, session.user?.email, true), 0);
      });
    }
    return { ephemeral: ephemeralClient, persistent: persistentClient };
  }
  async function call(action, session, extra = {}) {
    const response = await fetch('/api/email-login-code', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ action, ...extra }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = Error(result.error || 'Não foi possível concluir a verificação.');
      error.code = result.code;
      error.status = response.status;
      error.retryAfter = Number(response.headers.get('Retry-After') || 0);
      throw error;
    }
    return result;
  }
  function decodeSessionId(session) {
    try {
      const part = session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, '=')));
      return String(payload.session_id || '');
    } catch { return ''; }
  }
  async function persistAndReload(session) {
    say('Código confirmado. Abrindo sua conta…', false, true);
    verifyButton.disabled = true;
    if (session && !session.persisted) {
      const { persistent } = await clients();
      const { error } = await persistent.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
      if (error) throw error;
    }
    location.reload();
  }
  let challengePromise = null;
  async function startChallenge(session, email, send = true) {
    if (!session?.access_token) return;
    const sessionId = decodeSessionId(session);
    if (!sessionId) throw Error('Não foi possível identificar a sessão. Entre novamente.');
    if (verifiedInPage.has(sessionId)) return session.persisted ? undefined : persistAndReload(session);
    if (activeSessionId === sessionId && challengePromise) return challengePromise;
    if (activeSessionId === sessionId && gate.classList.contains('open')) return;
    activeSessionId = sessionId;
    currentSession = session;
    currentUser = email || session.user?.email || '';
    challengePromise = (async () => {
      try {
        const state = await call('status', session);
        if (state.verified) {
          verifiedInPage.add(sessionId);
          if (!session.persisted) await persistAndReload(session);
          return;
        }
        if (send) {
          const sent = await call('send', session);
          if (sent.verified) {
            verifiedInPage.add(sessionId);
            if (!session.persisted) await persistAndReload(session);
            return;
          }
          reveal(sent.emailHint || currentUser);
        } else reveal(currentUser);
      } catch (error) {
        reveal(currentUser, error.message);
        say(error.message, true);
      } finally { challengePromise = null; }
    })();
    return challengePromise;
  }
  async function submitCredentials() {
    if (button.disabled) return;
    const email = document.getElementById('cleanCloudEmail')?.value.trim();
    const password = document.getElementById('cleanCloudPassword')?.value || '';
    const name = document.getElementById('cleanCloudName')?.value.trim();
    const signup = !!document.querySelector('#cleanCloudAuth [data-auth-tab="signup"].active');
    if (!email || password.length < 6) return window.toast?.('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.');
    if (signup && !name) return window.toast?.('Informe seu nome para criar a conta.');
    button.disabled = true;
    const label = button.textContent;
    button.textContent = signup ? 'Criando conta…' : 'Verificando…';
    let captchaUsed = false;
    try {
      const { ephemeral } = await clients();
      const token = await captchaToken();
      captchaUsed = true;
      const result = signup
        ? await ephemeral.auth.signUp({ email, password, options: { data: { name }, captchaToken: token } })
        : await ephemeral.auth.signInWithPassword({ email, password, options: { captchaToken: token } });
      if (result.error) throw result.error;
      const session = result.data?.session;
      if (!session) {
        window.toast?.(signup ? 'Confirme seu e-mail de cadastro e depois entre para receber o código de acesso.' : 'Não foi possível iniciar a sessão. Entre novamente.');
        return;
      }
      session.persisted = false;
      currentUser = result.data?.user?.email || email;
      await startChallenge(session, currentUser, true);
    } catch (error) {
      const message = /invalid login credentials/i.test(error.message || '') ? 'E-mail ou senha incorretos.'
        : /email not confirmed/i.test(error.message || '') ? 'Confirme seu e-mail antes de entrar.'
        : /user already registered/i.test(error.message || '') ? 'Este e-mail já possui uma conta. Use a aba Entrar.'
        : error.message || 'Não foi possível acessar a conta.';
      const field = document.querySelector('#cleanCloudAuth .cloud-auth-error');
      if (field) { field.textContent = message; field.classList.add('show'); }
      else window.toast?.(message);
    } finally {
      if (captchaUsed && captchaWidgetId !== null) window.turnstile.reset(captchaWidgetId);
      button.disabled = false;
      button.textContent = label;
    }
  }
  document.addEventListener('click', event => {
    if (event.target.closest('#cleanCloudAuth .cloud-auth-submit') === button) {
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
      submitCredentials();
    }
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !gate.classList.contains('open') && event.target.closest?.('#cleanCloudAuth input')) {
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
      submitCredentials();
    }
  }, true);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (verifying) return;
    if (!currentSession) return say('Sua sessão expirou. Entre novamente.', true);
    const code = renderCode();
    if (code.length !== 6) {
      input.setAttribute('aria-invalid', 'true');
      say('Digite os seis números do código.', true);
      input.focus();
      return;
    }
    verifying = true;
    input.readOnly = true;
    renderCode();
    verifyButton.disabled = true;
    resendButton.disabled = true;
    logoutButton.disabled = true;
    say('Juntando as cartas…');
    try {
      mergeCodeCards();
      const verification = call('verify', currentSession, { code }).then(
        result => result?.verified === true
          ? { ok: true }
          : { ok: false, error: Object.assign(Error('Não foi possível confirmar o código. Tente novamente.'), { code: 'EMAIL_CODE_INVALID' }) },
        error => ({ ok: false, error })
      );
      await waitForMotion(560);
      codeStage.classList.add('checking');
      say('Verificando código…');
      const result = await verification;
      codeStage.classList.remove('checking');
      if (!result.ok) {
        if (['EMAIL_CODE_INVALID', 'INVALID_CODE_FORMAT'].includes(result.error.code)) {
          codeStage.classList.add('error');
          codeSeal.textContent = '×';
          say(result.error.message, true);
          await waitForMotion(800);
          resetCodeCards(true);
          input.setAttribute('aria-invalid', 'true');
          input.focus();
        } else {
          resetCodeCards();
          say(result.error.message, true);
          input.focus();
        }
        return;
      }
      codeStage.classList.add('success');
      codeSeal.textContent = '✓';
      say('Código confirmado. Abrindo sua conta…', false, true);
      const sessionId = decodeSessionId(currentSession);
      verifiedInPage.add(sessionId);
      await waitForMotion(700);
      await persistAndReload(currentSession);
    } catch (error) {
      resetCodeCards();
      say(error.message || 'Não foi possível verificar o código.', true);
    } finally {
      verifying = false;
      input.readOnly = false;
      verifyButton.disabled = false;
      resendButton.disabled = false;
      logoutButton.disabled = false;
      renderCode();
    }
  });
  resendButton.addEventListener('click', async () => {
    if (verifying) return;
    if (!currentSession) return say('Sua sessão expirou. Entre novamente.', true);
    resendButton.disabled = true;
    say('Enviando outro código…');
    try {
      const result = await call('send', currentSession);
      if (result.verified) return persistAndReload(currentSession);
      say(`Novo código enviado para ${result.emailHint || currentUser}.`);
      resetCodeCards(true);
      input.setAttribute('aria-invalid', 'false');
      input.focus();
    } catch (error) { say(error.message, true); }
    finally { resendButton.disabled = false; }
  });
  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    try {
      const { ephemeral, persistent } = await clients();
      if (currentSession?.persisted) await persistent.auth.signOut({ scope: 'local' });
      else if (currentSession) await ephemeral.auth.signOut({ scope: 'local' });
    } catch {}
    location.reload();
  });

  async function resumeExistingSession() {
    try {
      const { persistent } = await clients();
      const { data, error } = await persistent.auth.getSession();
      if (error || !data.session) return;
      const session = { ...data.session, persisted: true };
      currentSession = session;
      currentUser = session.user?.email || '';
      const id = decodeSessionId(session);
      if (!id) return;
      const state = await call('status', session);
      if (state.verified) return;
      await startChallenge(session, session.user?.email, true);
    } catch (error) {
      if (error.code === 'SESSION_EXPIRED') return;
      reveal(currentUser, error.message);
      say(error.message, true);
    }
  }
  resumeExistingSession();
})();
