import { esc, ico, money, parseMoney, moneyInput, field, textarea, select, toggle, formValues, bindCounters, bindErrorClear, confirmDialog, toast, uid, list, isUrl } from '../ui.js';
import { pageHead, tabs, emptyState, photoBox, bindPhotos, savePhoto, photoFrom, showErrors, busy } from './shared.js';

export const PRODUCT_STATUS = { disponivel: 'Disponível', esgotado: 'Esgotado', oculto: 'Oculto' };
const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
const chipClass = { disponivel: 'on', esgotado: 'warn', oculto: 'off' };

const sectionTabs = (current) => tabs([['#/produtos', 'Produtos'], ['#/produtos/categorias', 'Categorias']], current);

/* ---------- Lista ---------- */
export async function produtosView(app, root) {
  const state = { filter: 'todos', q: '', category: '' };

  const paint = () => {
    const items = app.content.products.items;
    const q = state.q.toLowerCase();
    const shown = items.filter(
      (p) =>
        (state.filter === 'todos' || p.status === state.filter) &&
        (!state.category || p.category === state.category) &&
        (!q || `${p.name} ${p.description || ''} ${(p.colors || []).join(' ')}`.toLowerCase().includes(q))
    );
    const count = (f) => items.filter((p) => f === 'todos' || p.status === f).length;
    root.querySelector('[data-filters]').innerHTML = [['todos', 'Todos'], ['disponivel', 'Disponíveis'], ['esgotado', 'Esgotados'], ['oculto', 'Ocultos']]
      .map(([key, label]) => `<button class="pill" type="button" data-filter="${key}" aria-pressed="${state.filter === key}">${label} <span>${count(key)}</span></button>`)
      .join('');
    root.querySelector('[data-list]').innerHTML = shown.length
      ? shown
          .map(
            (p) => `
        <li class="acard acard--product" data-id="${esc(p.id)}">
          <a class="acard__media" href="#/produtos/${esc(p.id)}" tabindex="-1" aria-hidden="true">
            ${p.image?.src ? `<img src="${esc(app.imageUrl(p.image.src))}" alt="" loading="lazy">` : '<span class="acard__placeholder">S</span>'}
            <span class="chip chip--${chipClass[p.status]} acard__chip">${PRODUCT_STATUS[p.status]}</span>
          </a>
          <div class="acard__body">
            <p class="acard__meta">${esc(p.category || 'Sem categoria')}</p>
            <h3 class="acard__title"><a href="#/produtos/${esc(p.id)}">${esc(p.name)}</a></h3>
            <p class="acard__price">${Number.isFinite(p.price) ? money(p.price) : 'Sem preço'}</p>
            <label class="acard__status">
              <span class="sr-only">Situação de ${esc(p.name)}</span>
              <select data-act="status">
                ${Object.entries(PRODUCT_STATUS).map(([v, l]) => `<option value="${v}"${p.status === v ? ' selected' : ''}>${l}</option>`).join('')}
              </select>
            </label>
            <div class="acard__actions">
              <a class="btn btn--line btn--sm" href="#/produtos/${esc(p.id)}">${ico('edit')}<span>Editar</span></a>
              <button class="icon-btn" type="button" data-act="dup" aria-label="Duplicar ${esc(p.name)}">${ico('copy')}</button>
              <button class="icon-btn icon-btn--danger" type="button" data-act="del" aria-label="Excluir ${esc(p.name)}">${ico('trash')}</button>
            </div>
          </div>
        </li>`
          )
          .join('')
      : `<li class="acard-empty">${
          items.length
            ? '<p class="muted">Nenhum produto neste filtro.</p>'
            : emptyState('Nenhum produto cadastrado', 'Cadastre as peças da loja. As disponíveis e esgotadas aparecem na vitrine “Escolhas da semana” do site; as ocultas ficam só aqui.', `<a class="btn btn--wine" href="#/produtos/novo">${ico('plus')}<span>Cadastrar produto</span></a>`)
        }</li>`;
  };

  root.innerHTML = `
  ${pageHead({
    eyebrow: 'Vitrine do site',
    plain: 'Seus',
    italic: 'produtos',
    text: 'Veja o que está disponível, marque o que esgotou e cadastre novas peças.',
    actions: `<a class="btn btn--wine" href="#/produtos/novo">${ico('plus')}<span>Novo produto</span></a>`,
    tabs: sectionTabs('#/produtos'),
  })}
  <div class="container page-body">
    <div class="toolbar">
      <div class="pills" role="group" aria-label="Filtrar por situação" data-filters></div>
      <label class="search">${ico('search')}<span class="sr-only">Buscar produto</span><input type="search" placeholder="Buscar por nome, cor…" data-q></label>
      <label class="toolbar__select"><span class="sr-only">Filtrar por categoria</span>
        <select data-category><option value="">Todas as categorias</option>${app.content.categories.items.map((c) => `<option>${esc(c.name)}</option>`).join('')}</select>
      </label>
    </div>
    <ul class="acards acards--products" data-list aria-label="Produtos"></ul>
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
  root.querySelector('[data-category]').addEventListener('change', (event) => {
    state.category = event.target.value;
    paint();
  });
  const listEl = root.querySelector('[data-list]');
  listEl.addEventListener('change', async (event) => {
    const select = event.target.closest('select[data-act="status"]');
    if (!select) return;
    const id = select.closest('[data-id]').dataset.id;
    select.disabled = true;
    await app.publish(
      (c) => {
        c.products.items.find((p) => p.id === id).status = select.value;
      },
      { success: `Agora: “${PRODUCT_STATUS[select.value]}”. O site já foi atualizado.` }
    );
    paint();
    listEl.querySelector(`[data-id="${CSS.escape(id)}"] select`)?.focus();
  });
  listEl.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-act]');
    if (!button) return;
    const id = button.closest('[data-id]').dataset.id;
    const items = app.content.products.items;
    const index = items.findIndex((p) => p.id === id);
    const product = items[index];
    if (button.dataset.act === 'dup') {
      const copy = { ...structuredClone(product), id: uid('p'), name: `${product.name} (cópia)`, status: 'oculto' };
      await app.publish((c) => c.products.items.splice(index + 1, 0, copy), { success: 'Cópia criada como “Oculto”. Edite e mude a situação quando estiver pronta.' });
      paint();
    }
    if (button.dataset.act === 'del') {
      if (!(await confirmDialog({ title: `Excluir “${product.name}”?`, text: 'O produto sai do site e não pode ser recuperado.', confirm: 'Excluir', danger: true }))) return;
      await app.publish(
        (c) => {
          c.products.items = c.products.items.filter((p) => p.id !== id);
        },
        { success: 'Produto excluído.' }
      );
      paint();
      root.querySelector('[data-q]').focus();
    }
  });
  paint();
  setTimeout(() => listEl.classList.add('is-static'), 900);
}

/* ---------- Formulário de produto ---------- */
export async function produtoFormView(app, root, id) {
  const isNew = id === 'novo';
  const existing = isNew ? null : app.content.products.items.find((p) => p.id === id);
  if (!isNew && !existing) {
    root.innerHTML = `<div class="container page-body">${emptyState('Produto não encontrado', 'Ele pode ter sido excluído em outro aparelho.', '<a class="btn btn--wine" href="#/produtos">Voltar aos produtos</a>')}</div>`;
    return;
  }
  const p = existing || { status: 'disponivel', sizes: [], colors: [] };
  app.setTitle(isNew ? 'Novo produto' : p.name);
  const photos = { image: photoFrom(app, p.image), imageHover: photoFrom(app, p.imageHover) };
  const extraSizes = (p.sizes || []).filter((s) => !SIZES.includes(s));
  const categoryOptions = [{ value: '', label: 'Sem categoria' }, ...app.content.categories.items.map((c) => ({ value: c.name, label: c.name }))];

  root.innerHTML = `
  <div class="container page-body page-body--form">
    <a class="back" href="#/produtos">${ico('back')}Produtos</a>
    <header class="form-head">
      <p class="eyebrow eyebrow--line">Vitrine do site</p>
      <h1 class="form-head__title">${isNew ? 'Novo <em>produto</em>' : 'Editar <em>produto</em>'}</h1>
    </header>
    <form class="editor" novalidate data-form>
      <div class="editor__main">
        <section class="panel">
          <div class="fields">
            ${field({ label: 'Nome da peça', name: 'name', value: p.name || '', required: true, counter: 80, wide: true, placeholder: 'Ex.: Vestido midi vinho' })}
            ${field({ label: 'Preço (R$)', name: 'price', value: moneyInput(p.price), extra: { inputmode: 'decimal' }, placeholder: '0,00', hint: 'Em branco, o preço não aparece no site.' })}
            ${select({ label: 'Categoria', name: 'category', value: p.category || '', options: categoryOptions })}
            ${textarea({ label: 'Descrição curta', name: 'description', value: p.description || '', rows: 3, counter: 160, hint: 'Tecido, caimento, ocasião…' })}
            ${field({ label: 'Cores', name: 'colors', value: (p.colors || []).join(', '), wide: true, placeholder: 'Ex.: Vinho, Off-white', hint: 'Separe por vírgula.' })}
            <fieldset class="field field--wide chips-field">
              <legend>Tamanhos</legend>
              <div class="chips">
                ${SIZES.map((s) => `<label class="chip-check"><input type="checkbox" name="size" value="${s}"${(p.sizes || []).includes(s) ? ' checked' : ''}><span>${s}</span></label>`).join('')}
              </div>
              <input type="text" name="extraSizes" value="${esc(extraSizes.join(', '))}" placeholder="Outros: 36, 38, 40…" aria-label="Outros tamanhos">
            </fieldset>
            ${field({ label: 'Link da peça (opcional)', name: 'url', value: p.url || '', type: 'url', wide: true, placeholder: 'https://…', hint: 'Sem link, o botão “Quero esta peça” abre o WhatsApp da loja (ou o contato) com o nome da peça.' })}
          </div>
        </section>
      </div>
      <aside class="editor__side">
        <section class="panel">
          <h2 class="panel__title">Situação no site</h2>
          <fieldset class="field field--wide">
            <legend class="sr-only">Situação</legend>
            <div class="segmented">
              ${Object.entries(PRODUCT_STATUS)
                .map(([v, l]) => `<label><input type="radio" name="status" value="${v}"${p.status === v ? ' checked' : ''}><span>${l}</span></label>`)
                .join('')}
            </div>
            <p class="hint">Esgotado aparece com selo. Oculto não aparece no site.</p>
          </fieldset>
        </section>
        <section class="panel">
          ${photoBox('image', 'Foto principal', photos.image, { required: true })}
          ${field({ label: 'Descrição da foto', name: 'alt', value: p.image?.alt || '', wide: true, placeholder: 'Ex.: Vestido midi vinho de alças finas' })}
          ${photoBox('imageHover', 'Segunda foto (opcional)', photos.imageHover, { hint: 'Aparece ao passar o mouse. Use outra foto da mesma peça.' })}
        </section>
      </aside>
      <div class="form-bar">
        ${!isNew ? `<button class="btn btn--ghost btn--danger" type="button" data-delete>${ico('trash')}<span>Excluir</span></button>` : ''}
        <span class="form-bar__spacer"></span>
        <a class="btn btn--ghost" href="#/produtos">Cancelar</a>
        <button class="btn btn--wine" type="submit" data-submit>${ico('check')}<span>Salvar e publicar</span></button>
      </div>
    </form>
  </div>`;

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
    if (!(await confirmDialog({ title: `Excluir “${p.name}”?`, text: 'O produto sai do site e não pode ser recuperado.', confirm: 'Excluir', danger: true }))) return;
    const ok = await app.publish(
      (c) => {
        c.products.items = c.products.items.filter((item) => item.id !== p.id);
      },
      { success: 'Produto excluído.' }
    );
    if (ok) app.go('#/produtos');
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
  const c = app.content.categories;
  const working = (source) => structuredClone(source).map((item) => ({ ...item, __orig: item.name }));
  let items = working(c.items);
  const photos = {};

  const read = (form) =>
    items.map((item, i) => ({
      ...item,
      name: form.querySelector(`[name="name-${i}"]`).value.trim(),
      text: form.querySelector(`[name="text-${i}"]`).value.trim(),
      url: form.querySelector(`[name="url-${i}"]`).value.trim(),
      wide: form.querySelector(`[name="wide-${i}"]`).checked || undefined,
      image: { ...item.image, alt: form.querySelector(`[name="alt-${i}"]`).value.trim() },
    }));

  const paint = () => {
    root.innerHTML = `
    ${pageHead({
      eyebrow: 'Vitrine do site',
      plain: 'Suas',
      italic: 'categorias',
      text: 'Os cards da seção “Nossas Categorias” do site. Também aparecem como opção no cadastro de produtos.',
      tabs: sectionTabs('#/produtos/categorias'),
    })}
    <div class="container page-body">
      <form class="stack" novalidate data-form>
        <ul class="stack">
          ${items
            .map(
              (item, i) => `
          <li class="panel cat-row" data-index="${i}">
            ${photoBox(`cat-${i}`, 'Foto', photos[`cat-${i}`] || photoFrom(app, item.image), { required: true, ratio: '5 / 4' })}
            <div class="fields">
              ${field({ label: 'Nome', name: `name-${i}`, value: item.name, required: true, counter: 30 })}
              ${field({ label: 'Texto curto', name: `text-${i}`, value: item.text, counter: 60 })}
              ${field({ label: 'Link (opcional)', name: `url-${i}`, value: item.url || '', type: 'url', placeholder: 'https://…' })}
              ${field({ label: 'Descrição da foto', name: `alt-${i}`, value: item.image?.alt || '' })}
              ${toggle({ label: 'Card largo (ocupa a linha inteira)', name: `wide-${i}`, checked: Boolean(item.wide) })}
            </div>
            <div class="cat-row__actions">
              <button class="icon-btn" type="button" data-move="-1" aria-label="Mover ${esc(item.name || 'categoria')} para cima"${i === 0 ? ' disabled' : ''}>${ico('up')}</button>
              <button class="icon-btn" type="button" data-move="1" aria-label="Mover ${esc(item.name || 'categoria')} para baixo"${i === items.length - 1 ? ' disabled' : ''}>${ico('down')}</button>
              <button class="icon-btn icon-btn--danger" type="button" data-remove aria-label="Remover ${esc(item.name || 'categoria')}">${ico('trash')}</button>
            </div>
          </li>`
            )
            .join('')}
        </ul>
        <button class="btn btn--line" type="button" data-add>${ico('plus')}<span>Adicionar categoria</span></button>
        <div class="form-bar">
          <span class="form-bar__spacer"></span>
          <button class="btn btn--wine" type="submit" data-submit>${ico('check')}<span>Salvar e publicar</span></button>
        </div>
      </form>
    </div>`;
    bind();
  };

  // Fotos são indexadas pela posição: ao mover/remover, reorganiza junto
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
        if (!(await confirmDialog({ title: `Remover “${items[i].name || 'categoria'}”?`, text: 'A remoção só vale depois de salvar.', confirm: 'Remover', danger: true }))) return;
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
