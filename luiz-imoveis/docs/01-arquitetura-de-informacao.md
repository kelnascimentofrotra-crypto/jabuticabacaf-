# 1. Arquitetura de Informação

> Como o site de **Luiz · Curadoria Imobiliária** está organizado, como as páginas se conectam e por que cada decisão serve a um comprador de alto padrão.

---

## 1.1 Princípios que orientam a estrutura

| # | Princípio | O que significa na prática |
|---|-----------|----------------------------|
| 1 | **Curadoria, não catálogo** | Poucas residências, muito bem apresentadas. Nada de grids com 60 resultados e etiquetas "OPORTUNIDADE!". A Home mostra no máximo 6 destaques. |
| 2 | **Contato a dois toques** | De qualquer tela, o visitante chega a Luiz em até dois toques: botão "Agendar visita" no cabeçalho, WhatsApp flutuante e, no detalhe do imóvel (mobile), uma barra fixa com valor + "Agendar visita". |
| 3 | **Privacidade por padrão** | Endereço exato só no agendamento; mapa mostra área aproximada; depoimentos só com iniciais; existe uma *Coleção privada* para imóveis que não são publicados. |
| 4 | **Mobile-first** | A jornada completa (descobrir → filtrar → ver fotos → agendar) funciona com o polegar. O desktop é uma *ampliação* da experiência mobile, não o contrário. |
| 5 | **URLs compartilháveis** | Filtros refletem na URL (`?categoria=venda&local=jardim-europa`). Luiz pode enviar pelo WhatsApp um link já filtrado ou a página de um imóvel específico. |

---

## 1.2 Mapa do site

```
Início  /
│
├── Coleção  /imoveis ................................ listagem com filtros
│   ├── Venda          /imoveis?categoria=venda       (produção: /venda)
│   ├── Aluguel        /imoveis?categoria=aluguel     (produção: /aluguel)
│   ├── Lançamentos    /imoveis?categoria=lancamento  (produção: /lancamentos)
│   └── Residência     /imovel?id=<slug>             (produção: /imoveis/<slug>)
│         ├── Galeria completa (lightbox)
│         ├── Localização aproximada
│         ├── Agendar visita (imóvel pré-selecionado)
│         └── Residências relacionadas
│
├── Sobre Luiz  /sobre
│   ├── Trajetória e números
│   ├── Princípios
│   └── Método  /sobre#metodo
│
├── Contato  /#contato .............................. (produção: /contato)
│   ├── Agendar visita privativa
│   ├── Enviar mensagem
│   └── Coleção privada (off-market) → abre "Enviar mensagem"
│
└── Institucional (rodapé)
    ├── Política de Privacidade  /privacidade   (LGPD)
    └── Termos de uso            /termos
```

> No protótipo (HTML estático), as URLs usam `imoveis.html` e `imovel.html?id=`. Na implementação em Next.js, recomenda-se a forma "limpa" indicada entre parênteses, com rotas estáticas geradas por imóvel.

---

## 1.3 Inventário de páginas

| Página | Objetivo | Conteúdo principal (em ordem) | CTA primário | CTA secundário |
|--------|----------|-------------------------------|--------------|----------------|
| **Início** | Impressionar, gerar confiança e direcionar | Hero full-screen + busca rápida · Manifesto + números · 3 categorias · Destaques com filtros · Galeria masonry · Sobre (resumo) · Depoimentos · Coleção privada · Contato | Conhecer a coleção | Conversar com Luiz |
| **Coleção** | Encontrar a residência certa | Título editorial · Filtros (modalidade, localização, valor, quartos, estilo) · Ordenação · Grade assimétrica · Estado vazio que leva à coleção privada | Abrir residência | Solicitar curadoria privada |
| **Residência** | Encantar e converter em visita | Galeria (1 + 2 no desktop / carrossel no mobile) · Nome, local e assinatura · Ficha técnica · Descrição · Diferenciais · Galeria completa · Localização aproximada · Cartão de valor fixo · Relacionadas · Agendamento | Agendar visita privativa | WhatsApp · Compartilhar |
| **Sobre** | Humanizar e provar autoridade | Retrato + apresentação · Trajetória · Números · Princípios · Método em 4 etapas · Depoimentos · CTA final | Agendar uma conversa | Prefiro WhatsApp |
| **Contato** (seção) | Remover qualquer atrito | Canais diretos (WhatsApp, e-mail, telefone) · Formulário em abas: *Agendar visita* / *Enviar mensagem* · Nota de confidencialidade | Solicitar visita | Enviar mensagem |

