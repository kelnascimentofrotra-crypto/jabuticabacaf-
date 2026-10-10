# SiteForge Sales

Central de inteligência comercial para quem vende **sites, landing pages, lojas virtuais, sistemas web e serviços recorrentes**. O vendedor informa o que o cliente disse, o nicho e o serviço — e encontra em segundos o motivo provável da objeção, a resposta adequada (WhatsApp, ligação ou reunião) e o próximo passo.

## O que vem pronto

| Área | Conteúdo |
| --- | --- |
| Objeções gerais (venda de sites e soluções) | 47 fichas completas — inclui as 44 listadas no briefing + 3 situações de “cliente sumiu” |
| Objeções de sistemas personalizados | 27 fichas com orientação de transparência (escopo, prazo, manutenção, segurança, propriedade do código, integrações, implantação e custos recorrentes) |
| Nichos | 62 (os 60 pedidos + indústrias e distribuidoras), cada um com contexto do negócio, dores, soluções indicadas, argumentos, perguntas de diagnóstico, 3 objeções específicas, exemplo de conversa, ângulos por tipo de objeção e cuidados regulatórios |
| Catálogo de serviços | 39 serviços em 5 grupos, cada um com entregáveis, argumentos e objeções próprias |
| Central de Prospecção | 10 etapas × 3 situações (sem site, site antigo, sistema), roteiro de ligação, assunto de e-mail, regras por canal e 6 estratégias de prospecção fria |
| Follow-up | 12 sequências com quantidade e intervalo personalizáveis, mensagem de encerramento obrigatória e acompanhamento do que foi enviado |
| Simulador | 10 cenários com 3 rodadas cada, avaliação em 5 critérios, resposta alternativa e justificativa |
| Respostas rápidas | 12 mensagens prontas para copiar |

Cada ficha segue o modelo obrigatório: objeção exata, o que pode significar, melhor estratégia, resposta curta, consultiva, persuasiva, versão para ligação, condução em reunião, pergunta estratégica, próximo passo, o que não dizer, variações por serviço e botões de copiar, favoritar, gerar alternativa e ver relacionadas.

## Funcionalidades

- **Painel** com busca principal (cole a mensagem do cliente), atalhos por tipo de objeção, nichos, objeções mais procuradas (ranking real de uso; enquanto não há dados, uma seleção inicial identificada como tal) e respostas rápidas.
- **Busca avançada** por frase colada, com sinônimos e gírias (“tá salgado”, “o zap resolve”), filtros por nicho, serviço, tipo, canal, etapa, nível de resistência, objetivo e biblioteca. Busca rápida com `Ctrl/⌘ + K`.
- **Gerador de respostas** (natural, estratégica, comercial) com nicho, serviço, preço, mensagem, histórico, objetivo e tom. Sem IA, monta as respostas a partir da biblioteca e **avisa que não é IA**; detecta recusa explícita e recomenda encerrar.
- **Comparador de estratégias**: a mesma objeção por nicho (até 6 lado a lado) e por tipo de serviço.
- **Montador de propostas** com versões Essencial, Profissional e Completa, prévia, cópia em texto, impressão/PDF e ferramenta para **pedidos de desconto** (sugere reduzir escopo, dividir em fases, trocar funcionalidades ou apresentar a versão menor — nunca altera preços sozinho).
- **Favoritos, histórico e “Minhas respostas”** (versões próprias de cada resposta).
- **Administração**: criar, editar, excluir e restaurar objeções, nichos, serviços, cenários, follow-ups, etapas de prospecção e respostas rápidas por formulários; relacionar objeções a vários serviços; editar exemplos de conversa; gerenciar usuários e papéis; estatísticas de uso reais; exportar e importar alterações.

## Dois modos de funcionamento

O app detecta sozinho o modo pelo ambiente:

| | Modo local (padrão) | Modo nuvem (Supabase) |
| --- | --- | --- |
| Login | Não há — uso individual | E-mail e senha, recuperação de senha |
| Onde ficam os dados | No navegador (`localStorage`) | Banco PostgreSQL do Supabase, com RLS |
| Edição de conteúdo | Vale só neste navegador | Compartilhada com a equipe, apenas admins editam |
| Estatísticas | Uso deste navegador | Uso real da equipe |
| IA | Indisponível (não há onde guardar a chave com segurança) | Via Edge Function, com a chave guardada como secret |

A interface sempre indica o modo atual (selos “Local/Nuvem” e “IA ativa/Sem IA”).

## Rodar localmente

```bash
cd siteforge-sales
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
```

Requisitos: Node.js 20+.

## Publicar

É um site estático (rotas com `#`, sem configuração de servidor). Em qualquer hospedagem:

