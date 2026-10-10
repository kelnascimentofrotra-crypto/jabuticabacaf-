import type {
  ChannelId,
  NicheCategoryId,
  ObjectionCategory,
  ObjectiveId,
  Resistance,
  ServiceKind,
  StageId,
  TransparencyAspect,
} from '../types';

export const CATEGORIES: Record<ObjectionCategory, { label: string; atalho: string; descricao: string; tone: string }> = {
  preco: {
    label: 'Preço',
    atalho: 'Objeções sobre preço',
    descricao: 'Valor, orçamento, comparação com quem cobra menos e pedidos de desconto.',
    tone: 'amber',
  },
  necessidade: {
    label: 'Necessidade',
    atalho: 'Objeções sobre necessidade',
    descricao: '"Já tenho Instagram", "meu negócio é pequeno", "não preciso aparecer no Google".',
    tone: 'sky',
  },
  confianca: {
    label: 'Confiança',
    atalho: 'Objeções sobre confiança',
    descricao: 'Medo de não receber, portfólio, experiência, garantias e contrato.',
    tone: 'violet',
  },
  concorrencia: {
    label: 'Concorrentes',
    atalho: 'Objeções sobre concorrentes',
    descricao: 'Sobrinho, outro desenvolvedor, agência grande, plataforma pronta, IA.',
    tone: 'rose',
  },
  prazo: {
    label: 'Prazo e momento',
    atalho: 'Objeções sobre prazo',
    descricao: '"Agora não", "próximo mês", "vai demorar muito", "não posso parar a operação".',
    tone: 'cyan',
  },
  pagamento: {
    label: 'Pagamento',
    atalho: 'Objeções sobre pagamento',
    descricao: 'Mensalidade, hospedagem, pagar só quando vender, contrato e condições.',
    tone: 'orange',
  },
  resultados: {
    label: 'Resultados',
    atalho: 'Objeções sobre resultados',
    descricao: 'Retorno do investimento, garantia de resultado, "não sei se traz cliente".',
    tone: 'emerald',
  },
  manutencao: {
    label: 'Manutenção',
    atalho: 'Objeções sobre manutenção',
    descricao: 'Quem atualiza, dependência do desenvolvedor, alterações futuras.',
    tone: 'teal',
  },
  sistemas: {
    label: 'Sistemas',
    atalho: 'Objeções sobre sistemas personalizados',
    descricao: 'Planilhas, software pronto, dados, integrações, código e implantação.',
    tone: 'indigo',
  },
  decisao: {
    label: 'Decisão',
    atalho: 'Vou pensar, sócio e proposta',
    descricao: '"Vou pensar", "preciso falar com meu sócio", "me manda uma proposta".',
    tone: 'fuchsia',
  },
  sumiu: {
    label: 'Cliente sumiu',
    atalho: 'Clientes que desaparecem depois do orçamento',
    descricao: 'Visualizou e não respondeu, pediu preço e sumiu, ficou de dar retorno.',
    tone: 'slate',
  },
};

export const CATEGORY_ORDER: ObjectionCategory[] = [
  'preco',
  'necessidade',
  'confianca',
  'concorrencia',
  'prazo',
  'pagamento',
  'resultados',
  'manutencao',
  'sistemas',
  'decisao',
  'sumiu',
];

export const SERVICE_KINDS: Record<ServiceKind, { label: string; curto: string }> = {
  site: { label: 'Site institucional', curto: 'Site' },
  landing: { label: 'Landing page', curto: 'Landing page' },
  loja: { label: 'Loja virtual / catálogo', curto: 'Loja virtual' },
  sistema: { label: 'Sistema personalizado', curto: 'Sistema' },
  recorrente: { label: 'Serviço recorrente', curto: 'Recorrente' },
};

export const SERVICE_KIND_ORDER: ServiceKind[] = ['site', 'landing', 'loja', 'sistema', 'recorrente'];

