---
name: vercel-cliente-novo
description: Cria projeto Vercel exclusivo pra um cliente — sempre forçando o slug do projeto no primeiro deploy, e corrigindo o framework preset que nasce errado. Use SEMPRE antes de rodar `vercel deploy`, `vercel link` ou `vercel:deploy` em uma pasta que ainda NÃO tem `.vercel/project.json`, em qualquer cenário: novo cliente, novo site, novo microsite, "subir esse projeto pra Vercel", "publicar na Vercel pela primeira vez", "deploy inicial", "criar projeto Vercel pra fulano". Previne o bug de o CLI auto-gerar slug pelo nome da pasta (`site/` em vários workspaces) e colidir com projeto Vercel existente — colisão sobrescreve silenciosamente o production de outro cliente. Stack: Vercel CLI.
---

# Vercel — Criar projeto exclusivo pra cada cliente

Toda vez que for fazer o **primeiro deploy** de uma pasta nova na Vercel, criar o projeto Vercel com **slug único do cliente** em vez de deixar o CLI auto-gerar — e conferir o framework preset, que nasce errado (Passo 4.1). Sem isso, o CLI propõe usar o nome da pasta como slug — e várias pastas se chamam `site/` (`ClienteA/site/`, `ClienteB/site/`, `ClienteC/site/`, etc), criando colisão.

## O bug que essa skill previne (caso real)

1. Usuário tinha projeto Vercel chamado `site` apontando pro cliente A (`ClienteA/site/`), divulgado em `site-abc123.vercel.app`
2. Em outra sessão, o agente rodou `vercel deploy --prod --yes` em `ClienteB/site/`. O CLI viu projeto `site` existente, perguntou "link to existing?" e como `--yes` aceita defaults, **linkou silenciosamente ao projeto do cliente A**
3. Cada deploy no cliente B sobrescreveu o production do projeto compartilhado → `site-abc123.vercel.app` parou de mostrar o cliente A e passou a mostrar o cliente B
4. Recuperação exigiu criar projeto novo, promover deploy antigo, atualizar memórias. ~30 min de troubleshooting

**Lição:** nunca confiar no auto-naming do CLI quando a pasta tem nome genérico.

## Quando invocar essa skill

- Usuário pediu pra "publicar na Vercel", "fazer deploy do site", "subir esse projeto", "criar o Vercel desse cliente"
- Você está prestes a rodar `vercel deploy`, `vercel link`, `vercel:deploy` numa pasta
- **E** essa pasta NÃO tem `.vercel/project.json` (ou tem, mas aponta pro projeto errado)

Se a pasta já tem `.vercel/project.json` apontando pro projeto certo, essa skill não se aplica — pode rodar `vercel deploy --prod --yes` direto.

## Procedimento

### Passo 1 — checar estado atual

```bash
# Está dentro da pasta do projeto?
ls .vercel/project.json 2>&1
```

- Se existe → ler o `projectName` dentro. Confirmar com o usuário se é o cliente certo. Se sim, pular essa skill.
- Se não existe → continuar.

### Passo 2 — listar projetos existentes na conta

```bash
vercel projects ls
```

Anotar quais slugs já estão em uso. **Atenção especial a slugs genéricos** (`site`, `app`, `web`, `landing`, `frontend`).

### Passo 3 — definir slug único do cliente

Padrão de nomeação: `<nome-curto-do-cliente>` ou `<servico>-<cliente>`.

Exemplos válidos:
- `oticas-nomedocliente`
- `barbearia-nomedocliente`
- `pizzaria-nomedocliente`
- `dr-nomedocliente`
- `nomedaempresa-cidade`

Exemplos a EVITAR (genéricos):
- `site`, `app`, `web`, `landing`, `nextjs-app`, `meu-projeto`

Se o slug derivado do nome do cliente já existir em `vercel projects ls`, confirmar com o usuário se é o mesmo projeto ou pedir um sufixo (ex: `oticas-nomedocliente-v2`).

### Passo 4 — criar o projeto com slug explícito, depois deployar

> ⚠️ **`--name` não existe mais.** Foi removido do CLI (confirmado no **CLI 57**,
> 2026-08-25). O `vercel deploy --help` hoje oferece `--project <NAME_OR_ID>`, que
> **só linka a projeto existente** — em pasta nova ele falha com
> `project_not_found`. Não adianta insistir: o projeto tem que ser criado antes.

```bash
# Da pasta do projeto, com .vercel/ inexistente ou recém-removido:
vercel project add <slug-cliente>              # cria com o slug exato
vercel link --yes --project <slug-cliente>     # gera .vercel/project.json
vercel deploy --prod --yes                     # primeiro deploy
```

Depois disso, `.vercel/project.json` aponta pro projeto correto e os deploys
seguintes são só `vercel deploy --prod --yes`.

