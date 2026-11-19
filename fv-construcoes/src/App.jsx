import Header from './components/Header.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import Marquee from './components/Marquee.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Products from './sections/Products.jsx';
import Differentials from './sections/Differentials.jsx';
import Services from './sections/Services.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import { storeLines } from './data/site.js';
import { useParallax, useReveal } from './hooks/useScrollEffects.js';

export default function App() {
  useReveal();
  useParallax();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Marquee items={storeLines} />
        <Products />
        <Differentials />
        <Services />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
