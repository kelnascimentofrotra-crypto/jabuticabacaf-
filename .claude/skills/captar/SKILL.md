---
name: captar
description: Prospecta clientes novos pro funil de captação da oficina — estuda o mercado, busca no Google Maps por nicho e região, filtra quem é bom negócio com um gap verificável, e devolve um dossiê pra aprovação humana antes de qualquer produção. Use quando o usuário pedir "/captar", "captar N clientes de X", "quero N pizzarias/dentistas/barbearias pra prospectar", "acha clientes novos no Maps", ou "que nicho tá bom pra captar agora". Não decide sozinho quem vira cliente — só devolve candidatos pra aprovação; produção só começa depois com a skill `produzir`.
---

# Captar — prospecção automatizada pro funil de captação

Primeira etapa do pipeline `/captar → aprovação humana → /produzir → /resultado`.
Esta skill só prospecta e devolve um dossiê. **Nunca produz identidade, site ou
abordagem** — isso é trabalho da skill `produzir`, e só roda depois que o usuário
aprovar os candidatos.

## Uso

```
/captar 6 pizzaria
/captar 2 pizzaria 2 dentista 2 barbearia    ← múltiplos nichos numa rodada
/captar 6 pizzaria em Ipatinga                ← cidade fora da região padrão
/captar 6                                     ← sem nicho: propor com base no mercado
/captar --estudo                              ← só força a renovação de captacoes/mercado.md
```

## Passo 0 — Estudo de mercado (sempre primeiro)

Antes de qualquer busca no Maps, conferir `captacoes/mercado.md`:

- **Não existe, ou a data no cabeçalho tem mais de 14 dias, ou veio `--estudo`:**
  refazer via WebSearch. Pesquisar: quais nichos locais (comércio/serviço da
  região padrão do Passo 2) estão aquecidos agora — sazonalidade, tendência de
  consumo, nicho que costuma ter alta demanda e baixa presença digital; e, por
  nicho, o que esses negócios costumam estar precisando (site, cardápio digital,
  agendamento, portfólio, prova social). Não é pesquisa de mercado acadêmica —
  é o suficiente pra ranquear 5–8 nichos com uma frase de justificativa cada e
  anotar o gap típico de cada um (isso alimenta o Passo 3).
  Escrever `captacoes/mercado.md` com: data no topo, ranking de nichos com
  justificativa, necessidades/gaps típicos por nicho.
- **Existe e está fresco:** usar direto, sem gastar busca de novo.

Se o usuário não informou nicho no comando, propor 2-3 opções do topo do ranking
com a justificativa e **perguntar antes de prospectar** — não escolher sozinho.

## Passo 1 — Ler o que já se sabe

- `captacoes/aprendizados.md` — critérios de prospect que já se mostraram bons
  ou ruins (ex.: "gap de link quebrado converte mais que gap de falta de site").
  Ler, nunca escrever aqui — só `resultado` escreve.
- Todo slug em `clientes/` (ativo ou histórico) e qualquer rodada anterior em
  `captacoes/` — **nunca reprospectar quem já recusou ou já foi cliente**, nem
  dentro da mesma rodada nem em rodadas futuras.

## Passo 2 — Região padrão

Lista fixa do território de prospecção (editar aqui pra mudar):
**São Paulo – SP (capital)**. A cidade é grande demais pra uma busca só — o Maps
devolve os mesmos resultados do centro. Buscar por zona, nesta ordem, até ter
candidatos suficientes: **Zona Leste, Zona Norte, Zona Sul, Zona Oeste, Centro**
(ex.: `vidraçaria+zona+leste+são+paulo`). Se o usuário disser outra cidade ou
bairro no comando, usar só ela (não soma à lista, substitui).

## Passo 3 — Busca no Google Maps (Playwright)

Usar as ferramentas `mcp__playwright__browser_navigate` /
`mcp__playwright__browser_snapshot` / `mcp__playwright__browser_click` numa
sessão sequencial de browser (não paralelizar essa etapa — é uma sessão só).

1. Ir em `https://www.google.com/maps/search/<nicho>+<cidade>`.
2. Rolar a lista de resultados e abrir cada card relevante (~15–25 no total,
   cidades da lista até esgotar ou até ter candidatos suficientes).
3. Por card: nome, nota, total de avaliações, telefone, endereço, horário,
   site/Instagram cadastrado (ou ausência disso), 2–3 fotos, 2–3 frases boas de
   avaliações recentes.

