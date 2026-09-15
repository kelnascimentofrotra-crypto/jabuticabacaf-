# Jabuticaba · Confeitaria Gourmet — Teresina/PI

Landing page estática, cinematográfica e responsiva. Sem build, sem dependências
externas em tempo de execução: basta publicar a pasta.

```
index.html              página completa (9 seções + rodapé)
assets/css/style.css    design system (paleta, tipografia, seções, responsivo)
assets/js/main.js       abertura cinematográfica, smooth scroll e animações
assets/img/             imagens (geradas por tools/gen_images.py)
assets/fonts/           Cormorant Garamond + Jost (self-hosted, subset latin)
assets/vendor/          GSAP, ScrollTrigger e Lenis (self-hosted)
tools/gen_images.py     gerador das imagens
```

---

## 1. Antes de publicar — preencher os dados reais

Abra `assets/js/main.js` e edite **apenas o bloco CONFIG** no topo do arquivo:

```js
var CONFIG = {
  whatsapp: '5586000000000',          // 55 + DDD + número, só dígitos
  instagram: 'jabuticabaconfeitaria', // @ do perfil, sem o "@"
  marca: 'Jabuticaba Confeitaria'
};
```

Todos os botões de WhatsApp da página (`data-wa`) e os links de Instagram
(`data-ig`) são montados a partir daí — não há link repetido no HTML.
Cada botão já leva uma mensagem pronta (o kit escolhido, por exemplo).

Enquanto o número for o provisório, o console do navegador avisa.

**Outros pontos que dependem de informação do cliente** (todos em `index.html`):

| Onde | O quê |
| --- | --- |
| `<title>`, `.nav__name`, `.foot__brand`, abertura | nome da marca |
| seção `#kits` | itens e preços dos kits |
| seção `#localizacao` → `.local__info` | atendimento, horários, endereço e área de entrega |
| `<script type="application/ld+json">` | dados estruturados (endereço, telefone) |

A seção de localização hoje traz apenas informações genéricas e verdadeiras
(“pedidos pelo WhatsApp”, “entrega combinada”). Se houver endereço fixo,
horário de funcionamento ou taxa de entrega, é só substituir ali e no JSON-LD.

## 2. Trocar as imagens por fotografia real

As imagens atuais foram **renderizadas por código** (`tools/gen_images.py`) —
servem de placeholder de alto padrão até chegarem as fotos da confeitaria.

Para trocar, basta salvar os arquivos reais em `assets/img/` **com os mesmos
nomes e proporções**. Nada no HTML/CSS precisa mudar:

| Arquivo | Proporção | Uso |
| --- | --- | --- |
| `hero-doce.jpg` | 4:5 | foto principal da hero |
| `macro-chocolate.jpg` | ~3:2 | macro da seção “Não é apenas um doce” |
| `mesa-cinematica.jpg` | ~16:9 | fundo full-screen “Cada celebração…” |
| `preparo-creme.jpg` | 4:5 | seção “Feito com cuidado” |
| `desejo.jpg` | ~5:4 | fundo da seção “Você já sabe…” |
| `teresina.jpg` | ~16:10 | fundo da seção de localização |
| `esp-*.jpg` (5) | 4:5 | especialidades (bolos, brigadeiros, doces, kits, encomendas) |
| `oc-*.jpg` (6) | 3:4 | ocasiões |
| `og-cover.jpg` | 1.91:1 | prévia no WhatsApp/Instagram/Google |

Dica: exporte em JPEG progressivo, qualidade ~80, no máximo ~1600 px de largura.

Para regerar as imagens atuais (requer `pillow` e `numpy`):

```bash
python3 tools/gen_images.py
```

## 3. Rodar localmente

```bash
npx http-server -p 8000 .
# abra http://localhost:8000
```

## 4. Detalhes de implementação

- **Abertura (~2,5 s)**: partículas de açúcar em canvas, nome com
  *blur → nitidez*, e a foto revelada por máscara circular. Roda uma vez por
  sessão (`sessionStorage`), pode ser pulada com clique ou `Esc`, e é ignorada
  por quem usa “reduzir movimento”.
- **Scroll**: Lenis (suave) + GSAP ScrollTrigger. Seções 02 e 04 usam
  `position:sticky` com scrub; a seção 03 é um scroll horizontal controlado
  pelo scroll vertical no desktop e vira carrossel de arrastar no celular.
- **Acessibilidade e resiliência**: sem JavaScript, sem GSAP ou com
  `prefers-reduced-motion`, a página entra em modo estático (`.no-anim`) e
  continua completa e legível — nada fica invisível.
- **Performance**: ~370 KB no primeiro carregamento (fontes e bibliotecas
  self-hosted, imagens abaixo da dobra com `loading="lazy"` e `width`/`height`
  declarados para não haver deslocamento de layout).

## 5. Publicação (GitHub Pages)

O arquivo `CNAME` aponta para `jabuticabacafé.com.br`. Em
**Settings → Pages**, selecione a branch e a pasta raiz (`/`).

> `saveweb2zip-com-jabuticabacef-lovable-app.zip` é o backup do site antigo
> (cafeteria em São Luís/MA) e não é usado por esta landing page.
