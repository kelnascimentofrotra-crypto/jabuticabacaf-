// SMUG MODAS — interações (sem dependências).
// O site continua legível e navegável se este arquivo não carregar.

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Header: fundo ao rolar + tom da seção abaixo ---------- */
function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const sections = [...document.querySelectorAll('main > section[data-tone], .site-footer')];
  let ticking = false;

  const update = () => {
    ticking = false;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    const probe = header.offsetHeight / 2;
    const current = sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    header.dataset.tone = current ? current.dataset.tone : 'light';
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

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
  // Ao passar para o layout desktop, o menu deixa de existir
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
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
initMenu();
initReveal();
initForm();
window.__smugReady = true;
