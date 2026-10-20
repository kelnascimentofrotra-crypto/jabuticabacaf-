// Testes no navegador: `npm run test:e2e` (requer o pacote playwright).
// Sobe um servidor estático próprio e valida as interações reais do site.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    failures++;
    console.log(`FAIL ${name}\n     ${err.message.split('\n').join('\n     ')}`);
  }
}
async function open(viewport, opts = {}) {
  const context = await browser.newContext({ viewport, ...opts });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  page.errors = errors;
  return page;
}
const settle = (page, ms = 650) => page.waitForTimeout(ms);

/* ---------- desktop ---------- */
{
  const page = await open({ width: 1440, height: 900 });

  await check('sem erros de JS e sem rolagem horizontal', async () => {
    assert.deepEqual(page.errors, []);
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    assert.equal(sw, cw);
  });

  await check('artes inteiras: proporção 1672/941 e nenhuma escala aplicada', async () => {
    for (const id of ['inicio', 'solucoes', 'como-funciona', 'projetos', 'duvidas', 'contato']) {
      await page.locator(`#${id} .stage`).scrollIntoViewIfNeeded();
      const r = await page.evaluate((sel) => {
        const img = document.querySelector(sel);
        return {
          w: img.getBoundingClientRect().width,
          h: img.getBoundingClientRect().height,
          natural: img.naturalWidth,
          transform: getComputedStyle(img).transform,
          fit: getComputedStyle(img).objectFit,
        };
      }, `#${id} .stage img`);
      assert.ok(Math.abs(r.w / r.h - 1672 / 941) < 0.003, `${id}: ${r.w}x${r.h}`);
      assert.equal(r.natural >= 1280, true, `${id}: carregou a versão desktop`);
      assert.equal(r.transform, 'none');
      assert.equal(r.fit, 'contain');
    }
  });

  await check('hero: a casa aparece inteira dentro da primeira tela', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const b = await page.locator('#inicio .stage img').boundingBox();
    assert.ok(b.y >= 0 && b.y + b.height <= 900 + 0.5, `hero de ${b.y} a ${b.y + b.height}`);
    assert.ok(b.x >= 0 && b.x + b.width <= 1440 + 0.5);
  });

  await check('linha "Empresarial" da arte abre o painel real com a opção marcada', async () => {
    await page.locator('#solucoes .hotspots--d [data-item="empresarial"]').click();
    await settle(page);
    assert.equal(await page.locator('#deck-dialog').evaluate((d) => d.open), true);
    assert.equal(await page.locator('#deck-dialog input[value="empresarial"]').isChecked(), true);
    assert.match(await page.locator('#deck-dialog [data-msg="solucao"]').textContent(), /imóvel empresarial/);
  });

  await check('Escape fecha o painel e devolve o foco ao hotspot', async () => {
    await page.keyboard.press('Escape');
    await settle(page);
    assert.equal(await page.locator('#deck-dialog').evaluate((d) => d.open), false);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-item')), 'empresarial');
    // o painel voltou para a seção
    assert.equal(await page.locator('#solucoes .deck-slot #deck-solucoes').count(), 1);
  });

  await check('pergunta 3 da arte abre o FAQ com a resposta expandida', async () => {
    await page.locator('#duvidas .hotspots--d [data-item="3"]').click();
    await settle(page);
    assert.equal(await page.locator('#faq-b-3').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#faq-a-3').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'faq-b-3');
  });

  await check('accordion abre e fecha com aria-expanded', async () => {
    await page.locator('#faq-b-2').click();
    await settle(page, 500);
    assert.equal(await page.locator('#faq-b-2').getAttribute('aria-expanded'), 'true');
    await page.locator('#faq-b-2').click();
    await settle(page, 600);
    assert.equal(await page.locator('#faq-b-2').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('#faq-a-2').evaluate((el) => getComputedStyle(el).display), 'none');
  });

  await check('busca sem acento encontra "instalação" e informa a contagem', async () => {
    await page.locator('#faq-busca').fill('INSTALACAO');
    const visible = await page.locator('#deck-dialog .faq-item:not([hidden])').count();
    assert.equal(visible, 1);
    assert.match(await page.locator('#faq-status').textContent(), /1 pergunta encontrada/);
  });

  await check('busca sem resultado mostra aviso, permite limpar e mantém o CTA', async () => {
    await page.locator('#faq-busca').fill('bateria de lítio');
    assert.equal(await page.locator('.faq-empty').isVisible(), true);
    assert.equal(await page.locator('#deck-dialog .deck__cta .btn--blue').isVisible(), true);
    await page.locator('.faq-search__clear').click();
    assert.equal(await page.locator('#deck-dialog .faq-item:not([hidden])').count(), 5);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'faq-busca');
    await page.keyboard.press('Escape'); // busca vazia: Escape fecha o painel
    await settle(page);
    assert.equal(await page.locator('#deck-dialog').evaluate((d) => d.open), false);
  });

  await check('atalho "/" abre a busca, mas não interfere em quem está digitando', async () => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('/');
    await settle(page);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'faq-busca');
    await page.keyboard.type('a/b');
    assert.equal(await page.locator('#faq-busca').inputValue(), 'a/b');
    await page.locator('#faq-busca').fill('');
    await page.keyboard.press('Escape');
    await settle(page);
  });

  await check('abas de projetos: setas do teclado, rótulo do CTA e vitrine 01 / 01', async () => {
    await page.locator('#projetos .hotspots--d [data-item="residencial"]').click();
    await settle(page);
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#tab-empresarial').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#painel-empresarial').isVisible(), true);
    assert.match(await page.locator('[data-proj-cta] .btn__label').textContent(), /projeto empresarial/);
    await page.keyboard.press('Home');
    assert.match(await page.locator('#painel-residencial .carousel__count').textContent(), /01\s*\/\s*01/);
    assert.equal(await page.locator('#painel-residencial [data-next]').isDisabled(), true);
    await page.keyboard.press('Escape');
    await settle(page);
  });

  await check('pré-análise: exige escolha, monta a mensagem e não finge envio', async () => {
    await page.locator('#inicio [data-action="analise"]').first().click();
    await settle(page);
    assert.equal(await page.locator('#analise-dialog [data-back]').isVisible(), false);
    await page.locator('#analise-dialog [data-next]').click();
    assert.equal(await page.locator('#analise-dialog .flow__error').isVisible(), true);
    await page.locator('#analise-dialog .choice', { hasText: 'Rural' }).click();
    await page.locator('#analise-dialog [data-next]').click();
    await page.locator('#analise-dialog .choice', { hasText: 'De R$ 300 a R$ 700' }).click();
    await page.locator('#analise-dialog [data-next]').click();
    const msg = await page.locator('#analise-dialog [data-msg="analise"]').textContent();
    assert.match(msg, /Perfil do imóvel: Rural/);
    assert.match(msg, /Faixa da conta de luz: De R\$ 300 a R\$ 700/);
    await page.locator('#analise-dialog [data-next]').click();
    await settle(page);
    // sem número configurado: aviso honesto, nenhuma página do WhatsApp aberta
    assert.equal(await page.locator('#wa-dialog').evaluate((d) => d.open), true);
    assert.equal(await page.locator('#wa-dialog [data-wa-msg]').textContent(), msg);
    assert.equal(page.context().pages().length, 1);
    await page.keyboard.press('Escape');
    await settle(page);
    assert.equal(await page.locator('#analise-dialog').evaluate((d) => d.open), true);
    await page.keyboard.press('Escape');
    await settle(page);
  });

  await check('links do menu desenhado levam à seção certa', async () => {
    await page.locator('#contato .hotspots--d a[href="#como-funciona"]').click();
    await page.waitForTimeout(1400);
    const top = await page.locator('#como-funciona').evaluate((s) => s.getBoundingClientRect().top);
    assert.ok(Math.abs(top) < 4, `topo em ${top}`);
  });

  await page.context().close();
}

