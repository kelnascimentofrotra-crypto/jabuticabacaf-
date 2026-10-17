/* =========================================================================
   MUNDO SOLAR — Aviso de cookies (LGPD)

   - Mostra o aviso enquanto o visitante não escolher "Aceitar" ou "Recusar".
   - Guarda a escolha neste navegador (localStorage "ms-cookie-consent").
   - Avisa o Meta Pixel (assets/js/meta-pixel.js) pelo evento "mundosolar:consent".
   - Qualquer elemento com [data-cookie-settings] reabre o aviso para mudar a escolha.
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'ms-cookie-consent';
  var root = document.documentElement;
  var banner = null;

  function read() {
    try { return localStorage.getItem(KEY); } catch (err) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (err) { /* modo privado: vale só nesta visita */ }
  }

  function build() {
    var privacyHref = document.querySelector('[data-privacy-page]') ? '#conteudo' : 'privacidade.html';
    banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<div class="cookie-banner__text">' +
        '<p class="cookie-banner__title">Sua privacidade</p>' +
        '<p>Usamos cookies e o Pixel da Meta para medir as visitas e melhorar nossos anúncios. ' +
        'Eles só são ativados se você aceitar. <a href="' + privacyHref + '">Política de privacidade</a></p>' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn--ghost btn--sm" type="button" data-cookie-choice="denied">Recusar</button>' +
        '<button class="btn btn--primary btn--sm" type="button" data-cookie-choice="granted">Aceitar</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie-choice]');
      if (btn) choose(btn.getAttribute('data-cookie-choice'));
    });
    document.body.appendChild(banner);
  }

  function show() {
    if (!banner) build();
    banner.hidden = false;
    root.classList.add('has-cookie-banner');
    root.style.setProperty('--cookie-h', banner.offsetHeight + 'px');
  }

  function hide() {
    if (banner) banner.hidden = true;
    root.classList.remove('has-cookie-banner');
  }

  function choose(value) {
    var granted = value === 'granted';
    save(granted ? 'granted' : 'denied');
    hide();
    document.dispatchEvent(new CustomEvent('mundosolar:consent', { detail: { granted: granted } }));
  }

  function init() {
    if (read() !== 'granted' && read() !== 'denied') show();
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (!trigger) return;
      e.preventDefault();
      show();
      var focusBtn = banner.querySelector('[data-cookie-choice="granted"]');
      if (focusBtn) focusBtn.focus();
    });
    window.addEventListener('resize', function () {
      if (banner && !banner.hidden) root.style.setProperty('--cookie-h', banner.offsetHeight + 'px');
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
