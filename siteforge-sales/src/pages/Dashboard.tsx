import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarClock, FileText, GraduationCap, Search, Send, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../data/store';
import { CATEGORIES, CATEGORY_ORDER, NICHE_CATEGORIES, NICHE_CATEGORY_ORDER } from '../content/taxonomy';
import { EDITORIAL_TOP, SEARCH_EXAMPLES } from '../content/quick';
import { search, matchLabel } from '../lib/search';
import { CATEGORY_ICON, NICHE_ICON } from '../components/icons';
import { ObjectionCard } from '../components/objection';
import { Badge, Button, Card, Chip, CopyButton, FavoriteButton, MessageText, SectionTitle, cn, TONES } from '../components/ui';

const TOOLS = [
  { to: '/gerador', label: 'Gerador de respostas', desc: 'Cole a mensagem do cliente e receba três respostas.', icon: Sparkles },
  { to: '/prospeccao', label: 'Central de Prospecção', desc: 'Mensagem certa para cada etapa da conversa.', icon: Send },
  { to: '/follow-up', label: 'Follow-up', desc: 'Sequências respeitosas para retomar contatos.', icon: CalendarClock },
  { to: '/propostas', label: 'Montador de propostas', desc: 'Essencial, Profissional e Completa.', icon: FileText },
  { to: '/simulador', label: 'Simulador de clientes', desc: 'Treine respostas e receba avaliação.', icon: GraduationCap },
];

