/* =========================================================
   TÁ NO CLIMA — Refrigeração e Serviço
   >>> EDITE APENAS O BLOCO CONFIG ABAIXO <<<
   ========================================================= */
const CONFIG = {
  whatsapp: '5598000000000',            // 55 + DDD + número, só dígitos — TROCAR
  telefoneExibicao: '(98) 9 9999-9999', // como aparece na tela — TROCAR
  email: 'contato@tanoclima.com.br',    // TROCAR
  horario: 'Seg a Sáb, 7h às 18h',
  instagram: 'https://instagram.com/',  // TROCAR
  facebook: 'https://facebook.com/',    // TROCAR
  abertura: true                        // false = pula a animação de abertura
};

(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const span = (v, a, b) => clamp((v - a) / (b - a || 1), 0, 1);
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeIO = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const mix = (a, b, t) => a + (b - a) * t;
  const EASE = 'cubic-bezier(.16,1,.3,1)';

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. contatos a partir do CONFIG ---------- */
  const digitos = String(CONFIG.whatsapp).replace(/\D/g, '');
  const waBase = 'https://wa.me/' + digitos;

  $$('[data-config]').forEach(function (el) {
    switch (el.getAttribute('data-config')) {
      case 'phone':     el.textContent = CONFIG.telefoneExibicao; break;
      case 'email':     el.textContent = CONFIG.email; break;
      case 'hours':     el.textContent = CONFIG.horario; break;
      case 'tel-href':  el.href = 'tel:+' + digitos; break;
      case 'mail-href': el.href = 'mailto:' + CONFIG.email; break;
      case 'ig-href':   el.href = CONFIG.instagram; el.target = '_blank'; el.rel = 'noopener'; break;
      case 'fb-href':   el.href = CONFIG.facebook; el.target = '_blank'; el.rel = 'noopener'; break;
      case 'year':      el.textContent = new Date().getFullYear(); break;
    }
  });

  $$('.js-wa').forEach(function (el) {
    const msg = el.getAttribute('data-wa-msg') || 'Olá! Vim pelo site da Tá No Clima.';
    el.href = waBase + '?text=' + encodeURIComponent(msg);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- 2. abertura: segura a página e libera as entradas ---------- */
  function abertura() {
    const intro = $('[data-el="intro"]');
    const inner = $('[data-el="introIn"]');
    const skip = $('[data-el="skip"]');
    const liberar = function () {
      $$('[data-gate]').forEach(function (n) { n.style.animationPlayState = 'running'; });
    };

    if (!intro || CONFIG.abertura === false || reduzido) {
      if (intro) intro.remove();
      liberar();
      return;
    }

    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    let pronto = false;
    let tempo;

    const encerrar = function () {
      if (pronto) return;
      pronto = true;
      clearTimeout(tempo);
      intro.style.opacity = '0';
      intro.style.pointerEvents = 'none';
      if (inner) inner.style.transform = 'translateY(-14px) scale(.99)';
      document.body.style.overflow = '';
      liberar();
      setTimeout(function () { if (intro.parentNode) intro.remove(); }, 1000);
    };

    tempo = setTimeout(encerrar, 4000);
    intro.addEventListener('click', encerrar);
    if (skip) skip.addEventListener('click', encerrar);
  }

  /* ---------- 3. revelações por rolagem ---------- */
  function revelacoes() {
    const fades = $$('[data-reveal]');
    const grupos = $$('[data-lines]');

    if (reduzido || !('IntersectionObserver' in window)) return;

    fades.forEach(function (n) {
      n.style.opacity = '0';
      n.style.transform = 'translate3d(0,26px,0)';
      n.style.transition = 'opacity 1s ' + EASE + ', transform 1.1s ' + EASE;
    });
    grupos.forEach(function (g) {
      $$('[data-line]', g).forEach(function (l) {
        l.style.display = 'block';
        l.style.transform = 'translate3d(0,112%,0)';
        l.style.transition = 'transform 1.15s ' + EASE;
      });
    });

    const io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        const alvo = e.target;
        if (alvo.hasAttribute('data-lines')) {
          $$('[data-line]', alvo).forEach(function (l, i) {
            l.style.transitionDelay = i * 95 + 'ms';
            l.style.transform = 'none';
          });
        } else {
          const ordem = parseInt(alvo.getAttribute('data-reveal'), 10) || 1;
          const extra = parseInt(alvo.getAttribute('data-d'), 10) || 0;
          alvo.style.transitionDelay = ((ordem - 1) * 85 + extra) + 'ms';
          alvo.style.opacity = '1';
          alvo.style.transform = 'none';
        }
        io.unobserve(alvo);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    fades.concat(grupos).forEach(function (n) { io.observe(n); });

    // rede de segurança: nada que já passou pela tela fica preso invisível
    let pendentes = fades.concat(grupos);
    varrer = function () {
      if (!pendentes.length) return;
      pendentes = pendentes.filter(function (n) {
        const r = n.getBoundingClientRect();
        if (r.bottom > 140 && r.top < window.innerHeight) return true;   // ainda pode entrar sozinho
        if (r.bottom > 140) return true;                                  // ainda não chegou
        n.style.transitionDelay = '0ms';
        n.style.opacity = '1';
        n.style.transform = 'none';
        $$('[data-line]', n).forEach(function (l) { l.style.transform = 'none'; });
        io.unobserve(n);
        return false;
      });
    };
  }

  /* ---------- 4. brilho que segue o cursor e botão magnético ---------- */
  function brilhos() {
    if (reduzido) return;
    $$('[data-spot]').forEach(function (alvo) {
      const glow = $('[data-glow]', alvo);
      if (!glow) return;
      alvo.addEventListener('pointermove', function (e) {
        const r = alvo.getBoundingClientRect();
        glow.style.transform = 'translate3d(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px,0)';
        glow.style.opacity = '1';
      });
      alvo.addEventListener('pointerleave', function () { glow.style.opacity = '0'; });
    });

    $$('[data-magnet]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        const r = btn.getBoundingClientRect();
        btn.style.transform = 'translate3d(' +
          ((e.clientX - (r.left + r.width / 2)) * 0.16).toFixed(1) + 'px,' +
          ((e.clientY - (r.top + r.height / 2)) * 0.26).toFixed(1) + 'px,0)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = 'none'; });
    });
  }

  /* ---------- 5. menu, âncoras e link ativo ---------- */
  function navegacao() {
    const burger = $('[data-el="burger"]');
    const nav = $('[data-el="nav"]');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        const aberto = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(aberto));
        burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      });
      $$('a', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    const secoes = $$('.hd__nav a[href^="#"]')
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if ('IntersectionObserver' in window && secoes.length) {
      const spy = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          $$('.hd__nav a').forEach(function (a) {
            a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secoes.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ---------- 6. contadores ---------- */
  function contadores() {
    const alvos = $$('.js-count');
    const rodar = function (el) {
      const fim = parseInt(el.getAttribute('data-to'), 10) || 0;
      const sufixo = el.getAttribute('data-suffix') || '';
      const t0 = performance.now();
      (function passo(agora) {
        const p = Math.min((agora - t0) / 1500, 1);
        el.textContent = Math.round(fim * easeOut(p)) + sufixo;
        if (p < 1) requestAnimationFrame(passo);
      })(t0);
    };
    if (reduzido || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.textContent = el.getAttribute('data-to') + (el.getAttribute('data-suffix') || ''); });
      return;
    }
    const io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        rodar(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    alvos.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 7. dúvidas: abre uma por vez ---------- */
  function duvidas() {
    const accs = $$('.acc');
    accs.forEach(function (acc) {
      acc.addEventListener('toggle', function () {
        if (!acc.open) return;
        accs.forEach(function (o) { if (o !== acc) o.open = false; });
      });
    });
  }

  /* ---------- 8. formulário -> WhatsApp ---------- */
  function formulario() {
    const form = $('#form');
    if (!form) return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const d = new FormData(form);
      const linhas = [
        'Olá! Vim pelo site da Tá No Clima e quero um orçamento.', '',
        'Nome: ' + (d.get('nome') || '-'),
        'WhatsApp: ' + (d.get('fone') || '-'),
        'Tipo: ' + (d.get('perfil') || '-'),
        'Serviço: ' + (d.get('servico') || '-'),
        'Bairro: ' + (d.get('bairro') || '-'), '',
        'Detalhes: ' + (d.get('msg') || '-')
      ];
      window.open(waBase + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* =========================================================
     9. MOTOR DE ROLAGEM — um único requestAnimationFrame
     ========================================================= */
  const el = {
    track: $('[data-el="track"]'), scene: $('[data-el="scene"]'), heroui: $('[data-el="heroui"]'),
    header: $('[data-el="header"]'), fill: $('[data-el="progFill"]')
  };

  let pHero = 0, pBar = 0, pCiclo = 0, ciclo = null;
  let varrer = null;   // rede de segurança das revelações, chamada a cada quadro

  function montarCiclo() {
    const track = $('[data-el="cyTrack"]');
    if (!track) return null;
    return {
      track: track,
      warm: $('[data-el="cyWarm"]'), cool: $('[data-el="cyCool"]'), flow: $('[data-el="cyFlow"]'),
      sweep: $('[data-el="cySweep"]'), temp: $('[data-el="cyTemp"]'), fill: $('[data-el="cyFill"]'),
      final: $('[data-el="cyFinal"]'), room: $('.cy__room'),
      passos: $$('[data-cystep]'), marcas: $$('[data-cymark]')
    };
  }

  function rodarCiclo(vh) {
    if (!ciclo) return;
    const c = ciclo;
    const r = c.track.getBoundingClientRect();
    if (r.bottom < -80 || r.top > vh + 80) return;

    const alvo = clamp(-r.top / ((r.height - vh) || 1), 0, 1);
    pCiclo = reduzido ? alvo : (Math.abs(alvo - pCiclo) < 0.0002 ? alvo : mix(pCiclo, alvo, 0.09));
    const p = pCiclo;

    // ambiente esquentando -> gelando
    c.warm.style.opacity = (0.95 * (1 - easeIO(span(p, 0.14, 0.62)))).toFixed(3);
    c.cool.style.opacity = (0.9 * easeIO(span(p, 0.42, 0.9))).toFixed(3);
    c.flow.style.opacity = (0.95 * easeOut(span(p, 0.3, 0.55))).toFixed(3);

    // varredura de limpeza atravessando o ambiente
    const sw = span(p, 0.22, 0.72);
    c.sweep.style.opacity = (sw > 0.01 && sw < 0.99 ? 1 : 0).toFixed(2);
    const larg = c.room ? c.room.getBoundingClientRect().width : 520;
    c.sweep.style.transform = 'translateX(' + (-140 + sw * (larg + 260)).toFixed(0) + 'px)';

    // termômetro 32° -> 21°
    c.temp.textContent = Math.round(32 - 11 * easeIO(span(p, 0.16, 0.86)));

    // trilho e marcas
    c.fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    const etapa = p < 0.26 ? 0 : p < 0.5 ? 1 : p < 0.74 ? 2 : 3;
    c.marcas.forEach(function (m, i) { m.classList.toggle('on', i === etapa); });

    // narrativa: um passo por vez, entrando e saindo
    const janelas = [[0.02, 0.28], [0.26, 0.52], [0.5, 0.76], [0.74, 1.01]];
    c.passos.forEach(function (n, i) {
      const j = janelas[i];
      const dentro = easeOut(span(p, j[0], j[0] + 0.07));
      const fora = i === 3 ? 0 : easeIO(span(p, j[1] - 0.05, j[1]));
      const v = dentro * (1 - fora);
      n.style.opacity = v.toFixed(3);
      n.style.transform = 'translate3d(0,' + ((1 - dentro) * 22 + fora * -18).toFixed(1) + 'px,0)';
    });

    // desfecho
    const f = easeIO(span(p, 0.9, 1));
    c.final.style.opacity = f.toFixed(3);
    c.final.style.pointerEvents = f > 0.6 ? 'auto' : 'none';
  }

  function quadro() {
    const vh = window.innerHeight;
    const sy = window.pageYOffset || document.documentElement.scrollTop;

    if (el.track && el.scene && el.heroui) {
      const r = el.track.getBoundingClientRect();
      const alvo = clamp(-r.top / ((r.height - vh) || 1), 0, 1);
      pHero = Math.abs(alvo - pHero) < 0.0002 ? alvo : mix(pHero, alvo, 0.085);
      const m = reduzido ? 0 : 1;

      el.scene.style.transform = 'translate3d(0,' + (-4 * m * pHero).toFixed(3) + '%,0) scale(' +
        (1 + 0.12 * m * pHero).toFixed(4) + ')';

      const sai = easeIO(span(pHero, 0.08, 0.42));
      el.heroui.style.opacity = (1 - sai).toFixed(3);
      el.heroui.style.transform = 'translate3d(0,' + (-70 * m * sai).toFixed(1) + 'px,0)';
    }

    if (el.header) {
      const solido = span(sy, 24, 130);
      el.header.style.backgroundColor = 'rgba(6,21,41,' + (0.94 * solido).toFixed(3) + ')';
      el.header.style.borderBottomColor = 'rgba(127,212,245,' + (0.16 * solido).toFixed(3) + ')';
      el.header.style.backdropFilter = solido > 0.05 ? 'blur(14px)' : 'none';
      const pad = mix(window.innerWidth < 760 ? 16 : 24, window.innerWidth < 760 ? 11 : 15, solido);
      el.header.style.paddingTop = el.header.style.paddingBottom = pad.toFixed(1) + 'px';
    }

    rodarCiclo(vh);
    if (varrer) varrer();

    if (el.fill) {
      const de = document.documentElement;
      pBar = mix(pBar, clamp(sy / ((de.scrollHeight - vh) || 1), 0, 1), 0.12);
      el.fill.style.transform = 'scaleX(' + pBar.toFixed(4) + ')';
    }

    requestAnimationFrame(quadro);
  }

  /* ---------- partida ---------- */
  abertura();
  revelacoes();
  brilhos();
  navegacao();
  contadores();
  duvidas();
  formulario();
  ciclo = montarCiclo();
  requestAnimationFrame(quadro);
})();