export const RESISTANCE: Record<Resistance, { label: string; descricao: string }> = {
  baixa: { label: 'Baixa', descricao: 'Dúvida pontual; o cliente está aberto e só precisa de clareza.' },
  media: { label: 'Média', descricao: 'Há uma barreira real, mas a conversa continua.' },
  alta: { label: 'Alta', descricao: 'Recusa ou desconfiança forte; o foco é preservar a relação.' },
};

export const STAGES: { id: StageId; nome: string }[] = [
  { id: 'primeiro-contato', nome: 'Primeiro contato' },
  { id: 'respondeu', nome: 'Cliente respondeu' },
  { id: 'interesse', nome: 'Cliente demonstrou interesse' },
  { id: 'perguntou-preco', nome: 'Cliente perguntou o preço' },
  { id: 'recebeu-proposta', nome: 'Cliente recebeu a proposta' },
  { id: 'objecao', nome: 'Cliente levantou uma objeção' },
  { id: 'indeciso', nome: 'Cliente ficou indeciso' },
  { id: 'parou-de-responder', nome: 'Cliente parou de responder' },
  { id: 'recusou', nome: 'Cliente recusou' },
  { id: 'aceitou-reuniao', nome: 'Cliente aceitou uma reunião' },
];

export const STAGE_LABEL: Record<StageId, string> = Object.fromEntries(STAGES.map((s) => [s.id, s.nome])) as Record<
  StageId,
  string
>;

export const CHANNELS: Record<ChannelId, { label: string; regra: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    regra:
      'Mensagens curtas, uma ideia por vez e no máximo uma pergunta. Evite áudios longos no primeiro contato e respeite horário comercial.',
  },
  instagram: {
    label: 'Instagram (Direct)',
    regra:
      'Comece pelo que você viu no perfil de forma específica e verdadeira. Não envie link no primeiro contato; peça permissão para continuar a conversa.',
  },
  ligacao: {
    label: 'Ligação',
    regra:
      'Diga quem é e o motivo em até 15 segundos, pergunte se é um bom momento e conduza com perguntas. Anote as palavras do cliente para usar no resumo depois.',
  },
  email: {
    label: 'E-mail',
    regra:
      'Assunto claro e específico, três parágrafos curtos no máximo e um único pedido no final. Assine com nome, contato e portfólio.',
  },
  presencial: {
    label: 'Presencial',
    regra:
      'Respeite o movimento do estabelecimento: se estiver cheio, peça um horário melhor. Leve exemplos no celular, não um discurso decorado.',
  },
  linkedin: {
    label: 'LinkedIn',
    regra:
      'Conexão com nota curta e sem pitch. Venda só depois de uma troca real; ideal para B2B, indústrias, consultorias e escritórios.',
  },
};

export const CHANNEL_ORDER: ChannelId[] = ['whatsapp', 'instagram', 'ligacao', 'email', 'presencial', 'linkedin'];

