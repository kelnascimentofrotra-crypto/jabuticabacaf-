import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Button, Input, Select, Textarea, cn } from '../ui';

export type FieldSpec =
  | { key: string; label: string; type: 'text'; hint?: string; readOnlyAfterCreate?: boolean }
  | { key: string; label: string; type: 'textarea'; hint?: string; rows?: number }
  | { key: string; label: string; type: 'number'; hint?: string }
  | { key: string; label: string; type: 'select'; options: { value: string; label: string }[]; hint?: string }
  | { key: string; label: string; type: 'multiselect'; options: { value: string; label: string }[]; hint?: string }
  | { key: string; label: string; type: 'list'; hint?: string }
  | { key: string; label: string; type: 'group'; fields: FieldSpec[]; hint?: string }
  | { key: string; label: string; type: 'objects'; fields: FieldSpec[]; itemLabel: string; titleKey?: string; hint?: string };

type Obj = Record<string, unknown>;

export function emptyFrom(fields: FieldSpec[]): Obj {
  const out: Obj = {};
  for (const f of fields) {
    switch (f.type) {
      case 'list':
      case 'multiselect':
      case 'objects':
        out[f.key] = [];
        break;
      case 'group':
        out[f.key] = emptyFrom(f.fields);
        break;
      case 'number':
        out[f.key] = 0;
        break;
      case 'select':
        out[f.key] = f.options[0]?.value ?? '';
        break;
      default:
        out[f.key] = '';
    }
  }
  return out;
}

function FieldRow({ spec, value, onChange, isNew, path }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void; isNew: boolean; path: string }) {
  const id = `f-${path}`;
  const label = (
    <label htmlFor={id} className="label">
      {spec.label}
    </label>
  );
  const hint = spec.hint ? <p className="mt-1 text-[11px] text-dim">{spec.hint}</p> : null;

  switch (spec.type) {
    case 'text':
      return (
        <div>
          {label}
          <Input id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} disabled={spec.readOnlyAfterCreate && !isNew} />
          {hint}
        </div>
      );
    case 'number':
      return (
        <div>
          {label}
          <Input id={id} type="number" value={String(value ?? 0)} onChange={(e) => onChange(Number(e.target.value) || 0)} />
          {hint}
        </div>
      );
    case 'textarea':
      return (
        <div>
          {label}
          <Textarea id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} style={{ minHeight: (spec.rows ?? 3) * 24 + 20 }} />
          {hint}
        </div>
      );
    case 'select':
      return (
        <div>
          {label}
          <Select id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
            {spec.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          {hint}
        </div>
      );
    case 'multiselect': {
      const arr = (value as string[]) ?? [];
      return (
        <fieldset>
          <legend className="label">{spec.label}</legend>
          <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
            {spec.options.map((o) => {
              const on = arr.includes(o.value);
              return (
                <button
                  type="button"
                  key={o.value}
                  aria-pressed={on}
                  onClick={() => onChange(on ? arr.filter((x) => x !== o.value) : [...arr, o.value])}
                  className={cn(
                    'rounded-md border px-2 py-1 text-xs transition-colors',
                    on ? 'border-accent/40 bg-accent/10 text-accent-strong' : 'border-line text-muted hover:text-fg',
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          {hint}
        </fieldset>
      );
    }
    case 'list': {
      const arr = (value as string[]) ?? [];
      return (
        <div>
          {label}
          <Textarea
            id={id}
            value={arr.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n'))}
            onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
            style={{ minHeight: Math.min(8, Math.max(3, arr.length + 1)) * 22 + 20 }}
          />
          <p className="mt-1 text-[11px] text-dim">Um item por linha.{spec.hint ? ` ${spec.hint}` : ''}</p>
        </div>
      );
    }
    case 'group': {
      const obj = (value as Obj) ?? {};
      return (
        <fieldset className="rounded-lg border border-line p-3">
          <legend className="px-1 text-xs font-medium text-muted">{spec.label}</legend>
          {hint}
          <div className="grid gap-3">
            {spec.fields.map((f) => (
              <FieldRow key={f.key} spec={f} value={obj[f.key]} isNew={isNew} path={`${path}.${f.key}`} onChange={(v) => onChange({ ...obj, [f.key]: v })} />
            ))}
          </div>
        </fieldset>
      );
    }
    case 'objects': {
      const arr = (value as Obj[]) ?? [];
      const move = (i: number, d: number) => {
        const next = [...arr];
        const [it] = next.splice(i, 1);
        next.splice(i + d, 0, it);
        onChange(next);
      };
      return (
        <fieldset className="rounded-lg border border-line p-3">
          <legend className="px-1 text-xs font-medium text-muted">
            {spec.label} ({arr.length})
          </legend>
          {hint}
          <div className="space-y-3">
            {arr.map((item, i) => (
              <div key={i} className="rounded-lg border border-line bg-bg/40 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-dim">
                    {spec.itemLabel} {i + 1}
                    {spec.titleKey && item[spec.titleKey] ? ` · ${String(item[spec.titleKey]).slice(0, 60)}` : ''}
                  </p>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" aria-label="Mover para cima" disabled={i === 0} onClick={() => move(i, -1)} icon={<ChevronUp size={14} />} />
                    <Button size="icon" variant="ghost" aria-label="Mover para baixo" disabled={i === arr.length - 1} onClick={() => move(i, 1)} icon={<ChevronDown size={14} />} />
                    <Button size="icon" variant="ghost" aria-label={`Remover ${spec.itemLabel}`} onClick={() => onChange(arr.filter((_, j) => j !== i))} icon={<Trash2 size={14} />} />
                  </div>
                </div>
                <div className="grid gap-3">
                  {spec.fields.map((f) => (
                    <FieldRow
                      key={f.key}
                      spec={f}
                      value={item[f.key]}
                      isNew
                      path={`${path}.${i}.${f.key}`}
                      onChange={(v) => onChange(arr.map((x, j) => (j === i ? { ...x, [f.key]: v } : x)))}
                    />
                  ))}
                </div>
              </div>
            ))}
            <Button size="sm" icon={<Plus size={13} />} onClick={() => onChange([...arr, emptyFrom(spec.fields)])}>
              Adicionar {spec.itemLabel.toLowerCase()}
            </Button>
          </div>
        </fieldset>
      );
    }
  }
}

export function SchemaForm({ fields, value, onChange, isNew }: { fields: FieldSpec[]; value: Obj; onChange: (v: Obj) => void; isNew: boolean }) {
  return (
    <div className="grid gap-4">
      {fields.map((f) => (
        <FieldRow key={f.key} spec={f} value={value[f.key]} isNew={isNew} path={f.key} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}

/** Remove linhas vazias de listas antes de salvar. */
export function cleanLists(fields: FieldSpec[], value: Obj): Obj {
  const out: Obj = { ...value };
  for (const f of fields) {
    if (f.type === 'list') out[f.key] = ((value[f.key] as string[]) ?? []).map((s) => s.trim()).filter(Boolean);
    if (f.type === 'group') out[f.key] = cleanLists(f.fields, (value[f.key] as Obj) ?? {});
    if (f.type === 'objects') out[f.key] = ((value[f.key] as Obj[]) ?? []).map((it) => cleanLists(f.fields, it));
  }
  return out;
}
