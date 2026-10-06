/*
 * Painel do site (sem login por enquanto).
 * Edita uma cópia de window.SITE_DATA, guarda o rascunho no navegador e
 * publica gerando um novo data.js: por download ou direto no GitHub,
 * o que faz a Vercel atualizar o site sozinha.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var CHAVE_RASCUNHO = 'admin:rascunho';
  var CHAVE_PREVIA = 'admin:previa';
  var CHAVE_GITHUB = 'admin:github';

  var original = clone(window.SITE_DATA || { config: {}, imoveis: [], avaliacoes: [] });
  original.config = original.config || {};
  original.imoveis = original.imoveis || [];
  original.avaliacoes = original.avaliacoes || [];
  var dados = clone(original);
  var pendentes = {}; // caminho da foto -> { grande: dataURL, mini: dataURL } ainda não publicadas
  var recentes = {};  // fotos já publicadas que a Vercel ainda pode estar atualizando

  /* ---------- rascunho ---------- */

  try {
    var r = JSON.parse(localStorage.getItem(CHAVE_RASCUNHO));
    if (r && r.dados && JSON.stringify(r.dados) !== JSON.stringify(original)) {
      dados = r.dados;
      var aviso = $('#aviso-rascunho');
      aviso.textContent = 'Você está editando um rascunho salvo em ' + new Date(r.salvoEm).toLocaleString('pt-BR') + '. Ele só vai para o site quando você publicar.';
      aviso.hidden = false;
    }
  } catch (e) { /* sem rascunho */ }

  var salvarTimer = null;
  function mudou() {
    clearTimeout(salvarTimer);
    salvarTimer = setTimeout(function () {
      try { localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({ salvoEm: Date.now(), dados: dados })); } catch (e) { /* cheio */ }
    }, 250);
    estado();
  }
  function temMudanca() {
    return Object.keys(pendentes).length > 0 || JSON.stringify(dados) !== JSON.stringify(original);
  }
  function estado() {
    var m = temMudanca();
    $('#dot-mudou').hidden = !m;
    var n = Object.keys(pendentes).length;
    $('#estado-publicacao').textContent = m
      ? 'Há mudanças ainda não publicadas' + (n ? ' (' + n + ' ' + (n === 1 ? 'foto nova' : 'fotos novas') + ')' : '') + '.'
      : 'Tudo publicado. Nenhuma mudança pendente.';
    $('#site-nome').textContent = dados.config.nome ? 'Painel de ' + dados.config.nome : 'Painel do site';
    var a = dados.config.assinatura || {};
    var partes = String(dados.config.nome || '').split(' ');
    var txt = {
      antes: a.antes || partes[0] || '',
      iniciais: a.iniciais || partes.map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase(),
      depois: a.depois || partes.slice(1).join(' ')
    };
    $$('[data-brand]').forEach(function (el) { el.textContent = txt[el.dataset.brand] || ''; });
    renderDashboard();
    renderRelatorios();
    renderAlto();
  }

  var toastT = null;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }

  /* ---------- entrada: só o nome ---------- */

  var CHAVE_NOME = 'admin:nome';
  function lerNome() { try { return (localStorage.getItem(CHAVE_NOME) || '').trim(); } catch (e) { return ''; } }
  function entrar() {
    var nome = lerNome();
    $('#gate').hidden = !!nome;
    $('#app').hidden = !nome;
    if (!nome) { setTimeout(function () { $('#gate-nome').focus(); }, 30); return; }
    $('#ola').textContent = 'Olá, ' + nome;
    $('#avatar').textContent = nome.charAt(0).toUpperCase();
  }
  $('#gate-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#gate-nome').value.trim();
    if (!nome) return;
    try { localStorage.setItem(CHAVE_NOME, nome); } catch (er) { /* sem armazenamento */ }
    entrar();
    abrirAba(location.hash.slice(1) || 'dashboard');
  });
  $('#btn-sair').addEventListener('click', function () {
    try { localStorage.removeItem(CHAVE_NOME); } catch (e) { /* ok */ }
    $('#gate-nome').value = '';
    entrar();
  });

  /* ---------- tema claro / escuro ---------- */

  var CHAVE_TEMA = 'admin:tema';
  function aplicarTema(t) {
    document.documentElement.dataset.theme = t;
    var claro = t === 'light';
    $('#btn-tema use').setAttribute('href', claro ? '#a-moon' : '#a-sun');
    $('#btn-tema').setAttribute('aria-label', claro ? 'Mudar para o tema escuro' : 'Mudar para o tema claro');
  }
  try { aplicarTema(localStorage.getItem(CHAVE_TEMA) || 'dark'); } catch (e) { aplicarTema('dark'); }
  $('#btn-tema').addEventListener('click', function () {
    var t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    aplicarTema(t);
    try { localStorage.setItem(CHAVE_TEMA, t); } catch (e) { /* ok */ }
  });

  /* ---------- navegação lateral ---------- */

  var side = $('#side');
  var sideScrim = $('#side-scrim');
  var menuBtn = $('#menu-btn');
  function fecharLateral() {
    side.classList.remove('is-open');
    sideScrim.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  function abrirAba(nome) {
    if (!$('#tab-' + nome)) nome = 'dashboard';
    $$('.side-nav [data-tab]').forEach(function (b) {
      if (b.dataset.tab === nome) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $$('.tab-panel').forEach(function (p) { p.hidden = p.id !== 'tab-' + nome; });
    try { history.replaceState(null, '', '#' + nome); } catch (e) { /* file:// */ }
    fecharLateral();
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (b) { e.preventDefault(); abrirAba(b.dataset.tab); }
  });
  menuBtn.addEventListener('click', function () {
    side.classList.add('is-open');
    sideScrim.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    var atual = $('.side-nav [aria-current="page"]');
    if (atual) atual.focus();
  });
  sideScrim.addEventListener('click', fecharLateral);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && side.classList.contains('is-open')) fecharLateral(); });

  /* ---------- fotos ---------- */

  function srcFoto(caminho, mini) {
    if (!caminho) return '';
    var p = pendentes[caminho] || recentes[caminho];
    if (p) return mini ? p.mini : p.grande;
    if (/^(https?:|data:)/.test(caminho)) return caminho;
    var c = caminho.replace(/^\//, '');
    return '../' + (mini ? c.replace(/\.webp$/i, '-thumb.webp') : c);
  }
  function redimensionar(bitmap, maior, qualidade) {
    var escala = Math.min(1, maior / Math.max(bitmap.width, bitmap.height));
    var c = document.createElement('canvas');
    c.width = Math.round(bitmap.width * escala);
    c.height = Math.round(bitmap.height * escala);
    c.getContext('2d').drawImage(bitmap, 0, 0, c.width, c.height);
    return c.toDataURL('image/webp', qualidade);
  }
  function lerImagem(file) {
    if (window.createImageBitmap) return createImageBitmap(file);
    return new Promise(function (ok, erro) {
      var img = new Image();
      img.onload = function () { ok(img); };
      img.onerror = erro;
      img.src = URL.createObjectURL(file);
    });
  }

  /* ---------- imóveis ---------- */

  function slugify(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'imovel';
  }
  function ordenarImoveis() {
    dados.imoveis.sort(function (a, b) { return (a.ordem == null ? 1e9 : a.ordem) - (b.ordem == null ? 1e9 : b.ordem); });
    dados.imoveis.forEach(function (im, i) { im.ordem = i + 1; });
  }
  var TIPO = { casa: 'Casa', apartamento: 'Apartamento', terreno: 'Terreno', comercial: 'Comercial', outros: 'Outros' };
  var STATUS = { disponivel: 'Disponível', vendido: 'Vendido', alugado: 'Alugado' };

  function renderImoveis() {
    ordenarImoveis();
    var ul = $('#lista-imoveis');
    var n = dados.imoveis.length;
    $('#resumo-imoveis').textContent = n + (n === 1 ? ' imóvel' : ' imóveis') + ' · ' +
      dados.imoveis.filter(function (i) { return i.destaque; }).length + ' em alto padrão';
    if (!n) { ul.innerHTML = '<li class="vazio">Nenhum imóvel ainda. Clique em “+ Novo imóvel”.</li>'; return; }
    ul.innerHTML = dados.imoveis.map(function (im, i) {
      var foto = im.fotos && im.fotos[0];
      var lugar = [im.bairro, im.cidade].filter(Boolean).join(' · ');
      return '<li class="item">' +
        (foto ? '<img class="item-foto" src="' + esc(srcFoto(foto, true)) + '" alt="">' : '<span class="item-foto"></span>') +
        '<div class="item-texto"><strong>' + esc(im.titulo || '(sem título)') + '</strong>' +
          '<span>' + esc(TIPO[im.tipo] || im.tipo) + (lugar ? ' · ' + esc(lugar) : '') + ' · ' + ((im.fotos || []).length) + ' fotos</span>' +
          '<div class="tags">' +
            '<span class="tag">' + (im.finalidade === 'aluguel' ? 'Aluguel' : 'Venda') + '</span>' +
            (im.destaque ? '<span class="tag tag--gold">Alto padrão</span>' : '') +
            (im.status && im.status !== 'disponivel' ? '<span class="tag tag--off">' + esc(STATUS[im.status]) + '</span>' : '') +
          '</div></div>' +
        '<span class="item-preco">' + (im.preco != null && im.preco !== '' ? BRL.format(im.preco) + (im.finalidade === 'aluguel' ? '/mês' : '') : 'Sob consulta') + '</span>' +
        '<div class="item-acoes">' +
          '<button type="button" class="icon-btn" data-mover="-1" data-i="' + i + '" aria-label="Subir"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
          '<button type="button" class="icon-btn" data-mover="1" data-i="' + i + '" aria-label="Descer"' + (i === n - 1 ? ' disabled' : '') + '>↓</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-editar="' + i + '">Editar</button>' +
        '</div></li>';
    }).join('');
  }
  $('#lista-imoveis').addEventListener('click', function (e) {
    var m = e.target.closest('[data-mover]');
    if (m) {
      var i = Number(m.dataset.i), j = i + Number(m.dataset.mover);
      var tmp = dados.imoveis[i]; dados.imoveis[i] = dados.imoveis[j]; dados.imoveis[j] = tmp;
      dados.imoveis.forEach(function (im, k) { im.ordem = k + 1; });
      renderImoveis(); mudou();
      return;
    }
    var ed = e.target.closest('[data-editar]');
    if (ed) abrirImovel(Number(ed.dataset.editar));
  });

  var dlgIm = $('#editor-imovel');
  var fIm = $('#form-imovel');
  var editando = -1;
  var fotosEdit = [];
  var slugManual = false;

  function abrirImovel(i) {
    editando = i;
    var im = i >= 0 ? dados.imoveis[i] : {
      tipo: 'casa', finalidade: 'venda', status: 'disponivel', destaque: false, uf: 'CE', fotos: [], selos: [], caracteristicas: []
    };
    $('#ed-titulo').textContent = i >= 0 ? 'Editar imóvel' : 'Novo imóvel';
    ['titulo', 'slug', 'preco', 'tipo', 'finalidade', 'status', 'cidade', 'uf', 'bairro', 'area', 'quartos', 'suites', 'banheiros', 'vagas', 'frente', 'descricao'].forEach(function (k) {
      fIm[k].value = im[k] == null ? '' : im[k];
    });
    fIm.destaque.checked = !!im.destaque;
    fIm.selos.value = (im.selos || []).join(', ');
    fIm.caracteristicas.value = (im.caracteristicas || []).join(', ');
    fotosEdit = (im.fotos || []).slice();
    slugManual = i >= 0;
    $('#excluir-imovel').hidden = i < 0;
    renderFotos();
    dlgIm.showModal();
    fIm.titulo.focus();
  }
  fIm.titulo.addEventListener('input', function () { if (!slugManual) fIm.slug.value = slugify(fIm.titulo.value + ' ' + fIm.cidade.value); });
  fIm.cidade.addEventListener('input', function () { if (!slugManual) fIm.slug.value = slugify(fIm.titulo.value + ' ' + fIm.cidade.value); });
  fIm.slug.addEventListener('input', function () { slugManual = true; });

  function renderFotos() {
    var ul = $('#lista-fotos');
    ul.innerHTML = fotosEdit.length ? fotosEdit.map(function (c, i) {
      return '<li class="foto" draggable="true" data-i="' + i + '"><img src="' + esc(srcFoto(c, true)) + '" alt="Foto ' + (i + 1) + '">' +
        (i === 0 ? '<span class="capa">Capa</span>' : '') +
        (pendentes[c] ? '<span class="nova">Nova</span>' : '') +
        '<button type="button" class="remover" data-remover="' + i + '" aria-label="Remover foto ' + (i + 1) + '">×</button></li>';
    }).join('') : '<li class="muted">Nenhuma foto ainda.</li>';
  }
  $('#lista-fotos').addEventListener('click', function (e) {
    var r = e.target.closest('[data-remover]');
    if (r) { fotosEdit.splice(Number(r.dataset.remover), 1); renderFotos(); }
  });
  var arrastando = null;
  $('#lista-fotos').addEventListener('dragstart', function (e) {
    var li = e.target.closest('.foto'); if (!li) return;
    arrastando = Number(li.dataset.i); li.classList.add('is-drag');
    e.dataTransfer.effectAllowed = 'move';
  });
  $('#lista-fotos').addEventListener('dragover', function (e) { if (arrastando != null) e.preventDefault(); });
  $('#lista-fotos').addEventListener('drop', function (e) {
    var li = e.target.closest('.foto'); if (!li || arrastando == null) return;
    e.preventDefault();
    var para = Number(li.dataset.i);
    var item = fotosEdit.splice(arrastando, 1)[0];
    fotosEdit.splice(para, 0, item);
    arrastando = null; renderFotos();
  });
  $('#lista-fotos').addEventListener('dragend', function () { arrastando = null; renderFotos(); });

  $('#input-fotos').addEventListener('change', function (e) {
    var files = Array.prototype.slice.call(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    var slug = slugify(fIm.slug.value || fIm.titulo.value);
    if (!fIm.slug.value) fIm.slug.value = slug;
    toast('Preparando ' + files.length + (files.length === 1 ? ' foto…' : ' fotos…'));
    files.reduce(function (p, file) {
      return p.then(function () {
        return lerImagem(file).then(function (bmp) {
          var usados = fotosEdit.concat(Object.keys(pendentes)).concat([].concat.apply([], dados.imoveis.map(function (x) { return x.fotos || []; })));
          var n = 1;
          while (usados.indexOf('assets/imoveis/' + slug + '-' + n + '.webp') !== -1) n++;
          var caminho = 'assets/imoveis/' + slug + '-' + n + '.webp';
          pendentes[caminho] = { grande: redimensionar(bmp, 1600, 0.82), mini: redimensionar(bmp, 700, 0.78) };
          fotosEdit.push(caminho);
          renderFotos();
        });
      });
    }, Promise.resolve()).then(function () { toast('Fotos prontas. Salve o imóvel e publique.'); estado(); })
      .catch(function () { toast('Não consegui ler uma das imagens.'); });
  });

  function numero(v) { return v === '' || v == null ? null : Number(v); }
  function lista(v) { return String(v || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean); }

  fIm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!fIm.reportValidity()) return;
    var slug = slugify(fIm.slug.value);
    var repetido = dados.imoveis.some(function (x, k) { return x.slug === slug && k !== editando; });
    if (repetido) { fIm.slug.setCustomValidity('Já existe um imóvel com esse slug.'); fIm.reportValidity(); fIm.slug.setCustomValidity(''); return; }
    var base = editando >= 0 ? dados.imoveis[editando] : { ordem: dados.imoveis.length + 1 };
    var im = Object.assign({}, base, {
      slug: slug,
      titulo: fIm.titulo.value.trim(),
      descricao: fIm.descricao.value.trim(),
      preco: numero(fIm.preco.value),
      tipo: fIm.tipo.value,
      finalidade: fIm.finalidade.value,
      cidade: fIm.cidade.value.trim(),
      uf: fIm.uf.value.trim().toUpperCase(),
      bairro: fIm.bairro.value.trim(),
      quartos: numero(fIm.quartos.value),
      suites: numero(fIm.suites.value),
      banheiros: numero(fIm.banheiros.value),
      vagas: numero(fIm.vagas.value),
      area: numero(fIm.area.value),
      frente: numero(fIm.frente.value),
      selos: lista(fIm.selos.value),
      caracteristicas: lista(fIm.caracteristicas.value),
      status: fIm.status.value,
      destaque: fIm.destaque.checked,
      fotos: fotosEdit.slice()
    });
    if (editando >= 0) dados.imoveis[editando] = im; else dados.imoveis.push(im);
    descartarFotosSoltas();
    dlgIm.close();
    renderImoveis(); mudou();
    toast('Imóvel salvo no rascunho');
  });
  $('#excluir-imovel').addEventListener('click', function () {
    if (editando < 0 || !confirm('Excluir “' + dados.imoveis[editando].titulo + '”? Isso só vale para o site depois de publicar.')) return;
    dados.imoveis.splice(editando, 1);
    descartarFotosSoltas();
    dlgIm.close();
    renderImoveis(); mudou();
    toast('Imóvel excluído do rascunho');
  });
  $('#novo-imovel').addEventListener('click', function () { abrirImovel(-1); });

  // fotos enviadas que não ficaram em nenhum imóvel não precisam ser publicadas
  function descartarFotosSoltas() {
    var usadas = [].concat.apply([], dados.imoveis.map(function (x) { return x.fotos || []; }));
    Object.keys(pendentes).forEach(function (c) { if (usadas.indexOf(c) === -1) delete pendentes[c]; });
  }

  /* ---------- avaliações ---------- */

  function renderAvaliacoes() {
    var ul = $('#lista-avaliacoes');
    var n = dados.avaliacoes.length;
    var media = n ? dados.avaliacoes.reduce(function (s, a) { return s + Number(a.nota || 0); }, 0) / n : 0;
    $('#resumo-avaliacoes').textContent = n + (n === 1 ? ' avaliação' : ' avaliações') + (n ? ' · média ' + media.toFixed(1).replace('.', ',') : '');
    ul.innerHTML = n ? dados.avaliacoes.map(function (a, i) {
      return '<li class="item"><div class="item-texto"><strong>' + esc(a.nome) + ' · ' + '★'.repeat(Number(a.nota) || 0) + '</strong>' +
        '<span>' + esc(a.subtitulo || '') + '</span><span>“' + esc(String(a.texto || '').slice(0, 140)) + (String(a.texto || '').length > 140 ? '…' : '') + '”</span></div>' +
        '<div class="item-acoes"><button type="button" class="btn btn-ghost btn-sm" data-editar-av="' + i + '">Editar</button></div></li>';
    }).join('') : '<li class="vazio">Nenhuma avaliação. O site mostra “As primeiras avaliações aparecem aqui em breve.”</li>';
  }
  var dlgAv = $('#editor-avaliacao');
  var fAv = $('#form-avaliacao');
  var editandoAv = -1;
  function abrirAvaliacao(i) {
    editandoAv = i;
    var a = i >= 0 ? dados.avaliacoes[i] : { nota: 5 };
    $('#ea-titulo').textContent = i >= 0 ? 'Editar avaliação' : 'Nova avaliação';
    fAv.nome.value = a.nome || '';
    fAv.nota.value = String(a.nota || 5);
    fAv.subtitulo.value = a.subtitulo || '';
    fAv.texto.value = a.texto || '';
    $('#excluir-avaliacao').hidden = i < 0;
    dlgAv.showModal();
    fAv.nome.focus();
  }
  $('#lista-avaliacoes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-editar-av]');
    if (b) abrirAvaliacao(Number(b.dataset.editarAv));
  });
  $('#nova-avaliacao').addEventListener('click', function () { abrirAvaliacao(-1); });
  fAv.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!fAv.reportValidity()) return;
    var a = { nome: fAv.nome.value.trim(), nota: Number(fAv.nota.value), subtitulo: fAv.subtitulo.value.trim(), texto: fAv.texto.value.trim() };
    if (editandoAv >= 0) dados.avaliacoes[editandoAv] = a; else dados.avaliacoes.push(a);
    dlgAv.close(); renderAvaliacoes(); mudou();
    toast('Avaliação salva no rascunho');
  });
  $('#excluir-avaliacao').addEventListener('click', function () {
    if (editandoAv < 0 || !confirm('Excluir a avaliação de ' + dados.avaliacoes[editandoAv].nome + '?')) return;
    dados.avaliacoes.splice(editandoAv, 1);
    dlgAv.close(); renderAvaliacoes(); mudou();
  });

  $$('[data-fechar]').forEach(function (b) { b.addEventListener('click', function () { b.closest('dialog').close(); }); });

  /* ---------- configurações ---------- */

  var fCfg = $('#form-config');
  function pegar(obj, caminho) { return caminho.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj); }
  function por(obj, caminho, v) {
    var ks = caminho.split('.'), o = obj;
    ks.slice(0, -1).forEach(function (k) { if (typeof o[k] !== 'object' || o[k] === null) o[k] = {}; o = o[k]; });
    o[ks[ks.length - 1]] = v;
  }
  function renderConfig() {
    $$('[name]', fCfg).forEach(function (el) {
      var v = pegar(dados.config, el.name);
      el.value = v == null ? '' : v;
    });
  }
  fCfg.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.name) return;
    var v = el.value;
    if (el.type === 'number') v = v === '' ? null : Number(v);
    if (el.name === 'whatsapp') v = v.replace(/\D/g, '');
    if (el.name === 'instagram') v = v.replace(/^@/, '').trim();
    por(dados.config, el.name, v);
    mudou();
  });

  /* ---------- gerar data.js ---------- */

  function gerarDataJs() {
    var limpo = clone(dados);
    return '/*\n * Dados do site, gerados pelo painel em ' + new Date().toLocaleString('pt-BR') + '.\n' +
      ' * Pode editar à mão: o resto do código só lê window.SITE_DATA.\n */\n' +
      'window.SITE_DATA = ' + JSON.stringify(limpo, null, 2) + ';\n';
  }
  $('#btn-baixar').addEventListener('click', function () {
    var blob = new Blob([gerarDataJs()], { type: 'text/javascript' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.js';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    if (Object.keys(pendentes).length) toast('Atenção: as fotos novas só vão para o site pelo “Publicar agora”.');
  });

  $('#btn-descartar').addEventListener('click', function () {
    if (!confirm('Descartar todas as mudanças não publicadas?')) return;
    try { localStorage.removeItem(CHAVE_RASCUNHO); } catch (e) { /* ok */ }
    dados = clone(original); pendentes = {};
    $('#aviso-rascunho').hidden = true;
    renderTudo(); estado();
    toast('Rascunho descartado');
  });

  /* ---------- pré-visualização ---------- */

  $('#btn-previa').addEventListener('click', function () {
    var previa = clone(dados);
    previa.imoveis.forEach(function (im) {
      im.fotos = (im.fotos || []).map(function (c) { return pendentes[c] ? pendentes[c].mini : c; });
    });
    try {
      localStorage.setItem(CHAVE_PREVIA, JSON.stringify(previa));
    } catch (e) {
      previa.imoveis.forEach(function (im) { im.fotos = im.fotos.filter(function (c) { return !/^data:/.test(c); }); });
      try { localStorage.setItem(CHAVE_PREVIA, JSON.stringify(previa)); } catch (e2) { /* ok */ }
      toast('Prévia sem as fotos novas (muito grandes para o navegador).');
    }
    window.open('../index.html?previa=1', '_blank', 'noopener');
  });

  /* ---------- publicar no GitHub ---------- */

  var fGh = $('#form-github');
  var gh = { token: '', owner: 'kelnascimentofrotra-crypto', repo: 'jabuticabacaf-', branch: 'claude/sharp-sagan-uwjkzp', pasta: 'site-localhost' };
  try { Object.assign(gh, JSON.parse(localStorage.getItem(CHAVE_GITHUB)) || {}); } catch (e) { /* padrão */ }
  $$('[name]', fGh).forEach(function (el) { el.value = gh[el.name] || ''; });
  fGh.addEventListener('input', function (e) {
    gh[e.target.name] = e.target.value.trim();
    try { localStorage.setItem(CHAVE_GITHUB, JSON.stringify(gh)); } catch (er) { /* ok */ }
  });

  function b64Texto(s) {
    var bytes = new TextEncoder().encode(s);
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function api(method, caminho, corpo) {
    var url = 'https://api.github.com/repos/' + encodeURIComponent(gh.owner) + '/' + encodeURIComponent(gh.repo) +
      '/contents/' + caminho.split('/').map(encodeURIComponent).join('/') +
      (method === 'GET' ? '?ref=' + encodeURIComponent(gh.branch) : '');
    return fetch(url, {
      method: method,
      headers: { Authorization: 'Bearer ' + gh.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: corpo ? JSON.stringify(corpo) : undefined,
      cache: 'no-store'
    }).then(function (r) {
      if (method === 'GET' && r.status === 404) return null;
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          var msg = j.message || ('erro ' + r.status);
          if (r.status === 401) msg = 'token inválido ou expirado';
          if (r.status === 403 || r.status === 404) msg = 'o token não tem permissão de escrita nesse repositório (' + (j.message || r.status) + ')';
          throw new Error(msg);
        });
      }
      return r.json();
    });
  }
  function enviarArquivo(caminho, base64, mensagem) {
    return api('GET', caminho).then(function (atual) {
      return api('PUT', caminho, { message: mensagem, content: base64, branch: gh.branch, sha: atual ? atual.sha : undefined });
    });
  }
  function log(txt, cls) {
    var li = document.createElement('li');
    li.textContent = txt;
    if (cls) li.className = cls;
    $('#log-publicar').appendChild(li);
    return li;
  }

  $('#btn-publicar').addEventListener('click', function () {
    if (!gh.token) { toast('Cole o token do GitHub primeiro.'); fGh.token.focus(); return; }
    var btn = this;
    btn.disabled = true;
    $('#log-publicar').innerHTML = '';
    var pasta = gh.pasta ? gh.pasta.replace(/\/+$/, '') + '/' : '';
    var fotos = Object.keys(pendentes);
    var passos = Promise.resolve();
    fotos.forEach(function (c) {
      passos = passos.then(function () {
        var li = log('Enviando ' + c + '…');
        var p = pendentes[c];
        return enviarArquivo(pasta + c, p.grande.split(',')[1], 'Painel: foto ' + c)
          .then(function () { return enviarArquivo(pasta + c.replace(/\.webp$/i, '-thumb.webp'), p.mini.split(',')[1], 'Painel: miniatura ' + c); })
          .then(function () { li.textContent = 'Foto enviada: ' + c; li.className = 'ok'; });
      });
    });
    passos.then(function () {
      var li = log('Enviando data.js…');
      return enviarArquivo(pasta + 'data.js', b64Texto(gerarDataJs()), 'Painel: atualiza dados do site')
        .then(function () { li.textContent = 'data.js publicado'; li.className = 'ok'; });
    }).then(function () {
      original = clone(dados);
      Object.assign(recentes, pendentes);
      pendentes = {};
      try { localStorage.removeItem(CHAVE_RASCUNHO); } catch (e) { /* ok */ }
      $('#aviso-rascunho').hidden = true;
      log('Pronto! A Vercel atualiza o site em cerca de 1 minuto.', 'ok');
      toast('Publicado!');
      renderTudo(); estado();
    }).catch(function (err) {
      log('Não foi possível publicar: ' + err.message, 'erro');
    }).then(function () { btn.disabled = false; });
  });

  /* ---------- dashboard ---------- */

  var BRL_CURTO = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });
  function semAcento(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function semCidade(im) { return !im.cidade || semAcento(im.cidade) === 'a definir'; }
  function disponivel(im) { return !im.status || im.status === 'disponivel'; }
  function nomesDe(lista) {
    var n = lista.map(function (im) { return im.titulo || '(sem título)'; });
    return n.length > 3 ? n.slice(0, 3).join(', ') + ' e mais ' + (n.length - 3) : n.join(', ');
  }
  function checklist() {
    var c = dados.config;
    var sc = dados.imoveis.filter(semCidade);
    var sf = dados.imoveis.filter(function (im) { return !(im.fotos || []).length; });
    var falta = [];
    if (!c.email) falta.push('e-mail');
    if (!c.telefone) falta.push('telefone');
    var nAv = dados.avaliacoes.length;
    return [
      { id: 'cidade', feito: !sc.length, titulo: 'Colocar a cidade dos imóveis',
        texto: sc.length ? nomesDe(sc) + ': a cidade está vazia ou como “A definir” e por isso não aparece no site. Abra o imóvel, troque a cidade e salve.' : 'Todos os imóveis têm cidade.' },
      { id: 'whatsapp', feito: !!c.whatsapp, titulo: 'Colocar o WhatsApp do corretor',
        texto: c.whatsapp ? 'Os botões “WhatsApp” do site mandam as mensagens para ' + c.whatsapp + '.' : 'Os botões “WhatsApp” do site mandam as mensagens para este número.' },
      { id: 'contato', feito: !falta.length, titulo: 'Preencher e-mail e telefone',
        texto: falta.length ? 'Falta ' + falta.join(' e ') + '. Aparecem na cena Contato do site e no rodapé do menu.' : 'Aparecem na cena Contato do site e no rodapé do menu.' },
      { id: 'fotos', feito: !sf.length, titulo: 'Colocar fotos em todos os imóveis',
        texto: sf.length ? nomesDe(sf) + ' ainda sem foto: o site mostra uma casinha no lugar.' : 'Todos os imóveis têm foto.' },
      { id: 'avaliacoes', feito: nAv >= 3, titulo: 'Ter pelo menos 3 avaliações de clientes',
        texto: 'A cena Avaliações mostra a nota média e os depoimentos. Hoje ' + (nAv === 1 ? 'há 1 avaliação.' : 'há ' + nAv + ' avaliações.') }
    ];
  }
  function stat(ic, rotulo, valor, extra) {
    return '<li class="stat"><span class="stat-ic"><svg class="ic" aria-hidden="true"><use href="#a-' + ic + '"/></svg></span>' +
      '<p>' + esc(rotulo) + '</p><strong>' + esc(valor) + '</strong>' + (extra ? '<small>' + esc(extra) + '</small>' : '') + '</li>';
  }
  function renderDashboard() {
    var clientes = dados.clientes || [];
    var semana = Date.now() - 7 * 864e5;
    var novos = clientes.filter(function (c) { return c.criadoEm && Date.parse(c.criadoEm) >= semana; }).length;
    $('#faixa-clientes').innerHTML = clientes.length
      ? '<strong>' + clientes.length + (clientes.length === 1 ? ' cliente cadastrado' : ' clientes cadastrados') + '</strong> · ' + novos + (novos === 1 ? ' entrou' : ' entraram') + ' nos últimos 7 dias'
      : '<strong>Nenhum cliente cadastrado</strong> · as contas de clientes ainda não estão ativas no site';
    var im = dados.imoveis;
    $('#stats').innerHTML =
      stat('home', 'Total de imóveis', im.length) +
      stat('check', 'Disponíveis', im.filter(disponivel).length) +
      stat('home', 'Vendidos', im.filter(function (x) { return x.status === 'vendido'; }).length) +
      stat('home', 'Alugados', im.filter(function (x) { return x.status === 'alugado'; }).length) +
      stat('star', 'Alto padrão', im.filter(function (x) { return x.destaque; }).length);
    var itens = checklist();
    var feitos = itens.filter(function (i) { return i.feito; }).length;
    $('#check-total').textContent = feitos + ' de ' + itens.length + ' feitos';
    $('#checklist').innerHTML = itens.map(function (i) {
      return '<li class="check-item' + (i.feito ? ' is-done' : '') + '">' +
        '<span class="check-ic"><svg class="ic" aria-hidden="true"><use href="#a-' + (i.feito ? 'check' : 'alert') + '"/></svg></span>' +
        '<div class="check-text"><strong>' + esc(i.titulo) + '</strong><span>' + esc(i.texto) + '</span></div>' +
        (i.feito ? '' : '<button type="button" class="btn btn-ghost" data-resolver="' + i.id + '">Resolver</button>') + '</li>';
    }).join('');
  }
  $('#checklist').addEventListener('click', function (e) {
    var b = e.target.closest('[data-resolver]');
    if (!b) return;
    var id = b.dataset.resolver;
    var foco = function (nome) { setTimeout(function () { var el = fCfg[nome]; el.focus(); el.scrollIntoView({ block: 'center' }); }, 60); };
    if (id === 'cidade' || id === 'fotos') {
      abrirAba('imoveis');
      var alvo = dados.imoveis.findIndex(id === 'cidade' ? semCidade : function (im) { return !(im.fotos || []).length; });
      if (alvo >= 0) {
        abrirImovel(alvo);
        if (id === 'cidade') setTimeout(function () { fIm.cidade.focus(); fIm.cidade.select(); }, 60);
      }
    } else if (id === 'whatsapp') { abrirAba('config'); foco('whatsapp'); }
    else if (id === 'contato') { abrirAba('config'); foco(dados.config.email ? 'telefone' : 'email'); }
    else if (id === 'avaliacoes') { abrirAba('avaliacoes'); abrirAvaliacao(-1); }
  });

  /* ---------- relatórios ---------- */

  function barras(titulo, contagem) {
    var chaves = Object.keys(contagem).sort(function (a, b) { return contagem[b] - contagem[a]; });
    var max = Math.max.apply(null, chaves.map(function (k) { return contagem[k]; }).concat([1]));
    return '<div class="card"><h2>' + esc(titulo) + '</h2><ul class="barras">' + (chaves.length ? chaves.map(function (k) {
      return '<li><div class="barra-top"><span>' + esc(k) + '</span><b>' + contagem[k] + '</b></div><div class="barra"><i style="width:' + (contagem[k] / max * 100).toFixed(1) + '%"></i></div></li>';
    }).join('') : '<li class="muted">Sem dados.</li>') + '</ul></div>';
  }
  function contar(lista, fn) {
    return lista.reduce(function (acc, x) { var k = fn(x); if (k) acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  }
  function renderRelatorios() {
    var im = dados.imoveis;
    var venda = im.filter(function (x) { return x.finalidade !== 'aluguel' && disponivel(x) && x.preco; });
    var aluguel = im.filter(function (x) { return x.finalidade === 'aluguel' && disponivel(x) && x.preco; });
    var soma = function (l) { return l.reduce(function (s, x) { return s + Number(x.preco); }, 0); };
    var av = dados.avaliacoes;
    var media = av.length ? av.reduce(function (s, a) { return s + Number(a.nota || 0); }, 0) / av.length : 0;
    $('#rel-numeros').innerHTML =
      stat('chart', 'Valor à venda', venda.length ? BRL_CURTO.format(soma(venda)) : '—', venda.length + (venda.length === 1 ? ' imóvel disponível' : ' imóveis disponíveis')) +
      stat('home', 'Preço médio de venda', venda.length ? BRL_CURTO.format(soma(venda) / venda.length) : '—') +
      stat('home', 'Aluguel por mês', aluguel.length ? BRL_CURTO.format(soma(aluguel)) : '—', aluguel.length + (aluguel.length === 1 ? ' imóvel para alugar' : ' imóveis para alugar')) +
      stat('star', 'Nota média', av.length ? media.toFixed(1).replace('.', ',') : '—', av.length + (av.length === 1 ? ' avaliação' : ' avaliações'));
    $('#rel-barras').innerHTML =
      barras('Por tipo', contar(im, function (x) { return TIPO[x.tipo] || 'Outros'; })) +
      barras('Por cidade', contar(im, function (x) { return semCidade(x) ? 'Sem cidade' : x.cidade; })) +
      barras('Por situação', contar(im, function (x) { return (x.finalidade === 'aluguel' ? 'Aluguel' : 'Venda') + ' · ' + (STATUS[x.status] || 'Disponível'); }));
  }

  /* ---------- contatos e clientes ---------- */

  function renderPessoas(lista, ul, resumo, vazioTitulo, vazioTexto, linha) {
    resumo.textContent = lista.length ? lista.length + (lista.length === 1 ? ' registro' : ' registros') : 'Nenhum registro ainda.';
    ul.innerHTML = lista.length ? lista.slice().reverse().map(linha).join('') :
      '<li class="vazio"><strong>' + esc(vazioTitulo) + '</strong>' + esc(vazioTexto) + '</li>';
  }
  function renderContatos() {
    renderPessoas(dados.contatos || [], $('#lista-contatos'), $('#resumo-contatos'),
      'Nenhum contato por aqui ainda',
      'As mensagens do formulário do site vão aparecer nesta lista quando o envio for ligado a um banco de dados (por exemplo, o Supabase). Por enquanto, quem envia vê a tela de obrigado e o botão do WhatsApp.',
      function (c) {
        return '<li class="item"><div class="item-texto"><strong>' + esc(c.nome) + '</strong><span>' + esc([c.email, c.telefone].filter(Boolean).join(' · ')) + '</span><span>' + esc(c.mensagem || '') + '</span></div>' +
          (c.data ? '<span class="muted">' + esc(new Date(c.data).toLocaleDateString('pt-BR')) + '</span>' : '') + '</li>';
      });
  }
  function renderClientes() {
    renderPessoas(dados.clientes || [], $('#lista-clientes'), $('#resumo-clientes'),
      'As contas de clientes ainda não estão ativas',
      'No site, a aba “Conta” mostra “Em breve você poderá criar sua conta”. Quando o cadastro for ligado a um banco de dados, os clientes aparecem aqui com a data de entrada.',
      function (c) {
        return '<li class="item"><span class="avatar">' + esc(String(c.nome || '?').charAt(0).toUpperCase()) + '</span><div class="item-texto"><strong>' + esc(c.nome) + '</strong><span>' + esc(c.email || '') + '</span></div>' +
          (c.criadoEm ? '<span class="muted">desde ' + esc(new Date(c.criadoEm).toLocaleDateString('pt-BR')) + '</span>' : '') + '</li>';
      });
  }

  /* ---------- alto padrão ---------- */

  function renderAlto() {
    var ul = $('#lista-alto');
    ul.innerHTML = dados.imoveis.length ? dados.imoveis.map(function (im, i) {
      var foto = im.fotos && im.fotos[0];
      return '<li class="item">' + (foto ? '<img class="item-foto" src="' + esc(srcFoto(foto, true)) + '" alt="">' : '<span class="item-foto"></span>') +
        '<div class="item-texto"><strong>' + esc(im.titulo) + '</strong><span>' + esc([im.bairro, im.cidade].filter(Boolean).join(' · ')) + '</span></div>' +
        '<button type="button" class="switch" role="switch" aria-checked="' + String(!!im.destaque) + '" data-alto="' + i + '" aria-label="Alto padrão: ' + esc(im.titulo) + '"></button></li>';
    }).join('') : '<li class="vazio">Cadastre imóveis para escolher os de alto padrão.</li>';
  }
  $('#lista-alto').addEventListener('click', function (e) {
    var b = e.target.closest('[data-alto]');
    if (!b) return;
    var im = dados.imoveis[Number(b.dataset.alto)];
    im.destaque = !im.destaque;
    renderAlto(); renderImoveis(); mudou();
    toast(im.destaque ? 'Marcado como alto padrão' : 'Tirado do alto padrão');
  });

  /* ---------- início ---------- */

  function renderTudo() { renderImoveis(); renderAvaliacoes(); renderConfig(); renderContatos(); renderClientes(); renderAlto(); renderDashboard(); renderRelatorios(); }
  window.addEventListener('beforeunload', function (e) {
    if (Object.keys(pendentes).length) { e.preventDefault(); e.returnValue = ''; }
  });
  entrar();
  renderTudo();
  estado();
  abrirAba(location.hash.slice(1) || 'dashboard');
});
