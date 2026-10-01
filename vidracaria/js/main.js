(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.getElementById('menu');
  const toggle = document.querySelector('[data-menu-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Links de WhatsApp ----------
     O número fica no atributo data-whatsapp do <body>. */
  const phone = (document.body.dataset.whatsapp || '').replace(/\D/g, '');
  if (phone) {
    document.querySelectorAll('[data-wa]').forEach((link) => {
      const text = link.dataset.wa ? `?text=${encodeURIComponent(link.dataset.wa)}` : '';
      link.href = `https://wa.me/${phone}${text}`;
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  /* ---------- Cabeçalho ao rolar ---------- */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
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
  window.matchMedia('(min-width: 1241px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

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