export const OBJECTIVES: Record<ObjectiveId, { label: string; descricao: string; fechamentos: string[] }> = {
  reuniao: {
    label: 'Conseguir uma reunião',
    descricao: 'Trocar a conversa por texto por 15–20 minutos de chamada ou visita.',
    fechamentos: [
      'Se fizer sentido, a gente pode conversar 15 minutos por chamada e eu te mostro como ficaria na prática. Qual período é melhor para você, manhã ou tarde?',
      'Acho que fica mais fácil explicar mostrando. Você teria 15 minutos nesta semana para uma chamada rápida?',
      'Posso te mostrar alguns exemplos parecidos numa conversa rápida, sem compromisso. Quinta ou sexta funcionam para você?',
    ],
  },
  'defender-valor': {
    label: 'Defender o valor',
    descricao: 'Mostrar o que está incluído e por que o investimento faz sentido, sem baixar o preço.',
    fechamentos: [
      'Se quiser, eu detalho item por item o que está incluído para você comparar com calma.',
      'Posso te mandar a lista do que está incluso e do que fica de fora, para a comparação ficar justa.',
    ],
  },
  'explicar-servico': {
    label: 'Explicar o serviço',
    descricao: 'Deixar claro o que é entregue, como funciona e o que o cliente precisa fazer.',
    fechamentos: [
      'Quer que eu te explique o passo a passo de como funciona, do primeiro contato até o site no ar?',
      'Posso te mandar um resumo curto das etapas e do que eu preciso de você em cada uma.',
    ],
  },
  'descobrir-necessidade': {
    label: 'Descobrir a necessidade',
    descricao: 'Entender o problema real antes de oferecer qualquer solução.',
    fechamentos: [
      'Antes de te indicar qualquer coisa, me conta: hoje, o que mais toma o seu tempo nessa parte?',
      'Me ajuda a entender melhor: o que precisaria mudar para você considerar que valeu a pena?',
    ],
  },
  'recuperar-lead': {
    label: 'Recuperar um lead',
    descricao: 'Retomar uma conversa parada sem cobrar resposta.',
    fechamentos: [
      'Se o momento mudou, tudo bem — só me avisa para eu não ficar te incomodando.',
      'Se ainda fizer sentido, sigo por aqui. Se não, sem problema nenhum.',
    ],
  },
  'comparacao-preco': {
    label: 'Responder a uma comparação de preços',
    descricao: 'Comparar escopos, não apenas valores.',
    fechamentos: [
      'Se puder me mostrar o que está incluso no outro orçamento, eu te ajudo a comparar item por item — mesmo que no final a outra opção seja melhor para você.',
      'Vale comparar o que cada proposta entrega, quem é dono do domínio e como funciona o suporte depois. Quer que eu te mande uma lista para conferir?',
    ],
  },
  'negociar-escopo': {
    label: 'Negociar o escopo',
    descricao: 'Ajustar o que é entregue em vez de reduzir o preço do mesmo pacote.',
    fechamentos: [
      'Uma opção é começar com uma versão mais enxuta e incluir o restante numa segunda fase. Quer que eu monte essa alternativa?',
      'Posso separar o que é essencial agora do que pode ficar para depois, e te mostro como fica o valor de cada parte.',
    ],
  },
  'agendar-retorno': {
    label: 'Agendar um retorno',
    descricao: 'Combinar uma data concreta para retomar, com permissão do cliente.',
    fechamentos: [
      'Combinado. Posso te chamar na próxima terça para retomarmos? Se antes disso surgir alguma dúvida, é só me mandar.',
      'Qual seria um bom dia para eu te procurar de novo? Assim não fico te chamando fora de hora.',
    ],
  },
  fechar: {
    label: 'Fechar a venda',
    descricao: 'Facilitar a decisão de quem já está pronto: próximos passos claros e simples.',
    fechamentos: [
      'Se estiver tudo certo, eu te mando o contrato hoje e já reservamos a data de início. Pode ser?',
      'Para começar, só preciso da sua confirmação e do envio do logo e das fotos. Quer que eu te mande o checklist?',
    ],
  },
  encerrar: {
    label: 'Encerrar a negociação com profissionalismo',
    descricao: 'Sair da conversa deixando a porta aberta e a reputação intacta.',
    fechamentos: [
      'Agradeço muito a conversa e a sinceridade. Se em algum momento fizer sentido, é só me chamar. Sucesso!',
      'Entendido, e obrigado pelo retorno. Vou parar de te chamar sobre isso; se precisar no futuro, sabe onde me encontrar.',
    ],
  },
};

export const OBJECTIVE_ORDER: ObjectiveId[] = [
  'reuniao',
  'defender-valor',
  'explicar-servico',
  'descobrir-necessidade',
  'recuperar-lead',
  'comparacao-preco',
  'negociar-escopo',
  'agendar-retorno',
  'fechar',
  'encerrar',
];

