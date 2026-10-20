/** Funções puras usadas pelo build e pelos testes. */

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Normaliza o número de WhatsApp para o formato do wa.me: só dígitos,
 * com código do país. Vazio continua vazio (canal pendente).
 */
export function normalizeWhatsappNumber(input) {
  const digits = String(input ?? '').replace(/\D+/g, '');
  if (!digits) return '';
  if (digits.length < 12) {
    throw new Error(
      `whatsappNumber "${input}" parece incompleto: use código do país + DDD + número (ex.: 5591999999999).`,
    );
  }
  if (digits.length > 15) {
    throw new Error(`whatsappNumber "${input}" tem dígitos demais para um número internacional.`);
  }
  return digits;
}

export function waHref(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function fill(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));
}

/** Minúsculas e sem acentos: "Instalação" e "instalacao" se encontram. */
export function normalizeSearch(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Converte uma caixa em pixels da arte para porcentagens da própria imagem. */
export function boxToPercent([x0, y0, x1, y1], [width, height]) {
  const p = (v, total) => `${+((v / total) * 100).toFixed(3)}%`;
  return { left: p(x0, width), top: p(y0, height), width: p(x1 - x0, width), height: p(y1 - y0, height) };
}
