(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Cabeçalho ---------- */
  var header = $('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = $('.menu-toggle');
  var nav = $('#menu');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $$('.nav__link').forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Link ativo conforme a seção ---------- */
  var links = $$('.nav__link');
  var sectionFor = { busca: 'imoveis' };
  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = sectionFor[entry.target.id] || entry.target.id;
        links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id], footer[id]').forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Animações de entrada ---------- */
  var revealEls = $$('[data-reveal]');
  $$('.cards, .perks').forEach(function (group) {
    $$('[data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--delay', (i * 0.1) + 's'); });
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Imóveis em destaque no hero ---------- */
  var cards = $$('#cards .card');
  var featured = $('.featured');
  var current = $('.hero__count--current');
  var total = $('.hero__count--total');
  var fill = $('.hero__bar-fill');
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  var slides = cards.map(function (card) {
    var specs = $$('.card__specs li', card).map(function (li) { return li.textContent.trim(); });
    return {
      img: $('img', card).getAttribute('src'),
      title: $('.card__title', card).textContent.trim(),
      meta: [$('.card__place', card).textContent.trim()].concat(specs.slice(0, 2)).join(' · ')
    };
  });

  var slide = 0;
  function showSlide(i) {
    slide = (i + slides.length) % slides.length;
    var s = slides[slide];
    featured.classList.add('is-swapping');
    setTimeout(function () {
      $('.featured__img', featured).src = s.img;
      $('.featured__title', featured).textContent = s.title;
      $('.featured__meta', featured).textContent = s.meta;
      featured.classList.remove('is-swapping');
    }, reduceMotion ? 0 : 300);
    current.textContent = pad(slide + 1);
    fill.style.height = ((slide + 1) / slides.length * 100) + '%';
  }

  if (slides.length) {
    total.textContent = pad(slides.length);
    fill.style.height = (100 / slides.length) + '%';
    var timer = null;
    var start = function () { if (!reduceMotion && !timer) timer = setInterval(function () { showSlide(slide + 1); }, 5000); };
    var stop = function () { clearInterval(timer); timer = null; };
    featured.addEventListener('mouseenter', stop);
    featured.addEventListener('mouseleave', start);
    featured.addEventListener('focus', stop);
    featured.addEventListener('blur', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
  }

  /* ---------- Favoritos ---------- */
  var FAV_KEY = 'nf-favoritos';
  var favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { favs = []; }

  $$('.fav').forEach(function (btn) {
    var id = btn.getAttribute('data-id');
    var label = btn.getAttribute('aria-label');
    function render() {
      var on = favs.indexOf(id) !== -1;
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? label.replace('Favoritar', 'Remover dos favoritos:') : label);
    }
    render();
    btn.addEventListener('click', function () {
      var i = favs.indexOf(id);
      if (i === -1) favs.push(id); else favs.splice(i, 1);
      try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* armazenamento indisponível */ }
      render();
    });
  });

  /* ---------- Busca de imóveis ---------- */
  var form = $('#search-form');
  var results = $('#results');
  var resultsText = $('#results-text');
  var empty = $('#empty');

  function normalize(str) {
    return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function applyFilters() {
    var q = normalize(form.q.value).trim();
    var tipo = form.tipo.value;
    var cidade = form.cidade.value;
    var faixa = form.preco.value.split('-');
    var min = faixa[0] ? Number(faixa[0]) : 0;
    var max = faixa[1] ? Number(faixa[1]) : Infinity;
    var words = q ? q.split(/\s+/) : [];
    var active = Boolean(q || tipo || cidade || form.preco.value);
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.dataset.busca + ' ' + card.textContent);
      var preco = Number(card.dataset.preco);
      var ok = (!tipo || card.dataset.tipo === tipo) &&
               (!cidade || card.dataset.cidade === cidade) &&
               preco >= min && preco <= max &&
               words.every(function (w) { return haystack.indexOf(w) !== -1; });
      card.hidden = !ok;
      if (ok) { shown++; card.classList.add('is-visible'); }
    });

    results.hidden = !active;
    resultsText.textContent = shown === 1 ? '1 imóvel encontrado' : shown + ' imóveis encontrados';
    empty.hidden = shown !== 0;
  }

  function clearFilters() {
    form.reset();
    applyFilters();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    applyFilters();
    $('#imoveis').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  $$('select', form).forEach(function (sel) { sel.addEventListener('change', applyFilters); });
  form.q.addEventListener('search', applyFilters);
  $('#results-clear').addEventListener('click', clearFilters);
  $('#empty-clear').addEventListener('click', clearFilters);

  /* ---------- Depoimentos ---------- */
  var reviews = $$('.review');
  var rev = 0;
  function showReview(i) {
    reviews[rev].hidden = true;
    reviews[rev].classList.remove('is-active');
    rev = (i + reviews.length) % reviews.length;
    reviews[rev].hidden = false;
    reviews[rev].classList.add('is-active');
  }
  $('#rev-prev').addEventListener('click', function () { showReview(rev - 1); });
  $('#rev-next').addEventListener('click', function () { showReview(rev + 1); });

  /* ---------- Ano no rodapé ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
