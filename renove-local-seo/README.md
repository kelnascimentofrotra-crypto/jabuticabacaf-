# Renove Serralheria — site

Site estático (HTML, CSS e JavaScript puro). Não precisa de build nem de dependências.

```
index.html            página (conteúdo, SEO, FAQ estruturado)
assets/css/site.css   identidade visual e layout
assets/js/config.js   DADOS DA EMPRESA  ← editar aqui
assets/js/app.js      interações (faíscas do hero, rolagem da fabricação, serviços, portões, formulário…)
assets/img/           imagens em AVIF e WebP (várias larguras)
robots.txt, sitemap.xml
```

## 1. Preencha `assets/js/config.js`

Tudo o que ficar vazio simplesmente não aparece. Nada é inventado.

| Campo | O que acontece quando preenchido |
|---|---|
| `contato.whatsapp` | Todos os botões "Solicitar orçamento" abrem o WhatsApp; o formulário envia a mensagem pronta |
| `contato.telefone`, `email`, `instagram` | Aparecem na área de contato e no rodapé |
| `contato.endereco` + `local.cidade` | Endereço, mapa e dados estruturados `LocalBusiness` para o Google |
| `contato.horario` | Horário na página e `openingHoursSpecification` |
| `local.cidade`, `uf`, `regiao`, `bairros` | SEO local: título "Serralheria em [cidade]…", texto de área atendida, `areaServed` |
| `numeros` | Seção de números com contador animado (só números reais) |
| `avaliacoes.lista` | Carrossel de avaliações (só avaliações reais, com autorização) |
| `avaliacoes.googleUrl` | Botão "Avaliar no Google" |
| `projetos` | Fotos reais substituem as ilustrações do portfólio |

Sem WhatsApp configurado, os botões de orçamento levam ao formulário, que avisa que o envio ainda não foi configurado.

## 2. Imagens

As imagens atuais são **ilustrações 3D criadas para este site** (não são obras reais). No portfólio elas aparecem marcadas como "Ilustração" e o rodapé avisa. Quando houver fotos reais:

- Portfólio: adicione em `config.js → projetos` (sem mexer no HTML).
- Demais imagens: substitua os arquivos em `assets/img/` mantendo os nomes, ou troque os caminhos no `index.html`.
- Para desligar o aviso do rodapé: `site.avisoImagensIlustrativas: false`.

## 3. SEO

- `title`, `meta description`, `canonical`, `robots`, Open Graph e Twitter Card estão no `<head>`.
- JSON-LD: `FAQPage` estático; `Organization`, `WebSite`, `WebPage` e `Service` gerados pelo `app.js`; `LocalBusiness` (HomeAndConstructionBusiness) só é gerado quando telefone, endereço e cidade reais estão preenchidos.
- O domínio `https://renove-local-seo.lovable.app/` está no `canonical`, nas tags `og:`/`twitter:`, em `robots.txt`, `sitemap.xml` e em `config.js → site.url`. Troque em todos se o domínio mudar.
- `robots.txt` e `sitemap.xml` precisam ficar na raiz do domínio.
- "Perto de mim": o Google usa a localização de quem pesquisa. O que ajuda é ter cidade, endereço/área de atendimento e Perfil da Empresa no Google corretos — não repetir "perto de mim" no texto.
