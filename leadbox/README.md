# LeadBox — hero com Velaris

A hero da landing do LeadBox refeita sobre o **Velaris**, um gradiente animado em
WebGL (simplex noise, brilho central e granulação) em verde-água, laranja e preto,
ocupando a tela inteira, cabeçalho incluído.

Stack igual à de um projeto Lovable: Vite + React + TypeScript + Tailwind CSS v4 +
estrutura shadcn/ui (`components.json`, alias `@/`, `src/components/ui`).

```bash
cd leadbox
npm install
npm run dev     # http://localhost:5173
npm run build   # checa tipos e gera dist/
```

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `src/components/ui/velaris.tsx` | O componente Velaris, com a prop opcional `vignette` |
| `src/components/leadbox-hero.tsx` | A hero: cabeçalho, título, texto e botões sobre o Velaris |
| `src/components/velaris-demo.tsx` | O demo original do Velaris (referência, não é usado na página) |
| `src/components/ui/button.tsx` | Botão padrão do shadcn |
| `src/lib/utils.ts` | `cn()` do shadcn |
| `src/index.css` | Tailwind v4 + tokens de cor do LeadBox |

## Levando para o projeto do Lovable

1. Crie `src/components/ui/velaris.tsx` com o conteúdo deste repositório.
2. Crie `src/components/leadbox-hero.tsx` e troque a hero atual (e o cabeçalho,
   que agora fica dentro dela para o gradiente passar por trás) por
   `<LeadBoxHero loginHref="/sua-rota-de-login" signupHref="/sua-rota-de-cadastro" />`.
3. Instale `lucide-react` se ainda não estiver no projeto. `button.tsx` e
   `lib/utils.ts` já vêm em todo projeto Lovable/shadcn.

A hero usa os tokens do tema (`bg-primary`, `text-foreground`, `bg-background`…),
então herda as cores e a fonte que o projeto já tiver.

## Detalhes

- **`vignette`:** prop nova do Velaris (padrão `1`, igual ao original). A hero usa
  `0` para a cor ir até as bordas em vez de escurecer nos cantos.
- **Paleta:** `#3cc29c`, `#ff5a1f`, `#23a17f` e `#050606` sobre `#0b0d0c`, definida
  fora do componente. O Velaris reinicia o WebGL quando o array `colors` muda de
  referência, então um array criado a cada render recriaria o shader.
- **Legibilidade:** texto branco com sombra suave, selo e botão secundário em fundo
  escuro, para continuarem legíveis sobre o verde e o laranja.
- **Movimento reduzido:** com `prefers-reduced-motion`, o gradiente fica parado.
- **Sem WebGL:** a seção continua com o fundo `bg-background` e todo o conteúdo.
