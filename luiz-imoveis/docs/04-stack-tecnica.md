# 4. Sugestões técnicas

> Recomendações de front-end para transformar o protótipo em produto, com foco em **interatividade refinada** e **velocidade** — no mercado de luxo, lentidão é percebida como falta de qualidade.

---

## 4.1 Recomendação

**Next.js (App Router) + React + TypeScript**, com geração estática das páginas, estilização por *design tokens* e uma camada de animação dedicada.

| Camada | Escolha | Por que, no contexto de luxo |
|--------|---------|------------------------------|
| Framework | **Next.js (App Router)** com SSG/ISR | Cada imóvel vira uma página estática pré-renderizada: abre instantaneamente, inclusive pelo link enviado no WhatsApp, e é indexada pelo Google com título, descrição e imagem próprios. ISR permite publicar um imóvel novo sem novo deploy. |
| Linguagem | **TypeScript** | O modelo `Residencia` (ver doc 1, §1.8) vira contrato: nenhum card quebra por falta de um campo. |
| Estilo | **Tailwind CSS** configurado com os tokens deste guia *(ou CSS Modules + custom properties, como no protótipo)* | Os tokens de cor, tipo, espaço e movimento ficam centralizados; consistência visual garantida em todas as páginas. |
| Imagens | **`next/image` + CDN de imagens** (Vercel Image Optimization, Cloudinary ou Imgix) | AVIF/WebP automáticos, `srcset` por largura, *lazy loading* e *placeholder* de desfoque — fotos em qualidade máxima sem pesar. |
| Fontes | **`next/font`** (auto-hospedadas) | Zero salto de layout (CLS), nenhuma requisição ao Google (desempenho + LGPD). |
| Animação | **Motion** (antiga Framer Motion) + **View Transitions API** | Revelações no scroll, cascatas e transições entre páginas declarativas, com suporte nativo a `prefers-reduced-motion`. |
| Rolagem suave | **Lenis** *(opcional)* | Dá a sensação "amanteigada" de sites editoriais. Ativar só em desktop, desativar com movimento reduzido e testar com leitores de tela. |
| Galeria | **Embla Carousel** (carrossel mobile) + **PhotoSwipe** (lightbox com zoom e pinça) | Gestos nativos no celular, leveza (sem jQuery), acessíveis por teclado. |
| Filtros na URL | **nuqs** (ou `useSearchParams`) | Estado dos filtros sincronizado com a URL, compartilhável e preservado no botão "voltar". |
| Formulários | **React Hook Form + Zod** | Validação instantânea no cliente com mensagens humanas, sem re-renderizações desnecessárias. |
| Conteúdo (fase 1) | **JSON/MDX no repositório** | Sem back-end, conforme o escopo. A mesma estrutura migra para um CMS headless na fase 2. |
| Hospedagem | **Vercel** (ou Netlify / Cloudflare Pages) | CDN global, *preview* de cada alteração para aprovação do cliente, HTTPS e cache automáticos. |
| Métricas | **Vercel Analytics** ou **Plausible** | Leves e sem cookies de rastreamento — coerente com a promessa de discrição. |

### Por que não as alternativas?

| Opção | Pontos fortes | Por que não é a primeira escolha |
|-------|---------------|----------------------------------|
| **Astro** (+ ilhas React/Vue) | Envia quase nenhum JavaScript; excelente para sites de conteúdo | É uma **ótima alternativa** se o site permanecer essencialmente institucional. Perde força quando entrarem CMS com pré-visualização, área do cliente e integrações (fase 2). |
| **Nuxt (Vue)** | Equivalente ao Next.js no ecossistema Vue | Escolha válida se a equipe já domina Vue; o ecossistema de componentes de galeria/animação para React é mais amplo. |
| **SPA pura (React/Vite)** | Simples de começar | Renderização apenas no cliente prejudica SEO, a prévia do link no WhatsApp e o tempo até a primeira imagem. |
| **WordPress + tema imobiliário** | Rápido de publicar | Resultado genérico, plugins pesados e manutenção de segurança — o oposto de exclusividade. |
| **HTML/CSS/JS puro** (este protótipo) | Zero dependências, ideal para validar a experiência | Não escala bem para dezenas de imóveis, rotas limpas e conteúdo editável. |

---

## 4.2 Orçamento de desempenho

Metas medidas em um celular intermediário, rede 4G:

| Métrica | Meta | Como chegar lá |
|---------|------|----------------|
| **LCP** (maior elemento visível) | ≤ 2,0 s | Imagem do hero com `priority`/`fetchpriority="high"`, AVIF, recorte próprio para mobile |
| **CLS** (estabilidade visual) | ≤ 0,05 | `aspect-ratio` em todas as imagens, fontes via `next/font` |
| **INP** (resposta à interação) | ≤ 200 ms | Filtros calculados no cliente sobre dados estáticos; animações só em `transform`/`opacity` |
| JavaScript inicial (Home) | ≤ 120 KB gzip | Componentes de servidor por padrão; galeria e lightbox carregados sob demanda (`dynamic import`) |
| Imagem do hero (mobile) | ≤ 250 KB | Ver diretrizes de fotografia (doc 3, §3.6) |
| Lighthouse | ≥ 95 em Performance, Acessibilidade, Boas práticas e SEO | Auditoria em cada *preview* de deploy |

