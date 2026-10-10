import { lazy, Suspense, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AppProvider, useApp } from './data/store';
import { ToastProvider } from './components/ui/toast';
import { ConfirmProvider } from './components/ui/confirm';
import { AppShell } from './components/layout/AppShell';
import { Notice } from './components/ui';
import { Dashboard } from './pages/Dashboard';
import { LoginPage, RecoveryPage } from './pages/Login';

const Objections = lazy(() => import('./pages/Objections'));
const ObjectionDetail = lazy(() => import('./pages/ObjectionDetail'));
const Niches = lazy(() => import('./pages/Niches'));
const NicheDetail = lazy(() => import('./pages/NicheDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Compare = lazy(() => import('./pages/Compare'));
const Prospecting = lazy(() => import('./pages/Prospecting'));
const Generator = lazy(() => import('./pages/Generator'));
const FollowUp = lazy(() => import('./pages/FollowUp'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Proposals = lazy(() => import('./pages/Proposals'));
const SearchPage = lazy(() => import('./pages/Search'));
const Saved = lazy(() => import('./pages/Saved'));
const Admin = lazy(() => import('./pages/Admin'));
const SettingsPage = lazy(() => import('./pages/Settings'));

function Spinner() {
  return (
    <div className="grid min-h-[40vh] place-items-center text-dim" role="status" aria-label="Carregando">
      <Loader2 className="animate-spin" size={22} />
    </div>
  );
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function Gate() {
  const { ready, mode, session, recovery, loadError } = useApp();
  if (!ready) return <div className="min-h-screen"><Spinner /></div>;
  if (mode === 'supabase' && recovery) return <RecoveryPage />;
  if (mode === 'supabase' && !session) return <LoginPage />;
  return (
    <AppShell>
      {loadError && (
        <div className="mb-6">
          <Notice tone="danger" title="Não foi possível carregar seus dados">
            {loadError}
          </Notice>
        </div>
      )}
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/objecoes" element={<Objections />} />
          <Route path="/objecoes/:id" element={<ObjectionDetail />} />
          <Route path="/nichos" element={<Niches />} />
          <Route path="/nichos/:id" element={<NicheDetail />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/servicos/:id" element={<ServiceDetail />} />
          <Route path="/comparar" element={<Compare />} />
          <Route path="/prospeccao" element={<Prospecting />} />
          <Route path="/gerador" element={<Generator />} />
          <Route path="/follow-up" element={<FollowUp />} />
          <Route path="/simulador" element={<Simulator />} />
          <Route path="/simulador/:id" element={<Simulator />} />
          <Route path="/propostas" element={<Proposals />} />
          <Route path="/busca" element={<SearchPage />} />
          <Route path="/salvos" element={<Saved />} />
          <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
          <Route path="/config" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <ConfirmProvider>
          <AppProvider>
            <Gate />
          </AppProvider>
        </ConfirmProvider>
      </ToastProvider>
    </HashRouter>
  );
}
