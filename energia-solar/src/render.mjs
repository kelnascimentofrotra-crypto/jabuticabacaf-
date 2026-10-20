/**
 * Componentes que geram o HTML estático do site.
 * Cada função recebe dados e devolve uma string de marcação.
 */
import { escapeHtml as e, boxToPercent, fill, normalizeSearch, waHref } from './lib.mjs';

/* ------------------------------------------------------------------ */
/* Ícones                                                              */
/* ------------------------------------------------------------------ */

const svg = (body, { cls = '', vb = '0 0 24 24', stroke = true } = {}) =>
  `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false"${
    stroke
      ? ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
      : ' fill="currentColor"'
  }>${body}</svg>`;

export const icons = {
  arrow: () => svg('<path d="M7 17 17 7M9 7h8v8"/>'),
  left: () => svg('<path d="M19 12H5m6-6-6 6 6 6"/>'),
  right: () => svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  close: () => svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  menu: () => svg('<path d="M5 7h14M5 12h14M5 17h14"/>'),
  search: () => svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/>'),
  check: () => svg('<path d="m5 12.5 4.2 4.2L19 7"/>', { cls: 'check' }),
  whatsapp: () =>
    svg(
      '<path d="M3.6 20.4l1.25-4A8.6 8.6 0 1 1 8 19.3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<path d="M9.1 7.9c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5a6.6 6.6 0 0 0 2.7 2.5c.2.1.4.1.5 0l.6-.7c.1-.2.4-.2.6-.1l1.6.8c.2.1.4.3.4.5v.5c0 .4-.2.7-.6 1-.7.4-1.5.5-2.5.2a9.3 9.3 0 0 1-5.3-5.1c-.4-1-.3-1.8.2-2.4z"/>',
      { stroke: false },
    ),
};

