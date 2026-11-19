import { useEffect } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Entrada suave dos elementos marcados com [data-reveal] quando entram na tela.
 * O estado inicial (oculto) só existe com a classe .js no <html>, então o conteúdo
 * permanece visível sem JavaScript e para mecanismos de busca.
 */
export function useReveal() {
  useEffect(() => {
    window.__fvReady = true;
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      els.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/**
 * Movimento discreto de imagens no scroll. O contêiner [data-parallax="0.08"] recebe a
 * variável --parallax, aplicada via CSS na imagem interna (o contêiner não se move,
 * então a medição não entra em loop).
 */
export function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = parseFloat(el.dataset.parallax) || 0.08;
        let offset = (r.top + r.height / 2 - vh / 2) * -speed;
        // a imagem tem 7% de sobra (scale 1.14): o deslocamento nunca revela as bordas
        if (!('parallaxFree' in el.dataset)) {
          const max = r.height * 0.065;
          offset = Math.max(-max, Math.min(max, offset));
        }
        el.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

/** Seção atual para destacar o item do menu. Seções sem item usam data-nav. */
export function useActiveSection(ids, onChange) {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!('IntersectionObserver' in window) || !sections.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.dataset.nav || entry.target.id;
          if (ids.includes(id)) onChange(id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // ids é uma lista estática
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);
}

export { prefersReducedMotion };
