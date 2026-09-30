/* =========================================================================
   MUNDO SOLAR — interações do site
   ========================================================================= */

/**
 * EDITAR: dados de contato da empresa.
 * Enquanto um campo estiver vazio, o site exibe o placeholder correspondente e
 * os botões de WhatsApp abrem o formulário de orçamento.
 */
const SITE_CONFIG = {
  // Número com DDI + DDD, somente dígitos. Ex.: '5500000000000'
  whatsapp: '',
  // Como o número aparece no rodapé. Ex.: '(00) 00000-0000'
  whatsappDisplay: '',
  // Usuário do Instagram, sem @. Ex.: 'mundosolar'
  instagram: '',
  // E-mail de atendimento. Ex.: 'contato@seudominio.com.br'
  email: '',
  // Mensagem inicial das conversas pelo WhatsApp
  whatsappMessage: 'Olá, Mundo Solar! Gostaria de saber mais sobre energia solar.',
};

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopMQ = window.matchMedia('(min-width: 900px)');
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const digits = (v) => String(v || '').replace(/\D/g, '');
  const hasWhatsApp = digits(SITE_CONFIG.whatsapp).length >= 10;
  const waLink = (text) =>
    `https://wa.me/${digits(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(text || SITE_CONFIG.whatsappMessage)}`;

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Contatos do rodapé ---------- */
  const contacts = {
    whatsapp: hasWhatsApp && {
      href: waLink(),
      label: SITE_CONFIG.whatsappDisplay || `+${digits(SITE_CONFIG.whatsapp)}`,
      external: true,
    },
    instagram: SITE_CONFIG.instagram && {
      href: `https://www.instagram.com/${SITE_CONFIG.instagram.replace(/^@/, '')}/`,
      label: `@${SITE_CONFIG.instagram.replace(/^@/, '')}`,
      external: true,
    },
    email: SITE_CONFIG.email && {
      href: `mailto:${SITE_CONFIG.email}`,
      label: SITE_CONFIG.email,
      external: false,
    },
  };
  $$('[data-contact]').forEach((a) => {
    const c = contacts[a.dataset.contact];
    if (!c) return;
    a.href = c.href;
    if (c.external) { a.target = '_blank'; a.rel = 'noopener'; }
    const value = $('[data-contact-value]', a);
    if (value) value.textContent = c.label;
  });

  /* ---------- Modal de orçamento ---------- */
  const dialog = $('[data-quote]');
  const form = $('[data-quote-form]');
  const status = $('[data-quote-status]');
  const canDialog = !!(dialog && typeof dialog.showModal === 'function');

  const openQuote = (tipo) => {
    if (!canDialog) return false;
    if (tipo && form) {
      const radio = $$('input[name="tipo"]', form).find((r) => r.value === tipo);
      if (radio) radio.checked = true;
    }
    if (status) status.textContent = '';
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return true;
  };

  if (canDialog) {
    dialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    $$('[data-quote-close]', dialog).forEach((b) => b.addEventListener('click', () => dialog.close()));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const required = ['nome', 'cidade'];
      let firstInvalid = null;
      required.forEach((name) => {
        const input = form.elements[name];
        const ok = String(data.get(name) || '').trim().length > 1;
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        status.textContent = 'Preencha seu nome e a cidade da instalação para continuar.';
        firstInvalid.focus();
        return;
      }

      const lines = [
        'Olá, Mundo Solar! Gostaria de solicitar um orçamento de energia solar.',
        '',
        `Nome: ${String(data.get('nome')).trim()}`,
        `Cidade: ${String(data.get('cidade')).trim()}`,
        `Tipo de imóvel: ${data.get('tipo')}`,
      ];
      const consumo = String(data.get('consumo') || '').trim();
      const msg = String(data.get('mensagem') || '').trim();
      if (consumo) lines.push(`Consumo médio / conta: ${consumo}`);
      if (msg) lines.push(`Mensagem: ${msg}`);
      const text = lines.join('\n');

      if (hasWhatsApp) {
        window.open(waLink(text), '_blank', 'noopener');
        status.textContent = 'Abrimos o WhatsApp com a sua mensagem. É só enviar!';
      } else if (SITE_CONFIG.email) {
        window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent('Orçamento de energia solar')}&body=${encodeURIComponent(text)}`;
        status.textContent = 'Abrimos o seu aplicativo de e-mail com a solicitação.';
      } else {
        status.textContent = 'Nossos canais de atendimento estão sendo configurados. Por favor, tente novamente em breve.';
      }
    });
    $$('input', form).forEach((input) =>
      input.addEventListener('input', () => input.removeAttribute('aria-invalid'))
    );
  }

  /* ---------- Menu mobile ---------- */
  const body = document.body;
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  const toggleLabel = toggle && $('.sr-only', toggle);
  // Conteúdo atrás do menu aberto fica inativo para teclado e leitores de tela.
  const behindMenu = $$('main, .site-footer, .wa-float, .skip-link');

  const setMenu = (open, { focusToggle = false } = {}) => {
    if (!toggle || !menu) return;
    body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
    behindMenu.forEach((el) => el.toggleAttribute('inert', open));
    if (open) {
      menu.removeAttribute('inert');
      const first = $('a', menu);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    } else {
      menu.setAttribute('inert', '');
      if (focusToggle) toggle.focus();
    }
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(!body.classList.contains('nav-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) setMenu(false, { focusToggle: true });
    });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Botões de orçamento e WhatsApp ---------- */
  $$('[data-open-quote]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (openQuote(el.dataset.openQuote)) e.preventDefault();
    });
  });

  $$('[data-wa]').forEach((el) => {
    if (hasWhatsApp) {
      el.href = waLink();
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      // Sem número configurado: direciona para o formulário de orçamento.
      el.addEventListener('click', (e) => { if (openQuote()) e.preventDefault(); });
    }
  });

  /* ---------- Revelação no scroll ---------- */
  const revealEls = $$('[data-reveal]');
  const finishReveal = (el) => {
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.removeEventListener('transitionend', done);
      // Libera o elemento para as transições próprias (hover etc.).
      el.removeAttribute('data-reveal');
    });
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => { el.classList.add('is-in'); el.removeAttribute('data-reveal'); });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        finishReveal(el);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const final = el.dataset.count;
    if (!Number.isFinite(target) || reduceMotion) { el.textContent = final; return; }
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = String(Math.round(target * (t === 1 ? 1 : eased)));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = final; // garante o valor exato informado
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Scrollspy ---------- */
  const navLinks = $$('.nav__link');
  const linkFor = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const spySections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = linkFor.get(entry.target.id);
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll: header, timeline, parallax, WhatsApp flutuante ---------- */
  const header = $('[data-header]');
  const waFloat = $('.wa-float');
  const footer = $('.site-footer');
  const timeline = $('[data-timeline]');
  const steps = timeline ? $$('[data-step]', timeline) : [];
  const parallaxEls = $$('[data-parallax]');

  const updateTimeline = (vh) => {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    let p;
    if (desktopMQ.matches) {
      p = (vh * 0.85 - rect.top) / (vh * 0.45);
    } else {
      p = (vh * 0.7 - rect.top) / rect.height;
    }
    p = reduceMotion ? 1 : clamp(p, 0, 1);
    timeline.style.setProperty('--p', p.toFixed(4));
    const n = steps.length;
    steps.forEach((step, i) => {
      const threshold = desktopMQ.matches ? i / (n - 1) : (i + 0.15) / n;
      step.classList.toggle('is-active', p >= threshold - 0.001);
    });
  };

  const updateParallax = (vh) => {
    if (reduceMotion || !desktopMQ.matches) {
      parallaxEls.forEach((el) => { el.style.transform = ''; });
      return;
    }
    parallaxEls.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const offset = clamp((rect.top + rect.height / 2 - vh / 2) * -factor, -60, 60);
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (header) header.classList.toggle('is-scrolled', y > 20);
      if (waFloat) {
        const nearFooter = footer && footer.getBoundingClientRect().top < vh - 40;
        waFloat.classList.toggle('is-visible', y > vh * 0.75 && !nearFooter);
      }
      updateTimeline(vh);
      updateParallax(vh);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  desktopMQ.addEventListener('change', onScroll);
  onScroll();

  /* ---------- FAQ (accordion com animação) ---------- */
  $$('[data-accordion]').forEach((item) => {
    const summary = $('summary', item);
    const content = $('.faq-item__content', item);
    if (!summary || !content || reduceMotion || !content.animate) return;
    let anim = null;
    const timing = { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (anim) anim.cancel();
      if (item.open && !item.classList.contains('is-closing')) {
        const h = content.offsetHeight;
        item.classList.add('is-closing');
        anim = content.animate({ height: [`${h}px`, '0px'], opacity: [1, 0] }, { ...timing, fill: 'forwards' });
        anim.onfinish = () => {
          item.open = false;
          item.classList.remove('is-closing');
          anim.cancel();
          anim = null;
        };
      } else {
        item.classList.remove('is-closing');
        item.open = true;
        const h = content.scrollHeight;
        anim = content.animate({ height: ['0px', `${h}px`], opacity: [0, 1] }, timing);
        anim.onfinish = () => { anim = null; };
      }
    });
  });
})();
