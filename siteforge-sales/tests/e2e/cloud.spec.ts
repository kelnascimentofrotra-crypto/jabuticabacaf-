// Modo nuvem: o app é compilado com VITE_SUPABASE_URL apontando para um host
// fictício, e todas as chamadas ao Supabase são simuladas aqui. Verifica login,
// permissões por papel, persistência remota e a integração de IA pelo servidor.
import { expect, test, type Page, type Route } from '@playwright/test';

const HOST = 'https://mock.supabase.test';

type Role = 'admin' | 'vendedor';
const USERS: Record<string, { id: string; password: string; nome: string; role: Role }> = {
  'admin@agencia.com': { id: '11111111-1111-1111-1111-111111111111', password: 'senha-admin-123', nome: 'Ana Admin', role: 'admin' },
  'vend@agencia.com': { id: '22222222-2222-2222-2222-222222222222', password: 'senha-vend-123', nome: 'Victor Vendas', role: 'vendedor' },
};

function b64url(obj: unknown) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function session(email: string) {
  const u = USERS[email];
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: u.id, email, role: 'authenticated', aud: 'authenticated', exp })}.assinatura`;
  return {
    access_token: token,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: exp,
    refresh_token: `refresh-${u.id}`,
    user: { id: u.id, email, aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: { nome: u.nome }, created_at: '2026-01-01T00:00:00Z' },
  };
}

interface Mock {
  requests: { method: string; url: string; body: string; headers: Record<string, string> }[];
  aiConfigured: boolean;
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET,POST,PATCH,DELETE,HEAD,OPTIONS',
  'access-control-expose-headers': 'content-range, x-supabase-api-version',
};

async function mockSupabase(page: Page, opts: Partial<Mock> = {}): Promise<Mock> {
  const mock: Mock = { requests: [], aiConfigured: false, ...opts };
  await page.route(`${HOST}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
      route.fulfill({ status, headers: { ...CORS, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    mock.requests.push({ method, url: req.url(), body: req.postData() ?? '', headers: req.headers() });

    const auth = req.headers()['authorization'] ?? '';
    const tokenUser = (() => {
      const parts = auth.replace(/^Bearer\s+/i, '').split('.');
      if (parts.length !== 3) return undefined;
      try {
        const sub = JSON.parse(Buffer.from(parts[1], 'base64url').toString()).sub as string;
        return Object.entries(USERS).find(([, u]) => u.id === sub)?.[0];
      } catch {
        return undefined;
      }
    })();

    if (url.pathname === '/auth/v1/token') {
      const { email, password } = JSON.parse(req.postData() ?? '{}');
      if (USERS[email]?.password === password) return json(session(email));
      return json({ error: 'invalid_grant', error_description: 'Invalid login credentials' }, 400);
    }
    if (url.pathname === '/auth/v1/signup') {
      const { email } = JSON.parse(req.postData() ?? '{}');
      return json({ id: '33333333-3333-3333-3333-333333333333', email, aud: 'authenticated', role: '', confirmation_sent_at: new Date().toISOString() });
    }
    if (url.pathname === '/auth/v1/logout') return route.fulfill({ status: 204, headers: CORS });
    if (url.pathname === '/auth/v1/user') return tokenUser ? json(session(tokenUser).user) : json({ msg: 'unauthorized' }, 401);

    if (url.pathname === '/rest/v1/profiles') {
      if (method === 'PATCH') return json([], 200);
      const idFilter = url.searchParams.get('id');
      const rows = Object.entries(USERS).map(([email, u]) => ({ id: u.id, email, nome: u.nome, role: u.role, created_at: '2026-01-01T00:00:00Z' }));
      if (idFilter) return json(rows.filter((r) => `eq.${r.id}` === idFilter));
      const me = tokenUser ? USERS[tokenUser] : undefined;
      return json(me?.role === 'admin' ? rows : rows.filter((r) => r.id === me?.id));
    }
    if (url.pathname.startsWith('/rest/v1/rpc/popular_items')) return json([]);
    if (url.pathname.startsWith('/rest/v1/rpc/usage_stats')) {
      return json({ periodoDias: 30, totalEventos: 3, porEvento: { view_objection: 3 }, usuariosAtivos: 2, topObjecoes: [{ itemId: 'vou-pensar', total: 3 }], topNichos: [], topCopiados: [] });
    }
    if (url.pathname.startsWith('/rest/v1/')) {
      if (method === 'GET' || method === 'HEAD') return json([]);
      return json([], 201);
    }
    if (url.pathname === '/functions/v1/ai') {
      const body = JSON.parse(req.postData() ?? '{}');
      if (body.task === 'status') return json(mock.aiConfigured ? { configured: true, model: 'claude-opus-5-5' } : { configured: false, reason: 'Secret ANTHROPIC_API_KEY não definido na Edge Function.' });
      if (body.task === 'generate')
        return json({ natural: 'Resposta natural da IA.', estrategica: 'Resposta estratégica da IA?', comercial: 'Resposta comercial da IA.', observacao: 'Observação da IA.' });
      if (body.task === 'variant') return json({ texto: 'Variação escrita pela IA.' });
      return json({ error: 'tarefa não simulada' }, 400);
    }
    return json({ error: 'não simulado' }, 404);
  });
  return mock;
}

