import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type {
  CollectionMap,
  ContentKind,
  ContentOverride,
  CustomResponse,
  Favorite,
  FollowUpPlan,
  HistoryEntry,
  Profile,
  Proposal,
  TrainingAttempt,
  UserCollection,
} from '../types';
import { supabase } from '../lib/supabase';
import { getAIStatus, type AIStatus } from '../lib/ai';
import { buildIndex } from '../lib/search';
import { uid } from '../lib/text';
import { LocalBackend, SupabaseBackend, type Backend, type EventInput } from './backend';
import { BASE_CONTENT, mergeContent, type ContentBundle } from './content';

type Collections = { [K in UserCollection]: CollectionMap[K][] };

const EMPTY: Collections = {
  favorites: [],
  history: [],
  custom_responses: [],
  proposals: [],
  followup_plans: [],
  training_attempts: [],
};

export interface AuthApi {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, nome: string): Promise<{ needsConfirmation: boolean }>;
  resetPassword(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
}

interface AppContextValue {
  mode: 'local' | 'supabase';
  ready: boolean;
  loadError: string | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  recovery: boolean;
  auth: AuthApi;
  backend: Backend | null;

  content: ContentBundle;
  overrides: ContentOverride[];
  invalidOverrides: ContentOverride[];
  index: ReturnType<typeof buildIndex>;
  saveOverride(kind: ContentKind, id: string, data: unknown): Promise<void>;
  deleteContent(kind: ContentKind, id: string): Promise<void>;
  revertOverride(kind: ContentKind, id: string): Promise<void>;

  data: Collections;
  isFavorite(id: string): boolean;
  toggleFavorite(fav: Omit<Favorite, 'createdAt'>): Promise<boolean>;
  addHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): void;
  clearHistory(): Promise<void>;
  saveCustomResponse(r: Omit<CustomResponse, 'id' | 'createdAt'> & { id?: string }): Promise<CustomResponse>;
  deleteCustomResponse(id: string): Promise<void>;
  saveProposal(p: Proposal): Promise<void>;
  deleteProposal(id: string): Promise<void>;
  saveFollowupPlan(p: FollowUpPlan): Promise<void>;
  deleteFollowupPlan(id: string): Promise<void>;
  saveAttempt(a: TrainingAttempt): Promise<void>;
  logEvent(e: EventInput): void;

  ai: AIStatus & { checking: boolean };
  refreshAI(): Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp fora do AppProvider');
  return ctx;
}

const LOCAL_PROFILE: Profile = { id: 'local', email: '', nome: 'Você', role: 'admin' };

