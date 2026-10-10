import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle } from 'lucide-react';
import type { ChannelId, Objection, ObjectionCategory, Resistance } from '../types';
import { CATEGORIES, RESISTANCE } from '../content/taxonomy';
import { CATEGORY_ICON } from './icons';
import { Badge, cn, TONES } from './ui';

export function CategoryBadge({ categoria }: { categoria: ObjectionCategory }) {
  const c = CATEGORIES[categoria];
  return <Badge tone={c.tone}>{c.label}</Badge>;
}

export function ResistanceBadge({ level }: { level: Resistance }) {
  const tone = level === 'alta' ? 'danger' : level === 'media' ? 'warn' : 'accent';
  return (
    <Badge tone={tone} className="font-normal">
      Resistência {RESISTANCE[level].label.toLowerCase()}
    </Badge>
  );
}

export function CategoryIcon({ categoria, size = 18 }: { categoria: ObjectionCategory; size?: number }) {
  const Icon = CATEGORY_ICON[categoria];
  const tone = TONES[CATEGORIES[categoria].tone] ?? TONES.neutral;
  return (
    <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset', tone)}>
      <Icon size={size} />
    </span>
  );
}

export function previewFor(o: Objection, canal?: ChannelId | ''): { label: string; text: string } {
  switch (canal) {
    case 'ligacao':
      return { label: 'Ligação', text: o.respostas.ligacao };
    case 'presencial':
      return { label: 'Reunião', text: o.respostas.reuniao };
    case 'email':
    case 'linkedin':
      return { label: 'Consultiva', text: o.respostas.consultiva };
    default:
      return { label: 'WhatsApp', text: o.respostas.curta };
  }
}

export function ObjectionCard({ o, canal, showPreview = true, extra }: { o: Objection; canal?: ChannelId | ''; showPreview?: boolean; extra?: React.ReactNode }) {
  const preview = previewFor(o, canal);
  return (
    <Link
      to={`/objecoes/${o.id}`}
      className="card card-hover group flex gap-3.5 p-4 animate-fade-in"
      data-testid="objection-card"
    >
      <CategoryIcon categoria={o.categoria} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <CategoryBadge categoria={o.categoria} />
          {o.biblioteca === 'sistema' && <Badge tone="indigo">Sistemas</Badge>}
          {extra}
        </div>
        <p className="flex items-start gap-1.5 font-medium text-fg">
          <MessageCircle size={14} className="mt-1 shrink-0 text-dim" />
          <span>“{o.frase.replace(/^\[|\]$/g, '')}”</span>
        </p>
        {showPreview && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            <span className="text-dim">{preview.label}: </span>
            {preview.text}
          </p>
        )}
      </div>
      <ChevronRight size={16} className="mt-2.5 shrink-0 text-dim transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
