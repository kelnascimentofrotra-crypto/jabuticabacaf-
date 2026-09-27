# LeadBox — hero com Velaris

A hero da landing do LeadBox refeita sobre o **Velaris**, um gradiente animado em
WebGL (simplex noise, vinheta, brilho central e granulação). A paleta usa as cores
da landing atual: fundo `#0e100f`, laranja `#ff6b35`, texto `#f2efe7`.

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
| `src/components/ui/velaris.tsx` | O componente Velaris, sem alterações |
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

- **Contraste:** o brilho se move, então há um véu escuro atrás do texto (à esquerda
  no desktop, uniforme no celular). Medido em vários momentos da animação e tamanhos
  de tela: título acima de 3:1 e textos pequenos acima de 4,5:1 (WCAG AA).
- **Movimento reduzido:** com `prefers-reduced-motion`, o gradiente fica parado.
- **Paleta fixa fora do componente:** o Velaris reinicia o WebGL quando o array
  `colors` muda de referência; um array criado a cada render recriaria o shader.
- **Sem WebGL:** a seção continua com o fundo `bg-background` e todo o conteúdo.
