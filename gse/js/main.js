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
  const toast = document.querySelector('.toast');
  const pager = document.getElementById('pager');
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
    const y = pager.scrollTop;
    const max = pager.scrollHeight - pager.clientHeight;
    progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
  };
  pager.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Uma seção por vez (roda do mouse e teclado) ---------- */
  const stops = () => {
    const max = pager.scrollHeight - pager.clientHeight;
    return [...new Set(sections.map((sec) => Math.min(sec.offsetTop, max)).concat(max))].sort((a, b) => a - b);
  };
  const go = (dir) => {
    const y = pager.scrollTop;
    const list = stops();
    const target = dir > 0 ? list.find((v) => v > y + 4) : [...list].reverse().find((v) => v < y - 4);
    if (target === undefined) return;
    pager.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  let lastWheel = 0, lastMove = 0;
  pager.addEventListener('wheel', (e) => {
    if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    const now = performance.now();
    const newGesture = now - lastWheel > 220;
    lastWheel = now;
    // um gesto (ou um giro contínuo da roda) avança uma seção só
    if (!newGesture || now - lastMove < 650 || Math.abs(e.deltaY) < 2) return;
    lastMove = now;
    go(Math.sign(e.deltaY));
  }, { passive: false });
  // arrastar com o mouse (como deslizar o dedo): para cima vai para a próxima seção, para baixo volta
  document.querySelectorAll('img, a').forEach((el) => { el.draggable = false; });
  pager.addEventListener('dragstart', (e) => e.preventDefault());
  let drag = null;
  pager.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('a, button, input, textarea, select')) return;
    drag = { y: e.clientY, moved: false };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag || drag.moved) return;
    const dy = e.clientY - drag.y;
    if (Math.abs(dy) > 8) pager.classList.add('is-dragging');
    if (Math.abs(dy) > 60) { drag.moved = true; go(dy < 0 ? 1 : -1); }
  });
  const endDrag = () => { drag = null; pager.classList.remove('is-dragging'); };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button' || e.target.isContentEditable) return;
    const down = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
    const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (down || up) { e.preventDefault(); go(down ? 1 : -1); }
    else if (e.key === 'Home') { e.preventDefault(); pager.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (e.key === 'End') { e.preventDefault(); pager.scrollTo({ top: pager.scrollHeight, behavior: 'smooth' }); }
  });

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

  /* ---------- Cards e botões que reagem (contorno e luz por cima; a arte não muda) ---------- */
  document.querySelectorAll('.spot').forEach((el) => {
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
    let tapTimer;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      el.classList.add('is-on');
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => el.classList.remove('is-on'), 900);
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

  /* ---------- Dica no celular em pé: girar para ver as artes maiores ---------- */
  if (hint && window.matchMedia('(orientation: portrait) and (max-width: 760px)').matches) {
    let gone = false;
    const hideHint = () => {
      if (gone) return;
      gone = true;
      hint.classList.add('is-leaving');
      setTimeout(() => { hint.hidden = true; }, 400);
    };
    setTimeout(() => { if (!gone) { hint.hidden = false; setTimeout(hideHint, 6000); } }, 2800);
    window.addEventListener('orientationchange', hideHint, { once: true });
    hint.addEventListener('click', hideHint);
  }

  /* ---------- Cards do celular: pontinhos que acompanham o deslize ---------- */
  document.querySelectorAll('.mob__items').forEach((row) => {
    const dots = row.parentElement.querySelectorAll('.mob__dots span');
    if (!dots.length) return;
    const items = [...row.children];
    const update = () => {
      const left = row.getBoundingClientRect().left + 16;
      let best = 0, dist = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.getBoundingClientRect().left - left);
        if (d < dist) { dist = d; best = i; }
      });
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 4) best = items.length - 1;
      dots.forEach((d, i) => d.classList.toggle('is-on', i === best));
    };
    let raf = 0;
    row.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    update();
  });

  /* ---------- Celular: o card de baixo se ajusta ao espaço da tela (nada fica cortado) ---------- */
  const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
  const levels = ['fit-1', 'fit-2', 'fit-3'];
  const fitCards = () => {
    document.querySelectorAll('.mob--bottom').forEach((box) => {
      box.classList.remove(...levels);
      if (!portrait.matches) return;
      const card = box.querySelector('.mob__card');
      const overflows = () => card.scrollHeight > card.clientHeight + 1 ||
        [...card.querySelectorAll('.mob__item, .mob__tiles')].some((el) => el.scrollHeight > el.clientHeight + 1);
      for (const lvl of levels) {
        if (!overflows()) break;
        box.classList.add(lvl);
      }
    });
  };
  let fitRaf = 0;
  const refit = () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitCards); };
  window.addEventListener('resize', refit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  fitCards();

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

})();
