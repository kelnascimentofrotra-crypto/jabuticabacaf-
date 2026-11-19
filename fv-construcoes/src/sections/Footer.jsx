import { categories, company, links, nav } from '../data/site.js';
import Logo from '../components/Logo.jsx';
import { ArrowUp } from '../components/Icon.jsx';
import '../styles/footer.css';

export default function Footer() {
  const { address, phone } = company;
  return (
    <footer className="footer">
      <div className="footer__stripe" aria-hidden />
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo />
          <p>
            {company.name}. Ferramentas, máquinas e equipamentos para profissionais, empresas e obras em{' '}
            {company.city} – {company.state}, há {company.years}.
          </p>
        </div>

        <nav className="footer__col" aria-label="Rodapé">
          <h2 className="footer__heading">Navegação</h2>
          <ul>
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">Linhas de produtos</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <a href="#produtos">{c.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__heading">Contato</h2>
          <address>
            {address.street}
            <br />
            {address.city} – {address.state}
            <br />
            CEP {address.zip}
          </address>
          <ul>
            <li>
              <a href={links.phone}>{phone.display}</a>
            </li>
            <li>
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={links.directions} target="_blank" rel="noopener noreferrer">
                Como chegar<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {company.name}. Todos os direitos
          reservados.
        </p>
        <a href="#inicio" className="footer__top-link">
          Voltar ao topo <ArrowUp width={16} height={16} />
        </a>
      </div>
    </footer>
  );
}
