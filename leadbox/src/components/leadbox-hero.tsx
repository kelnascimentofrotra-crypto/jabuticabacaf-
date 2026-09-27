import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Velaris from "@/components/ui/velaris";

// O Velaris reinicia o WebGL sempre que `colors` muda de referência,
// por isso a paleta fica fora do componente.
const GRADIENT_BG = "#0e100f";
const GRADIENT_COLORS = ["#1f0a04", "#f2602a", "#3a1206", "#0e100f"];

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
}

export default function LeadBoxHero({
  loginHref = "/entrar",
  signupHref = "/criar-conta",
}: LeadBoxHeroProps) {
  // speed 0 congela o tempo do shader: o gradiente continua lá, só que parado.
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Velaris
      bg={GRADIENT_BG}
      colors={GRADIENT_COLORS}
      speed={reducedMotion ? 0 : 1.5}
      grain={0.35}
      height="auto"
      className="bg-background"
    >
      <div className="relative flex min-h-svh flex-col">
        {/* Escurece atrás do texto: o brilho anda pela tela e às vezes passa por trás das letras. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-background/40 lg:bg-transparent lg:bg-gradient-to-r lg:from-background/80 lg:via-background/45 lg:to-transparent"
        />
        {/* Esfumaça a base do hero na cor da página, sem emenda com a seção seguinte. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
        />

        <header className="relative border-b border-white/10">
          <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8">
            <a
              href="/"
              className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary text-base font-bold text-primary-foreground sm:size-10 sm:rounded-xl sm:text-lg">
                L
              </span>
              <span className="text-lg font-semibold tracking-tight sm:text-xl">
                LeadBox
              </span>
            </a>

            <nav aria-label="Conta" className="flex items-center gap-1.5 sm:gap-3">
              <Button
                asChild
                variant="ghost"
                className="hidden px-3 text-foreground/80 hover:text-foreground min-[360px]:inline-flex sm:h-10 sm:px-4 sm:text-base"
              >
                <a href={loginHref}>Entrar</a>
              </Button>
              <Button asChild className="rounded-lg sm:h-10 sm:px-5 sm:text-base">
                <a href={signupHref}>Criar conta</a>
              </Button>
            </nav>
          </div>
        </header>

        <section
          aria-labelledby="hero-title"
          className="relative flex flex-1 items-center"
        >
          <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-sm font-medium text-foreground/90 backdrop-blur-md">
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

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85 sm:mt-8 sm:text-xl">
              O LeadBox reúne busca de empresas, qualificação de leads e
              organização do funil comercial em uma única plataforma feita para
              o mercado brasileiro.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-xl px-6 text-base shadow-lg shadow-primary/25 has-[>svg]:px-6"
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
                className="h-12 rounded-xl border border-white/15 bg-white/[0.06] px-6 text-base backdrop-blur-md hover:bg-white/10 hover:text-foreground dark:hover:bg-white/10"
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
