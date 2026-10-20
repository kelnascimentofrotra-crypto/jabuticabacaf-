#!/usr/bin/env node
/**
 * Gera index.html a partir de src/site.config.mjs e src/content.mjs.
 * Sem dependências: `node build.mjs`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import config from './src/site.config.mjs';
import * as content from './src/content.mjs';
import { normalizeWhatsappNumber, escapeHtml as e } from './src/lib.mjs';
import { heroNative, heroArt, scene, dialogs, footer } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));

const ctx = {
  config,
  wa: normalizeWhatsappNumber(config.whatsappNumber),
  ...content,
};

const heroArtOn = config.hero.showOriginalArt === true;
const claimValidated = config.claims.heroPercentValidated === true;

// Dados que o JS do navegador precisa para os fluxos dinâmicos.
const runtime = {
  wa: ctx.wa,
  messages: config.messages,
};

const title = `${config.brand.name} — Seu telhado pode render mais`;
const description =
  'Energia solar para casa, empresa e campo: entenda as soluções, veja como funciona e converse com a equipe pelo WhatsApp.';

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${e(title)}</title>
  <meta name="description" content="${e(description)}">
  <meta name="theme-color" content="#071A2A">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/styles.css">
  <script>document.documentElement.classList.add('js');</script>
  <script src="js/app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <main id="conteudo">
${heroArtOn ? heroArt(ctx) : heroNative(ctx)}
${['solucoes', 'como-funciona', 'projetos', 'duvidas', 'contato'].map((id) => scene(ctx, id)).join('\n')}
  </main>
${footer(ctx)}
${dialogs(ctx)}
  <script type="application/json" id="site-data">${JSON.stringify(runtime).replaceAll('<', '\\u003c')}</script>
</body>
</html>
`;

writeFileSync(join(root, 'index.html'), html.replace(/[ \t]+$/gm, ''));
console.log(
  `index.html gerado — hero: ${heroArtOn ? 'arte original com a casa' : 'copy segura em HTML'}; ` +
    `WhatsApp: ${ctx.wa ? `+${ctx.wa}` : 'pendente'}.`,
);
if (heroArtOn && !claimValidated) {
  console.warn('Pendência: a arte da hero diz "Até 90%". Valide o percentual com a empresa antes de publicar.');
}
if (!ctx.wa) console.warn('Pendência: whatsappNumber vazio — os botões mostram o aviso de configuração.');
