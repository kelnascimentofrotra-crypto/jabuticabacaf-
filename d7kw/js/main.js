(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.getElementById('menu');
  const toggle = document.querySelector('[data-menu-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const num = (n, d = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- WhatsApp ----------
     O número fica no atributo data-whatsapp do <body>. */
  const phone = (document.body.dataset.whatsapp || '').replace(/\D/g, '');
  const waUrl = (text) => `https://wa.me/${phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  const setWaLink = (link, text) => {
    link.href = waUrl(text);
    link.target = '_blank';
    link.rel = 'noopener';
  };
  document.querySelectorAll('[data-wa]').forEach((link) => setWaLink(link, link.dataset.wa));

  // 556199997508 -> (61) 9999-7508
  const formatPhone = (digits) => {
    const d = digits.replace(/^55(?=\d{10,11}$)/, '');
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return digits;
  };
  document.querySelectorAll('[data-wa-display]').forEach((el) => { el.textContent = formatPhone(phone); });
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Menu ao rolar + botão flutuante ---------- */
  const waFloat = document.querySelector('.wa-float');
  const contact = document.getElementById('contato');
  let contactVisible = false;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    if (waFloat) waFloat.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && !contactVisible);
  };
  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; onScroll(); })
      .observe(contact);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !e.target.closest('.topbar__pill')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Link ativo conforme a seção ---------- */
  const links = [...document.querySelectorAll('.nav__link')];
  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
  }

  /* ---------- Simulador de economia ----------
     Estimativa simples: tarifa média R$ 1,00/kWh, 5 h de sol pleno/dia,
     rendimento de 80%, painéis de 600 W (~2,7 m²) e economia de até 90%. */
  const TARIFA = 1.0;
  const HSP = 5;
  const RENDIMENTO = 0.8;
  const PAINEL_W = 600;
  const PAINEL_M2 = 2.7;
  const ECONOMIA = 0.9;

  const sim = document.querySelector('[data-simulator]');
  if (sim) {
    const range = sim.querySelector('[data-sim-range]');
    const billOut = sim.querySelector('[data-sim-bill]');
    const out = (key) => sim.querySelector(`[data-sim-out="${key}"]`);
    const cta = sim.querySelector('[data-sim-cta]');
    const compareBill = document.querySelector('[data-compare-bill]');
    const compareBefore = document.querySelector('[data-compare-before]');
    const compareAfter = document.querySelector('[data-compare-after]');

    const update = () => {
      const conta = Number(range.value);
      const tipo = sim.querySelector('input[name="tipo"]:checked').value;
      const consumo = conta / TARIFA;                                  // kWh/mês
      const kwp = consumo / (HSP * 30 * RENDIMENTO);
      const paineis = Math.max(1, Math.ceil((kwp * 1000) / PAINEL_W));
      const area = Math.ceil(paineis * PAINEL_M2);
      const mes = conta * ECONOMIA;

      billOut.textContent = brl(conta);
      out('mes').textContent = `até ${brl(mes)}`;
      out('ano').textContent = brl(mes * 12);
      out('total').textContent = brl(mes * 12 * 25);
      out('kwp').textContent = `${num(kwp, 1)} kWp`;
      out('paineis').textContent = `${paineis} ${paineis === 1 ? 'placa' : 'placas'}`;
      out('area').textContent = `${area} m²`;

      const min = Number(range.min);
      const max = Number(range.max);
      range.style.setProperty('--p', `${((conta - min) / (max - min)) * 100}%`);
      range.setAttribute('aria-valuetext', `${brl(conta)} por mês`);

      setWaLink(cta, `Olá! Fiz a simulação no site da D7KW.\nTipo de imóvel: ${tipo}\nConta média: ${brl(conta)} por mês\nSistema estimado: ${num(kwp, 1)} kWp (${paineis} painéis)\nGostaria de receber uma proposta.`);

      if (compareBill) {
        compareBill.textContent = brl(conta);
        compareBefore.textContent = brl(conta);
        compareAfter.textContent = `≈ ${brl(conta - mes)}`;
      }
    };
    range.addEventListener('input', update);
    sim.addEventListener('change', update);
    update();
  }

  /* ---------- Animações de entrada ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach((el) => revealer.observe(el));
})();
