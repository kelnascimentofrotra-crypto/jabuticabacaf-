import { esc, ico, money, formatDate, formatDateTime } from '../ui.js';
import { icon } from '../../src/lib.mjs';
import { visiblePosts } from '../../src/components/posts.mjs';

const stat = (iconName, value, label) => `
  <li class="benefit">
    ${icon(iconName, 'icon benefit__icon')}
    <div class="benefit__body"><p class="benefit__title">${esc(String(value))}</p><p class="benefit__text">${esc(label)}</p></div>
  </li>`;

export async function inicioView(app, root) {
  const { posts, products, categories } = app.content;
  const published = posts.items.filter((p) => p.status === 'publicado');
  const drafts = posts.items.length - published.length;
  const available = products.items.filter((p) => p.status === 'disponivel');
  const soldOut = products.items.filter((p) => p.status === 'esgotado');
  const recent = [...posts.items].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 4);
  const onSite = visiblePosts(app.content).length;
  const attention = products.items.filter((p) => p.status !== 'disponivel').slice(0, 4);

  root.innerHTML = `
  <section class="banner">
    <div class="banner__bg" aria-hidden="true">
      <img src="../assets/img/hero-fundo.webp" alt="" width="1600" height="853"><span class="hero__sun"></span>
    </div>
    <div class="container banner__inner">
      <p class="eyebrow eyebrow--line">Painel da SMUG MODAS</p>
      <h1 class="banner__title">Olá! <em>Bom te ver por aqui.</em></h1>
      <p class="banner__text">Tudo o que você publicar aqui aparece no site em instantes.</p>
      <div class="banner__actions">
        <a class="btn btn--wine" href="#/postagens/nova">${ico('plus')}<span>Nova postagem</span></a>
        <a class="btn btn--line" href="#/produtos/novo">${ico('plus')}<span>Novo produto</span></a>
      </div>
    </div>
    <div class="container banner__stats">
      <ul class="benefits benefits--glass" aria-label="Resumo do site">
        ${stat('star', published.length, published.length === 1 ? 'postagem publicada' : 'postagens publicadas')}
        ${stat('clock', drafts, drafts === 1 ? 'rascunho' : 'rascunhos')}
        ${stat('hanger', available.length, available.length === 1 ? 'produto disponível' : 'produtos disponíveis')}
        ${stat('bag', soldOut.length, soldOut.length === 1 ? 'produto esgotado' : 'produtos esgotados')}
      </ul>
    </div>
  </section>

  <div class="container dash">
    <section class="panel">
      <header class="panel__head"><h2>Últimas postagens</h2><a class="link" href="#/postagens">Ver todas</a></header>
      ${
        recent.length
          ? `<ul class="rows">${recent
              .map(
                (p) => `<li><a class="row" href="#/postagens/${esc(p.id)}">
                  <span class="row__thumb">${p.image?.src ? `<img src="${esc(app.imageUrl(p.image.src))}" alt="" loading="lazy">` : '<span>S</span>'}</span>
                  <span class="row__main"><strong>${esc(p.title)}</strong><span class="muted">${formatDate(p.date) || 'Sem data'}</span></span>
                  <span class="chip chip--${p.status === 'publicado' ? 'on' : 'off'}">${p.status === 'publicado' ? 'Publicada' : 'Rascunho'}</span>
                </a></li>`
              )
              .join('')}</ul>`
          : `<p class="muted">Nenhuma postagem ainda. Que tal contar uma novidade da loja?</p><a class="btn btn--wine btn--sm" href="#/postagens/nova">${ico('plus')}<span>Escrever a primeira</span></a>`
      }
    </section>

    <section class="panel">
      <header class="panel__head"><h2>Produtos</h2><a class="link" href="#/produtos">Ver todos</a></header>
      <p class="muted">${available.length} disponível(is) · ${soldOut.length} esgotado(s) · ${products.items.length - available.length - soldOut.length} oculto(s) · ${categories.items.length} categorias</p>
      ${
        attention.length
          ? `<p class="panel__sub">Precisam de atenção</p><ul class="rows">${attention
              .map(
                (p) => `<li><a class="row" href="#/produtos/${esc(p.id)}">
                  <span class="row__thumb">${p.image?.src ? `<img src="${esc(app.imageUrl(p.image.src))}" alt="" loading="lazy">` : '<span>S</span>'}</span>
                  <span class="row__main"><strong>${esc(p.name)}</strong><span class="muted">${Number.isFinite(p.price) ? money(p.price) : 'Sem preço'}</span></span>
                  <span class="chip chip--${p.status === 'esgotado' ? 'warn' : 'off'}">${p.status === 'esgotado' ? 'Esgotado' : 'Oculto'}</span>
                </a></li>`
              )
              .join('')}</ul>`
          : products.items.length
            ? '<p class="ok">Todos os produtos estão disponíveis no site.</p>'
            : `<p class="muted">Nenhum produto cadastrado. A vitrine “${esc(products.title.plain)} ${esc(products.title.italic)}” aparece no site quando houver produtos.</p><a class="btn btn--wine btn--sm" href="#/produtos/novo">${ico('plus')}<span>Cadastrar produto</span></a>`
      }
    </section>

    <section class="panel panel--site">
      <header class="panel__head"><h2>Seu site</h2></header>
      <p>${app.content.updatedAt ? `Última atualização pelo painel: <strong>${formatDateTime(app.content.updatedAt)}</strong>.` : 'Ainda não houve publicações pelo painel.'}</p>
      <p class="muted">${onSite ? `${onSite} postagem(ns) aparecem no Mural do site.` : 'O Mural de postagens aparece no site assim que houver uma postagem publicada.'}</p>
      <a class="btn btn--line btn--sm" href="../?atualizado=1" target="_blank" rel="noopener">${ico('external')}<span>Abrir o site</span></a>
    </section>
  </div>`;
}
