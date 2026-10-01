# St1 Internet — novo site

Site novo para a St1 Internet, feito página por página. É estático (HTML, CSS e JS puro): não precisa de build e funciona em qualquer hospedagem, inclusive GitHub Pages.

## Estrutura

Os caminhos são os mesmos do site atual, então links antigos e posições no Google continuam valendo.

| Página | Arquivo |
| --- | --- |
| Início | `index.html` |
| Internet pra sua empresa | `internetparasuaempresa/index.html` |
| Grandes empresas & governo | `empresaegoverno/index.html` |
| Soluções para provedores | `solucoesparaprovedores/index.html` |
| Institucional | `sobre/index.html` |
| Dúvidas frequentes | `faq/index.html` |
| Fale conosco | `contatos/index.html` |
| Política de privacidade | `politica-de-privacidade/index.html` |

- `assets/css/style.css`: todo o visual. As cores e fontes ficam em `:root`, no topo do arquivo.
- `assets/js/main.js`: menu, formulários que abrem o WhatsApp, busca do FAQ e animações. O número do WhatsApp e o link da Área do Cliente ficam no objeto `CONFIG`.
- `assets/img/`: favicon e imagem de compartilhamento (`og-st1.png`).

## Confirme antes de publicar

1. **Logo e cores**: o logo atual é provisório (marca de sinal + "St1"). Troque pelo logo oficial e ajuste as cores em `:root`.
2. **Área do Cliente**: hoje aponta para o app na App Store. Troque `CONFIG.areaCliente` em `main.js` pelo portal oficial (e inclua o link da Google Play, se houver).
3. **Planos**: o único preço confirmado é a oferta residencial (instalação + 1º mês por R$ 19,90, depois R$ 109,90/mês). Se quiser mostrar velocidades (MEGA), acrescente nos cards da seção `#planos` do `index.html`.
4. **Política de privacidade**: o texto segue a estrutura da LGPD, mas é um modelo. Substitua pelo texto oficial ou valide com o jurídico.
5. **Artigos do blog**: os cards de "Dicas e novidades" apontam para os posts atuais em `st1.net.br`. Se o blog sair do ar com a troca do site, atualize esses links.
6. **Domínio**: para publicar, coloque o conteúdo desta pasta na raiz de `st1.net.br`. O `robots.txt` e o `sitemap.xml` já estão prontos para esse domínio.

## Ver localmente

```bash
cd st1
python3 -m http.server 8000
# abra http://localhost:8000
```
