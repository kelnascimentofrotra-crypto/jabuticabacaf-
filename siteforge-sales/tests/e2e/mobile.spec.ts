import { expect, test } from '@playwright/test';

const PAGES = ['/', '/objecoes', '/objecoes/integrar-whatsapp', '/nichos/barbearias', '/gerador', '/prospeccao', '/follow-up', '/simulador/medico-credibilidade', '/propostas', '/comparar', '/busca?q=caro', '/admin', '/salvos', '/config'];

test('navegação adaptada ao celular: barra inferior e menu lateral', async ({ page }) => {
  await page.goto('/#/');
  const sidebar = page.locator('aside').first();
  await expect(sidebar).toBeHidden();
  const bottom = page.getByRole('navigation', { name: 'Navegação rápida' });
  await expect(bottom).toBeVisible();
  await bottom.getByRole('link', { name: 'Gerador' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gerador de respostas');

  await bottom.getByRole('button', { name: 'Mais' }).click();
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Simulador de clientes' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulador de clientes');
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeHidden();
});

for (const path of PAGES) {
  test(`sem rolagem horizontal em ${path}`, async ({ page }) => {
    await page.goto(`/#${path}`);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('copiar e favoritar funcionam no celular', async ({ page }) => {
  await page.goto('/#/objecoes/nao-quero-contrato');
  await page.getByRole('button', { name: 'Copiar resposta curta' }).click();
  await expect(page.getByText('Copiado para a área de transferência.')).toBeVisible();
  await page.getByRole('button', { name: 'Favoritar' }).first().click();
  await expect(page.getByText('Adicionado aos favoritos.')).toBeVisible();
});
