/* =========================================================
   TÁ NO CLIMA — Refrigeração e Serviço
   >>> EDITE APENAS O BLOCO CONFIG ABAIXO <<<
   Telefone, WhatsApp, e-mail, redes e horário são aplicados
   automaticamente em todo o site.
   ========================================================= */
const CONFIG = {
  // Número do WhatsApp em formato internacional, só dígitos: 55 + DDD + número
  whatsapp: '5598000000000',          // TROCAR pelo número real
  // Telefone como aparece na tela
  telefoneExibicao: '(98) 9 9999-9999', // TROCAR pelo número real
  email: 'contato@tanoclima.com.br',    // TROCAR pelo e-mail real
  horario: 'Seg a Sáb, 7h às 18h',      // Ajustar se necessário
  instagram: 'https://instagram.com/',  // TROCAR pelo perfil real
  facebook: 'https://facebook.com/'     // TROCAR pela página real
};

(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));
  const onlyDigits = (v) => String(v).replace(/\D/g, '');

  /* ---------- 1. aplica o CONFIG na página ---------- */
  const telHref = 'tel:+' + onlyDigits(CONFIG.whatsapp);
  const waBase  = 'https://wa.me/' + onlyDigits(CONFIG.whatsapp);

  $$('[data-config]').forEach(function (el) {
    switch (el.getAttribute('data-config')) {
      case 'phone':     el.textContent = CONFIG.telefoneExibicao; break;
      case 'email':     el.textContent = CONFIG.email; break;
      case 'hours':     el.textContent = CONFIG.horario; break;
      case 'tel-href':  el.href = telHref; break;
      case 'mail-href': el.href = 'mailto:' + CONFIG.email; break;
      case 'ig-href':   el.href = CONFIG.instagram; el.target = '_blank'; el.rel = 'noopener'; break;
      case 'fb-href':   el.href = CONFIG.facebook; el.target = '_blank'; el.rel = 'noopener'; break;
    }
  });

  $$('.js-wa').forEach(function (el) {
    const msg = el.getAttribute('data-wa-msg') || 'Olá! Vim pelo site da Tá No Clima.';
    el.href = waBase + '?text=' + encodeURIComponent(msg);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- 2. menu mobile ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. scroll: header, progresso, topo e parallax ---------- */
  const header = $('#header');
  const totop = $('#totop');
  const bar = $('#progress span');
  const art = $('.art-card');
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ultimoY = window.pageYOffset;
  let agendado = false;

  function aoRolar() {
    const y = window.pageYOffset;
    const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle('is-stuck', y > 10);
      // esconde ao descer, revela ao subir (só depois do hero)
      header.classList.toggle('is-hidden', y > 420 && y > ultimoY + 4);
    }
    if (totop) totop.classList.toggle('is-on', y > 600);
    if (bar) bar.style.width = (alturaRolavel > 0 ? (y / alturaRolavel) * 100 : 0) + '%';
    if (art && !reduzido && y < window.innerHeight) {
      art.style.transform = 'translate3d(0,' + (y * -0.07).toFixed(1) + 'px,0)';
    }
    if (window.__varrerAnimados) window.__varrerAnimados();
    ultimoY = y;
    agendado = false;
  }

  window.addEventListener('scroll', function () {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(aoRolar);
  }, { passive: true });
  aoRolar();

  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 4. link ativo conforme a seção ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 5. animações de entrada e de scroll ---------- */
  // entrada do hero assim que a página carrega
  function ligarEntrada() { document.documentElement.classList.add('is-loaded'); }
  if (document.readyState === 'complete') ligarEntrada();
  else window.addEventListener('load', ligarEntrada);
  // rede de segurança: nunca deixar conteúdo preso invisível
  setTimeout(ligarEntrada, 900);

  const animados = $$('[data-anim]');
  let pendentes = animados.slice();
  function mostrarTudo() { animados.forEach(function (el) { el.classList.add('is-in'); }); pendentes = []; }

  // quem já passou pela tela (saltos de âncora, recarga no meio da página) entra sem esperar
  window.__varrerAnimados = function () {
    if (!pendentes.length) return;
    pendentes = pendentes.filter(function (el) {
      if (el.getBoundingClientRect().bottom > 120) return true;
      el.style.transitionDelay = '0ms';
      el.classList.add('is-in');
      return false;
    });
  };

  if ('IntersectionObserver' in window && !reduzido) {
    const io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const irmaos = e.target.parentElement ? $$('[data-anim]', e.target.parentElement) : [];
        const ordem = Math.max(0, irmaos.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(ordem, 5) * 110 + 'ms';
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -70px' });
    animados.forEach(function (el) { io.observe(el); });
    // o que já está visível na primeira tela entra junto com o hero
    setTimeout(function () {
      animados.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 120);
  } else {
    mostrarTudo();
  }

  /* ---------- 6. contadores ---------- */
  const counters = $$('.js-count');
  function runCount(el) {
    const target = parseInt(el.getAttribute('data-to'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const start = performance.now();
    const dur = 1400;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCount(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-to') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- 7. formulário -> WhatsApp ---------- */
  const form = $('#form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const d = new FormData(form);
      const linhas = [
        'Olá! Vim pelo site da Tá No Clima e quero um orçamento.',
        '',
        'Nome: ' + (d.get('nome') || '-'),
        'WhatsApp: ' + (d.get('fone') || '-'),
        'Tipo: ' + (d.get('perfil') || '-'),
        'Serviço: ' + (d.get('servico') || '-'),
        'Bairro: ' + (d.get('bairro') || '-'),
        '',
        'Detalhes: ' + (d.get('msg') || '-')
      ];
      window.open(waBase + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------- 8. FAQ: abre um por vez ---------- */
  const accs = $$('.acc');
  accs.forEach(function (acc) {
    acc.addEventListener('toggle', function () {
      if (!acc.open) return;
      accs.forEach(function (other) { if (other !== acc) other.open = false; });
    });
  });

  /* ---------- 9. ano no rodapé ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
