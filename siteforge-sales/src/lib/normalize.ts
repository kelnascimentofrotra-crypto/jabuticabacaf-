const STOPWORDS = new Set([
  'a', 'o', 'e', 'de', 'do', 'da', 'dos', 'das', 'que', 'um', 'uma', 'uns', 'umas', 'eu', 'meu', 'minha', 'meus', 'minhas',
  'para', 'pra', 'pro', 'com', 'no', 'na', 'nos', 'nas', 'os', 'as', 'se', 'me', 'te', 'em', 'por', 'mais', 'muito', 'muita',
  'ja', 'ta', 'esta', 'estou', 'isso', 'esse', 'essa', 'ele', 'ela', 'voce', 'vc', 'ai', 'aqui', 'so', 'mas', 'mesmo', 'bem',
  'tudo', 'nao', 'sim', 'ou', 'ao', 'aos', 'lo', 'la', 'vai', 'tem', 'ter', 'ser', 'sou', 'era', 'foi', 'porque', 'pq', 'como',
  'quando', 'onde', 'qual', 'quais', 'agora', 'entao', 'tambem', 'oi', 'ola', 'bom', 'dia', 'boa', 'tarde', 'noite', 'obrigado',
  'obrigada', 'td', 'tb', 'q', 'n', 'blz', 'beleza', 'kkk', 'kkkk', 'rs',
]);

/** Minúsculas, sem acentos e sem pontuação. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Radical simples: remove plural e algumas terminações comuns. */
export function stem(token: string): string {
  let t = token;
  if (t.length > 5 && t.endsWith('mente')) t = t.slice(0, -5);
  if (t.length > 4 && (t.endsWith('oes') || t.endsWith('aes'))) t = t.slice(0, -3) + 'ao';
  else if (t.length > 4 && t.endsWith('es') && !t.endsWith('ses')) t = t.slice(0, -1);
  else if (t.length > 3 && t.endsWith('s')) t = t.slice(0, -1);
  return t;
}

export function tokens(text: string, keepStopwords = false): string[] {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 1 && (keepStopwords || !STOPWORDS.has(t)))
    .map(stem);
}

function trigrams(text: string): Set<string> {
  const s = `  ${normalize(text)} `;
  const out = new Set<string>();
  for (let i = 0; i < s.length - 2; i++) out.add(s.slice(i, i + 3));
  return out;
}

/** Similaridade de Dice entre trigramas (0–1). */
export function similarity(a: string, b: string): number {
  const ta = trigrams(a);
  const tb = trigrams(b);
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return (2 * inter) / (ta.size + tb.size);
}

/** Divide uma mensagem colada em frases, para comparar cada uma isoladamente. */
export function sentences(text: string): string[] {
  return text
    .split(/[.!?\n;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}
