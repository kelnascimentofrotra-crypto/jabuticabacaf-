(() => {
  'use strict';

  // WhatsApp oficial da GSE: só dígitos, com DDI e DDD (ex.: '5563999999999').
  // Enquanto estiver vazio, os botões de orçamento mostram um aviso em vez de abrir o WhatsApp.
  const WHATSAPP = '';

  const header = document.querySelector('.topbar');
  const nav = document.getElementById('menu');
  const burger = document.querySelector('.burger');
  const links = [...document.querySelectorAll('.nav__link')];
  const sections = [...document.querySelectorAll('.sec')];
  const toast = document.querySelector('.toast');
  const hint = document.querySelector('.rotate-hint');

  const year = document.querySelector('.js-year');
  if (year) year.textContent = new Date().getFullYear();

  /* Menu no celular */
  const closeMenu = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
  };
  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !e.target.closest('.topbar')) closeMenu();
  });

  /* Sombra no cabeçalho ao rolar */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Entrada das seções e item ativo do menu */
  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          reveal.unobserve(en.target);
        }
      });
    }, { threshold: 0.18 });
    sections.forEach((s) => reveal.observe(s));

    const ratios = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => ratios.set(en.target.id, en.intersectionRatio));
      let best = null, max = 0;
      ratios.forEach((r, id) => { if (r > max) { max = r; best = id; } });
      if (best) setActive(best);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach((s) => spy.observe(s));
  } else {
    sections.forEach((s) => s.classList.add('is-in'));
  }

  /* Avisos curtos */
  let toastTimer;
  const showToast = (msg) => {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.hidden = false;
    toast.classList.remove('is-leaving');
    toastTimer = setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => { toast.hidden = true; }, 400);
    }, 3200);
  };

  /* Botões de orçamento -> WhatsApp */
  document.querySelectorAll('.js-wa').forEach((a) => {
    const msg = a.dataset.msg || 'Olá! Quero solicitar um orçamento de energia solar.';
    if (WHATSAPP) {
      a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Em breve você poderá falar com a GSE pelo WhatsApp por aqui.');
      });
    }
  });

  /* Dica para girar o celular (as artes são horizontais) */
  const portraitPhone = window.matchMedia('(orientation: portrait) and (max-width: 760px)');
  if (hint && portraitPhone.matches) {
    let hidden = false;
    const hideHint = () => {
      if (hidden) return;
      hidden = true;
      hint.classList.add('is-leaving');
      setTimeout(() => { hint.hidden = true; }, 400);
    };
    setTimeout(() => {
      hint.hidden = false;
      setTimeout(hideHint, 6500);
    }, 1200);
    window.addEventListener('orientationchange', hideHint, { once: true });
    hint.addEventListener('click', hideHint);
  }
})();
