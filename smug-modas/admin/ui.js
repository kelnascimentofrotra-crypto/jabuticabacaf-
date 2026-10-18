// Utilitários de interface do painel.
export { esc } from '../src/lib.mjs';
import { esc } from '../src/lib.mjs';

/* ---------- Formatação ---------- */
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const money = (value) => BRL.format(Number.isFinite(value) ? value : 0);

// "189,90", "R$ 1.189,90", "189.9" → 189.9 ; vazio → null
export function parseMoney(text) {
  const raw = String(text ?? '').replace(/[^\d,.-]/g, '');
  if (!raw) return null;
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) / 100 : null;
}
export const moneyInput = (value) => (Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '');

const DATE = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const DATETIME = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const formatDate = (iso) => (iso ? DATE.format(new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)) : '');
export const formatDateTime = (iso) => (iso ? DATETIME.format(new Date(iso)) : '');
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const slugify = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'item';

/* ---------- Telefones / WhatsApp ---------- */
export const digits = (text) => String(text ?? '').replace(/\D/g, '');
// Número para wa.me: só dígitos, com DDI 55 quando vier só com DDD + número.
export function whatsappNumber(text) {
  const d = digits(text);
  if (d.length === 10 || d.length === 11) return `55${d}`;
  return d;
}
export const isValidWhatsapp = (number) => /^\d{12,13}$/.test(number);
export function formatPhone(number) {
  const d = digits(number).replace(/^55(?=\d{10,11}$)/, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return number || '';
}
export const waLink = (number, text = '') => `https://wa.me/${whatsappNumber(number)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const isUrl = (text) => /^https:\/\/[^\s]+\.[^\s]+/.test(String(text || ''));
export const isEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(text || ''));

/* ---------- Campos de formulário ---------- */
const attrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== false && v !== undefined && v !== null)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

let fieldSeq = 0;
const fieldId = (name) => `f-${String(name).replace(/[^\w-]/g, '-')}-${++fieldSeq}`;

export function field({ label, name, value = '', type = 'text', hint = '', required = false, placeholder = '', extra = {}, wide = false, counter = 0 }) {
  const id = fieldId(name);
  const hintId = hint ? `${id}-hint` : undefined;
  return `
    <div class="field${wide ? ' field--wide' : ''}">
      <label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <input ${attrs({ id, name, type, value, placeholder, required, 'aria-describedby': hintId, maxlength: counter || undefined, 'data-counter': counter || undefined, ...extra })}>
      ${hint ? `<p class="hint" id="${hintId}">${hint}</p>` : ''}
    </div>`;
}

export function textarea({ label, name, value = '', hint = '', rows = 3, required = false, placeholder = '', counter = 0, wide = true }) {
  const id = fieldId(name);
  const hintId = hint ? `${id}-hint` : undefined;
  return `
    <div class="field${wide ? ' field--wide' : ''}">
      <label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <textarea ${attrs({ id, name, rows, placeholder, required, 'aria-describedby': hintId, maxlength: counter || undefined, 'data-counter': counter || undefined })}>${esc(value)}</textarea>
      ${hint ? `<p class="hint" id="${hintId}">${hint}</p>` : ''}
    </div>`;
}

export function select({ label, name, value = '', options, hint = '', required = false, wide = false }) {
  const id = fieldId(name);
  return `
    <div class="field${wide ? ' field--wide' : ''}">
      <label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <select ${attrs({ id, name, required })}>
        ${options.map((o) => `<option value="${esc(o.value)}"${String(o.value) === String(value) ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}
      </select>
      ${hint ? `<p class="hint">${hint}</p>` : ''}
    </div>`;
}

export function toggle({ label, name, checked = false, hint = '' }) {
  const id = fieldId(name);
  return `
    <div class="field field--wide field--toggle">
      <label class="switch" for="${id}">
        <input type="checkbox" role="switch" ${attrs({ id, name, checked })}>
        <span class="switch__track" aria-hidden="true"></span>
        <span class="switch__label">${esc(label)}</span>
      </label>
      ${hint ? `<p class="hint">${hint}</p>` : ''}
    </div>`;
}

/* ---------- Ícones ---------- */
const ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  up: '<path d="m6 14 6-6 6 6"/>',
  down: '<path d="m6 10 6 6 6-6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  whatsapp: '<path d="M3.6 20.4 4.9 16A8.4 8.4 0 1 1 8 19.2z"/><path d="M9.1 8.2c-.4.5-.5 1.2-.2 2.1.7 1.9 2.2 3.4 4.1 4.1.9.3 1.6.2 2.1-.2l.5-.6-1.9-1.1-.9.6c-.9-.4-1.6-1.1-2-2l.6-.9-1.1-1.9z"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5.5-5.5 4 4 2.5-2.5 4.5 4.5"/>',
  download: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/>',
  upload: '<path d="M12 16V5"/><path d="m7 10 5-5 5 5"/><path d="M5 19h14"/>',
  print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="1.5"/><path d="M7 14h10v6H7z"/>',
  back: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  external: '<path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 4 2.8 20h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.4 15.4 5 5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
export const ico = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

/* ---------- Avisos e diálogos ---------- */
export function toast(message, type = 'info', timeout = 4200) {
  const box = document.querySelector('[data-toasts]');
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = message;
  box.append(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => {
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 300);
  }, timeout);
}

// Abre o <dialog> do painel com o HTML informado. Resolve com o valor de `close(value)`.
export function modal(html, { onMount, wide = false, full = false } = {}) {
  const dialog = document.querySelector('[data-modal]');
  const opener = document.activeElement;
  dialog.className = `modal${wide ? ' modal--wide' : ''}${full ? ' modal--full' : ''}`;
  dialog.innerHTML = html;
  return new Promise((resolve) => {
    let result;
    const close = (value) => {
      result = value;
      dialog.close();
    };
    dialog.addEventListener(
      'close',
      () => {
        dialog.innerHTML = '';
        opener?.focus?.();
        resolve(result);
      },
      { once: true }
    );
    dialog.onclick = (event) => {
      if (event.target === dialog) close();
      const btn = event.target.closest('[data-close]');
      if (btn) close(btn.dataset.close || undefined);
    };
    dialog.showModal();
    onMount?.(dialog, close);
  });
}

export function confirmDialog({ title, text = '', confirm = 'Confirmar', cancel = 'Cancelar', danger = false }) {
  return modal(`
    <form method="dialog" class="modal__body modal__body--small">
      <h2 class="modal__title">${esc(title)}</h2>
      ${text ? `<p class="modal__text">${text}</p>` : ''}
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" data-close="">${esc(cancel)}</button>
        <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" type="button" data-close="ok">${esc(confirm)}</button>
      </div>
    </form>`).then((value) => value === 'ok');
}

/* ---------- Arquivos ---------- */
export function download(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// CSV com ";" e BOM (abre direto no Excel em português)
export function toCsv(rows) {
  const cell = (v) => {
    const s = String(v ?? '');
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n');
}

// Lê os campos de um <form> em um objeto simples (checkbox → boolean)
export function formValues(form) {
  const out = {};
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    if (el.type === 'checkbox') out[el.name] = el.checked;
    else if (el.type === 'radio') {
      if (el.checked) out[el.name] = el.value;
    } else out[el.name] = el.value.trim();
  }
  return out;
}

// Some com a mensagem de erro de um campo assim que ele é corrigido
export function bindErrorClear(form) {
  const clear = (event) => {
    const box = event.target.closest('.field, [data-photo]');
    if (!box) return;
    box.querySelectorAll('.field-error').forEach((e) => e.remove());
    box.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
  };
  form.addEventListener('input', clear);
  form.addEventListener('change', clear);
}

// Contadores de caracteres para campos com data-counter
export function bindCounters(root) {
  root.querySelectorAll('[data-counter]').forEach((input) => {
    const max = Number(input.dataset.counter);
    const out = document.createElement('span');
    out.className = 'counter';
    out.setAttribute('aria-hidden', 'true');
    const update = () => {
      out.textContent = `${input.value.length}/${max}`;
    };
    input.insertAdjacentElement('afterend', out);
    input.addEventListener('input', update);
    update();
  });
}

export const lines = (text) =>
  String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

export const list = (text) =>
  String(text || '')
    .split(/[,;\n]/)
    .map((l) => l.trim())
    .filter(Boolean);
