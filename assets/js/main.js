/* =============================================================================
   Jabuticaba · Confeitaria Gourmet — Teresina/PI
   Abertura cinematográfica, smooth scroll, parallax e revelações.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     CONFIGURAÇÃO — altere apenas este bloco para publicar
     --------------------------------------------------------------------- */
  var CONFIG = {
    // Número do WhatsApp no formato internacional: 55 + DDD + número (só dígitos)
    whatsapp: '5586000000000',          // TODO: substituir pelo número real
    instagram: 'jabuticabaconfeitaria', // TODO: substituir pelo @ real
    marca: 'Jabuticaba Confeitaria'
  };

  /* --------------------------------------------------------------- utils */
  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqMobile = window.matchMedia('(max-width: 920px)');
  var isCoarse = window.matchMedia('(hover: none)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* -------------------------------------------------------- links de contato */
  function wireLinks() {
    var num = String(CONFIG.whatsapp).replace(/\D/g, '');
    if (/^55860{6,}$/.test(num) || num.length < 12) {
      console.warn('[Jabuticaba] Configure o WhatsApp em assets/js/main.js → CONFIG.whatsapp');
    }
    qsa('[data-wa]').forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg') || ('Olá! Vim pelo site da ' + CONFIG.marca + '.');
      el.setAttribute('href', 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    var ig = String(CONFIG.instagram).replace(/^@/, '');
    qsa('[data-ig]').forEach(function (el) {
      el.setAttribute('href', 'https://instagram.com/' + ig);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      if (el.hasAttribute('data-ig-label')) el.textContent = '@' + ig;
    });
    var y = qs('#year'); if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------ partículas */
  function dustCanvas(canvas, opts) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return { start: function () {}, stop: function () {} };
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [], raf = null, w = 0, h = 0, running = false;
    opts = opts || {};
    var count = opts.count || 40;
    var color = opts.color || '200,164,106';

    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      parts = [];
      var n = mqMobile.matches ? Math.round(count * 0.45) : count;
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * (opts.size || 1.7) + 0.4,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(Math.random() * 0.22 + 0.04),
          a: Math.random() * 0.5 + 0.18,
          p: Math.random() * Math.PI * 2
        });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.p += 0.012;
        p.x += p.vx + Math.sin(p.p) * 0.14;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 8; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 8; else if (p.x > w + 10) p.x = -8;
        var al = p.a * (0.6 + 0.4 * Math.sin(p.p));
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + color + ',' + al.toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    return {
      start: function () {
        if (running || reduced) return;
        running = true; resize(); seed(); frame();
        window.addEventListener('resize', this.onResize);
      },
      stop: function () {
        running = false;
        if (raf) cancelAnimationFrame(raf); raf = null;
        ctx.clearRect(0, 0, w, h);
      },
      onResize: function () { resize(); seed(); }
    };
  }

  /* ------------------------------------------------------- abertura (intro) */
  function runIntro(done) {
    var intro = qs('#intro');
    if (!intro) { done(); return; }
    var seen = false;
    try { seen = sessionStorage.getItem('jb-intro') === '1'; } catch (e) {}

    var finish = function () {
      intro.classList.add('is-done');
      intro.style.display = 'none';
      document.body.classList.remove('is-locked');
      try { sessionStorage.setItem('jb-intro', '1'); } catch (e) {}
      done();
    };

    if (!hasGSAP || reduced || seen) {
      intro.style.transition = 'opacity .5s ease';
      intro.style.opacity = '0';
      setTimeout(finish, seen || reduced ? 260 : 460);
      return;
    }

    document.body.classList.add('is-locked');
    var safety = setTimeout(finish, 6000);

    // divide o nome em letras
    var logo = qs('#introLogo');
    var name = logo.textContent.trim();
    logo.textContent = '';
    name.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.textContent = ch;
      logo.appendChild(s);
    });
    var letters = qsa('span', logo);

    var dust = dustCanvas(qs('#introParticles'), { count: 46, size: 2.1 });
    dust.start();

    var tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: function () { clearTimeout(safety); dust.stop(); finish(); }
    });

    tl.fromTo(qs('#introEyebrow'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .7 }, 0.15)
      .fromTo(letters,
        { opacity: 0, y: 26, filter: 'blur(14px)', scale: 1.08 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.05, stagger: 0.035 }, 0.25)
      .fromTo(qs('#introRule'), { scaleX: 0 }, { scaleX: 1, duration: .9 }, 0.85)
      .fromTo(qs('.intro__glow'), { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: 1.4 }, 0.5)
      .to([qs('#introEyebrow'), qs('#introRule')], { opacity: 0, duration: .45 }, 1.45)
      .to(letters, { opacity: 0, y: -14, filter: 'blur(8px)', duration: .55, stagger: 0.012 }, 1.45)
      .fromTo(qs('#introReveal'),
        { opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
        { opacity: 1, clipPath: 'circle(42% at 50% 50%)', duration: 1.05, ease: 'power2.inOut' }, 1.35)
      .fromTo(qs('#introReveal img'), { scale: 1.32 }, { scale: 1.06, duration: 1.6, ease: 'power2.out' }, 1.35)
      .to(qs('#introReveal'), { clipPath: 'circle(76% at 50% 50%)', duration: .7, ease: 'power2.in' }, 2.15)
      .to(intro, { opacity: 0, duration: .75, ease: 'power2.inOut' }, 2.35)
      .to(qs('.intro__glow'), { opacity: 0, duration: .5 }, 2.35);

    // permite pular
    var skip = function () { if (tl.progress() < .98) tl.progress(1); };
    intro.addEventListener('click', skip);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') skip(); }, { once: true });
  }

  /* ----------------------------------------------------------- smooth scroll */
  var lenis = null;
  function initScroll() {
    if (typeof window.Lenis === 'undefined' || reduced) return;
    lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true
    });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      window.__lenis = lenis; // auxilia testes/automação
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollTo(target) {
    var el = typeof target === 'string' ? qs(target) : target;
    if (!el) return;
    var offset = qs('#nav') ? -qs('#nav').offsetHeight : 0;
    if (lenis) lenis.scrollTo(el, { offset: offset, duration: 1.35 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset + offset, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------ navegação */
  function initNav() {
    var nav = qs('#nav'), toggle = qs('#navToggle'), menu = qs('#navMenu');
    var last = window.pageYOffset, open = false;

    var onScroll = function () {
      var y = window.pageYOffset;
      nav.classList.toggle('is-solid', y > 60);
      if (!open) nav.classList.toggle('is-hidden', y > last && y > 260);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var setOpen = function (v) {
      open = v;
      toggle.setAttribute('aria-expanded', String(v));
      toggle.setAttribute('aria-label', v ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('is-locked', v);
      if (v) {
        menu.hidden = false;
        if (lenis) lenis.stop();
        if (hasGSAP) {
          gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power2.out' });
          gsap.fromTo(qsa('a', menu), { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: .7, stagger: .055, delay: .1, ease: 'power3.out' });
        } else { menu.style.opacity = '1'; }
      } else {
        if (lenis) lenis.start();
        if (hasGSAP) gsap.to(menu, { opacity: 0, duration: .35, onComplete: function () { menu.hidden = true; } });
        else menu.hidden = true;
      }
    };
    toggle.addEventListener('click', function () { setOpen(!open); });
    qsa('a[href^="#"]', menu).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); setOpen(false);
        setTimeout(function () { scrollTo(a.getAttribute('href')); }, 120);
      });
    });
    qsa('a[href^="#"]').forEach(function (a) {
      if (menu.contains(a)) return;
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length > 1 && qs(id)) { e.preventDefault(); scrollTo(id); }
        else if (id === '#top') { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
    });
  }

  /* ------------------------------------------------------------- animações */
  // Sem GSAP ou com "reduzir movimento": tudo visível, layout estático.
  function showEverything() {
    document.documentElement.classList.add('no-anim');
    qsa('.reveal').forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  function initAnimations() {
    if (!hasGSAP || reduced) { showEverything(); return; }
    document.body.classList.add('is-ready');

    /* estados iniciais */
    // y:0 zera o deslocamento em px que o GSAP lê do transform inicial do CSS
    gsap.set('.line__in', { yPercent: 106, y: 0 });
    gsap.set('.steps li', { opacity: 0, y: 22 });

    /* ---------------------------------------------------------- HERO in */
    var heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    heroTl
      .to('.hero__title .line__in', { yPercent: 0, duration: 1.5, stagger: .11 }, 0)
      .fromTo('.hero .eyebrow', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, .1)
      .fromTo('.hero__sub', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1 }, .45)
      .fromTo('.hero__actions', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1 }, .58)
      .fromTo('.hero__meta', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, .7)
      .fromTo('.hero__frame', { opacity: 0, scale: 1.06, yPercent: 4 },
        { opacity: 1, scale: 1, yPercent: 0, duration: 1.7 }, .1)
      .fromTo('.floater', { opacity: 0, scale: .6 },
        { opacity: 1, scale: 1, duration: 1.4, stagger: .06, ease: 'back.out(1.6)' }, .6)
      .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: .9 }, 1);

    /* ------------------------------------------------- revelações padrão */
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: function (els) {
        gsap.to(els, { opacity: 1, y: 0, duration: 1.15, stagger: .09, ease: 'power3.out', overwrite: true });
      },
      once: true
    });
    qsa('.reveal-line').forEach(function (h) {
      gsap.to(qsa('.line__in', h), {
        yPercent: 0, duration: 1.35, stagger: .1, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 86%', once: true }
      });
    });

    /* ------------------------------------------------------ HERO parallax */
    gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    })
      .to('#heroImg', { scale: 1.22, yPercent: 8, ease: 'none' }, 0)
      .to('.hero__text', { yPercent: -26, opacity: .15, ease: 'none' }, 0)
      .to('.hero__frame', { yPercent: 8, ease: 'none' }, 0)
      .to('.floaters', { yPercent: 22, ease: 'none' }, 0);

    /* flutuação contínua + parallax de mouse */
    qsa('.floater').forEach(function (f, i) {
      gsap.to(f, {
        yPercent: gsap.utils.random(-16, -46), xPercent: gsap.utils.random(-10, 10),
        duration: gsap.utils.random(4.5, 8), ease: 'sine.inOut',
        repeat: -1, yoyo: true, delay: i * .12
      });
    });
    if (!isCoarse) {
      var qx = [], qy = [];
      var targets = qsa('.floater').concat([qs('.hero__frame')]);
      targets.forEach(function (el) {
        qx.push(gsap.quickTo(el, 'x', { duration: .9, ease: 'power3' }));
        qy.push(gsap.quickTo(el, 'y', { duration: .9, ease: 'power3' }));
      });
      window.addEventListener('mousemove', function (e) {
        var cx = (e.clientX / window.innerWidth - .5);
        var cy = (e.clientY / window.innerHeight - .5);
        targets.forEach(function (el, i) {
          var d = parseFloat(el.getAttribute('data-depth') || '0.5');
          qx[i](cx * d * 26);
          qy[i](cy * d * 22);
        });
      }, { passive: true });
    }

    /* --------------------------------------------------- 02 · EXPERIÊNCIA */
    gsap.set('.exp__words li', { y: 14 });
    var expTl = gsap.timeline({
      scrollTrigger: { trigger: '.exp__track', start: 'top top', end: 'bottom bottom', scrub: .8 }
    });
    expTl
      .to('#expMask', {
        clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
        ease: 'power2.inOut', duration: 1.1
      }, 0)
      .to('#expImg', { scale: 1, ease: 'none', duration: 2.6 }, 0)
      .to('.exp__title:not(.exp__title--2)', { opacity: 0, yPercent: -40, duration: .6 }, .35)
      .to('#expTitle2', { opacity: 1, duration: .5 }, .75)
      .to('#expTitle2 .line__in', { yPercent: 0, duration: .8, stagger: .12, ease: 'power3.out' }, .8)
      .to('.exp__words li', { opacity: 1, y: 0, duration: .45, stagger: .18 }, 1.35)
      .to('#expImg', { scale: .96, ease: 'none', duration: .8 }, 2.0);
    gsap.to('.exp__title:not(.exp__title--2) .line__in', {
      yPercent: 0, duration: 1.4, stagger: .1, ease: 'expo.out',
      scrollTrigger: { trigger: '.exp', start: 'top 60%', once: true }
    });

    /* -------------------------------------------------- 03 · HORIZONTAL */
    var espSection = qs('.esp'), rail = qs('#espRail'), vp = qs('#espViewport');
    var espTween = null;
    function buildEsp() {
      if (espTween) { espTween.scrollTrigger && espTween.scrollTrigger.kill(); espTween.kill(); espTween = null; }
      gsap.set(rail, { x: 0 });
      if (mqMobile.matches) { espSection.style.height = ''; return; }
      var dist = Math.max(0, rail.scrollWidth - window.innerWidth + 24);
      espSection.style.height = (vp.offsetTop + window.innerHeight + dist) + 'px';
      espTween = gsap.to(rail, {
        x: -dist, ease: 'none',
        scrollTrigger: {
          trigger: espSection,
          start: function () { return 'top+=' + vp.offsetTop + ' top'; },
          end: function () { return '+=' + dist; },
          scrub: .7, invalidateOnRefresh: true
        }
      });
      gsap.fromTo('.panel', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, stagger: .09, ease: 'power3.out',
        scrollTrigger: { trigger: vp, start: 'top 70%', once: true }
      });
    }
    buildEsp();

    /* --------------------------------------- 04 · MOMENTO CINEMATOGRÁFICO */
    gsap.timeline({
      scrollTrigger: { trigger: '.cena__track', start: 'top top', end: 'bottom bottom', scrub: .8 }
    })
      .fromTo('#cenaImg', { scale: 1.26, yPercent: -3 }, { scale: 1.04, yPercent: 3, ease: 'none' }, 0)
      .fromTo('.cena__title', { scale: .92, y: 40 }, { scale: 1.06, y: -30, ease: 'none' }, 0)
      .fromTo('.cena__sweep', { xPercent: 0 }, { xPercent: 420, ease: 'none' }, 0)
      .fromTo('.cena__eyebrow', { opacity: 0 }, { opacity: 1, duration: .25 }, .05);
    gsap.to('.cena__title .line__in', {
      yPercent: 0, duration: 1.4, stagger: .12, ease: 'expo.out',
      scrollTrigger: { trigger: '.cena', start: 'top 40%', once: true }
    });
    var cenaDust = dustCanvas(qs('#cenaDust'), { count: 36, size: 1.9, color: '255,238,206' });
    ScrollTrigger.create({
      trigger: '.cena', start: 'top bottom', end: 'bottom top',
      onEnter: function () { cenaDust.start(); },
      onEnterBack: function () { cenaDust.start(); },
      onLeave: function () { cenaDust.stop(); },
      onLeaveBack: function () { cenaDust.stop(); }
    });

    /* --------------------------------------------- 05 · FEITO COM CUIDADO */
    gsap.fromTo('#cuidadoImg', { scale: 1.16, yPercent: -4 }, {
      scale: 1, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.cuidado__media', start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
    gsap.fromTo('#stepsLine', { scaleY: 0 }, {
      scaleY: 1, ease: 'none', transformOrigin: '50% 0',
      scrollTrigger: { trigger: '#steps', start: 'top 78%', end: 'bottom 70%', scrub: .5 }
    });
    ScrollTrigger.batch('.steps li', {
      start: 'top 86%',
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out' }); },
      once: true
    });

    /* ------------------------------------------------------- 06 · OCASIÕES */
    qsa('.oc__card').forEach(function (card) {
      var sp = parseFloat(card.getAttribute('data-speed') || '0');
      gsap.fromTo(card, { yPercent: sp * 60 }, {
        yPercent: sp * -60, ease: 'none',
        scrollTrigger: { trigger: '.oc__grid', start: 'top bottom', end: 'bottom top', scrub: .8 }
      });
      gsap.fromTo(card, { opacity: 0, y: 56, rotateX: 8 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 1.25, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', once: true }
      });
      if (!isCoarse) {
        var rx = gsap.quickTo(card, 'rotateY', { duration: .7, ease: 'power3' });
        var ry = gsap.quickTo(card, 'rotateX', { duration: .7, ease: 'power3' });
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          rx(((e.clientX - r.left) / r.width - .5) * 9);
          ry(((e.clientY - r.top) / r.height - .5) * -9);
        });
        card.addEventListener('mouseleave', function () { rx(0); ry(0); });
      }
    });

    /* ------------------------------------------------ 07/08/09 · parallax */
    gsap.fromTo('#desejoImg', { scale: 1.14, yPercent: -3 }, {
      scale: 1.02, yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: '.desejo', start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
    gsap.fromTo('#localImg', { scale: 1.14, yPercent: -4 }, {
      scale: 1, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.local', start: 'top bottom', end: 'bottom top', scrub: .7 }
    });

    /* ----------------------------------------------------------- refresh */
    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { buildEsp(); ScrollTrigger.refresh(); }, 220);
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  function safeInitAnimations() {
    try { initAnimations(); }
    catch (err) { console.error('[Jabuticaba] animações:', err); showEverything(); }
  }

  /* ------------------------------------------------------------------ boot */
  function boot() {
    wireLinks();
    initScroll();
    initNav();
    runIntro(safeInitAnimations);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