export const NICHE_CATEGORIES: Record<NicheCategoryId, { label: string; descricao: string }> = {
  beleza: { label: 'Beleza e cuidados pessoais', descricao: 'Agenda cheia, vitrine visual e recorrência.' },
  saude: { label: 'Saúde', descricao: 'Credibilidade, regras dos conselhos e privacidade.' },
  alimentacao: { label: 'Alimentação', descricao: 'Pedido rápido, cardápio atualizado e horário de pico.' },
  construcao: { label: 'Construção e serviços locais', descricao: 'Orçamentos, visitas técnicas e prova de trabalho.' },
  profissionais: {
    label: 'Imóveis e negócios profissionais',
    descricao: 'Autoridade, confiança e ciclos de decisão mais longos.',
  },
  comercio: { label: 'Comércio e outros serviços', descricao: 'Catálogo, estoque, matrículas e atendimento.' },
  industria: { label: 'Indústria e B2B', descricao: 'Vendas técnicas, representantes e operação.' },
};

export const NICHE_CATEGORY_ORDER: NicheCategoryId[] = [
  'beleza',
  'saude',
  'alimentacao',
  'construcao',
  'profissionais',
  'comercio',
  'industria',
];

/** Ângulo do nicho usado para cada categoria de objeção no comparador. */
export const CATEGORY_TO_ANGLE: Record<ObjectionCategory, 'preco' | 'necessidade' | 'confianca' | 'prazo'> = {
  preco: 'preco',
  pagamento: 'preco',
  concorrencia: 'preco',
  necessidade: 'necessidade',
  resultados: 'necessidade',
  sistemas: 'necessidade',
  confianca: 'confianca',
  manutencao: 'confianca',
  prazo: 'prazo',
  decisao: 'prazo',
  sumiu: 'prazo',
};

export const TRANSPARENCY: Record<TransparencyAspect, { label: string; geral: string }> = {
  escopo: {
    label: 'Escopo',
    geral:
      'Liste por escrito o que está incluso e o que não está. Funcionalidade não descrita não está contratada — isso protege os dois lados.',
  },
  prazo: {
    label: 'Prazo',
    geral:
      'Só informe prazo depois do levantamento de requisitos. Apresente o prazo por etapa e deixe claro o que depende do cliente (conteúdo, aprovações, acessos).',
  },
  manutencao: {
    label: 'Manutenção',
    geral:
      'Separe correção de erro (coberta por garantia, por um período definido) de melhoria ou nova funcionalidade (orçada à parte ou dentro de um plano).',
  },
  seguranca: {
    label: 'Segurança',
    geral:
      'Explique as práticas adotadas (controle de acesso, criptografia em trânsito, backups, atualizações). Nunca prometa segurança absoluta: nenhum sistema é 100% invulnerável.',
  },
  propriedade: {
    label: 'Propriedade do código',
    geral:
      'Defina em contrato quem é dono do código, do domínio, dos dados e das contas de serviço. Dados do cliente pertencem ao cliente.',
  },
  integracoes: {
    label: 'Integrações',
    geral:
      'Integração depende da API do outro sistema. Antes de prometer, verifique documentação, custos de uso e limites; se não houver API, diga isso com clareza.',
  },
  implantacao: {
    label: 'Implantação',
    geral:
      'Planeje a implantação para não parar a operação: migração de dados, período em paralelo, treinamento e um responsável do lado do cliente.',
  },
  custos: {
    label: 'Custos recorrentes',
    geral:
      'Mostre todos os custos que continuam depois da entrega: servidor, banco de dados, domínio, serviços de terceiros, e-mails, manutenção. Sem surpresas no mês seguinte.',
  },
};

export const TRANSPARENCY_ORDER: TransparencyAspect[] = [
  'escopo',
  'prazo',
  'manutencao',
  'seguranca',
  'propriedade',
  'integracoes',
  'implantacao',
  'custos',
];

export const TONES = [
  { id: 'proximo', label: 'Próximo e informal' },
  { id: 'profissional', label: 'Profissional' },
  { id: 'direto', label: 'Direto e objetivo' },
  { id: 'formal', label: 'Formal' },
] as const;

export type ToneId = (typeof TONES)[number]['id'];
