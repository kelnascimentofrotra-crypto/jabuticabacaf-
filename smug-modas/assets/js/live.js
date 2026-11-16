// SMUG MODAS — atualização ao vivo.
// O painel publica o conteúdo (postagens, produtos, dados da loja) num arquivo público
// (meta "smug-live"). Ao abrir a página, se esse conteúdo for mais novo que o desta versão
// do HTML, as partes que mudaram são refeitas antes de as interações (main.js) começarem.
// Sem rede ou sem o arquivo, a página continua exatamente como foi gerada.

const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.content || '';

function patch(doc) {
  // Fora do <main>: header, menu, aviso e rodapé
  for (const selector of ['[data-header]', '[data-menu]', '[data-demo-toast]', '.site-footer']) {
    const current = document.querySelector(selector);
    const next = doc.querySelector(selector);
    if (current && next && current.outerHTML !== next.outerHTML) current.replaceWith(document.importNode(next, true));
  }
  // <main>: seção a seção; as que não mudaram (como a abertura) ficam intactas
  const main = document.getElementById('conteudo');
  const nextMain = doc.getElementById('conteudo');
  if (!main || !nextMain) return;
  const key = (el) => el.id || el.className;
  const current = new Map([...main.children].map((el) => [key(el), el]));
  const result = [...nextMain.children].map((next) => {
    const same = current.get(key(next));
    return same && same.outerHTML === next.outerHTML ? same : document.importNode(next, true);
  });
  const keep = new Set(result);
  [...main.children].forEach((el) => keep.has(el) || el.remove());
  result.forEach((node, i) => {
    if (main.children[i] !== node) main.insertBefore(node, main.children[i] || null);
  });
}

async function refresh() {
  const url = meta('smug-live');
  if (!url || !('DOMParser' in window)) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    // Vindo do painel ("Ver no site"), busca a versão mais recente sem esperar o cache
    const fresh = /[?&]atualizado/.test(location.search) ? `${url.includes('?') ? '&' : '?'}v=${Date.now()}` : '';
    const response = await fetch(url + fresh, { signal: controller.signal });
    if (!response.ok) return;
    const content = await response.json();
    if (!content?.updatedAt || content.updatedAt === meta('smug-content-version')) return;
    const { renderPage } = await import('../../src/render.mjs');
    patch(new DOMParser().parseFromString(renderPage(content), 'text/html'));
  } catch {
    /* mantém a página gerada */
  } finally {
    clearTimeout(timer);
  }
}

await refresh();
await import('./main.js');