/* ---------- celular ---------- */
{
  const page = await open({ width: 390, height: 844 }, { hasTouch: true, isMobile: true });

  await check('celular: carrega as artes mobile inteiras', async () => {
    await page.locator('#solucoes .stage').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const img = document.querySelector('#solucoes .stage img');
      const b = img.getBoundingClientRect();
      return { ratio: b.width / b.height, natural: img.naturalWidth, w: b.width };
    });
    assert.ok(Math.abs(r.ratio - 934 / 1683) < 0.003);
    assert.equal(r.w, 390);
    assert.ok(r.natural <= 934);
  });

  await check('celular: botão de menu da arte abre o menu; link leva à seção e fecha', async () => {
    await page.locator('#solucoes .hotspots--m [data-action="menu"]').click();
    await settle(page);
    assert.equal(await page.locator('#menu-dialog').evaluate((d) => d.open), true);
    await page.locator('#menu-dialog a[href="#projetos"]').click();
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('#menu-dialog').evaluate((d) => d.open), false);
    const top = await page.locator('#projetos').evaluate((s) => s.getBoundingClientRect().top);
    assert.ok(Math.abs(top) < 4, `topo em ${top}`);
  });

  await check('celular: linha "Rural" da arte leva ao painel nativo já selecionado', async () => {
    await page.locator('#solucoes .hotspots--m [data-item="rural"]').click();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('#deck-solucoes input[value="rural"]').isChecked(), true);
    const top = await page.locator('#solucoes .scene__native').evaluate((s) => s.getBoundingClientRect().top);
    assert.ok(top > -10 && top < 120, `painel em ${top}`);
  });

  await check('celular: sem rolagem horizontal', async () => {
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    assert.equal(sw, cw);
  });

  await page.context().close();
}

/* ---------- movimento reduzido e sem JS ---------- */
{
  const page = await open({ width: 1440, height: 900 }, { reducedMotion: 'reduce' });
  await check('movimento reduzido: nenhum estado oculto de entrada', async () => {
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('reveal-on')), false);
    const opacity = await page.locator('#contato .stage').evaluate((el) => getComputedStyle(el).opacity);
    assert.equal(opacity, '1');
  });
  await page.context().close();

  const nojs = await open({ width: 1440, height: 900 }, { javaScriptEnabled: false });
  await check('sem JS: painéis e respostas do FAQ continuam visíveis', async () => {
    assert.equal(await nojs.locator('#deck-duvidas').isVisible(), true);
    assert.equal(await nojs.locator('#faq-a-5').isVisible(), true);
    assert.equal(await nojs.locator('#contato .stage').evaluate((el) => getComputedStyle(el).opacity), '1');
  });
  await nojs.context().close();
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} verificação(ões) falharam.` : '\nTodas as verificações passaram.');
process.exitCode = failures ? 1 : 0;
