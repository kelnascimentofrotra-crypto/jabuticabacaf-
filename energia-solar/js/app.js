/* Energia Solar — comportamento do site.
   Script clássico (sem módulos) para funcionar também aberto direto do disco. */
(function () {
  'use strict';

  var root = document.documentElement;
  var data = JSON.parse(document.getElementById('site-data').textContent);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 1100px)');
  var isDev =
    location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname) ||
    /\.local$/.test(location.hostname);

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var fill = function (tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, function (m, k) {
      return k in vars ? vars[k] : m;
    });
  };
  var normalize = function (text) {
    return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };
  var pad = function (n) {
    return String(n).padStart(2, '0');
  };
  var afterTransition = function (el, fallbackMs, done) {
    if (reduceMotion.matches) return done();
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      el.removeEventListener('transitionend', onEnd);
      done();
    };
    var onEnd = function (ev) {
      if (ev.target === el) finish();
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, fallbackMs);
  };
  var scrollBehavior = function () {
    return reduceMotion.matches ? 'auto' : 'smooth';
  };

  /* Estado compartilhado entre painéis */
  var state = { tipo: 'residencial' };

  /* ------------------------------------------------------------------ */
  /* WhatsApp                                                           */
  /* ------------------------------------------------------------------ */

  function waMessage(key, tipo) {
    return fill(data.messages[key] || data.messages.geral, { tipo: tipo || state.tipo });
  }

  function waHref(message) {
    return 'https://wa.me/' + data.wa + '?text=' + encodeURIComponent(message);
  }

  var waDialog = $('#wa-dialog');
  var toast = $('.toast');
  var toastTimer;

  function showToast(text) {
    toast.textContent = text;
    clearTimeout(toastTimer);
    requestAnimationFrame(function () {
      toast.classList.add('is-on');
    });
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-on');
      setTimeout(function () {
        if (!toast.classList.contains('is-on')) toast.textContent = '';
      }, 450);
    }, 2600);
  }

  /** Abre o WhatsApp com a mensagem, ou o aviso honesto se não há número. */
  function openWhatsapp(message, trigger, link) {
    if (data.wa) {
      if (link) {
        link.href = waHref(message);
        return true; // segue o link nativo
      }
      window.open(waHref(message), '_blank', 'noopener');
      return false;
    }
    $('[data-wa-msg]', waDialog).textContent = message;
    $('[data-dev-only]', waDialog).hidden = !isDev;
    openDialog(waDialog, trigger);
    return false;
  }

  $('[data-copy]', waDialog).addEventListener('click', function () {
    var text = $('[data-wa-msg]', waDialog).textContent;
    var ok = function () {
      showToast('Mensagem copiada.');
    };
    var fail = function () {
      var range = document.createRange();
      range.selectNodeContents($('[data-wa-msg]', waDialog));
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      showToast('Não foi possível copiar automaticamente. A mensagem está selecionada.');
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, fail);
    } else {
      fail();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Diálogos (gavetas, aviso e menu)                                   */
  /* ------------------------------------------------------------------ */

  var triggers = new WeakMap();

  function openDialog(dialog, trigger, onOpened) {
    if (dialog.open) return;
    triggers.set(dialog, trigger || document.activeElement);
    dialog.classList.remove('is-closing');
    dialog.showModal();
    if (trigger && trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dialog.classList.add('is-open');
        if (onOpened) onOpened();
      });
    });
  }

  function closeDialog(dialog, opts) {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    opts = opts || {};
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    var panel = dialog.firstElementChild;
    afterTransition(panel, 520, function () {
      dialog.classList.remove('is-closing');
      dialog.dataset.skipFocus = opts.skipFocus ? '1' : '';
      dialog.close();
    });
  }

  $$('dialog').forEach(function (dialog) {
    // Escape: fecha com a mesma animação
    dialog.addEventListener('cancel', function (ev) {
      ev.preventDefault();
      closeDialog(dialog);
    });
    // clique fora do painel
    dialog.addEventListener('click', function (ev) {
      if (ev.target === dialog) closeDialog(dialog);
    });
    $$('[data-close]', dialog).forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeDialog(dialog);
      });
    });
    dialog.addEventListener('close', function () {
      var trigger = triggers.get(dialog);
      if (trigger && trigger.hasAttribute && trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', 'false');
      }
      if (dialog === deckDialog) restoreDeck();
      if (dialog.dataset.skipFocus !== '1' && trigger && document.contains(trigger) && trigger.focus) {
        trigger.focus({ preventScroll: true });
      }
      dialog.dataset.skipFocus = '';
    });
  });

  /* ------------------------------------------------------------------ */
  /* Painéis das seções: gaveta no desktop, bloco nativo no celular      */
  /* ------------------------------------------------------------------ */

  var deckDialog = $('#deck-dialog');
  var deckBody = $('[data-deck-body]', deckDialog);
  var deckHome = null;

  function restoreDeck() {
    var deck = deckBody.firstElementChild;
    if (deck && deckHome) deckHome.appendChild(deck);
    deckHome = null;
  }

  function replay(el) {
    // Reapresenta a entrada escalonada quando o painel abre na gaveta.
    $$('[data-stagger], [data-reveal]', el).forEach(function (node) {
      node.classList.remove('is-in');
    });
    void el.offsetWidth;
    requestAnimationFrame(function () {
      $$('[data-stagger], [data-reveal]', el).forEach(function (node) {
        node.classList.add('is-in');
      });
    });
  }

  function openDeck(name, item, trigger) {
    var deck = document.getElementById('deck-' + name);
    if (!deck) return;

    if (desktop.matches) {
      deckHome = deck.parentElement;
      $('[data-deck-kicker]', deckDialog).textContent = deck.dataset.kicker || '';
      $('[data-deck-title]', deckDialog).textContent = deck.dataset.title || '';
      deckBody.scrollTop = 0;
      deckBody.appendChild(deck);
      replay(deck);
      openDialog(deckDialog, trigger, function () {
        layoutDeck(deck);
        if (item) applyItem(name, deck, item, true);
        else $('[data-deck-title]', deckDialog).focus({ preventScroll: true });
      });
      layoutDeck(deck);
      return;
    }

    // celular e tablet: leva ao painel nativo da própria seção
    var target = deck.closest('.scene__native') || deck;
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    applyItem(name, deck, item, false);
  }

  function layoutDeck(deck) {
    if (deck.id === 'deck-solucoes') placeSolIndicator(false);
    if (deck.id === 'deck-projetos') placeTabPill(false);
  }

  function applyItem(name, deck, item, afterOpen) {
    if (name === 'solucoes') {
      var radio = item ? $('input[value="' + item + '"]', deck) : $('input:checked', deck);
      if (radio) {
        if (item && !radio.checked) {
          radio.checked = true;
          onSolutionChange();
        }
        radio.focus({ preventScroll: !desktop.matches });
      }
    } else if (name === 'como-funciona') {
      var step = item ? $('#etapa-' + item, deck) : null;
      if (step) {
        step.classList.remove('is-focus');
        void step.offsetWidth;
        step.classList.add('is-focus');
        if (afterOpen) step.scrollIntoView({ block: 'nearest', behavior: scrollBehavior() });
      }
      if (step && !desktop.matches) {
        step.setAttribute('tabindex', '-1');
        step.focus({ preventScroll: true });
      }
    } else if (name === 'projetos') {
      var tab = item ? $('#tab-' + item, deck) : $('[aria-selected="true"]', deck);
      if (tab) {
        selectTab(tab);
        tab.focus({ preventScroll: true });
      }
    } else if (name === 'duvidas') {
      if (item === 'busca' || !item) {
        $('#faq-busca').focus({ preventScroll: !desktop.matches || !afterOpen });
      } else {
        var btn = $('#faq-b-' + item, deck);
        if (btn) {
          clearSearch(false);
          setFaq(btn.closest('.faq-item'), true);
          btn.focus({ preventScroll: true });
          if (afterOpen) btn.scrollIntoView({ block: 'nearest', behavior: scrollBehavior() });
        }
      }
    }
  }

  desktop.addEventListener('change', function () {
    if (deckDialog.open) closeDialog(deckDialog, { skipFocus: true });
  });

  /* ------------------------------------------------------------------ */
  /* Delegação de cliques                                               */
  /* ------------------------------------------------------------------ */

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-action], [data-wa]');
    if (!el) return;

    if (el.hasAttribute('data-wa')) {
      var key = el.getAttribute('data-wa');
      var tipo = el.getAttribute('data-wa-tipo') || '';
      var msg = waMessage(key, tipo);
      if (!openWhatsapp(msg, el, el.tagName === 'A' ? el : null)) ev.preventDefault();
      return;
    }

    var action = el.getAttribute('data-action');
    if (action === 'analise') {
      ev.preventDefault();
      var origin = el;
      if (menuDialog.open) {
        // depois de fechar, o foco volta para quem abriu o menu
        origin = triggers.get(menuDialog) || el;
        closeDialog(menuDialog, { skipFocus: true });
      }
      openAnalysis(origin);
    } else if (action === 'deck') {
      ev.preventDefault();
      openDeck(el.getAttribute('data-deck'), el.getAttribute('data-item'), el);
    } else if (action === 'menu') {
      ev.preventDefault();
      openDialog(menuDialog, el);
    }
  });

  /* Ações que abrem diálogos passam a ser anunciadas como botões */
  $$('a[data-action]').forEach(function (a) {
    a.setAttribute('role', 'button');
  });

  /* ------------------------------------------------------------------ */
  /* Soluções                                                           */
  /* ------------------------------------------------------------------ */

  var solDeck = $('#deck-solucoes');
  var solIndicator = solDeck && $('.sol__indicator', solDeck);

  function placeSolIndicator(animate) {
    if (!solDeck) return;
    var opt = $('.sol__opt.is-checked', solDeck);
    if (!opt || !opt.offsetHeight) return;
    if (animate === false) solIndicator.style.transition = 'none';
    solIndicator.style.setProperty('--sy', opt.offsetTop + 'px');
    solIndicator.style.setProperty('--sh', opt.offsetHeight + 'px');
    if (animate === false) {
      void solIndicator.offsetWidth;
      solIndicator.style.transition = '';
    }
  }

  function swapText(el, text) {
    if (el.textContent === text) return;
    if (reduceMotion.matches) {
      el.textContent = text;
      return;
    }
    el.classList.add('is-swapping');
    setTimeout(function () {
      el.textContent = text;
      el.classList.remove('is-swapping');
    }, 170);
  }

  function onSolutionChange() {
    var checked = $('input:checked', solDeck);
    if (!checked) return;
    state.tipo = checked.value;
    $$('.sol__opt', solDeck).forEach(function (opt) {
      opt.classList.toggle('is-checked', opt.contains(checked));
    });
    placeSolIndicator(true);
    swapText($('[data-msg="solucao"]', solDeck), waMessage('solucao', state.tipo));
    var cta = $('[data-sol-cta]', solDeck);
    cta.setAttribute('data-wa-tipo', state.tipo);
    if (data.wa) cta.href = waHref(waMessage('solucao', state.tipo));
  }

  if (solDeck) {
    solDeck.addEventListener('change', onSolutionChange);
    window.addEventListener('resize', function () {
      placeSolIndicator(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Projetos: abas e vitrine                                           */
  /* ------------------------------------------------------------------ */

  var projDeck = $('#deck-projetos');
  var tabs = projDeck ? $$('[role="tab"]', projDeck) : [];
  var tabPill = projDeck && $('.tabs__pill', projDeck);

  function placeTabPill(animate) {
    var tab = tabs.filter(function (t) {
      return t.getAttribute('aria-selected') === 'true';
    })[0];
    if (!tab || !tab.offsetWidth) return;
    if (animate === false) tabPill.style.transition = 'none';
    tabPill.style.setProperty('--tx', tab.offsetLeft + 'px');
    tabPill.style.setProperty('--tw', tab.offsetWidth + 'px');
    if (animate === false) {
      void tabPill.offsetWidth;
      tabPill.style.transition = '';
    }
  }

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
    });
    placeTabPill(true);
    var tipo = tab.getAttribute('data-tipo');
    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    var hasProjects = panel.getAttribute('data-has-projects') === 'true';
    var cta = $('[data-proj-cta]', projDeck);
    var key = hasProjects ? 'projeto' : 'solucao';
    cta.setAttribute('data-wa', key);
    cta.setAttribute('data-wa-tipo', tipo);
    $('.btn__label', cta).textContent = hasProjects ? 'Quero um projeto assim' : 'Conversar sobre um projeto ' + tipo;
    if (data.wa) cta.href = waHref(waMessage(key, tipo));
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      selectTab(tab);
    });
    tab.addEventListener('keydown', function (ev) {
      var next = null;
      if (ev.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (ev.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (ev.key === 'Home') next = tabs[0];
      else if (ev.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        ev.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
  });
  if (projDeck) {
    window.addEventListener('resize', function () {
      placeTabPill(false);
    });
  }

  // Vitrine: contagem derivada da lista; setas só funcionam com 2+ itens.
  $$('.carousel').forEach(function (car) {
    var items = $$('.proj', car);
    var total = items.length;
    var index = 0;
    var bar = $('.carousel__bar', car);
    var show = function (n) {
      index = (n + total) % total;
      items.forEach(function (item, j) {
        var on = j === index;
        item.hidden = !on;
        item.classList.toggle('is-current', on);
        if (on) {
          item.classList.remove('is-entering');
          void item.offsetWidth;
          item.classList.add('is-entering');
        }
      });
      $('[data-index]', car).textContent = pad(index + 1);
      bar.style.setProperty('--n', index + 1);
    };
    if (total > 1) {
      $('[data-prev]', car).addEventListener('click', function () {
        show(index - 1);
      });
      $('[data-next]', car).addEventListener('click', function () {
        show(index + 1);
      });
      // setas do teclado apenas com o foco dentro da vitrine
      car.addEventListener('keydown', function (ev) {
        if (ev.target.matches('input, textarea')) return;
        if (ev.key === 'ArrowLeft') show(index - 1);
        if (ev.key === 'ArrowRight') show(index + 1);
      });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Dúvidas: acordeão e busca                                          */
  /* ------------------------------------------------------------------ */

  var faqDeck = $('#deck-duvidas');
  var faqItems = faqDeck ? $$('.faq-item', faqDeck) : [];
  var faqInput = $('#faq-busca');
  var faqClear = faqDeck && $('.faq-search__clear', faqDeck);
  var faqStatus = $('#faq-status');
  var faqEmpty = faqDeck && $('.faq-empty', faqDeck);

  function setFaq(item, open) {
    var btn = $('.faq-q button', item);
    var panel = $('.faq-a', item);
    if (open === item.classList.contains('is-open') && panel.hidden === !open) return;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.hidden = false;
      void panel.offsetHeight;
      item.classList.add('is-open');
    } else {
      item.classList.remove('is-open');
      afterTransition(panel, 450, function () {
        if (!item.classList.contains('is-open')) panel.hidden = true;
      });
    }
  }

  faqItems.forEach(function (item) {
    var open = item.classList.contains('is-open');
    $('.faq-a', item).hidden = !open;
    $('.faq-q button', item).addEventListener('click', function () {
      setFaq(item, !item.classList.contains('is-open'));
    });
  });

  function runSearch() {
    var raw = faqInput.value;
    var q = normalize(raw);
    var count = 0;
    var focusLost = false;
    faqItems.forEach(function (item) {
      var match = !q || item.getAttribute('data-search').indexOf(q) !== -1;
      if (!match && item.contains(document.activeElement)) focusLost = true;
      if (match && item.hidden) {
        item.classList.remove('is-entering');
        void item.offsetWidth;
        item.classList.add('is-entering');
      }
      item.hidden = !match;
      if (match) count++;
    });
    if (focusLost) faqInput.focus();
    faqClear.hidden = !raw;
    faqEmpty.hidden = !q || count > 0;
    $('[data-q]', faqEmpty).textContent = raw.trim();
    if (!q) faqStatus.textContent = '';
    else if (count === 0) faqStatus.textContent = 'Nenhuma pergunta encontrada.';
    else faqStatus.textContent = count === 1 ? '1 pergunta encontrada.' : count + ' perguntas encontradas.';
  }

  function clearSearch(focus) {
    if (!faqInput) return;
    faqInput.value = '';
    runSearch();
    if (focus) faqInput.focus();
  }

  if (faqInput) {
    faqInput.addEventListener('input', runSearch);
    faqInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && faqInput.value) {
        ev.preventDefault();
        ev.stopPropagation();
        clearSearch(true);
      }
    });
    faqClear.addEventListener('click', function () {
      clearSearch(true);
    });
    $('.faq-empty__clear', faqEmpty).addEventListener('click', function () {
      clearSearch(true);
    });
  }

  // Atalho "/" para a busca, sem interferir em quem já está digitando.
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== '/' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var t = ev.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    var openDialogs = $$('dialog[open]');
    if (openDialogs.length && !(openDialogs.length === 1 && deckDialog.open && faqDeck.parentElement === deckBody)) return;
    ev.preventDefault();
    if (deckDialog.open) faqInput.focus();
    else openDeck('duvidas', 'busca', document.activeElement);
  });

  /* ------------------------------------------------------------------ */
  /* Pré-análise                                                        */
  /* ------------------------------------------------------------------ */

  var analysisDialog = $('#analise-dialog');
  var form = $('.flow', analysisDialog);
  var steps = $$('.flow__step', form);
  var stepIndex = 0;
  var backBtn = $('[data-back]', form);
  var nextBtn = $('[data-next]', form);
  var errorBox = $('.flow__error', form);
  var nextLabel = $('.btn__label', nextBtn);
  var nextIcon = $('.btn__icon', nextBtn);
  var arrowIcon = nextIcon.innerHTML;
  var waIcon = $('template[data-icon="whatsapp"]', form).innerHTML;

  function goStep(n, back) {
    stepIndex = n;
    steps.forEach(function (step, i) {
      var on = i === n;
      step.hidden = !on;
      step.classList.toggle('is-active', on);
      step.classList.toggle('is-back', on && !!back);
    });
    errorBox.hidden = true;
    backBtn.hidden = n === 0;
    $('[data-step-num]', analysisDialog).textContent = n + 1;
    $('.progress__bar', analysisDialog).style.setProperty('--progress', (n + 1) / steps.length);
    var last = n === steps.length - 1;
    nextLabel.textContent = last ? 'Enviar pelo WhatsApp' : 'Continuar';
    nextBtn.classList.toggle('btn--light', !last);
    nextBtn.classList.toggle('btn--blue', last);
    nextIcon.innerHTML = last ? waIcon : arrowIcon;
    if (last) {
      var perfil = form.elements.perfil.value;
      var faixa = form.elements.faixa.value;
      $('[data-sum="perfil"]', form).textContent = perfil;
      $('[data-sum="faixa"]', form).textContent = faixa;
      $('[data-msg="analise"]', form).textContent = fill(data.messages.analise, { perfil: perfil, faixa: faixa });
      $('.flow__q', steps[n]).focus({ preventScroll: true });
    } else {
      var first = $('input:checked', steps[n]) || $('input', steps[n]);
      if (first && analysisDialog.classList.contains('is-open')) first.focus({ preventScroll: true });
    }
  }

  function syncChoices() {
    $$('.choice', form).forEach(function (c) {
      c.classList.toggle('is-checked', $('input', c).checked);
    });
  }
  form.addEventListener('change', function () {
    syncChoices();
    errorBox.hidden = true;
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var step = steps[stepIndex];
    var inputs = $$('input', step);
    if (inputs.length && !$('input:checked', step)) {
      errorBox.hidden = false;
      inputs[0].focus();
      return;
    }
    if (stepIndex < steps.length - 1) {
      goStep(stepIndex + 1);
      return;
    }
    var msg = $('[data-msg="analise"]', form).textContent;
    openWhatsapp(msg, nextBtn, null);
  });

  backBtn.addEventListener('click', function () {
    goStep(Math.max(0, stepIndex - 1), true);
  });

  function openAnalysis(trigger) {
    // perfil já escolhido em Soluções vem pré-selecionado
    var perfil = state.tipo.charAt(0).toUpperCase() + state.tipo.slice(1);
    if (!form.elements.perfil.value) {
      $$('input[name="perfil"]', form).forEach(function (r) {
        r.checked = r.value === perfil && state.touched;
      });
    }
    syncChoices();
    goStep(0);
    $('.drawer__body', analysisDialog).scrollTop = 0;
    openDialog(analysisDialog, trigger, function () {
      $('#analise-title').focus({ preventScroll: true });
    });
  }
  if (solDeck) {
    solDeck.addEventListener('change', function () {
      state.touched = true;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Menu                                                               */
  /* ------------------------------------------------------------------ */

  var menuDialog = $('#menu-dialog');
  $$('.menu__list a', menuDialog).forEach(function (link) {
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      var id = link.getAttribute('href').slice(1);
      closeDialog(menuDialog, { skipFocus: true });
      goToSection(id);
    });
  });

  function goToSection(id) {
    var section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    section.focus({ preventScroll: true });
    try {
      history.replaceState(null, '', '#' + id);
    } catch (err) {
      /* alguns ambientes isolados não permitem alterar a URL */
    }
  }

  /* ------------------------------------------------------------------ */
  /* Seção atual (aria-current) e indicador do menu da hero              */
  /* ------------------------------------------------------------------ */

  var sections = $$('main > section[id]');
  var navLinks = $$('[data-nav]');
  var headerNav = $('.site-nav__list');
  var indicator = headerNav && $('.site-nav__indicator', headerNav);
  var headerLinks = headerNav ? $$('a', headerNav) : [];
  var current = 'inicio';

  function placeIndicator(link, instant) {
    if (!indicator || !link || !link.offsetWidth) return;
    indicator.classList.toggle('is-instant', !!instant);
    indicator.style.setProperty('--x', link.offsetLeft + 'px');
    indicator.style.setProperty('--w', link.offsetWidth + 'px');
    headerLinks.forEach(function (l) {
      l.classList.toggle('is-lit', l === link);
    });
    if (instant) {
      void indicator.offsetWidth;
      indicator.classList.remove('is-instant');
    }
  }
  function currentHeaderLink() {
    return headerLinks.filter(function (l) {
      return l.getAttribute('data-nav') === current;
    })[0];
  }

  if (headerNav) {
    headerLinks.forEach(function (l) {
      l.addEventListener('pointerenter', function () {
        placeIndicator(l);
      });
      l.addEventListener('focus', function () {
        placeIndicator(l);
      });
    });
    headerNav.addEventListener('pointerleave', function () {
      placeIndicator(currentHeaderLink());
    });
    headerNav.addEventListener('focusout', function (ev) {
      if (!headerNav.contains(ev.relatedTarget)) placeIndicator(currentHeaderLink());
    });
    placeIndicator(currentHeaderLink(), true);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        placeIndicator(currentHeaderLink(), true);
      });
    }
    window.addEventListener('resize', function () {
      placeIndicator(currentHeaderLink(), true);
    });
  }

  function setCurrent(id) {
    if (id === current) return;
    current = id;
    navLinks.forEach(function (l) {
      if (l.getAttribute('data-nav') === id) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
    placeIndicator(currentHeaderLink());
  }

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Revelação ao rolar (o conteúdo é visível por padrão sem JS)         */
  /* ------------------------------------------------------------------ */

  function setupReveal() {
    if (!('IntersectionObserver' in window) || reduceMotion.matches) return;
    var targets = $$('[data-reveal], [data-stagger]');
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add('is-in');
          observer.unobserve(el);
          if (el.classList.contains('stage')) pingPrimary(el);
          if (el.classList.contains('sol__list')) placeSolIndicator(false);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
    root.classList.add('reveal-on');
  }

  function pingPrimary(stageEl) {
    var spot = $$('.hs--primary', stageEl).filter(function (s) {
      return s.offsetParent !== null;
    })[0];
    if (!spot) return;
    setTimeout(function () {
      spot.classList.add('is-ping');
      spot.addEventListener(
        'animationend',
        function () {
          spot.classList.remove('is-ping');
        },
        { once: true },
      );
    }, 650);
  }

  /* ------------------------------------------------------------------ */
  /* Parallax suave das camadas desenhadas da hero (nunca das fotos)     */
  /* ------------------------------------------------------------------ */

  function setupParallax() {
    var hero = $('.hero--native');
    if (!hero) return;
    var ticking = false;
    var update = function () {
      ticking = false;
      if (reduceMotion.matches) {
        hero.style.setProperty('--p', 0);
        return;
      }
      var h = hero.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, window.scrollY / h));
      hero.style.setProperty('--p', p.toFixed(4));
    };
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  /* ------------------------------------------------------------------ */

  setupReveal();
  setupParallax();
  var heroStage = $('.stage--hero');
  if (heroStage && !reduceMotion.matches) {
    setTimeout(function () {
      pingPrimary(heroStage);
    }, 900);
  }
  placeSolIndicator(false);
  placeTabPill(false);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      placeSolIndicator(false);
      placeTabPill(false);
    });
  }
})();
