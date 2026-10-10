import type { FieldSpec } from '../../components/admin/SchemaForm';
import type { ContentKind } from '../../types';
import {
  CATEGORIES,
  CATEGORY_ORDER,
  NICHE_CATEGORIES,
  NICHE_CATEGORY_ORDER,
  OBJECTIVES,
  OBJECTIVE_ORDER,
  RESISTANCE,
  SERVICE_KINDS,
  SERVICE_KIND_ORDER,
  STAGES,
  TRANSPARENCY,
  TRANSPARENCY_ORDER,
} from '../../content/taxonomy';

const opt = <T extends string>(ids: T[], label: (id: T) => string) => ids.map((value) => ({ value, label: label(value) }));

const serviceKindOpts = opt(SERVICE_KIND_ORDER, (k) => SERVICE_KINDS[k].label);

export function schemaFor(kind: ContentKind, serviceOptions: { value: string; label: string }[], objectionOptions: { value: string; label: string }[], nicheOptions: { value: string; label: string }[]): FieldSpec[] {
  switch (kind) {
    case 'objection':
      return [
        { key: 'id', label: 'Identificador (slug)', type: 'text', readOnlyAfterCreate: true, hint: 'Gerado a partir da frase. Não pode ser alterado depois de criado.' },
        { key: 'frase', label: '1. Objeção exata (o que o cliente falou)', type: 'text' },
        { key: 'biblioteca', label: 'Biblioteca', type: 'select', options: [{ value: 'geral', label: 'Venda de sites e soluções' }, { value: 'sistema', label: 'Sistemas personalizados' }] },
        { key: 'categoria', label: 'Tipo de objeção', type: 'select', options: opt(CATEGORY_ORDER, (c) => CATEGORIES[c].label) },
        { key: 'resistencia', label: 'Nível de resistência', type: 'select', options: opt(['baixa', 'media', 'alta'] as const, (r) => RESISTANCE[r].label) },
        { key: 'gatilhos', label: 'Outras formas de dizer (melhora a busca)', type: 'list' },
        { key: 'servicos', label: 'Tipos de serviço em que aparece', type: 'multiselect', options: serviceKindOpts },
        { key: 'servicosRelacionados', label: 'Serviços específicos relacionados', type: 'multiselect', options: serviceOptions, hint: 'Relacione a objeção a vários serviços do catálogo.' },
        { key: 'etapas', label: 'Etapas da venda', type: 'multiselect', options: STAGES.map((s) => ({ value: s.id, label: s.nome })) },
        { key: 'objetivos', label: 'Objetivos de resposta indicados', type: 'multiselect', options: opt(OBJECTIVE_ORDER, (o) => OBJECTIVES[o].label) },
        { key: 'significados', label: '2. O que pode significar', type: 'list' },
        { key: 'estrategia', label: '3. Melhor estratégia', type: 'textarea' },
        { key: 'descobrir', label: 'O que descobrir antes de responder', type: 'list' },
        {
          key: 'respostas',
          label: 'Respostas',
          type: 'group',
          fields: [
            { key: 'curta', label: '4. Resposta curta (WhatsApp)', type: 'textarea' },
            { key: 'consultiva', label: '5. Resposta consultiva', type: 'textarea' },
            { key: 'persuasiva', label: '6. Resposta persuasiva', type: 'textarea', rows: 4 },
            { key: 'ligacao', label: 'Versão para ligação', type: 'textarea' },
            { key: 'reuniao', label: '7. Como conduzir em reunião', type: 'textarea', rows: 4 },
          ],
        },
        { key: 'alternativas', label: 'Versões alternativas da resposta curta', type: 'list', hint: 'Usadas no botão "Gerar alternativa" quando a IA não está ativa.' },
        { key: 'perguntaEstrategica', label: '8. Pergunta estratégica', type: 'textarea', rows: 2 },
        { key: 'proximoPasso', label: '9. Próximo passo', type: 'textarea', rows: 2 },
        { key: 'naoDizer', label: '10. O que não dizer', type: 'list' },
        {
          key: 'variacoes',
          label: '11. Variações por serviço',
          type: 'group',
          fields: SERVICE_KIND_ORDER.map((k) => ({ key: k, label: SERVICE_KINDS[k].label, type: 'textarea' as const, rows: 2 })),
          hint: 'Deixe em branco os serviços em que a objeção não se aplica.',
        },
        { key: 'relacionadas', label: '12. Objeções relacionadas', type: 'multiselect', options: objectionOptions },
        {
          key: 'transparencia',
          label: 'Transparência (objeções de sistemas)',
          type: 'group',
          fields: TRANSPARENCY_ORDER.map((a) => ({ key: a, label: TRANSPARENCY[a].label, type: 'textarea' as const, rows: 2 })),
          hint: 'Opcional. Aspectos vazios exibem a orientação geral.',
        },
      ];
    case 'niche':
      return [
        { key: 'id', label: 'Identificador (slug)', type: 'text', readOnlyAfterCreate: true },
        { key: 'nome', label: 'Nome do nicho', type: 'text' },
        { key: 'categoria', label: 'Categoria', type: 'select', options: opt(NICHE_CATEGORY_ORDER, (c) => NICHE_CATEGORIES[c].label) },
        { key: 'resumo', label: 'Como o negócio funciona', type: 'textarea', rows: 4 },
        { key: 'comoClientesChegam', label: 'Como os clientes chegam', type: 'list' },
        { key: 'dores', label: 'Dores digitais típicas', type: 'list' },
        {
          key: 'solucoes',
          label: 'Soluções indicadas',
          type: 'objects',
          itemLabel: 'Solução',
          fields: [
            { key: 'servico', label: 'Serviço', type: 'select', options: serviceOptions },
            { key: 'porque', label: 'Por que faz sentido neste nicho', type: 'textarea', rows: 2 },
          ],
        },
        { key: 'argumentos', label: 'Argumentos de valor', type: 'list' },
        { key: 'perguntas', label: 'Perguntas de diagnóstico', type: 'list' },
        {
          key: 'objecoes',
          label: 'Objeções específicas',
          type: 'objects',
          itemLabel: 'Objeção',
          titleKey: 'frase',
          fields: [
            { key: 'id', label: 'Identificador', type: 'text' },
            { key: 'frase', label: 'Frase do cliente', type: 'text' },
            { key: 'porTras', label: 'O que pode estar por trás', type: 'textarea', rows: 2 },
            { key: 'resposta', label: 'Resposta para WhatsApp', type: 'textarea' },
            { key: 'pergunta', label: 'Pergunta estratégica', type: 'textarea', rows: 2 },
            { key: 'proximoPasso', label: 'Próximo passo', type: 'textarea', rows: 2 },
          ],
        },
        {
          key: 'conversa',
          label: 'Exemplo de conversa',
          type: 'objects',
          itemLabel: 'Mensagem',
          fields: [
            { key: 'autor', label: 'Quem fala', type: 'select', options: [{ value: 'vendedor', label: 'Vendedor' }, { value: 'cliente', label: 'Cliente' }] },
            { key: 'texto', label: 'Texto', type: 'textarea', rows: 2 },
          ],
        },
        {
          key: 'angulos',
          label: 'Como abordar cada tipo de objeção (comparador)',
          type: 'group',
          fields: [
            { key: 'preco', label: 'Preço', type: 'textarea', rows: 2 },
            { key: 'necessidade', label: 'Necessidade', type: 'textarea', rows: 2 },
            { key: 'confianca', label: 'Confiança', type: 'textarea', rows: 2 },
            { key: 'prazo', label: 'Prazo e momento', type: 'textarea', rows: 2 },
          ],
        },
        { key: 'cuidados', label: 'Cuidados (regras, ética, LGPD)', type: 'list' },
        { key: 'aberturaProspeccao', label: 'Pergunta de abertura para prospecção', type: 'textarea', rows: 2 },
      ];
    case 'service':
      return [
        { key: 'id', label: 'Identificador (slug)', type: 'text', readOnlyAfterCreate: true },
        { key: 'nome', label: 'Nome do serviço', type: 'text' },
        { key: 'grupo', label: 'Tipo', type: 'select', options: serviceKindOpts },
        { key: 'descricao', label: 'Descrição', type: 'textarea' },
        { key: 'paraQuem', label: 'Para quem', type: 'textarea', rows: 2 },
        { key: 'entregaveis', label: 'Entregáveis', type: 'list' },
        { key: 'argumentos', label: 'Argumentos de valor', type: 'list' },
        {
          key: 'objecoes',
          label: 'Objeções específicas do serviço',
          type: 'objects',
          itemLabel: 'Objeção',
          titleKey: 'frase',
          fields: [
            { key: 'frase', label: 'Frase do cliente', type: 'text' },
            { key: 'resposta', label: 'Resposta', type: 'textarea' },
          ],
        },
      ];
    case 'scenario':
      return [
        { key: 'id', label: 'Identificador (slug)', type: 'text', readOnlyAfterCreate: true },
        { key: 'titulo', label: 'Título', type: 'text' },
        { key: 'persona', label: 'Persona do cliente', type: 'textarea', rows: 2 },
        { key: 'nicho', label: 'Nicho (opcional)', type: 'select', options: [{ value: '', label: 'Nenhum' }, ...nicheOptions] },
        { key: 'servico', label: 'Serviço (opcional)', type: 'select', options: [{ value: '', label: 'Nenhum' }, ...serviceOptions] },
        { key: 'contexto', label: 'Contexto', type: 'textarea', rows: 2 },
        { key: 'objetivoTreino', label: 'Objetivo do treino', type: 'textarea', rows: 2 },
        { key: 'dificuldade', label: 'Dificuldade', type: 'select', options: opt(['baixa', 'media', 'alta'] as const, (r) => RESISTANCE[r].label) },
        {
          key: 'rodadas',
          label: 'Rodadas',
          type: 'objects',
          itemLabel: 'Rodada',
          titleKey: 'cliente',
          fields: [
            { key: 'cliente', label: 'Fala do cliente', type: 'textarea', rows: 2 },
            { key: 'clienteFrio', label: 'Fala se a resposta anterior foi fraca (opcional)', type: 'textarea', rows: 2 },
            { key: 'palavrasValor', label: 'Palavras que indicam argumento de valor', type: 'list' },
            { key: 'respostaModelo', label: 'Resposta modelo', type: 'textarea', rows: 3 },
            { key: 'porque', label: 'Justificativa da estratégia', type: 'textarea', rows: 2 },
          ],
        },
        { key: 'dicas', label: 'Dicas', type: 'list' },
      ];
    case 'followup':
      return [
        { key: 'id', label: 'Identificador (slug)', type: 'text', readOnlyAfterCreate: true },
        { key: 'nome', label: 'Nome da sequência', type: 'text' },
        { key: 'situacao', label: 'Situação', type: 'textarea', rows: 2 },
        { key: 'principios', label: 'Princípios', type: 'list' },
        {
          key: 'mensagens',
          label: 'Mensagens',
          type: 'objects',
          itemLabel: 'Mensagem',
          titleKey: 'objetivo',
          fields: [
            { key: 'diaSugerido', label: 'Dia sugerido (a partir do início)', type: 'number' },
            { key: 'objetivo', label: 'Objetivo', type: 'text' },
            { key: 'texto', label: 'Texto', type: 'textarea', rows: 3 },
          ],
        },
        { key: 'encerramento', label: 'Mensagem de encerramento', type: 'textarea', rows: 3 },
        { key: 'naoFazer', label: 'Não fazer', type: 'list' },
      ];
    case 'prospect':
      return [
        { key: 'id', label: 'Etapa', type: 'text', readOnlyAfterCreate: true },
        { key: 'nome', label: 'Nome da etapa', type: 'text' },
        { key: 'objetivo', label: 'Objetivo da mensagem', type: 'textarea', rows: 2 },
        { key: 'proximaAcao', label: 'Próxima ação sugerida', type: 'textarea', rows: 2 },
        {
          key: 'mensagens',
          label: 'Mensagens por situação',
          type: 'group',
          fields: [
            { key: 'semSite', label: 'Empresa sem site', type: 'textarea', rows: 3 },
            { key: 'siteAntigo', label: 'Empresa com site antigo', type: 'textarea', rows: 3 },
            { key: 'sistema', label: 'Precisa de sistema', type: 'textarea', rows: 3 },
          ],
        },
        { key: 'roteiroLigacao', label: 'Roteiro de ligação', type: 'textarea', rows: 3 },
        { key: 'assuntoEmail', label: 'Assunto de e-mail', type: 'text' },
        { key: 'cuidado', label: 'Cuidado', type: 'textarea', rows: 2 },
      ];
    case 'quick':
      return [
        { key: 'id', label: 'Identificador (slug)', type: 'text', readOnlyAfterCreate: true },
        { key: 'titulo', label: 'Título', type: 'text' },
        { key: 'texto', label: 'Texto', type: 'textarea', rows: 4 },
      ];
  }
}

