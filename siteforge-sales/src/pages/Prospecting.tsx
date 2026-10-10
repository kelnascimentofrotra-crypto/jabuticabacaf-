import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Compass, Flag, Mail, Radar, Save } from 'lucide-react';
import { useApp } from '../data/store';
import { CHANNELS, CHANNEL_ORDER, STAGES } from '../content/taxonomy';
import { COLD_STRATEGIES } from '../content/prospecting';
import type { ChannelId, StageId } from '../types';
import { Badge, Button, Card, CopyButton, Field, MessageText, Notice, PageHeader, Select, SectionTitle, Tabs } from '../components/ui';
import { useToast } from '../components/ui/toast';

type Situacao = 'semSite' | 'siteAntigo' | 'sistema';

const SITUACOES: { id: Situacao; label: string }[] = [
  { id: 'semSite', label: 'Empresa sem site' },
  { id: 'siteAntigo', label: 'Empresa com site antigo' },
  { id: 'sistema', label: 'Precisa de sistema personalizado' },
];

export default function Prospecting() {
  const { content, saveCustomResponse } = useApp();
  const toast = useToast();
  const [params] = useSearchParams();
  const [nicheId, setNicheId] = useState(params.get('nicho') ?? '');
  const [serviceId, setServiceId] = useState(params.get('servico') ?? '');
  const [canal, setCanal] = useState<ChannelId>('whatsapp');
  const [etapa, setEtapa] = useState<StageId>('primeiro-contato');
  const [situacao, setSituacao] = useState<Situacao>('semSite');
  const [objectionId, setObjectionId] = useState('');

  const niche = content.niches.find((n) => n.id === nicheId);
  const service = content.services.find((s) => s.id === serviceId);
  const stage = content.prospect.find((s) => s.id === etapa) ?? content.prospect[0];
  const objection = content.objections.find((o) => o.id === objectionId);

  useEffect(() => {
    if (service?.grupo === 'sistema') setSituacao('sistema');
  }, [service?.grupo]);

  const fill = (text: string) => {
    let t = text;
    if (niche) {
      const nome = niche.nome.toLowerCase();
      t = t.replace(/\[nicho\]/g, nome).replace(/\[tipo de empresa\]/g, nome).replace(/\[tipo de negócio\]/g, nome);
    }
    if (service) t = t.replace(/\[serviço\]/g, service.nome.toLowerCase());
    return t;
  };

  const output = useMemo(() => {
    if (!stage) return null;
    const base = fill(stage.mensagens[situacao]);
    if (canal === 'ligacao' || canal === 'presencial') return { titulo: canal === 'ligacao' ? 'Roteiro de ligação' : 'Roteiro para conversa presencial', texto: fill(stage.roteiroLigacao) };
    if (canal === 'email') return { titulo: 'E-mail', assunto: fill(stage.assuntoEmail), texto: `${base}\n\n[Seu nome]\n[Telefone] · [Link do portfólio]` };
    return { titulo: `Mensagem para ${CHANNELS[canal].label}`, texto: base };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, situacao, canal, niche, service]);

  const objectionText = objection ? fill(canal === 'ligacao' || canal === 'presencial' ? objection.respostas.ligacao : objection.respostas.curta) : '';
  const stageIndex = STAGES.findIndex((s) => s.id === etapa);
  const nextStage = STAGES[stageIndex + 1];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Central de Prospecção"
        subtitle="Escolha o nicho, o serviço, o canal e a etapa da conversa. Você recebe a mensagem recomendada, o objetivo dela e a próxima ação."
      />

      <Card className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nicho do prospect" htmlFor="p-nicho">
          <Select id="p-nicho" value={nicheId} onChange={(e) => setNicheId(e.target.value)}>
            <option value="">Qualquer nicho</option>
            {content.niches.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Serviço que está vendendo" htmlFor="p-servico">
          <Select id="p-servico" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="">Não definido</option>
            {content.services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Canal de contato" htmlFor="p-canal">
          <Select id="p-canal" value={canal} onChange={(e) => setCanal(e.target.value as ChannelId)}>
            {CHANNEL_ORDER.map((c) => (
              <option key={c} value={c}>
                {CHANNELS[c].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Etapa da conversa" htmlFor="p-etapa">
          <Select id="p-etapa" value={etapa} onChange={(e) => setEtapa(e.target.value as StageId)}>
            {STAGES.map((s, i) => (
              <option key={s.id} value={s.id}>
                {i + 1}. {s.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Objeção recebida (opcional)" htmlFor="p-obj">
          <Select id="p-obj" value={objectionId} onChange={(e) => setObjectionId(e.target.value)}>
            <option value="">Nenhuma</option>
            {content.objections.map((o) => (
              <option key={o.id} value={o.id}>
                {o.frase}
              </option>
            ))}
          </Select>
        </Field>
        <div>
          <span className="label">Situação da empresa</span>
          <Tabs<Situacao> value={situacao} onChange={setSituacao} items={SITUACOES.map((s) => ({ id: s.id, label: s.label }))} className="border-b-0" />
        </div>
      </Card>

      {output && stage && (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-5" data-testid="prospect-output">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{output.titulo}</p>
              <Badge tone="accent">{stage.nome}</Badge>
            </div>
            {'assunto' in output && output.assunto && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-line bg-bg/50 px-3 py-2 text-sm">
                <Mail size={14} className="text-dim" />
                <span className="text-dim">Assunto:</span>
                <span className="text-fg">{output.assunto}</span>
              </div>
            )}
            <MessageText text={output.texto} />
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={'assunto' in output && output.assunto ? `Assunto: ${output.assunto}\n\n${output.texto}` : output.texto} itemKind="prospect" itemId={stage.id} />
              <Button
                size="sm"
                icon={<Save size={14} />}
                onClick={async () => {
                  try {
                    await saveCustomResponse({ titulo: `Prospecção · ${stage.nome}${niche ? ` · ${niche.nome}` : ''}`, texto: output.texto, origem: 'manual', nicheId: niche?.id, serviceId: service?.id });
                    toast.show('Salvo em "Minhas respostas".');
                  } catch (e) {
                    toast.show((e as Error).message, 'error');
                  }
                }}
              >
                Salvar
              </Button>
            </div>
            {niche && etapa === 'primeiro-contato' && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="eyebrow mb-1.5 flex items-center gap-1.5">
                  <Compass size={12} /> Pergunta de abertura para {niche.nome.toLowerCase()}
                </p>
                <MessageText text={niche.aberturaProspeccao} className="text-sm" />
                <div className="mt-2">
                  <CopyButton text={niche.aberturaProspeccao} itemKind="niche" itemId={niche.id} />
                </div>
              </div>
            )}
            {objection && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="eyebrow mb-1.5">Resposta para “{objection.frase}”</p>
                <MessageText text={objectionText} className="text-sm" />
                <div className="mt-2 flex gap-2">
                  <CopyButton text={objectionText} itemKind="objection" itemId={objection.id} />
                  <Link to={`/objecoes/${objection.id}`}>
                    <Button size="sm" variant="ghost">
                      Ficha completa →
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-3">
            <Card className="p-4">
              <p className="eyebrow mb-1.5 flex items-center gap-1.5">
                <Flag size={12} /> Objetivo desta mensagem
              </p>
              <p className="text-sm text-muted">{stage.objetivo}</p>
            </Card>
            <Card className="p-4">
              <p className="eyebrow mb-1.5 flex items-center gap-1.5">
                <ArrowRight size={12} /> Próxima ação sugerida
              </p>
              <p className="text-sm text-muted">{stage.proximaAcao}</p>
              {nextStage && (
                <Button size="sm" variant="ghost" className="mt-2 -ml-2" onClick={() => setEtapa(nextStage.id)}>
                  Ir para “{nextStage.nome}” →
                </Button>
              )}
            </Card>
            <Card className="p-4">
              <p className="eyebrow mb-1.5">Regra do canal: {CHANNELS[canal].label}</p>
              <p className="text-sm text-muted">{CHANNELS[canal].regra}</p>
            </Card>
            <Notice tone="warn" icon={<AlertTriangle size={16} />} title="Cuidado">
              {stage.cuidado}
            </Notice>
          </div>
        </div>
      )}

      <section>
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Radar size={16} className="text-accent" /> Estratégias para prospecção fria
          </span>
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {COLD_STRATEGIES.map((s) => (
            <Card key={s.titulo} className="p-4">
              <p className="font-medium">{s.titulo}</p>
              <p className="mt-1 text-sm text-muted">{s.descricao}</p>
              <ol className="mt-3 space-y-1.5">
                {s.passos.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-accent/10 text-[11px] font-semibold text-accent-strong">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
