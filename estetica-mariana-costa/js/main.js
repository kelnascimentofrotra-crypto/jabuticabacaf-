/* =========================================================
   Estética Mariana Costa — interações e animações
   ========================================================= */
(function () {
  'use strict';

  var CONFIG = {
    // Número do WhatsApp que recebe os agendamentos: DDI + DDD + número, só dígitos.
    // Exemplo: '5511987654321'. Enquanto estiver vazio, o formulário avisa que falta configurar.
    whatsapp: ''
  };

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

  /* ---------- agendamento ---------- */
  var dialog = $('#booking');
  var form = $('.booking__form', dialog);
  var notice = $('.booking__notice', dialog);
  var info = $('[data-procedure-info]', dialog);
  var select = form.elements.procedimento;
  var phone = form.elements.telefone;
  var supportsDialog = typeof dialog.showModal === 'function';

  function openBooking(procedure, description) {
    closeMenu(false);
    notice.textContent = '';
    notice.classList.remove('is-error');
    $$('.field', form).forEach(function (f) { f.classList.remove('is-invalid'); });

    if (procedure) {
      select.value = procedure;
      info.innerHTML = '';
      var strong = document.createElement('strong');
      strong.textContent = procedure;
      info.appendChild(strong);
      info.appendChild(document.createTextNode(description || ''));
      info.hidden = false;
    } else {
      info.hidden = true;
    }

    if (supportsDialog) {
      dialog.classList.remove('is-closing');
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    body.classList.add('is-locked');
    setTimeout(function () { form.elements.nome.focus({ preventScroll: true }); }, 60);
  }

  function closeBooking() {
    if (!dialog.open) return;
    if (reduceMotion || !supportsDialog) {
      supportsDialog ? dialog.close() : dialog.removeAttribute('open');
      return;
    }
    dialog.classList.add('is-closing');
    setTimeout(function () {
      dialog.classList.remove('is-closing');
      dialog.close();
    }, 330);
  }

  dialog.addEventListener('close', function () { body.classList.remove('is-locked'); });
  dialog.addEventListener('cancel', function (e) { e.preventDefault(); closeBooking(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) closeBooking(); });
  $$('[data-close]', dialog).forEach(function (b) { b.addEventListener('click', closeBooking); });

  $$('[data-open-booking]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('[data-procedure]');
      if (card) {
        var desc = $('p', card);
        openBooking(card.getAttribute('data-procedure'), desc ? desc.textContent : '');
      } else {
        openBooking();
      }
    });
  });

  // máscara simples de telefone: (00) 00000-0000
  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '').slice(0, 11);
    var out = d;
    if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    phone.value = out;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.elements.nome.value.trim();
    var tel = phone.value.replace(/\D/g, '');
    var ok = true;

    form.elements.nome.closest('.field').classList.toggle('is-invalid', !nome);
    phone.closest('.field').classList.toggle('is-invalid', tel.length < 10);
    if (!nome || tel.length < 10) ok = false;

    if (!ok) {
      notice.textContent = 'Preencha seu nome e um WhatsApp válido para continuar.';
      notice.classList.add('is-error');
      return;
    }

    var msg = [
      'Olá! Gostaria de agendar uma avaliação na Estética Mariana Costa.',
      '',
      'Nome: ' + nome,
      'WhatsApp: ' + phone.value,
      'Procedimento: ' + select.value
    ];
    var extra = form.elements.mensagem.value.trim();
    if (extra) msg.push('Mensagem: ' + extra);

    if (!CONFIG.whatsapp) {
      notice.textContent = 'Quase lá! O número de WhatsApp da clínica ainda não foi configurado (CONFIG.whatsapp em js/main.js).';
      notice.classList.add('is-error');
      return;
    }

    notice.classList.remove('is-error');
    notice.textContent = 'Abrindo o WhatsApp…';
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg.join('\n')), '_blank', 'noopener');
  });
})();
