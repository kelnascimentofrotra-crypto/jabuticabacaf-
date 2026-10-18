// Armazenamento local do painel (IndexedDB): rascunho do site, pedidos, clientes,
// respostas rápidas e configurações. Fica apenas neste navegador — use o backup
// em Configurações para levar os dados a outro aparelho.
// Pedidos, clientes, respostas, rascunho e token ficam criptografados com a chave do login.
import { encrypt, decrypt, encryptWith, decryptWith, setKey } from './auth.js';

const DB_NAME = 'smug-admin';
const DB_VERSION = 1;
const COLLECTIONS = ['orders', 'customers', 'templates'];

let dbPromise;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Este navegador não permite salvar dados locais.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      for (const name of COLLECTIONS) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Não foi possível abrir o armazenamento local.'));
  });
  return dbPromise;
}

async function run(store, mode, action) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const result = action(tx.objectStore(store));
    tx.oncomplete = () => resolve(result?.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Operação cancelada.'));
  });
}

// Registro guardado: { id, enc: { iv, data } }. Registros antigos (sem `enc`) são lidos como estão
// e recriptografados por `encryptLegacy` depois do login.
const SECRET_KV = ['draft', 'ghToken'];
const open_ = async (record) => (record && record.enc ? decrypt(record.enc) : record);

// Chave-valor (configurações e contadores em texto; rascunho e token criptografados)
export const kv = {
  get: (key) => run('kv', 'readonly', (s) => s.get(key)),
  set: (key, value) => run('kv', 'readwrite', (s) => s.put(value, key)),
  del: (key) => run('kv', 'readwrite', (s) => s.delete(key)),
  getSecret: async (key) => open_(await run('kv', 'readonly', (s) => s.get(key))),
  setSecret: async (key, value) => {
    const box = { enc: await encrypt(value) };
    return run('kv', 'readwrite', (s) => s.put(box, key));
  },
};

// Coleções com `id` (conteúdo criptografado)
export const collection = (name) => ({
  all: async () => Promise.all((await run(name, 'readonly', (s) => s.getAll())).map(open_)),
  get: async (id) => open_(await run(name, 'readonly', (s) => s.get(id))),
  put: async (item) => {
    const box = { id: item.id, enc: await encrypt(item) };
    return run(name, 'readwrite', (s) => s.put(box));
  },
  del: (id) => run(name, 'readwrite', (s) => s.delete(id)),
  clear: () => run(name, 'readwrite', (s) => s.clear()),
  raw: () => run(name, 'readonly', (s) => s.getAll()),
});

export const orders = collection('orders');
export const customers = collection('customers');
export const templates = collection('templates');

// Backup completo dos dados locais (sem o token do GitHub).
export async function exportBackup(settings) {
  return {
    app: 'smug-admin',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    orders: await orders.all(),
    customers: await customers.all(),
    templates: await templates.all(),
    orderSeq: (await kv.get('orderSeq')) || 0,
  };
}

// Campos usados em classes e números na tela: só valores conhecidos entram.
const ORDER_STATUSES = ['novo', 'confirmado', 'pago', 'enviado', 'entregue', 'cancelado'];
const sanitize = {
  orders: (o) => ({ ...o, id: String(o.id), number: Number.parseInt(o.number, 10) || 0, status: ORDER_STATUSES.includes(o.status) ? o.status : 'novo', items: Array.isArray(o.items) ? o.items : [] }),
  customers: (c) => ({ ...c, id: String(c.id), name: String(c.name || '') }),
  templates: (t) => ({ ...t, id: String(t.id), title: String(t.title || ''), text: String(t.text || '') }),
};

export async function importBackup(data, { replace = false } = {}) {
  if (!data || data.app !== 'smug-admin') throw new Error('Arquivo de backup inválido.');
  for (const [name, store] of [['orders', orders], ['customers', customers], ['templates', templates]]) {
    if (!Array.isArray(data[name])) continue;
    if (replace) await store.clear();
    for (const item of data[name]) if (item && item.id) await store.put(sanitize[name](item));
  }
  const seq = Math.max((await kv.get('orderSeq')) || 0, data.orderSeq || 0);
  await kv.set('orderSeq', seq);
  // configurações aceitas do backup (o token nunca faz parte dele)
  const allowed = ['owner', 'repo', 'branch', 'dir', 'inboxUrl'];
  return data.settings ? Object.fromEntries(Object.entries(data.settings).filter(([k, v]) => allowed.includes(k) && typeof v === 'string' && (k !== 'inboxUrl' || !v || v.startsWith('https://')))) : undefined;
}

export async function nextOrderNumber() {
  const seq = ((await kv.get('orderSeq')) || 0) + 1;
  await kv.set('orderSeq', seq);
  return seq;
}

export async function clearLocalData() {
  for (const store of [orders, customers, templates]) await store.clear();
  await kv.del('orderSeq');
}

/* ---------- Login ---------- */
export const getAuth = () => kv.get('auth');
export const saveAuth = (record) => kv.set('auth', record);

// Depois do primeiro login: criptografa o que ainda estiver em texto (dados de antes do login)
export async function encryptLegacy() {
  for (const store of [orders, customers, templates]) {
    for (const record of await store.raw()) if (record && !record.enc) await store.put(record);
  }
  for (const key of SECRET_KV) {
    const value = await kv.get(key);
    if (value !== undefined && !(value && value.enc)) await kv.setSecret(key, value);
  }
}

// Troca de senha: tudo é lido com a chave antiga, criptografado com a nova e gravado — junto com o
// novo registro de acesso — numa única transação (ou tudo muda, ou nada muda).
export async function reencryptAll(oldKey, newKey, authRecord) {
  const read = async (record) => (record && record.enc ? decryptWith(oldKey, record.enc) : record);
  const lock = async (value) => ({ enc: await encryptWith(newKey, value) });
  const boxes = {};
  for (const name of COLLECTIONS) {
    const items = (await Promise.all((await collection(name).raw()).map(read))).filter((item) => item?.id);
    boxes[name] = await Promise.all(items.map(async (item) => ({ id: item.id, ...(await lock(item)) })));
  }
  const secrets = {};
  for (const key of SECRET_KV) {
    const value = await kv.get(key);
    if (value !== undefined) secrets[key] = await lock(await read(value));
  }
  const db = await open();
  await new Promise((resolve, reject) => {
    const tx = db.transaction([...COLLECTIONS, 'kv'], 'readwrite');
    for (const name of COLLECTIONS) for (const box of boxes[name]) tx.objectStore(name).put(box);
    const store = tx.objectStore('kv');
    for (const [key, box] of Object.entries(secrets)) store.put(box, key);
    store.put(authRecord, 'auth');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Operação cancelada.'));
  });
  setKey(newKey);
}

// "Esqueci a senha": sem a senha não há como abrir os dados criptografados — apaga tudo deste aparelho.
export async function resetDevice() {
  for (const name of COLLECTIONS) await collection(name).clear();
  for (const key of [...SECRET_KV, 'auth', 'authFail', 'orderSeq', 'templatesSeeded']) await kv.del(key);
}
