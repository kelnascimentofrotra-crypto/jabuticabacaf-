import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lightbulb, MessageSquareWarning, Search, Sparkles, Store } from 'lucide-react';
import { useApp } from '../data/store';
import { SERVICE_KINDS } from '../content/taxonomy';
import { SERVICE_ICON } from '../components/icons';
import { ObjectionCard } from '../components/objection';
import { Badge, Button, Card, CopyButton, EmptyState, FavoriteButton, MessageText, SectionTitle } from '../components/ui';

export default function ServiceDetail() {
  const { id } = useParams();
  const { content, addHistory } = useApp();
  const s = content.services.find((x) => x.id === id);

  useEffect(() => {
    if (s) addHistory({ tipo: 'servico', label: s.nome, href: `/servicos/${s.id}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s?.id]);

  const { specific, general, niches } = useMemo(() => {
    if (!s) return { specific: [], general: [], niches: [] };
    const specific = content.objections.filter((o) => o.servicosRelacionados?.includes(s.id));
    const general = content.objections
      .filter((o) => !o.servicosRelacionados?.includes(s.id) && o.servicos.includes(s.grupo) && o.variacoes[s.grupo])
      .slice(0, 8);
    const niches = content.niches.filter((n) => n.solucoes.some((x) => x.servico === s.id));
    return { specific, general, niches };
  }, [s, content]);

  if (!s) {
    return (
      <EmptyState icon={<Search size={22} />} title="Serviço não encontrado" action={<Link to="/servicos"><Button>Ver catálogo</Button></Link>}>
        Ele pode ter sido removido por um administrador.
      </EmptyState>
    );
  }
  const Icon = SERVICE_ICON[s.grupo];

  return (
    <article className="space-y-8">
      <div>
        <Link to="/servicos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft size={15} /> Catálogo de serviços
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="accent" icon={<Icon size={11} />}>
              {SERVICE_KINDS[s.grupo].label}
            </Badge>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{s.nome}</h1>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted">{s.descricao}</p>
            <p className="mt-2 text-sm text-dim">Para quem: {s.paraQuem}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FavoriteButton kind="service" itemId={s.id} label={s.nome} href={`/servicos/${s.id}`} size="md" />
            <Link to={`/gerador?servico=${s.id}`}>
              <Button variant="primary" icon={<Sparkles size={15} />}>Gerar resposta</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="eyebrow mb-3">O que normalmente está incluso</p>
          <ul className="space-y-2">
            {s.entregaveis.map((e) => (
              <li key={e} className="flex gap-2 text-sm text-muted">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" /> {e}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-dim">Ajuste a lista ao seu escopo real antes de enviar qualquer proposta.</p>
        </Card>
        <Card className="p-5">
          <p className="eyebrow mb-3 flex items-center gap-1.5">
            <Lightbulb size={12} /> Argumentos de valor
          </p>
          <div className="space-y-3">
            {s.argumentos.map((a) => (
              <div key={a} className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-muted">{a}</p>
                <CopyButton text={a} size="icon" variant="ghost" label="Copiar argumento" itemKind="service" itemId={s.id} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <MessageSquareWarning size={16} className="text-accent" /> Objeções específicas deste serviço
          </span>
        </SectionTitle>
        <div className="grid gap-3 lg:grid-cols-2">
          {s.objecoes.map((o) => (
            <Card key={o.frase} className="p-5">
              <p className="font-medium">“{o.frase}”</p>
              <MessageText text={o.resposta} className="mt-2 text-sm text-muted" />
              <div className="mt-3">
                <CopyButton text={o.resposta} itemKind="service" itemId={s.id} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {specific.length > 0 && (
        <section>
          <SectionTitle>Fichas completas relacionadas a este serviço</SectionTitle>
          <div className="grid gap-2.5 lg:grid-cols-2">
            {specific.map((o) => (
              <ObjectionCard key={o.id} o={o} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle action={<Link to={`/objecoes?servico=${s.grupo}`} className="text-xs text-muted hover:text-fg">Ver todas →</Link>}>
          Objeções gerais com orientação para {SERVICE_KINDS[s.grupo].label.toLowerCase()}
        </SectionTitle>
        <div className="grid gap-2.5 lg:grid-cols-2">
          {general.map((o) => (
            <Link key={o.id} to={`/objecoes/${o.id}`} className="card card-hover block p-4">
              <p className="font-medium">“{o.frase}”</p>
              <p className="mt-1.5 text-sm text-muted">
                <span className="text-dim">Neste serviço: </span>
                {o.variacoes[s.grupo]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {niches.length > 0 && (
        <section>
          <SectionTitle>
            <span className="flex items-center gap-2">
              <Store size={16} className="text-accent" /> Nichos em que este serviço costuma fazer sentido
            </span>
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {niches.map((n) => (
              <Link key={n.id} to={`/nichos/${n.id}`} className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:border-line-strong hover:text-fg">
                {n.nome}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
