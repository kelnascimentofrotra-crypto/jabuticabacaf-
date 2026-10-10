import type { Niche } from '../../types';

export const INDUSTRIA: Niche[] = [
  {
    id: 'industrias',
    nome: 'Indústrias',
    categoria: 'industria',
    resumo:
      'Fabricantes que vendem para outras empresas (B2B), com representantes comerciais, catálogos técnicos, pedidos recorrentes e produção planejada. Processos internos (pedidos, produção, estoque, qualidade) são onde estão as maiores oportunidades de sistema.',
    comoClientesChegam: ['Representantes comerciais', 'Feiras do setor', 'Indicação', 'Buscas técnicas por produto'],
    dores: [
      'Pedidos de representantes por e-mail e planilha',
      'Catálogo técnico desatualizado em PDF',
      'Informações de produção espalhadas em planilhas',
    ],
    solucoes: [
      { servico: 'sis-pedidos', porque: 'Portal B2B para representantes e clientes fazerem pedidos com tabela por cliente.' },
      { servico: 'catalogo-digital', porque: 'Catálogo técnico online com especificações e fichas.' },
      { servico: 'sis-dashboards', porque: 'Indicadores de vendas, produção e estoque num painel.' },
    ],
    argumentos: [
      'Pedido de representante digitado uma vez, sem redigitação no escritório.',
      'Catálogo técnico online sempre atualizado substitui PDFs antigos que circulam.',
      'Painel de indicadores evita horas montando relatório.',
    ],
    perguntas: [
      'Como os representantes enviam pedidos hoje?',
      'Quantas pessoas redigitam pedidos?',
      'O ERP atual tem API ou exportação?',
    ],
    objecoes: [
      {
        id: 'erp-ja-tem',
        frase: 'O ERP já faz tudo.',
        porTras: 'Investimento alto já feito no ERP.',
        resposta:
          'O ERP é o coração, e não faz sentido mexer nele. A oportunidade costuma estar nas pontas: portal de pedidos para representantes, catálogo, painéis — integrados ao ERP. O que ainda é feito fora dele?',
        pergunta: 'Que processo ainda passa por planilha ou e-mail antes de entrar no ERP?',
        proximoPasso: 'Mapeie as pontas e verifique a API do ERP.',
      },
      {
        id: 'investimento-alto',
        frase: 'Sistema para indústria é caro.',
        porTras: 'Experiência com projetos grandes.',
        resposta:
          'Projetos completos são. A proposta é começar por um processo com retorno claro, como pedidos de representantes, e medir o ganho de horas. Quantas horas por semana se gastam redigitando pedidos?',
        pergunta: 'Quantos pedidos por mês passam por redigitação?',
        proximoPasso: 'Proponha MVP de portal de pedidos com integração ao ERP.',
      },
      {
        id: 'representantes-resistem',
        frase: 'Representantes não vão usar.',
        porTras: 'Resistência de canal comercial.',
        resposta:
          'Se for mais rápido do que mandar planilha, usam. Envolver dois representantes no teste ajuda muito. Quem são os mais abertos?',
        pergunta: 'Que reclamação os representantes têm do processo atual?',
        proximoPasso: 'Proponha piloto com representantes selecionados.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como os representantes enviam os pedidos para a fábrica hoje?' },
      { autor: 'cliente', texto: 'Por e-mail, em planilha, e alguém digita no ERP.' },
      { autor: 'vendedor', texto: 'Um portal de pedidos integrado ao ERP evita essa redigitação e os erros. Podemos começar com um piloto pequeno. Quer ver?' },
    ],
    angulos: {
      preco: 'Discuta necessidades operacionais, orçamento, integrações e retorno esperado em horas economizadas e erros evitados.',
      necessidade: 'Eliminar redigitação, organizar pedidos e dar visão gerencial.',
      confianca: 'Integração cuidadosa com o ERP, segurança e piloto controlado.',
      prazo: 'Implante fora do pico de produção e em fases.',
    },
    cuidados: ['Não acesse diretamente o banco do ERP sem autorização do fornecedor; prefira APIs oficiais.'],
    aberturaProspeccao: 'Como os pedidos dos representantes chegam até a fábrica hoje, e quem digita no ERP?',
  },
  {
    id: 'distribuidoras',
    nome: 'Distribuidoras e atacadistas',
    categoria: 'industria',
    resumo:
      'Revendem para comércios com tabela por cliente/região, pedido mínimo, vendedores externos e entrega por rota. Margem apertada e alto volume de pedidos repetidos. Agilidade no pedido e precisão na entrega fazem a diferença.',
    comoClientesChegam: ['Vendedores externos', 'Clientes recorrentes por WhatsApp', 'Indicação', 'Busca B2B'],
    dores: ['Pedidos por WhatsApp e foto de lista', 'Tabelas de preço diferentes por cliente', 'Rotas de entrega'],
    solucoes: [
      { servico: 'sis-pedidos', porque: 'Portal B2B com tabela por cliente, pedido mínimo e histórico de recompra.' },
      { servico: 'catalogo-whatsapp', porque: 'Catálogo de atacado com pedido pelo WhatsApp para começar mais simples.' },
      { servico: 'sis-crm', porque: 'Carteira de clientes por vendedor e alertas de clientes sem comprar.' },
    ],
    argumentos: [
      'Cliente repete o último pedido em um clique.',
      'Tabela por cliente evita erro de preço.',
      'Alerta de cliente sem comprar há 30 dias vira ação do vendedor.',
    ],
    perguntas: ['Quantos pedidos por dia?', 'Têm tabela por cliente?', 'Quantos vendedores externos?'],
    objecoes: [
      {
        id: 'cliente-pede-no-whatsapp',
        frase: 'Meus clientes pedem pelo WhatsApp.',
        porTras: 'Hábito do comércio.',
        resposta:
          'E podem continuar, mandando o pedido pronto pelo catálogo. Repetir o último pedido costuma convencer o comerciante. Quantos pedidos são repetição do anterior?',
        pergunta: 'Que parte dos pedidos é praticamente igual à anterior?',
        proximoPasso: 'Proponha catálogo com "repetir pedido".',
      },
      {
        id: 'tabela-complexa',
        frase: 'Minha tabela é complexa demais.',
        porTras: 'Regras comerciais específicas.',
        resposta:
          'É justamente onde um sistema próprio vale mais que um pronto: as suas regras de preço ficam programadas. Me mostra como funciona a tabela?',
        pergunta: 'Quais regras definem o preço de cada cliente?',
        proximoPasso: 'Levante as regras de preço antes de estimar.',
      },
      {
        id: 'vendedor-externo',
        frase: 'O vendedor externo é que vende.',
        porTras: 'Venda presencial.',
        resposta:
          'E o portal ajuda o vendedor: ele lança o pedido no celular na frente do cliente, com estoque e preço certos. Como ele faz hoje?',
        pergunta: 'Como o vendedor externo consulta estoque e preço?',
        proximoPasso: 'Proponha app web para vendedores.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quantos pedidos chegam por WhatsApp por dia e quem digita no sistema?' },
      { autor: 'cliente', texto: 'Uns 80, duas pessoas digitam.' },
      { autor: 'vendedor', texto: 'Um portal onde o cliente repete o pedido e ele cai direto no sistema economiza boa parte desse trabalho. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com o custo das horas de digitação e dos erros de preço.',
      necessidade: 'Pedidos digitais, tabela por cliente e recompra.',
      confianca: 'Integração com sistema atual e piloto com clientes selecionados.',
      prazo: 'Antes do pico de vendas do setor (fim de ano para muitos segmentos).',
    },
    cuidados: ['Condições comerciais por cliente são sigilosas: cada cliente vê só a própria tabela.'],
    aberturaProspeccao: 'Quantos pedidos chegam por WhatsApp por dia e quantas pessoas precisam digitar no sistema?',
  },
];
