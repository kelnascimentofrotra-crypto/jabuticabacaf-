import { esc, ico, money, parseMoney, moneyInput, field, textarea, select, uid, slugify, list, toast, confirmDialog, formValues, bindCounters, bindErrorClear, isUrl } from '../ui.js';
import { processImage } from '../images.js';

export const PRODUCT_STATUS = {
  disponivel: 'Disponível',
  esgotado: 'Esgotado',
  oculto: 'Oculto',
};
const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];

const categoryOptions = (app) => [
  { value: '', label: 'Sem categoria' },
  ...app.content.categories.items.map((c) => ({ value: c.name, label: c.name })),
];

/* ---------- Lista ---------- */
export async function productsView(app, root) {
  const state = { q: '', status: '', category: '' };

  const paint = () => {
    const items = app.content.products.items;
    const q = state.q.toLowerCase();
    const filtered = items.filter(
      (p) =>
        (!q || `${p.name} ${p.description || ''} ${(p.colors || []).join(' ')}`.toLowerCase().includes(q)) &&
        (!state.status || p.status === state.status) &&
        (!state.category || p.category === state.category)
    );
    root.querySelector('[data-list]').innerHTML = filtered.length
      ? filtered
          .map((p) => {
            const index = items.indexOf(p);
            return `
        <li class="pcard" data-id="${esc(p.id)}">
          <a class="pcard__thumb" href="#/produtos/${esc(p.id)}" tabindex="-1" aria-hidden="true">
            ${p.image?.src ? `<img ${app.imgAttrs(p.image.src)} alt="" loading="lazy">` : ico('image')}
          </a>
          <div class="pcard__info">
            <a class="pcard__name" href="#/produtos/${esc(p.id)}">${esc(p.name)}</a>
            <p class="pcard__meta">${[Number.isFinite(p.price) ? money(p.price) : 'Sem preço', p.category, (p.sizes || []).join(' · ')].filter(Boolean).map(esc).join(' — ')}</p>
            <label class="pcard__status">
              <span class="sr-only">Status de ${esc(p.name)}</span>
              <select data-act="status" class="status-select status--${esc(p.status)}">
                ${Object.entries(PRODUCT_STATUS).map(([v, l]) => `<option value="${v}"${p.status === v ? ' selected' : ''}>${l}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="pcard__actions">
            <button class="icon-btn" type="button" data-act="up" aria-label="Mover ${esc(p.name)} para cima"${index === 0 ? ' disabled' : ''}>${ico('up')}</button>
            <button class="icon-btn" type="button" data-act="down" aria-label="Mover ${esc(p.name)} para baixo"${index === items.length - 1 ? ' disabled' : ''}>${ico('down')}</button>
            <button class="icon-btn" type="button" data-act="dup" aria-label="Duplicar ${esc(p.name)}">${ico('copy')}</button>
            <a class="icon-btn" href="#/produtos/${esc(p.id)}" aria-label="Editar ${esc(p.name)}">${ico('edit')}</a>
            <button class="icon-btn icon-btn--danger" type="button" data-act="del" aria-label="Excluir ${esc(p.name)}">${ico('trash')}</button>
          </div>
        </li>`;
          })
          .join('')
      : `<li class="empty empty--inline">${
          items.length
            ? 'Nenhum produto encontrado com esses filtros.'
            : '<h3>Nenhum produto cadastrado</h3><p>Cadastre a primeira peça. A vitrine “Escolhas da semana” aparece no site assim que houver produtos visíveis e você publicar.</p><a class="btn btn--primary" href="#/produtos/novo">' + ico('plus') + 'Cadastrar produto</a>'
        }</li>`;
    root.querySelector('[data-count]').textContent = `${items.length} produto(s) · ${items.filter((p) => p.status !== 'oculto').length} visível(is) no site`;
  };

  root.innerHTML = `
  <section class="page-head">
    <div>
      <p class="eyebrow">Vitrine do site</p>
      <h2 class="page-title">Produtos</h2>
      <p class="muted" data-count></p>
    </div>
    <div class="page-actions"><a class="btn btn--primary" href="#/produtos/novo">${ico('plus')}Novo produto</a></div>
  </section>
  <div class="toolbar">
    <label class="search">${ico('search')}<span class="sr-only">Buscar produto</span><input type="search" placeholder="Buscar por nome, cor…" data-filter="q"></label>
    <label><span class="sr-only">Filtrar por status</span>
      <select data-filter="status"><option value="">Todos os status</option>${Object.entries(PRODUCT_STATUS).map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
    </label>
    <label><span class="sr-only">Filtrar por categoria</span>
      <select data-filter="category"><option value="">Todas as categorias</option>${app.content.categories.items.map((c) => `<option>${esc(c.name)}</option>`).join('')}</select>
    </label>
  </div>
  <ul class="pcards" data-list aria-label="Produtos"></ul>`;

  root.querySelectorAll('[data-filter]').forEach((el) =>
    el.addEventListener('input', () => {
      state[el.dataset.filter] = el.value;
      paint();
    })
  );

  root.querySelector('[data-list]').addEventListener('click', async (event) => {
    const btn = event.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.closest('[data-id]').dataset.id;
    const items = app.content.products.items;
    const index = items.findIndex((p) => p.id === id);
    const product = items[index];
    if (btn.dataset.act === 'up' || btn.dataset.act === 'down') {
      const to = index + (btn.dataset.act === 'up' ? -1 : 1);
      app.update((c) => c.products.items.splice(to, 0, ...c.products.items.splice(index, 1)));
      paint();
      root.querySelector(`[data-id="${CSS.escape(id)}"] [data-act="${btn.dataset.act}"]:not(:disabled)`)?.focus();
    }
    if (btn.dataset.act === 'dup') {
      const copy = { ...structuredClone(product), id: uid('p'), name: `${product.name} (cópia)`, status: 'oculto' };
      app.update((c) => c.products.items.splice(index + 1, 0, copy));
      toast('Cópia criada como “Oculto”. Edite e mude o status quando estiver pronta.');
      paint();
    }
    if (btn.dataset.act === 'del') {
      const ok = await confirmDialog({ title: `Excluir “${product.name}”?`, text: 'O produto sai do site na próxima publicação.', confirm: 'Excluir', danger: true });
      if (!ok) return;
      app.update((c) => c.products.items.splice(index, 1));
      toast('Produto excluído do rascunho.');
      paint();
    }
  });
  root.querySelector('[data-list]').addEventListener('change', (event) => {
    const sel = event.target.closest('select[data-act="status"]');
    if (!sel) return;
    const id = sel.closest('[data-id]').dataset.id;
    app.update((c) => {
      c.products.items.find((p) => p.id === id).status = sel.value;
    });
    sel.className = `status-select status--${sel.value}`;
    toast(`Status alterado para “${PRODUCT_STATUS[sel.value]}”.`);
    paint();
  });

  paint();
}

/* ---------- Formulário ---------- */
const photoBox = (name, label, photo, required) => `
  <div class="photo-field" data-photo="${name}">
    <p class="photo-field__label">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</p>
    <div class="photo-field__preview" data-preview>
      ${photo ? `<img ${photo.attrs || `src="${esc(photo.url)}"`} alt="">` : `<span class="photo-field__empty">${ico('image')}<span>Sem foto</span></span>`}
    </div>
    <div class="photo-field__actions">
      <label class="btn btn--ghost btn--sm file-btn">${ico('upload')}<span>${photo ? 'Trocar foto' : 'Escolher foto'}</span>
        <input type="file" accept="image/*" data-file="${name}" class="sr-only">
      </label>
      ${!required ? `<button class="btn btn--ghost btn--sm" type="button" data-remove-photo="${name}"${photo ? '' : ' hidden'}>Remover</button>` : ''}
    </div>
    <p class="hint" data-photo-status="${name}">${photo?.width ? `${photo.width}×${photo.height} px` : 'JPG, PNG ou WebP. A foto é otimizada automaticamente.'}</p>
  </div>`;

export async function productFormView(app, root, id) {
  const isNew = id === 'novo';
  const existing = isNew ? null : app.content.products.items.find((p) => p.id === id);
  if (!isNew && !existing) {
    root.innerHTML = `<div class="empty"><h2>Produto não encontrado</h2><a class="btn btn--primary" href="#/produtos">Voltar aos produtos</a></div>`;
    return;
  }
  app.setTitle(isNew ? 'Novo produto' : existing.name);
  const p = existing || { status: 'disponivel', sizes: [], colors: [] };

  // Fotos: as atuais (já no site ou pendentes) e as novas escolhidas neste formulário
  const photos = {
    image: p.image?.src ? { src: p.image.src, attrs: app.imgAttrs(p.image.src), width: p.image.width, height: p.image.height } : null,
    imageHover: p.imageHover?.src ? { src: p.imageHover.src, attrs: app.imgAttrs(p.imageHover.src), width: p.imageHover.width, height: p.imageHover.height } : null,
  };
  const extraSizes = (p.sizes || []).filter((s) => !SIZES.includes(s));

  root.innerHTML = `
  <a class="back" href="#/produtos">${ico('back')}Produtos</a>
  <form class="form-layout" novalidate data-form>
    <div class="card form-main">
      <h2 class="card__title">${isNew ? 'Cadastrar produto' : 'Editar produto'}</h2>
      <div class="fields">
        ${field({ label: 'Nome da peça', name: 'name', value: p.name || '', required: true, counter: 80, wide: true, placeholder: 'Ex.: Vestido midi vinho' })}
        ${field({ label: 'Preço (R$)', name: 'price', value: moneyInput(p.price), extra: { inputmode: 'decimal' }, placeholder: '0,00', hint: 'Em branco, o preço não aparece no site.' })}
        ${select({ label: 'Categoria', name: 'category', value: p.category || '', options: categoryOptions(app) })}
        ${textarea({ label: 'Descrição curta', name: 'description', value: p.description || '', rows: 2, counter: 160, hint: 'Opcional. Tecido, caimento, ocasião…' })}
        ${field({ label: 'Cores', name: 'colors', value: (p.colors || []).join(', '), wide: true, placeholder: 'Ex.: Vinho, Off-white', hint: 'Separe por vírgula.' })}
        <fieldset class="field field--wide chips-field">
          <legend>Tamanhos</legend>
          <div class="chips">
            ${SIZES.map((s) => `<label class="chip-check"><input type="checkbox" name="size" value="${s}"${(p.sizes || []).includes(s) ? ' checked' : ''}><span>${s}</span></label>`).join('')}
          </div>
          <input type="text" name="extraSizes" value="${esc(extraSizes.join(', '))}" placeholder="Outros: 36, 38, 40…" aria-label="Outros tamanhos">
        </fieldset>
        <fieldset class="field field--wide">
          <legend>Status no site</legend>
          <div class="segmented">
            ${Object.entries(PRODUCT_STATUS)
              .map(([v, l]) => `<label><input type="radio" name="status" value="${v}"${p.status === v ? ' checked' : ''}><span>${l}</span></label>`)
              .join('')}
          </div>
          <p class="hint">Esgotado aparece com selo e botão “Consultar reposição”. Oculto não aparece no site.</p>
        </fieldset>
        ${field({ label: 'Link da peça (opcional)', name: 'url', value: p.url || '', type: 'url', wide: true, placeholder: 'https://…', hint: 'Se houver uma página da peça (loja virtual, catálogo). Sem link, o botão abre o WhatsApp da loja com o nome da peça.' })}
        ${field({ label: 'Descrição da foto (acessibilidade)', name: 'alt', value: p.image?.alt || '', wide: true, placeholder: 'Ex.: Vestido midi vinho com alças finas', hint: 'Lida por leitores de tela. Em branco, usamos o nome da peça.' })}
      </div>
    </div>

    <div class="card form-side">
      ${photoBox('image', 'Foto principal', photos.image, true)}
      ${photoBox('imageHover', 'Segunda foto (opcional)', photos.imageHover, false)}
      <p class="hint">A segunda foto aparece ao passar o mouse. Use outra foto da <strong>mesma peça</strong>.</p>
    </div>

    <div class="form-bar">
      ${!isNew ? `<button class="btn btn--ghost btn--danger-text" type="button" data-delete>${ico('trash')}Excluir</button>` : ''}
      <span class="form-bar__spacer"></span>
      <a class="btn btn--ghost" href="#/produtos">Cancelar</a>
      <button class="btn btn--primary" type="submit">${ico('check')}Salvar produto</button>
    </div>
  </form>`;

  const form = root.querySelector('[data-form]');
  bindCounters(form);
  bindErrorClear(form);
  form.addEventListener('input', () => {
    app.formDirty = true;
  });

  // Fotos
  form.querySelectorAll('[data-file]').forEach((input) =>
    input.addEventListener('change', async () => {
      const name = input.dataset.file;
      const file = input.files[0];
      if (!file) return;
      const status = form.querySelector(`[data-photo-status="${name}"]`);
      status.textContent = 'Otimizando a foto…';
      try {
        const image = await processImage(file);
        photos[name] = { ...image, url: image.dataUrl, isNew: true };
        const box = form.querySelector(`[data-photo="${name}"]`);
        box.querySelector('[data-preview]').innerHTML = `<img src="${image.dataUrl}" alt="">`;
        box.querySelector('.file-btn span').textContent = 'Trocar foto';
        const remove = box.querySelector('[data-remove-photo]');
        if (remove) remove.hidden = false;
        status.textContent = `${image.width}×${image.height} px · ${Math.round(image.bytes / 1024)} KB`;
        app.formDirty = true;
      } catch (error) {
        status.textContent = error.message;
        toast(error.message, 'error');
      } finally {
        input.value = '';
      }
    })
  );
  form.querySelectorAll('[data-remove-photo]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const name = btn.dataset.removePhoto;
      photos[name] = null;
      const box = form.querySelector(`[data-photo="${name}"]`);
      box.querySelector('[data-preview]').innerHTML = `<span class="photo-field__empty">${ico('image')}<span>Sem foto</span></span>`;
      box.querySelector('.file-btn span').textContent = 'Escolher foto';
      btn.hidden = true;
      app.formDirty = true;
    })
  );

  form.querySelector('[data-delete]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({ title: `Excluir “${p.name}”?`, text: 'O produto sai do site na próxima publicação.', confirm: 'Excluir', danger: true });
    if (!ok) return;
    app.update((c) => {
      c.products.items = c.products.items.filter((item) => item.id !== p.id);
    });
    app.formDirty = false;
    toast('Produto excluído do rascunho.');
    app.go('#/produtos');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const v = formValues(form);
    const errors = [];
    if (!v.name) errors.push(['name', 'Informe o nome da peça.']);
    const price = parseMoney(v.price);
    if (v.price && price === null) errors.push(['price', 'Preço inválido. Use o formato 189,90.']);
    if (v.url && !isUrl(v.url)) errors.push(['url', 'O link precisa começar com https://']);
    if (!photos.image) errors.push(['image', 'Escolha a foto principal.']);
    form.querySelectorAll('.field-error').forEach((e) => e.remove());
    form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
    if (errors.length) {
      for (const [name, message] of errors) {
        const input = form.querySelector(`[name="${name}"]`);
        const target = input ? input.closest('.field') : form.querySelector(`[data-photo="${name}"]`);
        input?.setAttribute('aria-invalid', 'true');
        target.insertAdjacentHTML('beforeend', `<p class="field-error" role="alert">${esc(message)}</p>`);
      }
      (form.querySelector('[aria-invalid="true"]') || form.querySelector('[data-photo="image"] input')).focus();
      toast('Revise os campos destacados.', 'error');
      return;
    }

    const productId = p.id || uid('p');
    const storePhoto = (key) => {
      const photo = photos[key];
      if (!photo) return undefined;
      if (!photo.isNew) return { src: photo.src, width: photo.width, height: photo.height };
      const path = `assets/img/produtos/${slugify(v.name)}-${Date.now().toString(36)}${key === 'imageHover' ? '-2' : ''}.${photo.ext}`;
      app.addUpload(path, { dataUrl: photo.dataUrl, width: photo.width, height: photo.height });
      return { src: path, width: photo.width, height: photo.height };
    };
    const image = { ...storePhoto('image'), alt: v.alt || '' };
    const imageHover = storePhoto('imageHover');
    const sizes = [...form.querySelectorAll('[name="size"]:checked')].map((i) => i.value).concat(list(v.extraSizes));
    const product = {
      id: productId,
      name: v.name,
      price,
      category: v.category,
      description: v.description,
      colors: list(v.colors),
      sizes: [...new Set(sizes)],
      status: v.status || 'disponivel',
      url: v.url,
      image,
      ...(imageHover ? { imageHover } : {}),
    };
    app.update((c) => {
      const index = c.products.items.findIndex((item) => item.id === productId);
      if (index >= 0) c.products.items[index] = product;
      else c.products.items.unshift(product);
    });
    app.formDirty = false;
    toast(isNew ? 'Produto cadastrado. Publique para ele aparecer no site.' : 'Produto atualizado. Publique para aplicar no site.', 'success');
    app.go('#/produtos');
  });
}
