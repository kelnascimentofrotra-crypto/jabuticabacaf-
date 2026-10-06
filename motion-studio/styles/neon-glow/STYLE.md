# Estilo: neon-glow

Anúncio vertical de app ou serviço: fundo preto com uma única cor de acento em neon, sempre com brilho (bloom). Treinado a partir da referência "Full TV Streaming" (30 fps, 33 s, cortes num grid de ~128 BPM).

## Identidade
- **Fundo:** preto `#080808` com um brilho central na cor de acento que respira devagar, uma grade fina (passo 90 px, 6%) e uma vinheta forte. De tempos em tempos entra uma **cartela de tela cheia na cor de acento** (`#480808` → `#F81808`), sempre com pouco texto.
- **Texto:** em duas camadas por frase.
  - Linha de apoio pequena, branca, com glow branco ("Seu aplicativo vive", "Chega de").
  - Palavra-chave grande na cor de acento, com glow forte ("Travando?", "Estresse").
  - Nada de parágrafos, a não ser uma legenda mínima abaixo do logo e as letras miúdas no CTA.
- **Acento:** uma cor só (na referência, vermelho `#F81808`, com o brilho do texto `#FA4053`). O branco é o único contraste.
- **Tipografia:** Montserrat. 500/600 nas linhas de apoio (≈ 40 px em 1080), 700/800 nas palavras-chave (≈ 100–110 px). Texto curto e centralizado.
- **Elementos:**
  - tiles de ícone (quadrado arredondado de 26% na cor de acento, ícone branco, glow);
  - pílulas com ícone e rótulo;
  - aros e anéis com pontos;
  - botão CTA em pílula;
  - confete e ícones flutuando na cena do preço.
- **Grão:** 3%.

## Gramática
1. **Problema → solução → benefícios → preço → CTA → marca.** A ordem fixa é:
   - gancho com pergunta;
   - "Chega de ✕";
   - "Conheça a." com o logo;
   - benefícios, um por cena;
   - "Tudo isso.." e o preço;
   - "?" que vira botão;
   - logo;
   - slogan.
2. **Texto digitado.** As linhas brancas aparecem letra a letra (≈ 22 caracteres/s) com cada letra entrando por blur. A palavra-chave entra por escala com overshoot (1,3 → 1) e blur. A frase seguinte começa antes da anterior acabar.
3. **Tile → ícone → órbita.** Um tile pequeno cresce no centro (mola firme). Depois as pílulas passam em 3D, perto da câmera e com motion blur, e por fim orbitam em elipse em volta do tile.
4. **Tela dividida.** O topo é preto, com a frase branca grande e um texto vazado gigante ao fundo, que desliza. A base é um painel na cor de acento com a borda superior inclinada, contendo ícone, pílula, palavra grande e botão de seta.
5. **Câmera sempre em movimento.** Push-in contínuo (1 → 1,06–1,12) e leve rotação. Nas cenas de órbita há voo 3D (perspectiva com rotateX).
6. **Transições curtas que nascem do elemento em foco:**
   - flash na cor de acento (bloom) a partir do centro;
   - zoom-blur para dentro da palavra-chave;
   - aro que se expande;
   - corte seco no tempo forte;
   - glitch RGB de 2–4 quadros.
7. **Preço é o clímax.** "Tudo isso.." fica num quase-silêncio de break. O drop entra junto com o preço, que pula em escala sobre o confete, com ícones flutuando em profundidade (os próximos da câmera desfocados).
8. **CTA:**
   - um loader circular desenha um "?", que vira círculo;
   - o círculo se estica em pílula, que vira o botão;
   - o botão pulsa no tempo da música, com uma linha digitada embaixo e letras miúdas no rodapé.
9. **Fecho:** o logo sozinho com brilho, sobre o segundo drop da música. Depois, o slogan branco pequeno que se apaga devagar até o preto.

## Duração típica por cena (30 fps)
- Gancho: 45–60f · "Chega de": 30f · "Conheça a.": 30–35f
- Logo com anel: 28f · Headline com aro: 22–25f · Cartela cheia com texto digitado: 35f
- Tile crescendo: 45f · Pílulas em 3D: 60f (≈ 20f cada) · Órbita: 45f
- Tela dividida: 60f · Disco "Sempre..": 35f · Glitch: 8–15f
- "Pra curtir cada": 60f · "Tudo isso..": 25–30f · Preço: 75f · "?" → pílula: 40f · CTA: 50f
- Logo: 60f · Slogan e fade: 150f

## Sons (style.sfx)
- O whoosh curto da transição é automático.
- `typing` em toda linha digitada.
- `pop` em tiles, pílulas e na palavra-chave.
- `tick` como tique-taque no gancho.
- `boom` + `shimmer` no logo e no preço, sempre no drop da música.
- `click` no botão CTA e um ruído digital curto no glitch.
- Música eletrônica ou animada: quase sem bateria até o logo, break em "Tudo isso.." e drops no preço e no logo final.
