import './styles/main.css';
import './styles/shield.css';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from './config.js';

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopScene = window.matchMedia('(min-width: 1024px) and (min-aspect-ratio: 1/1)');
const desktopNav = window.matchMedia('(min-width: 1280px) and (min-aspect-ratio: 1/1)');

/* --------------------------------------------------------------------------
   Links de WhatsApp: cada [data-wa] recebe a mensagem da sua chave.
   Sem JS, o href original (#contato) continua funcionando.
   -------------------------------------------------------------------------- */

function whatsappUrl(key) {
  const text = encodeURIComponent(WHATSAPP_MESSAGES[key] ?? WHATSAPP_MESSAGES.geral);
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

document.querySelectorAll('[data-wa]').forEach((link) => {
  link.href = whatsappUrl(link.dataset.wa);
  link.target = '_blank';
  link.rel = 'noopener';
});


/* --------------------------------------------------------------------------
   Menu mobile
   -------------------------------------------------------------------------- */

const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  root.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

nav.querySelectorAll('.nav__menu a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    toggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (nav.classList.contains('is-open') && !nav.contains(event.target)) setMenu(false);
});

desktopNav.addEventListener('change', () => setMenu(false));

/* --------------------------------------------------------------------------
   Seção ativa: a que cruza o centro da viewport define o item do menu.
   -------------------------------------------------------------------------- */

const sections = [...document.querySelectorAll('[data-section]')];
const navLinks = new Map(
  [...document.querySelectorAll('[data-nav-link]')].map((link) => [link.dataset.navLink, link]),
);

function setActive(id) {
  if (root.dataset.active === id) return;
  root.dataset.active = id;
  navLinks.forEach((link, key) => {
    if (key === id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

setActive(sections[0].id);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
);

sections.forEach((section) => activeObserver.observe(section));

/* --------------------------------------------------------------------------
   Revelação das cenas ao entrar na viewport.
   -------------------------------------------------------------------------- */

const revealItems = document.querySelectorAll('[data-reveal]');

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
  root.classList.add('reveal-ready');
}

/* --------------------------------------------------------------------------
   Microparallax das fotografias (desktop, até ±16px, só cenas visíveis).
   -------------------------------------------------------------------------- */

const parallaxImages = [...document.querySelectorAll('[data-parallax]')];
const PARALLAX_RANGE = 16;
let frame = 0;

function updateParallax() {
  frame = 0;
  const enabled = desktopScene.matches && !reducedMotion.matches;
  const viewport = window.innerHeight;

  parallaxImages.forEach((img) => {
    if (!enabled) {
      img.style.transform = '';
      return;
    }
    const rect = img.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewport) return;
    // -1 quando a cena está entrando por baixo, +1 quando saindo por cima
    const progress = (viewport / 2 - (rect.top + rect.height / 2)) / (viewport / 2 + rect.height / 2);
    const offset = Math.max(-1, Math.min(1, progress)) * PARALLAX_RANGE;
    img.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
}

function requestParallax() {
  if (!frame) frame = requestAnimationFrame(updateParallax);
}

window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax);
desktopScene.addEventListener('change', requestParallax);
reducedMotion.addEventListener('change', requestParallax);
updateParallax();
