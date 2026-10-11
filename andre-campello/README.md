# André Campello — Agro Assessoria Jurídica

Site institucional em HTML, CSS e JavaScript puros (sem etapa de build), seguindo as
referências visuais: **Hero → Áreas de Atuação → Sobre → Contato**.

## Visualizar

Abra `index.html` no navegador ou sirva a pasta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Configurar os contatos

Todos os dados de contato ficam em **`assets/js/config.js`**. Nada foi inventado:
os campos vazios ficam prontos para preenchimento.

| Campo            | Exemplo                          | Efeito quando preenchido |
|------------------|----------------------------------|--------------------------|
| `whatsapp`       | `"5562999999999"`                | Botões "Falar agora", "Falar com um especialista" e o canal WhatsApp abrem o `wa.me`; aparece o botão flutuante e o número no rodapé. |
| `whatsappMessage`| texto                            | Mensagem inicial ao abrir o WhatsApp. |
| `email`          | `"contato@seudominio.com.br"`    | Canal E-mail abre o `mailto:`; e-mail aparece no rodapé. |
| `instagram`      | `"agroassessoria.adv"`           | Links do Instagram (já preenchido conforme as referências). |
| `linktree`       | `"https://linktr.ee/usuario"`    | Canal Linktree abre o link. |
| `formEndpoint`   | `"https://formspree.io/f/xxxx"`  | O formulário envia os dados (POST JSON) para esse endereço. |
| `oab`            | `"OAB/UF 00.000"`                | Registro exibido no rodapé. |
| `endereco`       | `"Cidade — UF"`                  | Endereço exibido no rodapé. |

**Enquanto um canal não estiver configurado**, o botão correspondente leva o visitante
ao formulário e mostra um aviso discreto. O formulário tenta, nesta ordem:
`formEndpoint` → WhatsApp (mensagem montada com os dados) → e-mail. Sem nenhum deles,
valida os campos e indica o Instagram como alternativa.

## Estrutura

```
andre-campello/
├── index.html
├── assets/
│   ├── css/style.css     identidade visual, layout responsivo e animações
│   ├── js/config.js      dados de contato (editar aqui)
│   ├── js/main.js        preloader, letras subindo, revelações, navegação, formulário
│   └── img/              fotos (WebP), favicon e imagem de compartilhamento
```

## Animações e acessibilidade

- Preloader com o monograma sendo desenhado; títulos com letras subindo por trás de máscara,
  parágrafos palavra por palavra, imagens reveladas em cortina, ícones desenhados no traço,
  parallax suave, poeira dourada no hero e hovers discretos nos cartões.
- Respeita `prefers-reduced-motion`; sem JavaScript, todo o conteúdo continua visível.
- Leitores de tela recebem os títulos inteiros (não letra por letra).
