/* =========================================================================
   MUNDO SOLAR — Meta Pixel (ID do conjunto de dados: 1488152875517253)

   Toda a medição da Meta fica neste arquivo:
   - PageView: uma vez por página carregada. Âncoras (#kits, #contato…) não contam
     como nova página. Se no futuro o site usar navegação SPA (history.pushState),
     cada troca real de endereço gera um PageView, sem repetir o mesmo endereço.
   - Lead (cliques): qualquer link que leve ao WhatsApp (wa.me / api.whatsapp.com)
     ou ao e-mail (mailto:), decidido pelo destino do link no momento do clique.
     Links que só abrem o formulário de orçamento NÃO contam no clique.
   - Lead (formulário): disparado pelo main.js somente após o envio bem-sucedido,
     através do evento "mundosolar:lead".
   - Duplicidade: o mesmo contato dentro de 2 s é contado uma vez (duplo clique,
     toque duplo); cada Lead leva um eventID único.
   - Consentimento (LGPD): o Pixel só é carregado depois que o visitante clica em
     "Aceitar" no aviso de cookies (assets/js/cookies.js). Sem aceite, nada é
     enviado à Meta. Se o visitante recusar depois, os envios param na hora.
   ========================================================================= */
(function () {
  'use strict';

  var PIXEL_ID = '1488152875517253';
  var DEDUPE_MS = 2000;
  var CONSENT_KEY = 'ms-cookie-consent'; // 'granted' | 'denied' (gravado por cookies.js)

  if (window.MundoSolarPixel) return; // nunca inicializar duas vezes

  var loaded = false;
  var enabled = false;

  function storedConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (err) { return null; }
  }

  /* ---------- Código base oficial da Meta (carregado só com consentimento) ---------- */
  function loadPixel() {
    if (loaded) return;
    loaded = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL_ID);
  }

  var fbq = function () { if (enabled && window.fbq) window.fbq.apply(window, arguments); };

  /* ---------- PageView ---------- */
  var lastPage = null;
  var pageKey = function () { return location.pathname + location.search; }; // o # é âncora na mesma página

  function trackPageView() {
    if (!enabled) return;
    var key = pageKey();
    if (key === lastPage) return;
    lastPage = key;
    fbq('track', 'PageView');
  }

  function grant() {
    if (enabled) return;
    var wasLoaded = loaded;
    loadPixel();
    if (wasLoaded) window.fbq('consent', 'grant'); // voltou a aceitar na mesma visita
    enabled = true;
    trackPageView(); // PageView da página atual (uma vez)
  }

  function revoke() {
    if (loaded && window.fbq) window.fbq('consent', 'revoke');
    enabled = false;
  }

  if (storedConsent() === 'granted') grant();
  document.addEventListener('mundosolar:consent', function (e) {
    if (e && e.detail && e.detail.granted) grant(); else revoke();
  });

  // Navegação SPA (se existir): pushState cria uma nova "página"; replaceState não.
  if (window.history && typeof history.pushState === 'function') {
    var pushState = history.pushState;
    history.pushState = function () {
      var result = pushState.apply(this, arguments);
      trackPageView();
      return result;
    };
    window.addEventListener('popstate', trackPageView);
  }

  /* ---------- Lead ---------- */
  var recent = {};

  function lead(params, dedupeKey) {
    if (!enabled) return false;
    var now = Date.now();
    var key = dedupeKey || JSON.stringify(params);
    if (recent[key] && now - recent[key] < DEDUPE_MS) return false;
    recent[key] = now;
    var eventID = 'lead.' + now.toString(36) + '.' + Math.random().toString(36).slice(2, 8);
    fbq('track', 'Lead', params, { eventID: eventID });
    return true;
  }

  // Canal de contato pelo destino do link (null = não é contato).
  function channelOf(a) {
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return null; }
    if (url.protocol === 'mailto:') return 'E-mail';
    if (url.protocol === 'whatsapp:') return 'WhatsApp';
    var host = url.hostname.replace(/^www\./, '');
    if (host === 'wa.me' || host === 'api.whatsapp.com' || host === 'web.whatsapp.com') return 'WhatsApp';
    return null;
  }

  var text = function (root, sel) {
    var el = root && root.querySelector(sel);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  };

  // O que o visitante pediu (kit, projeto, pesquisa…).
  function describe(a, channel) {
    var kit = a.closest('[data-kit]');
    if (kit) return 'Kit ' + text(kit, '[data-f="kwh"]') + ' kWh/mês' + (text(kit, '[data-f="tag"]') ? ' ' + text(kit, '[data-f="tag"]') : '');
    if (a.matches('[data-kf-cta]')) {
      var feature = document.querySelector('[data-kit-feature]');
      var tag = feature && feature.querySelector('[data-kf="tag"]');
      return 'Kit ' + text(feature, '[data-kf="kwh"]') + ' kWh/mês' + (tag && !tag.hidden && tag.textContent ? ' ' + tag.textContent.trim() : '');
    }
    if (a.matches('[data-search-wa]')) return 'Pesquisa — ' + text(document, '[data-search-action-text]').split('·')[0].trim();
    if (a.matches('[data-search-notice-wa]')) return 'Pesquisa — ' + text(document, '[data-search-notice-title]');
    var project = a.closest('[data-case]');
    if (project) return 'Projeto ' + project.getAttribute('data-case');
    return channel === 'E-mail' ? 'Contato por e-mail' : 'Contato pelo WhatsApp';
  }

  // Onde está o botão.
  function sourceOf(a) {
    if (a.closest('.wa-float')) return 'botao-flutuante';
    if (a.closest('[data-search]')) return 'pesquisa';
    if (a.closest('.site-header')) return 'cabecalho';
    if (a.closest('.mobile-menu')) return 'menu-mobile';
    if (a.closest('.site-footer')) return 'rodape';
    var section = a.closest('section[id], [id="alto-padrao"]');
    return section ? section.id : 'pagina';
  }

  function onContactClick(e) {
    if (e.type === 'auxclick' && e.button !== 1) return; // só o clique do meio (abrir em nova aba)
    try {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var channel = channelOf(a);
      if (!channel) return;
      var params = {
        content_name: describe(a, channel),
        content_category: channel,
        lead_source: sourceOf(a),
      };
      var search = a.closest('[data-search]') && document.querySelector('[data-search-input]');
      if (search && search.value.trim()) params.search_term = search.value.trim();
      lead(params, channel + '|' + a.href);
    } catch (err) {
      /* a medição nunca pode impedir o contato */
    }
  }

  // Captura: roda antes de qualquer outro handler e não altera o clique.
  document.addEventListener('click', onContactClick, true);
  document.addEventListener('auxclick', onContactClick, true);

  // Formulário de orçamento: o main.js avisa somente após o envio bem-sucedido.
  document.addEventListener('mundosolar:lead', function (e) {
    var d = (e && e.detail) || {};
    lead({
      content_name: d.content_name || 'Formulário de orçamento',
      content_category: 'Formulário de orçamento',
      lead_source: d.lead_source || 'formulario-orcamento',
      lead_channel: d.lead_channel || '',
    }, 'form|' + (d.dedupe || ''));
  });

  window.MundoSolarPixel = {
    id: PIXEL_ID, lead: lead, trackPageView: trackPageView,
    isEnabled: function () { return enabled; },
  };
})();
