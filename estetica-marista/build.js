// Gera dist/index.html: o site inteiro num único arquivo (CSS, JS, fontes e imagens embutidos).
// Uso: node build.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p));
const dataUri = (p, mime) => `data:${mime};base64,${read(p).toString('base64')}`;

let html = read('index.html').toString('utf8');
let css = read('css/style.css').toString('utf8');
const js = read('js/main.js').toString('utf8');

css = css.replace(/url\("\.\.\/fonts\/([^"]+)"\)/g, (_, f) => `url("${dataUri('fonts/' + f, 'font/woff2')}")`);

html = html
  .replace(/^\s*<link rel="preload"[^>]*>\n/gm, '')
  .replace('<link rel="icon" href="img/logo.svg" type="image/svg+xml">', `<link rel="icon" href="${dataUri('img/logo.svg', 'image/svg+xml')}" type="image/svg+xml">`)
  .replace('<link rel="stylesheet" href="css/style.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script src="js/main.js"></script>', () => `<script>\n${js}\n</script>`)
  .replace(/src="(img\/[^"]+\.webp)"/g, (_, p) => `src="${dataUri(p, 'image/webp')}"`);

for (const leftover of ['href="css/', 'src="js/', 'src="img/', '../fonts/']) {
  if (html.includes(leftover)) throw new Error('Arquivo não embutido: ' + leftover);
}

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist/index.html'), html);
console.log(`dist/index.html gerado (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