export const TITLE_KEY: Record<ContentKind, string> = {
  objection: 'frase',
  niche: 'nome',
  service: 'nome',
  scenario: 'titulo',
  followup: 'nome',
  prospect: 'nome',
  quick: 'titulo',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Ajustes finais antes de salvar (remove campos opcionais vazios). */
export function finalize(kind: ContentKind, obj: Record<string, unknown>): Record<string, unknown> {
  const out = { ...obj };
  const compact = (v: unknown) => {
    if (!v || typeof v !== 'object') return undefined;
    const entries = Object.entries(v as Record<string, unknown>).filter(([, x]) => typeof x === 'string' && x.trim());
    return entries.length ? Object.fromEntries(entries) : undefined;
  };
  if (kind === 'objection') {
    out.variacoes = compact(out.variacoes) ?? {};
    const t = compact(out.transparencia);
    if (t) out.transparencia = t;
    else delete out.transparencia;
    if (!(out.servicosRelacionados as string[] | undefined)?.length) delete out.servicosRelacionados;
  }
  if (kind === 'scenario') {
    if (!out.nicho) delete out.nicho;
    if (!out.servico) delete out.servico;
    out.rodadas = ((out.rodadas as Record<string, unknown>[]) ?? []).map((r) => {
      const x = { ...r };
      if (!x.clienteFrio) delete x.clienteFrio;
      return x;
    });
  }
  return out;
}
