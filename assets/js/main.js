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

  /* ---------- 10. fotografias opcionais ----------
     Cada [data-foto] só aparece se o arquivo existir. Enquanto não existir,
     a cena desenhada em CSS/SVG continua no lugar e nada quebra. */
  function fotos() {
    $$('[data-foto]').forEach(function (bloco) {
      const img = $('img', bloco);
      if (!img) return;
      const aceitar = function () {
        if (!img.naturalWidth) return;
        bloco.classList.add('ok');
        const pai = bloco.parentElement;
        if (pai) pai.classList.add('tem-foto');
      };
      const recusar = function () { bloco.remove(); };
      if (img.complete) { img.naturalWidth ? aceitar() : recusar(); }
      else {
        img.addEventListener('load', aceitar, { once: true });
        img.addEventListener('error', recusar, { once: true });
      }
    });
  }

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
    const track = $('[data-el="cfTrack"]');
    if (!track) return null;
    const c = {
      track: track, box: $('[data-el="cfMediaBox"]'), media: $('[data-el="cfMedia"]'),
      warm: $('[data-el="cfWarm"]'), cool: $('[data-el="cfCool"]'), flow: $('[data-el="cfFlow"]'),
      sweep: $('[data-el="cfSweep"]'), bar: $('[data-el="cfBar"]'), temp: $('[data-el="cfTemp"]'),
      linhas: [$('[data-el="cfR0"]'), $('[data-el="cfR1"]'), $('[data-el="cfLead"]'), $('[data-el="cfR2"]')],
      cards: $$('[data-cfcard]'),
      estados: [$('[data-el="cfState0"]'), $('[data-el="cfState1"]'), $('[data-el="cfState2"]')],
      paradas: [$('[data-el="cfStop0"]'), $('[data-el="cfStop1"]'), $('[data-el="cfStop2"]')]
    };
    c.linhas.concat(c.cards).forEach(function (n) { if (n) n.style.willChange = 'opacity,transform'; });
    return c;
  }

  // Capítulo do resfriamento: o progresso da trilha comanda o desfoque de
  // entrada, a troca da camada quente pela fria, o fluxo de ar, a varredura,
  // o termômetro, as etapas e a entrada escalonada do texto e dos cards.
  function rodarCiclo(vh) {
    if (!ciclo) return;
    const c = ciclo;
    const r = c.track.getBoundingClientRect();
    if (r.bottom < -80 || r.top > vh + 80) return;

    const cru = clamp(-r.top / ((r.height - vh) || 1), 0, 1);
    if (reduzido) pCiclo = cru < 0.02 ? 0 : 1;
    else pCiclo = Math.abs(cru - pCiclo) < 0.0002 ? cru : mix(pCiclo, cru, 0.09);
    const p = pCiclo;
    const mm = reduzido ? 0 : 1;

    // a cena entra desfocada e vai ganhando nitidez e brilho
    const entrada = easeOut(span(p, 0, 0.1));
    c.media.style.filter = 'blur(' + ((1 - entrada) * 14).toFixed(2) + 'px) saturate(' +
      (1.22 - 0.22 * span(p, 0.2, 0.8)).toFixed(3) + ') brightness(' +
      (0.86 + 0.16 * span(p, 0.15, 0.85)).toFixed(3) + ')';
    c.media.style.opacity = (0.45 + 0.55 * entrada).toFixed(3);
    const deriva = span(p, 0, 1);
    c.media.style.transform = 'translate3d(0,' + (-2.6 * mm * deriva).toFixed(2) + '%,0) scale(' +
      (1.07 - 0.05 * entrada + 0.035 * mm * deriva).toFixed(4) + ')';

    // quente sai, frio entra
    c.warm.style.opacity = (0.92 * (1 - easeIO(span(p, 0.16, 0.6)))).toFixed(3);
    c.cool.style.opacity = (0.85 * easeIO(span(p, 0.44, 0.88))).toFixed(3);
    c.flow.style.opacity = (0.9 * easeOut(span(p, 0.26, 0.5)) * (1 - 0.35 * span(p, 0.88, 1))).toFixed(3);

    // varredura atravessando a cena
    const sw = span(p, 0.2, 0.74);
    c.sweep.style.opacity = (sw > 0 && sw < 1 ? 1 : 0).toFixed(2);
    const larg = c.box ? c.box.getBoundingClientRect().width : 600;
    c.sweep.style.transform = 'translateX(' + (-160 + sw * (larg + 300)).toFixed(0) + 'px)';

    // termômetro e trilho
    c.bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    escrever(c.temp, String(Math.round(32 - 10 * easeIO(span(p, 0.14, 0.84)))));

    const etapa = p < 0.36 ? 0 : p < 0.7 ? 1 : 2;
    for (let i = 0; i < 3; i++) {
      c.estados[i].style.color = i === etapa ? '#7FD4F5' : 'rgba(238,246,252,.32)';
      c.paradas[i].style.color = i === etapa ? 'rgba(238,246,252,.9)' : 'rgba(238,246,252,.3)';
    }

    // texto e cards entrando em cascata
    for (let i = 0; i < c.linhas.length; i++) {
      const n = c.linhas[i];
      if (!n) continue;
      const v = easeOut(span(p, 0.04 + i * 0.05, 0.2 + i * 0.05));
      n.style.opacity = v.toFixed(3);
      n.style.transform = 'translate3d(0,' + ((1 - v) * 22 * (mm || 1)).toFixed(1) + 'px,0)';
    }
    for (let i = 0; i < c.cards.length; i++) {
      const v = easeOut(span(p, 0.46 + i * 0.07, 0.62 + i * 0.07));
      c.cards[i].style.opacity = v.toFixed(3);
      c.cards[i].style.transform = 'translate3d(0,' + ((1 - v) * 26 * (mm || 1)).toFixed(1) + 'px,0)';
    }
  }


  /* =========================================================
     O AR QUE TRANSFORMA O AMBIENTE
     Cinco atos num único progresso. Nada aqui é uma animação
     independente: câmera, luz, calor, partículas e leitura
     técnica são funções da mesma variável de rolagem.
     ========================================================= */
  let ar = null, pAr = 0;

  // escrever texto é caro: só troca quando o valor muda de fato
  function escrever(el, valor) {
    if (!el || el.__v === valor) return;
    el.__v = valor;
    el.textContent = valor;
  }

  function montarAr() {
    const track = $('[data-el="arTrack"]');
    if (!track) return null;
    const a = {
      track: track, stage: $('.ar__stage', track), cam: $('.ar__room', track),
      sun: $('[data-el="arSun"]'), shim: $('[data-el="arShim"]'), beam: $('[data-el="arBeam"]'),
      curtL: $('[data-el="arCurtL"]'), curtR: $('[data-el="arCurtR"]'),
      folhas: $$('.ar__leaf'), unit: $('[data-el="arUnit"]'), unitGlow: $('[data-el="arUnitGlow"]'),
      warm: $('[data-el="arWarm"]'), cool: $('[data-el="arCool"]'),
      tech: $('[data-el="arTech"]'), linhas: $$('[data-el="arTechLines"] path'),
      bandas: $$('[data-el="arTechBands"] rect'), pontos: $$('[data-el="arTechDots"] circle'),
      hud: $('[data-el="arHud"]'),
      hudFlow: $('[data-el="arHudFlow"]'), hudDelta: $('[data-el="arHudDelta"]'),
      hudCirc: $('[data-el="arHudCirc"]'), hudEff: $('[data-el="arHudEff"]'),
      eyebrow: $('[data-el="arEyebrow"]'), atos: $$('[data-aract]'), hint: $('[data-el="arHint"]'),
      prog: $('[data-el="arProg"]'),
      canvas: $('[data-el="arFlow"]'), particulas: [], ctx: null, w: 0, h: 0, dpr: 1,
      profundidade: $$('.ar__depth', track)
    };

    a.linhas.forEach(function (l) {
      const c = l.getTotalLength ? l.getTotalLength() : 600;
      l.style.strokeDasharray = c;
      l.style.strokeDashoffset = c;
      l.dataset.len = c;
    });
    a.bandas.forEach(function (b) { b.style.transformOrigin = '120px 0'; b.style.transform = 'scaleX(0)'; });
    a.pontos.forEach(function (d) { d.style.opacity = '0'; });

    if (a.canvas && a.canvas.getContext) {
      a.ctx = a.canvas.getContext('2d');
      dimensionarAr(a);
      window.addEventListener('resize', function () { dimensionarAr(a); }, { passive: true });
    }
    return a;
  }

  function dimensionarAr(a) {
    if (!a.ctx) return;
    const r = a.stage.getBoundingClientRect();
    a.dpr = Math.min(window.devicePixelRatio || 1, 2);
    a.w = Math.max(1, Math.round(r.width));
    a.h = Math.max(1, Math.round(r.height));
    a.canvas.width = Math.round(a.w * a.dpr);
    a.canvas.height = Math.round(a.h * a.dpr);
    a.ctx.setTransform(a.dpr, 0, 0, a.dpr, 0, 0);
    a.max = a.w < 760 ? 70 : 150;
  }

  // Emite a partir da saída do aparelho, com profundidade: partícula distante
  // é menor, mais lenta e mais apagada. Sem fumaça — corrente com direção.
  function emitirAr(a, origem, forca) {
    if (a.particulas.length >= a.max * forca) return;
    const z = Math.random();
    a.particulas.push({
      x: origem.x + (Math.random() - 0.5) * origem.w,
      y: origem.y + (Math.random() - 0.5) * 10,
      z: z,
      vx: -(0.9 + z * 2.6) * (0.7 + Math.random() * 0.6),
      vy: (0.14 + Math.random() * 0.4) * (0.5 + z),
      vida: 0,
      total: 150 + Math.random() * 120,
      giro: Math.random() * Math.PI * 2
    });
  }

  function desenharAr(a, forca, frio, origem) {
    const ctx = a.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, a.w, a.h);
    if (forca <= 0.01 || !origem) { a.particulas.length = 0; return; }

    const nascer = Math.round(forca * (a.w < 760 ? 3 : 6));
    for (let i = 0; i < nascer; i++) emitirAr(a, origem, forca);

    for (let i = a.particulas.length - 1; i >= 0; i--) {
      const p = a.particulas[i];
      p.vida++;
      if (p.vida > p.total || p.x < -40 || p.y > a.h + 40) { a.particulas.splice(i, 1); continue; }

      p.giro += 0.012;
      p.x += p.vx * forca;
      p.y += p.vy + Math.sin(p.giro) * 0.36;

      const v = p.vida / p.total;
      const alpha = Math.sin(Math.min(v, 1) * Math.PI) * (0.24 + p.z * 0.62) * forca;
      const raio = (1 + p.z * 2.8) * (a.w < 760 ? 0.82 : 1);
      const azul = 150 + Math.round(frio * 70);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + (188 - Math.round(frio * 40)) + ',' + (222 + Math.round(frio * 10)) + ',' + Math.min(255, azul + 70) + ',' + alpha.toFixed(3) + ')';
      ctx.arc(p.x, p.y, raio, 0, 6.2832);
      ctx.fill();

      // rastro curto: dá direção ao fluxo sem virar fumaça
      if (p.z > 0.55) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200,236,255,' + (alpha * 0.4).toFixed(3) + ')';
        ctx.lineWidth = raio * 0.6;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.stroke();
      }
    }
  }

  function rodarAr(vh) {
    if (!ar) return;
    const a = ar;
    const r = a.track.getBoundingClientRect();
    const visivel = r.bottom > -100 && r.top < vh + 100;
    if (!visivel) {
      if (a.particulas.length) { a.particulas.length = 0; if (a.ctx) a.ctx.clearRect(0, 0, a.w, a.h); }
      return;
    }

    // Medir antes de escrever: um getBoundingClientRect() depois de mexer no
    // estilo obriga o navegador a recalcular o layout no meio do quadro.
    const ru = a.unit.getBoundingClientRect();
    const rs = a.stage.getBoundingClientRect();
    const origem = { x: ru.left - rs.left + ru.width * 0.3, y: ru.bottom - rs.top - 2, w: ru.width * 0.6 };

    const cru = clamp(-r.top / ((r.height - vh) || 1), 0, 1);
    if (reduzido) pAr = cru;
    else pAr = Math.abs(cru - pAr) < 0.0002 ? cru : mix(pAr, cru, 0.065);
    const p = pAr;
    const mm = reduzido ? 0 : 1;

    /* --- câmera: aproxima, orbita e recua --- */
    const entra = easeOut(span(p, 0, 0.16));          // ato 1: aproximação
    const orbita = easeIO(span(p, 0.16, 0.66));       // ato 2 e 3: giro
    const recua = easeIO(span(p, 0.86, 1));           // ato 5: afastamento
    const z = mix(-130, 45, entra) - recua * 250;
    const giroY = mix(-14, 16, orbita) * (1 - recua * 0.55);
    const giroX = mix(3.4, -1.6, orbita) + recua * 2.2;
    a.cam.style.transform = 'translate3d(0,0,' + (z * mm).toFixed(1) + 'px) rotateY(' +
      (giroY * mm).toFixed(2) + 'deg) rotateX(' + (giroX * mm).toFixed(2) + 'deg)';

    /* --- profundidade de campo: o fundo entra desfocado e resolve ---
       blur() em camada do tamanho da tela é caro: cada valor novo obriga o
       navegador a rasterizar tudo de novo. Aqui o valor é arredondado em
       passos de 0,5px e só é escrito quando muda de passo — fora da entrada
       e da saída o filtro sai de cena por completo. */
    const foco = easeOut(span(p, 0, 0.15));
    a.profundidade.forEach(function (d) {
      const fg = d.classList.contains('ar__depth--fg');
      const perto = d.classList.contains('ar__depth--plant');
      const bruto = fg ? mix(8, 4, foco) + recua * 3
        : perto ? mix(3.4, 0.4, foco) + recua * 1.6
        : mix(5.5, 0, foco) + recua * 2.2;
      const passo = Math.round(Math.max(0, bruto) * 2) / 2;
      if (d.__blur === passo) return;
      d.__blur = passo;
      d.style.filter = passo < 0.25 ? 'none' : 'blur(' + passo + 'px)';
    });

    /* --- luz: sol duro vira luz equilibrada --- */
    const esfria = easeIO(span(p, 0.2, 0.62));
    a.sun.style.opacity = (1 - esfria * 0.72).toFixed(3);
    a.sun.style.transform = 'scale(' + (1 + 0.16 * (1 - esfria)).toFixed(3) + ')';
    a.beam.style.opacity = (0.95 - esfria * 0.8).toFixed(3);
    a.shim.style.opacity = (1 - easeOut(span(p, 0.14, 0.44))).toFixed(3);
    a.warm.style.opacity = (0.95 * (1 - esfria)).toFixed(3);
    a.cool.style.opacity = (0.88 * easeIO(span(p, 0.42, 0.9))).toFixed(3);

    /* --- corrente de ar --- */
    const forca = easeOut(span(p, 0.26, 0.5)) * (1 - 0.45 * span(p, 0.9, 1));
    a.unitGlow.style.opacity = (0.95 * easeOut(span(p, 0.4, 0.58)) * (1 - 0.5 * span(p, 0.86, 1))).toFixed(3);
    const destaque = easeOut(span(p, 0.44, 0.6)) * (1 - span(p, 0.82, 1));
    a.unit.style.transform = 'scale(' + (1 + 0.1 * destaque * mm).toFixed(4) + ')';

    /* --- o ambiente reage ao fluxo --- */
    const balanco = Math.sin(performance.now() / 900) * forca * mm;
    a.curtL.style.transform = 'rotate(' + (balanco * 3.4).toFixed(2) + 'deg) skewX(' + (balanco * 2.2).toFixed(2) + 'deg)';
    a.curtR.style.transform = 'rotate(' + (-balanco * 4.2).toFixed(2) + 'deg) skewX(' + (-balanco * 2.8).toFixed(2) + 'deg)';
    a.folhas.forEach(function (f, i) {
      const d = Math.sin(performance.now() / 780 + i * 0.7) * forca * 3.6 * mm;
      f.style.transform = 'rotate(' + d.toFixed(2) + 'deg)';
    });
    desenharAr(a, forca, esfria, origem);

    /* --- leitura técnica: linhas desenhadas sobre o ambiente --- */
    const tecnica = easeIO(span(p, 0.66, 0.78));
    const saiTecnica = easeIO(span(p, 0.86, 0.94));
    const tec = tecnica * (1 - saiTecnica);
    a.tech.style.opacity = tec.toFixed(3);
    a.linhas.forEach(function (l, i) {
      const t = easeOut(span(p, 0.66 + i * 0.025, 0.8 + i * 0.025));
      l.style.strokeDashoffset = (parseFloat(l.dataset.len) * (1 - t)).toFixed(1);
    });
    a.bandas.forEach(function (b, i) {
      b.style.transform = 'scaleX(' + easeOut(span(p, 0.7 + i * 0.03, 0.84 + i * 0.03)).toFixed(3) + ')';
    });
    a.pontos.forEach(function (d, i) {
      d.style.opacity = (easeOut(span(p, 0.72 + i * 0.02, 0.82 + i * 0.02)) * (1 - saiTecnica)).toFixed(3);
    });

    a.hud.style.opacity = tec.toFixed(3);
    a.hud.style.transform = (a.w < 860 ? '' : 'translateY(-50%) ') +
      'translate3d(' + ((1 - tecnica) * 26 * mm).toFixed(1) + 'px,0,0)';
    const leitura = easeOut(span(p, 0.66, 0.86));
    escrever(a.hudFlow, (3.2 * leitura).toFixed(1).replace('.', ','));
    escrever(a.hudDelta, String(Math.round(11 * leitura)));
    escrever(a.hudCirc, String(Math.round(96 * leitura)));
    escrever(a.hudEff, '-' + Math.round(28 * leitura));

    /* --- textos: entram e saem com a composição --- */
    const janelas = [[0.03, 0.2], [0.44, 0.62], [0.68, 0.84], [0.9, 1.01]];
    a.atos.forEach(function (n, i) {
      const j = janelas[i];
      const dentro = easeOut(span(p, j[0], j[0] + 0.06));
      const fora = i === 3 ? 0 : easeIO(span(p, j[1] - 0.05, j[1]));
      const v = dentro * (1 - fora);
      n.style.opacity = v.toFixed(3);
      n.style.transform = 'translate3d(0,' + ((1 - dentro) * 30 + fora * -24).toFixed(1) + 'px,0)';
      n.style.filter = 'blur(' + ((1 - dentro) * 7).toFixed(2) + 'px)';
      n.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
    });

    if (a.hint) {
      const mostra = easeOut(span(p, 0.005, 0.045)) * (1 - easeIO(span(p, 0.1, 0.17)));
      a.hint.style.opacity = mostra.toFixed(3);
    }

    const saiEyebrow = easeIO(span(p, 0.88, 1));
    a.eyebrow.style.opacity = (easeOut(span(p, 0, 0.06)) * (1 - saiEyebrow)).toFixed(3);
    a.prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
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
    rodarAr(vh);
    if (varrer) varrer();

    if (el.fill) {
      const de = document.documentElement;
      pBar = mix(pBar, clamp(sy / ((de.scrollHeight - vh) || 1), 0, 1), 0.12);
      el.fill.style.transform = 'scaleX(' + pBar.toFixed(4) + ')';
    }

    requestAnimationFrame(quadro);
  }

  /* ---------- partida ---------- */
  fotos();
  abertura();
  revelacoes();
  brilhos();
  navegacao();
  contadores();
  duvidas();
  formulario();
  ciclo = montarCiclo();
  ar = montarAr();
  requestAnimationFrame(quadro);
})();
