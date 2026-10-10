import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, BookOpen, Bot, Compass, Info, Library, Lightbulb, RefreshCw, Save, SearchX, Sparkles } from 'lucide-react';
import { useApp } from '../data/store';
import { OBJECTIVES, OBJECTIVE_ORDER, SERVICE_KINDS, TONES, type ToneId } from '../content/taxonomy';
import type { ObjectiveId } from '../types';
import { compose, type ComposeResult, type ResponseKind } from '../lib/composer';
import { aiGenerate, aiVariant } from '../lib/ai';
import { Badge, Button, Card, Chip, CopyButton, EmptyState, Field, Input, MessageText, Notice, PageHeader, Select, Textarea, cn } from '../components/ui';
import { useToast } from '../components/ui/toast';

interface FormState {
  nicheId: string;
  serviceId: string;
  preco: string;
  mensagem: string;
  historico: string;
  objetivo: ObjectiveId;
  tom: ToneId;
}

type AIState = Partial<Record<ResponseKind, string>> & { observacao?: string };

export default function Generator() {
  const { content, index, ai, saveCustomResponse, addHistory, logEvent } = useApp();
  const toast = useToast();
  const [params] = useSearchParams();
  const [form, setForm] = useState<FormState>({
    nicheId: params.get('nicho') ?? '',
    serviceId: params.get('servico') ?? '',
    preco: '',
    mensagem: params.get('msg') ?? '',
    historico: '',
    objetivo: 'descobrir-necessidade',
    tom: 'proximo',
  });
  const [useAI, setUseAI] = useState(false);
  const [result, setResult] = useState<ComposeResult | null>(null);
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [forcedKey, setForcedKey] = useState<string | undefined>();
  const [versions, setVersions] = useState<Record<ResponseKind, number>>({ natural: 0, estrategica: 0, comercial: 0 });
  const [aiOut, setAiOut] = useState<AIState | null>(null);
  const [loading, setLoading] = useState(false);
  const [variantLoading, setVariantLoading] = useState<ResponseKind | null>(null);

  useEffect(() => setUseAI(ai.configured), [ai.configured]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const niche = content.niches.find((n) => n.id === form.nicheId);
  const service = content.services.find((s) => s.id === form.serviceId);

  const run = async (state: FormState, key?: string) => {
    const r = compose({ ...state, forcedKey: key }, { index, niches: content.niches, services: content.services });
    setResult(r);
    setSubmitted(state);
    setVersions({ natural: 0, estrategica: 0, comercial: 0 });
    setAiOut(null);
    logEvent({ event: 'generate', itemKind: r.match?.objection ? 'objection' : undefined, itemId: r.match?.objection?.id });

    if (useAI && ai.configured && !r.recusaExplicita) {
      setLoading(true);
      try {
        const referencia = r.respostas.map((x) => `${x.titulo}: ${x.versoes[0]}`).join('\n') + (r.porque ? `\nEstratégia: ${r.porque}` : '');
        const out = await aiGenerate({
          nicho: niche?.nome,
          servico: service?.nome,
          preco: state.preco || undefined,
          mensagem: state.mensagem,
          historico: state.historico || undefined,
          objetivo: OBJECTIVES[state.objetivo].label,
          tom: TONES.find((t) => t.id === state.tom)?.label ?? state.tom,
          referencia,
        });
        setAiOut({ natural: out.natural, estrategica: out.estrategica, comercial: out.comercial, observacao: out.observacao });
      } catch (e) {
        toast.show(`A IA não respondeu (${(e as Error).message}). Exibindo respostas da biblioteca.`, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const submit = () => {
    if (!form.mensagem.trim()) return;
    setForcedKey(undefined);
    addHistory({ tipo: 'gerador', label: form.mensagem.trim().slice(0, 90), href: '/gerador' });
    run(form);
  };

  const currentText = (kind: ResponseKind): { text: string; source: 'ia' | 'biblioteca'; idx: number; total: number } | null => {
    const resp = result?.respostas.find((r) => r.tipo === kind);
    if (aiOut?.[kind]) return { text: aiOut[kind] as string, source: 'ia', idx: 0, total: 1 };
    if (!resp || !resp.versoes.length) return null;
    const idx = versions[kind] % resp.versoes.length;
    return { text: resp.versoes[idx], source: 'biblioteca', idx, total: resp.versoes.length };
  };

  const anotherVersion = async (kind: ResponseKind) => {
    const cur = currentText(kind);
    if (!cur || !submitted) return;
    if (useAI && ai.configured && !result?.recusaExplicita) {
      setVariantLoading(kind);
      try {
        const r = await aiVariant({
          tipo: kind,
          texto: cur.text,
          tom: TONES.find((t) => t.id === submitted.tom)?.label,
          contexto: `Mensagem do cliente: "${submitted.mensagem}". Objetivo: ${OBJECTIVES[submitted.objetivo].label}.${niche ? ` Nicho: ${niche.nome}.` : ''}${service ? ` Serviço: ${service.nome}.` : ''}`,
        });
        setAiOut((o) => ({ ...(o ?? {}), [kind]: r.texto }));
      } catch (e) {
        toast.show(`A IA não respondeu: ${(e as Error).message}`, 'error');
      } finally {
        setVariantLoading(null);
      }
    } else {
      setAiOut((o) => (o ? { ...o, [kind]: undefined } : o));
      setVersions((v) => ({ ...v, [kind]: v[kind] + 1 }));
    }
  };

  const save = async (kind: ResponseKind) => {
    const cur = currentText(kind);
    if (!cur || !submitted) return;
    try {
      await saveCustomResponse({
        titulo: submitted.mensagem.slice(0, 80),
        texto: cur.text,
        origem: cur.source === 'ia' ? 'ia' : 'gerador',
        objectionId: result?.match?.objection?.id,
        nicheId: submitted.nicheId || undefined,
        serviceId: submitted.serviceId || undefined,
      });
      toast.show('Resposta salva em "Minhas respostas".');
    } catch (e) {
      toast.show((e as Error).message, 'error');
    }
  };

  const matched = result?.match;
  const matchedTitle = matched?.objection?.frase ?? matched?.nicheObjection?.frase;
  const matchedHref = matched?.objection ? `/objecoes/${matched.objection.id}` : matched?.niche ? `/nichos/${matched.niche.id}#${matched.nicheObjection?.id}` : undefined;

  const aiNote = useMemo(() => {
    if (ai.configured) return null;
    return ai.reason ?? 'A IA não está configurada.';
  }, [ai]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerador de respostas"
        subtitle="Cole a mensagem exata do cliente e receba três respostas: natural, estratégica e comercial."
        eyebrow={
          useAI && ai.configured ? (
            <Badge tone="accent" icon={<Bot size={11} />}>
              Geração por IA{ai.model ? ` · ${ai.model}` : ''}
            </Badge>
          ) : (
            <Badge tone="neutral" icon={<Library size={11} />}>
              Modo biblioteca · conteúdo pré-cadastrado
            </Badge>
          )
        }
      />

      {aiNote ? (
        <Notice tone="info" icon={<Info size={16} />} title="Respostas da biblioteca, sem IA">
          As respostas vêm do conteúdo pré-cadastrado (objeções, nichos e serviços), escolhido pela semelhança com a mensagem do cliente. {aiNote}{' '}
          <Link to="/config" className="text-accent-strong hover:underline">
            Como ativar a IA
          </Link>
        </Notice>
      ) : (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-3.5">
          <p className="text-sm text-muted">
            {useAI ? 'A IA escreve as respostas usando a biblioteca como referência.' : 'Usando apenas a biblioteca pré-cadastrada.'}
          </p>
          <div className="flex gap-1.5">
            <Chip active={useAI} onClick={() => setUseAI(true)} icon={<Bot size={13} />}>
              IA
            </Chip>
            <Chip active={!useAI} onClick={() => setUseAI(false)} icon={<Library size={13} />}>
              Biblioteca
            </Chip>
          </div>
        </Card>
      )}

      <form
        className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="sm:col-span-2 lg:col-span-4">
          <Field label="Mensagem exata recebida *" htmlFor="g-msg">
            <Textarea
              id="g-msg"
              value={form.mensagem}
              onChange={(e) => set('mensagem', e.target.value)}
              placeholder="Cole aqui o que o cliente escreveu. Ex.: Achei um pouco caro, um amigo meu faz por menos. Vou pensar e te aviso."
              required
              data-testid="generator-message"
            />
          </Field>
        </div>
        <Field label="Nicho do cliente" htmlFor="g-nicho">
          <Select id="g-nicho" value={form.nicheId} onChange={(e) => set('nicheId', e.target.value)}>
            <option value="">Não informado</option>
            {content.niches.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Serviço oferecido" htmlFor="g-servico">
          <Select id="g-servico" value={form.serviceId} onChange={(e) => set('serviceId', e.target.value)}>
            <option value="">Não informado</option>
            {content.services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Objetivo comercial" htmlFor="g-obj">
          <Select id="g-obj" value={form.objetivo} onChange={(e) => set('objetivo', e.target.value as ObjectiveId)}>
            {OBJECTIVE_ORDER.map((k) => (
              <option key={k} value={k}>
                {OBJECTIVES[k].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tom da resposta" htmlFor="g-tom">
          <Select id="g-tom" value={form.tom} onChange={(e) => set('tom', e.target.value as ToneId)}>
            {TONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Preço da proposta" htmlFor="g-preco" hint="Opcional. Ex.: R$ 2.400">
          <Input id="g-preco" value={form.preco} onChange={(e) => set('preco', e.target.value)} placeholder="R$" />
        </Field>
        <div className="sm:col-span-2 lg:col-span-3">
          <Field
            label="Histórico resumido da negociação"
            htmlFor="g-hist"
            hint={ai.configured && useAI ? 'A IA considera o histórico ao escrever.' : 'Na biblioteca, o histórico é usado para detectar recusa explícita (nesse caso, a recomendação é encerrar). A IA usa o histórico completo.'}
          >
            <Textarea id="g-hist" value={form.historico} onChange={(e) => set('historico', e.target.value)} className="min-h-[60px]" placeholder="Ex.: Mandei proposta de site com agendamento na segunda; ele visualizou e respondeu hoje." />
          </Field>
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-4">
          <Button type="submit" variant="primary" icon={<Sparkles size={15} />} disabled={!form.mensagem.trim() || loading} className="w-full sm:w-auto">
            {loading ? 'Gerando com IA…' : 'Gerar respostas'}
          </Button>
        </div>
      </form>

      {result && (
        <section className="space-y-4" aria-live="polite">
          {result.recusaExplicita && (
            <Notice tone="warn" icon={<AlertTriangle size={16} />} title="Recusa explícita detectada">
              A mensagem ou o histórico indicam que o cliente recusou. As respostas abaixo encerram a conversa com profissionalismo. Não insista nem programe follow-up.
            </Notice>
          )}

          {!result.recusaExplicita && !matched && (
            <EmptyState icon={<SearchX size={22} />} title="Nenhuma objeção parecida na biblioteca">
              Tente reescrever com as palavras do cliente, escolha o nicho ou{' '}
              <Link to="/objecoes" className="text-accent-strong hover:underline">
                navegue pela biblioteca
              </Link>
              .{ai.configured ? ' Com a IA ativa, você também pode gerar uma resposta livre.' : ''}
            </EmptyState>
          )}

          {matched && matchedTitle && (
            <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="eyebrow mb-1">Objeção identificada · correspondência {matched.label}</p>
                <p className="font-medium">
                  “{matchedTitle}”{matched.niche && <span className="text-sm font-normal text-dim"> · {matched.niche.nome}</span>}
                </p>
              </div>
              {matchedHref && (
                <Link to={matchedHref}>
                  <Button size="sm" icon={<BookOpen size={14} />}>
                    Ficha completa
                  </Button>
                </Link>
              )}
            </Card>
          )}
          {result.outros.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-dim">Não é isso? Também pode ser:</span>
              {result.outros.map((h) => (
                <Chip
                  key={h.doc.key}
                  active={forcedKey === h.doc.key}
                  onClick={() => {
                    setForcedKey(h.doc.key);
                    if (submitted) run(submitted, h.doc.key);
                  }}
                >
                  {(h.doc.objection?.frase ?? h.doc.nicheObjection?.frase ?? '').slice(0, 60)}
                </Chip>
              ))}
            </div>
          )}

          {result.respostas.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-3">
              {result.respostas.map((r) => {
                const cur = currentText(r.tipo);
                if (!cur) return null;
                return (
                  <Card key={r.tipo} className={cn('flex flex-col p-5', loading && 'opacity-60')}>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{r.titulo}</p>
                        <p className="text-xs text-dim">{r.descricao}</p>
                      </div>
                      {cur.source === 'ia' ? (
                        <Badge tone="accent" icon={<Bot size={11} />}>
                          IA
                        </Badge>
                      ) : (
                        <Badge icon={<Library size={11} />}>
                          Biblioteca {cur.idx + 1}/{cur.total}
                        </Badge>
                      )}
                    </div>
                    <MessageText text={cur.text} className="flex-1" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <CopyButton text={cur.text} itemKind="generator" itemId={result.match?.objection?.id} />
                      <Button size="sm" icon={<RefreshCw size={14} className={variantLoading === r.tipo ? 'animate-spin' : ''} />} onClick={() => anotherVersion(r.tipo)} disabled={variantLoading !== null}>
                        Gerar outra versão
                      </Button>
                      <Button size="sm" variant="ghost" icon={<Save size={14} />} onClick={() => save(r.tipo)}>
                        Salvar
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {aiOut?.observacao && (
            <Notice tone="accent" icon={<Bot size={16} />} title="Observação da IA">
              {aiOut.observacao}
            </Notice>
          )}

          <div className="grid gap-3 lg:grid-cols-2">
            {result.porque && (
              <Card className="p-4">
                <p className="eyebrow mb-1.5 flex items-center gap-1.5">
                  <Lightbulb size={12} /> Por que essa abordagem
                </p>
                <p className="text-sm leading-relaxed text-muted">{result.porque}</p>
              </Card>
            )}
            {result.anguloNicho && niche && (
              <Card className="p-4">
                <p className="eyebrow mb-1.5 flex items-center gap-1.5">
                  <Compass size={12} /> Ângulo para {niche.nome.toLowerCase()}
                </p>
                <p className="text-sm leading-relaxed text-muted">{result.anguloNicho}</p>
              </Card>
            )}
            {result.variacaoServico && service && (
              <Card className="p-4">
                <p className="eyebrow mb-1.5">Ao vender {SERVICE_KINDS[service.grupo].label.toLowerCase()}</p>
                <p className="text-sm leading-relaxed text-muted">{result.variacaoServico}</p>
              </Card>
            )}
            {result.dicaPreco && (
              <Card className="p-4">
                <p className="eyebrow mb-1.5">Sobre o preço</p>
                <p className="text-sm leading-relaxed text-muted">
                  {result.dicaPreco}{' '}
                  <Link to="/propostas" className="text-accent-strong hover:underline">
                    Abrir propostas
                  </Link>
                </p>
              </Card>
            )}
          </div>
          {result.cuidados.length > 0 && (
            <Notice tone="warn" icon={<AlertTriangle size={16} />} title="Cuidados neste nicho">
              {result.cuidados.join(' ')}
            </Notice>
          )}
          <p className="text-xs text-dim">Campos entre colchetes, como [nome], devem ser preenchidos antes de enviar.</p>
        </section>
      )}
    </div>
  );
}
