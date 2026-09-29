(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const LOCAL_IMG = 'assets/casa.webp';
  const unsplash = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

  /* =========================================================
     Conteúdo de exemplo — troque pelos dados reais
     ========================================================= */

  // Número do WhatsApp que recebe os pedidos: só dígitos, com DDI e DDD (ex.: '5511999999999').
  // Vazio = o WhatsApp abre e a pessoa escolhe o contato.
  const WHATSAPP = '';

  const HOUSES = [
    { id: 'patio', nome: 'Casa Pátio', tipo: 'casa', negocio: 'venda', bairro: 'Jardim Europa', cidade: 'São Paulo', uf: 'SP',
      area: 420, suites: 4, banheiros: 6, vagas: 4, preco: 6800000, selos: ['Exclusivo'], img: null,
      tags: ['Térrea', 'Piscina', 'Jardim tropical'],
      desc: 'Casa térrea com laje de concreto aparente, pilar de pedra e uma sala que se abre inteira para a piscina. Jardim tropical em volta de toda a casa.' },
    { id: 'mirante', nome: 'Casa Mirante', tipo: 'casa', negocio: 'venda', bairro: 'Vila', cidade: 'Ilhabela', uf: 'SP',
      area: 380, suites: 3, banheiros: 4, vagas: 3, preco: 5200000, selos: ['Vista para o mar'], img: '1600596542815-ffad4c1539a9',
      tags: ['Varandas', 'Madeira certificada'],
      desc: 'Varandas profundas voltadas para o canal, madeira certificada na fachada e deck com piscina.' },
    { id: 'jequitiba', nome: 'Casa Jequitibá', tipo: 'casa', negocio: 'venda', bairro: 'Quadrado', cidade: 'Trancoso', uf: 'BA',
      area: 510, suites: 5, banheiros: 7, vagas: 4, preco: 9400000, selos: ['Novo'], img: '1512917774080-9991f1c4c750',
      tags: ['Condomínio', 'Piscina aquecida'],
      desc: 'Cinco suítes em volta de um pátio sombreado, a dez minutos do Quadrado.' },
    { id: 'brisa', nome: 'Casa Brisa', tipo: 'casa', negocio: 'aluguel', bairro: 'Jurerê', cidade: 'Florianópolis', uf: 'SC',
      area: 300, suites: 3, banheiros: 4, vagas: 2, preco: 38000, selos: ['Mobiliada'], img: '1600585154340-be6161a56a0c',
      tags: ['Perto da praia', 'Deck'],
      desc: 'Volumes brancos, ventilação cruzada e um deck que termina na restinga. Entregue mobiliada com a coleção Morada.' },
    { id: 'seixo', nome: 'Casa Seixo', tipo: 'casa', negocio: 'venda', bairro: 'Vale dos Cristais', cidade: 'Nova Lima', uf: 'MG',
      area: 460, suites: 4, banheiros: 5, vagas: 4, preco: 5900000, selos: [], img: '1580587771525-78b9dba3b914',
      tags: ['Vista para a serra', 'Pedra local'],
      desc: 'Pedra da região, grandes panos de vidro e a serra inteira na janela da sala.' },
    { id: 'lume', nome: 'Casa Lume', tipo: 'casa', negocio: 'aluguel', bairro: 'Capivari', cidade: 'Campos do Jordão', uf: 'SP',
      area: 350, suites: 4, banheiros: 5, vagas: 3, preco: 29000, selos: ['Temporada'], img: '1564013799919-ab600027ffc6',
      tags: ['Lareira', 'Pé-direito duplo'],
      desc: 'Lareira central, pé-direito duplo e luz de fim de tarde o ano inteiro.' },
    { id: 'jardins', nome: 'Apartamento Jardins', tipo: 'apartamento', negocio: 'venda', bairro: 'Jardins', cidade: 'São Paulo', uf: 'SP',
      area: 280, suites: 3, banheiros: 4, vagas: 3, preco: 4900000, selos: ['Andar alto'], img: '1502672260266-1c1ef2d93688',
      tags: ['Varanda gourmet', 'Vista aberta'],
      desc: 'Planta ampla com varanda gourmet, piso de madeira e vista aberta para o verde dos Jardins.' },
    { id: 'leblon', nome: 'Cobertura Leblon', tipo: 'apartamento', negocio: 'aluguel', bairro: 'Leblon', cidade: 'Rio de Janeiro', uf: 'RJ',
      area: 320, suites: 4, banheiros: 5, vagas: 3, preco: 45000, selos: ['Cobertura'], img: '1522708323590-d24dbb6b0267',
      tags: ['Terraço', 'Piscina privativa'],
      desc: 'Cobertura com terraço, piscina privativa e o mar a duas quadras.' },
    { id: 'serra', nome: 'Terreno Serra Verde', tipo: 'terreno', negocio: 'venda', bairro: 'Condomínio Serra Verde', cidade: 'Nova Lima', uf: 'MG',
      area: 2600, frente: 40, topografia: 'Aclive suave', suites: 0, preco: 1900000, selos: ['Projeto aprovado'], img: null,
      tags: ['Vista para a serra', 'Condomínio fechado'],
      desc: 'Lote de 2.600 m² em aclive suave, com projeto aprovado para casa térrea e vista para a serra.' },
  ];
  const TIPOS = { casa: 'Casa', apartamento: 'Apartamento', terreno: 'Terreno' };
  const compact = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });
  const priceLabel = (h) => (h.negocio === 'aluguel' ? `${brl.format(h.preco)}/mês` : compact.format(h.preco));
  const typeLine = (h) => (h.tipo === 'terreno' ? `Terreno — ${h.area.toLocaleString('pt-BR')} m²` : `${TIPOS[h.tipo]} — ${h.suites} suítes`);
  const detailsLine = (h) => (h.tipo === 'terreno'
    ? `${h.frente} m de frente · ${h.topografia}`
    : `${h.area} m² · ${h.suites} suítes · ${h.vagas} vagas`);
  const zapLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const TERRAIN = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.4"><path d="M-10 60C80 40 160 90 250 70s130-30 170-10"/><path d="M-10 100c100-20 180 30 270 10s130-30 160-10"/><path d="M-10 140c110-20 190 30 280 10s120-30 150-10"/><path d="M-10 180c120-20 200 30 290 10s110-30 140-10"/><path d="M-10 220c130-20 210 30 300 10s100-30 130-10"/><path d="M-10 260c140-20 220 30 310 10s90-30 120-10"/></g><path d="M110 70 300 90l20 140-230-15z" fill="rgba(255,255,255,.1)" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/><g fill="rgba(30,50,25,.5)"><circle cx="60" cy="250" r="16"/><circle cx="86" cy="263" r="11"/><circle cx="340" cy="60" r="18"/><circle cx="366" cy="80" r="12"/><circle cx="352" cy="252" r="14"/></g></svg>';

  const CATS = { sala: 'Sala', jantar: 'Jantar', iluminacao: 'Iluminação', externo: 'Externo' };

  // Desenhos de linha das peças (viewBox 200×200)
  const ART = {
    oca: '<ellipse class="shadow" cx="100" cy="170" rx="72" ry="7"/><path class="wood" d="M58 146l-5 20M142 146l5 20M78 146l-2 22M122 146l2 22"/><path class="fill" d="M60 60c0-13 10-22 23-22h34c13 0 23 9 23 22v48H60z"/><rect class="fill2" x="40" y="86" width="26" height="62" rx="12"/><rect class="fill2" x="134" y="86" width="26" height="62" rx="12"/><rect class="fill" x="60" y="106" width="80" height="40" rx="12"/><path class="line" d="M74 120h52"/>',
    ilha: '<ellipse class="shadow" cx="100" cy="162" rx="92" ry="7"/><path class="wood" d="M34 146v12M166 146v12"/><rect class="fill" x="26" y="70" width="148" height="50" rx="16"/><rect class="fill2" x="12" y="92" width="32" height="56" rx="14"/><rect class="fill2" x="156" y="92" width="32" height="56" rx="14"/><rect class="fill" x="42" y="110" width="58" height="36" rx="10"/><rect class="fill" x="100" y="110" width="58" height="36" rx="10"/><rect class="fill2" x="52" y="84" width="30" height="24" rx="8" transform="rotate(-8 67 96)"/>',
    laje: '<ellipse class="shadow" cx="100" cy="166" rx="84" ry="6"/><path class="fill" d="M60 92h16l-4 70h-8zM124 92h16l-4 70h-8z"/><rect class="fill2" x="20" y="80" width="160" height="13" rx="3"/><path class="fill" d="M92 80c-5-9-4-19 8-25 12 6 13 16 8 25z"/><path class="line" d="M100 55c1-12 7-20 16-26M100 55c-3-9-9-14-17-17"/>',
    tabua: '<ellipse class="shadow" cx="100" cy="170" rx="50" ry="6"/><path class="wood" d="M70 112l-5 54M130 112l5 54M84 112l-2 50M116 112l2 50M74 94v10M126 94v10"/><rect class="fill" x="68" y="34" width="64" height="62" rx="8"/><path class="line" d="M81 42v46M94 42v46M106 42v46M119 42v46"/><rect class="fill2" x="60" y="102" width="80" height="12" rx="4"/>',
    farol: '<path class="glow" d="M60 118 20 196h160l-40-78z"/><path class="line" d="M100 0v60"/><rect class="fill" x="93" y="56" width="14" height="10" rx="2"/><path class="fill2" d="M54 118c0-28 20-52 46-52s46 24 46 52z"/><circle class="bulb" cx="100" cy="122" r="9"/>',
    vela: '<path class="glow" d="M122 64 98 158h78l-22-94z"/><ellipse class="shadow" cx="100" cy="172" rx="42" ry="5"/><path class="line" style="stroke-width:3" d="M100 164V62c0-16 10-26 26-28"/><ellipse class="fill2" cx="100" cy="166" rx="26" ry="6"/><path class="fill" d="M112 30h40l-8 34h-24z"/><circle class="bulb" cx="132" cy="66" r="5"/>',
    mare: '<ellipse class="shadow" cx="100" cy="162" rx="86" ry="6"/><path class="wood" d="M40 132v24M166 132v24"/><rect class="fill2" x="24" y="120" width="156" height="13" rx="4"/><path class="fill2" d="M28 122l28-56 14 6-24 52z"/><rect class="fill" x="62" y="108" width="114" height="14" rx="7"/><path class="fill" d="M44 116l22-44 10 4-20 42z"/>',
    ripado: '<ellipse class="shadow" cx="100" cy="164" rx="86" ry="6"/><path class="wood" d="M36 144v16M164 144v16"/><rect class="fill2" x="20" y="84" width="160" height="62" rx="4"/><path class="line" d="M34 92v46M44 92v46M54 92v46M64 92v46M74 92v46M84 92v46M94 92v46M104 92v46M114 92v46M124 92v46M134 92v46M144 92v46M154 92v46M164 92v46"/><path class="fill" d="M58 84c-3-13 1-24 10-27 9 3 13 14 10 27z"/><path class="line" d="M68 57c0-12 5-21 12-27M68 57c-4-9-10-13-17-15"/><ellipse class="fill" cx="138" cy="79" rx="16" ry="5"/><ellipse class="fill" cx="140" cy="72" rx="9" ry="4"/>',
  };

  const PRODUCTS = [
    { id: 'oca', nome: 'Poltrona Oca', cat: 'sala', mat: 'Couro natural e freijó', preco: 8900, bg: '#eadfce', a: '#c9976a', b: '#b27f55' },
    { id: 'ilha', nome: 'Sofá Ilha', cat: 'sala', mat: 'Linho cru, 3 lugares', preco: 18400, bg: '#e3e1da', a: '#f1ebe0', b: '#d8cdbc' },
    { id: 'laje', nome: 'Mesa Laje', cat: 'jantar', mat: 'Concreto polido e aço', preco: 12600, bg: '#deddd8', a: '#a39e96', b: '#c3beb5' },
    { id: 'tabua', nome: 'Cadeira Tábua', cat: 'jantar', mat: 'Freijó maciço', preco: 2300, bg: '#ebdfcf', a: '#b98a5e', b: '#a0734a' },
    { id: 'farol', nome: 'Pendente Farol', cat: 'iluminacao', mat: 'Latão escovado', preco: 3100, bg: '#ede3d1', a: '#9c7a45', b: '#caa25d' },
    { id: 'vela', nome: 'Luminária Vela', cat: 'iluminacao', mat: 'Aço e cúpula de linho', preco: 4200, bg: '#e6e1d7', a: '#f2e9d8', b: '#3c3833' },
    { id: 'mare', nome: 'Espreguiçadeira Maré', cat: 'externo', mat: 'Teca e corda náutica', preco: 6700, bg: '#d8e3e3', a: '#f2ece1', b: '#b08158' },
    { id: 'ripado', nome: 'Aparador Ripado', cat: 'sala', mat: 'Nogueira e pedra', preco: 7800, bg: '#e7ded2', a: '#cfc6b8', b: '#8f6645' },
  ];

  const REVIEWS = [
    { nome: 'Marina Duarte', ini: 'MD', casa: 'Casa Mirante · Ilhabela', texto: 'Visitamos três casas. A\u00a0terceira já era a nossa.' },
    { nome: 'Rafael Nogueira', ini: 'RN', casa: 'Casa Seixo · Nova Lima', texto: 'Documentação em dia e nenhuma surpresa na escritura.' },
    { nome: 'Helena e Caio Prado', ini: 'HC', casa: 'Casa Brisa · Florianópolis', texto: 'Chegamos só com as malas. A casa já estava mobiliada.' },
  ];

  const PREVIEW = {
    inicio: 'Vamos encontrar a sua morada',
    moveis: 'Peças para a sua casa',
    curadoria: `${HOUSES.length} imóveis selecionados`,
    avaliacoes: 'Nota 4,9 de 5',
    contato: 'Resposta em até um dia útil',
  };

  /* =========================================================
     Imagens (foto externa com reserva local)
     ========================================================= */

  function houseImg(h, w, alt = '') {
    const img = new Image();
    img.alt = alt;
    img.decoding = 'async';
    if (!h.img) { img.src = LOCAL_IMG; return img; }
    img.src = unsplash(h.img, w);
    img.addEventListener('error', () => {
      img.src = LOCAL_IMG;
      img.parentElement?.classList.add('is-local');
    }, { once: true });
    return img;
  }
  function houseThumb(h, cls) {
    const box = document.createElement('span');
    box.className = cls + (h.img ? '' : ' is-local');
    box.append(houseImg(h, 320));
    return box;
  }
  function productArt(p) {
    return `<svg class="art" viewBox="0 0 200 200" aria-hidden="true" style="--tone-a:${p.a};--tone-b:${p.b}">${ART[p.id]}</svg>`;
  }

  /* =========================================================
     Favoritos (ficam no navegador de quem visita)
     ========================================================= */

  const FAV_KEY = 'morada:favoritos';
  let favs = { houses: [], products: [] };
  try { favs = { ...favs, ...JSON.parse(localStorage.getItem(FAV_KEY) || '{}') }; } catch (_) { /* sem armazenamento */ }
  const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (_) { /* ignora */ } };
  const isFav = (kind, id) => favs[kind].includes(id);

  function toggleFav(kind, id) {
    const list = favs[kind];
    const on = !list.includes(id);
    favs[kind] = on ? [...list, id] : list.filter((x) => x !== id);
    saveFavs();
    const name = (kind === 'houses' ? HOUSES : PRODUCTS).find((x) => x.id === id)?.nome;
    toast(on ? `${name} salva nos favoritos` : `${name} saiu dos favoritos`);
    syncFavUI();
  }

  function syncFavUI() {
    const total = favs.houses.length + favs.products.length;
    $('#favTabCount').textContent = total;
    $$('.pcard-fav').forEach((b) => b.setAttribute('aria-pressed', String(isFav('houses', b.dataset.id))));
    if (dtHouse) $('#dtFav').setAttribute('aria-pressed', String(isFav('houses', dtHouse.id)));
    $$('.pc-add').forEach((b) => {
      const on = isFav('products', b.dataset.id);
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = `<svg><use href="#${on ? 'i-check' : 'i-plus'}" /></svg>`;
    });
    renderFavs();
  }

  /* =========================================================
     Contadores: os números sobem de 0 até o valor
     ========================================================= */

  const formatCount = (el, v) => {
    const dec = Number(el.dataset.decimals || 0);
    return (el.dataset.prefix || '') + v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || '');
  };
  $$('.count').forEach((el) => {
    const final = formatCount(el, Number(el.dataset.count));
    el.textContent = final;
    el.setAttribute('aria-label', final);
  });
  // largura fixa no valor final, para o número não "pular" enquanto conta
  const lockCountWidths = () => $$('.count').forEach((el) => {
    el.style.minWidth = '';
    el.textContent = formatCount(el, Number(el.dataset.count));
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  });
  document.fonts?.ready.then(lockCountWidths);

  function countUp(el, speed = 1) {
    const target = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    cancelAnimationFrame(el._raf);
    clearTimeout(el._wait);
    if (reduceMotion) { el.textContent = formatCount(el, target); return; }
    el.textContent = formatCount(el, 0);
    const duration = 1900;
    el._wait = setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        const f = 10 ** dec;
        el.textContent = formatCount(el, Math.round(target * eased * f) / f);
        if (p < 1) el._raf = requestAnimationFrame(step);
      };
      el._raf = requestAnimationFrame(step);
    }, Number(el.dataset.delay || 0) * speed);
  }
  const runCounts = (scope, speed) => $$('.count', scope).forEach((el) => countUp(el, speed));

  /* =========================================================
     Toast
     ========================================================= */

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* =========================================================
     02 · Móveis
     ========================================================= */

  const grid = $('#productGrid');
  grid.innerHTML = PRODUCTS.map((p, k) => `
    <li class="pc" data-id="${p.id}" data-cat="${p.cat}" style="--bg-a:${p.bg};--k:${k}">
      <div class="pc-art">${productArt(p)}</div>
      <div class="pc-info">
        <h3>${p.nome}</h3>
        <span class="pc-price">${brl.format(p.preco)}</span>
        <button class="pc-add" type="button" data-id="${p.id}" aria-pressed="false" aria-label="Salvar ${p.nome} nos favoritos"></button>
      </div>
    </li>`).join('');

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.pc-add');
    if (b) toggleFav('products', b.dataset.id);
  });

  function setCategory(cat) {
    $$('.mv-bar .chip').forEach((c) => {
      const on = c.dataset.cat === cat;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    let n = 0;
    $$('.pc', grid).forEach((el) => {
      const show = cat === 'todos' || el.dataset.cat === cat;
      el.classList.toggle('is-dim', !show);
      if (show) n++;
    });
    $('#productCount').textContent = n;
    grid.scrollTo?.({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  $('.mv-bar .chips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (c) setCategory(c.dataset.cat);
  });

  function flashProduct(id) {
    setCategory('todos');
    const el = $(`.pc[data-id="${id}"]`, grid);
    if (!el) return;
    el.scrollIntoView?.({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    el.classList.remove('is-flash');
    void el.offsetWidth;
    el.classList.add('is-flash');
  }

  /* =========================================================
     03 · Imóveis (filtros por tipo e negócio, card abre a página do imóvel)
     ========================================================= */

  function withFallback(root) {
    $$('img[data-fallback]', root).forEach((img) => {
      const fail = () => { img.src = LOCAL_IMG; img.classList.add('is-local'); img.removeAttribute('data-fallback'); };
      if (img.complete && !img.naturalWidth) fail();
      else img.addEventListener('error', fail, { once: true });
    });
  }
  function propMedia(h, w) {
    if (h.tipo === 'terreno') return `<span class="terrain">${TERRAIN}</span>`;
    if (!h.img) return `<img class="is-local" src="${LOCAL_IMG}" alt="" />`;
    return `<img src="${unsplash(h.img, w)}" alt="" loading="lazy" decoding="async" data-fallback />`;
  }

  const imGrid = $('#imGrid');
  const filters = { tipo: 'todos', negocio: 'todos' };
  imGrid.innerHTML = HOUSES.map((h, k) => `
    <li class="pcard" data-id="${h.id}" data-tipo="${h.tipo}" data-negocio="${h.negocio}" style="--k:${k}">
      <button class="pcard-open" type="button" aria-label="Ver ${h.nome}">
        <span class="pcard-img">${propMedia(h, 900)}</span>
        <span class="pcard-badges">${[h.negocio === 'aluguel' ? 'Aluguel' : 'Venda', ...h.selos].map((t) => `<span>${t}</span>`).join('')}</span>
        <span class="pcard-info">
          <span class="pcard-loc">${h.bairro} · ${h.cidade}</span>
          <strong class="pcard-type">${typeLine(h)}</strong>
          <span class="pcard-details">${detailsLine(h)}</span>
          <span class="pcard-price">${priceLabel(h)}</span>
        </span>
      </button>
      <button class="pcard-fav" type="button" data-id="${h.id}" aria-pressed="false" aria-label="Salvar ${h.nome} nos favoritos"><svg><use href="#i-heart" /></svg></button>
    </li>`).join('');
  withFallback(imGrid);

  imGrid.addEventListener('click', (e) => {
    const fav = e.target.closest('.pcard-fav');
    if (fav) { toggleFav('houses', fav.dataset.id); return; }
    const open = e.target.closest('.pcard-open');
    if (open) openProperty(open.closest('.pcard').dataset.id, open);
  });

  function applyFilters() {
    let n = 0;
    let first = null;
    $$('.pcard', imGrid).forEach((el) => {
      const show = (filters.tipo === 'todos' || el.dataset.tipo === filters.tipo) &&
        (filters.negocio === 'todos' || el.dataset.negocio === filters.negocio);
      el.hidden = !show;
      el.classList.remove('is-featured');
      if (show) { n++; if (!first) first = el; }
    });
    first?.classList.add('is-featured');
    $('#imCount').textContent = n;
    $('#imWord').textContent = n === 1 ? 'imóvel' : 'imóveis';
    $('#imEmpty').hidden = n > 0;
    imGrid.scrollTo?.({ left: 0 });
    updateImNav();
  }
  function filterGroup(group, key) {
    group.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      pickChip(group, c);
      filters[key] = c.dataset[key];
      applyFilters();
    });
  }
  filterGroup($('#fTipo'), 'tipo');
  filterGroup($('#fNegocio'), 'negocio');
  $('#imReset').addEventListener('click', () => {
    pickChip($('#fTipo'), $('#fTipo .chip'));
    pickChip($('#fNegocio'), $('#fNegocio .chip'));
    filters.tipo = 'todos';
    filters.negocio = 'todos';
    applyFilters();
  });

  const scrollIm = (dir) => imGrid.scrollBy({ left: dir * imGrid.clientWidth * 0.9, behavior: reduceMotion ? 'auto' : 'smooth' });
  function updateImNav() {
    const max = imGrid.scrollWidth - imGrid.clientWidth - 2;
    $('#imPrev').disabled = imGrid.scrollLeft <= 2;
    $('#imNext').disabled = imGrid.scrollLeft >= max;
  }
  $('#imPrev').addEventListener('click', () => scrollIm(-1));
  $('#imNext').addEventListener('click', () => scrollIm(1));
  imGrid.addEventListener('scroll', updateImNav, { passive: true });
  addEventListener('resize', updateImNav);
  applyFilters();

  /* ---------- Página do imóvel ---------- */

  let dtHouse = null;
  const SHOTS_LOCAL = [['64% 100%', 'cover'], ['58% 64%', '330% auto'], ['62% 96%', '240% auto'], ['76% 52%', '420% auto']];
  const SHOTS_PHOTO = [['50% 50%', 'cover'], ['12% 55%', '230% auto'], ['88% 55%', '230% auto'], ['50% 88%', '200% auto']];
  const photoUrl = new Map();
  function resolvePhoto(h) {
    if (!h.img) return Promise.resolve(LOCAL_IMG);
    if (photoUrl.has(h.id)) return Promise.resolve(photoUrl.get(h.id));
    return new Promise((resolve) => {
      const test = new Image();
      test.onload = () => { photoUrl.set(h.id, test.src); resolve(test.src); };
      test.onerror = () => { photoUrl.set(h.id, LOCAL_IMG); resolve(LOCAL_IMG); };
      test.src = unsplash(h.img, 1600);
    });
  }
  const shotStyle = (url, [pos, size]) => `background-image:url('${url}'),linear-gradient(180deg,#7fa7c6,#ecdac3);background-position:${pos},0 0;background-size:${size},cover;background-repeat:no-repeat`;

  function showShot(k) {
    $$('button', $('#dtThumbs')).forEach((b, i) => b.classList.toggle('is-active', i === k));
    const next = $$('.dt-shot', $('#dtMain'))[k];
    $$('.dt-shot', $('#dtMain')).forEach((el) => el.classList.toggle('is-current', el === next));
  }

  function openProperty(id, trigger) {
    const h = HOUSES.find((x) => x.id === id);
    if (!h) return;
    dtHouse = h;
    $('#dtLoc').textContent = `${h.bairro} · ${h.cidade}, ${h.uf}`;
    $('#dtName').textContent = h.nome;
    $('#dtType').textContent = `${typeLine(h)} · ${h.negocio === 'aluguel' ? 'para alugar' : 'à venda'}`;
    $('#dtPrice').textContent = priceLabel(h);
    const specs = h.tipo === 'terreno'
      ? [['Área', `${h.area.toLocaleString('pt-BR')} m²`], ['Frente', `${h.frente} m`], ['Topografia', h.topografia]]
      : [['Área', `${h.area} m²`], ['Suítes', h.suites], ['Banheiros', h.banheiros], ['Vagas', h.vagas]];
    $('#dtSpecs').innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#dtDesc').textContent = h.desc;
    $('#dtTags').innerHTML = h.tags.map((t) => `<li>${t}</li>`).join('');
    $('#dtBadges').innerHTML = [h.negocio === 'aluguel' ? 'Aluguel' : 'Venda', ...h.selos].map((t) => `<span>${t}</span>`).join('');
    $('#dtZap').href = zapLink(`Olá! Tenho interesse no imóvel ${h.nome} (${h.bairro}, ${h.cidade}/${h.uf}) — ${priceLabel(h)}. Pode me passar mais informações?`);

    const main = $('#dtMain');
    const thumbs = $('#dtThumbs');
    if (h.tipo === 'terreno') {
      main.innerHTML = `<div class="dt-shot is-current terrain">${TERRAIN}</div>`;
      thumbs.innerHTML = '';
    } else {
      const shots = h.img ? SHOTS_PHOTO : SHOTS_LOCAL;
      main.innerHTML = shots.map((_, k) => `<div class="dt-shot${k === 0 ? ' is-current' : ''}"></div>`).join('');
      thumbs.innerHTML = shots.map((_, k) => `<li><button type="button" class="${k === 0 ? 'is-active' : ''}" aria-label="Foto ${k + 1}"></button></li>`).join('');
      $$('button', thumbs).forEach((b, k) => b.addEventListener('click', () => showShot(k)));
      resolvePhoto(h).then((url) => {
        if (dtHouse !== h) return;
        const s2 = url === LOCAL_IMG ? SHOTS_LOCAL : shots;
        $$('.dt-shot', main).forEach((el, k) => { el.setAttribute('style', shotStyle(url, s2[k])); });
        $$('button', thumbs).forEach((b, k) => { b.setAttribute('style', shotStyle(url, s2[k])); });
      });
    }
    syncCartUI();
    syncFavUI();
    openOverlay('detail', trigger);
  }
  $('#dtCart').addEventListener('click', () => dtHouse && toggleCart(dtHouse.id));
  $('#dtFav').addEventListener('click', () => dtHouse && toggleFav('houses', dtHouse.id));

  /* ---------- Carrinho (fica no navegador de quem visita) ---------- */

  const CART_KEY = 'morada:carrinho';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]').filter((id) => HOUSES.some((h) => h.id === id)); } catch (_) { /* sem armazenamento */ }
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) { /* ignora */ } };

  function toggleCart(id) {
    const on = !cart.includes(id);
    cart = on ? [...cart, id] : cart.filter((x) => x !== id);
    saveCart();
    const h = HOUSES.find((x) => x.id === id);
    toast(on ? `${h.nome} foi para o carrinho` : `${h.nome} saiu do carrinho`);
    syncCartUI();
  }

  function syncCartUI() {
    const n = cart.length;
    const badge = $('.fav-count');
    badge.textContent = n;
    badge.hidden = n === 0;
    $('#cartTabCount').textContent = n;
    $('.menu-cart-count').textContent = n;
    $('.dots-count').textContent = n;
    $('.dots-count').hidden = n === 0;
    if (dtHouse) {
      const inCart = cart.includes(dtHouse.id);
      $('#dtCart span').textContent = inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho';
      $('#dtCart').classList.toggle('is-in-cart', inCart);
    }
    renderCart();
  }

  function renderCart() {
    const list = $('#cartList');
    list.innerHTML = cart.map((id) => {
      const h = HOUSES.find((x) => x.id === id);
      return `<li class="cart-item" data-id="${h.id}">
        <button class="cart-thumb" type="button" aria-label="Ver ${h.nome}">${propMedia(h, 320)}</button>
        <div class="cart-body">
          <strong>${h.nome}</strong>
          <small>${h.bairro} · ${h.cidade}/${h.uf} · ${typeLine(h)}</small>
          <p>${h.desc}</p>
          <span class="cart-price">${priceLabel(h)}</span>
        </div>
        <button class="fav-remove" type="button" aria-label="Tirar ${h.nome} do carrinho"><svg><use href="#i-close" /></svg></button>
      </li>`;
    }).join('');
    withFallback(list);
    const empty = cart.length === 0;
    $('#cartEmpty').hidden = !empty;
    list.hidden = empty;
    $('#cartFoot').hidden = empty;
    $('#cartCount').textContent = cart.length;
    $('#cartWord').textContent = cart.length === 1 ? 'imóvel' : 'imóveis';
    const who = typeof session !== 'undefined' && session?.email ? `\n\nMeu contato: ${session.email}` : '';
    $('#cartZap').href = zapLink(`Olá! Quero seguir com estes imóveis da Morada:\n\n${cart.map((id, k) => {
      const h = HOUSES.find((x) => x.id === id);
      return `${k + 1}. ${h.nome} — ${h.bairro}, ${h.cidade}/${h.uf} — ${priceLabel(h)}`;
    }).join('\n')}${who}`);
  }
  $('#cartList').addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    if (e.target.closest('.fav-remove')) toggleCart(item.dataset.id);
    else if (e.target.closest('.cart-thumb')) openProperty(item.dataset.id);
  });

  /* =========================================================
     04 · Avaliações
     ========================================================= */

  const REVIEW_MS = 7000;
  const bars = $('#avBars');
  let reviewIndex = 0;
  bars.innerHTML = REVIEWS.map((r, k) => `<li><button type="button" aria-label="Avaliação de ${r.nome}"><i style="--dur:${REVIEW_MS}ms"></i></button></li>`).join('');
  $$('button', bars).forEach((b, k) => b.addEventListener('click', () => setReview(k)));

  function fillReview(r) {
    $('#avText').textContent = r.texto;
    $('#avName').textContent = r.nome;
    $('#avCase').textContent = r.casa;
    $('#avIni').textContent = r.ini;
  }
  function setReview(i, instant) {
    i = (i + REVIEWS.length) % REVIEWS.length;
    const card = $('.av-quote');
    if (!instant && i !== reviewIndex) {
      card.classList.add('is-swapping');
      setTimeout(() => { fillReview(REVIEWS[i]); card.classList.remove('is-swapping'); }, reduceMotion ? 0 : 380);
    } else {
      fillReview(REVIEWS[i]);
    }
    reviewIndex = i;
    restartReviewTimer();
  }
  function restartReviewTimer() {
    $$('li', bars).forEach((li, k) => {
      li.classList.toggle('is-done', k < reviewIndex);
      $('i', li).classList.remove('is-running');
    });
    if (currentId() !== 'avaliacoes' || reduceMotion) return;
    const bar = $$('i', bars)[reviewIndex];
    void bar.offsetWidth;
    bar.classList.add('is-running');
  }
  bars.addEventListener('animationend', () => setReview(reviewIndex + 1));
  $('#avPrev').addEventListener('click', () => setReview(reviewIndex - 1));
  $('#avNext').addEventListener('click', () => setReview(reviewIndex + 1));
  fillReview(REVIEWS[0]);

  /* =========================================================
     05 · Contato
     ========================================================= */

  const form = $('#contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = $('#f-nome');
    const email = $('#f-email');
    const errors = [];
    $$('.field', form).forEach((f) => f.classList.remove('has-error'));
    if (!nome.value.trim()) { errors.push('seu nome'); nome.closest('.field').classList.add('has-error'); }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { errors.push('um e-mail válido'); email.closest('.field').classList.add('has-error'); }
    if (errors.length) {
      $('#formError').textContent = `Falta preencher ${errors.join(' e ')}.`;
      (errors[0] === 'seu nome' ? nome : email).focus();
      return;
    }
    $('#formError').textContent = '';
    // Aqui entra o envio de verdade (e-mail, WhatsApp ou CRM). Por enquanto a mensagem não sai do navegador.
    $('#doneTitle').textContent = `Obrigado, ${nome.value.trim().split(/\s+/)[0]}!`;
    $('.ct-form-body').style.visibility = 'hidden';
    $('#formDone').hidden = false;
    $('#formAgain').focus({ preventScroll: true });
  });
  $('#formAgain').addEventListener('click', () => {
    form.reset();
    $('#formDone').hidden = true;
    $('.ct-form-body').style.visibility = '';
    $('#f-nome').focus({ preventScroll: true });
  });

  /* =========================================================
     Cenas: cortes, indicador, navegação
     ========================================================= */

  const scenes = $$('.scene');
  const ids = scenes.map((s) => s.id);
  let current = Math.max(0, ids.indexOf(location.hash.slice(1)));
  const enterTimers = new Map();
  // Corte: a cortina leva CUT_MS; a próxima troca já é aceita depois de LOCK_MS.
  const CUT_MS = reduceMotion ? 40 : 850;
  const LOCK_MS = reduceMotion ? 80 : 520;
  let lockUntil = 0;
  let leaving = null;
  let leaveTimer;
  const currentId = () => ids[current];

  function markEntering(scene, dir) {
    clearTimeout(enterTimers.get(scene));
    scene.dataset.dir = dir;
    scene.classList.remove('is-entering');
    void scene.offsetWidth;
    scene.classList.add('is-entering');
    runCounts(scene, dir === 0 ? 1 : 0.55);
    enterTimers.set(scene, setTimeout(() => scene.classList.remove('is-entering'), dir === 0 ? 3200 : 2400));
  }

  function go(target) {
    const i = typeof target === 'number' ? target : ids.indexOf(target);
    closeOverlays();
    if (i < 0 || i >= scenes.length || i === current) return false;
    const now = performance.now();
    if (now < lockUntil) return false;
    lockUntil = now + LOCK_MS;

    // se ainda havia um corte terminando, encerra na hora
    if (leaving) { clearTimeout(leaveTimer); leaving.classList.remove('is-leaving'); }

    const dir = i > current ? 1 : -1;
    const from = scenes[current];
    const to = scenes[i];
    clearTimeout(enterTimers.get(from));
    from.classList.remove('is-active', 'is-entering');
    from.classList.add('is-leaving');
    to.classList.add('is-active');
    markEntering(to, dir);
    document.body.classList.remove('is-cutting');
    void document.body.offsetWidth;
    if (!reduceMotion) document.body.classList.add('is-cutting');
    current = i;
    sceneChanged();
    leaving = from;
    leaveTimer = setTimeout(() => {
      from.classList.remove('is-leaving');
      document.body.classList.remove('is-cutting');
      leaving = null;
    }, CUT_MS);
    return true;
  }

  function sceneChanged() {
    const scene = scenes[current];
    const id = scene.id;
    scenes.forEach((s, k) => { s.inert = k !== current; s.setAttribute('aria-hidden', String(k !== current)); });
    document.body.dataset.tone = scene.dataset.tone || 'light';
    document.body.dataset.scene = id;
    document.title = id === 'inicio' ? 'Morada — Casas selecionadas' : `${scene.dataset.title} — Morada`;
    try { history.replaceState(null, '', `#${id}`); } catch (_) { /* file:// em alguns navegadores */ }

    // menu superior
    const pill = $('.nav-pill');
    const link = $(`.nav-pill a[data-go="${id}"]`);
    $$('.nav-pill a').forEach((a) => a.classList.toggle('is-active', a === link));
    $$('.nav-pill a').forEach((a) => (a === link ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    pill.classList.toggle('has-active', !!link);
    moveGlider();

    // indicador
    $('.ind-num').textContent = pad(current + 1);
    $('.ind-label').textContent = scene.dataset.title;
    $$('.ind-ticks button').forEach((b, k) => {
      b.classList.toggle('is-active', k === current);
      b.toggleAttribute('aria-current', k === current);
    });
    $$('.menu-links a').forEach((a) => a.classList.toggle('is-active', a.dataset.go === id));

    restartReviewTimer();
    updateImNav();
  }

  function moveGlider() {
    const link = $('.nav-pill a.is-active');
    const glider = $('.nav-glider');
    if (!link) return;
    glider.style.setProperty('--gx', `${link.offsetLeft}px`);
    glider.style.width = `${link.offsetWidth}px`;
    // no celular a barra pode rolar para o lado: centraliza a seção ativa
    const pill = link.parentElement;
    if (pill.scrollWidth > pill.clientWidth) {
      pill.scrollTo({ left: link.offsetLeft - (pill.clientWidth - link.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  addEventListener('resize', moveGlider);
  document.fonts?.ready.then(moveGlider);

  // primeira cena (a animação de entrada só roda depois do login)
  scenes[current].classList.add('is-active');
  sceneChanged();

  function playIntro() {
    document.body.classList.add('is-intro');
    markEntering(scenes[current], 0);
    setTimeout(() => document.body.classList.remove('is-intro'), 3200);
  }

  /* =========================================================
     Entrada: apresentação + login de teste (qualquer e-mail e senha entram)
     ========================================================= */

  const SESSION_KEY = 'morada:sessao';
  const gate = $('#gate');
  const gateForm = $('#gateForm');
  let gated = true;
  let session = null;
  try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { /* sem armazenamento */ }

  function lockSite(on) {
    gated = on;
    document.body.classList.toggle('is-gated', on);
    ['.scenes', '.topbar', '.indicator'].forEach((sel) => { $(sel).inert = on; });
  }

  function showGate() {
    closeOverlays(true);
    lockSite(true);
    gateForm.reset();
    $('#gateError').textContent = '';
    $('#gateBtn span').textContent = 'Entrar na Morada';
    $('#gateBtn').disabled = false;
    gate.hidden = false;
    gate.classList.remove('is-leaving', 'is-in');
    void gate.offsetWidth;
    gate.classList.add('is-in');
    runCounts(gate);
    setTimeout(() => $('#g-email').focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }

  function enterSite(email) {
    session = { email };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) { /* ignora */ }
    $('#accEmail').textContent = email;
    lockSite(false);
    gate.classList.add('is-leaving');
    playIntro();
    setTimeout(() => { gate.hidden = true; gate.classList.remove('is-leaving', 'is-in'); }, reduceMotion ? 0 : 1300);
  }

  gateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#g-email').value.trim();
    const senha = $('#g-senha').value;
    if (!email || !senha) {
      $('#gateError').textContent = 'Digite um e-mail e uma senha (qualquer um serve).';
      (!email ? $('#g-email') : $('#g-senha')).focus();
      return;
    }
    $('#gateError').textContent = '';
    $('#gateBtn').disabled = true;
    $('#gateBtn span').textContent = 'Entrando…';
    setTimeout(() => enterSite(email), reduceMotion ? 0 : 550);
  });

  $('#gatePass').addEventListener('click', (e) => {
    const input = $('#g-senha');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.textContent = show ? 'Ocultar' : 'Mostrar';
    e.currentTarget.setAttribute('aria-pressed', String(show));
  });

  $('#logoutBtn').addEventListener('click', () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) { /* ignora */ }
    session = null;
    showGate();
  });


  addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (ids.includes(id)) go(id);
  });

  // cliques em qualquer [data-go] / [data-open] / [data-close]
  document.addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    if (goEl) {
      e.preventDefault();
      if (goEl.dataset.house) openProperty(goEl.dataset.house, goEl);
      else go(goEl.dataset.go);
      return;
    }
    const openEl = e.target.closest('[data-open]');
    if (openEl) { openOverlay(openEl.dataset.open, openEl); return; }
    if (e.target.closest('[data-close]')) closeOverlays();
  });

  // roda do mouse / trackpad: um gesto = um corte.
  // A inércia do trackpad (valores que só diminuem) é ignorada; um gesto novo
  // (valor que volta a subir, pausa, ou roda de mouse com passos iguais) corta na hora.
  let lastWheel = 0;
  let wheelSum = 0;
  const recent = [];
  addEventListener('wheel', (e) => {
    if (openName || gated) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    const d = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? innerHeight : 1);
    const abs = Math.abs(d);
    const gap = now - lastWheel;
    lastWheel = now;
    if (gap > 150) recent.length = 0;
    const prev = recent[recent.length - 1] ?? 0;
    recent.push(abs);
    if (recent.length > 6) recent.shift();

    const decaying = recent.length >= 4 &&
      recent.every((v, k) => k === 0 || v <= recent[k - 1] + 0.5) &&
      recent[recent.length - 1] < recent[0] * 0.85;
    const fresh = gap > 150 || abs > prev * 1.25 + 2 || (!decaying && abs > 6);

    if (now < lockUntil || !fresh) { wheelSum = 0; return; }
    if (wheelSum && Math.sign(wheelSum) !== Math.sign(d)) wheelSum = 0;
    wheelSum += d;
    if (Math.abs(wheelSum) > 28) {
      wheelSum = 0;
      go(current + Math.sign(d));
    }
  }, { passive: false });

  // toque: deslizar para cima/baixo troca de cena
  let touchY = null;
  let touchX = 0;
  addEventListener('touchstart', (e) => {
    if (openName || gated) { touchY = null; return; }
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (!gated && !e.target.closest('.detail, .im-grid, .im-filters, .nav-pill, .mv-grid, .mv-bar, .search-results, .search-filters, .tab-panel, textarea')) e.preventDefault();
  }, { passive: false });
  addEventListener('touchend', (e) => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    const dx = touchX - e.changedTouches[0].clientX;
    touchY = null;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.3) go(current + (dy > 0 ? 1 : -1));
  }, { passive: true });

  // teclado
  addEventListener('keydown', (e) => {
    if (gated) return;
    if (e.key === 'Escape') { closeOverlays(); return; }
    if (openName) { if (e.key === 'Tab') trapFocus(e); return; }
    if (e.target.closest('input, textarea, select')) return;
    const onControl = e.target.closest('button, a');
    const k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !onControl)) { e.preventDefault(); go(current + 1); }
    else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); go(current - 1); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(scenes.length - 1);
    else if (k === 'ArrowRight' || k === 'ArrowLeft') {
      const step = k === 'ArrowRight' ? 1 : -1;
      if (currentId() === 'curadoria') scrollIm(step);
      if (currentId() === 'avaliacoes') setReview(reviewIndex + step);
    }
  });

  /* =========================================================
     Painéis: menu, busca, conta
     ========================================================= */

  const overlays = { menu: $('#menu'), search: $('#search'), account: $('#account'), detail: $('#detail') };
  let openName = null;
  let lastFocus = null;
  let closeTimer;

  function openOverlay(name, trigger) {
    if (openName === name) { closeOverlays(); return; }
    if (openName) closeOverlays(true);
    const el = overlays[name];
    lastFocus = trigger || document.activeElement;
    if (name === 'menu' && trigger) {
      const r = trigger.getBoundingClientRect();
      el.style.setProperty('--ox', `${r.left + r.width / 2}px`);
      el.style.setProperty('--oy', `${r.top + r.height / 2}px`);
      setPreview(currentId());
    }
    if (name === 'search') runSearch();
    if (name === 'account') renderFavs();
    clearTimeout(closeTimer);
    el.hidden = false;
    document.body.classList.add('has-overlay');
    $('.scenes').inert = true;
    $('.topbar').inert = true;
    $('.indicator').inert = true;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
    openName = name;
    const first = name === 'search' ? $('#q') : name === 'menu' ? $('.menu-links a.is-active', el) || $('.menu-links a', el) : name === 'detail' ? $('.dt-back', el) : $('.tab.is-on', el);
    setTimeout(() => first?.focus({ preventScroll: true }), reduceMotion ? 0 : 60);
  }

  function closeOverlays(instant) {
    if (!openName) return;
    const el = overlays[openName];
    openName = null;
    el.classList.remove('is-open');
    document.body.classList.remove('has-overlay');
    $('.scenes').inert = false;
    $('.topbar').inert = false;
    $('.indicator').inert = false;
    closeTimer = setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, instant || reduceMotion ? 0 : 950);
    if (instant) el.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  function trapFocus(e) {
    const el = overlays[openName];
    const items = $$('a[href], button:not([tabindex="-1"]), input, select, textarea', el).filter((x) => !x.closest('[hidden]') && x.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // menu: prévia muda conforme o link
  $$('.menu-links a').forEach((a, k) => {
    a.style.setProperty('--k', k);
    const show = () => setPreview(a.dataset.preview);
    a.addEventListener('mouseenter', show);
    a.addEventListener('focus', show);
  });
  function setPreview(id) {
    $('.menu-preview-img').dataset.previewImg = id;
    $('#menuCaption').textContent = PREVIEW[id];
  }

  // busca
  const search = { q: '', city: '', suites: 0 };
  const cities = [...new Set(HOUSES.map((h) => h.cidade))];
  $('#cityChips').innerHTML = [`<button class="chip is-on" type="button" data-city="" aria-pressed="true">Todas as cidades</button>`,
    ...cities.map((c) => `<button class="chip" type="button" data-city="${c}" aria-pressed="false">${c}</button>`)].join('');

  function pickChip(group, btn) {
    $$('.chip', group).forEach((c) => { c.classList.toggle('is-on', c === btn); c.setAttribute('aria-pressed', String(c === btn)); });
  }
  $('#cityChips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    pickChip($('#cityChips'), c);
    search.city = c.dataset.city;
    runSearch();
  });
  $('#suiteChips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    pickChip($('#suiteChips'), c);
    search.suites = Number(c.dataset.suites);
    runSearch();
  });
  $('#q').addEventListener('input', (e) => { search.q = e.target.value; runSearch(); });

  function runSearch() {
    const q = norm(search.q.trim());
    const houses = HOUSES.filter((h) =>
      (!q || norm(`${h.nome} ${TIPOS[h.tipo]} ${h.bairro} ${h.cidade} ${h.uf} ${h.tags.join(' ')} ${h.desc}`).includes(q)) &&
      (!search.city || h.cidade === search.city) &&
      h.suites >= search.suites);
    const products = PRODUCTS.filter((p) => !q || norm(`${p.nome} ${p.mat} ${CATS[p.cat]}`).includes(q));

    const hl = $('#houseResults');
    hl.replaceChildren();
    houses.forEach((h) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hit';
      b.append(houseThumb(h, 'hit-img'));
      b.insertAdjacentHTML('beforeend', `<span><strong>${h.nome}</strong><small>${h.cidade} · ${detailsLine(h)}</small></span><span class="hit-price">${priceLabel(h)}</span>`);
      b.addEventListener('click', () => openProperty(h.id));
      li.append(b);
      hl.append(li);
    });
    if (!houses.length) hl.innerHTML = '<li class="no-hits">Nenhuma casa com esses filtros. Tente outra cidade ou menos suítes.</li>';

    $('#productResults').innerHTML = products.length
      ? products.map((p) => `<li><button class="hit" type="button" data-product="${p.id}"><span class="hit-img" style="background:${p.bg}">${productArt(p)}</span><span><strong>${p.nome}</strong><small>${p.mat}</small></span><span class="hit-price">${brl.format(p.preco)}</span></button></li>`).join('')
      : '<li class="no-hits">Nenhuma peça encontrada.</li>';
    $('#houseHits').textContent = `· ${houses.length}`;
    $('#productHits').textContent = `· ${products.length}`;
  }
  $('#productResults').addEventListener('click', (e) => {
    const b = e.target.closest('[data-product]');
    if (!b) return;
    const id = b.dataset.product;
    go('moveis');
    setTimeout(() => flashProduct(id), reduceMotion ? 0 : 900);
  });

  // conta: abas e favoritos
  function showTab(name) {
    $$('.tab').forEach((x) => { const on = x.dataset.tab === name; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', String(on)); });
    $$('.tab-panel').forEach((p) => { p.hidden = p.dataset.panel !== name; });
  }
  $$('.tab').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));

  // atalhos do menu (celular): buscar, conta, carrinho
  $('.menu-actions').addEventListener('click', (e) => {
    const b = e.target.closest('[data-menu-action]');
    if (!b) return;
    const trigger = $('.dots-btn');
    if (b.dataset.menuAction === 'search') { openOverlay('search', trigger); return; }
    openOverlay('account', trigger);
    showTab(b.dataset.menuAction);
  });

  function renderFavs() {
    const list = $('#favList');
    list.replaceChildren();
    favs.houses.forEach((id) => {
      const h = HOUSES.find((x) => x.id === id);
      if (!h) return;
      const li = document.createElement('li');
      li.className = 'fav-item';
      li.append(houseThumb(h, 'hit-img'));
      li.insertAdjacentHTML('beforeend', `<span><strong>${h.nome}</strong><small>${h.cidade} · ${priceLabel(h)}</small></span><button class="fav-remove" type="button" aria-label="Remover ${h.nome}"><svg><use href="#i-close" /></svg></button>`);
      li.querySelector('.hit-img').addEventListener('click', () => openProperty(h.id));
      li.querySelector('.fav-remove').addEventListener('click', () => toggleFav('houses', id));
      list.append(li);
    });
    favs.products.forEach((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return;
      const li = document.createElement('li');
      li.className = 'fav-item';
      li.innerHTML = `<span class="hit-img" style="background:${p.bg}">${productArt(p)}</span><span><strong>${p.nome}</strong><small>${brl.format(p.preco)}</small></span><button class="fav-remove" type="button" aria-label="Remover ${p.nome}"><svg><use href="#i-close" /></svg></button>`;
      li.querySelector('.hit-img').addEventListener('click', () => { go('moveis'); setTimeout(() => flashProduct(id), 900); });
      li.querySelector('.fav-remove').addEventListener('click', () => toggleFav('products', id));
      list.append(li);
    });
    const empty = !favs.houses.length && !favs.products.length;
    $('#favEmpty').hidden = !empty;
    list.hidden = empty;
  }


  /* =========================================================
     Parallax leve com o mouse (casa e título em profundidades diferentes)
     ========================================================= */

  if (!reduceMotion) {
    let tx = 0, ty = 0, mx = 0, my = 0, raf = 0;
    const tick = () => {
      mx += (tx - mx) * 0.07;
      my += (ty - my) * 0.07;
      const s = scenes[current];
      s.style.setProperty('--mx', mx.toFixed(4));
      s.style.setProperty('--my', my.toFixed(4));
      raf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  syncFavUI();
  syncCartUI();
  runSearch();

  // Carregamento: logo + barra até a página ficar pronta (mínimo 1,2 s, máximo 2,5 s).
  // Depois abre a entrada, ou direto a hero se já entrou nesta aba.
  if (session?.email) {
    $('#accEmail').textContent = session.email;
    gate.hidden = true;
  }
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else addEventListener('load', resolve, { once: true });
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  Promise.race([Promise.all([pageLoaded, wait(1200)]), wait(2500)]).then(() => {
    const pre = $('#preloader');
    pre.classList.add('is-done');
    setTimeout(() => { pre.hidden = true; }, 800);
    if (session?.email) {
      lockSite(false);
      playIntro();
    } else {
      showGate();
    }
  });
})();
