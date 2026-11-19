import { links, services } from '../data/site.js';
import Eyebrow from '../components/Eyebrow.jsx';
import Button from '../components/Button.jsx';
import { ArrowRight } from '../components/Icon.jsx';
import '../styles/services.css';

export default function Services() {
  return (
    <section id="servicos" className="services section" aria-labelledby="services-title">
      <div className="container services__grid">
        <div className="services__head">
          <Eyebrow data-reveal>Serviços e atendimento</Eyebrow>
          <h2 id="services-title" className="title" data-reveal style={{ '--d': '.08s' }}>
            Muito mais que uma loja. <em>Uma parceira para o seu projeto.</em>
          </h2>
          <p className="services__lead" data-reveal style={{ '--d': '.14s' }}>
            Atendimento próximo para profissionais, empresas e obras: na loja, por telefone ou pelo WhatsApp.
          </p>
        </div>

        <ol className="services__list">
          {services.map((s, i) => (
            <li key={s.title} className="service" data-reveal style={{ '--d': `${i * 0.05}s` }}>
              <span className="service__num" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="service__body">
                <h3 className="service__title">{s.title}</h3>
                <p className="service__text">{s.text}</p>
                <a
                  className="service__action"
                  href={s.action.href}
                  {...(s.action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {s.action.label}
                  {s.action.external && <span className="sr-only"> (abre em nova aba)</span>}
                  <ArrowRight width={16} height={16} />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="container">
        <div className="cta-band" data-reveal>
          <div className="cta-band__copy">
            <p className="cta-band__title">
              Conte com a <em>FV Construções e Serviços</em>
            </p>
            <p className="cta-band__text">para construir, reformar e tocar grandes projetos.</p>
          </div>
          <Button href={links.whatsapp} external icon="whatsapp" variant="light">
            Fale conosco pelo WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
