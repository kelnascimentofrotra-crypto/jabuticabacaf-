# Tá No Clima — Refrigeração e Serviço

Site institucional (uma página) da **Tá No Clima — Refrigeração e Serviço**, especialistas em
climatização em São Luís - MA. HTML, CSS e JavaScript puros, sem build e sem dependências.

## Estrutura

```
index.html              página completa
assets/css/style.css    estilos (paleta da logo em variáveis no topo)
assets/js/main.js       interações + CONFIG com os dados de contato
assets/img/             logo (marca e versão completa) e favicon, em SVG
```

## Como atualizar os dados de contato

Telefone, WhatsApp, e-mail, horário e redes sociais ficam **em um único lugar**:
o objeto `CONFIG`, no começo de `assets/js/main.js`.

```js
const CONFIG = {
  whatsapp: '5598000000000',            // 55 + DDD + número, só dígitos
  telefoneExibicao: '(98) 9 9999-9999', // como aparece na tela
  email: 'contato@tanoclima.com.br',
  horario: 'Seg a Sáb, 7h às 18h',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/'
};
```

Ao salvar, o site inteiro é atualizado: topo, botões de WhatsApp, rodapé e formulário.
O endereço aparece direto no HTML (topo, seção *Contato* e rodapé).

> **Pendente:** os valores acima ainda são de exemplo. Troque pelos números reais antes de divulgar o site.

## Paleta (extraída da logo)

| Cor | Hex | Uso |
| --- | --- | --- |
| Azul-marinho | `#0B2E59` | títulos, fundos escuros |
| Azul-marinho profundo | `#071F3E` | topo e rodapé |
| Azul-gelo | `#1E9BE0` | cor principal, botões e ícones |
| Ciano claro | `#7FD4F5` | destaques sobre fundo escuro |
| Vermelho | `#E02B28` | detalhes de acento |
| Fundo gelo | `#EEF5FB` | seções alternadas |

As cores estão em variáveis CSS no início de `assets/css/style.css` (`:root`).

## Fotografias

O site funciona sem nenhuma foto: onde ela falta, entra uma cena desenhada em
CSS/SVG. Para colocar as fotos reais, basta salvar os arquivos com estes nomes
dentro de `assets/img/` — não é preciso mexer no código.

| Arquivo | Onde aparece | Tamanho sugerido | O que fotografar |
| --- | --- | --- | --- |
| `hero.jpg` | fundo do topo (computador) | 1920 × 1080, horizontal | técnico instalando ou consertando um split, de preferência com espaço vazio à esquerda para o texto |
| `hero-vertical.jpg` | fundo do topo (celular) | 900 × 1200, vertical | a mesma cena, enquadrada em pé |
| `ambiente.jpg` | seção "Do calor ao conforto" | 1200 × 900 | ambiente já climatizado, com o ar-condicionado visível na parede |

Dicas de enquadramento:

- O topo escurece a foto e aplica um degradê da esquerda para a direita — o
  assunto deve ficar **à direita** do quadro, e a esquerda pode ser parede,
  céu ou fundo liso.
- A foto da seção "Do calor ao conforto" recebe uma camada laranja que vai
  virando azul conforme a rolagem. Fotos claras e com boa luz funcionam muito
  melhor nesse efeito do que fotos escuras.
- Se quiser ajustar o recorte, mude `object-position` em `.scene__photo img`
  e `.cf__photo img`, no fim de `assets/css/style.css`.

> Use fotos do próprio trabalho de vocês, ou imagens de banco com licença de uso
> comercial. Não use fotos de outra empresa: além do problema de direitos, dá a
> entender que o serviço mostrado é seu.

## Formulário

Não há servidor: o formulário monta a mensagem e abre o WhatsApp já preenchido.
Nenhum dado é armazenado.

## Publicação

O site é estático — basta servir a raiz do repositório (GitHub Pages, por exemplo).
Para testar localmente: `python3 -m http.server` e abrir `http://localhost:8000`.
