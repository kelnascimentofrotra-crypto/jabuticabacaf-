import { useEffect, useMemo, useState } from 'react';
import { BarChart3, ClipboardCopy, Database, Download, FileUp, Pencil, Plus, RotateCcw, Search, ShieldCheck, Trash2, Undo2, Users } from 'lucide-react';
import { useApp } from '../data/store';
import type { ContentKind, ContentOverride, Profile } from '../types';
import { BASE_CONTENT, KIND_LABEL, KIND_TO_KEY, isBaseItem, validateContent } from '../data/content';
import type { UsageStats } from '../data/backend';
import { SchemaForm, cleanLists, emptyFrom } from '../components/admin/SchemaForm';
import { finalize, schemaFor, slugify, TITLE_KEY } from './admin/schemas';
import { Badge, Button, Card, Chip, Input, Modal, Notice, PageHeader, Select, Tabs, Textarea, copyText } from '../components/ui';
import { useToast } from '../components/ui/toast';
import { useConfirm } from '../components/ui/confirm';
import { normalize } from '../lib/normalize';

type Tab = 'conteudo' | 'usuarios' | 'estatisticas' | 'dados';

const KINDS: ContentKind[] = ['objection', 'niche', 'service', 'scenario', 'followup', 'prospect', 'quick'];
const KIND_PLURAL: Record<ContentKind, string> = {
  objection: 'Objeções',
  niche: 'Nichos',
  service: 'Serviços',
  scenario: 'Cenários de treino',
  followup: 'Follow-ups',
  prospect: 'Etapas de prospecção',
  quick: 'Respostas rápidas',
};

type Item = { id: string } & Record<string, unknown>;

const NEW_LABEL: Record<ContentKind, string> = {
  objection: 'Nova objeção',
  niche: 'Novo nicho',
  service: 'Novo serviço',
  scenario: 'Novo cenário',
  followup: 'Nova sequência',
  prospect: 'Nova etapa',
  quick: 'Nova resposta rápida',
};

