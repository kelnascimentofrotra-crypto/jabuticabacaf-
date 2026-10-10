import type { SupabaseClient } from '@supabase/supabase-js';
import type { CollectionMap, ContentKind, ContentOverride, Profile, UsageEvent, UserCollection } from '../types';

export interface UsageStats {
  periodoDias: number;
  totalEventos: number;
  porEvento: Record<string, number>;
  usuariosAtivos: number | null;
  topObjecoes: { itemId: string; total: number }[];
  topNichos: { itemId: string; total: number }[];
  topCopiados: { itemId: string; total: number }[];
}

export interface EventInput {
  event: UsageEvent;
  itemKind?: string;
  itemId?: string;
}

export interface Backend {
  readonly mode: 'local' | 'supabase';
  list<K extends UserCollection>(c: K): Promise<CollectionMap[K][]>;
  upsert<K extends UserCollection>(c: K, item: CollectionMap[K]): Promise<void>;
  remove(c: UserCollection, id: string): Promise<void>;
  clear(c: UserCollection): Promise<void>;
  listOverrides(): Promise<ContentOverride[]>;
  saveOverride(o: ContentOverride): Promise<void>;
  deleteOverride(kind: ContentKind, id: string): Promise<void>;
  logEvent(e: EventInput): Promise<void>;
  stats(days: number): Promise<UsageStats>;
  popular(itemKind: string, days: number, limit: number): Promise<{ itemId: string; total: number }[]>;
  listProfiles(): Promise<Profile[]>;
  setRole(userId: string, role: Profile['role']): Promise<void>;
}

const HISTORY_CAP = 200;
const EVENTS_CAP = 3000;
const PREFIX = 'sf:v1:';

// --------------------------------------------------------------------------
// Modo local — persistência no navegador
// --------------------------------------------------------------------------

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // armazenamento indisponível (modo privado ou cota): segue sem persistir
  }
}

interface LocalEvent extends EventInput {
  at: string;
}

