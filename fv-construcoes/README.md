# FV Construções e Serviços — site institucional

Site de página única (React + Vite) com HTML pré-renderizado no build: o conteúdo completo
chega no primeiro carregamento (bom para SEO e para conexões lentas) e o React apenas hidrata
as interações.

## Comandos

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera dist/ pronto para publicação
npm run preview  # serve o dist/ localmente
```

Para incluir canonical, `og:url`, imagem de compartilhamento absoluta e `sitemap.xml`,
informe o domínio no build:

```bash
SITE_URL=https://www.seudominio.com.br npm run build
```

## Publicação

A pasta `dist/` é estática e funciona em qualquer hospedagem (Vercel, Netlify, GitHub Pages,
hospedagem compartilhada). Os caminhos são relativos, então o site também funciona dentro de
uma subpasta. Na Vercel/Netlify, use `fv-construcoes` como diretório raiz, `npm run build` como
comando e `dist` como saída.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Telefone, WhatsApp, endereço, avaliação, textos de produtos, diferenciais e serviços | `src/data/site.js` |
| Seções | `src/sections/*.jsx` |
| Componentes reutilizáveis (botão, imagem, avaliação, cabeçalho…) | `src/components/` |
| Cores, tipografia e botões (tokens) | `src/styles/global.css` |
| Título, descrição e metadados | `index.html` |

## Imagens

`public/img` contém versões AVIF e WebP em várias larguras. Origem:

- **Fachada (`fachada*`, `produto-acessorios`)**: fotografia real da loja, recortada do PDF de
  referência e ampliada 2× com super-resolução (EDSR).
- **Produtos (`produto-*`)** e **hero (`hero-industrial`)**: recortes das referências visuais do PDF.
  O texto do hero foi removido por inpainting.
- **Logo (`logo-fv.*`)**: arquivo original enviado, apenas com o fundo azul removido fora do oval.

Para trocar uma imagem, gere os arquivos com o mesmo nome e as larguras listadas em
`images` dentro de `src/data/site.js`.

A fonte Archivo (variável, licença OFL) está em `public/fonts`.
