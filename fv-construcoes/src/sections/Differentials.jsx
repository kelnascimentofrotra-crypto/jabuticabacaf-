import { useEffect, useRef, useState } from 'react';
import { company, differentials, images } from '../data/site.js';
import Eyebrow from '../components/Eyebrow.jsx';
import Picture from '../components/Picture.jsx';
import { prefersReducedMotion } from '../hooks/useScrollEffects.js';
import '../styles/differentials.css';

const YEARS = 12;

/** Numeral "12+" com contagem curta ao entrar na tela (valor final já vem no HTML). */
function Years() {
  const ref = useRef(null);
  const [value, setValue] = useState(YEARS);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined;
    setValue(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1100);
          setValue(Math.round(YEARS * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="years" ref={ref} data-reveal style={{ '--d': '.2s' }}>
      <p className="years__figure" aria-label={`Mais de ${YEARS} anos de mercado`}>
        <span className="years__num" aria-hidden>
          {String(value).padStart(2, '0')}
        </span>
        <span className="years__plus" aria-hidden>
          +
        </span>
      </p>
      <p className="years__label">
        anos de mercado
        <br />
        em {company.city} e região
      </p>
    </div>
  );
}

export default function Differentials() {
  return (
    <section id="diferenciais" data-nav="empresa" className="diff section" aria-labelledby="diff-title">
      <div className="container diff__grid">
        <div className="diff__intro">
          <Eyebrow data-reveal>Por que a FV</Eyebrow>
          <h2 id="diff-title" className="title" data-reveal style={{ '--d': '.08s' }}>
            Por que escolher a <em>FV Construções e Serviços?</em>
          </h2>
          <p className="diff__lead" data-reveal style={{ '--d': '.14s' }}>
            Mais de 12 anos construindo relações de confiança com clientes em Chapadinha e região.
          </p>
          <Years />
        </div>

        <ol className="diff__list">
          {differentials.map((d, i) => (
            <li key={d.kicker} className="diff__item" data-reveal style={{ '--d': `${(i % 2) * 0.1}s` }}>
              <p className="diff__kicker">{d.kicker}</p>
              <h3 className="diff__title">{d.title}</h3>
              <p className="diff__text">{d.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <figure className="container diff__panorama">
        <div className="diff__frame frame" data-reveal="mask" data-parallax="0.1">
          <Picture
            image={images.panorama}
            alt="Letreiro e entrada da loja FV Construções e Serviços com as linhas ferramentas, máquinas, hidráulicos e elétrica"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        </div>
        <figcaption className="diff__caption">
          <strong>Loja FV</strong>
          <span>
            {company.address.street} · {company.city} – {company.state}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
