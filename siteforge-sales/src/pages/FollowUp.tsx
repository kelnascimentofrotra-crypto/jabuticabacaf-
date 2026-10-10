import { useMemo, useState } from 'react';
import { Ban, CalendarClock, CheckCircle2, Circle, Info, ListChecks, Save, Trash2 } from 'lucide-react';
import { useApp } from '../data/store';
import type { FollowUpPlan } from '../types';
import { formatDateBR, maxMessages, schedule, todayISO } from '../lib/followup';
import { uid } from '../lib/text';
import { Badge, Bullets, Button, Card, CopyButton, EmptyState, Field, Input, MessageText, Notice, PageHeader, Select, SectionTitle, Tabs, cn } from '../components/ui';
import { useToast } from '../components/ui/toast';

type View = 'montar' | 'acompanhar';

export default function FollowUp() {
  const { content, data, saveFollowupPlan, deleteFollowupPlan } = useApp();
  const toast = useToast();
  const [view, setView] = useState<View>('montar');
  const [seqId, setSeqId] = useState(content.followups[0]?.id ?? '');
  const seq = content.followups.find((s) => s.id === seqId) ?? content.followups[0];
  const [quantidade, setQuantidade] = useState(() => (seq ? maxMessages(seq) : 3));
  const [modo, setModo] = useState<'sugerido' | 'intervalo'>('sugerido');
  const [intervalo, setIntervalo] = useState(3);
  const [inicio, setInicio] = useState(todayISO());
  const [lead, setLead] = useState('');

  const plan = useMemo(
    () => (seq ? schedule(seq, { quantidade, modo, intervaloDias: Math.max(1, intervalo), inicio }) : []),
    [seq, quantidade, modo, intervalo, inicio],
  );

  if (!seq) return <EmptyState title="Nenhuma sequência cadastrada" />;

  const savePlan = async () => {
    const p: FollowUpPlan = {
      id: uid('f_'),
      lead: lead.trim() || 'Lead sem nome',
      sequenceId: seq.id,
      inicio,
      mensagens: plan.map((m) => ({ data: m.data, texto: m.texto.replace(/\[nome\]/g, lead.trim() || '[nome]'), objetivo: m.objetivo, enviada: false })),
      encerrado: false,
      createdAt: new Date().toISOString(),
    };
    try {
      await saveFollowupPlan(p);
      toast.show('Plano salvo. Acompanhe na aba "Meus follow-ups".');
      setView('acompanhar');
    } catch (e) {
      toast.show((e as Error).message, 'error');
    }
  };

  const toggleSent = async (p: FollowUpPlan, i: number) => {
    const next = { ...p, mensagens: p.mensagens.map((m, j) => (j === i ? { ...m, enviada: !m.enviada } : m)) };
    await saveFollowupPlan(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-up"
        subtitle="Sequências para retomar contatos respeitando o histórico, o tempo entre mensagens e a vontade do cliente. Nada é enviado automaticamente: você copia e envia quando fizer sentido."
      />
      <Tabs<View>
        value={view}
        onChange={setView}
        items={[
          { id: 'montar', label: 'Montar sequência' },
          { id: 'acompanhar', label: 'Meus follow-ups', count: data.followup_plans.length },
        ]}
      />

      {view === 'montar' && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-3">
            <Card className="space-y-3 p-4">
              <Field label="Situação do cliente" htmlFor="f-seq">
                <Select
                  id="f-seq"
                  value={seq.id}
                  onChange={(e) => {
                    setSeqId(e.target.value);
                    const s = content.followups.find((x) => x.id === e.target.value);
                    if (s) setQuantidade(maxMessages(s));
                  }}
                >
                  {content.followups.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={`Quantidade de mensagens (máx. ${maxMessages(seq)})`} htmlFor="f-qtd" hint="A última é sempre a mensagem de encerramento respeitoso.">
                <Input id="f-qtd" type="number" min={1} max={maxMessages(seq)} value={quantidade} onChange={(e) => setQuantidade(Math.max(1, Math.min(maxMessages(seq), Number(e.target.value) || 1)))} />
              </Field>
              <Field label="Intervalo entre mensagens" htmlFor="f-modo">
                <Select id="f-modo" value={modo} onChange={(e) => setModo(e.target.value as 'sugerido' | 'intervalo')}>
                  <option value="sugerido">Intervalos sugeridos pela sequência</option>
                  <option value="intervalo">Intervalo fixo personalizado</option>
                </Select>
              </Field>
              {modo === 'intervalo' && (
                <Field label="Dias entre mensagens" htmlFor="f-int">
                  <Input id="f-int" type="number" min={1} max={60} value={intervalo} onChange={(e) => setIntervalo(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} />
                </Field>
              )}
              <Field label="Data de início" htmlFor="f-ini">
                <Input id="f-ini" type="date" value={inicio} onChange={(e) => setInicio(e.target.value || todayISO())} />
              </Field>
              <Field label="Nome do lead (opcional)" htmlFor="f-lead" hint="Preenche o campo [nome] no plano salvo.">
                <Input id="f-lead" value={lead} onChange={(e) => setLead(e.target.value)} placeholder="Ex.: Marcos — Barbearia do Centro" />
              </Field>
              <Button variant="primary" className="w-full justify-center" icon={<Save size={15} />} onClick={savePlan}>
                Salvar plano de follow-up
              </Button>
            </Card>
            <Notice tone="warn" icon={<Ban size={16} />} title="Recusa explícita encerra tudo">
              Se o cliente disser claramente que não tem interesse, pare a sequência e envie apenas um agradecimento. Não insista.
            </Notice>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <p className="font-medium">{seq.nome}</p>
              <p className="mt-1 text-sm text-muted">{seq.situacao}</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-1.5">Princípios</p>
                  <Bullets items={seq.principios} tone="accent" />
                </div>
                <div>
                  <p className="eyebrow mb-1.5">Não faça</p>
                  <Bullets items={seq.naoFazer} tone="danger" />
                </div>
              </div>
            </Card>
            <ol className="relative space-y-3 border-l border-line pl-5" data-testid="followup-plan">
              {plan.map((m, i) => (
                <li key={i} className="relative">
                  <span className={cn('absolute -left-[27px] top-4 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-bg', m.encerramento ? 'bg-dim' : 'bg-accent')} />
                  <Card className="p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone={m.encerramento ? 'neutral' : 'accent'} icon={<CalendarClock size={11} />}>
                        {formatDateBR(m.data)} · dia {m.dia}
                      </Badge>
                      <span className="text-xs text-dim">{m.objetivo}</span>
                    </div>
                    <MessageText text={m.texto} className="text-sm" />
                    <div className="mt-3">
                      <CopyButton text={m.texto} itemKind="followup" itemId={seq.id} />
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
            <p className="flex items-center gap-1.5 text-xs text-dim">
              <Info size={12} /> Se o cliente responder em qualquer ponto, interrompa a sequência e siga a conversa.
            </p>
          </div>
        </div>
      )}

      {view === 'acompanhar' && (
        <div className="space-y-3">
          {data.followup_plans.length === 0 && (
            <EmptyState icon={<ListChecks size={22} />} title="Nenhum follow-up salvo">
              Monte uma sequência e salve para acompanhar o que já foi enviado.
            </EmptyState>
          )}
          {data.followup_plans.map((p) => {
            const s = content.followups.find((x) => x.id === p.sequenceId);
            const enviadas = p.mensagens.filter((m) => m.enviada).length;
            return (
              <Card key={p.id} className="p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{p.lead}</p>
                    <p className="text-xs text-dim">
                      {s?.nome ?? 'Sequência removida'} · início {formatDateBR(p.inicio)} · {enviadas}/{p.mensagens.length} enviadas
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={p.encerrado ? 'outline' : 'secondary'}
                      onClick={() => saveFollowupPlan({ ...p, encerrado: !p.encerrado })}
                    >
                      {p.encerrado ? 'Reabrir' : 'Encerrar'}
                    </Button>
                    <Button size="sm" variant="ghost" icon={<Trash2 size={13} />} onClick={() => deleteFollowupPlan(p.id).then(() => toast.show('Plano removido.'))}>
                      Excluir
                    </Button>
                  </div>
                </div>
                {p.encerrado ? (
                  <p className="text-sm text-dim">Sequência encerrada.</p>
                ) : (
                  <ul className="space-y-2">
                    {p.mensagens.map((m, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-lg border border-line bg-bg/40 p-3">
                        <button type="button" onClick={() => toggleSent(p, i)} aria-label={m.enviada ? 'Marcar como não enviada' : 'Marcar como enviada'} className="mt-0.5 text-dim hover:text-accent">
                          {m.enviada ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-dim">
                            {formatDateBR(m.data)} · {m.objetivo}
                          </p>
                          <p className={cn('mt-1 text-sm', m.enviada ? 'text-dim line-through' : 'text-muted')}>{m.texto}</p>
                        </div>
                        <CopyButton text={m.texto} size="icon" variant="ghost" label="Copiar mensagem" />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <section>
        <SectionTitle>Todas as sequências</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {content.followups.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => {
                setSeqId(s.id);
                setQuantidade(maxMessages(s));
                setView('montar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn('card card-hover p-3.5 text-left', s.id === seq.id && view === 'montar' && 'border-accent/40')}
            >
              <p className="text-sm font-medium">{s.nome}</p>
              <p className="mt-0.5 text-xs text-dim">{s.mensagens.length + 1} mensagens</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
