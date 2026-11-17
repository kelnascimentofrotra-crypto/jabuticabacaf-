// Postagens (Mural do site): tabela com busca e filtro, situação e destaque mudam na própria lista.
import { esc, ico, field, textarea, select, toggle, formValues, bindCounters, bindErrorClear, confirmDialog, toast, uid, today, formatDate, isUrl } from '../ui.js';
import { pageHead, stateBox, thumb, backBtn, photoBox, bindPhotos, savePhoto, photoFrom, showErrors, busy } from './shared.js';

const STATUS = { publicado: ['Publicada', 'on'], rascunho: ['Rascunho', 'off'] };
const excerpt = (text, max = 90) => {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max).trim()}…` : flat;
};
const query = () => new URLSearchParams(location.hash.split('?')[1] || '');

/* ---------- Lista ---------- */
export async function postagensView(app, root) {
  const state = { status: ['publicado', 'rascunho'].includes(query().get('status')) ? query().get('status') : '', q: '' };

  root.innerHTML = `
    ${pageHead('Postagens', 'Tudo o que aparece no Mural do site. Alterações valem na hora.', `<a class="btn btn-primary" href="#/postagens/nova">${ico('plus')}<span>Nova postagem</span></a>`)}
    <div class="toolbar">
      <label class="search">${ico('search')}<span class="sr-only">Buscar postagem</span><input type="search" placeholder="Buscar pelo título da postagem" data-q></label>
      <label class="select-wrap"><span class="sr-only">Filtrar por situação</span>
        <select data-status>
          <option value="">Todas as situações</option>
          <option value="publicado"${state.status === 'publicado' ? ' selected' : ''}>Publicadas</option>
          <option value="rascunho"${state.status === 'rascunho' ? ' selected' : ''}>Rascunhos</option>
        </select>
      </label>
    </div>
    <div data-list></div>`;

  const listBox = root.querySelector('[data-list]');
  const paint = () => {
    const all = [...app.content.posts.items].sort(
      (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || String(b.date || '').localeCompare(String(a.date || ''))
    );
    const q = state.q.toLowerCase();
    const rows = all.filter((p) => (!state.status || p.status === state.status) && (!q || `${p.title} ${p.text}`.toLowerCase().includes(q)));
    if (!all.length) {
      listBox.innerHTML = `<section class="panel">${stateBox('Nenhuma postagem ainda', 'Escreva sobre novidades, lançamentos, promoções confirmadas ou bastidores da loja. As publicadas aparecem no Mural do site.', `<a class="btn btn-primary" href="#/postagens/nova">${ico('plus')}<span>Escrever a primeira</span></a>`, 'posts')}</section>`;
      return;
    }
    listBox.innerHTML = `
      <section class="panel panel--flush">
        ${
          rows.length
            ? `<table class="table">
            <thead><tr><th>Foto</th><th>Título</th><th>Data</th><th>Situação</th><th>Destaque</th><th class="ta-r">Ações</th></tr></thead>
            <tbody>
              ${rows
                .map((p) => {
                  const [label, kind] = STATUS[p.status] || STATUS.rascunho;
                  return `
                <tr data-id="${esc(p.id)}">
                  <td data-label="Foto">${thumb(app, p.image?.src)}</td>
                  <td class="td-name" data-label="Título"><a href="#/postagens/${esc(p.id)}"><b>${esc(p.title)}</b></a><small>${esc(excerpt(p.text))}</small></td>
                  <td class="td-date" data-label="Data">${formatDate(p.date) || '—'}</td>
                  <td data-label="Situação">
                    <label><span class="sr-only">Situação de ${esc(p.title)}</span>
                      <select class="pill-select pill--${kind}" data-act="status">
                        <option value="publicado"${p.status === 'publicado' ? ' selected' : ''}>Publicada</option>
                        <option value="rascunho"${p.status !== 'publicado' ? ' selected' : ''}>Rascunho</option>
                      </select>
                    </label>
                  </td>
                  <td data-label="Destaque"><button class="star-btn${p.pinned ? ' is-on' : ''}" type="button" data-act="pin" aria-pressed="${Boolean(p.pinned)}" aria-label="${p.pinned ? 'Tirar dos destaques' : 'Fixar em destaque'}: ${esc(p.title)}" title="${p.pinned ? 'Em destaque (aparece primeiro)' : 'Fixar em destaque'}">${ico('star')}</button></td>
                  <td class="td-actions" data-label="Ações">
                    <a class="btn btn-sm" href="#/postagens/${esc(p.id)}">${ico('edit')}<span>Editar</span></a>
                    <button class="btn btn-sm btn-danger-ghost" type="button" data-act="del">${ico('trash')}<span>Excluir</span></button>
                  </td>
                </tr>`;
                })
                .join('')}
            </tbody>
          </table>`
            : stateBox('Nada encontrado', 'Nenhuma postagem com essa busca ou situação.', '', 'search')
        }
      </section>
      <div class="pager"><span>Mostrando ${rows.length} de ${all.length} ${all.length === 1 ? 'postagem' : 'postagens'}</span></div>`;
  };

  root.querySelector('[data-q]').addEventListener('input', (event) => {
    state.q = event.target.value;
    paint();
  });
  root.querySelector('[data-status]').addEventListener('change', (event) => {
    state.status = event.target.value;
    paint();
  });
  listBox.addEventListener('change', async (event) => {
    const sel = event.target.closest('select[data-act="status"]');
    if (!sel) return;
    const id = sel.closest('[data-id]').dataset.id;
    sel.disabled = true;
    await app.publish(
      (c) => {
        c.posts.items.find((p) => p.id === id).status = sel.value;
      },
      { success: sel.value === 'publicado' ? 'Postagem publicada no site.' : 'Postagem tirada do site (virou rascunho).' }
    );
    paint();
    listBox.querySelector(`[data-id="${CSS.escape(id)}"] select`)?.focus();
  });
  listBox.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-act]');
    if (!button) return;
    const id = button.closest('[data-id]').dataset.id;
    const post = app.content.posts.items.find((p) => p.id === id);
    if (button.dataset.act === 'pin') {
      button.disabled = true;
      await app.publish(
        (c) => {
          const item = c.posts.items.find((p) => p.id === id);
          item.pinned = !item.pinned;
        },
        { success: post.pinned ? 'Postagem saiu dos destaques.' : 'Postagem fixada em destaque: aparece primeiro no site.' }
      );
      paint();
      listBox.querySelector(`[data-id="${CSS.escape(id)}"] [data-act="pin"]`)?.focus();
    }
    if (button.dataset.act === 'del') {
      if (!(await confirmDialog({ title: 'Excluir postagem?', text: `“${esc(post.title)}” sai do site. Essa ação não pode ser desfeita.`, confirm: 'Excluir', danger: true }))) return;
      await app.publish(
        (c) => {
          c.posts.items = c.posts.items.filter((p) => p.id !== id);
        },
        { success: 'Postagem excluída.' }
      );
      paint();
      root.querySelector('[data-q]').focus();
    }
  });
  paint();
}

/* ---------- Formulário ---------- */
export async function postagemFormView(app, root, id) {
  const isNew = id === 'nova';
  const existing = isNew ? null : app.content.posts.items.find((p) => p.id === id);
  if (!isNew && !existing) {
    root.innerHTML = `${pageHead('Postagem não encontrada', '', backBtn('#/postagens'))}<section class="panel">${stateBox('Esta postagem não existe mais', 'Ela pode ter sido excluída em outro aparelho.', '<a class="btn btn-primary" href="#/postagens">Ver postagens</a>', 'alert')}</section>`;
    return;
  }
  const post = existing || { status: 'publicado', date: today(), pinned: false, link: {} };
  app.setTitle(isNew ? 'Nova postagem' : post.title);
  const photos = { image: photoFrom(app, post.image) };

  root.innerHTML = `
    ${pageHead(isNew ? 'Nova postagem' : 'Editar postagem', 'Escreva e publique: a postagem entra no Mural do site na hora.', backBtn('#/postagens'))}
    <form class="form" novalidate data-form>
      <div class="form-main">
        <section class="panel">
          <h2 class="panel-title">Conteúdo</h2>
          <div class="grid">
            ${field({ label: 'Título', name: 'title', value: post.title || '', required: true, counter: 90, wide: true, placeholder: 'Ex.: Chegou a coleção de verão' })}
            ${textarea({ label: 'Texto', name: 'text', value: post.text || '', rows: 9, counter: 4000, required: true, placeholder: 'Conte a novidade.', hint: 'Separe os parágrafos com uma linha em branco.' })}
          </div>
        </section>
        <section class="panel">
          <h2 class="panel-title">Foto de capa</h2>
          <div class="grid">
            <div class="col-2">${photoBox('image', 'Foto de capa', photos.image, { ratio: '4 / 3', hint: 'Opcional, mas deixa a postagem bem mais bonita.', tag: 'Capa' })}</div>
            ${field({ label: 'Descrição da foto', name: 'alt', value: post.image?.alt || '', wide: true, placeholder: 'Ex.: Vestidos novos na arara da loja', hint: 'Ajuda quem usa leitor de tela e o Google.' })}
          </div>
        </section>
        <section class="panel">
          <h2 class="panel-title">Botão (opcional)</h2>
          <p class="hint">Para levar a um link: Instagram, catálogo, WhatsApp…</p>
          <div class="grid">
            ${field({ label: 'Link', name: 'linkUrl', value: post.link?.url || '', type: 'url', placeholder: 'https://…' })}
            ${field({ label: 'Texto do botão', name: 'linkLabel', value: post.link?.label || '', placeholder: 'Ex.: Ver no Instagram' })}
          </div>
        </section>
      </div>
      <aside class="form-side">
        <div class="sticky">
          <section class="panel side-stack">
            <h2 class="panel-title">Publicação</h2>
            ${select({ label: 'Situação', name: 'status', value: post.status === 'publicado' ? 'publicado' : 'rascunho', options: [{ value: 'publicado', label: 'Publicada (aparece no site)' }, { value: 'rascunho', label: 'Rascunho (só no painel)' }] })}
            ${field({ label: 'Data', name: 'date', value: post.date || today(), type: 'date' })}
            ${toggle({ label: 'Fixar em <b>destaque</b> (aparece primeiro)', name: 'pinned', checked: Boolean(post.pinned) })}
            <button class="btn btn-primary btn-block btn-lg" type="submit" data-submit><span data-submit-label></span></button>
            ${!isNew ? `<button class="btn btn-danger-ghost btn-block" type="button" data-delete>${ico('trash')}<span>Excluir postagem</span></button>` : ''}
            <p class="meta">As publicadas aparecem no Mural do site, das fixadas para as mais recentes (até 6).</p>
          </section>
        </div>
      </aside>
    </form>`;

  const form = root.querySelector('[data-form]');
  bindCounters(form);
  bindErrorClear(form);
  const submitLabel = form.querySelector('[data-submit-label]');
  const refresh = () => {
    submitLabel.textContent = form.elements.status.value === 'publicado' ? 'PUBLICAR POSTAGEM' : 'SALVAR RASCUNHO';
  };
  form.addEventListener('input', () => {
    app.formDirty = true;
    refresh();
  });
  form.addEventListener('change', refresh);
  bindPhotos(form, photos, {
    onChange: () => {
      app.formDirty = true;
    },
  });
  refresh();

  form.querySelector('[data-delete]')?.addEventListener('click', async () => {
    if (!(await confirmDialog({ title: 'Excluir postagem?', text: `“${esc(post.title)}” sai do site. Essa ação não pode ser desfeita.`, confirm: 'Excluir', danger: true }))) return;
    const ok = await app.publish(
      (c) => {
        c.posts.items = c.posts.items.filter((p) => p.id !== post.id);
      },
      { success: 'Postagem excluída.' }
    );
    if (ok) app.go('#/postagens');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(form);
    const errors = [];
    if (!v.title) errors.push(['title', 'Escreva o título.']);
    if (!v.text) errors.push(['text', 'Escreva o texto da postagem.']);
    if (v.linkUrl && !isUrl(v.linkUrl)) errors.push(['linkUrl', 'O link precisa começar com https://']);
    if (v.linkLabel && !v.linkUrl) errors.push(['linkUrl', 'Coloque o link do botão (ou apague o texto do botão).']);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) errors.push(['date', 'Escolha a data.']);
    if (showErrors(form, errors)) return;

    const button = form.querySelector('[data-submit]');
    busy(button, true, photos.image?.isNew ? 'Enviando a foto…' : 'Publicando…');
    try {
      const image = await savePhoto(photos.image, v.title, 'posts', v.alt);
      const postId = post.id || uid('post');
      const saved = {
        id: postId,
        title: v.title,
        text: v.text,
        status: v.status === 'publicado' ? 'publicado' : 'rascunho',
        date: v.date,
        pinned: Boolean(v.pinned),
        ...(image ? { image } : {}),
        ...(v.linkUrl ? { link: { url: v.linkUrl, label: v.linkLabel || 'Saiba mais' } } : {}),
      };
      const ok = await app.publish(
        (c) => {
          const index = c.posts.items.findIndex((p) => p.id === postId);
          if (index >= 0) c.posts.items[index] = saved;
          else c.posts.items.unshift(saved);
        },
        { success: saved.status === 'publicado' ? 'Postagem publicada! Já está no site.' : 'Rascunho salvo. Ele não aparece no site.' }
      );
      if (ok) app.go('#/postagens');
      else busy(button, false);
    } catch (error) {
      busy(button, false);
      toast(error.message, 'error', 8000);
    }
  });
}