/** Sol da marca: círculo e raios alternados, como nas artes. */
export function sun(cls = 'sun') {
  const rays = [];
  for (let k = 0; k < 16; k++) {
    const a = (k * Math.PI) / 8;
    const long = k % 2 === 0;
    const r0 = 14.5;
    const r1 = long ? 27 : 21;
    const p = (r) => `${(32 + r * Math.cos(a)).toFixed(2)} ${(32 + r * Math.sin(a)).toFixed(2)}`;
    rays.push(`<path class="sun__ray" style="--k:${k}" d="M${p(r0)}L${p(r1)}"/>`);
  }
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle class="sun__core" cx="32" cy="32" r="9.5"/>${rays.join('')}</svg>`;
}

export function brand(config, { cls = '' } = {}) {
  return `<a class="brand ${cls}" href="#inicio">${sun()}<span class="brand__word">${e(config.brand.wordmark)}</span><span class="sr-only"> — voltar ao início</span></a>`;
}

/* ------------------------------------------------------------------ */
/* Botões e WhatsApp                                                   */
/* ------------------------------------------------------------------ */

/**
 * Link de WhatsApp. Com número configurado, sai pronto em HTML (funciona
 * sem JS). Sem número, aponta para o contato e o JS mostra o aviso de
 * configuração pendente, sem abrir conversa com ninguém.
 */
export function waAttrs(ctx, key, tipo = '') {
  const vars = tipo ? { tipo } : {};
  const message = fill(ctx.config.messages[key], vars);
  const data = ` data-wa="${e(key)}"${tipo ? ` data-wa-tipo="${e(tipo)}"` : ''}`;
  if (ctx.wa) {
    return ` href="${e(waHref(ctx.wa, message))}" target="_blank" rel="noopener"${data}`;
  }
  return ` href="#contato"${data}`;
}

export function button({ label, variant = 'light', icon = 'arrow', lead = '', attrs = '', cls = '', tag = 'a' }) {
  const leadIcon = lead ? `<span class="btn__lead">${icons[lead]()}</span>` : '';
  const trail = icon ? `<span class="btn__icon">${icons[icon]()}</span>` : '';
  const type = tag === 'button' ? ' type="button"' : '';
  return `<${tag} class="btn btn--${variant} ${cls}"${type}${attrs}>${leadIcon}<span class="btn__label">${e(label)}</span>${trail}</${tag}>`;
}

const analiseAttrs = ' href="#contato" data-action="analise" aria-haspopup="dialog"';

/* ------------------------------------------------------------------ */
/* Cabeçalho (somente na hero nativa: as artes já trazem o delas)      */
/* ------------------------------------------------------------------ */

export function header(ctx) {
  const links = ctx.nav
    .map(
      (n, i) =>
        `<li><a href="#${n.id}"${i === 0 ? ' aria-current="true"' : ''} data-nav="${n.id}">${e(n.label)}</a></li>`,
    )
    .join('');
  return `
  <header class="site-header" data-anim style="--d:.05s">
    ${brand(ctx.config)}
    <nav class="site-nav" aria-label="Principal">
      <ul class="site-nav__list"><li class="site-nav__indicator" aria-hidden="true" role="presentation"></li>${links}</ul>
    </nav>
    <div class="site-header__end">
      ${button({ label: 'Solicitar proposta', variant: 'light', cls: 'btn--sm header-cta', attrs: analiseAttrs })}
      <button class="menu-btn" type="button" data-action="menu" aria-haspopup="dialog" aria-controls="menu-dialog" aria-expanded="false">${icons.menu()}<span class="sr-only">Abrir menu</span></button>
    </div>
  </header>`;
}

/* ------------------------------------------------------------------ */
/* Hero nativa: título em HTML sobre um céu desenhado em código         */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Cordilheira por deslocamento de ponto médio (determinística). */
function ridge(seed, { w = 1600, h = 400, top, depth, rough = 0.56, k = 7, domes = [] }) {
  const rand = rng(seed);
  const n = 2 ** k;
  const ys = new Array(n + 1);
  ys[0] = top + rand() * depth;
  ys[n] = top + rand() * depth;
  let disp = depth;
  for (let size = n; size > 1; size /= 2) {
    for (let i = size / 2; i < n; i += size) {
      ys[i] = (ys[i - size / 2] + ys[i + size / 2]) / 2 + (rand() - 0.5) * disp;
    }
    disp *= rough;
  }
  const pts = ys.map((y, i) => {
    const x = (i / n) * w;
    let yy = y;
    for (const d of domes) {
      const t = (x - d.x * w) / (d.w * w);
      if (Math.abs(t) < 1) yy = Math.min(yy, d.y + (1 - Math.sqrt(1 - t * t)) * d.drop);
    }
    return [x, yy];
  });
  const line = pts.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(' L');
  return { d: `M0 ${h} L${line} L${w} ${h} Z`, pts };
}

function heroSky() {
  const far = ridge(7, { top: 150, depth: 120, rough: 0.58, domes: [{ x: 0.755, w: 0.016, y: 168, drop: 58 }] });
  const mid = ridge(23, { top: 230, depth: 90, rough: 0.52 });
  const near = ridge(41, { top: 338, depth: 46, rough: 0.5, k: 6 });

  // Luzes de cidades no vale, em aglomerados, acendendo em ondas (grupos 0..5).
  const rand = rng(99);
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const towns = [
    [0.08, 26], [0.2, 18], [0.33, 30], [0.47, 14], [0.58, 26], [0.69, 34], [0.83, 22], [0.94, 16],
  ];
  const lights = [];
  for (const [cx, count] of towns) {
    for (let i = 0; i < count; i++) {
      const x = Math.max(0, Math.min(1600, cx * 1600 + gauss() * 70));
      const idx = Math.min(mid.pts.length - 1, Math.round((x / 1600) * (mid.pts.length - 1)));
      const y = mid.pts[idx][1] + 5 + Math.abs(gauss()) * 30;
      const r = 0.9 + rand() * 1.3;
      const g = Math.min(5, Math.floor((x / 1600) * 6));
      lights.push(
        `<circle class="light" style="--g:${g}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${rand() > 0.2 ? '#ffc56e' : '#eef3ff'}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`,
      );
    }
  }

  return `
    <div class="hero__sky" aria-hidden="true">
      <div class="sky sky--base"></div>
      <div class="layer" style="--depth:30"><svg class="sky sky--clouds" preserveAspectRatio="none" viewBox="0 0 1600 900"><defs><filter id="clouds" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0085" numOctaves="5" seed="11"/><feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.72  0 0 0 0 0.92  0 0 0 2.1 -1.05"/></filter><linearGradient id="cloudfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".55" stop-color="#fff" stop-opacity=".55"/><stop offset=".78" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="cloudmask"><rect width="1600" height="900" fill="url(#cloudfade)"/></mask></defs><rect width="1600" height="900" filter="url(#clouds)" mask="url(#cloudmask)"/></svg></div>
      <div class="layer" style="--depth:140"><div class="sky sky--glow"></div></div>
      <div class="layer" style="--depth:70"><svg class="sky sky--far" viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="farfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4f7a"/><stop offset=".45" stop-color="#1f3156"/><stop offset="1" stop-color="#101d36"/></linearGradient></defs><path d="${far.d}" fill="url(#farfill)"/></svg></div>
      <div class="layer" style="--depth:36"><svg class="sky sky--mid" viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="midfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14274a"/><stop offset="1" stop-color="#091629"/></linearGradient><filter id="bokeh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="${mid.d}" fill="url(#midfill)"/><g class="lights" filter="url(#bokeh)">${lights.join('')}</g></svg></div>
      <div class="layer" style="--depth:12"><svg class="sky sky--near" viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice"><path d="${near.d}" fill="#050e1b"/></svg></div>
      <div class="sky sky--shade"></div>
    </div>`;
}