- **Pasta raiz do projeto:** `siteforge-sales`
- **Comando de build:** `npm run build`
- **Pasta de saída:** `dist`
- **Variáveis (opcionais, para o modo nuvem):** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

Na Vercel ou na Netlify, basta importar o repositório e preencher os campos acima.

> Atenção: a raiz deste repositório tem um `CNAME` de outro site (GitHub Pages). Publique o SiteForge em outra hospedagem ou em outro repositório para não conflitar com esse domínio.

## Configurar o Supabase (login, equipe e banco)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de `supabase/migrations/0001_init.sql` (ou `supabase db push` com a CLI). A migração pode ser executada mais de uma vez sem erro.
3. Copie em *Project Settings → API* a URL e a chave **anon** (pública) para as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (arquivo `.env` local ou painel da hospedagem). Veja `.env.example`.
4. Em *Authentication → URL Configuration*, cadastre a URL do site publicado (necessário para confirmação de e-mail e recuperação de senha).
5. Crie sua conta pelo app e promova-se a administrador no SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'voce@suaempresa.com.br';
   ```

6. (Opcional) Leve as edições feitas no modo local: em *Administração → Importar e exportar*, exporte no navegador antigo e importe já logado como admin.

### Regras de acesso (RLS)

- Cada usuário lê e grava **apenas** os próprios favoritos, histórico, respostas, propostas, follow-ups e treinos.
- O conteúdo comercial é legível por qualquer usuário logado; **somente administradores** criam, editam ou excluem.
- Usuários comuns não podem alterar o próprio papel; sempre resta ao menos um administrador.
- Eventos de uso são gravados pelo próprio usuário e lidos apenas por administradores; o ranking do painel usa uma função agregada, sem dados pessoais.
- Usuários anônimos não acessam nada.

## Ativar a IA

A IA roda numa **Edge Function** do Supabase; a chave nunca vai para o navegador.

```bash
supabase functions deploy ai
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# opcionais
supabase secrets set AI_DAILY_LIMIT=200      # limite de usos por usuário a cada 24 h (padrão 200)
supabase secrets set AI_EFFORT=medium        # low | medium | high (padrão medium)
supabase secrets set ALLOWED_ORIGIN=https://seu-dominio.com.br
```

A função usa o modelo `claude-opus-5-5` (configurável por `AI_MODEL`), saída estruturada em JSON e fallback automático do servidor em caso de recusa. Com ela ativa:

- o **Gerador** escreve as três respostas usando a biblioteca como referência de qualidade;
- **Gerar alternativa / outra versão** cria variações sob medida;
- o **Simulador** interpreta o cliente livremente e avalia cada resposta.

Sem a função, tudo continua funcionando com o conteúdo pré-cadastrado, e a tela informa isso.

## Testes

```bash
npm run typecheck   # TypeScript
npm test            # 46 testes de unidade: integridade do conteúdo, busca, gerador, avaliação, propostas, follow-up, camada de edição
npm run test:e2e    # 39 testes no navegador (Playwright): desktop, celular e modo nuvem com Supabase simulado
npm run test:sql    # migração + 33 verificações de RLS num PostgreSQL temporário (requer binários do PostgreSQL)
npm run test:edge   # Edge Function com Supabase e Anthropic simulados (requer Deno)
```

Os testes de conteúdo também barram frases proibidas nas respostas prontas (promessas de resultado, pressão, “você está perdendo clientes”).

## Estrutura

```
src/
  content/        biblioteca comercial (objeções, nichos, serviços, prospecção, follow-ups, cenários)
  data/           camada de dados: modo local (localStorage) e Supabase; mesclagem do conteúdo editado
  lib/            busca, gerador sem IA, avaliação por regras, propostas, follow-up, cliente da IA
  pages/          telas
  components/     layout, interface e formulários do painel administrativo
supabase/
  migrations/     esquema, RLS e funções
  functions/ai/   Edge Function de IA (Deno) + testes
  tests/          testes de RLS
tests/e2e/        testes Playwright
```

## Limites honestos

- No modo local não há login nem compartilhamento: é para uso individual no próprio navegador.
- A avaliação do simulador sem IA é feita por regras objetivas (reconhecimento, perguntas, ligação com o contexto, próximo passo, ausência de promessas e pressão). É útil para treino, mas não substitui a leitura de uma pessoa ou da IA.
- Campos entre colchetes (`[nome]`, `[valor]`) devem ser preenchidos antes de enviar qualquer mensagem.
- Orientações sobre conselhos profissionais e LGPD são cuidados gerais; valide o conteúdo de cada cliente com o responsável técnico ou jurídico.
