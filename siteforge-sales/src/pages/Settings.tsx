import { useState } from 'react';
import { Bot, Cloud, HardDrive, KeyRound, LogOut, RefreshCw, Trash2 } from 'lucide-react';
import { useApp } from '../data/store';
import { supabase } from '../lib/supabase';
import { Badge, Button, Card, Field, Input, Notice, PageHeader } from '../components/ui';
import { useToast } from '../components/ui/toast';

function Code({ children }: { children: string }) {
  return <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-bg p-3 text-xs leading-relaxed text-muted">{children}</pre>;
}

export default function SettingsPage() {
  const { mode, ai, refreshAI, profile, auth } = useApp();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState(profile?.nome ?? '');

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" subtitle="Modo de dados, integração de IA e sua conta." />

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-semibold">
            {mode === 'supabase' ? <Cloud size={17} className="text-info" /> : <HardDrive size={17} className="text-muted" />} Armazenamento e login
          </p>
          <Badge tone={mode === 'supabase' ? 'info' : 'neutral'}>{mode === 'supabase' ? 'Supabase conectado' : 'Modo local'}</Badge>
        </div>
        {mode === 'local' ? (
          <div className="space-y-3 text-sm text-muted">
            <p>
              Seus favoritos, histórico, propostas, follow-ups, treinos e edições de conteúdo ficam salvos <strong className="text-fg">somente neste navegador</strong>. Não há login nem compartilhamento entre pessoas.
            </p>
            <p>Para usar em equipe — com login, permissões de administrador, dados na nuvem e IA —, configure o Supabase:</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Crie um projeto em supabase.com e rode a migração <code className="text-fg">supabase/migrations/0001_init.sql</code>.</li>
              <li>
                Defina as variáveis de ambiente do build (arquivo <code className="text-fg">.env</code> ou painel da hospedagem):
                <Code>{'VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co\nVITE_SUPABASE_ANON_KEY=sua-chave-anon-publica'}</Code>
              </li>
              <li>Crie sua conta pelo app e promova-se a administrador (instruções no README).</li>
            </ol>
            <div className="pt-1">
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={() => {
                  if (!window.confirm('Apagar todos os dados salvos neste navegador (favoritos, histórico, propostas, follow-ups, treinos e edições de conteúdo)?')) return;
                  try {
                    Object.keys(localStorage)
                      .filter((k) => k.startsWith('sf:v1:'))
                      .forEach((k) => localStorage.removeItem(k));
                  } catch {
                    /* sem acesso ao armazenamento */
                  }
                  window.location.reload();
                }}
              >
                Apagar dados locais
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Dados salvos no Supabase com políticas de segurança por usuário (RLS). Cada vendedor vê apenas os próprios favoritos, propostas e históricos; o conteúdo comercial é compartilhado e só administradores podem editá-lo.
          </p>
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-semibold">
            <Bot size={17} className="text-accent" /> Inteligência artificial
          </p>
          <Badge tone={ai.configured ? 'accent' : 'neutral'}>{ai.checking ? 'Verificando…' : ai.configured ? `Ativa${ai.model ? ` · ${ai.model}` : ''}` : 'Não configurada'}</Badge>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p>
            Sem IA, o app usa a biblioteca pré-cadastrada (respostas escritas e revisadas) e sempre indica isso na tela. Com IA, o Gerador, o botão “Gerar alternativa” e o Simulador passam a escrever respostas sob medida, usando a biblioteca como referência.
          </p>
          {!ai.configured && ai.reason && <Notice tone="info">{ai.reason}</Notice>}
          <p>
            A chave da IA <strong className="text-fg">nunca fica no navegador</strong>: ela é um secret da Edge Function <code className="text-fg">ai</code> no Supabase.
          </p>
          <Code>{'supabase functions deploy ai\nsupabase secrets set ANTHROPIC_API_KEY=sk-ant-...\n# opcional: supabase secrets set AI_DAILY_LIMIT=150 AI_EFFORT=medium'}</Code>
          {mode === 'supabase' && (
            <Button size="sm" icon={<RefreshCw size={14} className={ai.checking ? 'animate-spin' : ''} />} onClick={refreshAI} disabled={ai.checking}>
              Verificar novamente
            </Button>
          )}
        </div>
      </Card>

      {mode === 'supabase' && profile && (
        <Card className="space-y-4 p-5">
          <p className="flex items-center gap-2 font-semibold">
            <KeyRound size={17} className="text-accent" /> Sua conta
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="E-mail" htmlFor="acc-email">
              <Input id="acc-email" value={profile.email} disabled />
            </Field>
            <Field label="Nome" htmlFor="acc-nome">
              <div className="flex gap-2">
                <Input id="acc-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                <Button
                  onClick={async () => {
                    const { error } = await supabase!.from('profiles').update({ nome: nome.trim() }).eq('id', profile.id);
                    toast.show(error ? error.message : 'Nome atualizado.', error ? 'error' : 'ok');
                  }}
                >
                  Salvar
                </Button>
              </div>
            </Field>
            <Field label="Nova senha" htmlFor="acc-pass" hint="Mínimo de 8 caracteres.">
              <div className="flex gap-2">
                <Input id="acc-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                <Button
                  disabled={password.length < 8}
                  onClick={async () => {
                    try {
                      await auth.updatePassword(password);
                      setPassword('');
                      toast.show('Senha alterada.');
                    } catch (e) {
                      toast.show((e as Error).message, 'error');
                    }
                  }}
                >
                  Alterar
                </Button>
              </div>
            </Field>
            <div className="flex items-end">
              <Button variant="danger" icon={<LogOut size={15} />} onClick={() => auth.signOut()}>
                Sair da conta
              </Button>
            </div>
          </div>
          <p className="text-xs text-dim">Papel: {profile.role === 'admin' ? 'Administrador' : 'Vendedor'}. Apenas administradores alteram papéis de usuários.</p>
        </Card>
      )}
    </div>
  );
}
