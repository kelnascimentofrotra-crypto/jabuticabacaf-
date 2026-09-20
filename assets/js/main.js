/* ============================================================
   Jabuticaba Café — interaction layer
   One rAF loop drives every transform on the page; everything
   else is an observer. No framework, no bundler, no polling.
   ============================================================ */
(function () {
  'use strict';

  var doc = document, body = doc.body, root = doc.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var small = matchMedia('(max-width: 900px)');

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var qs = function (s, c) { return (c || doc).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1 · Opening. Hold the curtain until the two hero frames
     have actually decoded, but never for longer than 1.4s.
     --------------------------------------------------------- */
  (function boot() {
    var frames = qsa('.hero__plates img, .hero__far img');
    var done = false;
    var go = function () {
      if (done) return;
      done = true;
      body.classList.remove('is-loading');
      body.classList.add('is-ready');
    };
    var waits = frames.map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (res) {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true });
      });
    });
    Promise.all(waits).then(function () { requestAnimationFrame(go); });
    setTimeout(go, 1400);
  })();

  /* ---------------------------------------------------------
     2 · Nav: sticky treatment, hide-on-descend, active section
     --------------------------------------------------------- */
  var nav = qs('#nav');
  var lastY = 0;

  function navScroll(y) {
    nav.classList.toggle('is-stuck', y > 24);
    body.classList.toggle('is-scrolled', y > 320);
    var down = y > lastY && y > 480;
    if (!menuOpen) nav.classList.toggle('is-hidden', down);
    lastY = y;
  }

  var links = qsa('.nav__links a');
  var sections = links.map(function (a) { return qs(a.getAttribute('href')); }).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-here', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------
     3 · Mobile menu
     --------------------------------------------------------- */
  var burger = qs('#burger'), panel = qs('#menu'), menuOpen = false;
  qsa('.menu__links a', panel).forEach(function (a, i) { a.style.setProperty('--i', i); });

  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    body.classList.toggle('is-locked', open);
    if (open) {
      panel.hidden = false;
      nav.classList.remove('is-hidden');
      requestAnimationFrame(function () { panel.classList.add('is-open'); });
    } else {
      panel.classList.remove('is-open');
      setTimeout(function () { if (!menuOpen) panel.hidden = true; }, 800);
    }
  }
  burger.addEventListener('click', function () { setMenu(!menuOpen); });
  qsa('.menu__links a, .menu__foot a', panel).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); }
  });

  /* ---------------------------------------------------------
     4 · Reveals — siblings inherit a stagger, so a block of
     copy lands as one gesture rather than as five separate ones.
     --------------------------------------------------------- */
  var rv = qsa('[data-rv]');
  if ('IntersectionObserver' in window) {
    var seen = new WeakMap();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, group = el.parentNode;
        var n = seen.get(group) || 0;
        el.style.setProperty('--d', (n * 0.09).toFixed(2) + 's');
        seen.set(group, n + 1);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     5 · Cardápio tabs
     --------------------------------------------------------- */
  (function tabs() {
    var bar = qs('.tabs'); if (!bar) return;
    var btns = qsa('.tab', bar), ink = qs('.tabs__ink', bar);
    var panels = qsa('.panel'), shots = qsa('.art-shot');

    function ride(btn) {
      ink.style.width = btn.offsetWidth + 'px';
      ink.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    }
    function pick(btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        var on = p.id === 'p-' + btn.dataset.shot;
        p.hidden = !on;
        p.classList.toggle('is-on', on);
      });
      shots.forEach(function (s) { s.classList.toggle('is-on', s.dataset.shot === btn.dataset.shot); });
      ride(btn);
      if (focus) btn.focus();
    }

    btns.forEach(function (b) { b.addEventListener('click', function () { pick(b); }); });
    bar.addEventListener('keydown', function (e) {
      var i = btns.indexOf(doc.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        pick(btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length], true);
      }
    });

    var settle = function () { ride(qs('.tab.is-on', bar)); };
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(settle);
    addEventListener('resize', settle, { passive: true });
    settle();
  })();

  /* ---------------------------------------------------------
     6 · Map facade — the iframe only loads if it is wanted
     --------------------------------------------------------- */
  (function map() {
    var box = qs('#map'); if (!box) return;
    qs('.map__btn', box).addEventListener('click', function () {
      var f = doc.createElement('iframe');
      f.src = box.dataset.src;
      f.loading = 'lazy';
      f.title = 'Mapa — Jabuticaba Café, Av. dos Holandeses, 13, São Luís';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      box.appendChild(f);
      box.classList.add('is-live');
    });
  })();

  /* ---------------------------------------------------------
     7 · Cursor
     --------------------------------------------------------- */
  var cur = qs('#cursor'), cx = 0, cy = 0, tx = 0, ty = 0, curOn = false;
  if (fine.matches && !reduced.matches) {
    curOn = true;
    addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!e.target || !e.target.closest) return;
      cur.classList.toggle('is-hot', !!e.target.closest('a,button,.tab,.gal__item'));
      cur.classList.toggle('on-light', !!e.target.closest('.t-light'));
    }, { passive: true });
    addEventListener('mouseleave', function () { cur.style.opacity = '0'; });
    addEventListener('mouseenter', function () { cur.style.opacity = '1'; });
  }

  /* ---------------------------------------------------------
     8 · The camera: scroll parallax, pointer drift, gallery pan.
     Everything below runs inside one rAF, and only while the
     page is actually moving.
     --------------------------------------------------------- */
  var layers = qsa('[data-par]').map(function (el) {
    return { el: el, depth: parseFloat(el.dataset.par) || 0, hero: !!el.closest('.hero'), out: -1 };
  });
  var gal = qs('.gal'), track = qs('#galTrack');
  var px = 0, py = 0, mx = 0, my = 0;          /* pointer, target then eased */
  var vh = innerHeight, vw = innerWidth;
  var running = false, idle = 0;
  var flat = reduced.matches;

  if (fine.matches && !flat) {
    addEventListener('mousemove', function (e) {
      px = (e.clientX / vw - 0.5) * 2;
      py = (e.clientY / vh - 0.5) * 2;
      wake();
    }, { passive: true });
  }

  function measure() { vh = innerHeight; vw = innerWidth; }

  function frame() {
    var y = scrollY || pageYOffset;
    navScroll(y);

    if (curOn) {
      cx = lerp(cx, tx, 0.18); cy = lerp(cy, ty, 0.18);
      cur.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
    }

    if (!flat) {
      mx = lerp(mx, px, 0.055);
      my = lerp(my, py, 0.055);

      for (var i = 0; i < layers.length; i++) {
        var L = layers[i], r = L.el.getBoundingClientRect();
        var vis = r.bottom > -240 && r.top < vh + 240;
        if (!vis) { if (L.out !== 1) { L.out = 1; } continue; }
        L.out = 0;
        var off = (r.top + r.height / 2 - vh / 2) * L.depth;
        var dx = 0, dy = 0;
        if (L.hero) { dx = mx * L.depth * 190; dy = my * L.depth * 120; }
        L.el.style.transform =
          'translate3d(' + (dx).toFixed(2) + 'px,' + (-off + dy).toFixed(2) + 'px,0)';
      }
    }

    if (track && gal && !small.matches && !flat) {
      var top = gal.offsetTop, len = gal.offsetHeight - vh;
      var p = clamp((y - top) / (len || 1), 0, 1);
      var span = track.scrollWidth - vw;
      track.style.transform = 'translate3d(' + (-p * Math.max(span, 0)).toFixed(2) + 'px,0,0)';
    }

    /* settle: stop the loop once nothing is moving any more */
    var moving = Math.abs(cx - tx) > 0.4 || Math.abs(cy - ty) > 0.4 ||
                 Math.abs(mx - px) > 0.002 || y !== frame.y;
    frame.y = y;
    idle = moving ? 0 : idle + 1;
    if (idle > 40) { running = false; return; }
    requestAnimationFrame(frame);
  }

  function wake() { idle = 0; if (!running) { running = true; requestAnimationFrame(frame); } }

  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', function () { measure(); wake(); }, { passive: true });
  addEventListener('orientationchange', function () { measure(); wake(); });
  reduced.addEventListener('change', function (e) { flat = e.matches; wake(); });

  measure();
  wake();

  /* ---------------------------------------------------------
     9 · Housekeeping
     --------------------------------------------------------- */
  var ano = qs('#ano'); if (ano) ano.textContent = new Date().getFullYear();
})();
