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
  // Ao passar para a navegação completa (mesmo ponto de quebra do CSS), o menu deixa de existir
  window.matchMedia('(min-width: 75em)').addEventListener('change', (e) => {
    if (e.matches) close({ returnFocus: false });
  });
  return { isOpen: () => dialog.open, close };
}

/* ---------- Ações da loja: aviso de versão de demonstração ---------- */
function initDemoActions(menu) {
  const toast = document.querySelector('[data-demo-toast]');
  const live = document.querySelector('[data-demo-live]');
  if (!toast || !live) return;
  const text = toast.querySelector('[data-demo-text]');
  const iconSlot = toast.querySelector('[data-demo-icon]');
  let hideTimer;

  const hide = () => {
    clearTimeout(hideTimer);
    toast.classList.remove('is-visible');
  };
  const show = (button) => {
    const message = toast.dataset.template.replace('{feature}', button.dataset.demo);
    text.textContent = message;
    iconSlot.innerHTML = button.querySelector('svg')?.outerHTML ?? '';
    toast.classList.add('is-visible');
    // Região viva separada: o anúncio acontece mesmo se o aviso já estiver na tela
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = `Versão de demonstração. ${message}`; });
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 6000);
  };

  document.querySelectorAll('[data-demo]').forEach((button) => {
    button.addEventListener('click', () => {
      // Dentro do menu mobile: fecha o menu antes, para o aviso não ficar escondido atrás dele
      if (menu?.isOpen() && button.closest('[data-menu]')) menu.close({ then: () => show(button) });
      else show(button);
    });
  });
  toast.querySelector('[data-demo-close]').addEventListener('click', hide);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toast.classList.contains('is-visible') && !menu?.isOpen()) hide();
  });
}

/* ---------- Revelação ao rolar (uma vez) ---------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal], [data-write]');
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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Cinema: parallax, inclinação 3D e pausa fora da tela ---------- */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Animações contínuas (luz, poeira, faixa) param quando a área sai da tela
function initAnimScopes() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.classList.toggle('is-paused', !entry.isIntersecting);
  });
  document.querySelectorAll('[data-anim-scope]').forEach((el) => observer.observe(el));
}