---

## 1.4 Navegação global

**Cabeçalho (todas as páginas)**

```
LUIZ                 Venda  Aluguel  Lançamentos  Sobre  Contato        [ Agendar visita ]
Curadoria Imobiliária
```

- **Estados:** transparente (texto claro) sobre o hero → sólido off-white com desfoque ao rolar → **recolhe ao descer** e **reaparece ao subir** (mais área para as fotos, sem perder o acesso ao menu).
- **Mobile (< 1100 px):** marca + botão "Menu". O menu abre em tela cheia (preto fosco), com links grandes em serifa numerados `01–05`, botão "Agendar visita privativa" e contatos diretos.
- **Página atual** sinalizada com sublinhado dourado (`aria-current="page"`).

**Atalhos persistentes**

| Elemento | Onde | Quando aparece |
|----------|------|----------------|
| WhatsApp flutuante (círculo preto, ícone dourado) | Todas as páginas | Depois de rolar ~70% da primeira tela |
| Barra fixa "valor + Agendar visita" | Detalhe do imóvel, mobile | Depois de rolar 420 px |
| Breadcrumb | Coleção, Residência, Sobre | Sempre |

**Rodapé:** marca em grande escala, mapa do site completo, contatos, CRECI, links legais e aviso de privacidade.

---

## 1.5 Como as páginas se conectam

```
                       ┌──────────────── Busca rápida (hero) ─────────────┐
                       │                                                  ▼
 ┌───────────┐   Cartões de categoria   ┌──────────────┐   Card    ┌──────────────┐
 │   INÍCIO  │ ───────────────────────► │   COLEÇÃO    │ ────────► │  RESIDÊNCIA  │
 │           │ ───── Destaques ───────────────────────────────────►│              │
 └─────┬─────┘                          └──────┬───────┘           └──┬────┬──────┘
       │ Galeria → Lightbox                    │ Estado vazio         │    │ Relacionadas
       │                                       ▼                      │    └──────► RESIDÊNCIA
       │ Sobre (resumo) ──► SOBRE      COLEÇÃO PRIVADA                │
       │                      │               │                       │ Agendar visita
       ▼                      ▼               ▼                       ▼ (imóvel pré-selecionado)
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │  CONTATO  ·  Agendar visita  |  Enviar mensagem  ·  WhatsApp · E-mail · Tel   │
 └──────────────────────────────────────────────────────────────────────────────┘
```

Regras de conexão:

1. **Todo card leva ao detalhe**; todo detalhe oferece **3 relacionadas** (mesma modalidade primeiro) — o visitante nunca chega a um "beco sem saída".
2. **Todo estado vazio vira oportunidade:** "Nenhuma residência publicada corresponde a esta busca" → convite à *Coleção privada*.
3. **Contexto viaja junto:** ao clicar em "Agendar visita" no detalhe, o formulário já vem com o imóvel selecionado; a mensagem de WhatsApp já cita o imóvel e o link.

---

## 1.6 Jornadas principais

| Persona | Contexto | Caminho | Ponto de conversão |
|---------|----------|---------|--------------------|
| **Comprador decidido** | Mobile, chega pelo Instagram | Início → *Venda* → filtra bairro e quartos → Residência → galeria | WhatsApp a partir da barra fixa |
| **Indicação** | Recebe o link de um imóvel por WhatsApp | Residência → fotos em tela cheia → ficha técnica | "Agendar visita privativa" |
| **Investidor** | Desktop, pesquisa lançamentos | Início → *Lançamentos* → compara plantas e entrega → Residência | "Enviar mensagem" pedindo tabela |
| **Quem não encontrou** | Filtros muito restritivos | Coleção → estado vazio → Coleção privada | Mensagem com o perfil desejado |
| **Família sem pressa** | Desktop, à noite | Início → Sobre → Método → Depoimentos | "Agendar uma conversa" |

