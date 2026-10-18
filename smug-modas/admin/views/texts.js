import { ico, field, textarea, toast, formValues, bindCounters, lines } from '../ui.js';

// Textos de todas as seções do site, agrupados como aparecem na página.
const group = (title, body, open = false) => `
  <details class="card group"${open ? ' open' : ''}>
    <summary><h3>${title}</h3>${ico('down')}</summary>
    <div class="fields">${body}</div>
  </details>`;

const benefitFields = (prefix, items) =>
  items
    .map(
      (b, i) => `
      ${field({ label: `Item ${i + 1} — título`, name: `${prefix}Title-${i}`, value: b.title })}
      ${field({ label: `Item ${i + 1} — texto`, name: `${prefix}Text-${i}`, value: b.text })}`
    )
    .join('');

export async function textsView(app, root) {
  const { hero, marquee, products, store, about, contactSection, footer } = app.content;

  root.innerHTML = `
  <section class="page-head">
    <div><p class="eyebrow">Site</p><h2 class="page-title">Textos do site</h2>
    <p class="muted">Tudo o que está escrito nas seções. Fotos de produtos e categorias ficam nas telas próprias.</p></div>
  </section>
  <form class="stack" novalidate data-form>
    ${group(
      'Abertura (hero)',
      `${textarea({ label: 'Frase ao lado do SMUG', name: 'tagline', value: hero.tagline.join('\n'), rows: 3, hint: 'Uma linha por quebra (até 3 linhas).' })}
       ${field({ label: 'Descrição da foto da Fabielly', name: 'heroAlt', value: hero.photo.alt, wide: true })}`,
      true
    )}
    ${group('Faixa em movimento', textarea({ label: 'Frases', name: 'marquee', value: marquee.join('\n'), rows: 4, hint: 'Uma frase por linha.' }))}
    ${group(
      'Vitrine de produtos',
      `${field({ label: 'Sobretítulo', name: 'pEyebrow', value: products.eyebrow, hint: 'Também vira o item do menu.' })}
       ${field({ label: 'Título', name: 'pPlain', value: products.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'pItalic', value: products.title.italic })}
       ${textarea({ label: 'Texto', name: 'pText', value: products.text, rows: 2, counter: 200 })}
       ${textarea({ label: 'Mensagem do WhatsApp (peça disponível)', name: 'pMsg', value: products.whatsappMessage, rows: 2, hint: '{produto} vira o nome da peça.' })}
       ${textarea({ label: 'Mensagem do WhatsApp (peça esgotada)', name: 'pSoldMsg', value: products.soldOutMessage, rows: 2, hint: '{produto} vira o nome da peça.' })}`
    )}
    ${group(
      'Nossa loja',
      `${field({ label: 'Sobretítulo', name: 'sEyebrow', value: store.eyebrow })}
       ${field({ label: 'Texto do botão', name: 'sCta', value: store.cta })}
       ${field({ label: 'Título', name: 'sPlain', value: store.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'sItalic', value: store.title.italic })}
       ${textarea({ label: 'Parágrafos', name: 'sParagraphs', value: store.paragraphs.join('\n\n'), rows: 6, hint: 'Separe os parágrafos com uma linha em branco.' })}
       ${benefitFields('sb', store.benefits)}`
    )}
    ${group(
      'Sobre a Fabielly',
      `${field({ label: 'Sobretítulo', name: 'aEyebrow', value: about.eyebrow })}
       ${field({ label: 'Título', name: 'aTitle', value: about.title })}
       ${textarea({ label: 'Citação', name: 'aQuote', value: about.quote.join('\n'), rows: 2, hint: 'Uma linha por quebra.' })}
       ${textarea({ label: 'Parágrafos', name: 'aParagraphs', value: about.paragraphs.join('\n\n'), rows: 7, hint: 'Separe os parágrafos com uma linha em branco.' })}
       ${field({ label: 'Assinatura', name: 'aSignature', value: about.signature })}
       ${field({ label: 'Cargo', name: 'aRole', value: about.role })}
       ${benefitFields('av', about.values)}`
    )}
    ${group(
      'Contato',
      `${field({ label: 'Sobretítulo', name: 'cEyebrow', value: contactSection.eyebrow })}
       ${field({ label: 'Título', name: 'cPlain', value: contactSection.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'cItalic', value: contactSection.title.italic })}
       ${textarea({ label: 'Texto', name: 'cText', value: contactSection.text, rows: 3 })}
       ${field({ label: 'Título do formulário', name: 'cFormTitle', value: contactSection.formTitle })}
       ${field({ label: 'Texto do formulário', name: 'cFormText', value: contactSection.formText, wide: true })}`
    )}
    ${group('Rodapé', field({ label: 'Frase cursiva', name: 'fTagline', value: footer.tagline, wide: true }))}
    <div class="form-bar">
      <span class="form-bar__spacer"></span>
      <button class="btn btn--primary" type="submit">${ico('check')}Salvar textos</button>
    </div>
  </form>`;

  const form = root.querySelector('[data-form]');
  bindCounters(form);
  form.addEventListener('input', () => {
    app.formDirty = true;
  });
  const paragraphs = (text) =>
    String(text)
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const v = formValues(form);
    const tagline = lines(v.tagline);
    if (!tagline.length || tagline.length > 3) {
      toast('A frase da abertura precisa ter de 1 a 3 linhas.', 'error');
      return;
    }
    app.update((c) => {
      c.hero.tagline = tagline;
      c.hero.photo.alt = v.heroAlt;
      c.marquee = lines(v.marquee);
      Object.assign(c.products, {
        eyebrow: v.pEyebrow,
        title: { plain: v.pPlain, italic: v.pItalic },
        text: v.pText,
        whatsappMessage: v.pMsg,
        soldOutMessage: v.pSoldMsg,
      });
      Object.assign(c.store, {
        eyebrow: v.sEyebrow,
        cta: v.sCta,
        title: { plain: v.sPlain, italic: v.sItalic },
        paragraphs: paragraphs(v.sParagraphs),
        benefits: c.store.benefits.map((b, i) => ({ ...b, title: v[`sbTitle-${i}`], text: v[`sbText-${i}`] })),
      });
      Object.assign(c.about, {
        eyebrow: v.aEyebrow,
        title: v.aTitle,
        quote: lines(v.aQuote),
        paragraphs: paragraphs(v.aParagraphs),
        signature: v.aSignature,
        role: v.aRole,
        values: c.about.values.map((b, i) => ({ ...b, title: v[`avTitle-${i}`], text: v[`avText-${i}`] })),
      });
      Object.assign(c.contactSection, {
        eyebrow: v.cEyebrow,
        title: { plain: v.cPlain, italic: v.cItalic },
        text: v.cText,
        formTitle: v.cFormTitle,
        formText: v.cFormText,
      });
      c.footer.tagline = v.fTagline;
    });
    app.formDirty = false;
    toast('Textos salvos. Publique para aplicar no site.', 'success');
  });
}
