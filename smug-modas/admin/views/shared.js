// Peças comuns das telas do painel: cabeçalho no estilo da hero do site e campo de foto.
import { esc, ico, toast } from '../ui.js';
import { processImage } from '../images.js';
import { api } from '../api.js';

// Cabeçalho de página: parede iluminada da hero, sobretítulo com linha e título editorial.
export const pageHead = ({ eyebrow, plain, italic, text = '', actions = '', tabs = '' }) => `
  <section class="page-head">
    <div class="page-head__bg" aria-hidden="true"><img src="../assets/img/hero-fundo.webp" alt="" width="1600" height="853"><span class="hero__sun"></span></div>
    <div class="container page-head__inner">
      <div class="page-head__text">
        <p class="eyebrow eyebrow--line">${esc(eyebrow)}</p>
        <h1 class="page-head__title">${esc(plain)} <em>${esc(italic)}</em></h1>
        ${text ? `<p class="page-head__lead">${text}</p>` : ''}
      </div>
      ${actions ? `<div class="page-head__actions">${actions}</div>` : ''}
    </div>
    ${tabs ? `<div class="container">${tabs}</div>` : ''}
  </section>`;

export const tabs = (items, current) => `
  <nav class="tabs" aria-label="Seções">
    ${items.map(([href, label]) => `<a class="tabs__link" href="${href}"${href === current ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}
  </nav>`;

export const emptyState = (title, text, action = '') => `
  <div class="empty"><span class="empty__mark" aria-hidden="true">S</span><h2>${esc(title)}</h2><p>${text}</p>${action}</div>`;

/* ---------- Campo de foto ---------- */
export const photoBox = (name, label, photo, { required = false, ratio = '3 / 4', hint = '' } = {}) => `
  <div class="photo-field" data-photo="${name}" style="--ratio:${ratio}">
    <p class="photo-field__label">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</p>
    <div class="photo-field__preview" data-preview>
      ${photo ? `<img src="${esc(photo.url)}" alt="">` : `<span class="photo-field__empty">${ico('image')}<span>Sem foto</span></span>`}
    </div>
    <div class="photo-field__actions">
      <label class="btn btn--line btn--sm file-btn">${ico('upload')}<span>${photo ? 'Trocar foto' : 'Escolher foto'}</span>
        <input type="file" accept="image/*" class="sr-only" data-file="${name}">
      </label>
      ${!required ? `<button class="btn btn--ghost btn--sm" type="button" data-remove-photo="${name}"${photo ? '' : ' hidden'}>Remover</button>` : ''}
    </div>
    <p class="hint" data-photo-status="${name}">${hint || 'JPG, PNG ou WebP. A foto é otimizada automaticamente.'}</p>
  </div>`;

// photos: objeto { [name]: { url, src?, width, height, isNew?, dataUrl? } | null }
export function bindPhotos(form, photos, { maxSize = 1600, onChange = () => {} } = {}) {
  form.querySelectorAll('[data-file]').forEach((input) =>
    input.addEventListener('change', async () => {
      const name = input.dataset.file;
      const file = input.files[0];
      if (!file) return;
      const status = form.querySelector(`[data-photo-status="${name}"]`);
      status.textContent = 'Otimizando a foto…';
      try {
        const image = await processImage(file, { maxSize });
        photos[name] = { ...image, url: image.dataUrl, isNew: true };
        const box = form.querySelector(`[data-photo="${name}"]`);
        box.querySelector('[data-preview]').innerHTML = `<img src="${image.dataUrl}" alt="">`;
        box.querySelector('.file-btn span').textContent = 'Trocar foto';
        const remove = box.querySelector('[data-remove-photo]');
        if (remove) remove.hidden = false;
        box.querySelector('.field-error')?.remove();
        status.textContent = `${image.width}×${image.height} px · ${Math.round(image.bytes / 1024)} KB`;
        onChange();
      } catch (error) {
        status.textContent = error.message;
        toast(error.message, 'error');
      } finally {
        input.value = '';
      }
    })
  );
  form.querySelectorAll('[data-remove-photo]').forEach((button) =>
    button.addEventListener('click', () => {
      const name = button.dataset.removePhoto;
      photos[name] = null;
      const box = form.querySelector(`[data-photo="${name}"]`);
      box.querySelector('[data-preview]').innerHTML = `<span class="photo-field__empty">${ico('image')}<span>Sem foto</span></span>`;
      box.querySelector('.file-btn span').textContent = 'Escolher foto';
      button.hidden = true;
      onChange();
    })
  );
}

// Envia a foto nova (se houver) e devolve o objeto de imagem do site
export async function savePhoto(photo, name, folder, alt = '') {
  if (!photo) return undefined;
  if (!photo.isNew) return { src: photo.src, width: photo.width, height: photo.height, alt };
  const { url } = await api.upload(photo, name, folder);
  return { src: url, width: photo.width, height: photo.height, alt };
}

export const photoFrom = (app, image) => (image?.src ? { src: image.src, url: app.imageUrl(image.src), width: image.width, height: image.height } : null);

// Mostra erros ao lado dos campos; devolve true se havia erros
export function showErrors(form, errors) {
  form.querySelectorAll('.field-error').forEach((e) => e.remove());
  form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
  for (const [name, message] of errors) {
    const input = form.querySelector(`[name="${name}"]`);
    const target = input ? input.closest('.field') : form.querySelector(`[data-photo="${name}"]`);
    input?.setAttribute('aria-invalid', 'true');
    target?.insertAdjacentHTML('beforeend', `<p class="field-error" role="alert">${esc(message)}</p>`);
  }
  if (errors.length) {
    (form.querySelector('[aria-invalid="true"]') || form.querySelector(`[data-photo="${errors[0][0]}"] input`))?.focus();
    toast('Revise os campos destacados.', 'error');
  }
  return errors.length > 0;
}

// Botão em estado "publicando…"
export function busy(button, on, text = 'Publicando…') {
  if (on) {
    button.dataset.label = button.innerHTML;
    button.innerHTML = `<span>${esc(text)}</span>`;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
  } else {
    button.innerHTML = button.dataset.label || button.innerHTML;
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}