function topBy(events: LocalEvent[], filter: (e: LocalEvent) => boolean, limit: number) {
  const counts = new Map<string, number>();
  for (const e of events) if (filter(e) && e.itemId) counts.set(e.itemId, (counts.get(e.itemId) ?? 0) + 1);
  return [...counts.entries()]
    .map(([itemId, total]) => ({ itemId, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export class LocalBackend implements Backend {
  readonly mode = 'local' as const;

  async list<K extends UserCollection>(c: K): Promise<CollectionMap[K][]> {
    return readJSON<CollectionMap[K][]>(c, []);
  }

  async upsert<K extends UserCollection>(c: K, item: CollectionMap[K]): Promise<void> {
    const list = readJSON<CollectionMap[K][]>(c, []).filter((i) => i.id !== item.id);
    list.unshift(item);
    writeJSON(c, c === 'history' ? list.slice(0, HISTORY_CAP) : list);
  }

  async remove(c: UserCollection, id: string): Promise<void> {
    writeJSON(
      c,
      readJSON<{ id: string }[]>(c, []).filter((i) => i.id !== id),
    );
  }

  async clear(c: UserCollection): Promise<void> {
    writeJSON(c, []);
  }

  async listOverrides(): Promise<ContentOverride[]> {
    return readJSON<ContentOverride[]>('content', []);
  }

  async saveOverride(o: ContentOverride): Promise<void> {
    const list = readJSON<ContentOverride[]>('content', []).filter((x) => !(x.kind === o.kind && x.id === o.id));
    list.push(o);
    writeJSON('content', list);
  }

  async deleteOverride(kind: ContentKind, id: string): Promise<void> {
    writeJSON(
      'content',
      readJSON<ContentOverride[]>('content', []).filter((x) => !(x.kind === kind && x.id === id)),
    );
  }

  async logEvent(e: EventInput): Promise<void> {
    const list = readJSON<LocalEvent[]>('events', []);
    list.push({ ...e, at: new Date().toISOString() });
    writeJSON('events', list.slice(-EVENTS_CAP));
  }

  async stats(days: number): Promise<UsageStats> {
    const since = Date.now() - days * 86400000;
    const events = readJSON<LocalEvent[]>('events', []).filter((e) => Date.parse(e.at) >= since);
    const porEvento: Record<string, number> = {};
    for (const e of events) porEvento[e.event] = (porEvento[e.event] ?? 0) + 1;
    return {
      periodoDias: days,
      totalEventos: events.length,
      porEvento,
      usuariosAtivos: null,
      topObjecoes: topBy(events, (e) => e.event === 'view_objection', 8),
      topNichos: topBy(events, (e) => e.event === 'view_niche', 8),
      topCopiados: topBy(events, (e) => e.event === 'copy', 8),
    };
  }

  async popular(itemKind: string, days: number, limit: number) {
    const since = Date.now() - days * 86400000;
    const events = readJSON<LocalEvent[]>('events', []).filter((e) => Date.parse(e.at) >= since);
    return topBy(events, (e) => e.event === 'view_objection' && (e.itemKind ?? '') === itemKind, limit);
  }

  async listProfiles(): Promise<Profile[]> {
    return [];
  }

  async setRole(): Promise<void> {
    throw new Error('Gestão de usuários disponível apenas com o Supabase configurado.');
  }
}

// --------------------------------------------------------------------------
// Modo nuvem — Supabase com RLS
// --------------------------------------------------------------------------

function fail(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export class SupabaseBackend implements Backend {
  readonly mode = 'supabase' as const;

  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async list<K extends UserCollection>(c: K): Promise<CollectionMap[K][]> {
    const { data, error } = await this.client
      .from(c)
      .select('data')
      .eq('user_id', this.userId)
      .order('updated_at', { ascending: false })
      .limit(c === 'history' ? HISTORY_CAP : 1000);
    fail(error);
    return (data ?? []).map((r: { data: CollectionMap[K] }) => r.data);
  }

  async upsert<K extends UserCollection>(c: K, item: CollectionMap[K]): Promise<void> {
    const { error } = await this.client
      .from(c)
      .upsert({ user_id: this.userId, id: item.id, data: item, updated_at: new Date().toISOString() }, { onConflict: 'user_id,id' });
    fail(error);
  }

  async remove(c: UserCollection, id: string): Promise<void> {
    const { error } = await this.client.from(c).delete().eq('user_id', this.userId).eq('id', id);
    fail(error);
  }

  async clear(c: UserCollection): Promise<void> {
    const { error } = await this.client.from(c).delete().eq('user_id', this.userId);
    fail(error);
  }

  async listOverrides(): Promise<ContentOverride[]> {
    const { data, error } = await this.client.from('content_items').select('kind,id,data,deleted,updated_at');
    fail(error);
    return (data ?? []).map((r: { kind: ContentKind; id: string; data: unknown; deleted: boolean; updated_at: string }) => ({
      kind: r.kind,
      id: r.id,
      data: r.data,
      deleted: r.deleted,
      updatedAt: r.updated_at,
    }));
  }

  async saveOverride(o: ContentOverride): Promise<void> {
    const { error } = await this.client.from('content_items').upsert(
      { kind: o.kind, id: o.id, data: o.data ?? {}, deleted: o.deleted, updated_at: new Date().toISOString() },
      { onConflict: 'kind,id' },
    );
    fail(error);
  }

  async deleteOverride(kind: ContentKind, id: string): Promise<void> {
    const { error } = await this.client.from('content_items').delete().eq('kind', kind).eq('id', id);
    fail(error);
  }

  async logEvent(e: EventInput): Promise<void> {
    const { error } = await this.client
      .from('usage_events')
      .insert({ user_id: this.userId, event: e.event, item_kind: e.itemKind ?? null, item_id: e.itemId ?? null });
    if (error) console.warn('Falha ao registrar evento de uso:', error.message);
  }

  async stats(days: number): Promise<UsageStats> {
    const { data, error } = await this.client.rpc('usage_stats', { p_days: days });
    fail(error);
    return data as UsageStats;
  }

  async popular(itemKind: string, days: number, limit: number) {
    const { data, error } = await this.client.rpc('popular_items', { p_kind: itemKind, p_days: days, p_limit: limit });
    fail(error);
    return ((data ?? []) as { item_id: string; total: number }[]).map((r) => ({ itemId: r.item_id, total: Number(r.total) }));
  }

  async listProfiles(): Promise<Profile[]> {
    const { data, error } = await this.client.from('profiles').select('id,email,nome,role,created_at').order('created_at');
    fail(error);
    return (data ?? []).map((r: { id: string; email: string; nome: string; role: Profile['role']; created_at: string }) => ({
      id: r.id,
      email: r.email,
      nome: r.nome,
      role: r.role,
      createdAt: r.created_at,
    }));
  }

  async setRole(userId: string, role: Profile['role']): Promise<void> {
    const { error } = await this.client.from('profiles').update({ role }).eq('id', userId);
    fail(error);
  }
}
