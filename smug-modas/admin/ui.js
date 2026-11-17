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

/* ---------- Campos de formulário (mesmo padrão do painel do Marcos) ---------- */
const attrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== false && v !== undefined && v !== null)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

const labelText = (label, required) => `<span>${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</span>`;
const hintText = (hint) => (hint ? `<small class="hint">${hint}</small>` : '');

export function field({ label, name, value = '', type = 'text', hint = '', required = false, placeholder = '', extra = {}, wide = false, counter = 0, money = false }) {
  const input = `<input ${attrs({ name, type, value, placeholder, required, maxlength: counter || undefined, 'data-counter': counter || undefined, ...extra })}>`;
  return `
    <label class="field${wide ? ' col-2' : ''}">
      ${labelText(label, required)}
      ${money ? `<span class="money"><em>R$</em>${input}</span>` : input}
      ${hintText(hint)}<small class="err"></small>
    </label>`;
}

export function textarea({ label, name, value = '', hint = '', rows = 4, required = false, placeholder = '', counter = 0, wide = true }) {
  return `
    <label class="field${wide ? ' col-2' : ''}">
      ${labelText(label, required)}
      <textarea ${attrs({ name, rows, placeholder, required, maxlength: counter || undefined, 'data-counter': counter || undefined })}>${esc(value)}</textarea>
      ${hintText(hint)}<small class="err"></small>
    </label>`;
}

export function select({ label, name, value = '', options, hint = '', required = false, wide = false }) {
  return `
    <label class="field${wide ? ' col-2' : ''}">
      ${labelText(label, required)}
      <select ${attrs({ name, required })}>
        ${options.map((o) => `<option value="${esc(o.value)}"${String(o.value) === String(value) ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}
      </select>
      ${hintText(hint)}<small class="err"></small>
    </label>`;
}

export function toggle({ label, name, checked = false, hint = '' }) {
  return `
    <div class="field col-2">
      <label class="switch"><input type="checkbox" role="switch" ${attrs({ name, checked })}><span class="switch-ui" aria-hidden="true"></span><span>${label}</span></label>
      ${hintText(hint)}
    </div>`;
}

/* ---------- Ícones ---------- */
const ICONS = {
  dash: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/>',
  home: '<path d="M4 11.5 12 5l8 6.5V19H4z"/>',
  posts: '<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 14.5 8 10l4 4 2.5-2.5 6 6"/><circle cx="15.5" cy="8.5" r="1.6"/>',
  hanger: '<path d="M10 5.5a2 2 0 1 1 2 2v1.3"/><path d="M12 8.8 3.4 15.4a1 1 0 0 0 .6 1.8h16a1 1 0 0 0 .6-1.8L12 8.8"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2"/><circle cx="12" cy="12" r="6.6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.2"/><path d="M15.5 5.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h.5"/>',
  up: '<path d="M5 15l7-7 7 7"/>',
  down: '<path d="M5 9l7 7 7-7"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.9 5.8A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.9 3.7M6.6 7.2C4 8.9 2.5 12 2.5 12S6 18.5 12 18.5c1.7 0 3.2-.5 4.5-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2M4 4l16 16"/>',
  whatsapp: '<path d="M12 3.2a8.6 8.6 0 0 0-7.4 13l-1.2 4.4 4.5-1.2A8.6 8.6 0 1 0 12 3.2z"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5-5 4 4 2.5-2.5L20 19"/>',
  upload: '<path d="M12 16V5M7.5 9.5 12 5l4.5 4.5M5 19h14"/>',
  swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  external: '<path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 4 2.8 20h18.4zM12 10v4.5M12 17.3v.2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  bag: '<path d="M5.5 8.5h13l-1 11h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  out: '<path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
  moon: '<path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7.5 7.5 5.5 7.5-5.5"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20.2a7 7 0 0 1 14 0"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
export const ico = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

// Marca SMUG MODAS (mesma do site: S + linha + SMUG/MODAS)
export const BRAND = '<span class="brand" aria-hidden="true"><span class="brand-mark">S</span><span class="brand-rule"></span><span class="brand-type"><span class="brand-name">SMUG</span><span class="brand-sub">MODAS</span></span></span>';

/* ---------- Avisos e janelas ---------- */
export function toast(message, type = 'success', timeout = 4600) {
  const box = document.querySelector('[data-toasts]');
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `${ico(type === 'error' ? 'alert' : type === 'info' ? 'alert' : 'check')}<span></span>`;
  el.querySelector('span').textContent = message;
  box.append(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => {
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 300);
  }, timeout);
}

// Abre o <dialog> do painel com o HTML informado. Resolve com o valor de `close(value)`.
export function modal(html, { onMount } = {}) {
  const dialog = document.querySelector('[data-modal]');
  const opener = document.activeElement;
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
    <h2>${esc(title)}</h2>
    ${text ? `<p>${text}</p>` : ''}
    <div class="modal-actions">
      <button class="btn" type="button" data-close="">${esc(cancel)}</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" type="button" data-close="ok">${esc(confirm)}</button>
    </div>`).then((value) => value === 'ok');
}

// Lê os campos de um <form> em um objeto simples (checkbox → boolean)
export function formValues(form) {
  const out = {};
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    if (el.type === 'checkbox') {
      if (el.name in out && typeof out[el.name] !== 'boolean') continue;
      out[el.name] = el.checked;
    } else if (el.type === 'radio') {
      if (el.checked) out[el.name] = el.value;
    } else out[el.name] = el.value.trim();
  }
  return out;
}

// O aviso de erro de um campo some assim que ele é corrigido
export function bindErrorClear(form) {
  const clear = (event) => {
    const box = event.target.closest('.field, .photo-slot');
    if (!box) return;
    box.classList.remove('has-error');
    const err = box.querySelector('.err');
    if (err) err.textContent = '';
    box.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
  };
  form.addEventListener('input', clear);
  form.addEventListener('change', clear);
}

// Contadores de caracteres para campos com data-counter
export function bindCounters(root) {
  root.querySelectorAll('[data-counter]').forEach((input) => {
    const max = Number(input.dataset.counter);
    const out = document.createElement('small');
    out.className = 'counter';
    out.setAttribute('aria-hidden', 'true');
    const update = () => {
      out.textContent = `${input.value.length}/${max}`;
    };
    (input.closest('.money') || input).insertAdjacentElement('afterend', out);
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
