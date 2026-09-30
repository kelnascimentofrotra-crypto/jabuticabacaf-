# Mundo Solar — site institucional

Site estático (HTML + CSS + JavaScript puro, sem etapa de build) da **Mundo Solar — Energia que transforma**.
Pode ser publicado em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, cPanel etc.): basta
enviar o conteúdo desta pasta para a raiz do domínio.

## Estrutura

```
mundo-solar/
├── index.html              # página única com as 10 seções
├── assets/
│   ├── css/styles.css      # design system (tokens) + layout + responsivo
│   ├── js/main.js          # interações + SITE_CONFIG (contatos)
│   ├── fonts/              # Sora e Inter (self-hosted, woff2)
│   └── img/                # fotos reais das instalações (WebP) + og-image.jpg
├── favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

Para testar localmente: `python3 -m http.server` dentro desta pasta e abra `http://localhost:8000`.

## O que editar antes de publicar

Todos os pontos pendentes estão marcados com `EDITAR` nos arquivos.

1. **Contatos** — `assets/js/main.js`, objeto `SITE_CONFIG` no topo do arquivo:
   - `whatsapp`: número com DDI + DDD, só dígitos (ex.: `55DDNNNNNNNNN`);
   - `whatsappDisplay`: como o número aparece no rodapé;
   - `instagram`: usuário sem `@`;
   - `email`: e-mail de atendimento.

   Assim que o WhatsApp é preenchido, todos os botões "Fale conosco" / "Falar pelo WhatsApp", o botão
   flutuante e o formulário de orçamento passam a abrir a conversa com a mensagem pronta. Enquanto
   estiver vazio, esses botões abrem o formulário de orçamento, que informa que os canais estão em
   configuração.

2. **Depoimentos** — `index.html`, seção `#depoimentos`. Os três cards são modelos marcados como
   "Espaço reservado". Substitua pelo texto, nome e cidade de clientes reais (com autorização) e remova
   o `<span class="testimonial__flag">` e o atributo `data-placeholder` de cada card.

3. **Domínio** — quando o domínio definitivo existir:
   - em `index.html`, adicione `<link rel="canonical" href="https://SEU-DOMINIO/">` e troque
     `og:image`/`twitter:image` por URLs absolutas;
   - em `sitemap.xml`, substitua `https://www.seudominio.com.br/`;
   - em `robots.txt`, descomente a linha `Sitemap:`;
   - no JSON-LD (`<script type="application/ld+json">`), acrescente `url`, `telephone`, `email` e
     `address` somente com dados reais.

## Projetos

Os dados dos quatro projetos (kWh/mês, painéis, inversores, nome e cidade) estão em `index.html`,
seção `#projetos`, exatamente como informados pela empresa. As fotos foram associadas aos projetos pela
quantidade de painéis visível em cada imagem — confirme se cada foto corresponde ao projeto certo e, se
precisar trocar, altere apenas o `src`/`srcset` da imagem no card.

| Projeto | Foto usada |
| --- | --- |
| 01 — Goianésio Selaria | `instalacao-telhado-ceramico.webp` |
| 02 — Verá Lúcia | `instalacao-residencial-telhado-ceramico.webp` |
| 03 — Gilvan Barbearia Fashion Man | `instalacao-aerea-residencial.webp` |
| 04 — Telma Freitas | `instalacao-aerea-telhado-metalico.webp` |

## Imagens

Cada foto tem duas versões: original (até ~1120 px) e `-640` para telas pequenas, servidas via `srcset`.
Para adicionar uma nova foto, exporte em WebP (qualidade ~80) nas duas larguras e mantenha o mesmo padrão
de nome.

## Créditos

Ícones: [Lucide](https://lucide.dev) (ISC) e [Simple Icons](https://simpleicons.org) (CC0), embutidos
como sprite SVG no `index.html`. Fontes: Sora e Inter (SIL Open Font License).
