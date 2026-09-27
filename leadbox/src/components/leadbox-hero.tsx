import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Velaris from "@/components/ui/velaris";

// O Velaris reinicia o WebGL sempre que `colors` muda de referência,
// por isso a paleta fica fora do componente.
const GRADIENT_BG = "#0b0d0c";
const GRADIENT_COLORS = ["#3cc29c", "#ff5a1f", "#23a17f", "#050606"];

interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#blog" },
];

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

interface LeadBoxHeroProps {
  loginHref?: string;
  signupHref?: string;
  navLinks?: NavLink[];
}

export default function LeadBoxHero({
  loginHref = "/entrar",
  signupHref = "/criar-conta",
  navLinks = DEFAULT_NAV_LINKS,
}: LeadBoxHeroProps) {
  // speed 0 congela o tempo do shader: o gradiente continua lá, só que parado.
  const reducedMotion = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <Velaris
      bg={GRADIENT_BG}
      colors={GRADIENT_COLORS}
      speed={reducedMotion ? 0 : 2}
      grain={0.3}
      vignette={0}
      height="auto"
      className="bg-background"
    >
      <div id="inicio" className="relative flex min-h-svh flex-col">
        <header className="relative z-20 border-b border-white/15">
          <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:h-20 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <a
              href="/"
              className="flex items-center gap-2.5 justify-self-start rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary text-base font-bold text-primary-foreground sm:size-10 sm:rounded-xl sm:text-lg">
                L
              </span>
              <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                LeadBox
              </span>
            </a>

            <nav
              aria-label="Principal"
              className="hidden items-center gap-1 rounded-full border border-white/15 bg-black/25 p-1 backdrop-blur-md lg:flex"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/85 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-[3px] focus-visible:ring-white/40"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 justify-self-end sm:gap-3">
              <Button
                asChild
                variant="ghost"
                className="hidden text-white hover:bg-black/20 hover:text-white dark:hover:bg-black/20 sm:inline-flex sm:h-10 sm:px-4 sm:text-base"
              >
                <a href={loginHref}>Entrar</a>
              </Button>
              <Button asChild className="rounded-lg sm:h-10 sm:px-5 sm:text-base">
                <a href={signupHref}>Criar conta</a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-expanded={menuOpen}
                aria-controls="menu-principal"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setMenuOpen((open) => !open)}
                className="text-white hover:bg-black/20 hover:text-white dark:hover:bg-black/20 lg:hidden [&_svg:not([class*='size-'])]:size-5"
              >
                {menuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {menuOpen && (
            <nav
              id="menu-principal"
              aria-label="Principal"
              className="absolute inset-x-5 top-full mt-2 rounded-2xl border border-white/15 bg-background/85 p-2 shadow-2xl backdrop-blur-xl sm:inset-x-8 lg:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-white outline-none hover:bg-white/10 focus-visible:ring-[3px] focus-visible:ring-white/40"
                >
                  {link.label}
                </a>
              ))}
              <div aria-hidden className="mx-4 my-1 h-px bg-white/10 sm:hidden" />
              <a
                href={loginHref}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-white/85 outline-none hover:bg-white/10 focus-visible:ring-[3px] focus-visible:ring-white/40 sm:hidden"
              >
                Entrar
              </a>
            </nav>
          )}
        </header>

        <section
          aria-labelledby="hero-title"
          className="relative flex flex-1 items-center"
        >
          <div className="mx-auto w-full max-w-[1400px] px-5 py-16 text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] sm:px-8 sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-sm font-medium backdrop-blur-md [text-shadow:none]">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(255,107,53,0.7)]"
              />
              Prospecção comercial
            </p>

            <h1
              id="hero-title"
              className="mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl xl:text-[5rem]"
            >
              <span className="block">Encontre oportunidades.</span>
              <span className="block">Personalize a abordagem.</span>
              <span className="block">Venda mais.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/95 sm:mt-8 sm:text-xl">
              O LeadBox reúne busca de empresas, qualificação de leads e
              organização do funil comercial em uma única plataforma feita para
              o mercado brasileiro.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-xl px-6 text-base shadow-lg shadow-black/25 [text-shadow:none] has-[>svg]:px-6"
              >
                <a href={signupHref}>
                  Começar agora
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 rounded-xl bg-background px-6 text-base text-foreground shadow-lg shadow-black/25 [text-shadow:none] hover:bg-background/85 hover:text-foreground dark:hover:bg-background/85"
              >
                <a href={loginHref}>Já tenho conta</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Velaris>
  );
}
