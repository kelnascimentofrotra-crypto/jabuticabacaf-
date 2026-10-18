import { esc, ico, money, parseMoney, moneyInput, formatDate, today, uid, toast, confirmDialog, modal, download, toCsv, formatPhone, whatsappNumber, isValidWhatsapp, waLink, digits } from '../ui.js';
import { getTemplates, fillTemplate } from './messages.js';

export const STATUS_LABELS = {
  novo: 'Novo',
  confirmado: 'Confirmado',
  pago: 'Pago',
  enviado: 'Enviado / pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};
export const OPEN_STATUSES = ['novo', 'confirmado', 'pago', 'enviado'];
export const PAID_STATUSES = ['pago', 'enviado', 'entregue'];
const CHANNELS = { whatsapp: 'WhatsApp', instagram: 'Instagram', loja: 'Loja física', site: 'Site', outro: 'Outro' };
const PAYMENTS = { '': 'A definir', pix: 'Pix', credito: 'Cartão de crédito', debito: 'Cartão de débito', dinheiro: 'Dinheiro', outro: 'Outro' };

export const orderSubtotal = (o) => (o.items || []).reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
export const orderTotal = (o) => Math.max(0, orderSubtotal(o) - (o.discount || 0) + (o.shipping || 0));
const orderNo = (o) => `#${String(o.number || 0).padStart(4, '0')}`;
const itemsText = (o) => (o.items || []).map((i) => `${i.qty || 1}× ${i.name}${i.size ? ` (${i.size})` : ''}`).join(', ');

const localNotice = `<div class="notice">${ico('alert')}<p>Pedidos e clientes ficam salvos <strong>somente neste navegador</strong>. Faça backup em <a href="#/config">Configurações</a> para não perder os dados ou para usar em outro aparelho.</p></div>`;

/* ---------- Lista ---------- */
export async function ordersView(app, root) {
  const all = (await app.db.orders.all()).sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.number || 0) - (a.number || 0));
  const state = { status: 'abertos', q: '' };
  const month = new Date().toISOString().slice(0, 7);
  const paidMonth = all.filter((o) => (o.date || '').startsWith(month) && PAID_STATUSES.includes(o.status));
  const monthTotal = paidMonth.reduce((s, o) => s + orderTotal(o), 0);

  const tabs = [
    ['abertos', 'Em aberto', (o) => OPEN_STATUSES.includes(o.status)],
    ['todos', 'Todos', () => true],
    ...Object.entries(STATUS_LABELS).map(([k, l]) => [k, l, (o) => o.status === k]),
  ];

  const paint = () => {
    const test = tabs.find((t) => t[0] === state.status)[2];
    const q = state.q.toLowerCase();
    const rows = all.filter((o) => test(o) && (!q || `${o.customerName} ${o.customerPhone} ${orderNo(o)} ${itemsText(o)}`.toLowerCase().includes(q)));
    root.querySelector('[data-rows]').innerHTML = rows.length
      ? rows
          .map(
            (o) => `
        <li><a class="order-row" href="#/pedidos/${esc(o.id)}">
          <span class="order-row__main"><strong>${orderNo(o)}</strong> ${esc(o.customerName || 'Sem cliente')}<span class="muted small">${formatDate(o.date)} · ${esc(CHANNELS[o.channel] || '')} · ${esc(itemsText(o) || 'sem itens')}</span></span>
          <span class="order-row__side"><span class="status status--${o.status}">${STATUS_LABELS[o.status]}</span><strong>${money(orderTotal(o))}</strong></span>
        </a></li>`
          )
          .join('')
      : `<li class="empty empty--inline">${all.length ? 'Nenhum pedido neste filtro.' : '<h3>Nenhum pedido registrado</h3><p>Registre aqui as vendas feitas pelo WhatsApp, Instagram ou na loja para acompanhar status, pagamentos e o total do mês.</p>'}</li>`;
    root.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === state.status)));
  };

  root.innerHTML = `
  <section class="page-head">
    <div><p class="eyebrow">Vendas</p><h2 class="page-title">Pedidos</h2></div>
    <div class="page-actions">
      <button class="btn btn--ghost" type="button" data-export${all.length ? '' : ' disabled'}>${ico('download')}Exportar planilha</button>
      <a class="btn btn--primary" href="#/pedidos/novo">${ico('plus')}Novo pedido</a>
    </div>
  </section>
  ${localNotice}
  <section class="stats stats--3" aria-label="Resumo de pedidos">
    <div class="stat"><span class="stat__label">Em aberto</span><strong class="stat__value">${all.filter((o) => OPEN_STATUSES.includes(o.status)).length}</strong></div>
    <div class="stat"><span class="stat__label">Vendas do mês</span><strong class="stat__value">${money(monthTotal)}</strong><span class="stat__meta">pagos, enviados e entregues</span></div>
    <div class="stat"><span class="stat__label">Ticket médio do mês</span><strong class="stat__value">${money(paidMonth.length ? monthTotal / paidMonth.length : 0)}</strong></div>
  </section>
  <div class="toolbar">
    <div class="tabs" role="group" aria-label="Filtrar por status">
      ${tabs.map(([k, l, t]) => `<button type="button" class="tab" data-tab="${k}" aria-pressed="false">${l} <span class="tab__count">${all.filter(t).length}</span></button>`).join('')}
    </div>
    <label class="search">${ico('search')}<span class="sr-only">Buscar pedido</span><input type="search" placeholder="Cliente, número ou peça" data-q></label>
  </div>
  <ul class="order-list" data-rows aria-label="Pedidos"></ul>`;

  root.querySelectorAll('[data-tab]').forEach((b) =>
    b.addEventListener('click', () => {
      state.status = b.dataset.tab;
      paint();
    })
  );
  root.querySelector('[data-q]').addEventListener('input', (e) => {
    state.q = e.target.value;
    paint();
  });
  root.querySelector('[data-export]').addEventListener('click', () => {
    const rows = [['Pedido', 'Data', 'Cliente', 'Telefone', 'Canal', 'Itens', 'Subtotal', 'Desconto', 'Frete', 'Total', 'Pagamento', 'Status', 'Entrega', 'Observações']];
    for (const o of all)
      rows.push([orderNo(o), formatDate(o.date), o.customerName, o.customerPhone, CHANNELS[o.channel] || '', itemsText(o), moneyInput(orderSubtotal(o)), moneyInput(o.discount || 0), moneyInput(o.shipping || 0), moneyInput(orderTotal(o)), PAYMENTS[o.payment || ''], STATUS_LABELS[o.status], o.delivery === 'entrega' ? `Entrega: ${o.address || ''}` : 'Retirada', o.notes]);
    download(`pedidos-smug-${today()}.csv`, toCsv(rows), 'text/csv;charset=utf-8');
  });
  paint();
}