---

## 1.7 Taxonomia

| Faceta | Valores | Observações |
|--------|---------|-------------|
| **Modalidade** | Venda · Aluguel · Lançamentos | Navegação principal e primeiro filtro. |
| **Tipo** | Casa · Casa em condomínio · Casa de campo · Casa de praia · Apartamento · Cobertura | Exibido no card e na ficha. |
| **Estilo** | Contemporâneo · Minimalista · Clássico · Modernista · Tropical moderno | Filtro "Estilo" — diferencial para o público de luxo. |
| **Localização** | Cidade → Bairro/Condomínio (agrupado em `optgroup`) | Gerada automaticamente a partir dos imóveis. |
| **Valor** | Venda/Lançamento: até 15 mi · 15–25 mi · 25–40 mi · acima de 40 mi<br>Aluguel: até 40 mil · 40–60 mil · acima de 60 mil (mensal) | Faixas mudam conforme a modalidade; desabilitado em "Todos". |
| **Quartos** | 3+ · 4+ · 5+ (contados como suítes) | Chips de toque rápido. |
| **Ordenação** | Em destaque · Maior valor · Menor valor · Maior área | Somente na Coleção. |

Valores **"sob consulta"** continuam participando dos filtros pelo valor interno, mas nunca exibem o número.

---

## 1.8 Modelo de conteúdo (front-end)

Sem banco de dados nesta fase: o conteúdo vive em arquivos estáticos (JSON/MDX ou, no protótipo, `assets/js/data.js`). A forma abaixo já está pronta para migrar para um CMS headless na fase 2.

```ts
type Categoria = 'venda' | 'aluguel' | 'lancamento';

interface Residencia {
  id: string;              // slug: 'casa-jacaranda'
  name: string;            // 'Casa Jacarandá'
  category: Categoria;
  type: string;            // 'Casa', 'Cobertura'…
  style: string;           // 'Contemporâneo'…
  neighborhood: string;    // 'Jardim Europa'
  city: string;            // 'São Paulo'
  price: number;           // valor de venda, aluguel mensal ou "a partir de"
  priceOnRequest?: boolean;// exibe "Valor sob consulta"
  area: number;            // m² (mínimo, em lançamentos)
  areaMax?: number;        // lançamentos: faixa de plantas
  land?: number | null;    // terreno, m²
  bedrooms: number;        // suítes (máximo, em lançamentos)
  bedroomsMin?: number;
  parking: number;
  year?: number;           // construção
  delivery?: number;       // lançamentos: ano de entrega
  featured: boolean;       // aparece nos destaques da Home
  tagline: string;         // 1 frase, até ~110 caracteres
  description: string[];   // 2–3 parágrafos
  highlights: string[];    // 6 diferenciais
  images: string[];        // 1ª = capa; 2ª = foto do hover no card
}
```

---

## 1.9 Hierarquia de leitura no detalhe do imóvel

Ordem pensada para quem decide em segundos e confirma em minutos:

1. **Fotos** (emoção) — primeira dobra inteira.
2. **Nome + local + assinatura** (identidade) — "Casa Jacarandá · Jardim Europa".
3. **Ficha técnica** em 5 números (racionalidade rápida).
4. **Valor e ação** — fixo à direita no desktop, barra inferior no mobile.
5. **Descrição** e **diferenciais** (desejo).
6. **Galeria completa** (exploração).
7. **Localização aproximada** (contexto, com privacidade).
8. **Relacionadas** e **agendamento** (continuidade).

---

## 1.10 Estrutura semântica e compartilhamento

- **Títulos de página:** `Nome do imóvel · Bairro — Luiz, Curadoria Imobiliária`.
- **Dados estruturados (fase de implementação):** `RealEstateListing` + `SingleFamilyResidence`/`Apartment` (schema.org) e `RealEstateAgent` para Luiz.
- **Open Graph:** imagem 1200 × 630 da capa do imóvel — é a "vitrine" do link enviado pelo WhatsApp.
- **Hierarquia de headings:** um `h1` por página; seções com `h2`; cards com `h3`.
