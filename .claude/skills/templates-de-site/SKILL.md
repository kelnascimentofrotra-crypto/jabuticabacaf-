---
name: templates-de-site
description: Consulta a biblioteca local de templates de site por categoria em `templates/sites/` antes de começar qualquer site do zero. Use SEMPRE que o usuário pedir pra "fazer um site pra", "criar landing pra", "montar site do cliente X", "tem template pra esse nicho?", "usar aquele template", "site de oficina/revenda/concessionária/táxi", ou quando for começar um site novo e ainda não tiver decidido a base. Também use quando ele quiser ADICIONAR um template novo à biblioteca ("guarda esse template", "salva pra usar depois", "coloca na pasta de templates"). Evita começar do zero um site que já existe pronto, evita duplicar template que já está guardado, e evita repetir sempre o mesmo template pro mesmo nicho. Stack: HTML estático (varia por template).
---

# Templates de site por categoria

Existe uma biblioteca local de templates prontos em
**`templates/sites/`**, organizada por **categoria ampla**, não por
nicho fechado. Antes de escrever a primeira linha de um site novo, olhar
lá — pode já existir base pronta, mesmo que não seja do nicho exato.

O catálogo completo, com todas as notas por template, vive em
`templates/sites/README.md`. **Ler esse arquivo é o primeiro
passo** — a tabela muda conforme o usuário adiciona template, e o resumo
abaixo pode estar desatualizado.

## Como escolher (reorganizado em 26/09/2026)

1. **Categoria ampla vence nicho exato.** Template de "carro" serve qualquer
   negócio de carro (revenda, estética, oficina, lava-jato). Template de
   diarista pode virar site de encanador. Dentista e nutricionista dividem
   categoria. Barbearia já serve salão de beleza. Pizzaria e restaurante são
   a mesma categoria (gastronomia). Não restringir a busca ao nicho exato do
   cliente — procurar a categoria primeiro.
2. **Cada categoria tem pelo menos 2 templates, de propósito — é pra
   variar.** Antes de escolher, checar quais templates dessa categoria já
   foram usados nos últimos clientes (perguntar ao usuário se não tiver
   certeza, ou olhar `captacoes/aprendizados.md`/histórico do projeto) e
   **não repetir o mesmo template pro 2º ou 3º cliente seguido da mesma
   categoria** quando existe alternativa. Só automotivo e cinema ainda são
   categorias de opção única (sinalizado no catálogo) — ali a repetição é
   inevitável até a biblioteca crescer.
3. **"Frankenstein" entre templates da mesma categoria é permitido e
   incentivado**: hero de um + galeria/depoimento de outro, quando isso serve
   melhor o cliente ou evita repetir a combinação inteira de outro cliente.
   Antes de misturar, conferir se a versão de framework bate (Bootstrap 3 vs
   5 têm classe diferente) e se a paleta de um não vaza pro outro.
4. **Construir do zero é o último recurso** — reservado pra quando a
   categoria inteira não tem nada pronto, não quando só falta o nicho exato
   dentro de uma categoria que já tem template.

## Categorias (resumo — detalhe completo em README.md)

| Categoria | Pastas | Qtde |
|---|---|---|
| Serviço residencial / reparo doméstico | `manutencao-handify/` `manutencao-qlinest/` `limpeza-laun/` `climatizacao-coolair/` `climatizacao-oyoxo/` | 5 |
| Imóveis, arquitetura e construção | `imoveis-lemanhouse/` `imoveis-quicksale/` `imoveis-domira/` `arquitetura-axisbuilt/` `construcao-construc/` `construcao-renova/` | 6 |
| Beleza e estética pessoal | `barbearia-trimly/` `barbearia-barberon/` `barbearia-qutter/` `barbearia-hairbarber/` `estetica-haircare/` `estetica-spamagic/` | 6 |
| Corpo em movimento (fitness) | `academia-gymfito/` `personal-progym/` `personal-fitmas/` `personal-samantha/` | 4 |
| Saúde e bem-estar clínico | `odontologia-decare/` `odontologia-dentisto/` `odontologia-dentia-php/` `odontologia-dentia-next/` `saude-clinicmaster/` `saude-counseling/` `saude-mentalpress/` | 7 |
| Advocacia / serviços jurídicos | `advocacia-solven/` `advocacia-lawgne/` `advocacia-qualacoat/` | 3 |
| Alimentação / gastronomia | `pizzaria-onepage/` `restaurante-thesignature/` `restaurante-elegencia/` `restaurante-fresheat/` `restaurante-royate/` `restaurante-foodio/` `restaurante-foodu/` `restaurante-grillino/` | 8 |
| Automotivo | `automotivo-carlink/` `automotivo-kars/` `automotivo-automec/` `automotivo-autovent/` | 4 |
| Hospedagem (hotel, pousada, hostel, chácara/sítio de aluguel) | `hospedagem-leluxe/` `hospedagem-boostay/` `hospedagem-qomfort/` `hospedagem-hotelmaster/` (5 demos internos) | 4 |
| Cinema / entretenimento (opção única) | `cinema-movflx/` | 1 |
| Tecnologia / TI | `tech-luminex/` (6 demos internos) | 1 pasta, 6 sub-demos |