/* ---------- Formulário / detalhe ---------- */
const itemRow = (app, item, i) => {
  const products = app.content.products.items;
  const product = products.find((p) => p.id === item.productId);
  const sizes = product?.sizes || [];
  return `
  <div class="item-row" data-row="${i}">
    <div class="field">
      <label for="it-prod-${i}">Peça</label>
      <select id="it-prod-${i}" data-item="productId">
        <option value="">Item avulso</option>
        ${products.map((p) => `<option value="${esc(p.id)}"${p.id === item.productId ? ' selected' : ''}>${esc(p.name)}${p.status === 'esgotado' ? ' (esgotado)' : ''}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label for="it-name-${i}">Descrição</label>
      <input id="it-name-${i}" data-item="name" value="${esc(item.name || '')}" placeholder="Nome da peça">
    </div>
    <div class="field field--xs">
      <label for="it-size-${i}">Tamanho</label>
      ${sizes.length ? `<select id="it-size-${i}" data-item="size"><option value="">—</option>${sizes.map((s) => `<option${s === item.size ? ' selected' : ''}>${esc(s)}</option>`).join('')}</select>` : `<input id="it-size-${i}" data-item="size" value="${esc(item.size || '')}">`}
    </div>
    <div class="field field--xs">
      <label for="it-qty-${i}">Qtd.</label>
      <input id="it-qty-${i}" data-item="qty" type="number" min="1" step="1" inputmode="numeric" value="${item.qty || 1}">
    </div>
    <div class="field field--sm">
      <label for="it-price-${i}">Valor unit. (R$)</label>
      <input id="it-price-${i}" data-item="price" inputmode="decimal" value="${esc(moneyInput(item.price))}" placeholder="0,00">
    </div>
    <button class="icon-btn icon-btn--danger item-row__remove" type="button" data-remove-item aria-label="Remover item ${i + 1}">${ico('trash')}</button>
  </div>`;
};

export async function orderFormView(app, root, id) {
  const isNew = id === 'novo';
  const existing = isNew ? null : await app.db.orders.get(id);
  if (!isNew && !existing) {
    root.innerHTML = `<div class="empty"><h2>Pedido não encontrado</h2><a class="btn btn--primary" href="#/pedidos">Voltar aos pedidos</a></div>`;
    return;
  }
  const customers = await app.db.customers.all();
  const preset = new URLSearchParams(location.hash.split('?')[1] || '');
  const presetCustomer = customers.find((c) => c.id === preset.get('cliente'));
  const order = existing
    ? structuredClone(existing)
    : {
        date: today(),
        channel: 'whatsapp',
        status: 'novo',
        payment: '',
        delivery: 'retirada',
        items: [{ qty: 1 }],
        discount: 0,
        shipping: 0,
        customerName: presetCustomer?.name || '',
        customerPhone: presetCustomer?.phone || '',
      };
  app.setTitle(isNew ? 'Novo pedido' : `Pedido ${orderNo(order)}`);

  const paint = () => {
    root.innerHTML = `
    <a class="back" href="#/pedidos">${ico('back')}Pedidos</a>
    <form class="stack" novalidate data-form>
      <section class="card">
        <header class="card__head">
          <h2 class="card__title">${isNew ? 'Registrar pedido' : `Pedido ${orderNo(order)}`}</h2>
          ${!isNew ? `<div class="inline-actions">
            <button class="btn btn--ghost btn--sm" type="button" data-wa>${ico('whatsapp')}Mensagem</button>
            <button class="btn btn--ghost btn--sm" type="button" data-receipt>${ico('print')}Recibo</button>
          </div>` : ''}
        </header>
        <div class="fields">
          <div class="field">
            <label for="o-name">Cliente</label>
            <input id="o-name" name="customerName" list="o-customers" value="${esc(order.customerName || '')}" placeholder="Nome" autocomplete="off">
            <datalist id="o-customers">${customers.map((c) => `<option value="${esc(c.name)}">`).join('')}</datalist>
          </div>
          <div class="field">
            <label for="o-phone">WhatsApp do cliente</label>
            <input id="o-phone" name="customerPhone" type="tel" inputmode="tel" value="${esc(formatPhone(order.customerPhone || ''))}" placeholder="(11) 91234-5678">
          </div>
          <div class="field">
            <label for="o-date">Data</label>
            <input id="o-date" name="date" type="date" value="${esc(order.date || today())}">
          </div>
          <div class="field">
            <label for="o-channel">Canal</label>
            <select id="o-channel" name="channel">${Object.entries(CHANNELS).map(([k, l]) => `<option value="${k}"${order.channel === k ? ' selected' : ''}>${l}</option>`).join('')}</select>
          </div>
          <div class="field">
            <label for="o-status">Status</label>
            <select id="o-status" name="status">${Object.entries(STATUS_LABELS).map(([k, l]) => `<option value="${k}"${order.status === k ? ' selected' : ''}>${l}</option>`).join('')}</select>
          </div>
          <div class="field">
            <label for="o-payment">Pagamento</label>
            <select id="o-payment" name="payment">${Object.entries(PAYMENTS).map(([k, l]) => `<option value="${k}"${(order.payment || '') === k ? ' selected' : ''}>${l}</option>`).join('')}</select>
          </div>
          <label class="check field--wide"><input type="checkbox" name="saveCustomer" checked> Salvar ou atualizar este cliente na lista de clientes</label>
        </div>
      </section>

      <section class="card">
        <h3 class="card__title">Itens</h3>
        <div class="items" data-items>${order.items.map((item, i) => itemRow(app, item, i)).join('')}</div>
        <button class="btn btn--ghost btn--sm" type="button" data-add-item>${ico('plus')}Adicionar item</button>
        <div class="totals">
          <div class="field field--sm"><label for="o-discount">Desconto (R$)</label><input id="o-discount" name="discount" inputmode="decimal" value="${esc(moneyInput(order.discount || 0))}"></div>
          <div class="field field--sm"><label for="o-shipping">Frete (R$)</label><input id="o-shipping" name="shipping" inputmode="decimal" value="${esc(moneyInput(order.shipping || 0))}"></div>
          <p class="totals__sum">Total <strong data-total>${money(orderTotal(order))}</strong></p>
        </div>
      </section>

      <section class="card">
        <h3 class="card__title">Entrega e observações</h3>
        <div class="fields">
          <fieldset class="field field--wide">
            <legend>Entrega</legend>
            <div class="segmented">
              <label><input type="radio" name="delivery" value="retirada"${order.delivery !== 'entrega' ? ' checked' : ''}><span>Retirada na loja</span></label>
              <label><input type="radio" name="delivery" value="entrega"${order.delivery === 'entrega' ? ' checked' : ''}><span>Entrega</span></label>
            </div>
          </fieldset>
          <div class="field field--wide" data-address${order.delivery === 'entrega' ? '' : ' hidden'}>
            <label for="o-address">Endereço de entrega</label>
            <textarea id="o-address" name="address" rows="2">${esc(order.address || '')}</textarea>
          </div>
          <div class="field field--wide">
            <label for="o-notes">Observações</label>
            <textarea id="o-notes" name="notes" rows="3" placeholder="Ex.: embrulhar para presente">${esc(order.notes || '')}</textarea>
          </div>
        </div>
      </section>

      <div class="form-bar">
        ${!isNew ? `<button class="btn btn--ghost btn--danger-text" type="button" data-delete>${ico('trash')}Excluir</button>` : ''}
        <span class="form-bar__spacer"></span>
        <a class="btn btn--ghost" href="#/pedidos">Cancelar</a>
        <button class="btn btn--primary" type="submit">${ico('check')}Salvar pedido</button>
      </div>
    </form>`;
    bind();
  };

  // Lê o formulário de volta para o objeto `order`
  const read = (form) => {
    const f = form.elements;
    order.customerName = f.customerName.value.trim();
    order.customerPhone = digits(f.customerPhone.value) ? whatsappNumber(f.customerPhone.value) : '';
    order.date = f.date.value || today();
    order.channel = f.channel.value;
    order.status = f.status.value;
    order.payment = f.payment.value;
    order.discount = parseMoney(f.discount.value) || 0;
    order.shipping = parseMoney(f.shipping.value) || 0;
    order.delivery = form.querySelector('[name="delivery"]:checked').value;
    order.address = f.address.value.trim();
    order.notes = f.notes.value.trim();
    order.items = [...form.querySelectorAll('[data-row]')].map((row) => ({
      productId: row.querySelector('[data-item="productId"]').value || undefined,
      name: row.querySelector('[data-item="name"]').value.trim(),
      size: row.querySelector('[data-item="size"]').value.trim(),
      qty: Math.max(1, Number.parseInt(row.querySelector('[data-item="qty"]').value, 10) || 1),
      price: parseMoney(row.querySelector('[data-item="price"]').value) || 0,
    }));
  };

  const bind = () => {
    const form = root.querySelector('[data-form]');
    const updateTotal = () => {
      read(form);
      form.querySelector('[data-total]').textContent = money(orderTotal(order));
    };
    form.addEventListener('input', () => {
      app.formDirty = true;
      updateTotal();
    });
    form.addEventListener('change', (event) => {
      const target = event.target;
      if (target.name === 'delivery') form.querySelector('[data-address]').hidden = target.value !== 'entrega';
      if (target.name === 'customerName') {
        const match = customers.find((c) => c.name.toLowerCase() === target.value.trim().toLowerCase());
        if (match && !form.elements.customerPhone.value) form.elements.customerPhone.value = formatPhone(match.phone);
      }
      // Ao escolher uma peça, preenche descrição, preço e tamanhos
      if (target.dataset.item === 'productId') {
        read(form);
        const i = Number(target.closest('[data-row]').dataset.row);
        const product = app.content.products.items.find((p) => p.id === target.value);
        if (product) order.items[i] = { ...order.items[i], productId: product.id, name: product.name, price: product.price || 0, size: '' };
        paint();
        root.querySelector(`#it-prod-${i}`).focus();
      }
    });
    form.querySelector('[data-add-item]').addEventListener('click', () => {
      read(form);
      order.items.push({ qty: 1 });
      paint();
      root.querySelector(`#it-prod-${order.items.length - 1}`).focus();
    });
    form.querySelectorAll('[data-remove-item]').forEach((btn) =>
      btn.addEventListener('click', () => {
        read(form);
        order.items.splice(Number(btn.closest('[data-row]').dataset.row), 1);
        if (!order.items.length) order.items.push({ qty: 1 });
        app.formDirty = true;
        paint();
      })
    );
    form.querySelector('[data-delete]')?.addEventListener('click', async () => {
      if (!(await confirmDialog({ title: `Excluir o pedido ${orderNo(order)}?`, text: 'Esta ação não pode ser desfeita.', confirm: 'Excluir', danger: true }))) return;
      await app.db.orders.del(order.id);
      app.formDirty = false;
      toast('Pedido excluído.');
      app.go('#/pedidos');
    });
    form.querySelector('[data-wa]')?.addEventListener('click', () => {
      read(form);
      openWhatsappComposer(app, order);
    });
    form.querySelector('[data-receipt]')?.addEventListener('click', () => {
      read(form);
      openReceipt(app, order);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      read(form);
      order.items = order.items.filter((i) => i.name);
      if (!order.items.length) {
        order.items.push({ qty: 1 });
        toast('Adicione pelo menos um item com descrição.', 'error');
        paint();
        return;
      }
      if (order.customerPhone && !isValidWhatsapp(order.customerPhone)) {
        toast('WhatsApp do cliente inválido. Use DDD + número.', 'error');
        return;
      }
      const saveCustomer = form.elements.saveCustomer.checked;
      const now = new Date().toISOString();
      if (!order.id) {
        order.id = uid('o');
        order.number = await app.db.nextOrderNumber();
        order.createdAt = now;
      }
      order.updatedAt = now;
      if (saveCustomer && order.customerName) {
        const match = customers.find((c) => (order.customerPhone && c.phone === order.customerPhone) || c.name.toLowerCase() === order.customerName.toLowerCase());
        const customer = match ? { ...match, name: order.customerName, phone: order.customerPhone || match.phone, updatedAt: now } : { id: uid('c'), name: order.customerName, phone: order.customerPhone, createdAt: now };
        await app.db.customers.put(customer);
        order.customerId = customer.id;
      }
      await app.db.orders.put(order);
      app.formDirty = false;
      toast(isNew ? `Pedido ${orderNo(order)} registrado.` : 'Pedido atualizado.', 'success');
      if (isNew) app.go(`#/pedidos/${order.id}`);
      else paint();
    });
  };

  paint();
}

