// Tipos centrais do conteúdo comercial e dos dados do usuário.

/** Grandes famílias de serviço — usadas nas variações de cada objeção. */
export type ServiceKind = 'site' | 'landing' | 'loja' | 'sistema' | 'recorrente';

export type ObjectionCategory =
  | 'preco'
  | 'necessidade'
  | 'confianca'
  | 'concorrencia'
  | 'prazo'
  | 'pagamento'
  | 'resultados'
  | 'manutencao'
  | 'sistemas'
  | 'decisao'
  | 'sumiu';

export type Resistance = 'baixa' | 'media' | 'alta';

export type StageId =
  | 'primeiro-contato'
  | 'respondeu'
  | 'interesse'
  | 'perguntou-preco'
  | 'recebeu-proposta'
  | 'objecao'
  | 'indeciso'
  | 'parou-de-responder'
  | 'recusou'
  | 'aceitou-reuniao';

export type ChannelId = 'whatsapp' | 'instagram' | 'ligacao' | 'email' | 'presencial' | 'linkedin';

export type ObjectiveId =
  | 'reuniao'
  | 'defender-valor'
  | 'explicar-servico'
  | 'descobrir-necessidade'
  | 'recuperar-lead'
  | 'comparacao-preco'
  | 'negociar-escopo'
  | 'agendar-retorno'
  | 'fechar'
  | 'encerrar';

export type TransparencyAspect =
  | 'escopo'
  | 'prazo'
  | 'manutencao'
  | 'seguranca'
  | 'propriedade'
  | 'integracoes'
  | 'implantacao'
  | 'custos';

export interface ObjectionResponses {
  /** Mensagem natural para WhatsApp. */
  curta: string;
  /** Mensagem com pergunta de diagnóstico. */
  consultiva: string;
  /** Argumento para demonstrar valor. */
  persuasiva: string;
  /** Versão falada, para ligação. */
  ligacao: string;
  /** Como conduzir em reunião presencial ou por chamada de vídeo. */
  reuniao: string;
}

export interface Objection {
  id: string;
  /** Biblioteca: objeções gerais da venda de soluções digitais ou específicas de sistemas personalizados. */
  biblioteca: 'geral' | 'sistema';
  frase: string;
  categoria: ObjectionCategory;
  /** Outras formas como o cliente costuma dizer a mesma coisa (melhora a busca). */
  gatilhos: string[];
  resistencia: Resistance;
  etapas: StageId[];
  servicos: ServiceKind[];
  /** Serviços específicos do catálogo com os quais a objeção é especialmente relacionada. */
  servicosRelacionados?: string[];
  objetivos: ObjectiveId[];
  significados: string[];
  estrategia: string;
  descobrir: string[];
  respostas: ObjectionResponses;
  /** Versões alternativas da resposta curta (usadas em "Gerar alternativa" sem IA). */
  alternativas: string[];
  perguntaEstrategica: string;
  proximoPasso: string;
  naoDizer: string[];
  variacoes: Partial<Record<ServiceKind, string>>;
  relacionadas: string[];
  /** Apenas em objeções de sistemas: como tratar cada aspecto com transparência. */
  transparencia?: Partial<Record<TransparencyAspect, string>>;
}

export type NicheCategoryId = 'beleza' | 'saude' | 'alimentacao' | 'construcao' | 'profissionais' | 'comercio' | 'industria';

export interface NicheObjection {
  id: string;
  frase: string;
  porTras: string;
  resposta: string;
  pergunta: string;
  proximoPasso: string;
}

export interface ConversationLine {
  autor: 'cliente' | 'vendedor';
  texto: string;
}

export interface Niche {
  id: string;
  nome: string;
  categoria: NicheCategoryId;
  /** Como o negócio funciona e decide. */
  resumo: string;
  comoClientesChegam: string[];
  dores: string[];
  solucoes: { servico: string; porque: string }[];
  argumentos: string[];
  perguntas: string[];
  objecoes: NicheObjection[];
  conversa: ConversationLine[];
  /** Como abordar cada tipo de objeção neste nicho (alimenta o comparador). */
  angulos: {
    preco: string;
    necessidade: string;
    confianca: string;
    prazo: string;
  };
  cuidados: string[];
  aberturaProspeccao: string;
}

export interface ServiceObjection {
  frase: string;
  resposta: string;
}

