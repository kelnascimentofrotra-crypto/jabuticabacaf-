/* =========================================================================
   MUNDO SOLAR — interações do site
   ========================================================================= */

/**
 * Dados de contato da empresa (usados nos botões, no rodapé e no formulário).
 * Se um campo ficar vazio, os botões de WhatsApp passam a abrir o formulário de orçamento.
 */
const SITE_CONFIG = {
  // Número com DDI + DDD, somente dígitos
  whatsapp: '559491243878',
  // Como o número aparece no rodapé
  whatsappDisplay: '(94) 9124-3878',
  // Usuário do Instagram, sem @
  instagram: 'mundosolar.redencao',
  // E-mail de atendimento
  email: 'atendimentomundosolar@gmail.com',
  // Mensagem inicial das conversas pelo WhatsApp
  whatsappMessage: 'Olá, Mundo Solar! Gostaria de saber mais sobre energia solar.',
};

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopMQ = window.matchMedia('(min-width: 900px)');
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const digits = (v) => String(v || '').replace(/\D/g, '');
  const hasWhatsApp = digits(SITE_CONFIG.whatsapp).length >= 10;
  const waLink = (text) =>
    `https://wa.me/${digits(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(text || SITE_CONFIG.whatsappMessage)}`;

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Contatos do rodapé ---------- */
  const contacts = {
    whatsapp: hasWhatsApp && {
      href: waLink(),
      label: SITE_CONFIG.whatsappDisplay || `+${digits(SITE_CONFIG.whatsapp)}`,
      external: true,
    },
    instagram: SITE_CONFIG.instagram && {
      href: `https://www.instagram.com/${SITE_CONFIG.instagram.replace(/^@/, '')}/`,
      label: `@${SITE_CONFIG.instagram.replace(/^@/, '')}`,
      external: true,
    },
    email: SITE_CONFIG.email && {
      href: `mailto:${SITE_CONFIG.email}`,
      label: SITE_CONFIG.email,
      external: false,
    },
  };
  $$('[data-contact]').forEach((a) => {
    const c = contacts[a.dataset.contact];
    if (!c) return;
    a.href = c.href;
    if (c.external) { a.target = '_blank'; a.rel = 'noopener'; }
    const value = $('[data-contact-value]', a);
    if (value) value.textContent = c.label;
  });

  /* ---------- Janelas modais ----------
   * Usa <dialog> nativo; em navegadores sem suporte (ex.: iOS antigo) abre a janela
   * manualmente, com fundo escurecido, Esc e clique fora para fechar.
   */
  const root = document.documentElement;
  const nativeDialog = typeof document.createElement('dialog').showModal === 'function';
  if (!nativeDialog) root.classList.add('no-dialog');
  let lastFocus = null;

  const isOpen = (el) => !!el && el.hasAttribute('open');
  const openModal = (el) => {
    if (!el) return false;
    lastFocus = document.activeElement;
    if (nativeDialog) {
      el.showModal();
    } else {
      el.setAttribute('open', '');
      root.classList.add('modal-open');
      const first = $('[autofocus]', el) || $('input, button, a[href]', el);
      if (first) first.focus();
    }
    root.style.overflow = 'hidden';
    return true;
  };
  const closeModal = (el) => {
    if (!isOpen(el)) return;
    if (nativeDialog) {
      el.close();
    } else {
      el.removeAttribute('open');
      root.classList.remove('modal-open');
      el.dispatchEvent(new Event('close'));
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  };
  const allDialogs = $$('dialog');
  allDialogs.forEach((el) => {
    el.addEventListener('close', () => { if (!allDialogs.some(isOpen)) root.style.overflow = ''; });
    el.addEventListener('click', (e) => { if (e.target === el) closeModal(el); });
  });
  if (!nativeDialog) {
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') allDialogs.filter(isOpen).forEach(closeModal); });
    document.addEventListener('click', (e) => { if (e.target === document.body) allDialogs.filter(isOpen).forEach(closeModal); });
  }

  /* ---------- Modal de orçamento ---------- */
  const dialog = $('[data-quote]');
  const form = $('[data-quote-form]');
  const status = $('[data-quote-status]');

  const openQuote = (tipo) => {
    if (!dialog) return false;
    if (tipo && form) {
      const radio = $$('input[name="tipo"]', form).find((r) => r.value === tipo);
      if (radio) radio.checked = true;
    }
    if (status) status.textContent = '';
    return openModal(dialog);
  };

  if (dialog) {
    $$('[data-quote-close]', dialog).forEach((b) => b.addEventListener('click', () => closeModal(dialog)));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const required = ['nome', 'cidade'];
      let firstInvalid = null;
      required.forEach((name) => {
        const input = form.elements[name];
        const ok = String(data.get(name) || '').trim().length > 1;
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        status.textContent = 'Preencha seu nome e a cidade da instalação para continuar.';
        firstInvalid.focus();
        return;
      }

      const lines = [
        'Olá, Mundo Solar! Gostaria de solicitar um orçamento de energia solar.',
        '',
        `Nome: ${String(data.get('nome')).trim()}`,
        `Cidade: ${String(data.get('cidade')).trim()}`,
        `Tipo de imóvel: ${data.get('tipo')}`,
      ];
      const consumo = String(data.get('consumo') || '').trim();
      const msg = String(data.get('mensagem') || '').trim();
      if (consumo) lines.push(`Consumo médio / conta: ${consumo}`);
      if (msg) lines.push(`Mensagem: ${msg}`);
      const text = lines.join('\n');

      if (hasWhatsApp) {
        window.open(waLink(text), '_blank', 'noopener');
        status.textContent = 'Abrimos o WhatsApp com a sua mensagem. É só enviar!';
      } else if (SITE_CONFIG.email) {
        window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent('Orçamento de energia solar')}&body=${encodeURIComponent(text)}`;
        status.textContent = 'Abrimos o seu aplicativo de e-mail com a solicitação.';
      } else {
        status.textContent = 'Nossos canais de atendimento estão sendo configurados. Por favor, tente novamente em breve.';
      }
    });
    $$('input', form).forEach((input) =>
      input.addEventListener('input', () => input.removeAttribute('aria-invalid'))
    );
  }

  /* ---------- Menu mobile ---------- */
  const body = document.body;
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  const toggleLabel = toggle && $('.sr-only', toggle);
  // Conteúdo atrás do menu aberto fica inativo para teclado e leitores de tela.
  const behindMenu = $$('main, .site-footer, .wa-float, .skip-link');

  const setMenu = (open, { focusToggle = false } = {}) => {
    if (!toggle || !menu) return;
    body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
    behindMenu.forEach((el) => el.toggleAttribute('inert', open));
    if (open) {
      menu.removeAttribute('inert');
      const first = $('a', menu);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    } else {
      menu.setAttribute('inert', '');
      if (focusToggle) toggle.focus();
    }
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(!body.classList.contains('nav-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) setMenu(false, { focusToggle: true });
    });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Botões de orçamento e WhatsApp ---------- */
  $$('[data-open-quote]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (openQuote(el.dataset.openQuote)) e.preventDefault();
    });
  });

  $$('[data-wa]').forEach((el) => {
    if (hasWhatsApp) {
      el.href = waLink();
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      // Sem número configurado: direciona para o formulário de orçamento.
      el.addEventListener('click', (e) => { if (openQuote()) e.preventDefault(); });
    }
  });

  /* ---------- Tabela de kits ---------- */
  const kits = $$('[data-kit]');
  const kitFeature = $('[data-kit-feature]');
  const featureCta = $('[data-kf-cta]');

  // Os dados de cada kit são lidos do próprio HTML (fonte única da tabela).
  const kitData = (li) => {
    const field = (name) => { const el = $(`[data-f="${name}"]`, li); return el ? el.textContent.trim() : ''; };
    return { kwh: field('kwh'), tag: field('tag'), placas: field('placas'), inversor: field('inversor'), preco: field('preco') };
  };
  const kitMessage = (k) =>
    `Olá, Mundo Solar! Tenho interesse no kit de ${k.kwh} kWh/mês${k.tag ? ` (${k.tag})` : ''}: ${k.placas} + ${k.inversor} — ${k.preco}. Gostaria de mais informações.`;
  const setKitLink = (a, k) => {
    if (!hasWhatsApp) return;
    a.href = waLink(kitMessage(k));
    a.target = '_blank';
    a.rel = 'noopener';
  };
  const quoteFallback = (el) =>
    el.addEventListener('click', (e) => { if (!hasWhatsApp && openQuote()) e.preventDefault(); });

  const selectKit = (li, { animate = true } = {}) => {
    const k = kitData(li);
    kits.forEach((item) => {
      const on = item === li;
      item.classList.toggle('is-selected', on);
      const btn = $('.kit__select', item);
      if (btn) btn.setAttribute('aria-pressed', String(on));
    });
    if (!kitFeature) return;
    ['kwh', 'placas', 'inversor', 'preco'].forEach((name) => {
      const el = $(`[data-kf="${name}"]`, kitFeature);
      if (el) el.textContent = k[name];
    });
    const tag = $('[data-kf="tag"]', kitFeature);
    if (tag) { tag.textContent = k.tag; tag.hidden = !k.tag; }
    if (featureCta) setKitLink(featureCta, k);
    if (animate && !reduceMotion) {
      kitFeature.classList.remove('is-swapping');
      void kitFeature.offsetWidth; // reinicia a animação de troca
      kitFeature.classList.add('is-swapping');
    }
  };

  kits.forEach((li) => {
    const cta = $('[data-kit-cta]', li);
    if (cta) { setKitLink(cta, kitData(li)); quoteFallback(cta); }
    const btn = $('.kit__select', li);
    if (btn) btn.addEventListener('click', () => selectKit(li));
  });
  if (featureCta) quoteFallback(featureCta);
  const initialKit = kits.find((li) => li.classList.contains('is-selected')) || kits[0];
  if (initialKit) selectKit(initialKit, { animate: false });

  /* ---------- Pesquisa (lupa) ----------
   * Entende consumo (kWh), nº de placas, potência do inversor (kW), preço
   * ("até 12 mil", "R$ 10.000"), orientação Leste/Oeste e palavras-chave,
   * sem diferenciar acentos e tolerando pequenos erros de digitação.
   */
  const searchDialog = $('[data-search]');
  const searchInput = $('[data-search-input]');
  const searchResults = $('[data-search-results]');
  const searchHint = $('[data-search-hint]');
  const searchStatus = $('[data-search-status]');
  const searchChips = $('[data-search-chips]');
  const searchBody = $('[data-search-body]');
  const searchAction = $('[data-search-action]');
  const searchActionText = $('[data-search-action-text]');
  const searchWa = $('[data-search-wa]');
  const searchNotice = $('[data-search-notice]');
  const searchNoticeTitle = $('[data-search-notice-title]');
  const searchNoticeText = $('[data-search-notice-text]');
  const searchNoticeWa = $('[data-search-notice-wa]');

  if (searchDialog && searchInput && searchResults) {
    const norm = (str) => String(str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const words = (str) => norm(str).split(/[^a-z0-9]+/).filter(Boolean);
    const esc = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const toNumber = (str) => {
      let v = String(str).trim();
      if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(v)) v = v.replace(/\./g, '').replace(',', '.');
      else v = v.replace(',', '.');
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : null;
    };
    const fmtInt = (n) => n.toLocaleString('pt-BR');
    const fmtBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const lev = (a, b) => {
      const row = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) {
        let prev = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
          const tmp = row[j];
          row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
          prev = tmp;
        }
      }
      return row[b.length];
    };
    const hits = (token, list) => list.some((w) =>
      w === token ||
      (token.length >= 3 && w.startsWith(token)) ||
      (token.length >= 4 && Math.abs(w.length - token.length) <= 2 && lev(token, w) <= (token.length >= 7 ? 2 : 1)) ||
      (token.length >= 6 && w.length > token.length && lev(token, w.slice(0, token.length)) <= 1));

    // ----- Índice (lido do próprio HTML) -----
    const kitIndex = kits.map((li) => {
      const k = kitData(li);
      const inv = k.inversor.match(/(\d+(?:[.,]\d+)?)\s*kw/i);
      return {
        type: 'kit', li, k,
        kwh: toNumber(k.kwh),
        placas: parseInt(k.placas, 10),
        kw: inv ? toNumber(inv[1]) : null,
        price: toNumber(k.preco.replace(/[^\d.,]/g, '')),
        words: words(`${k.kwh} kwh ${k.tag} ${k.placas} ${k.inversor} ${k.preco} kit kits placa placas painel paineis modulo modulos solar fotovoltaico energia`),
      };
    }).sort((a, b) => a.kwh - b.kwh);

    const projectIndex = $$('.project').map((el) => {
      const count = $('[data-count]', el);
      const specs = $$('.project__specs li', el).map((li) => li.textContent.trim());
      const loc = ($('.project__loc', el) || {}).textContent || '';
      const title = ($('.project__tag', el) || {}).textContent || 'Projeto';
      return {
        type: 'project', el, title: title.trim(), loc: loc.trim(), specs,
        kwh: count ? toNumber(count.dataset.count) : null,
        placas: parseInt(specs[0], 10),
        words: words(`${title} ${count ? count.dataset.count : ''} kwh ${specs.join(' ')} ${loc} projeto projetos`),
      };
    });

    const faqIndex = $$('.faq-item').map((el) => {
      const q = ($('summary span', el) || {}).textContent || '';
      const a = ($('.faq-item__content', el) || {}).textContent || '';
      return { type: 'faq', el, title: q.trim(), words: words(q), answer: words(a) };
    });

    const sectionIndex = [
      ['Energia solar residencial', 'Soluções para casas', '#solucoes', 'residencial residencia casa casas familia moradia'],
      ['Energia solar comercial', 'Soluções para empresas', '#solucoes', 'comercial comercio empresa empresas loja negocio'],
      ['Projetos personalizados', 'Dimensionados para cada instalação', '#solucoes', 'personalizado projeto medida dimensionamento'],
      ['Como funciona', 'Do primeiro contato à geração de energia', '#como-funciona', 'como funciona etapas processo instalacao instalar prazo'],
      ['Benefícios da energia solar', 'Economia, valorização e autonomia', '#beneficios', 'beneficios vantagens economia economizar valorizacao sustentavel'],
      ['Sobre a Mundo Solar', 'Desde 2022 · +500 usinas entregues', '#sobre', 'sobre empresa historia quem somos redencao usinas'],
      ['Contato e orçamento', 'WhatsApp (94) 9124-3878', '#contato', 'contato orcamento whatsapp zap telefone email instagram falar atendimento'],
    ].map(([title, desc, href, kw]) => ({ type: 'section', title, desc, href, words: words(`${title} ${kw}`) }));

    const STOP = new Set(('a o e as os de da do das dos um uma uns umas para pra pro com sem no na nos nas em por que qual quais ' +
      'meu minha seu sua eu quero queria preciso gostaria tem tenho ter ser mes mensal mensais kwh kw w reais r ' +
      'comprar compra saber ver mostrar melhor melhores bom boa tipo modelo modelos marca marcas algum alguma ' +
      'voces vcs voce site aqui favor ola oi bom dia tarde noite').split(' '));
    // Palavras de intenção (preço, ordem, orientação…) já interpretadas — não contam como "não encontrado".
    const INTENT = new Set(('preco precos valor valores custa custo quanto investimento barato barata baratos baratas ' +
      'economico economica maior maiores menor potente grande conta fatura boleto luz ate acima abaixo partir ' +
      'minimo maximo menos mais leste oeste').split(' '));
    const KIT_WORD = /^(placas?|paineis|painel|modulos?|kits?|ronma|auxsol|inversor(es)?|fotovoltaic\w*|solar(es)?|energia|sistemas?|usina)$/;

    // ----- Interpretação da busca -----
    const NUM_RE = /(?:\b(ate|menos de|abaixo de|no maximo|acima de|mais de|a partir de|minimo)\s+)?(r\$\s*)?(\d+(?:[.,]\d+)*)\s*(kwh|kw\/h|kw|mil|k|watts?|w|placas?|paineis|painel|modulos?|reais)?\b/g;
    const parse = (raw) => {
      const s = norm(raw).replace(/\s+/g, ' ').trim();
      const p = {
        raw: raw.trim(), kwh: null, placas: null, kw: null, watts: null, price: null, priceMax: null, priceMin: null,
        bill: /\b(conta|fatura|boleto)\b/.test(s),
        tag: /leste|oeste/.test(s),
        cheap: /barat|mais em conta|menor (preco|valor)|economic/.test(s),
        big: /\b(maior|maiores|potente|grande)\b/.test(s),
        priceIntent: /\b(preco|precos|valor|valores|custa|custo|quanto|investimento)\b/.test(s),
        kitIntent: false, tokens: [],
      };
      const rest = s.replace(NUM_RE, (m, cmp, rs, numStr, unit) => {
        const n = toNumber(numStr);
        if (n == null) return ' ';
        const max = cmp && /ate|menos|abaixo|maximo/.test(cmp);
        const min = cmp && /acima|mais de|partir|minimo/.test(cmp);
        const setPrice = (v) => {
          if (p.bill) return;
          if (max) p.priceMax = v; else if (min) p.priceMin = v; else p.price = v;
        };
        if (unit === 'kwh' || unit === 'kw/h') p.kwh = n;
        else if (unit === 'kw') p.kw = n;
        else if (unit === 'mil' || unit === 'k') setPrice(n * 1000);
        else if (unit === 'reais' || rs) setPrice(n);
        else if (unit && /^(placas?|paineis|painel|modulos?)$/.test(unit)) p.placas = n;
        else if (unit && /^(w|watts?)$/.test(unit)) { if (n === 620) p.kitIntent = true; else p.watts = n; }
        else if (n === 620 && /ronma|placa|painel|modulo/.test(s)) p.kitIntent = true;
        else if (cmp && n < 100) setPrice(n * 1000);
        else if (n >= 3000) setPrice(n);
        else if (n >= 50) p.kwh = n;
        else { p.placas = n; if ([5, 6, 7.5].includes(n)) p.kw = n; }
        return ' ';
      });
      words(rest).forEach((t) => {
        if (KIT_WORD.test(t)) p.kitIntent = true;
        else if (!STOP.has(t) && t.length > 1) p.tokens.push(t);
      });
      return p;
    };

    // ----- Busca -----
    const search = (p) => {
      const empty = !p.raw;
      const numeric = p.kwh || p.placas || p.kw || p.price || p.priceMax || p.priceMin || p.tag;
      const listIntent = p.kitIntent || p.priceIntent || p.cheap || p.big || p.bill;
      const rec = p.kwh ? (kitIndex.find((k) => k.kwh >= p.kwh) || kitIndex[kitIndex.length - 1]) : null;

      let kitsOut = kitIndex.map((k) => {
        let sc = empty || (listIntent && !numeric) ? 10 : 0;
        if (p.kwh) {
          if (k === rec) sc += 120;
          sc += 60 * Math.max(0, 1 - Math.abs(k.kwh - p.kwh) / 500);
        }
        if (p.placas) {
          const d = Math.abs(k.placas - p.placas);
          if (d === 0) sc += 110; else if (d <= 2) sc += 30 - d * 8;
        }
        if (p.kw && k.kw === p.kw) sc += 80;
        if (p.price) sc += 70 * Math.max(0, 1 - Math.abs(k.price - p.price) / 5000);
        if (p.priceMax || p.priceMin) sc += 40;
        if (p.tag && k.k.tag) sc += 120;
        p.tokens.forEach((t) => { if (hits(t, k.words)) sc += 25; });
        if ((p.priceMax && k.price > p.priceMax) || (p.priceMin && k.price < p.priceMin)) sc = 0;
        return { item: k, sc, rec: k === rec };
      }).filter((r) => r.sc > 0);

      if (p.cheap) kitsOut.sort((a, b) => a.item.price - b.item.price);
      else if (p.big) kitsOut.sort((a, b) => b.item.kwh - a.item.kwh);
      else if (numeric) kitsOut.sort((a, b) => b.sc - a.sc || a.item.kwh - b.item.kwh);
      if (p.tag && !p.kwh && !p.placas) kitsOut = kitsOut.filter((r) => r.item.k.tag || r.sc > 120);

      const projectsOut = empty ? [] : projectIndex.map((pr) => {
        let sc = 0;
        if (p.kwh && pr.kwh === p.kwh) sc += 50;
        if (p.placas && pr.placas === p.placas) sc += 40;
        p.tokens.forEach((t) => { if (hits(t, pr.words)) sc += 40; });
        return { item: pr, sc };
      }).filter((r) => r.sc >= 40).sort((a, b) => b.sc - a.sc).slice(0, 4);

      const faqOut = empty ? [] : faqIndex.map((f) => {
        let sc = 0;
        p.tokens.forEach((t) => {
          if (t.length < 3) return;
          if (hits(t, f.words)) sc += 30; else if (hits(t, f.answer)) sc += 8;
        });
        if (p.priceIntent && /custa/.test(norm(f.title))) sc += 60;
        return { item: f, sc };
      }).filter((r) => r.sc >= 30).sort((a, b) => b.sc - a.sc).slice(0, 3);

      const sectionsOut = empty ? [] : sectionIndex.map((sct) => {
        let sc = 0;
        p.tokens.forEach((t) => { if (t.length >= 3 && hits(t, sct.words)) sc += 35; });
        return { item: sct, sc };
      }).filter((r) => r.sc >= 35).sort((a, b) => b.sc - a.sc).slice(0, 3);

      // ----- O que a tabela não tem -----
      const kwSet = [...new Set(kitIndex.map((k) => k.kw))].sort((a, b) => a - b);
      const kwMissing = p.kw != null && !kwSet.includes(p.kw);
      const exactPlacas = p.placas != null && kitIndex.some((k) => k.placas === p.placas);
      const unmatched = empty ? [] : p.tokens.filter((t) => t.length >= 3 && !INTENT.has(t) &&
        !kitIndex.some((k) => hits(t, k.words)) && !projectIndex.some((pr) => hits(t, pr.words)) &&
        !faqIndex.some((f) => hits(t, f.words) || hits(t, f.answer)) && !sectionIndex.some((sc) => hits(t, sc.words)));
      const strong = p.kwh || exactPlacas || (p.kw && !kwMissing) || p.price || p.priceMax || p.priceMin || p.tag ||
        projectsOut.length || faqOut.length || sectionsOut.length;
      const cheapest = kitIndex.reduce((a, b) => (b.price < a.price ? b : a));
      const last = kitIndex[kitIndex.length - 1];
      const fmtKw = (n) => `${String(n).replace('.', ',')}kW`;
      const kwText = kwSet.length > 1 ? `${kwSet.slice(0, -1).map(fmtKw).join(', ')} e ${fmtKw(kwSet[kwSet.length - 1])}` : fmtKw(kwSet[0]);

      let notice = null;
      if (p.watts) notice = { missing: true, title: 'Não temos esse modelo', text: `Não trabalhamos com placas de ${fmtInt(p.watts)}W — os kits da Mundo Solar usam placas RONMA 620W.` };
      else if (kwMissing) notice = { missing: true, title: 'Não temos esse modelo', text: `Não temos kit com inversor de ${fmtKw(p.kw)} — os kits usam inversores AUXSOL de ${kwText}.` };
      else if (unmatched.length && !strong) notice = { missing: true, title: 'Não temos esse modelo', text: `Não encontramos “${unmatched.join(' ')}” na tabela Mundo Solar.` };
      else if (p.priceMax && p.priceMax < cheapest.price) notice = { missing: true, title: 'Não temos kit nessa faixa de valor', text: `O kit de menor valor da tabela é o de ${cheapest.k.kwh} kWh/mês, por ${cheapest.k.preco}.` };
      else if (p.kwh && p.kwh > last.kwh) notice = { missing: false, title: 'Precisa de um sistema maior?', text: `Para consumos acima de ${last.k.kwh} kWh/mês, a Mundo Solar faz projetos personalizados.` };
      else if (p.placas != null && !exactPlacas && !p.kwh && !p.kw) notice = { missing: false, title: `Não temos kit com exatamente ${fmtInt(p.placas)} placas`, text: 'Veja abaixo os kits mais próximos.' };

      const total = kitsOut.length + projectsOut.length + faqOut.length + sectionsOut.length;
      if (!empty && !total && !notice) notice = { missing: true, title: 'Não temos esse modelo', text: `Não encontramos resultados para “${p.raw}”.` };
      // Quando não temos o que foi pedido, mostra os kits disponíveis como alternativa.
      if (notice && notice.missing && !kitsOut.length) kitsOut = kitIndex.map((k) => ({ item: k, sc: 1, rec: false }));

      return { rec, kitsOut, projectsOut, faqOut, sectionsOut, notice };
    };

    const hintFor = (p, res) => {
      if (!p.raw) return 'Todos os kits da <strong>tabela Mundo Solar</strong>. Digite o seu consumo em kWh para ver o kit mais indicado.';
      const parts = [];
      const last = kitIndex[kitIndex.length - 1];
      if (p.kwh && res.rec && p.kwh <= last.kwh) {
        parts.push(`Consumo de ${fmtInt(p.kwh)} kWh/mês → kit mais indicado: <strong>${res.rec.k.kwh} kWh/mês</strong> por ${res.rec.k.preco}.`);
      }
      if (p.kwh > last.kwh) parts.push(`O maior kit da tabela é o de <strong>${last.k.kwh} kWh/mês</strong>.`);
      if (p.placas) {
        const exact = kitIndex.find((k) => k.placas === p.placas);
        if (exact) parts.push(`Kit com <strong>${exact.k.placas}</strong>.`);
      }
      if (p.kw && kitIndex.some((k) => k.kw === p.kw)) parts.push(`Inversor AUXSOL de <strong>${String(p.kw).replace('.', ',')}kW</strong>.`);
      if (p.priceMax) parts.push(`Kits até <strong>${fmtBRL(p.priceMax)}</strong>.`);
      if (p.priceMin) parts.push(`Kits a partir de <strong>${fmtBRL(p.priceMin)}</strong>.`);
      if (p.price) parts.push(`Kits com valor próximo de <strong>${fmtBRL(p.price)}</strong>.`);
      if (p.tag) parts.push('Configuração <strong>Leste/Oeste</strong>.');
      if (p.cheap) parts.push('Ordenado do <strong>menor para o maior valor</strong>.');
      if (p.big) parts.push('Ordenado do <strong>maior para o menor consumo</strong>.');
      if (p.bill) parts.push('Pelo valor da conta não dá para indicar o kit com precisão: veja o consumo em <strong>kWh</strong> na sua conta de luz ou peça uma análise gratuita.');
      if (!parts.length && res.kitsOut.length) {
        const first = kitIndex[0].k.preco;
        const last = kitIndex[kitIndex.length - 1].k.preco;
        if (p.priceIntent) parts.push(`Valores da tabela Mundo Solar: de <strong>${first}</strong> a <strong>${last}</strong>. Digite o seu consumo para ver o kit indicado.`);
        else if (p.kitIntent) parts.push('Todos os kits usam <strong>placas RONMA 620W</strong> e <strong>inversores AUXSOL</strong>. Digite o seu consumo em kWh para ver o kit indicado.');
      }
      return parts.join(' ');
    };

    let entries = [];
    let active = -1;

    const kitLabel = (k) => `Kit ${k.kwh} kWh/mês${k.tag ? ` (${k.tag})` : ''}`;
    const setActive = (i, { scroll = true } = {}) => {
      if (!entries.length) {
        active = -1;
        searchInput.removeAttribute('aria-activedescendant');
        if (searchAction) searchAction.hidden = true;
        return;
      }
      active = (i + entries.length) % entries.length;
      entries.forEach((e, idx) => {
        e.el.classList.toggle('is-active', idx === active);
        e.el.setAttribute('aria-selected', String(idx === active));
      });
      const cur = entries[active];
      searchInput.setAttribute('aria-activedescendant', cur.el.id);
      if (scroll) cur.el.scrollIntoView({ block: 'nearest' });
      if (searchAction) {
        const isKit = cur.item.type === 'kit';
        searchAction.hidden = !isKit;
        if (isKit) {
          const k = cur.item.k;
          searchActionText.innerHTML = `<strong>${esc(kitLabel(k))}</strong> · ${esc(k.preco)}`;
          if (hasWhatsApp) { searchWa.href = waLink(kitMessage(k)); searchWa.target = '_blank'; searchWa.rel = 'noopener'; }
        }
      }
    };

    const optionHTML = (r, id) => {
      const it = r.item;
      if (it.type === 'kit') {
        const k = it.k;
        return `<div class="sr sr--kit" role="option" id="${id}" aria-selected="false">
          <span class="sr__icon"><svg class="icon" aria-hidden="true"><use href="#i-solar-panel"/></svg></span>
          <span class="sr__title"><strong>${esc(k.kwh)}</strong> kWh/mês${r.rec ? '<span class="sr__badge">Mais indicado</span>' : ''}${k.tag ? `<span class="sr__badge sr__badge--tag">${esc(k.tag)}</span>` : ''}</span>
          <span class="sr__meta">${esc(k.placas)} · ${esc(k.inversor)}</span>
          <span class="sr__aside">${esc(k.preco)}</span>
        </div>`;
      }
      if (it.type === 'project') {
        return `<div class="sr" role="option" id="${id}" aria-selected="false">
          <span class="sr__icon"><svg class="icon" aria-hidden="true"><use href="#i-map-pin"/></svg></span>
          <span class="sr__title">${esc(it.title)} · ${esc(it.loc)}</span>
          <span class="sr__meta">${it.kwh != null ? `${esc(it.kwh)} kWh/mês · ` : ''}${esc(it.specs.join(' · '))}</span>
        </div>`;
      }
      if (it.type === 'faq') {
        return `<div class="sr" role="option" id="${id}" aria-selected="false">
          <span class="sr__icon"><svg class="icon" aria-hidden="true"><use href="#i-circle-help"/></svg></span>
          <span class="sr__title">${esc(it.title)}</span>
          <span class="sr__meta">Perguntas frequentes</span>
        </div>`;
      }
      return `<div class="sr" role="option" id="${id}" aria-selected="false">
        <span class="sr__icon"><svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg></span>
        <span class="sr__title">${esc(it.title)}</span>
        <span class="sr__meta">${esc(it.desc)}</span>
      </div>`;
    };

    const render = () => {
      const p = parse(searchInput.value);
      const res = search(p);
      const groups = [
        [res.notice && res.notice.missing ? 'Kits disponíveis' : 'Kits de placas solares', res.kitsOut],
        ['Projetos realizados', res.projectsOut],
        ['Perguntas frequentes', res.faqOut],
        ['Seções do site', res.sectionsOut],
      ].filter(([, list]) => list.length);

      if (searchChips) searchChips.hidden = !!p.raw;
      let n = 0;
      const flat = [];
      searchResults.innerHTML = groups.map(([label, list], gi) => {
        const gid = `search-group-${gi}`;
        return `<div class="search__group" role="group" aria-labelledby="${gid}">
          <p class="search__label" id="${gid}" role="presentation">${label}</p>
          ${list.map((r) => { flat.push(r); return optionHTML(r, `search-opt-${n++}`); }).join('')}
        </div>`;
      }).join('');

      const total = flat.length;
      const notice = res.notice;
      searchHint.innerHTML = notice && notice.missing ? '' : hintFor(p, res);
      if (searchNotice) {
        searchNotice.hidden = !notice;
        if (notice) {
          searchNoticeTitle.textContent = notice.title;
          searchNoticeText.textContent = notice.text;
          if (hasWhatsApp) {
            searchNoticeWa.href = waLink(`Olá, Mundo Solar! Pesquisei por “${p.raw}” no site e gostaria de uma pesquisa mais a fundo. Podem me ajudar?`);
            searchNoticeWa.target = '_blank';
            searchNoticeWa.rel = 'noopener';
          }
        }
      }
      if (searchStatus) {
        searchStatus.textContent = `${notice ? `${notice.title}. ` : ''}${total} ${total === 1 ? 'resultado' : 'resultados'}`;
      }

      entries = $$('[role="option"]', searchResults).map((el, i) => ({ el, item: flat[i].item }));
      entries.forEach((e, i) => {
        e.el.addEventListener('click', () => go(e));
        e.el.addEventListener('mousemove', () => { if (active !== i) setActive(i, { scroll: false }); });
      });
      setActive(0, { scroll: false });
      if (searchBody) searchBody.scrollTop = 0;
    };

    const flash = (el) => {
      el.classList.remove('is-found');
      void el.offsetWidth;
      el.classList.add('is-found');
      setTimeout(() => el.classList.remove('is-found'), 2200);
    };
    const scrollOpts = (block) => ({ behavior: reduceMotion ? 'auto' : 'smooth', block });

    const go = (entry) => {
      const it = entry.item;
      closeModal(searchDialog);
      root.style.overflow = '';
      if (it.type === 'kit') {
        selectKit(it.li);
        (desktopMQ.matches ? $('#kits') : it.li).scrollIntoView(scrollOpts(desktopMQ.matches ? 'start' : 'center'));
        flash(it.li);
      } else if (it.type === 'project') {
        it.el.scrollIntoView(scrollOpts('center'));
        flash(it.el);
      } else if (it.type === 'faq') {
        it.el.open = true;
        it.el.scrollIntoView(scrollOpts('center'));
        flash(it.el);
      } else {
        const target = $(it.href);
        if (target) target.scrollIntoView(scrollOpts('start'));
      }
    };

    const openSearch = (q = '') => {
      if (body.classList.contains('nav-open')) setMenu(false);
      closeModal(dialog);
      searchInput.value = q;
      render();
      openModal(searchDialog);
      searchInput.focus();
    };

    $$('[data-search-open]').forEach((b) => b.addEventListener('click', () => openSearch()));
    $$('[data-search-close]', searchDialog).forEach((b) => b.addEventListener('click', () => closeModal(searchDialog)));
    if (searchWa) quoteFallback(searchWa);
    if (searchNoticeWa) quoteFallback(searchNoticeWa);
    if (searchChips) {
      $$('[data-q]', searchChips).forEach((chip) => chip.addEventListener('click', () => {
        searchInput.value = chip.dataset.q;
        render();
        searchInput.focus();
      }));
    }

    searchInput.addEventListener('input', render);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); if (entries[active]) go(entries[active]); }
    });

    // Atalhos: "/" ou Ctrl/⌘ + K
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      const typing = t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName));
      const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if ((combo || (e.key === '/' && !typing)) && !isOpen(searchDialog)) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  /* ---------- Revelação no scroll ---------- */
  const revealEls = $$('[data-reveal]');
  const finishReveal = (el) => {
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.removeEventListener('transitionend', done);
      // Libera o elemento para as transições próprias (hover etc.).
      el.removeAttribute('data-reveal');
    });
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => { el.classList.add('is-in'); el.removeAttribute('data-reveal'); });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        finishReveal(el);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const final = el.dataset.count;
    if (!Number.isFinite(target) || reduceMotion) { el.textContent = final; return; }
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = String(Math.round(target * (t === 1 ? 1 : eased)));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = final; // garante o valor exato informado
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
    // Garante o valor final mesmo se a aba estiver em segundo plano (rAF pausado).
    setTimeout(() => { el.textContent = final; }, duration + 250);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Scrollspy + linha dourada do menu ----------
   * A seção ativa é a última (na ordem do menu) cujo topo já passou de 40% da tela;
   * seções fora do menu mantêm o item anterior, então a linha nunca "some" no meio da página.
   */
  const navList = $('.nav__list');
  const navLinks = $$('.nav__link');
  const mobileLinks = $$('.mobile-menu__list a');
  const indicator = $('[data-nav-indicator]');
  const desktopNavMQ = window.matchMedia('(min-width: 1200px)');
  const spyTargets = navLinks
    .map((link) => ({ link, id: link.getAttribute('href').slice(1) }))
    .map((t) => ({ ...t, section: document.getElementById(t.id) }))
    .filter((t) => t.section);
  let currentLink = null;
  let previewLink = null;

  const placeIndicator = (link) => {
    if (!indicator) return;
    if (!link || !desktopNavMQ.matches) { indicator.classList.remove('is-visible'); return; }
    // A linha ultrapassa um pouco o texto do item, para ler claramente como linha.
    indicator.style.setProperty('--x', `${link.offsetLeft - 6}px`);
    indicator.style.setProperty('--w', `${link.offsetWidth + 12}px`);
    indicator.classList.add('is-visible');
  };

  const setCurrent = (id) => {
    const target = spyTargets.find((t) => t.id === id);
    const link = target ? target.link : null;
    if (link === currentLink) return;
    currentLink = link;
    navLinks.forEach((a) => (a === link ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    mobileLinks.forEach((a) => (a.getAttribute('href') === `#${id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    if (!previewLink) placeIndicator(currentLink);
  };

  const updateSpy = (vh) => {
    if (!spyTargets.length) return;
    const line = vh * 0.4;
    let id = spyTargets[0].id;
    spyTargets.forEach((t) => { if (t.section.getBoundingClientRect().top <= line) id = t.id; });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) id = spyTargets[spyTargets.length - 1].id;
    setCurrent(id);
  };

  // Ao passar o mouse (ou focar pelo teclado), a linha antecipa o destino.
  const preview = (link) => {
    previewLink = link;
    if (indicator) indicator.classList.toggle('is-preview', !!link && link !== currentLink);
    placeIndicator(link || currentLink);
  };
  navLinks.forEach((a) => {
    a.addEventListener('mouseenter', () => preview(a));
    a.addEventListener('focus', () => preview(a));
    a.addEventListener('blur', () => preview(null));
  });
  if (navList) navList.addEventListener('mouseleave', () => preview(null));
  const replaceIndicator = () => placeIndicator(previewLink || currentLink);
  window.addEventListener('resize', replaceIndicator, { passive: true });
  desktopNavMQ.addEventListener('change', replaceIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(replaceIndicator);

  /* ---------- Scroll: header, timeline, parallax, WhatsApp flutuante ---------- */
  const header = $('[data-header]');
  const waFloat = $('.wa-float');
  const footer = $('.site-footer');
  const timeline = $('[data-timeline]');
  const steps = timeline ? $$('[data-step]', timeline) : [];
  const parallaxEls = $$('[data-parallax]');

  const updateTimeline = (vh) => {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    let p;
    if (desktopMQ.matches) {
      p = (vh * 0.85 - rect.top) / (vh * 0.45);
    } else {
      p = (vh * 0.7 - rect.top) / rect.height;
    }
    p = reduceMotion ? 1 : clamp(p, 0, 1);
    timeline.style.setProperty('--p', p.toFixed(4));
    const n = steps.length;
    steps.forEach((step, i) => {
      const threshold = desktopMQ.matches ? i / (n - 1) : (i + 0.15) / n;
      step.classList.toggle('is-active', p >= threshold - 0.001);
    });
  };

  const updateParallax = (vh) => {
    if (reduceMotion || !desktopMQ.matches) {
      parallaxEls.forEach((el) => { el.style.transform = ''; });
      return;
    }
    parallaxEls.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const offset = clamp((rect.top + rect.height / 2 - vh / 2) * -factor, -60, 60);
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (header) header.classList.toggle('is-scrolled', y > 20);
      if (waFloat) {
        const nearFooter = footer && footer.getBoundingClientRect().top < vh - 40;
        waFloat.classList.toggle('is-visible', y > vh * 0.75 && !nearFooter);
      }
      updateSpy(vh);
      updateTimeline(vh);
      updateParallax(vh);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  desktopMQ.addEventListener('change', onScroll);
  onScroll();

  /* ---------- FAQ (accordion com animação) ---------- */
  $$('[data-accordion]').forEach((item) => {
    const summary = $('summary', item);
    const content = $('.faq-item__content', item);
    if (!summary || !content || reduceMotion || !content.animate) return;
    let anim = null;
    const timing = { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (anim) anim.cancel();
      if (item.open && !item.classList.contains('is-closing')) {
        const h = content.offsetHeight;
        item.classList.add('is-closing');
        anim = content.animate({ height: [`${h}px`, '0px'], opacity: [1, 0] }, { ...timing, fill: 'forwards' });
        anim.onfinish = () => {
          item.open = false;
          item.classList.remove('is-closing');
          anim.cancel();
          anim = null;
        };
      } else {
        item.classList.remove('is-closing');
        item.open = true;
        const h = content.scrollHeight;
        anim = content.animate({ height: ['0px', `${h}px`], opacity: [0, 1] }, timing);
        anim.onfinish = () => { anim = null; };
      }
    });
  });
})();
