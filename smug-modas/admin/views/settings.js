import { esc, ico, toast, confirmDialog, modal, download, today, isUrl, isEmail } from '../ui.js';
import * as auth from '../auth.js';

export async function settingsView(app, root) {
  const s = app.settings;
  const access = await app.db.getAuth();
  root.innerHTML = `
  <section class="page-head">
    <div><p class="eyebrow">Painel</p><h2 class="page-title">Configurações</h2></div>
  </section>

  <form class="card" data-password novalidate>
    <header class="card__head">
      <h3 class="card__title">Acesso ao painel</h3>
      <button class="btn btn--ghost btn--sm" type="button" data-action="logout">Sair</button>
    </header>
    <p class="muted">Conectado como <strong>${esc(access?.email || '')}</strong>. A senha criptografa os pedidos, clientes, respostas, o rascunho e o token guardados neste aparelho. Por segurança, o painel sai sozinho depois de 1 hora sem uso.</p>
    <div class="fields">
      <div class="field field--wide"><label for="pw-email">E-mail de acesso</label><input id="pw-email" name="email" type="email" autocomplete="username" value="${esc(access?.email || '')}"></div>
      <div class="field field--wide"><label for="pw-current">Senha atual</label><input id="pw-current" name="current" type="password" autocomplete="current-password"></div>
      <div class="field"><label for="pw-new">Nova senha</label><input id="pw-new" name="next" type="password" autocomplete="new-password" minlength="8"></div>
      <div class="field"><label for="pw-confirm">Confirmar nova senha</label><input id="pw-confirm" name="confirm" type="password" autocomplete="new-password"></div>
    </div>
    <div class="inline-actions"><button class="btn btn--primary" type="submit">${ico('check')}Alterar senha</button></div>
    <p class="progress" role="status" aria-live="polite" data-pw-status></p>
  </form>

  <form class="card" data-gh novalidate>
    <h3 class="card__title">Conexão com o GitHub (publicação)</h3>
    <p class="muted">O painel publica o site salvando os arquivos no repositório. Para isso ele precisa de um <strong>token pessoal</strong> seu, com permissão só para este repositório.</p>
    <details class="howto">
      <summary>Como criar o token (passo a passo)</summary>
      <ol>
        <li>Entre no GitHub e abra <a class="link" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Settings → Developer settings → Fine-grained tokens → Generate new token</a>.</li>
        <li>Em <em>Repository access</em>, escolha <strong>Only select repositories</strong> e selecione <code>${esc(s.repo)}</code>.</li>
        <li>Em <em>Permissions → Repository permissions</em>, deixe <strong>Contents: Read and write</strong>.</li>
        <li>Gere o token, copie e cole abaixo. Ele fica só neste aparelho (criptografado) e nunca vai para o site.</li>
      </ol>
    </details>
    <div class="fields">
      <div class="field field--wide">
        <label for="gh-token">Token do GitHub</label>
        <input id="gh-token" name="token" type="password" autocomplete="off" spellcheck="false" placeholder="${app.token ? '•••••••• (token salvo — deixe em branco para manter)' : 'github_pat_…'}">
      </div>
      <p class="hint field--wide">O token fica guardado neste aparelho, criptografado com a senha do painel.</p>
      <div class="field"><label for="gh-owner">Usuário ou organização</label><input id="gh-owner" name="owner" value="${esc(s.owner)}" required></div>
      <div class="field"><label for="gh-repo">Repositório</label><input id="gh-repo" name="repo" value="${esc(s.repo)}" required></div>
      <div class="field"><label for="gh-branch">Branch</label><input id="gh-branch" name="branch" value="${esc(s.branch)}" required></div>
      <div class="field"><label for="gh-dir">Pasta do site no repositório</label><input id="gh-dir" name="dir" value="${esc(s.dir)}" required></div>
    </div>
    <div class="inline-actions">
      <button class="btn btn--primary" type="submit">${ico('check')}Salvar e testar conexão</button>
      ${app.token ? `<button class="btn btn--ghost btn--danger-text" type="button" data-forget>Remover token</button>` : ''}
    </div>
    <p class="progress" role="status" aria-live="polite" data-gh-status>${app.token ? 'Token configurado.' : 'Nenhum token configurado.'}</p>
  </form>

  <form class="card" data-inbox novalidate>
    <h3 class="card__title">Caixa de entrada do formulário</h3>
    <p class="muted">Se o formulário usa um serviço de envio (ex.: Formspree), cole aqui o link da caixa de entrada dele para abrir pelo painel em “Mensagens”.</p>
    <div class="fields">
      <div class="field field--wide"><label for="inbox">Link da caixa de entrada</label><input id="inbox" name="inbox" type="url" value="${esc(s.inboxUrl)}" placeholder="https://formspree.io/forms/…/submissions"></div>
    </div>
    <button class="btn btn--ghost" type="submit">Salvar link</button>
  </form>

  <section class="card">
    <h3 class="card__title">Backup dos dados deste aparelho</h3>
    <p class="muted">Pedidos, clientes e respostas prontas ficam salvos só neste navegador. Exporte um backup com frequência — e importe em outro aparelho para continuar de lá.</p>
    <p class="hint">O arquivo de backup contém os dados dos clientes <strong>sem criptografia</strong>: guarde-o em local seguro.</p>
    <div class="inline-actions">
      <button class="btn btn--primary" type="button" data-export>${ico('download')}Baixar backup</button>
      <label class="btn btn--ghost file-btn">${ico('upload')}<span>Importar backup</span><input type="file" accept="application/json,.json" class="sr-only" data-import></label>
    </div>
  </section>

  <section class="card card--danger">
    <h3 class="card__title">Zona de cuidado</h3>
    <div class="inline-actions">
      <button class="btn btn--ghost btn--danger-text" type="button" data-wipe>${ico('trash')}Apagar pedidos, clientes e respostas deste aparelho</button>
    </div>
  </section>`;

  const pw = root.querySelector('[data-password]');
  pw.addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = pw.elements;
    const status = root.querySelector('[data-pw-status]');
    const fail = (text, input) => {
      status.dataset.state = 'error';
      status.textContent = text;
      input?.focus();
    };
    if (!isEmail(f.email.value.trim())) return fail('Digite um e-mail válido.', f.email);
    if (!f.current.value) return fail('Digite a senha atual.', f.current);
    if (f.next.value.length < 8) return fail('A nova senha precisa ter pelo menos 8 caracteres.', f.next);
    if (f.next.value !== f.confirm.value) return fail('As senhas novas não conferem.', f.confirm);
    status.dataset.state = 'busy';
    status.textContent = 'Conferindo e protegendo os dados com a nova senha…';
    const oldKey = await auth.checkPassword(access, access.email, f.current.value);
    if (!oldKey) return fail('Senha atual incorreta.', f.current);
    try {
      const { key, record } = await auth.createAuth(f.email.value, f.next.value);
      await app.db.reencryptAll(oldKey, key, record);
      await auth.startSession(key, record.email);
      pw.reset();
      f.email.value = record.email;
      status.dataset.state = 'ok';
      status.textContent = 'Senha alterada.';
      toast('Senha alterada com sucesso.', 'success');
    } catch (error) {
      fail(`Não foi possível alterar a senha: ${error.message}`);
    }
  });

  const gh = root.querySelector('[data-gh]');
  const status = root.querySelector('[data-gh-status]');
  gh.addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = gh.elements;
    const next = { owner: f.owner.value.trim(), repo: f.repo.value.trim(), branch: f.branch.value.trim(), dir: f.dir.value.trim().replace(/^\/+|\/+$/g, '') };
    if (Object.values(next).some((v) => !v)) {
      toast('Preencha usuário, repositório, branch e pasta.', 'error');
      return;
    }
    const token = f.token.value.trim() || app.token;
    if (!token) {
      toast('Cole o token do GitHub.', 'error');
      f.token.focus();
      return;
    }
    status.dataset.state = 'busy';
    status.textContent = 'Testando a conexão…';
    try {
      const info = await app.github.testConnection(next, token);
      await app.saveSettings(next);
      await app.setToken(token);
      f.token.value = '';
      status.dataset.state = 'ok';
      status.textContent = `Conectado a ${info.fullName} (branch ${next.branch}). Pronto para publicar.`;
      toast('Conexão com o GitHub funcionando.', 'success');
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.message;
      toast('Não foi possível conectar.', 'error');
    }
  });
  root.querySelector('[data-forget]')?.addEventListener('click', async () => {
    await app.setToken('');
    toast('Token removido deste navegador.');
    settingsView(app, root);
  });

  root.querySelector('[data-inbox]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = event.target.elements.inbox.value.trim();
    if (url && !isUrl(url)) {
      toast('O link precisa começar com https://', 'error');
      return;
    }
    await app.saveSettings({ inboxUrl: url });
    toast('Link salvo.', 'success');
  });

  root.querySelector('[data-export]').addEventListener('click', async () => {
    const data = await app.db.exportBackup(app.settings);
    download(`backup-painel-smug-${today()}.json`, JSON.stringify(data, null, 2), 'application/json');
    toast('Backup baixado.', 'success');
  });
  root.querySelector('[data-import]').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'smug-admin') throw new Error('Arquivo de backup inválido.');
      const choice = await modal(`
        <div class="modal__body modal__body--small">
          <h2 class="modal__title">Importar backup</h2>
          <p class="modal__text">Backup de ${esc(new Date(data.exportedAt || Date.now()).toLocaleString('pt-BR'))}: ${data.orders?.length || 0} pedido(s) e ${data.customers?.length || 0} cliente(s).</p>
          <p class="modal__text"><strong>Juntar</strong> mantém o que já existe neste aparelho; <strong>Substituir</strong> apaga e usa só o backup.</p>
          <div class="modal__actions">
            <button class="btn btn--ghost" type="button" data-close="">Cancelar</button>
            <button class="btn btn--ghost" type="button" data-close="merge">Juntar</button>
            <button class="btn btn--danger" type="button" data-close="replace">Substituir</button>
          </div>
        </div>`);
      if (!choice) return;
      const settings = await app.db.importBackup(data, { replace: choice === 'replace' });
      if (settings) await app.saveSettings({ ...settings });
      toast('Backup importado.', 'success');
      settingsView(app, root);
    } catch (error) {
      toast(error.message.includes('JSON') ? 'Arquivo de backup inválido.' : error.message, 'error');
    }
  });
  root.querySelector('[data-wipe]').addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Apagar dados deste aparelho?', text: 'Pedidos, clientes e respostas prontas serão apagados. Baixe um backup antes, se precisar.', confirm: 'Apagar tudo', danger: true });
    if (!ok) return;
    await app.db.clearLocalData();
    toast('Dados locais apagados.');
  });
}
