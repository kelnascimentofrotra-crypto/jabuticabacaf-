// Inicia o Playwright MCP (@playwright/mcp).
// Na sua máquina roda igual à config padrão (navegador visível, perfil persistente).
// Nas sessões do Claude Code na nuvem não há tela nem Chrome instalado, então
// usa o Chromium pré-instalado, em modo headless, com perfil isolado e sem o
// sandbox do Chromium (o contêiner roda como root, o que impede o sandbox).
// Qualquer PLAYWRIGHT_MCP_* já definido no ambiente tem prioridade.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const env = { ...process.env };

if (env.CLAUDE_CODE_REMOTE === 'true') {
  const chromium = path.join(env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers', 'chromium');
  if (existsSync(chromium)) env.PLAYWRIGHT_MCP_EXECUTABLE_PATH ??= chromium;
  env.PLAYWRIGHT_MCP_HEADLESS ??= 'true';
  env.PLAYWRIGHT_MCP_ISOLATED ??= 'true';
  env.PLAYWRIGHT_MCP_SANDBOX ??= 'false';
}

const child = spawn('npx', ['-y', '@playwright/mcp@latest', ...process.argv.slice(2)], {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
