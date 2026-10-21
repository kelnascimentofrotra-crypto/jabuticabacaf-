import { defineConfig } from 'vite';

export default defineConfig({
  // caminhos relativos: o build funciona na raiz de um domínio ou numa subpasta
  base: './',
  build: {
    assetsInlineLimit: 0,
  },
});
