# 2. Wireframes conceituais

> Estrutura das páginas principais em baixa fidelidade. Cada wireframe tem versão **mobile (390 px)** — a referência de projeto — e **desktop (1440 px)**. O protótipo navegável em `../index.html` implementa exatamente estas estruturas.

**Legenda:** `▓` imagem · `[ BOTÃO ]` CTA · `( chip )` seleção · `____` campo · `—— EYEBROW` rótulo em caixa-alta com fio dourado · *itálico* = trecho em serifa itálica.

---

## 2.1 Início (Home)

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ LUIZ            Venda   Aluguel   Lançamentos   Sobre   Contato    [ AGENDAR VISITA ] │ ← transparente
│ Curadoria Imob.                                                                      │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓  —— CURADORIA IMOBILIÁRIA DE ALTO PADRÃO           HERO 100vh · foto/vídeo        ▓│
│▓                                                     zoom lento 1.1 → 1.0          ▓│
│▓  Exclusividade                                                                    ▓│
│▓  encontra *seu                                                                    ▓│
│▓  novo lar.*                                                                       ▓│
│▓  Residências singulares, apresentadas com discrição…                          R  ▓│
│▓  [ CONHECER A COLEÇÃO → ]   Conversar com Luiz                                O  ▓│
│▓                                                                               L  ▓│
│▓ ┌────────────────────────────────────────────────────────────────────────────┐ E  ▓│
│▓ │ VENDA  Aluguel  Lançamentos │ Localização ____ ▾ │ Quartos ____ ▾ │[EXPLORAR]│    ▓│ ← vidro fosco
│▓ └────────────────────────────────────────────────────────────────────────────┘    ▓│
├──────────────────────────────────────────────────────────────────────────────────────┤
│                              —— O OLHAR DE UM CURADOR                                │ MANIFESTO
│            Não apresento metros quadrados. Apresento *endereços que contam           │ fundo off-white
│                 histórias* — e ajudo você a encontrar aquele que vai contar a sua.   │
│                                         — Luiz                                       │
│ ──────────────────────────────────────────────────────────────────────────────────── │
│   18                 320+                R$ 2,4 bi              70%                  │ números (contagem
│   anos no alto       residências         em negócios            por indicação        │  animada)
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— NAVEGUE PELA COLEÇÃO                                                              │ CATEGORIAS
│ Três caminhos para o *mesmo destino.*                     Comprar, alugar ou…        │ fundo linho
│ ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐               │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │                    │  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│               │ card do meio
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│               │ deslocado ↓
│ │ 01                 │  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │ 03                 │               │ (assimetria)
│ │ Venda              │  │ 02                 │  │ Lançamentos        │               │
│ │ ──── 6 RESID.    → │  │ Aluguel            │  │ ──── 3 RESID.    → │               │
│ └────────────────────┘  │ ──── 3 RESID.    → │  └────────────────────┘               │
│                         └────────────────────┘                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— COLEÇÃO EM DESTAQUE                                                               │ DESTAQUES
│ Selecionadas com rigor, *apresentadas com intenção.*            VER TODA A COLEÇÃO → │
│ ──────────────────────────────────────────────────────────────────────────────────── │
│ TODOS  Venda  Aluguel  Lançamentos                                                   │ filtros ao vivo
│ Localização ____▾   Valor ____▾   Quartos (Todos)(3+)(4+)(5+)   Estilo ____▾         │
│                                                                    Limpar filtros    │
│ 6 destaques de 12 residências                                                        │
│ ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                               │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │              │   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← 4:5; hover troca p/ 2ª foto  │
│ │▓▓▓▓ 4:5 ▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   + zoom 1.045 + "Ver residência"│
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                               │
│ JARDIM EUROPA·SP   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   FAZENDA BOA VISTA                               │
│ Casa Jacarandá     VILA NOVA CONC.    Villa Aroeira                                  │
│ 1.150 m² · 5 suítes Cobertura Horiz.  1.400 m² · 6 suítes                            │
│ ───────────────    620 m² · 4 suítes  ───────────────                                │
│ R$ 38.000.000 Casa ───────────────    Valor sob consulta                             │
│                    R$ 24.500.000                                                     │
│                         [ VER TODA A COLEÇÃO → ]                                     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— GALERIA   Detalhes que *definem um lar.*                                          │ MASONRY
│ ┌────────┐ ┌────────────┐ ┌────────┐                                                 │ 3 colunas,
│ │▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓│                                                 │ alturas livres;
│ │▓▓ 4:5 ▓│ └────────────┘ │▓ 1:1 ▓▓│                                                 │ clique → lightbox
│ │▓▓▓▓▓▓▓▓│ ┌────────────┐ └────────┘                                                 │
│ └────────┘ │▓▓▓ 3:4 ▓▓▓▓│ ┌────────┐                                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐   —— SOBRE LUIZ                                                 │ SOBRE (resumo)
│ │                  │   Discrição, método e um olhar treinado para o *extraordinário.* │
│ │   RETRATO P&B    │   Cada cliente chega com uma história… (lead serifada)          │
│ │      4:5         │   Texto de apoio…                                               │
│ │                  │   ───────────────────────────                                   │
│ └──────────────────┘   *Luiz*  CORRETOR · CRECI 000000-F   Conheça o método →        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                    ❝ Em nenhum momento me senti diante de um vendedor… ❞              │ DEPOIMENTOS
│                                M. A. · Empresário · Jardim Europa                    │ (só iniciais)
│                                  (←)   01 — 03   (→)                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│▓▓▓ —— COLEÇÃO PRIVADA                                                               ▓│ OFF-MARKET
│▓▓▓ Algumas residências *nunca chegam aos portais.*                                  ▓│ foto a 38%
│▓▓▓ Parte do portfólio é negociada em sigilo…     [ SOLICITAR ACESSO 🔒 ]           ▓│ sobre preto
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— CONTATO                                  ┌───────────────────────────────────────┐│ CONTATO
│ Vamos conversar sobre o seu                 │ AGENDAR VISITA   Enviar mensagem      ││ fundo preto
│ *próximo endereço.*                         │ Residência de interesse _____________▾││
│ Atendimento pessoal, sem intermediários…    │ Data preferida ______  (Manhã)(Tarde) ││
│ ─────────────────────────────────────       │ Nome ____________  Telefone ________  ││
│ ◯ WHATSAPP   Conversar agora             →  │ Prefiro: (WhatsApp)(Ligação)(E-mail)  ││
│ ◯ E-MAIL     luiz@…                      →  │ ☐ Autorizo o contato… (LGPD)          ││
│ ◯ TELEFONE   +55 11 …                    →  │ Visitas privativas…  [SOLICITAR VISITA]││
│ 🔒 Suas informações são confidenciais.       └───────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ L  U  I  Z   (marca em escala monumental)                                            │ RODAPÉ
│ Curadoria…   │ Coleção        │ Luiz            │ Contato                            │
│              │ Venda/Aluguel… │ Sobre / Método  │ WhatsApp / E-mail / Instagram      │
│ © 2026 Luiz · CRECI …                               Aviso de dados ilustrativos      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                                                              (◉) WhatsApp flutuante
```

### Mobile

```
┌──────────────────────────┐     ┌──────────────────────────┐     ┌──────────────────────────┐
│ LUIZ            MENU ═   │     │ ——COLEÇÃO EM DESTAQUE    │     │ LUIZ           FECHAR ✕  │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │ Selecionadas com rigor,  │     │                          │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │ *apresentadas com        │     │ 01  Venda                │
│▓ ——CURADORIA IMOBILIÁRIA ▓│     │ intenção.*               │     │ ──────────────────────── │
│▓ Exclusividade           ▓│     │ VER TODA A COLEÇÃO →     │     │ 02  Aluguel              │
│▓ encontra *seu           ▓│     │ ──────────────────────── │     │ ──────────────────────── │
│▓ novo lar.*              ▓│     │ [ ⚙ FILTRAR COLEÇÃO (2) ]│     │ 03  Lançamentos          │
│▓ Residências singulares… ▓│     │ 6 destaques de 12        │     │ ──────────────────────── │
│▓ [CONHECER A COLEÇÃO →]  ▓│     │ ┌──────────────────────┐ │     │ 04  Sobre Luiz           │
│▓ CONVERSAR COM LUIZ      ▓│     │ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │     │ ──────────────────────── │
├──────────────────────────┤     │ │▓▓▓▓▓▓▓ 4:5 ▓▓▓▓▓▓▓▓▓▓│ │     │ 05  Contato              │
│ VENDA  Aluguel  Lançam.  │     │ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │     │                          │
│ Localização _________ ▾  │     │ └──────────────────────┘ │     │ [AGENDAR VISITA PRIVATIVA]│
│ Quartos _____________ ▾  │     │ JARDIM EUROPA · SP       │     │ Seg. a sáb., 9h às 19h   │
│ [      EXPLORAR →      ] │     │ Casa Jacarandá           │     │ WhatsApp · E-mail        │
└──────────────────────────┘     │ 1.150 m² · 5 suítes      │     └──────────────────────────┘
  Hero = 100svh + busca          │ R$ 38.000.000     Casa   │       Menu em tela cheia,
  rápida logo abaixo             │                     (◉)  │       links entram em cascata
                                 └──────────────────────────┘
  Categorias no mobile: carrossel horizontal com scroll-snap (cards a 82% da largura).
  Galeria: 1 coluna. Sobre: retrato acima do texto. Contato: formulário abaixo dos canais.
