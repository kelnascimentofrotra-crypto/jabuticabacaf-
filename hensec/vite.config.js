import { defineConfig } from 'vite';

/**
 * O build também precisa abrir com dois cliques no index.html (file://).
 * Nesse modo o navegador bloqueia <script type="module"> e qualquer arquivo
 * pedido com `crossorigin`. Como o bundle é um único arquivo, sem import nem
 * export, ele roda igual como script clássico com `defer`.
 */
function openFromDisk() {
  return {
    name: 'open-from-disk',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin src=/g, '<script defer src=')
        .replace(/<link rel="stylesheet" crossorigin href=/g, '<link rel="stylesheet" href=');
    },
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && (chunk.imports.length || chunk.exports.length)) {
          this.error(`${chunk.fileName} tem import/export e não roda como script clássico.`);
        }
      }
    },
  };
}

export default defineConfig({
  // caminhos relativos: o build funciona na raiz de um domínio, numa subpasta ou direto do disco
  base: './',
  plugins: [openFromDisk()],
  build: {
    assetsInlineLimit: 0,
    modulePreload: false,
  },
});
