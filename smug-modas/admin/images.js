// Fotos enviadas pelo painel: redimensionadas e comprimidas no próprio navegador
// antes de irem para o GitHub (WebP; JPEG nos navegadores que não geram WebP).

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const canvasToBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

async function decode(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* cai para <img> abaixo */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function processImage(file, { maxSize = 1400, quality = 0.82 } = {}) {
  if (!file || !/^image\/(jpeg|png|webp|gif|avif|heic|heif)$/i.test(file.type)) {
    throw new Error('Escolha uma foto em JPG, PNG ou WebP.');
  }
  if (file.size > 25 * 1024 * 1024) throw new Error('A foto é muito grande (máximo de 25 MB).');
  let source;
  try {
    source = await decode(file);
  } catch {
    throw new Error('Não foi possível ler esta foto. Tente outra em JPG ou PNG.');
  }
  const width = source.width;
  const height = source.height;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7efe4'; // fundo creme para imagens com transparência
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  source.close?.();

  let blob = await canvasToBlob(canvas, 'image/webp', quality);
  let ext = 'webp';
  if (!blob || blob.type !== 'image/webp') {
    blob = await canvasToBlob(canvas, 'image/jpeg', 0.85);
    ext = 'jpg';
  }
  if (!blob) throw new Error('Não foi possível processar esta foto.');
  return { dataUrl: await blobToDataUrl(blob), width: w, height: h, ext, bytes: blob.size };
}

// "data:image/webp;base64,AAAA" → "AAAA"
export const dataUrlBase64 = (dataUrl) => dataUrl.slice(dataUrl.indexOf(',') + 1);