/* ---------- Mensagem pelo WhatsApp ---------- */
export async function openWhatsappComposer(app, order, customer) {
  const templates = await getTemplates(app);
  const phone = order?.customerPhone || customer?.phone || '';
  const vars = {
    nome: (order?.customerName || customer?.name || '').split(' ')[0],
    pedido: order ? orderNo(order) : '',
    total: order ? money(orderTotal(order)) : '',
    itens: order ? itemsText(order) : '',
  };
  const usable = templates.filter((t) => order || !/\{(pedido|total|itens)\}/.test(t.text));
  await modal(
    `
    <div class="modal__body">
      <h2 class="modal__title">${ico('whatsapp')}Mensagem para ${esc(vars.nome || 'o cliente')}</h2>
      ${phone ? '' : '<p class="notice notice--warning">Este cadastro não tem WhatsApp. Informe o número para enviar.</p>'}
      <div class="fields">
        <div class="field field--wide">
          <label for="wa-template">Resposta pronta</label>
          <select id="wa-template">${usable.map((t, i) => `<option value="${i}">${esc(t.title)}</option>`).join('')}</select>
        </div>
        <div class="field field--wide">
          <label for="wa-phone">WhatsApp</label>
          <input id="wa-phone" type="tel" inputmode="tel" value="${esc(formatPhone(phone))}" placeholder="(11) 91234-5678">
        </div>
        <div class="field field--wide">
          <label for="wa-text">Mensagem</label>
          <textarea id="wa-text" rows="6">${esc(usable[0] ? fillTemplate(usable[0].text, vars) : '')}</textarea>
        </div>
      </div>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" data-close="">Fechar</button>
        <button class="btn btn--ghost" type="button" data-copy>${ico('copy')}Copiar</button>
        <a class="btn btn--primary" data-open target="_blank" rel="noopener">${ico('whatsapp')}Abrir no WhatsApp</a>
      </div>
    </div>`,
    {
      onMount(dialog) {
        const text = dialog.querySelector('#wa-text');
        const phoneInput = dialog.querySelector('#wa-phone');
        const link = dialog.querySelector('[data-open]');
        const sync = () => {
          const number = whatsappNumber(phoneInput.value);
          const ok = isValidWhatsapp(number);
          link.href = ok ? waLink(number, text.value) : '#';
          link.setAttribute('aria-disabled', String(!ok));
        };
        dialog.querySelector('#wa-template').addEventListener('change', (e) => {
          text.value = fillTemplate(usable[Number(e.target.value)].text, vars);
          sync();
        });
        text.addEventListener('input', sync);
        phoneInput.addEventListener('input', sync);
        link.addEventListener('click', (e) => {
          if (link.getAttribute('aria-disabled') === 'true') {
            e.preventDefault();
            toast('Informe um WhatsApp válido (com DDD).', 'error');
          }
        });
        dialog.querySelector('[data-copy]').addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(text.value);
            toast('Mensagem copiada.');
          } catch {
            text.select();
            toast('Selecione e copie a mensagem.', 'info');
          }
        });
        sync();
      },
    }
  );
}

