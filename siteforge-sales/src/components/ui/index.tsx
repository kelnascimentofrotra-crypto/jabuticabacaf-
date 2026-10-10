import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, Copy, Star, X } from 'lucide-react';
import { useApp } from '../../data/store';
import { useToast } from './toast';
import type { FavoriteKind } from '../../types';

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

// ---------------- Botões ----------------

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-[#04110c] hover:bg-accent-strong font-semibold shadow-[0_0_0_1px_rgba(16,185,129,.4)]',
  secondary: 'bg-raised text-fg border border-line hover:border-line-strong hover:bg-[#1d2127]',
  outline: 'border border-line text-fg hover:bg-raised',
  ghost: 'text-muted hover:text-fg hover:bg-raised',
  danger: 'border border-danger/30 text-danger hover:bg-danger/10',
};
const SIZES: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  icon: 'h-8 w-8 justify-center',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center rounded-lg transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

// ---------------- Campos ----------------

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn('input h-10', className)} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cn('input min-h-[88px] resize-y leading-relaxed', className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cn('input h-10 cursor-pointer appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-8', className)} style={{ backgroundImage: CHEVRON }} {...rest}>
      {children}
    </select>
  );
});

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-dim">{hint}</p>}
    </div>
  );
}

// ---------------- Superfícies ----------------

export function Card({
  className,
  children,
  as: As = 'div',
  ...rest
}: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' } & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'> & { 'data-testid'?: string }) {
  return (
    <As className={cn('card', className)} {...rest}>
      {children}
    </As>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold text-fg sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ children, action, id }: { children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id={id} className="text-[15px] font-semibold text-fg">
        {children}
      </h2>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      {icon && <div className="mb-3 text-dim">{icon}</div>}
      <p className="font-medium text-fg">{title}</p>
      {children && <div className="mt-1 max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Notice({ tone = 'info', title, children, icon }: { tone?: 'info' | 'warn' | 'danger' | 'accent'; title?: string; children: ReactNode; icon?: ReactNode }) {
  const tones = {
    info: 'border-info/25 bg-info/[0.06] text-info',
    warn: 'border-warn/25 bg-warn/[0.06] text-warn',
    danger: 'border-danger/25 bg-danger/[0.06] text-danger',
    accent: 'border-accent/25 bg-accent/[0.06] text-accent-strong',
  };
  return (
    <div className={cn('flex gap-3 rounded-lg border px-3.5 py-3 text-sm', tones[tone])} role="note">
      {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-muted [&_strong]:text-fg">{children}</div>
      </div>
    </div>
  );
}

// ---------------- Badges ----------------

export const TONES: Record<string, string> = {
  amber: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  sky: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
  violet: 'bg-violet-400/10 text-violet-300 ring-violet-400/20',
  rose: 'bg-rose-400/10 text-rose-300 ring-rose-400/20',
  cyan: 'bg-cyan-400/10 text-cyan-300 ring-cyan-400/20',
  orange: 'bg-orange-400/10 text-orange-300 ring-orange-400/20',
  emerald: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  teal: 'bg-teal-400/10 text-teal-300 ring-teal-400/20',
  indigo: 'bg-indigo-400/10 text-indigo-300 ring-indigo-400/20',
  fuchsia: 'bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/20',
  slate: 'bg-slate-400/10 text-slate-300 ring-slate-400/20',
  neutral: 'bg-white/[0.04] text-muted ring-white/10',
  accent: 'bg-accent/10 text-accent-strong ring-accent/25',
  warn: 'bg-warn/10 text-warn ring-warn/25',
  danger: 'bg-danger/10 text-danger ring-danger/25',
  info: 'bg-info/10 text-info ring-info/25',
};

export function Badge({ tone = 'neutral', children, className, icon }: { tone?: string; children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset', TONES[tone] ?? TONES.neutral, className)}>
      {icon}
      {children}
    </span>
  );
}

// ---------------- Chips / segmentos ----------------

export function Chip({ active, children, onClick, icon, className }: { active?: boolean; children: ReactNode; onClick?: () => void; icon?: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors',
        active ? 'border-accent/40 bg-accent/10 text-accent-strong' : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function Tabs<T extends string>({ value, onChange, items, className }: { value: T; onChange: (v: T) => void; items: { id: T; label: string; count?: number }[]; className?: string }) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto border-b border-line', className)}>
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          type="button"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            '-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors',
            value === it.id ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg',
          )}
        >
          {it.label}
          {it.count !== undefined && <span className="rounded bg-white/5 px-1.5 text-[11px] text-dim">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------------- Texto com campos a preencher ----------------

export function MessageText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <p className={cn('prose-msg', className)}>
      {parts.map((p, i) =>
        /^\[[^\]]+\]$/.test(p) ? (
          <span key={i} className="placeholder-chip" title="Preencha antes de enviar">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

// ---------------- Copiar e favoritar ----------------

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({
  text,
  label = 'Copiar',
  itemKind,
  itemId,
  size = 'sm',
  variant = 'secondary',
  className,
}: {
  text: string;
  label?: string;
  itemKind?: string;
  itemId?: string;
  size?: Size;
  variant?: Variant;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  const toast = useToast();
  const { logEvent } = useApp();
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  const placeholdersLeft = /\[[^\]]+\]/.test(text);
  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      aria-label={label}
      icon={done ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) {
          setDone(true);
          logEvent({ event: 'copy', itemKind, itemId });
          toast.show(placeholdersLeft ? 'Copiado — lembre de preencher os campos entre colchetes.' : 'Copiado para a área de transferência.');
        } else toast.show('Não foi possível copiar. Selecione o texto manualmente.', 'error');
      }}
    >
      {size !== 'icon' && (done ? 'Copiado' : label)}
    </Button>
  );
}

export function FavoriteButton({ kind, itemId, label, href, size = 'sm' }: { kind: FavoriteKind; itemId: string; label: string; href: string; size?: Size }) {
  const { isFavorite, toggleFavorite } = useApp();
  const toast = useToast();
  const id = `${kind}:${itemId}`;
  const active = isFavorite(id);
  return (
    <Button
      size={size}
      variant={active ? 'outline' : 'secondary'}
      aria-pressed={active}
      aria-label={active ? 'Remover dos favoritos' : 'Favoritar'}
      icon={<Star size={14} className={active ? 'fill-amber-300 text-amber-300' : ''} />}
      onClick={async () => {
        try {
          const now = await toggleFavorite({ id, kind, itemId, label, href });
          toast.show(now ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
        } catch (e) {
          toast.show((e as Error).message, 'error');
        }
      }}
    >
      {size !== 'icon' && (active ? 'Favoritado' : 'Favoritar')}
    </Button>
  );
}

// ---------------- Modal ----------------

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('card flex max-h-[92vh] w-full animate-scale-in flex-col rounded-b-none sm:rounded-xl', wide ? 'sm:max-w-4xl' : 'sm:max-w-lg')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="font-semibold">{title}</h2>
          <Button size="icon" variant="ghost" aria-label="Fechar" onClick={onClose} icon={<X size={16} />} />
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-sans text-[10px] text-dim">{children}</kbd>;
}

export function Bullets({ items, tone = 'dim' }: { items: string[]; tone?: 'dim' | 'accent' | 'danger' | 'warn' }) {
  const dot = { dim: 'bg-dim', accent: 'bg-accent', danger: 'bg-danger', warn: 'bg-warn' }[tone];
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
          <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
