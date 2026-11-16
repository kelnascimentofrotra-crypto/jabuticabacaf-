import { esc, ico, field, textarea, toggle, formValues, bindCounters, bindErrorClear, confirmDialog, toast, uid, today, formatDate, isUrl } from '../ui.js';
import { pageHead, emptyState, photoBox, bindPhotos, savePhoto, photoFrom, showErrors, busy } from './shared.js';
import { formatPostDate } from '../../src/components/posts.mjs';

const STATUS = { publicado: 'Publicada', rascunho: 'Rascunho' };
const excerpt = (text, max = 120) => {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max).trim()}…` : flat;
};

/* ---------- Lista ---------- */
export async function postagensView(app, root) {
  const state = { filter: 'todas', q: '' };

  const paint = () => {
    const items = [...app.content.posts.items].sort(
      (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || String(b.date || '').localeCompare(String(a.date || ''))
    );
    const q = state.q.toLowerCase();
    const list = items.filter(
      (p) => (state.filter === 'todas' || p.status === state.filter) && (!q || `${p.title} ${p.text}`.toLowerCase().includes(q))
    );
    const count = (f) => items.filter((p) => f === 'todas' || p.status === f).length;
    root.querySelector('[data-filters]').innerHTML = [['todas', 'Todas'], ['publicado', 'Publicadas'], ['rascunho', 'Rascunhos']]
      .map(([key, label]) => `<button class="pill" type="button" data-filter="${key}" aria-pressed="${state.filter === key}">${label} <span>${count(key)}</span></button>`)
      .join('');
    root.querySelector('[data-list]').innerHTML = list.length
      ? list
          .map(
            (p) => `
        <li class="acard" data-id="${esc(p.id)}">
          <a class="acard__media" href="#/postagens/${esc(p.id)}" tabindex="-1" aria-hidden="true">
            ${p.image?.src ? `<img src="${esc(app.imageUrl(p.image.src))}" alt="" loading="lazy">` : '<span class="acard__placeholder">S</span>'}
            <span class="chip chip--${p.status === 'publicado' ? 'on' : 'off'} acard__chip">${STATUS[p.status] || 'Rascunho'}</span>
            ${p.pinned ? `<span class="acard__pin" title="Em destaque">${ico('star')}</span>` : ''}
          </a>
          <div class="acard__body">
            <p class="acard__meta">${formatDate(p.date) || 'Sem data'}</p>
            <h3 class="acard__title"><a href="#/postagens/${esc(p.id)}">${esc(p.title)}</a></h3>
            <p class="acard__text">${esc(excerpt(p.text))}</p>
            <div class="acard__actions">
              <a class="btn btn--line btn--sm" href="#/postagens/${esc(p.id)}">${ico('edit')}<span>Editar</span></a>
              <button class="btn btn--ghost btn--sm" type="button" data-act="toggle">${p.status === 'publicado' ? 'Tirar do site' : 'Publicar'}</button>
              <button class="icon-btn icon-btn--danger" type="button" data-act="del" aria-label="Excluir ${esc(p.title)}">${ico('trash')}</button>
            </div>
          </div>
        </li>`
          )
          .join('')
      : `<li class="acard-empty">${
          items.length
            ? '<p class="muted">Nenhuma postagem neste filtro.</p>'
            : emptyState('Nenhuma postagem ainda', 'Escreva sobre novidades, lançamentos, promoções confirmadas ou bastidores da loja. As postagens publicadas aparecem no Mural do site.', `<a class="btn btn--wine" href="#/postagens/nova">${ico('plus')}<span>Escrever a primeira</span></a>`)
        }</li>`;
  };

  root.innerHTML = `
  ${pageHead({
    eyebrow: 'Mural da SMUG',
    plain: 'Suas',
    italic: 'postagens',
    text: 'Publique novidades e avisos. As publicadas aparecem no site, na seção “Mural”.',
    actions: `<a class="btn btn--wine" href="#/postagens/nova">${ico('plus')}<span>Nova postagem</span></a>`,
  })}
  <div class="container page-body">
    <div class="toolbar">
      <div class="pills" role="group" aria-label="Filtrar postagens" data-filters></div>
      <label class="search">${ico('search')}<span class="sr-only">Buscar postagem</span><input type="search" placeholder="Buscar postagem" data-q></label>
    </div>
    <ul class="acards" data-list aria-label="Postagens"></ul>
  </div>`;

  root.querySelector('[data-filters]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    state.filter = button.dataset.filter;
    paint();
  });
  root.querySelector('[data-q]').addEventListener('input', (event) => {
    state.q = event.target.value;
    paint();
  });
  root.querySelector('[data-list]').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-act]');
    if (!button) return;
    const id = button.closest('[data-id]').dataset.id;
    const post = app.content.posts.items.find((p) => p.id === id);
    if (button.dataset.act === 'toggle') {
      const next = post.status === 'publicado' ? 'rascunho' : 'publicado';
      busy(button, true, next === 'publicado' ? 'Publicando…' : 'Tirando…');
      const ok = await app.publish(
        (c) => {
          c.posts.items.find((p) => p.id === id).status = next;
        },
        { success: next === 'publicado' ? 'Postagem publicada no site.' : 'Postagem retirada do site (virou rascunho).' }
      );
      if (!ok) busy(button, false);
      paint();
      root.querySelector(`[data-id="${CSS.escape(id)}"] [data-act="toggle"]`)?.focus();
    }
    if (button.dataset.act === 'del') {
      if (!(await confirmDialog({ title: `Excluir “${post.title}”?`, text: 'A postagem sai do site e não pode ser recuperada.', confirm: 'Excluir', danger: true }))) return;
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
  setTimeout(() => root.querySelector('[data-list]')?.classList.add('is-static'), 900);
}

/* ---------- Formulário ---------- */
export async function postagemFormView(app, root, id) {
  const isNew = id === 'nova';
  const existing = isNew ? null : app.content.posts.items.find((p) => p.id === id);
  if (!isNew && !existing) {
    root.innerHTML = `<div class="container page-body">${emptyState('Postagem não encontrada', 'Ela pode ter sido excluída em outro aparelho.', '<a class="btn btn--wine" href="#/postagens">Voltar às postagens</a>')}</div>`;
    return;
  }
  const post = existing || { status: 'publicado', date: today(), pinned: false, link: {} };
  app.setTitle(isNew ? 'Nova postagem' : post.title);
  const photos = { image: photoFrom(app, post.image) };

  root.innerHTML = `
  <div class="container page-body page-body--form">
    <a class="back" href="#/postagens">${ico('back')}Postagens</a>
    <header class="form-head">
      <p class="eyebrow eyebrow--line">Mural da SMUG</p>
      <h1 class="form-head__title">${isNew ? 'Nova <em>postagem</em>' : 'Editar <em>postagem</em>'}</h1>
    </header>
    <form class="editor" novalidate data-form>
      <div class="editor__main">
        <section class="panel">
          <div class="fields">
            ${field({ label: 'Título', name: 'title', value: post.title || '', required: true, counter: 90, wide: true, placeholder: 'Ex.: Chegou a coleção de verão' })}
            ${textarea({ label: 'Texto', name: 'text', value: post.text || '', rows: 9, counter: 4000, required: true, hint: 'Separe os parágrafos com uma linha em branco.' })}
          </div>
        </section>
        <section class="panel">
          <h2 class="panel__title">Botão (opcional)</h2>
          <p class="muted small">Para levar a um link: Instagram, catálogo, WhatsApp…</p>
          <div class="fields">
            ${field({ label: 'Link', name: 'linkUrl', value: post.link?.url || '', type: 'url', placeholder: 'https://…' })}
            ${field({ label: 'Texto do botão', name: 'linkLabel', value: post.link?.label || '', placeholder: 'Ex.: Ver no Instagram' })}
          </div>
        </section>
        <section class="panel panel--preview" aria-label="Prévia no site">
          <h2 class="panel__title">Prévia no site</h2>
          <div class="preview-post" data-preview-card></div>
        </section>
      </div>
      <aside class="editor__side">
        <section class="panel">
          <h2 class="panel__title">Publicação</h2>
          <fieldset class="field field--wide">
            <legend>Status</legend>
            <div class="segmented">
              <label><input type="radio" name="status" value="publicado"${post.status === 'publicado' ? ' checked' : ''}><span>Publicada</span></label>
              <label><input type="radio" name="status" value="rascunho"${post.status !== 'publicado' ? ' checked' : ''}><span>Rascunho</span></label>
            </div>
            <p class="hint">Rascunhos ficam só no painel.</p>
          </fieldset>
          ${field({ label: 'Data', name: 'date', value: post.date || today(), type: 'date', wide: true })}
          ${toggle({ label: 'Fixar em destaque (aparece primeiro)', name: 'pinned', checked: Boolean(post.pinned) })}
        </section>
        <section class="panel">
          ${photoBox('image', 'Foto de capa', photos.image, { ratio: '4 / 3.4', hint: 'Opcional, mas deixa a postagem bem mais bonita.' })}
          ${field({ label: 'Descrição da foto', name: 'alt', value: post.image?.alt || '', wide: true, placeholder: 'Ex.: Vestidos novos na arara da loja' })}
        </section>
      </aside>
      <div class="form-bar">
        ${!isNew ? `<button class="btn btn--ghost btn--danger" type="button" data-delete>${ico('trash')}<span>Excluir</span></button>` : ''}
        <span class="form-bar__spacer"></span>
        <a class="btn btn--ghost" href="#/postagens">Cancelar</a>
        <button class="btn btn--wine" type="submit" data-submit>${ico('check')}<span data-submit-label></span></button>
      </div>
    </form>
  </div>`;

  const form = root.querySelector('[data-form]');
  bindCounters(form);
  bindErrorClear(form);
  const submitLabel = form.querySelector('[data-submit-label]');
  const previewBox = form.querySelector('[data-preview-card]');

  const refresh = () => {
    const v = formValues(form);
    submitLabel.textContent = v.status === 'publicado' ? 'Publicar no site' : 'Salvar rascunho';
    const image = photos.image?.url;
    previewBox.innerHTML = `
      <article class="post__card">
        <div class="post__media">${image ? `<img class="post__img" src="${esc(image)}" alt="">` : '<span class="post__placeholder" aria-hidden="true">S</span>'}${v.pinned ? '<span class="post__badge">Destaque</span>' : ''}</div>
        <div class="post__body">
          <time class="post__date">${formatPostDate(v.date)}</time>
          <h3 class="post__title">${esc(v.title || 'Título da postagem')}</h3>
          <p class="post__excerpt">${esc(excerpt(v.text, 150) || 'O começo do texto aparece aqui.')}</p>
          <span class="post__more">Ler postagem</span>
        </div>
      </article>`;
  };
  form.addEventListener('input', () => {
    app.formDirty = true;
    refresh();
  });
  bindPhotos(form, photos, {
    onChange: () => {
      app.formDirty = true;
      refresh();
    },
  });
  refresh();

  form.querySelector('[data-delete]')?.addEventListener('click', async () => {
    if (!(await confirmDialog({ title: `Excluir “${post.title}”?`, text: 'A postagem sai do site e não pode ser recuperada.', confirm: 'Excluir', danger: true }))) return;
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
    if (!v.title) errors.push(['title', 'Dê um título para a postagem.']);
    if (!v.text) errors.push(['text', 'Escreva o texto da postagem.']);
    if (v.linkUrl && !isUrl(v.linkUrl)) errors.push(['linkUrl', 'O link precisa começar com https://']);
    if (v.linkLabel && !v.linkUrl) errors.push(['linkUrl', 'Informe o link do botão.']);
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
        date: v.date || today(),
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
        { success: saved.status === 'publicado' ? 'Postagem publicada! Já está no site.' : 'Rascunho salvo (não aparece no site).' }
      );
      if (ok) app.go('#/postagens');
      else busy(button, false);
    } catch (error) {
      busy(button, false);
      toast(error.message, 'error', 8000);
    }
  });
}
