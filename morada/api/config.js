// Vercel Function: entrega ao navegador o endereço do Supabase e a chave PÚBLICA (anon / publishable).
// Os valores ficam nas variáveis de ambiente da Vercel, nunca no código.
// A chave service_role / secret NUNCA deve ser usada aqui: se ela for colocada por engano,
// esta função se recusa a enviá-la.
function isSecretKey(key) {
  if (/^sb_secret_/i.test(key)) return true;
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'));
    return payload.role === 'service_role';
  } catch (_) {
    return false;
  }
}

module.exports = (req, res) => {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (anonKey && isSecretKey(anonKey)) {
    res.statusCode = 500;
    res.end(JSON.stringify({ url: null, anonKey: null, error: 'SUPABASE_ANON_KEY contém uma chave secreta. Use a chave anon/publishable.' }));
    return;
  }
  res.statusCode = 200;
  res.end(JSON.stringify({ url: url || null, anonKey: anonKey || null }));
};
