// Painel administrativo do site (/admin)
// Tudo passa pelo Supabase com a sessão de quem entrou: as políticas RLS do banco
// só deixam gravar quem está na tabela "admins". O painel não guarda senha nem chave secreta.
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (id, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#a-${id}" /></svg>`;
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const dateBR = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');
  const plural = (n, one, many) => `${n.toLocaleString('pt-BR')} ${n === 1 ? one : many}`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const TIPOS = { casa: 'Casa', apartamento: 'Apartamento', terreno: 'Terreno', comercial: 'Comercial', outros: 'Outros' };
  const FINALIDADES = { venda: 'Venda', aluguel: 'Aluguel' };
  const STATUS = { disponivel: 'Disponível', vendido: 'Vendido', alugado: 'Alugado' };
  const UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
  const PAGE_SIZE = 20;
  const BUCKET = 'imoveis';
  const SITE_BUCKET = 'site';
  const MAX_FOTOS = 30;
  const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];

  const app = $('#app');
  let sb = null;          // cliente do Supabase
  let cfg = null;         // { url, anonKey }
  let user = null;        // usuário admin logado
  let siteName = 'Thiago Liro';
  // nomes antigos (o de exemplo "Morada", o do dono anterior e o "Recanto do Acre Flats") não valem: fica o nome da marca
  const NOME_MARCA = 'Thiago Liro';
  const nomeAntigo = (n) => /^morada$|artur|arthur|guimar/i.test(String(n || '').trim());
  const nomeDoSite = (n) => { const v = String(n || '').trim(); return v && !nomeAntigo(v) && !/^recanto do acre flats$/i.test(v) ? v : ''; };
  // Tema: claro (padrão, verde e bege) ou escuro (verde-floresta). O botão de sol troca e a escolha fica salva neste aparelho.
  const THEME_KEY = 'morada:admin-tema';
  const isLight = () => document.documentElement.dataset.theme === 'light';
  const themeLabel = () => (isLight() ? 'Mudar para o modo escuro' : 'Mudar para o modo claro');
  const themeBtn = (cls = '') => `<button class="icon-btn theme-btn ${cls}" type="button" data-theme-toggle aria-label="${themeLabel()}" title="${themeLabel()}">${icon(isLight() ? 'moon' : 'sun')}</button>`;
  function toggleTheme() {
    const light = !isLight();
    if (light) document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(THEME_KEY, light ? 'claro' : 'escuro'); } catch (_) { /* sem armazenamento: vale só agora */ }
    $$('[data-theme-toggle]').forEach((b) => {
      b.innerHTML = icon(light ? 'moon' : 'sun');
      b.setAttribute('aria-label', themeLabel());
      b.title = themeLabel();
    });
  }
  document.addEventListener('click', (e) => { if (e.target.closest('[data-theme-toggle]')) toggleTheme(); });
  // nome que aparece no painel (assinatura "Thiago TL Liro", como no site)
  const PAINEL_NOME = 'Thiago Liro';
  const BRAND_HTML = '<span class="brand" aria-hidden="true"><span class="brand-s">Thiago</span><span class="brand-tl">TL</span><span class="brand-s">Liro</span></span>';
  let dirty = false;      // formulário com alterações não salvas
  let renderToken = 0;

  /* =========================================================
     Avisos (toasts), erros e botões ocupados
     ========================================================= */

  function toast(msg, kind = 'ok') {
    const el = document.createElement('div');
    el.className = `toast toast--${kind}`;
    el.innerHTML = `${icon(kind === 'ok' ? 'check' : 'alert')}<span>${esc(msg)}</span>`;
    $('#toasts').append(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 400); }, kind === 'ok' ? 3800 : 6500);
  }

  // mensagens claras para os erros do Supabase / da rede
  function errText(err) {
    const msg = String(err?.message || err?.error_description || err || '');
    const code = String(err?.code || '');
    if (/Failed to fetch|NetworkError|Load failed|network/i.test(msg)) return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.';
    if (code === 'PGRST301' || /JWT expired|jwt/i.test(msg)) return 'Sua sessão expirou. Entre de novo.';
    if (code === '42501' || /row-level security|permission denied|sem permiss/i.test(msg)) return 'Sem permissão para esta ação. Confira se a sua conta é de administrador.';
    if (code === '23505') return 'Já existe um registro com esses dados.';
    if (code === '23514' || code === '22P02') return 'Algum campo tem um valor inválido. Confira e tente de novo.';
    if (/Payload too large|exceeded the maximum/i.test(msg)) return 'A imagem ficou grande demais para enviar.';
    if (/mime type|invalid_mime/i.test(msg)) return 'Formato de imagem não aceito. Use JPG, PNG ou WebP.';
    if (/Bucket not found/i.test(msg)) return 'O espaço de fotos (Storage) ainda não foi criado. Rode a migração do Supabase.';
    if (code === 'PGRST202' || /could not find the function/i.test(msg)) return 'Falta rodar no Supabase o SQL da página Clientes (migração 3). Depois recarregue a página.';
    if (code === 'PGRST204' || code === 'PGRST205' || code === '42P01' || code === '42703' || /could not find the .* (column|table)|does not exist/i.test(msg)) return 'Falta rodar no Supabase o arquivo SQL novo (migração 2). Depois recarregue a página.';
    return msg ? `Algo deu errado: ${msg}` : 'Algo deu errado. Tente de novo.';
  }
  const noRows = () => Object.assign(new Error('sem permissão'), { code: '42501' });

  function setBusy(btn, on, label) {
    if (!btn) return;
    if (on) {
      btn.dataset.label = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('is-busy');
      btn.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>${esc(label || 'Salvando…')}</span>`;
    } else {
      btn.disabled = false;
      btn.classList.remove('is-busy');
      if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
    }
  }

  const stateBox = (kind, title, text, actions = '') => `
    <div class="state state--${kind}">
      <span class="state-ico">${icon(kind === 'error' ? 'alert' : kind === 'empty' ? 'building' : 'image')}</span>
      <h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}${actions ? `<div class="state-actions">${actions}</div>` : ''}
    </div>`;
  function showError(box, err, retry) {
    box.innerHTML = stateBox('error', 'Não foi possível carregar', errText(err), '<button class="btn" type="button" data-retry>Tentar de novo</button>');
    $('[data-retry]', box).addEventListener('click', retry);
  }

  /* ---------- Caixa de confirmação ---------- */

  function confirmBox({ title, text, confirm = 'Confirmar', danger = false }) {
    return new Promise((resolve) => {
      const back = document.createElement('div');
      back.className = 'modal-back';
      back.innerHTML = `
        <div class="modal modal--sm" role="alertdialog" aria-modal="true" aria-labelledby="cfTitle" aria-describedby="cfText">
          <h2 id="cfTitle">${esc(title)}</h2>
          <p id="cfText">${esc(text)}</p>
          <div class="modal-actions">
            <button class="btn" type="button" data-no>Cancelar</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" type="button" data-yes>${esc(confirm)}</button>
          </div>
        </div>`;
      const prev = document.activeElement;
      const done = (v) => { back.classList.remove('is-open'); setTimeout(() => back.remove(), 200); document.removeEventListener('keydown', onKey, true); prev?.focus?.(); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
      back.addEventListener('click', (e) => { if (e.target === back || e.target.closest('[data-no]')) done(false); if (e.target.closest('[data-yes]')) done(true); });
      document.addEventListener('keydown', onKey, true);
      document.body.append(back);
      requestAnimationFrame(() => back.classList.add('is-open'));
      $('[data-no]', back).focus();
    });
  }

  function openModal(html, onClose) {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    const prev = document.activeElement;
    const close = () => { back.classList.remove('is-open'); setTimeout(() => back.remove(), 200); document.removeEventListener('keydown', onKey, true); prev?.focus?.(); onClose?.(); };
    const onKey = (e) => { if (e.key === 'Escape' && !back.querySelector('.is-busy')) { e.stopPropagation(); close(); } };
    back.addEventListener('mousedown', (e) => { if (e.target === back && !back.querySelector('.is-busy')) close(); });
    document.addEventListener('keydown', onKey, true);
    document.body.append(back);
    requestAnimationFrame(() => back.classList.add('is-open'));
    return { el: $('.modal', back), close };
  }

  /* =========================================================
     Fotos: URL pública, compressão e envio ao Storage
     ========================================================= */

  const isStoragePath = (p) => !!p && !/^(https?:)?\/\//.test(p) && !p.startsWith('/') && !p.startsWith('data:');
  const thumbOf = (p) => p.replace(/(\.[a-z0-9]+)$/i, '-thumb$1');
  const withThumbs = (paths) => paths.filter(isStoragePath).flatMap((p) => [p, thumbOf(p)]);
  function publicUrl(bucket, p) {
    return `${cfg.url}/storage/v1/object/public/${bucket}/${p.split('/').map(encodeURIComponent).join('/')}`;
  }
  // mesma regra do site: caminho no bucket (com miniatura "-thumb") ou URL completa
  function fotoUrl(p, w = 640) {
    if (!p) return '';
    if (/^https:\/\/images\.unsplash\.com\//.test(p)) return p.replace(/([?&])w=\d+/, `$1w=${w}`);
    if (p.startsWith('/assets/imoveis/')) return w <= 700 ? thumbOf(p) : p; // fotos que vêm junto com o site
    if (!isStoragePath(p)) return p;
    return publicUrl(BUCKET, w <= 700 ? thumbOf(p) : p);
  }
  const siteUrl = (p) => (!p ? '' : isStoragePath(p) ? publicUrl(SITE_BUCKET, p) : p);
  const thumbImg = (p, cls = 'thumb') => (p
    ? `<span class="${cls}"><img src="${esc(fotoUrl(p, 320))}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.remove()" /></span>`
    : `<span class="${cls} is-empty">${icon('image')}</span>`);

  async function decode(file) {
    if ('createImageBitmap' in window) {
      try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (_) { /* tenta pela <img> */ }
    }
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não deu para abrir esta imagem.')); };
      img.src = url;
    });
  }
  const toBlob = (canvas, type, q) => new Promise((r) => canvas.toBlob(r, type, q));
  async function resize(src, max, quality, keepAlpha) {
    const w = src.width || src.naturalWidth;
    const h = src.height || src.naturalHeight;
    const k = Math.min(1, max / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * k));
    canvas.height = Math.max(1, Math.round(h * k));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    let blob = await toBlob(canvas, 'image/webp', quality);
    if (!blob || blob.type !== 'image/webp') blob = keepAlpha ? await toBlob(canvas, 'image/png') : await toBlob(canvas, 'image/jpeg', quality);
    if (!blob) throw new Error('Não deu para preparar esta imagem.');
    return blob;
  }
  const extOf = (type) => ({ 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' }[type] || 'jpg');

  function checkFile(file) {
    if (!ACCEPT.includes(file.type)) return `“${file.name}” não é JPG, PNG ou WebP.`;
    if (file.size > 25 * 1024 * 1024) return `“${file.name}” passa de 25 MB. Use uma foto menor.`;
    return '';
  }

  // comprime (máx. 1600 px + miniatura de 640 px) e envia ao bucket "imoveis"
  async function uploadFoto(imovelId, file) {
    const src = await decode(file);
    const full = await resize(src, 1600, 0.82);
    const thumb = await resize(src, 640, 0.78);
    src.close?.();
    if (full.size > 5 * 1024 * 1024) throw new Error('Payload too large');
    const path = `${imovelId}/${crypto.randomUUID()}.${extOf(full.type)}`;
    const store = sb.storage.from(BUCKET);
    const up1 = await store.upload(path, full, { contentType: full.type, cacheControl: '31536000', upsert: false });
    if (up1.error) throw up1.error;
    const up2 = await store.upload(thumbOf(path).replace(/\.[a-z0-9]+$/i, `.${extOf(thumb.type)}`), thumb, { contentType: thumb.type, cacheControl: '31536000', upsert: false });
    if (up2.error) { await store.remove([path]); throw up2.error; }
    return path;
  }
  async function uploadSiteFile(folder, file, max, keepAlpha) {
    const src = await decode(file);
    const blob = await resize(src, max, 0.86, keepAlpha);
    src.close?.();
    const path = `${folder}/${crypto.randomUUID()}.${extOf(blob.type)}`;
    const { error } = await sb.storage.from(SITE_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false });
    if (error) throw error;
    return path;
  }
  const removeFiles = (bucket, paths) => (paths.length ? sb.storage.from(bucket).remove(paths).catch(() => {}) : Promise.resolve());

  /* =========================================================
     Rotas
     ========================================================= */

  const ROUTES = [
    { re: /^\/admin\/login$/, view: viewLogin, open: true },
    { re: /^\/admin$/, view: viewDashboard, nav: 'dash', title: 'Dashboard' },
    { re: /^\/admin\/relatorios$/, view: viewRelatorios, nav: 'relatorios', title: 'Relatórios' },
    { re: /^\/admin\/imoveis$/, view: viewImoveis, nav: 'imoveis', title: 'Imóveis' },
    { re: /^\/admin\/imoveis\/novo$/, view: (p, _m, alive) => viewForm(p, null, alive), nav: 'imoveis', title: 'Novo imóvel' },
    { re: /^\/admin\/imoveis\/([0-9a-f-]{36})\/editar$/, view: (p, m, alive) => viewForm(p, m[1], alive), nav: 'imoveis', title: 'Editar imóvel' },
    { re: /^\/admin\/avaliacoes$/, view: viewAvaliacoes, nav: 'avaliacoes', title: 'Avaliações' },
    { re: /^\/admin\/(alto-padrao|destaques)$/, view: viewDestaques, nav: 'destaques', title: 'Alto padrão' },
    { re: /^\/admin\/configuracoes$/, view: viewConfig, nav: 'config', title: 'Configurações' },
    { re: /^\/admin\/contatos$/, view: viewContatos, nav: 'contatos', title: 'Contatos' },
    { re: /^\/admin\/clientes$/, view: viewClientes, nav: 'clientes', title: 'Clientes' },
    { re: /^\/admin\/minha-conta$/, view: viewMinhaConta, nav: 'conta', title: 'Minha conta' },
    { re: /^\/admin\/nova-senha$/, view: viewNovaSenha, open: true, always: true },
  ];
  const LEAVE_MSG = 'Existem alterações que não foram salvas. Sair mesmo assim?';

  function navigate(to, replace) {
    if (dirty && !replace && !confirm(LEAVE_MSG)) return;
    dirty = false;
    history[replace ? 'replaceState' : 'pushState'](null, '', to);
    render();
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    closeDrawer();
    navigate(a.getAttribute('href'));
  });
  addEventListener('popstate', () => {
    if (dirty && !confirm(LEAVE_MSG)) { history.pushState(null, '', app.dataset.path || '/admin'); return; }
    dirty = false;
    render();
  });
  addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  // o aviso de erro de um campo some assim que ele é corrigido
  document.addEventListener('input', (e) => {
    const f = e.target.closest?.('.field.has-error');
    if (!f) return;
    f.classList.remove('has-error');
    const err = $('.err', f);
    if (err) err.textContent = '';
  });

  function render() {
    const token = ++renderToken;
    const path = location.pathname.replace(/\/+$/, '') || '/admin';
    const route = ROUTES.find((r) => r.re.test(path));
    if (!route) return navigate('/admin', true);
    if (!route.open && !user) {
      return navigate(`/admin/login${path !== '/admin' ? `?next=${encodeURIComponent(path + location.search)}` : ''}`, true);
    }
    if (route.open && user && !route.always) return navigate(safeNext() || '/admin', true);
    app.dataset.path = location.pathname + location.search;
    const alive = () => token === renderToken;
    if (route.open) {
      document.title = route.always ? 'Nova senha — Painel administrativo' : 'Entrar — Painel administrativo';
      route.view(app, null, alive);
      return;
    }
    // página nova a cada rota: nenhum evento da tela anterior continua ligado
    const old = shell(route.nav);
    const page = old.cloneNode(false);
    old.replaceWith(page);
    document.title = `${route.title} — Painel ${PAINEL_NOME}`;
    page.innerHTML = '';
    page.scrollTop = 0;
    scrollTo(0, 0);
    route.view(page, path.match(route.re), alive);
  }
  function safeNext() {
    const next = new URLSearchParams(location.search).get('next') || '';
    return /^\/admin(\/[\w\-/]*)?(\?[\w=&%-]*)?$/.test(next) && !next.startsWith('/admin/login') ? next : '';
  }

  /* =========================================================
     Estrutura: menu lateral + topo
     ========================================================= */

  function shell(active) {
    if (!$('.shell', app)) {
      app.innerHTML = `
        <div class="shell">
          <aside class="side" id="side" aria-label="Menu do painel">
            <a class="side-brand" href="/admin" data-link aria-label="Início do painel">${BRAND_HTML}</a>
            <nav class="side-nav">
              <a href="/admin" data-link data-nav="dash">${icon('dash')}<span>Dashboard</span></a>
              <a href="/admin/relatorios" data-link data-nav="relatorios">${icon('chart')}<span>Relatórios</span></a>
              <a href="/admin/imoveis" data-link data-nav="imoveis">${icon('building')}<span>Imóveis</span></a>
              <a href="/admin/contatos" data-link data-nav="contatos">${icon('mail')}<span>Contatos</span><b class="nav-badge" id="navBadge" hidden></b></a>
              <a href="/admin/clientes" data-link data-nav="clientes">${icon('users')}<span>Clientes</span></a>
              <a href="/admin/avaliacoes" data-link data-nav="avaliacoes">${icon('chat')}<span>Avaliações</span></a>
              <a href="/admin/alto-padrao" data-link data-nav="destaques">${icon('star')}<span>Alto padrão</span></a>
              <a href="/admin/configuracoes" data-link data-nav="config">${icon('gear')}<span>Configurações</span></a>
            </nav>
            <a class="side-site" href="/" target="_blank" rel="noopener">${icon('ext')}<span>Ver o site</span></a>
          </aside>
          <div class="side-shade" data-close-drawer></div>
          <div class="main">
            <header class="top">
              <button class="icon-btn top-menu" type="button" aria-label="Abrir menu" aria-controls="side" aria-expanded="false">${icon('menu')}</button>
              <a class="top-name" href="/admin" data-link aria-label="Início do painel">${BRAND_HTML}</a>
              ${themeBtn()}
              <a class="top-user" href="/admin/minha-conta" data-link title="Minha conta e senha">
                <span class="avatar" aria-hidden="true"></span>
                <span class="top-who"><b>Administrador</b><small class="top-mail"></small></span>
              </a>
              <button class="btn btn-ghost top-out" type="button" id="logoutBtn">${icon('out')}<span>Sair</span></button>
            </header>
            <main class="page" id="page" tabindex="-1"></main>
          </div>
        </div>`;
      $('#logoutBtn').addEventListener('click', logout);
      $('.top-menu').addEventListener('click', () => toggleDrawer());
      $('[data-close-drawer]').addEventListener('click', closeDrawer);
      paintIdentity();
    }
    $$('.side-nav a').forEach((a) => {
      const on = a.dataset.nav === active;
      a.classList.toggle('is-on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    refreshBadge();
    return $('#page');
  }
  // contador de mensagens novas no menu
  async function refreshBadge() {
    const { count, error } = await sb.from('contatos').select('id', { count: 'exact', head: true }).eq('lido', false);
    const b = $('#navBadge');
    if (!b) return;
    b.hidden = !!error || !count;
    b.textContent = count > 99 ? '99+' : String(count || '');
  }
  function paintIdentity() {
    $$('[data-site-name]').forEach((el) => { el.textContent = siteName; });
    if (!user || !$('.top-mail')) return;
    $('.top-mail').textContent = user.email || '';
    $('.top-who b').textContent = myName ? `Olá, ${firstName()}` : 'Administrador';
    paintAvatar($('.top-user .avatar'));
  }
  // foto de perfil do administrador (bucket "perfis", pasta do próprio usuário)
  let myPhoto = '';
  let myName = '';
  let nameAsked = false;
  const firstName = () => myName.trim().split(/\s+/)[0] || '';
  const hello = () => (myName ? `Olá, ${firstName()}!` : 'Dashboard');
  const perfilUrl = (p) => (!p ? '' : /^(https?:|blob:|data:)/.test(p) ? p : publicUrl('perfis', p));
  function paintAvatar(el) {
    if (!el) return;
    const url = perfilUrl(myPhoto);
    el.style.backgroundImage = url ? `url("${url}")` : '';
    el.classList.toggle('has-photo', !!url);
    el.textContent = url ? '' : (myName || user?.email || 'A').trim()[0].toUpperCase();
  }
  let profileLoad = null;
  function loadMyProfile(force) {
    if (profileLoad && !force) return profileLoad;
    profileLoad = (async () => {
      const { data, error } = await sb.from('perfis').select('nome,foto').eq('id', user.id).maybeSingle();
      if (error) throw error;
      myPhoto = data?.foto || '';
      myName = data?.nome || '';
      paintIdentity();
      $$('[data-hello]').forEach((el) => { el.textContent = hello(); });
      if (!myName) askName();
    })();
    profileLoad.catch(() => { profileLoad = null; });
    return profileLoad;
  }
  async function saveMyName(nome) {
    const { data, error } = await sb.from('perfis').upsert({ id: user.id, nome }, { onConflict: 'id' }).select('id');
    if (error || !data?.length) throw error || noRows();
    myName = nome;
    paintIdentity();
    $$('[data-hello]').forEach((el) => { el.textContent = hello(); });
  }
  // primeiro acesso: pergunta como a pessoa quer ser chamada
  function askName() {
    if (nameAsked || sessionStorage.getItem('morada:admin-sem-nome') || location.pathname === '/admin/minha-conta') return;
    nameAsked = true;
    const m = openModal(`
      <form id="nameForm" novalidate>
        <div class="modal-head"><h2>Como você quer ser chamado?</h2><button class="icon-btn" type="button" data-skip aria-label="Agora não">${icon('close')}</button></div>
        <p class="hint" style="margin:-6px 0 14px">O painel vai te receber pelo nome. Dá para mudar depois em Minha conta.</p>
        <label class="field"><span>Seu nome</span><input name="nome" maxlength="60" autocomplete="given-name" required placeholder="Ex.: Kelmaria" /><small class="err"></small></label>
        <div class="modal-actions">
          <button class="btn" type="button" data-skip>Agora não</button>
          <button class="btn btn-primary" type="submit" id="nameSave">Salvar</button>
        </div>
      </form>`);
    const f = $('#nameForm', m.el);
    setTimeout(() => f.nome.focus(), 60);
    $$('[data-skip]', m.el).forEach((b) => b.addEventListener('click', () => { sessionStorage.setItem('morada:admin-sem-nome', '1'); m.close(); }));
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#nameSave', m.el);
      if (btn.disabled) return;
      const nome = f.nome.value.trim().replace(/\s+/g, ' ');
      if (nome.length < 2) { const fl = f.nome.closest('.field'); fl.classList.add('has-error'); $('.err', fl).textContent = 'Digite seu nome.'; f.nome.focus(); return; }
      setBusy(btn, true, 'Salvando…');
      try {
        await saveMyName(nome);
        setBusy(btn, false);
        m.close();
        toast(`Prazer, ${firstName()}!`);
      } catch (err) {
        setBusy(btn, false);
        const fl = f.nome.closest('.field');
        fl.classList.add('has-error');
        $('.err', fl).textContent = errText(err);
      }
    });
  }
  async function squareAvatar(file) {
    const src = await decode(file);
    const w = src.width || src.naturalWidth;
    const h = src.height || src.naturalHeight;
    const side = Math.min(w, h);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, (w - side) / 2, (h - side) / 2, side, side, 0, 0, 256, 256);
    src.close?.();
    let blob = await toBlob(canvas, 'image/webp', 0.86);
    if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', 0.86);
    if (!blob) throw new Error('Não deu para preparar esta imagem.');
    return blob;
  }
  function toggleDrawer(force) {
    const open = force ?? !document.body.classList.contains('drawer-open');
    document.body.classList.toggle('drawer-open', open);
    $('.top-menu')?.setAttribute('aria-expanded', String(open));
  }
  const closeDrawer = () => toggleDrawer(false);

  async function loadSiteName() {
    if (user) loadMyProfile().catch(() => {});
    const { data } = await sb.from('configuracoes').select('nome_imobiliaria').eq('id', 1).maybeSingle();
    if (nomeDoSite(data?.nome_imobiliaria)) { siteName = nomeDoSite(data.nome_imobiliaria); paintIdentity(); }
  }

  async function logout() {
    if (dirty && !confirm(LEAVE_MSG)) return;
    dirty = false;
    setBusy($('#logoutBtn'), true, 'Saindo…');
    await sb.auth.signOut().catch(() => {});
    user = null;
    myName = '';
    myPhoto = '';
    profileLoad = null;
    nameAsked = false;
    navigate('/admin/login', true);
  }

  const pageHead = (title, sub, actions = '') => `
    <div class="page-head">
      <div><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ''}
    </div>`;

  /* =========================================================
     Login
     ========================================================= */

  let fails = 0;
  let waitUntil = 0;
  function viewLogin(root) {
    const reason = sessionStorage.getItem('morada:admin-aviso');
    sessionStorage.removeItem('morada:admin-aviso');
    root.innerHTML = `
      <main class="login">
        ${themeBtn('theme-float')}
        <section class="login-card" aria-labelledby="lgTitle">
          <div class="login-brand" role="img" aria-label="${PAINEL_NOME}">${BRAND_HTML}</div>
          <h1 id="lgTitle">PAINEL ADMINISTRATIVO</h1>
          <p class="login-sub">Entre com a sua conta de administrador para gerenciar imóveis, fotos e avaliações do site.</p>
          <form id="loginForm" novalidate>
            <label class="field">
              <span>E-mail</span>
              <input id="lgEmail" type="email" autocomplete="username" inputmode="email" required placeholder="voce@imobiliaria.com.br" />
            </label>
            <label class="field">
              <span>Senha</span>
              <span class="pass">
                <input id="lgPass" type="password" autocomplete="current-password" required placeholder="Sua senha" />
                <button class="pass-toggle" type="button" aria-pressed="false" aria-label="Mostrar senha" title="Mostrar senha">${icon('eye')}</button>
              </span>
            </label>
            <p class="form-msg" id="lgMsg" role="alert">${esc(reason || '')}</p>
            <button class="btn btn-primary btn-block btn-lg" type="submit" id="lgBtn">ENTRAR</button>
            <button class="link-btn" type="button" id="lgForgot">Esqueci minha senha</button>
          </form>
          <form id="forgotForm" novalidate hidden>
            <p class="login-sub">Digite o e-mail de administrador. Vamos enviar um link para você criar uma senha nova.</p>
            <label class="field">
              <span>E-mail</span>
              <input id="fgEmail" type="email" autocomplete="username" inputmode="email" required placeholder="voce@imobiliaria.com.br" />
            </label>
            <p class="form-msg" id="fgMsg" role="alert"></p>
            <button class="btn btn-primary btn-block btn-lg" type="submit" id="fgBtn">ENVIAR LINK</button>
            <button class="link-btn" type="button" id="fgBack">Voltar para entrar</button>
          </form>
          <p class="login-foot">${icon('lock')}<span>Acesso restrito. O cadastro de administradores é feito no Supabase.</span></p>
          <a class="login-back" href="/">${icon('left')}<span>Voltar para o site</span></a>
        </section>
        <div class="login-art" aria-hidden="true"></div>
      </main>`;
    const form = $('#loginForm');
    const msg = $('#lgMsg');
    const fgForm = $('#forgotForm');
    const showForgot = (on) => {
      form.hidden = on;
      fgForm.hidden = !on;
      $('#fgMsg').textContent = '';
      if (on) { $('#fgEmail').value = $('#lgEmail').value.trim(); setTimeout(() => $('#fgEmail').focus(), 30); }
    };
    $('#lgForgot').addEventListener('click', () => showForgot(true));
    $('#fgBack').addEventListener('click', () => showForgot(false));
    fgForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#fgBtn');
      if (btn.disabled) return;
      const email = $('#fgEmail').value.trim();
      const fmsg = $('#fgMsg');
      fmsg.classList.remove('is-ok');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { fmsg.textContent = 'Digite um e-mail válido.'; return; }
      setBusy(btn, true, 'Enviando…');
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/nova-senha` });
      setBusy(btn, false);
      if (error) { fmsg.textContent = /rate limit|429/i.test(`${error.message} ${error.status}`) ? 'Muitos pedidos seguidos. Aguarde alguns minutos.' : errText(error); return; }
      fmsg.classList.add('is-ok');
      fmsg.textContent = `Se ${email} for de um administrador, enviamos um link para criar a senha nova. Confira também o spam.`;
    });
    if (new URLSearchParams(location.search).has('esqueci')) showForgot(true);
    $('.pass-toggle', form).addEventListener('click', (e) => {
      const inp = $('#lgPass');
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      const label = show ? 'Esconder senha' : 'Mostrar senha';
      e.currentTarget.setAttribute('aria-label', label);
      e.currentTarget.title = label;
      e.currentTarget.innerHTML = icon(show ? 'eye-off' : 'eye');
      e.currentTarget.setAttribute('aria-pressed', String(show));
    });
    setTimeout(() => $('#lgEmail').focus(), 50);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#lgBtn');
      if (btn.disabled) return;
      const email = $('#lgEmail').value.trim().toLowerCase();
      const password = $('#lgPass').value;
      msg.textContent = '';
      $$('.field', form).forEach((f) => f.classList.remove('has-error'));
      if (Date.now() < waitUntil) {
        msg.textContent = `Muitas tentativas. Tente de novo em ${Math.ceil((waitUntil - Date.now()) / 1000)} segundos.`;
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        msg.textContent = 'Digite um e-mail válido.';
        $('#lgEmail').closest('.field').classList.add('has-error');
        $('#lgEmail').focus();
        return;
      }
      if (!password) {
        msg.textContent = 'Digite a sua senha.';
        $('#lgPass').closest('.field').classList.add('has-error');
        $('#lgPass').focus();
        return;
      }
      setBusy(btn, true, 'Entrando…');
      try {
        let { data, error } = await sb.auth.signInWithPassword({ email, password });
        // senha colada das anotações costuma vir com um espaço ou quebra de linha sobrando
        if (error && password.trim() !== password && password.trim() && (error.status === 400 || error.code === 'invalid_credentials')) {
          ({ data, error } = await sb.auth.signInWithPassword({ email, password: password.trim() }));
        }
        if (error) throw error;
        const admin = await isAdmin(data.user);
        if (!admin) {
          await sb.auth.signOut();
          msg.textContent = 'Esta conta não tem acesso ao painel. Fale com o responsável pelo site.';
          setBusy(btn, false);
          return;
        }
        fails = 0;
        user = data.user;
        loadSiteName().catch(() => {});
        navigate(safeNext() || '/admin', true);
        toast('Bem-vindo ao painel.');
      } catch (err) {
        setBusy(btn, false);
        const text = String(err?.message || '');
        if (err?.status === 429 || /rate limit|too many/i.test(text)) msg.textContent = 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.';
        else if (/email not confirmed/i.test(text) || err?.code === 'email_not_confirmed') msg.textContent = 'Este e-mail ainda não foi confirmado no Supabase.';
        else if (err?.status === 400 || /invalid login|invalid_credentials/i.test(text) || err?.code === 'invalid_credentials') {
          fails += 1;
          if (fails >= 5) { waitUntil = Date.now() + 60000; fails = 0; msg.textContent = 'E-mail ou senha incorretos. Por segurança, aguarde 1 minuto para tentar de novo.'; }
          else msg.textContent = 'E-mail ou senha incorretos. Confira tocando no olhinho da senha; se não lembrar, use “Esqueci minha senha” logo abaixo e crie uma nova pelo e-mail.';
          $('#lgPass').value = '';
          $('#lgPass').focus();
        } else msg.textContent = errText(err);
      }
    });
  }

  async function isAdmin(u) {
    if (!u) return false;
    const { data, error } = await sb.from('admins').select('user_id').eq('user_id', u.id).maybeSingle();
    if (error) throw error;
    return !!data;
  }

  /* =========================================================
     Dashboard
     ========================================================= */

  async function viewDashboard(page, _m, alive) {
    page.innerHTML = `${pageHead(hello(), 'Resumo do que está publicado no site agora.', `<a class="btn btn-primary" href="/admin/imoveis/novo" data-link>${icon('plus')}<span>Adicionar imóvel</span></a>`)}
      <div id="notice"></div>
      <div class="stats" id="stats">${Array.from({ length: 5 }, () => '<div class="stat is-skel"><i></i><b></b></div>').join('')}</div>
      <section class="panel" id="todo" hidden></section>
      <section class="panel">
        <div class="panel-head"><h2>Últimos imóveis adicionados</h2><a class="link" href="/admin/imoveis" data-link>Ver todos</a></div>
        <div id="recent">${skelRows(5)}</div>
      </section>`;
    $('.page-head h1', page).setAttribute('data-hello', '');
    loadExtras(alive);
    const load = async () => {
      const count = (f) => { let q = sb.from('imoveis').select('id', { count: 'exact', head: true }); if (f) q = f(q); return q; };
      try {
        const res = await Promise.all([
          count(),
          count((q) => q.eq('status', 'disponivel')),
          count((q) => q.eq('status', 'vendido')),
          count((q) => q.eq('status', 'alugado')),
          count((q) => q.eq('destaque', true)),
          sb.from('imoveis').select('id,titulo,preco,finalidade,status,destaque,imagem_principal,cidade,bairro,created_at').order('created_at', { ascending: false }).limit(5),
        ]);
        const bad = res.find((r) => r.error);
        if (bad) throw bad.error;
        if (!alive()) return;
        const [total, disp, vend, alug, dest, recent] = res;
        const cards = [
          ['Total de imóveis', total.count, 'building', '/admin/imoveis'],
          ['Disponíveis', disp.count, 'check', '/admin/imoveis?status=disponivel'],
          ['Vendidos', vend.count, 'home', '/admin/imoveis?status=vendido'],
          ['Alugados', alug.count, 'home', '/admin/imoveis?status=alugado'],
          ['Alto padrão', dest.count, 'star', '/admin/alto-padrao'],
        ];
        $('#stats').innerHTML = cards.map(([label, n, ic, href]) => `
          <a class="stat" href="${href}" data-link>
            <span class="stat-ico">${icon(ic)}</span>
            <span class="stat-label">${label}</span>
            <b class="stat-num">${(n ?? 0).toLocaleString('pt-BR')}</b>
          </a>`).join('');
        const rows = recent.data || [];
        $('#recent').innerHTML = rows.length ? `<ul class="recent">${rows.map((r) => `
          <li>
            ${thumbImg(r.imagem_principal)}
            <span class="recent-main"><b>${esc(r.titulo)}</b><small>${esc([r.bairro, r.cidade].filter(Boolean).join(' · '))}</small></span>
            <span class="recent-price">${priceText(r)}</span>
            ${statusPill(r.status)}
            <span class="recent-date">${dateBR(r.created_at)}</span>
            <a class="btn btn-sm" href="/admin/imoveis/${r.id}/editar" data-link>${icon('edit')}<span>Editar</span></a>
          </li>`).join('')}</ul>`
          : stateBox('empty', 'Nenhum imóvel cadastrado ainda', 'Cadastre o primeiro imóvel e ele aparece no site na hora.', `<a class="btn btn-primary" href="/admin/imoveis/novo" data-link>${icon('plus')}<span>Adicionar imóvel</span></a>`);
      } catch (err) {
        if (!alive()) return;
        $('#stats').innerHTML = '';
        showError($('#recent'), err, load);
      }
    };
    load();
  }

  // mensagens novas + lista do que falta para o site ficar completo (tudo conferido no banco)
  // dados que ficaram do dono anterior (nome antigo nas Configurações): um clique apaga tudo de uma vez
  function avisoDadosAntigos(c, box) {
    if (!c || !nomeAntigo(c.nome_imobiliaria)) return;
    const campos = [['Nome', c.nome_imobiliaria], ['WhatsApp', c.whatsapp], ['Telefone', c.telefone], ['E-mail', c.email], ['Instagram', c.instagram], ['Endereço', c.endereco]].filter(([, v]) => v);
    if (c.logo) campos.push(['Logo', 'imagem enviada']);
    if (c.familias_atendidas) campos.push(['Famílias atendidas', c.familias_atendidas]);
    if (c.anos_mercado) campos.push(['Anos de mercado', c.anos_mercado]);
    box.insertAdjacentHTML('afterbegin', `<div class="notice notice--warn" id="oldData">${icon('alert')}<span><b>Ainda há dados do dono anterior.</b> ${esc(campos.map(([k]) => k).join(', '))}. Apague para o painel e o site usarem só “${NOME_MARCA}”.</span><button class="btn btn-sm btn-danger-ghost" type="button" id="oldDataBtn">Apagar dados antigos</button></div>`);
    $('#oldDataBtn').addEventListener('click', async (e) => {
      const lista = campos.map(([k, v]) => `• ${k}: ${v}`).join('\n');
      if (!confirm(`Apagar estes dados do dono anterior?\n\n${lista}\n\nO nome passa a ser “${NOME_MARCA}”. Depois é só colocar os dados novos em Configurações.`)) return;
      const btn = e.currentTarget;
      setBusy(btn, true, 'Apagando…');
      const d = { nome_imobiliaria: NOME_MARCA, whatsapp: '', telefone: '', email: '', instagram: '', endereco: '', logo: null };
      if ('familias_atendidas' in c) { d.familias_atendidas = null; d.anos_mercado = null; }
      try {
        const { data, error } = await sb.from('configuracoes').update(d).eq('id', 1).select('id');
        if (error) throw error;
        if (!data.length) throw noRows();
        if (isStoragePath(c.logo)) removeFiles(SITE_BUCKET, [c.logo]);
        siteName = NOME_MARCA;
        paintIdentity();
        dirty = false;
        toast('Dados antigos apagados. Agora é só colocar os novos em Configurações.');
        render();
      } catch (err) {
        setBusy(btn, false);
        toast(errText(err), 'error');
      }
    });
  }

  // fotos que vieram com os imóveis de exemplo (banco de imagens do modelo): saem do banco na primeira vez que o painel abre
  const FOTOS_EXEMPLO = [
    '/assets/casa.webp',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
  ];
  let fotosExemploVistas = false; // tenta uma vez por abertura do painel
  async function tirarFotosExemplo() {
    if (fotosExemploVistas) return false;
    fotosExemploVistas = true;
    const [f, i] = await Promise.all([
      sb.from('imovel_fotos').select('id', { count: 'exact', head: true }).in('caminho', FOTOS_EXEMPLO),
      sb.from('imoveis').select('id', { count: 'exact', head: true }).in('imagem_principal', FOTOS_EXEMPLO),
    ]);
    if (f.error || i.error || (!f.count && !i.count)) return false;
    const [d, u] = await Promise.all([
      sb.from('imovel_fotos').delete().in('caminho', FOTOS_EXEMPLO),
      sb.from('imoveis').update({ imagem_principal: null }).in('imagem_principal', FOTOS_EXEMPLO),
    ]);
    return !d.error && !u.error;
  }

  const EXEMPLOS_AVALIACOES = ['Marina Duarte', 'Rafael Nogueira', 'Helena e Caio Prado', 'Nome do cliente 1', 'Nome do cliente 2', 'Nome do cliente 3', 'Juliana M.', 'Carlos R.', 'Fernanda e Paulo S.'];
  async function loadExtras(alive) {
    if (await tirarFotosExemplo().catch(() => false)) {
      if (!alive()) return;
      toast('As fotos de exemplo dos imóveis foram tiradas do site.');
      render();
      return;
    }
    const agora = new Date();
    const [novas, exAval, conf, clientes, relatorio, semCidade] = await Promise.all([
      sb.from('contatos').select('id', { count: 'exact', head: true }).eq('lido', false),
      sb.from('avaliacoes').select('id', { count: 'exact', head: true }).in('nome', EXEMPLOS_AVALIACOES),
      sb.from('configuracoes').select('*').eq('id', 1).maybeSingle(),
      sb.rpc('admin_clientes'),
      sb.rpc('admin_relatorio', { p_inicio: new Date(agora - 36e5).toISOString(), p_fim: agora.toISOString() }),
      sb.from('imoveis').select('titulo').ilike('cidade', 'a definir').order('ordem').limit(20),
    ]);
    if (!alive()) return;
    const semRelatorios = relatorio.error && (relatorio.error.code === 'PGRST202' || relatorio.error.code === '42883' || /could not find the function/i.test(relatorio.error.message || ''));
    if (!clientes.error) {
      const semana = Date.now() - 7 * 864e5;
      const ativos = clientes.data.filter((c) => c.ultimo_acesso && new Date(c.ultimo_acesso) > semana).length;
      $('#notice').insertAdjacentHTML('beforeend', `<a class="notice notice--soft" href="/admin/clientes" data-link>${icon('users')}<span><b>${plural(clientes.data.length, 'cliente cadastrado', 'clientes cadastrados')}</b> · ${plural(ativos, 'entrou', 'entraram')} nos últimos 7 dias</span><span class="notice-go">Ver clientes ${icon('right')}</span></a>`);
    }
    const semMigracao = !!novas.error || (conf.data && !('login_google' in conf.data));
    if (!novas.error && novas.count) {
      $('#notice').insertAdjacentHTML('afterbegin', `<a class="notice" href="/admin/contatos?filtro=novos" data-link>${icon('mail')}<span><b>${plural(novas.count, 'mensagem nova', 'mensagens novas')}</b> de clientes esperando resposta.</span><span class="notice-go">Ver mensagens ${icon('right')}</span></a>`);
    }
    const c = conf.data || {};
    avisoDadosAntigos(conf.data, $('#notice'));
    const nomesSemCidade = semCidade.error ? [] : semCidade.data.map((r) => r.titulo);
    const items = [
      [!clientes.error || semMigracao, false, 'Rodar o SQL da página Clientes', 'Mostra quem tem conta, favoritos e carrinhos. O arquivo é supabase/migrations/20260930180000_clientes_painel.sql.', ''],
      [!semRelatorios, false, 'Rodar o SQL dos Relatórios', 'Liga a contagem de visitas, imóveis vistos e cliques no WhatsApp. Na página Relatórios tem o botão para copiar o código.', '/admin/relatorios'],
      [!semMigracao, false, 'Rodar o SQL novo no Supabase', 'Liga as mensagens do site, as contas de clientes e os campos novos das Configurações. O arquivo é supabase/migrations/20260930120000_contas_contatos.sql.', ''],
      [!nomesSemCidade.length, false, 'Colocar a cidade dos imóveis', `${nomesSemCidade.join(', ')}: a cidade está como “A definir” e por isso não aparece no site. Abra o imóvel, troque a cidade e salve.`, '/admin/imoveis'],
      [!!c.whatsapp, true, 'Colocar o WhatsApp da imobiliária', 'Os botões “Falar no WhatsApp” do site mandam as mensagens para este número.', '/admin/configuracoes'],
      [!!(c.email && c.telefone), true, 'Preencher e-mail e telefone', 'Aparecem na seção Contato do site e na Política de Privacidade.', '/admin/configuracoes'],
      [!exAval.error && exAval.count === 0, true, 'Escrever as avaliações dos clientes', exAval.count ? `${plural(exAval.count, 'avaliação ainda é modelo', 'avaliações ainda são modelo')} ou exemplo. Em Avaliações, troque o nome e o texto pelo que o cliente real disse (com a permissão dele) e clique em Publicar.` : '', '/admin/avaliacoes'],
      [!!(c.familias_atendidas || c.anos_mercado), true, 'Números da apresentação (opcional)', 'Famílias atendidas e anos de mercado aparecem na abertura do site. Vazios, ficam escondidos.', '/admin/configuracoes'],
    ].filter(([done, show]) => show || !done);
    const pending = items.filter(([done]) => !done);
    const todo = $('#todo');
    if (!pending.length) { todo.hidden = true; return; }
    todo.hidden = false;
    todo.innerHTML = `<div class="panel-head"><h2>Para o site ficar completo</h2><small class="hint">${items.length - pending.length} de ${items.length} feitos</small></div>
      <ul class="todo">${items.map(([done, , title, text, href]) => `
        <li class="${done ? 'is-done' : ''}">
          <span class="todo-ico">${icon(done ? 'check' : 'alert')}</span>
          <span class="todo-main"><b>${esc(title)}</b>${!done && text ? `<small>${esc(text)}</small>` : ''}</span>
          ${!done && href ? `<a class="btn btn-sm" href="${href}" data-link>Resolver</a>` : ''}
        </li>`).join('')}</ul>`;
  }

  const skelRows = (n) => `<div class="skel-rows">${Array.from({ length: n }, () => '<div class="skel-row"><i class="sq"></i><i></i><i></i><i class="sm"></i></div>').join('')}</div>`;
  const priceText = (r) => `${brl.format(Number(r.preco) || 0)}${r.finalidade === 'aluguel' ? '/mês' : ''}`;
  const statusPill = (s) => `<span class="pill pill--${s}">${STATUS[s] || s}</span>`;

  /* =========================================================
     Imóveis: lista
     ========================================================= */

  async function viewImoveis(page, _m, alive) {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').slice(0, 80);
    const status = STATUS[params.get('status')] ? params.get('status') : '';
    const pagina = Math.max(1, parseInt(params.get('pagina'), 10) || 1);
    page.innerHTML = `${pageHead('Imóveis', 'Tudo o que aparece no site. Alterações valem na hora.', `<a class="btn btn-primary" href="/admin/imoveis/novo" data-link>${icon('plus')}<span>Adicionar imóvel</span></a>`)}
      <form class="toolbar" id="imFilter" role="search">
        <label class="search">${icon('search')}<span class="sr">Buscar pelo nome</span><input type="search" name="q" value="${esc(q)}" placeholder="Buscar pelo nome do imóvel" /></label>
        <label class="select-wrap"><span class="sr">Status</span>
          <select name="status">
            <option value="">Todos os status</option>
            ${Object.entries(STATUS).map(([v, t]) => `<option value="${v}"${v === status ? ' selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>
        <button class="btn" type="submit">Filtrar</button>
      </form>
      <section class="panel panel--flush"><div id="imList">${skelRows(6)}</div></section>
      <nav class="pager" id="pager" aria-label="Páginas"></nav>`;
    const filterForm = $('#imFilter');
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(filterForm);
      const p = new URLSearchParams();
      if (fd.get('q').trim()) p.set('q', fd.get('q').trim());
      if (fd.get('status')) p.set('status', fd.get('status'));
      navigate(`/admin/imoveis${p.toString() ? `?${p}` : ''}`);
    });
    $('select', filterForm).addEventListener('change', () => filterForm.requestSubmit());

    const load = async () => {
      const from = (pagina - 1) * PAGE_SIZE;
      let query = sb.from('imoveis')
        .select('id,slug,titulo,preco,tipo,finalidade,status,destaque,imagem_principal,cidade,bairro,created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (q) query = query.ilike('titulo', `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`);
      if (status) query = query.eq('status', status);
      const { data, count, error } = await query;
      if (!alive()) return;
      if (error) { showError($('#imList'), error, load); return; }
      const list = $('#imList');
      if (!data.length) {
        list.innerHTML = q || status
          ? stateBox('empty', 'Nenhum imóvel encontrado', q ? `Nada com “${q}”${status ? ` e status ${STATUS[status].toLowerCase()}` : ''}.` : 'Nenhum imóvel com esse status.', '<a class="btn" href="/admin/imoveis" data-link>Limpar busca</a>')
          : stateBox('empty', 'Nenhum imóvel cadastrado ainda', 'Cadastre o primeiro imóvel e ele aparece no site na hora.', `<a class="btn btn-primary" href="/admin/imoveis/novo" data-link>${icon('plus')}<span>Adicionar imóvel</span></a>`);
        $('#pager').innerHTML = '';
        return;
      }
      list.innerHTML = `
        <table class="table">
          <thead><tr><th>Foto</th><th>Nome</th><th>Preço</th><th>Tipo</th><th>Finalidade</th><th>Status</th><th>Alto padrão</th><th>Data</th><th class="ta-r">Ações</th></tr></thead>
          <tbody>${data.map((r) => `
            <tr data-id="${r.id}">
              <td data-label="Foto">${thumbImg(r.imagem_principal)}</td>
              <td data-label="Nome" class="td-name"><a href="/admin/imoveis/${r.id}/editar" data-link><b>${esc(r.titulo)}</b></a><small>${esc([r.bairro, r.cidade].filter(Boolean).join(' · '))}</small></td>
              <td data-label="Preço" class="td-num">${priceText(r)}</td>
              <td data-label="Tipo">${TIPOS[r.tipo] || esc(r.tipo)}</td>
              <td data-label="Finalidade">${FINALIDADES[r.finalidade] || esc(r.finalidade)}</td>
              <td data-label="Status">
                <select class="pill-select pill--${r.status}" data-status aria-label="Status de ${esc(r.titulo)}">
                  ${Object.entries(STATUS).map(([v, t]) => `<option value="${v}"${v === r.status ? ' selected' : ''}>${t}</option>`).join('')}
                </select>
              </td>
              <td data-label="Alto padrão"><button class="star-btn${r.destaque ? ' is-on' : ''}" type="button" data-star aria-pressed="${r.destaque}" aria-label="${r.destaque ? 'Tirar do alto padrão' : 'Colocar em destaque'}" title="${r.destaque ? 'Em destaque — clique para tirar' : 'Colocar em destaque'}">${icon(r.destaque ? 'star-fill' : 'star')}</button></td>
              <td data-label="Data" class="td-date">${dateBR(r.created_at)}</td>
              <td class="td-actions">
                <a class="btn btn-sm" href="/admin/imoveis/${r.id}/editar" data-link>${icon('edit')}<span>Editar</span></a>
                <button class="btn btn-sm btn-danger-ghost" type="button" data-del>${icon('trash')}<span>Excluir</span></button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>`;
      const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
      const link = (n) => { const p = new URLSearchParams(location.search); if (n > 1) p.set('pagina', n); else p.delete('pagina'); return `/admin/imoveis${p.toString() ? `?${p}` : ''}`; };
      $('#pager').innerHTML = `
        <span>Mostrando ${from + 1}–${from + data.length} de ${plural(count, 'imóvel', 'imóveis')}</span>
        ${pages > 1 ? `<span class="pager-btns">
          ${pagina > 1 ? `<a class="btn btn-sm" href="${link(pagina - 1)}" data-link>${icon('left')}<span>Anterior</span></a>` : ''}
          <span class="pager-n">Página ${pagina} de ${pages}</span>
          ${pagina < pages ? `<a class="btn btn-sm" href="${link(pagina + 1)}" data-link><span>Próxima</span>${icon('right')}</a>` : ''}
        </span>` : ''}`;
      const byId = new Map(data.map((r) => [r.id, r]));
      list.addEventListener('change', async (e) => {
        const sel = e.target.closest('[data-status]');
        if (!sel) return;
        const r = byId.get(sel.closest('tr').dataset.id);
        const prev = r.status;
        sel.disabled = true;
        const { data: upd, error: err } = await sb.from('imoveis').update({ status: sel.value }).eq('id', r.id).select('id');
        sel.disabled = false;
        if (err || !upd?.length) { sel.value = prev; toast(errText(err || noRows()), 'error'); return; }
        r.status = sel.value;
        sel.className = `pill-select pill--${r.status}`;
        toast(`Status de “${r.titulo}” alterado para ${STATUS[r.status].toLowerCase()}.`);
      });
      list.addEventListener('click', async (e) => {
        const tr = e.target.closest('tr[data-id]');
        if (!tr) return;
        const r = byId.get(tr.dataset.id);
        const star = e.target.closest('[data-star]');
        if (star) {
          star.disabled = true;
          const { data: upd, error: err } = await sb.from('imoveis').update({ destaque: !r.destaque }).eq('id', r.id).select('id');
          star.disabled = false;
          if (err || !upd?.length) { toast(errText(err || noRows()), 'error'); return; }
          r.destaque = !r.destaque;
          star.classList.toggle('is-on', r.destaque);
          star.setAttribute('aria-pressed', String(r.destaque));
          star.setAttribute('aria-label', r.destaque ? 'Tirar do alto padrão' : 'Marcar como alto padrão');
          star.title = r.destaque ? 'Alto padrão — clique para tirar' : 'Marcar como alto padrão';
          star.innerHTML = icon(r.destaque ? 'star-fill' : 'star');
          toast(r.destaque ? `“${r.titulo}” agora está em Alto padrão.` : `“${r.titulo}” saiu de Alto padrão.`);
          return;
        }
        const del = e.target.closest('[data-del]');
        if (del) {
          const ok = await deleteImovel(r, del);
          if (ok) {
            tr.classList.add('is-gone');
            setTimeout(() => { if (alive()) render(); }, 250);
          }
        }
      });
    };
    load();
  }

  async function deleteImovel(r, btn) {
    const ok = await confirmBox({
      title: 'Excluir imóvel?',
      text: `“${r.titulo}” sai do site na hora e as fotos dele serão apagadas. Essa ação não pode ser desfeita.`,
      confirm: 'Excluir imóvel',
      danger: true,
    });
    if (!ok) return false;
    setBusy(btn, true, 'Excluindo…');
    try {
      const { data: fotos, error: fErr } = await sb.from('imovel_fotos').select('caminho').eq('imovel_id', r.id);
      if (fErr) throw fErr;
      const { data: gone, error } = await sb.from('imoveis').delete().eq('id', r.id).select('imagem_principal');
      if (error) throw error;
      if (!gone.length) throw noRows();
      const paths = [...new Set([...(fotos || []).map((f) => f.caminho), gone[0].imagem_principal])];
      await removeFiles(BUCKET, withThumbs(paths));
      toast('Imóvel excluído.');
      return true;
    } catch (err) {
      setBusy(btn, false);
      toast(errText(err), 'error');
      return false;
    }
  }

  /* =========================================================
     Imóveis: cadastro e edição
     ========================================================= */

  const slugify = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'imovel';
  async function uniqueSlug(titulo) {
    const base = slugify(titulo);
    const { data, error } = await sb.from('imoveis').select('slug').like('slug', `${base}%`);
    if (error) throw error;
    const used = new Set(data.map((r) => r.slug));
    if (!used.has(base)) return base;
    for (let n = 2; n < 1000; n++) if (!used.has(`${base}-${n}`)) return `${base}-${n}`;
    return `${base}-${crypto.randomUUID().slice(0, 6)}`;
  }
  const listText = (arr) => (arr || []).join(', ');
  const parseList = (v) => [...new Set(String(v || '').split(/[,\n;]/).map((s) => s.trim().replace(/\s+/g, ' ')).filter(Boolean))];
  const digits = (v) => String(v || '').replace(/\D/g, '');
  const moneyMask = (v) => { const d = digits(v).replace(/^0+(?=\d)/, '').slice(0, 12); return d ? Number(d).toLocaleString('pt-BR') : ''; };
  const decimalOrNull = (v) => { const t = String(v || '').trim().replace(/\./g, '').replace(',', '.'); if (!t) return null; const n = Number(t); return Number.isFinite(n) ? n : NaN; };
  const intOrNull = (v) => { const t = String(v ?? '').trim(); if (!t) return null; const n = Number(t); return Number.isInteger(n) ? n : NaN; };
  const numText = (n) => (n == null ? '' : Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 2 }));

  async function viewForm(page, id, alive) {
    const isNew = !id;
    page.innerHTML = `${pageHead(isNew ? 'Novo imóvel' : 'Editar imóvel', isNew ? 'Preencha os dados e publique: o imóvel entra no site na hora.' : 'As alterações aparecem no site assim que você salvar.', '<a class="btn" href="/admin/imoveis" data-link>' + icon('left') + '<span>Voltar</span></a>')}
      <div id="formBox">${skelRows(4)}</div>`;
    let row = null;
    let fotos = [];
    if (!isNew) {
      const [r1, r2] = await Promise.all([
        sb.from('imoveis').select('*').eq('id', id).maybeSingle(),
        sb.from('imovel_fotos').select('caminho,ordem').eq('imovel_id', id).order('ordem'),
      ]);
      if (!alive()) return;
      if (r1.error || r2.error) { showError($('#formBox'), r1.error || r2.error, () => render()); return; }
      if (!r1.data) {
        $('#formBox').innerHTML = stateBox('empty', 'Imóvel não encontrado', 'Ele pode ter sido excluído.', '<a class="btn" href="/admin/imoveis" data-link>Ver imóveis</a>');
        return;
      }
      row = r1.data;
      // a principal vem primeiro; as outras na ordem da galeria
      const paths = (r2.data || []).map((f) => f.caminho).filter((p) => p !== row.imagem_principal);
      if (row.imagem_principal) paths.unshift(row.imagem_principal);
      fotos = paths.map((p) => ({ kind: 'saved', path: p }));
    }
    const v = row || { tipo: 'casa', finalidade: 'venda', status: 'disponivel', destaque: false, selos: [], caracteristicas: [] };
    const opt = (obj, cur) => Object.entries(obj).map(([k, t]) => `<option value="${k}"${k === cur ? ' selected' : ''}>${t}</option>`).join('');
    $('#formBox').innerHTML = `
      <form class="form" id="imForm" novalidate>
        <div class="form-main">
          <section class="panel">
            <h2 class="panel-title">Informações principais</h2>
            <div class="grid">
              <label class="field col-2"><span>Título *</span><input name="titulo" maxlength="120" required value="${esc(v.titulo)}" placeholder="Ex.: Casa Jardim com piscina" /><small class="err"></small></label>
              <label class="field"><span>Finalidade *</span><select name="finalidade" required>${opt(FINALIDADES, v.finalidade)}</select></label>
              <label class="field"><span id="precoLabel">Preço *</span><span class="money"><em>R$</em><input name="preco" inputmode="numeric" required value="${esc(v.preco != null ? moneyMask(Math.round(Number(v.preco))) : '')}" placeholder="0" /></span><small class="err"></small></label>
              <label class="field"><span>Tipo *</span><select name="tipo" required>${opt(TIPOS, v.tipo)}</select></label>
              <label class="field"><span>Status *</span><select name="status" required>${opt(STATUS, v.status)}</select></label>
              <label class="field col-2"><span>Descrição</span><textarea name="descricao" rows="5" maxlength="4000" placeholder="Conte o que o imóvel tem de especial.">${esc(v.descricao)}</textarea><small class="hint"><span data-count-for="descricao">0</span>/4000</small></label>
            </div>
          </section>

          <section class="panel">
            <h2 class="panel-title">Localização</h2>
            <div class="grid">
              <label class="field"><span>Cidade *</span><input name="cidade" maxlength="80" required value="${esc(v.cidade)}" placeholder="Ex.: São Paulo" /><small class="err"></small></label>
              <label class="field"><span>UF</span><select name="uf"><option value="">—</option>${UFS.map((u) => `<option${u === v.uf ? ' selected' : ''}>${u}</option>`).join('')}</select></label>
              <label class="field"><span>Bairro</span><input name="bairro" maxlength="80" value="${esc(v.bairro)}" /></label>
              <label class="field"><span>Endereço</span><input name="endereco" maxlength="160" value="${esc(v.endereco)}" placeholder="Opcional" /><small class="hint">Aparece na página do imóvel. Vazio = só bairro e cidade.</small></label>
            </div>
          </section>

          <section class="panel">
            <h2 class="panel-title">Características</h2>
            <div class="grid grid--4">
              <label class="field" data-not-land><span>Quartos</span><input name="quartos" type="number" min="0" max="99" step="1" inputmode="numeric" value="${v.quartos ?? ''}" /><small class="err"></small></label>
              <label class="field" data-not-land><span>Suítes</span><input name="suites" type="number" min="0" max="99" step="1" inputmode="numeric" value="${v.suites ?? ''}" /><small class="err"></small></label>
              <label class="field" data-not-land><span>Banheiros</span><input name="banheiros" type="number" min="0" max="99" step="1" inputmode="numeric" value="${v.banheiros ?? ''}" /><small class="err"></small></label>
              <label class="field" data-not-land><span>Vagas</span><input name="vagas" type="number" min="0" max="99" step="1" inputmode="numeric" value="${v.vagas ?? ''}" /><small class="err"></small></label>
              <label class="field"><span>Área (m²)</span><input name="area" inputmode="decimal" value="${esc(numText(v.area))}" placeholder="Ex.: 320" /><small class="err"></small></label>
              <label class="field" data-land><span>Frente (m)</span><input name="frente" inputmode="decimal" value="${esc(numText(v.frente))}" /><small class="err"></small></label>
              <label class="field col-2" data-land><span>Topografia</span><input name="topografia" maxlength="60" value="${esc(v.topografia)}" placeholder="Ex.: Plano, aclive suave" /></label>
              <label class="field col-4"><span>Etiquetas do card</span><input name="selos" maxlength="200" value="${esc(listText(v.selos))}" placeholder="Ex.: Exclusivo, Vista para o mar" /><small class="hint">Separe por vírgula. A primeira aparece no card do site.</small></label>
              <label class="field col-4"><span>Diferenciais</span><input name="caracteristicas" maxlength="400" value="${esc(listText(v.caracteristicas))}" placeholder="Ex.: Piscina, Jardim, Varanda gourmet" /><small class="hint">Separe por vírgula. Aparecem na página do imóvel.</small></label>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><h2 class="panel-title">Fotos</h2><small class="hint" id="fotoCount"></small></div>
            <p class="hint">A primeira foto é a principal (capa no site). Arraste para mudar a ordem ou use as setas. JPG, PNG ou WebP — o painel reduz e comprime antes de enviar.</p>
            <ul class="photos" id="photos"></ul>
            <label class="drop" id="drop">
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple id="fotoInput" />
              ${icon('upload')}<b>Adicionar fotos</b><small>Clique ou arraste as imagens para cá</small>
            </label>
            <input type="file" accept="image/jpeg,image/png,image/webp" id="swapInput" hidden />
          </section>
        </div>

        <aside class="form-side">
          <section class="panel sticky">
            <h2 class="panel-title">Publicação</h2>
            <label class="switch"><input type="checkbox" name="destaque"${v.destaque ? ' checked' : ''} /><span class="switch-ui" aria-hidden="true"></span><span>Mostrar em <b>Alto padrão</b> no site</span></label>
            ${isNew ? '' : `<p class="meta">Criado em ${dateBR(row.created_at)}<br />Atualizado em ${dateBR(row.updated_at)}</p>
            <a class="link" href="/#curadoria" target="_blank" rel="noopener">${icon('ext')}<span>Ver no site</span></a>`}
            <p class="form-msg" id="formMsg" role="alert"></p>
            <p class="progress" id="formProgress" hidden></p>
            <button class="btn btn-primary btn-block btn-lg" type="submit" id="saveBtn">${isNew ? 'PUBLICAR IMÓVEL' : 'SALVAR ALTERAÇÕES'}</button>
            ${isNew ? '' : `<button class="btn btn-block btn-danger-ghost" type="button" id="delBtn">${icon('trash')}<span>Excluir imóvel</span></button>`}
          </section>
        </aside>
      </form>`;

    const form = $('#imForm');
    const removed = [];     // fotos já salvas que saíram (apagadas do Storage depois de salvar)
    let imovelId = id || crypto.randomUUID();
    let created = !isNew;   // a linha já existe no banco?
    let saving = false;

    // campos que mudam conforme o tipo / finalidade
    const syncKind = () => {
      const land = form.tipo.value === 'terreno';
      $$('[data-land]', form).forEach((el) => { el.hidden = !land; });
      $$('[data-not-land]', form).forEach((el) => { el.hidden = land; });
      $('#precoLabel').textContent = form.finalidade.value === 'aluguel' ? 'Aluguel por mês *' : 'Preço *';
    };
    syncKind();
    form.tipo.addEventListener('change', syncKind);
    form.finalidade.addEventListener('change', syncKind);
    form.preco.addEventListener('input', () => {
      const end = form.preco.value.length - form.preco.selectionEnd;
      form.preco.value = moneyMask(form.preco.value);
      const pos = Math.max(0, form.preco.value.length - end);
      form.preco.setSelectionRange(pos, pos);
    });
    const desc = form.descricao;
    const paintCount = () => { $('[data-count-for="descricao"]').textContent = desc.value.length; };
    desc.addEventListener('input', paintCount);
    paintCount();
    form.addEventListener('input', () => { dirty = true; });
    form.addEventListener('change', () => { dirty = true; });

    /* ---------- fotos ---------- */
    const list = $('#photos');
    const photoSrc = (f) => (f.kind === 'new' ? f.preview : fotoUrl(f.path, 640));
    function paintPhotos() {
      list.innerHTML = fotos.map((f, k) => `
        <li class="photo${k === 0 ? ' is-main' : ''}" draggable="true" data-k="${k}">
          <img src="${esc(photoSrc(f))}" alt="Foto ${k + 1}" loading="lazy" decoding="async" onerror="this.closest('.photo').classList.add('is-broken')" />
          ${k === 0 ? '<span class="photo-main">Principal</span>' : ''}
          ${f.kind === 'new' ? '<span class="photo-new">Nova</span>' : ''}
          <div class="photo-tools">
            ${k > 0 ? `<button type="button" class="icon-btn" data-act="main" title="Tornar principal" aria-label="Tornar a foto ${k + 1} principal">${icon('star')}</button>` : ''}
            <button type="button" class="icon-btn" data-act="left" title="Mover para a esquerda" aria-label="Mover a foto ${k + 1} para trás"${k === 0 ? ' disabled' : ''}>${icon('left')}</button>
            <button type="button" class="icon-btn" data-act="right" title="Mover para a direita" aria-label="Mover a foto ${k + 1} para frente"${k === fotos.length - 1 ? ' disabled' : ''}>${icon('right')}</button>
            <button type="button" class="icon-btn" data-act="swap" title="Trocar foto" aria-label="Trocar a foto ${k + 1}">${icon('swap')}</button>
            <button type="button" class="icon-btn icon-btn--danger" data-act="del" title="Remover foto" aria-label="Remover a foto ${k + 1}">${icon('trash')}</button>
          </div>
        </li>`).join('');
      $('#fotoCount').textContent = fotos.length ? `${plural(fotos.length, 'foto', 'fotos')} · máx. ${MAX_FOTOS}` : 'Nenhuma foto ainda';
      $('#drop').classList.toggle('is-full', fotos.length >= MAX_FOTOS);
    }
    paintPhotos();
    const dropOld = (f) => { if (f.kind === 'saved') removed.push(f.path); else URL.revokeObjectURL(f.preview); };
    function addFiles(files) {
      const errs = [];
      for (const file of files) {
        const bad = checkFile(file);
        if (bad) { errs.push(bad); continue; }
        if (fotos.length >= MAX_FOTOS) { errs.push(`Limite de ${MAX_FOTOS} fotos por imóvel.`); break; }
        fotos.push({ kind: 'new', file, preview: URL.createObjectURL(file) });
      }
      if (errs.length) toast(errs.slice(0, 2).join(' '), 'error');
      dirty = true;
      paintPhotos();
    }
    $('#fotoInput').addEventListener('change', (e) => { addFiles([...e.target.files]); e.target.value = ''; });
    const drop = $('#drop');
    ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); drop.classList.add('is-over'); } }));
    ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', (e) => { if (e.dataTransfer?.files?.length) { e.preventDefault(); addFiles([...e.dataTransfer.files]); } });

    let swapIndex = -1;
    $('#swapInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file || swapIndex < 0) return;
      const bad = checkFile(file);
      if (bad) { toast(bad, 'error'); return; }
      dropOld(fotos[swapIndex]);
      fotos[swapIndex] = { kind: 'new', file, preview: URL.createObjectURL(file) };
      dirty = true;
      paintPhotos();
    });
    const move = (from, to) => { const [f] = fotos.splice(from, 1); fotos.splice(to, 0, f); dirty = true; paintPhotos(); };
    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const k = Number(b.closest('.photo').dataset.k);
      const act = b.dataset.act;
      if (act === 'main') move(k, 0);
      else if (act === 'left' && k > 0) move(k, k - 1);
      else if (act === 'right' && k < fotos.length - 1) move(k, k + 1);
      else if (act === 'swap') { swapIndex = k; $('#swapInput').click(); }
      else if (act === 'del') { dropOld(fotos[k]); fotos.splice(k, 1); dirty = true; paintPhotos(); }
    });
    let dragFrom = -1;
    list.addEventListener('dragstart', (e) => { const li = e.target.closest('.photo'); if (!li) return; dragFrom = Number(li.dataset.k); li.classList.add('is-drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(dragFrom)); });
    list.addEventListener('dragover', (e) => { if (dragFrom >= 0) { e.preventDefault(); $$('.photo', list).forEach((p) => p.classList.toggle('is-target', p === e.target.closest('.photo'))); } });
    list.addEventListener('dragend', () => { dragFrom = -1; $$('.photo', list).forEach((p) => p.classList.remove('is-drag', 'is-target')); });
    list.addEventListener('drop', (e) => {
      const li = e.target.closest('.photo');
      if (dragFrom < 0 || !li) return;
      e.preventDefault();
      const to = Number(li.dataset.k);
      const from = dragFrom;
      dragFrom = -1;
      if (to !== from) move(from, to); else paintPhotos();
    });

    /* ---------- validação ---------- */
    function readForm() {
      const fd = new FormData(form);
      const land = fd.get('tipo') === 'terreno';
      return {
        titulo: fd.get('titulo').trim().replace(/\s+/g, ' '),
        descricao: fd.get('descricao').trim(),
        preco: Number(digits(fd.get('preco')) || NaN),
        tipo: fd.get('tipo'),
        finalidade: fd.get('finalidade'),
        status: fd.get('status'),
        cidade: fd.get('cidade').trim().replace(/\s+/g, ' '),
        uf: fd.get('uf') || null,
        bairro: fd.get('bairro').trim(),
        endereco: fd.get('endereco').trim(),
        quartos: land ? null : intOrNull(fd.get('quartos')),
        suites: land ? null : intOrNull(fd.get('suites')),
        banheiros: land ? null : intOrNull(fd.get('banheiros')),
        vagas: land ? null : intOrNull(fd.get('vagas')),
        area: decimalOrNull(fd.get('area')),
        frente: land ? decimalOrNull(fd.get('frente')) : null,
        topografia: land ? (fd.get('topografia').trim() || null) : null,
        selos: parseList(fd.get('selos')).slice(0, 8),
        caracteristicas: parseList(fd.get('caracteristicas')).slice(0, 20),
        destaque: fd.get('destaque') === 'on',
      };
    }
    function validate(d) {
      const errs = {};
      if (d.titulo.length < 2) errs.titulo = 'Digite o título do imóvel.';
      if (!Number.isFinite(d.preco) || d.preco <= 0) errs.preco = 'Digite o preço (só números).';
      else if (d.preco > 999999999999) errs.preco = 'Preço alto demais.';
      if (d.cidade.length < 2) errs.cidade = 'Digite a cidade.';
      ['quartos', 'suites', 'banheiros', 'vagas'].forEach((k) => { if (d[k] != null && (!Number.isInteger(d[k]) || d[k] < 0 || d[k] > 99)) errs[k] = 'Número de 0 a 99.'; });
      ['area', 'frente'].forEach((k) => { if (d[k] != null && (!Number.isFinite(d[k]) || d[k] < 0)) errs[k] = 'Digite um número válido.'; });
      return errs;
    }
    function paintErrors(errs) {
      $$('.field', form).forEach((f) => { f.classList.remove('has-error'); const s = $('.err', f); if (s) s.textContent = ''; });
      Object.entries(errs).forEach(([name, text]) => {
        const f = form.elements[name]?.closest('.field');
        if (!f) return;
        f.classList.add('has-error');
        $('.err', f).textContent = text;
      });
      const first = Object.keys(errs)[0];
      if (first) form.elements[first].focus();
    }

    /* ---------- salvar ---------- */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (saving) return;
      const d = readForm();
      const errs = validate(d);
      paintErrors(errs);
      const msg = $('#formMsg');
      msg.textContent = '';
      if (Object.keys(errs).length) { msg.textContent = 'Confira os campos destacados.'; return; }
      saving = true;
      const btn = $('#saveBtn');
      const prog = $('#formProgress');
      setBusy(btn, true, isNew && !created ? 'Publicando…' : 'Salvando…');
      $('#delBtn')?.setAttribute('disabled', '');
      const uploaded = [];
      try {
        const news = fotos.filter((f) => f.kind === 'new');
        for (let i = 0; i < news.length; i++) {
          prog.hidden = false;
          prog.textContent = `Enviando foto ${i + 1} de ${news.length}…`;
          const f = news[i];
          try {
            f.path = await uploadFoto(imovelId, f.file);
          } catch (err) {
            throw Object.assign(new Error(`Não deu para enviar a foto ${fotos.indexOf(f) + 1}: ${errText(err)}`), { friendly: true });
          }
          uploaded.push(f.path);
          URL.revokeObjectURL(f.preview);
          f.kind = 'saved';
          delete f.file;
        }
        prog.textContent = 'Salvando dados…';
        const paths = fotos.map((f) => f.path);
        const payload = { ...d, imagem_principal: paths[0] || null };
        if (!created) {
          payload.id = imovelId;
          payload.slug = await uniqueSlug(d.titulo);
          const { error } = await sb.from('imoveis').insert(payload);
          if (error) throw error;
          created = true;
        } else {
          const { data: upd, error } = await sb.from('imoveis').update(payload).eq('id', imovelId).select('id');
          if (error) throw error;
          if (!upd.length) throw noRows();
        }
        uploaded.length = 0; // já estão ligadas ao imóvel
        // galeria na ordem atual
        const { error: delErr } = await sb.from('imovel_fotos').delete().eq('imovel_id', imovelId);
        if (delErr) throw delErr;
        if (paths.length) {
          const { error: insErr } = await sb.from('imovel_fotos').insert(paths.map((caminho, ordem) => ({ imovel_id: imovelId, caminho, ordem })));
          if (insErr) throw insErr;
        }
        if (removed.length) { await removeFiles(BUCKET, withThumbs(removed)); removed.length = 0; }
        dirty = false;
        toast(isNew ? 'Imóvel publicado com sucesso.' : 'Alterações salvas.');
        navigate('/admin/imoveis', true);
      } catch (err) {
        if (uploaded.length && !created) await removeFiles(BUCKET, withThumbs(uploaded));
        paintPhotos();
        msg.textContent = err.friendly ? err.message : errText(err);
        toast(msg.textContent, 'error');
        if (created && isNew) {
          // o imóvel já foi criado: próximas tentativas só atualizam
          history.replaceState(null, '', `/admin/imoveis/${imovelId}/editar`);
          app.dataset.path = location.pathname;
        }
      } finally {
        saving = false;
        prog.hidden = true;
        if (btn.isConnected) setBusy(btn, false);
        $('#delBtn')?.removeAttribute('disabled');
      }
    });

    $('#delBtn')?.addEventListener('click', async (e) => {
      const ok = await deleteImovel(row, e.currentTarget);
      if (ok) { dirty = false; navigate('/admin/imoveis', true); }
    });
  }

  /* =========================================================
     Alto padrão
     ========================================================= */

  async function viewDestaques(page, _m, alive) {
    page.innerHTML = `${pageHead('Alto padrão', 'Estes imóveis aparecem na seção “Imóveis de alto padrão” do site, nesta ordem.')}
      <section class="panel"><div class="panel-head"><h2>Alto padrão no site</h2><small class="hint" id="dCount"></small></div><div id="dList">${skelRows(3)}</div></section>
      <section class="panel">
        <div class="panel-head"><h2>Adicionar ao alto padrão</h2></div>
        <label class="search search--full">${icon('search')}<span class="sr">Buscar imóvel</span><input type="search" id="dSearch" placeholder="Buscar pelo nome do imóvel" /></label>
        <div id="dOthers">${skelRows(3)}</div>
      </section>`;
    let feat = [];
    let others = [];
    let term = '';
    const cols = 'id,titulo,preco,finalidade,status,imagem_principal,cidade,bairro,ordem,created_at';
    const load = async () => {
      const [a, b] = await Promise.all([
        sb.from('imoveis').select(cols).eq('destaque', true).order('ordem').order('created_at', { ascending: false }),
        sb.from('imoveis').select(cols).eq('destaque', false).order('created_at', { ascending: false }).limit(200),
      ]);
      if (!alive()) return;
      if (a.error || b.error) { showError($('#dList'), a.error || b.error, load); $('#dOthers').innerHTML = ''; return; }
      feat = a.data;
      others = b.data;
      paint();
    };
    const item = (r, tools) => `
      <li data-id="${r.id}">
        ${thumbImg(r.imagem_principal)}
        <span class="recent-main"><b>${esc(r.titulo)}</b><small>${esc([r.bairro, r.cidade].filter(Boolean).join(' · '))}</small></span>
        <span class="recent-price">${priceText(r)}</span>
        ${statusPill(r.status)}
        <span class="row-tools">${tools}</span>
      </li>`;
    function paint() {
      $('#dCount').textContent = plural(feat.length, 'imóvel', 'imóveis');
      $('#dList').innerHTML = feat.length ? `<ol class="recent recent--num">${feat.map((r, k) => item(r, `
          <button class="icon-btn" type="button" data-up aria-label="Subir ${esc(r.titulo)}"${k === 0 ? ' disabled' : ''}>${icon('up')}</button>
          <button class="icon-btn" type="button" data-down aria-label="Descer ${esc(r.titulo)}"${k === feat.length - 1 ? ' disabled' : ''}>${icon('down')}</button>
          <button class="btn btn-sm" type="button" data-unfeat>Remover</button>`)).join('')}</ol>`
        : stateBox('empty', 'Nenhum imóvel de alto padrão', 'A seção “Imóveis de alto padrão” do site fica vazia. Adicione imóveis abaixo.');
      const shown = others.filter((r) => !term || r.titulo.toLowerCase().includes(term)).slice(0, 30);
      $('#dOthers').innerHTML = shown.length ? `<ul class="recent">${shown.map((r) => item(r, `<button class="btn btn-sm btn-primary" type="button" data-feat>${icon('plus')}<span>Adicionar</span></button>`)).join('')}</ul>`
        : stateBox('empty', others.length ? 'Nada encontrado' : 'Todos os imóveis já estão em Alto padrão', others.length ? 'Tente outro nome.' : '');
    }
    $('#dSearch').addEventListener('input', (e) => { term = e.target.value.trim().toLowerCase(); paint(); });
    async function saveOrder(msg) {
      const res = await Promise.all(feat.map((r, k) => sb.from('imoveis').update({ ordem: k + 1 }).eq('id', r.id).select('id')));
      const bad = res.find((x) => x.error || !x.data?.length);
      if (bad) throw bad.error || noRows();
      feat.forEach((r, k) => { r.ordem = k + 1; });
      if (msg) toast(msg);
    }
    page.addEventListener('click', async (e) => {
      const b = e.target.closest('button');
      const li = e.target.closest('li[data-id]');
      if (!b || !li || b.disabled) return;
      const idx = feat.findIndex((r) => r.id === li.dataset.id);
      try {
        if (b.matches('[data-up], [data-down]')) {
          const to = idx + (b.matches('[data-up]') ? -1 : 1);
          [feat[idx], feat[to]] = [feat[to], feat[idx]];
          paint();
          $$('#dList button').forEach((x) => { x.disabled = true; });
          await saveOrder('Ordem do alto padrão salva.');
          paint();
        } else if (b.matches('[data-unfeat]')) {
          setBusy(b, true, '');
          const r = feat[idx];
          const { data, error } = await sb.from('imoveis').update({ destaque: false }).eq('id', r.id).select('id');
          if (error || !data.length) throw error || noRows();
          feat.splice(idx, 1);
          others.unshift(r);
          paint();
          toast(`“${r.titulo}” saiu de Alto padrão.`);
        } else if (b.matches('[data-feat]')) {
          setBusy(b, true, '');
          const oi = others.findIndex((r) => r.id === li.dataset.id);
          const r = others[oi];
          const { data, error } = await sb.from('imoveis').update({ destaque: true, ordem: feat.length + 1 }).eq('id', r.id).select('id');
          if (error || !data.length) throw error || noRows();
          others.splice(oi, 1);
          feat.push(r);
          paint();
          toast(`“${r.titulo}” agora está em Alto padrão.`);
        }
      } catch (err) {
        toast(errText(err), 'error');
        load();
      }
    });
    load();
  }

  /* =========================================================
     Avaliações
     ========================================================= */

  async function viewAvaliacoes(page, _m, alive) {
    page.innerHTML = `${pageHead('Avaliações', 'Só as publicadas aparecem no site. A nota média do site é calculada com elas.', `<button class="btn btn-primary" type="button" id="avNew">${icon('plus')}<span>Nova avaliação</span></button>`)}
      <div id="avList">${skelRows(3)}</div>`;
    let rows = [];
    const load = async () => {
      const { data, error } = await sb.from('avaliacoes').select('*').order('ordem').order('created_at', { ascending: false });
      if (!alive()) return;
      if (error) { showError($('#avList'), error, load); return; }
      rows = data;
      paint();
    };
    const stars = (n) => `<span class="stars" aria-label="${n} de 5">${[1, 2, 3, 4, 5].map((k) => icon(k <= n ? 'star-fill' : 'star', k <= n ? 'on' : '')).join('')}</span>`;
    function paint() {
      $('#avList').innerHTML = rows.length ? `<ul class="reviews">${rows.map((r) => `
        <li class="review${r.publicado ? '' : ' is-draft'}" data-id="${r.id}">
          <div class="review-head">
            <span class="avatar${r.foto ? ' has-photo' : ''}"${r.foto ? ` style="background-image:url('${esc(siteUrl(r.foto))}')"` : ''}>${r.foto ? '' : esc(r.nome.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span>
            <span class="review-who"><b>${esc(r.nome)}</b><small>${esc(r.subtitulo || '')}</small></span>
            ${stars(r.nota)}
            <span class="pill ${r.publicado ? 'pill--disponivel' : 'pill--draft'}">${r.publicado ? 'Publicada' : 'Não publicada'}</span>
          </div>
          <blockquote>${esc(r.texto)}</blockquote>
          <div class="review-foot">
            <small>${dateBR(r.created_at)}</small>
            <span class="row-tools">
              <button class="btn btn-sm" type="button" data-pub>${r.publicado ? 'Despublicar' : 'Publicar'}</button>
              <button class="btn btn-sm" type="button" data-edit>${icon('edit')}<span>Editar</span></button>
              <button class="btn btn-sm btn-danger-ghost" type="button" data-del>${icon('trash')}<span>Excluir</span></button>
            </span>
          </div>
        </li>`).join('')}</ul>`
        : stateBox('empty', 'Nenhuma avaliação ainda', 'Cadastre o depoimento de um cliente para ele aparecer no site.', `<button class="btn btn-primary" type="button" data-new>${icon('plus')}<span>Nova avaliação</span></button>`);
    }
    page.addEventListener('click', async (e) => {
      if (e.target.closest('#avNew, [data-new]')) { reviewForm(null); return; }
      const li = e.target.closest('li[data-id]');
      if (!li) return;
      const r = rows.find((x) => x.id === li.dataset.id);
      const b = e.target.closest('button');
      if (!b || !r) return;
      if (b.matches('[data-edit]')) reviewForm(r);
      else if (b.matches('[data-pub]')) {
        setBusy(b, true, '');
        const { data, error } = await sb.from('avaliacoes').update({ publicado: !r.publicado }).eq('id', r.id).select('*');
        if (error || !data.length) { setBusy(b, false); toast(errText(error || noRows()), 'error'); return; }
        Object.assign(r, data[0]);
        paint();
        toast(r.publicado ? 'Avaliação publicada no site.' : 'Avaliação tirada do site.');
      } else if (b.matches('[data-del]')) {
        const ok = await confirmBox({ title: 'Excluir avaliação?', text: `A avaliação de ${r.nome} será apagada. Essa ação não pode ser desfeita.`, confirm: 'Excluir', danger: true });
        if (!ok) return;
        setBusy(b, true, '');
        const { data, error } = await sb.from('avaliacoes').delete().eq('id', r.id).select('foto');
        if (error || !data.length) { setBusy(b, false); toast(errText(error || noRows()), 'error'); return; }
        if (isStoragePath(r.foto)) removeFiles(SITE_BUCKET, [r.foto]);
        rows = rows.filter((x) => x !== r);
        paint();
        toast('Avaliação excluída.');
      }
    });

    function reviewForm(r) {
      const isNew = !r;
      let foto = r?.foto || '';
      let newFile = null;
      let previewUrl = '';
      const m = openModal(`
        <form id="rvForm" novalidate>
          <div class="modal-head"><h2>${isNew ? 'Nova avaliação' : 'Editar avaliação'}</h2><button class="icon-btn" type="button" data-x aria-label="Fechar">${icon('close')}</button></div>
          <div class="grid">
            <label class="field"><span>Nome do cliente *</span><input name="nome" maxlength="80" required value="${esc(r?.nome)}" /><small class="err"></small></label>
            <label class="field"><span>Imóvel / cidade</span><input name="subtitulo" maxlength="80" value="${esc(r?.subtitulo)}" placeholder="Ex.: Casa Mirante · Ilhabela" /></label>
            <label class="field col-2"><span>Depoimento *</span><textarea name="texto" rows="4" maxlength="600" required>${esc(r?.texto)}</textarea><small class="err"></small></label>
            <fieldset class="field rate"><legend>Nota *</legend>
              <span class="rate-stars">${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="nota" id="nota${n}" value="${n}"${(r?.nota || 5) === n ? ' checked' : ''} /><label for="nota${n}" title="${n} de 5">${icon('star-fill')}<span class="sr">${n} de 5</span></label>`).join('')}</span>
            </fieldset>
            <div class="field"><span>Foto do cliente (opcional)</span>
              <div class="mini-photo">
                <span class="avatar avatar--lg" id="rvAva"></span>
                <label class="btn btn-sm">${icon('upload')}<span>Escolher</span><input type="file" accept="image/jpeg,image/png,image/webp" id="rvFile" hidden /></label>
                <button class="btn btn-sm btn-danger-ghost" type="button" id="rvNoPhoto">Remover</button>
              </div>
            </div>
            <label class="switch col-2"><input type="checkbox" name="publicado"${r ? (r.publicado ? ' checked' : '') : ' checked'} /><span class="switch-ui" aria-hidden="true"></span><span>Publicar no site</span></label>
          </div>
          <p class="form-msg" role="alert" id="rvMsg"></p>
          <div class="modal-actions">
            <button class="btn" type="button" data-x>Cancelar</button>
            <button class="btn btn-primary" type="submit" id="rvSave">${isNew ? 'Salvar avaliação' : 'Salvar alterações'}</button>
          </div>
        </form>`, () => { if (previewUrl) URL.revokeObjectURL(previewUrl); });
      const f = $('#rvForm', m.el);
      const paintAva = () => {
        const url = previewUrl || siteUrl(foto);
        const ava = $('#rvAva', m.el);
        ava.style.backgroundImage = url ? `url("${url}")` : '';
        ava.classList.toggle('has-photo', !!url);
        ava.textContent = url ? '' : (f.nome.value.trim()[0] || '?').toUpperCase();
        $('#rvNoPhoto', m.el).hidden = !url;
      };
      paintAva();
      f.nome.addEventListener('input', paintAva);
      $$('[data-x]', m.el).forEach((x) => x.addEventListener('click', () => { if (!$('#rvSave', m.el).disabled) m.close(); }));
      $('#rvFile', m.el).addEventListener('change', (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;
        const bad = checkFile(file);
        if (bad) { toast(bad, 'error'); return; }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        newFile = file;
        previewUrl = URL.createObjectURL(file);
        paintAva();
      });
      $('#rvNoPhoto', m.el).addEventListener('click', () => { newFile = null; if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = ''; foto = ''; paintAva(); });
      setTimeout(() => f.nome.focus(), 60);
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = $('#rvSave', m.el);
        if (btn.disabled) return;
        const d = { nome: f.nome.value.trim(), subtitulo: f.subtitulo.value.trim(), texto: f.texto.value.trim(), nota: Number(new FormData(f).get('nota')) || 5, publicado: f.publicado.checked };
        $$('.field', f).forEach((x) => x.classList.remove('has-error'));
        const errs = {};
        if (d.nome.length < 2) errs.nome = 'Digite o nome do cliente.';
        if (d.texto.length < 2) errs.texto = 'Escreva o depoimento.';
        Object.entries(errs).forEach(([k, t]) => { const fl = f[k].closest('.field'); fl.classList.add('has-error'); $('.err', fl).textContent = t; });
        if (Object.keys(errs).length) { f[Object.keys(errs)[0]].focus(); return; }
        setBusy(btn, true, 'Salvando…');
        let uploadedPath = '';
        try {
          if (newFile) { uploadedPath = await uploadSiteFile('avaliacoes', newFile, 400); }
          const oldFoto = r?.foto || '';
          d.foto = uploadedPath || foto || null;
          const q = isNew ? sb.from('avaliacoes').insert(d).select('*') : sb.from('avaliacoes').update(d).eq('id', r.id).select('*');
          const { data, error } = await q;
          if (error) throw error;
          if (!data.length) throw noRows();
          if (oldFoto && oldFoto !== d.foto && isStoragePath(oldFoto)) removeFiles(SITE_BUCKET, [oldFoto]);
          if (isNew) rows.unshift(data[0]); else Object.assign(r, data[0]);
          paint();
          setBusy(btn, false);
          m.close();
          toast(isNew ? (d.publicado ? 'Avaliação publicada no site.' : 'Avaliação salva (não publicada).') : 'Alterações salvas.');
        } catch (err) {
          if (uploadedPath) removeFiles(SITE_BUCKET, [uploadedPath]);
          setBusy(btn, false);
          $('#rvMsg', m.el).textContent = errText(err);
        }
      });
    }
    load();
  }

  /* =========================================================
     Contatos (mensagens do formulário e pedidos do carrinho)
     ========================================================= */

  const dataHora = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  // telefone brasileiro sem DDI ganha o 55 para abrir no WhatsApp
  const zapDigits = (tel) => { const d = String(tel || '').replace(/\D/g, ''); return d.length === 10 || d.length === 11 ? `55${d}` : d; };
  // telefone legível: (11) 98765-4321; o que não for número de celular/fixo do Brasil fica como veio
  const telBonito = (tel) => {
    let d = String(tel || '').replace(/\D/g, '');
    if ((d.length === 12 || d.length === 13) && d.startsWith('55')) d = d.slice(2);
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return String(tel || '');
  };

  async function viewContatos(page, _m, alive) {
    const params = new URLSearchParams(location.search);
    const novos = params.get('filtro') === 'novos';
    const pagina = Math.max(1, parseInt(params.get('pagina'), 10) || 1);
    page.innerHTML = `${pageHead('Contatos', 'Mensagens do formulário do site e pedidos finalizados no carrinho. As novas ficam destacadas.')}
      <div class="seg" role="tablist" aria-label="Filtrar mensagens">
        <a href="/admin/contatos" data-link role="tab" aria-selected="${!novos}" class="${novos ? '' : 'is-on'}">Todas</a>
        <a href="/admin/contatos?filtro=novos" data-link role="tab" aria-selected="${novos}" class="${novos ? 'is-on' : ''}">Não lidas</a>
      </div>
      <div id="ctList">${skelRows(4)}</div>
      <nav class="pager" id="ctPager" aria-label="Páginas"></nav>`;
    let rows = [];
    const from = (pagina - 1) * PAGE_SIZE;
    const load = async () => {
      let q = sb.from('contatos').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1);
      if (novos) q = q.eq('lido', false);
      const { data, count, error } = await q;
      if (!alive()) return;
      if (error) { showError($('#ctList'), error, load); return; }
      rows = data;
      paint(count);
    };
    function paint(count) {
      const list = $('#ctList');
      if (!rows.length) {
        list.innerHTML = stateBox('empty', novos ? 'Nenhuma mensagem nova' : 'Nenhuma mensagem ainda', novos ? 'Tudo lido por aqui.' : 'Quando alguém enviar o formulário do site ou finalizar o carrinho, a mensagem aparece aqui.');
        $('#ctPager').innerHTML = '';
        return;
      }
      list.innerHTML = `<ul class="msgs">${rows.map((r) => {
        const zap = zapDigits(r.telefone);
        const first = String(r.nome).split(' ')[0];
        const zapText = encodeURIComponent(`Olá, ${first}! Aqui é ${siteName}. Recebemos a sua mensagem pelo site.`);
        return `
        <li class="msg${r.lido ? '' : ' is-new'}" data-id="${r.id}">
          <div class="msg-head">
            <span class="avatar" aria-hidden="true">${esc(String(r.nome).trim()[0] || '?').toUpperCase()}</span>
            <span class="msg-who"><b>${esc(r.nome)}</b><small>${dataHora(r.created_at)}</small></span>
            <span class="pill ${r.origem === 'carrinho' ? 'pill--alugado' : 'pill--draft'}">${r.origem === 'carrinho' ? 'Pedido do carrinho' : 'Formulário'}</span>
            ${r.lido ? '' : '<span class="pill pill--disponivel">Nova</span>'}
          </div>
          <p class="msg-contact">${[r.email && `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>`, r.telefone && `<a href="tel:${esc(r.telefone.replace(/[^\d+]/g, ''))}">${esc(telBonito(r.telefone))}</a>`].filter(Boolean).join(' · ')}</p>
          ${r.mensagem ? `<p class="msg-text">${esc(r.mensagem)}</p>` : '<p class="msg-text is-empty">Sem mensagem escrita.</p>'}
          <div class="row-tools">
            ${zap ? `<a class="btn btn-sm btn-zap" href="https://wa.me/${zap}?text=${zapText}" target="_blank" rel="noopener" data-reply>${icon('chat')}<span>WhatsApp</span></a>` : ''}
            ${r.email ? `<a class="btn btn-sm" href="mailto:${esc(r.email)}?subject=${encodeURIComponent(`Seu contato no site ${siteName}`)}" data-reply>${icon('mail')}<span>Responder por e-mail</span></a>` : ''}
            <button class="btn btn-sm" type="button" data-lido>${r.lido ? 'Marcar como não lida' : 'Marcar como lida'}</button>
            <button class="btn btn-sm btn-danger-ghost" type="button" data-del>${icon('trash')}<span>Excluir</span></button>
          </div>
        </li>`;
      }).join('')}</ul>`;
      const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
      const link = (n) => { const q = new URLSearchParams(location.search); if (n > 1) q.set('pagina', n); else q.delete('pagina'); return `/admin/contatos${q.toString() ? `?${q}` : ''}`; };
      $('#ctPager').innerHTML = `<span>${plural(count, novos ? 'mensagem não lida' : 'mensagem', novos ? 'mensagens não lidas' : 'mensagens')}</span>
        ${pages > 1 ? `<span class="pager-btns">${pagina > 1 ? `<a class="btn btn-sm" href="${link(pagina - 1)}" data-link>${icon('left')}<span>Anterior</span></a>` : ''}<span class="pager-n">Página ${pagina} de ${pages}</span>${pagina < pages ? `<a class="btn btn-sm" href="${link(pagina + 1)}" data-link><span>Próxima</span>${icon('right')}</a>` : ''}</span>` : ''}`;
    }
    async function setLido(r, lido, quiet) {
      const { data, error } = await sb.from('contatos').update({ lido }).eq('id', r.id).select('id');
      if (error || !data.length) { toast(errText(error || noRows()), 'error'); return false; }
      r.lido = lido;
      refreshBadge();
      if (!quiet) toast(lido ? 'Mensagem marcada como lida.' : 'Mensagem marcada como não lida.');
      return true;
    }
    page.addEventListener('click', async (e) => {
      const li = e.target.closest('li[data-id]');
      if (!li) return;
      const r = rows.find((x) => x.id === li.dataset.id);
      if (!r) return;
      if (e.target.closest('[data-reply]')) {
        // respondeu: marca como lida sem atrapalhar o link
        if (!r.lido && await setLido(r, true, true)) { li.classList.remove('is-new'); $('.pill--disponivel', li)?.remove(); $('[data-lido]', li).textContent = 'Marcar como não lida'; }
        return;
      }
      const b = e.target.closest('button');
      if (!b) return;
      if (b.matches('[data-lido]')) {
        b.disabled = true;
        const ok = await setLido(r, !r.lido);
        b.disabled = false;
        if (!ok) return;
        if (novos && r.lido) { li.classList.add('is-gone'); setTimeout(() => { if (alive()) render(); }, 250); return; }
        li.classList.toggle('is-new', !r.lido);
        b.textContent = r.lido ? 'Marcar como não lida' : 'Marcar como lida';
        const head = $('.msg-head', li);
        $('.pill--disponivel', head)?.remove();
        if (!r.lido) head.insertAdjacentHTML('beforeend', '<span class="pill pill--disponivel">Nova</span>');
      } else if (b.matches('[data-del]')) {
        const ok = await confirmBox({ title: 'Excluir mensagem?', text: `A mensagem de ${r.nome} será apagada. Essa ação não pode ser desfeita.`, confirm: 'Excluir', danger: true });
        if (!ok) return;
        setBusy(b, true, '');
        const { data, error } = await sb.from('contatos').delete().eq('id', r.id).select('id');
        if (error || !data.length) { setBusy(b, false); toast(errText(error || noRows()), 'error'); return; }
        toast('Mensagem excluída.');
        refreshBadge();
        li.classList.add('is-gone');
        setTimeout(() => { if (alive()) render(); }, 250);
      }
    });
    load();
  }

  /* =========================================================
     Clientes: quem tem conta, favoritos e carrinhos
     Por segurança só aparece o e-mail e o que o cliente preencheu; senha nunca.
     ========================================================= */

  async function viewClientes(page, _m, alive) {
    page.innerHTML = `${pageHead('Clientes', 'Quem tem conta no site e quais imóveis mais interessam. Por segurança, aparecem só o e-mail e os dados que o cliente preencheu — senha nunca.')}
      <div class="stats" id="clStats">${Array.from({ length: 5 }, () => '<div class="stat is-skel"><i></i><b></b></div>').join('')}</div>
      <div class="cl-cols">
        <section class="panel"><div class="panel-head"><h2>Imóveis mais desejados</h2><small class="hint">favoritos e carrinhos</small></div><div id="clRank">${skelRows(3)}</div></section>
        <section class="panel"><div class="panel-head"><h2>Atividade recente</h2></div><div id="clFeed">${skelRows(3)}</div></section>
      </div>
      <section class="panel">
        <div class="panel-head"><h2>Todos os clientes</h2><small class="hint" id="clCount"></small></div>
        <label class="search search--full">${icon('search')}<span class="sr">Buscar cliente</span><input type="search" id="clSearch" placeholder="Buscar por nome ou e-mail" /></label>
        <div id="clList">${skelRows(4)}</div>
      </section>`;
    const load = async () => {
      const [cl, it, im] = await Promise.all([
        sb.rpc('admin_clientes'),
        sb.rpc('admin_interesses'),
        sb.from('imoveis').select('slug,titulo,imagem_principal,preco,finalidade'),
      ]);
      if (!alive()) return;
      const bad = [cl, it, im].find((r) => r.error);
      if (bad) { $('#clStats').innerHTML = ''; $('#clRank').innerHTML = ''; $('#clFeed').innerHTML = ''; showError($('#clList'), bad.error, load); return; }
      const clientes = cl.data;
      const interesses = it.data;
      const imoveis = new Map(im.data.map((r) => [r.slug, r]));
      const nomeImovel = (slug) => imoveis.get(slug)?.titulo || `Imóvel removido (${slug})`;
      const quem = (r) => r.nome || r.email;

      // números
      const agora = Date.now();
      const ativos7 = clientes.filter((c) => c.ultimo_acesso && agora - new Date(c.ultimo_acesso) < 7 * 864e5).length;
      const novos30 = clientes.filter((c) => agora - new Date(c.criado_em) < 30 * 864e5).length;
      const favs = interesses.filter((r) => r.tipo === 'favorito').length;
      const carts = interesses.filter((r) => r.tipo === 'carrinho').length;
      $('#clStats').innerHTML = [
        ['Clientes cadastrados', clientes.length, 'users'],
        ['Entraram nos últimos 7 dias', ativos7, 'check'],
        ['Novos nos últimos 30 dias', novos30, 'plus'],
        ['Imóveis favoritados', favs, 'heart'],
        ['Itens em carrinhos', carts, 'cart'],
      ].map(([label, n, ic]) => `<div class="stat"><span class="stat-ico">${icon(ic)}</span><span class="stat-label">${label}</span><b class="stat-num">${n.toLocaleString('pt-BR')}</b></div>`).join('');

      // ranking por imóvel
      const porImovel = new Map();
      interesses.forEach((r) => {
        const e = porImovel.get(r.item) || { item: r.item, favorito: [], carrinho: [] };
        e[r.tipo].push(r);
        porImovel.set(r.item, e);
      });
      const ranking = [...porImovel.values()].sort((a, b) => (b.favorito.length + b.carrinho.length) - (a.favorito.length + a.carrinho.length)).slice(0, 12);
      $('#clRank').innerHTML = ranking.length ? `<ul class="rank">${ranking.map((e) => `
        <li>
          <details>
            <summary>
              ${thumbImg(imoveis.get(e.item)?.imagem_principal)}
              <span class="rank-main"><b>${esc(nomeImovel(e.item))}</b><small>Ver quem</small></span>
              <span class="rank-n" title="Favoritos">${icon('heart')}${e.favorito.length}</span>
              <span class="rank-n" title="Carrinhos">${icon('cart')}${e.carrinho.length}</span>
            </summary>
            <ul class="rank-who">${[...e.favorito, ...e.carrinho].sort((a, b) => new Date(b.quando) - new Date(a.quando)).map((r) => `
              <li>${icon(r.tipo === 'favorito' ? 'heart' : 'cart')}<span><b>${esc(quem(r))}</b>${r.nome ? ` <small>${esc(r.email)}</small>` : ''}</span><small>${r.tipo === 'favorito' ? 'favoritou' : 'no carrinho'} · ${dataHora(r.quando)}</small></li>`).join('')}
            </ul>
          </details>
        </li>`).join('')}</ul>`
        : stateBox('empty', 'Ninguém favoritou ainda', 'Quando um cliente favoritar ou colocar um imóvel no carrinho, aparece aqui.');

      // atividade recente
      const recentes = interesses.slice(0, 15);
      $('#clFeed').innerHTML = recentes.length ? `<ul class="feed">${recentes.map((r) => `
        <li>
          <span class="feed-ico feed-ico--${r.tipo}">${icon(r.tipo === 'favorito' ? 'heart' : 'cart')}</span>
          <span><b>${esc(quem(r))}</b> ${r.tipo === 'favorito' ? 'favoritou' : 'colocou no carrinho'} <b>${esc(nomeImovel(r.item))}</b><small>${dataHora(r.quando)}${r.nome ? ` · ${esc(r.email)}` : ''}</small></span>
        </li>`).join('')}</ul>`
        : stateBox('empty', 'Sem atividade ainda', '');

      // lista de clientes
      const paint = () => {
        const term = $('#clSearch').value.trim().toLowerCase();
        const achados = clientes.filter((c) => !term || `${c.nome} ${c.email}`.toLowerCase().includes(term));
        $('#clCount').textContent = term ? `${achados.length} de ${plural(clientes.length, 'cliente', 'clientes')}` : plural(clientes.length, 'cliente', 'clientes');
        if (!achados.length) {
          $('#clList').innerHTML = stateBox('empty', clientes.length ? 'Nenhum cliente encontrado' : 'Nenhum cliente com conta ainda', clientes.length ? 'Tente outro nome ou e-mail.' : 'Quando alguém criar conta no site, aparece aqui.');
          return;
        }
        const mostrar = achados.slice(0, 200);
        $('#clList').innerHTML = `
          <table class="table table--clientes">
            <thead><tr><th>Cliente</th><th>Telefone</th><th>Cadastro</th><th>Último acesso</th><th title="Favoritos">${icon('heart')}</th><th title="Carrinho">${icon('cart')}</th><th>Pedidos</th></tr></thead>
            <tbody>${mostrar.map((c) => {
              const zap = zapDigits(c.telefone);
              return `<tr>
                <td data-label="Cliente" class="td-name"><b>${esc(c.nome || '—')}</b><small><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></small></td>
                <td data-label="Telefone">${c.telefone ? `${esc(telBonito(c.telefone))}${zap ? ` <a class="mini-zap" href="https://wa.me/${zap}" target="_blank" rel="noopener" title="Abrir no WhatsApp">WhatsApp</a>` : ''}` : '<span class="muted">—</span>'}</td>
                <td data-label="Cadastro" class="td-date">${dateBR(c.criado_em)}</td>
                <td data-label="Último acesso" class="td-date">${c.ultimo_acesso ? dataHora(c.ultimo_acesso) : '—'}</td>
                <td data-label="Favoritos" class="td-num">${c.favoritos}</td>
                <td data-label="Carrinho" class="td-num">${c.carrinho}</td>
                <td data-label="Pedidos" class="td-num">${c.pedidos}</td>
              </tr>`;
            }).join('')}</tbody>
          </table>
          ${achados.length > mostrar.length ? `<p class="hint" style="padding:12px 0 0">Mostrando ${mostrar.length} de ${achados.length}. Use a busca para achar os outros.</p>` : ''}`;
      };
      $('#clSearch').addEventListener('input', paint);
      paint();
    };
    load();
  }

  /* =========================================================
     Minha conta (trocar a senha do administrador)
     ========================================================= */

  function viewMinhaConta(page) {
    page.innerHTML = `${pageHead('Minha conta', 'Seu nome, sua foto de perfil e a senha que você usa para entrar no painel.')}
      <section class="panel form--single acc-photo-panel">
        <h2 class="panel-title">Perfil</h2>
        <form class="name-row" id="meNameForm" novalidate>
          <label class="field"><span>Seu nome</span><input name="nome" maxlength="60" autocomplete="given-name" placeholder="Ex.: Kelmaria" value="${esc(myName)}" /><small class="err"></small></label>
          <button class="btn" type="submit" id="meNameSave">Salvar nome</button>
        </form>
        <span class="field-label">Foto de perfil</span>
        <div class="mini-photo">
          <span class="avatar avatar--xl" id="meAva" aria-hidden="true"></span>
          <label class="btn btn-sm">${icon('upload')}<span>Escolher foto</span><input type="file" accept="image/jpeg,image/png,image/webp" id="meFile" hidden /></label>
          <button class="btn btn-sm btn-danger-ghost" type="button" id="meDel">Remover</button>
        </div>
        <p class="hint" style="margin-top:10px">Aparece no topo do painel. A foto é cortada em quadrado e reduzida antes de enviar.</p>
      </section>
      <form class="form form--single" id="pwForm" novalidate>
        <section class="panel">
          <h2 class="panel-title">Senha</h2>
          <p class="hint" style="margin:-8px 0 16px">Conta: <b>${esc(user.email)}</b></p>
          <div class="grid">
            <label class="field col-2"><span>Senha atual</span><input name="atual" type="password" autocomplete="current-password" required /><small class="err"></small></label>
            <label class="field"><span>Nova senha</span><input name="nova" type="password" autocomplete="new-password" required placeholder="8+ caracteres, letras e números" /><small class="err"></small></label>
            <label class="field"><span>Repita a nova senha</span><input name="nova2" type="password" autocomplete="new-password" required /><small class="err"></small></label>
          </div>
        </section>
        <div class="form-bar">
          <p class="form-msg" id="pwMsg" role="alert"></p>
          <button class="btn btn-primary btn-lg" type="submit" id="pwSave">TROCAR SENHA</button>
        </div>
      </form>`;
    const paintMe = () => {
      paintAvatar($('#meAva'));
      $('#meDel').hidden = !myPhoto;
      const inp = $('#meNameForm [name=nome]');
      if (inp && !inp.value && myName) inp.value = myName;
    };
    paintMe();
    loadMyProfile().then(paintMe, () => {});
    $('#meNameForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f2 = e.currentTarget;
      const btn = $('#meNameSave');
      if (btn.disabled) return;
      const nome = f2.nome.value.trim().replace(/\s+/g, ' ');
      const fl = f2.nome.closest('.field');
      fl.classList.remove('has-error');
      $('.err', fl).textContent = '';
      if (nome.length < 2) { fl.classList.add('has-error'); $('.err', fl).textContent = 'Digite seu nome.'; f2.nome.focus(); return; }
      setBusy(btn, true, 'Salvando…');
      try {
        await saveMyName(nome);
        toast(`Pronto, ${firstName()}! Nome salvo.`);
      } catch (err) {
        fl.classList.add('has-error');
        $('.err', fl).textContent = errText(err);
      } finally {
        setBusy(btn, false);
      }
    });
    const trocarFoto = async (path) => {
      const old = myPhoto;
      const { data, error } = await sb.from('perfis').upsert({ id: user.id, foto: path }, { onConflict: 'id' }).select('id');
      if (error || !data?.length) throw error || noRows();
      if (old && !/^(https?:|blob:|data:)/.test(old) && old !== path) removeFiles('perfis', [old]);
      myPhoto = path || '';
      paintIdentity();
      paintMe();
    };
    $('#meFile').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      const bad = checkFile(file);
      if (bad) { toast(bad, 'error'); return; }
      const label = e.target.closest('label');
      label.classList.add('is-busy');
      let path = '';
      try {
        const blob = await squareAvatar(file);
        path = `${user.id}/${crypto.randomUUID()}.${extOf(blob.type)}`;
        const { error } = await sb.storage.from('perfis').upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false });
        if (error) throw error;
        await trocarFoto(path);
        toast('Foto de perfil atualizada.');
      } catch (err) {
        if (path) removeFiles('perfis', [path]);
        toast(errText(err), 'error');
      } finally {
        label.classList.remove('is-busy');
      }
    });
    $('#meDel').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      setBusy(btn, true, 'Removendo…');
      try {
        await trocarFoto(null);
        toast('Foto removida.');
      } catch (err) {
        toast(errText(err), 'error');
      } finally {
        setBusy(btn, false);
        $('#meDel').hidden = !myPhoto;
      }
    });

    const f = $('#pwForm');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#pwSave');
      if (btn.disabled) return;
      const msg = $('#pwMsg');
      msg.textContent = '';
      $$('.field', f).forEach((x) => { x.classList.remove('has-error'); $('.err', x).textContent = ''; });
      const bad = (name, text) => { const fl = f[name].closest('.field'); fl.classList.add('has-error'); $('.err', fl).textContent = text; f[name].focus(); };
      const nova = f.nova.value;
      if (!f.atual.value) return bad('atual', 'Digite a senha atual.');
      if (nova.length < 8 || !/\p{L}/u.test(nova) || !/\d/.test(nova)) return bad('nova', 'Use pelo menos 8 caracteres, com letras e números.');
      if (nova !== f.nova2.value) return bad('nova2', 'As duas senhas não são iguais.');
      setBusy(btn, true, 'Salvando…');
      const { error: e1 } = await sb.auth.signInWithPassword({ email: user.email, password: f.atual.value });
      if (e1) { setBusy(btn, false); return bad('atual', /invalid/i.test(e1.message) ? 'A senha atual está errada.' : errText(e1)); }
      const { error } = await sb.auth.updateUser({ password: nova });
      setBusy(btn, false);
      if (error) { msg.textContent = /different|same_password/i.test(`${error.message} ${error.code}`) ? 'A nova senha precisa ser diferente da atual.' : errText(error); return; }
      f.reset();
      toast('Senha alterada.');
    });
  }

  /* ---------- Nova senha (link "esqueci minha senha" do e-mail) ---------- */

  let recoveryUser = null;
  let recoveryError = '';
  function viewNovaSenha(root) {
    const card = (inner) => `<main class="login">${themeBtn('theme-float')}<section class="login-card" aria-labelledby="nsTitle">
      <div class="login-brand" role="img" aria-label="${PAINEL_NOME}">${BRAND_HTML}</div>
      ${inner}
      <a class="login-back" href="/admin/login" data-link>${icon('left')}<span>Voltar para entrar</span></a>
    </section><div class="login-art" aria-hidden="true"></div></main>`;
    if (!recoveryUser) {
      root.innerHTML = card(`<h1 id="nsTitle">LINK INVÁLIDO</h1><p class="login-sub">${esc(recoveryError || 'Este link de senha nova expirou ou já foi usado.')} Peça um novo na tela de entrada, em “Esqueci minha senha”.</p>
        <a class="btn btn-primary btn-block btn-lg" href="/admin/login?esqueci=1" data-link>PEDIR NOVO LINK</a>`);
      return;
    }
    root.innerHTML = card(`<h1 id="nsTitle">CRIAR SENHA NOVA</h1>
      <p class="login-sub">Conta: <b>${esc(recoveryUser.email)}</b></p>
      <form id="nsForm" novalidate>
        <label class="field"><span>Nova senha</span><input id="nsPass" type="password" autocomplete="new-password" required placeholder="8+ caracteres, letras e números" /></label>
        <label class="field"><span>Repita a nova senha</span><input id="nsPass2" type="password" autocomplete="new-password" required /></label>
        <p class="form-msg" id="nsMsg" role="alert"></p>
        <button class="btn btn-primary btn-block btn-lg" type="submit" id="nsBtn">SALVAR SENHA</button>
      </form>`);
    setTimeout(() => $('#nsPass').focus(), 50);
    $('#nsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#nsBtn');
      if (btn.disabled) return;
      const msg = $('#nsMsg');
      const nova = $('#nsPass').value;
      if (nova.length < 8 || !/\p{L}/u.test(nova) || !/\d/.test(nova)) { msg.textContent = 'Use pelo menos 8 caracteres, com letras e números.'; return; }
      if (nova !== $('#nsPass2').value) { msg.textContent = 'As duas senhas não são iguais.'; return; }
      setBusy(btn, true, 'Salvando…');
      const { error } = await sb.auth.updateUser({ password: nova });
      if (error) { setBusy(btn, false); msg.textContent = /different|same_password/i.test(`${error.message} ${error.code}`) ? 'A nova senha precisa ser diferente da atual.' : errText(error); return; }
      const u = recoveryUser;
      recoveryUser = null;
      let admin = false;
      try { admin = await isAdmin(u); } catch (_) { /* segue como sem acesso */ }
      if (!admin) {
        await sb.auth.signOut().catch(() => {});
        sessionStorage.setItem('morada:admin-aviso', 'Senha alterada, mas esta conta não tem acesso ao painel.');
        navigate('/admin/login', true);
        return;
      }
      user = u;
      loadSiteName().catch(() => {});
      navigate('/admin', true);
      toast('Senha nova salva. Bem-vindo ao painel.');
    });
  }

  /* =========================================================
     Relatórios: visitas, imóveis vistos e cliques no WhatsApp
     ========================================================= */

  const FUSO = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo'; } catch (_) { return 'America/Sao_Paulo'; } })();
  const PERIODOS = [['hoje', 'Hoje'], ['7d', '7 dias'], ['30d', '30 dias'], ['tudo', 'Tempo todo']];
  const numBR = (n) => (Number(n) >= 100000
    ? new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
    : Number(n || 0).toLocaleString('pt-BR'));
  const isoDia = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const diaLocal = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const dataBR = (d) => d.toLocaleDateString('pt-BR');
  const curto = (d, o = { day: 'numeric', month: 'short' }) => d.toLocaleDateString('pt-BR', o).replace(/\./g, '').replace(' de ', ' ');
  const maisDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const SQL_EDITOR = 'https://supabase.com/dashboard/project/_/sql/new';

  // período escolhido fica na URL: ?periodo=hoje|7d|30d|tudo ou ?de=AAAA-MM-DD&ate=AAAA-MM-DD
  function periodoDaUrl() {
    const q = new URLSearchParams(location.search);
    const ok = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !Number.isNaN(diaLocal(s).getTime());
    const de = q.get('de');
    const ate = q.get('ate');
    if (ok(de) && ok(ate) && de <= ate) return { id: 'custom', de, ate };
    return { id: PERIODOS.some(([k]) => k === q.get('periodo')) ? q.get('periodo') : '7d' };
  }

  // início e fim (fim exclusivo) do período e do período anterior do mesmo tamanho, para comparar
  function intervalo(p) {
    const agora = new Date();
    const hoje = new Date(agora); hoje.setHours(0, 0, 0, 0);
    if (p.id === 'tudo') return { ini: null, fim: agora, texto: 'Desde o primeiro acesso registrado' };
    let ini; let fim = agora; let dias; let vs;
    if (p.id === 'custom') {
      ini = diaLocal(p.de);
      const fimDia = maisDias(diaLocal(p.ate), 1);
      fim = fimDia < agora ? fimDia : agora;
      dias = Math.round((fimDia - ini) / 864e5);
      vs = dias === 1 ? 'o dia anterior' : `os ${dias} dias anteriores`;
    } else {
      dias = { hoje: 1, '7d': 7, '30d': 30 }[p.id];
      ini = maisDias(hoje, 1 - dias);
      vs = { hoje: 'ontem até esta hora', '7d': 'os 7 dias anteriores', '30d': 'os 30 dias anteriores' }[p.id];
    }
    const ultimo = maisDias(fim, fim.getHours() || fim.getMinutes() || fim.getSeconds() ? 0 : -1);
    const texto = isoDia(ini) === isoDia(ultimo)
      ? ini.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : `${ini.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} a ${ultimo.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    return { ini, fim, texto, vs, prev: { ini: maisDias(ini, -dias), fim: maisDias(fim, -dias) } };
  }

  // escala do eixo: 0 até um número redondo, com passos inteiros de 1, 2 ou 5 × 10ⁿ
  function escala(max, marcas = 4) {
    const bruto = Math.max(1, max) / marcas;
    const mag = 10 ** Math.floor(Math.log10(bruto));
    const passo = Math.max(1, [1, 2, 5, 10].map((k) => k * mag).find((s) => s >= bruto));
    return { passo, topo: Math.max(passo, Math.ceil(Math.max(1, max) / passo) * passo) };
  }

  // rótulos de cada ponto do gráfico (o banco já manda a hora local de quem está vendo)
  function rotulos(chave, passo) {
    const [d, h] = chave.split('T');
    const [y, m, dd] = d.split('-').map(Number);
    const hh = Number(h.slice(0, 2));
    const dt = new Date(y, m - 1, dd, hh);
    if (passo === 'hour') return { eixo: `${hh}h`, dica: `${curto(dt)}, ${hh}h às ${(hh + 1) % 24}h` };
    if (passo === 'week') return { eixo: curto(dt), dica: `Semana de ${dt.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}` };
    const dia = dt.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' }).replace('.', '');
    return { eixo: curto(dt), dica: dia.charAt(0).toUpperCase() + dia.slice(1) };
  }

  function deltaHtml(cur, prev, vs) {
    if (prev == null) return '';
    let cls = 'is-flat';
    let txt = 'igual';
    if (prev === 0 && cur > 0) { cls = 'is-up'; txt = `+${numBR(cur)}`; }
    else if (prev > 0) {
      const pct = Math.round(((cur - prev) / prev) * 100);
      cls = pct > 0 ? 'is-up' : pct < 0 ? 'is-down' : 'is-flat';
      txt = pct === 0 ? 'igual' : `${pct > 0 ? '+' : '−'}${Math.abs(pct)}%`;
    }
    const seta = cls === 'is-up' ? icon('up') : cls === 'is-down' ? icon('down') : '';
    const lido = cls === 'is-up' ? 'subiu' : cls === 'is-down' ? 'caiu' : 'ficou';
    return `<span class="rl-delta ${cls}"><span class="sr">${lido} </span>${seta}${esc(txt)}</span><span class="rl-vs">vs. ${esc(vs)}</span>`;
  }

  function graficoLinhas(box, serie, passo, alive) {
    const W = Math.max(280, Math.round(box.clientWidth));
    const H = W < 560 ? 230 : 300;
    const padL = 44; const padR = 16; const padT = 12; const eixoB = 30;
    const pw = W - padL - padR; const ph = H - padT - eixoB;
    const n = serie.length;
    const { passo: step, topo } = escala(Math.max(...serie.map(([, v, w]) => Math.max(v, w))));
    const X = (i) => padL + (n === 1 ? pw / 2 : (i / (n - 1)) * pw);
    const Y = (v) => padT + ph - (v / topo) * ph;
    const rot = serie.map(([k]) => rotulos(k, passo));
    const grade = [];
    for (let v = 0; v <= topo + 1e-9; v += step) {
      grade.push(`<line class="rl-grid" x1="${padL}" x2="${W - padR}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><text class="rl-tick" x="${padL - 10}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end">${numBR(v)}</text>`);
    }
    const cabem = Math.max(2, Math.floor(pw / (W < 560 ? 62 : 78)));
    const salto = Math.max(1, Math.ceil(n / cabem));
    const eixoX = [];
    for (let i = 0; i < n; i += salto) {
      const anchor = n === 1 ? 'middle' : i === 0 ? 'start' : 'middle';
      eixoX.push(`<text class="rl-tick" x="${X(i).toFixed(1)}" y="${H - 8}" text-anchor="${anchor}">${esc(rot[i].eixo)}</text>`);
    }
    const linha = (k) => serie.map((d, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(d[k]).toFixed(1)}`).join('');
    const base = Y(0).toFixed(1);
    const area = `${linha(1)}L${X(n - 1).toFixed(1)} ${base}L${X(0).toFixed(1)} ${base}Z`;
    const ult = serie[n - 1];
    const totV = serie.reduce((s, d) => s + d[1], 0);
    const totW = serie.reduce((s, d) => s + d[2], 0);
    box.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" tabindex="0" role="img"
        aria-label="Gráfico de linhas: ${numBR(totV)} visualizações e ${numBR(totW)} cliques no WhatsApp no período. Use as setas para ver cada ponto.">
        ${grade.join('')}
        <path class="rl-area" d="${area}"/>
        <path class="rl-line rl-line--views" d="${linha(1)}"/>
        <path class="rl-line rl-line--zap" d="${linha(2)}"/>
        <circle class="rl-dot rl-dot--views" r="4" cx="${X(n - 1).toFixed(1)}" cy="${Y(ult[1]).toFixed(1)}"/>
        <circle class="rl-dot rl-dot--zap" r="4" cx="${X(n - 1).toFixed(1)}" cy="${Y(ult[2]).toFixed(1)}"/>
        ${eixoX.join('')}
        <g class="rl-hover" visibility="hidden">
          <line class="rl-cross" y1="${padT}" y2="${padT + ph}"/>
          <circle class="rl-dot rl-dot--views" r="5"/>
          <circle class="rl-dot rl-dot--zap" r="5"/>
        </g>
        <rect class="rl-hit" x="${padL - 8}" y="0" width="${pw + 16}" height="${H}" fill="transparent"/>
      </svg>
      <div class="rl-tip" role="status" aria-live="polite"></div>`;
    const svg = $('svg', box);
    const hov = $('.rl-hover', box);
    const [cross, dv, dw] = hov.children;
    const tip = $('.rl-tip', box);
    let atual = null;
    const mostrar = (i) => {
      atual = Math.max(0, Math.min(n - 1, i));
      const [, v, w] = serie[atual];
      const x = X(atual);
      cross.setAttribute('x1', x); cross.setAttribute('x2', x);
      dv.setAttribute('cx', x); dv.setAttribute('cy', Y(v));
      dw.setAttribute('cx', x); dw.setAttribute('cy', Y(w));
      hov.setAttribute('visibility', 'visible');
      tip.innerHTML = `<p class="rl-tip-date"></p>
        <p class="rl-tip-row"><i style="background:var(--c-views)"></i><b>${numBR(v)}</b><span>visualizações</span></p>
        <p class="rl-tip-row"><i style="background:var(--c-zap)"></i><b>${numBR(w)}</b><span>cliques no WhatsApp</span></p>`;
      $('.rl-tip-date', tip).textContent = rot[atual].dica;
      const tw = tip.offsetWidth;
      const esq = x + 14 + tw > W ? x - 14 - tw : x + 14;
      tip.style.left = `${Math.max(0, esq)}px`;
      tip.style.top = `${padT}px`;
      tip.classList.add('is-on');
    };
    const esconder = () => { atual = null; hov.setAttribute('visibility', 'hidden'); tip.classList.remove('is-on'); };
    const indice = (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      return n === 1 ? 0 : Math.round(((px - padL) / pw) * (n - 1));
    };
    svg.addEventListener('pointermove', (e) => mostrar(indice(e)));
    svg.addEventListener('pointerdown', (e) => mostrar(indice(e)));
    svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') esconder(); });
    svg.addEventListener('focus', () => mostrar(atual ?? n - 1));
    svg.addEventListener('blur', esconder);
    svg.addEventListener('keydown', (e) => {
      const mapa = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity };
      if (e.key === 'Escape') { esconder(); return; }
      if (!(e.key in mapa)) return;
      e.preventDefault();
      const d = mapa[e.key];
      mostrar(Number.isFinite(d) ? (atual ?? n - 1) + d : d < 0 ? 0 : n - 1);
    });
  }

  async function viewRelatorios(page, _m, alive) {
    let p = periodoDaUrl();
    let dados = null;
    let ro = null;
    page.innerHTML = `${pageHead('Relatórios', 'Desempenho do site: quem visitou, o que viu e quem chamou no WhatsApp.', `<button class="btn btn-sm" type="button" id="rlRefresh">${icon('refresh')}<span>Atualizar</span></button>`)}
      <div class="rl-filters">
        <div class="rl-seg" role="group" aria-label="Período do relatório" id="rlSeg">
          ${PERIODOS.map(([k, t]) => `<button type="button" data-p="${k}">${t}</button>`).join('')}
          <button type="button" data-p="custom" aria-expanded="false" aria-controls="rlCustom">${icon('calendar')}<span id="rlCustomTxt">Personalizado</span>${icon('down', 'rl-caret')}</button>
        </div>
      </div>
      <form class="rl-custom" id="rlCustom" hidden novalidate>
        <label>De<input type="date" name="de" required /></label>
        <span class="rl-arrow" aria-hidden="true">→</span>
        <label>Até<input type="date" name="ate" required /></label>
        <button class="btn btn-primary btn-sm" type="submit">Aplicar</button>
        <p class="rl-custom-err" id="rlCustomErr" role="alert"></p>
      </form>
      <p class="rl-range" id="rlRange"></p>
      <div class="rl-body" id="rlBody">
        <div class="rl-kpis" id="rlKpis">${Array.from({ length: 4 }, () => '<div class="stat is-skel"><i></i><b></b></div>').join('')}</div>
        <section class="panel">
          <div class="panel-head rl-chart-head">
            <div><h2>Visualizações e cliques no WhatsApp</h2><small class="hint" id="rlChartSub"></small></div>
            <div class="rl-legend" id="rlLegend"></div>
          </div>
          <div class="rl-chart" id="rlChart">${skelRows(3)}</div>
          <div class="rl-chart-foot"><button class="link-btn" type="button" id="rlTableBtn" aria-expanded="false" aria-controls="rlTable">Ver em tabela</button></div>
          <div class="rl-table-wrap" id="rlTable" hidden></div>
        </section>
        <section class="panel">
          <div class="panel-head"><h2>Desempenho dos imóveis</h2><small class="hint">mais vistos primeiro</small></div>
          <div id="rlImoveis">${skelRows(4)}</div>
        </section>
      </div>
      <p class="rl-note">${icon('alert')}<span>Os acessos feitos <b>neste aparelho</b> não entram na contagem, porque ele está logado no painel — assim as suas próprias visitas não inflam os números. Para ver a contagem funcionando, abra o site numa janela anônima ou em outro celular e depois clique em Atualizar.</span></p>`;
    const form = $('#rlCustom');

    const pintarFiltros = () => {
      $$('#rlSeg button', page).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === p.id)));
      $('#rlCustomTxt').textContent = p.id === 'custom' ? `${dataBR(diaLocal(p.de))} → ${dataBR(diaLocal(p.ate))}` : 'Personalizado';
    };
    const mudar = (novo) => {
      p = novo;
      const q = p.id === 'custom' ? `?de=${p.de}&ate=${p.ate}` : p.id === '7d' ? '' : `?periodo=${p.id}`;
      history.replaceState(null, '', `/admin/relatorios${q}`);
      app.dataset.path = location.pathname + location.search;
      carregar();
    };
    $('#rlSeg').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-p]');
      if (!b) return;
      if (b.dataset.p === 'custom') {
        const abrir = form.hidden;
        form.hidden = !abrir;
        b.setAttribute('aria-expanded', String(abrir));
        if (abrir) {
          const hoje = new Date();
          form.de.value = p.id === 'custom' ? p.de : isoDia(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
          form.ate.value = p.id === 'custom' ? p.ate : isoDia(hoje);
          form.de.max = form.ate.max = isoDia(hoje);
          form.de.focus();
        }
        return;
      }
      form.hidden = true;
      $('[data-p="custom"]', page).setAttribute('aria-expanded', 'false');
      if (b.dataset.p !== p.id) mudar({ id: b.dataset.p });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const de = form.de.value;
      const ate = form.ate.value;
      if (!de || !ate) { $('#rlCustomErr').textContent = 'Escolha as duas datas.'; return; }
      if (de > ate) { $('#rlCustomErr').textContent = 'A data inicial precisa ser antes da final.'; return; }
      $('#rlCustomErr').textContent = '';
      form.hidden = true;
      $('[data-p="custom"]', page).setAttribute('aria-expanded', 'false');
      mudar({ id: 'custom', de, ate });
    });
    $('#rlRefresh').addEventListener('click', () => carregar());
    $('#rlTableBtn').addEventListener('click', (e) => {
      const t = $('#rlTable');
      t.hidden = !t.hidden;
      e.currentTarget.setAttribute('aria-expanded', String(!t.hidden));
      e.currentTarget.textContent = t.hidden ? 'Ver em tabela' : 'Esconder tabela';
    });

    const desenhar = () => {
      if (!dados || !alive()) return;
      const box = $('#rlChart');
      const serie = dados.serie || [];
      const temAlgo = serie.some(([, v, w]) => v || w);
      if (!serie.length || !temAlgo) {
        box.innerHTML = `<div class="rl-empty">${icon('chart')}<b>Sem visitas neste período</b><span>Os números aparecem aqui assim que alguém abrir o site. Para testar, use uma janela anônima ou outro celular: este aparelho não conta (veja abaixo).</span></div>`;
        return;
      }
      graficoLinhas(box, serie, dados.passo, alive);
    };

    const carregar = async () => {
      if (!$('#rlKpis')) { render(); return; } // a tela de erro substituiu o conteúdo: monta de novo
      pintarFiltros();
      const r = intervalo(p);
      $('#rlRange').textContent = r.texto.charAt(0).toUpperCase() + r.texto.slice(1);
      $('#rlBody').classList.add('is-loading');
      const chamar = (ini, fim) => sb.rpc('admin_relatorio', { p_inicio: ini ? ini.toISOString() : null, p_fim: fim.toISOString(), p_fuso: FUSO });
      // "Tempo todo": as avaliações contam desde sempre (a contagem de visitas só começa quando os Relatórios são ligados)
      const todas = p.id === 'tudo' ? sb.from('avaliacoes').select('id', { count: 'exact', head: true }) : Promise.resolve(null);
      const [cur, prev, aval] = await Promise.all([chamar(r.ini, r.fim), r.prev ? chamar(r.prev.ini, r.prev.fim) : Promise.resolve(null), todas]);
      if (!alive()) return;
      $('#rlBody').classList.remove('is-loading');
      const err = cur.error || prev?.error;
      if (err) {
        const semSql = err.code === 'PGRST202' || err.code === '42883' || /could not find the function|admin_relatorio/i.test(err.message || '');
        $('#rlBody').innerHTML = semSql ? semSqlRelatorios() : '';
        if (semSql) ligarCopiarSql(page);
        else showError($('#rlBody'), err, () => render());
        return;
      }
      dados = cur.data;
      const t = dados.totais;
      if (aval && !aval.error && aval.count != null) t.avaliacoes = aval.count;
      if (p.id === 'tudo') {
        const temVisitas = t.visitas || t.imoveis || t.whatsapp;
        $('#rlRange').textContent = temVisitas
          ? `Desde ${new Date(dados.inicio).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}, quando a contagem de visitas começou`
          : 'A contagem de visitas começa na primeira visita ao site depois que os Relatórios foram ligados';
      }
      const a = prev?.data?.totais;
      const kpis = [
        ['views', 'eye', 'Visualizações', t.visitas, a?.visitas],
        ['zap', 'zap', 'Cliques no WhatsApp', t.whatsapp, a?.whatsapp],
        ['home', 'home', 'Imóveis visualizados', t.imoveis, a?.imoveis],
        ['star', 'star', 'Avaliações recebidas', t.avaliacoes, a?.avaliacoes],
      ];
      $('#rlKpis').innerHTML = kpis.map(([cls, ic, label, v, pv]) => `
        <div class="stat rl-kpi rl-kpi--${cls}">
          <span class="rl-kpi-top"><span class="rl-kpi-ico">${icon(ic)}</span><span class="stat-label">${label}</span></span>
          <b class="rl-kpi-num">${numBR(v)}</b>
          <span class="rl-kpi-foot">${p.id === 'tudo' ? '<span class="rl-vs">desde o começo</span>' : deltaHtml(v, pv, r.vs)}</span>
        </div>`).join('');
      const unidade = { hour: 'por hora', day: 'por dia', week: 'por semana' }[dados.passo] || '';
      $('#rlChartSub').textContent = unidade ? `Total ${unidade}` : '';
      $('#rlLegend').innerHTML = `
        <span class="rl-key"><i style="background:var(--c-views)"></i>Visualizações <b>${numBR(t.visitas)}</b></span>
        <span class="rl-key"><i style="background:var(--c-zap)"></i>Cliques no WhatsApp <b>${numBR(t.whatsapp)}</b></span>`;
      desenhar();
      // tabela com os mesmos números do gráfico (acessível e para quem prefere ler)
      const serie = dados.serie || [];
      $('#rlTable').innerHTML = `<table class="rl-tbl"><thead><tr><th scope="col">${dados.passo === 'hour' ? 'Hora' : dados.passo === 'week' ? 'Semana' : 'Dia'}</th><th scope="col" class="rl-num">Visualizações</th><th scope="col" class="rl-num">WhatsApp</th></tr></thead>
        <tbody>${serie.slice().reverse().map(([k, v, w]) => `<tr><td>${esc(rotulos(k, dados.passo).dica)}</td><td class="rl-num">${numBR(v)}</td><td class="rl-num">${numBR(w)}</td></tr>`).join('')}</tbody></table>`;
      // imóveis: os mais vistos, com foto
      const lista = dados.imoveis || [];
      if (!lista.length) {
        $('#rlImoveis').innerHTML = `<div class="rl-empty rl-empty--sm">${icon('home')}<b>Nenhum imóvel foi aberto neste período</b></div>`;
      } else {
        const fotos = new Map();
        const { data: im } = await sb.from('imoveis').select('slug,imagem_principal').in('slug', lista.map((x) => x.slug));
        if (!alive()) return;
        (im || []).forEach((x) => fotos.set(x.slug, x.imagem_principal));
        const maxV = Math.max(1, ...lista.map((x) => x.visualizacoes));
        $('#rlImoveis').innerHTML = `<div class="rl-im-wrap"><table class="rl-tbl rl-im-table">
          <thead><tr><th scope="col" class="rl-rank">#</th><th scope="col">Imóvel</th><th scope="col" class="rl-num">Visualizações</th><th scope="col" class="rl-num">WhatsApp</th></tr></thead>
          <tbody>${lista.map((x, i) => `<tr>
            <td class="rl-rank">${i + 1}</td>
            <td><span class="rl-im">${thumbImg(fotos.get(x.slug))}<span><b>${esc(x.titulo)}</b>${x.existe ? '' : '<span class="rl-gone">saiu do site</span>'}</span></span></td>
            <td class="rl-num"><span class="rl-bar"><span class="rl-bar-track" aria-hidden="true"><i style="width:${Math.max(2, (x.visualizacoes / maxV) * 100).toFixed(1)}%"></i></span><b>${numBR(x.visualizacoes)}</b></span></td>
            <td class="rl-num"><b>${numBR(x.whatsapp)}</b></td>
          </tr>`).join('')}</tbody></table></div>`;
      }
    };

    // o gráfico se ajusta à largura (girar o celular, abrir o menu…)
    let largura = 0;
    ro = new ResizeObserver(() => {
      if (!alive()) { ro.disconnect(); return; }
      const w = Math.round($('#rlChart')?.clientWidth || 0);
      if (w && Math.abs(w - largura) > 4) { largura = w; requestAnimationFrame(desenhar); }
    });
    ro.observe($('#rlChart'));
    await carregar();
  }

  // aviso quando o SQL dos Relatórios ainda não foi rodado no Supabase
  const semSqlRelatorios = () => `
    <section class="panel rl-setup">
      <span class="rl-setup-ico">${icon('chart')}</span>
      <h2>Falta um passo para os Relatórios funcionarem</h2>
      <p>É só rodar uma vez, no Supabase, o código que cria a contagem de visitas. A partir daí o site começa a contar sozinho.</p>
      <ol>
        <li>Clique em <b>Copiar o código</b>.</li>
        <li>Clique em <b>Abrir o Supabase</b> (escolha o projeto do site, se pedir).</li>
        <li>Cole o código na tela em branco e clique em <b>Run</b>.</li>
        <li>Volte aqui e clique em <b>Atualizar</b>.</li>
      </ol>
      <div class="state-actions">
        <button class="btn btn-primary" type="button" id="rlCopySql">${icon('copy')}<span>Copiar o código</span></button>
        <a class="btn" href="${SQL_EDITOR}" target="_blank" rel="noopener">${icon('ext')}<span>Abrir o Supabase</span></a>
      </div>
    </section>`;
  function ligarCopiarSql(page) {
    const btn = $('#rlCopySql', page);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        const res = await fetch('/admin-app/relatorios.sql', { cache: 'no-store' });
        if (!res.ok) throw new Error('arquivo');
        await navigator.clipboard.writeText(await res.text());
        toast('Código copiado. Agora cole no Supabase e clique em Run.');
      } catch (_) {
        toast('Não deu para copiar automaticamente. Abra o arquivo supabase/migrations/20261001120000_relatorios.sql do projeto.', 'error');
      }
    });
  }

  /* =========================================================
     Configurações
     ========================================================= */

  async function viewConfig(page, _m, alive) {
    page.innerHTML = `${pageHead('Configurações', 'Dados de contato e identidade que aparecem no site.')}<div id="cfBox">${skelRows(4)}</div>`;
    const { data: c, error } = await sb.from('configuracoes').select('*').eq('id', 1).maybeSingle();
    if (!alive()) return;
    if (error || !c) { showError($('#cfBox'), error || new Error('A linha de configurações não existe. Rode a migração do Supabase.'), () => render()); return; }
    const novos = 'login_google' in c; // migração 2 já rodada?
    let logo = c.logo || '';
    let logoFile = null;
    let logoPreview = '';
    $('#cfBox').innerHTML = `
      <form class="form form--single" id="cfForm" novalidate>
        <section class="panel">
          <h2 class="panel-title">Imobiliária</h2>
          <div class="grid">
            <label class="field"><span>Nome da imobiliária *</span><input name="nome_imobiliaria" maxlength="60" required value="${esc(nomeDoSite(c.nome_imobiliaria) || NOME_MARCA)}" /><small class="err"></small></label>
            <div class="field"><span>Logo</span>
              <div class="mini-photo">
                <span class="logo-prev" id="cfLogo"></span>
                <label class="btn btn-sm">${icon('upload')}<span>Escolher imagem</span><input type="file" accept="image/png,image/webp,image/jpeg" id="cfLogoFile" hidden /></label>
                <button class="btn btn-sm btn-danger-ghost" type="button" id="cfLogoDel">Remover</button>
              </div>
              <small class="hint">PNG com fundo transparente fica melhor. Sem logo, o site usa a assinatura “Thiago TL Liro”.</small>
            </div>
          </div>
        </section>
        <section class="panel">
          <h2 class="panel-title">Contato</h2>
          <div class="grid">
            <label class="field"><span>WhatsApp</span><input name="whatsapp" inputmode="tel" maxlength="20" value="${esc(c.whatsapp)}" placeholder="5511999998888" /><small class="hint">Com DDI e DDD, só números. Recebe as mensagens dos botões do site.</small><small class="err"></small></label>
            <label class="field"><span>Telefone</span><input name="telefone" inputmode="tel" maxlength="30" value="${esc(c.telefone)}" placeholder="(11) 3000-0000" /></label>
            <label class="field"><span>E-mail</span><input name="email" type="email" maxlength="120" value="${esc(c.email)}" placeholder="contato@imobiliaria.com.br" /><small class="err"></small></label>
            <label class="field"><span>Instagram</span><input name="instagram" maxlength="60" value="${esc(c.instagram)}" placeholder="@perfil" /><small class="err"></small></label>
            <label class="field col-2"><span>Endereço</span><input name="endereco" maxlength="160" value="${esc(c.endereco)}" placeholder="Rua, número — bairro, cidade/UF" /></label>
          </div>
        </section>
        ${novos ? `
        <section class="panel">
          <h2 class="panel-title">Números da apresentação</h2>
          <p class="hint" style="margin:-8px 0 16px">Aparecem na abertura do site. Deixe vazio para esconder o número.</p>
          <div class="grid">
            <label class="field"><span>Famílias atendidas</span><input name="familias_atendidas" type="number" min="0" max="1000000" step="1" inputmode="numeric" value="${c.familias_atendidas ?? ''}" placeholder="Ex.: 350" /><small class="err"></small></label>
            <label class="field"><span>Anos de mercado</span><input name="anos_mercado" type="number" min="0" max="200" step="1" inputmode="numeric" value="${c.anos_mercado ?? ''}" placeholder="Ex.: 12" /><small class="err"></small></label>
          </div>
        </section>` : `
        <section class="panel">
          <h2 class="panel-title">Mais opções</h2>
          <p class="hint">Os números da apresentação aparecem aqui depois que o SQL novo (migração 2) for rodado no Supabase.</p>
        </section>`}
        <div class="form-bar">
          <p class="form-msg" id="cfMsg" role="alert"></p>
          <button class="btn btn-primary btn-lg" type="submit" id="cfSave">SALVAR ALTERAÇÕES</button>
        </div>
      </form>`;
    avisoDadosAntigos(c, $('#cfBox'));
    const f = $('#cfForm');
    const paintLogo = () => {
      const url = logoPreview || siteUrl(logo);
      $('#cfLogo').innerHTML = url ? `<img src="${esc(url)}" alt="Logo atual" />` : '<span class="logo-prev-tl" role="img" aria-label="Logo padrão">TL</span>';
      $('#cfLogo').classList.toggle('is-empty', !url);
      $('#cfLogoDel').hidden = !url;
    };
    paintLogo();
    f.addEventListener('input', () => { dirty = true; });
    $('#cfLogoFile').addEventListener('change', (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      const bad = checkFile(file);
      if (bad) { toast(bad, 'error'); return; }
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      logoFile = file;
      logoPreview = URL.createObjectURL(file);
      dirty = true;
      paintLogo();
    });
    $('#cfLogoDel').addEventListener('click', () => { logoFile = null; if (logoPreview) URL.revokeObjectURL(logoPreview); logoPreview = ''; logo = ''; dirty = true; paintLogo(); });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#cfSave');
      if (btn.disabled) return;
      const d = {
        nome_imobiliaria: f.nome_imobiliaria.value.trim().replace(/\s+/g, ' '),
        whatsapp: digits(f.whatsapp.value),
        telefone: f.telefone.value.trim(),
        email: f.email.value.trim(),
        instagram: f.instagram.value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@?/, '@').replace(/^@$/, ''),
        endereco: f.endereco.value.trim(),
      };
      $$('.field', f).forEach((x) => { x.classList.remove('has-error'); const s = $('.err', x); if (s) s.textContent = ''; });
      const errs = {};
      if (d.nome_imobiliaria.length < 2) errs.nome_imobiliaria = 'Digite o nome da imobiliária.';
      if (d.whatsapp && (d.whatsapp.length < 10 || d.whatsapp.length > 15)) errs.whatsapp = 'Use DDI + DDD + número, ex.: 5511999998888.';
      if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errs.email = 'Digite um e-mail válido.';
      if (d.instagram && !/^@[A-Za-z0-9._]{1,30}$/.test(d.instagram)) errs.instagram = 'Use só o @ do perfil, ex.: @seuperfil';
      if (novos) {
        const n = (v) => (String(v).trim() === '' ? null : Number(v));
        d.familias_atendidas = n(f.familias_atendidas.value);
        d.anos_mercado = n(f.anos_mercado.value);
        d.login_google = false; // "Entrar com o Google" desligado (só e-mail e senha)
        if (d.familias_atendidas != null && (!Number.isInteger(d.familias_atendidas) || d.familias_atendidas < 0)) errs.familias_atendidas = 'Digite um número inteiro.';
        if (d.anos_mercado != null && (!Number.isInteger(d.anos_mercado) || d.anos_mercado < 0 || d.anos_mercado > 200)) errs.anos_mercado = 'Digite um número de 0 a 200.';
      }
      Object.entries(errs).forEach(([k, t]) => { const fl = f[k].closest('.field'); fl.classList.add('has-error'); $('.err', fl).textContent = t; });
      if (Object.keys(errs).length) { $('#cfMsg').textContent = 'Confira os campos destacados.'; f[Object.keys(errs)[0]].focus(); return; }
      $('#cfMsg').textContent = '';
      setBusy(btn, true, 'Salvando…');
      let uploadedPath = '';
      try {
        if (logoFile) uploadedPath = await uploadSiteFile('logo', logoFile, 512, true);
        d.logo = uploadedPath || logo || null;
        const { data, error: err } = await sb.from('configuracoes').update(d).eq('id', 1).select('*');
        if (err) throw err;
        if (!data.length) throw noRows();
        if (c.logo && c.logo !== d.logo && isStoragePath(c.logo)) removeFiles(SITE_BUCKET, [c.logo]);
        Object.assign(c, data[0]);
        logo = c.logo || '';
        logoFile = null;
        if (logoPreview) { URL.revokeObjectURL(logoPreview); logoPreview = ''; }
        paintLogo();
        siteName = nomeDoSite(c.nome_imobiliaria) || NOME_MARCA;
        paintIdentity();
        f.instagram.value = c.instagram;
        f.whatsapp.value = c.whatsapp;
        dirty = false;
        toast('Alterações salvas.');
      } catch (err) {
        if (uploadedPath) removeFiles(SITE_BUCKET, [uploadedPath]);
        $('#cfMsg').textContent = errText(err);
        toast(errText(err), 'error');
      } finally {
        setBusy(btn, false);
      }
    });
  }

  /* =========================================================
     Início
     ========================================================= */

  function fatal(title, text, retry) {
    app.innerHTML = `<main class="login">${themeBtn('theme-float')}<section class="login-card">${stateBox('error', title, text, retry ? '<button class="btn btn-primary" type="button" data-retry>Tentar de novo</button>' : '')}<a class="login-back" href="/">${icon('left')}<span>Voltar para o site</span></a></section><div class="login-art" aria-hidden="true"></div></main>`;
    if (retry) $('[data-retry]', app).addEventListener('click', () => location.reload());
  }

  async function boot() {
    if (!window.supabase?.createClient || !window.moradaConfig) {
      fatal('O painel não carregou por completo', 'Um arquivo do painel não foi encontrado (/vendor/supabase.js ou /supabase-config.js). Publique o site de novo.', true);
      return;
    }
    cfg = await window.moradaConfig();
    if (!cfg) {
      fatal('Painel ainda não conectado ao Supabase', 'Configure as variáveis SUPABASE_URL e SUPABASE_ANON_KEY na Vercel (Settings → Environment Variables) e publique de novo. Veja o README.');
      return;
    }
    if (cfg.error) {
      fatal('Sem conexão', 'Não deu para falar com o servidor. Verifique sua internet.', true);
      return;
    }
    // link de "esqueci minha senha": chega com #access_token...&type=recovery (ou #error... se expirou)
    const hash = new URLSearchParams(location.hash.slice(1));
    const isRecovery = hash.get('type') === 'recovery';
    if (hash.get('error_description')) {
      recoveryError = hash.get('error_code') === 'otp_expired' ? 'Este link expirou ou já foi usado.' : hash.get('error_description');
    }
    sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'morada-admin-auth' },
    });
    try {
      const { data } = await sb.auth.getSession();
      const u = data.session?.user;
      if (u && isRecovery) {
        recoveryUser = u; // primeiro cria a senha nova; o acesso ao painel é conferido depois
        if (location.pathname !== '/admin/nova-senha') history.replaceState(null, '', '/admin/nova-senha');
      } else if (u) {
        if (await isAdmin(u)) user = u;
        else { await sb.auth.signOut(); sessionStorage.setItem('morada:admin-aviso', 'Esta conta não tem acesso ao painel.'); }
      }
      if (user) loadSiteName().catch(() => {});
      else sb.from('configuracoes').select('nome_imobiliaria').eq('id', 1).maybeSingle().then(({ data: c }) => { if (nomeDoSite(c?.nome_imobiliaria)) siteName = nomeDoSite(c.nome_imobiliaria); }).catch(() => {});
    } catch (err) {
      fatal('Não foi possível abrir o painel', errText(err), true);
      return;
    }
    // sessão encerrada em outra aba ou expirada: volta para o login
    sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && user) {
        user = null;
        dirty = false;
        myName = '';
        myPhoto = '';
        profileLoad = null;
        nameAsked = false;
        sessionStorage.setItem('morada:admin-aviso', 'Sua sessão terminou. Entre de novo.');
        setTimeout(() => navigate('/admin/login', true), 0);
      }
    });
    render();
  }

  boot();
})();
