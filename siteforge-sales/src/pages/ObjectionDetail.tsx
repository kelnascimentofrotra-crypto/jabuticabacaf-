import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Ban,
  Bot,
  Compass,
  HelpCircle,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Presentation,
  RefreshCw,
  Save,
  Scale,
  Search,
  Target,
  Trash2,
  Users,
} from 'lucide-react';
import { useApp } from '../data/store';
import { CATEGORY_TO_ANGLE, OBJECTIVES, SERVICE_KINDS, SERVICE_KIND_ORDER, STAGE_LABEL, TRANSPARENCY, TRANSPARENCY_ORDER } from '../content/taxonomy';
import type { ServiceKind } from '../types';
import { CategoryBadge, ObjectionCard, ResistanceBadge } from '../components/objection';
import { ResponseCard } from '../components/ResponseCard';
import { SERVICE_ICON } from '../components/icons';
import { Badge, Bullets, Button, Card, CopyButton, EmptyState, FavoriteButton, Field, MessageText, Notice, Select, SectionTitle, Textarea, cn } from '../components/ui';
import { useToast } from '../components/ui/toast';
import { aiVariant } from '../lib/ai';

export default function ObjectionDetail() {
  const { id } = useParams();
  const { content, ai, addHistory, logEvent, data, saveCustomResponse, deleteCustomResponse } = useApp();
  const toast = useToast();
  const o = content.objections.find((x) => x.id === id);
  const [nicheId, setNicheId] = useState('');
  const [kind, setKind] = useState<ServiceKind | ''>('');
  const [altIndex, setAltIndex] = useState(0);
  const [aiAlt, setAiAlt] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!o) return;
    addHistory({ tipo: 'objecao', label: o.frase, href: `/objecoes/${o.id}` });
    logEvent({ event: 'view_objection', itemKind: 'objection', itemId: o.id });
    setAltIndex(0);
    setAiAlt(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o?.id]);

  const shortVersions = useMemo(() => (o ? [o.respostas.curta, ...o.alternativas] : []), [o]);
  const niche = content.niches.find((n) => n.id === nicheId);
  const related = useMemo(() => (o ? o.relacionadas.map((r) => content.objections.find((x) => x.id === r)).filter(Boolean) : []), [o, content.objections]);
  const mine = useMemo(() => data.custom_responses.filter((r) => r.objectionId === id), [data.custom_responses, id]);

  if (!o) {
    return (
      <EmptyState icon={<Search size={22} />} title="Objeção não encontrada" action={<Link to="/objecoes"><Button>Voltar à biblioteca</Button></Link>}>
        Ela pode ter sido removida por um administrador.
      </EmptyState>
    );
  }

  const currentShort = aiAlt ?? shortVersions[altIndex % shortVersions.length];

  const nextAlternative = async () => {
    if (ai.configured) {
      setAiLoading(true);
      try {
        const r = await aiVariant({
          tipo: 'resposta curta para WhatsApp',
          texto: currentShort,
          contexto: `Objeção: "${o.frase}". Estratégia: ${o.estrategia}${niche ? ` Nicho: ${niche.nome}.` : ''}${kind ? ` Serviço: ${SERVICE_KINDS[kind].label}.` : ''}`,
        });
        setAiAlt(r.texto);
      } catch (e) {
        toast.show(`IA indisponível: ${(e as Error).message}. Mostrando versão da biblioteca.`, 'error');
        setAiAlt(null);
        setAltIndex((i) => i + 1);
      } finally {
        setAiLoading(false);
      }
    } else {
      setAiAlt(null);
      setAltIndex((i) => i + 1);
    }
  };

  const saveMine = async () => {
    if (!draft.trim()) return;
    try {
      await saveCustomResponse({ id: editingId ?? undefined, titulo: o.frase, texto: draft.trim(), origem: 'manual', objectionId: o.id });
      setDraft('');
      setEditingId(null);
      toast.show('Sua versão foi salva em "Minhas respostas".');
    } catch (e) {
      toast.show((e as Error).message, 'error');
    }
  };

  return (
    <article className="space-y-8">
      <div>
        <Link to="/objecoes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft size={15} /> Biblioteca de objeções
        </Link>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <CategoryBadge categoria={o.categoria} />
          <Badge tone={o.biblioteca === 'sistema' ? 'indigo' : 'neutral'}>{o.biblioteca === 'sistema' ? 'Sistemas personalizados' : 'Venda de sites e soluções'}</Badge>
          <ResistanceBadge level={o.resistencia} />
        </div>
        <p className="eyebrow mb-1">1 · Objeção exata</p>
        <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">“{o.frase}”</h1>
        {o.gatilhos.length > 0 && (
          <p className="mt-2 text-sm text-dim">
            Também aparece como: {o.gatilhos.slice(0, 6).map((g) => `“${g}”`).join(', ')}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton text={currentShort} label="Copiar resposta curta" itemKind="objection" itemId={o.id} variant="primary" size="md" />
          <FavoriteButton kind="objection" itemId={o.id} label={o.frase} href={`/objecoes/${o.id}`} size="md" />
          <Button icon={ai.configured ? <Bot size={15} /> : <RefreshCw size={15} />} onClick={nextAlternative} disabled={aiLoading}>
            {aiLoading ? 'Gerando…' : 'Gerar alternativa'}
          </Button>
          <a href="#relacionadas">
            <Button icon={<Scale size={15} />}>Objeções relacionadas</Button>
          </a>
        </div>
      </div>

      {/* Contexto */}
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <Field label="Adaptar para o nicho" htmlFor="ctx-nicho">
          <Select id="ctx-nicho" value={nicheId} onChange={(e) => setNicheId(e.target.value)}>
            <option value="">Nenhum nicho específico</option>
            {content.niches.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Serviço que você está vendendo" htmlFor="ctx-servico">
          <Select id="ctx-servico" value={kind} onChange={(e) => setKind(e.target.value as ServiceKind | '')}>
            <option value="">Todos os serviços</option>
            {SERVICE_KIND_ORDER.map((k) => (
              <option key={k} value={k}>
                {SERVICE_KINDS[k].label}
              </option>
            ))}
          </Select>
        </Field>
        {niche && (
          <div className="sm:col-span-2">
            <Notice tone="accent" title={`Como abordar em ${niche.nome}`} icon={<Compass size={16} />}>
              <p>{niche.angulos[CATEGORY_TO_ANGLE[o.categoria]]}</p>
              <p className="mt-1.5">
                <Link to={`/nichos/${niche.id}`} className="text-accent-strong hover:underline">
                  Ver página do nicho e objeções específicas →
                </Link>
              </p>
            </Notice>
          </div>
        )}
        {kind && o.variacoes[kind] && (
          <div className="sm:col-span-2">
            <Notice tone="info" title={`Ao vender ${SERVICE_KINDS[kind].label.toLowerCase()}`}>
              {o.variacoes[kind]}
            </Notice>
          </div>
        )}
      </Card>

      {/* Significado e estratégia */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <HelpCircle size={16} className="text-accent" /> 2 · O que pode significar
            </span>
          </SectionTitle>
          <Bullets items={o.significados} />
          <p className="mt-3 text-xs text-dim">Nem todo cliente pensa igual: use as perguntas para descobrir qual é o caso.</p>
        </Card>
        <Card className="p-5">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <Target size={16} className="text-accent" /> 3 · Melhor estratégia
            </span>
          </SectionTitle>
          <p className="text-sm leading-relaxed text-muted">{o.estrategia}</p>
          <p className="eyebrow mb-2 mt-4">Descubra antes de responder</p>
          <Bullets items={o.descobrir} tone="accent" />
        </Card>
      </div>

      {/* Respostas */}
      <section>
        <SectionTitle>Respostas prontas</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-2">
          <ResponseCard
            testId="short-response"
            title="4 · Resposta curta"
            subtitle="Mensagem natural para WhatsApp"
            icon={<MessageCircle size={16} />}
            text={currentShort}
            itemKind="objection"
            itemId={o.id}
            highlight
            badge={
              aiAlt ? (
                <Badge tone="accent" icon={<Bot size={11} />}>
                  Gerada por IA
                </Badge>
              ) : (
                <Badge>
                  Biblioteca {(altIndex % shortVersions.length) + 1}/{shortVersions.length}
                </Badge>
              )
            }
            actions={
              <Button size="sm" icon={ai.configured ? <Bot size={14} /> : <RefreshCw size={14} />} onClick={nextAlternative} disabled={aiLoading}>
                {ai.configured ? 'Gerar com IA' : 'Outra versão'}
              </Button>
            }
          />
          <ResponseCard title="5 · Resposta consultiva" subtitle="Com pergunta de diagnóstico" icon={<HelpCircle size={16} />} text={o.respostas.consultiva} itemKind="objection" itemId={o.id} />
          <ResponseCard title="6 · Resposta persuasiva" subtitle="Argumento para demonstrar valor" icon={<Lightbulb size={16} />} text={o.respostas.persuasiva} itemKind="objection" itemId={o.id} />
          <ResponseCard title="Versão para ligação" subtitle="Para falar, não para ler" icon={<Phone size={16} />} text={o.respostas.ligacao} itemKind="objection" itemId={o.id} />
          <div className="lg:col-span-2">
            <ResponseCard title="7 · Resposta para reunião" subtitle="Como conduzir presencialmente ou por chamada" icon={<Presentation size={16} />} text={o.respostas.reuniao} itemKind="objection" itemId={o.id} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="eyebrow mb-2">8 · Pergunta estratégica</p>
          <MessageText text={o.perguntaEstrategica} className="text-[15px]" />
          <div className="mt-3">
            <CopyButton text={o.perguntaEstrategica} itemKind="objection" itemId={o.id} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="eyebrow mb-2">9 · Próximo passo</p>
          <p className="text-sm leading-relaxed text-muted">{o.proximoPasso}</p>
          <p className="eyebrow mb-1.5 mt-4">Objetivos indicados</p>
          <div className="flex flex-wrap gap-1.5">
            {o.objetivos.map((ob) => (
              <Badge key={ob}>{OBJECTIVES[ob].label}</Badge>
            ))}
          </div>
        </Card>
        <Card className="border-danger/20 p-5">
          <p className="eyebrow mb-2 flex items-center gap-1.5 text-danger/90">
            <Ban size={12} /> 10 · O que não dizer
          </p>
          <Bullets items={o.naoDizer} tone="danger" />
        </Card>
      </div>

      {/* Variações */}
      <section>
        <SectionTitle>11 · Variações por serviço</SectionTitle>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_KIND_ORDER.filter((k) => o.variacoes[k]).map((k) => {
            const Icon = SERVICE_ICON[k];
            return (
              <Card key={k} className={cn('p-4 transition-colors', kind === k && 'border-accent/40 bg-accent/[0.04]')}>
                <p className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <Icon size={15} className="text-accent" /> {SERVICE_KINDS[k].label}
                </p>
                <p className="text-sm leading-relaxed text-muted">{o.variacoes[k]}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {o.transparencia && (
        <section>
          <SectionTitle>
            <span className="flex items-center gap-2">
              <ListChecks size={16} className="text-accent" /> Transparência na venda de sistemas
            </span>
          </SectionTitle>
          <p className="-mt-1 mb-3 text-sm text-dim">Como tratar cada aspecto sem prometer o que ainda não foi definido.</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {TRANSPARENCY_ORDER.map((a) => {
              const specific = o.transparencia?.[a];
              return (
                <Card key={a} className={cn('p-4', specific && 'border-accent/25')}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{TRANSPARENCY[a].label}</p>
                    <Badge tone={specific ? 'accent' : 'neutral'}>{specific ? 'Específico desta objeção' : 'Orientação geral'}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{specific ?? TRANSPARENCY[a].geral}</p>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Minhas versões */}
      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Users size={16} className="text-accent" /> Minhas versões desta resposta
          </span>
        </SectionTitle>
        <div className="grid gap-3 lg:grid-cols-2">
          <Card className="p-4">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escreva como você responderia, com o seu jeito de falar. Fica salvo para usar de novo."
              aria-label="Minha versão da resposta"
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="primary" icon={editingId ? <Save size={14} /> : <Plus size={14} />} onClick={saveMine} disabled={!draft.trim()}>
                {editingId ? 'Salvar alteração' : 'Salvar minha versão'}
              </Button>
              {editingId && (
                <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); setDraft(''); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </Card>
          <div className="space-y-2">
            {mine.length === 0 && <p className="py-3 text-sm text-dim">Você ainda não salvou versões próprias para esta objeção.</p>}
            {mine.map((r) => (
              <Card key={r.id} className="p-4">
                <MessageText text={r.texto} className="text-sm" />
                <div className="mt-3 flex gap-2">
                  <CopyButton text={r.texto} itemKind="custom" itemId={r.id} />
                  <Button size="sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => { setEditingId(r.id); setDraft(r.texto); }}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Trash2 size={13} />} onClick={() => deleteCustomResponse(r.id).then(() => toast.show('Versão removida.'))}>
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="relacionadas" className="scroll-mt-24">
        <SectionTitle>12 · Objeções relacionadas</SectionTitle>
        <div className="grid gap-2.5 lg:grid-cols-3">{related.map((r) => r && <ObjectionCard key={r.id} o={r} showPreview={false} />)}</div>
        <p className="mt-4 text-xs text-dim">Aparece normalmente em: {o.etapas.map((e) => STAGE_LABEL[e]).join(' · ')}</p>
      </section>
    </article>
  );
}
