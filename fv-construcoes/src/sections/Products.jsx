import { categories, whatsappLink } from '../data/site.js';
import Eyebrow from '../components/Eyebrow.jsx';
import Button from '../components/Button.jsx';
import Picture from '../components/Picture.jsx';
import { ArrowUpRight } from '../components/Icon.jsx';
import '../styles/products.css';

const tileSizes = [
  '(min-width: 1024px) 700px, (min-width: 640px) 100vw, 100vw',
  '(min-width: 1024px) 500px, (min-width: 640px) 50vw, 100vw',
  '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
];

function ProductTile({ category, sizes, delay }) {
  return (
    <article className="tile" data-reveal style={{ '--d': delay }}>
      <div className="tile__media">
        <Picture image={category.image} alt={category.alt} sizes={sizes} />
        {category.tag && <span className="tile__tag">{category.tag}</span>}
      </div>
      <div className="tile__body">
        <span className="tile__index" aria-hidden>
          {category.index}
        </span>
        <h3 className="tile__title">{category.title}</h3>
        <p className="tile__text">{category.text}</p>
        <a className="tile__link" href={category.href} target="_blank" rel="noopener noreferrer">
          Consultar disponibilidade
          <span className="sr-only"> de {category.title.toLowerCase()} pelo WhatsApp (abre em nova aba)</span>
          <ArrowUpRight width={18} height={18} />
        </a>
      </div>
    </article>
  );
}

export default function Products() {
  return (
    <section id="produtos" className="products section" aria-labelledby="products-title">
      <div className="container">
        <header className="products__head">
          <div>
            <Eyebrow data-reveal>Nosso catálogo</Eyebrow>
            <h2 id="products-title" className="title" data-reveal style={{ '--d': '.08s' }}>
              Tudo o que sua operação <em>precisa.</em>
            </h2>
          </div>
          <p className="products__intro" data-reveal style={{ '--d': '.16s' }}>
            Equipamentos e ferramentas para construção, manutenção, campo e indústria. Fale com a equipe para
            consultar marcas, modelos e disponibilidade de cada linha.
          </p>
        </header>

        <div className="products__grid">
          {categories.map((c, i) => (
            <ProductTile key={c.id} category={c} sizes={tileSizes[i]} delay={`${(i % 3) * 0.08}s`} />
          ))}
        </div>

        <div className="products__cta" data-reveal>
          <p>
            Precisa de um <em>equipamento específico?</em>
          </p>
          <Button
            href={whatsappLink('Olá! Estou procurando um equipamento específico. Vocês podem me ajudar?')}
            external
            icon="whatsapp"
          >
            Fale com nossa equipe
          </Button>
        </div>
      </div>
    </section>
  );
}
