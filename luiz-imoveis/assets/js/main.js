/*
 * Luiz · Curadoria Imobiliária — interações do protótipo
 * JavaScript sem dependências. Cada bloco inicializa apenas se os
 * elementos correspondentes existirem na página.
 */
(function () {
  'use strict';

  var L = window.LUIZ;
  var CFG = L.config;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
   * Utilitários
   * ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slugify(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var NUM = new Intl.NumberFormat('pt-BR');

  function photo(id, w, h, fit) {
    var url = 'https://images.unsplash.com/photo-' + id + '?auto=format&q=80&fit=' + (fit || 'crop') + '&w=' + w;
    return h ? url + '&h=' + h : url;
  }
  function srcset(id, ratio, widths) {
    return widths.map(function (w) { return photo(id, w, Math.round(w / ratio)) + ' ' + w + 'w'; }).join(', ');
  }
  function icon(name, size) {
    var s = size ? ' width="' + size + '" height="' + size + '"' : '';
    return '<svg aria-hidden="true"' + s + '><use href="#i-' + name + '"/></svg>';
  }

  function priceLabel(p) {
    if (p.priceOnRequest) return 'Valor sob consulta';
    var v = BRL.format(p.price);
    if (p.category === 'aluguel') return v + ' /mês';
    if (p.category === 'lancamento') return 'A partir de ' + v;
    return v;
  }
  function areaLabel(p) {
    return p.areaMax ? NUM.format(p.area) + ' a ' + NUM.format(p.areaMax) + ' m²' : NUM.format(p.area) + ' m²';
  }
  function bedroomsLabel(p) {
    return (p.bedroomsMin ? p.bedroomsMin + ' a ' + p.bedrooms : p.bedrooms) + ' suítes';
  }
  function findProperty(id) {
    return L.properties.filter(function (p) { return p.id === id; })[0] || null;
  }

  /* ------------------------------------------------------------------
   * Ícones (sprite SVG, traço fino 1.25)
   * ------------------------------------------------------------------ */
  var ICONS = {
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H5M11 6l-6 6 6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    whatsapp: '<path d="M20.5 11.7a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.3-4.4a8.5 8.5 0 1 1 15.7-4.4z"/><path d="M9.2 8.3c.2-.4.6-.4.9-.4h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.6v.4c0 .4-.1.7-.4.9-.6.5-1.5.7-2.4.4a9.3 9.3 0 0 1-5.4-5.3c-.3-.9-.1-1.8.6-2.4z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    phone: '<path d="M5.5 3.5h3.2l1.8 4.6-2.3 1.4a11.5 11.5 0 0 0 6.3 6.3l1.4-2.3 4.6 1.8v3.2a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 4 5.1a1.5 1.5 0 0 1 1.5-1.6z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    share: '<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8"/><path d="M5 12.5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>'
  };
  (function injectSprite() {
    var symbols = Object.keys(ICONS).map(function (k) {
      return '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">' + ICONS[k] + '</symbol>';
    }).join('');
    var holder = document.createElement('div');
    holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' + symbols + '</svg>';
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  })();

  /* Imagem que falhar ao carregar vira um bloco tonal com monograma. */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    if (t.classList.contains('card__img--alt')) { t.remove(); return; }
    if (t.parentElement) t.parentElement.classList.add('media-missing');
  }, true);
  // Imagens que falharam antes deste script carregar (ex.: o hero)
  $$('img').forEach(function (img) {
    if (img.complete && img.currentSrc && !img.naturalWidth && img.parentElement) img.parentElement.classList.add('media-missing');
  });

  /* ------------------------------------------------------------------
   * Contatos (fonte única: LUIZ.config)
   * ------------------------------------------------------------------ */
  var contactAnchor = $('#contato') ? '#contato' : 'index.html?assunto=mensagem#contato';

  function waLink(message) {
    if (!CFG.whatsapp) return null;
    return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(message);
  }

  function bindContactLinks(defaultMessage) {
    var wa = waLink(defaultMessage || 'Olá, Luiz. Gostaria de conversar sobre um imóvel.');
    $$('[data-wa-link]').forEach(function (a) {
      if (wa) { a.href = wa; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.href = contactAnchor; a.setAttribute('data-open-message', ''); }
    });
    $$('[data-email-link]').forEach(function (a) { a.href = 'mailto:' + CFG.email; });
    $$('[data-email-text]').forEach(function (el) { el.textContent = CFG.email; });
    $$('[data-phone-link]').forEach(function (a) { a.href = 'tel:' + CFG.phoneDisplay.replace(/[^\d+]/g, ''); });
    $$('[data-phone-text]').forEach(function (el) { el.textContent = CFG.phoneDisplay; });
    $$('[data-instagram-link]').forEach(function (a) { a.href = CFG.instagram; });
    $$('[data-creci]').forEach(function (el) { el.textContent = CFG.creci; });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------
   * Toast
   * ------------------------------------------------------------------ */
  var toastTimer;
  function toast(message) {
    var el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  }

  /* ------------------------------------------------------------------
   * Revelação ao rolar + contadores
   * ------------------------------------------------------------------ */
  var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      $$('[data-count-to]', entry.target).forEach(countUp);
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;

  function reveal(root) {
    $$('[data-reveal]:not(.is-visible)', root).forEach(function (el) {
      if (revealObserver && !reduceMotion) revealObserver.observe(el);
      else el.classList.add('is-visible');
    });
  }

  function countUp(el) {
    if (el.dataset.counted || reduceMotion) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.dataset.countTo);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var fmt = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    var start = performance.now();
    var duration = 1800;
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = fmt.format(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
   * Cabeçalho: transparente sobre o hero, sólido ao rolar,
   * recolhe ao descer e reaparece ao subir.
   * ------------------------------------------------------------------ */
  var header = $('[data-header]');
  var menuOpen = false;

  function initHeader() {
    if (!header) return;
    var hasHero = document.body.classList.contains('has-hero');
    var waFloat = $('[data-wa-float]');
    var mobileBar = $('[data-mobile-bar]');
    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      var threshold = hasHero ? 60 : 8;
      header.classList.toggle('is-scrolled', y > threshold);
      if (hasHero) header.classList.toggle('is-transparent', y <= threshold);
      if (!menuOpen) {
        if (y > lastY + 6 && y > 480) header.classList.add('is-hidden');
        else if (y < lastY - 6 || y <= 480) header.classList.remove('is-hidden');
      }
      if (waFloat) waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.7);
      if (mobileBar) mobileBar.classList.toggle('is-visible', y > 420);
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    update();

    // Página atual na navegação principal
    var params = new URLSearchParams(location.search);
    var file = location.pathname.split('/').pop() || 'index.html';
    $$('.primary-nav a').forEach(function (a) {
      var url = new URL(a.getAttribute('href'), location.href);
      var sameFile = url.pathname.split('/').pop() === file;
      var cat = url.searchParams.get('categoria');
      if (sameFile && (!cat || cat === params.get('categoria')) && !url.hash) a.setAttribute('aria-current', 'page');
    });
  }

  function initMenu() {
    var toggle = $('[data-menu-toggle]');
    var menu = $('[data-menu]');
    if (!toggle || !menu) return;
    var label = $('[data-menu-label]', toggle);

    function focusables() {
      return [toggle].concat($$('a, button', menu));
    }
    function setOpen(open) {
      menuOpen = open;
      menu.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      header.classList.remove('is-hidden');
      document.body.classList.toggle('is-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Fechar' : 'Menu';
      if (open) setTimeout(function () { var first = $('a', menu); if (first) first.focus(); }, 80);
    }
    toggle.addEventListener('click', function () { setOpen(!menuOpen); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (!menuOpen) return;
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
      if (e.key === 'Tab') {
        var items = focusables();
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) { if (mq.matches && menuOpen) setOpen(false); });
  }

  /* ------------------------------------------------------------------
   * Opções de filtro derivadas dos dados
   * ------------------------------------------------------------------ */
  function fillLocationOptions(select) {
    var byCity = {};
    L.properties.forEach(function (p) {
      (byCity[p.city] = byCity[p.city] || {})[p.neighborhood] = true;
    });
    Object.keys(byCity).sort(function (a, b) {
      return a === CFG.city ? -1 : b === CFG.city ? 1 : a.localeCompare(b, 'pt-BR');
    }).forEach(function (city) {
      var group = document.createElement('optgroup');
      group.label = city;
      Object.keys(byCity[city]).sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); }).forEach(function (n) {
        group.appendChild(new Option(n, slugify(n)));
      });
      select.appendChild(group);
    });
  }
  function fillStyleOptions(select) {
    var styles = {};
    L.properties.forEach(function (p) { styles[p.style] = true; });
    Object.keys(styles).sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); }).forEach(function (s) {
      select.appendChild(new Option(s, slugify(s)));
    });
  }
  function fillPriceOptions(select, category) {
    var current = select.value;
    select.innerHTML = '';
    var ranges = L.priceRanges[category];
    select.disabled = !ranges;
    if (!ranges) { select.appendChild(new Option('Escolha a modalidade', '')); return; }
    select.appendChild(new Option('Qualquer valor', ''));
    ranges.forEach(function (r) { select.appendChild(new Option(r.label, r.value)); });
    select.value = ranges.some(function (r) { return r.value === current; }) ? current : '';
  }

  /* ------------------------------------------------------------------
   * Cards de imóvel
   * ------------------------------------------------------------------ */
  function cardHTML(p, i) {
    var cover = p.images[0];
    var alt = p.images[1];
    var badge = '';
    if (p.category === 'lancamento') badge = '<span class="card__badge">Lançamento · Entrega ' + p.delivery + '</span>';
    else if (p.category === 'aluguel') badge = '<span class="card__badge">Locação</span>';
    else if (p.priceOnRequest) badge = '<span class="card__badge">Exclusivo</span>';

    return '' +
      '<article class="card" data-reveal style="--d:' + ((i % 3) * 0.08).toFixed(2) + 's">' +
        '<div class="card__media">' +
          '<img class="card__img" src="' + photo(cover, 800, 1000) + '" srcset="' + srcset(cover, 4 / 5, [480, 800, 1200]) + '" sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 92vw" alt="' + esc(p.name + ', ' + p.type.toLowerCase() + ' em ' + p.neighborhood) + '" loading="lazy" decoding="async">' +
          (alt ? '<img class="card__img card__img--alt" data-hover-src="' + photo(alt, 800, 1000) + '" alt="" aria-hidden="true">' : '') +
          badge +
          '<span class="card__view" aria-hidden="true">Ver residência ' + icon('arrow', 14) + '</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<p class="card__location">' + esc(p.neighborhood) + ' · ' + esc(p.city) + '</p>' +
          '<h3 class="card__title"><a href="imovel.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a></h3>' +
          '<p class="card__specs">' + areaLabel(p) + '<span>·</span>' + bedroomsLabel(p) + '<span>·</span>' + p.parking + ' vagas</p>' +
          '<p class="card__price">' + priceLabel(p) + '<small>' + esc(p.type) + '</small></p>' +
        '</div>' +
      '</article>';
  }

  /* A segunda foto só é baixada no primeiro hover (economia de banda no mobile). */
  function bindCardHover(root) {
    $$('.card', root).forEach(function (card) {
      card.addEventListener('pointerenter', function () {
        var alt = $('.card__img--alt[data-hover-src]', card);
        if (!alt) return;
        alt.addEventListener('load', function () { alt.classList.add('is-loaded'); }, { once: true });
        alt.src = alt.dataset.hoverSrc;
        alt.removeAttribute('data-hover-src');
      }, { once: true });
    });
  }

  /* ------------------------------------------------------------------
   * Coleção: filtros + grade (Home e Listagem)
   * ------------------------------------------------------------------ */
  var FILTER_KEYS = ['categoria', 'local', 'valor', 'quartos', 'estilo'];

  function initCollection() {
    var shell = $('[data-collection]');
    if (!shell) return;
    var form = $('[data-filters]', shell);
    var grid = $('[data-property-grid]', shell);
    var countEl = $('[data-results-count]', shell);
    var sortEl = $('[data-sort]');
    var link = $('[data-results-link]', shell);
    var limit = parseInt(shell.dataset.limit || '0', 10);
    var syncUrl = shell.hasAttribute('data-sync-url');
    var priceSelect = $('[data-price-options]', form);
    var toggle = $('[data-filters-open]', shell);
    var backdrop = $('[data-filters-backdrop]', shell);
    var firstRender = true;

    $$('[data-location-options]', form).forEach(fillLocationOptions);
    $$('[data-style-options]', form).forEach(fillStyleOptions);

    function setField(name, value) {
      var radios = $$('input[type="radio"][name="' + name + '"]', form);
      if (radios.length) {
        radios.forEach(function (r) { r.checked = r.value === value; });
        if (!radios.some(function (r) { return r.checked; })) radios[0].checked = true;
        return;
      }
      var el = form.elements[name];
      if (el) el.value = value;
    }

    function readState() {
      var data = new FormData(form);
      var state = {};
      FILTER_KEYS.forEach(function (k) { state[k] = data.get(k) || ''; });
      state.ordem = sortEl ? sortEl.value : 'destaque';
      return state;
    }

    function matches(p, s) {
      if (s.categoria && p.category !== s.categoria) return false;
      if (s.local && slugify(p.neighborhood) !== s.local) return false;
      if (s.quartos && p.bedrooms < parseInt(s.quartos, 10)) return false;
      if (s.estilo && slugify(p.style) !== s.estilo) return false;
      if (s.valor && s.categoria) {
        var range = (L.priceRanges[s.categoria] || []).filter(function (r) { return r.value === s.valor; })[0];
        if (range && (p.price < range.min || p.price >= range.max)) return false;
      }
      return true;
    }

    function sortList(list, order) {
      var copy = list.slice();
      if (order === 'maior-valor') copy.sort(function (a, b) { return b.price - a.price; });
      else if (order === 'menor-valor') copy.sort(function (a, b) { return a.price - b.price; });
      else if (order === 'maior-area') copy.sort(function (a, b) { return (b.areaMax || b.area) - (a.areaMax || a.area); });
      else copy.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
      return copy;
    }

    function activeCount(s) {
      return FILTER_KEYS.filter(function (k) { return s[k]; }).length;
    }

    function queryString(s) {
      var q = new URLSearchParams();
      FILTER_KEYS.forEach(function (k) { if (s[k]) q.set(k, s[k]); });
      if (s.ordem && s.ordem !== 'destaque') q.set('ordem', s.ordem);
      var str = q.toString();
      return str ? '?' + str : '';
    }

    function emptyHTML() {
      return '<div class="empty-state">' +
        '<p class="h3">Nenhuma residência publicada corresponde a esta busca.</p>' +
        '<p>Algumas das melhores oportunidades não estão nos portais. Conte o que você procura e receba uma curadoria privada.</p>' +
        '<a class="btn btn--dark" href="' + contactAnchor + '" data-open-message>Falar com Luiz ' + icon('arrow') + '</a>' +
        '</div>';
    }

    function render() {
      var s = readState();
      var active = activeCount(s);
      var results = sortList(L.properties.filter(function (p) { return matches(p, s); }), s.ordem);
      var shown = limit ? results.slice(0, limit) : results;

      // Contagens
      var total = L.properties.length;
      if (countEl) {
        if (!results.length) countEl.innerHTML = 'Nenhum resultado';
        else if (limit && !active) countEl.innerHTML = '<strong>' + shown.length + '</strong> destaques de ' + total + ' residências';
        else countEl.innerHTML = '<strong>' + results.length + '</strong> ' + (results.length === 1 ? 'residência' : 'residências') + (active ? (results.length === 1 ? ' encontrada' : ' encontradas') : '');
      }
      $$('[data-results-number]', form).forEach(function (el) { el.textContent = results.length; });
      $$('[data-filters-count]', shell).forEach(function (el) { el.textContent = active || ''; });
      if (link) {
        link.href = 'imoveis.html' + queryString(s);
        link.firstChild.nodeValue = (active && results.length > shown.length ? 'Ver todas as ' + results.length + ' residências ' : 'Ver toda a coleção ');
      }
      if (syncUrl) history.replaceState(null, '', location.pathname + queryString(s));

      function paint() {
        grid.innerHTML = shown.length ? shown.map(cardHTML).join('') : emptyHTML();
        bindCardHover(grid);
        reveal(grid);
        grid.classList.remove('is-updating');
      }
      if (firstRender || reduceMotion) { paint(); firstRender = false; }
      else { grid.classList.add('is-updating'); setTimeout(paint, 200); }
    }

    // Estado inicial vindo da URL (ex.: busca rápida da Home)
    var params = new URLSearchParams(location.search);
    if (syncUrl) {
      setField('categoria', params.get('categoria') || '');
      ['local', 'quartos', 'estilo'].forEach(function (k) { if (params.get(k)) setField(k, params.get(k)); });
    }
    fillPriceOptions(priceSelect, readState().categoria);
    if (syncUrl && params.get('valor')) setField('valor', params.get('valor'));
    if (sortEl && params.get('ordem')) sortEl.value = params.get('ordem');

    form.addEventListener('change', function (e) {
      if (e.target.name === 'categoria') fillPriceOptions(priceSelect, e.target.value);
      render();
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('reset', function () {
      setTimeout(function () { fillPriceOptions(priceSelect, ''); render(); }, 0);
    });
    if (sortEl) sortEl.addEventListener('change', render);

    // Painel de filtros no mobile (bottom sheet)
    function setSheet(open) {
      form.classList.toggle('is-open', open);
      if (backdrop) backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      if (toggle) toggle.setAttribute('aria-expanded', String(open));
      if (open) setTimeout(function () { var b = $('[data-filters-close]', form); if (b) b.focus(); }, 60);
      else if (toggle) toggle.focus();
    }
    if (toggle) toggle.addEventListener('click', function () { setSheet(true); });
    if (backdrop) backdrop.addEventListener('click', function () { setSheet(false); });
    $$('[data-filters-close]', form).forEach(function (b) { b.addEventListener('click', function () { setSheet(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && form.classList.contains('is-open')) setSheet(false); });

    render();
  }

  function initCategoryCounts() {
    $$('[data-category-count]').forEach(function (el) {
      var n = L.properties.filter(function (p) { return p.category === el.dataset.categoryCount; }).length;
      el.textContent = n + (n === 1 ? ' residência' : ' residências');
    });
  }

  function initQuickSearch() {
    $$('.quick-search [data-location-options]').forEach(fillLocationOptions);
  }

  /* ------------------------------------------------------------------
   * Lightbox (dialog nativo)
   * ------------------------------------------------------------------ */
  var lightbox = (function () {
    var dlg, img, countEl, captionEl, items = [], index = 0, opener = null;

    function build() {
      dlg = document.createElement('dialog');
      dlg.className = 'lightbox';
      dlg.setAttribute('aria-label', 'Galeria de imagens');
      dlg.innerHTML =
        '<div class="lightbox__top"><span data-lb-count></span>' +
        '<button class="icon-btn" type="button" data-lb-close aria-label="Fechar galeria">' + icon('close') + '</button></div>' +
        '<div class="lightbox__stage"><img alt=""></div>' +
        '<div class="lightbox__bottom"><span class="lightbox__caption" data-lb-caption></span>' +
        '<div class="lightbox__nav"><button class="icon-btn" type="button" data-lb-prev aria-label="Imagem anterior">' + icon('arrow-left') + '</button>' +
        '<button class="icon-btn" type="button" data-lb-next aria-label="Próxima imagem">' + icon('arrow') + '</button></div></div>';
      document.body.appendChild(dlg);
      img = $('img', dlg);
      countEl = $('[data-lb-count]', dlg);
      captionEl = $('[data-lb-caption]', dlg);
      $('[data-lb-close]', dlg).addEventListener('click', close);
      $('[data-lb-prev]', dlg).addEventListener('click', function () { go(-1); });
      $('[data-lb-next]', dlg).addEventListener('click', function () { go(1); });
      dlg.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      });
      dlg.addEventListener('close', function () {
        document.body.classList.remove('is-locked');
        if (opener) opener.focus();
      });
      var startX = null;
      var stage = $('.lightbox__stage', dlg);
      stage.addEventListener('pointerdown', function (e) { startX = e.clientX; });
      stage.addEventListener('pointerup', function (e) {
        if (startX === null) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        startX = null;
      });
    }
    function show() {
      var it = items[index];
      img.src = photo(it.photo, 2400, null, 'max');
      img.alt = it.alt || '';
      countEl.textContent = (index + 1) + ' / ' + items.length;
      captionEl.textContent = it.caption || '';
      // Pré-carrega a próxima imagem
      var next = items[(index + 1) % items.length];
      if (next) { var pre = new Image(); pre.src = photo(next.photo, 2400, null, 'max'); }
    }
    function go(step) {
      index = (index + step + items.length) % items.length;
      show();
    }
    function open(list, start, from) {
      if (!dlg) build();
      items = list; index = start || 0; opener = from || document.activeElement;
      show();
      document.body.classList.add('is-locked');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    }
    function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
    return { open: open };
  })();

  /* ------------------------------------------------------------------
   * Galeria masonry
   * ------------------------------------------------------------------ */
  function renderMasonry(container, items) {
    container.innerHTML = items.map(function (it, i) {
      var w = 900, h = Math.round(w / it.ratio);
      return '<figure class="masonry__item" data-reveal="image" style="--d:' + ((i % 3) * 0.1).toFixed(1) + 's">' +
        '<button class="masonry__button" type="button" data-index="' + i + '" aria-label="Ampliar imagem: ' + esc(it.caption) + '" style="aspect-ratio:' + it.ratio.toFixed(4) + '">' +
          '<img src="' + photo(it.photo, w, h) + '" srcset="' + photo(it.photo, 600, Math.round(600 / it.ratio)) + ' 600w, ' + photo(it.photo, w, h) + ' 900w, ' + photo(it.photo, 1300, Math.round(1300 / it.ratio)) + ' 1300w" sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 92vw" alt="' + esc(it.alt) + '" loading="lazy" decoding="async">' +
          '<figcaption class="masonry__caption"><strong>' + esc(it.caption) + '</strong><span>' + esc(it.detail) + '</span></figcaption>' +
        '</button></figure>';
    }).join('');
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.masonry__button');
      if (btn) lightbox.open(items, parseInt(btn.dataset.index, 10), btn);
    });
    reveal(container);
  }

  function initHomeGallery() {
    var el = $('[data-masonry]');
    if (!el || el.hasAttribute('data-property-masonry')) return;
    var items = L.gallery.map(function (g) {
      var p = findProperty(g.property);
      return { photo: g.photo, ratio: g.ratio, caption: p.name, detail: p.neighborhood + ' · ' + p.city, alt: p.name + ', ' + p.neighborhood };
    });
    renderMasonry(el, items);
  }

  /* ------------------------------------------------------------------
   * Depoimentos
   * ------------------------------------------------------------------ */
  function initTestimonials() {
    var root = $('[data-testimonials]');
    if (!root) return;
    var stage = $('[data-testimonials-stage]', root);
    var count = $('[data-testimonial-count]', root);
    var list = L.testimonials;
    var index = 0;
    stage.innerHTML = list.map(function (t, i) {
      return '<figure class="testimonial"' + (i ? ' hidden' : '') + '><blockquote>' + esc(t.quote) + '</blockquote>' +
        '<figcaption><strong>' + esc(t.author) + '</strong><span>' + esc(t.detail) + '</span></figcaption></figure>';
    }).join('');
    var figures = $$('.testimonial', stage);
    function show(i) {
      figures[index].hidden = true;
      index = (i + figures.length) % figures.length;
      figures[index].hidden = false;
      figures[index].classList.remove('is-entering');
      void figures[index].offsetWidth;
      figures[index].classList.add('is-entering');
      count.textContent = String(index + 1).padStart(2, '0') + ' — ' + String(figures.length).padStart(2, '0');
    }
    $('[data-testimonial-prev]', root).addEventListener('click', function () { show(index - 1); });
    $('[data-testimonial-next]', root).addEventListener('click', function () { show(index + 1); });
    count.textContent = '01 — ' + String(figures.length).padStart(2, '0');
  }

  /* ------------------------------------------------------------------
   * Contato: abas, validação e confirmação (sem back-end)
   * ------------------------------------------------------------------ */
  function selectTab(name) {
    var card = $('[data-contact]');
    if (!card) return;
    $$('[data-tab]', card).forEach(function (tab) {
      var on = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !on;
      if (on) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
    });
  }

  function formatPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function tomorrowISO() {
    var t = new Date();
    t.setDate(t.getDate() + 1);
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }

  function fillPropertyOptions(select, selectedId) {
    select.appendChild(new Option('Ainda não sei — quero uma curadoria', ''));
    Object.keys(L.categories).forEach(function (cat) {
      var group = document.createElement('optgroup');
      group.label = L.categories[cat].label;
      L.properties.filter(function (p) { return p.category === cat; }).forEach(function (p) {
        group.appendChild(new Option(p.name + ' — ' + p.neighborhood, p.id));
      });
      select.appendChild(group);
    });
    if (selectedId) select.value = selectedId;
  }

  function validate(form) {
    var firstInvalid = null;
    $$('input, textarea, select', form).forEach(function (el) {
      var wrap = el.closest('.field, .consent');
      if (!wrap) return;
      var ok = true;
      var v = (el.value || '').trim();
      if (el.type === 'checkbox') ok = !el.required || el.checked;
      else if (el.required && !v) ok = false;
      else if (el.type === 'email' && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else if (el.hasAttribute('data-phone') && v) ok = v.replace(/\D/g, '').length >= 10;
      else if (el.type === 'date' && v) ok = v >= tomorrowISO();
      wrap.classList.toggle('has-error', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function composeMessage(type, data) {
    if (type === 'visita') {
      var p = findProperty(data.get('imovel'));
      var date = data.get('data') ? new Date(data.get('data') + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
      return {
        text: 'Olá, Luiz. Sou ' + data.get('nome') + ' e gostaria de agendar uma visita' + (p ? ' à ' + p.name + ' (' + p.neighborhood + ')' : '') +
          ' para ' + date + ', no período da ' + String(data.get('periodo')).toLowerCase() + '. Prefiro contato por ' + data.get('canal') + ': ' + data.get('telefone') + '.',
        summary: 'Recebi seu pedido de visita' + (p ? ' à <strong>' + esc(p.name) + '</strong>' : '') + ' para <strong>' + esc(date) + '</strong>, no período da ' + esc(String(data.get('periodo')).toLowerCase()) + '. Confirmo pessoalmente o horário por ' + esc(data.get('canal')) + ' em até duas horas úteis.'
      };
    }
    return {
      text: 'Olá, Luiz. Sou ' + data.get('nome') + '. ' + data.get('mensagem'),
      summary: 'Sua mensagem chegou. Retorno em até duas horas úteis, com a mesma discrição com que conduzo cada atendimento.'
    };
  }

  function initContact(selectedPropertyId) {
    var card = $('[data-contact]');
    if (!card) return;

    var tabs = $$('[data-tab]', card);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab.dataset.tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        selectTab(next.dataset.tab);
        next.focus();
      });
    });

    $$('[data-property-options]', card).forEach(function (s) { fillPropertyOptions(s, selectedPropertyId); });
    $$('[data-min-today]', card).forEach(function (d) { d.min = tomorrowISO(); });
    $$('[data-phone]', card).forEach(function (input) {
      input.addEventListener('input', function () { input.value = formatPhone(input.value); });
    });
    $$('input, textarea, select', card).forEach(function (el) {
      el.addEventListener('input', function () {
        var wrap = el.closest('.has-error');
        if (wrap) { wrap.classList.remove('has-error'); el.removeAttribute('aria-invalid'); }
      });
    });

    $$('[data-form]', card).forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate(form)) return;
        var data = new FormData(form);
        var msg = composeMessage(form.dataset.form, data);
        var wa = waLink(msg.text);
        var first = String(data.get('nome')).trim().split(/\s+/)[0];
        var success = document.createElement('div');
        success.className = 'form-success';
        success.setAttribute('role', 'status');
        success.tabIndex = -1;
        success.innerHTML =
          '<span class="form-success__icon">' + icon('check') + '</span>' +
          '<p class="h3">Obrigado, ' + esc(first) + '.</p>' +
          '<p>' + msg.summary + '</p>' +
          '<div class="form-actions" style="margin-top:1rem;justify-content:flex-start">' +
            (wa ? '<a class="btn btn--gold" href="' + wa + '" target="_blank" rel="noopener">Continuar no WhatsApp ' + icon('whatsapp') + '</a>' : '') +
            '<button class="link link--light" type="button" data-form-again>Enviar outra solicitação</button>' +
          '</div>';
        var tabsEl = $('.tabs', card);
        var panels = $$('.tab-panel', card);
        tabsEl.hidden = true;
        panels.forEach(function (p) { p.hidden = true; });
        card.appendChild(success);
        success.focus();
        $('[data-form-again]', success).addEventListener('click', function () {
          success.remove();
          form.reset();
          tabsEl.hidden = false;
          selectTab(form.dataset.form);
        });
      });
    });

    // Atalhos "Agendar visita" e "Enviar mensagem" de qualquer ponto da página
    document.addEventListener('click', function (e) {
      var visit = e.target.closest('[data-open-visit]');
      var message = e.target.closest('[data-open-message]');
      if (visit) selectTab('visita');
      else if (message) selectTab('mensagem');
    });
    if (location.hash === '#contato' && new URLSearchParams(location.search).get('assunto') === 'mensagem') selectTab('mensagem');
  }

  /* ------------------------------------------------------------------
   * Página de detalhe do imóvel
   * ------------------------------------------------------------------ */
  function initPropertyPage() {
    var root = $('[data-property-page]');
    if (!root) return null;
    var id = new URLSearchParams(location.search).get('id');
    var p = id ? findProperty(id) : L.properties[0];

    if (!p) {
      root.innerHTML = '<section class="container not-found">' +
        '<p class="eyebrow">Residência não encontrada</p>' +
        '<h1 class="h1">Este endereço não está mais disponível.</h1>' +
        '<p class="muted" style="max-width:44ch">Ele pode ter sido negociado ou retirado a pedido do proprietário. Conheça outras residências da coleção.</p>' +
        '<a class="btn btn--dark" href="imoveis.html">Ver a coleção ' + icon('arrow') + '</a></section>';
      $$('[data-hide-if-missing]').forEach(function (el) { el.remove(); });
      return null;
    }

    var cat = L.categories[p.category];
    document.title = p.name + ' · ' + p.neighborhood + ' — Luiz, Curadoria Imobiliária';
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.tagline);

    // Galeria principal
    var galleryItems = p.images.map(function (ph, i) {
      return { photo: ph, caption: p.name, alt: p.name + ' — imagem ' + (i + 1) + ' de ' + p.images.length };
    });
    var track = $('[data-pd-track]');
    track.innerHTML = galleryItems.map(function (it, i) {
      var big = i === 0;
      return '<div class="pd-gallery__item"><button type="button" data-index="' + i + '" aria-label="Ampliar ' + esc(it.alt) + '">' +
        '<img src="' + photo(it.photo, big ? 1600 : 900, big ? 1100 : 680) + '" srcset="' + photo(it.photo, 800, 680) + ' 800w, ' + photo(it.photo, 1600, big ? 1100 : 1360) + ' 1600w" sizes="(min-width: 900px) ' + (big ? '64vw' : '32vw') + ', 100vw" alt="' + esc(it.alt) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' decoding="async">' +
        '</button></div>';
    }).join('');
    var counter = $('[data-pd-counter]');
    counter.textContent = '1 / ' + galleryItems.length;
    track.addEventListener('scroll', function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      counter.textContent = (i + 1) + ' / ' + galleryItems.length;
    }, { passive: true });
    track.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-index]');
      if (b) lightbox.open(galleryItems, parseInt(b.dataset.index, 10), b);
    });
    var allBtn = $('[data-pd-all]');
    $('[data-pd-total]', allBtn).textContent = galleryItems.length;
    allBtn.addEventListener('click', function () { lightbox.open(galleryItems, 0, allBtn); });

    // Cabeçalho
    $('[data-pd-breadcrumb]').innerHTML =
      '<li><a href="index.html">Início</a></li><li><a href="imoveis.html">Coleção</a></li>' +
      '<li><a href="imoveis.html?categoria=' + p.category + '">' + cat.label + '</a></li><li aria-current="page">' + esc(p.name) + '</li>';
    $('[data-pd-location]').textContent = p.neighborhood + ' · ' + p.city;
    $('[data-pd-name]').textContent = p.name;
    $('[data-pd-tagline]').textContent = p.tagline;

    var facts = p.category === 'lancamento'
      ? [['Plantas', areaLabel(p)], ['Tipologia', p.type], ['Suítes', p.bedroomsMin ? p.bedroomsMin + ' a ' + p.bedrooms : p.bedrooms], ['Vagas', p.parking], ['Entrega', p.delivery]]
      : [['Área privativa', areaLabel(p)], p.land ? ['Terreno', NUM.format(p.land) + ' m²'] : ['Tipologia', p.type], ['Suítes', p.bedrooms], ['Vagas', p.parking], ['Construção', p.year]];
    $('[data-pd-facts]').innerHTML = facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');

    $('[data-pd-description]').innerHTML = p.description.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    $('[data-pd-highlights]').innerHTML = p.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');

    var ratios = [4 / 5, 3 / 2, 1, 3 / 4, 4 / 3, 4 / 5, 3 / 2];
    renderMasonry($('[data-property-masonry]'), p.images.map(function (ph, i) {
      return { photo: ph, ratio: ratios[i % ratios.length], caption: p.name, detail: 'Imagem ' + (i + 1) + ' de ' + p.images.length, alt: galleryItems[i].alt };
    }));

    $('[data-pd-neighborhood]').textContent = p.neighborhood;
    $('[data-pd-neighborhood-text]').textContent = L.neighborhoods[p.neighborhood] || '';
    $('[data-pd-map-label]').textContent = 'Localização aproximada · ' + p.neighborhood;

    // Preço
    var priceTitle = p.category === 'aluguel' ? 'Locação mensal' : p.category === 'lancamento' ? 'Unidades a partir de' : 'Valor de venda';
    var value = p.priceOnRequest ? 'Sob consulta' : BRL.format(p.price);
    var note = p.priceOnRequest ? 'Valores e condições apresentados pessoalmente, mediante agendamento.'
      : p.category === 'aluguel' ? 'Condomínio e IPTU informados no atendimento.'
      : p.category === 'lancamento' ? 'Condições exclusivas de pré-lançamento.'
      : 'Condomínio e IPTU informados no atendimento.';
    $('[data-pd-price-title]').textContent = priceTitle;
    $('[data-pd-price]').textContent = value;
    $('[data-pd-price-note]').textContent = note;
    $('[data-mobile-price-title]').textContent = priceTitle;
    $('[data-mobile-price]').textContent = value;

    // Compartilhar
    $$('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var data = { title: p.name, text: p.tagline, url: location.href };
        if (navigator.share) navigator.share(data).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast('Link copiado'); });
      });
    });

    // Relacionados
    var related = L.properties.filter(function (x) { return x.id !== p.id && x.category === p.category; });
    if (related.length < 3) related = related.concat(L.properties.filter(function (x) { return x.id !== p.id && x.category !== p.category; }));
    var relatedGrid = $('[data-related-grid]');
    relatedGrid.innerHTML = related.slice(0, 3).map(cardHTML).join('');
    bindCardHover(relatedGrid);
    reveal(relatedGrid);

    return p;
  }

  /* ------------------------------------------------------------------
   * Inicialização
   * ------------------------------------------------------------------ */
  initHeader();
  initMenu();
  initQuickSearch();
  initCategoryCounts();
  initCollection();
  initHomeGallery();
  initTestimonials();
  var property = initPropertyPage();
  initContact(property && property.id);
  bindContactLinks(property ? 'Olá, Luiz. Tenho interesse na ' + property.name + ' (' + property.neighborhood + '). ' + location.href : null);
  reveal(document);

  var hero = $('[data-hero]');
  if (hero) {
    var heroImg = $('img', hero);
    var ready = function () { requestAnimationFrame(function () { hero.classList.add('is-ready'); }); };
    if (heroImg.complete) ready(); else { heroImg.addEventListener('load', ready); heroImg.addEventListener('error', ready); }
  }
})();
