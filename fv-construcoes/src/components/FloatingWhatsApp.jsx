import { useEffect, useState } from 'react';
import { links } from '../data/site.js';
import { WhatsApp } from './Icon.jsx';

/** Atalho fixo para o WhatsApp: aparece depois da primeira dobra e some na seção de contato. */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById('contato');
    let contactInView = false;
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.85 && !contactInView);
    const io =
      contact && 'IntersectionObserver' in window
        ? new IntersectionObserver(([e]) => {
            contactInView = e.isIntersecting;
            update();
          })
        : null;
    if (io) io.observe(contact);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <a
      className="float-wa"
      data-visible={visible}
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp (abre em nova aba)"
      tabIndex={visible ? 0 : -1}
    >
      <WhatsApp width={22} height={22} />
      <span className="float-wa__label">WhatsApp</span>
    </a>
  );
}
