import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import { useApp } from '../data/store';
import {
  CATEGORIES,
  CATEGORY_ORDER,
  CHANNELS,
  CHANNEL_ORDER,
  OBJECTIVES,
  OBJECTIVE_ORDER,
  RESISTANCE,
  SERVICE_KINDS,
  SERVICE_KIND_ORDER,
  STAGES,
} from '../content/taxonomy';
import type { ChannelId, ObjectionCategory, ObjectiveId, Resistance, ServiceKind, StageId } from '../types';
import { ObjectionCard } from '../components/objection';
import { CATEGORY_ICON } from '../components/icons';
import { Button, Chip, EmptyState, Input, PageHeader, Select, Tabs } from '../components/ui';
import { normalize } from '../lib/normalize';

type Lib = 'todas' | 'geral' | 'sistema';

export default function Objections() {
  const { content } = useApp();
  const [params, setParams] = useSearchParams();
  const lib = (params.get('lib') as Lib) || 'todas';
  const cat = (params.get('cat') as ObjectionCategory | null) ?? '';
  const q = params.get('q') ?? '';
  const servico = (params.get('servico') as ServiceKind | null) ?? '';
  const resistencia = (params.get('resistencia') as Resistance | null) ?? '';
  const etapa = (params.get('etapa') as StageId | null) ?? '';
  const objetivo = (params.get('objetivo') as ObjectiveId | null) ?? '';
  const canal = (params.get('canal') as ChannelId | null) ?? '';

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const nq = normalize(q);
    return content.objections.filter((o) => {
      if (lib !== 'todas' && o.biblioteca !== lib) return false;
      if (cat && o.categoria !== cat) return false;
      if (servico && !o.servicos.includes(servico)) return false;
      if (resistencia && o.resistencia !== resistencia) return false;
      if (etapa && !o.etapas.includes(etapa)) return false;
      if (objetivo && !o.objetivos.includes(objetivo)) return false;
      if (nq) {
        const hay = normalize([o.frase, ...o.gatilhos, o.respostas.curta].join(' '));
        if (!nq.split(' ').every((t) => hay.includes(t))) return false;
      }
      return true;
    });
  }, [content.objections, lib, cat, servico, resistencia, etapa, objetivo, q]);

  const libCounts = {
    todas: content.objections.length,
    geral: content.objections.filter((o) => o.biblioteca === 'geral').length,
    sistema: content.objections.filter((o) => o.biblioteca === 'sistema').length,
  };
  const activeFilters = [servico, resistencia, etapa, objetivo, canal, cat, q].filter(Boolean).length;

  return (
    <div>
      <PageHeader
        title="Biblioteca de objeções"
        subtitle="Cada ficha traz o que a objeção pode significar, a estratégia, respostas para WhatsApp, ligação e reunião, o que não dizer e variações por serviço."
      />

      <Tabs<Lib>
        value={lib}
        onChange={(v) => set('lib', v === 'todas' ? '' : v)}
        items={[
          { id: 'todas', label: 'Todas', count: libCounts.todas },
          { id: 'geral', label: 'Venda de sites e soluções', count: libCounts.geral },
          { id: 'sistema', label: 'Sistemas personalizados', count: libCounts.sistema },
        ]}
        className="mb-4"
      />

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por tipo">
        <Chip active={!cat} onClick={() => set('cat', '')}>
          Todas
        </Chip>
        {CATEGORY_ORDER.map((c) => {
          const Icon = CATEGORY_ICON[c];
          return (
            <Chip key={c} active={cat === c} onClick={() => set('cat', cat === c ? '' : c)} icon={<Icon size={13} />}>
              {CATEGORIES[c].label}
            </Chip>
          );
        })}
      </div>

      <div className="card mb-5 grid gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative sm:col-span-2 lg:col-span-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <Input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Filtrar por palavra: caro, sócio, planilha…" className="pl-9" aria-label="Filtrar objeções" />
        </div>
        <Select value={servico} onChange={(e) => set('servico', e.target.value)} aria-label="Serviço">
          <option value="">Todos os serviços</option>
          {SERVICE_KIND_ORDER.map((k) => (
            <option key={k} value={k}>
              {SERVICE_KINDS[k].label}
            </option>
          ))}
        </Select>
        <Select value={etapa} onChange={(e) => set('etapa', e.target.value)} aria-label="Etapa da venda">
          <option value="">Todas as etapas</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </Select>
        <Select value={resistencia} onChange={(e) => set('resistencia', e.target.value)} aria-label="Nível de resistência">
          <option value="">Qualquer resistência</option>
          {(Object.keys(RESISTANCE) as Resistance[]).map((r) => (
            <option key={r} value={r}>
              Resistência {RESISTANCE[r].label.toLowerCase()}
            </option>
          ))}
        </Select>
        <Select value={objetivo} onChange={(e) => set('objetivo', e.target.value)} aria-label="Objetivo da resposta">
          <option value="">Qualquer objetivo</option>
          {OBJECTIVE_ORDER.map((k) => (
            <option key={k} value={k}>
              {OBJECTIVES[k].label}
            </option>
          ))}
        </Select>
        <Select value={canal} onChange={(e) => set('canal', e.target.value)} aria-label="Canal (muda a prévia da resposta)">
          <option value="">Prévia: WhatsApp</option>
          {CHANNEL_ORDER.filter((c) => c !== 'whatsapp').map((c) => (
            <option key={c} value={c}>
              Prévia: {CHANNELS[c].label}
            </option>
          ))}
        </Select>
        <div className="flex items-center justify-between gap-2 sm:col-span-2 lg:col-span-1">
          <span className="flex items-center gap-1.5 text-xs text-dim" data-testid="result-count">
            <Filter size={12} /> {list.length} {list.length === 1 ? 'objeção' : 'objeções'}
          </span>
          {activeFilters > 0 && (
            <Button size="sm" variant="ghost" icon={<X size={13} />} onClick={() => setParams(lib === 'todas' ? {} : { lib }, { replace: true })}>
              Limpar
            </Button>
          )}
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-2.5 lg:grid-cols-2">
          {list.map((o) => (
            <ObjectionCard key={o.id} o={o} canal={canal} />
          ))}
        </div>
      ) : (
        <EmptyState icon={<Search size={22} />} title="Nenhuma objeção com esses filtros">
          Tente remover algum filtro ou use a Busca avançada, que encontra frases parecidas.
        </EmptyState>
      )}
    </div>
  );
}
