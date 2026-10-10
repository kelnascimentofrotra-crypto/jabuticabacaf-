import type { ReactNode } from 'react';
import { CopyButton, MessageText, cn } from './ui';

export function ResponseCard({
  title,
  subtitle,
  icon,
  text,
  itemKind,
  itemId,
  actions,
  badge,
  highlight,
  testId,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  text: string;
  itemKind?: string;
  itemId?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  highlight?: boolean;
  testId?: string;
}) {
  return (
    <div className={cn('card flex flex-col p-4 sm:p-5', highlight && 'border-accent/30')} data-testid={testId}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {icon && <span className="mt-0.5 text-accent">{icon}</span>}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg">{title}</p>
            {subtitle && <p className="text-xs text-dim">{subtitle}</p>}
          </div>
        </div>
        {badge}
      </div>
      <MessageText text={text} className="flex-1" />
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton text={text} itemKind={itemKind} itemId={itemId} />
        {actions}
      </div>
    </div>
  );
}