**Stacks fora do padrão HTML estático** (fluxo de uso diferente — checar o
README da pasta antes): `automotivo-automec/` é React/Vite (precisa
`npm install`+build), `odontologia-dentia-next/` é Next.js (idem, mas é
nativo da Vercel), `odontologia-dentia-php/` é PHP sem banco de dados mas
com `mail()` que não roda em runtime serverless.

**Advocacia:** os 3 templates têm estatística de "% de casos ganhos"
(vedada pelo Provimento 205/2021 CFOB) — remover/reescrever sempre antes de
publicar pra cliente real, nunca deixar como "a confirmar".

**Hospedagem:** nenhum dos 4 tem foto real, e ali a foto é o produto. Não
publicar sem as fotos do cliente. Para chácara/casa de temporada as bases são
`hotelmaster` demo `apartment`, `qomfort` `index3` e `boostay` `index-3`; para
chácara de evento, `boostay` `index-2`. O Leluxe é o que já vem traduzido.

## Como usar um template

1. Identificar a **categoria** do cliente (não só o nicho exato) no README.md
2. Se a categoria tem mais de um template, checar o que já foi usado
   recentemente e escolher outro — ou montar um frankenstein
3. Ler o `README.md` da pasta escolhida — ele diz para que serve, para que
   **não** serve, e quais são as armadilhas
4. Mostrar os previews em `preview/` ao usuário e deixar ele escolher a
   variação olhando, em vez de descrever com texto
5. Rodar o script de personalização:

   ```bash
   templates/sites/<pasta>/personalizar.sh <destino> '#COR' 'Nome do Cliente'
   ```

   Ele copia o template para a pasta do cliente com a cor de marca e o nome já
   trocados. **O original nunca é alterado** — cada cliente sai de uma cópia.

6. Executar a lista de trabalho manual que o script imprime (logo, escolha da
   página, tradução dos textos, contato, fotos)

## Quando NÃO usar nenhum template da categoria

Dizer isso na cara, em vez de forçar a base errada:

- **A identidade do cliente briga com a de todos os templates da
  categoria.** Inverter um template de base clara para preto dominante custa
  mais que escrever CSS do zero, quando o CSS não tem variáveis. No Carlink
  já foi medido: 23.008 linhas chumbadas, 78 regras de fundo branco contra 37
  escuras
- **A categoria inteira não tem nada** (raro — só acontece fora das 10
  categorias já mapeadas)
- **O cliente vende serviço e o template mais próximo é de catálogo.**
  Template de catálogo de veículo tem busca por marca/modelo, ficha técnica e
  financiamento — pra quem vende serviço isso sobra. Ainda assim, usar a
  estrutura como base e cortar o que sobra é melhor que começar do zero (ver
  regra 4 acima) — só ir pro zero quando cortar custar mais que reescrever

Nesses casos raros, o template mais próximo ainda serve como **referência de
estrutura de seção** — só não como base de CSS. E se o site sair do zero
mesmo assim, ele **vira template novo da categoria** ao final (ver "Como
adicionar um template novo" no README.md) — não fica perdido dentro da pasta
de um cliente só.

## Como adicionar um template novo

Seguir a forma descrita em `templates/sites/README.md`:
pasta `<nicho>-<template>/` com `README.md`, `personalizar.sh`, `preview/` e o
template. Ao terminar, atualizar **duas** listas: a tabela do catálogo em
README.md (inserindo na categoria certa, criando categoria nova só se não
houver nenhuma parecida) e o resumo desta skill. Se só uma for atualizada,
elas divergem.

Antes de guardar, limpar o entulho de template comprado: banner do marketplace,
landing de demonstração, seletor de cores do demo, `__MACOSX/`, `.DS_Store`,
`lang` errado e `<title>` com o nome do template. E conferir quem linkava para a
página apagada — em template comprado o logo costuma apontar para a landing de
demonstração.

## Gerar os previews

Chromium do Playwright normalmente já está em
`~/AppData/Local/ms-playwright/`. Com `playwright-core` instalado numa pasta
temporária dá para screenshotar cada página do template sem instalar navegador:

```js
const { chromium } = require('playwright-core');
const b = await chromium.launch({ executablePath: '<caminho do chrome.exe>' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('file:///.../home-1.html', { waitUntil: 'load' });
await p.waitForTimeout(2500);            // jQuery e sliders precisam assentar
await p.screenshot({ path: 'preview/home-1.jpg', type: 'jpeg', quality: 72 });
```
