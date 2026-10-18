// Armazenamento local do painel (IndexedDB): rascunho do site, pedidos, clientes,
// respostas rápidas e configurações. Fica apenas neste navegador — use o backup
// em Configurações para levar os dados a outro aparelho.

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

// Chave-valor (rascunho, configurações, contadores)
export const kv = {
  get: (key) => run('kv', 'readonly', (s) => s.get(key)),
  set: (key, value) => run('kv', 'readwrite', (s) => s.put(value, key)),
  del: (key) => run('kv', 'readwrite', (s) => s.delete(key)),
};

// Coleções com `id`
export const collection = (name) => ({
  all: () => run(name, 'readonly', (s) => s.getAll()),
  get: (id) => run(name, 'readonly', (s) => s.get(id)),
  put: (item) => run(name, 'readwrite', (s) => s.put(item)),
  del: (id) => run(name, 'readwrite', (s) => s.delete(id)),
  clear: () => run(name, 'readwrite', (s) => s.clear()),
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
