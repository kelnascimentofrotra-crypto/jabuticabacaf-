/* St1 Internet — interações do site (sem dependências) */
(() => {
  'use strict';

  // Configuração central: altere aqui e vale para o site inteiro.
  const CONFIG = {
    whatsapp: '559830140559', // (98) 3014-0559
    // Endereço da Área do Cliente. Troque pelo portal oficial quando houver.
    areaCliente: 'https://apps.apple.com/br/app/st1-internet/id6750487444',
  };

  const waUrl = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const openWhatsApp = (msg) => {
    const url = waUrl(msg);
    // Sem a flag "noopener": com ela, window.open sempre retorna null.
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // pop-up bloqueado
  };

  // Links da Área do Cliente
  $$('[data-link="areaCliente"]').forEach((a) => { a.href = CONFIG.areaCliente; });

  // Ano no rodapé
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // Cabeçalho com sombra ao rolar
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('menu');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
    window.matchMedia('(min-width: 1120px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });
  }

  // Submenu "Empresas"
  $$('.has-sub').forEach((item) => {
    const btn = item.querySelector('.submenu-toggle');
    if (!btn) return;
    const set = (open) => { item.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => set(!item.classList.contains('is-open')));
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', (e) => { if (!item.contains(e.target)) set(false); });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.has-sub.is-open').forEach((item) => {
      item.classList.remove('is-open');
      const btn = item.querySelector('.submenu-toggle');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
    if (document.body.classList.contains('nav-open')) { setNav(false); toggle && toggle.focus(); }
  });

  // Formulários que viram mensagem de WhatsApp
  $$('form[data-wa-form]').forEach((form) => {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const lines = [form.dataset.waIntro || 'Olá! Vim pelo site da St1.'];
      $$('[data-label]', form).forEach((field) => {
        const value = (field.value || '').trim();
        if (value) lines.push(`${field.dataset.label}: ${value}`);
      });
      openWhatsApp(lines.join('\n'));
      if (status) {
        status.textContent = 'Abrindo o WhatsApp com sua mensagem pronta…';
        status.classList.add('is-ok');
      }
    });
  });

  // Busca nas perguntas frequentes
  const search = document.querySelector('[data-faq-search]');
  if (search) {
    const items = $$('.faq-item');
    const groups = $$('.faq-group');
    const empty = document.querySelector('.faq-empty');
    const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    search.addEventListener('input', () => {
      const q = normalize(search.value.trim());
      let shown = 0;
      items.forEach((item) => {
        const match = !q || normalize(item.textContent).includes(q);
        item.hidden = !match;
        if (match) shown += 1;
        if (q && match) item.open = true;
        if (!q) item.open = false;
      });
      groups.forEach((g) => { g.hidden = !$$('.faq-item', g).some((i) => !i.hidden); });
      if (empty) empty.classList.toggle('is-visible', shown === 0);
    });
  }

  // Animação de entrada ao rolar
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }
})();
