(() => {
  'use strict';

  // ---------- Utilidades ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('webvee_' + key);
        return v === null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('webvee_' + key, JSON.stringify(value)); } catch { /* armazenamento indisponível */ }
    },
    clear() {
      try { Object.keys(localStorage).filter((k) => k.startsWith('webvee_')).forEach((k) => localStorage.removeItem(k)); } catch { /* ignore */ }
    },
  };

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  // ---------- Dados ----------
  const NICHOS = [
    { id: 'restaurantes', label: 'Restaurantes', q: [['amenity', 'restaurant']] },
    { id: 'lanchonetes', label: 'Lanchonetes e fast food', q: [['amenity', 'fast_food']] },
    { id: 'cafes', label: 'Cafés e padarias', q: [['amenity', 'cafe'], ['shop', 'bakery|pastry|confectionery']] },
    { id: 'bares', label: 'Bares', q: [['amenity', 'bar|pub|biergarten']] },
    { id: 'cabeleireiros', label: 'Cabeleireiros e barbearias', q: [['shop', 'hairdresser']] },
    { id: 'beleza', label: 'Estética e beleza', q: [['shop', 'beauty|cosmetics|massage|nail_salon']] },
    { id: 'oficinas', label: 'Oficinas mecânicas', q: [['shop', 'car_repair|tyres|car_parts|motorcycle_repair']] },
    { id: 'dentistas', label: 'Dentistas', q: [['amenity', 'dentist'], ['healthcare', 'dentist']] },
    { id: 'clinicas', label: 'Clínicas e consultórios', q: [['amenity', 'clinic|doctors'], ['healthcare', 'clinic|doctor|physiotherapist|psychotherapist']] },
    { id: 'academias', label: 'Academias', q: [['leisure', 'fitness_centre|sports_centre']] },
    { id: 'pet', label: 'Pet shops e veterinários', q: [['shop', 'pet|pet_grooming'], ['amenity', 'veterinary']] },
    { id: 'roupas', label: 'Lojas de roupa e calçados', q: [['shop', 'clothes|shoes|boutique|fashion_accessories']] },
    { id: 'mercados', label: 'Mercados e mercearias', q: [['shop', 'supermarket|convenience|greengrocer|butcher']] },
    { id: 'farmacias', label: 'Farmácias', q: [['amenity', 'pharmacy'], ['shop', 'chemist']] },
    { id: 'hoteis', label: 'Hotéis e pousadas', q: [['tourism', 'hotel|guest_house|hostel|motel']] },
    { id: 'imobiliarias', label: 'Imobiliárias', q: [['office', 'estate_agent']] },
    { id: 'escritorios', label: 'Advogados e contadores', q: [['office', 'lawyer|accountant|tax_advisor|notary']] },
    { id: 'floriculturas', label: 'Floriculturas', q: [['shop', 'florist|garden_centre']] },
    { id: 'oticas', label: 'Óticas e joalherias', q: [['shop', 'optician|jewelry']] },
    { id: 'moveis', label: 'Móveis e decoração', q: [['shop', 'furniture|interior_decoration|houseware']] },
    { id: 'construcao', label: 'Materiais de construção', q: [['shop', 'hardware|doityourself|trade|paint']] },
  ];

  const CAT_LABELS = {
    restaurant: 'Restaurante', fast_food: 'Lanchonete', cafe: 'Café', bakery: 'Padaria', pastry: 'Confeitaria',
    confectionery: 'Doceria', bar: 'Bar', pub: 'Pub', biergarten: 'Cervejaria', hairdresser: 'Cabeleireiro',
    beauty: 'Estética', cosmetics: 'Cosméticos', massage: 'Massagem', nail_salon: 'Manicure', car_repair: 'Oficina',
    tyres: 'Borracharia', car_parts: 'Autopeças', motorcycle_repair: 'Oficina de motos', dentist: 'Dentista',
    clinic: 'Clínica', doctors: 'Consultório', doctor: 'Consultório', physiotherapist: 'Fisioterapia',
    psychotherapist: 'Psicologia', fitness_centre: 'Academia', sports_centre: 'Centro esportivo', pet: 'Pet shop',
    pet_grooming: 'Banho e tosa', veterinary: 'Veterinário', clothes: 'Loja de roupas', shoes: 'Calçados',
    boutique: 'Boutique', fashion_accessories: 'Acessórios', supermarket: 'Supermercado', convenience: 'Mercearia',
    greengrocer: 'Hortifrúti', butcher: 'Açougue', pharmacy: 'Farmácia', chemist: 'Drogaria', hotel: 'Hotel',
    guest_house: 'Pousada', hostel: 'Hostel', motel: 'Motel', estate_agent: 'Imobiliária', lawyer: 'Advocacia',
    accountant: 'Contabilidade', tax_advisor: 'Consultoria fiscal', notary: 'Cartório', florist: 'Floricultura',
    garden_centre: 'Garden center', optician: 'Ótica', jewelry: 'Joalheria', furniture: 'Móveis',
    interior_decoration: 'Decoração', houseware: 'Utilidades', hardware: 'Ferragens', doityourself: 'Material de construção',
    trade: 'Material de construção', paint: 'Tintas',
  };

  const SUGGESTIONS = [
    { country: 'br', city: 'Teresina', niche: 'restaurantes' },
    { country: 'br', city: 'São Luís', niche: 'cafes' },
    { country: 'br', city: 'Fortaleza', niche: 'cabeleireiros' },
    { country: 'pt', city: 'Lisboa', niche: 'restaurantes' },
    { country: 'pt', city: 'Porto', niche: 'beleza' },
    { country: 'br', city: 'Recife', niche: 'dentistas' },
  ];

  const STATUSES = [
    { id: 'novo', label: 'Novo' },
    { id: 'contatado', label: 'Contatado' },
    { id: 'negociando', label: 'Em negociação' },
    { id: 'fechado', label: 'Fechado' },
    { id: 'perdido', label: 'Perdido' },
  ];

  const DEFAULT_MSG =
    'Olá, tudo bem? Aqui é {meu_nome}.\n\n' +
    'Encontrei a {empresa} aqui em {cidade} e vi que vocês ainda não têm um site próprio.\n\n' +
    'Eu crio sites profissionais, rápidos e prontos para aparecer no Google, com botão direto para o WhatsApp. ' +
    'Posso te mostrar um modelo de como ficaria o de vocês, sem compromisso?';

  const OVERPASS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  ];

  const PAGE = 24;

  // ---------- Estado ----------
  const state = {
    name: store.get('name', ''),
    leads: store.get('leads', {}),
    template: store.get('template', DEFAULT_MSG),
    recent: store.get('recent', []),
    last: store.get('last', null), // { query, results }
    shown: PAGE,
    leadFilter: 'todos',
    busy: false,
  };

  // ---------- Telas ----------
  function showScreen(id) {
    ['splash', 'onboarding', 'app'].forEach((s) => { $('#' + s).hidden = s !== id; });
    document.body.classList.toggle('in-app', id === 'app');
  }

  function startSplash() {
    const skip = sessionStorageGet('splash_seen');
    const next = () => {
      sessionStorageSet('splash_seen', '1');
      if (state.name) enterApp(); else enterOnboarding();
    };
    if (skip) { next(); return; }
    showScreen('splash');
    setTimeout(() => {
      $('#splash').classList.add('is-leaving');
      setTimeout(next, 550);
    }, 2300);
  }

  function sessionStorageGet(k) { try { return sessionStorage.getItem('webvee_' + k); } catch { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem('webvee_' + k, v); } catch { /* ignore */ } }

  function enterOnboarding() {
    showScreen('onboarding');
    const input = $('#onboard-name');
    input.value = state.name || '';
    $('#onboard-form button').disabled = !input.value.trim();
    setTimeout(() => input.focus(), 50);
  }

  function enterApp() {
    showScreen('app');
    renderUser();
    renderRecent();
    renderLeads();
    renderTemplate();
    if (state.last && state.last.results) {
      applyQueryToForm(state.last.query);
      renderResults();
    }
  }

  // ---------- Onboarding ----------
  $('#onboard-name').addEventListener('input', (e) => {
    $('#onboard-form button').disabled = !e.target.value.trim();
  });
  $('#onboard-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#onboard-name').value.trim().replace(/\s+/g, ' ');
    if (!name) return;
    state.name = name;
    store.set('name', name);
    enterApp();
    toast(`Bem-vindo(a), ${firstName()}!`);
  });

  function firstName() { return (state.name || '').split(' ')[0]; }

  // ---------- Topbar / usuário ----------
  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return 'Boa madrugada';
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function renderUser() {
    $('#user-avatar').textContent = (state.name || '?').trim().charAt(0).toUpperCase();
    $('#menu-name').textContent = state.name;
    $('#hello-eyebrow').textContent = greeting();
    $('#hello-name').textContent = firstName();
  }

  const userBtn = $('#user-btn');
  const userMenu = $('#user-menu');
  userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = userMenu.hidden;
    userMenu.hidden = !open;
    userBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!userMenu.hidden && !userMenu.contains(e.target)) {
      userMenu.hidden = true;
      userBtn.setAttribute('aria-expanded', 'false');
    }
  });
  $('#menu-rename').addEventListener('click', () => { userMenu.hidden = true; enterOnboarding(); });
  $('#menu-reset').addEventListener('click', () => {
    userMenu.hidden = true;
    if (!confirm('Apagar seu nome, leads salvos e buscas deste navegador?')) return;
    store.clear();
    Object.assign(state, { name: '', leads: {}, template: DEFAULT_MSG, recent: [], last: null });
    $('#results').innerHTML = '';
    ['#stats', '#toolbar', '#status'].forEach((s) => { $(s).hidden = true; });
    $('#empty').hidden = false;
    enterOnboarding();
  });

  // ---------- Abas ----------
  function setTab(id) {
    $$('.tab').forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    ['buscar', 'leads', 'mensagem'].forEach((p) => { $('#panel-' + p).hidden = p !== id; });
    if (id === 'leads') renderLeads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $$('.tab').forEach((t) => t.addEventListener('click', () => setTab(t.dataset.tab)));
  $('[data-tab-link]').addEventListener('click', (e) => { e.preventDefault(); setTab('buscar'); });

  // ---------- Formulário de busca ----------
  const nicheSelect = $('#niche');
  nicheSelect.innerHTML = NICHOS.map((n) => `<option value="${n.id}">${esc(n.label)}</option>`).join('');

  function readForm() {
    return {
      country: $('input[name="country"]:checked').value,
      city: $('#city').value.trim(),
      niche: nicheSelect.value,
    };
  }
  function applyQueryToForm(q) {
    if (!q) return;
    const radio = $(`input[name="country"][value="${q.country}"]`);
    if (radio) radio.checked = true;
    $('#city').value = q.city;
    nicheSelect.value = q.niche;
  }
  const nicheLabel = (id) => (NICHOS.find((n) => n.id === id) || NICHOS[0]).label;
  const countryName = (c) => (c === 'pt' ? 'Portugal' : 'Brasil');

  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = readForm();
    if (!q.city) { $('#city').focus(); return; }
    runSearch(q);
  });

  function renderSuggestions() {
    $('#suggestions').innerHTML = SUGGESTIONS.map((s, i) =>
      `<button class="chip" type="button" data-sug="${i}">${s.country === 'pt' ? '🇵🇹' : '🇧🇷'} ${esc(nicheLabel(s.niche))} em ${esc(s.city)}</button>`
    ).join('');
  }
  $('#suggestions').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sug]');
    if (!b) return;
    const q = SUGGESTIONS[+b.dataset.sug];
    applyQueryToForm(q);
    runSearch(q);
  });

  function renderRecent() {
    const box = $('#recent');
    if (!state.recent.length) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<span class="recent__label">Recentes:</span>' + state.recent.map((r, i) =>
      `<button class="chip" type="button" data-recent="${i}">${r.country === 'pt' ? '🇵🇹' : '🇧🇷'} ${esc(nicheLabel(r.niche))} · ${esc(r.city)}</button>`
    ).join('');
  }
  $('#recent').addEventListener('click', (e) => {
    const b = e.target.closest('[data-recent]');
    if (!b) return;
    const q = state.recent[+b.dataset.recent];
    applyQueryToForm(q);
    runSearch(q);
  });

  function pushRecent(q) {
    const key = (r) => `${r.country}|${r.city.toLowerCase()}|${r.niche}`;
    state.recent = [q, ...state.recent.filter((r) => key(r) !== key(q))].slice(0, 5);
    store.set('recent', state.recent);
    renderRecent();
  }

  // ---------- Busca (OpenStreetMap) ----------
  function setStatus(html, isError = false) {
    const el = $('#status');
    el.hidden = !html;
    el.classList.toggle('is-error', isError);
    el.innerHTML = html || '';
  }

  function showSkeleton() {
    $('#results').innerHTML = Array.from({ length: 6 }, () => '<div class="skeleton"></div>').join('');
  }

  async function geocode(city, country) {
    const url = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
      q: city, countrycodes: country, format: 'jsonv2', limit: '8', 'accept-language': 'pt',
    });
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('geocode');
    const list = await res.json();
    if (!list.length) return null;
    const placeTypes = ['city', 'town', 'municipality', 'village', 'administrative', 'suburb', 'county', 'city_district', 'borough', 'quarter', 'neighbourhood'];
    const pick = list.find((p) => p.osm_type === 'relation' && placeTypes.includes(p.addresstype || p.type))
      || list.find((p) => p.osm_type === 'relation')
      || list[0];
    const [s, n, w, e] = pick.boundingbox.map(Number);
    return {
      name: (pick.name || pick.display_name.split(',')[0]).trim(),
      areaId: pick.osm_type === 'relation' ? 3600000000 + Number(pick.osm_id) : null,
      bbox: [s, w, n, e],
      lat: Number(pick.lat),
      lon: Number(pick.lon),
    };
  }

  function buildOverpass(niche, place) {
    let head = '';
    let scope;
    if (place.areaId) {
      head = `area(id:${place.areaId})->.a;`;
      scope = '(area.a)';
    } else {
      // Sem polígono da cidade: raio de 8 km a partir do centro
      scope = `(around:8000,${place.lat},${place.lon})`;
    }
    const parts = niche.q.map(([k, v]) => {
      const cond = v.includes('|') ? `["${k}"~"^(${v})$"]` : `["${k}"="${v}"]`;
      return `nwr${cond}["name"]${scope};`;
    }).join('');
    return `[out:json][timeout:60];${head}(${parts});out center tags 1500;`;
  }

  async function overpass(query) {
    let lastErr;
    for (const endpoint of OVERPASS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'data=' + encodeURIComponent(query),
        });
        if (!res.ok) throw new Error('overpass ' + res.status);
        return await res.json();
      } catch (err) { lastErr = err; }
    }
    throw lastErr || new Error('overpass');
  }

  const WEBSITE_KEYS = ['website', 'contact:website', 'url', 'brand:website', 'operator:website', 'website:menu'];
  const PHONE_KEYS = ['phone', 'contact:phone', 'contact:mobile', 'mobile', 'contact:whatsapp', 'whatsapp'];

  function normalize(el, country, cityName) {
    const t = el.tags || {};
    const hasSite = WEBSITE_KEYS.some((k) => t[k]);
    const phoneRaw = PHONE_KEYS.map((k) => t[k]).find(Boolean) || '';
    const phone = phoneRaw.split(/[;,/]/)[0].trim();
    const instagram = t['contact:instagram'] || t.instagram || '';
    const facebook = t['contact:facebook'] || t.facebook || '';
    const catKey = t.amenity || t.shop || t.healthcare || t.leisure || t.tourism || t.office || '';
    const street = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(', ');
    const district = t['addr:suburb'] || t['addr:neighbourhood'] || t['addr:quarter'] || t['addr:district'] || '';
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    return {
      id: `${el.type}/${el.id}`,
      name: t.name,
      category: CAT_LABELS[catKey] || (catKey ? catKey.replace(/_/g, ' ') : 'Empresa'),
      address: [street, district].filter(Boolean).join(' · '),
      city: t['addr:city'] || cityName,
      country,
      phone,
      instagram,
      facebook,
      hasSite,
      lat,
      lon,
    };
  }

  async function runSearch(q) {
    if (state.busy) return;
    state.busy = true;
    const btn = $('#search-btn');
    btn.disabled = true;
    $('#empty').hidden = true;
    $('#stats').hidden = true;
    $('#toolbar').hidden = true;
    showSkeleton();
    setStatus(`<span class="spinner"></span> Localizando ${esc(q.city)} em ${countryName(q.country)}…`);

    try {
      const place = await geocode(q.city, q.country);
      if (!place) {
        $('#results').innerHTML = '';
        setStatus(`Não encontrei “${esc(q.city)}” em ${countryName(q.country)}. Confira o nome da cidade.`, true);
        return;
      }
      setStatus(`<span class="spinner"></span> Buscando ${esc(nicheLabel(q.niche).toLowerCase())} em ${esc(place.name)}… isso pode levar alguns segundos.`);
      const niche = NICHOS.find((n) => n.id === q.niche) || NICHOS[0];
      const data = await overpass(buildOverpass(niche, place));
      const seen = new Set();
      const all = (data.elements || [])
        .filter((el) => el.tags && el.tags.name)
        .map((el) => normalize(el, q.country, place.name))
        .filter((r) => {
          const k = r.name.toLowerCase() + '|' + (r.address || '').toLowerCase();
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });

      const query = { ...q, city: place.name };
      state.last = {
        query,
        total: all.length,
        results: all.filter((r) => !r.hasSite).sort((a, b) => (b.phone ? 1 : 0) - (a.phone ? 1 : 0) || a.name.localeCompare(b.name, 'pt')),
      };
      store.set('last', state.last);
      pushRecent(query);
      applyQueryToForm(query);
      state.shown = PAGE;
      setStatus('');
      renderResults();
    } catch (err) {
      console.error(err);
      $('#results').innerHTML = '';
      setStatus('O servidor de mapas está ocupado agora. Espere alguns segundos e tente de novo.', true);
    } finally {
      state.busy = false;
      btn.disabled = false;
    }
  }

  // ---------- Resultados ----------
  const ICONS = {
    pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    at: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
    wa: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    map: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
    save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    saved: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  };

  function waNumber(phone, country) {
    let d = String(phone || '').replace(/\D/g, '');
    if (!d) return '';
    d = d.replace(/^00/, '');
    if (country === 'br') {
      d = d.replace(/^0+/, '');
      if (!d.startsWith('55') || d.length <= 11) d = '55' + d;
    } else if (country === 'pt') {
      if (!d.startsWith('351')) d = '351' + d;
    }
    return d;
  }

  function fillTemplate(tpl, lead) {
    return tpl
      .replace(/\{empresa\}/g, lead.name)
      .replace(/\{meu_nome\}/g, firstName() || state.name)
      .replace(/\{cidade\}/g, lead.city || '');
  }

  function waLink(lead) {
    const n = waNumber(lead.phone, lead.country);
    if (!n) return '';
    return `https://wa.me/${n}?text=${encodeURIComponent(fillTemplate(state.template, lead))}`;
  }

  function mapsLink(lead) {
    const q = lead.lat != null ? `${lead.name} @${lead.lat},${lead.lon}` : `${lead.name} ${lead.address} ${lead.city}`;
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  function socialBadge(r) {
    if (r.instagram) return '<span class="badge badge--amber">Só Instagram</span>';
    if (r.facebook) return '<span class="badge badge--amber">Só Facebook</span>';
    return '';
  }

  function filteredResults() {
    if (!state.last) return [];
    const text = $('#filter-text').value.trim().toLowerCase();
    const onlyPhone = $('#filter-phone').checked;
    return state.last.results.filter((r) =>
      (!onlyPhone || r.phone) &&
      (!text || r.name.toLowerCase().includes(text) || (r.address || '').toLowerCase().includes(text) || r.category.toLowerCase().includes(text))
    );
  }

  function cardHTML(r, i) {
    const saved = !!state.leads[r.id];
    const wa = waLink(r);
    const insta = r.instagram
      ? `<div>${ICONS.at}<span>${esc(r.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, ''))}</span></div>`
      : '';
    return `
      <article class="lead-card" style="animation-delay:${Math.min(i, 12) * 30}ms">
        <div class="lead-card__top">
          <div>
            <div class="lead-card__cat">${esc(r.category)}</div>
            <h3 class="lead-card__name">${esc(r.name)}</h3>
          </div>
        </div>
        <div class="badges">
          <span class="badge badge--blue">Sem site</span>
          ${socialBadge(r)}
          ${r.phone ? '' : '<span class="badge badge--muted">Sem telefone</span>'}
        </div>
        <div class="lead-card__info">
          <div>${ICONS.pin}<span>${esc(r.address || r.city)}</span></div>
          ${r.phone ? `<div>${ICONS.phone}<a href="tel:${esc(r.phone.replace(/[^\d+]/g, ''))}">${esc(r.phone)}</a></div>` : ''}
          ${insta}
        </div>
        <div class="lead-card__actions">
          ${wa ? `<a class="btn btn--sm btn--wa" href="${esc(wa)}" target="_blank" rel="noopener">${ICONS.wa} WhatsApp</a>` : ''}
          <a class="btn btn--sm btn--outline" href="${esc(mapsLink(r))}" target="_blank" rel="noopener">${ICONS.map} Mapa</a>
          <button class="btn btn--sm ${saved ? 'btn--saved' : 'btn--outline'}" data-save="${esc(r.id)}" aria-pressed="${saved}">
            ${saved ? ICONS.saved + ' Salvo' : ICONS.save + ' Salvar lead'}
          </button>
        </div>
      </article>`;
  }

  function renderResults() {
    const last = state.last;
    if (!last) return;
    const res = last.results;
    $('#empty').hidden = true;
    $('#stats').hidden = false;
    $('#toolbar').hidden = false;
    $('#st-total').textContent = last.total ?? res.length;
    $('#st-nosite').textContent = res.length;
    $('#st-phone').textContent = res.filter((r) => r.phone).length;
    $('#st-social').textContent = res.filter((r) => r.instagram || r.facebook).length;

    const list = filteredResults();
    $('#results-title').textContent =
      `${nicheLabel(last.query.niche)} sem site em ${last.query.city} · ${list.length} ${list.length === 1 ? 'resultado' : 'resultados'}`;

    if (!res.length) {
      $('#results').innerHTML = '';
      setStatus(`Todas as empresas desse nicho encontradas em ${esc(last.query.city)} já têm site. Tente outro nicho.`);
      return;
    }
    if (!list.length) {
      $('#results').innerHTML = '';
      setStatus('Nenhum resultado com esses filtros.');
      return;
    }
    setStatus('');
    const slice = list.slice(0, state.shown);
    let html = slice.map(cardHTML).join('');
    $('#results').innerHTML = html;
    const more = list.length - slice.length;
    let moreBox = $('#load-more');
    if (more > 0) {
      if (!moreBox) {
        moreBox = document.createElement('div');
        moreBox.id = 'load-more';
        moreBox.className = 'load-more';
        $('#results').after(moreBox);
      }
      moreBox.innerHTML = `<button class="btn btn--outline" type="button">Mostrar mais ${Math.min(more, PAGE)} de ${more}</button>`;
      moreBox.hidden = false;
    } else if (moreBox) {
      moreBox.hidden = true;
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('#load-more button')) {
      state.shown += PAGE;
      renderResults();
    }
  });

  $('#filter-text').addEventListener('input', () => { state.shown = PAGE; renderResults(); });
  $('#filter-phone').addEventListener('change', () => { state.shown = PAGE; renderResults(); });

  $('#results').addEventListener('click', (e) => {
    const b = e.target.closest('[data-save]');
    if (!b) return;
    const id = b.dataset.save;
    if (state.leads[id]) {
      delete state.leads[id];
      toast('Lead removido');
    } else {
      const r = state.last.results.find((x) => x.id === id);
      if (!r) return;
      state.leads[id] = { ...r, status: 'novo', notes: '', savedAt: Date.now() };
      toast(`${r.name} salvo nos seus leads`);
    }
    store.set('leads', state.leads);
    const saved = !!state.leads[id];
    b.className = `btn btn--sm ${saved ? 'btn--saved' : 'btn--outline'}`;
    b.setAttribute('aria-pressed', String(saved));
    b.innerHTML = saved ? ICONS.saved + ' Salvo' : ICONS.save + ' Salvar lead';
    renderLeadsCount();
  });

  // ---------- Meus leads ----------
  function leadList() {
    return Object.values(state.leads).sort((a, b) => b.savedAt - a.savedAt);
  }

  function renderLeadsCount() {
    const n = Object.keys(state.leads).length;
    const el = $('#leads-count');
    el.textContent = n;
    el.toggleAttribute('data-zero', n === 0);
  }

  function renderLeads() {
    renderLeadsCount();
    const all = leadList();
    const counts = Object.fromEntries(STATUSES.map((s) => [s.id, all.filter((l) => l.status === s.id).length]));
    $('#status-pills').innerHTML =
      `<button class="pill ${state.leadFilter === 'todos' ? 'is-active' : ''}" data-filter="todos">Todos <b>${all.length}</b></button>` +
      STATUSES.map((s) => `<button class="pill ${state.leadFilter === s.id ? 'is-active' : ''}" data-filter="${s.id}">${s.label} <b>${counts[s.id]}</b></button>`).join('');
    $('#status-pills').hidden = !all.length;
    $('#export-csv').disabled = !all.length;

    const list = state.leadFilter === 'todos' ? all : all.filter((l) => l.status === state.leadFilter);
    $('#leads-empty').hidden = all.length > 0;
    $('#leads-list').innerHTML = list.map((l) => {
      const wa = waLink(l);
      return `
        <div class="lead-row" data-id="${esc(l.id)}">
          <div>
            <div class="lead-row__name">${esc(l.name)}</div>
            <div class="lead-row__meta">${esc(l.category)} · ${esc(l.city)}${l.phone ? ' · ' + esc(l.phone) : ''}</div>
          </div>
          <select class="input status-select" data-field="status" data-status="${l.status}" aria-label="Status de ${esc(l.name)}">
            ${STATUSES.map((s) => `<option value="${s.id}" ${s.id === l.status ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
          <input class="input lead-row__notes" data-field="notes" type="text" placeholder="Anotações (ex.: ligar sexta)" value="${esc(l.notes)}" aria-label="Anotações de ${esc(l.name)}">
          <div class="lead-row__actions">
            ${wa ? `<a class="icon-btn icon-btn--wa" href="${esc(wa)}" target="_blank" rel="noopener" title="Chamar no WhatsApp" aria-label="WhatsApp">${ICONS.wa}</a>` : ''}
            <a class="icon-btn" href="${esc(mapsLink(l))}" target="_blank" rel="noopener" title="Ver no mapa" aria-label="Mapa">${ICONS.map}</a>
            <button class="icon-btn icon-btn--del" data-remove title="Remover" aria-label="Remover">${ICONS.trash}</button>
          </div>
        </div>`;
    }).join('') || (all.length ? '<p class="muted">Nenhum lead com esse status.</p>' : '');
  }

  $('#status-pills').addEventListener('click', (e) => {
    const p = e.target.closest('[data-filter]');
    if (!p) return;
    state.leadFilter = p.dataset.filter;
    renderLeads();
  });

  let notesTimer;
  $('#leads-list').addEventListener('input', (e) => {
    const row = e.target.closest('.lead-row');
    if (!row || e.target.dataset.field !== 'notes') return;
    state.leads[row.dataset.id].notes = e.target.value;
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => store.set('leads', state.leads), 300);
  });
  $('#leads-list').addEventListener('change', (e) => {
    const row = e.target.closest('.lead-row');
    if (!row || e.target.dataset.field !== 'status') return;
    state.leads[row.dataset.id].status = e.target.value;
    store.set('leads', state.leads);
    renderLeads();
  });
  $('#leads-list').addEventListener('click', (e) => {
    if (!e.target.closest('[data-remove]')) return;
    const row = e.target.closest('.lead-row');
    delete state.leads[row.dataset.id];
    store.set('leads', state.leads);
    renderLeads();
    if (state.last) renderResults();
    toast('Lead removido');
  });

  $('#export-csv').addEventListener('click', () => {
    const rows = leadList();
    if (!rows.length) return;
    const head = ['Empresa', 'Categoria', 'Endereço', 'Cidade', 'País', 'Telefone', 'Instagram', 'Status', 'Anotações', 'WhatsApp'];
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = rows.map((l) => [
      l.name, l.category, l.address, l.city, countryName(l.country), l.phone, l.instagram,
      (STATUSES.find((s) => s.id === l.status) || {}).label, l.notes, waNumber(l.phone, l.country) ? 'https://wa.me/' + waNumber(l.phone, l.country) : '',
    ].map(cell).join(';'));
    const blob = new Blob(['﻿' + [head.map(cell).join(';'), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `webvee-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('CSV exportado');
  });

  // ---------- Mensagem ----------
  const sampleLead = () => ({ name: 'Padaria Pão Dourado', city: (state.last && state.last.query.city) || 'Teresina' });
  function renderTemplate() {
    $('#msg-template').value = state.template;
    renderPreview();
  }
  function renderPreview() {
    $('#msg-preview').textContent = fillTemplate($('#msg-template').value, sampleLead());
  }
  $('#msg-template').addEventListener('input', renderPreview);
  $('#msg-save').addEventListener('click', () => {
    state.template = $('#msg-template').value.trim() || DEFAULT_MSG;
    store.set('template', state.template);
    if (state.last) renderResults();
    toast('Mensagem salva');
  });
  $('#msg-reset').addEventListener('click', () => {
    $('#msg-template').value = DEFAULT_MSG;
    renderPreview();
  });

  // ---------- Início ----------
  renderSuggestions();
  renderLeadsCount();
  startSplash();
})();
