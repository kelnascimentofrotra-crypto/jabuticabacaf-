// Peças comuns das telas do painel (mesmo padrão do painel do Marcos): topo da página,
// estado vazio, miniatura, campo de foto, erros dos campos e botão "salvando…".
import { esc, ico, toast } from '../ui.js';
import { processImage } from '../images.js';
import { api } from '../api.js';

// Topo da página: título grande, frase curta e ações à direita
export const pageHead = (title, text = '', actions = '') => `
  <div class="page-head">
    <div><h1>${esc(title)}</h1>${text ? `<p>${text}</p>` : ''}</div>
    ${actions ? `<div class="page-actions">${actions}</div>` : ''}
  </div>`;

export const stateBox = (title, text, actions = '', iconName = 'grid') => `
  <div class="state">
    <span class="state-ico">${ico(iconName)}</span>
    <h3>${esc(title)}</h3>
    <p>${text}</p>
    ${actions ? `<div class="state-actions">${actions}</div>` : ''}
  </div>`;

export const thumb = (app, src, { tall = false } = {}) =>
  src
    ? `<span class="thumb${tall ? ' thumb--tall' : ''}"><img src="${esc(app.imageUrl(src))}" alt="" loading="lazy"></span>`
    : `<span class="thumb is-empty${tall ? ' thumb--tall' : ''}">${ico('image')}</span>`;

export const backBtn = (href) => `<a class="btn" href="${href}">${ico('left')}<span>Voltar</span></a>`;

/* ---------- Campo de foto ---------- */
// photo: { url, src?, width, height, isNew?, dataUrl? } | null
const photoInner = (name, label, photo, { required, tag }) =>
  photo
    ? `<div class="photo">
        <img src="${esc(photo.url)}" alt="">
        ${tag ? `<span class="photo-tag">${esc(tag)}</span>` : ''}
        <div class="photo-tools">
          <label class="btn">${ico('swap')}<span>Trocar</span><input class="sr-only" type="file" accept="image/*" data-file="${name}"></label>
          ${!required ? `<button class="btn" type="button" data-remove-photo="${name}">${ico('trash')}<span>Remover</span></button>` : ''}
        </div>
      </div>`
    : `<label class="drop">
        ${ico('upload')}
        <b>${esc(label)}</b>
        <small>Toque para escolher ou arraste a foto aqui</small>
        <input type="file" accept="image/*" data-file="${name}">
      </label>`;

export const photoBox = (name, label, photo, { required = false, ratio = '4 / 3', hint = '', tag = '' } = {}) => `
  <div class="photo-slot" data-photo="${name}" data-label="${esc(label)}" data-required="${required}" data-tag="${esc(tag)}" style="--ratio:${ratio}">
    <span class="field-label">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</span>
    <div data-photo-body>${photoInner(name, label, photo, { required, tag })}</div>
    <small class="hint" data-photo-status="${name}">${hint || 'JPG, PNG ou WebP. A foto é otimizada automaticamente.'}</small>
    <small class="err"></small>
  </div>`;

export function bindPhotos(form, photos, { maxSize = 1600, onChange = () => {} } = {}) {
  const paint = (name) => {
    const slot = form.querySelector(`[data-photo="${name}"]`);
    slot.querySelector('[data-photo-body]').innerHTML = photoInner(name, slot.dataset.label, photos[name], {
      required: slot.dataset.required === 'true',
      tag: slot.dataset.tag,
    });
  };
  const choose = async (name, file) => {
    if (!file) return;
    const slot = form.querySelector(`[data-photo="${name}"]`);
    const status = slot.querySelector(`[data-photo-status="${name}"]`);
    status.textContent = 'Otimizando a foto…';
    try {
      const image = await processImage(file, { maxSize });
      photos[name] = { ...image, url: image.dataUrl, isNew: true };
      paint(name);
      slot.classList.remove('has-error');
      slot.querySelector('.err').textContent = '';
      status.textContent = `${image.width}×${image.height} px · ${Math.round(image.bytes / 1024)} KB`;
      onChange();
    } catch (error) {
      status.textContent = error.message;
      toast(error.message, 'error');
    }
  };
  form.addEventListener('change', (event) => {
    const input = event.target.closest('[data-file]');
    if (!input) return;
    choose(input.dataset.file, input.files[0]);
  });
  form.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-photo]');
    if (!button) return;
    photos[button.dataset.removePhoto] = null;
    paint(button.dataset.removePhoto);
    onChange();
  });
  // arrastar e soltar na área da foto
  form.addEventListener('dragover', (event) => {
    const drop = event.target.closest('.drop');
    if (!drop) return;
    event.preventDefault();
    drop.classList.add('is-over');
  });
  form.addEventListener('dragleave', (event) => event.target.closest('.drop')?.classList.remove('is-over'));
  form.addEventListener('drop', (event) => {
    const drop = event.target.closest('.drop');
    if (!drop) return;
    event.preventDefault();
    drop.classList.remove('is-over');
    choose(drop.querySelector('[data-file]').dataset.file, event.dataTransfer.files[0]);
  });
}

// Envia a foto nova (se houver) e devolve o objeto de imagem do site
export async function savePhoto(photo, name, folder, alt = '') {
  if (!photo) return undefined;
  if (!photo.isNew) return { src: photo.src, width: photo.width, height: photo.height, alt };
  const { url } = await api.upload(photo, name, folder);
  return { src: url, width: photo.width, height: photo.height, alt };
}

export const photoFrom = (app, image) => (image?.src ? { src: image.src, url: app.imageUrl(image.src), width: image.width, height: image.height } : null);

// Mostra os erros nos campos (borda vermelha + texto embaixo); devolve true se havia erros
export function showErrors(form, errors) {
  form.querySelectorAll('.has-error').forEach((box) => {
    box.classList.remove('has-error');
    const err = box.querySelector('.err');
    if (err) err.textContent = '';
  });
  form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
  for (const [name, message] of errors) {
    const input = form.querySelector(`[name="${name}"]`);
    const box = input ? input.closest('.field') : form.querySelector(`[data-photo="${name}"]`);
    if (!box) continue;
    input?.setAttribute('aria-invalid', 'true');
    box.classList.add('has-error');
    const err = box.querySelector('.err');
    if (err) err.textContent = message;
  }
  if (errors.length) {
    for (const [name] of errors) form.querySelector(`[name="${name}"]`)?.closest('details')?.setAttribute('open', '');
    const first = form.querySelector('[aria-invalid="true"]') || form.querySelector(`[data-photo="${errors[0][0]}"] input, [data-photo="${errors[0][0]}"] label`);
    first?.focus();
    toast('Revise os campos destacados.', 'error');
  }
  return errors.length > 0;
}

// Botão em estado "salvando…"
export function busy(button, on, text = 'Publicando…') {
  if (!button) return;
  if (on) {
    button.dataset.label = button.innerHTML;
    button.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>${esc(text)}</span>`;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
  } else {
    button.innerHTML = button.dataset.label || button.innerHTML;
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}
