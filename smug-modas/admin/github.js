// Publicação no GitHub pela API oficial, direto do navegador.
// O token é digitado pela dona da loja no painel e nunca vai para o código do site.
// Todas as mudanças (content.json, index.html e fotos) entram em um único commit.

const API = 'https://api.github.com';

export class GitHubError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const friendly = (status, fallback) =>
  ({
    401: 'Token inválido ou expirado. Gere um novo token em Configurações.',
    403: 'O token não tem permissão de escrita neste repositório (ou o limite de uso da API foi atingido).',
    404: 'Repositório, branch ou arquivo não encontrado — confira as Configurações e se o token tem acesso a este repositório.',
    409: 'O GitHub recusou a alteração por conflito. Recarregue e tente de novo.',
    422: 'O GitHub recusou a alteração (a branch mudou durante a publicação). Tente publicar de novo.',
  })[status] || fallback;

async function request(token, method, path, body) {
  let response;
  try {
    response = await fetch(API + path, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new GitHubError('Sem conexão com o GitHub. Verifique a internet e tente novamente.', 0);
  }
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new GitHubError(friendly(response.status, details.message || `Erro ${response.status} no GitHub.`), response.status);
  }
  return response.status === 204 ? null : response.json();
}

const repoPath = ({ owner, repo }) => `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
const refPath = (branch) => `heads/${branch.split('/').map(encodeURIComponent).join('/')}`;
const filePath = (path) => path.split('/').map(encodeURIComponent).join('/');

const decodeBase64Utf8 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

export async function testConnection(cfg, token) {
  const repo = await request(token, 'GET', repoPath(cfg));
  if (!repo.permissions?.push) {
    throw new GitHubError('O token consegue ler o repositório, mas não tem permissão de escrita (Contents: Read and write).', 403);
  }
  await request(token, 'GET', `${repoPath(cfg)}/git/ref/${refPath(cfg.branch)}`);
  return { fullName: repo.full_name, private: repo.private, defaultBranch: repo.default_branch };
}

// Lê um arquivo de texto da branch configurada.
export async function readFile(cfg, token, path) {
  const data = await request(token, 'GET', `${repoPath(cfg)}/contents/${filePath(path)}?ref=${encodeURIComponent(cfg.branch)}`);
  return { text: decodeBase64Utf8(data.content || ''), sha: data.sha };
}

// Últimos commits que alteraram um arquivo (histórico de publicações).
export async function history(cfg, token, path, perPage = 8) {
  const list = await request(token, 'GET', `${repoPath(cfg)}/commits?sha=${encodeURIComponent(cfg.branch)}&path=${encodeURIComponent(path)}&per_page=${perPage}`);
  return list.map((c) => ({ sha: c.sha, url: c.html_url, message: c.commit.message.split('\n')[0], date: c.commit.author?.date, author: c.commit.author?.name }));
}

// files: [{ path, text } | { path, base64 }]
export async function publish(cfg, token, files, message, onStep = () => {}) {
  const base = repoPath(cfg);
  onStep('Lendo a versão atual no GitHub…');
  const ref = await request(token, 'GET', `${base}/git/ref/${refPath(cfg.branch)}`);
  const parent = await request(token, 'GET', `${base}/git/commits/${ref.object.sha}`);

  const tree = [];
  for (const [i, file] of files.entries()) {
    onStep(`Enviando arquivos (${i + 1} de ${files.length})…`);
    const blob = await request(token, 'POST', `${base}/git/blobs`, file.base64 !== undefined ? { content: file.base64, encoding: 'base64' } : { content: file.text, encoding: 'utf-8' });
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  onStep('Criando a nova versão…');
  const newTree = await request(token, 'POST', `${base}/git/trees`, { base_tree: parent.tree.sha, tree });
  const commit = await request(token, 'POST', `${base}/git/commits`, { message, tree: newTree.sha, parents: [ref.object.sha] });

  onStep('Publicando…');
  await request(token, 'PATCH', `${base}/git/refs/${refPath(cfg.branch)}`, { sha: commit.sha, force: false });
  return { sha: commit.sha, url: commit.html_url };
}
