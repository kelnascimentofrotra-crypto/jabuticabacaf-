(() => {
  'use strict';

  // WhatsApp oficial da GSE: só dígitos, com DDI e DDD (ex.: '5563999999999').
  // Enquanto estiver vazio, os botões de orçamento mostram um aviso em vez de abrir o WhatsApp.
  const WHATSAPP = '';

  const root = document.documentElement;
  root.classList.add('app');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const header = document.querySelector('.topbar');
  const nav = document.getElementById('menu');
  const burger = document.querySelector('.burger');
  const list = document.querySelector('.nav__list');
  const thumb = document.querySelector('.nav__thumb');
  const links = [...document.querySelectorAll('.nav__link')];
  const sections = [...document.querySelectorAll('.sec')];
  const hero = document.querySelector('.sec--hero');
  const intro = document.querySelector('.intro');
  const progress = document.querySelector('.progress');
  const toTop = document.querySelector('.to-top');
  const cue = document.querySelector('.scroll-cue');
  const toast = document.querySelector('.toast');
  const hint = document.querySelector('.rotate-hint');

  const year = document.querySelector('.js-year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menu no celular ---------- */
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

  /* ---------- Item ativo do menu (cápsula que desliza) ---------- */
  let activeId = 'inicio';
  const placeThumb = () => {
    const a = links.find((l) => l.getAttribute('href') === '#' + activeId);
    if (!a || !thumb || getComputedStyle(thumb).display === 'none') return;
    thumb.style.setProperty('--tx', a.offsetLeft + 'px');
    thumb.style.setProperty('--tw', a.offsetWidth + 'px');
    thumb.classList.add('is-on');
  };
  const setActive = (id) => {
    activeId = id;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    placeThumb();
  };
  window.addEventListener('resize', placeThumb);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeThumb);

  /* ---------- Rolagem: sombra do cabeçalho, barra de progresso, voltar ao topo ---------- */
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    toTop.classList.toggle('is-on', y > window.innerHeight * 0.6);
    if (cue && y > 40) cue.classList.add('is-hidden');
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Entrada das seções ---------- */
  const settleLater = (sec) => {
    const unblur = parseFloat(getComputedStyle(sec).getPropertyValue('--unblur')) || 1.4;
    const wait = reduceMotion ? 0 : (unblur + 1.05) * 1000;
    setTimeout(() => sec.classList.add('is-settled'), wait);
  };
  const reveal = (sec) => {
    if (sec.classList.contains('is-in')) return;
    sec.classList.add('is-in');
    settleLater(sec);
  };

  let ready = false;
  const heroVisible = () => {
    const r = hero.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        if (en.target === hero && !ready) return; // a hero entra quando a abertura termina
        reveal(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    sections.forEach((s) => io.observe(s));

    const ratios = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => ratios.set(en.target.id, en.intersectionRatio));
      let best = null, max = 0;
      ratios.forEach((r, id) => { if (r > max) { max = r; best = id; } });
      if (best && best !== activeId) setActive(best);
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    sections.forEach((s) => spy.observe(s));
  } else {
    sections.forEach(reveal);
  }

  /* ---------- Abertura ---------- */
  const start = () => {
    if (ready) return;
    ready = true;
    root.classList.add('is-ready');
    setActive(activeId);
    if (heroVisible()) reveal(hero);
  };

  if (intro && root.classList.contains('intro-on')) {
    const t0 = performance.now();
    const heroImg = hero.querySelector('img');
    const imgReady = new Promise((res) => {
      if (heroImg.complete) res();
      else { heroImg.addEventListener('load', res, { once: true }); heroImg.addEventListener('error', res, { once: true }); }
    });
    const minTime = new Promise((res) => setTimeout(res, 1650));
    const cap = new Promise((res) => setTimeout(res, 3200));
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      intro.classList.add('is-done');
      setTimeout(start, 280);
      setTimeout(() => intro.remove(), 1000);
    };
    Promise.race([Promise.all([imgReady, minTime]), cap]).then(finish);
    intro.addEventListener('click', finish);
    document.addEventListener('keydown', finish, { once: true });
  } else {
    if (intro) intro.remove();
    start();
  }

  /* ---------- Cards que reagem ao mouse (inclinação, brilho e elevação) ---------- */
  const lifts = [...document.querySelectorAll('.card, .piece--placas')];
  lifts.forEach((el) => {
    const glare = el.querySelector('.glare');
    let raf = 0;
    const move = (e) => {
      if (!canHover || reduceMotion) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
        if (glare) {
          el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
          el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        }
      });
    };
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') el.classList.add('is-lifted');
    });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      el.classList.remove('is-lifted');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
    // toque: o card sobe por um instante
    let tapTimer;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      el.classList.add('is-lifted');
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => el.classList.remove('is-lifted'), 900);
    });
  });

  /* ---------- Luz do sol que segue o cursor sobre a arte ---------- */
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.frame').forEach((f) => {
      const light = f.querySelector('.light');
      let raf = 0;
      f.addEventListener('pointermove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = f.getBoundingClientRect();
          light.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          light.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
    });
  }

  /* ---------- Avisos curtos ---------- */
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

  /* ---------- Botões de orçamento -> WhatsApp ---------- */
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

  /* ---------- Dica para girar o celular (as artes são horizontais) ---------- */
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
      if (hidden) return;
      hint.hidden = false;
      setTimeout(hideHint, 6500);
    }, 2600);
    window.addEventListener('orientationchange', hideHint, { once: true });
    hint.addEventListener('click', hideHint);
  }
})();
