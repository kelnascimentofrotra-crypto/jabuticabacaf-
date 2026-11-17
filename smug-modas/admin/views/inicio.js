// Dashboard (mesmo formato do painel do Marcos): avisos, cartões com números,
// lista "Para o site ficar completo" e os itens mais recentes.
import { esc, ico, money, formatDate, formatDateTime } from '../ui.js';
import { pageHead, stateBox, thumb } from './shared.js';

const STATUS_POST = { publicado: ['Publicada', 'on'], rascunho: ['Rascunho', 'off'] };
const STATUS_PRODUCT = { disponivel: ['Disponível', 'on'], esgotado: ['Esgotado', 'warn'], oculto: ['Oculto', 'off'] };
const pill = ([label, kind]) => `<span class="pill pill--${kind}">${label}</span>`;

// O que ainda falta para o site ficar completo — conferido no conteúdo publicado
function checklist(c) {
  const confirmed = c.heroBenefits.filter((b) => b.confirmed).length;
  return [
    { done: Boolean(c.contact.whatsapp.number), title: 'Colocar o WhatsApp da loja', text: 'Os botões “Falar no WhatsApp” e “Quero esta peça” do site usam este número.', href: '#/configuracoes' },
    { done: Boolean(c.contact.email.address), title: 'Preencher o e-mail de atendimento', text: 'Aparece na seção Contato do site.', href: '#/configuracoes' },
    { done: c.contact.address.lines.length > 0 && Boolean(c.contact.address.mapsUrl), title: 'Colocar o endereço e o link do mapa', text: 'O botão “Venha nos visitar” abre o mapa da loja.', href: '#/configuracoes' },
    { done: c.contact.hours.lines.length > 0, title: 'Informar o horário de atendimento', text: 'Aparece na seção Contato.', href: '#/configuracoes' },
    { done: Boolean(c.contact.social.instagram), title: 'Colocar o Instagram', text: 'Link no rodapé e no contato.', href: '#/configuracoes' },
    { done: confirmed === c.heroBenefits.length, title: 'Confirmar as vantagens da abertura', text: `${confirmed} de ${c.heroBenefits.length} confirmadas (frete, pagamento, coleções, suporte). Ajuste o texto ao que a loja realmente oferece.`, href: '#/configuracoes' },
    { done: c.posts.items.some((p) => p.status === 'publicado'), title: 'Publicar a primeira postagem', text: 'O Mural de postagens só aparece no site quando há uma publicada.', href: '#/postagens/nova' },
    { done: c.products.items.some((p) => p.status !== 'oculto'), title: 'Cadastrar o primeiro produto', text: 'A vitrine “Escolhas da semana” aparece no site quando há produtos.', href: '#/produtos/novo' },
  ];
}