function words(text, start, cls = '') {
  return text
    .split(' ')
    .map((w, i) => `<span class="w ${cls}"><span style="--i:${start + i}">${e(w)}</span></span>`)
    .join(' ');
}

export function heroNative(ctx) {
  const h = ctx.hero;
  const accentWords = h.titleSafe.accent.split(' ').length;
  return `
  <section class="hero hero--native" id="inicio" aria-labelledby="hero-title" tabindex="-1">
    ${heroSky()}
    ${header(ctx)}
    <div class="hero__content">
      <div class="hero__head">
        <p class="kicker hero__kicker" data-anim style="--d:.25s">${e(h.kicker)}</p>
        <h1 class="hero__title" id="hero-title">
          <span class="hero__line hero__line--1">${words(h.titleSafe.accent, 0, 'w--accent')}</span>
          <span class="hero__line hero__line--2">${words(h.titleSafe.rest, accentWords)}</span>
        </h1>
      </div>
      <div class="hero__bottom">
        <p class="hero__support" data-anim style="--d:1.05s">${h.support.map(e).join('<br>')}</p>
        <div class="hero__ctas">
          ${button({ label: h.primary, variant: 'blue', attrs: `${analiseAttrs} data-anim style="--d:1.15s"` })}
          ${button({ label: h.secondary, variant: 'outline', icon: '', lead: 'whatsapp', attrs: `${waAttrs(ctx, 'especialista')} data-anim style="--d:1.25s"` })}
        </div>
        <p class="hero__note" data-anim style="--d:1.35s">${e(h.note)}</p>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Palco das artes (modo B) e hotspots                                 */
/* ------------------------------------------------------------------ */

function hotspot(ctx, spot, size) {
  const pos = boxToPercent(spot.box, size);
  const style = `--l:${pos.left};--t:${pos.top};--w:${pos.width};--h:${pos.height}`;
  const cls = `hs hs--${spot.kind}${spot.primary ? ' hs--primary' : ''}`;
  const label = `<span class="sr-only">${e(spot.label)}</span>`;
  const [type, a1, a2] = spot.action.split(':');

  if (type === 'nav') return `<a class="${cls}" style="${style}" href="#${a1}">${label}</a>`;
  if (type === 'menu') {
    return `<button class="${cls}" style="${style}" type="button" data-action="menu" aria-haspopup="dialog" aria-controls="menu-dialog" aria-expanded="false">${label}</button>`;
  }
  if (type === 'analise') return `<a class="${cls}" style="${style}"${analiseAttrs}>${label}</a>`;
  if (type === 'wa') return `<a class="${cls}" style="${style}"${waAttrs(ctx, a1, a2)}>${label}</a>`;
  if (type === 'deck') {
    return `<a class="${cls}" style="${style}" href="#deck-${a1}" data-action="deck" data-deck="${a1}"${a2 ? ` data-item="${e(a2)}"` : ''}>${label}</a>`;
  }
  throw new Error(`Ação de hotspot desconhecida: ${spot.action}`);
}

export function stage(ctx, id, { hero = false } = {}) {
  const art = ctx.arts[id];
  const [dw, dh] = art.desktop.size;
  const [mw, mh] = art.mobile.size;
  const name = ctx.nav.find((n) => n.id === id).label;
  const load = hero ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const dSizes = hero ? `min(100vw, 1672px, calc(100svh * ${dw} / ${dh}))` : 'min(100vw, 1672px)';
  const mSizes = '(min-width: 880px) 420px, (min-width: 600px) 540px, 100vw';
  const spots = (variant, size) => art[variant].spots.map((s) => hotspot(ctx, s, size)).join('\n          ');

  return `
      <div class="stage${hero ? ' stage--hero' : ''}"${hero ? '' : ' data-reveal'} style="--ar-d:${dw} / ${dh};--ar-m:${mw} / ${mh}">
        <picture>
          <source media="(min-width: 1100px)" type="image/webp" srcset="assets/img/desktop/${art.file}-1280.webp 1280w, assets/img/desktop/${art.file}-full.webp ${dw}w" sizes="${dSizes}" width="${dw}" height="${dh}">
          <img src="assets/img/mobile/${art.file}-full.webp" srcset="assets/img/mobile/${art.file}-640.webp 640w, assets/img/mobile/${art.file}-full.webp ${mw}w" sizes="${mSizes}" width="${mw}" height="${mh}" alt="${e(art.alt)}" ${load} decoding="async">
        </picture>
        <div class="hotspots hotspots--d" role="group" aria-label="Arte interativa: ${e(name)}">
          ${spots('desktop', art.desktop.size)}
        </div>
        <div class="hotspots hotspots--m" role="group" aria-label="Arte interativa: ${e(name)}">
          ${spots('mobile', art.mobile.size)}
        </div>
      </div>`;
}

/* ------------------------------------------------------------------ */
/* Painéis nativos (decks)                                             */
/* ------------------------------------------------------------------ */

function sectionHead(id, s, headingTag = 'h2') {
  const title =
    (s.titleAccentFirst ? `<span class="accent">${e(s.titleAccentFirst)}</span> ` : '') +
    s.title.map(e).join(' ') +
    (s.titleAccent ? ` <span class="accent">${e(s.titleAccent)}</span>` : '');
  return `
        <header class="scene__head" data-reveal>
          <p class="kicker">${e(s.kicker)}</p>
          <${headingTag} class="scene__title" id="${id}-title">${title}</${headingTag}>
          <p class="scene__lead">${e(s.lead)}</p>
        </header>`;
}

function deckSolucoes(ctx) {
  const opts = ctx.solutions
    .map(
      (s, i) => `
              <label class="sol__opt${i === 0 ? ' is-checked' : ''}" style="--i:${i}">
                <input type="radio" name="solucao" value="${s.id}"${i === 0 ? ' checked' : ''}>
                <span class="sol__num">${String(i + 1).padStart(2, '0')}</span>
                <span class="sol__body"><span class="sol__name">${e(s.label)}</span><span class="sol__text">${e(s.text)}</span></span>
                <span class="sol__mark" aria-hidden="true">${icons.check()}</span>
              </label>`,
    )
    .join('');
  const first = ctx.solutions[0].id;
  return `
          <div class="deck deck--sol" id="deck-solucoes" data-deck="solucoes" data-kicker="Soluções sob medida" data-title="Encontre a ideal para você" tabindex="-1">
            <fieldset class="sol">
              <legend class="deck__label">Escolha o perfil do imóvel</legend>
              <div class="sol__list" data-stagger>
                <span class="sol__indicator" aria-hidden="true"></span>${opts}
              </div>
            </fieldset>
            <div class="msg" data-reveal>
              <p class="msg__label">Mensagem para o atendimento</p>
              <p class="msg__text" data-msg="solucao" aria-live="polite">${e(fill(ctx.config.messages.solucao, { tipo: first }))}</p>
            </div>
            ${button({ label: 'Encontrar minha solução', variant: 'light', cls: 'btn--block', attrs: `${waAttrs(ctx, 'solucao', first)} data-sol-cta` })}
          </div>`;
}

function deckComoFunciona(ctx) {
  const items = ctx.steps
    .map(
      (s, i) => `
              <li class="step" id="etapa-${i + 1}" style="--i:${i}">
                <span class="step__num">${String(i + 1).padStart(2, '0')}</span>
                <span class="step__dot" aria-hidden="true"></span>
                <div class="step__body"><h3 class="step__title">${e(s.title)}</h3><p class="step__text">${e(s.text)}</p></div>
              </li>`,
    )
    .join('');
  return `
          <div class="deck deck--steps" id="deck-como-funciona" data-deck="como-funciona" data-kicker="Como funciona" data-title="Quatro etapas, do começo ao acompanhamento" tabindex="-1">
            <ol class="steps" data-stagger>${items}
            </ol>
            <div class="deck__cta" data-reveal>
              ${button({ label: 'Começar minha análise', variant: 'light', cls: 'btn--block', attrs: analiseAttrs })}
              <p class="deck__hint">Comece com a sua conta de luz.</p>
            </div>
          </div>`;
}

function deckProjetos(ctx) {
  const tabs = ctx.projectTypes
    .map(
      (t, i) =>
        `<button class="tab" type="button" role="tab" id="tab-${t.id}" aria-controls="painel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tipo="${t.id}">${e(t.label)}</button>`,
    )
    .join('');

  const panels = ctx.projectTypes
    .map((t, i) => {
      const items = ctx.projects.filter((p) => p.tipo === t.id);
      const total = items.length;
      const pad = (n) => String(n).padStart(2, '0');
      const body = total
        ? `
                <div class="carousel" role="group" data-total="${total}" aria-roledescription="carrossel" aria-label="Vitrine ${e(t.label.toLowerCase())}">
                  <div class="carousel__viewport">${items
                    .map(
                      (p, j) => `
                    <article class="proj${j === 0 ? ' is-current' : ''}" aria-roledescription="slide" aria-label="${j + 1} de ${total}"${j === 0 ? '' : ' hidden'}>
                      <p class="kicker">${e(p.kicker)}</p>
                      <h3 class="proj__title">${e(p.title)}</h3>
                      <p class="proj__text">${e(p.text)}</p>
                    </article>`,
                    )
                    .join('')}
                  </div>
                  <div class="carousel__controls">
                    <button class="icon-btn" type="button" data-prev${total < 2 ? ' disabled' : ''}>${icons.left()}<span class="sr-only">Projeto anterior</span></button>
                    <span class="carousel__count" aria-live="polite"><span data-index>01</span> / ${pad(total)}</span>
                    <span class="carousel__bar" aria-hidden="true" style="--n:1;--total:${total}"><span></span></span>
                    <button class="icon-btn" type="button" data-next${total < 2 ? ' disabled' : ''}>${icons.right()}<span class="sr-only">Próximo projeto</span></button>
                  </div>
                  ${total < 2 ? '<p class="carousel__note">Por enquanto há uma única cena conceitual nesta vitrine. As setas ficam desativadas até que novos projetos sejam adicionados.</p>' : ''}
                </div>`
        : `
                <p class="proj-empty">${e(t.empty)}</p>`;
      return `
              <div class="tabpanel" role="tabpanel" id="painel-${t.id}" aria-labelledby="tab-${t.id}" data-has-projects="${total > 0}"${i === 0 ? '' : ' hidden'}>${body}
              </div>`;
    })
    .join('');

  const first = ctx.projectTypes[0].id;
  return `
          <div class="deck deck--proj" id="deck-projetos" data-deck="projetos" data-kicker="Projetos" data-title="Vitrine conceitual" tabindex="-1">
            <div class="tabs" role="tablist" aria-label="Tipo de projeto" data-reveal>
              <span class="tabs__pill" aria-hidden="true"></span>${tabs}
            </div>
            <div class="tabpanels" data-reveal>${panels}
            </div>
            <div class="deck__cta" data-reveal>
              ${button({ label: 'Quero um projeto assim', variant: 'light', cls: 'btn--block', attrs: `${waAttrs(ctx, 'projeto', first)} data-proj-cta` })}
              <p class="deck__hint">Imagens ilustrativas.</p>
            </div>
            <p class="deck__fine">${e(ctx.arts.projetos.note)}</p>
          </div>`;
}

