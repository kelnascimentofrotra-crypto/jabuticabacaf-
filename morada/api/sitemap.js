// Vercel Function: /sitemap.xml com o endereço real do site (o domínio vem do próprio pedido)
module.exports = (req, res) => {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').replace(/[^a-z0-9.:-]/gi, '');
  const base = `https://${host}`;
  const today = new Date().toISOString().slice(0, 10);
  const pages = [['/', 'daily', '1.0'], ['/privacidade', 'yearly', '0.3']];
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
  res.statusCode = 200;
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, f, pr]) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);
};
