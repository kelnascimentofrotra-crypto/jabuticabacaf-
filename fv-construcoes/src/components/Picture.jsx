const BASE = import.meta.env.BASE_URL;

/**
 * Imagem responsiva com AVIF + WebP e dimensões declaradas (evita deslocamento de layout).
 * `image` vem de data/site.js (name, widths, width, height).
 */
export default function Picture({
  image,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  className,
  imgClassName,
}) {
  const srcSet = (ext) => image.widths.map((w) => `${BASE}img/${image.name}-${w}.${ext} ${w}w`).join(', ');
  const fallbackWidth = image.widths[Math.min(1, image.widths.length - 1)];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={`${BASE}img/${image.name}-${fallbackWidth}.webp`}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={imgClassName}
      />
    </picture>
  );
}
