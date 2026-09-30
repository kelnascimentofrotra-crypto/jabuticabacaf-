// Vercel Cron (1x por dia, veja "crons" no vercel.json): faz uma leitura simples no Supabase
// para o projeto do plano grátis não ser pausado por falta de uso. Só lê; não altera nada.
module.exports = async (req, res) => {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (!url || !key) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, erro: 'SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas' }));
    return;
  }
  const headers = { apikey: key };
  if (/^eyJ/.test(key)) headers.Authorization = `Bearer ${key}`;
  try {
    const r = await fetch(`${url}/rest/v1/configuracoes?select=id&limit=1`, { headers });
    res.statusCode = r.ok ? 200 : 502;
    res.end(JSON.stringify({ ok: r.ok, status: r.status, quando: new Date().toISOString() }));
  } catch (err) {
    res.statusCode = 502;
    res.end(JSON.stringify({ ok: false, erro: 'Supabase não respondeu' }));
  }
};