function ContentTab() {
  const { content, overrides, saveOverride, deleteContent, revertOverride } = useApp();
  const toast = useToast();
  const confirm = useConfirm();
  const [kind, setKind] = useState<ContentKind>('objection');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<{ value: Item; isNew: boolean } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const serviceOptions = useMemo(() => content.services.map((s) => ({ value: s.id, label: s.nome })), [content.services]);
  const objectionOptions = useMemo(() => content.objections.map((o) => ({ value: o.id, label: o.frase })), [content.objections]);
  const nicheOptions = useMemo(() => content.niches.map((n) => ({ value: n.id, label: n.nome })), [content.niches]);
  const fields = useMemo(() => schemaFor(kind, serviceOptions, objectionOptions, nicheOptions), [kind, serviceOptions, objectionOptions, nicheOptions]);

  const items = content[KIND_TO_KEY[kind]] as unknown as Item[];
  const removed = overrides.filter((o) => o.kind === kind && o.deleted && isBaseItem(kind, o.id));
  const titleKey = TITLE_KEY[kind];
  const filtered = items.filter((i) => !q || normalize(String(i[titleKey] ?? '') + ' ' + i.id).includes(normalize(q)));

  const status = (id: string) => {
    const ov = overrides.find((o) => o.kind === kind && o.id === id);
    if (!isBaseItem(kind, id)) return { label: 'Novo', tone: 'info' };
    if (ov) return { label: 'Editado', tone: 'warn' };
    return { label: 'Original', tone: 'neutral' };
  };

  const openNew = () => {
    setErrors([]);
    setEditing({ value: { ...(emptyFrom(fields) as Item), id: '' }, isNew: true });
  };

  const save = async () => {
    if (!editing) return;
    let value = finalize(kind, cleanLists(fields, editing.value)) as Item;
    if (editing.isNew) {
      const id = (value.id as string)?.trim() || slugify(String(value[titleKey] ?? ''));
      value = { ...value, id };
      if (!id) {
        setErrors(['Preencha o título para gerar o identificador.']);
        return;
      }
      if (items.some((i) => i.id === id) || isBaseItem(kind, id)) {
        setErrors([`Já existe um item com o identificador "${id}". Altere o identificador.`]);
        return;
      }
    }
    const errs = validateContent(kind, value);
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await saveOverride(kind, value.id, value);
      toast.show(editing.isNew ? 'Item criado.' : 'Alterações salvas.');
      setEditing(null);
    } catch (e) {
      setErrors([(e as Error).message]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {KINDS.map((k) => (
          <Chip key={k} active={kind === k} onClick={() => { setKind(k); setQ(''); }}>
            {KIND_PLURAL[k]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar em ${KIND_PLURAL[kind].toLowerCase()}…`} className="pl-9" aria-label="Buscar conteúdo" />
        </div>
        {kind !== 'prospect' && (
          <Button variant="primary" icon={<Plus size={15} />} onClick={openNew}>
            {NEW_LABEL[kind]}
          </Button>
        )}
      </div>
      <p className="text-xs text-dim">
        {items.length} itens · edições ficam salvas como camada sobre o conteúdo original, que pode ser restaurado a qualquer momento.
      </p>

      <Card className="divide-y divide-line" data-testid="admin-list">
        {filtered.map((it) => {
          const st = status(it.id);
          const overridden = overrides.some((o) => o.kind === kind && o.id === it.id);
          return (
            <div key={it.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-fg">{String(it[titleKey] ?? it.id)}</p>
                <p className="truncate text-[11px] text-dim">{it.id}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone={st.tone}>{st.label}</Badge>
                <Button size="sm" icon={<Pencil size={13} />} onClick={() => { setErrors([]); setEditing({ value: JSON.parse(JSON.stringify(it)), isNew: false }); }}>
                  Editar
                </Button>
                {overridden && isBaseItem(kind, it.id) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Undo2 size={13} />}
                    onClick={async () => {
                      await revertOverride(kind, it.id);
                      toast.show('Conteúdo original restaurado.');
                    }}
                  >
                    Restaurar original
                  </Button>
                )}
                {kind !== 'prospect' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Excluir ${String(it[titleKey] ?? it.id)}`}
                    icon={<Trash2 size={13} />}
                    onClick={async () => {
                      const ok = await confirm({
                        title: 'Excluir item',
                        message: `Excluir "${String(it[titleKey] ?? it.id)}"? Itens originais podem ser restaurados depois.`,
                        confirmLabel: 'Excluir',
                        danger: true,
                      });
                      if (!ok) return;
                      try {
                        if (isBaseItem(kind, it.id)) await deleteContent(kind, it.id);
                        else await revertOverride(kind, it.id);
                        toast.show('Item excluído.');
                      } catch (e) {
                        toast.show((e as Error).message, 'error');
                      }
                    }}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="px-4 py-6 text-center text-sm text-dim">Nada encontrado.</p>}
      </Card>

      {removed.length > 0 && (
        <Card className="p-4">
          <p className="mb-2 text-sm font-medium">Itens originais removidos</p>
          <div className="space-y-1.5">
            {removed.map((r) => {
              const base = (BASE_CONTENT[KIND_TO_KEY[kind]] as unknown as Item[]).find((i) => i.id === r.id);
              return (
                <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-muted">{String(base?.[titleKey] ?? r.id)}</span>
                  <Button size="sm" variant="ghost" icon={<RotateCcw size={13} />} onClick={() => revertOverride(kind, r.id).then(() => toast.show('Item restaurado.'))}>
                    Restaurar
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.isNew ? NEW_LABEL[kind] : `Editar: ${KIND_LABEL[kind].toLowerCase()}`} wide>
        {editing && (
          <div className="space-y-4">
            <SchemaForm fields={fields} value={editing.value} isNew={editing.isNew} onChange={(v) => setEditing({ ...editing, value: v as Item })} />
            {errors.length > 0 && (
              <Notice tone="danger" title="Corrija antes de salvar">
                <ul className="list-disc pl-4">
                  {errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </Notice>
            )}
            <div className="sticky bottom-0 -mx-5 -mb-5 flex justify-end gap-2 border-t border-line bg-surface px-5 py-3">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={save} disabled={saving}>
                {saving ? 'Salvando…' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function UsersTab() {
  const { backend, mode, profile } = useApp();
  const toast = useToast();
  const [list, setList] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== 'supabase' || !backend) return;
    backend
      .listProfiles()
      .then(setList)
      .catch((e) => setError((e as Error).message));
  }, [backend, mode]);

  if (mode === 'local') {
    return (
      <Notice tone="info" icon={<ShieldCheck size={16} />} title="Usuários e permissões exigem o Supabase">
        No modo local não há contas: tudo fica salvo apenas neste navegador e você tem acesso total. Para equipes, configure o Supabase (veja <strong>Configurações</strong> e o README):
        cada vendedor terá login próprio, dados isolados por políticas RLS e apenas administradores poderão editar o conteúdo.
      </Notice>
    );
  }
  if (error) return <Notice tone="danger" title="Erro ao listar usuários">{error}</Notice>;
  if (!list) return <p className="text-sm text-dim">Carregando…</p>;

  return (
    <Card className="divide-y divide-line">
      {list.map((u) => (
        <div key={u.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{u.nome || u.email}</p>
            <p className="truncate text-xs text-dim">{u.email}</p>
          </div>
          <Select
            value={u.role}
            className="sm:w-44"
            aria-label={`Papel de ${u.email}`}
            onChange={async (e) => {
              const role = e.target.value as Profile['role'];
              try {
                await backend!.setRole(u.id, role);
                setList((l) => l?.map((x) => (x.id === u.id ? { ...x, role } : x)) ?? null);
                toast.show('Permissão atualizada.');
              } catch (err) {
                toast.show((err as Error).message, 'error');
              }
            }}
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </Select>
          {u.id === profile?.id && <Badge tone="accent">Você</Badge>}
        </div>
      ))}
    </Card>
  );
}

const EVENT_LABELS: Record<string, string> = {
  view_objection: 'Fichas abertas',
  view_niche: 'Nichos abertos',
  search: 'Buscas',
  copy: 'Mensagens copiadas',
  favorite: 'Favoritos adicionados',
  generate: 'Gerações de resposta',
  ai_request: 'Chamadas à IA',
  train: 'Treinos concluídos',
};

function StatsTab() {
  const { backend, mode, content } = useApp();
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStats(null);
    setError(null);
    backend
      ?.stats(days)
      .then(setStats)
      .catch((e) => setError((e as Error).message));
  }, [backend, days]);

  const name = (id: string) => content.objections.find((o) => o.id === id)?.frase ?? content.niches.find((n) => n.id === id)?.nome ?? id;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">{mode === 'local' ? 'Uso registrado neste navegador.' : 'Uso de toda a equipe (dados reais do banco).'}</p>
        <Select value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-40" aria-label="Período">
          <option value={7}>Últimos 7 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={90}>Últimos 90 dias</option>
        </Select>
      </div>
      {error && <Notice tone="danger" title="Erro ao carregar estatísticas">{error}</Notice>}
      {!stats && !error && <p className="text-sm text-dim">Carregando…</p>}
      {stats && (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4" data-testid="stats-cards">
            <Card className="p-4">
              <p className="text-xs text-dim">Total de interações</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{stats.totalEventos}</p>
            </Card>
            {stats.usuariosAtivos !== null && (
              <Card className="p-4">
                <p className="text-xs text-dim">Usuários ativos</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{stats.usuariosAtivos}</p>
              </Card>
            )}
            {Object.entries(EVENT_LABELS).map(([k, label]) => (
              <Card key={k} className="p-4">
                <p className="text-xs text-dim">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{stats.porEvento[k] ?? 0}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {[
              { title: 'Objeções mais consultadas', list: stats.topObjecoes },
              { title: 'Nichos mais consultados', list: stats.topNichos },
              { title: 'Itens mais copiados', list: stats.topCopiados },
            ].map((b) => (
              <Card key={b.title} className="p-4">
                <p className="mb-2 text-sm font-medium">{b.title}</p>
                {b.list.length === 0 ? (
                  <p className="text-sm text-dim">Sem dados no período.</p>
                ) : (
                  <ol className="space-y-1.5">
                    {b.list.map((x) => (
                      <li key={x.itemId} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-muted">{name(x.itemId)}</span>
                        <span className="tabular-nums text-fg">{x.total}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DataTab() {
  const { overrides, invalidOverrides, content, saveOverride, revertOverride, backend } = useApp();
  const toast = useToast();
  const [importing, setImporting] = useState(false);

  const download = (name: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = async (data: unknown) => {
    const ok = await copyText(JSON.stringify(data, null, 2));
    toast.show(ok ? 'JSON copiado.' : 'Não foi possível copiar.', ok ? 'ok' : 'error');
  };

  const [pasted, setPasted] = useState('');

  const importText = async (raw: string): Promise<boolean> => {
    setImporting(true);
    try {
      const parsed = JSON.parse(raw) as ContentOverride[];
      if (!Array.isArray(parsed)) throw new Error('O conteúdo deve ser uma lista de alterações exportada pelo SiteForge.');
      let ok = 0;
      const fail: string[] = [];
      for (const o of parsed) {
        if (!o || !KIND_TO_KEY[o.kind as ContentKind] || typeof o.id !== 'string') {
          fail.push('item sem tipo/identificador');
          continue;
        }
        if (o.deleted) {
          await backend!.saveOverride({ ...o, updatedAt: new Date().toISOString() });
          ok++;
          continue;
        }
        const errs = validateContent(o.kind, o.data);
        if (errs.length) {
          fail.push(`${o.kind}:${o.id}`);
          continue;
        }
        await saveOverride(o.kind, o.id, o.data);
        ok++;
      }
      toast.show(`${ok} alterações importadas${fail.length ? `, ${fail.length} ignoradas` : ''}.`, fail.length ? 'error' : 'ok');
      if (parsed.some((o) => o.deleted)) setTimeout(() => window.location.reload(), 800);
      return true;
    } catch (e) {
      toast.show(`Importação falhou: ${(e as Error).message}`, 'error');
      return false;
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-4">
          <p className="font-medium">Exportar alterações</p>
          <p className="mt-1 text-sm text-muted">Baixa todas as edições, criações e exclusões feitas pelo painel ({overrides.length}). Use como backup ou para levar do modo local para o Supabase.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button icon={<Download size={15} />} onClick={() => download('siteforge-alteracoes.json', overrides)}>
              Baixar alterações
            </Button>
            <Button variant="ghost" icon={<ClipboardCopy size={15} />} onClick={() => copyJson(overrides)}>
              Copiar JSON
            </Button>
          </div>
        </Card>
        <Card className="p-4">
          <p className="font-medium">Importar alterações</p>
          <p className="mt-1 text-sm text-muted">Envie um arquivo exportado por este painel. Cada item é validado antes de ser salvo.</p>
          <label className="mt-3 inline-flex">
            <input type="file" accept="application/json,.json" className="sr-only" onChange={async (e) => e.target.files?.[0] && importText(await e.target.files[0].text())} disabled={importing} />
            <span className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-line bg-raised px-4 text-sm hover:border-line-strong">
              <FileUp size={15} /> {importing ? 'Importando…' : 'Escolher arquivo'}
            </span>
          </label>
          <p className="mt-3 text-xs text-dim">Ou cole o JSON copiado:</p>
          <Textarea className="mt-1.5 font-mono text-xs" rows={3} aria-label="JSON para importar" value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder='[{"kind": "quick", "id": "...", ...}]' />
          <Button className="mt-2" size="sm" disabled={importing || !pasted.trim()} onClick={async () => (await importText(pasted)) && setPasted('')}>
            Importar JSON colado
          </Button>
        </Card>
        <Card className="p-4 md:col-span-2">
          <p className="font-medium">Exportar biblioteca completa</p>
          <p className="mt-1 text-sm text-muted">Conteúdo atual (original + edições) em JSON, útil para revisão ou backup.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button icon={<Download size={15} />} onClick={() => download('siteforge-biblioteca.json', content)}>
              Baixar biblioteca
            </Button>
            <Button variant="ghost" icon={<ClipboardCopy size={15} />} onClick={() => copyJson(content)}>
              Copiar JSON
            </Button>
          </div>
        </Card>
      </div>
      {invalidOverrides.length > 0 && (
        <Notice tone="danger" title="Alterações inválidas ignoradas">
          <p>Estes itens estão salvos mas não passaram na validação e não aparecem no app:</p>
          <ul className="mt-2 space-y-1">
            {invalidOverrides.map((o) => (
              <li key={`${o.kind}:${o.id}`} className="flex items-center justify-between gap-2">
                <span>
                  {KIND_LABEL[o.kind]} · {o.id}
                </span>
                <Button size="sm" variant="ghost" onClick={() => revertOverride(o.kind, o.id)}>
                  Descartar
                </Button>
              </li>
            ))}
          </ul>
        </Notice>
      )}
    </div>
  );
}

export default function Admin() {
  const { mode } = useApp();
  const [tab, setTab] = useState<Tab>('conteudo');
  return (
    <div>
      <PageHeader
        title="Administração"
        subtitle="Cadastre e edite nichos, objeções, respostas, serviços e exemplos de conversa sem mexer no código. Gerencie usuários e acompanhe o uso real."
        eyebrow={<Badge tone={mode === 'supabase' ? 'info' : 'neutral'}>{mode === 'supabase' ? 'Alterações compartilhadas com toda a equipe' : 'Modo local: alterações valem só neste navegador'}</Badge>}
      />
      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        className="mb-5"
        items={[
          { id: 'conteudo', label: 'Conteúdo' },
          { id: 'usuarios', label: 'Usuários e permissões' },
          { id: 'estatisticas', label: 'Estatísticas' },
          { id: 'dados', label: 'Importar e exportar' },
        ]}
      />
      {tab === 'conteudo' && <ContentTab />}
      {tab === 'usuarios' && <UsersTab />}
      {tab === 'estatisticas' && <StatsTab />}
      {tab === 'dados' && <DataTab />}
      <div className="mt-8 flex flex-wrap gap-4 text-xs text-dim">
        <span className="flex items-center gap-1.5">
          <Database size={12} /> {mode === 'supabase' ? 'Banco: Supabase (RLS ativo)' : 'Banco: armazenamento local do navegador'}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} /> Permissões: {mode === 'supabase' ? 'admin edita conteúdo; vendedor só lê' : 'acesso total (uso individual)'}
        </span>
        <span className="flex items-center gap-1.5">
          <BarChart3 size={12} /> Estatísticas: somente eventos reais registrados
        </span>
      </div>
    </div>
  );
}
