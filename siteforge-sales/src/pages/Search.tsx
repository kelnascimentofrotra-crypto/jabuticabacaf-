import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { History, Search as SearchIcon, SlidersHorizontal, Sparkles, X } from 'lucide-react';
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
import type { ChannelId, Resistance } from '../types';
import { search, matchLabel } from '../lib/search';
import { ObjectionCard } from '../components/objection';
import { Badge, Button, Card, CopyButton, EmptyState, PageHeader, Select, Textarea } from '../components/ui';

export default function SearchPage() {
  const { index, content, data, addHistory, logEvent } = useApp();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  const [showFilters, setShowFilters] = useState(true);
  const f = {
    nicho: params.get('nicho') ?? '',
    servico: params.get('servico') ?? '',
    tipo: params.get('tipo') ?? '',
    canal: (params.get('canal') ?? '') as ChannelId | '',
    etapa: params.get('etapa') ?? '',
    resistencia: params.get('resistencia') ?? '',
    objetivo: params.get('objetivo') ?? '',
    lib: params.get('lib') ?? '',
  };

  useEffect(() => setDraft(q), [q]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const submit = () => {
    const v = draft.trim();
    setParam('q', v);
    if (v) {
      addHistory({ tipo: 'busca', label: v, href: `/busca?q=${encodeURIComponent(v)}` });
      logEvent({ event: 'search' });
    }
  };

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return search(index, q, 60, 0.15).filter((h) => {
      const o = h.doc.objection;
      if (h.doc.kind === 'niche-objection') {
        if (f.nicho && h.doc.niche?.id !== f.nicho) return false;
        if (f.servico || f.tipo || f.etapa || f.resistencia || f.objetivo || f.lib) return false;
        return true;
      }
      if (!o) return false;
      if (f.lib && o.biblioteca !== f.lib) return false;
      if (f.servico && !o.servicos.includes(f.servico as never)) return false;
      if (f.tipo && o.categoria !== f.tipo) return false;
      if (f.etapa && !o.etapas.includes(f.etapa as never)) return false;
      if (f.resistencia && o.resistencia !== f.resistencia) return false;
      if (f.objetivo && !o.objetivos.includes(f.objetivo as never)) return false;
      return true;
    });
  }, [index, q, f.nicho, f.servico, f.tipo, f.etapa, f.resistencia, f.objetivo, f.lib]);

  const recent = data.history.filter((h) => h.tipo === 'busca').slice(0, 8);
  const activeFilters = Object.values(f).filter(Boolean).length;
  const selectedNiche = content.niches.find((n) => n.id === f.nicho);

  return (
    <div>
      <PageHeader title="Busca avançada" subtitle="Cole a frase exata do cliente — a busca encontra objeções parecidas, mesmo com outras palavras." />
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="card p-3"
          >
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ex.: “Achei salgado, um amigo meu faz por bem menos. Vou ver e te falo.”"
              className="min-h-[72px] border-0 bg-transparent text-[15px] focus:ring-0"
              aria-label="Mensagem do cliente"
              data-testid="search-input"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
              <Button size="sm" variant="ghost" icon={<SlidersHorizontal size={14} />} onClick={() => setShowFilters((v) => !v)}>
                Filtros {activeFilters - (q ? 1 : 0) > 0 ? `(${activeFilters - (q ? 1 : 0)})` : ''}
              </Button>
              <div className="flex gap-2">
                {q && (
                  <Link to={`/gerador?msg=${encodeURIComponent(q)}${f.nicho ? `&nicho=${f.nicho}` : ''}`}>
                    <Button size="sm" icon={<Sparkles size={14} />}>
                      Gerar resposta
                    </Button>
                  </Link>
                )}
                <Button type="submit" size="sm" variant="primary" icon={<SearchIcon size={14} />} disabled={!draft.trim()}>
                  Buscar
                </Button>
              </div>
            </div>
          </form>

          {showFilters && (
            <Card className="grid gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-4">
              <Select value={f.nicho} onChange={(e) => setParam('nicho', e.target.value)} aria-label="Nicho">
                <option value="">Todos os nichos</option>
                {content.niches.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nome}
                  </option>
                ))}
              </Select>
              <Select value={f.servico} onChange={(e) => setParam('servico', e.target.value)} aria-label="Serviço">
                <option value="">Todos os serviços</option>
                {SERVICE_KIND_ORDER.map((k) => (
                  <option key={k} value={k}>
                    {SERVICE_KINDS[k].label}
                  </option>
                ))}
              </Select>
              <Select value={f.tipo} onChange={(e) => setParam('tipo', e.target.value)} aria-label="Tipo de objeção">
                <option value="">Todos os tipos</option>
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIES[c].label}
                  </option>
                ))}
              </Select>
              <Select value={f.canal} onChange={(e) => setParam('canal', e.target.value)} aria-label="Canal">
                <option value="">Canal: WhatsApp</option>
                {CHANNEL_ORDER.filter((c) => c !== 'whatsapp').map((c) => (
                  <option key={c} value={c}>
                    Canal: {CHANNELS[c].label}
                  </option>
                ))}
              </Select>
              <Select value={f.etapa} onChange={(e) => setParam('etapa', e.target.value)} aria-label="Etapa da venda">
                <option value="">Todas as etapas</option>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </Select>
              <Select value={f.resistencia} onChange={(e) => setParam('resistencia', e.target.value)} aria-label="Nível de resistência">
                <option value="">Qualquer resistência</option>
                {(Object.keys(RESISTANCE) as Resistance[]).map((r) => (
                  <option key={r} value={r}>
                    Resistência {RESISTANCE[r].label.toLowerCase()}
                  </option>
                ))}
              </Select>
              <Select value={f.objetivo} onChange={(e) => setParam('objetivo', e.target.value)} aria-label="Objetivo da resposta">
                <option value="">Qualquer objetivo</option>
                {OBJECTIVE_ORDER.map((k) => (
                  <option key={k} value={k}>
                    {OBJECTIVES[k].label}
                  </option>
                ))}
              </Select>
              <Select value={f.lib} onChange={(e) => setParam('lib', e.target.value)} aria-label="Biblioteca">
                <option value="">Sites e sistemas</option>
                <option value="geral">Venda de sites e soluções</option>
                <option value="sistema">Sistemas personalizados</option>
              </Select>
              {activeFilters > (q ? 1 : 0) && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button size="sm" variant="ghost" icon={<X size={13} />} onClick={() => setParams(q ? { q } : {}, { replace: true })}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </Card>
          )}

          {!q && (
            <EmptyState icon={<SearchIcon size={22} />} title="Digite ou cole o que o cliente disse">
              A busca compara a frase com centenas de variações cadastradas: sinônimos, gírias e jeitos diferentes de dizer a mesma coisa.
            </EmptyState>
          )}
          {q && results.length === 0 && (
            <EmptyState icon={<SearchIcon size={22} />} title="Nenhum resultado parecido">
              Tente remover filtros ou reescrever com as palavras do cliente. Você também pode usar o{' '}
              <Link className="text-accent-strong hover:underline" to={`/gerador?msg=${encodeURIComponent(q)}`}>
                Gerador de respostas
              </Link>
              .
            </EmptyState>
          )}
          {results.length > 0 && (
            <div className="space-y-2.5" data-testid="search-results">
              <p className="text-xs text-dim">
                {results.length} resultado{results.length > 1 ? 's' : ''}
                {selectedNiche ? ` · objeções de ${selectedNiche.nome} aparecem primeiro` : ''}
              </p>
              {[...results]
                .sort((a, b) => (f.nicho ? Number(b.doc.niche?.id === f.nicho) - Number(a.doc.niche?.id === f.nicho) : 0) || b.score - a.score)
                .map((h) =>
                  h.doc.objection ? (
                    <ObjectionCard key={h.doc.key} o={h.doc.objection} canal={f.canal} extra={<Badge>Correspondência {matchLabel(h.score)}</Badge>} />
                  ) : (
                    <Card key={h.doc.key} className="p-4">
                      <div className="mb-1.5 flex flex-wrap gap-1.5">
                        <Badge tone="info">{h.doc.niche!.nome}</Badge>
                        <Badge>Correspondência {matchLabel(h.score)}</Badge>
                      </div>
                      <Link to={`/nichos/${h.doc.niche!.id}#${h.doc.nicheObjection!.id}`} className="font-medium hover:text-accent-strong">
                        “{h.doc.nicheObjection!.frase}”
                      </Link>
                      <p className="mt-1.5 text-sm text-muted">{h.doc.nicheObjection!.resposta}</p>
                      <div className="mt-3">
                        <CopyButton text={h.doc.nicheObjection!.resposta} itemKind="niche-objection" itemId={`${h.doc.niche!.id}:${h.doc.nicheObjection!.id}`} />
                      </div>
                    </Card>
                  ),
                )}
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="eyebrow mb-2 flex items-center gap-1.5">
              <History size={12} /> Buscas recentes
            </p>
            {recent.length === 0 && <p className="text-sm text-dim">Suas buscas aparecem aqui.</p>}
            <ul className="space-y-1">
              {recent.map((h) => (
                <li key={h.id}>
                  <button type="button" onClick={() => setParam('q', h.label)} className="w-full truncate rounded px-1.5 py-1 text-left text-sm text-muted hover:bg-raised hover:text-fg">
                    {h.label}
                  </button>
                </li>
              ))}
            </ul>
            {recent.length > 0 && (
              <Link to="/salvos?tab=historico" className="mt-2 block text-xs text-dim hover:text-fg">
                Ver histórico completo →
              </Link>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
