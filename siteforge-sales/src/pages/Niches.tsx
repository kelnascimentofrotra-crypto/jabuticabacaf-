import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { useApp } from '../data/store';
import { NICHE_CATEGORIES, NICHE_CATEGORY_ORDER } from '../content/taxonomy';
import type { NicheCategoryId } from '../types';
import { NICHE_ICON } from '../components/icons';
import { Chip, EmptyState, Input, PageHeader } from '../components/ui';
import { normalize } from '../lib/normalize';

export default function Niches() {
  const { content } = useApp();
  const [params, setParams] = useSearchParams();
  const cat = (params.get('cat') as NicheCategoryId | null) ?? '';
  const q = params.get('q') ?? '';

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return content.niches.filter((n) => (!cat || n.categoria === cat) && (!nq || normalize(`${n.nome} ${n.resumo}`).includes(nq)));
  }, [content.niches, cat, q]);

  return (
    <div>
      <PageHeader
        title="Biblioteca de nichos"
        subtitle={`${content.niches.length} tipos de negócio com objeções específicas, exemplos de conversa, argumentos de valor e soluções digitais adequadas.`}
      />
      <div className="mb-5 space-y-3">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <Input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Buscar nicho: barbearia, dentista, pizzaria…" className="pl-9" aria-label="Buscar nicho" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!cat} onClick={() => set('cat', '')}>
            Todos
          </Chip>
          {NICHE_CATEGORY_ORDER.map((c) => {
            const Icon = NICHE_ICON[c];
            return (
              <Chip key={c} active={cat === c} onClick={() => set('cat', cat === c ? '' : c)} icon={<Icon size={13} />}>
                {NICHE_CATEGORIES[c].label}
              </Chip>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && <EmptyState title="Nenhum nicho encontrado">Tente outro termo ou limpe o filtro de categoria.</EmptyState>}

      <div className="space-y-8">
        {NICHE_CATEGORY_ORDER.map((c) => {
          const list = filtered.filter((n) => n.categoria === c);
          if (!list.length) return null;
          const Icon = NICHE_ICON[c];
          return (
            <section key={c}>
              <div className="mb-3 flex items-center gap-2">
                <Icon size={16} className="text-accent" />
                <h2 className="text-[15px] font-semibold">{NICHE_CATEGORIES[c].label}</h2>
                <span className="text-xs text-dim">· {NICHE_CATEGORIES[c].descricao}</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((n) => (
                  <Link key={n.id} to={`/nichos/${n.id}`} className="card card-hover group flex flex-col p-4" data-testid="niche-card">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{n.nome}</p>
                      <ChevronRight size={15} className="text-dim transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted">{n.resumo}</p>
                    <p className="mt-3 text-xs text-dim">
                      {n.objecoes.length} objeções específicas · {n.solucoes.length} soluções indicadas
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
