import { esc, icon, img, delay, words, wordCount } from '../lib.mjs';

// Mural de postagens: só aparece quando há postagens publicadas (feitas pelo painel).
// Cada card abre a postagem completa num diálogo (assets/js/main.js → initPosts).
export const visiblePosts = ({ posts }) =>
  (posts?.items ?? [])
    .filter((post) => post.status === 'publicado' && post.title)
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 6);

const DATE = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatPostDate = (date) => (/^\d{4}-\d{2}-\d{2}$/.test(date || '') ? DATE.format(new Date(`${date}T12:00:00Z`)) : '');

const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const excerpt = (text, max = 150) => {
  const flat = paragraphs(text).join(' ');
  return flat.length > max ? `${flat.slice(0, flat.lastIndexOf(' ', max) > 60 ? flat.lastIndexOf(' ', max) : max)}…` : flat;
};

const safeId = (id) => String(id).replace(/[^\w-]/g, '');

const fullPost = (post) => `
      <template id="post-${safeId(post.id)}">
        ${post.image?.src ? `<figure class="post-full__media">${img({ ...post.image, alt: post.image.alt || '' }, { className: 'post-full__img', sizes: '(min-width: 900px) 760px, 100vw' })}</figure>` : ''}
        <div class="post-full__body">
          ${post.date ? `<time class="post-full__date" datetime="${esc(post.date)}">${formatPostDate(post.date)}</time>` : ''}
          <h2 class="post-full__title" data-post-title>${esc(post.title)}</h2>
          <div class="post-full__text">${paragraphs(post.text).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          ${
            post.link?.url
              ? `<a class="btn btn--wine" href="${esc(post.link.url)}" target="_blank" rel="noopener">${esc(post.link.label || 'Saiba mais')} ${icon('arrow', 'icon btn__arrow')}<span class="sr-only"> (abre em nova aba)</span></a>`
              : ''
          }
        </div>
      </template>`;

const card = (post, i) => `
    <li class="post${post.pinned ? ' post--pinned' : ''}" data-reveal ${delay(i % 3, 90)}>
      <article class="post__card">
        <div class="post__media">
          ${post.image?.src ? img({ ...post.image, alt: post.image.alt || '' }, { className: 'post__img', sizes: '(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw' }) : `<span class="post__placeholder" aria-hidden="true">S</span>`}
          ${post.pinned ? '<span class="post__badge">Destaque</span>' : ''}
        </div>
        <div class="post__body">
          ${post.date ? `<time class="post__date" datetime="${esc(post.date)}">${formatPostDate(post.date)}</time>` : ''}
          <h3 class="post__title"><button class="post__open" type="button" data-post-open="${safeId(post.id)}" aria-haspopup="dialog">${esc(post.title)}</button></h3>
          <p class="post__excerpt">${esc(excerpt(post.text))}</p>
          <span class="post__more" aria-hidden="true">Ler postagem ${icon('arrow', 'icon post__arrow')}</span>
        </div>
      </article>
      ${fullPost(post)}
    </li>`;

export const posts = (content) => {
  const { posts: p } = content;
  const items = visiblePosts(content);
  if (!items.length) return '';
  return `
<section class="posts" id="postagens" data-tone="light" aria-labelledby="posts-title">
  <div class="container">
    <header class="posts__head">
      <p class="eyebrow eyebrow--line" data-reveal>${esc(p.eyebrow)}</p>
      <h2 class="section-title section-title--wine" id="posts-title" data-reveal="words" ${delay(1)}>
        ${words(p.title.plain)} <em>${words(p.title.italic, { start: wordCount(p.title.plain) })}</em>
      </h2>
      ${p.text ? `<p class="posts__text" data-reveal ${delay(2)}>${esc(p.text)}</p>` : ''}
    </header>
    <ul class="post-grid" aria-label="${esc(`${p.title.plain} ${p.title.italic}`)}">
      ${items.map(card).join('')}
    </ul>
  </div>
  <dialog class="post-dialog" aria-labelledby="post-dialog-title" data-post-dialog>
    <div class="post-dialog__panel">
      <button class="post-dialog__close" type="button" aria-label="Fechar postagem" data-post-close>${icon('close')}</button>
      <div class="post-dialog__content" data-post-content></div>
    </div>
  </dialog>
</section>`;
};
