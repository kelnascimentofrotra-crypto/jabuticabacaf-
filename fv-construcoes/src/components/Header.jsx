import { useCallback, useEffect, useRef, useState } from 'react';
import { company, links, nav } from '../data/site.js';
import { useActiveSection, prefersReducedMotion } from '../hooks/useScrollEffects.js';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import { Close, Menu, Phone } from './Icon.jsx';
import '../styles/header.css';

const ids = nav.map((n) => n.id);

/** Rola até a seção respeitando o cabeçalho fixo e a preferência de movimento reduzido. */
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const lastY = useRef(0);
  const menuButton = useRef(null);
  const panel = useRef(null);

  useActiveSection(ids, useCallback((id) => setActive(id), []));

  // Estado compacto ao rolar; esconde ao descer e reaparece ao subir.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 24);
      if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 640);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Menu móvel: trava o scroll, fecha com Esc e devolve o foco ao botão.
  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add('menu-open');
    const first = panel.current?.querySelector('a');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.documentElement.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <header
      className="site-header"
      data-scrolled={scrolled || open}
      data-hidden={hidden && !open}
      onFocus={() => setHidden(false)}
    >
      <div className="container">
        <div className="nav-shell">
          <a href="#inicio" className="nav-shell__brand" onClick={go('inicio')} aria-label="FV Construções e Serviços — início">
            <Logo />
          </a>

          <nav className="nav-desktop" aria-label="Principal">
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className={active === item.id ? 'is-active' : undefined}
                    aria-current={active === item.id ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-shell__actions">
            <Button href={links.whatsapp} external icon={null} size="sm" className="nav-shell__cta">
              Fale com nossa equipe
            </Button>
            <button
              ref={menuButton}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="menu-movel"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close width={22} height={22} /> : <Menu width={22} height={22} />}
            </button>
          </div>
        </div>

        <div id="menu-movel" ref={panel} className="mobile-panel" data-open={open} hidden={!open}>
          <nav aria-label="Menu móvel">
            <ul>
              {nav.map((item, i) => (
                <li key={item.id} style={{ '--i': i }}>
                  <a href={`#${item.id}`} onClick={go(item.id)} className={active === item.id ? 'is-active' : undefined}>
                    <span className="mobile-panel__num">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-panel__footer">
            <a className="mobile-panel__phone" href={links.phone}>
              <Phone width={18} height={18} /> {company.phone.display}
            </a>
            <Button href={links.whatsapp} external icon="whatsapp" className="mobile-panel__cta">
              Fale com nossa equipe
            </Button>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="menu-backdrop"
        data-open={open}
        tabIndex={-1}
        aria-hidden
        onClick={() => setOpen(false)}
      />
    </header>
  );
}
