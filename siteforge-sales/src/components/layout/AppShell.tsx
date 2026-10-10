import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Bot,
  CalendarClock,
  Cloud,
  Columns3,
  FileText,
  GraduationCap,
  HardDrive,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareWarning,
  MoreHorizontal,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Store,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '../../data/store';
import { Badge, cn, Kbd } from '../ui';
import { CommandPalette } from './CommandPalette';
import { Logo } from './Logo';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Responder',
    items: [
      { to: '/', label: 'Painel', icon: LayoutDashboard },
      { to: '/objecoes', label: 'Objeções', icon: MessageSquareWarning },
      { to: '/gerador', label: 'Gerador de respostas', icon: Sparkles },
      { to: '/busca', label: 'Busca avançada', icon: Search },
    ],
  },
  {
    title: 'Vender',
    items: [
      { to: '/nichos', label: 'Nichos', icon: Store },
      { to: '/servicos', label: 'Serviços', icon: Layers },
      { to: '/comparar', label: 'Comparar estratégias', icon: Columns3 },
      { to: '/prospeccao', label: 'Central de Prospecção', icon: Send },
      { to: '/follow-up', label: 'Follow-up', icon: CalendarClock },
      { to: '/propostas', label: 'Propostas', icon: FileText },
    ],
  },
  {
    title: 'Treinar',
    items: [{ to: '/simulador', label: 'Simulador de clientes', icon: GraduationCap }],
  },
  {
    title: 'Seu espaço',
    items: [
      { to: '/salvos', label: 'Favoritos e histórico', icon: Bookmark },
      { to: '/admin', label: 'Administração', icon: Shield, adminOnly: true },
      { to: '/config', label: 'Configurações', icon: Settings },
    ],
  },
];

const MOBILE_TABS: NavItem[] = [
  { to: '/', label: 'Painel', icon: LayoutDashboard },
  { to: '/objecoes', label: 'Objeções', icon: MessageSquareWarning },
  { to: '/gerador', label: 'Gerador', icon: Sparkles },
  { to: '/nichos', label: 'Nichos', icon: Store },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin } = useApp();
  return (
    <nav aria-label="Navegação principal" className="space-y-5">
      {NAV_GROUPS.map((g) => (
        <div key={g.title}>
          <p className="eyebrow mb-1.5 px-3">{g.title}</p>
          <ul className="space-y-0.5">
            {g.items
              .filter((i) => !i.adminOnly || isAdmin)
              .map((i) => (
                <li key={i.to}>
                  <NavLink
                    to={i.to}
                    end={i.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive ? 'bg-accent/10 text-accent-strong' : 'text-muted hover:bg-raised hover:text-fg',
                      )
                    }
                  >
                    <i.icon size={16} className="shrink-0" />
                    <span className="truncate">{i.label}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function StatusBadges() {
  const { mode, ai } = useApp();
  return (
    <div className="flex items-center gap-1.5">
      <Badge tone={mode === 'supabase' ? 'info' : 'neutral'} icon={mode === 'supabase' ? <Cloud size={11} /> : <HardDrive size={11} />}>
        {mode === 'supabase' ? 'Nuvem' : 'Local'}
      </Badge>
      <Badge tone={ai.configured ? 'accent' : 'neutral'} icon={<Bot size={11} />}>
        {ai.checking ? 'IA…' : ai.configured ? 'IA ativa' : 'Sem IA'}
      </Badge>
    </div>
  );
}

function UserBox() {
  const { profile, mode, auth } = useApp();
  if (!profile) return null;
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-line bg-bg/60 p-2.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-accent-strong">
        {(profile.nome || profile.email || '?').slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-fg">{profile.nome || profile.email}</p>
        <p className="truncate text-[11px] text-dim">{mode === 'local' ? 'Modo local' : profile.role === 'admin' ? 'Administrador' : 'Vendedor'}</p>
      </div>
      {mode === 'supabase' && (
        <button type="button" onClick={() => auth.signOut()} className="rounded-md p-1.5 text-dim hover:bg-raised hover:text-fg" aria-label="Sair" title="Sair">
          <LogOut size={15} />
        </button>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen lg:pl-[248px]">
      {/* Sidebar desktop */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-[#0c0d10] lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <NavList />
        </div>
        <div className="border-t border-line p-3">
          <UserBox />
        </div>
      </aside>

      {/* Topbar */}
      <header className="no-print sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur lg:h-16 lg:px-8">
        <button type="button" className="rounded-md p-1.5 text-muted hover:bg-raised lg:hidden" aria-label="Abrir menu" onClick={() => setDrawerOpen(true)}>
          <Menu size={20} />
        </button>
        <div className="lg:hidden">
          <Logo compact />
        </div>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="ml-auto flex h-9 min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-dim transition-colors hover:border-line-strong hover:text-muted sm:w-80 lg:ml-0 lg:w-[420px]"
          aria-label="Buscar objeções, nichos e páginas"
        >
          <Search size={15} className="shrink-0" />
          <span className="hidden truncate sm:inline">Buscar objeção, nicho ou serviço…</span>
          <span className="ml-auto hidden items-center gap-1 sm:flex">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
        <div className="ml-auto hidden md:block">
          <StatusBadges />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">{children}</main>

      {/* Navegação inferior (celular) */}
      <nav aria-label="Navegação rápida" className="no-print fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-[#0c0d10]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {MOBILE_TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[10px]', isActive ? 'text-accent-strong' : 'text-dim')}
          >
            <t.icon size={18} />
            {t.label}
          </NavLink>
        ))}
        <button type="button" onClick={() => setDrawerOpen(true)} className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-dim">
          <MoreHorizontal size={18} />
          Mais
        </button>
      </nav>

      {/* Gaveta (celular) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="flex h-full w-[84%] max-w-[300px] animate-slide-in flex-col border-r border-line bg-[#0c0d10]" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-14 items-center justify-between px-4">
              <Logo />
              <button type="button" aria-label="Fechar menu" className="rounded-md p-1.5 text-muted hover:bg-raised" onClick={() => setDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="px-4 pb-3">
              <StatusBadges />
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="border-t border-line p-3">
              <UserBox />
            </div>
          </div>
        </div>
      )}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={(to) => navigate(to)} />
    </div>
  );
}
