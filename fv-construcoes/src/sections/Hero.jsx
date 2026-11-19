import { company, images, links, storeLines } from '../data/site.js';
import Button from '../components/Button.jsx';
import Picture from '../components/Picture.jsx';
import Rating from '../components/Rating.jsx';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__media" data-parallax="0.22" data-parallax-free aria-hidden>
        <Picture
          image={images.hero}
          alt=""
          sizes="(min-width: 960px) 64vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="hero__picture"
        />
      </div>
      <div className="hero__glow" aria-hidden />

      <div className="container hero__inner">
        <p className="hero__eyebrow" data-anim style={{ '--d': '.15s' }}>
          {storeLines.join(' · ')}
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__line">
            <span data-anim="line" style={{ '--d': '.25s' }}>
              Força para mover
            </span>
          </span>
          <span className="hero__line hero__line--accent">
            <span data-anim="line" style={{ '--d': '.4s' }}>
              grandes operações.
            </span>
          </span>
        </h1>

        <p className="hero__lead" data-anim style={{ '--d': '.65s' }}>
          Ferramentas, equipamentos e fornecimento para profissionais, empresas e obras, com variedade e atendimento
          próximo.
        </p>

        <div className="hero__actions" data-anim style={{ '--d': '.8s' }}>
          <Button href="#produtos">Conheça nossos produtos</Button>
          <Button href={links.specialist} variant="ghost" icon="whatsapp" external>
            Fale com um especialista
          </Button>
        </div>
      </div>

      <div className="container hero__rail" data-anim style={{ '--d': '1.05s' }}>
        <ul>
          <li>
            <span className="hero__rail-label">Loja</span>
            Av. Ataliba Vieira de Almeida · {company.city} – {company.state}
          </li>
          <li>
            <span className="hero__rail-label">Avaliação</span>
            <Rating variant="inline" />
          </li>
          <li>
            <span className="hero__rail-label">Telefone</span>
            <a href={links.phone}>{company.phone.display}</a>
          </li>
        </ul>
        <a href="#empresa" className="hero__scroll" aria-label="Rolar para a próxima seção">
          <span aria-hidden />
        </a>
      </div>
    </section>
  );
}
