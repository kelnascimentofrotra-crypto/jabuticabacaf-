import { useMemo, useState } from 'react';
import { Copy, FileText, HandCoins, ListPlus, Plus, Printer, Save, Trash2 } from 'lucide-react';
import { useApp } from '../data/store';
import type { Proposal, ProposalTier } from '../types';
import { discountSuggestions, emptyProposal, newItem, proposalToText } from '../lib/proposal';
import { formatBRL, uid } from '../lib/text';
import { Badge, Button, Card, CopyButton, EmptyState, Field, Input, MessageText, Notice, PageHeader, Select, Textarea, cn } from '../components/ui';
import { useToast } from '../components/ui/toast';

function parseMoney(v: string): number | null {
  const s = v.replace(/[^\d,.-]/g, '');
  if (!s) return null;
  const normalized = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function MoneyInput({ value, onChange, id, placeholder }: { value: number | null; onChange: (v: number | null) => void; id: string; placeholder?: string }) {
  const [text, setText] = useState(value === null ? '' : String(value).replace('.', ','));
  return (
    <Input
      id={id}
      inputMode="decimal"
      value={text}
      placeholder={placeholder ?? 'R$ 0,00'}
      onChange={(e) => {
        setText(e.target.value);
        onChange(parseMoney(e.target.value));
      }}
    />
  );
}

function TierEditor({ tier, onChange, suggestions }: { tier: ProposalTier; onChange: (t: ProposalTier) => void; suggestions: string[] }) {
  const update = (patch: Partial<ProposalTier>) => onChange({ ...tier, ...patch });
  return (
    <Card className={cn('p-4 transition-opacity', !tier.ativo && 'opacity-60')}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-semibold">{tier.nome}</p>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={tier.ativo} onChange={(e) => update({ ativo: e.target.checked })} className="accent-emerald-500" />
          Incluir na proposta
        </label>
      </div>
      <p className="label">Funcionalidades</p>
      <ul className="space-y-1.5">
        {tier.funcionalidades.map((f, i) => (
          <li key={f.id} className="flex items-center gap-2">
            <Input
              value={f.texto}
              aria-label={`Funcionalidade ${i + 1} da versão ${tier.nome}`}
              onChange={(e) => update({ funcionalidades: tier.funcionalidades.map((x) => (x.id === f.id ? { ...x, texto: e.target.value } : x)) })}
              className="h-9"
            />
            <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-dim" title="Essencial para a primeira entrega">
              <input
                type="checkbox"
                checked={f.prioritario}
                onChange={(e) => update({ funcionalidades: tier.funcionalidades.map((x) => (x.id === f.id ? { ...x, prioritario: e.target.checked } : x)) })}
                className="accent-emerald-500"
              />
              Prioritário
            </label>
            <Button size="icon" variant="ghost" aria-label="Remover funcionalidade" icon={<Trash2 size={13} />} onClick={() => update({ funcionalidades: tier.funcionalidades.filter((x) => x.id !== f.id) })} />
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button size="sm" icon={<Plus size={13} />} onClick={() => update({ funcionalidades: [...tier.funcionalidades, newItem('')] })}>
          Adicionar
        </Button>
        {suggestions.length > 0 && tier.funcionalidades.length === 0 && (
          <Button size="sm" variant="ghost" icon={<ListPlus size={13} />} onClick={() => update({ funcionalidades: suggestions.map((s) => newItem(s)) })}>
            Usar entregáveis do serviço
          </Button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Field label="Prazo estimado" htmlFor={`${tier.nome}-prazo`}>
            <Input id={`${tier.nome}-prazo`} value={tier.prazo} onChange={(e) => update({ prazo: e.target.value })} placeholder="Ex.: 20 dias úteis" />
          </Field>
        </div>
        <Field label="Implantação" htmlFor={`${tier.nome}-valor`}>
          <MoneyInput id={`${tier.nome}-valor`} value={tier.valorImplantacao} onChange={(v) => update({ valorImplantacao: v })} />
        </Field>
        <Field label="Mensal (opcional)" htmlFor={`${tier.nome}-mensal`}>
          <MoneyInput id={`${tier.nome}-mensal`} value={tier.mensalidade} onChange={(v) => update({ mensalidade: v })} />
        </Field>
      </div>
      <div className="mt-2">
        <Field label="Observação" htmlFor={`${tier.nome}-obs`}>
          <Input id={`${tier.nome}-obs`} value={tier.observacao} onChange={(e) => update({ observacao: e.target.value })} placeholder="Ex.: Ideal para começar e validar" />
        </Field>
      </div>
    </Card>
  );
}

export default function Proposals() {
  const { content, data, saveProposal, deleteProposal } = useApp();
  const toast = useToast();
  const [draft, setDraft] = useState<Proposal>(() => data.proposals[0] ?? emptyProposal());
  const [editorKey, setEditorKey] = useState(0);
  const [tierForDiscount, setTierForDiscount] = useState(1);
  const [pedido, setPedido] = useState('');

  const set = <K extends keyof Proposal>(k: K, v: Proposal[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const service = content.services.find((s) => s.id === draft.servico);
  const discount = useMemo(() => discountSuggestions(draft, tierForDiscount, pedido), [draft, tierForDiscount, pedido]);
  const text = useMemo(() => proposalToText(draft, content.services), [draft, content.services]);
  const isSaved = data.proposals.some((p) => p.id === draft.id);

  const load = (p: Proposal) => {
    setDraft(p);
    setEditorKey((k) => k + 1);
  };

  const save = async () => {
    try {
      const p = { ...draft, updatedAt: new Date().toISOString() };
      await saveProposal(p);
      setDraft(p);
      toast.show('Proposta salva.');
    } catch (e) {
      toast.show((e as Error).message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Montador de propostas"
          subtitle="Monte até três versões (Essencial, Profissional e Completa) com escopo, prazo, valores e limites claros. Os valores são sempre definidos por você."
          actions={
            <>
              <Button icon={<Plus size={15} />} onClick={() => load(emptyProposal())}>
                Nova
              </Button>
              <Button variant="primary" icon={<Save size={15} />} onClick={save}>
                Salvar
              </Button>
            </>
          }
        />
      </div>

      <div className="no-print grid gap-6 xl:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          <p className="eyebrow">Propostas salvas</p>
          {data.proposals.length === 0 && <p className="text-sm text-dim">Nenhuma ainda.</p>}
          {data.proposals.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => load(p)}
              className={cn('card card-hover block w-full p-3 text-left', p.id === draft.id && 'border-accent/40')}
            >
              <p className="truncate text-sm font-medium">{p.cliente || 'Sem nome'}</p>
              <p className="truncate text-xs text-dim">{content.services.find((s) => s.id === p.servico)?.nome ?? 'Serviço não definido'}</p>
            </button>
          ))}
        </aside>

        <div className="space-y-4" key={editorKey}>
          <Card className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nome do cliente" htmlFor="pr-cliente">
              <Input id="pr-cliente" value={draft.cliente} onChange={(e) => set('cliente', e.target.value)} placeholder="Ex.: Barbearia do Centro" />
            </Field>
            <Field label="Nicho" htmlFor="pr-nicho">
              <Select id="pr-nicho" value={draft.nicho} onChange={(e) => set('nicho', e.target.value)}>
                <option value="">Não definido</option>
                {content.niches.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo de solução" htmlFor="pr-servico">
              <Select id="pr-servico" value={draft.servico} onChange={(e) => set('servico', e.target.value)}>
                <option value="">Não definido</option>
                {content.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Escopo (objetivo do projeto)" htmlFor="pr-escopo">
                <Textarea id="pr-escopo" value={draft.escopo} onChange={(e) => set('escopo', e.target.value)} className="min-h-[64px]" placeholder="Ex.: Site para apresentar os serviços, facilitar o agendamento e reunir as informações hoje espalhadas no Instagram." />
              </Field>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {draft.tiers.map((t, i) => (
              <TierEditor
                key={t.nome}
                tier={t}
                suggestions={service?.entregaveis ?? []}
                onChange={(nt) => set('tiers', draft.tiers.map((x, j) => (j === i ? nt : x)))}
              />
            ))}
          </div>

          <Card className="grid gap-3 p-4 sm:grid-cols-2">
            <Field label="Hospedagem" htmlFor="pr-host">
              <Input id="pr-host" value={draft.hospedagem} onChange={(e) => set('hospedagem', e.target.value)} placeholder="Ex.: Paga pelo cliente, em seu nome (aprox. R$ X/ano)" />
            </Field>
            <Field label="Manutenção" htmlFor="pr-man">
              <Input id="pr-man" value={draft.manutencao} onChange={(e) => set('manutencao', e.target.value)} placeholder="Ex.: Opcional, R$ X/mês, até 3 alterações" />
            </Field>
            <Field label="Integrações" htmlFor="pr-int">
              <Input id="pr-int" value={draft.integracoes} onChange={(e) => set('integracoes', e.target.value)} placeholder="Ex.: WhatsApp, Google Agenda (sujeito à API)" />
            </Field>
            <Field label="Condições de pagamento" htmlFor="pr-pag">
              <Input id="pr-pag" value={draft.pagamento} onChange={(e) => set('pagamento', e.target.value)} placeholder="Ex.: 50% no início, 50% na publicação" />
            </Field>
            <Field label="Limites do projeto" htmlFor="pr-lim">
              <Textarea id="pr-lim" value={draft.limites} onChange={(e) => set('limites', e.target.value)} className="min-h-[60px]" placeholder="Ex.: Até 2 rodadas de ajuste; textos fornecidos pelo cliente; sem loja virtual." />
            </Field>
            <Field label="Itens opcionais" htmlFor="pr-opc">
              <Textarea id="pr-opc" value={draft.opcionais} onChange={(e) => set('opcionais', e.target.value)} className="min-h-[60px]" placeholder="Ex.: Sessão de fotos, blog, página em inglês." />
            </Field>
            <Field label="Validade da proposta" htmlFor="pr-val">
              <Input id="pr-val" value={draft.validade} onChange={(e) => set('validade', e.target.value)} />
            </Field>
            <div className="flex flex-wrap items-end gap-2">
              <Button variant="primary" icon={<Save size={15} />} onClick={save}>
                {isSaved ? 'Salvar alterações' : 'Salvar proposta'}
              </Button>
              <Button
                icon={<Copy size={15} />}
                onClick={() => {
                  load({ ...draft, id: uid('p_'), cliente: `${draft.cliente} (cópia)`, createdAt: new Date().toISOString() });
                  toast.show('Cópia criada. Salve para manter.');
                }}
              >
                Duplicar
              </Button>
              {isSaved && (
                <Button
                  variant="danger"
                  icon={<Trash2 size={15} />}
                  onClick={async () => {
                    await deleteProposal(draft.id);
                    load(emptyProposal());
                    toast.show('Proposta excluída.');
                  }}
                >
                  Excluir
                </Button>
              )}
            </div>
          </Card>

          {/* Pedido de desconto */}
          <Card className="p-4 sm:p-5">
            <p className="mb-1 flex items-center gap-2 font-semibold">
              <HandCoins size={17} className="text-accent" /> O cliente pediu desconto?
            </p>
            <p className="mb-4 text-sm text-muted">Sugestões para ajustar escopo, dividir em fases ou mudar funcionalidades — sem alterar preços automaticamente nem inventar condições.</p>
            <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
              <Field label="Versão em negociação" htmlFor="d-tier">
                <Select id="d-tier" value={tierForDiscount} onChange={(e) => setTierForDiscount(Number(e.target.value))}>
                  {draft.tiers.map((t, i) => (
                    <option key={t.nome} value={i}>
                      {t.nome} {t.valorImplantacao !== null ? `· ${formatBRL(t.valorImplantacao)}` : ''}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="O que o cliente pediu" htmlFor="d-pedido">
                <Input id="d-pedido" value={pedido} onChange={(e) => setPedido(e.target.value)} placeholder="Ex.: 20% de desconto, ou fazer por R$ 1.500" />
              </Field>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2" data-testid="discount-suggestions">
              {discount.sugestoes.map((s) => (
                <div key={s.titulo} className="rounded-lg border border-line bg-bg/50 p-3.5">
                  <p className="text-sm font-medium">{s.titulo}</p>
                  <p className="mt-1 text-sm text-muted">{s.detalhe}</p>
                  {s.itens && (
                    <ul className="mt-2 space-y-1 text-sm text-fg">
                      {s.itens.map((it) => (
                        <li key={it}>• {it}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            {discount.mensagem && (
              <div className="mt-4 rounded-lg border border-accent/25 bg-accent/[0.04] p-4">
                <p className="eyebrow mb-1.5">Resposta sugerida ao cliente</p>
                <MessageText text={discount.mensagem} />
                <div className="mt-3">
                  <CopyButton text={discount.mensagem} itemKind="proposal" />
                </div>
              </div>
            )}
          </Card>

          {/* Prévia */}
          <Card className="p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-semibold">
                <FileText size={17} className="text-accent" /> Prévia
              </p>
              <div className="flex gap-2">
                <CopyButton text={text} label="Copiar texto" itemKind="proposal" />
                <Button size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>
                  Imprimir / PDF
                </Button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-line bg-bg/60 p-4 font-sans text-sm leading-relaxed text-muted" data-testid="proposal-preview">
              {text}
            </pre>
          </Card>
          <Notice tone="info">Revise prazos e valores antes de enviar. Itens fora da lista não fazem parte do escopo.</Notice>
        </div>
      </div>

      {/* Versão de impressão */}
      <div className="print-area hidden">
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Proposta comercial — {draft.cliente || 'Cliente'}</h1>
        {service && <p style={{ marginBottom: 12 }}>Solução: {service.nome}</p>}
        {draft.escopo && <p style={{ marginBottom: 16 }}>{draft.escopo}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, draft.tiers.filter((t) => t.ativo).length)}, 1fr)`, gap: 12 }}>
          {draft.tiers
            .filter((t) => t.ativo)
            .map((t) => (
              <div key={t.nome} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                <p style={{ fontWeight: 600 }}>{t.nome}</p>
                <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
                  {t.funcionalidades.filter((f) => f.texto.trim()).map((f) => (
                    <li key={f.id}>{f.texto}</li>
                  ))}
                </ul>
                {t.prazo && <p>Prazo: {t.prazo}</p>}
                {t.valorImplantacao !== null && <p>Implantação: {formatBRL(t.valorImplantacao)}</p>}
                {t.mensalidade !== null && <p>Mensal: {formatBRL(t.mensalidade)}</p>}
              </div>
            ))}
        </div>
        <div style={{ marginTop: 16 }}>
          {[
            ['Hospedagem', draft.hospedagem],
            ['Manutenção', draft.manutencao],
            ['Integrações', draft.integracoes],
            ['Condições de pagamento', draft.pagamento],
            ['Limites do projeto', draft.limites],
            ['Itens opcionais', draft.opcionais],
            ['Validade', draft.validade],
          ]
            .filter(([, v]) => v.trim())
            .map(([k, v]) => (
              <p key={k} style={{ marginBottom: 4 }}>
                <strong>{k}:</strong> {v}
              </p>
            ))}
        </div>
      </div>
      {data.proposals.length === 0 && !draft.cliente && (
        <div className="no-print">
          <EmptyState icon={<Badge tone="accent">Dica</Badge>} title="Comece pelo tipo de solução">
            Escolha o serviço e use os entregáveis como base para a versão Essencial. Marque como “prioritário” o que precisa estar na primeira entrega — isso alimenta as sugestões de fases quando o cliente pedir desconto.
          </EmptyState>
        </div>
      )}
    </div>
  );
}
