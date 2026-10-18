import { esc, ico, field, textarea, toggle, toast, confirmDialog, formValues, bindCounters, slugify, list, isUrl } from '../ui.js';
import { processImage } from '../images.js';

// Categorias do site: textos da seção + cada card (nome, texto, foto, link).
export async function categoriesView(app, root) {
  const c = app.content.categories;
  // fotos novas escolhidas nesta tela (índice do card → imagem processada)
  const newPhotos = new Map();

  const card = (item, i, total) => `
    <li class="card cat-item" data-index="${i}">
      <div class="cat-item__photo">
        <img ${newPhotos.has(i) ? `src="${newPhotos.get(i).dataUrl}"` : app.imgAttrs(item.image?.src)} alt="" data-cat-preview>
        <label class="btn btn--ghost btn--sm file-btn">${ico('upload')}<span>Trocar foto</span>
          <input type="file" accept="image/*" class="sr-only" data-cat-file>
        </label>
      </div>
      <div class="fields">
        ${field({ label: 'Nome', name: `name-${i}`, value: item.name, required: true, counter: 30 })}
        ${field({ label: 'Texto curto', name: `text-${i}`, value: item.text, counter: 60 })}
        ${field({ label: 'Link (opcional)', name: `url-${i}`, value: item.url || '', type: 'url', placeholder: 'https://…', hint: 'Sem link, o card leva ao formulário com o interesse preenchido.' })}
        ${field({ label: 'Descrição da foto', name: `alt-${i}`, value: item.image?.alt || '' })}
        ${toggle({ label: 'Card largo (ocupa a linha inteira)', name: `wide-${i}`, checked: Boolean(item.wide) })}
      </div>
      <div class="cat-item__actions">
        <button class="icon-btn" type="button" data-move="-1" aria-label="Mover ${esc(item.name)} para cima"${i === 0 ? ' disabled' : ''}>${ico('up')}</button>
        <button class="icon-btn" type="button" data-move="1" aria-label="Mover ${esc(item.name)} para baixo"${i === total - 1 ? ' disabled' : ''}>${ico('down')}</button>
        <button class="icon-btn icon-btn--danger" type="button" data-remove aria-label="Remover ${esc(item.name)}">${ico('trash')}</button>
      </div>
    </li>`;

  // Trabalha numa cópia; só vai para o rascunho ao salvar.
  // __orig guarda o nome anterior para renomear a categoria também nos produtos.
  const workingCopy = (source) => structuredClone(source).map((item) => ({ ...item, __orig: item.name }));
  let items = workingCopy(c.items);

  const readItems = (form) =>
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
    <section class="page-head">
      <div><p class="eyebrow">Site</p><h2 class="page-title">Categorias</h2>
      <p class="muted">Os cards da seção “Nossas Categorias”. As categorias também aparecem como opção no cadastro de produtos.</p></div>
    </section>
    <form class="stack" novalidate data-form>
      <section class="card">
        <h3 class="card__title">Textos da seção</h3>
        <div class="fields">
          ${field({ label: 'Sobretítulo', name: 'eyebrow', value: c.eyebrow })}
          ${field({ label: 'Título', name: 'titlePlain', value: c.title.plain })}
          ${field({ label: 'Título (parte em itálico)', name: 'titleItalic', value: c.title.italic })}
          ${textarea({ label: 'Texto', name: 'text', value: c.text, rows: 3, counter: 240 })}
          ${field({ label: 'Texto do botão', name: 'cta', value: c.cta })}
          ${field({ label: 'Link do catálogo (opcional)', name: 'catalogUrl', value: c.catalogUrl, type: 'url', placeholder: 'https://…', hint: 'Se houver catálogo ou loja virtual, o botão e os cards sem link próprio abrem este endereço.' })}
          ${field({ label: 'Palavras do fechamento', name: 'closingWords', value: c.closing.words.join(', '), wide: true, hint: 'Separadas por vírgula.' })}
          ${field({ label: 'Frase cursiva do fechamento', name: 'closingScript', value: c.closing.script, wide: true })}
        </div>
      </section>
      <ul class="stack" data-items>${items.map((item, i) => card(item, i, items.length)).join('')}</ul>
      <button class="btn btn--ghost" type="button" data-add>${ico('plus')}Adicionar categoria</button>
      <div class="form-bar">
        <span class="form-bar__spacer"></span>
        <button class="btn btn--primary" type="submit">${ico('check')}Salvar categorias</button>
      </div>
    </form>`;
    bind();
  };

  const bind = () => {
    const form = root.querySelector('[data-form]');
    bindCounters(form);
    form.addEventListener('input', () => {
      app.formDirty = true;
    });
    form.querySelectorAll('[data-cat-file]').forEach((input) =>
      input.addEventListener('change', async () => {
        const i = Number(input.closest('[data-index]').dataset.index);
        const file = input.files[0];
        if (!file) return;
        try {
          const image = await processImage(file, { maxSize: 1000 });
          newPhotos.set(i, image);
          input.closest('[data-index]').querySelector('[data-cat-preview]').src = image.dataUrl;
          app.formDirty = true;
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          input.value = '';
        }
      })
    );
    form.querySelectorAll('[data-move]').forEach((btn) =>
      btn.addEventListener('click', () => {
        items = readItems(form);
        const i = Number(btn.closest('[data-index]').dataset.index);
        const to = i + Number(btn.dataset.move);
        items.splice(to, 0, ...items.splice(i, 1));
        const a = newPhotos.get(i);
        const b = newPhotos.get(to);
        newPhotos.delete(i);
        newPhotos.delete(to);
        if (a) newPhotos.set(to, a);
        if (b) newPhotos.set(i, b);
        app.formDirty = true;
        paint();
      })
    );
    form.querySelectorAll('[data-remove]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        const i = Number(btn.closest('[data-index]').dataset.index);
        const ok = await confirmDialog({ title: `Remover “${items[i].name || 'categoria'}”?`, confirm: 'Remover', danger: true });
        if (!ok) return;
        items = readItems(form);
        items.splice(i, 1);
        const shifted = new Map();
        for (const [k, v] of newPhotos) if (k !== i) shifted.set(k > i ? k - 1 : k, v);
        newPhotos.clear();
        shifted.forEach((v, k) => newPhotos.set(k, v));
        app.formDirty = true;
        paint();
      })
    );
    form.querySelector('[data-add]').addEventListener('click', () => {
      items = readItems(form);
      items.push({ name: '', text: '', url: '', image: { src: '', width: 0, height: 0, alt: '' } });
      app.formDirty = true;
      paint();
      root.querySelector(`[name="name-${items.length - 1}"]`).focus();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const v = formValues(form);
      const next = readItems(form);
      const problems = [];
      next.forEach((item, i) => {
        if (!item.name) problems.push(`Categoria ${i + 1}: informe o nome.`);
        if (!item.image.src && !newPhotos.has(i)) problems.push(`Categoria ${i + 1}: escolha uma foto.`);
        if (item.url && !isUrl(item.url)) problems.push(`Categoria ${i + 1}: o link precisa começar com https://`);
      });
      if (v.catalogUrl && !isUrl(v.catalogUrl)) problems.push('Catálogo: o link precisa começar com https://');
      if (problems.length) {
        toast(problems[0], 'error', 6000);
        return;
      }
      next.forEach((item, i) => {
        const photo = newPhotos.get(i);
        if (!photo) return;
        const path = `assets/img/categorias/${slugify(item.name)}-${Date.now().toString(36)}${i}.${photo.ext}`;
        app.addUpload(path, { dataUrl: photo.dataUrl, width: photo.width, height: photo.height });
        item.image = { src: path, width: photo.width, height: photo.height, alt: item.image.alt };
      });
      const renames = next.filter((item) => item.__orig && item.__orig !== item.name).map((item) => [item.__orig, item.name]);
      for (const item of next) {
        if (!item.wide) delete item.wide;
        delete item.__orig;
      }
      app.update((content) => {
        for (const [from, to] of renames)
          for (const product of content.products.items) if (product.category === from) product.category = to;
        Object.assign(content.categories, {
          eyebrow: v.eyebrow,
          title: { plain: v.titlePlain, italic: v.titleItalic },
          text: v.text,
          cta: v.cta,
          catalogUrl: v.catalogUrl,
          closing: { words: list(v.closingWords), script: v.closingScript },
          items: next,
        });
      });
      items = workingCopy(next);
      newPhotos.clear();
      app.formDirty = false;
      toast('Categorias salvas. Publique para aplicar no site.', 'success');
      paint();
    });
  };

  paint();
}
