import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ToastItem {
  id: number;
  text: string;
  kind: 'ok' | 'error';
}

const ToastContext = createContext<{ show: (text: string, kind?: 'ok' | 'error') => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = useCallback((text: string, kind: 'ok' | 'error' = 'ok') => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list.slice(-2), { id, text, kind }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex max-w-md animate-fade-in items-center gap-2 rounded-lg border border-line bg-raised px-3.5 py-2.5 text-sm text-fg shadow-xl shadow-black/40"
          >
            {t.kind === 'ok' ? <CheckCircle2 size={16} className="shrink-0 text-accent" /> : <AlertTriangle size={16} className="shrink-0 text-danger" />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast fora do ToastProvider');
  return ctx;
}
