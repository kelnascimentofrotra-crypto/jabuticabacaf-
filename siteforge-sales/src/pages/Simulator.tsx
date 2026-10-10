import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bot, CheckCircle2, ChevronRight, GraduationCap, Library, Lightbulb, RotateCcw, Send, Trophy, XCircle } from 'lucide-react';
import { useApp } from '../data/store';
import type { Scenario } from '../types';
import { CRITERIA, evaluateByRules, type Evaluation } from '../lib/evaluator';
import { aiEvaluate, aiRoleplay } from '../lib/ai';
import { RESISTANCE } from '../content/taxonomy';
import { uid } from '../lib/text';
import { Badge, Bullets, Button, Card, Chip, CopyButton, EmptyState, MessageText, Notice, PageHeader, Textarea, cn } from '../components/ui';
import { useToast } from '../components/ui/toast';

interface Turn {
  cliente: string;
  resposta?: string;
  avaliacao?: Evaluation;
}

function scoreTone(v: number) {
  return v >= 7.5 ? 'bg-accent' : v >= 5 ? 'bg-warn' : 'bg-danger';
}

function ScoreBars({ ev }: { ev: Evaluation }) {
  return (
    <div className="space-y-2.5">
      {CRITERIA.map((c) => {
        const v = ev.notas[c.key];
        return (
          <div key={c.key} title={c.descricao}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">{c.label}</span>
              <span className="tabular-nums text-fg">{v.toFixed(1)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className={cn('h-full rounded-full transition-[width] duration-500', scoreTone(v))} style={{ width: `${v * 10}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScenarioList() {
  const { content, data } = useApp();
  const best = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of data.training_attempts) m[a.scenarioId] = Math.max(m[a.scenarioId] ?? 0, a.notaMedia);
    return m;
  }, [data.training_attempts]);
  return (
    <div>
      <PageHeader
        title="Simulador de clientes"
        subtitle="Você é o vendedor. O cliente apresenta objeções reais e cada resposta é avaliada em clareza, empatia, diagnóstico, argumentação de valor e condução comercial."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {content.scenarios.map((s) => (
          <Link key={s.id} to={`/simulador/${s.id}`} className="card card-hover group flex flex-col p-5" data-testid="scenario-card">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={s.dificuldade === 'alta' ? 'danger' : s.dificuldade === 'media' ? 'warn' : 'accent'}>Dificuldade {RESISTANCE[s.dificuldade].label.toLowerCase()}</Badge>
              {best[s.id] !== undefined && (
                <Badge tone="info" icon={<Trophy size={11} />}>
                  Melhor nota {best[s.id]}
                </Badge>
              )}
            </div>
            <p className="font-medium">{s.titulo}</p>
            <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted">{s.persona}</p>
            <p className="mt-3 flex items-center gap-1 text-xs text-accent-strong">
              Começar treino <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>
      {data.training_attempts.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-[15px] font-semibold">Seus treinos recentes</h2>
          <Card className="divide-y divide-line">
            {data.training_attempts.slice(0, 8).map((a) => {
              const s = content.scenarios.find((x) => x.id === a.scenarioId);
              return (
                <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="truncate text-muted">{s?.titulo ?? a.scenarioId}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge>{a.modo === 'ia' ? 'IA' : 'Regras'}</Badge>
                    <span className="tabular-nums text-fg">{a.notaMedia}/100</span>
                  </span>
                </div>
              );
            })}
          </Card>
        </section>
      )}
    </div>
  );
}

function Session({ scenario }: { scenario: Scenario }) {
  const { ai, saveAttempt, logEvent } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'regras' | 'ia'>(ai.configured ? 'ia' : 'regras');
  const [turns, setTurns] = useState<Turn[]>([{ cliente: scenario.rodadas[0].cliente }]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const total = scenario.rodadas.length;
  const current = turns.length - 1;
  const awaitingAnswer = !turns[current].avaliacao;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length, turns[current]?.avaliacao, finished]);

  const restart = () => {
    setTurns([{ cliente: scenario.rodadas[0].cliente }]);
    setDraft('');
    setFinished(false);
  };

  const submit = async () => {
    const resposta = draft.trim();
    if (!resposta) return;
    const round = scenario.rodadas[current];
    setBusy(true);
    let avaliacao: Evaluation = evaluateByRules(resposta, round);
    if (mode === 'ia' && ai.configured) {
      try {
        const r = await aiEvaluate({
          persona: scenario.persona,
          contexto: `${scenario.contexto} Objetivo do treino: ${scenario.objetivoTreino}`,
          cliente: turns[current].cliente,
          resposta,
          referencia: round.respostaModelo,
        });
        const media = Math.round(((r.notas.clareza + r.notas.empatia + r.notas.diagnostico + r.notas.valor + r.notas.conducao) / 5) * 10);
        avaliacao = { ...r, media, modo: 'ia' };
      } catch (e) {
        toast.show(`IA indisponível (${(e as Error).message}). Avaliação feita por regras.`, 'error');
      }
    }
    setTurns((t) => t.map((x, i) => (i === current ? { ...x, resposta, avaliacao } : x)));
    setDraft('');
    setBusy(false);
  };

  const next = async () => {
    const last = turns[current];
    if (current + 1 >= total) {
      const rodadas = turns.map((t) => ({ resposta: t.resposta ?? '', nota: t.avaliacao?.media ?? 0 }));
      const notaMedia = Math.round(rodadas.reduce((a, r) => a + r.nota, 0) / rodadas.length);
      setFinished(true);
      try {
        await saveAttempt({ id: uid('t_'), scenarioId: scenario.id, modo: turns.some((t) => t.avaliacao?.modo === 'ia') ? 'ia' : 'regras', notaMedia, rodadas, createdAt: new Date().toISOString() });
        logEvent({ event: 'train', itemKind: 'scenario', itemId: scenario.id });
      } catch (e) {
        toast.show(`Não foi possível salvar o treino: ${(e as Error).message}`, 'error');
      }
      return;
    }
    const nextRound = scenario.rodadas[current + 1];
    let cliente = (last.avaliacao?.media ?? 0) < 55 && nextRound.clienteFrio ? nextRound.clienteFrio : nextRound.cliente;
    if (mode === 'ia' && ai.configured) {
      setBusy(true);
      try {
        const historico = turns.flatMap((t) => [
          { autor: 'cliente', texto: t.cliente },
          ...(t.resposta ? [{ autor: 'vendedor', texto: t.resposta }] : []),
        ]);
        const r = await aiRoleplay({ persona: scenario.persona, contexto: scenario.contexto, objetivo: scenario.objetivoTreino, historico });
        if (r.cliente?.trim()) cliente = r.cliente.trim();
      } catch (e) {
        toast.show(`IA indisponível (${(e as Error).message}). Usando fala roteirizada.`, 'error');
      } finally {
        setBusy(false);
      }
    }
    setTurns((t) => [...t, { cliente }]);
  };

  const finalScore = finished ? Math.round(turns.reduce((a, t) => a + (t.avaliacao?.media ?? 0), 0) / turns.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/simulador" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft size={15} /> Cenários
        </Link>
        <h1 className="text-2xl font-semibold">{scenario.titulo}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone="accent">
              Rodada {Math.min(current + 1, total)} de {total}
            </Badge>
            <div className="flex gap-1.5">
              <Chip active={mode === 'regras'} onClick={() => setMode('regras')} icon={<Library size={13} />}>
                Avaliação por regras
              </Chip>
              <Chip
                active={mode === 'ia'}
                onClick={() => (ai.configured ? setMode('ia') : toast.show('IA não configurada. Veja Configurações.', 'error'))}
                icon={<Bot size={13} />}
                className={!ai.configured ? 'opacity-50' : ''}
              >
                IA {ai.configured ? '' : '(indisponível)'}
              </Chip>
            </div>
          </div>
          {mode === 'regras' && (
            <p className="text-xs text-dim">
              Modo por regras: o cliente segue um roteiro (com reação mais fria se a resposta anterior for fraca) e a nota vem de critérios objetivos — reconhecimento, perguntas, ligação com o contexto, próximo passo, ausência de promessas e pressão. Não é IA.
            </p>
          )}

          <Card className="space-y-4 p-4 sm:p-5" data-testid="sim-chat">
            {turns.map((t, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-line bg-raised px-4 py-2.5 text-sm leading-relaxed sm:max-w-[80%]">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-dim">Cliente</p>
                    {t.cliente}
                  </div>
                </div>
                {t.resposta && (
                  <div className="flex justify-end">
                    <div className="max-w-[90%] rounded-2xl rounded-br-md bg-accent/[0.12] px-4 py-2.5 text-sm leading-relaxed sm:max-w-[80%]">
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-dim">Você</p>
                      {t.resposta}
                    </div>
                  </div>
                )}
                {t.avaliacao && (
                  <div className="animate-fade-in rounded-xl border border-line bg-bg/60 p-4" data-testid="sim-evaluation">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Avaliação da rodada {i + 1}</p>
                      <div className="flex items-center gap-2">
                        <Badge icon={t.avaliacao.modo === 'ia' ? <Bot size={11} /> : <Library size={11} />}>{t.avaliacao.modo === 'ia' ? 'IA' : 'Regras'}</Badge>
                        <span className="text-lg font-semibold tabular-nums">{t.avaliacao.media}</span>
                        <span className="text-xs text-dim">/100</span>
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <ScoreBars ev={t.avaliacao} />
                      <div className="space-y-3">
                        {t.avaliacao.pontosFortes.length > 0 && (
                          <div>
                            <p className="eyebrow mb-1.5 flex items-center gap-1 text-accent/80">
                              <CheckCircle2 size={12} /> Pontos fortes
                            </p>
                            <Bullets items={t.avaliacao.pontosFortes} tone="accent" />
                          </div>
                        )}
                        {t.avaliacao.erros.length > 0 && (
                          <div>
                            <p className="eyebrow mb-1.5 flex items-center gap-1 text-danger/80">
                              <XCircle size={12} /> O que melhorar
                            </p>
                            <Bullets items={t.avaliacao.erros} tone="danger" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-line p-3.5">
                      <p className="eyebrow mb-1.5">Resposta alternativa</p>
                      <MessageText text={t.avaliacao.alternativa} className="text-sm" />
                      <p className="eyebrow mb-1 mt-3">Por que essa estratégia</p>
                      <p className="text-sm text-muted">{t.avaliacao.justificativa}</p>
                      <div className="mt-3">
                        <CopyButton text={t.avaliacao.alternativa} label="Copiar alternativa" />
                      </div>
                    </div>
                    {i === current && !finished && (
                      <div className="mt-4 flex justify-end">
                        <Button variant="primary" onClick={next} disabled={busy} icon={current + 1 >= total ? <Trophy size={15} /> : <ChevronRight size={15} />}>
                          {busy ? 'Cliente digitando…' : current + 1 >= total ? 'Ver resultado final' : 'Próxima rodada'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {finished && (
              <div className="animate-fade-in rounded-xl border border-accent/30 bg-accent/[0.05] p-5 text-center" data-testid="sim-final">
                <Trophy className="mx-auto mb-2 text-accent" size={26} />
                <p className="text-sm text-muted">Nota final do treino</p>
                <p className="text-4xl font-semibold tabular-nums">{finalScore}</p>
                <p className="mt-2 text-sm text-muted">
                  {finalScore >= 75 ? 'Excelente condução. Tente um cenário mais difícil.' : finalScore >= 55 ? 'Bom caminho. Revise os pontos de melhoria e treine de novo.' : 'Releia as respostas alternativas e tente novamente com foco em perguntas e próximo passo.'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button icon={<RotateCcw size={15} />} onClick={restart}>
                    Treinar de novo
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/simulador')}>
                    Outros cenários
                  </Button>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </Card>

          {awaitingAnswer && !finished && (
            <Card className="p-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
                }}
                placeholder="Escreva sua resposta como se estivesse no WhatsApp com esse cliente…"
                aria-label="Sua resposta"
                className="border-0 bg-transparent focus:ring-0"
                data-testid="sim-input"
              />
              <div className="flex items-center justify-between gap-2 px-1 pt-2">
                <span className="hidden text-[11px] text-dim sm:block">Ctrl + Enter para enviar</span>
                <Button variant="primary" icon={<Send size={15} />} onClick={submit} disabled={!draft.trim() || busy}>
                  {busy ? 'Avaliando…' : 'Enviar resposta'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="eyebrow mb-1.5">Cliente</p>
            <p className="text-sm text-muted">{scenario.persona}</p>
            <p className="eyebrow mb-1.5 mt-3">Contexto</p>
            <p className="text-sm text-muted">{scenario.contexto}</p>
            <p className="eyebrow mb-1.5 mt-3">Objetivo do treino</p>
            <p className="text-sm text-fg">{scenario.objetivoTreino}</p>
          </Card>
          <Notice tone="accent" icon={<Lightbulb size={16} />} title="Dicas">
            <ul className="mt-1 space-y-1">
              {scenario.dicas.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Notice>
        </aside>
      </div>
    </div>
  );
}

export default function Simulator() {
  const { id } = useParams();
  const { content } = useApp();
  if (!id) return <ScenarioList />;
  const s = content.scenarios.find((x) => x.id === id);
  if (!s)
    return (
      <EmptyState icon={<GraduationCap size={22} />} title="Cenário não encontrado" action={<Link to="/simulador"><Button>Ver cenários</Button></Link>}>
        Ele pode ter sido removido.
      </EmptyState>
    );
  return <Session key={s.id} scenario={s} />;
}
