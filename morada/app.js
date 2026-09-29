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
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =========================================================
     Dados do site
     Imóveis, fotos, avaliações e contatos vêm do Supabase (editados no painel /admin).
     Os exemplos abaixo só aparecem quando o Supabase ainda não foi configurado
     (por exemplo, com o arquivo aberto direto do computador).
     ========================================================= */

  // Número do WhatsApp que recebe os pedidos: só dígitos, com DDI e DDD (ex.: '5511999999999').
  // Vem de Configurações no painel. Vazio = o WhatsApp abre e a pessoa escolhe o contato.
  let WHATSAPP = '';
  let SB = null;            // { url, anonKey } quando o Supabase está configurado
  let HOUSES = [];          // imóveis mostrados no site
  let catalogReady = false; // os imóveis já chegaram?

  const EXEMPLO_IMOVEIS = [
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
  const TIPOS = { casa: 'Casa', apartamento: 'Apartamento', terreno: 'Terreno', comercial: 'Comercial', outros: 'Imóvel' };
  const STATUS = { vendido: 'Vendido', alugado: 'Alugado' };
  const compact = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });
  const priceLabel = (h) => (h.negocio === 'aluguel' ? `${brl.format(h.preco)}/mês` : compact.format(h.preco));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const dorms = (h) => Math.max(h.quartos || 0, h.suites || 0);
  const roomsText = (h) => (h.suites ? plural(h.suites, 'suíte', 'suítes') : h.quartos ? plural(h.quartos, 'quarto', 'quartos') : '');
  const areaText = (h) => (h.area ? `${h.area.toLocaleString('pt-BR')} m²` : '');
  const isAvailable = (h) => !h.status || h.status === 'disponivel';
  const typeLine = (h) => (h.tipo === 'terreno'
    ? ['Terreno', areaText(h)].filter(Boolean).join(' — ')
    : [TIPOS[h.tipo] || 'Imóvel', roomsText(h)].filter(Boolean).join(' — '));
  const detailsLine = (h) => (h.tipo === 'terreno'
    ? [h.frente ? `${h.frente.toLocaleString('pt-BR')} m de frente` : '', h.topografia, !h.frente && !h.topografia ? areaText(h) : ''].filter(Boolean).join(' · ')
    : [areaText(h), roomsText(h), h.vagas ? plural(h.vagas, 'vaga', 'vagas') : ''].filter(Boolean).join(' · '));
  const zapLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const TERRAIN = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.4"><path d="M-10 60C80 40 160 90 250 70s130-30 170-10"/><path d="M-10 100c100-20 180 30 270 10s130-30 160-10"/><path d="M-10 140c110-20 190 30 280 10s120-30 150-10"/><path d="M-10 180c120-20 200 30 290 10s110-30 140-10"/><path d="M-10 220c130-20 210 30 300 10s100-30 130-10"/><path d="M-10 260c140-20 220 30 310 10s90-30 120-10"/></g><path d="M110 70 300 90l20 140-230-15z" fill="rgba(255,255,255,.1)" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/><g fill="rgba(30,50,25,.5)"><circle cx="60" cy="250" r="16"/><circle cx="86" cy="263" r="11"/><circle cx="340" cy="60" r="18"/><circle cx="366" cy="80" r="12"/><circle cx="352" cy="252" r="14"/></g></svg>';

  const CATS = { sala: 'Sala', jantar: 'Jantar', iluminacao: 'Iluminação', quarto: 'Quarto' };
  const brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

  Object.assign(ART, {
    lina: ART.ilha,
    aurora: ART.oca,
    nara: '<ellipse class="shadow" cx="100" cy="162" rx="80" ry="8"/><path class="fill" d="M52 116h14v40H52zM134 116h14v40h-14zM80 122h12v36H80zM108 122h12v36h-12z"/><path class="fill2" d="M30 110v9c0 9 31 16 70 16s70-7 70-16v-9"/><ellipse class="fill2" cx="100" cy="110" rx="70" ry="16"/><path class="fill" d="M92 104c-6-4-8-12-2-20h20c6 8 4 16-2 20z"/><rect class="fill" x="118" y="100" width="30" height="7" rx="2"/>',
    iris: '<ellipse class="shadow" cx="100" cy="166" rx="86" ry="7"/><path class="wood" d="M44 112l-6 50M58 112l2 50M142 112l-2 50M156 112l6 50"/><rect class="fill" x="28" y="66" width="36" height="50" rx="7"/><rect class="fill" x="136" y="66" width="36" height="50" rx="7"/><path class="fill" d="M90 100h20l7 60H83z"/><rect class="fill2" x="46" y="90" width="108" height="11" rx="3"/><path class="fill" d="M94 90c-3-8 0-16 6-18 6 2 9 10 6 18z"/>',
    caete: '<path class="glow" d="M64 104 34 188h132l-30-84z"/><ellipse class="shadow" cx="100" cy="174" rx="44" ry="6"/><path class="fill" d="M84 170c-10-10-10-34 0-48h32c10 14 10 38 0 48z"/><rect class="fill" x="95" y="104" width="10" height="20"/><path class="fill2" d="M64 108 72 44h56l8 64z"/><ellipse class="bulb" cx="100" cy="110" rx="20" ry="4"/>',
    sereno: '<ellipse class="shadow" cx="100" cy="168" rx="58" ry="6"/><path class="wood" d="M58 150v16M142 150v16"/><rect class="fill2" x="48" y="92" width="104" height="60" rx="5"/><path class="line" d="M48 122h104"/><rect class="fill" x="89" y="104" width="22" height="4" rx="2"/><rect class="fill" x="89" y="134" width="22" height="4" rx="2"/><rect class="fill" x="112" y="80" width="30" height="7" rx="2"/><rect class="fill" x="116" y="73" width="24" height="7" rx="2"/>',
  });

  const PRODUCTS = [
    { id: 'lina', nome: 'Sofá Lina', cats: ['sala'], preco: 4890, desc: 'Três lugares em linho cru, com base de madeira maciça.', bg: '#eee8df', a: '#f1ebe0', b: '#d8cdbc' },
    { id: 'aurora', nome: 'Poltrona Aurora', cats: ['sala'], preco: 2590, desc: 'Estrutura de madeira e assento em couro natural.', bg: '#efe6da', a: '#c9976a', b: '#b27f55' },
    { id: 'nara', nome: 'Mesa de Centro Nara', cats: ['sala'], preco: 1890, desc: 'Tampo redondo de madeira maciça sobre pés cilíndricos.', bg: '#ece5dc', a: '#b98a5e', b: '#c99a6c' },
    { id: 'iris', nome: 'Mesa de Jantar Íris', cats: ['jantar'], preco: 3790, desc: 'Mesa de madeira para seis lugares, com base central.', bg: '#ebe3d8', a: '#b98a5e', b: '#a0734a' },
    { id: 'caete', nome: 'Abajur Caeté', cats: ['iluminacao', 'quarto'], preco: 690, desc: 'Base de cerâmica e cúpula de linho, com luz quente.', bg: '#f0e6d6', a: '#b48a66', b: '#f3e8d4' },
    { id: 'tabua', nome: 'Cadeira Tábua', cats: ['jantar'], preco: 1190, desc: 'Encosto ripado em freijó maciço.', bg: '#ece3d7', a: '#b98a5e', b: '#a0734a' },
    { id: 'farol', nome: 'Pendente Farol', cats: ['iluminacao'], preco: 1490, desc: 'Cúpula de latão escovado para mesas de jantar.', bg: '#efe6d6', a: '#9c7a45', b: '#caa25d' },
    { id: 'sereno', nome: 'Criado-mudo Sereno', cats: ['quarto'], preco: 1290, desc: 'Duas gavetas, em nogueira com puxadores de couro.', bg: '#ece4da', a: '#cfc6b8', b: '#8f6645' },
    { id: 'ripado', nome: 'Aparador Ripado', cats: ['sala'], preco: 3290, desc: 'Frente ripada em nogueira, com tampo de pedra.', bg: '#ebe3d9', a: '#cfc6b8', b: '#8f6645' },
  ];

  const EXEMPLO_AVALIACOES = [
    { nome: 'Marina Duarte', subtitulo: 'Casa Mirante · Ilhabela', texto: 'Visitamos três casas. A\u00a0terceira já era a nossa.', nota: 5 },
    { nome: 'Rafael Nogueira', subtitulo: 'Casa Seixo · Nova Lima', texto: 'Documentação em dia e nenhuma surpresa na escritura.', nota: 5 },
    { nome: 'Helena e Caio Prado', subtitulo: 'Casa Brisa · Florianópolis', texto: 'Chegamos só com as malas. A casa já estava mobiliada.', nota: 5 },
  ];
  let REVIEWS = [];

  const PREVIEW = {
    arthur: 'Conheça o Arthur, proprietário e corretor',
    inicio: 'Vamos encontrar a sua morada',
    filtro: 'Encontre o imóvel certo em segundos',
    instagram: 'Casas novas toda semana no Instagram',
    curadoria: 'Imóveis selecionados',
    avaliacoes: 'O que dizem nossos clientes',
    contato: 'Resposta em até um dia útil',
  };

  /* =========================================================
     Imagens (foto externa com reserva local)
     ========================================================= */

  const isLocalCasa = (u) => /(^|\/)assets\/casa\.webp$/.test(u || '');
  // Foto do banco: caminho no bucket "imoveis" do Supabase ou URL completa.
  // w = largura desejada; até 700 px usa a miniatura que o painel gera junto (arquivo "-thumb").
  function photoSrc(p, w = 1600) {
    if (!p) return '';
    if (/^https:\/\/images\.unsplash\.com\//.test(p)) return p.replace(/([?&])w=\d+/, `$1w=${w}`);
    if (isLocalCasa(p)) return LOCAL_IMG;
    if (/^(https?:)?\/\//.test(p) || p.startsWith('/') || p.startsWith('data:')) return p;
    if (!SB) return '';
    const path = w <= 700 ? p.replace(/(\.[a-z0-9]+)$/i, '-thumb$1') : p;
    return `${SB.url}/storage/v1/object/public/imoveis/${path.split('/').map(encodeURIComponent).join('/')}`;
  }
  const NO_PHOTO = '<span class="no-photo" aria-hidden="true"><svg><use href="#i-home" /></svg></span>';
  function photoTag(p, w, eager) {
    const src = photoSrc(p, w);
    if (!src) return NO_PHOTO;
    const full = photoSrc(p, 1600);
    return `<img${src === LOCAL_IMG ? ' class="is-local"' : ''} src="${esc(src)}" alt=""${eager ? '' : ' loading="lazy"'} decoding="async" data-fallback${full !== src ? ` data-full="${esc(full)}"` : ''} />`;
  }
  function houseThumb(h, cls) {
    const box = document.createElement('span');
    box.className = cls;
    box.innerHTML = propMedia(h, 320);
    withFallback(box);
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
  const isFav = (kind, id) => !isGuest() && favs[kind].includes(id);

  function toggleFav(kind, id) {
    if (requireLogin('fav', () => toggleFav(kind, id))) return;
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
    renderFavs();
  }

  /* =========================================================
     Contadores: os números sobem de 0 até o valor
     ========================================================= */

  const formatCount = (el, v) => {
    if (el.dataset.empty) return '—';
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
     03 · Imóveis (filtros por tipo e negócio, card abre a página do imóvel)
     ========================================================= */

  // foto que não abriu: tenta a versão grande (se era a miniatura); se nada abrir, fica o fundo neutro
  function withFallback(root) {
    $$('img[data-fallback]', root).forEach((img) => {
      const fail = () => {
        if (img.dataset.full) { const full = img.dataset.full; img.removeAttribute('data-full'); img.src = full; return; }
        img.removeAttribute('data-fallback');
        img.insertAdjacentHTML('afterend', NO_PHOTO);
        img.remove();
      };
      if (img.complete && !img.naturalWidth && img.getAttribute('src')) fail();
      else img.addEventListener('error', function onErr() { fail(); if (img.isConnected) img.addEventListener('error', onErr, { once: true }); }, { once: true });
    });
  }
  function propMedia(h, w, eager) {
    if (!h.foto && h.tipo === 'terreno') return `<span class="terrain">${TERRAIN}</span>`;
    return photoTag(h.foto, w, eager);
  }

  const imGrid = $('#imGrid');
  // escopo: 'destaques' mostra só os imóveis marcados como destaque no painel; 'todos' mostra o catálogo inteiro
  const filters = { escopo: 'destaques', tipo: 'todos', negocio: 'todos', cidade: '', quartos: 0, maxPreco: 0, disponivel: false };
  const SKELETON = Array.from({ length: 4 }, () => '<li class="pcard pcard--skel" aria-hidden="true"><span class="pcard-img"></span><span class="pcard-info"><i></i><i></i><i></i></span></li>').join('');
  imGrid.innerHTML = SKELETON;

  function cardBadges(h) {
    const first = isAvailable(h) ? (h.negocio === 'aluguel' ? 'Aluguel' : 'Venda') : STATUS[h.status];
    return [first, ...(h.selos || []).slice(0, 1)].map((t) => `<span>${esc(t)}</span>`).join('');
  }
  function renderGrid() {
    imGrid.innerHTML = HOUSES.map((h, k) => `
    <li class="pcard${isAvailable(h) ? '' : ' is-off'}" data-id="${esc(h.id)}" data-tipo="${esc(h.tipo)}" data-negocio="${esc(h.negocio)}" style="--k:${k % 8}">
      <button class="pcard-open" type="button" aria-label="Ver ${esc(h.nome)}">
        <span class="pcard-img">${propMedia(h, 700)}
          <span class="pcard-badges">${cardBadges(h)}</span>
        </span>
        <span class="pcard-info">
          <strong>${esc(h.nome)}</strong>
          <small>${esc([h.bairro, h.cidade].filter(Boolean).join(' · '))}</small>
          <span class="pcard-price">${priceLabel(h)}</span>
        </span>
      </button>
      <button class="pcard-fav" type="button" data-id="${esc(h.id)}" aria-pressed="false" aria-label="Salvar ${esc(h.nome)} nos favoritos"><svg><use href="#i-heart" /></svg></button>
      ${isAvailable(h) ? `<button class="pcard-add" type="button" data-id="${esc(h.id)}" aria-pressed="false" aria-label="Adicionar ${esc(h.nome)} ao carrinho"><svg><use href="#i-plus" /></svg></button>` : ''}
    </li>`).join('');
    withFallback(imGrid);
    applyFilters();
  }

  imGrid.addEventListener('click', (e) => {
    const fav = e.target.closest('.pcard-fav');
    if (fav) { toggleFav('houses', fav.dataset.id); return; }
    const add = e.target.closest('.pcard-add');
    if (add) { toggleCart(add.dataset.id); return; }
    const open = e.target.closest('.pcard-open');
    if (open) openProperty(open.closest('.pcard').dataset.id, open);
  });

  // faixas do controle de valor (o último ponto = sem limite)
  const PRICE_STEPS = {
    venda: [100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 800000, 1000000, 1500000, 2000000, 3000000, 4000000, 5000000, 7000000, 10000000, 15000000],
    aluguel: [500, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 25000, 30000, 40000, 50000],
  };
  const priceText = (negocio, v) => (negocio === 'aluguel' ? `${brl.format(v)}/mês` : compact.format(v));

  const matches = (h, f) =>
    (f.escopo !== 'destaques' || h.destaque) &&
    (!f.disponivel || isAvailable(h)) &&
    (f.tipo === 'todos' || h.tipo === f.tipo) &&
    (f.negocio === 'todos' || h.negocio === f.negocio) &&
    (!f.cidade || h.cidade === f.cidade) &&
    (!f.quartos || dorms(h) >= f.quartos) &&
    (!f.maxPreco || h.preco <= f.maxPreco);

  function applyFilters() {
    if (!catalogReady) return;
    let n = 0;
    $$('.pcard[data-id]', imGrid).forEach((el) => {
      const h = HOUSES.find((x) => x.id === el.dataset.id);
      const show = !!h && matches(h, filters);
      el.hidden = !show;
      if (show) n++;
    });
    const extra = [filters.cidade, filters.quartos ? `${filters.quartos}+ quartos` : '', filters.maxPreco ? `até ${priceText(filters.negocio, filters.maxPreco)}` : '', filters.disponivel ? 'disponíveis' : ''].filter(Boolean).join(' · ');
    $('#imExtra').hidden = !extra;
    $('#imExtra').innerHTML = extra ? `${esc(extra)} <svg aria-hidden="true"><use href="#i-close" /></svg>` : '';
    $('#imExtra').setAttribute('aria-label', `Tirar o filtro ${extra}`);
    $('#imCount').textContent = n;
    $('#imWord').textContent = filters.escopo === 'destaques' ? (n === 1 ? 'em destaque' : 'em destaque') : (n === 1 ? 'imóvel' : 'imóveis');
    const noneFlagged = filters.escopo === 'destaques' && !HOUSES.some((h) => h.destaque);
    $('#imEmptyText').textContent = loadError ? 'Não deu para carregar os imóveis agora.' : !HOUSES.length ? 'Ainda não há imóveis publicados.' : noneFlagged ? 'Nenhum imóvel em destaque no momento.' : 'Nenhum imóvel com esses filtros.';
    $('#imReset').textContent = loadError ? 'Tentar de novo' : noneFlagged ? 'Ver todos os imóveis' : 'Limpar filtros';
    $('#imReset').hidden = !loadError && !HOUSES.length;
    $('#imEmpty').hidden = n > 0;
    imGrid.scrollTo?.({ left: 0 });
    updateImNav();
  }
  function setEscopo(escopo) {
    filters.escopo = escopo;
    $('#imExplore').textContent = escopo === 'destaques' ? 'Explorar imóveis' : 'Ver só os destaques';
    $$('.chip', $('#fEscopo')).forEach((x) => { const on = x.dataset.escopo === escopo; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
  }
  $('#fEscopo').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    setEscopo(c.dataset.escopo);
    applyFilters();
  });
  // Tipo: um sempre ligado. Comprar/Alugar: toque liga, toque de novo desliga (mostra os dois).
  $('#fTipo').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    pickChip($('#fTipo'), c);
    filters.tipo = c.dataset.tipo;
    applyFilters();
  });
  $('#fNegocio').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    const off = c.classList.contains('is-on');
    $$('.chip', $('#fNegocio')).forEach((x) => { const on = !off && x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    filters.negocio = off ? 'todos' : c.dataset.negocio;
    applyFilters();
  });
  function resetFilters(escopo = filters.escopo) {
    pickChip($('#fTipo'), $('#fTipo .chip'));
    $$('.chip', $('#fNegocio')).forEach((x) => { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
    Object.assign(filters, { tipo: 'todos', negocio: 'todos', cidade: '', quartos: 0, maxPreco: 0, disponivel: false });
    setEscopo(escopo);
    applyFilters();
  }
  $('#imExtra').addEventListener('click', () => { Object.assign(filters, { cidade: '', quartos: 0, maxPreco: 0, disponivel: false }); applyFilters(); });
  $('#imReset').addEventListener('click', () => loadError ? loadCatalog() : resetFilters(filters.escopo === 'destaques' && !HOUSES.some((h) => h.destaque) ? 'todos' : filters.escopo));
  // "Explorar imóveis" abre o catálogo inteiro; de novo, volta para os destaques (no celular, os chips fazem isso)
  $('#imExplore').addEventListener('click', () => {
    resetFilters(filters.escopo === 'destaques' ? 'todos' : 'destaques');
    $$('.pcard', imGrid).forEach((el) => { el.classList.remove('is-pop'); void el.offsetWidth; el.classList.add('is-pop'); });
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

  // foto grande: só os imóveis marcados como destaque (troca sozinha a cada 7 s; a legenda abre o imóvel)
  let FEATURED = [];
  let featIndex = 0;
  function renderFeatured() {
    FEATURED = HOUSES.filter((h) => h.destaque);
    featIndex = 0;
    $('#imSlides').innerHTML = FEATURED.map((h, k) => `<span class="im-slide${k === 0 ? ' is-current' : ''}">${propMedia(h, 1600, k === 0)}</span>`).join('');
    withFallback($('#imSlides'));
    $('#imDots').innerHTML = FEATURED.length > 1 ? FEATURED.map((h, k) => `<button type="button" class="${k === 0 ? 'is-on' : ''}" aria-pressed="${k === 0}" aria-label="${esc(h.nome)}"></button>`).join('') : '';
    $$('#imDots button').forEach((d, i) => d.addEventListener('click', () => showFeatured(i)));
    $('#imCap').hidden = !FEATURED.length;
    if (FEATURED.length) showFeatured(0);
  }
  function showFeatured(k) {
    if (!FEATURED.length) return;
    featIndex = (k + FEATURED.length) % FEATURED.length;
    const h = FEATURED[featIndex];
    $$('.im-slide').forEach((el, i) => el.classList.toggle('is-current', i === featIndex));
    $$('#imDots button').forEach((d, i) => { d.classList.toggle('is-on', i === featIndex); d.setAttribute('aria-pressed', String(i === featIndex)); });
    $('#imCapName').textContent = h.nome;
    $('#imCapInfo').textContent = [h.cidade, isAvailable(h) ? priceLabel(h) : STATUS[h.status]].filter(Boolean).join(' · ');
    $('#imCap').setAttribute('aria-label', `Ver ${h.nome}`);
  }
  $('#imCap').addEventListener('click', (e) => FEATURED[featIndex] && openProperty(FEATURED[featIndex].id, e.currentTarget));
  setInterval(() => {
    if (!reduceMotion && FEATURED.length > 1 && currentId() === 'curadoria' && !openName && !document.hidden) showFeatured(featIndex + 1);
  }, 7000);

  /* =========================================================
     02 · Filtro (conta na hora e aplica em Destaques)
     ========================================================= */

  const fl = { escopo: 'todos', negocio: 'todos', tipo: 'todos', cidade: '', quartos: 0, maxPreco: 0, disponivel: true };
  function renderFilterOptions() {
    const cities = [...new Set(HOUSES.map((h) => h.cidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    if (fl.cidade && !cities.includes(fl.cidade)) fl.cidade = '';
    $('#flCidade').innerHTML = [`<button class="chip${fl.cidade ? '' : ' is-on'}" type="button" data-v="" aria-pressed="${!fl.cidade}">Todas</button>`,
      ...cities.map((c) => `<button class="chip${fl.cidade === c ? ' is-on' : ''}" type="button" data-v="${esc(c)}" aria-pressed="${fl.cidade === c}">${esc(c)}</button>`)].join('');
    const n = HOUSES.filter(isAvailable).length;
    $('#flCaption').textContent = n ? `${plural(n, 'imóvel disponível', 'imóveis disponíveis')} em ${plural(cities.length, 'cidade', 'cidades')}` : 'Novos imóveis em breve';
    // tipos extras (comercial, outros) só aparecem quando existem imóveis deles
    ['comercial', 'outros'].forEach((t) => {
      const has = HOUSES.some((h) => h.tipo === t);
      $$(`#flTipo [data-v="${t}"], #fTipo [data-tipo="${t}"]`).forEach((b) => { b.hidden = !has; });
    });
  }
  const flGroups = { flNegocio: 'negocio', flTipo: 'tipo', flCidade: 'cidade', flQuartos: 'quartos' };
  Object.entries(flGroups).forEach(([id, key]) => {
    $(`#${id}`).addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      pickChip($(`#${id}`), c);
      fl[key] = key === 'quartos' ? Number(c.dataset.v) : c.dataset.v;
      if (key === 'negocio') resetPrice();
      updateFilterCount();
    });
  });
  const range = $('#flPrice');
  function resetPrice() {
    range.value = range.max;
    range.disabled = fl.negocio === 'todos';
    $('#flPriceHint').hidden = !range.disabled;
    paintPrice();
  }
  function paintPrice() {
    const k = Number(range.value);
    const steps = PRICE_STEPS[fl.negocio];
    fl.maxPreco = steps && k < steps.length ? steps[k] : 0;
    $('#flPriceOut').textContent = fl.maxPreco ? `Até ${priceText(fl.negocio, fl.maxPreco)}` : 'Qualquer valor';
    range.style.setProperty('--fill', `${(k / Number(range.max)) * 100}%`);
    range.setAttribute('aria-valuetext', $('#flPriceOut').textContent);
  }
  range.addEventListener('input', () => { paintPrice(); updateFilterCount(); });

  function updateFilterCount() {
    if (!catalogReady) { $('#flCount').textContent = '…'; $('#flGo').disabled = true; return; }
    const found = HOUSES.filter((h) => matches(h, fl));
    $('#flCount').textContent = found.length;
    $('#flWord').textContent = found.length === 1 ? 'imóvel combina' : 'imóveis combinam';
    $('#flThumbs').innerHTML = found.slice(0, 3).map((h) => `<li>${propMedia(h, 200)}</li>`).join('');
    withFallback($('#flThumbs'));
    $('#flGo').disabled = found.length === 0;
  }
  $('#flClear').addEventListener('click', () => {
    Object.assign(fl, { negocio: 'todos', tipo: 'todos', cidade: '', quartos: 0, maxPreco: 0 });
    Object.keys(flGroups).forEach((id) => pickChip($(`#${id}`), $(`#${id} .chip`)));
    resetPrice();
    updateFilterCount();
  });
  $('#flForm').addEventListener('submit', (e) => {
    e.preventDefault();
    Object.assign(filters, fl);
    setEscopo('todos');
    pickChip($('#fTipo'), $(`#fTipo .chip[data-tipo="${fl.tipo}"]`));
    $$('.chip', $('#fNegocio')).forEach((x) => { const on = x.dataset.negocio === fl.negocio; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    applyFilters();
    go('curadoria');
  });
  resetPrice();
  updateFilterCount();

  /* =========================================================
     04 · Instagram (capas montadas com os imóveis do banco; o link leva ao perfil)
     ========================================================= */

  let INSTAGRAM_URL = 'https://www.instagram.com/';
  function renderReels() {
    const picks = [...HOUSES.filter((h) => h.destaque), ...HOUSES.filter((h) => !h.destaque)].filter((h) => h.foto || h.tipo === 'terreno').slice(0, 6);
    $('#igFollow').href = INSTAGRAM_URL;
    $('#igGrid').innerHTML = picks.map((h, k) => `<li style="--k:${k}"><a class="reel" href="${esc(INSTAGRAM_URL)}" target="_blank" rel="noopener" aria-label="Instagram: ${esc(h.nome)}">
      <span class="reel-media">${propMedia(h, 600)}</span>
      <span class="reel-tag">${esc((h.selos || [])[0] || h.bairro || TIPOS[h.tipo] || '')}</span>
      <span class="reel-ig" aria-hidden="true"><svg><use href="#i-instagram" /></svg></span>
      <span class="reel-cover"><small>${esc([h.cidade, h.uf].filter(Boolean).join(' · '))}</small><strong>${esc(h.nome)}</strong><em>${isAvailable(h) ? priceLabel(h) : STATUS[h.status]}</em></span>
      <span class="reel-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>
      <span class="reel-foot"><svg aria-hidden="true"><use href="#i-instagram" /></svg>Veja no Instagram</span>
    </a></li>`).join('');
    withFallback($('#igGrid'));
  }

  /* =========================================================
     05 · Conheça o Arthur
     ========================================================= */

  $('#arZap').href = zapLink('Olá, Arthur! Vim pelo site da Morada e gostaria de conversar sobre imóveis.');
  // leve movimento da foto seguindo o mouse (só no computador)
  const arPhoto = $('.ar-photo');
  if (!reduceMotion) {
    arPhoto.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = arPhoto.getBoundingClientRect();
      arPhoto.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      arPhoto.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    arPhoto.addEventListener('pointerleave', () => {
      arPhoto.style.setProperty('--tx', 0);
      arPhoto.style.setProperty('--ty', 0);
    });
  }

  /* ---------- Página do imóvel ---------- */

  let dtHouse = null;
  // com uma foto só, a galeria mostra recortes dela; com várias, cada foto é uma tela
  const SHOTS_LOCAL = [['64% 100%', 'cover'], ['58% 64%', '330% auto'], ['62% 96%', '240% auto'], ['76% 52%', '420% auto']];
  const SHOTS_PHOTO = [['50% 50%', 'cover'], ['12% 55%', '230% auto'], ['88% 55%', '230% auto'], ['50% 88%', '200% auto']];
  const photoOk = new Map();
  function resolvePhoto(url) {
    if (photoOk.has(url)) return Promise.resolve(photoOk.get(url));
    return new Promise((resolve) => {
      const test = new Image();
      test.onload = () => { photoOk.set(url, url); resolve(url); };
      test.onerror = () => { photoOk.set(url, ''); resolve(''); };
      test.src = url;
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
    const place = [h.bairro, [h.cidade, h.uf].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
    $('#dtLoc').textContent = h.endereco ? `${h.endereco} · ${place}` : place;
    $('#dtName').textContent = h.nome;
    $('#dtType').textContent = `${typeLine(h)} · ${h.negocio === 'aluguel' ? 'para alugar' : 'à venda'}`;
    $('#dtPrice').textContent = isAvailable(h) ? priceLabel(h) : `${STATUS[h.status]} · ${priceLabel(h)}`;
    const specs = (h.tipo === 'terreno'
      ? [['Área', areaText(h)], ['Frente', h.frente ? `${h.frente.toLocaleString('pt-BR')} m` : ''], ['Topografia', h.topografia]]
      : [['Área', areaText(h)], ['Quartos', h.quartos || ''], ['Suítes', h.suites || ''], ['Banheiros', h.banheiros || ''], ['Vagas', h.vagas || '']])
      .filter(([, v]) => v !== '' && v != null);
    $('#dtSpecs').innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
    $('#dtDesc').textContent = h.desc;
    $('#dtTags').innerHTML = (h.tags || []).map((t) => `<li>${esc(t)}</li>`).join('');
    $('#dtBadges').innerHTML = [isAvailable(h) ? (h.negocio === 'aluguel' ? 'Aluguel' : 'Venda') : STATUS[h.status], ...(h.selos || [])].map((t) => `<span>${esc(t)}</span>`).join('');
    $('#dtZap').href = zapLink(`Olá! Tenho interesse no imóvel ${h.nome} (${[h.bairro, [h.cidade, h.uf].filter(Boolean).join('/')].filter(Boolean).join(', ')}) — ${priceLabel(h)}. Pode me passar mais informações?`);

    const main = $('#dtMain');
    const thumbs = $('#dtThumbs');
    const photos = h.fotos?.length ? h.fotos : h.foto ? [h.foto] : [];
    const bindThumbs = () => $$('button', thumbs).forEach((b, k) => b.addEventListener('click', () => showShot(k)));
    if (!photos.length) {
      main.innerHTML = h.tipo === 'terreno' ? `<div class="dt-shot is-current terrain">${TERRAIN}</div>` : `<div class="dt-shot is-current">${NO_PHOTO}</div>`;
      thumbs.innerHTML = '';
    } else if (photos.length > 1) {
      main.innerHTML = photos.map((p, k) => `<div class="dt-shot${k === 0 ? ' is-current' : ''}" style="${esc(shotStyle(photoSrc(p, 1600), SHOTS_PHOTO[0]))}"></div>`).join('');
      thumbs.innerHTML = photos.map((p, k) => `<li><button type="button" class="${k === 0 ? 'is-active' : ''}" aria-label="Foto ${k + 1}" style="${esc(shotStyle(photoSrc(p, 320), SHOTS_PHOTO[0]))}"></button></li>`).join('');
      bindThumbs();
    } else {
      const url = photoSrc(photos[0], 1600);
      const shots = url === LOCAL_IMG ? SHOTS_LOCAL : SHOTS_PHOTO;
      main.innerHTML = shots.map((_, k) => `<div class="dt-shot${k === 0 ? ' is-current' : ''}"></div>`).join('');
      thumbs.innerHTML = shots.map((_, k) => `<li><button type="button" class="${k === 0 ? 'is-active' : ''}" aria-label="Foto ${k + 1}"></button></li>`).join('');
      bindThumbs();
      resolvePhoto(url).then((ok) => {
        if (dtHouse !== h) return;
        if (!ok) { main.innerHTML = `<div class="dt-shot is-current">${NO_PHOTO}</div>`; thumbs.innerHTML = ''; return; }
        $$('.dt-shot', main).forEach((el, k) => { el.setAttribute('style', shotStyle(ok, shots[k])); });
        $$('button', thumbs).forEach((b, k) => { b.setAttribute('style', shotStyle(ok, shots[k])); });
      });
    }
    syncCartUI();
    syncFavUI();
    openOverlay('detail', trigger);
  }
  $('#dtCart').addEventListener('click', () => dtHouse && toggleCart(dtHouse.id));
  $('#dtFav').addEventListener('click', () => dtHouse && toggleFav('houses', dtHouse.id));

  /* ---------- Carrinho (fica no navegador de quem visita) ---------- */

  let profile = null; // perfil de quem entrou (preenchido no login)
  const CART_KEY = 'morada:carrinho';
  let cart = [];
  function cartEntry(id) {
    if (id.startsWith('p:')) {
      const p = PRODUCTS.find((x) => x.id === id.slice(2));
      return p && { kind: 'peca', id, nome: p.nome, sub: `Peças · ${p.cats.map((c) => CATS[c]).join(', ')}`, desc: p.desc, price: brl2.format(p.preco),
        thumb: `<span class="art-thumb" style="background:${p.bg}">${productArt(p)}</span>`, line: `${p.nome} (peça) — ${brl2.format(p.preco)}` };
    }
    const h = HOUSES.find((x) => x.id === id);
    const where = [h?.bairro, [h?.cidade, h?.uf].filter(Boolean).join('/')].filter(Boolean).join(', ');
    return h && { kind: 'imovel', id, nome: h.nome, sub: [where, typeLine(h), isAvailable(h) ? '' : STATUS[h.status]].filter(Boolean).join(' · '), desc: h.desc,
      price: priceLabel(h), thumb: propMedia(h, 320), line: `${h.nome} — ${where} — ${priceLabel(h)}` };
  }
  // os imóveis chegam do banco depois: o carrinho guarda os ids e só mostra os que existem
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]').filter((id) => typeof id === 'string'); } catch (_) { /* sem armazenamento */ }
  const cartItems = () => cart.map(cartEntry).filter(Boolean);
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) { /* ignora */ } };

  function toggleCart(id) {
    if (requireLogin('cart', () => { if (!cart.includes(id)) toggleCart(id); })) return;
    const on = !cart.includes(id);
    const house = HOUSES.find((x) => x.id === id);
    if (on && house && !isAvailable(house)) { toast(`${house.nome} já foi ${STATUS[house.status].toLowerCase()}.`); return; }
    cart = on ? [...cart, id] : cart.filter((x) => x !== id);
    saveCart();
    const item = cartEntry(id);
    if (item) toast(on ? `${item.nome} foi para o carrinho` : `${item.nome} saiu do carrinho`);
    syncCartUI();
  }

  function syncCartUI() {
    const inCartNow = (id) => !isGuest() && cart.includes(id);
    const n = isGuest() ? 0 : cartItems().length;
    const badge = $('.fav-count');
    badge.textContent = n;
    badge.hidden = n === 0;
    $('#cartTabCount').textContent = n;
    if (dtHouse) {
      const inCart = inCartNow(dtHouse.id);
      const off = !isAvailable(dtHouse) && !inCart;
      $('#dtCart span').textContent = inCart ? 'Remover do carrinho' : off ? `Imóvel ${STATUS[dtHouse.status].toLowerCase()}` : 'Adicionar ao carrinho';
      $('#dtCart').classList.toggle('is-in-cart', inCart);
      $('#dtCart').disabled = off;
    }
    $$('.pcard-add').forEach((b) => {
      const inCart = inCartNow(b.dataset.id);
      const nome = HOUSES.find((x) => x.id === b.dataset.id)?.nome || '';
      b.setAttribute('aria-pressed', String(inCart));
      b.setAttribute('aria-label', inCart ? `Tirar ${nome} do carrinho` : `Adicionar ${nome} ao carrinho`);
      b.innerHTML = `<svg><use href="#${inCart ? 'i-check' : 'i-plus'}" /></svg>`;
    });
    $$('.pc-add').forEach((b) => {
      const inCart = inCartNow(`p:${b.dataset.id}`);
      const nome = PRODUCTS.find((x) => x.id === b.dataset.id).nome;
      b.setAttribute('aria-pressed', String(inCart));
      b.setAttribute('aria-label', inCart ? `Tirar ${nome} do carrinho` : `Adicionar ${nome} ao carrinho`);
      b.innerHTML = `<svg><use href="#${inCart ? 'i-check' : 'i-plus'}" /></svg>`;
    });
    renderCart();
  }

  function renderCart() {
    const list = $('#cartList');
    const items = cartItems();
    list.innerHTML = items.map((it) => `<li class="cart-item" data-id="${esc(it.id)}" data-kind="${it.kind}">
        <button class="cart-thumb" type="button" aria-label="Ver ${esc(it.nome)}">${it.thumb}</button>
        <div class="cart-body">
          <strong>${esc(it.nome)}</strong>
          <small>${esc(it.sub)}</small>
          <p>${esc(it.desc)}</p>
          <span class="cart-price">${it.price}</span>
        </div>
        <button class="fav-remove" type="button" aria-label="Tirar ${esc(it.nome)} do carrinho"><svg><use href="#i-close" /></svg></button>
      </li>`).join('');
    withFallback(list);
    const empty = items.length === 0;
    $('#cartEmpty').hidden = !empty;
    list.hidden = empty;
    $('#cartFoot').hidden = empty;
    $('#cartCount').textContent = items.length;
    $('#cartWord').textContent = items.length === 1 ? 'item' : 'itens';
    const who = profile ? `\n\nMeu contato: ${profile.nome} (${profile.email})` : '';
    $('#cartZap').href = zapLink(`Olá! Quero seguir com estes itens da Morada:\n\n${items.map((it, k) => `${k + 1}. ${it.line}`).join('\n')}${who}`);
  }
  $('#cartList').addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    if (e.target.closest('.fav-remove')) toggleCart(item.dataset.id);
    else if (e.target.closest('.cart-thumb')) {
      if (item.dataset.kind !== 'peca') openProperty(item.dataset.id);
    }
  });

  /* =========================================================
     04 · Avaliações (só as publicadas no painel)
     ========================================================= */

  const REVIEW_MS = 7000;
  const bars = $('#avBars');
  let reviewIndex = 0;
  // arquivos do bucket "site" (logo, fotos das avaliações)
  const siteFile = (p) => (!p ? '' : /^(https?:)?\/\//.test(p) || p.startsWith('/') ? p : SB ? `${SB.url}/storage/v1/object/public/site/${p.split('/').map(encodeURIComponent).join('/')}` : '');

  function renderReviews() {
    reviewIndex = 0;
    bars.innerHTML = REVIEWS.length > 1 ? REVIEWS.map((r) => `<li><button type="button" aria-label="Avaliação de ${esc(r.nome)}"><i style="--dur:${REVIEW_MS}ms"></i></button></li>`).join('') : '';
    $$('button', bars).forEach((b, k) => b.addEventListener('click', () => setReview(k)));
    $('#avPrev').hidden = $('#avNext').hidden = REVIEWS.length < 2;
    const n = REVIEWS.length;
    const avg = n ? Math.round((REVIEWS.reduce((t, r) => t + (r.nota || 5), 0) / n) * 10) / 10 : 0;
    setStat('nota', avg);
    setStat('avaliacoes', n);
    $('.av-score .stars').setAttribute('aria-label', n ? `Nota ${avg.toLocaleString('pt-BR')} de 5` : 'Sem avaliações ainda');
    paintStars($('.av-score .stars'), avg);
    $('.av-count').lastChild.textContent = n === 1 ? ' avaliação' : ' avaliações';
    fillReview(REVIEWS[0] || { texto: 'As primeiras avaliações aparecem aqui em breve.', nome: '', casa: '', ini: '', nota: 0 });
    restartReviewTimer();
  }
  function paintStars(el, nota) {
    $$('svg', el).forEach((s, k) => s.classList.toggle('is-off', k + 0.5 > nota));
  }
  function fillReview(r) {
    $('#avText').textContent = r.texto;
    $('#avName').textContent = r.nome;
    $('#avCase').textContent = r.casa;
    const ava = $('#avIni');
    const foto = siteFile(r.foto);
    ava.textContent = foto ? '' : r.ini;
    ava.style.backgroundImage = foto ? `url("${foto}")` : '';
    ava.classList.toggle('has-photo', !!foto);
    ava.hidden = !r.nome;
    const stars = $('.av-quote .stars');
    stars.hidden = !r.nota;
    stars.setAttribute('aria-label', `${r.nota} de 5`);
    paintStars(stars, r.nota);
  }
  function setReview(i, instant) {
    if (!REVIEWS.length) return;
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
    if (!bar) return;
    void bar.offsetWidth;
    bar.classList.add('is-running');
  }
  bars.addEventListener('animationend', () => setReview(reviewIndex + 1));
  $('#avPrev').addEventListener('click', () => setReview(reviewIndex - 1));
  $('#avNext').addEventListener('click', () => setReview(reviewIndex + 1));

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

  // A hero do celular é escura (foto de fim de tarde): o topo usa cores claras nela
  const mobileMQ = matchMedia('(max-width: 900px), (max-aspect-ratio: 1/1)');
  function updateTone() {
    const scene = scenes[current];
    let tone = scene.dataset.tone || 'light';
    if (scene.id === 'inicio' && mobileMQ.matches) tone = 'dark';
    document.body.dataset.tone = tone;
  }
  mobileMQ.addEventListener?.('change', updateTone);

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
    updateTone();
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
     Entrada: apresentação + contas
     Versão sem servidor: contas, tentativas e pedidos ficam guardados neste navegador.
     ========================================================= */

  // Client ID do Google (console.cloud.google.com → APIs e serviços → Credenciais →
  // "ID do cliente OAuth", tipo "Aplicativo da Web", com o endereço do site em "Origens JavaScript autorizadas").
  // Vazio = o botão avisa que o login com Google ainda não foi ativado.
  const GOOGLE_CLIENT_ID = '';

  // Versão de teste: qualquer e-mail e senha entram (a conta é criada na hora).
  // Troque para false para valer a checagem de senha e o bloqueio de 8 tentativas.
  const MODO_TESTE = true;

  const SESSION_KEY = 'morada:sessao';
  const ACCOUNTS_KEY = 'morada:contas';
  const GUARD_KEY = 'morada:seguranca';
  const MAX_TRIES = 8;          // tentativas erradas seguidas (qualquer e-mail) antes da pausa
  const LOCK_MINUTES = [15, 20]; // 1ª pausa 15 min; as seguintes 20 min

  const gate = $('#gate');
  let gated = true;
  let session = null;
  try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { /* sem armazenamento */ }

  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch (_) { return fallback; }
  };
  const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
  };

  let accounts = readJSON(ACCOUNTS_KEY, {});
  const keyOf = (email) => email.trim().toLowerCase();
  const findAccount = (email) => accounts[keyOf(email)] || null;
  const saveAccounts = () => writeJSON(ACCOUNTS_KEY, accounts);
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const strongEnough = (v) => v.length >= 8 && /\p{L}/u.test(v) && /\d/.test(v);
  const cryptoOk = !!(window.crypto && crypto.subtle);

  // Senha: PBKDF2 (SHA-256, 150 mil voltas) com sal aleatório. Só o resultado fica guardado, nunca a senha.
  const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  async function hashPassword(pass, saltB64) {
    const salt = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 150000 }, key, 256);
    return { salt: toB64(salt), hash: toB64(bits) };
  }
  async function checkPassword(acc, pass) {
    if (!acc?.hash) { await hashPassword(pass); return false; } // mesmo tempo de resposta com ou sem conta
    const { hash } = await hashPassword(pass, acc.salt);
    let diff = hash.length ^ acc.hash.length;
    for (let i = 0; i < Math.min(hash.length, acc.hash.length); i++) diff |= hash.charCodeAt(i) ^ acc.hash.charCodeAt(i);
    return diff === 0;
  }

  /* ---------- Proteção contra tentativas repetidas ---------- */

  let guard = readJSON(GUARD_KEY, { fails: 0, lockUntil: 0, locks: 0 });
  const saveGuard = () => writeJSON(GUARD_KEY, guard);
  const lockedFor = () => Math.max(0, guard.lockUntil - Date.now());
  function registerFail() {
    guard.fails += 1;
    if (guard.fails >= MAX_TRIES) {
      guard.lockUntil = Date.now() + LOCK_MINUTES[Math.min(guard.locks, LOCK_MINUTES.length - 1)] * 60000;
      guard.locks += 1;
      guard.fails = 0;
    }
    saveGuard();
    syncLock();
    return MAX_TRIES - guard.fails;
  }
  function registerSuccess() {
    guard = { fails: 0, lockUntil: 0, locks: 0 };
    saveGuard();
  }
  const triesText = (left) => (left <= 5 ? ` ${left === 1 ? 'Resta 1 tentativa' : `Restam ${left} tentativas`} antes da pausa de segurança.` : '');
  const clock = (ms) => {
    const s = Math.ceil(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  /* ---------- Telas da entrada ---------- */

  let authView = 'login';
  let lockTimer = 0;
  const setGateView = (view) => { gate.dataset.view = view; };

  function syncLock() {
    const ms = lockedFor();
    const blocked = ms > 0 && authView !== 'signup';
    $('#authLock').hidden = !blocked;
    $$('.ga-form', gate).forEach((f) => { f.hidden = blocked || f.dataset.form !== authView; });
    $('.ga-google').hidden = blocked || authView === 'forgot';
    $('.ga-or').hidden = blocked || authView === 'forgot';
    clearTimeout(lockTimer);
    if (ms > 0) {
      $('#lockTime').textContent = clock(ms);
      lockTimer = setTimeout(syncLock, 1000);
    }
  }

  function setAuth(view) {
    authView = view;
    setGateView('auth');
    $$('.ga-tab').forEach((t) => {
      const on = t.dataset.auth === view;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
    });
    $('.ga-tabs').hidden = view === 'forgot';
    $$('.ga-msg', gate).forEach((m) => { m.textContent = ''; m.classList.remove('is-ok'); });
    if (view === 'forgot') forgotStep(1);
    syncLock();
    const first = { login: '#l-email', signup: '#s-nome', forgot: '#f2-email' }[view];
    if (!lockedFor() || view === 'signup') setTimeout(() => $(first)?.focus({ preventScroll: true }), reduceMotion ? 0 : 350);
  }

  gate.addEventListener('click', (e) => {
    const b = e.target.closest('[data-auth]');
    if (!b) return;
    if (b.dataset.fill) $('#l-email').value = $('#s-email').value.trim();
    setAuth(b.dataset.auth);
  });
  $('#gateBack').addEventListener('click', () => setGateView('landing'));

  /* ---------- Apresentação em 3 telas (rolar, deslizar, setas ou pontinhos) ---------- */

  const glSlides = $$('.gl-slide', gate);
  const GL_NEXT = ['Por que criar sua conta', 'Como começar', ''];
  let glIndex = 0;
  let glLockUntil = 0;
  let glLeaving = null;
  let glLeaveTimer = 0;
  function glShow(i, instant) {
    i = Math.max(0, Math.min(glSlides.length - 1, i));
    const now = performance.now();
    if (i === glIndex || (!instant && now < glLockUntil)) return;
    glLockUntil = now + (reduceMotion ? 80 : 560);
    const dir = i > glIndex ? 1 : -1;
    const from = glSlides[glIndex];
    const to = glSlides[i];
    if (glLeaving) { clearTimeout(glLeaveTimer); glLeaving.classList.remove('is-leaving'); }
    from.classList.remove('is-current', 'is-entering');
    to.classList.remove('is-entering');
    if (!instant && !reduceMotion) {
      from.classList.add('is-leaving');
      glLeaving = from;
      glLeaveTimer = setTimeout(() => { from.classList.remove('is-leaving'); glLeaving = null; }, 850);
      to.dataset.dir = dir;
      void to.offsetWidth;
      to.classList.add('is-entering');
    }
    to.classList.add('is-current');
    glIndex = i;
    glSlides.forEach((sl, k) => { sl.inert = k !== i; sl.setAttribute('aria-hidden', String(k !== i)); });
    $$('.gl-dots button', gate).forEach((d, k) => {
      d.classList.toggle('is-on', k === i);
      if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
    $('#glNextText').textContent = GL_NEXT[i];
    $('#glNext').hidden = !GL_NEXT[i];
    gate.dataset.slide = i;
  }
  $$('.gl-dots button', gate).forEach((d) => d.addEventListener('click', () => glShow(Number(d.dataset.slideTo))));
  $('#glNext').addEventListener('click', () => glShow(glIndex + 1));
  const onLanding = () => !gate.hidden && gate.dataset.view === 'landing';

  // roda do mouse / trackpad: um gesto = uma tela (ignora a inércia do trackpad)
  let glLastWheel = 0;
  let glWheelSum = 0;
  const glRecent = [];
  gate.addEventListener('wheel', (e) => {
    if (!onLanding() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    const d = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? innerHeight : 1);
    const abs = Math.abs(d);
    const gap = now - glLastWheel;
    glLastWheel = now;
    if (gap > 150) glRecent.length = 0;
    const prev = glRecent[glRecent.length - 1] ?? 0;
    glRecent.push(abs);
    if (glRecent.length > 6) glRecent.shift();
    const decaying = glRecent.length >= 4 && glRecent.every((v, k) => k === 0 || v <= glRecent[k - 1] + 0.5) && glRecent[glRecent.length - 1] < glRecent[0] * 0.85;
    const fresh = gap > 150 || abs > prev * 1.25 + 2 || (!decaying && abs > 6);
    if (now < glLockUntil || !fresh) { glWheelSum = 0; return; }
    if (glWheelSum && Math.sign(glWheelSum) !== Math.sign(d)) glWheelSum = 0;
    glWheelSum += d;
    if (Math.abs(glWheelSum) > 28) { glWheelSum = 0; glShow(glIndex + Math.sign(d)); }
  }, { passive: false });

  // toque: deslizar para cima/baixo troca de tela
  let glTouchY = null;
  let glTouchX = 0;
  gate.addEventListener('touchstart', (e) => {
    if (!onLanding() || e.target.closest('input')) { glTouchY = null; return; }
    glTouchY = e.touches[0].clientY;
    glTouchX = e.touches[0].clientX;
  }, { passive: true });
  gate.addEventListener('touchmove', (e) => {
    if (onLanding() && !e.target.closest('.gl-features')) e.preventDefault();
  }, { passive: false });
  gate.addEventListener('touchend', (e) => {
    if (glTouchY === null) return;
    const dy = glTouchY - e.changedTouches[0].clientY;
    const dx = glTouchX - e.changedTouches[0].clientX;
    glTouchY = null;
    if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx) * 1.3) glShow(glIndex + (dy > 0 ? 1 : -1));
  }, { passive: true });

  // teclado
  addEventListener('keydown', (e) => {
    if (!onLanding() || e.target.closest('input, textarea, select')) return;
    const k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown') { e.preventDefault(); glShow(glIndex + 1); }
    else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); glShow(glIndex - 1); }
  });

  // tela 3: e-mail já vai preenchido para o cadastro
  $('#glStart').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#glEmail').value.trim();
    setAuth('signup');
    if (email) {
      $('#s-email').value = email;
      checkEmailInUse();
    }
  });
  $('#glGoogle').addEventListener('click', () => {
    setAuth('login');
    if (!GOOGLE_CLIENT_ID) $('#googleBtn').click();
  });

  $$('.pass-toggle[data-for]', gate).forEach((btn) => btn.addEventListener('click', () => {
    const input = $(`#${btn.dataset.for}`);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Ocultar' : 'Mostrar';
    btn.setAttribute('aria-pressed', String(show));
  }));

  function busyButton(form, on, label) {
    const btn = $('button[type="submit"]:not([hidden])', form.querySelector('.forgot-step:not([hidden])') || form);
    btn.disabled = on;
    if (label) { btn.dataset.label ??= btn.querySelector('span').textContent; }
    btn.querySelector('span').textContent = on && label ? label : btn.dataset.label || btn.querySelector('span').textContent;
  }
  const say = (el, text, ok) => { el.textContent = text; el.classList.toggle('is-ok', !!ok); };
  const needCrypto = (msgEl) => {
    if (cryptoOk) return false;
    say(msgEl, 'Abra o site por https (ou localhost) para usar as contas com segurança.');
    return true;
  };

  /* Entrar */
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = $('#loginMsg');
    if (lockedFor()) { syncLock(); return; }
    const email = $('#l-email').value.trim();
    const pass = $('#l-senha').value;
    if (MODO_TESTE) {
      if (!email || !pass) { say(msg, 'Digite qualquer e-mail e qualquer senha para entrar.'); return; }
      await enterTest(email, pass);
      return;
    }
    if (!isEmail(email) || !pass) { say(msg, 'Digite seu e-mail e sua senha.'); return; }
    if (needCrypto(msg)) return;
    busyButton(form, true, 'Conferindo…');
    const acc = findAccount(email);
    const ok = await checkPassword(acc, pass);
    busyButton(form, false);
    if (ok) {
      registerSuccess();
      enterSite(acc.email);
      return;
    }
    const left = registerFail();
    if (lockedFor()) return;
    // mensagem igual para e-mail inexistente ou senha errada: não revela quem tem conta
    say(msg, `E-mail ou senha incorretos.${triesText(left)}`);
    $('#l-senha').value = '';
    $('#l-senha').focus();
  });

  // Modo teste: entra com qualquer coisa; cria a conta se ainda não existir
  async function enterTest(email, pass, nome) {
    let acc = findAccount(email);
    if (!acc) {
      const secret = cryptoOk ? await hashPassword(pass) : {};
      acc = { email, nome: nome || nameFromEmail(email), foto: '', ...secret, provider: 'senha', criado: Date.now(), pedidos: [] };
      accounts[keyOf(email)] = acc;
      saveAccounts();
    } else if (nome && !acc.nome) {
      acc.nome = nome;
      saveAccounts();
    }
    registerSuccess();
    enterSite(acc.email);
  }

  /* Criar conta */
  const emailHint = $('#s-emailHint');
  function checkEmailInUse() {
    const v = $('#s-email').value.trim();
    emailHint.className = 'field-hint';
    if (!v) { emailHint.textContent = ''; return false; }
    if (!isEmail(v)) { emailHint.textContent = 'Confira o e-mail: falta algo como @ ou .com.'; emailHint.classList.add('is-warn'); return false; }
    if (findAccount(v)) {
      emailHint.innerHTML = MODO_TESTE
        ? 'Este e-mail já tem conta: ao continuar, você entra nela.'
        : 'Este e-mail já está em uso. <button type="button" class="ga-link" data-auth="login" data-fill="1">Entrar com ele</button>';
      emailHint.classList.add('is-warn');
      return false;
    }
    emailHint.textContent = 'E-mail disponível.';
    emailHint.classList.add('is-ok');
    return true;
  }
  let emailTimer = 0;
  $('#s-email').addEventListener('input', () => { clearTimeout(emailTimer); emailTimer = setTimeout(checkEmailInUse, 300); });
  $('#s-email').addEventListener('blur', checkEmailInUse);

  function paintStrength(input, meter) {
    const v = input.value;
    const score = !v ? 0 : [v.length >= 8, /\p{L}/u.test(v) && /\d/.test(v), v.length >= 12 || (/[^\p{L}\d]/u.test(v) && /\p{Lu}/u.test(v))].filter(Boolean).length;
    meter.dataset.score = score;
    meter.querySelector('span').textContent = v ? ['Muito fraca', 'Fraca', 'Boa', 'Forte'][score] : '';
  }
  $('#s-senha').addEventListener('input', (e) => paintStrength(e.currentTarget, $('#strength')));

  $('#signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = $('#signupMsg');
    const nome = $('#s-nome').value.trim();
    const email = $('#s-email').value.trim();
    const pass = $('#s-senha').value;
    if (MODO_TESTE) {
      if (!email || !pass) { say(msg, 'Digite qualquer e-mail e qualquer senha para entrar.'); return; }
      await enterTest(email, pass, nome);
      return;
    }
    if (!nome) { say(msg, 'Digite seu nome.'); $('#s-nome').focus(); return; }
    if (!checkEmailInUse()) { say(msg, findAccount(email) ? 'Este e-mail já está em uso. Entre com ele ou use outro.' : 'Digite um e-mail válido.'); $('#s-email').focus(); return; }
    if (!strongEnough(pass)) { say(msg, 'A senha precisa ter pelo menos 8 caracteres, com letras e números.'); $('#s-senha').focus(); return; }
    if (pass !== $('#s-senha2').value) { say(msg, 'As duas senhas não são iguais.'); $('#s-senha2').focus(); return; }
    if (needCrypto(msg)) return;
    busyButton(form, true, 'Criando conta…');
    const { salt, hash } = await hashPassword(pass);
    busyButton(form, false);
    accounts[keyOf(email)] = { email, nome, foto: '', salt, hash, provider: 'senha', criado: Date.now(), pedidos: [] };
    if (!saveAccounts()) { say(msg, 'Este navegador não deixou guardar a conta. Saia da janela anônima e tente de novo.'); return; }
    enterSite(email);
    toast('Conta criada. Bem-vindo à Morada!');
  });

  /* Esqueceu a senha */
  let resetReq = null; // { key, code, exp }
  function forgotStep(n) {
    $$('.forgot-step', gate).forEach((st) => { st.hidden = Number(st.dataset.step) !== n; });
    if (n === 1) resetReq = null;
  }
  $('#forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = $('#forgotMsg');
    if (lockedFor()) { syncLock(); return; }
    if (!resetReq) {
      const email = $('#f2-email').value.trim();
      if (!isEmail(email)) { say(msg, 'Digite o e-mail da sua conta.'); return; }
      const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
      resetReq = { key: keyOf(email), code, exp: Date.now() + 10 * 60000 };
      // Sem servidor não há envio de e-mail: nesta versão de teste o código aparece na tela.
      $('#codeBox').innerHTML = `Versão de teste: o site ainda não envia e-mail, então o código aparece aqui. Seu código é <b>${code}</b> e vale 10 minutos.`;
      say(msg, '');
      forgotStep(2);
      $('#f2-code').focus();
      return;
    }
    const code = $('#f2-code').value.trim();
    const pass = $('#f2-senha').value;
    const acc = accounts[resetReq.key];
    if (!acc || code !== resetReq.code || Date.now() > resetReq.exp) {
      const left = registerFail();
      if (lockedFor()) return;
      say(msg, `Código inválido ou vencido.${triesText(left)}`);
      return;
    }
    if (!strongEnough(pass)) { say(msg, 'A nova senha precisa ter pelo menos 8 caracteres, com letras e números.'); return; }
    if (pass !== $('#f2-senha2').value) { say(msg, 'As duas senhas não são iguais.'); return; }
    if (needCrypto(msg)) return;
    busyButton(form, true, 'Salvando…');
    Object.assign(acc, await hashPassword(pass));
    busyButton(form, false);
    saveAccounts();
    registerSuccess();
    const email = acc.email;
    form.reset();
    setAuth('login');
    $('#l-email').value = email;
    say($('#loginMsg'), 'Senha redefinida. Entre com a nova senha.', true);
    $('#l-senha').focus();
  });

  /* Entrar com o Google (Google Identity Services) */
  function onGoogleCredential(resp) {
    try {
      const part = resp.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const data = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(part), (c) => c.charCodeAt(0))));
      // Sem servidor não dá para conferir a assinatura do token; em produção, valide o token no servidor.
      if (!data.email || data.email_verified === false) throw new Error('sem e-mail');
      let acc = findAccount(data.email);
      if (!acc) {
        acc = { email: data.email, nome: data.name || nameFromEmail(data.email), foto: data.picture || '', provider: 'google', criado: Date.now(), pedidos: [] };
        accounts[keyOf(data.email)] = acc;
        saveAccounts();
      }
      registerSuccess();
      enterSite(acc.email);
    } catch (_) {
      say($(`#${authView === 'signup' ? 'signupMsg' : 'loginMsg'}`), 'Não deu para entrar com o Google. Tente de novo.');
    }
  }
  if (GOOGLE_CLIENT_ID) {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => {
      google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential, ux_mode: 'popup' });
      google.accounts.id.renderButton($('#googleSlot'), { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', locale: 'pt-BR', width: Math.min(400, $('.ga-google').clientWidth || 320) });
      $('#googleBtn').hidden = true;
    };
    document.head.append(s);
  }
  $('#googleBtn').addEventListener('click', () => {
    if (MODO_TESTE) {
      // sem Client ID do Google: no modo teste entra com uma conta de exemplo
      enterTest('exemplo.google@morada.teste', 'google', 'Conta Google de exemplo');
      toast('Modo teste: entrou com uma conta Google de exemplo');
      return;
    }
    say($(`#${authView === 'signup' ? 'signupMsg' : 'loginMsg'}`),
      'O login com Google ainda não foi ativado neste site: falta cadastrar o site no Google e colocar o Client ID. Por enquanto, use e-mail e senha.');
  });

  function lockSite(on) {
    gated = on;
    document.body.classList.toggle('is-gated', on);
    ['.scenes', '.topbar', '.indicator'].forEach((sel) => { $(sel).inert = on; });
  }

  if (MODO_TESTE) {
    $('.ga-secure').lastChild.textContent = 'Versão de teste: qualquer e-mail e qualquer senha entram.';
    ['#l-email', '#s-email'].forEach((sel) => { $(sel).type = 'text'; });
  }

  function showGate(view = 'landing') {
    closeOverlays(true);
    lockSite(true);
    $$('form', gate).forEach((f) => f.reset());
    $('#strength').dataset.score = 0;
    $('#strength span').textContent = '';
    emailHint.textContent = '';
    setAuth('login');
    setGateView(view);
    glShow(0, true);
    gate.hidden = false;
    gate.classList.remove('is-leaving', 'is-in');
    void gate.offsetWidth;
    gate.classList.add('is-in');
    runCounts(gate);
  }

  /* ---------- Perfil (nome, e-mail, foto e pedidos ficam na conta, neste navegador) ---------- */

  const nameFromEmail = (email) => {
    const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim() || email;
    return base.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  };
  const initials = (nome) => nome.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  function loadProfile(email) {
    profile = findAccount(email);
    if (!profile) return false;
    profile.pedidos ??= [];
    renderProfile();
    return true;
  }
  function saveProfile() {
    if (!saveAccounts()) toast('Não deu para guardar neste navegador. Se for a foto, tente uma imagem menor.');
  }
  function paintAvatar(el) {
    el.style.backgroundImage = profile.foto ? `url("${profile.foto}")` : '';
    el.textContent = profile.foto ? '' : initials(profile.nome);
    el.classList.toggle('has-photo', !!profile.foto);
  }
  function renderProfile() {
    if (!profile) return;
    paintAvatar($('#profAvatar'));
    paintAvatar($('#accAvatar'));
    $('#profName').textContent = profile.nome;
    $('#profEmail').textContent = profile.email;
    $('#accNome').value = profile.nome;
    $('#accMail').value = profile.email;
    $('#accFotoRemove').hidden = !profile.foto;
    const hasPass = !!profile.hash;
    $('#passState').textContent = hasPass ? '••••••••' : 'Você entra com o Google';
    $('#passCurrentField').hidden = !hasPass;
    if ($('#passForm').hidden) $('#passToggle').textContent = hasPass ? 'Alterar senha' : 'Criar senha';
    // a bonequinha do topo vira a foto de perfil
    const icon = $('.icon-btn[data-open="account"]');
    icon.style.backgroundImage = profile.foto ? `url("${profile.foto}")` : '';
    icon.classList.toggle('has-photo', !!profile.foto);
    renderOrders();
    renderCart();
  }

  $('#profileCard').addEventListener('click', () => { showTab('conta'); $('#accNome').focus({ preventScroll: true }); });

  $('#accForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = $('#accNome').value.trim();
    const email = $('#accMail').value.trim();
    if (!nome) { $('#accNote').textContent = 'Digite seu nome.'; return; }
    if (!isEmail(email)) { $('#accNote').textContent = 'Digite um e-mail válido.'; return; }
    const oldKey = keyOf(profile.email);
    const newKey = keyOf(email);
    if (newKey !== oldKey && accounts[newKey]) { $('#accNote').textContent = 'Este e-mail já está em uso por outra conta.'; return; }
    profile.nome = nome;
    if (newKey !== oldKey) {
      delete accounts[oldKey];
      accounts[newKey] = profile;
    }
    profile.email = email;
    session = { email };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) { /* ignora */ }
    saveProfile();
    renderProfile();
    $('#accNote').textContent = '';
    toast('Dados da conta salvos');
  });

  $('#accFoto').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Escolha um arquivo de imagem (JPG ou PNG).'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // recorta no centro e reduz para 256 px, para caber no navegador
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        c.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
        profile.foto = c.toDataURL('image/jpeg', 0.85);
        saveProfile();
        renderProfile();
        toast('Foto de perfil atualizada');
      };
      img.onerror = () => toast('Não deu para abrir essa imagem. Tente outra.');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  $('#accFotoRemove').addEventListener('click', () => {
    profile.foto = '';
    saveProfile();
    renderProfile();
    toast('Foto removida');
  });

  $('#passToggle').addEventListener('click', (e) => {
    const form = $('#passForm');
    form.hidden = !form.hidden;
    e.currentTarget.setAttribute('aria-expanded', String(!form.hidden));
    e.currentTarget.textContent = form.hidden ? (profile.hash ? 'Alterar senha' : 'Criar senha') : 'Cancelar';
    $('#passNote').textContent = '';
    if (!form.hidden) (profile.hash ? $('#passCurrent') : $('#passNew')).focus({ preventScroll: true });
  });
  $('#passForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const note = $('#passNote');
    if (lockedFor()) { note.textContent = `Muitas tentativas erradas. Tente de novo em ${clock(lockedFor())}.`; return; }
    const nova = $('#passNew').value;
    if (needCrypto(note)) return;
    if (profile.hash && !(await checkPassword(profile, $('#passCurrent').value))) {
      const left = registerFail();
      note.textContent = lockedFor() ? `Muitas tentativas erradas. Tente de novo em ${clock(lockedFor())}.` : `A senha atual está errada.${triesText(left)}`;
      return;
    }
    if (!strongEnough(nova)) { note.textContent = 'A nova senha precisa ter pelo menos 8 caracteres, com letras e números.'; return; }
    if (nova !== $('#passConfirm').value) { note.textContent = 'As duas senhas não são iguais.'; return; }
    Object.assign(profile, await hashPassword(nova));
    saveProfile();
    registerSuccess();
    form.reset();
    form.hidden = true;
    $('#passToggle').setAttribute('aria-expanded', 'false');
    renderProfile();
    toast('Senha alterada');
  });

  /* ---------- Histórico de pedidos ---------- */

  function renderOrders() {
    const orders = profile?.pedidos || [];
    $('#orderList').innerHTML = orders.slice().reverse().map((o) => `
      <li class="order">
        <div class="order-head"><strong>Pedido #${o.num}</strong><small>${new Date(o.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</small></div>
        <ul>${o.itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <span class="order-status"><svg aria-hidden="true"><use href="#i-zap" /></svg>Enviado pelo WhatsApp</span>
      </li>`).join('');
    $('#ordersEmpty').hidden = orders.length > 0;
    $('#orderList').hidden = orders.length === 0;
  }
  // Ao finalizar no WhatsApp, o pedido vai para o histórico e o carrinho esvazia.
  $('#cartZap').addEventListener('click', () => {
    const items = cartItems();
    if (!profile || !items.length) return;
    const num = 1000 + Object.values(accounts).reduce((n, a) => n + (a.pedidos?.length || 0), 0) + 1;
    profile.pedidos.push({ num, data: Date.now(), itens: items.map((it) => it.line) });
    saveProfile();
    setTimeout(() => {
      cart = [];
      saveCart();
      syncCartUI();
      renderOrders();
      showTab('pedidos');
      toast(`Pedido #${num} guardado no histórico`);
    }, 0);
  });

  /* ---------- Visitante: navega por tudo; carrinho, favoritos e conta pedem login ---------- */

  const isGuest = () => !!session?.guest;
  let askOpen = false;
  let askReturn = null;
  let pendingAction = null; // o que a pessoa tentou fazer; roda sozinho depois do login
  const ASK_TEXT = {
    cart: ['Entre para usar o carrinho', 'Para colocar imóveis no carrinho e finalizar com um curador, entre na sua conta. É rápido e gratuito.'],
    fav: ['Entre para salvar favoritos', 'Para guardar os imóveis de que você gostou, entre na sua conta. Eles ficam salvos para a próxima visita.'],
    account: ['Você está como visitante', 'Entre na sua conta para ver seus favoritos, seu carrinho e seus pedidos, e para editar seu perfil.'],
  };
  function requireLogin(kind, action) {
    if (!isGuest()) return false;
    askLogin(kind, action);
    return true;
  }
  function askLogin(kind, action) {
    pendingAction = action || null;
    const [title, text] = ASK_TEXT[kind];
    $('#askTitle').textContent = title;
    $('#askText').textContent = text;
    askReturn = document.activeElement;
    const el = $('#askLogin');
    el.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
    askOpen = true;
    setTimeout(() => $('[data-ask="login"]').focus({ preventScroll: true }), reduceMotion ? 0 : 80);
  }
  function closeAsk(keepPending) {
    if (!askOpen) return;
    const el = $('#askLogin');
    el.classList.remove('is-open');
    askOpen = false;
    if (!keepPending) pendingAction = null;
    setTimeout(() => { if (!askOpen) el.hidden = true; }, reduceMotion ? 0 : 400);
    if (!keepPending && askReturn && document.contains(askReturn)) askReturn.focus({ preventScroll: true });
  }
  $('#askLogin').addEventListener('click', (e) => {
    if (e.target.closest('[data-ask-close]')) { closeAsk(); return; }
    const b = e.target.closest('[data-ask]');
    if (!b) return;
    closeAsk(true);
    showGate('auth');
    setAuth(b.dataset.ask);
  });
  $('#askLogin').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); closeAsk(); return; }
    if (e.key !== 'Tab') return;
    const items = $$('button:not([tabindex="-1"])', $('#askLogin'));
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  function leaveGate() {
    lockSite(false);
    gate.classList.add('is-leaving');
    playIntro();
    setTimeout(() => { gate.hidden = true; gate.classList.remove('is-leaving', 'is-in'); }, reduceMotion ? 0 : 1300);
  }

  function enterGuest() {
    session = { guest: true };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) { /* ignora */ }
    profile = null;
    pendingAction = null;
    document.body.classList.add('is-guest');
    syncCartUI();
    syncFavUI();
    leaveGate();
    setTimeout(() => toast('Você está como visitante. Para usar o carrinho, entre na sua conta.'), reduceMotion ? 0 : 1500);
  }
  gate.addEventListener('click', (e) => {
    if (e.target.closest('[data-guest]')) { e.stopImmediatePropagation(); enterGuest(); }
  }, true);

  function enterSite(email) {
    session = { email };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) { /* ignora */ }
    loadProfile(email);
    document.body.classList.remove('is-guest');
    syncCartUI();
    syncFavUI();
    leaveGate();
    if (pendingAction) {
      const action = pendingAction;
      pendingAction = null;
      setTimeout(action, reduceMotion ? 0 : 1500);
    }
  }

  $('#logoutBtn').addEventListener('click', () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) { /* ignora */ }
    session = null;
    profile = null;
    showGate('auth');
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
      if (goEl.dataset.msg) $('#f-msg').value = goEl.dataset.msg;
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
    if (openName || gated || askOpen) return;
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
    if (openName || gated || askOpen) { touchY = null; return; }
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (!gated && !e.target.closest('.detail, .im-grid, .im-bar, .fl-chips, .fl-range, .ig-reels, .nav-pill, .mv-grid, .mv-bar, .search-results, .search-filters, .tab-panel, textarea')) e.preventDefault();
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
    if (gated || askOpen) return;
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
    if (name === 'account' && requireLogin('account')) return;
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
  function renderSearchCities() {
    const cities = [...new Set(HOUSES.map((h) => h.cidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    if (search.city && !cities.includes(search.city)) search.city = '';
    $('#cityChips').innerHTML = [`<button class="chip${search.city ? '' : ' is-on'}" type="button" data-city="" aria-pressed="${!search.city}">Todas as cidades</button>`,
      ...cities.map((c) => `<button class="chip${search.city === c ? ' is-on' : ''}" type="button" data-city="${esc(c)}" aria-pressed="${search.city === c}">${esc(c)}</button>`)].join('');
  }

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
      (!q || norm(`${h.nome} ${TIPOS[h.tipo] || ''} ${h.bairro} ${h.cidade} ${h.uf} ${(h.tags || []).join(' ')} ${h.desc}`).includes(q)) &&
      (!search.city || h.cidade === search.city) &&
      (h.suites || 0) >= search.suites);

    const hl = $('#houseResults');
    hl.replaceChildren();
    houses.forEach((h) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hit';
      b.append(houseThumb(h, 'hit-img'));
      b.insertAdjacentHTML('beforeend', `<span><strong>${esc(h.nome)}</strong><small>${esc([h.cidade, detailsLine(h)].filter(Boolean).join(' · '))}</small></span><span class="hit-price">${isAvailable(h) ? priceLabel(h) : STATUS[h.status]}</span>`);
      b.addEventListener('click', () => openProperty(h.id));
      li.append(b);
      hl.append(li);
    });
    if (!houses.length) hl.innerHTML = `<li class="no-hits">${catalogReady ? 'Nenhum imóvel com esses filtros. Tente outra cidade ou menos suítes.' : 'Carregando imóveis…'}</li>`;

    $('#houseHits').textContent = `· ${houses.length}`;
  }

  // conta: abas e favoritos
  function showTab(name) {
    $$('.tab').forEach((x) => { const on = x.dataset.tab === name; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', String(on)); });
    $$('.tab-panel').forEach((p) => { p.hidden = p.dataset.panel !== name; });
  }
  $$('.tab').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));


  function renderFavs() {
    const list = $('#favList');
    list.replaceChildren();
    let shown = 0;
    favs.houses.forEach((id) => {
      const h = HOUSES.find((x) => x.id === id);
      if (!h) return;
      const li = document.createElement('li');
      li.className = 'fav-item';
      li.append(houseThumb(h, 'hit-img'));
      li.insertAdjacentHTML('beforeend', `<span><strong>${esc(h.nome)}</strong><small>${esc([h.cidade, isAvailable(h) ? priceLabel(h) : STATUS[h.status]].filter(Boolean).join(' · '))}</small></span><button class="fav-remove" type="button" aria-label="Remover ${esc(h.nome)}"><svg><use href="#i-close" /></svg></button>`);
      li.querySelector('.hit-img').addEventListener('click', () => openProperty(h.id));
      li.querySelector('.fav-remove').addEventListener('click', () => toggleFav('houses', id));
      list.append(li);
      shown++;
    });
    favs.products.forEach((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return;
      const li = document.createElement('li');
      li.className = 'fav-item';
      li.innerHTML = `<span class="hit-img" style="background:${p.bg}">${productArt(p)}</span><span><strong>${p.nome}</strong><small>${brl2.format(p.preco)}</small></span><button class="fav-remove" type="button" aria-label="Remover ${p.nome}"><svg><use href="#i-close" /></svg></button>`;
      li.querySelector('.fav-remove').addEventListener('click', () => toggleFav('products', id));
      list.append(li);
      shown++;
    });
    const empty = shown === 0;
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

  /* =========================================================
     Dados do Supabase (fonte principal do site)
     Leitura pública pela API REST com a chave anon; as políticas RLS
     só deixam o visitante ler. Quem edita é o painel /admin.
     ========================================================= */

  const IMOVEL_COLS = 'id,slug,titulo,descricao,preco,tipo,finalidade,cidade,uf,bairro,endereco,quartos,suites,banheiros,vagas,area,frente,topografia,selos,caracteristicas,status,destaque,imagem_principal,ordem,created_at,imovel_fotos(caminho,ordem)';
  function restGet(path) {
    const headers = { apikey: SB.anonKey, accept: 'application/json' };
    if (/^eyJ/.test(SB.anonKey)) headers.Authorization = `Bearer ${SB.anonKey}`; // chave anon antiga (JWT)
    return fetch(`${SB.url}/rest/v1/${path}`, { headers, cache: 'no-store' }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
  }
  const num = (v) => (v == null || v === '' ? 0 : Number(v));
  function fromRow(r) {
    const fotos = (r.imovel_fotos || []).slice().sort((a, b) => a.ordem - b.ordem).map((f) => f.caminho).filter(Boolean);
    const foto = r.imagem_principal || fotos[0] || null;
    return {
      id: r.slug, nome: r.titulo, tipo: r.tipo, negocio: r.finalidade, status: r.status, destaque: !!r.destaque,
      bairro: r.bairro || '', cidade: r.cidade || '', uf: r.uf || '', endereco: r.endereco || '',
      preco: num(r.preco), area: num(r.area), quartos: num(r.quartos), suites: num(r.suites), banheiros: num(r.banheiros), vagas: num(r.vagas),
      frente: num(r.frente), topografia: r.topografia || '', selos: r.selos || [], tags: r.caracteristicas || [], desc: r.descricao || '',
      foto, fotos: foto ? [foto, ...fotos.filter((f) => f !== foto)] : fotos, ordem: r.ordem || 0, criado: r.created_at || '',
    };
  }
  const EXEMPLO_DESTAQUES = ['patio', 'mirante', 'jequitiba'];
  const fromExample = (h, k) => ({
    ...h, quartos: h.suites, status: 'disponivel', destaque: EXEMPLO_DESTAQUES.includes(h.id), endereco: '', ordem: k, criado: '',
    foto: h.img ? unsplash(h.img, 1600) : h.tipo === 'terreno' ? null : LOCAL_IMG, fotos: [],
  });
  const fromReview = (r) => ({ nome: r.nome, ini: initials(r.nome), casa: r.subtitulo || '', texto: r.texto, nota: r.nota || 5, foto: r.foto || '' });
  // disponíveis primeiro; depois a ordem do painel; depois os mais novos
  const byOrder = (a, b) => (isAvailable(b) - isAvailable(a)) || (a.ordem - b.ordem) || String(b.criado).localeCompare(String(a.criado));

  function setStat(name, v) {
    $$(`.count[data-stat="${name}"]`).forEach((el) => {
      el.dataset.count = v || 0;
      el.dataset.prefix = '';
      if (v) delete el.dataset.empty; else el.dataset.empty = '1';
      const txt = formatCount(el, v || 0);
      el.style.minWidth = '';
      el.textContent = txt;
      el.setAttribute('aria-label', txt);
    });
  }

  function applyConfig(c) {
    if (!c) return;
    WHATSAPP = String(c.whatsapp || '').replace(/\D/g, '');
    const handle = String(c.instagram || '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');
    INSTAGRAM_URL = handle ? `https://www.instagram.com/${encodeURIComponent(handle)}/` : 'https://www.instagram.com/';
    $('#igHandle').textContent = handle ? `@${handle}` : '';
    $('#igFollow').hidden = !handle;
    const mail = $('.menu-foot a');
    mail.hidden = !c.email;
    if (c.email) { mail.href = `mailto:${c.email}`; mail.textContent = c.email; }
    $('#arZap').href = zapLink('Olá, Arthur! Vim pelo site da Morada e gostaria de conversar sobre imóveis.');
    const tel = String(c.telefone || '').trim();
    const info = [
      tel && `<li><svg aria-hidden="true"><use href="#i-phone" /></svg><a href="tel:${esc(tel.replace(/[^\d+]/g, ''))}">${esc(tel)}</a></li>`,
      c.email && `<li><svg aria-hidden="true"><use href="#i-mail" /></svg><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`,
      c.endereco && `<li><svg aria-hidden="true"><use href="#i-pin" /></svg><span>${esc(c.endereco)}</span></li>`,
    ].filter(Boolean);
    $('#ctInfo').innerHTML = info.join('');
    $('#ctInfo').hidden = !info.length;
    const nome = String(c.nome_imobiliaria || '').trim();
    if (nome) {
      $('.logo-word').textContent = nome.toLowerCase() === 'morada' ? 'morada' : nome;
      $('.logo').setAttribute('aria-label', `${nome} — início`);
      $('.menu-foot span').textContent = `© ${new Date().getFullYear()} ${nome}`;
    }
    const logo = siteFile(c.logo);
    const mark = $('.logo-mark');
    if (logo) {
      mark.innerHTML = `<img src="${esc(logo)}" alt="" />`;
      mark.classList.add('has-img');
    }
  }

  function renderHeroCards() {
    const h = HOUSES.find((x) => x.destaque && isAvailable(x)) || HOUSES.find((x) => x.destaque) || HOUSES.find(isAvailable);
    $$('.card--feature, .m-card--feature').forEach((card) => {
      const city = $('.feature-city', card) || $('.m-pin', card).lastChild;
      const bg = $('.feature-img, .m-card-bg', card);
      if (!h) {
        delete card.dataset.house;
        $('strong', card).textContent = 'Imóveis em destaque';
        city.textContent = '';
        bg.style.background = '';
        return;
      }
      card.dataset.house = h.id;
      card.setAttribute('aria-label', `Ver ${h.nome}`);
      $('strong', card).textContent = h.nome;
      city.textContent = h.cidade;
      const url = photoSrc(h.foto, 700);
      bg.style.background = url && url !== LOCAL_IMG ? `url("${url}") center / cover no-repeat, #d9c3a5` : '';
    });
  }

  function renderCatalog(prune) {
    catalogReady = true;
    if (prune) {
      // imóveis que saíram do site também saem do carrinho e dos favoritos
      const ids = new Set(HOUSES.map((h) => h.id));
      const keepCart = cart.filter((id) => id.startsWith('p:') || ids.has(id));
      if (keepCart.length !== cart.length) { cart = keepCart; saveCart(); }
      const keepFavs = favs.houses.filter((id) => ids.has(id));
      if (keepFavs.length !== favs.houses.length) { favs.houses = keepFavs; saveFavs(); }
    }
    if (dtHouse) dtHouse = HOUSES.find((h) => h.id === dtHouse.id) || dtHouse;
    renderGrid();
    renderFeatured();
    renderFilterOptions();
    updateFilterCount();
    renderReels();
    renderSearchCities();
    runSearch();
    renderReviews();
    renderHeroCards();
    const available = HOUSES.filter(isAvailable);
    const cities = new Set(HOUSES.map((h) => h.cidade).filter(Boolean)).size;
    setStat('imoveis', available.length);
    setStat('cidades', cities);
    PREVIEW.curadoria = available.length ? `${plural(available.length, 'imóvel disponível', 'imóveis disponíveis')}` : 'Imóveis selecionados';
    syncCartUI();
    syncFavUI();
    document.fonts?.ready.then(lockCountWidths);
  }

  let loadError = false;
  let lastLoad = 0;
  let loading = null;
  function loadCatalog() {
    if (loading) return loading;
    loading = (async () => {
      const cfg = (await window.moradaConfig?.()) ?? null;
      if (cfg && cfg.error) throw new Error(cfg.error);
      if (!cfg) {
        // Supabase ainda não configurado: mostra os exemplos
        SB = null;
        HOUSES = EXEMPLO_IMOVEIS.map(fromExample).sort(byOrder);
        REVIEWS = EXEMPLO_AVALIACOES.map(fromReview);
        loadError = false;
        renderCatalog(false);
        return;
      }
      SB = cfg;
      const [imoveis, avaliacoes, conf] = await Promise.all([
        restGet(`imoveis?select=${IMOVEL_COLS}&order=ordem.asc,created_at.desc&imovel_fotos.order=ordem.asc&limit=500`),
        restGet('avaliacoes?select=nome,texto,nota,subtitulo,foto&publicado=eq.true&order=ordem.asc,created_at.desc&limit=50'),
        restGet('configuracoes?select=nome_imobiliaria,whatsapp,instagram,telefone,email,endereco,logo&id=eq.1').catch(() => []),
      ]);
      applyConfig(conf[0]);
      HOUSES = imoveis.map(fromRow).sort(byOrder);
      REVIEWS = avaliacoes.map(fromReview);
      loadError = false;
      lastLoad = performance.now();
      renderCatalog(true);
    })().catch((err) => {
      console.warn('Morada: não deu para carregar os dados do Supabase.', err);
      if (!catalogReady || loadError) {
        loadError = true;
        HOUSES = [];
        REVIEWS = [];
        renderCatalog(false);
      }
    }).finally(() => { loading = null; });
    return loading;
  }
  // preço, fotos ou destaques mudaram no painel? ao voltar para a aba, busca de novo (no máximo 1x por minuto)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && SB && performance.now() - lastLoad > 60000) loadCatalog();
  });

  syncFavUI();
  syncCartUI();
  runSearch();
  const catalogFirst = loadCatalog();

  // Carregamento: logo + barra até a página ficar pronta (mínimo 1,2 s, máximo 2,5 s).
  // Depois abre a entrada, ou direto a hero se já entrou nesta aba.
  if (session?.email && !loadProfile(session.email)) {
    // sessão de uma conta que não existe mais neste navegador: volta para a entrada
    session = null;
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) { /* ignora */ }
  }
  if (session?.guest) document.body.classList.add('is-guest');
  if (session?.email || session?.guest) gate.hidden = true;
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else addEventListener('load', resolve, { once: true });
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  Promise.race([Promise.all([pageLoaded, wait(1200), catalogFirst]), wait(2500)]).then(() => {
    const pre = $('#preloader');
    pre.classList.add('is-done');
    setTimeout(() => { pre.hidden = true; }, 800);
    if (session?.email || session?.guest) {
      lockSite(false);
      playIntro();
    } else {
      showGate();
    }
  });
})();