// Hero: profundidade ao rolar (--p) e ao mover o mouse (--mx/--my), suavizada a cada quadro
function initHeroDepth() {
  const hero = document.querySelector('.hero');
  if (!hero || reducedMotion.matches) return;
  let inView = true;
  let frame = 0;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  const render = () => {
    frame = 0;
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    const progress = clamp(window.scrollY / hero.offsetHeight, 0, 1);
    hero.style.setProperty('--p', progress.toFixed(4));
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
  window.addEventListener('scroll', request, { passive: true });
  hero.addEventListener('pointermove', (event) => {
    if (!finePointer.matches) return;
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

// Fotos com leve deslocamento ao rolar ([data-parallax] = fração da altura da foto)
function initParallax() {
  const items = [...document.querySelectorAll('[data-parallax]')];
  if (!items.length || reducedMotion.matches) return;
  const visible = new Set();
  let frame = 0;
  const render = () => {
    frame = 0;
    const vh = window.innerHeight;
    for (const el of visible) {
      const rect = el.getBoundingClientRect();
      const progress = clamp((rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2), -1, 1);
      el.style.setProperty('--py', `${(-progress * parseFloat(el.dataset.parallax) * rect.height).toFixed(1)}px`);
    }
  };
  const request = () => {
    if (!frame && visible.size) frame = requestAnimationFrame(render);
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
    request();
  });
  items.forEach((el) => observer.observe(el));
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
}

// Cards de categoria: inclinação 3D e brilho que seguem o cursor (só com mouse)
function initTilt() {
  if (reducedMotion.matches) return;
  document.querySelectorAll('.cat-card__link').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (!finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--ry', `${((x - 0.5) * 8).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// Barra de progresso: CSS (animation-timeline) quando suportado; senão, JS leve
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar || CSS.supports('animation-timeline: scroll()')) return;
  let frame = 0;
  const render = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(render); }, { passive: true });
  render();
}

/* ---------- Formulário de contato ---------- */
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

function buildText(data) {
  const lines = [`Olá, SMUG MODAS! Meu nome é ${data.nome}.`];
  if (data.interesse) lines.push(`Interesse: ${data.interesse}.`);
  lines.push('', data.mensagem, '', `E-mail: ${data.email}`);
  if (data.telefone) lines.push(`Telefone: ${data.telefone}`);
  return lines.join('\n');
}

function initForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const mode = form.dataset.mode;
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const idleLabel = submitLabel.textContent;
  const fields = [...form.querySelectorAll('.field__input')];
  const interestField = form.querySelector('[data-interest-field]');
  const messageField = form.querySelector('[name="mensagem"]');
  let attempted = false;
  let lastPrefill = '';

  const setStatus = (text, state = 'info') => {
    status.dataset.state = state;
    status.textContent = text;
  };
  const setBusy = (busy) => {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submitLabel.textContent = busy ? 'Enviando…' : idleLabel;
  };

  fields.forEach((input) => {
    input.addEventListener('blur', () => { if (attempted || input.value) validateField(input); });
    input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) validateField(input); });
  });

  // Cards de categoria sem catálogo: preenche o interesse na mensagem
  document.querySelectorAll('[data-interest]').forEach((link) => {
    link.addEventListener('click', () => {
      const interest = link.dataset.interest;
      interestField.value = interest;
      const prefill = `Olá! Tenho interesse em ${interest}. `;
      if (!messageField.value.trim() || messageField.value === lastPrefill) {
        messageField.value = prefill;
        lastPrefill = prefill;
      }
      setStatus(`Interesse em “${interest}” adicionado à sua mensagem. Complete o formulário para falar com a equipe.`);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    attempted = true;
    const results = fields.map(validateField);
    if (results.includes(false)) {
      const firstInvalid = fields[results.indexOf(false)];
      setStatus('Revise os campos destacados para continuar.', 'error');
      firstInvalid.focus();
      return;
    }

    const formData = new FormData(form);
    if (formData.get('_gotcha')) return; // armadilha anti-spam preenchida por robôs
    const data = Object.fromEntries(
      [...formData.entries()].filter(([k]) => k !== '_gotcha').map(([k, v]) => [k, String(v).trim()])
    );

    if (mode === 'endpoint') {
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
        interestField.value = '';
        attempted = false;
        setStatus('Mensagem enviada! Obrigada pelo contato — responderemos o mais breve possível.', 'success');
      } catch (error) {
        setStatus(
          error.name === 'AbortError'
            ? 'O envio demorou mais que o esperado e não foi concluído. Verifique sua conexão e tente novamente.'
            : 'Não foi possível enviar sua mensagem agora. Seus dados continuam no formulário — tente novamente em instantes.',
          'error'
        );
      } finally {
        clearTimeout(timeout);
        setBusy(false);
      }
      return;
    }

    if (mode === 'whatsapp') {
      const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(buildText(data))}`;
      // Sem 'noopener' nas features: com ele, window.open sempre retorna null.
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      setStatus(
        win === null
          ? 'Não conseguimos abrir o WhatsApp automaticamente. Verifique se o navegador bloqueou a nova aba.'
          : 'Abrimos o WhatsApp com a sua mensagem. Para concluir, toque em enviar na conversa.',
        win === null ? 'error' : 'info'
      );
      return;
    }

    if (mode === 'email') {
      const subject = encodeURIComponent(`Contato pelo site — ${data.nome}`);
      window.location.href = `mailto:${form.dataset.email}?subject=${subject}&body=${encodeURIComponent(buildText(data))}`;
      setStatus('Abrimos o seu aplicativo de e-mail com a mensagem pronta. Para concluir, confirme o envio por lá.');
      return;
    }

    setStatus('O envio on-line ainda não está disponível. Sua mensagem não foi enviada — por favor, tente novamente mais tarde.', 'error');
  });
}

initHeader();
const menu = initMenu();
initDemoActions(menu);
initReveal();
initAnimScopes();
initHeroDepth();
initParallax();
initTilt();
initScrollProgress();
initForm();
window.__smugReady = true;
