/*
 * Comportamento do site. Tudo roda depois do DOMContentLoaded e lê os dados
 * de window.SITE_DATA (data.js). Não há dado fixo aqui.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* =========================================================
     Utilidades
     ========================================================= */

  var DATA = window.SITE_DATA || {};
  var cfg = DATA.config || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqMobile = window.matchMedia('(max-width: 900px), (orientation: portrait)');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }
  function plural(n, um, varios) { return n === 1 ? um : varios; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var BRL_COMPACT = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });
  function preco(im) {
    if (im.preco == null || im.preco === '') return 'Sob consulta';
    return BRL.format(im.preco) + (im.finalidade === 'aluguel' ? '/mês' : '');
  }

  var TIPOS = {
    casa: { um: 'Casa', chip: 'Casas' },
    apartamento: { um: 'Apartamento', chip: 'Apartamentos' },
    terreno: { um: 'Terreno', chip: 'Terrenos' },
    comercial: { um: 'Comercial', chip: 'Comerciais' },
    outros: { um: 'Imóvel', chip: 'Outros' }
  };
  function tipoLabel(t) { return (TIPOS[t] || TIPOS.outros).um; }

  function cidadeOk(c) { return !!c && norm(c) !== 'a definir'; }
  function local(im, opts) {
    var partes = [];
    if (im.bairro) partes.push(im.bairro);
    if (cidadeOk(im.cidade)) partes.push(im.cidade + (opts && opts.uf && im.uf ? '/' + im.uf : ''));
    return partes.join(opts && opts.sep ? opts.sep : ', ');
  }
  function vendido(im) { return im.status === 'vendido' || im.status === 'alugado'; }

  function thumb(src) { return src ? src.replace(/\.webp$/i, '-thumb.webp') : ''; }

  // foto inteira: contida no quadro, com a própria foto desfocada preenchendo a sobra
  function photo(src, alt, lazy) {
    if (!src) return '<div class="ph ph--empty"><svg class="ic" aria-hidden="true"><use href="#i-home"/></svg></div>';
    var l = lazy === false ? '' : ' loading="lazy"';
    return '<div class="ph"><img class="ph-bg" src="' + esc(src) + '" alt="" aria-hidden="true"' + l + '>' +
      '<img class="ph-img" src="' + esc(src) + '" alt="' + esc(alt) + '"' + l + '></div>';
  }
  function miniThumb(im, eager) {
    var src = im.fotos && im.fotos[0];
    return src ? '<img src="' + esc(thumb(src)) + '" alt=""' + (eager ? '' : ' loading="lazy"') + '>' : '<span class="thumb-empty"></span>';
  }

  function waLink(texto) {
    var num = String(cfg.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + (num ? num : '') + '?text=' + encodeURIComponent(texto);
  }

  function countUp(el, alvo, casas, sufixo) {
    sufixo = sufixo || '';
    var fmt = function (v) { return v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }) + sufixo; };
    if (reduceMotion) { el.textContent = fmt(alvo); return; }
    var t0 = performance.now(), dur = 1400;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(alvo * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2400);
  }

  /* =========================================================
     Dados preparados
     ========================================================= */

  var imoveis = (DATA.imoveis || []).map(function (im, i) {
    var c = Object.assign({}, im);
    c._i = i;
    c.fotos = (im.fotos || []).filter(Boolean);
    c.selos = im.selos || [];
    c.caracteristicas = im.caracteristicas || [];
    return c;
  }).sort(function (a, b) {
    var da = vendido(a) ? 1 : 0, db = vendido(b) ? 1 : 0;
    if (da !== db) return da - db;
    var oa = a.ordem == null ? Infinity : a.ordem, ob = b.ordem == null ? Infinity : b.ordem;
    if (oa !== ob) return oa - ob;
    var ta = a.criadoEm ? Date.parse(a.criadoEm) : a._i, tb = b.criadoEm ? Date.parse(b.criadoEm) : b._i;
    return tb - ta; // mais novos primeiro
  });
  var porSlug = {};
  imoveis.forEach(function (im) { porSlug[im.slug] = im; });
  var destaques = imoveis.filter(function (im) { return im.destaque; });
  if (!destaques.length) destaques = imoveis.slice(0, 3);
  var cidades = [];
  imoveis.forEach(function (im) { if (cidadeOk(im.cidade) && cidades.indexOf(im.cidade) === -1) cidades.push(im.cidade); });
  cidades.sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
  var disponiveis = imoveis.filter(function (im) { return !vendido(im); });
  var avaliacoes = DATA.avaliacoes || [];
  var media = avaliacoes.length ? avaliacoes.reduce(function (s, a) { return s + (Number(a.nota) || 0); }, 0) / avaliacoes.length : 0;

  /* =========================================================
     Assinatura, ícone da aba e textos de configuração
     ========================================================= */

  var ass = cfg.assinatura || {};
  var nomePartes = String(cfg.nome || '').split(' ');
  var brandTxt = {
    antes: ass.antes || nomePartes[0] || '',
    iniciais: ass.iniciais || nomePartes.map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase(),
    depois: ass.depois || nomePartes.slice(1).join(' ')
  };
  $$('[data-brand]').forEach(function (el) { el.textContent = brandTxt[el.dataset.brand] || ''; });
  $$('.brand-link').forEach(function (a) { a.setAttribute('aria-label', (cfg.nome || '') + ', ir para o início'); });
  $$('[data-cfg]').forEach(function (el) { if (cfg[el.dataset.cfg]) el.textContent = cfg[el.dataset.cfg]; });
  if (cfg.regiao) $('#intro-text').textContent = 'Imóveis selecionados em ' + cfg.regiao + ', com atendimento de perto do primeiro contato até as chaves.';

  (function favicon() {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffd9bd'/><stop offset='.55' stop-color='#ff9a5a'/><stop offset='1' stop-color='#ff6a1f'/></linearGradient></defs>" +
      "<rect width='64' height='64' rx='16' fill='#141110'/>" +
      "<text x='31' y='43' text-anchor='middle' font-family='Playfair Display,Georgia,serif' font-size='30' font-weight='500' letter-spacing='-3' fill='url(#g)'>" +
      esc(brandTxt.iniciais) + "</text></svg>";
    $('#favicon').href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  })();

  /* =========================================================
     Favoritos e carrinho (localStorage)
     ========================================================= */

  function ler(chave) {
    try {
      var v = JSON.parse(localStorage.getItem(chave));
      return Array.isArray(v) ? v.filter(function (s) { return porSlug[s]; }) : [];
    } catch (e) { return []; }
  }
  function gravar(chave, lista) { try { localStorage.setItem(chave, JSON.stringify(lista)); } catch (e) { /* sem armazenamento */ } }
  var favs = ler('site:favoritos');
  var cart = ler('site:carrinho');

  function isFav(slug) { return favs.indexOf(slug) !== -1; }
  function toggleFav(slug) {
    var i = favs.indexOf(slug);
    if (i === -1) favs.push(slug); else favs.splice(i, 1);
    gravar('site:favoritos', favs);
    syncFavs();
    toast(i === -1 ? 'Salvo nos favoritos' : 'Removido dos favoritos');
  }
  function syncFavs() {
    $$('[data-fav]').forEach(function (b) {
      var on = isFav(b.dataset.fav);
      var im = porSlug[b.dataset.fav];
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', (on ? 'Remover dos favoritos: ' : 'Favoritar: ') + (im ? im.titulo : ''));
    });
    var c = $('#fav-count');
    c.textContent = favs.length;
    c.hidden = favs.length === 0;
    if (drawerOpen) renderDrawer();
  }
  function addCart(slug) {
    if (cart.indexOf(slug) === -1) {
      cart.push(slug);
      gravar('site:carrinho', cart);
      toast('Adicionado ao carrinho');
    } else {
      toast('Esse imóvel já está no carrinho');
    }
    syncCart();
  }
  function removeCart(slug) {
    cart = cart.filter(function (s) { return s !== slug; });
    gravar('site:carrinho', cart);
    syncCart();
  }
  function syncCart() {
    if (detailSlug) updateDetailCart();
    if (drawerOpen) renderDrawer();
  }

  /* =========================================================
     Camadas (detalhe, menu, busca, conta)
     ========================================================= */

  var layers = [];
  function anyLayer() { return layers.length > 0; }
  function pushLayer(name, close) { layers.push({ name: name, close: close }); }
  function popLayer(name) { layers = layers.filter(function (l) { return l.name !== name; }); }
  function closeTop() { var l = layers[layers.length - 1]; if (l) l.close(); }
  function closeAll() { layers.slice().reverse().forEach(function (l) { l.close(true); }); }

  function setInertScenes(on) {
    $('.scenes').inert = on;
    $('.topbar').inert = on;
    $('.rail').inert = on;
  }
  function refreshInert() { setInertScenes(anyLayer()); }

  /* =========================================================
     Cenas
     ========================================================= */

  var scenes = $$('.scene');
  var ids = scenes.map(function (s) { return s.id; });
  var cur = -1;
  var locked = false;
  var lockTimer = null;
  var navItems = $$('.nav-item');
  var glider = $('.nav-glider');
  var railTicks = $$('.rail-ticks button');
  var enterHooks = {};
  var leaveHooks = {};

  function toneOf(scene) {
    if (scene.id === 'inicio' && mqMobile.matches) return 'dark';
    return scene.dataset.tone || 'light';
  }

  function moveGlider() {
    var btn = navItems[cur];
    if (!btn || !glider) return;
    glider.style.width = btn.offsetWidth + 'px';
    glider.style.transform = 'translate(' + btn.offsetLeft + 'px, -50%)';
  }

  function go(i, opts) {
    opts = opts || {};
    if (i < 0 || i >= scenes.length || i === cur) return;
    if (locked && !opts.force) return;
    var prev = scenes[cur];
    var next = scenes[i];
    var animar = !reduceMotion && !!prev && !opts.instant;

    locked = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(function () { locked = false; }, animar ? 900 : 60);

    if (prev) {
      prev.classList.remove('is-active', 'is-entering');
      prev.inert = true;
      prev.setAttribute('aria-hidden', 'true');
      if (animar) {
        prev.classList.add('is-leaving');
        setTimeout(function () { prev.classList.remove('is-leaving'); }, 900);
      }
      if (leaveHooks[prev.id]) leaveHooks[prev.id]();
    }

    next.inert = false;
    next.removeAttribute('aria-hidden');
    next.scrollTop = 0;
    next.classList.add('is-active');
    if (animar) {
      next.classList.add('is-entering');
      setTimeout(function () { next.classList.remove('is-entering'); }, 950);
      body.classList.remove('is-cutting');
      void body.offsetWidth;
      body.classList.add('is-cutting');
      setTimeout(function () { body.classList.remove('is-cutting'); }, 850);
    }

    cur = i;
    body.dataset.tone = toneOf(next);
    navItems.forEach(function (b, k) {
      b.classList.toggle('is-active', k === i);
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    railTicks.forEach(function (b, k) {
      b.classList.toggle('is-active', k === i);
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    $$('.menu-list button').forEach(function (b, k) { b.classList.toggle('is-current', k === i); });
    moveGlider();
    $('#rail-num').textContent = pad(i + 1);
    $('#rail-name').textContent = next.dataset.label;
    document.title = i === 0
      ? [cfg.nome, cfg.segmento].filter(Boolean).join(' — ')
      : [next.dataset.label, cfg.nome].filter(Boolean).join(' — ');
    if (!opts.fromHash && location.hash.slice(1) !== next.id) {
      try { history.replaceState(null, '', '#' + next.id); } catch (e) { /* file:// */ }
    }
    if (enterHooks[next.id]) enterHooks[next.id]();
  }
  function goId(id, opts) { var i = ids.indexOf(id); if (i !== -1) go(i, opts); }

  // [data-go] em qualquer lugar
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (!g) return;
    e.preventDefault();
    var id = g.dataset.go;
    if (layers.length === 1 && layers[0].name === 'menu') { fecharMenu(); goId(id, { force: true }); }
    else if (anyLayer()) { closeAll(); setTimeout(function () { goId(id, { force: true }); }, 60); }
    else goId(id);
  });

  window.addEventListener('hashchange', function () {
    var i = ids.indexOf(location.hash.slice(1));
    if (i !== -1) go(i, { fromHash: true, force: true });
  });

  // pode a cena rolar por dentro nessa direção?
  function rolavel(el) {
    return !!el && getComputedStyle(el).overflowY !== 'hidden' && el.scrollHeight > el.clientHeight + 2;
  }
  function podeRolar(el, dir) {
    if (!rolavel(el)) return false;
    return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
  }

  // roda do mouse com detecção de inércia
  var acc = 0, lastT = 0, lastAbs = 0, esperarPausa = false;
  window.addEventListener('wheel', function (e) {
    if (anyLayer()) return;
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    var dx = e.deltaX * (e.deltaMode === 1 ? 16 : 1);
    if (Math.abs(dx) > Math.abs(dy)) return; // gesto lateral: deixa as listas rolarem
    var now = performance.now();
    var dt = now - lastT;
    lastT = now;
    var abs = Math.abs(dy);

    if (esperarPausa) {
      // a cauda do trackpad vai diminuindo; um gesto novo volta a crescer ou vem depois de uma pausa
      if (dt > 220 || abs > lastAbs * 1.5 + 4) { esperarPausa = false; acc = 0; }
      else { lastAbs = abs; return; }
    }
    lastAbs = abs;
    if (podeRolar(scenes[cur], dy)) { acc = 0; return; }
    if (locked) { acc = 0; return; }
    if (dt > 260) acc = 0;
    acc += dy;
    if (Math.abs(acc) > 28) {
      var dir = acc > 0 ? 1 : -1;
      acc = 0;
      esperarPausa = true;
      go(cur + dir);
    }
  }, { passive: true });

  // teclado
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (anyLayer()) { e.preventDefault(); closeTop(); }
      return;
    }
    if (anyLayer() || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
    var sc = scenes[cur];
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (podeRolar(sc, 1)) return;
      e.preventDefault(); go(cur + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (podeRolar(sc, -1)) return;
      e.preventDefault(); go(cur - 1);
    } else if (e.key === 'Home') {
      e.preventDefault(); go(0);
    } else if (e.key === 'End') {
      e.preventDefault(); go(scenes.length - 1);
    }
  });

  // dedo na vertical (mais de 60 px); listas horizontais rolam sem trocar de cena
  var toque = null;
  window.addEventListener('touchstart', function (e) {
    if (anyLayer() || e.touches.length !== 1) { toque = null; return; }
    var sc = scenes[cur];
    var t = e.touches[0];
    var r = rolavel(sc);
    toque = {
      x: t.clientX, y: t.clientY,
      topo: !r || sc.scrollTop <= 2,
      fim: !r || sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2
    };
  }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (!toque) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - toque.x, dy = t.clientY - toque.y;
    var ini = toque;
    toque = null;
    if (Math.abs(dy) < 60 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
    if (dy < 0 && ini.fim) go(cur + 1);
    else if (dy > 0 && ini.topo) go(cur - 1);
  }, { passive: true });

  window.addEventListener('resize', moveGlider);
  mqMobile.addEventListener('change', function () {
    if (cur >= 0) body.dataset.tone = toneOf(scenes[cur]);
    moveGlider();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveGlider);

  /* =========================================================
     01 Início
     ========================================================= */

  (function inicio() {
    var stats = [];
    if (cidades.length) stats.push({ v: cidades.length, l: plural(cidades.length, 'Cidade', 'Cidades'), c: 0 });
    if (cfg.familias) stats.push({ v: Number(cfg.familias), l: 'Famílias', c: 0 });
    if (cfg.anos) stats.push({ v: Number(cfg.anos), l: plural(Number(cfg.anos), 'Ano', 'Anos'), c: 0 });
    if (avaliacoes.length) stats.push({ v: media, l: 'Nota média', c: 1 });
    var ul = $('#stats');
    ul.innerHTML = stats.map(function (s) { return '<li><strong data-to="' + s.v + '" data-c="' + s.c + '">0</strong><span>' + esc(s.l) + '</span></li>'; }).join('');
    ul.hidden = !stats.length;

    var n = disponiveis.length;
    var mc = $('#mini-count');
    mc.innerHTML =
      '<div><p class="mini-num">+' + n + '</p><p class="mini-label">' + plural(n, 'imóvel', 'imóveis') + '<br>' + plural(n, 'selecionado', 'selecionados') + '</p></div>' +
      '<div class="thumbs">' + disponiveis.slice(0, 3).map(miniThumb).join('') + '</div>';
    mc.hidden = !n;

    var f = destaques[0];
    var mf = $('#mini-feat');
    if (f) {
      mf.innerHTML =
        (f.fotos[0] ? '<img class="mini-photo" src="' + esc(thumb(f.fotos[0])) + '" alt="">' : '') +
        '<div class="mini-info"><small>Em destaque</small><strong>' + esc(f.titulo) + '</strong><span>' + esc(cidadeOk(f.cidade) ? f.cidade : '') + '</span></div>' +
        '<button type="button" class="round round--gold" data-open="' + esc(f.slug) + '" aria-label="Ver detalhes: ' + esc(f.titulo) + '"><svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
    } else {
      mf.hidden = true;
    }

    enterHooks.inicio = function () {
      $$('#stats strong').forEach(function (el) { countUp(el, Number(el.dataset.to), Number(el.dataset.c)); });
    };

    // parallax leve com o mouse
    var stage = $('#hero-stage');
    if (!reduceMotion) {
      var raf = null, mx = 0, my = 0;
      stage.addEventListener('mousemove', function (e) {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          stage.style.setProperty('--mx', mx.toFixed(3));
          stage.style.setProperty('--my', my.toFixed(3));
        });
      });
    }
  })();

  /* =========================================================
     02 Filtro
     ========================================================= */

  var FAIXAS = {
    venda: [200000, 300000, 400000, 500000, 600000, 800000, 1000000, 1250000, 1500000, 2000000, 3000000, Infinity],
    aluguel: [1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000, 15000, Infinity]
  };
  var filtro = { finalidade: '', tipo: '', cidade: '', quartos: 0, faixa: null };

  function tiposDisponiveis() {
    var base = ['casa', 'apartamento', 'terreno'];
    ['comercial', 'outros'].forEach(function (t) {
      if (imoveis.some(function (im) { return im.tipo === t; })) base.push(t);
    });
    return base;
  }
  function maxFiltro(f) {
    if (!f.finalidade || f.faixa == null) return Infinity;
    return FAIXAS[f.finalidade][f.faixa];
  }
  function combina(im, f) {
    if (f.finalidade && im.finalidade !== f.finalidade) return false;
    if (f.tipo && im.tipo !== f.tipo) return false;
    if (f.cidade && im.cidade !== f.cidade) return false;
    if (f.quartos && !((im.quartos || 0) >= f.quartos)) return false;
    var max = maxFiltro(f);
    if (max !== Infinity && !(im.preco != null && im.preco <= max)) return false;
    return true;
  }

  function chipsHTML(opcoes, atual) {
    return opcoes.map(function (o) {
      return '<button type="button" class="chip" data-v="' + esc(o.v) + '" aria-pressed="' + String(String(o.v) === String(atual)) + '">' + esc(o.l) + '</button>';
    }).join('');
  }

  var form = $('#filter-form');
  var range = $('#f-valor');
  var opcoesFiltro = {
    finalidade: [{ v: '', l: 'Comprar ou alugar' }, { v: 'venda', l: 'Comprar' }, { v: 'aluguel', l: 'Alugar' }],
    tipo: [{ v: '', l: 'Todos' }].concat(tiposDisponiveis().map(function (t) { return { v: t, l: TIPOS[t].chip }; })),
    cidade: [{ v: '', l: 'Todas' }].concat(cidades.map(function (c) { return { v: c, l: c }; })),
    quartos: [{ v: 0, l: 'Qualquer' }, { v: 2, l: '2+' }, { v: 3, l: '3+' }, { v: 4, l: '4+' }]
  };

  function renderFiltro() {
    $$('.chips[data-key]', form).forEach(function (box) {
      var k = box.dataset.key;
      box.innerHTML = chipsHTML(opcoesFiltro[k], filtro[k]);
    });
    var faixas = filtro.finalidade ? FAIXAS[filtro.finalidade] : null;
    range.disabled = !faixas;
    if (faixas) {
      range.max = faixas.length - 1;
      if (filtro.faixa == null) filtro.faixa = faixas.length - 1;
      range.value = filtro.faixa;
      $('#f-hint').textContent = filtro.finalidade === 'venda'
        ? 'Arraste para definir o valor máximo de compra.'
        : 'Arraste para definir o aluguel máximo por mês.';
    } else {
      range.max = 10;
      range.value = 10;
      $('#f-hint').textContent = 'Escolha Comprar ou Alugar para definir o valor máximo.';
    }
    atualizaValor();
    atualizaContagem();
  }
  function atualizaValor() {
    var max = maxFiltro(filtro);
    var txt = max === Infinity ? 'Qualquer valor' : 'Até ' + BRL_COMPACT.format(max) + (filtro.finalidade === 'aluguel' ? '/mês' : '');
    $('#f-value').textContent = txt;
    range.setAttribute('aria-valuetext', txt);
    var pct = range.max > 0 ? (range.value / range.max) * 100 : 100;
    range.style.setProperty('--fill', pct + '%');
  }
  function atualizaContagem() {
    var lista = imoveis.filter(function (im) { return combina(im, filtro); });
    $('#f-count').textContent = lista.length;
    $('#f-count-label').textContent = plural(lista.length, 'imóvel combina', 'imóveis combinam');
    $('#f-thumbs').innerHTML = lista.slice(0, 3).map(miniThumb).join('');
  }

  form.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var k = chip.parentElement.dataset.key;
    var v = chip.dataset.v;
    if (k === 'quartos') v = Number(v);
    if (k === 'finalidade' && v !== filtro.finalidade) filtro.faixa = null;
    filtro[k] = v;
    renderFiltro();
    var novo = $('.chips[data-key="' + k + '"] .chip[data-v="' + chip.dataset.v + '"]', form);
    if (novo) novo.focus();
  });
  range.addEventListener('input', function () {
    filtro.faixa = Number(range.value);
    atualizaValor();
    atualizaContagem();
  });
  form.addEventListener('reset', function (e) {
    e.preventDefault();
    filtro = { finalidade: '', tipo: '', cidade: '', quartos: 0, faixa: null };
    renderFiltro();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    aplicarNaCuradoria(filtro);
    goId('curadoria');
  });

  (function legenda() {
    var n = disponiveis.length, c = cidades.length;
    var txt = n + ' ' + plural(n, 'imóvel disponível', 'imóveis disponíveis');
    if (c) txt += ' em ' + c + ' ' + plural(c, 'cidade', 'cidades');
    $('#f-caption').textContent = txt;
  })();

  /* =========================================================
     03 Alto padrão
     ========================================================= */

  var cur3 = { alto: false, tipo: '', finalidade: '', cidade: '', quartos: 0, max: Infinity };

  function aplicarNaCuradoria(f) {
    cur3 = {
      alto: false,
      tipo: f.tipo,
      finalidade: f.finalidade,
      cidade: f.cidade,
      quartos: f.quartos,
      max: maxFiltro(f)
    };
    renderCuradoria(true);
  }
  function listaCuradoria() {
    return imoveis.filter(function (im) {
      if (cur3.alto && !im.destaque) return false;
      if (cur3.tipo && im.tipo !== cur3.tipo) return false;
      if (cur3.finalidade && im.finalidade !== cur3.finalidade) return false;
      if (cur3.cidade && im.cidade !== cur3.cidade) return false;
      if (cur3.quartos && !((im.quartos || 0) >= cur3.quartos)) return false;
      if (cur3.max !== Infinity && !(im.preco != null && im.preco <= cur3.max)) return false;
      return true;
    });
  }
  function selosHTML(im) {
    var out = ['<span class="pill pill--gold">' + (im.finalidade === 'aluguel' ? 'Aluguel' : 'Venda') + '</span>'];
    if (im.status === 'vendido') out.push('<span class="pill pill--dark">Vendido</span>');
    if (im.status === 'alugado') out.push('<span class="pill pill--dark">Alugado</span>');
    im.selos.forEach(function (s) { out.push('<span class="pill">' + esc(s) + '</span>'); });
    return out.join('');
  }
  function precoHTML(im) {
    return vendido(im) ? '<span class="price-old">' + esc(preco(im)) + '</span>' : esc(preco(im));
  }
  function cardHTML(im) {
    var foto = im.fotos[0] ? thumb(im.fotos[0]) : '';
    return '<article class="c-card' + (vendido(im) ? ' is-sold' : '') + '" data-open="' + esc(im.slug) + '">' +
      '<div class="c-photo">' + photo(foto, im.titulo) +
        '<div class="c-badges">' + selosHTML(im) + '</div>' +
        '<button type="button" class="round heart" data-fav="' + esc(im.slug) + '" aria-pressed="false"><svg class="ic" aria-hidden="true"><use href="#i-heart"/></svg></button>' +
      '</div>' +
      '<div class="c-body">' +
        '<div class="c-text">' +
          '<button type="button" class="c-name" data-open="' + esc(im.slug) + '">' + esc(im.titulo) + '</button>' +
          (cidadeOk(im.cidade) ? '<p class="c-place">' + esc(local(im, { sep: ' · ' })) + '</p>' : '') +
          '<p class="c-price">' + precoHTML(im) + '</p>' +
        '</div>' +
        '<button type="button" class="round round--gold" data-cart="' + esc(im.slug) + '" aria-label="Adicionar ao carrinho: ' + esc(im.titulo) + '"><svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg></button>' +
      '</div>' +
    '</article>';
  }

  function renderCuradoria(voltarInicio) {
    $('#c-mode').innerHTML = chipsHTML([{ v: 'alto', l: 'Alto padrão' }, { v: 'todos', l: 'Todos os imóveis' }], cur3.alto ? 'alto' : 'todos');
    $('#c-types').innerHTML = chipsHTML([{ v: '', l: 'Todos' }].concat(tiposDisponiveis().map(function (t) { return { v: t, l: TIPOS[t].chip }; })), cur3.tipo);
    $('#c-final').innerHTML = chipsHTML([{ v: 'venda', l: 'Comprar' }, { v: 'aluguel', l: 'Alugar' }], cur3.finalidade);

    var extras = [];
    if (cur3.cidade) extras.push(cur3.cidade);
    if (cur3.quartos) extras.push(cur3.quartos + '+ quartos');
    if (cur3.max !== Infinity) extras.push('até ' + BRL_COMPACT.format(cur3.max));
    $('#c-extra').innerHTML = extras.length
      ? '<button type="button" class="chip" aria-pressed="true" data-v="limpar-extra" aria-label="Remover filtro: ' + esc(extras.join(', ')) + '">' + esc(extras.join(' · ')) + '<svg class="ic" aria-hidden="true"><use href="#i-close"/></svg></button>'
      : '';

    var lista = listaCuradoria();
    $('#c-count').textContent = lista.length;
    $('#c-count-label').textContent = plural(lista.length, 'imóvel', 'imóveis');
    var box = $('#c-list');
    box.innerHTML = lista.length
      ? lista.map(cardHTML).join('')
      : '<p class="c-empty">Nenhum imóvel com esses filtros. <button type="button" class="link" data-act="limpar-c">Limpar filtros</button></p>';
    if (voltarInicio) box.scrollLeft = 0;
    syncFavs();
    setas();
  }
  function setas() {
    var box = $('#c-list');
    $('#c-prev').disabled = box.scrollLeft <= 4;
    $('#c-next').disabled = box.scrollLeft + box.clientWidth >= box.scrollWidth - 4;
  }
  function limparCuradoria() {
    cur3 = { alto: false, tipo: '', finalidade: '', cidade: '', quartos: 0, max: Infinity };
    renderCuradoria(true);
  }

  $('.c-bar').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var grupo = chip.parentElement.id;
    var v = chip.dataset.v;
    if (grupo === 'c-mode') cur3.alto = v === 'alto';
    else if (grupo === 'c-types') cur3.tipo = v;
    else if (grupo === 'c-final') cur3.finalidade = cur3.finalidade === v ? '' : v;
    else if (grupo === 'c-extra') { cur3.cidade = ''; cur3.quartos = 0; cur3.max = Infinity; }
    renderCuradoria(true);
  });
  $('#c-list').addEventListener('click', function (e) {
    if (e.target.closest('[data-act="limpar-c"]')) limparCuradoria();
  });
  $('#only-premium').addEventListener('click', function () {
    cur3.alto = true;
    renderCuradoria(true);
    var first = $('#c-list .c-name');
    if (first) first.focus({ preventScroll: true });
  });
  function rolarLista(dir) {
    var box = $('#c-list');
    var card = $('.c-card', box);
    var passo = card ? card.offsetWidth + parseFloat(getComputedStyle(box).columnGap || getComputedStyle(box).gap || 0) : box.clientWidth;
    box.scrollBy({ left: dir * passo, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  $('#c-prev').addEventListener('click', function () { rolarLista(-1); });
  $('#c-next').addEventListener('click', function () { rolarLista(1); });
  $('#c-list').addEventListener('scroll', function () { setas(); }, { passive: true });
  window.addEventListener('resize', setas);

  // banner com slides cruzados
  var slide = 0, bannerTimer = null;
  (function banner() {
    var slides = $('#banner-slides'), dots = $('#banner-dots');
    slides.innerHTML = destaques.map(function (im, i) {
      return '<div class="banner-slide' + (i === 0 ? ' is-on' : '') + '" aria-hidden="' + String(i !== 0) + '">' +
        photo(im.fotos[0] ? thumb(im.fotos[0]) : '', im.titulo, i !== 0) + '</div>';
    }).join('');
    dots.innerHTML = destaques.length > 1 ? destaques.map(function (im, i) {
      return '<button type="button" class="' + (i === 0 ? 'is-on' : '') + '" aria-label="Mostrar ' + esc(im.titulo) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>';
    }).join('') : '';
    dots.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      mostrarSlide($$('button', dots).indexOf(b));
      iniciarBanner();
    });
    $('#banner').hidden = !destaques.length;
    mostrarSlide(0);
  })();
  function mostrarSlide(i) {
    if (!destaques.length) return;
    slide = (i + destaques.length) % destaques.length;
    $$('.banner-slide').forEach(function (s, k) { s.classList.toggle('is-on', k === slide); s.setAttribute('aria-hidden', String(k !== slide)); });
    $$('#banner-dots button').forEach(function (d, k) {
      d.classList.toggle('is-on', k === slide);
      if (k === slide) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
    var im = destaques[slide];
    $('#banner-pill').innerHTML =
      '<strong>' + esc(im.titulo) + '</strong><span>' + precoHTML(im) + '</span>' +
      '<button type="button" class="round round--gold round--sm" data-open="' + esc(im.slug) + '" aria-label="Ver detalhes: ' + esc(im.titulo) + '"><svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
  }
  function iniciarBanner() {
    clearInterval(bannerTimer);
    if (reduceMotion || destaques.length < 2) return;
    bannerTimer = setInterval(function () { mostrarSlide(slide + 1); }, 6000);
  }
  enterHooks.curadoria = iniciarBanner;
  leaveHooks.curadoria = function () { clearInterval(bannerTimer); };

  /* =========================================================
     04 Instagram
     ========================================================= */

  (function instagram() {
    var perfil = String(cfg.instagram || '').replace(/^@/, '');
    var url = perfil ? 'https://instagram.com/' + encodeURIComponent(perfil) : '';
    var link = $('#ig-link');
    if (perfil) {
      link.href = url;
      link.textContent = '@' + perfil;
      link.hidden = false;
    }
    var box = $('#reels');
    if (!imoveis.length) { box.hidden = true; return; }
    var itens = [];
    for (var k = 0; k < 6; k++) {
      var im = imoveis[k % imoveis.length];
      var volta = Math.floor(k / imoveis.length);
      var foto = im.fotos.length ? im.fotos[volta % im.fotos.length] : '';
      itens.push({ im: im, foto: foto });
    }
    box.innerHTML = itens.map(function (it) {
      var im = it.im;
      var inner =
        photo(it.foto ? thumb(it.foto) : '', im.titulo) +
        '<span class="reel-top"><span class="pill pill--gold">' + (im.finalidade === 'aluguel' ? 'Aluguel' : 'Venda') + '</span>' +
          (cidadeOk(im.cidade) ? '<span class="reel-city"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>' + esc(im.cidade) + '</span>' : '') + '</span>' +
        '<span class="reel-play" aria-hidden="true"><svg class="ic"><use href="#i-play"/></svg></span>' +
        '<span class="reel-info"><strong>' + esc(im.titulo) + '</strong><span>' + esc(preco(im)) + '</span></span>';
      return url
        ? '<a class="reel" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="' + esc(im.titulo) + ' no Instagram">' + inner + '</a>'
        : '<button type="button" class="reel" data-open="' + esc(im.slug) + '" aria-label="Ver detalhes: ' + esc(im.titulo) + '">' + inner + '</button>';
    }).join('');
  })();

  /* =========================================================
     05 Avaliações
     ========================================================= */

  var av = 0;
  (function avaliacoesCena() {
    $('#a-stars-big').textContent = '★★★★★';
    $('#a-total').textContent = avaliacoes.length + ' ' + plural(avaliacoes.length, 'avaliação', 'avaliações');
    if (!avaliacoes.length) {
      $('#a-avg').textContent = '0,0';
      $('#a-body').innerHTML = '<p class="a-empty">As primeiras avaliações aparecem aqui em breve.</p>';
      $('#a-nav').hidden = true;
      return;
    }
    $('#a-bars').innerHTML = avaliacoes.map(function (a, i) {
      return '<button type="button" aria-label="Avaliação ' + (i + 1) + ' de ' + avaliacoes.length + '"><i></i></button>';
    }).join('');
    $('#a-bars').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) mostrarAvaliacao($$('#a-bars button').indexOf(b));
    });
    $('#a-bars').addEventListener('animationend', function () { mostrarAvaliacao(av + 1); });
    $('#a-prev').addEventListener('click', function () { mostrarAvaliacao(av - 1); });
    $('#a-next').addEventListener('click', function () { mostrarAvaliacao(av + 1); });
    mostrarAvaliacao(0, true);
  })();
  function iniciais(nome) {
    return String(nome || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
  }
  function mostrarAvaliacao(i, primeira) {
    if (!avaliacoes.length) return;
    av = (i + avaliacoes.length) % avaliacoes.length;
    var a = avaliacoes[av];
    var nota = Math.max(0, Math.min(5, Math.round(Number(a.nota) || 5)));
    var html =
      '<blockquote class="a-text">' + esc(a.texto) + '</blockquote>' +
      '<div class="a-author"><span class="avatar" aria-hidden="true">' + esc(iniciais(a.nome)) + '</span>' +
      '<div class="a-who"><strong>' + esc(a.nome) + '</strong>' + (a.subtitulo ? '<span>' + esc(a.subtitulo) + '</span>' : '') + '</div>' +
      '<span class="stars" role="img" aria-label="Nota ' + nota + ' de 5">' + '★★★★★'.slice(0, nota) + '<span style="opacity:.3">' + '★★★★★'.slice(nota) + '</span></span></div>';
    var bodyEl = $('#a-body');
    if (primeira || reduceMotion) bodyEl.innerHTML = html;
    else {
      bodyEl.classList.add('is-swapping');
      setTimeout(function () { bodyEl.innerHTML = html; bodyEl.classList.remove('is-swapping'); }, 300);
    }
    $$('#a-bars button').forEach(function (b, k) {
      b.classList.remove('is-on', 'is-done');
      if (k < av) b.classList.add('is-done');
    });
    var atual = $$('#a-bars button')[av];
    if (atual) {
      void atual.offsetWidth;
      if (reduceMotion) atual.classList.add('is-done');
      else atual.classList.add('is-on');
      atual.setAttribute('aria-current', 'true');
      $$('#a-bars button').forEach(function (b, k) { if (k !== av) b.removeAttribute('aria-current'); });
    }
  }
  enterHooks.avaliacoes = function () {
    countUp($('#a-avg'), media, 1);
    mostrarAvaliacao(av, true);
  };

  /* =========================================================
     06 Contato
     ========================================================= */

  // pronta para ligar numa API (Supabase, e-mail etc.). Por enquanto só resolve.
  function enviarContato(dados) {
    return Promise.resolve({ ok: true, dados: dados });
  }

  (function contato() {
    var itens = [];
    if (cfg.telefone) itens.push({ ic: 'i-phone', txt: cfg.telefone, href: 'tel:+' + String(cfg.telefone).replace(/\D/g, '').replace(/^(?!55)/, '55') });
    if (cfg.email) itens.push({ ic: 'i-mail', txt: cfg.email, href: 'mailto:' + cfg.email });
    if (cfg.endereco) itens.push({ ic: 'i-pin', txt: cfg.endereco, href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg.endereco) });
    var ul = $('#k-list');
    ul.innerHTML = itens.map(function (it) {
      return '<li><a href="' + esc(it.href) + '"' + (it.ic === 'i-pin' ? ' target="_blank" rel="noopener"' : '') + '><span class="k-ico"><svg class="ic" aria-hidden="true"><use href="#' + it.ic + '"/></svg></span>' + esc(it.txt) + '</a></li>';
    }).join('');
    ul.hidden = !itens.length;

    var tel = $('#k-tel');
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 10) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      else if (d.length > 6) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      else if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      else if (d.length) out = '(' + d;
      tel.value = out;
    });

    var f = $('#contact-form');
    var erro = $('#k-error');
    var feito = $('#k-done');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var dados = {
        nome: f.nome.value.trim(),
        email: f.email.value.trim(),
        telefone: f.telefone.value.trim(),
        mensagem: f.mensagem.value.trim()
      };
      if (f.site.value) { mostrarObrigado(dados); return; } // robô: finge que enviou
      var msg = '';
      if (!dados.nome) msg = 'Conte para a gente o seu nome.';
      else if (!dados.email && dados.telefone.replace(/\D/g, '').length < 10) msg = 'Deixe um e-mail ou um telefone com DDD para respondermos.';
      else if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) msg = 'Confira o e-mail digitado.';
      if (msg) {
        erro.textContent = msg;
        erro.hidden = false;
        (dados.nome ? (dados.email ? f.email : f.telefone) : f.nome).focus();
        return;
      }
      erro.hidden = true;
      var btn = $('.k-send', f);
      btn.disabled = true;
      enviarContato(dados).then(function () {
        mostrarObrigado(dados);
      }).catch(function () {
        erro.textContent = 'Não foi possível enviar agora. Tente de novo ou chame no WhatsApp.';
        erro.hidden = false;
      }).then(function () { btn.disabled = false; });
    });
    function mostrarObrigado(dados) {
      var txt = 'Olá! Acabei de mandar uma mensagem pelo site.' +
        (dados.nome ? ' Sou ' + dados.nome + '.' : '') +
        (dados.mensagem ? ' Procuro: ' + dados.mensagem : '');
      $('#k-whats').href = waLink(txt);
      f.hidden = true;
      feito.hidden = false;
      feito.focus();
    }
    $('#k-again').addEventListener('click', function () {
      f.reset();
      feito.hidden = true;
      f.hidden = false;
      f.nome.focus();
    });

    var pol = $('#policy');
    $('#policy-text').textContent = cfg.privacidade || '';
    $('#open-policy').addEventListener('click', function () {
      if (typeof pol.showModal === 'function') pol.showModal(); else pol.setAttribute('open', '');
    });
  })();

  /* =========================================================
     Detalhe do imóvel
     ========================================================= */

  var detail = $('#detail');
  var detailSlug = null;
  var detailFoto = 0;
  var detailRetorno = null;

  function openDetail(slug) {
    var im = porSlug[slug];
    if (!im) return;
    if (layers.some(function (l) { return l.name === 'detail'; })) closeDetail(true);
    closeOthersFor('detail');
    detailSlug = slug;
    detailRetorno = document.activeElement;

    $('#d-place').textContent = local(im, { sep: ' · ' });
    $('#d-title').textContent = im.titulo;
    var partes = [];
    if (im.tipo === 'terreno' && im.area) partes.push(String(im.area).replace('.', ',') + ' m²');
    else if (im.suites) partes.push(im.suites + ' ' + plural(im.suites, 'suíte', 'suítes'));
    else if (im.quartos) partes.push(im.quartos + ' ' + plural(im.quartos, 'quarto', 'quartos'));
    partes.push(im.finalidade === 'aluguel' ? 'para alugar' : 'à venda');
    $('#d-kind').textContent = tipoLabel(im.tipo) + ' — ' + partes.join(' · ');
    $('#d-price').innerHTML = precoHTML(im);

    var ficha = [
      ['Área', im.area ? String(im.area).replace('.', ',') + ' m²' : ''],
      ['Quartos', im.quartos],
      ['Suítes', im.suites],
      ['Banheiros', im.banheiros],
      ['Vagas', im.vagas]
    ].filter(function (f) { return f[1] !== null && f[1] !== undefined && f[1] !== '' && f[1] !== 0; });
    $('#d-specs').innerHTML = ficha.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    $('#d-specs').hidden = !ficha.length;
    $('#d-desc').textContent = im.descricao || '';
    $('#d-desc').hidden = !im.descricao;
    $('#d-feats').innerHTML = im.caracteristicas.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    $('#d-feats').hidden = !im.caracteristicas.length;
    $('#d-badges').innerHTML = selosHTML(im);
    detail.classList.toggle('is-sold', vendido(im));

    var lugar = local(im, { uf: true });
    $('#d-whats').href = waLink('Olá! Tenho interesse no imóvel ' + im.titulo + (lugar ? ' (' + lugar + ')' : '') + ' — ' + preco(im) + '. Pode me passar mais informações?');
    var fav = $('#d-fav');
    fav.dataset.fav = slug;
    updateDetailCart();

    detailFoto = 0;
    $('#d-photo').innerHTML = photo(im.fotos[0] || '', im.titulo + ' — foto 1', false);
    $('#d-thumbs').innerHTML = im.fotos.map(function (src, i) {
      return '<button type="button" aria-label="Foto ' + (i + 1) + ' de ' + im.fotos.length + '"' + (i === 0 ? ' aria-current="true"' : '') + ' data-foto="' + i + '"><img src="' + esc(thumb(src)) + '" alt="" loading="lazy"></button>';
    }).join('');
    $('#d-thumbs').hidden = im.fotos.length < 2;
    syncFavs();

    detail.hidden = false;
    $('.d-info', detail).scrollTop = 0;
    detail.scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () { detail.classList.add('is-open'); }); });
    pushLayer('detail', closeDetail);
    refreshInert();
    setTimeout(function () { $('#d-back').focus({ preventScroll: true }); }, 50);
  }
  function trocarFoto(i) {
    var im = porSlug[detailSlug];
    if (!im || i === detailFoto || !im.fotos[i]) return;
    detailFoto = i;
    var box = $('#d-photo');
    var velho = $('.ph', box);
    box.insertAdjacentHTML('beforeend', photo(im.fotos[i], im.titulo + ' — foto ' + (i + 1), false));
    var novo = box.lastElementChild;
    if (!reduceMotion) {
      novo.classList.add('is-fading');
      requestAnimationFrame(function () { requestAnimationFrame(function () { novo.classList.remove('is-fading'); }); });
      setTimeout(function () { if (velho && velho.parentNode) velho.remove(); }, 650);
    } else if (velho) velho.remove();
    $$('#d-thumbs button').forEach(function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }
  function updateDetailCart() {
    var no = cart.indexOf(detailSlug) !== -1;
    var b = $('#d-cart');
    $('span', b).textContent = no ? 'No carrinho ✓' : 'Adicionar ao carrinho';
    b.setAttribute('aria-pressed', String(no));
  }
  function closeDetail(instant) {
    if (detail.hidden) return;
    popLayer('detail');
    detail.classList.remove('is-open');
    var fim = function () { detail.hidden = true; refreshInert(); };
    if (instant || reduceMotion) fim(); else setTimeout(fim, 850);
    detailSlug = null;
    refreshInert();
    if (!instant && detailRetorno && document.contains(detailRetorno)) detailRetorno.focus({ preventScroll: true });
  }
  $('#d-back').addEventListener('click', function () { closeDetail(); });
  $('#d-thumbs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-foto]');
    if (b) trocarFoto(Number(b.dataset.foto));
  });
  $('#d-cart').addEventListener('click', function () {
    if (cart.indexOf(detailSlug) === -1) addCart(detailSlug);
    else { abrirConta('cart'); }
  });

  // abrir detalhe, favoritar e adicionar ao carrinho em qualquer lugar
  document.addEventListener('click', function (e) {
    var fav = e.target.closest('[data-fav]');
    if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
    var add = e.target.closest('[data-cart]');
    if (add) { addCart(add.dataset.cart); return; }
    var open = e.target.closest('[data-open]');
    if (open && !e.target.closest('a[href]:not([data-open])')) { openDetail(open.dataset.open); }
  });

  /* =========================================================
     Menu (íris)
     ========================================================= */

  var menu = $('#menu');
  var btnMenu = $('#btn-menu');
  (function menuSetup() {
    var foot = [];
    foot.push('<span>© ' + new Date().getFullYear() + ' ' + esc(cfg.nome || '') + '</span>');
    if (cfg.email) foot.push('<a href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + '</a>');
    $('#menu-foot').innerHTML = foot.join('');
    $$('.menu-list li').forEach(function (li, i) { li.classList.add('rv-menu'); li.style.setProperty('--d', (.25 + i * .06) + 's'); });
    var prev = $('#menu-preview');
    $$('.menu-list button').forEach(function (b) {
      var show = function () { prev.textContent = b.dataset.preview || ''; };
      b.addEventListener('mouseenter', show);
      b.addEventListener('focus', show);
    });
  })();
  function abrirMenu() {
    closeAll();
    var r = btnMenu.getBoundingClientRect();
    menu.style.setProperty('--cx', (r.left + r.width / 2) + 'px');
    menu.style.setProperty('--cy', (r.top + r.height / 2) + 'px');
    $('#menu-preview').textContent = $$('.menu-list button')[Math.max(cur, 0)].dataset.preview || '';
    menu.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('is-open'); }); });
    btnMenu.setAttribute('aria-expanded', 'true');
    pushLayer('menu', fecharMenu);
    refreshInert();
    setTimeout(function () { $$('.menu-list button')[Math.max(cur, 0)].focus({ preventScroll: true }); }, 80);
  }
  function fecharMenu(instant) {
    if (menu.hidden) return;
    popLayer('menu');
    menu.classList.remove('is-open');
    btnMenu.setAttribute('aria-expanded', 'false');
    var fim = function () { menu.hidden = true; };
    if (instant || reduceMotion) fim(); else setTimeout(fim, 950);
    refreshInert();
    if (!instant) btnMenu.focus({ preventScroll: true });
  }
  btnMenu.addEventListener('click', abrirMenu);
  $('#menu-close').addEventListener('click', function () { fecharMenu(); });

  /* =========================================================
     Busca
     ========================================================= */

  var search = $('#search');
  var sInput = $('#search-input');
  var sCidade = '';
  function textoBusca(im) {
    return norm([im.titulo, tipoLabel(im.tipo), TIPOS[im.tipo] ? TIPOS[im.tipo].chip : '', im.bairro, cidadeOk(im.cidade) ? im.cidade : '', im.uf, im.caracteristicas.join(' '), im.selos.join(' '), im.descricao].join(' '));
  }
  imoveis.forEach(function (im) { im._busca = textoBusca(im); });
  function detalhes(im) {
    var d = [];
    if (im.tipo === 'terreno' && im.area) d.push(String(im.area).replace('.', ',') + ' m²');
    else {
      if (im.quartos) d.push(im.quartos + ' ' + plural(im.quartos, 'quarto', 'quartos'));
      if (im.area) d.push(String(im.area).replace('.', ',') + ' m²');
    }
    return d.join(' · ');
  }
  function renderBusca() {
    $('#search-cities').innerHTML = chipsHTML([{ v: '', l: 'Todas as cidades' }].concat(cidades.map(function (c) { return { v: c, l: c }; })), sCidade);
    var termos = norm(sInput.value).split(/\s+/).filter(Boolean);
    var res = imoveis.filter(function (im) {
      if (sCidade && im.cidade !== sCidade) return false;
      return termos.every(function (t) { return im._busca.indexOf(t) !== -1; });
    });
    $('#search-results').innerHTML = res.length ? res.map(function (im) {
      var linha = [cidadeOk(im.cidade) ? im.cidade : '', detalhes(im)].filter(Boolean).join(' · ');
      return '<li><button type="button" data-open="' + esc(im.slug) + '">' + miniThumb(im, true) +
        '<span class="sr-text"><strong>' + esc(im.titulo) + '</strong><span>' + esc(linha) + '</span></span>' +
        '<span class="sr-price">' + precoHTML(im) + '</span></button></li>';
    }).join('') : '<li class="sr-empty">Nenhum imóvel encontrado. Tente outra palavra.</li>';
  }
  function abrirBusca() {
    closeAll();
    search.hidden = false;
    requestAnimationFrame(function () { search.classList.add('is-open'); });
    renderBusca();
    pushLayer('search', fecharBusca);
    refreshInert();
    setTimeout(function () { sInput.focus(); }, 30);
  }
  function fecharBusca(instant) {
    if (search.hidden) return;
    popLayer('search');
    search.classList.remove('is-open');
    var fim = function () { search.hidden = true; };
    if (instant || reduceMotion) fim(); else setTimeout(fim, 350);
    refreshInert();
    if (!instant) $('#btn-search').focus({ preventScroll: true });
  }
  $('#btn-search').addEventListener('click', abrirBusca);
  $('#search-close').addEventListener('click', function () { fecharBusca(); });
  search.addEventListener('click', function (e) {
    if (e.target === search) { fecharBusca(); return; }
    var chip = e.target.closest('#search-cities .chip');
    if (chip) { sCidade = chip.dataset.v; renderBusca(); }
  });
  sInput.addEventListener('input', renderBusca);
  sInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var first = $('#search-results [data-open]');
      if (first) openDetail(first.dataset.open);
    }
  });

  /* =========================================================
     Conta: favoritos, carrinho e conta
     ========================================================= */

  var drawer = $('#drawer');
  var scrim = $('#scrim');
  var drawerOpen = false;
  var aba = 'fav';
  function itemHTML(im, acao) {
    return '<li class="d-item">' + miniThumb(im) +
      '<div class="d-item-text"><button type="button" data-open="' + esc(im.slug) + '">' + esc(im.titulo) + '</button>' +
      '<span>' + esc(local(im, { sep: ' · ' })) + '</span><b>' + precoHTML(im) + '</b></div>' +
      acao + '</li>';
  }
  function renderDrawer() {
    var pf = $('#panel-fav'), pc = $('#panel-cart');
    var lf = favs.map(function (s) { return porSlug[s]; }).filter(Boolean);
    pf.innerHTML = lf.length
      ? '<ul class="d-list">' + lf.map(function (im) {
          return itemHTML(im, '<button type="button" class="round heart" data-fav="' + esc(im.slug) + '" aria-pressed="true"><svg class="ic" aria-hidden="true"><use href="#i-heart"/></svg></button>');
        }).join('') + '</ul>'
      : '<div class="empty-note"><svg class="ic" aria-hidden="true"><use href="#i-heart"/></svg><p>Toque no coração de um imóvel para guardar aqui.</p></div>';
    var lc = cart.map(function (s) { return porSlug[s]; }).filter(Boolean);
    if (lc.length) {
      var msg = 'Olá! Quero seguir com estes itens que separei no site:\n' + lc.map(function (im, i) {
        return (i + 1) + '. ' + im.titulo + ' — ' + (local(im, { uf: true }) || 'local a combinar') + ' — ' + preco(im);
      }).join('\n');
      pc.innerHTML = '<ul class="d-list">' + lc.map(function (im) {
          return itemHTML(im, '<button type="button" class="round" data-remove="' + esc(im.slug) + '" aria-label="Remover do carrinho: ' + esc(im.titulo) + '"><svg class="ic" aria-hidden="true"><use href="#i-close"/></svg></button>');
        }).join('') + '</ul>' +
        '<p class="drawer-total"><span>' + lc.length + ' ' + plural(lc.length, 'item', 'itens') + '</span></p>' +
        '<a class="btn btn-whats" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-whatsapp"/></svg> Enviar pelo WhatsApp</a>';
    } else {
      pc.innerHTML = '<div class="empty-note"><svg class="ic" aria-hidden="true"><use href="#i-cart"/></svg><p>Seu carrinho está vazio. Use o botão + dos imóveis para separar os que interessam.</p></div>';
    }
    syncFavsSilencioso();
  }
  function syncFavsSilencioso() {
    $$('#drawer [data-fav]').forEach(function (b) {
      var on = isFav(b.dataset.fav);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', (on ? 'Remover dos favoritos: ' : 'Favoritar: ') + porSlug[b.dataset.fav].titulo);
    });
  }
  function selecionarAba(nome, foco) {
    aba = nome;
    [['fav', 'tab-fav', 'panel-fav'], ['cart', 'tab-cart', 'panel-cart'], ['conta', 'tab-conta', 'panel-conta']].forEach(function (t) {
      var on = t[0] === nome;
      var tab = $('#' + t[1]);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      $('#' + t[2]).hidden = !on;
      if (on && foco) tab.focus();
    });
  }
  function abrirConta(nome) {
    closeAll();
    drawerOpen = true;
    renderDrawer();
    selecionarAba(nome || aba);
    drawer.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { drawer.classList.add('is-open'); scrim.classList.add('is-open'); }); });
    pushLayer('drawer', fecharConta);
    refreshInert();
    setTimeout(function () { $('#tab-' + aba).focus({ preventScroll: true }); }, 60);
  }
  function fecharConta(instant) {
    if (drawer.hidden) return;
    popLayer('drawer');
    drawerOpen = false;
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-open');
    var fim = function () { drawer.hidden = true; scrim.hidden = true; };
    if (instant || reduceMotion) fim(); else setTimeout(fim, 600);
    refreshInert();
    if (!instant) $('#btn-account').focus({ preventScroll: true });
  }
  $('#btn-account').addEventListener('click', function () { abrirConta(); });
  $('#drawer-close').addEventListener('click', function () { fecharConta(); });
  scrim.addEventListener('click', function () { fecharConta(); });
  $('.tabs').addEventListener('click', function (e) {
    var t = e.target.closest('[role="tab"]');
    if (t) selecionarAba(t.id.replace('tab-', ''));
  });
  $('.tabs').addEventListener('keydown', function (e) {
    var ordem = ['fav', 'cart', 'conta'];
    var i = ordem.indexOf(aba);
    if (e.key === 'ArrowRight') { e.preventDefault(); selecionarAba(ordem[(i + 1) % 3], true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); selecionarAba(ordem[(i + 2) % 3], true); }
  });
  drawer.addEventListener('click', function (e) {
    var r = e.target.closest('[data-remove]');
    if (r) removeCart(r.dataset.remove);
  });

  // ao abrir uma camada a partir de outra (ex.: busca -> detalhe), fecha as de baixo
  function closeOthersFor(nome) {
    layers.slice().forEach(function (l) { if (l.name !== nome) l.close(true); });
  }

  // foco preso dentro da camada aberta
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !anyLayer()) return;
    var topo = layers[layers.length - 1].name;
    var el = { detail: detail, menu: menu, search: search, drawer: drawer }[topo];
    if (!el) return;
    var foc = $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', el).filter(function (x) {
      return x.offsetParent !== null && !x.closest('[hidden]');
    });
    if (!foc.length) return;
    var first = foc[0], last = foc[foc.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* =========================================================
     Início
     ========================================================= */

  scenes.forEach(function (s) { s.inert = true; s.setAttribute('aria-hidden', 'true'); });
  renderFiltro();
  renderCuradoria(true);
  syncFavs();
  var inicial = ids.indexOf(location.hash.slice(1));
  go(inicial === -1 ? 0 : inicial, { instant: true, fromHash: true });
});
