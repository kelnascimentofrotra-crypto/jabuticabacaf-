import { esc, ico, money, formatDate } from '../ui.js';
import { orderTotal, OPEN_STATUSES, PAID_STATUSES, STATUS_LABELS } from './orders.js';

// Para onde cada pendência leva no painel
const FIELD_ROUTES = {
  'site.url': '#/loja',
  'contact.whatsapp': '#/loja',
  'contact.email': '#/loja',
  'contact.address': '#/loja',
  'contact.address.mapsUrl': '#/loja',
  'contact.hours': '#/loja',
  'form.endpoint': '#/loja',
  heroBenefits: '#/loja',
  'categories.catalogUrl': '#/categorias',
};

export async function overviewView(app, root) {
  const items = app.content.products.items;
  const available = items.filter((p) => p.status === 'disponivel').length;
  const soldOut = items.filter((p) => p.status === 'esgotado').length;
  const hidden = items.filter((p) => p.status === 'oculto').length;

  const [orders, customers] = await Promise.all([app.db.orders.all(), app.db.customers.all()]).catch(() => [[], []]);
  const month = new Date().toISOString().slice(0, 7);
  const monthOrders = orders.filter((o) => (o.date || '').startsWith(month) && PAID_STATUSES.includes(o.status));
  const monthTotal = monthOrders.reduce((sum, o) => sum + orderTotal(o), 0);
  const open = orders.filter((o) => OPEN_STATUSES.includes(o.status)).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const monthNum = String(new Date().getMonth() + 1).padStart(2, '0');
  const birthdays = customers.filter((c) => (c.birthday || '').slice(3, 5) === monthNum).sort((a, b) => a.birthday.localeCompare(b.birthday));

  const pending = app.pending();
  const changes = app.changes();

  root.innerHTML = `
  ${app.remoteNotice ? `<div class="notice notice--warning">${ico('alert')}<p>${esc(app.remoteNotice)}</p></div>` : ''}
  <section class="page-head">
    <div>
      <p class="eyebrow">Painel da loja</p>
      <h2 class="page-title">Olá! O que vamos fazer hoje?</h2>
    </div>
    <div class="page-actions">
      <a class="btn btn--primary" href="#/produtos/novo">${ico('plus')}Novo produto</a>
      <a class="btn btn--ghost" href="#/pedidos/novo">${ico('plus')}Novo pedido</a>
    </div>
  </section>

  <section class="stats" aria-label="Resumo">
    <a class="stat" href="#/produtos"><span class="stat__label">Produtos no site</span><strong class="stat__value">${available}</strong><span class="stat__meta">${soldOut} esgotado(s) · ${hidden} oculto(s)</span></a>
    <a class="stat" href="#/pedidos"><span class="stat__label">Pedidos em aberto</span><strong class="stat__value">${open.length}</strong><span class="stat__meta">registrados neste aparelho</span></a>
    <a class="stat" href="#/pedidos"><span class="stat__label">Vendas do mês</span><strong class="stat__value">${money(monthTotal)}</strong><span class="stat__meta">${monthOrders.length} pedido(s) pagos</span></a>
    <a class="stat" href="#/clientes"><span class="stat__label">Clientes</span><strong class="stat__value">${customers.length}</strong><span class="stat__meta">${birthdays.length} aniversariante(s) no mês</span></a>
  </section>

  <div class="grid-2">
    <section class="card">
      <header class="card__head"><h3>Publicação</h3><a class="link" href="#/publicar">Abrir</a></header>
      ${
        changes.length
          ? `<p>Você tem <strong>${changes.length}</strong> alteração(ões) que ainda não estão no site:</p>
             <ul class="bullets">${changes.slice(0, 5).map((c) => `<li>${esc(c)}</li>`).join('')}${changes.length > 5 ? `<li>… e mais ${changes.length - 5}</li>` : ''}</ul>
             <a class="btn btn--primary" href="#/publicar">${ico('upload')}Revisar e publicar</a>`
          : `<p class="muted">Tudo publicado. As alterações feitas no painel aparecem aqui até você publicar.</p>`
      }
    </section>

    <section class="card">
      <header class="card__head"><h3>O que falta no site</h3><span class="tag">${pending.length}</span></header>
      ${
        pending.length
          ? `<ul class="todo">${pending
              .map((p) => `<li><a href="${FIELD_ROUTES[p.field] || '#/loja'}">${ico('alert')}<span>${esc(p.text)}</span></a></li>`)
              .join('')}</ul>`
          : '<p class="muted">Nenhuma pendência. 🎉</p>'
      }
    </section>

    <section class="card">
      <header class="card__head"><h3>Pedidos em aberto</h3><a class="link" href="#/pedidos">Ver todos</a></header>
      ${
        open.length
          ? `<ul class="rows">${open
              .slice(0, 5)
              .map(
                (o) => `<li><a class="row" href="#/pedidos/${esc(o.id)}"><span><strong>#${String(o.number).padStart(4, '0')}</strong> · ${esc(o.customerName || 'Sem cliente')}</span><span class="row__meta"><span class="status status--${o.status}">${STATUS_LABELS[o.status]}</span>${money(orderTotal(o))}</span></a></li>`
              )
              .join('')}</ul>`
          : '<p class="muted">Nenhum pedido em aberto.</p>'
      }
    </section>

    <section class="card">
      <header class="card__head"><h3>Aniversariantes do mês</h3><a class="link" href="#/clientes">Clientes</a></header>
      ${
        birthdays.length
          ? `<ul class="rows">${birthdays
              .map((c) => `<li><a class="row" href="#/clientes/${esc(c.id)}"><span>${esc(c.name)}</span><span class="row__meta">${esc(c.birthday)}</span></a></li>`)
              .join('')}</ul>`
          : '<p class="muted">Nenhum aniversário cadastrado para este mês.</p>'
      }
    </section>
  </div>
  ${orders.length ? `<p class="muted small">Último pedido registrado em ${formatDate(orders.map((o) => o.date).sort().at(-1))}.</p>` : ''}`;
}
