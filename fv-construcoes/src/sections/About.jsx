import { company, images, links } from '../data/site.js';
import Eyebrow from '../components/Eyebrow.jsx';
import Button from '../components/Button.jsx';
import Picture from '../components/Picture.jsx';
import Rating from '../components/Rating.jsx';
import '../styles/about.css';

export default function About() {
  return (
    <section id="empresa" className="about section" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__copy">
          <Eyebrow data-reveal>Há mais de 12 anos no mercado</Eyebrow>
          <h2 id="about-title" className="title" data-reveal style={{ '--d': '.08s' }}>
            Experiência que acompanha o ritmo <em>de quem faz.</em>
          </h2>
          <div className="about__text" data-reveal style={{ '--d': '.16s' }}>
            <p className="lead">
              Há {company.years}, a {company.name} abastece quem constrói, mantém e produz em Chapadinha e região.
            </p>
            <p>
              Da ferramenta para o serviço do dia ao equipamento que sustenta uma obra inteira, reunimos em um só
              endereço ferramentas elétricas e manuais, bombas e motores, máquinas, itens hidráulicos e de elétrica.
            </p>
            <p>
              Nosso compromisso é atender de perto: entender a necessidade de cada cliente, seja profissional, empresa
              ou obra, e indicar a solução certa para o trabalho.
            </p>
          </div>
          <div className="about__actions" data-reveal style={{ '--d': '.24s' }}>
            <Button href="#produtos">Conheça nossos produtos</Button>
          </div>
        </div>

        <figure className="about__media">
          <div className="about__frame frame" data-reveal="mask" data-parallax="0.06">
            <Picture
              image={images.facade}
              alt="Fachada da loja FV Construções e Serviços na Av. Ataliba Vieira de Almeida, em Chapadinha, com produtos expostos na entrada"
              sizes="(min-width: 1280px) 720px, (min-width: 960px) 56vw, 100vw"
            />
          </div>
          <figcaption className="about__caption" data-reveal style={{ '--d': '.3s' }}>
            <span className="dot" aria-hidden />
            Nossa loja<span className="about__caption-street"> · Av. Ataliba Vieira de Almeida</span>, {company.city} –{' '}
            {company.state}
          </figcaption>
          <div className="about__rating" data-reveal style={{ '--d': '.4s' }}>
            <Rating href={links.googleReviews} />
          </div>
        </figure>
      </div>
    </section>
  );
}
