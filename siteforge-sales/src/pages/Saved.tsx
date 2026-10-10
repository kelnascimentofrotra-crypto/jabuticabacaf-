import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bookmark, Bot, History, MessageSquareText, Pencil, Save, Star, Trash2 } from 'lucide-react';
import { useApp } from '../data/store';
import type { FavoriteKind, HistoryEntry } from '../types';
import { Badge, Button, Card, CopyButton, EmptyState, MessageText, PageHeader, Tabs, Textarea } from '../components/ui';
import { useToast } from '../components/ui/toast';

type Tab = 'favoritos' | 'respostas' | 'historico';

const FAV_LABEL: Record<FavoriteKind, string> = {
  objection: 'Objeção',
  'niche-objection': 'Objeção de nicho',
  niche: 'Nicho',
  service: 'Serviço',
  quick: 'Resposta rápida',
};

const HIST_LABEL: Record<HistoryEntry['tipo'], string> = {
  busca: 'Busca',
  objecao: 'Objeção',
  nicho: 'Nicho',
  servico: 'Serviço',
  gerador: 'Gerador',
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - Date.parse(iso)) / 1000;
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function Saved() {
  const { data, content, toggleFavorite, clearHistory, saveCustomResponse, deleteCustomResponse } = useApp();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'favoritos';
  const [editing, setEditing] = useState<{ id: string; texto: string } | null>(null);

  const quickText = (id: string) => content.quick.find((q) => q.id === id)?.texto;

  return (
    <div>
      <PageHeader title="Favoritos, respostas e histórico" subtitle="Tudo o que você salvou e consultou recentemente." />
      <Tabs<Tab>
        value={tab}
        onChange={(t) => setParams({ tab: t }, { replace: true })}
        items={[
          { id: 'favoritos', label: 'Favoritos', count: data.favorites.length },
          { id: 'respostas', label: 'Minhas respostas', count: data.custom_responses.length },
          { id: 'historico', label: 'Histórico', count: data.history.length },
        ]}
        className="mb-5"
      />

      {tab === 'favoritos' && (
        <div className="space-y-2" data-testid="favorites-list">
          {data.favorites.length === 0 && (
            <EmptyState icon={<Star size={22} />} title="Nenhum favorito ainda">
              Use o botão “Favoritar” nas fichas de objeções, nichos e serviços para encontrá-los aqui.
            </EmptyState>
          )}
          {data.favorites.map((f) => {
            const qt = f.kind === 'quick' ? quickText(f.itemId) : undefined;
            return (
              <Card key={f.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <Badge>{FAV_LABEL[f.kind]}</Badge>
                  {f.kind === 'quick' ? (
                    <>
                      <p className="mt-1.5 font-medium">{f.label}</p>
                      {qt && <p className="mt-1 line-clamp-2 text-sm text-muted">{qt}</p>}
                    </>
                  ) : (
                    <Link to={f.href} className="mt-1.5 block font-medium hover:text-accent-strong">
                      {f.label}
                    </Link>
                  )}
                </div>
                <div className="flex gap-2">
                  {qt && <CopyButton text={qt} itemKind="quick" itemId={f.itemId} />}
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 size={13} />}
                    onClick={() => toggleFavorite({ id: f.id, kind: f.kind, itemId: f.itemId, label: f.label, href: f.href }).then(() => toast.show('Removido dos favoritos.'))}
                  >
                    Remover
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'respostas' && (
        <div className="grid gap-3 lg:grid-cols-2">
          {data.custom_responses.length === 0 && (
            <div className="lg:col-span-2">
              <EmptyState icon={<MessageSquareText size={22} />} title="Nenhuma resposta salva">
                Salve respostas no Gerador, na Central de Prospecção ou crie suas próprias versões nas fichas de objeções.
              </EmptyState>
            </div>
          )}
          {data.custom_responses.map((r) => {
            const o = r.objectionId ? content.objections.find((x) => x.id === r.objectionId) : undefined;
            return (
              <Card key={r.id} className="flex flex-col p-4">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone={r.origem === 'ia' ? 'accent' : 'neutral'} icon={r.origem === 'ia' ? <Bot size={11} /> : <Bookmark size={11} />}>
                    {r.origem === 'ia' ? 'Gerada por IA' : r.origem === 'gerador' ? 'Biblioteca' : 'Minha versão'}
                  </Badge>
                  <span className="text-xs text-dim">{timeAgo(r.createdAt)}</span>
                </div>
                <p className="mb-2 line-clamp-1 text-xs text-dim">
                  {o ? (
                    <Link to={`/objecoes/${o.id}`} className="hover:text-fg">
                      {o.frase}
                    </Link>
                  ) : (
                    r.titulo
                  )}
                </p>
                {editing?.id === r.id ? (
                  <Textarea value={editing.texto} onChange={(e) => setEditing({ id: r.id, texto: e.target.value })} aria-label="Editar resposta" />
                ) : (
                  <MessageText text={r.texto} className="flex-1 text-sm" />
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {editing?.id === r.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Save size={13} />}
                        onClick={async () => {
                          await saveCustomResponse({ ...r, texto: editing.texto });
                          setEditing(null);
                          toast.show('Resposta atualizada.');
                        }}
                      >
                        Salvar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <CopyButton text={r.texto} itemKind="custom" itemId={r.id} />
                      <Button size="sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => setEditing({ id: r.id, texto: r.texto })}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" icon={<Trash2 size={13} />} onClick={() => deleteCustomResponse(r.id).then(() => toast.show('Resposta excluída.'))}>
                        Excluir
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'historico' && (
        <div>
          {data.history.length === 0 ? (
            <EmptyState icon={<History size={22} />} title="Histórico vazio">
              Buscas, fichas e nichos consultados aparecem aqui.
            </EmptyState>
          ) : (
            <>
              <div className="mb-3 flex justify-end">
                <Button size="sm" variant="ghost" icon={<Trash2 size={13} />} onClick={() => clearHistory().then(() => toast.show('Histórico apagado.'))}>
                  Limpar histórico
                </Button>
              </div>
              <Card className="divide-y divide-line" data-testid="history-list">
                {data.history.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 px-4 py-3">
                    <Badge className="w-[78px] justify-center">{HIST_LABEL[h.tipo]}</Badge>
                    {h.href ? (
                      <Link to={h.href} className="min-w-0 flex-1 truncate text-sm text-muted hover:text-fg">
                        {h.label}
                      </Link>
                    ) : (
                      <span className="min-w-0 flex-1 truncate text-sm text-muted">{h.label}</span>
                    )}
                    <span className="shrink-0 text-xs text-dim">{timeAgo(h.createdAt)}</span>
                  </div>
                ))}
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
