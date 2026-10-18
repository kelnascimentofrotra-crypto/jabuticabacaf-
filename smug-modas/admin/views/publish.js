import { esc, ico, toast, confirmDialog, modal, download, formatDateTime } from '../ui.js';
import { dataUrlBase64 } from '../images.js';

const DEVICES = [
  ['390', 'Celular'],
  ['768', 'Tablet'],
  ['1280', 'Computador'],
];

// Prévia do site com o rascunho atual (inclui fotos ainda não publicadas).
export function openPreview(app) {
  const base = new URL('../', location.href).href;
  const html = app.previewHtml().replace('<head>', `<head><base href="${esc(base)}">`);
  return modal(
    `
    <div class="preview">
      <div class="preview__bar">
        <div class="segmented segmented--buttons" role="group" aria-label="Tamanho da tela">
          ${DEVICES.map(([w, l], i) => `<button type="button" data-device="${w}" aria-pressed="${i === 0}">${l}</button>`).join('')}
        </div>
        <p class="preview__note">Prévia do rascunho — ainda não está no site</p>
        <button class="btn btn--ghost btn--sm" type="button" data-close="">Fechar prévia</button>
      </div>
      <div class="preview__stage" data-stage><iframe title="Prévia do site" data-frame></iframe></div>
    </div>`,
    {
      full: true,
      onMount(dialog) {
        const frame = dialog.querySelector('[data-frame]');
        const stage = dialog.querySelector('[data-stage]');
        const doc = frame.contentDocument;
        doc.open();
        doc.write(html);
        doc.close();
        let width = window.innerWidth < 700 ? window.innerWidth - 24 : 390;
        const fit = () => {
          const scale = Math.min(1, (stage.clientWidth - 24) / width);
          frame.style.width = `${width}px`;
          frame.style.height = `${(stage.clientHeight - 24) / scale}px`;
          frame.style.transform = `scale(${scale})`;
        };
        dialog.querySelectorAll('[data-device]').forEach((btn) =>
          btn.addEventListener('click', () => {
            width = Number(btn.dataset.device);
            dialog.querySelectorAll('[data-device]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
            fit();
          })
        );
        new ResizeObserver(fit).observe(stage);
        fit();
      },
    }
  );
}

const githackUrl = (s, sha) => `https://raw.githack.com/${s.owner}/${s.repo}/${sha}/${s.dir}/index.html`;

export async function publishView(app, root) {
  const s = app.settings;
  const paint = () => {
    const changes = app.changes();
    const issues = app.validate();
    const errors = issues.filter((i) => i.level === 'error');
    const dirty = app.isDirty();

    root.innerHTML = `
    <section class="page-head">
      <div><p class="eyebrow">Site</p><h2 class="page-title">Publicar alterações</h2>
      <p class="muted">Revise, veja a prévia e publique. O site é atualizado em um único passo no GitHub.</p></div>
      <div class="page-actions"><button class="btn btn--ghost" type="button" data-preview>${ico('eye')}Ver prévia</button></div>
    </section>
    ${app.remoteNotice ? `<div class="notice notice--warning">${ico('alert')}<p>${esc(app.remoteNotice)}</p></div>` : ''}

    <div class="grid-2">
      <section class="card">
        <h3 class="card__title">O que muda no site</h3>
        ${
          changes.length
            ? `<ul class="bullets">${changes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`
            : '<p class="muted">Nenhuma alteração pendente. Tudo o que está no painel já está publicado.</p>'
        }
      </section>
      <section class="card">
        <h3 class="card__title">Verificação</h3>
        ${
          issues.length
            ? `<ul class="todo">${issues
                .map((i) => `<li class="todo--${i.level}"><a href="${esc(i.route)}">${ico('alert')}<span>${esc(i.text)}</span></a></li>`)
                .join('')}</ul>`
            : `<p class="ok">${ico('check')}Tudo certo para publicar.</p>`
        }
      </section>
    </div>

    <section class="card">
      <h3 class="card__title">Publicar no GitHub</h3>
      ${
        app.token
          ? `<p class="muted small">Destino: <code>${esc(s.owner)}/${esc(s.repo)}</code>, branch <code>${esc(s.branch)}</code>, pasta <code>${esc(s.dir)}</code>.</p>
             <div class="fields">
               <div class="field field--wide">
                 <label for="commit-msg">Descrição desta publicação</label>
                 <input id="commit-msg" data-msg maxlength="100" value="${esc(`Painel: ${changes.slice(0, 3).join(', ') || 'atualização do site'}`.slice(0, 100))}">
               </div>
             </div>
             <div class="inline-actions">
               <button class="btn btn--primary btn--lg" type="button" data-publish${!dirty || errors.length ? ' disabled' : ''}>${ico('upload')}Publicar agora</button>
               ${errors.length ? '<span class="muted small">Corrija os itens em vermelho para publicar.</span>' : ''}
             </div>
             <p class="progress" role="status" aria-live="polite" data-progress></p>`
          : `<p>Para publicar direto pelo painel, conecte o GitHub em <a href="#/config">Configurações</a> (leva 2 minutos).</p>`
      }
      <details class="manual">
        <summary>Publicar manualmente (sem token)</summary>
        <p class="muted small">Baixe os dois arquivos e substitua <code>${esc(s.dir)}/src/content.json</code> e <code>${esc(s.dir)}/index.html</code> no repositório. ${app.referencedUploads().length ? 'As fotos novas só são enviadas pela publicação direta.' : ''}</p>
        <div class="inline-actions">
          <button class="btn btn--ghost btn--sm" type="button" data-dl="content">${ico('download')}content.json</button>
          <button class="btn btn--ghost btn--sm" type="button" data-dl="html">${ico('download')}index.html</button>
        </div>
      </details>
    </section>

    <section class="card">
      <header class="card__head"><h3 class="card__title">Publicações recentes</h3><button class="btn btn--ghost btn--sm" type="button" data-history>Carregar</button></header>
      <div data-history-list><p class="muted small">Mostra as últimas publicações feitas no GitHub.</p></div>
    </section>

    ${dirty ? `<p class="danger-zone"><button class="btn btn--ghost btn--danger-text" type="button" data-discard>${ico('trash')}Descartar todas as alterações não publicadas</button></p>` : ''}`;
    bind();
  };

  const bind = () => {
    root.querySelector('[data-preview]').addEventListener('click', () => openPreview(app));
    root.querySelectorAll('[data-dl]').forEach((btn) =>
      btn.addEventListener('click', () => {
        if (btn.dataset.dl === 'content') download('content.json', app.contentText(), 'application/json');
        else download('index.html', app.pageHtml(), 'text/html');
      })
    );
    root.querySelector('[data-discard]')?.addEventListener('click', async () => {
      const ok = await confirmDialog({
        title: 'Descartar alterações?',
        text: 'O painel volta para a versão que está publicada. Pedidos e clientes não são afetados.',
        confirm: 'Descartar',
        danger: true,
      });
      if (!ok) return;
      await app.discardDraft();
      toast('Alterações descartadas.');
      paint();
    });
    root.querySelector('[data-history]').addEventListener('click', async (e) => {
      const box = root.querySelector('[data-history-list]');
      e.target.disabled = true;
      box.innerHTML = '<p class="muted small">Carregando…</p>';
      try {
        const list = await app.github.history(s, app.token, app.sitePath('src/content.json'));
        box.innerHTML = list.length
          ? `<ul class="rows">${list
              .map((c) => `<li class="row"><span>${esc(c.message)}<span class="muted small"> · ${formatDateTime(c.date)}</span></span><span class="row__meta"><a class="link" href="${esc(githackUrl(s, c.sha))}" target="_blank" rel="noopener">Ver versão</a><a class="link" href="${esc(c.url)}" target="_blank" rel="noopener">GitHub</a></span></li>`)
              .join('')}</ul>`
          : '<p class="muted small">Nenhuma publicação encontrada.</p>';
      } catch (error) {
        box.innerHTML = `<p class="field-error">${esc(error.message)}</p>`;
      } finally {
        e.target.disabled = false;
      }
    });
    root.querySelector('[data-publish]')?.addEventListener('click', publishNow);
  };

  const publishNow = async () => {
    const button = root.querySelector('[data-publish]');
    const progress = root.querySelector('[data-progress]');
    const message = root.querySelector('[data-msg]').value.trim() || 'Atualização pelo painel';
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    const step = (text) => {
      progress.dataset.state = 'busy';
      progress.textContent = text;
    };
    try {
      step('Conferindo a versão atual…');
      const contentPath = app.sitePath('src/content.json');
      const remote = await app.github.readFile(s, app.token, contentPath);
      if (remote.text !== app.originalText) {
        const ok = await confirmDialog({
          title: 'O site mudou desde que você começou a editar',
          text: 'Alguém (ou outro aparelho) publicou uma versão mais nova. Se continuar, as suas alterações substituem a versão atual inteira.',
          confirm: 'Publicar mesmo assim',
          danger: true,
        });
        if (!ok) {
          progress.textContent = 'Publicação cancelada.';
          progress.dataset.state = '';
          button.disabled = false;
          button.removeAttribute('aria-busy');
          return;
        }
      }
      const text = app.contentText();
      const files = [
        { path: contentPath, text },
        { path: app.sitePath('index.html'), text: app.pageHtml() },
        ...app.referencedUploads().map((path) => ({ path: app.sitePath(path), base64: dataUrlBase64(app.uploads[path].dataUrl) })),
      ];
      const result = await app.github.publish(s, app.token, files, `${message}\n\nPublicado pelo painel da SMUG MODAS.`, step);
      await app.markPublished(text);
      app.remoteNotice = '';
      paint();
      root.insertAdjacentHTML(
        'afterbegin',
        `<div class="notice notice--success" role="status">${ico('check')}<p><strong>Publicado!</strong> O site foi atualizado.
         <a class="link" href="${esc(githackUrl(s, result.sha))}" target="_blank" rel="noopener">Ver esta versão</a> ·
         <a class="link" href="${esc(result.url)}" target="_blank" rel="noopener">Ver no GitHub</a>
         ${app.content.site.url ? ` · <a class="link" href="${esc(app.content.site.url)}" target="_blank" rel="noopener">Abrir o site</a>` : ''}</p></div>`
      );
      toast('Site publicado com sucesso.', 'success');
    } catch (error) {
      progress.dataset.state = 'error';
      progress.textContent = `Não foi possível publicar: ${error.message} Suas alterações continuam salvas no painel.`;
      button.disabled = false;
      button.removeAttribute('aria-busy');
      toast('A publicação falhou. Veja o motivo na tela.', 'error');
    }
  };

  paint();
}
