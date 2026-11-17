// Produtos (vitrine "Escolhas da semana"): tabela com busca e filtros, situação muda na própria lista.
import { esc, ico, money, parseMoney, moneyInput, field, textarea, select, formValues, bindCounters, bindErrorClear, confirmDialog, toast, uid, list, isUrl } from '../ui.js';
import { pageHead, stateBox, thumb, backBtn, photoBox, bindPhotos, savePhoto, photoFrom, showErrors, busy } from './shared.js';

export const PRODUCT_STATUS = { disponivel: ['Disponível', 'on'], esgotado: ['Esgotado', 'warn'], oculto: ['Oculto', 'off'] };
const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
const query = () => new URLSearchParams(location.hash.split('?')[1] || '');

/* ---------- Lista ---------- */
export async function produtosView(app, root) {
  const state = { status: PRODUCT_STATUS[query().get('status')] ? query().get('status') : '', category: '', q: '' };

  root.innerHTML = `
    ${pageHead('Produtos', 'A vitrine “Escolhas da semana” do site. Alterações valem na hora.', `<a class="btn" href="#/produtos/categorias">${ico('grid')}<span>Categorias</span></a><a class="btn btn-primary" href="#/produtos/novo">${ico('plus')}<span>Adicionar produto</span></a>`)}
    <div class="toolbar">
      <label class="search">${ico('search')}<span class="sr-only">Buscar produto</span><input type="search" placeholder="Buscar pelo nome, cor…" data-q></label>
      <label class="select-wrap"><span class="sr-only">Filtrar por situação</span>
        <select data-status>
          <option value="">Todas as situações</option>
          ${Object.entries(PRODUCT_STATUS).map(([v, [l]]) => `<option value="${v}"${state.status === v ? ' selected' : ''}>${l}s</option>`).join('')}
        </select>
      </label>
      <label class="select-wrap"><span class="sr-only">Filtrar por categoria</span>
        <select data-category><option value="">Todas as categorias</option>${app.content.categories.items.map((c) => `<option>${esc(c.name)}</option>`).join('')}</select>
      </label>
    </div>
    <div data-list></div>`;

  const listBox = root.querySelector('[data-list]');
  const paint = () => {
    const all = app.content.products.items;
    const q = state.q.toLowerCase();
    const rows = all.filter(
      (p) =>
        (!state.status || p.status === state.status) &&
        (!state.category || p.category === state.category) &&
        (!q || `${p.name} ${p.description || ''} ${(p.colors || []).join(' ')}`.toLowerCase().includes(q))
    );
    if (!all.length) {
      listBox.innerHTML = `<section class="panel">${stateBox('Nenhum produto cadastrado', 'Cadastre as peças da loja. As disponíveis e esgotadas aparecem na vitrine do site; as ocultas ficam só aqui.', `<a class="btn btn-primary" href="#/produtos/novo">${ico('plus')}<span>Adicionar produto</span></a>`, 'hanger')}</section>`;
      return;
    }
    listBox.innerHTML = `
      <section class="panel panel--flush">
        ${
          rows.length
            ? `<table class="table">
            <thead><tr><th>Foto</th><th>Nome</th><th>Preço</th><th>Categoria</th><th>Situação</th><th class="ta-r">Ações</th></tr></thead>
            <tbody>
              ${rows
                .map((p) => {
                  const [, kind] = PRODUCT_STATUS[p.status] || PRODUCT_STATUS.oculto;
                  const sizes = (p.sizes || []).join(' · ');
                  return `
                <tr data-id="${esc(p.id)}">
                  <td data-label="Foto">${thumb(app, p.image?.src, { tall: true })}</td>
                  <td class="td-name" data-label="Nome"><a href="#/produtos/${esc(p.id)}"><b>${esc(p.name)}</b></a><small>${esc(sizes || p.description || (p.colors || []).join(', ') || '—')}</small></td>
                  <td class="td-num" data-label="Preço">${Number.isFinite(p.price) ? money(p.price) : '<span class="muted">Sem preço</span>'}</td>
                  <td data-label="Categoria">${esc(p.category || '—')}</td>
                  <td data-label="Situação">
                    <label><span class="sr-only">Situação de ${esc(p.name)}</span>
                      <select class="pill-select pill--${kind}" data-act="status">
                        ${Object.entries(PRODUCT_STATUS).map(([v, [l]]) => `<option value="${v}"${p.status === v ? ' selected' : ''}>${l}</option>`).join('')}
                      </select>
                    </label>
                  </td>
                  <td class="td-actions" data-label="Ações">
                    <a class="btn btn-sm" href="#/produtos/${esc(p.id)}">${ico('edit')}<span>Editar</span></a>
                    <button class="btn btn-sm btn-danger-ghost" type="button" data-act="del">${ico('trash')}<span>Excluir</span></button>
                  </td>
                </tr>`;
                })
                .join('')}
            </tbody>
          </table>`
            : stateBox('Nada encontrado', 'Nenhum produto com essa busca ou filtro.', '', 'search')
        }
      </section>
      <div class="pager"><span>Mostrando ${rows.length} de ${all.length} ${all.length === 1 ? 'produto' : 'produtos'}</span></div>`;
  };

  root.querySelector('[data-q]').addEventListener('input', (event) => {
    state.q = event.target.value;
    paint();
  });
  root.querySelector('[data-status]').addEventListener('change', (event) => {
    state.status = event.target.value;
    paint();
  });
  root.querySelector('[data-category]').addEventListener('change', (event) => {
    state.category = event.target.value;
    paint();
  });
  listBox.addEventListener('change', async (event) => {
    const sel = event.target.closest('select[data-act="status"]');
    if (!sel) return;
    const id = sel.closest('[data-id]').dataset.id;
    sel.disabled = true;
    await app.publish(
      (c) => {
        c.products.items.find((p) => p.id === id).status = sel.value;
      },
      { success: `Agora: “${PRODUCT_STATUS[sel.value][0]}”. O site já foi atualizado.` }
    );
    paint();
    listBox.querySelector(`[data-id="${CSS.escape(id)}"] select`)?.focus();
  });
  listBox.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-act="del"]');
    if (!button) return;
    const id = button.closest('[data-id]').dataset.id;
    const product = app.content.products.items.find((p) => p.id === id);
    if (!(await confirmDialog({ title: 'Excluir produto?', text: `“${esc(product.name)}” sai do site. Essa ação não pode ser desfeita.`, confirm: 'Excluir', danger: true }))) return;
    await app.publish(
      (c) => {
        c.products.items = c.products.items.filter((p) => p.id !== id);
      },
      { success: 'Produto excluído.' }
    );
    paint();
    root.querySelector('[data-q]').focus();
  });
  paint();
}