export function AppProvider({ children }: { children: ReactNode }) {
  const mode: 'local' | 'supabase' = supabase ? 'supabase' : 'local';
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [profile, setProfile] = useState<Profile | null>(supabase ? null : LOCAL_PROFILE);
  const [recovery, setRecovery] = useState(false);
  const [overrides, setOverrides] = useState<ContentOverride[]>([]);
  const [data, setData] = useState<Collections>(EMPTY);
  const [dataReady, setDataReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ai, setAI] = useState<AIStatus & { checking: boolean }>({ configured: false, checking: false });

  // ---------------- Autenticação ----------------
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data: s }) => {
      if (!active) return;
      setSession(s.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setData(EMPTY);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id ?? null;

  const backend = useMemo<Backend | null>(() => {
    if (!supabase) return new LocalBackend();
    return userId ? new SupabaseBackend(supabase, userId) : null;
  }, [userId]);

  // Perfil do usuário logado
  useEffect(() => {
    if (!supabase || !userId) return;
    let active = true;
    supabase
      .from('profiles')
      .select('id,email,nome,role,created_at')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (!active) return;
        if (error) {
          setLoadError(`Não foi possível carregar o perfil: ${error.message}`);
          return;
        }
        setProfile(
          row
            ? { id: row.id, email: row.email, nome: row.nome, role: row.role, createdAt: row.created_at }
            : { id: userId, email: session?.user.email ?? '', nome: session?.user.email ?? '', role: 'vendedor' },
        );
      });
    return () => {
      active = false;
    };
  }, [userId, session?.user.email]);

  // Dados do usuário + conteúdo editado
  useEffect(() => {
    if (!backend) {
      setDataReady(false);
      return;
    }
    let active = true;
    setDataReady(false);
    (async () => {
      try {
        const cols = Object.keys(EMPTY) as UserCollection[];
        const [ov, ...lists] = await Promise.all([backend.listOverrides(), ...cols.map((c) => backend.list(c))]);
        if (!active) return;
        setOverrides(ov);
        const next = { ...EMPTY } as Collections;
        cols.forEach((c, i) => ((next as Record<string, unknown>)[c] = lists[i]));
        setData(next);
        setLoadError(null);
      } catch (e) {
        if (active) setLoadError((e as Error).message);
      } finally {
        if (active) setDataReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [backend]);

  const refreshAI = useCallback(async () => {
    setAI((s) => ({ ...s, checking: true }));
    const st = await getAIStatus();
    setAI({ ...st, checking: false });
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAI({ configured: false, checking: false, reason: 'Modo local: a IA exige o Supabase configurado (a chave fica no servidor).' });
      return;
    }
    if (userId) refreshAI();
  }, [userId, refreshAI]);

  // ---------------- Conteúdo ----------------
  const { content, invalid } = useMemo(() => {
    const r = mergeContent(BASE_CONTENT, overrides);
    return { content: r.content, invalid: r.invalid };
  }, [overrides]);
  const index = useMemo(() => buildIndex(content.objections, content.niches), [content]);

  const requireBackend = useCallback((): Backend => {
    if (!backend) throw new Error('Sessão expirada. Entre novamente.');
    return backend;
  }, [backend]);

  const saveOverride = useCallback(
    async (kind: ContentKind, id: string, value: unknown) => {
      const o: ContentOverride = { kind, id, data: value, deleted: false, updatedAt: new Date().toISOString() };
      await requireBackend().saveOverride(o);
      setOverrides((list) => [...list.filter((x) => !(x.kind === kind && x.id === id)), o]);
    },
    [requireBackend],
  );

  const deleteContent = useCallback(
    async (kind: ContentKind, id: string) => {
      const o: ContentOverride = { kind, id, data: null, deleted: true, updatedAt: new Date().toISOString() };
      await requireBackend().saveOverride(o);
      setOverrides((list) => [...list.filter((x) => !(x.kind === kind && x.id === id)), o]);
    },
    [requireBackend],
  );

  const revertOverride = useCallback(
    async (kind: ContentKind, id: string) => {
      await requireBackend().deleteOverride(kind, id);
      setOverrides((list) => list.filter((x) => !(x.kind === kind && x.id === id)));
    },
    [requireBackend],
  );

  // ---------------- Coleções do usuário ----------------
  const upsertLocal = useCallback(<K extends UserCollection>(c: K, item: CollectionMap[K]) => {
    setData((d) => ({ ...d, [c]: [item, ...(d[c] as { id: string }[]).filter((i) => i.id !== item.id)] }));
  }, []);
  const removeLocal = useCallback((c: UserCollection, id: string) => {
    setData((d) => ({ ...d, [c]: (d[c] as { id: string }[]).filter((i) => i.id !== id) }));
  }, []);

  const logEvent = useCallback(
    (e: EventInput) => {
      backend?.logEvent(e).catch(() => undefined);
    },
    [backend],
  );

  const favIds = useMemo(() => new Set(data.favorites.map((f) => f.id)), [data.favorites]);
  const isFavorite = useCallback((id: string) => favIds.has(id), [favIds]);

  const toggleFavorite = useCallback(
    async (fav: Omit<Favorite, 'createdAt'>) => {
      const b = requireBackend();
      if (favIds.has(fav.id)) {
        await b.remove('favorites', fav.id);
        removeLocal('favorites', fav.id);
        return false;
      }
      const item: Favorite = { ...fav, createdAt: new Date().toISOString() };
      await b.upsert('favorites', item);
      upsertLocal('favorites', item);
      logEvent({ event: 'favorite', itemKind: fav.kind, itemId: fav.itemId });
      return true;
    },
    [favIds, requireBackend, removeLocal, upsertLocal, logEvent],
  );

  const lastHistory = useRef<string>('');
  const addHistory = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => {
      const key = `${entry.tipo}:${entry.label}`;
      if (lastHistory.current === key) return;
      lastHistory.current = key;
      const item: HistoryEntry = { ...entry, id: uid('h_'), createdAt: new Date().toISOString() };
      upsertLocal('history', item);
      backend?.upsert('history', item).catch(() => undefined);
    },
    [backend, upsertLocal],
  );

  const clearHistory = useCallback(async () => {
    await requireBackend().clear('history');
    lastHistory.current = '';
    setData((d) => ({ ...d, history: [] }));
  }, [requireBackend]);

  const saveCustomResponse = useCallback(
    async (r: Omit<CustomResponse, 'id' | 'createdAt'> & { id?: string }) => {
      const item: CustomResponse = { ...r, id: r.id ?? uid('r_'), createdAt: new Date().toISOString() };
      await requireBackend().upsert('custom_responses', item);
      upsertLocal('custom_responses', item);
      return item;
    },
    [requireBackend, upsertLocal],
  );

  const makeSaver = <K extends UserCollection>(c: K) =>
    async (item: CollectionMap[K]) => {
      await requireBackend().upsert(c, item);
      upsertLocal(c, item);
    };
  const makeRemover = (c: UserCollection) => async (id: string) => {
    await requireBackend().remove(c, id);
    removeLocal(c, id);
  };

  const value: AppContextValue = {
    mode,
    ready: authReady && (!session && supabase ? true : dataReady),
    loadError,
    session,
    profile,
    isAdmin: profile?.role === 'admin',
    recovery,
    backend,
    auth: {
      async signIn(email, password) {
        if (!supabase) return;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(translateAuthError(error.message));
      },
      async signUp(email, password, nome) {
        if (!supabase) return { needsConfirmation: false };
        const { data: res, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nome }, emailRedirectTo: window.location.origin + window.location.pathname },
        });
        if (error) throw new Error(translateAuthError(error.message));
        return { needsConfirmation: !res.session };
      },
      async resetPassword(email) {
        if (!supabase) return;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw new Error(translateAuthError(error.message));
      },
      async updatePassword(password) {
        if (!supabase) return;
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error(translateAuthError(error.message));
        setRecovery(false);
      },
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    },
    content,
    overrides,
    invalidOverrides: invalid,
    index,
    saveOverride,
    deleteContent,
    revertOverride,
    data,
    isFavorite,
    toggleFavorite,
    addHistory,
    clearHistory,
    saveCustomResponse,
    deleteCustomResponse: makeRemover('custom_responses'),
    saveProposal: makeSaver('proposals'),
    deleteProposal: makeRemover('proposals'),
    saveFollowupPlan: makeSaver('followup_plans'),
    deleteFollowupPlan: makeRemover('followup_plans'),
    saveAttempt: makeSaver('training_attempts'),
    logEvent,
    ai,
    refreshAI,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (verifique a caixa de entrada).';
  if (m.includes('user already registered')) return 'Este e-mail já tem cadastro. Use "Entrar" ou recupere a senha.';
  if (m.includes('password should be at least')) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (m.includes('signups not allowed')) return 'Novos cadastros estão desativados. Peça acesso a um administrador.';
  return msg;
}

/** Atalho para registrar a cópia de um texto e mostrar feedback. */
export function useEventLogger() {
  return useApp().logEvent;
}
