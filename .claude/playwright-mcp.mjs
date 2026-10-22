#!/usr/bin/env node
// Inicia o servidor Playwright MCP (npx @playwright/mcp@latest).
//
// Localmente usa a configuração padrão: navegador visível e perfil persistente.
// No ambiente cloud do Claude Code não há tela e o Chromium já vem instalado em
// /opt/pw-browsers, então roda headless, com esse executável e sem sandbox
// (o container não suporta o sandbox do Chromium).
//
// Argumentos extras são repassados ao servidor, ex.: --browser=firefox.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const cloudChromium = '/opt/pw-browsers/chromium';

const args = ['-y', '@playwright/mcp@latest'];
if (existsSync(cloudChromium))
  args.push('--headless', '--no-sandbox', `--executable-path=${cloudChromium}`);
args.push(...process.argv.slice(2));

const child = spawn('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' });
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => {
  if (signal)
    process.kill(process.pid, signal);
  else
    process.exit(code ?? 0);
});
