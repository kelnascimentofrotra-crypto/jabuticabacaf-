// Comunicação com a API do site (/api/*). O login fica num cookie seguro do servidor.

export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(method, path, body) {
  let response;
  try {
    response = await fetch(`../api/${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError('Sem conexão. Verifique a internet e tente de novo.', 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fallback = response.status === 404 ? 'O painel precisa estar publicado na Vercel para funcionar.' : `Erro ${response.status}.`;
    throw new ApiError(data.error || fallback, response.status, data);
  }
  return data;
}

export const api = {
  status: () => request('GET', 'auth'),
  setup: (code, email, password) => request('POST', 'auth', { action: 'setup', code, email, password }),
  login: (email, password) => request('POST', 'auth', { action: 'login', email, password }),
  logout: () => request('POST', 'auth', { action: 'logout' }),
  changePassword: (current, email, password) => request('POST', 'auth', { action: 'password', current, email, password }),
  content: () => request('GET', 'content'),
  publish: (content, baseVersion) => request('PUT', 'content', { content, baseVersion }),
  upload: (image, name, folder) => request('POST', 'upload', { dataUrl: image.dataUrl, name, folder }),
};
