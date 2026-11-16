// Acesso ao painel: uma conta (e-mail + senha com scrypt), sessão em cookie assinado.
// O registro da conta fica no armazenamento num caminho derivado do segredo do servidor,
// impossível de adivinhar de fora; a senha nunca é guardada, só o hash.
import crypto from 'node:crypto';
import { readJson, writeJson } from './store.js';

const SECRET = process.env.SMUG_SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN || '';
const KEY = crypto.createHash('sha256').update(`smug-admin:${SECRET}`).digest();
const ADMIN_PATH = `private/admin-${crypto.createHmac('sha256', KEY).update('admin-record').digest('hex').slice(0, 40)}.json`;
const COOKIE = 'smug_admin';
const SESSION_DAYS = 7;

export const authReady = () => Boolean(SECRET);

const scrypt = (password, salt) =>
  new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => (error ? reject(error) : resolve(key)))
  );

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  return { salt: salt.toString('base64'), hash: (await scrypt(password, salt)).toString('base64') };
}

export async function verifyPassword(password, record) {
  const hash = await scrypt(String(password || ''), Buffer.from(record.salt, 'base64'));
  const expected = Buffer.from(record.hash, 'base64');
  return hash.length === expected.length && crypto.timingSafeEqual(hash, expected);
}

export const safeEqual = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

/* ---------- Conta ---------- */
export async function getAdmin() {
  return (await readJson(ADMIN_PATH)) || null; // { data, etag }
}
export const saveAdmin = (record, etag) => writeJson(ADMIN_PATH, record, { etag });

export async function newAdminRecord(email, password, previous = {}) {
  const now = new Date().toISOString();
  return {
    email: String(email).trim().toLowerCase(),
    ...(await hashPassword(password)),
    version: crypto.randomUUID(), // muda a cada troca de senha: derruba sessões antigas
    createdAt: previous.createdAt || now,
    updatedAt: now,
  };
}

/* ---------- Sessão ---------- */
const sign = (payload) => crypto.createHmac('sha256', KEY).update(payload).digest('base64url');

export function sessionToken(admin) {
  const payload = Buffer.from(JSON.stringify({ e: admin.email, v: admin.version, x: Date.now() + SESSION_DAYS * 864e5 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readSession(req) {
  const raw = String(req.headers.cookie || '')
    .split(';')
    .map((part) => part.trim().split('='))
    .find(([name]) => name === COOKIE)?.[1];
  if (!raw) return null;
  const [payload, signature] = raw.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.x > Date.now() ? data : null;
  } catch {
    return null;
  }
}

// Conta logada (confere a versão da senha) ou null
export async function currentAdmin(req) {
  const session = readSession(req);
  if (!session) return null;
  const admin = await getAdmin();
  if (!admin || admin.data.version !== session.v || admin.data.email !== session.e) return null;
  return admin;
}

const secure = (req) => (req.headers['x-forwarded-proto'] === 'https' || !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host || '') ? '; Secure' : '');
export const sessionCookie = (req, admin) => `${COOKIE}=${sessionToken(admin)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}${secure(req)}`;
export const clearCookie = (req) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure(req)}`;

/* ---------- Tentativas de login (por endereço, nesta instância) ---------- */
const attempts = new Map();
export function loginBlocked(ip) {
  const entry = attempts.get(ip);
  return entry && entry.until > Date.now() ? Math.ceil((entry.until - Date.now()) / 1000) : 0;
}
export function loginFailed(ip) {
  const entry = attempts.get(ip) || { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= 5) entry.until = Date.now() + Math.min(15 * 60, 30 * 2 ** (entry.count - 5)) * 1000;
  attempts.set(ip, entry);
  if (attempts.size > 5000) attempts.clear();
}
export const loginSucceeded = (ip) => attempts.delete(ip);