```

---

## 2.2 Coleção (Listagem)

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ LUIZ            Venda   Aluguel   Lançamentos   Sobre   Contato    [ AGENDAR VISITA ] │ ← sólido
├──────────────────────────────────────────────────────────────────────────────────────┤
│ INÍCIO / COLEÇÃO                                                                     │
│ A coleção,                                   Cada residência foi visitada, avaliada  │
│ *uma a uma.*                                 e escolhida pessoalmente…               │
│ ──────────────────────────────────────────────────────────────────────────────────── │
│ Todos  VENDA  Aluguel  Lançamentos                                                   │ filtros sincronizados
│ Localização ____▾   Valor ____▾   Quartos (Todos)(3+)(4+)(5+)   Estilo ____▾         │ com a URL
│                                                                    Limpar filtros    │
│ 6 residências encontradas                                     Ordenar: Em destaque ▾ │
│ ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                               │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │              │   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  grade de 3 colunas;          │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  coluna central deslocada     │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  (ritmo editorial)            │
│ Local · Nome · ficha · valor       …                …                                │
│                                                                                      │
│ ── Estado vazio ───────────────────────────────────────────────────────────────────  │
│        Nenhuma residência publicada corresponde a esta busca.                        │
│        Algumas das melhores oportunidades não estão nos portais…                     │
│                         [ FALAR COM LUIZ → ]                                         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│▓▓▓ COLEÇÃO PRIVADA · Não encontrou? *Ela pode não estar publicada.* [SOLICITAR]     ▓│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ RODAPÉ                                                                               │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile — filtros em *bottom sheet*

```
┌──────────────────────────┐     ┌──────────────────────────┐
│ LUIZ            MENU ═   │     │░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← fundo escurecido
│ INÍCIO / COLEÇÃO         │     ├──────────────────────────┤
│ A coleção, *uma a uma.*  │     │ Filtrar coleção      (✕) │
│ Cada residência foi…     │     │ Todos VENDA Aluguel Lanç.│
│ ──────────────────────── │     │ Localização ________ ▾   │
│ [ ⚙ FILTRAR COLEÇÃO (2) ]│ ──► │ Valor ______________ ▾   │
│ 3 residências encontradas│     │ Quartos (Todos)(3+)(4+)(5+)
│ Em destaque ▾            │     │ Estilo _____________ ▾   │
│ ┌──────────────────────┐ │     ├──────────────────────────┤
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │     │ Limpar   [VER 3 RESIDÊNC.]│ ← rodapé fixo da folha
└──────────────────────────┘     └──────────────────────────┘
  Resultados atualizam ao vivo; o botão do rodapé mostra a contagem e fecha a folha.