function deckDuvidas(ctx) {
  const items = ctx.faq
    .map(
      (f, i) => `
                <div class="faq-item${i === 0 ? ' is-open' : ''}" data-search="${e(normalizeSearch(`${f.q} ${f.a}`))}" style="--i:${i}">
                  <h3 class="faq-q"><button type="button" id="faq-b-${i + 1}" aria-expanded="${i === 0}" aria-controls="faq-a-${i + 1}"><span>${e(f.q)}</span><span class="faq-icon" aria-hidden="true"></span></button></h3>
                  <div class="faq-a" id="faq-a-${i + 1}" role="region" aria-labelledby="faq-b-${i + 1}"><div class="faq-a__inner"><p>${e(f.a)}</p></div></div>
                </div>`,
    )
    .join('');
  return `
          <div class="deck deck--faq" id="deck-duvidas" data-deck="duvidas" data-kicker="Dúvidas frequentes" data-title="O que você quer saber?" tabindex="-1">
            <div class="faq-box" data-reveal>
              <div class="faq-search" role="search">
                <label class="sr-only" for="faq-busca">Buscar nas dúvidas frequentes</label>
                ${icons.search()}
                <input id="faq-busca" type="search" placeholder="O que você quer saber?" autocomplete="off" spellcheck="false" aria-describedby="faq-status" enterkeyhint="search">
                <kbd class="faq-search__kbd" aria-hidden="true" title="Atalho: tecla /">/</kbd>
                <button class="faq-search__clear" type="button" hidden>Limpar<span class="sr-only"> a busca</span></button>
              </div>
              <p class="faq-status" id="faq-status" role="status" aria-live="polite"></p>
              <div class="faq-list" data-stagger>${items}
              </div>
              <div class="faq-empty" hidden>
                <p>Nenhuma pergunta encontrada para “<span data-q></span>”.</p>
                <button class="faq-empty__clear" type="button">Limpar busca</button>
              </div>
            </div>
            <div class="deck__cta deck__cta--split" data-reveal>
              <p class="deck__hint">Ainda ficou alguma dúvida?</p>
              ${button({ label: 'Falar com um especialista', variant: 'blue', lead: 'whatsapp', attrs: waAttrs(ctx, 'duvidas') })}
            </div>
          </div>`;
}

