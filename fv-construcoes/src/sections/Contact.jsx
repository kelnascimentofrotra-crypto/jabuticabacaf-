import { useEffect, useRef, useState } from 'react';
import { company, images, links } from '../data/site.js';
import Eyebrow from '../components/Eyebrow.jsx';
import Button from '../components/Button.jsx';
import Picture from '../components/Picture.jsx';
import Rating from '../components/Rating.jsx';
import { ArrowUpRight, MapPin } from '../components/Icon.jsx';
import '../styles/contact.css';

/** Mapa do Google carregado apenas quando a seção se aproxima da tela. */
function LazyMap() {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setLoad(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="contact__map" ref={ref}>
      {load ? (
        <iframe
          title={`Mapa: ${company.name} em ${company.city}`}
          src={links.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <span className="contact__map-placeholder">
          <MapPin width={22} height={22} /> Carregando mapa…
        </span>
      )}
    </div>
  );
}

export default function Contact() {
  const { address, phone } = company;
  return (
    <section id="contato" className="contact section" aria-labelledby="contact-title">
      <div className="container">
        <header className="contact__head">
          <div>
            <Eyebrow data-reveal>Contato e localização</Eyebrow>
            <h2 id="contact-title" className="title" data-reveal style={{ '--d': '.08s' }}>
              Visite a loja ou <em>fale com a equipe.</em>
            </h2>
          </div>
          <p className="contact__intro" data-reveal style={{ '--d': '.14s' }}>
            Estamos na Av. Ataliba Vieira de Almeida, em Chapadinha. Para consultar produtos e disponibilidade, chame a
            equipe pelo WhatsApp ou ligue.
          </p>
        </header>

        <div className="contact__panel" data-reveal>
          <figure className="contact__photo frame" data-parallax="0.05">
            <Picture
              image={images.facade}
              alt="Fachada real da loja FV Construções e Serviços em Chapadinha"
              sizes="(min-width: 960px) 600px, 100vw"
            />
            <figcaption>
              <span className="dot" aria-hidden />
              Fachada da loja
            </figcaption>
          </figure>

          <div className="contact__info">
            <dl className="contact__list">
              <div>
                <dt>Endereço</dt>
                <dd>
                  <address>
                    {address.street}
                    <br />
                    {address.city} – {address.state}, {address.zip}
                  </address>
                  <a className="text-link" href={links.directions} target="_blank" rel="noopener noreferrer">
                    Como chegar<span className="sr-only"> (abre o Google Maps em nova aba)</span>
                    <ArrowUpRight width={16} height={16} />
                  </a>
                </dd>
              </div>
              <div>
                <dt>Telefone e WhatsApp</dt>
                <dd>
                  <a className="contact__phone" href={links.phone}>
                    {phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Avaliação</dt>
                <dd>
                  <Rating variant="inline" />
                </dd>
              </div>
            </dl>

            <div className="contact__actions">
              <Button href={links.whatsapp} external icon="whatsapp" size="lg">
                Fale com nossa equipe
              </Button>
              <Button href={links.phone} variant="ghost" icon={null}>
                Ligar agora
              </Button>
            </div>

            <LazyMap />
          </div>
        </div>
      </div>
    </section>
  );
}
