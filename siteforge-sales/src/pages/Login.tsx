import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../data/store';
import { Logo } from '../components/layout/Logo';
import { Button, Field, Input, Notice, Tabs } from '../components/ui';

type Mode = 'entrar' | 'criar' | 'recuperar';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="pointer-events-none fixed left-1/2 top-0 h-64 w-[60%] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { auth } = useApp();
  const [mode, setMode] = useState<Mode>('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'entrar') await auth.signIn(email.trim(), password);
      else if (mode === 'criar') {
        if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
        const r = await auth.signUp(email.trim(), password, nome.trim());
        if (r.needsConfirmation) setInfo('Conta criada! Enviamos um link de confirmação para o seu e-mail.');
      } else {
        await auth.resetPassword(email.trim());
        setInfo('Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <div className="card p-6">
        <h1 className="text-lg font-semibold">{mode === 'entrar' ? 'Entrar' : mode === 'criar' ? 'Criar conta' : 'Recuperar senha'}</h1>
        <p className="mb-4 mt-1 text-sm text-muted">Central de inteligência comercial para vender sites e sistemas.</p>
        <Tabs<Mode>
          value={mode}
          onChange={(m) => {
            setMode(m);
            setError(null);
            setInfo(null);
          }}
          items={[
            { id: 'entrar', label: 'Entrar' },
            { id: 'criar', label: 'Criar conta' },
            { id: 'recuperar', label: 'Esqueci a senha' },
          ]}
          className="mb-5"
        />
        <form onSubmit={submit} className="space-y-3">
          {mode === 'criar' && (
            <Field label="Seu nome" htmlFor="l-nome">
              <Input id="l-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required />
            </Field>
          )}
          <Field label="E-mail" htmlFor="l-email">
            <Input id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </Field>
          {mode !== 'recuperar' && (
            <Field label="Senha" htmlFor="l-pass" hint={mode === 'criar' ? 'Mínimo de 8 caracteres.' : undefined}>
              <Input id="l-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'criar' ? 'new-password' : 'current-password'} required />
            </Field>
          )}
          {error && <Notice tone="danger">{error}</Notice>}
          {info && (
            <Notice tone="accent" icon={<CheckCircle2 size={16} />}>
              {info}
            </Notice>
          )}
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={busy}>
            {busy && <Loader2 size={15} className="animate-spin" />}
            {mode === 'entrar' ? 'Entrar' : mode === 'criar' ? 'Criar conta' : 'Enviar link'}
          </Button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-dim">Novas contas entram como “vendedor”. Um administrador pode alterar permissões.</p>
    </Shell>
  );
}

export function RecoveryPage() {
  const { auth } = useApp();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Shell>
      <form
        className="card space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
            await auth.updatePassword(password);
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h1 className="text-lg font-semibold">Criar nova senha</h1>
        <Field label="Nova senha" htmlFor="r-pass">
          <Input id="r-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        </Field>
        {error && <Notice tone="danger">{error}</Notice>}
        <Button type="submit" variant="primary" className="w-full justify-center" disabled={busy}>
          Salvar nova senha
        </Button>
      </form>
    </Shell>
  );
}
