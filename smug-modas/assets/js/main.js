// SMUG MODAS — interações (sem dependências).
// O site continua legível e navegável se este arquivo não carregar.

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Header: estado "na hero" × "após a hero" ---------- */
// A troca acontece quando o fim da hero (início da segunda seção) cruza a base do header fixo.
// A hero inteira é observada (um alvo grande não é "pulado" por saltos de âncora) contra duas
// linhas: a base do header, para entrar no estado "após a hero", e HERO_HYSTERESIS px abaixo
// dela, para voltar. Essa folga evita alternância repetida perto do limite.
// Nenhum cálculo roda a cada pixel de scroll.
const HERO_HYSTERESIS = 16;

function initHeader() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('.hero');
  if (!header || !hero) return;

  const topMarker = document.createElement('span');
  topMarker.setAttribute('aria-hidden', 'true');
  Object.assign(topMarker.style, { position: 'absolute', top: '8px', left: '0', width: '1px', height: '1px', pointerEvents: 'none' });
  hero.append(topMarker);

  // Até a primeira interação, mudanças de estado vêm do navegador (página aberta já rolada,
  // âncora na URL, restauração do scroll) e são aplicadas sem animação.
  header.classList.add('is-instant');
  const interaction = new AbortController();
  const enableTransitions = () => {
    header.classList.remove('is-instant');
    interaction.abort();
  };
  for (const type of ['pointerdown', 'wheel', 'touchstart', 'keydown']) {
    window.addEventListener(type, enableTransitions, { passive: true, capture: true, signal: interaction.signal });
  }

  // Véu creme leve ao começar a rolar dentro da hero
  new IntersectionObserver((entries) => {
    const entry = entries.at(-1);
    header.classList.toggle('is-scrolled', !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }).observe(topMarker);

  let heroObservers = [];
  let headerHeight = 0;
  const observeHeroEnd = () => {
    headerHeight = header.offsetHeight;
    heroObservers.forEach((o) => o.disconnect());
    // Área observada começando na base do header: a hero deixou de aparecer abaixo dele → após a hero
    const leave = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry.isIntersecting && entry.boundingClientRect.bottom <= headerHeight + 1) {
          header.classList.add('is-past-hero');
        }
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px` }
    );
    // Área começando HERO_HYSTERESIS px abaixo do header: a hero voltou a aparecer → estado inicial
    const back = new IntersectionObserver(
      (entries) => {
        if (entries.at(-1).isIntersecting) header.classList.remove('is-past-hero');
      },
      { rootMargin: `-${headerHeight + HERO_HYSTERESIS}px 0px 0px 0px` }
    );
    leave.observe(hero);
    back.observe(hero);
    heroObservers = [leave, back];
  };
  observeHeroEnd();
  // A altura do header muda entre mobile e desktop: refaz a linha de referência
  new ResizeObserver(() => {
    if (header.offsetHeight !== headerHeight) observeHeroEnd();
  }).observe(header);

  // Link ativo na navegação desktop
  const links = new Map(
    [...document.querySelectorAll('[data-nav-link]')].map((a) => [a.getAttribute('href').slice(1), a])
  );
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute('aria-current'));
        links.get(entry.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/* ---------- Foco no título da seção após navegar por âncora ---------- */
function focusSection(target) {
  const heading = target.querySelector('h1, h2') || target;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

/* ---------- Menu mobile (dialog modal) ---------- */
function initMenu() {
  const dialog = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  if (!dialog || !openBtn || typeof dialog.showModal !== 'function') return;
  const closeBtn = dialog.querySelector('[data-menu-close]');
  let closeTimer;

  const open = () => {
    clearTimeout(closeTimer);
    dialog.classList.remove('is-open');
    dialog.showModal();
    root.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
  };

  const close = ({ returnFocus = true, then } = {}) => {
    if (!dialog.open) return;
    dialog.classList.remove('is-open');
    const finish = () => {
      dialog.close();
      root.classList.remove('menu-open');
      openBtn.setAttribute('aria-expanded', 'false');
      if (returnFocus) openBtn.focus();
      then?.();
    };
    closeTimer = setTimeout(finish, reducedMotion.matches ? 0 : 380);
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());
  // Escape
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  // Clique fora do painel
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  // Selecionar uma seção: fecha, rola até ela e leva o foco ao título
  dialog.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      close({
        returnFocus: false,
        then: () => {
          target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
          history.pushState(null, '', link.getAttribute('href'));
          focusSection(target);
        },
      });
    });
  });
  // Links externos (WhatsApp, Instagram): abrem em nova aba e o menu fecha
  dialog.querySelectorAll('a:not([href^="#"])').forEach((link) => {
    link.addEventListener('click', () => close());
  });
  // Ao passar para a navegação completa (mesmo ponto de quebra do CSS), o menu deixa de existir
  window.matchMedia('(min-width: 75em)').addEventListener('change', (e) => {
    if (e.matches) close({ returnFocus: false });
  });
}

/* ---------- Revelação ao rolar (uma vez) ---------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (reducedMotion.matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px' }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Hero: ambiente e profundidade ---------- */
// Animações contínuas (folhas e sol) param quando a hero sai da tela
function initAnimScopes() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.classList.toggle('is-paused', !entry.isIntersecting);
  });
  document.querySelectorAll('[data-anim-scope]').forEach((el) => observer.observe(el));
}

// Profundidade sutil ao mover o mouse (--mx/--my), só em desktop com mouse.
// Ao rolar, as camadas não se deslocam: a hero sobe inteira.
function initHeroDepth() {
  const hero = document.querySelector('.hero');
  const desktopMouse = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
  if (!hero || reducedMotion.matches || !desktopMouse.matches) return;
  let inView = true;
  let frame = 0;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  const render = () => {
    frame = 0;
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    hero.style.setProperty('--mx', current.x.toFixed(4));
    hero.style.setProperty('--my', current.y.toFixed(4));
    if (Math.abs(target.x - current.x) > 0.002 || Math.abs(target.y - current.y) > 0.002) request();
  };
  const request = () => {
    if (!frame && inView) frame = requestAnimationFrame(render);
  };

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    request();
  }).observe(hero);
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    request();
  });
  hero.addEventListener('pointerleave', () => {
    target.x = 0;
    target.y = 0;
    request();
  });
}

/* ---------- WhatsApp flutuante ---------- */
// Aparece depois da hero e some perto do contato e do rodapé, que já trazem o link.
function initWhatsappFloat() {
  const button = document.querySelector('[data-wa-float]');
  const hero = document.querySelector('.hero');
  if (!button || !hero) return;
  const nearby = new Set();
  let heroVisible = true;
  const update = () => button.classList.toggle('is-visible', !heroVisible && nearby.size === 0);

  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    update();
  }).observe(hero);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.isIntersecting ? nearby.add(entry.target) : nearby.delete(entry.target);
    update();
  });
  document.querySelectorAll('#contato, .site-footer').forEach((el) => observer.observe(el));
}

/* ---------- Formulário de contato ---------- */
// Só existe quando há um serviço real de envio (form.endpoint). A confirmação aparece apenas
// quando o servidor responde com sucesso; em caso de erro, nada do que foi digitado é apagado.
const MESSAGES = {
  nome: { valueMissing: 'Informe seu nome.', tooShort: 'O nome precisa ter pelo menos 2 letras.' },
  email: { valueMissing: 'Informe seu e-mail.', typeMismatch: 'Digite um e-mail válido, como nome@exemplo.com.' },
  telefone: { pattern: 'Informe um telefone com DDD (10 ou 11 dígitos) ou deixe em branco.' },
  mensagem: { valueMissing: 'Escreva sua mensagem.', tooShort: 'Sua mensagem precisa ter pelo menos 10 caracteres.' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(input) {
  const value = input.value.trim();
  const rules = MESSAGES[input.name] || {};
  let error = '';
  if (input.required && !value) error = rules.valueMissing;
  else if (value && input.minLength > 0 && value.length < input.minLength) error = rules.tooShort;
  else if (value && input.type === 'email' && !EMAIL_RE.test(value)) error = rules.typeMismatch;
  else if (value && input.type === 'tel') {
    const digits = value.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
    if (digits.length < 10 || digits.length > 11) error = rules.pattern;
  }
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  if (errorEl) errorEl.textContent = error || '';
  if (error) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  return !error;
}

function initForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  form.noValidate = true; // validação própria, com mensagens em português
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const idleLabel = submitLabel.textContent;
  const fields = [...form.querySelectorAll('.field__input')];
  let attempted = false;
  let sending = false;

  const setStatus = (text, state = 'info') => {
    status.dataset.state = state;
    status.textContent = text;
  };
  const setBusy = (busy) => {
    sending = busy;
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submitLabel.textContent = busy ? 'Enviando…' : idleLabel;
  };

  fields.forEach((input) => {
    input.addEventListener('blur', () => { if (attempted || input.value) validateField(input); });
    input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) validateField(input); });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    attempted = true;
    const results = fields.map(validateField);
    if (results.includes(false)) {
      setStatus('Revise os campos destacados para continuar.', 'error');
      fields[results.indexOf(false)].focus();
      return;
    }

    const formData = new FormData(form);
    if (formData.get('_gotcha')) return; // armadilha anti-spam preenchida por robôs
    formData.delete('_gotcha');
    const data = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, String(v).trim()]));

    setBusy(true);
    setStatus('Enviando sua mensagem…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const isJson = form.dataset.format === 'json';
      const response = await fetch(form.action, {
        method: 'POST',
        headers: isJson ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
        body: isJson ? JSON.stringify(data) : formData,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      attempted = false;
      setStatus('Mensagem enviada! Obrigada pelo contato — responderemos o mais breve possível.', 'success');
    } catch (error) {
      setStatus(
        error.name === 'AbortError'
          ? 'O envio demorou mais que o esperado e não foi concluído. Verifique sua conexão e tente novamente.'
          : 'Não foi possível enviar sua mensagem agora. O que você escreveu continua no formulário — tente novamente em instantes.',
        'error'
      );
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  });
}

initHeader();
initMenu();
initReveal();
initAnimScopes();
initHeroDepth();
initWhatsappFloat();
initForm();
window.__smugReady = true;