### Passo 4.1 — ⚠️ corrigir o framework preset (OBRIGATÓRIO)

**Projeto criado por `vercel project add` nasce com Framework Preset = "Other".**
Não é detalhe cosmético: com preset "Other" a Vercel usa
`Output Directory: public se existir, ou .` e **serve a pasta `public/` como site
estático**. O `npm run build` roda, o build passa, o deploy fica `Ready` — e a raiz
`/` responde **404**.

Sintoma que confirma o diagnóstico: `/` dá 404 mas um arquivo de `public/`
(ex.: `/next.svg`) dá 200.

Correção — criar `vercel.json` na raiz do projeto **antes do primeiro deploy**:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

O `vercel.json` sobrescreve a configuração do painel e vai junto no repositório,
então funciona também quando o cliente importar o repo na conta dele. O preset no
painel continua exibindo "Other" — é esperado, e sem efeito.

*(Para outras stacks, trocar o valor: `"vite"`, `"astro"`, `"sveltekit"`, etc.)*

### Passo 5 — verificar URL e registrar

Output do CLI mostra:
- `Production: https://<slug>-<hash>-<scope>.vercel.app` — URL técnica do deploy específico
- `Aliased: https://<slug>.vercel.app` — alias bonito que sempre aponta pro production atual

Confirmar com o usuário e — se houver memória/contexto persistente do projeto — registrar a URL `<slug>.vercel.app` como referência.

## Passo 6 — conferir o que está REALMENTE no ar

Dois caches diferentes já entregaram falso positivo. `readyState: READY` não prova
nada sobre o que o visitante recebe.

**Cache do edge (HTML).** O alias cacheia a página. Conferir sempre com
cache-buster, senão você valida a versão anterior e jura que está tudo certo:

```bash
curl -s "https://<slug>.vercel.app/?v=$RANDOM" -o /tmp/prod.html
```

**Cache de build (CSS/JS).** Caso real em 2026-08-25: depois de reescrever
`globals.css`, a Vercel serviu **HTML novo com CSS antigo**. A página teria ido ao
ar sem nenhuma das regras novas. O HTML passava em todos os greps — o defeito só
apareceu baixando a folha de estilo servida.

```bash
# extrair o css do HTML e conferir o conteúdo, não só o HTML
cssurl=$(grep -oE 'href="[^"]*\.css[^"]*"' /tmp/prod.html | head -1 | sed 's/href="//;s/"//')
curl -s "https://<slug>.vercel.app$cssurl" | grep -c '<algo que você acabou de escrever>'
```

**Sempre que mexer em CSS global, deployar sem cache:**

```bash
vercel deploy --prod --yes --force     # --force SEM --with-cache descarta o cache
```

Regra curta: **depois de mexer em estilo, conferir o `.css` servido — não o HTML.**

## Antipattern — NÃO fazer

- ❌ Usar `vercel deploy --name <slug>` — a flag não existe mais (CLI 57)
- ❌ Usar `--project <slug>` esperando que ele crie o projeto — ele só linka a existente
- ❌ Deployar projeto Next.js criado por `vercel project add` sem `vercel.json` com `"framework"` — build passa, `/` dá 404
- ❌ Dar deploy por concluído porque `readyState` é `Ready` — conferir a URL, com cache-buster
- ❌ Validar mudança de CSS olhando só o HTML
- ❌ `vercel deploy --prod --yes` sem slug explícito em pasta com nome genérico
- ❌ Aceitar a sugestão default do CLI ("Link to existing project? [Y/n]") sem inspecionar qual projeto ele propõe linkar
- ❌ Assumir que `.vercel/project.json` aponta pro projeto certo só porque existe — sempre ler o `projectName` antes do primeiro deploy de uma sessão
- ❌ Reusar slug `site`, `app`, `web` mesmo que pareça "tudo bem porque tá na pasta certa"

## Como recuperar quando o bug já aconteceu

Se descobrir que dois clientes compartilham o mesmo projeto Vercel:

1. `vercel ls <projeto>` — listar deployments, identificar o último do cliente "vítima" pelo timestamp
2. `vercel inspect <url-do-deploy-antigo>` — confirmar que é o conteúdo correto
3. Remover `.vercel/` da pasta do cliente novo
4. `vercel project add <slug-novo-cliente>` → `vercel link --yes --project <slug-novo-cliente>` → `vercel deploy --prod --yes` na pasta do cliente novo (cria projeto separado; ver Passo 4.1 sobre o `vercel.json`)
5. `vercel promote <url-do-ultimo-deploy-do-cliente-vitima> --yes` — restaura o cliente original como production do projeto compartilhado
6. `vercel inspect <alias-principal>` — confirmar que voltou pro deploy do cliente original
