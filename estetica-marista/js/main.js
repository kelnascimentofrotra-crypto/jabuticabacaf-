/* =========================================================
   Estética Marista — interações e animações
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- tela de entrada ---------- */
  var MIN_INTRO = reduceMotion ? 0 : 1700;
  var loaded = false;
  function finishLoading() {
    if (loaded) return;
    loaded = true;
    var wait = Math.max(0, MIN_INTRO - performance.now());
    setTimeout(function () { body.classList.add('is-loaded'); }, wait);
  }
  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading);
  setTimeout(finishLoading, 4000);

  /* ---------- ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- traço dos ícones ---------- */
  var drawSymbols = {};
  $$('svg.draw use').forEach(function (u) { drawSymbols[u.getAttribute('href')] = true; });
  Object.keys(drawSymbols).forEach(function (id) {
    $$(id + ' path, ' + id + ' circle').forEach(function (shape) {
      if (!shape.hasAttribute('stroke-dasharray')) shape.setAttribute('pathLength', '1');
    });
  });

  /* ---------- revelações no scroll ---------- */
  $$('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 100;
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--d', (i * step) / 1000 + 's');
    });
  });

  var revealEls = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- cabeçalho, progresso e parallax de scroll ---------- */
  var header = $('.header');
  var progress = $('.progress');
  var hero = $('.hero');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (!reduceMotion && hero) {
      var h = hero.offsetHeight;
      hero.style.setProperty('--sy', Math.min(y, h).toFixed(1));
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- link ativo no menu ---------- */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- hero: partículas de luz ---------- */
  var dust = $('.hero__dust');
  if (dust && !reduceMotion) {
    var count = window.innerWidth < 760 ? 10 : 20;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('i');
      var size = 3 + Math.random() * 9;
      p.style.setProperty('--x', (Math.random() * 100).toFixed(2) + '%');
      p.style.setProperty('--s', size.toFixed(1) + 'px');
      p.style.setProperty('--t', (12 + Math.random() * 14).toFixed(1) + 's');
      p.style.setProperty('--delay', (-Math.random() * 20).toFixed(1) + 's');
      p.style.setProperty('--dx', ((Math.random() - 0.5) * 160).toFixed(0) + 'px');
      p.style.setProperty('--o', (0.25 + Math.random() * 0.55).toFixed(2));
      dust.appendChild(p);
    }
  }

  /* ---------- hero: parallax com o mouse ---------- */
  if (hero && finePointer && !reduceMotion) {
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var raf = null;
    function animate() {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      hero.style.setProperty('--px', current.x.toFixed(4));
      hero.style.setProperty('--py', current.y.toFixed(4));
      if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(animate);
    });
    hero.addEventListener('pointerleave', function () {
      target.x = 0;
      target.y = 0;
      if (!raf) raf = requestAnimationFrame(animate);
    });
  }

  /* ---------- cards: luz e inclinação ---------- */
  if (finePointer && !reduceMotion) {
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        card.style.setProperty('--ry', ((x / r.width - 0.5) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y / r.height) * 6).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- menu em tela cheia ---------- */
  var menu = $('#menu');
  var menuToggle = $('.menu-toggle');
  var menuClose = $('.menu__close');

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('is-locked');
    setTimeout(function () { var first = $('.menu__nav a', menu); if (first) first.focus({ preventScroll: true }); }, 350);
  }
  function closeMenu(returnFocus) {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-locked');
    if (returnFocus) menuToggle.focus({ preventScroll: true });
  }
  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', function () { closeMenu(true); });
  $$('.menu__nav a', menu).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(true); });

  // links do WhatsApp abrem em nova aba; fecha o menu se o clique veio dele
  $$('[data-whatsapp]', menu).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
})();