/* ---------- Formulário ---------- */
export async function produtoFormView(app, root, id) {
  const isNew = id === 'novo';
  const existing = isNew ? null : app.content.products.items.find((p) => p.id === id);
  if (!isNew && !existing) {
    root.innerHTML = `${pageHead('Produto não encontrado', '', backBtn('#/produtos'))}<section class="panel">${stateBox('Este produto não existe mais', 'Ele pode ter sido excluído em outro aparelho.', '<a class="btn btn-primary" href="#/produtos">Ver produtos</a>', 'alert')}</section>`;
    return;
  }
  const p = existing || { status: 'disponivel', sizes: [], colors: [] };
  app.setTitle(isNew ? 'Novo produto' : p.name);
  const photos = { image: photoFrom(app, p.image), imageHover: photoFrom(app, p.imageHover) };
  const extraSizes = (p.sizes || []).filter((s) => !SIZES.includes(s));
  const categoryOptions = [{ value: '', label: 'Sem categoria' }, ...app.content.categories.items.map((c) => ({ value: c.name, label: c.name }))];

  root.innerHTML = `
    ${pageHead(isNew ? 'Novo produto' : 'Editar produto', 'Preencha os dados e publique: o produto entra na vitrine do site na hora.', backBtn('#/produtos'))}
    <form class="form" novalidate data-form>
      <div class="form-main">
        <section class="panel">
          <h2 class="panel-title">Informações principais</h2>
          <div class="grid">
            ${field({ label: 'Nome da peça', name: 'name', value: p.name || '', required: true, counter: 80, wide: true, placeholder: 'Ex.: Vestido midi vinho' })}
            ${field({ label: 'Preço', name: 'price', value: moneyInput(p.price), extra: { inputmode: 'decimal' }, placeholder: '0,00', hint: 'Em branco, o preço não aparece no site.', money: true })}
            ${select({ label: 'Categoria', name: 'category', value: p.category || '', options: categoryOptions })}
            ${textarea({ label: 'Descrição curta', name: 'description', value: p.description || '', rows: 3, counter: 160, placeholder: 'Tecido, caimento, ocasião…' })}
            ${field({ label: 'Cores', name: 'colors', value: (p.colors || []).join(', '), wide: true, placeholder: 'Ex.: Vinho, Off-white', hint: 'Separe por vírgula.' })}
            <fieldset class="field col-2">
              <legend>Tamanhos</legend>
              <div class="chips">
                ${SIZES.map((s) => `<label class="chip-check"><input type="checkbox" name="size" value="${s}"${(p.sizes || []).includes(s) ? ' checked' : ''}><span>${s}</span></label>`).join('')}
              </div>
              <input type="text" name="extraSizes" value="${esc(extraSizes.join(', '))}" placeholder="Outros: 36, 38, 40…" aria-label="Outros tamanhos">
            </fieldset>
            ${field({ label: 'Link da peça (opcional)', name: 'url', value: p.url || '', type: 'url', wide: true, placeholder: 'https://…', hint: 'Sem link, o botão “Quero esta peça” abre o WhatsApp da loja com o nome da peça.' })}
          </div>
        </section>
        <section class="panel">
          <h2 class="panel-title">Fotos</h2>
          <div class="photo-slots">
            ${photoBox('image', 'Foto principal', photos.image, { required: true, ratio: '3 / 4', tag: 'Principal' })}
            ${photoBox('imageHover', 'Segunda foto', photos.imageHover, { ratio: '3 / 4', hint: 'Opcional. Aparece ao passar o mouse.' })}
          </div>
          <div class="grid" style="margin-top:16px">
            ${field({ label: 'Descrição da foto', name: 'alt', value: p.image?.alt || '', wide: true, placeholder: 'Ex.: Vestido midi vinho de alças finas' })}
          </div>
        </section>
      </div>
      <aside class="form-side">
        <div class="sticky">
          <section class="panel side-stack">
            <h2 class="panel-title">Publicação</h2>
            ${select({ label: 'Situação no site', name: 'status', value: p.status || 'disponivel', options: [{ value: 'disponivel', label: 'Disponível' }, { value: 'esgotado', label: 'Esgotado (aparece com selo)' }, { value: 'oculto', label: 'Oculto (não aparece no site)' }] })}
            <button class="btn btn-primary btn-block btn-lg" type="submit" data-submit><span>${isNew ? 'PUBLICAR PRODUTO' : 'SALVAR PRODUTO'}</span></button>
            ${!isNew ? `<button class="btn btn-block" type="button" data-dup>${ico('copy')}<span>Duplicar</span></button><button class="btn btn-danger-ghost btn-block" type="button" data-delete>${ico('trash')}<span>Excluir produto</span></button>` : ''}
            <p class="meta">Disponíveis e esgotados aparecem na vitrine “Escolhas da semana”.</p>
          </section>
        </div>
      </aside>
    </form>`;

  const form = root.querySelector('[data-form]');
  bindCounters(form);
  bindErrorClear(form);
  form.addEventListener('input', () => {
    app.formDirty = true;
  });
  bindPhotos(form, photos, {
    onChange: () => {
      app.formDirty = true;
    },
  });

  form.querySelector('[data-delete]')?.addEventListener('click', async () => {
    if (!(await confirmDialog({ title: 'Excluir produto?', text: `“${esc(p.name)}” sai do site. Essa ação não pode ser desfeita.`, confirm: 'Excluir', danger: true }))) return;
    const ok = await app.publish(
      (c) => {
        c.products.items = c.products.items.filter((item) => item.id !== p.id);
      },
      { success: 'Produto excluído.' }
    );
    if (ok) app.go('#/produtos');
  });
  form.querySelector('[data-dup]')?.addEventListener('click', async () => {
    const copy = { ...structuredClone(p), id: uid('p'), name: `${p.name} (cópia)`, status: 'oculto' };
    const ok = await app.publish(
      (c) => {
        const index = c.products.items.findIndex((item) => item.id === p.id);
        c.products.items.splice(index + 1, 0, copy);
      },
      { success: 'Cópia criada como “Oculto”. Edite e mude a situação quando estiver pronta.' }
    );
    if (ok) app.go(`#/produtos/${copy.id}`);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(form);
    const price = parseMoney(v.price);
    const errors = [];
    if (!v.name) errors.push(['name', 'Informe o nome da peça.']);
    if (v.price && price === null) errors.push(['price', 'Preço inválido. Use o formato 189,90.']);
    if (v.url && !isUrl(v.url)) errors.push(['url', 'O link precisa começar com https://']);
    if (!photos.image) errors.push(['image', 'Escolha a foto principal.']);
    if (showErrors(form, errors)) return;

    const button = form.querySelector('[data-submit]');
    busy(button, true, photos.image?.isNew || photos.imageHover?.isNew ? 'Enviando as fotos…' : 'Publicando…');
    try {
      const image = await savePhoto(photos.image, v.name, 'produtos', v.alt);
      const imageHover = await savePhoto(photos.imageHover, `${v.name}-2`, 'produtos', '');
      const productId = p.id || uid('p');
      const sizes = [...form.querySelectorAll('[name="size"]:checked')].map((i) => i.value).concat(list(v.extraSizes));
      const saved = {
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
      const ok = await app.publish(
        (c) => {
          const index = c.products.items.findIndex((item) => item.id === productId);
          if (index >= 0) c.products.items[index] = saved;
          else c.products.items.unshift(saved);
        },
        { success: isNew ? 'Produto publicado! Já está no site.' : 'Produto atualizado no site.' }
      );
      if (ok) app.go('#/produtos');
      else busy(button, false);
    } catch (error) {
      busy(button, false);
      toast(error.message, 'error', 8000);
    }
  });
}

/* ---------- Categorias ---------- */
export async function categoriasView(app, root) {
  const working = (source) => structuredClone(source).map((item) => ({ ...item, __orig: item.name }));
  let items = working(app.content.categories.items);
  let catalogUrl = app.content.categories.catalogUrl || '';
  const photos = {};

  const read = (form) => {
    catalogUrl = form.querySelector('[name="catalogUrl"]').value.trim();
    return items.map((item, i) => ({
      ...item,
      name: form.querySelector(`[name="name-${i}"]`).value.trim(),
      text: form.querySelector(`[name="text-${i}"]`).value.trim(),
      url: form.querySelector(`[name="url-${i}"]`).value.trim(),
      wide: form.querySelector(`[name="wide-${i}"]`).checked || undefined,
      image: { ...item.image, alt: form.querySelector(`[name="alt-${i}"]`).value.trim() },
    }));
  };

  const paint = () => {
    root.innerHTML = `
      ${pageHead('Categorias', 'Os cards da seção “Nossas Categorias” do site. Também aparecem como opção no cadastro de produtos.', backBtn('#/produtos'))}
      <form class="form form--single" novalidate data-form>
        <div class="form-main">
          <section class="panel">
            <h2 class="panel-title">Seção</h2>
            <div class="grid">
              ${field({ label: 'Link do catálogo (opcional)', name: 'catalogUrl', value: catalogUrl, type: 'url', wide: true, placeholder: 'https://…', hint: 'Usado no botão “Ver todas as categorias”. Sem link, os cards levam ao formulário de contato com o interesse preenchido.' })}
            </div>
          </section>
          ${items
            .map(
              (item, i) => `
          <section class="panel" data-index="${i}">
            <div class="panel-head"><h2>${esc(item.name || 'Nova categoria')}</h2>
              <div class="cat-tools" style="grid-auto-flow:column">
                <button class="icon-btn" type="button" data-move="-1" aria-label="Mover ${esc(item.name || 'categoria')} para cima"${i === 0 ? ' disabled' : ''}>${ico('up')}</button>
                <button class="icon-btn" type="button" data-move="1" aria-label="Mover ${esc(item.name || 'categoria')} para baixo"${i === items.length - 1 ? ' disabled' : ''}>${ico('down')}</button>
                <button class="icon-btn icon-btn--danger" type="button" data-remove aria-label="Remover ${esc(item.name || 'categoria')}">${ico('trash')}</button>
              </div>
            </div>
            <div class="cat-item">
              ${photoBox(`cat-${i}`, 'Foto', photos[`cat-${i}`] || photoFrom(app, item.image), { required: true, ratio: '4 / 5' })}
              <div class="grid">
                ${field({ label: 'Nome', name: `name-${i}`, value: item.name, required: true, counter: 30 })}
                ${field({ label: 'Texto curto', name: `text-${i}`, value: item.text, counter: 60 })}
                ${field({ label: 'Link (opcional)', name: `url-${i}`, value: item.url || '', type: 'url', placeholder: 'https://…' })}
                ${field({ label: 'Descrição da foto', name: `alt-${i}`, value: item.image?.alt || '' })}
                <div class="field col-2"><label class="switch"><input type="checkbox" role="switch" name="wide-${i}"${item.wide ? ' checked' : ''}><span class="switch-ui" aria-hidden="true"></span><span>Card largo (ocupa a linha inteira)</span></label></div>
              </div>
            </div>
          </section>`
            )
            .join('')}
          <div class="form-bar form-bar--sticky">
            <button class="btn" type="button" data-add style="margin-right:auto">${ico('plus')}<span>Adicionar categoria</span></button>
            <button class="btn btn-primary" type="submit" data-submit>${ico('check')}<span>Salvar e publicar</span></button>
          </div>
        </div>
      </form>`;
    bind();
  };

  // As fotos são guardadas pela posição: ao mover/remover, reorganiza junto
  const movePhotos = (order) => {
    const old = { ...photos };
    for (const key of Object.keys(photos)) delete photos[key];
    order.forEach((from, to) => {
      if (old[`cat-${from}`]) photos[`cat-${to}`] = old[`cat-${from}`];
    });
  };

  const bind = () => {
    const form = root.querySelector('[data-form]');
    bindCounters(form);
    bindErrorClear(form);
    form.addEventListener('input', () => {
      app.formDirty = true;
    });
    bindPhotos(form, photos, {
      maxSize: 1000,
      onChange: () => {
        app.formDirty = true;
      },
    });
    form.querySelectorAll('[data-move]').forEach((button) =>
      button.addEventListener('click', () => {
        items = read(form);
        const i = Number(button.closest('[data-index]').dataset.index);
        const to = i + Number(button.dataset.move);
        const order = items.map((_, k) => k);
        order.splice(to, 0, ...order.splice(i, 1));
        items = order.map((k) => items[k]);
        movePhotos(order);
        app.formDirty = true;
        paint();
      })
    );
    form.querySelectorAll('[data-remove]').forEach((button) =>
      button.addEventListener('click', async () => {
        const i = Number(button.closest('[data-index]').dataset.index);
        if (!(await confirmDialog({ title: 'Remover categoria?', text: `“${esc(items[i].name || 'Nova categoria')}” sai do site depois que você salvar.`, confirm: 'Remover', danger: true }))) return;
        items = read(form);
        const order = items.map((_, k) => k).filter((k) => k !== i);
        items = order.map((k) => items[k]);
        movePhotos(order);
        app.formDirty = true;
        paint();
      })
    );
    form.querySelector('[data-add]').addEventListener('click', () => {
      items = read(form);
      items.push({ name: '', text: '', url: '', image: { src: '', width: 0, height: 0, alt: '' } });
      app.formDirty = true;
      paint();
      root.querySelector(`[name="name-${items.length - 1}"]`).focus();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const next = read(form);
      const errors = [];
      if (catalogUrl && !isUrl(catalogUrl)) errors.push(['catalogUrl', 'O link precisa começar com https://']);
      next.forEach((item, i) => {
        if (!item.name) errors.push([`name-${i}`, 'Informe o nome.']);
        if (!item.image.src && !photos[`cat-${i}`]) errors.push([`cat-${i}`, 'Escolha uma foto.']);
        if (item.url && !isUrl(item.url)) errors.push([`url-${i}`, 'O link precisa começar com https://']);
      });
      if (showErrors(form, errors)) return;
      const button = form.querySelector('[data-submit]');
      busy(button, true, 'Publicando…');
      try {
        for (const [i, item] of next.entries()) {
          const photo = photos[`cat-${i}`];
          if (photo?.isNew) item.image = await savePhoto(photo, item.name, 'categorias', item.image.alt);
        }
        const renames = next.filter((item) => item.__orig && item.__orig !== item.name).map((item) => [item.__orig, item.name]);
        for (const item of next) {
          if (!item.wide) delete item.wide;
          delete item.__orig;
        }
        const ok = await app.publish(
          (content) => {
            content.categories.items = next;
            content.categories.catalogUrl = catalogUrl;
            for (const [from, to] of renames) for (const product of content.products.items) if (product.category === from) product.category = to;
          },
          { success: 'Categorias publicadas no site.' }
        );
        if (ok) {
          items = working(app.content.categories.items);
          for (const key of Object.keys(photos)) delete photos[key];
          paint();
        } else busy(button, false);
      } catch (error) {
        busy(button, false);
        toast(error.message, 'error', 8000);
      }
    });
  };

  paint();
}