function deckContato(ctx) {
  const s = ctx.sections.contato;
  return `
          <div class="deck deck--contato" id="deck-contato" data-deck="contato" tabindex="-1">
            <p class="owner" data-reveal><span class="owner__name">${e(ctx.config.owner.name)}</span><span class="owner__role">${e(ctx.config.owner.role)}</span></p>
            <div class="deck__cta" data-reveal>
              ${button({ label: s.cta, variant: 'blue', cls: 'btn--block', lead: 'whatsapp', attrs: waAttrs(ctx, 'geral') })}
              <p class="deck__hint">${e(s.complement)}</p>
            </div>
          </div>`;
}

const decks = {
  solucoes: deckSolucoes,
  'como-funciona': deckComoFunciona,
  projetos: deckProjetos,
  duvidas: deckDuvidas,
  contato: deckContato,
};

/** Seção em modo B: arte inteira + painel nativo (inline no celular, gaveta no desktop). */
export function scene(ctx, id) {
  return `
  <section class="scene scene--${id}" id="${id}" aria-labelledby="${id}-title" tabindex="-1">
    <div class="scene__grid">
      ${stage(ctx, id)}
      <div class="scene__native">
        ${sectionHead(id, ctx.sections[id])}
        <div class="deck-slot">${decks[id](ctx)}
        </div>
      </div>
    </div>
  </section>`;
}

