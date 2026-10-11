/* ==========================================================================
   André Campello · Agro Assessoria Jurídica — interações e animações
   ========================================================================== */
(() => {
  'use strict';
  window.__acReady = true;

  const root = document.documentElement;
  const reduced = root.classList.contains('reduced-motion');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const digits = (s) => String(s || '').replace(/\D+/g, '');
  const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

  /* ---------------- Configuração ---------------- */
  const cfg = Object.assign({
    whatsapp: '', whatsappMessage: '', email: '', instagram: '',
    linktree: '', formEndpoint: '', oab: '', endereco: ''
  }, window.SITE_CONFIG || {});

  const waNumber = digits(cfg.whatsapp);
  const hasWa = waNumber.length >= 10;
  const email = String(cfg.email || '').trim();
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const linktree = String(cfg.linktree || '').trim();
  const hasLinktree = /^https?:\/\//i.test(linktree);
  const igUser = String(cfg.instagram || '').trim().replace(/^@/, '');
  const instagramUrl = igUser ? `https://www.instagram.com/${encodeURIComponent(igUser)}/` : '';
  const formEndpoint = String(cfg.formEndpoint || '').trim();

  const waLink = (text) => `https://wa.me/${waNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  const mailLink = (subject, body) => {
    const q = [];
    if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
    if (body) q.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${email}${q.length ? `?${q.join('&')}` : ''}`;
  };
  const formatWa = (n) => {
    let d = n;
    if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `+${n}`;
  };

  function applyConfig() {
    const enabled = {
      whatsapp: hasWa,
      email: hasEmail,
      linktree: hasLinktree,
      oab: !!String(cfg.oab || '').trim(),
      endereco: !!String(cfg.endereco || '').trim()
    };
    $$('[data-config-show]').forEach((el) => { el.hidden = !enabled[el.dataset.configShow]; });
    $$('[data-config-text]').forEach((el) => {
      const k = el.dataset.configText;
      el.textContent = k === 'whatsappLabel' ? (hasWa ? formatWa(waNumber) : '') : String(cfg[k] || '').trim();
    });
    if (instagramUrl) $$('[data-instagram]').forEach((a) => { a.href = instagramUrl; });

    // Canais configurados viram links reais (abrem direto, inclusive sem JS depois)
    $$('[data-action]').forEach((a) => {
      const action = a.dataset.action;
      let href = '';
      if (action === 'whatsapp' && hasWa) href = waLink(cfg.whatsappMessage);
      if (action === 'email' && hasEmail) href = mailLink('Contato pelo site');
      if (action === 'linktree' && hasLinktree) href = linktree;
      if (!href) return;
      a.href = href;
      if (!href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener'; }
      a.dataset.configured = '1';
    });

    const wa = $('.wa-float');
    if (wa) wa.hidden = !hasWa;

    $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

    if (!hasWa && !hasEmail && !formEndpoint) {
      console.info('[André Campello] Canais de contato ainda não configurados. Preencha whatsapp, email ou formEndpoint em assets/js/config.js.');
    }
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(msg) {
    const t = $('.toast');
    if (!t) return;
    $('.toast__text', t).textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-visible'), 4600);
  }

  /* ---------------- Divisão de texto (letras / palavras) ---------------- */
  function splitText(el) {
    if (el.dataset.splitDone) return;
    const mode = el.dataset.split === 'words' ? 'words' : 'chars';
    let i = 0;
    const unit = (t) => {
      const u = document.createElement('span');
      u.className = 'u';
      u.textContent = t;
      u.style.setProperty('--i', i++);
      return u;
    };
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            if (mode === 'words') w.appendChild(unit(part));
            else for (const ch of part) w.appendChild(unit(ch));
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR' && !child.classList.contains('sr-only')) {
          walk(child);
        }
      });
    };
    const original = el.textContent.replace(/\s+/g, ' ').trim();
    walk(el);
    // Leitores de tela recebem o texto inteiro, não letra por letra
    if (mode === 'chars' && !el.closest('[aria-hidden="true"]')) {
      $$('.w', el).forEach((w) => w.setAttribute('aria-hidden', 'true'));
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = original;
      el.insertBefore(sr, el.firstChild);
    }
    const spread = mode === 'words' ? 900 : 1000;
    const base = mode === 'words' ? 42 : 34;
    el.style.setProperty('--st', `${Math.min(base, spread / Math.max(i, 1)).toFixed(1)}ms`);
    el.classList.add('is-split');
    el.dataset.splitDone = '1';
  }

  /* ---------------- Revelações ---------------- */
  let revealIO = null;

  function prepareReveals() {
    $$('.section-seam').forEach((s) => { s.dataset.reveal = 'seam'; });
    $$('[data-delay]').forEach((el) => el.style.setProperty('--d', `${parseInt(el.dataset.delay, 10) || 0}ms`));
    $$('[data-stagger]').forEach((group) => {
      const step = parseInt(group.dataset.stagger, 10) || 100;
      const base = parseInt(group.dataset.delay, 10) || 0;
      Array.from(group.children)
        .filter((c) => c.hasAttribute('data-reveal'))
        .forEach((c, idx) => {
          const own = parseInt(c.dataset.delay, 10) || 0;
          c.style.setProperty('--d', `${base + own + idx * step}ms`);
        });
    });
    if (!reduced) $$('[data-split]').forEach(splitText);
  }

  function startReveals() {
    const targets = $$('[data-reveal], [data-split]');
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    // O hero é coreografado logo após o preloader, sem depender da rolagem
    const hero = $('.hero');
    const rest = targets.filter((el) => {
      if (hero && hero.contains(el)) { el.classList.add('is-in'); return false; }
      return true;
    });

    // Elementos escondidos por clip-path não "intersectam" para o observer:
    // nesses casos observamos o elemento pai.
    const watched = new Map();
    rest.forEach((el) => {
      const clipped = el.dataset.reveal === 'curtain' || el.dataset.reveal === 'sign';
      const probe = clipped && el.parentElement ? el.parentElement : el;
      if (!watched.has(probe)) watched.set(probe, []);
      watched.get(probe).push(el);
    });
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        (watched.get(e.target) || []).forEach((el) => el.classList.add('is-in'));
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    watched.forEach((_, probe) => revealIO.observe(probe));
  }

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    const pre = $('.preloader');
    const t0 = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      root.classList.remove('is-loading');
      root.classList.add('is-loaded');
      startReveals();
      if (pre) setTimeout(() => pre.remove(), 1500);
      if (location.hash && location.hash.length > 1) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) setTimeout(() => scrollToEl(target), 350);
      }
    };
    if (reduced || !pre) { finish(); return; }
    root.classList.add('is-loading');
    const minTime = 2000;
    const go = () => setTimeout(finish, Math.max(0, minTime - (performance.now() - t0)));
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    setTimeout(finish, 4800); // segurança: nunca prende o visitante
  }

  /* ---------------- Rolagem suave ---------------- */
  let scrollRaf = 0;
  let scrollCancel = false;
  const stopScroll = () => { scrollCancel = true; };
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, stopScroll, { passive: true }));

  function headerOffset() {
    const h = $('.header');
    return h ? Math.min(h.offsetHeight, 80) : 0;
  }

  function smoothScrollTo(y) {
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    y = clamp(y, 0, maxY);
    cancelAnimationFrame(scrollRaf);
    if (reduced) { window.scrollTo(0, y); return Promise.resolve(); }
    const startY = window.scrollY;
    const dist = y - startY;
    if (Math.abs(dist) < 2) return Promise.resolve();
    const dur = clamp(Math.abs(dist) * 0.45, 650, 1500);
    const t0 = performance.now();
    scrollCancel = false;
    return new Promise((resolve) => {
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        window.scrollTo(0, startY + dist * e);
        if (p < 1 && !scrollCancel) scrollRaf = requestAnimationFrame(step);
        else resolve();
      };
      scrollRaf = requestAnimationFrame(step);
    });
  }

  function scrollToEl(el) {
    if (!el) return Promise.resolve();
    const y = el.id === 'inicio' ? 0 : el.getBoundingClientRect().top + window.scrollY - headerOffset() - 12;
    return smoothScrollTo(y);
  }

  /* ---------------- Ações dos botões ---------------- */
  function focusForm(subject) {
    const formCard = $('#form-card');
    const select = $('#f-assunto');
    if (subject && select) {
      const opt = Array.from(select.options).find((o) => o.value === subject || o.text === subject);
      if (opt) { select.value = opt.value || opt.text; updateSelectState(); }
    }
    return scrollToEl(formCard).then(() => {
      if (!formCard) return;
      formCard.classList.remove('is-flash');
      void formCard.offsetWidth;
      formCard.classList.add('is-flash');
      const firstEmpty = $$('#contact-form .field__input').find((f) => f.required && !f.value.trim());
      (firstEmpty || $('#f-mensagem'))?.focus({ preventScroll: true });
    });
  }

  function handleAction(a, e) {
    if (a.dataset.configured) return false; // link real (wa.me, mailto, linktree)
    const action = a.dataset.action;
    e.preventDefault();
    closeMenu();
    const messages = {
      whatsapp: 'O WhatsApp será ativado em breve. Envie sua mensagem pelo formulário.',
      email: 'O e-mail será ativado em breve. Use o formulário abaixo.',
      linktree: 'O Linktree será ativado em breve. Enquanto isso, use o formulário ou o Instagram.'
    };
    focusForm();
    if (messages[action]) toast(messages[action]);
    return true;
  }

  function initLinks() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;

      if (a.dataset.action && handleAction(a, e)) return;
      if (a.dataset.configured) return;

      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#') || href.length < 2) return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      e.preventDefault();
      closeMenu();

      if (a.dataset.subject) {
        focusForm(a.dataset.subject);
        toast(`Assunto selecionado: ${a.dataset.subject}`);
        return;
      }

      const after = () => {
        if (a.hasAttribute('data-highlight')) {
          target.classList.remove('is-highlight');
          void target.offsetWidth;
          target.classList.add('is-highlight');
          setTimeout(() => target.classList.remove('is-highlight'), 3400);
        }
        if (target.id === 'form-card') {
          const first = $('#f-nome');
          first && first.focus({ preventScroll: true });
        }
      };
      scrollToEl(target).then(after);
      if (history.replaceState) history.replaceState(null, '', target.id === 'inicio' ? location.pathname + location.search : `#${target.id}`);
    });
  }

  /* ---------------- Menu mobile ---------------- */
  const burger = $('.burger');
  const menu = $('#menu-mobile');

  function setMenu(open) {
    if (!menu || !burger) return;
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    if (open) setTimeout(() => $('.menu__link', menu)?.focus({ preventScroll: true }), 450);
  }
  function closeMenu() { if (root.classList.contains('menu-open')) setMenu(false); }

  function initMenu() {
    if (!menu || !burger) return;
    menu.inert = true;
    burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', () => { if (!isMobile()) closeMenu(); });
  }

  /* ---------------- Navegação ativa ---------------- */
  function initNav() {
    const links = $$('[data-nav]');
    const nav = $('.nav');
    const indicator = $('.nav__indicator');

    $$('.nav__link').forEach((a) => {
      const text = a.textContent.trim();
      const roll = document.createElement('span');
      roll.className = 'roll';
      roll.dataset.text = text;
      const inner = document.createElement('span');
      inner.textContent = text;
      roll.appendChild(inner);
      a.textContent = '';
      a.appendChild(roll);
    });

    const moveIndicator = () => {
      const active = $('.nav__link.is-active');
      if (!active || !indicator || !nav) return;
      const nr = nav.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      indicator.style.setProperty('--x', `${ar.left - nr.left}px`);
      indicator.style.setProperty('--w', `${ar.width}px`);
    };
    const setActive = (id) => {
      links.forEach((l) => {
        const on = l.dataset.nav === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      moveIndicator();
    };

    const sections = ['inicio', 'areas', 'sobre', 'contato'].map((id) => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      }, { rootMargin: '-42% 0px -52% 0px' });
      sections.forEach((s) => spy.observe(s));
    }
    window.addEventListener('resize', moveIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
    setTimeout(moveIndicator, 600);
    moveIndicator();
  }

  /* ---------------- Rolagem: header, progresso, parallax ---------------- */
  function initScroll() {
    const header = $('.header');
    const bar = $('.scroll-progress span');
    const waFloat = $('.wa-float');
    const heroMedia = $('.hero__media');
    const parallax = $$('[data-parallax]');
    const parallaxImgs = $$('[data-parallax-img]');
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;

      header && header.classList.toggle('is-scrolled', y > 30);
      bar && bar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      waFloat && waFloat.classList.toggle('is-visible', y > vh * 0.6);

      if (reduced) return;
      const mobile = isMobile();

      if (heroMedia && y < vh * 1.3) heroMedia.style.translate = `0 ${(y * (mobile ? 0.18 : 0.26)).toFixed(1)}px`;

      parallax.forEach((el) => {
        if (mobile) { el.style.translate = ''; return; }
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const f = parseFloat(el.dataset.parallax) || 0;
        const delta = (r.top + r.height / 2 - vh / 2) * f;
        el.style.translate = `0 ${delta.toFixed(1)}px`;
      });

      parallaxImgs.forEach((img) => {
        const box = img.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const f = parseFloat(img.dataset.parallaxImg) || 0;
        const limit = box.height * 0.055;
        const delta = clamp((box.top + box.height / 2 - vh / 2) * -f, -limit, limit);
        img.style.translate = `0 ${delta.toFixed(1)}px`;
      });
    };

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------------- Hovers: brilho que segue o cursor e leve inclinação ---------------- */
  function initPointerFx() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.card, .quick__card, .channel').forEach((el) => {
      const tilt = el.hasAttribute('data-tilt') && !reduced;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        if (tilt) {
          el.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`);
          el.style.setProperty('--rx', `${((0.5 - y) * 4).toFixed(2)}deg`);
        }
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------- Poeira dourada no hero ---------------- */
  function initDust() {
    const canvas = $('.hero__dust');
    if (!canvas || reduced || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = 0, running = false;
    const parts = [];

    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext('2d');
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,240,200,1)');
    g.addColorStop(0.25, 'rgba(255,214,140,.65)');
    g.addColorStop(1, 'rgba(255,190,100,0)');
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);

    const spawn = (p, initial) => {
      const mobile = w < 760;
      p.x = w * (mobile ? Math.random() : 0.3 + Math.random() * 0.7);
      p.y = initial ? Math.random() * h : h + 10;
      p.r = 0.6 + Math.random() * 2.2;
      p.vy = -(0.12 + Math.random() * 0.36);
      p.vx = (Math.random() - 0.5) * 0.16;
      p.ta = 0.25 + Math.random() * 0.55;
      p.ph = Math.random() * Math.PI * 2;
      p.sp = 0.006 + Math.random() * 0.014;
      return p;
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 760 ? 32 : 70;
      parts.length = 0;
      for (let i = 0; i < n; i++) parts.push(spawn({}, true));
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        p.ph += p.sp;
        p.x += p.vx + Math.sin(p.ph) * 0.18;
        p.y += p.vy;
        if (p.y < -20 || p.x < -20 || p.x > w + 20) spawn(p, false);
        const life = clamp(p.y / h, 0, 1);
        const edge = Math.min(1, life * 4, (1 - life) * 6 + 0.2);
        const a = p.ta * (0.55 + 0.45 * Math.sin(p.ph * 1.7)) * edge;
        const s = p.r * 6;
        ctx.globalAlpha = clamp(a, 0, 1);
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    window.addEventListener('resize', () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 200); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
    } else start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }

  /* ---------------- Formulário ---------------- */
  const form = $('#contact-form');
  const selectEl = $('#f-assunto');

  function updateSelectState() {
    if (selectEl) selectEl.classList.toggle('is-empty', !selectEl.value);
  }

  function maskPhone(v) {
    let d = digits(v);
    if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
    d = d.slice(0, 11);
    if (!d) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function setError(name, msg) {
    const input = form.elements[name];
    const field = input && input.closest('.field');
    const err = $(`#e-${name}`);
    if (!field) return;
    field.classList.toggle('is-invalid', !!msg);
    if (err) err.textContent = msg || '';
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (err) input.setAttribute('aria-describedby', err.id);
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function setStatus(html, type) {
    const st = $('.form__status', form);
    st.classList.toggle('is-error', type === 'error');
    st.innerHTML = html;
  }

  function composeMessage(d) {
    const lines = [
      'Olá! Vim pelo site da André Campello Agro Assessoria Jurídica.',
      '',
      `Nome: ${d.nome}`,
      `Telefone/WhatsApp: ${d.telefone}`
    ];
    if (d.email) lines.push(`E-mail: ${d.email}`);
    if (d.assunto) lines.push(`Assunto: ${d.assunto}`);
    if (d.mensagem) lines.push('', d.mensagem);
    return lines.join('\n');
  }

  function initForm() {
    if (!form) return;
    updateSelectState();
    selectEl && selectEl.addEventListener('change', updateSelectState);

    const tel = form.elements.telefone;
    tel.addEventListener('input', () => {
      const pos = tel.value.length;
      tel.value = maskPhone(tel.value);
      if (document.activeElement === tel && pos === tel.value.length) tel.setSelectionRange(pos, pos);
    });

    ['nome', 'telefone', 'email'].forEach((n) => {
      form.elements[n].addEventListener('input', () => setError(n, ''));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('', '');
      const data = {
        nome: form.elements.nome.value.trim(),
        telefone: form.elements.telefone.value.trim(),
        email: form.elements.email.value.trim(),
        assunto: form.elements.assunto.value.trim(),
        mensagem: form.elements.mensagem.value.trim()
      };

      // Armadilha simples contra robôs
      if (form.elements.website.value) {
        setStatus('Mensagem recebida. Obrigado!', 'success');
        form.reset();
        return;
      }

      const errors = {};
      if (data.nome.length < 2) errors.nome = 'Informe seu nome.';
      const telDigits = digits(data.telefone);
      if (telDigits.length < 10) errors.telefone = 'Informe um telefone com DDD.';
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Confira o e-mail informado.';
      ['nome', 'telefone', 'email'].forEach((n) => setError(n, errors[n]));
      const firstInvalid = ['nome', 'telefone', 'email'].find((n) => errors[n]);
      if (firstInvalid) { form.elements[firstInvalid].focus(); return; }

      const text = composeMessage(data);
      const btn = $('button[type="submit"]', form);

      if (formEndpoint) {
        btn.classList.add('is-loading');
        try {
          const res = await fetch(formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(Object.assign({}, data, { _subject: `Contato pelo site — ${data.assunto || 'Assunto geral'}` }))
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setStatus('Mensagem enviada com sucesso! Em breve nossa equipe entrará em contato.', 'success');
          form.reset();
          updateSelectState();
        } catch (err) {
          setStatus(`Não foi possível enviar agora. Tente novamente em instantes${hasWa ? ' ou fale conosco pelo WhatsApp' : ''}.`, 'error');
        } finally {
          btn.classList.remove('is-loading');
        }
        return;
      }

      if (hasWa) {
        window.open(waLink(text), '_blank', 'noopener');
        setStatus('Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar!', 'success');
        return;
      }

      if (hasEmail) {
        window.location.href = mailLink(`Contato pelo site — ${data.assunto || 'Assunto geral'}`, text);
        setStatus('Abrimos o seu aplicativo de e-mail com a mensagem pronta para envio.', 'success');
        return;
      }

      const ig = instagramUrl
        ? ` Enquanto isso, fale com a gente pelo Instagram <a href="${instagramUrl}" target="_blank" rel="noopener">@${igUser}</a>.`
        : '';
      setStatus(`Seu formulário está pronto, mas o canal de envio ainda está em configuração.${ig}`, 'info');
    });
  }

  /* ---------------- Início ---------------- */
  applyConfig();
  prepareReveals();
  initMenu();
  initNav();
  initLinks();
  initScroll();
  initPointerFx();
  initForm();
  initDust();
  initPreloader();
})();
