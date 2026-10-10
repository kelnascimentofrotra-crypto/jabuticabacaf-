import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../data/store';
import { SERVICE_KINDS, SERVICE_KIND_ORDER } from '../content/taxonomy';
import { SERVICE_ICON } from '../components/icons';
import { PageHeader } from '../components/ui';

const GROUP_TITLES: Record<string, string> = {
  site: 'Sites institucionais',
  landing: 'Landing pages',
  loja: 'Lojas virtuais',
  sistema: 'Sistemas e plataformas web',
  recorrente: 'Serviços recorrentes',
};

export default function Services() {
  const { content } = useApp();
  return (
    <div>
      <PageHeader
        title="Catálogo de serviços digitais"
        subtitle="Selecione exatamente o que você está vendendo. Cada serviço tem objeções e argumentos próprios — vender um site institucional não é igual a vender uma plataforma empresarial."
      />
      <div className="space-y-8">
        {SERVICE_KIND_ORDER.map((k) => {
          const list = content.services.filter((s) => s.grupo === k);
          if (!list.length) return null;
          const Icon = SERVICE_ICON[k];
          return (
            <section key={k}>
              <div className="mb-3 flex items-center gap-2">
                <Icon size={16} className="text-accent" />
                <h2 className="text-[15px] font-semibold">{GROUP_TITLES[k] ?? SERVICE_KINDS[k].label}</h2>
                <span className="text-xs text-dim">· {list.length}</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((s) => (
                  <Link key={s.id} to={`/servicos/${s.id}`} className="card card-hover group flex flex-col p-4" data-testid="service-card">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{s.nome}</p>
                      <ChevronRight size={15} className="shrink-0 text-dim transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted">{s.descricao}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