## Passo 4 — Filtro "bom negócio com gap verificável"

Só passam candidatos que atendem **os dois**:

- **Negócio vivo e bom:** nota ≥ ~4,3 com avaliações suficientes pra não ser
  ruído (uns 15+ ajuda, mas julgar pelo padrão do nicho — nicho novo pode ter
  menos volume).
- **Gap concreto, verificável em 5 segundos:** sem site cadastrado no Maps; site
  que não carrega ou é só um Linktree genérico; perfil sem endereço/horário;
  link da bio quebrado. **O gap tem que ser conferido de verdade** (Passo 5) —
  nunca afirmar um gap que não foi checado.

Descartar quem já tem presença digital decente — não é sobre "site bonito", é
sobre "site ruim/ausente que a marca não merece".

## Passo 5 — Inspecionar de verdade

Pra cada candidato que passou no filtro: abrir o site/Instagram com Playwright
e confirmar o gap na prática (link quebra? cai direto no zap sem contexto? é
placeholder de plataforma genérica?).

O gap verificado vira **uma frase objetiva** — é o gancho da abordagem, e tem
que ser algo que o dono confere na hora, tipo "o link da bio cai numa página
que não abre".

### Achar o Instagram CERTO

Ordem de fonte: (1) link de Instagram na própria ficha do Maps, (2) link no site
do negócio, (3) busca web. Handle vindo de busca web **só vale depois de
confirmado** — a bio ou os posts precisam bater com a ficha do Maps (cidade,
telefone, endereço, ou a fachada da foto do Maps aparecendo num post).

Caso real (pizzaria do teste do pipeline, 23/09/2026): a busca devolveu um @
com telefones DDD 87 e 74 — era outra pizzaria de mesmo nome, e o handle
chegou a ir pro demo como "perfil confirmado". Sem confirmação, o Instagram fica "não encontrado" e
o demo não cita nenhum @.

Perfil público abre no Playwright **sem login**. Se a página mostrar "Perfil
não está disponível", o handle não existe ou é privado — não é bloqueio, é
sinal de handle errado. (Endpoint `api/v1/users/web_profile_info` dá 429 sem
login; não usar.)

## Passo 6 — Colher material e identidade visual

Pasta: `captacoes/AAAA-MM-DD-<nichos>/assets/<slug-provisorio>/`. Script de
apoio: `.claude/skills/captar/scripts/material.py` (usa Pillow, ffmpeg e
yt-dlp, já instalados nesta máquina).

**Do Maps:** nome, contato, endereço, horário, nota + total de avaliações;
2–3 frases de avaliações reais (**só viram depoimento no demo marcadas como
citação de review, nunca como depoimento fabricado**); e a **galeria de
fotos inteira**, que costuma ser a melhor fonte de material real. Abrir a
ficha, clicar na categoria "Tudo" da galeria, rolar e coletar:

```js
async () => {
  const urls = new Set();
  const grab = () => document.querySelectorAll('[style*="googleusercontent"], img[src*="googleusercontent"]')
    .forEach(e => { const s = e.src || (e.getAttribute('style') || '').match(/url\("?([^")]+)/)?.[1];
                    if (s && /\/(p|gps-cs-s)\//.test(s)) urls.add(s.split('=')[0]); });
  const roladores = [...document.querySelectorAll('div')].filter(d =>
    d.scrollHeight > d.clientHeight + 50 && getComputedStyle(d).overflowY.match(/auto|scroll/));
  for (let i = 0; i < 15; i++) { roladores.forEach(s => s.scrollTop += 1200);
                                 await new Promise(r => setTimeout(r, 700)); grab(); }
  return [...urls];
}
```

URL do Maps **não é assinada**: acrescentar `=w1600` baixa em 1600 px. Montar
uma folha de contato (Pillow) e olhar tudo de uma vez antes de escolher.

Na pizzaria do teste (23/09/2026) a galeria tinha 36 fotos: salão, pratos, cardápio
fotografado **e o logo** (letras metálicas na parede, painel do cardápio).
O negócio não tinha Instagram nem logo no Facebook — a identidade inteira
saiu das fotos que clientes subiram no Maps.

**Facebook:** quando o Instagram não aparece, a página do Facebook costuma
existir. Confirmar pelo endereço/telefone igual ao Maps. Serve pra WhatsApp
atualizado (aparece nas artes de promoção — anotar a data do post) e paleta
das artes; as fotos costumam ser arte de promoção com pizza de banco de
imagem, que não entra no site.

