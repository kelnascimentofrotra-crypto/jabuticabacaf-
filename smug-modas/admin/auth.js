// Login do painel. Sem servidor, a senha não é conferida em lugar nenhum fora deste aparelho:
// ela gera (PBKDF2, 310 mil iterações) a chave AES-GCM que criptografa os dados guardados aqui —
// pedidos, clientes, respostas prontas, rascunho do site e o token do GitHub.
// Sem a senha certa, esses dados não podem ser lidos e o painel não publica.

const ITERATIONS = 310000;
const VERIFIER_TEXT = 'smug-admin-ok';
const SESSION_KEY = 'smug-admin-session';
export const IDLE_LIMIT_MS = 60 * 60 * 1000; // sai sozinho após 1 hora sem uso

const enc = new TextEncoder();
const dec = new TextDecoder();

export function toB64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
export const fromB64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

let key = null;

export const hasKey = () => Boolean(key);
export const supported = () => Boolean(window.crypto?.subtle && window.isSecureContext);

async function deriveKey(password, salt, iterations = ITERATIONS) {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function encryptWith(cryptoKey, value) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, enc.encode(JSON.stringify(value)));
  return { iv: toB64(iv), data: toB64(data) };
}
export async function decryptWith(cryptoKey, box) {
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(box.iv) }, cryptoKey, fromB64(box.data));
  return JSON.parse(dec.decode(plain));
}
export const encrypt = (value) => encryptWith(key, value);
export const decrypt = (box) => decryptWith(key, box);

// Cria o registro de acesso (e-mail + verificador criptografado) para uma senha nova.
export async function createAuth(email, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const newKey = await deriveKey(password, salt);
  return {
    key: newKey,
    record: {
      v: 1,
      email: email.trim().toLowerCase(),
      salt: toB64(salt),
      iterations: ITERATIONS,
      verifier: await encryptWith(newKey, VERIFIER_TEXT),
      createdAt: new Date().toISOString(),
    },
  };
}

// Confere e-mail e senha contra o registro. Retorna a chave ou null.
export async function checkPassword(record, email, password) {
  if (email.trim().toLowerCase() !== record.email) {
    // mesmo custo de tempo de uma senha errada, para não revelar qual campo está incorreto
    await deriveKey(password, fromB64(record.salt), record.iterations);
    return null;
  }
  const candidate = await deriveKey(password, fromB64(record.salt), record.iterations);
  try {
    return (await decryptWith(candidate, record.verifier)) === VERIFIER_TEXT ? candidate : null;
  } catch {
    return null;
  }
}

/* ---------- Sessão (aba atual) ---------- */
export async function startSession(cryptoKey, email) {
  key = cryptoKey;
  const raw = await crypto.subtle.exportKey('raw', cryptoKey);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ k: toB64(raw), email, at: Date.now() }));
}

export function setKey(cryptoKey) {
  key = cryptoKey;
}

// Retoma a sessão desta aba (recarregar a página não pede a senha de novo).
export async function resumeSession(record) {
  const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  if (!saved || saved.email !== record.email) return false;
  if (Date.now() - saved.at > IDLE_LIMIT_MS) {
    endSession('idle');
    return false;
  }
  try {
    const candidate = await crypto.subtle.importKey('raw', fromB64(saved.k), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
    if ((await decryptWith(candidate, record.verifier)) !== VERIFIER_TEXT) return false;
    key = candidate;
    touch();
    return true;
  } catch {
    endSession();
    return false;
  }
}

let lastTouch = 0;
export function touch() {
  const now = Date.now();
  if (now - lastTouch < 15000) return;
  lastTouch = now;
  const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  if (saved) sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...saved, at: now }));
}
export function sessionExpired() {
  const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  return !saved || Date.now() - saved.at > IDLE_LIMIT_MS;
}

export function endSession(reason = '') {
  key = null;
  sessionStorage.removeItem(SESSION_KEY);
  if (reason) sessionStorage.setItem('smug-admin-logout', reason);
}
export function takeLogoutReason() {
  const reason = sessionStorage.getItem('smug-admin-logout');
  sessionStorage.removeItem('smug-admin-logout');
  return reason;
}

// Força da senha: 0 a 4 (só orientação visual)
export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, score);
}
