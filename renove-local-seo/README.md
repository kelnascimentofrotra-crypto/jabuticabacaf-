# Renove Local SEO — site

Site estático (HTML + CSS + JS puro, sem build e sem dependências).

```
index.html          conteúdo, meta tags e JSON-LD (Organization, WebSite, WebPage, Service, FAQPage)
assets/styles.css   design system e layout
assets/app.js       interações (mapa em canvas, narrativa de scroll, diagnóstico, painel etc.)
assets/og-image.jpg imagem de compartilhamento 1200×630
robots.txt / sitemap.xml
```

## Antes de publicar

1. **Contato** — em `assets/app.js`, preencha `CONFIG.whatsapp` (só dígitos, ex.: `5511999999999`) e/ou `CONFIG.email`.
   Sem isso, o botão "Solicitar diagnóstico real" fica oculto e o CTA final leva para a seção de diagnóstico.
2. **Domínio** — a URL `https://renove-local-seo.lovable.app/` está em: `<link rel="canonical">`, `og:url`, `og:image`,
   `twitter:image`, no JSON-LD de `index.html`, em `robots.txt` e em `sitemap.xml`. Troque em todos se o domínio mudar.
3. **Cases** — em `assets/app.js`, adicione objetos ao array `CASES` (somente cases reais, com autorização).
   Enquanto estiver vazio, a seção mostra a estrutura "em documentação".
4. **LocalBusiness** — não foi incluído porque exige endereço/telefone reais. Com esses dados, adicione um nó
   `ProfessionalService` ao `@graph` do JSON-LD.
5. `robots.txt` e `sitemap.xml` só funcionam na raiz do domínio.

## Conteúdo demonstrativo

Painel de presença do hero, chips "+32 posições" etc., mapa com empresas fictícias, simulação de pesquisa,
comparação de resultados, prévia do diagnóstico e painel de dados estão todos marcados na interface como
DEMO / SIMULAÇÃO / DADOS ILUSTRATIVOS.