/** Hero com a arte aprovada (casa com painéis). */
export function heroArt(ctx) {
  return `
  <section class="scene scene--hero hero--art" id="inicio" aria-labelledby="inicio-title" tabindex="-1">
    <h1 class="sr-only" id="inicio-title">${e(ctx.hero.titleClaim)}</h1>
    <p class="sr-only">${ctx.hero.support.map(e).join(' ')} ${e(ctx.hero.note)}</p>
    ${stage(ctx, 'inicio', { hero: true })}
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Diálogos, menu e rodapé                                             */
/* ------------------------------------------------------------------ */

export function dialogs(ctx) {
  const choice = (name, value, main, hint = '') => `
                <label class="choice">
                  <input type="radio" name="${name}" value="${e(value)}">
                  <span class="choice__text"><span class="choice__main">${e(main)}</span>${hint ? `<span class="choice__hint">${e(hint)}</span>` : ''}</span>
                  <span class="choice__mark" aria-hidden="true">${icons.check()}</span>
                </label>`;

  const menuLinks = ctx.nav
    .map(
      (n, i) =>
        `<li style="--i:${i}"><a href="#${n.id}" data-nav="${n.id}"><span class="menu__num">${String(i + 1).padStart(2, '0')}</span>${e(n.label)}</a></li>`,
    )
    .join('');

  return `
  <dialog class="drawer" id="deck-dialog" aria-labelledby="deck-dialog-title">
    <div class="drawer__panel">
      <div class="drawer__head">
        <div><p class="kicker" data-deck-kicker></p><h2 class="drawer__title" id="deck-dialog-title" data-deck-title tabindex="-1">Detalhes da seção</h2></div>
        <button class="icon-btn drawer__close" type="button" data-close>${icons.close()}<span class="sr-only">Fechar painel</span></button>
      </div>
      <div class="drawer__body" data-deck-body></div>
    </div>
  </dialog>

  <dialog class="drawer drawer--flow" id="analise-dialog" aria-labelledby="analise-title">
    <div class="drawer__panel">
      <div class="drawer__head">
        <div><p class="kicker">Pré-análise</p><h2 class="drawer__title" id="analise-title" tabindex="-1">Descobrir minha economia</h2></div>
        <button class="icon-btn drawer__close" type="button" data-close>${icons.close()}<span class="sr-only">Fechar pré-análise</span></button>
      </div>
      <div class="drawer__body">
        <p class="flow__intro">Duas perguntas rápidas para preparar o seu pedido de análise. Não é um cálculo de economia: o resultado depende do projeto e do consumo.</p>
        <div class="progress" aria-hidden="true"><span class="progress__bar"></span></div>
        <p class="progress__text">Etapa <span data-step-num>1</span> de 3</p>
        <form class="flow" novalidate>
          <template data-icon="whatsapp">${icons.whatsapp()}</template>
          <fieldset class="flow__step is-active" data-step="1">
            <legend class="flow__q">Qual é o perfil do imóvel?</legend>
            <div class="choices">${ctx.analysis.perfis.map((p) => choice('perfil', p.id, p.id, p.hint)).join('')}
            </div>
          </fieldset>
          <fieldset class="flow__step" data-step="2" hidden>
            <legend class="flow__q">Qual é a média da sua conta de luz?</legend>
            <div class="choices">${ctx.analysis.faixas.map((f) => choice('faixa', f, f)).join('')}
            </div>
          </fieldset>
          <div class="flow__step" data-step="3" hidden>
            <h3 class="flow__q" tabindex="-1">Revise o seu pedido</h3>
            <dl class="summary">
              <div><dt>Perfil do imóvel</dt><dd data-sum="perfil"></dd></div>
              <div><dt>Faixa da conta de luz</dt><dd data-sum="faixa"></dd></div>
            </dl>
            <div class="msg">
              <p class="msg__label">Mensagem para o atendimento</p>
              <p class="msg__text" data-msg="analise"></p>
            </div>
            <p class="flow__fine">A conversa abre no WhatsApp com essa mensagem. O site não envia nem guarda seus dados.</p>
          </div>
          <p class="flow__error" role="alert" hidden>Escolha uma opção para continuar.</p>
          <div class="flow__nav">
            <button class="btn btn--ghost" type="button" data-back hidden><span class="btn__label">Voltar</span></button>
            <button class="btn btn--light" type="submit" data-next><span class="btn__label">Continuar</span><span class="btn__icon">${icons.arrow()}</span></button>
          </div>
        </form>
      </div>
    </div>
  </dialog>

  <dialog class="modal" id="wa-dialog" aria-labelledby="wa-title" aria-describedby="wa-desc">
    <div class="modal__panel">
      <span class="modal__icon" aria-hidden="true">${icons.whatsapp()}</span>
      <h2 class="modal__title" id="wa-title">WhatsApp em configuração</h2>
      <p class="modal__text" id="wa-desc">O número oficial de atendimento ainda não foi cadastrado neste site, por isso nenhuma conversa foi aberta.</p>
      <div class="msg">
        <p class="msg__label">Mensagem preparada</p>
        <p class="msg__text" data-wa-msg></p>
      </div>
      <p class="modal__dev" data-dev-only hidden>Pendência de publicação: defina <code>whatsappNumber</code> em <code>src/site.config.mjs</code> e rode <code>node build.mjs</code>.</p>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" data-copy><span class="btn__label">Copiar mensagem</span></button>
        <button class="btn btn--light" type="button" data-close><span class="btn__label">Entendi</span></button>
      </div>
    </div>
  </dialog>

  <dialog class="menu" id="menu-dialog" aria-label="Menu principal">
    <div class="menu__panel">
      <div class="menu__top">
        ${brand(ctx.config)}
        <button class="icon-btn" type="button" data-close>${icons.close()}<span class="sr-only">Fechar menu</span></button>
      </div>
      <nav aria-label="Menu principal"><ol class="menu__list">${menuLinks}</ol></nav>
      <div class="menu__foot">
        ${button({ label: 'Solicitar proposta', variant: 'light', cls: 'btn--block', attrs: analiseAttrs })}
        ${button({ label: 'Conversar pelo WhatsApp', variant: 'outline', cls: 'btn--block', icon: '', lead: 'whatsapp', attrs: waAttrs(ctx, 'geral') })}
      </div>
    </div>
  </dialog>

  <div class="toast" role="status" aria-live="polite"></div>`;
}

export function footer(ctx) {
  const links = ctx.nav.map((n) => `<li><a href="#${n.id}">${e(n.label)}</a></li>`).join('');
  return `
  <footer class="site-footer">
    <div class="site-footer__inner">
      ${brand(ctx.config, { cls: 'brand--footer' })}
      <nav aria-label="Rodapé"><ul class="site-footer__links">${links}</ul></nav>
      <p class="site-footer__fine">Imagens ilustrativas e projetos conceituais. A economia varia conforme o projeto e o consumo.</p>
    </div>
  </footer>`;
}