/* ---------- Recibo ---------- */
function openReceipt(app, order) {
  const c = app.content;
  modal(
    `
    <div class="modal__body">
      <div class="receipt print-area">
        <p class="receipt__brand">SMUG MODAS</p>
        ${c.contact.address.lines.length ? `<p class="receipt__small">${c.contact.address.lines.map(esc).join(' · ')}</p>` : ''}
        ${c.contact.whatsapp.display ? `<p class="receipt__small">WhatsApp ${esc(c.contact.whatsapp.display)}</p>` : ''}
        <hr>
        <p><strong>Pedido ${orderNo(order)}</strong> · ${formatDate(order.date)}</p>
        ${order.customerName ? `<p>Cliente: ${esc(order.customerName)}${order.customerPhone ? ` · ${esc(formatPhone(order.customerPhone))}` : ''}</p>` : ''}
        <table class="receipt__items">
          <thead><tr><th>Item</th><th>Qtd.</th><th>Valor</th></tr></thead>
          <tbody>${order.items
            .map((i) => `<tr><td>${esc(i.name)}${i.size ? ` (${esc(i.size)})` : ''}</td><td>${i.qty}</td><td>${money((i.price || 0) * i.qty)}</td></tr>`)
            .join('')}</tbody>
        </table>
        <p class="receipt__line"><span>Subtotal</span><span>${money(orderSubtotal(order))}</span></p>
        ${order.discount ? `<p class="receipt__line"><span>Desconto</span><span>− ${money(order.discount)}</span></p>` : ''}
        ${order.shipping ? `<p class="receipt__line"><span>Frete</span><span>${money(order.shipping)}</span></p>` : ''}
        <p class="receipt__line receipt__total"><span>Total</span><span>${money(orderTotal(order))}</span></p>
        <p class="receipt__small">Pagamento: ${esc(PAYMENTS[order.payment || ''])} · Status: ${esc(STATUS_LABELS[order.status])}</p>
        <p class="receipt__small">Documento sem valor fiscal.</p>
      </div>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" data-close="">Fechar</button>
        <button class="btn btn--primary" type="button" data-print>${ico('print')}Imprimir</button>
      </div>
    </div>`,
    {
      onMount(dialog) {
        dialog.querySelector('[data-print]').addEventListener('click', () => window.print());
      },
    }
  );
}