async function login(page: Page, email: string, password: string) {
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();
}

test('exige login, rejeita senha errada e entra como vendedor sem acesso ao admin', async ({ page }) => {
  const mock = await mockSupabase(page);
  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();

  await login(page, 'vend@agencia.com', 'senha-errada');
  await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();

  await login(page, 'vend@agencia.com', 'senha-vend-123');
  await expect(page.getByRole('heading', { name: 'O que seu cliente disse para não comprar?' })).toBeVisible();
  await expect(page.getByText('Nuvem').first()).toBeVisible();
  await expect(page.getByText('Victor Vendas')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Administração' })).toHaveCount(0);

  await page.goto('/#/admin');
  await expect(page.getByRole('heading', { name: 'O que seu cliente disse para não comprar?' })).toBeVisible();

  // favoritos vão para o banco, com o usuário logado
  await page.goto('/#/objecoes/vou-pensar');
  await page.getByRole('button', { name: 'Favoritar' }).first().click();
  await expect(page.getByText('Adicionado aos favoritos.')).toBeVisible();
  const fav = mock.requests.find((r) => r.method === 'POST' && r.url.includes('/rest/v1/favorites'));
  expect(fav).toBeTruthy();
  expect(JSON.parse(fav!.body).user_id).toBe(USERS['vend@agencia.com'].id);
  expect(fav!.headers['authorization']).toMatch(/^Bearer /);

  // sem IA configurada, o gerador deixa claro que usa a biblioteca
  await page.goto('/#/gerador');
  await expect(page.getByText('Respostas da biblioteca, sem IA')).toBeVisible();

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
});

test('admin vê o painel, lista usuários e altera permissões', async ({ page }) => {
  const mock = await mockSupabase(page);
  await page.goto('/#/');
  await login(page, 'admin@agencia.com', 'senha-admin-123');
  await page.getByRole('link', { name: 'Administração' }).click();
  await expect(page.getByText('Alterações compartilhadas com toda a equipe')).toBeVisible();
  await page.getByRole('tab', { name: 'Usuários e permissões' }).click();
  await expect(page.getByText('vend@agencia.com')).toBeVisible();
  await page.getByLabel('Papel de vend@agencia.com').selectOption('admin');
  await expect(page.getByText('Permissão atualizada.')).toBeVisible();
  const patch = mock.requests.find((r) => r.method === 'PATCH' && r.url.includes('/rest/v1/profiles'));
  expect(patch?.url).toContain(`id=eq.${USERS['vend@agencia.com'].id}`);
  expect(JSON.parse(patch!.body)).toEqual({ role: 'admin' });

  await page.getByRole('tab', { name: 'Estatísticas' }).click();
  await expect(page.getByText('Usuários ativos')).toBeVisible();
  await expect(page.getByText('Vou pensar e te aviso.')).toBeVisible();
});

test('com IA configurada no servidor, o gerador usa a Edge Function sem expor chave', async ({ page }) => {
  const mock = await mockSupabase(page, { aiConfigured: true });
  await page.goto('/#/');
  await login(page, 'vend@agencia.com', 'senha-vend-123');
  await expect(page.getByText('IA ativa').first()).toBeVisible();
  await page.goto('/#/gerador');
  await expect(page.getByText(/Geração por IA/)).toBeVisible();
  await page.getByTestId('generator-message').fill('Achei caro');
  await page.getByRole('button', { name: 'Gerar respostas' }).click();
  await expect(page.getByText('Resposta natural da IA.')).toBeVisible();
  await expect(page.getByText('Observação da IA.')).toBeVisible();

  const natural = page.locator('div.card', { has: page.getByText('Natural', { exact: true }) }).first();
  await natural.getByRole('button', { name: 'Gerar outra versão' }).click();
  await expect(natural.getByText('Variação escrita pela IA.')).toBeVisible();

  const aiCall = mock.requests.find((r) => r.url.endsWith('/functions/v1/ai') && r.body.includes('"generate"'));
  expect(aiCall?.headers['authorization']).toMatch(/^Bearer /);
  expect(JSON.parse(aiCall!.body).referencia).toContain('Natural');
  for (const r of mock.requests) {
    expect(r.body).not.toMatch(/sk-ant/);
    expect(JSON.stringify(r.headers)).not.toMatch(/sk-ant|x-api-key/i);
  }
});

test('cadastro mostra confirmação por e-mail', async ({ page }) => {
  await mockSupabase(page);
  await page.goto('/#/');
  await page.getByRole('tab', { name: 'Criar conta' }).click();
  await page.getByLabel('Seu nome').fill('Nova Pessoa');
  await page.getByLabel('E-mail').fill('nova@agencia.com');
  await page.getByLabel('Senha').fill('uma-senha-forte');
  await page.getByRole('button', { name: 'Criar conta' }).last().click();
  await expect(page.getByText(/Enviamos um link de confirmação/)).toBeVisible();
});