export function Dashboard() {
  const { index, content, backend, addHistory, logEvent } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [popular, setPopular] = useState<{ itemId: string; total: number }[] | null>(null);

  useEffect(() => {
    let active = true;
    backend
      ?.popular('objection', 30, 8)
      .then((r) => active && setPopular(r))
      .catch(() => active && setPopular([]));
    return () => {
      active = false;
    };
  }, [backend]);

  const hits = useMemo(() => (q.trim().length >= 2 ? search(index, q, 5) : []), [index, q]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of content.objections) c[o.categoria] = (c[o.categoria] ?? 0) + 1;
    c.sistemas = content.objections.filter((o) => o.biblioteca === 'sistema' || o.categoria === 'sistemas').length;
    return c;
  }, [content.objections]);

  const realTop = (popular ?? []).filter((p) => p.total >= 2).map((p) => content.objections.find((o) => o.id === p.itemId)).filter(Boolean);
  const usingRealRanking = realTop.length >= 4;
  const topList = usingRealRanking
    ? realTop.slice(0, 6)
    : EDITORIAL_TOP.map((id) => content.objections.find((o) => o.id === id)).filter(Boolean).slice(0, 6);

  const submit = () => {
    const v = q.trim();
    if (!v) return;
    addHistory({ tipo: 'busca', label: v, href: `/busca?q=${encodeURIComponent(v)}` });
    logEvent({ event: 'search' });
    navigate(`/busca?q=${encodeURIComponent(v)}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-10 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl" />
        <div className="relative">
          <p className="eyebrow mb-3 text-accent/80">Central de objeções para quem vende sites e sistemas</p>
          <h1 className="max-w-3xl text-[28px] font-semibold leading-tight text-fg sm:text-4xl">O que seu cliente disse para não comprar?</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-muted">
            Encontre a resposta certa para avançar na negociação, demonstrar valor e vender sua próxima solução digital.
          </p>

          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="card flex flex-col gap-2 p-2 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_20px_60px_-30px_rgba(16,185,129,0.25)] sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 px-2">
                <Search size={18} className="shrink-0 text-dim" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Digite a objeção do cliente ou cole a mensagem que ele enviou..."
                  aria-label="Objeção ou mensagem do cliente"
                  className="h-11 w-full bg-transparent text-[15px] text-fg placeholder:text-dim focus:outline-none"
                  data-testid="hero-search"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="secondary" className="flex-1 sm:flex-none" disabled={!q.trim()}>
                  Buscar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 sm:flex-none"
                  icon={<Sparkles size={15} />}
                  disabled={!q.trim()}
                  onClick={() => navigate(`/gerador?msg=${encodeURIComponent(q.trim())}`)}
                >
                  Gerar resposta
                </Button>
              </div>
            </div>
          </form>

          {hits.length > 0 ? (
            <div className="mt-3 space-y-2" data-testid="hero-results">
              {hits.map((h) =>
                h.doc.objection ? (
                  <ObjectionCard key={h.doc.key} o={h.doc.objection} extra={<Badge tone="neutral">Correspondência {matchLabel(h.score)}</Badge>} />
                ) : (
                  <Link key={h.doc.key} to={`/nichos/${h.doc.niche!.id}#${h.doc.nicheObjection!.id}`} className="card card-hover block p-4">
                    <div className="mb-1 flex gap-1.5">
                      <Badge tone="info">{h.doc.niche!.nome}</Badge>
                      <Badge>Correspondência {matchLabel(h.score)}</Badge>
                    </div>
                    <p className="font-medium">“{h.doc.nicheObjection!.frase}”</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{h.doc.nicheObjection!.resposta}</p>
                  </Link>
                ),
              )}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="py-1.5 text-xs text-dim">Exemplos:</span>
              {SEARCH_EXAMPLES.map((ex) => (
                <Chip key={ex} onClick={() => setQ(ex)}>
                  {ex}
                </Chip>
              ))}
            </div>
          )}

          <p className="mt-5 text-xs text-dim">
            Biblioteca atual: {content.objections.length} objeções detalhadas · {content.niches.length} nichos · {content.services.length} serviços ·{' '}
            {content.followups.length} sequências de follow-up · {content.scenarios.length} cenários de treino
          </p>
        </div>
      </section>

      {/* Atalhos por tipo */}
      <section aria-labelledby="atalhos">
        <SectionTitle id="atalhos" action={<Link to="/objecoes" className="text-xs text-muted hover:text-fg">Ver todas →</Link>}>
          Atalhos por tipo de objeção
        </SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_ORDER.map((cat) => {
            const Icon = CATEGORY_ICON[cat];
            const c = CATEGORIES[cat];
            return (
              <Link key={cat} to={cat === 'sistemas' ? '/objecoes?lib=sistema' : `/objecoes?cat=${cat}`} className="card card-hover flex items-center gap-3 p-3.5">
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset', TONES[c.tone])}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{c.atalho}</p>
                  <p className="truncate text-xs text-dim">{c.descricao}</p>
                </div>
                <span className="text-xs text-dim">{counts[cat] ?? 0}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        {/* Mais procuradas */}
        <section aria-labelledby="top">
          <SectionTitle id="top">Objeções mais procuradas</SectionTitle>
          <p className="-mt-2 mb-3 flex items-center gap-1.5 text-xs text-dim">
            <TrendingUp size={12} />
            {usingRealRanking
              ? 'Ranking real: fichas mais abertas nos últimos 30 dias.'
              : 'Seleção inicial das objeções mais frequentes na venda de sites. O ranking passa a refletir o uso real conforme as fichas forem consultadas.'}
          </p>
          <div className="space-y-2">
            {topList.map((o) => o && <ObjectionCard key={o.id} o={o} showPreview={false} />)}
          </div>
        </section>

        {/* Ferramentas */}
        <section aria-labelledby="tools">
          <SectionTitle id="tools">Ferramentas</SectionTitle>
          <div className="space-y-2">
            {TOOLS.map((t) => (
              <Link key={t.to} to={t.to} className="card card-hover flex items-center gap-3 p-3.5">
                <t.icon size={17} className="shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="truncate text-xs text-dim">{t.desc}</p>
                </div>
                <ArrowRight size={15} className="text-dim" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Nichos */}
      <section aria-labelledby="nichos">
        <SectionTitle id="nichos" action={<Link to="/nichos" className="text-xs text-muted hover:text-fg">Todos os {content.niches.length} nichos →</Link>}>
          Explore os nichos
        </SectionTitle>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {NICHE_CATEGORY_ORDER.map((cat) => {
            const Icon = NICHE_ICON[cat];
            const list = content.niches.filter((n) => n.categoria === cat);
            if (!list.length) return null;
            return (
              <Card key={cat} className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Icon size={16} className="text-accent" />
                  <p className="text-sm font-medium">{NICHE_CATEGORIES[cat].label}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {list.slice(0, 6).map((n) => (
                    <Link key={n.id} to={`/nichos/${n.id}`} className="rounded-md border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg">
                      {n.nome}
                    </Link>
                  ))}
                  {list.length > 6 && (
                    <Link to={`/nichos?cat=${cat}`} className="rounded-md px-2 py-1 text-xs text-dim hover:text-fg">
                      +{list.length - 6}
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Respostas rápidas */}
      <section aria-labelledby="rapidas">
        <SectionTitle id="rapidas">Respostas rápidas para copiar</SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-2">
          {content.quick.map((r) => (
            <Card key={r.id} className="flex flex-col p-4">
              <p className="mb-2 text-sm font-medium">{r.titulo}</p>
              <MessageText text={r.texto} className="flex-1 text-sm text-muted" />
              <div className="mt-3 flex gap-2">
                <CopyButton text={r.texto} itemKind="quick" itemId={r.id} />
                <FavoriteButton kind="quick" itemId={r.id} label={r.titulo} href="/" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
