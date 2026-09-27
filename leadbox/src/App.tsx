import LeadBoxHero from "@/components/leadbox-hero"

export default function App() {
  // Página isolada, sem rotas: os botões apontam para âncoras.
  return <LeadBoxHero loginHref="#entrar" signupHref="#criar-conta" />
}
