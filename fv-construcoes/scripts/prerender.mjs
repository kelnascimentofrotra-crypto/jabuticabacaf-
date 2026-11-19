/**
 * Pré-renderiza o app no dist/index.html (HTML completo para SEO e primeira pintura rápida)
 * e gera dados estruturados. Defina SITE_URL (ex.: https://www.fvconstrucoes.com.br) no build
 * para incluir canonical, og:url, imagem absoluta e sitemap.xml.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');

const { render, company } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const abs = (p) => (siteUrl ? `${siteUrl}/${p}` : p);

const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'HardwareStore',
  name: company.name,
  description:
    'Ferramentas, máquinas e equipamentos para profissionais, empresas e obras em Chapadinha - MA.',
  telephone: company.phone.e164,
  image: abs('og-image.jpg'),
  logo: abs('img/logo-fv.png'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.zip,
    addressCountry: 'BR',
  },
  areaServed: 'Chapadinha e região',
  ...(siteUrl ? { url: `${siteUrl}/` } : {}),
};

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace('<!--app-html-->', render());
html = html.replace('<!--jsonld-->', `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`);

const seo = siteUrl
  ? [
      `<link rel="canonical" href="${siteUrl}/" />`,
      `<meta property="og:url" content="${siteUrl}/" />`,
    ].join('\n    ')
  : '';
html = html.replace('<!--seo-extra-->', seo);
if (siteUrl) html = html.replace('content="og-image.jpg"', `content="${siteUrl}/og-image.jpg"`);

fs.writeFileSync(path.join(dist, 'index.html'), html);

if (siteUrl) {
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`
  );
  fs.appendFileSync(path.join(dist, 'robots.txt'), `Sitemap: ${siteUrl}/sitemap.xml\n`);
}

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pré-renderização concluída${siteUrl ? ` para ${siteUrl}` : ''}.`);