export interface Service {
  id: string;
  nome: string;
  grupo: ServiceKind;
  descricao: string;
  paraQuem: string;
  entregaveis: string[];
  argumentos: string[];
  objecoes: ServiceObjection[];
}

export interface ProspectStage {
  id: StageId;
  nome: string;
  objetivo: string;
  proximaAcao: string;
  mensagens: { semSite: string; siteAntigo: string; sistema: string };
  roteiroLigacao: string;
  assuntoEmail: string;
  cuidado: string;
}

export interface FollowUpMessage {
  diaSugerido: number;
  objetivo: string;
  texto: string;
}

export interface FollowUpSequence {
  id: string;
  nome: string;
  situacao: string;
  principios: string[];
  mensagens: FollowUpMessage[];
  /** Mensagem de encerramento respeitoso — sempre a última da sequência. */
  encerramento: string;
  naoFazer: string[];
}

export interface ScenarioRound {
  cliente: string;
  /** Fala do cliente quando a resposta anterior foi fraca. */
  clienteFrio?: string;
  palavrasValor: string[];
  respostaModelo: string;
  porque: string;
}

export interface Scenario {
  id: string;
  titulo: string;
  persona: string;
  nicho?: string;
  servico?: string;
  contexto: string;
  objetivoTreino: string;
  dificuldade: Resistance;
  rodadas: ScenarioRound[];
  dicas: string[];
}

export interface QuickReply {
  id: string;
  titulo: string;
  texto: string;
}

// ---------- Conteúdo editável ----------

export type ContentKind = 'objection' | 'niche' | 'service' | 'scenario' | 'followup' | 'prospect' | 'quick';

export interface ContentOverride {
  kind: ContentKind;
  id: string;
  data: unknown;
  deleted: boolean;
  updatedAt: string;
}

// ---------- Dados do usuário ----------

export type FavoriteKind = 'objection' | 'niche-objection' | 'niche' | 'service' | 'quick';

export interface Favorite {
  id: string; // `${kind}:${itemId}`
  kind: FavoriteKind;
  itemId: string;
  label: string;
  href: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  tipo: 'busca' | 'objecao' | 'nicho' | 'servico' | 'gerador';
  label: string;
  href?: string;
  createdAt: string;
}

export interface CustomResponse {
  id: string;
  titulo: string;
  texto: string;
  origem: 'manual' | 'gerador' | 'ia';
  objectionId?: string;
  nicheId?: string;
  serviceId?: string;
  createdAt: string;
}

export interface ProposalItem {
  id: string;
  texto: string;
  /** Essencial para a primeira entrega (usado na sugestão de fases). */
  prioritario: boolean;
}

export interface ProposalTier {
  nome: 'Essencial' | 'Profissional' | 'Completa';
  ativo: boolean;
  funcionalidades: ProposalItem[];
  prazo: string;
  valorImplantacao: number | null;
  mensalidade: number | null;
  observacao: string;
}

export interface Proposal {
  id: string;
  cliente: string;
  nicho: string;
  servico: string;
  escopo: string;
  hospedagem: string;
  manutencao: string;
  integracoes: string;
  pagamento: string;
  limites: string;
  opcionais: string;
  validade: string;
  tiers: ProposalTier[];
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpPlan {
  id: string;
  lead: string;
  sequenceId: string;
  inicio: string;
  mensagens: { data: string; texto: string; objetivo: string; enviada: boolean }[];
  encerrado: boolean;
  createdAt: string;
}

export interface TrainingAttempt {
  id: string;
  scenarioId: string;
  modo: 'regras' | 'ia';
  notaMedia: number;
  rodadas: { resposta: string; nota: number }[];
  createdAt: string;
}

export type UserCollection =
  | 'favorites'
  | 'history'
  | 'custom_responses'
  | 'proposals'
  | 'followup_plans'
  | 'training_attempts';

export interface CollectionMap {
  favorites: Favorite;
  history: HistoryEntry;
  custom_responses: CustomResponse;
  proposals: Proposal;
  followup_plans: FollowUpPlan;
  training_attempts: TrainingAttempt;
}

export type UsageEvent = 'view_objection' | 'copy' | 'search' | 'favorite' | 'generate' | 'ai_request' | 'train' | 'view_niche';

export interface Profile {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'vendedor';
  createdAt?: string;
}