**Do Instagram (se confirmado no Passo 5)** — abrir o perfil no Playwright e
extrair com `browser_evaluate`:

```js
() => {
  const imgs = [...document.querySelectorAll('img')];
  const logo = imgs.find(i => /Foto do perfil|profile picture/i.test(i.alt));
  const posts = [...document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')]
    .map(a => ({ href: a.href, img: a.querySelector('img')?.currentSrc,
                 alt: a.querySelector('img')?.alt?.slice(0, 120) }));
  return { bio: document.querySelector('header')?.innerText,
           logo: logo?.currentSrc, posts };
}
```

Sai: bio (serviço, cidade, link da bio — que vira gap se estiver quebrado), a
foto de perfil (quase sempre a logo) e as 12 últimas postagens em 640 px, com
a descrição automática no `alt` ("Pode ser uma imagem de pizza…"), que ajuda a
escolher sem abrir cada uma.

- **Logo:** `python material.py baixar "<url>" logo.jpg`. Usar a URL **exatamente
  como veio** — trocar `s150x150` por tamanho maior invalida a assinatura (403).
  Vem em 150 px: serve de referência de cor e forma, não pra topo de site em
  tela retina.
- **Paleta:** `python material.py paleta logo.jpg` → cores dominantes em hex
  com a proporção de cada uma, marcando quase-branco/quase-preto. Conferir
  olhando a logo (Read na imagem) — a quantização junta tons parecidos.
- **Tipografia:** não sai de imagem por script. Olhar a logo e 2–3 posts e
  anotar a *referência* (serifada clássica, condensada, manuscrita, arredondada)
  — a fonte exata fica "a confirmar".
- **Fotos:** baixar as postagens que prestam pra site (produto, ambiente,
  fachada, equipe trabalhando) com `material.py baixar`. Pular post com texto
  grande por cima, arte de promoção com preço e foto centrada em cliente
  identificável (criança, principalmente).
- **Reels:** só listar os 2–3 melhores links no dossiê — o download (mais
  pesado) fica pra `produzir`, e só dos aprovados.

**Ordem de fonte da identidade visual:** logo do Instagram → logo em foto do
Maps (parede, fachada, cardápio, embalagem) → artes do Facebook. Só quando
nenhuma das três existir a cor é provisória, declarada como tal.

**Pessoas nas fotos:** pular foto com criança ou cliente identificável em
destaque, e selfie. Cerveja com marca também fica de fora.

## Passo 7 — Recomendar formato do demo

Consultar a skill `templates-de-site` (biblioteca em `templates/sites/`,
catálogo crescendo). Se o nicho tem template pronto, recomendar ele. Se o gap
específico pede outra coisa além de site — ex.: negócio claramente afogado em
controle manual de pedido/agenda → mini-CRM ou dashboard simples — recomendar
isso e justificar em uma frase. **Lembrete: é demo.** Qualquer CRM/dashboard
recomendado tem que ser simples e minimamente funcional, nunca um produto
completo — isso é decisão de execução da skill `produzir`, aqui só recomenda.

## Passo 8 — Entregar o dossiê e parar

Escrever `captacoes/AAAA-MM-DD-<nichos>/dossie.md`, uma seção por candidato:

```markdown
## <N>. <Nome do negócio>

**Nicho:** ... **Cidade:** ...
**Contato:** telefone/WhatsApp — endereço — horário
**Por que é bom:** nota X,X (Y avaliações), [o que chama atenção]
**Gap verificável:** [uma frase, o que o dono confere em 5s]
**Instagram:** @handle — como foi confirmado (ou "não encontrado")
**Identidade visual:** cores da logo em hex + referência de tipografia
(ou "a definir"), logo em `assets/<slug>/logo.jpg`
**Material disponível:** fotos Maps (N), fotos Instagram (N), reels
selecionados (links), reviews citáveis (N)
**Demo recomendado:** [template / do zero / CRM simples] — justificativa
**Risco:** [ex.: Instagram não verificado / poucas fotos]
```

Terminar a mensagem convidando o usuário a:
1. Aprovar/trocar candidatos (ex.: "aprovo 1, 3, 4 — troca o 2")
2. Vetar ou ajustar o formato de demo recomendado
3. Mandar o @ certo de quem ficou com Instagram "não encontrado", se souber

**Não seguir para produção sozinho.** A skill `produzir` só roda depois dessa
aprovação explícita.
