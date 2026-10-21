# Luiz · Curadoria Imobiliária — Front-end de alto padrão

Concepção de UI/UX e protótipo navegável do site do corretor **Luiz**, voltado a compradores de alta renda que valorizam exclusividade, privacidade e uma navegação fluida.

> **Conceito: "galeria silenciosa".** Paredes neutras, luz precisa, muito espaço livre — e o imóvel como a obra em exposição.

---

## Entregáveis

| # | Documento | Conteúdo |
|---|-----------|----------|
| 1 | [Arquitetura de Informação](docs/01-arquitetura-de-informacao.md) | Princípios, mapa do site, inventário de páginas, navegação, conexões, jornadas, taxonomia e modelo de conteúdo |
| 2 | [Wireframes conceituais](docs/02-wireframes.md) | Home, Listagem, Detalhe do imóvel e Sobre — mobile e desktop |
| 3 | [Style Guide](docs/03-style-guide.md) | Cores (HEX/RGB + contraste), tipografia, grid, componentes, movimento e diretrizes de fotografia |
| 4 | [Sugestões técnicas](docs/04-stack-tecnica.md) | Stack recomendada (Next.js), justificativas, orçamento de desempenho, estrutura do projeto e roteiro |
| 5 | [Copywriting](docs/05-copywriting.md) | Voz e tom, títulos e textos por seção, microcopy, mensagens de WhatsApp e SEO |

## Protótipo navegável

Implementação de referência em **HTML, CSS e JavaScript puros** (sem dependências), mobile-first, que materializa o style guide e as interações:

| Página | Arquivo | Destaques |
|--------|---------|-----------|
| Início | `index.html` | Hero full-screen com busca rápida, manifesto com números animados, categorias assimétricas, destaques com filtros ao vivo, galeria masonry com lightbox, depoimentos, coleção privada e contato |
| Coleção | `imoveis.html` | Filtros (modalidade, localização, valor, quartos, estilo) sincronizados com a URL, ordenação, *bottom sheet* no mobile, estado vazio que leva à coleção privada |
| Residência | `imovel.html?id=casa-jacaranda` | Galeria em mosaico/carrossel, ficha técnica, cartão de valor fixo, mapa com área aproximada, relacionadas, agendamento com imóvel pré-selecionado e barra fixa no mobile |
| Sobre | `sobre.html` | Retrato editorial, trajetória, princípios, método em 4 etapas |

### Como visualizar

Abra `index.html` diretamente no navegador, ou sirva a pasta localmente:

```bash
cd luiz-imoveis
python3 -m http.server 8000
# http://localhost:8000
```

### Estrutura

```
luiz-imoveis/
├── index.html · imoveis.html · imovel.html · sobre.html
├── assets/
│   ├── css/styles.css      # tokens + componentes (mobile-first)
│   ├── js/data.js          # imóveis, depoimentos e configuração de contato
│   ├── js/main.js          # interações (sem dependências)
│   └── img/favicon.svg
└── docs/                   # os 5 entregáveis
```

### Configuração

Os contatos ficam em um único lugar — `LUIZ.config`, no início de `assets/js/data.js`:

```js
LUIZ.config = {
  whatsapp: '',               // ex.: '5511999999999' — vazio = botões levam ao formulário
  email: 'luiz@example.com',
  phoneDisplay: '+55 11 0000-0000',
  creci: 'CRECI 000000-F',
  instagram: 'https://www.instagram.com/',
  city: 'São Paulo'
};
```

Com o número de WhatsApp preenchido, todos os botões de WhatsApp e a confirmação dos formulários passam a abrir a conversa com a mensagem já composta (imóvel, data, período e canal preferido).

## Antes de publicar

O protótipo usa **dados e imagens ilustrativos**. Para ir ao ar:

- [ ] Substituir as fotos de referência (Unsplash) pelo ensaio fotográfico próprio — ver [diretrizes de fotografia](docs/03-style-guide.md#36-diretrizes-de-fotografia).
- [ ] Substituir o espaço do retrato pela foto editorial de Luiz.
- [ ] Confirmar números, trajetória e depoimentos reais (com autorização dos clientes).
- [ ] Preencher WhatsApp, e-mail, telefone, CRECI e Instagram em `LUIZ.config`.
- [ ] Publicar a Política de Privacidade (LGPD) e ligar o link dos formulários.
- [ ] Revisar o cadastro de imóveis (valores, áreas, textos) em `assets/js/data.js`.