```

---

## 2.3 Detalhes do Imóvel

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ LUIZ            Venda   Aluguel   Lançamentos   Sobre   Contato    [ AGENDAR VISITA ] │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ ┌─────────────────────────────┐  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │ galeria 2fr + 1fr
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ FOTO DE CAPA ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │ altura ~76vh
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ └─────────────────────────────┘  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ┌─────────────────────────────┐  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓[ ▦ VER AS 7 FOTOS ]│  │ → lightbox
│ └─────────────────────────────────────────────────┘ └─────────────────────────────┘  │
│ INÍCIO / COLEÇÃO / VENDA / CASA JACARANDÁ                                            │
│ —— JARDIM EUROPA · SÃO PAULO                                                         │
│ Casa Jacarandá                                                                       │ h1 serifado
│ Concreto aparente, madeira e luz natural em uma das ruas…                            │ assinatura
│ ┌───────────────┬───────────────┬───────────────┬───────────────┬───────────────┐    │
│ │ ÁREA PRIVATIVA│ TERRENO       │ SUÍTES        │ VAGAS         │ CONSTRUÇÃO    │    │ ficha técnica
│ │ 1.150 m²      │ 1.400 m²      │ 5             │ 6             │ 2021          │    │
│ └───────────────┴───────────────┴───────────────┴───────────────┴───────────────┘    │
│ —— A RESIDÊNCIA                                       ┌────────────────────────────┐ │
│ Implantada em um terreno de 1.400 m², a Casa…         │ —— VALOR DE VENDA          │ │ cartão
│ (1º parágrafo em serifa, maior)                       │ R$ 38.000.000              │ │ FIXO (sticky)
│ Texto de apoio…                                       │ Condomínio e IPTU no atend.│ │
│                                                       │ [AGENDAR VISITA PRIVATIVA] │ │
│ Diferenciais                                          │ [ FALAR PELO WHATSAPP  ◯ ] │ │
│ ◇ Pé-direito duplo de 7 m   ◇ Piscina com raia 25 m   │ ────────────────────────── │ │
│ ◇ Adega para 1.200 rótulos  ◇ Paisagismo autoral      │ (L) Luiz · CRECI …         │ │
│ ◇ Automação integral        ◇ Suíte com terraço       │ Compartilhar residência ⇪  │ │
│                                                       └────────────────────────────┘ │
│ Galeria   (masonry 3 colunas, clique → lightbox)                                     │
│ Localização · Jardim Europa                                                          │
│ Ruas arborizadas, baixa circulação…                                                  │
│ ┌───────────────────────────────────────────────┐                                    │
│ │ ┼   ┼   ┼   ( ◯ área aproximada )   ┼   ┼   ┼ │  mapa estilizado, sem endereço     │
│ └───────────────────────────────────────────────┘                                    │
│ Por privacidade, o endereço exato é informado no agendamento.                        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— CONTINUE EXPLORANDO   Você também *pode se encantar.*   [card] [card] [card]      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ CONTATO: "Uma visita privativa, *no seu tempo.*" + formulário (imóvel pré-selecionado)│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌──────────────────────────┐     ┌──────────────────────────┐
│ LUIZ            MENU ═   │     │ ÁREA PRIV.   │ TERRENO   │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │ 1.150 m²     │ 1.400 m²  │
│▓▓ carrossel com swipe ▓▓▓│     │ ──────────────────────── │
│▓▓ (scroll-snap) ▓▓▓▓▓▓▓▓▓│     │ SUÍTES       │ VAGAS     │
│▓[▦ VER AS 7 FOTOS] [1/7]▓│     │ 5            │ 6         │
├──────────────────────────┤     │ ──────────────────────── │
│ INÍCIO / COLEÇÃO / VENDA │     │ —— A RESIDÊNCIA          │
│ —— JARDIM EUROPA · SP    │     │ Implantada em um…        │
│ Casa Jacarandá           │     │ …                        │
│ Concreto aparente, …     │     │                     (◉)  │
│ ──────────────────────── │     ├──────────────────────────┤
│ …                        │     │ VALOR DE VENDA           │ ← barra fixa
└──────────────────────────┘     │ R$ 38.000.000 [AGENDAR]  │   (após 420 px)
                                 └──────────────────────────┘
  O cartão de valor aparece após o conteúdo; a barra fixa garante o CTA o tempo todo.
```

