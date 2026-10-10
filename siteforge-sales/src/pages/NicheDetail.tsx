import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Columns3, Compass, Lightbulb, MessagesSquare, Search, Send, Sparkles, Target, Users } from 'lucide-react';
import { useApp } from '../data/store';
import { NICHE_CATEGORIES } from '../content/taxonomy';
import { NICHE_ICON, SERVICE_ICON } from '../components/icons';
import { Badge, Bullets, Button, Card, CopyButton, EmptyState, FavoriteButton, MessageText, Notice, SectionTitle, cn } from '../components/ui';

const ANGLE_LABELS: { key: 'preco' | 'necessidade' | 'confianca' | 'prazo'; label: string }[] = [
  { key: 'preco', label: 'Quando o assunto é preço' },
  { key: 'necessidade', label: 'Quando não vê necessidade' },
  { key: 'confianca', label: 'Quando falta confiança' },
  { key: 'prazo', label: 'Quando o momento não é agora' },
];

export default function NicheDetail() {
  const { id } = useParams();
  const { hash } = useLocation();
  const { content, addHistory, logEvent } = useApp();
  const n = content.niches.find((x) => x.id === id);

  useEffect(() => {
    if (!n) return;
    addHistory({ tipo: 'nicho', label: n.nome, href: `/nichos/${n.id}` });
    logEvent({ event: 'view_niche', itemKind: 'niche', itemId: n.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n?.id]);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  }, [hash, n?.id]);

  if (!n) {
    return (
      <EmptyState icon={<Search size={22} />} title="Nicho não encontrado" action={<Link to="/nichos"><Button>Ver nichos</Button></Link>}>
        Ele pode ter sido removido por um administrador.
      </EmptyState>
    );
  }

  const Icon = NICHE_ICON[n.categoria];

  return (
    <article className="space-y-8">
      <div>
        <Link to="/nichos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft size={15} /> Nichos
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="accent" icon={<Icon size={11} />}>
              {NICHE_CATEGORIES[n.categoria].label}
            </Badge>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{n.nome}</h1>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted">{n.resumo}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FavoriteButton kind="niche" itemId={n.id} label={n.nome} href={`/nichos/${n.id}`} size="md" />
            <Link to={`/gerador?nicho=${n.id}`}>
              <Button variant="primary" icon={<Sparkles size={15} />}>Gerar resposta</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="eyebrow mb-2">Como os clientes chegam</p>
          <Bullets items={n.comoClientesChegam} />
        </Card>
        <Card className="p-5">
          <p className="eyebrow mb-2">Dores digitais típicas</p>
          <Bullets items={n.dores} tone="warn" />
        </Card>
        <Card className="p-5">
          <p className="eyebrow mb-2">Perguntas de diagnóstico</p>
          <Bullets items={n.perguntas} tone="accent" />
        </Card>
      </div>

      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Target size={16} className="text-accent" /> Soluções digitais indicadas
          </span>
        </SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-3">
          {n.solucoes.map((s) => {
            const svc = content.services.find((x) => x.id === s.servico);
            if (!svc) return null;
            const SIcon = SERVICE_ICON[svc.grupo];
            return (
              <Link key={s.servico} to={`/servicos/${svc.id}`} className="card card-hover p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <SIcon size={15} className="text-accent" /> {svc.nome}
                </p>
                <p className="mt-1.5 text-sm text-muted">{s.porque}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Lightbulb size={16} className="text-accent" /> Argumentos de valor para {n.nome.toLowerCase()}
          </span>
        </SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-3">
          {n.argumentos.map((a, i) => (
            <Card key={i} className="flex flex-col p-4">
              <p className="flex-1 text-sm leading-relaxed text-muted">{a}</p>
              <div className="mt-3">
                <CopyButton text={a} itemKind="niche" itemId={n.id} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <MessagesSquare size={16} className="text-accent" /> Objeções específicas deste nicho
          </span>
        </SectionTitle>
        <div className="space-y-3">
          {n.objecoes.map((o) => (
            <Card key={o.id} className={cn('scroll-mt-24 p-5')}>
              <div id={o.id} className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
                <div>
                  <p className="text-[17px] font-medium">“{o.frase}”</p>
                  <p className="eyebrow mb-1 mt-3">O que pode estar por trás</p>
                  <p className="text-sm text-muted">{o.porTras}</p>
                  <p className="eyebrow mb-1 mt-3">Próximo passo</p>
                  <p className="text-sm text-muted">{o.proximoPasso}</p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-line bg-bg/50 p-4">
                    <p className="eyebrow mb-1.5">Resposta para WhatsApp</p>
                    <MessageText text={o.resposta} />
                    <div className="mt-3 flex gap-2">
                      <CopyButton text={o.resposta} itemKind="niche-objection" itemId={`${n.id}:${o.id}`} />
                      <FavoriteButton kind="niche-objection" itemId={`${n.id}:${o.id}`} label={`${n.nome}: ${o.frase}`} href={`/nichos/${n.id}#${o.id}`} />
                    </div>
                  </div>
                  <div className="rounded-lg border border-line bg-bg/50 p-4">
                    <p className="eyebrow mb-1.5">Pergunta estratégica</p>
                    <MessageText text={o.pergunta} className="text-sm" />
                    <div className="mt-3">
                      <CopyButton text={o.pergunta} itemKind="niche-objection" itemId={`${n.id}:${o.id}`} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Users size={16} className="text-accent" /> Exemplo de conversa comercial
          </span>
        </SectionTitle>
        <Card className="space-y-3 p-4 sm:p-5">
          {n.conversa.map((l, i) => (
            <div key={i} className={cn('flex', l.autor === 'vendedor' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]',
                  l.autor === 'vendedor' ? 'rounded-br-md bg-accent/[0.12] text-fg' : 'rounded-bl-md border border-line bg-raised text-muted',
                )}
              >
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-dim">{l.autor === 'vendedor' ? 'Você' : 'Cliente'}</p>
                {l.texto}
              </div>
            </div>
          ))}
        </Card>
      </section>

      <section>
        <SectionTitle
          action={
            <Link to={`/comparar?nichos=${n.id}`} className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
              <Columns3 size={13} /> Comparar com outros nichos
            </Link>
          }
        >
          <span className="flex items-center gap-2">
            <Compass size={16} className="text-accent" /> Como abordar cada tipo de objeção
          </span>
        </SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-2">
          {ANGLE_LABELS.map((a) => (
            <Card key={a.key} className="p-4">
              <p className="mb-1 text-sm font-medium">{a.label}</p>
              <p className="text-sm leading-relaxed text-muted">{n.angulos[a.key]}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="eyebrow mb-2 flex items-center gap-1.5">
            <Send size={12} /> Abertura de prospecção
          </p>
          <MessageText text={n.aberturaProspeccao} />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={n.aberturaProspeccao} itemKind="niche" itemId={n.id} />
            <Link to={`/prospeccao?nicho=${n.id}`}>
              <Button size="sm" variant="ghost">
                Abrir na Central de Prospecção →
              </Button>
            </Link>
          </div>
        </Card>
        {n.cuidados.length > 0 && (
          <Notice tone="warn" title="Cuidados neste nicho" icon={<AlertTriangle size={16} />}>
            <ul className="mt-1 space-y-1.5">
              {n.cuidados.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Notice>
        )}
      </div>
    </article>
  );
}
