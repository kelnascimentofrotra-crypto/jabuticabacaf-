import { expect, test, type Page } from '@playwright/test';

async function open(page: Page, path: string) {
  await page.goto(`/#${path}`);
  await expect(page.locator('main')).toBeVisible();
}

test.describe('pesquisa e fichas', () => {
  test('pesquisa no painel encontra a ficha e copia a resposta', async ({ page }) => {
    await open(page, '/');
    await expect(page.getByRole('heading', { name: 'O que seu cliente disse para não comprar?' })).toBeVisible();
    await page.getByTestId('hero-search').fill('meu sobrinho faz site pra mim');
    const results = page.getByTestId('hero-results');
    await expect(results.getByTestId('objection-card').first()).toContainText('Meu sobrinho faz para mim.');
    await results.getByTestId('objection-card').first().click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('“Meu sobrinho faz para mim.”');
    for (const section of ['2 · O que pode significar', '3 · Melhor estratégia', '4 · Resposta curta', '5 · Resposta consultiva', '6 · Resposta persuasiva', '7 · Resposta para reunião', '8 · Pergunta estratégica', '9 · Próximo passo', '10 · O que não dizer', '11 · Variações por serviço', '12 · Objeções relacionadas']) {
      await expect(page.getByText(section, { exact: true })).toBeVisible();
    }

    await page.getByRole('button', { name: 'Copiar resposta curta' }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    await expect(page.getByTestId('short-response')).toContainText(copied.slice(0, 40));
    await expect(page.getByText('Copiado para a área de transferência.')).toBeVisible();
  });

  test('gerar alternativa sem IA alterna versões da biblioteca', async ({ page }) => {
    await open(page, '/objecoes/esta-muito-caro');
    const card = page.getByTestId('short-response');
    await expect(card.getByText('Biblioteca 1/3')).toBeVisible();
    const first = await card.locator('p.prose-msg').innerText();
    await page.getByRole('button', { name: 'Gerar alternativa' }).click();
    await expect(card.getByText('Biblioteca 2/3')).toBeVisible();
    await expect(card.locator('p.prose-msg')).not.toHaveText(first);
  });

  test('adapta a ficha ao nicho e ao serviço', async ({ page }) => {
    await open(page, '/objecoes/ja-tenho-instagram');
    await page.getByLabel('Adaptar para o nicho').selectOption('barbearias');
    await expect(page.getByText('Como abordar em Barbearias')).toBeVisible();
    await page.getByLabel('Serviço que você está vendendo').selectOption('loja');
    await expect(page.getByText('Ao vender loja virtual / catálogo')).toBeVisible();
  });

  test('busca avançada com frase colada e filtros', async ({ page }) => {
    await open(page, '/busca');
    await page.getByTestId('search-input').fill('Gostei, mas agora tá apertado. Talvez mês que vem.');
    await page.getByTestId('search-input').press('Enter');
    const results = page.getByTestId('search-results');
    await expect(results.getByTestId('objection-card').first()).toContainText('Talvez no próximo mês.');
    await page.getByLabel('Tipo de objeção').selectOption('preco');
    await expect(results.getByTestId('objection-card').first()).toContainText('Não tenho dinheiro agora.');
    await page.getByLabel('Canal').selectOption('ligacao');
    await expect(results.getByText('Ligação:').first()).toBeVisible();
  });

  test('busca rápida (Ctrl+K) navega para a ficha', async ({ page }) => {
    await open(page, '/');
    await page.keyboard.press('Control+k');
    await page.getByRole('dialog', { name: 'Busca rápida' }).getByLabel('Buscar').fill('preciso falar com meu sócio');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('“Preciso conversar com meu sócio.”');
  });
});

test.describe('filtros e navegação', () => {
  test('biblioteca filtra por biblioteca, tipo e texto', async ({ page }) => {
    await open(page, '/objecoes');
    await expect(page.getByTestId('result-count')).toHaveText(/74 objeções/);
    await page.getByRole('tab', { name: /Sistemas personalizados/ }).click();
    await expect(page.getByTestId('result-count')).toHaveText(/27 objeções/);
    await page.getByRole('tab', { name: /Todas/ }).click();
    await page.getByRole('group', { name: 'Filtrar por tipo' }).getByRole('button', { name: 'Preço' }).click();
    await expect(page).toHaveURL(/cat=preco/);
    const count = await page.getByTestId('objection-card').count();
    expect(count).toBeGreaterThan(3);
    await page.getByLabel('Filtrar objeções').fill('caro');
    await expect(page.getByTestId('objection-card').first()).toContainText('caro');
    await page.getByRole('button', { name: 'Limpar' }).click();
    await expect(page.getByTestId('result-count')).toHaveText(/74 objeções/);
  });

  test('todas as páginas do menu abrem sem erro', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await open(page, '/');
    const nav = page.getByRole('navigation', { name: 'Navegação principal' }).first();
    const links = await nav.getByRole('link').all();
    expect(links.length).toBeGreaterThanOrEqual(13);
    for (let i = 0; i < links.length; i++) {
      const link = nav.getByRole('link').nth(i);
      const name = (await link.innerText()).trim();
      await link.click();
      await expect(page.getByRole('heading', { level: 1 }), name).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test('nicho tem página própria com objeções e conversa', async ({ page }) => {
    await open(page, '/nichos');
    await expect(page.getByTestId('niche-card')).toHaveCount(62);
    await page.getByLabel('Buscar nicho').fill('pizzar');
    await page.getByTestId('niche-card').first().click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pizzarias');
    await expect(page.getByText('Objeções específicas deste nicho')).toBeVisible();
    await expect(page.getByText('Exemplo de conversa comercial')).toBeVisible();
    await expect(page.getByText('Panfleto e ímã ainda funcionam aqui.', { exact: false })).toBeVisible();
  });

  test('comparador adiciona e remove nichos', async ({ page }) => {
    await open(page, '/comparar');
    const grid = page.getByTestId('compare-grid');
    await expect(grid.locator('> div')).toHaveCount(6);
    await grid.getByRole('button', { name: 'Remover Barbearias' }).click();
    await expect(grid.locator('> div')).toHaveCount(5);
    await page.getByLabel(/Adicionar nicho/).selectOption('psicologos');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await expect(grid.getByText('Psicólogos')).toBeVisible();
    await page.getByLabel('Objeção').selectOption('vou-pensar');
    await expect(page.getByText('“Vou pensar e te aviso.” por nicho')).toBeVisible();
  });

  test('central de prospecção monta mensagem por nicho, etapa e canal', async ({ page }) => {
    await open(page, '/prospeccao');
    await page.getByLabel('Nicho do prospect').selectOption('clinicas-odontologicas');
    const out = page.getByTestId('prospect-output');
    await expect(out).toContainText('clínicas odontológicas');
    await expect(out).toContainText('Pergunta de abertura');
    await page.getByLabel('Canal de contato').selectOption('email');
    await expect(out).toContainText('Assunto:');
    await page.getByLabel('Etapa da conversa').selectOption('recusou');
    await expect(out).toContainText('obrigado pela sinceridade');
    await page.getByRole('tab', { name: 'Precisa de sistema personalizado' }).click();
    await expect(out).toContainText('análise que fizemos');
  });
});
