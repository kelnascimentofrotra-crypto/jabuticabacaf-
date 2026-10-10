import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CornerDownLeft, FileSearch, Layers, MessageSquareWarning, Search, Store } from 'lucide-react';
import { useApp } from '../../data/store';
import { search } from '../../lib/search';
import { normalize } from '../../lib/normalize';
import { cn, Kbd } from '../ui';
import { NAV_GROUPS } from './AppShell';

interface Result {
  key: string;
  label: string;
  hint: string;
  to: string;
  group: string;
}

export function CommandPalette({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (to: string) => void }) {
  const { index, content, isAdmin, addHistory, logEvent } = useApp();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const nq = normalize(q);
    const out: Result[] = [];
    if (nq.length >= 2) {
      for (const h of search(index, q, 6)) {
        if (h.doc.objection) {
          out.push({ key: h.doc.key, label: h.doc.objection.frase, hint: h.doc.objection.biblioteca === 'sistema' ? 'Objeção · sistemas' : 'Objeção', to: `/objecoes/${h.doc.objection.id}`, group: 'Objeções' });
        } else if (h.doc.niche && h.doc.nicheObjection) {
          out.push({ key: h.doc.key, label: h.doc.nicheObjection.frase, hint: h.doc.niche.nome, to: `/nichos/${h.doc.niche.id}#${h.doc.nicheObjection.id}`, group: 'Objeções' });
        }
      }
      for (const n of content.niches.filter((n) => normalize(n.nome).includes(nq)).slice(0, 4)) {
        out.push({ key: `niche:${n.id}`, label: n.nome, hint: 'Nicho', to: `/nichos/${n.id}`, group: 'Nichos' });
      }
      for (const s of content.services.filter((s) => normalize(s.nome).includes(nq)).slice(0, 4)) {
        out.push({ key: `svc:${s.id}`, label: s.nome, hint: 'Serviço', to: `/servicos/${s.id}`, group: 'Serviços' });
      }
    }
    const pages = NAV_GROUPS.flatMap((g) => g.items)
      .filter((i) => !i.adminOnly || isAdmin)
      .filter((i) => !nq || normalize(i.label).includes(nq))
      .slice(0, nq ? 4 : 8);
    for (const p of pages) out.push({ key: `page:${p.to}`, label: p.label, hint: 'Página', to: p.to, group: 'Páginas' });
    return out;
  }, [q, index, content, isAdmin]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (r?: Result) => {
    if (r) {
      onNavigate(r.to);
    } else if (q.trim()) {
      addHistory({ tipo: 'busca', label: q.trim(), href: `/busca?q=${encodeURIComponent(q.trim())}` });
      logEvent({ event: 'search' });
      onNavigate(`/busca?q=${encodeURIComponent(q.trim())}`);
    }
    onClose();
  };

  const groupIcon = (g: string) =>
    g === 'Objeções' ? <MessageSquareWarning size={15} /> : g === 'Nichos' ? <Store size={15} /> : g === 'Serviços' ? <Layers size={15} /> : <ArrowRight size={15} />;

  let lastGroup = '';
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-3 pt-[8vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Busca rápida"
        className="card w-full max-w-xl animate-scale-in overflow-hidden shadow-2xl shadow-black/50"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={17} className="text-dim" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                go(results[active]);
              }
            }}
            placeholder="Digite a objeção do cliente, um nicho ou uma página…"
            className="h-14 flex-1 bg-transparent text-[15px] text-fg placeholder:text-dim focus:outline-none"
            aria-label="Buscar"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <div key={r.key}>
                {header && <p className="eyebrow px-2.5 pb-1 pt-2.5">{header}</p>}
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn('flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm', i === active ? 'bg-raised text-fg' : 'text-muted')}
                >
                  <span className="text-dim">{groupIcon(r.group)}</span>
                  <span className="min-w-0 flex-1 truncate">{r.label}</span>
                  <span className="shrink-0 text-[11px] text-dim">{r.hint}</span>
                </button>
              </div>
            );
          })}
          {q.trim().length >= 2 && (
            <button
              type="button"
              onClick={() => go(undefined)}
              className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-line px-2.5 py-2.5 text-left text-sm text-accent-strong hover:bg-raised"
            >
              <FileSearch size={15} />
              <span className="flex-1 truncate">Busca avançada por “{q.trim()}”</span>
              <CornerDownLeft size={14} className="text-dim" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
