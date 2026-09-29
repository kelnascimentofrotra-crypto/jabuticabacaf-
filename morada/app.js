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

  const HOUSES = [
    { id: 'patio', nome: 'Casa Pátio', cidade: 'São Paulo', uf: 'SP', area: 420, suites: 4, vagas: 4, terreno: 900, preco: 'R$ 6,8 mi',
      tags: ['Térrea', 'Piscina', 'Jardim tropical'], img: null,
      desc: 'Laje de concreto aparente, pilar de pedra e uma sala que se abre inteira para a piscina.' },
    { id: 'mirante', nome: 'Casa Mirante', cidade: 'Ilhabela', uf: 'SP', area: 380, suites: 3, vagas: 3, terreno: 1200, preco: 'R$ 5,2 mi',
      tags: ['Vista para o mar', 'Varandas'], img: '1600596542815-ffad4c1539a9',
      desc: 'Varandas profundas voltadas para o canal e madeira certificada em toda a fachada.' },
    { id: 'jequitiba', nome: 'Casa Jequitibá', cidade: 'Trancoso', uf: 'BA', area: 510, suites: 5, vagas: 4, terreno: 2400, preco: 'R$ 9,4 mi',
      tags: ['Condomínio', 'Piscina aquecida'], img: '1512917774080-9991f1c4c750',
      desc: 'Cinco suítes em volta de um pátio sombreado, a dez minutos do Quadrado.' },
    { id: 'brisa', nome: 'Casa Brisa', cidade: 'Florianópolis', uf: 'SC', area: 300, suites: 3, vagas: 2, terreno: 750, preco: 'R$ 4,1 mi',
      tags: ['Perto da praia', 'Deck'], img: '1600585154340-be6161a56a0c',
      desc: 'Volumes brancos, ventilação cruzada e um deck que termina na restinga.' },
    { id: 'seixo', nome: 'Casa Seixo', cidade: 'Nova Lima', uf: 'MG', area: 460, suites: 4, vagas: 4, terreno: 1500, preco: 'R$ 5,9 mi',
      tags: ['Vista para a serra', 'Pedra local'], img: '1580587771525-78b9dba3b914',
      desc: 'Pedra da região, grandes panos de vidro e a serra inteira na janela da sala.' },
    { id: 'lume', nome: 'Casa Lume', cidade: 'Campos do Jordão', uf: 'SP', area: 350, suites: 4, vagas: 3, terreno: 1100, preco: 'R$ 4,7 mi',
      tags: ['Lareira', 'Pé-direito duplo'], img: '1564013799919-ab600027ffc6',
      desc: 'Lareira central, pé-direito duplo e luz de fim de tarde o ano inteiro.' },
  ];

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
    { nome: 'Marina Duarte', ini: 'MD', casa: 'Comprou a Casa Mirante · Ilhabela',
      texto: 'A Morada entendeu o que a gente queria antes de nós mesmos. Visitamos três casas, e a terceira já era a nossa.' },
    { nome: 'Rafael Nogueira', ini: 'RN', casa: 'Comprou a Casa Seixo · Nova Lima',
      texto: 'Cada casa vinha com projeto, história e documentação em dia. Nenhuma surpresa na hora da escritura.' },
    { nome: 'Helena e Caio Prado', ini: 'HC', casa: 'Mobiliaram a Casa Brisa · Florianópolis',
      texto: 'Chegamos só com as malas. A casa já estava mobiliada com a coleção, e o primeiro jantar foi na Mesa Laje.' },
    { nome: 'Tomás Almeida', ini: 'TA', casa: 'Vendeu a casa com a Morada · São Paulo',
      texto: 'As visitas eram marcadas no fim da tarde, para mostrar a luz real da casa. Vendemos em seis semanas.' },
  ];

  const PREVIEW = {
    inicio: 'Casas selecionadas para um jeito único de viver',
    moveis: 'Coleção 2026 em freijó, linho, pedra e latão',
    curadoria: `${pad(HOUSES.length)} casas visitadas pessoalmente pela equipe`,
    avaliacoes: '4,9 de média em 312 avaliações',
    contato: 'Um curador responde em até um dia útil',
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
    const badge = $('.fav-count');
    badge.textContent = total;
    badge.hidden = total === 0;
    $('#favTabCount').textContent = total;
    $('#cuFav').setAttribute('aria-pressed', String(isFav('houses', HOUSES[houseIndex].id)));
    $$('.pc-add').forEach((b) => {
      const on = isFav('products', b.dataset.id);
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = `<svg><use href="#${on ? 'i-check' : 'i-plus'}" /></svg>`;
    });
    renderFavs();
  }

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
      <span class="pc-tag">${CATS[p.cat]}</span>
      <div class="pc-art">${productArt(p)}</div>
      <div class="pc-info">
        <h3>${p.nome}</h3>
        <p>${p.mat}</p>
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
     03 · Curadoria
     ========================================================= */

  const frames = $('#cuFrames');
  const thumbs = $('#cuThumbs');
  const HOUSE_MS = 8000;
  let houseIndex = 0;

  HOUSES.forEach((h, i) => {
    const f = document.createElement('div');
    f.className = 'cu-frame' + (h.img ? '' : ' is-local') + (i === 0 ? ' is-current' : '');
    f.append(houseImg(h, 1800, `${h.nome}, ${h.cidade}`));
    const tags = document.createElement('ul');
    tags.className = 'cu-frame-tags';
    tags.innerHTML = h.tags.map((t) => `<li>${t}</li>`).join('');
    f.append(tags);
    frames.append(f);

    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = h.img ? '' : 'is-local';
    b.setAttribute('aria-label', `${h.nome}, ${h.cidade}`);
    b.append(houseImg(h, 320));
    b.addEventListener('click', () => setHouse(i));
    li.append(b);
    thumbs.append(li);
  });
  $('#cuTotal').textContent = pad(HOUSES.length);
  $('#cuCount').textContent = pad(HOUSES.length);

  function fillHouse(h) {
    $('#cuName').innerHTML = h.nome.replace(/^Casa /, 'Casa <br />');
    $('#cuPlace').textContent = `${h.cidade} · ${h.uf}`;
    $('#cuDesc').textContent = h.desc;
    $('#cuSpecs').innerHTML = `
      <div><dt>Área</dt><dd>${h.area} m²</dd></div>
      <div><dt>Suítes</dt><dd>${h.suites}</dd></div>
      <div><dt>Vagas</dt><dd>${h.vagas}</dd></div>
      <div><dt>Terreno</dt><dd>${h.terreno.toLocaleString('pt-BR')} m²</dd></div>`;
    $('#cuPrice').textContent = h.preco;
  }

  function setHouse(i, dir) {
    i = (i + HOUSES.length) % HOUSES.length;
    if (i === houseIndex) { restartHouseTimer(); return; }
    dir = dir ?? (i > houseIndex ? 1 : -1);
    const all = $$('.cu-frame', frames);
    const prev = all[houseIndex];
    const next = all[i];
    all.forEach((f) => f.classList.remove('is-prev', 'is-in', 'from-left'));
    prev.classList.remove('is-current');
    prev.classList.add('is-prev');
    next.classList.add('is-current', 'is-in');
    if (dir < 0) next.classList.add('from-left');
    setTimeout(() => { if (!prev.classList.contains('is-current')) prev.classList.remove('is-prev'); }, 1250);

    const swapping = [$('.cu-text'), $('#cuSpecs'), $('.cu-price')];
    swapping.forEach((el) => el.classList.add('is-swapping'));
    setTimeout(() => {
      fillHouse(HOUSES[i]);
      swapping.forEach((el) => el.classList.remove('is-swapping'));
    }, reduceMotion ? 0 : 320);

    houseIndex = i;
    $$('button', thumbs).forEach((b, k) => b.classList.toggle('is-active', k === i));
    $('#cuIndex').textContent = pad(i + 1);
    syncFavUI();
    restartHouseTimer();
  }

  const houseProgress = $('#cuProgress');
  houseProgress.style.setProperty('--dur', `${HOUSE_MS}ms`);
  function restartHouseTimer() {
    houseProgress.classList.remove('is-running');
    if (currentId() !== 'curadoria' || reduceMotion) return;
    void houseProgress.offsetWidth;
    houseProgress.classList.add('is-running');
  }
  houseProgress.addEventListener('animationend', () => setHouse(houseIndex + 1, 1));

  $('#cuPrev').addEventListener('click', () => setHouse(houseIndex - 1, -1));
  $('#cuNext').addEventListener('click', () => setHouse(houseIndex + 1, 1));
  $('#cuFav').addEventListener('click', () => toggleFav('houses', HOUSES[houseIndex].id));
  $('#cuVisit').addEventListener('click', () => scheduleVisit(HOUSES[houseIndex].id));

  fillHouse(HOUSES[0]);
  $$('button', thumbs)[0].classList.add('is-active');

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
  const casaSelect = $('#f-casa');
  HOUSES.forEach((h) => casaSelect.add(new Option(`${h.nome} · ${h.cidade}`, h.id)));

  function scheduleVisit(houseId) {
    casaSelect.value = houseId;
    $('#f-interesse').value = 'Comprar uma casa';
    go('contato');
    setTimeout(() => $('#f-nome').focus({ preventScroll: true }), reduceMotion ? 0 : 1200);
  }

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

    restartHouseTimer();
    restartReviewTimer();
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

  // primeira cena
  scenes[current].classList.add('is-active');
  markEntering(scenes[current], 0);
  sceneChanged();
  setTimeout(() => document.body.classList.remove('is-intro'), 3200);

  addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (ids.includes(id)) go(id);
  });

  // cliques em qualquer [data-go] / [data-open] / [data-close]
  document.addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    if (goEl) {
      e.preventDefault();
      const houseId = goEl.dataset.house;
      go(goEl.dataset.go);
      if (houseId) setHouse(HOUSES.findIndex((h) => h.id === houseId));
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
    if (openName) return;
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
    if (openName) { touchY = null; return; }
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (!e.target.closest('.nav-pill, .mv-grid, .mv-bar, .search-results, .search-filters, .tab-panel, textarea')) e.preventDefault();
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
      if (currentId() === 'curadoria') setHouse(houseIndex + step, step);
      if (currentId() === 'avaliacoes') setReview(reviewIndex + step);
    }
  });

  /* =========================================================
     Painéis: menu, busca, conta
     ========================================================= */

  const overlays = { menu: $('#menu'), search: $('#search'), account: $('#account') };
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
    const first = name === 'search' ? $('#q') : name === 'menu' ? $('.menu-links a.is-active', el) || $('.menu-links a', el) : $('.tab.is-on', el);
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
      (!q || norm(`${h.nome} ${h.cidade} ${h.uf} ${h.tags.join(' ')} ${h.desc}`).includes(q)) &&
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
      b.insertAdjacentHTML('beforeend', `<span><strong>${h.nome}</strong><small>${h.cidade} · ${h.area} m² · ${h.suites} suítes</small></span><span class="hit-price">${h.preco}</span>`);
      b.addEventListener('click', () => { go('curadoria'); setHouse(HOUSES.indexOf(h)); });
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
  $$('.tab').forEach((t) => t.addEventListener('click', () => {
    $$('.tab').forEach((x) => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-selected', String(x === t)); });
    $$('.tab-panel').forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; });
  }));

  function renderFavs() {
    const list = $('#favList');
    list.replaceChildren();
    favs.houses.forEach((id) => {
      const h = HOUSES.find((x) => x.id === id);
      if (!h) return;
      const li = document.createElement('li');
      li.className = 'fav-item';
      li.append(houseThumb(h, 'hit-img'));
      li.insertAdjacentHTML('beforeend', `<span><strong>${h.nome}</strong><small>${h.cidade} · ${h.preco}</small></span><button class="fav-remove" type="button" aria-label="Remover ${h.nome}"><svg><use href="#i-close" /></svg></button>`);
      li.querySelector('.hit-img').addEventListener('click', () => { go('curadoria'); setHouse(HOUSES.indexOf(h)); });
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

  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#l-email').value.trim();
    const senha = $('#l-senha').value;
    $('#loginNote').textContent = !/^\S+@\S+\.\S+$/.test(email) || !senha
      ? 'Preencha e-mail e senha para entrar.'
      : 'A área de clientes ainda não está no ar. Fale com a gente pelo contato.';
  });

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
  runSearch();
})();
