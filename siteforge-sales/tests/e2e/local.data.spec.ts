import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function open(page: Page, path: string) {
  await page.goto(`/#${path}`);
  await expect(page.locator('main')).toBeVisible();
}

test.describe('dados persistidos no navegador (modo local)', () => {
  test('favoritos e histórico persistem após recarregar', async ({ page }) => {
    await open(page, '/objecoes/vou-pensar');
    await page.getByRole('button', { name: 'Favoritar' }).first().click();
    await expect(page.getByRole('button', { name: 'Remover dos favoritos' }).first()).toBeVisible();

    await open(page, '/nichos/advogados');
    await page.getByRole('button', { name: 'Favoritar' }).first().click();

    await page.reload();
    await open(page, '/salvos');
    const favs = page.getByTestId('favorites-list');
    await expect(favs).toContainText('Vou pensar e te aviso.');
    await expect(favs).toContainText('Advogados');

    await page.getByRole('tab', { name: /Histórico/ }).click();
    const hist = page.getByTestId('history-list');
    await expect(hist).toContainText('Vou pensar e te aviso.');
    await expect(hist).toContainText('Advogados');

    await page.getByRole('tab', { name: /Favoritos/ }).click();
    await favs.getByRole('button', { name: 'Remover' }).first().click();
    await expect(favs.getByRole('button', { name: 'Remover' })).toHaveCount(1);

    await page.getByRole('tab', { name: /Histórico/ }).click();
    await page.getByRole('button', { name: 'Limpar histórico' }).click();
    await expect(page.getByText('Histórico vazio')).toBeVisible();
  });

  test('gerador sem IA: três respostas, outra versão, salvar', async ({ page }) => {
    await open(page, '/gerador');
    await expect(page.getByText('Respostas da biblioteca, sem IA')).toBeVisible();
    await page.getByTestId('generator-message').fill('Achei o valor alto e meu sobrinho faz site também.');
    await page.getByLabel('Nicho do cliente').selectOption('barbearias');
    await page.getByLabel('Serviço oferecido').selectOption('site-negocio-local');
    await page.getByLabel('Objetivo comercial').selectOption('reuniao');
    await page.getByRole('button', { name: 'Gerar respostas' }).click();

    await expect(page.getByText(/Objeção identificada/)).toBeVisible();
    for (const t of ['Natural', 'Estratégica', 'Comercial']) await expect(page.getByText(t, { exact: true })).toBeVisible();
    const natural = page.locator('div.card', { has: page.getByText('Natural', { exact: true }) }).first();
    const badge = natural.getByText(/Biblioteca \d\/\d/);
    const before = await badge.innerText();
    await natural.getByRole('button', { name: 'Gerar outra versão' }).click();
    await expect(badge).not.toHaveText(before);
    await natural.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Resposta salva em "Minhas respostas".')).toBeVisible();

    await open(page, '/salvos?tab=respostas');
    await expect(page.getByText('Biblioteca', { exact: true }).first()).toBeVisible();
  });

  test('gerador detecta recusa explícita e recomenda encerrar', async ({ page }) => {
    await open(page, '/gerador');
    await page.getByTestId('generator-message').fill('Não tenho interesse, pare de me mandar mensagem.');
    await page.getByRole('button', { name: 'Gerar respostas' }).click();
    await expect(page.getByText('Recusa explícita detectada')).toBeVisible();
  });

  test('follow-up: quantidade personalizada, salvar e marcar como enviada', async ({ page }) => {
    await open(page, '/follow-up');
    await page.getByLabel('Situação do cliente').selectOption('disse-caro');
    const plan = page.getByTestId('followup-plan');
    await expect(plan.locator('> li')).toHaveCount(4);
    await page.getByLabel(/Quantidade de mensagens/).fill('2');
    await expect(plan.locator('> li')).toHaveCount(2);
    await expect(plan.locator('> li').last()).toContainText('Entendo que o investimento não cabe agora');
    await page.getByLabel('Intervalo entre mensagens').selectOption('intervalo');
    await page.getByLabel('Dias entre mensagens').fill('5');
    await page.getByLabel(/Nome do lead/).fill('Carla');
    await page.getByRole('button', { name: 'Salvar plano de follow-up' }).click();
    await expect(page.getByText('Carla', { exact: true })).toBeVisible();
    await expect(page.getByText('0/2 enviadas')).toBeVisible();
    await page.getByRole('button', { name: 'Marcar como enviada' }).first().click();
    await expect(page.getByText('1/2 enviadas')).toBeVisible();
    await page.reload();
    await page.getByRole('tab', { name: /Meus follow-ups/ }).click();
    await expect(page.getByText('1/2 enviadas')).toBeVisible();
  });

  test('simulador avalia três rodadas e registra o treino', async ({ page }) => {
    await open(page, '/simulador');
    await page.getByTestId('scenario-card').first().click();
    const answers = [
      'Entendo, o Instagram ajuda muito mesmo. Me conta: hoje o cliente marca horário pelo direct ou pelo WhatsApp?',
      'Faz sentido. E quem manda mensagem à noite consegue marcar? Uma agenda online deixa o cliente escolher o horário sozinho. Posso te mostrar um exemplo?',
      'Te passo sim: fica entre R$ [faixa], parecido com alguns cortes por mês. Quer que eu te mostre um exemplo em 10 minutos esta semana?',
    ];
    for (let i = 0; i < answers.length; i++) {
      await page.getByTestId('sim-input').fill(answers[i]);
      await page.getByRole('button', { name: 'Enviar resposta' }).click();
      await expect(page.getByTestId('sim-evaluation')).toHaveCount(i + 1);
      await page.getByRole('button', { name: i < 2 ? 'Próxima rodada' : 'Ver resultado final' }).click();
    }
    await expect(page.getByTestId('sim-final')).toContainText('Nota final do treino');
    const score = Number(await page.getByTestId('sim-final').locator('p.text-4xl').innerText());
    expect(score).toBeGreaterThanOrEqual(60);
    await page.getByRole('button', { name: 'Outros cenários' }).click();
    await expect(page.getByText('Seus treinos recentes')).toBeVisible();
    await expect(page.getByText(/Melhor nota/)).toBeVisible();
  });

  test('propostas: montar três versões, salvar, recarregar e responder a desconto', async ({ page }) => {
    await open(page, '/propostas');
    await page.getByLabel('Nome do cliente').fill('Clínica Sorriso');
    await page.getByLabel('Tipo de solução').selectOption('site-paginas-servicos');
    const essencial = page.locator('div.card', { has: page.getByText('Essencial', { exact: true }) }).first();
    await essencial.getByRole('button', { name: 'Usar entregáveis do serviço' }).click();
    await expect(essencial.getByLabel(/Funcionalidade \d da versão Essencial/)).toHaveCount(4);
    await essencial.getByLabel('Implantação').fill('2.400,00');
    await essencial.getByLabel(/Funcionalidade 4 da versão Essencial/).locator('..').getByText('Prioritário').click();
    await page.getByLabel('Condições de pagamento').fill('50% no início e 50% na entrega');
    await page.getByRole('button', { name: 'Salvar proposta' }).click();
    await expect(page.getByText('Proposta salva.')).toBeVisible();

    await page.getByLabel('Versão em negociação').selectOption({ index: 0 });
    await page.getByLabel('O que o cliente pediu').fill('15% de desconto');
    const sugg = page.getByTestId('discount-suggestions');
    await expect(sugg).toContainText('Reduzir o escopo');
    await expect(sugg).toContainText('Dividir a implantação em fases');
    await expect(page.getByText(/Desconto no mesmo escopo eu não consigo/)).toBeVisible();
    await expect(page.getByTestId('proposal-preview')).toContainText('Implantação: R$');

    await page.reload();
    await expect(page.getByLabel('Nome do cliente')).toHaveValue('Clínica Sorriso');
    await expect(page.getByTestId('proposal-preview')).toContainText('Clínica Sorriso');
  });
});