---

## 2.4 Sobre

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ CABEÇALHO                                                                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ INÍCIO / SOBRE                                    ┌──────────────────────────────┐   │
│ —— SOBRE LUIZ                                     │                              │   │
│ Um olhar treinado para o                          │       RETRATO EDITORIAL      │   │ revelação em
│ *extraordinário.*                                 │       P&B · 4:5              │   │ "cortina"
│ Mais do que vender imóveis, Luiz aproxima…        │                              │   │
│                                                   └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— TRAJETÓRIA                         Há quase duas décadas, Luiz acompanha… (lead)  │
│ Poucas opções. *Sempre as certas.*    Seu olhar atento à luz… (apoio)                │
│ ──────────────────────────────────────────────────────────────────────────────────── │
│   18 anos          320+ residências        R$ 2,4 bi             70% indicação       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— PRINCÍPIOS   O que não se negocia.                                                │ fundo linho
│ 01 Discrição           │ 02 Curadoria            │ 03 Proximidade                    │
│ Sua identidade…        │ Cada residência…        │ Um único interlocutor…            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ —— MÉTODO   Do primeiro café *à entrega das chaves.*                                 │ fundo preto
│ ── 01 ─────────── ── 02 ─────────── ── 03 ─────────────── ── 04 ──────────           │
│ Escuta            Curadoria          Visitas privativas    Negociação                │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ DEPOIMENTOS (carrossel de citações)                                                  │
├──────────────────────────────────────────────────────────────────────────────────────┤
│▓▓▓ —— PRÓXIMO PASSO  Toda boa escolha começa *com uma conversa.*                    ▓│
│▓▓▓ [ AGENDAR UMA CONVERSA ]   Prefiro WhatsApp                                      ▓│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ RODAPÉ                                                                               │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌──────────────────────────┐
│ LUIZ            MENU ═   │
│ INÍCIO / SOBRE           │
│ —— SOBRE LUIZ            │
│ Um olhar treinado para o │
│ *extraordinário.*        │
│ ┌──────────────────────┐ │
│ │   RETRATO 4:5        │ │
│ └──────────────────────┘ │
│ Trajetória (empilhada)   │
│ 18 anos  │ 320+          │  números em 2 × 2
│ R$2,4 bi │ 70%           │
│ 01 Discrição ─────────── │  princípios e método
│ 02 Curadoria ─────────── │  em lista vertical
│ …                        │
└──────────────────────────┘
```

---

## 2.5 Componentes-chave (anatomia)

```
CARD DE RESIDÊNCIA                           CAMPO DE FORMULÁRIO (fundo escuro)
┌──────────────────────────┐                 Nome completo            ← rótulo flutua para cima
│[LANÇAMENTO · ENTREGA 2028]│ ← selo          ana beatriz_______________   no foco/preenchido
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                 ════════════               ← fio dourado cresce
│▓▓▓▓▓▓▓ foto 4:5 ▓▓▓▓▓▓▓▓▓│                                              da esquerda (900 ms)
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                 Como podemos chamar você?  ← erro em tom terracota
│▓▓▓▓▓▓▓▓▓▓▓▓▓[VER RESID.→]│ ← surge no hover
└──────────────────────────┘                 BOTÃO PRIMÁRIO
JARDINS · SÃO PAULO        ← eyebrow bronze  ┌───────────────────────┐   hover: preenchimento
Alameda Jardins            ← serifa 32 px    │ SOLICITAR VISITA   📅 │   desliza da esquerda
280 a 520 m² · 3 a 4 suítes · 4 vagas        └───────────────────────┘   (450 ms, ease-out)
─────────────────────────────
A partir de R$ 9.800.000      Apartamento
```

Estados do cabeçalho: **transparente** (topo da Home) → **sólido + desfoque** (após 60 px) → **oculto** (rolando para baixo após 480 px) → **visível** (qualquer rolagem para cima ou foco por teclado).