Técnicas já demonstradas no protótipo: segunda foto do card baixada **apenas no primeiro hover** (economiza banda no celular), pré-carregamento da próxima imagem no lightbox, `loading="lazy"` e `srcset` em todas as fotos.

---

## 4.3 Estrutura sugerida do projeto (Next.js)

```
luiz-imoveis/
├── app/
│   ├── layout.tsx                 # fontes, cabeçalho, rodapé, WhatsApp flutuante
│   ├── page.tsx                   # Início
│   ├── (colecao)/
│   │   ├── imoveis/page.tsx       # Coleção (filtros via URL)
│   │   ├── venda/page.tsx         # atalhos → /imoveis?categoria=venda
│   │   ├── aluguel/page.tsx
│   │   └── lancamentos/page.tsx
│   ├── imoveis/[slug]/page.tsx    # Detalhe — generateStaticParams + generateMetadata
│   ├── sobre/page.tsx
│   ├── contato/page.tsx
│   ├── privacidade/page.tsx
│   ├── sitemap.ts · robots.ts
│   └── opengraph-image.tsx        # imagem de compartilhamento
├── components/
│   ├── layout/   Header · MobileMenu · Footer · WhatsAppFloat · MobileBar
│   ├── home/     Hero · QuickSearch · Manifesto · Stats · CategoryCards · PrivateCollection
│   ├── colecao/  Filters · FilterSheet · PropertyGrid · PropertyCard · SortSelect · EmptyState
│   ├── imovel/   Gallery · FactSheet · Highlights · LocationMap · PriceCard · Related
│   ├── contato/  ContactSection · VisitForm · MessageForm · FormSuccess
│   └── ui/       Button · Link · Field · Chips · Segmented · Lightbox · Reveal · CountUp
├── content/
│   ├── residencias/*.json         # um arquivo por imóvel (modelo da doc 1, §1.8)
│   ├── depoimentos.json
│   └── config.ts                  # WhatsApp, e-mail, CRECI (hoje: LUIZ.config)
├── lib/  filters.ts · format.ts (BRL, m²) · whatsapp.ts
└── styles/ tokens.css             # cópia fiel da seção "Tokens" do protótipo
```

### Do protótipo para a produção

| Protótipo | Componente em produção |
|-----------|------------------------|
| `assets/css/styles.css` §1 (Tokens) | `styles/tokens.css` + `tailwind.config` |
| `assets/js/data.js` | `content/residencias/*.json` + `content/config.ts` |
| `initHeader()` / `initMenu()` | `Header`, `MobileMenu` |
| `initCollection()` | `Filters`, `FilterSheet`, `PropertyGrid` + `lib/filters.ts` |
| `cardHTML()` + `bindCardHover()` | `PropertyCard` |
| `lightbox` | `Lightbox` (PhotoSwipe) |
| `renderMasonry()` | `MasonryGallery` (CSS columns, sem biblioteca) |
| `initContact()` / `validate()` / `composeMessage()` | `VisitForm`, `MessageForm` (React Hook Form + Zod) + `lib/whatsapp.ts` |
| `initPropertyPage()` | `app/imoveis/[slug]/page.tsx` (renderizado no servidor) |
| `[data-reveal]` + IntersectionObserver | `Reveal` (Motion `whileInView`) |

---

## 4.4 Formulários sem back-end (fase 1)

O escopo exclui back-end; ainda assim, nenhum contato pode se perder:

1. **Validação no cliente** com mensagens humanas ("Como podemos chamar você?").
2. Ao enviar, a mensagem é **composta automaticamente** — imóvel, data, período, canal preferido — e aberta no **WhatsApp de Luiz** (`wa.me/<número>?text=…`) ou por `mailto:`. É exatamente o que o protótipo faz.
3. Tela de confirmação personalizada ("Obrigado, Ana. Recebi seu pedido de visita à Casa Jacarandá para sábado, 24 de outubro…").
4. **Fase 2:** o mesmo componente passa a enviar para um endpoint/CRM, sem mudar a interface.

---

## 4.5 Acessibilidade e privacidade

- **WCAG 2.2 AA** como critério de aceite: contraste (doc 3), navegação completa por teclado, foco visível, `aria-live` na contagem de resultados, abas com setas do teclado, lightbox em `<dialog>` nativo, menu com *focus trap* e tecla Esc.
- **Movimento reduzido** respeitado em todas as animações e no vídeo do hero.
- **LGPD:** consentimento explícito nos formulários, política de privacidade publicada, nenhum script de terceiros antes do consentimento, fontes e analytics sem cookies.
- **Privacidade do proprietário:** endereço exato nunca aparece no front-end; o mapa usa área aproximada (no protótipo, um mapa ilustrativo; em produção, Mapbox/Google com raio aproximado e estilo monocromático).

---

## 4.6 Roteiro sugerido

| Fase | Escopo | Entregas |
|------|--------|----------|
| **1 — Front-end** *(este documento)* | Experiência completa com conteúdo estático | Next.js com as 5 páginas, componentes, animações, formulários via WhatsApp/e-mail, SEO técnico, Lighthouse ≥ 95 |
| 2 — Conteúdo e captação | CMS e integrações | CMS headless (Sanity ou Storyblok) com pré-visualização, formulário → CRM, mapa real, favoritos |
| 3 — Imersão | Experiências avançadas | Tour 3D (Matterport), vídeo cinematográfico por imóvel, versão em inglês e espanhol para compradores internacionais |