test.describe('administração do conteúdo', () => {
  test('editar, restaurar, criar e excluir conteúdo sem mexer no código', async ({ page }) => {
    page.on('dialog', (d) => d.accept());
    await open(page, '/admin');
    await page.getByRole('button', { name: 'Respostas rápidas' }).click();
    const list = page.getByTestId('admin-list');
    const row = list.locator('> div', { hasText: 'Pedir 15 minutos de conversa' });
    await row.getByRole('button', { name: 'Editar' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Título').fill('Pedir 15 minutos (versão da equipe)');
    await dialog.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Alterações salvas.')).toBeVisible();
    await expect(list.locator('> div', { hasText: 'Pedir 15 minutos (versão da equipe)' }).getByText('Editado')).toBeVisible();

    await open(page, '/');
    await expect(page.getByText('Pedir 15 minutos (versão da equipe)')).toBeVisible();

    await open(page, '/admin');
    await page.getByRole('button', { name: 'Respostas rápidas' }).click();
    await list.locator('> div', { hasText: 'versão da equipe' }).getByRole('button', { name: 'Restaurar original' }).click();
    await expect(list.locator('> div', { hasText: 'Pedir 15 minutos de conversa' }).getByText('Original')).toBeVisible();

    // nova objeção, relacionada a vários serviços
    await page.getByRole('button', { name: 'Objeções', exact: true }).click();
    await page.getByRole('button', { name: 'Nova objeção' }).click();
    await dialog.getByLabel('1. Objeção exata (o que o cliente falou)').fill('Vou esperar a reforma da loja terminar.');
    await dialog.getByLabel('Outras formas de dizer (melhora a busca)').fill('depois da reforma\nquando a obra acabar');
    await dialog.getByRole('button', { name: 'Site institucional' }).click();
    await dialog.getByRole('button', { name: 'Loja virtual / catálogo' }).click();
    await dialog.getByLabel('3. Melhor estratégia').fill('Entenda a data real da reforma e use o período para preparar conteúdo e fotos.');
    await dialog.getByLabel('4. Resposta curta (WhatsApp)').fill('Faz sentido! Quando a reforma termina? Dá para preparar o site junto e lançar com a loja nova.');
    await dialog.getByLabel('5. Resposta consultiva').fill('Legal! Qual a previsão para a reforma terminar?');
    await dialog.getByLabel('6. Resposta persuasiva').fill('Lançar o site junto com a loja nova aproveita a novidade para atrair clientes.');
    await dialog.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Item criado.')).toBeVisible();
    await expect(list.locator('> div', { hasText: 'vou-esperar-a-reforma-da-loja-terminar' }).getByText('Novo')).toBeVisible();

    await open(page, '/busca?q=quando%20a%20obra%20acabar');
    await expect(page.getByTestId('search-results')).toContainText('Vou esperar a reforma da loja terminar.');
    await page.getByTestId('search-results').getByTestId('objection-card').first().click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('“Vou esperar a reforma da loja terminar.”');

    // excluir um item original e restaurá-lo
    await open(page, '/admin');
    await page.getByLabel('Buscar conteúdo').fill('Já tenho um site');
    await list.getByRole('button', { name: 'Excluir Já tenho um site.' }).click();
    await expect(page.getByText('Itens originais removidos')).toBeVisible();
    await open(page, '/objecoes/ja-tenho-site');
    await expect(page.getByText('Objeção não encontrada')).toBeVisible();
    await open(page, '/admin');
    await page.getByRole('button', { name: 'Restaurar', exact: true }).click();
    await open(page, '/objecoes/ja-tenho-site');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('“Já tenho um site.”');
  });

  test('validação impede salvar conteúdo incompleto', async ({ page }) => {
    await open(page, '/admin');
    await page.getByRole('button', { name: 'Nova objeção' }).click();
    await page.getByRole('dialog').getByLabel('1. Objeção exata (o que o cliente falou)').fill('Objeção sem respostas');
    await page.getByRole('dialog').getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Corrija antes de salvar')).toBeVisible();
    await expect(page.getByText(/Respostas curta, consultiva e persuasiva são obrigatórias/)).toBeVisible();
  });

  test('estatísticas refletem uso real e exportação/importação funcionam', async ({ page }) => {
    await open(page, '/objecoes/esta-muito-caro');
    await open(page, '/objecoes/esta-muito-caro');
    await open(page, '/admin');
    await page.getByRole('tab', { name: 'Estatísticas' }).click();
    const cards = page.getByTestId('stats-cards');
    await expect(cards).toContainText('Fichas abertas');
    await expect(page.getByText('Objeções mais consultadas').locator('..')).toContainText('Está muito caro.');

    // cria uma alteração, exporta, descarta e importa de volta
    await page.getByRole('tab', { name: 'Conteúdo' }).click();
    await page.getByRole('button', { name: 'Respostas rápidas' }).click();
    await page.getByTestId('admin-list').locator('> div').first().getByRole('button', { name: 'Editar' }).click();
    await page.getByRole('dialog').getByLabel('Título').fill('Título exportado');
    await page.getByRole('dialog').getByRole('button', { name: 'Salvar' }).click();
    await page.getByRole('tab', { name: 'Importar e exportar' }).click();
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Baixar alterações' }).click()]);
    const file = await download.path();
    const exported = JSON.parse(await readFile(file!, 'utf8'));
    expect(exported).toHaveLength(1);

    await page.getByRole('tab', { name: 'Conteúdo' }).click();
    await page.getByRole('button', { name: 'Respostas rápidas' }).click();
    await page.getByRole('button', { name: 'Restaurar original' }).click();
    await expect(page.getByText('Título exportado')).toHaveCount(0);

    await page.getByRole('tab', { name: 'Importar e exportar' }).click();
    await page.locator('input[type=file]').setInputFiles(file!);
    await expect(page.getByText('1 alterações importadas.')).toBeVisible();
    await page.getByRole('tab', { name: 'Conteúdo' }).click();
    await page.getByRole('button', { name: 'Respostas rápidas' }).click();
    await expect(page.getByText('Título exportado')).toBeVisible();
  });
});
