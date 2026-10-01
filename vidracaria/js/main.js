(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.getElementById('menu');
  const toggle = document.querySelector('[data-menu-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp ----------
     O número fica no atributo data-whatsapp do <body>. */
  const phone = (document.body.dataset.whatsapp || '').replace(/\D/g, '');
  const waUrl = (text) => `https://wa.me/${phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  if (phone) {
    document.querySelectorAll('[data-wa]').forEach((link) => {
      link.href = waUrl(link.dataset.wa);
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  // Formata o número para exibição: 5511987654321 -> (11) 98765-4321
  const formatPhone = (digits) => {
    const d = digits.replace(/^55(?=\d{10,11}$)/, '');
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return digits;
  };
  if (phone) {
    document.querySelectorAll('[data-wa-display]').forEach((el) => { el.textContent = formatPhone(phone); });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Cabeçalho e botão flutuante ao rolar ---------- */
  // O botão flutuante some no topo da página e quando o contato/rodapé já estão na tela.
  const waFloat = document.querySelector('.wa-float');
  const nearContact = new Set();
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    if (waFloat) {
      waFloat.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && nearContact.size === 0);
    }
  };
  if (waFloat && 'IntersectionObserver' in window) {
    const contactObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) nearContact.add(entry.target);
        else nearContact.delete(entry.target);
      });
      onScroll();
    }, { rootMargin: '0px 0px -25% 0px' });
    document.querySelectorAll('#contato, .footer').forEach((el) => contactObs.observe(el));
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Link ativo conforme a seção visível ---------- */
  const links = [...document.querySelectorAll('.nav__link')];
  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  setActive('inicio');
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Carrossel de avaliações ---------- */
  const track = document.querySelector('[data-slider]');
  if (track) {
    const prev = document.querySelector('[data-slide="prev"]');
    const next = document.querySelector('[data-slide="next"]');
    const step = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
    next.addEventListener('click', () => track.scrollBy({ left: step() }));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step() }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step() }); }
    });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Formulário de contato (envia pelo WhatsApp) ---------- */
  const maskPhone = (value) => {
    const d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  document.querySelectorAll('[data-phone]').forEach((input) => {
    input.addEventListener('input', () => { input.value = maskPhone(input.value); });
  });

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const setInvalid = (input, invalid) => {
      const field = input.closest('.field');
      field.classList.toggle('is-invalid', invalid);
      input.setAttribute('aria-invalid', String(invalid));
      if (invalid) input.setAttribute('aria-describedby', `${input.id}-erro`);
      else input.removeAttribute('aria-describedby');
    };
    const checks = {
      nome: (v) => v.trim().length >= 2,
      telefone: (v) => v.replace(/\D/g, '').length >= 10,
    };
    Object.keys(checks).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('is-invalid')) setInvalid(input, !checks[name](input.value));
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      Object.entries(checks).forEach(([name, check]) => {
        const input = form.elements[name];
        const invalid = !check(input.value);
        setInvalid(input, invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = new FormData(form);
      const lines = [
        `Olá! Meu nome é ${data.get('nome').trim()} e gostaria de um orçamento.`,
        `Telefone: ${data.get('telefone').trim()}`,
      ];
      if (data.get('servico')) lines.push(`Serviço: ${data.get('servico')}`);
      if (data.get('cidade').trim()) lines.push(`Cidade/Bairro: ${data.get('cidade').trim()}`);
      if (data.get('mensagem').trim()) lines.push('', data.get('mensagem').trim());

      window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------- Contadores ---------- */
  const format = (n) => n.toLocaleString('pt-BR');
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = prefix + format(target) + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Animações de entrada ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const counters = document.querySelectorAll('[data-count]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach((el) => revealer.observe(el));

  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObs.observe(el));
})();
