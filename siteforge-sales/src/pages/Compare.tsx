import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { useApp } from '../data/store';
import { CATEGORIES, CATEGORY_TO_ANGLE, SERVICE_KINDS, SERVICE_KIND_ORDER } from '../content/taxonomy';
import { SERVICE_ICON, NICHE_ICON } from '../components/icons';
import { Badge, Button, Card, Field, Notice, PageHeader, Select, SectionTitle } from '../components/ui';

const DEFAULT_NICHES = ['barbearias', 'imobiliarias', 'clinicas-medicas', 'lojas-de-roupas', 'industrias', 'distribuidoras'];

export default function Compare() {
  const { content } = useApp();
  const [params, setParams] = useSearchParams();
  const objectionId = params.get('objecao') ?? 'esta-muito-caro';
  const fromParam = params.get('nichos')?.split(',').filter(Boolean);
  const [selected, setSelected] = useState<string[]>(() => {
    const base = fromParam?.length ? [...fromParam, ...DEFAULT_NICHES.filter((d) => !fromParam.includes(d))] : DEFAULT_NICHES;
    return base.slice(0, 6);
  });
  const [toAdd, setToAdd] = useState('');

  const o = content.objections.find((x) => x.id === objectionId) ?? content.objections[0];
  const angle = CATEGORY_TO_ANGLE[o.categoria];
  const niches = useMemo(() => selected.map((id) => content.niches.find((n) => n.id === id)).filter(Boolean), [selected, content.niches]);

  const setObjection = (id: string) => {
    const next = new URLSearchParams(params);
    next.set('objecao', id);
    setParams(next, { replace: true });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Comparar estratégias"
        subtitle="Veja como a mesma objeção muda conforme o nicho e o serviço. Relacione funcionalidades às necessidades reais de cada negócio."
      />

      <Card className="grid gap-3 p-4 md:grid-cols-[1.4fr_1fr]">
        <Field label="Objeção" htmlFor="cmp-obj">
          <Select id="cmp-obj" value={o.id} onChange={(e) => setObjection(e.target.value)}>
            <optgroup label="Venda de sites e soluções">
              {content.objections
                .filter((x) => x.biblioteca === 'geral')
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.frase}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Sistemas personalizados">
              {content.objections
                .filter((x) => x.biblioteca === 'sistema')
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.frase}
                  </option>
                ))}
            </optgroup>
          </Select>
        </Field>
        <Field label={`Adicionar nicho (${selected.length}/6)`} htmlFor="cmp-add">
          <div className="flex gap-2">
            <Select id="cmp-add" value={toAdd} onChange={(e) => setToAdd(e.target.value)} disabled={selected.length >= 6}>
              <option value="">Escolha um nicho…</option>
              {content.niches
                .filter((n) => !selected.includes(n.id))
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nome}
                  </option>
                ))}
            </Select>
            <Button
              icon={<Plus size={15} />}
              disabled={!toAdd || selected.length >= 6}
              onClick={() => {
                setSelected((s) => [...s, toAdd]);
                setToAdd('');
              }}
            >
              Adicionar
            </Button>
          </div>
        </Field>
      </Card>

      <Notice tone="warn" icon={<AlertTriangle size={16} />} title="Regra de ouro">
        Nunca prometa aumento garantido de vendas. Mostre como cada funcionalidade resolve uma necessidade real do negócio — e deixe o cliente tirar a conclusão.
      </Notice>

      <section>
        <SectionTitle>
          “{o.frase}” <span className="font-normal text-dim">por nicho</span>
        </SectionTitle>
        <p className="-mt-2 mb-3 text-sm text-dim">
          Tipo: {CATEGORIES[o.categoria].label}. Estratégia base: {o.estrategia}
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" data-testid="compare-grid">
          {niches.map((n) => {
            if (!n) return null;
            const Icon = NICHE_ICON[n.categoria];
            return (
              <Card key={n.id} className="flex flex-col p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Link to={`/nichos/${n.id}`} className="flex items-center gap-2 font-medium hover:text-accent-strong">
                    <Icon size={15} className="text-accent" /> {n.nome}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Remover ${n.nome}`}
                    className="rounded p-1 text-dim hover:bg-raised hover:text-fg"
                    onClick={() => setSelected((s) => s.filter((x) => x !== n.id))}
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted">{n.angulos[angle]}</p>
                <div className="mt-3 border-t border-line pt-3">
                  <p className="eyebrow mb-1">Pergunta para descobrir a necessidade</p>
                  <p className="text-sm text-fg">{n.perguntas[0]}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {n.solucoes.slice(0, 2).map((s) => {
                    const svc = content.services.find((x) => x.id === s.servico);
                    return svc ? <Badge key={s.servico}>{svc.nome}</Badge> : null;
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle>
          “{o.frase}” <span className="font-normal text-dim">por serviço</span>
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SERVICE_KIND_ORDER.map((k) => {
            const Icon = SERVICE_ICON[k];
            const text = o.variacoes[k];
            return (
              <Card key={k} className="p-4">
                <p className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <Icon size={15} className="text-accent" /> {SERVICE_KINDS[k].label}
                </p>
                <p className="text-sm leading-relaxed text-muted">{text ?? 'Esta objeção raramente aparece neste tipo de venda.'}</p>
              </Card>
            );
          })}
        </div>
        <p className="mt-4 text-sm">
          <Link to={`/objecoes/${o.id}`} className="text-accent-strong hover:underline">
            Abrir a ficha completa desta objeção →
          </Link>
        </p>
      </section>
    </div>
  );
}
