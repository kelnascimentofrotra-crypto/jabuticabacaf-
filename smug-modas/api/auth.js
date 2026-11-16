// /api/auth — status do acesso, ativação (primeiro acesso), login, saída e troca de senha.
import { send, fail, sameOrigin, readBody, clientIp, handler } from './_lib/http.js';
import {
  authReady, getAdmin, saveAdmin, newAdminRecord, verifyPassword, currentAdmin, sessionCookie, clearCookie,
  safeEqual, loginBlocked, loginFailed, loginSucceeded,
} from './_lib/auth.js';
import { storageReady, ConflictError } from './_lib/store.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normalizeCode = (code) => String(code || '').replace(/\s+/g, '').toUpperCase();

export default handler(async (req, res) => {
  if (!storageReady() || !authReady()) return fail(res, 503, 'O armazenamento do painel ainda não foi configurado na Vercel.');

  if (req.method === 'GET') {
    const admin = await getAdmin();
    const logged = admin ? await currentAdmin(req) : null;
    return send(res, 200, { authenticated: Boolean(logged), email: logged?.data.email || '', setupRequired: !admin });
  }
  if (req.method !== 'POST') return fail(res, 405, 'Método não permitido.');
  if (!sameOrigin(req)) return fail(res, 403, 'Origem não permitida.');

  const body = await readBody(req, 64 * 1024);
  const ip = clientIp(req);

  if (body.action === 'logout') {
    return send(res, 200, { authenticated: false }, { 'Set-Cookie': clearCookie(req) });
  }

  if (body.action === 'setup') {
    const expected = normalizeCode(process.env.ADMIN_SETUP_CODE);
    if (!expected) return fail(res, 503, 'Código de ativação não configurado na Vercel.');
    if (await getAdmin()) return fail(res, 409, 'O acesso ao painel já foi criado. Entre com o seu e-mail e senha.');
    const blocked = loginBlocked(ip);
    if (blocked) return fail(res, 429, `Muitas tentativas. Tente de novo em ${blocked} s.`);
    if (!safeEqual(normalizeCode(body.code), expected)) {
      loginFailed(ip);
      return fail(res, 403, 'Código de ativação incorreto.');
    }
    if (!EMAIL.test(String(body.email || '').trim())) return fail(res, 400, 'Digite um e-mail válido.');
    if (String(body.password || '').length < 8) return fail(res, 400, 'A senha precisa ter pelo menos 8 caracteres.');
    const record = await newAdminRecord(body.email, body.password);
    try {
      await saveAdmin(record, null);
    } catch (error) {
      if (error instanceof ConflictError) return fail(res, 409, 'O acesso ao painel já foi criado.');
      throw error;
    }
    loginSucceeded(ip);
    return send(res, 200, { authenticated: true, email: record.email }, { 'Set-Cookie': sessionCookie(req, record) });
  }

  if (body.action === 'login') {
    const blocked = loginBlocked(ip);
    if (blocked) return fail(res, 429, `Muitas tentativas. Tente de novo em ${blocked} s.`);
    const admin = await getAdmin();
    if (!admin) return fail(res, 409, 'O painel ainda não foi ativado.', { setupRequired: true });
    const emailOk = String(body.email || '').trim().toLowerCase() === admin.data.email;
    const passwordOk = await verifyPassword(body.password, admin.data); // sempre calcula: tempo igual
    if (!emailOk || !passwordOk) {
      loginFailed(ip);
      return fail(res, 401, 'E-mail ou senha incorretos.');
    }
    loginSucceeded(ip);
    return send(res, 200, { authenticated: true, email: admin.data.email }, { 'Set-Cookie': sessionCookie(req, admin.data) });
  }

  if (body.action === 'password') {
    const admin = await currentAdmin(req);
    if (!admin) return fail(res, 401, 'Sua sessão expirou. Entre de novo.');
    if (!(await verifyPassword(body.current, admin.data))) return fail(res, 403, 'Senha atual incorreta.');
    const email = String(body.email || admin.data.email).trim();
    if (!EMAIL.test(email)) return fail(res, 400, 'Digite um e-mail válido.');
    // Nova senha em branco: só o e-mail muda e a senha atual (já conferida) continua valendo
    const password = String(body.password || '') || String(body.current || '');
    if (password.length < 8) return fail(res, 400, 'A nova senha precisa ter pelo menos 8 caracteres.');
    const record = await newAdminRecord(email, password, admin.data);
    try {
      await saveAdmin(record, admin.etag);
    } catch (error) {
      if (error instanceof ConflictError) return fail(res, 409, 'A conta foi alterada em outro aparelho. Entre de novo.');
      throw error;
    }
    return send(res, 200, { authenticated: true, email: record.email }, { 'Set-Cookie': sessionCookie(req, record) });
  }

  return fail(res, 400, 'Ação inválida.');
});