export async function inicioView(app, root) {
  const c = app.content;
  const posts = c.posts.items;
  const products = c.products.items;
  const published = posts.filter((p) => p.status === 'publicado').length;
  const drafts = posts.length - published;
  const available = products.filter((p) => p.status === 'disponivel').length;
  const soldOut = products.filter((p) => p.status === 'esgotado').length;
  const todo = checklist(c);
  const done = todo.filter((t) => t.done).length;
  const recentPosts = [...posts].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 4);
  const recentProducts = products.slice(0, 4);

  const cards = [
    ['Postagens no site', published, 'posts', '#/postagens'],
    ['Rascunhos', drafts, 'edit', '#/postagens?status=rascunho'],
    ['Produtos disponíveis', available, 'check', '#/produtos?status=disponivel'],
    ['Esgotados', soldOut, 'bag', '#/produtos?status=esgotado'],
    ['Categorias', c.categories.items.length, 'grid', '#/produtos/categorias'],
  ];

  root.innerHTML = `
    ${pageHead('Olá!', 'Resumo do que está publicado no site agora.', `<a class="btn" href="#/produtos/novo">${ico('plus')}<span>Adicionar produto</span></a><a class="btn btn-primary" href="#/postagens/nova">${ico('plus')}<span>Nova postagem</span></a>`)}
    <div class="notices">
      ${drafts ? `<a class="notice" href="#/postagens?status=rascunho">${ico('edit')}<span><b>${drafts} ${drafts === 1 ? 'rascunho esperando' : 'rascunhos esperando'}</b> para ir ao site.</span><span class="notice-go">Ver rascunhos ${ico('right')}</span></a>` : ''}
      <a class="notice notice--soft" href="../?atualizado=1" target="_blank" rel="noopener">${ico('external')}<span>${c.updatedAt ? `<b>Última atualização do site:</b> ${formatDateTime(c.updatedAt)}` : '<b>Nada publicado pelo painel ainda.</b> O site mostra o conteúdo original.'}</span><span class="notice-go">Ver o site ${ico('right')}</span></a>
    </div>
    <div class="stats">
      ${cards
        .map(
          ([label, n, icon, href]) => `
        <a class="stat" href="${href}">
          <span class="stat-ico">${ico(icon)}</span>
          <span class="stat-label">${label}</span>
          <b class="stat-num">${n.toLocaleString('pt-BR')}</b>
        </a>`
        )
        .join('')}
    </div>
    <section class="panel">
      <div class="panel-head"><h2>Para o site ficar completo</h2><span class="todo-count">${done} de ${todo.length} feitos</span></div>
      <ul class="todo">
        ${todo
          .map(
            (t) => `
          <li class="${t.done ? 'is-done' : ''}">
            <span class="todo-ico">${ico(t.done ? 'check' : 'alert')}</span>
            <span class="todo-main"><b>${esc(t.title)}</b>${t.done ? '' : `<small>${esc(t.text)}</small>`}</span>
            ${t.done ? '' : `<a class="btn btn-sm" href="${t.href}">Resolver</a>`}
          </li>`
          )
          .join('')}
      </ul>
    </section>
    <div class="dash-cols">
      <section class="panel">
        <div class="panel-head"><h2>Últimas postagens</h2><a class="link" href="#/postagens">Ver todas</a></div>
        ${
          recentPosts.length
            ? `<ul class="recent">${recentPosts
                .map(
                  (p) => `
              <li>
                ${thumb(app, p.image?.src)}
                <span class="recent-main"><b>${esc(p.title)}</b><small>${formatDate(p.date) || 'Sem data'}</small></span>
                ${pill(STATUS_POST[p.status] || STATUS_POST.rascunho)}
                <a class="btn btn-sm" href="#/postagens/${esc(p.id)}">${ico('edit')}<span>Editar</span></a>
              </li>`
                )
                .join('')}</ul>`
            : stateBox('Nenhuma postagem ainda', 'Conte uma novidade da loja: ela aparece no Mural do site na hora.', `<a class="btn btn-primary" href="#/postagens/nova">${ico('plus')}<span>Nova postagem</span></a>`, 'posts')
        }
      </section>
      <section class="panel">
        <div class="panel-head"><h2>Últimos produtos</h2><a class="link" href="#/produtos">Ver todos</a></div>
        ${
          recentProducts.length
            ? `<ul class="recent">${recentProducts
                .map(
                  (p) => `
              <li>
                ${thumb(app, p.image?.src)}
                <span class="recent-main"><b>${esc(p.name)}</b><small>${Number.isFinite(p.price) ? money(p.price) : 'Sem preço'}${p.category ? ` · ${esc(p.category)}` : ''}</small></span>
                ${pill(STATUS_PRODUCT[p.status] || STATUS_PRODUCT.oculto)}
                <a class="btn btn-sm" href="#/produtos/${esc(p.id)}">${ico('edit')}<span>Editar</span></a>
              </li>`
                )
                .join('')}</ul>`
            : stateBox('Nenhum produto cadastrado', 'Cadastre as peças e elas aparecem na vitrine do site na hora.', `<a class="btn btn-primary" href="#/produtos/novo">${ico('plus')}<span>Adicionar produto</span></a>`, 'hanger')
        }
      </section>
    </div>`;
}
