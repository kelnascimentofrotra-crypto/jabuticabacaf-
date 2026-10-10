import type { ProspectStage } from '../types';

/**
 * Modelos por etapa da conversa. Variáveis entre colchetes devem ser
 * preenchidas pelo vendedor com informações reais.
 */
export const PROSPECT_STAGES: ProspectStage[] = [
  {
    id: 'primeiro-contato',
    nome: 'Primeiro contato',
    objetivo: 'Conseguir uma resposta, não vender. Ser específico, breve e pedir permissão para continuar.',
    proximaAcao: 'Se responder, faça uma pergunta de diagnóstico. Se não responder em 3–4 dias, envie um único lembrete leve.',
    mensagens: {
      semSite:
        'Oi, [nome]! Tudo bem? Sou [seu nome], trabalho com sites e páginas para [nicho] aqui em [cidade]. Vi o perfil de vocês e fiquei com uma curiosidade: hoje, quando alguém quer saber serviços, preços ou como agendar, a pessoa encontra isso fácil ou precisa perguntar no direct? Posso te fazer uma pergunta rápida sobre isso?',
      siteAntigo:
        'Oi, [nome]! Tudo bem? Sou [seu nome], desenvolvo sites para [nicho]. Entrei no site de vocês e notei [algo concreto e verificável, ex.: "o telefone de contato não abre o WhatsApp no celular"]. Não sei se isso já está no radar de vocês — quer que eu te mostre o que vi?',
      sistema:
        'Oi, [nome]! Sou [seu nome] e desenvolvo sistemas sob medida para empresas como [tipo de empresa]. Uma pergunta direta: hoje vocês controlam [processo: pedidos/agenda/orçamentos] por planilha ou WhatsApp? Pergunto porque é onde costumo ajudar a reduzir retrabalho.',
    },
    roteiroLigacao:
      'Oi, [nome]? Aqui é [seu nome], tudo bem? Vou ser breve: trabalho com sites e sistemas para [nicho] e queria te fazer uma pergunta rápida sobre como vocês recebem os contatos de clientes. É um bom momento ou prefere que eu ligue em outro horário?',
    assuntoEmail: 'Pergunta rápida sobre os contatos da [empresa]',
    cuidado:
      'Só diga que viu ou analisou algo se realmente viu. Não envie proposta, preço ou link no primeiro contato, e não mande áudio para quem não te conhece.',
  },
  {
    id: 'respondeu',
    nome: 'Cliente respondeu',
    objetivo: 'Transformar a resposta em diagnóstico: entender como o negócio funciona hoje antes de oferecer algo.',
    proximaAcao: 'Faça no máximo duas perguntas por mensagem. Quando houver uma dor clara, proponha uma conversa curta.',
    mensagens: {
      semSite:
        'Obrigado por responder, [nome]! Me conta: hoje a maior parte dos clientes novos chega por indicação, Instagram ou Google? E quais perguntas vocês mais respondem antes de alguém fechar?',
      siteAntigo:
        'Que bom que você respondeu! Para eu entender melhor: o site atual traz contatos para vocês ou funciona mais como cartão de visitas? E vocês conseguem atualizar sozinhos quando precisam?',
      sistema:
        'Obrigado pelo retorno! Para eu não chutar: quantas pessoas mexem nesse controle hoje e qual parte dá mais trabalho ou gera mais erro?',
    },
    roteiroLigacao:
      'Que bom falar com você. Antes de te mostrar qualquer coisa, queria entender como funciona hoje: como os clientes chegam até vocês e o que acontece depois do primeiro contato?',
    assuntoEmail: 'Re: contatos da [empresa] — duas perguntas',
    cuidado: 'Não responda com um bloco de texto vendendo tudo. Pergunte, ouça e use as palavras do cliente depois.',
  },
  {
    id: 'interesse',
    nome: 'Cliente demonstrou interesse',
    objetivo: 'Marcar uma conversa curta (15–20 min) ou visita para entender a necessidade e mostrar exemplos.',
    proximaAcao: 'Ofereça dois horários concretos. Após a conversa, envie um resumo com o que foi dito e o próximo passo.',
    mensagens: {
      semSite:
        'Legal, [nome]! Acho que vale a gente conversar 15 minutos para eu entender o que vocês precisam e te mostrar alguns exemplos de sites para [nicho]. Fica melhor [dia] às [hora] ou [dia] às [hora]?',
      siteAntigo:
        'Ótimo! Podemos fazer uma chamada de 15 minutos? Eu abro o site atual com você, mostro o que manteria e o que mudaria, e você decide se faz sentido. Tenho [dia] às [hora] ou [dia] às [hora].',
      sistema:
        'Perfeito. O próximo passo seria uma conversa de 20–30 minutos para eu entender o processo de vocês — idealmente com quem usa no dia a dia. Assim consigo te dizer o que é viável e uma faixa de investimento. Que dia funciona?',
    },
    roteiroLigacao:
      'Que bom que fez sentido. O que acha de marcarmos 15 minutos por vídeo ou presencial para eu entender melhor e te mostrar exemplos? Tenho disponibilidade [dia] ou [dia].',
    assuntoEmail: 'Conversa de 15 minutos sobre o site/sistema da [empresa]',
    cuidado: 'Não diga que vai mostrar "uma estrutura personalizada" se você ainda não preparou nada. Prometa só o que vai fazer.',
  },
  {
    id: 'perguntou-preco',
    nome: 'Cliente perguntou o preço',
    objetivo: 'Responder com honestidade (faixa) e coletar o mínimo de informação para dar um valor real.',
    proximaAcao: 'Depois das respostas, envie proposta com escopo e valor fechados em até 48h.',
    mensagens: {
      semSite:
        'Te passo, sim! Sites como esse costumam ficar entre R$ [faixa], dependendo de quantas páginas e funções (agenda, catálogo, formulário). Me responde duas coisas que eu te passo o valor certinho: o que o site precisa fazer e se você já tem logo e fotos?',
      siteAntigo:
        'Claro! Depende se é um ajuste no site atual ou um novo. Ajustes ficam a partir de R$ [valor]; um site novo, entre R$ [faixa]. Me diz o que mais te incomoda no atual que eu te digo qual caminho faz mais sentido.',
      sistema:
        'Para sistema, preciso ser honesto: sem entender o processo, qualquer número seria chute. Projetos como esse costumam começar em R$ [faixa] para uma primeira versão. Se fizermos uma conversa de 30 minutos, te passo uma estimativa por fases.',
    },
    roteiroLigacao:
      'Te passo, sem rodeio: projetos assim ficam normalmente entre [faixa]. O que faz variar é [fatores]. Posso te fazer duas perguntas para te dar o valor exato?',
    assuntoEmail: 'Valores para o site/sistema da [empresa]',
    cuidado: 'Não fuja do preço — isso irrita. Também não mande só um número sem dizer o que está incluso.',
  },
  {
    id: 'recebeu-proposta',
    nome: 'Cliente recebeu a proposta',
    objetivo: 'Garantir que a proposta foi entendida e combinar como será a decisão.',
    proximaAcao: 'Combine uma data para conversar sobre a proposta. Se não houver retorno, siga a sequência de follow-up.',
    mensagens: {
      semSite:
        'Oi, [nome]! Te enviei a proposta. Ela tem três partes: o que será feito, prazo e investimento. Quer que eu te explique por chamada em 10 minutos ou prefere ler com calma e me chamar com as dúvidas?',
      siteAntigo:
        'Proposta enviada! Separei o que muda em relação ao site atual e o que aproveitamos. Se ajudar, posso passar por ela com você em 10 minutos. Quando seria bom?',
      sistema:
        'Proposta enviada, [nome]. Ela está dividida em fases, com o que entra em cada uma, prazos estimados e custos recorrentes. Sugiro uma conversa de 20 minutos para revisar juntos — e, se possível, com quem mais participa da decisão. Que dia funciona?',
    },
    roteiroLigacao:
      'Oi, [nome], só confirmando que a proposta chegou. Você prefere que eu explique os pontos principais agora ou combinamos um horário para conversar depois que você ler?',
    assuntoEmail: 'Proposta — [empresa] — escopo, prazo e investimento',
    cuidado: 'Não cobre resposta no dia seguinte se não combinou. Não envie proposta sem ter falado de valores antes.',
  },
  {
    id: 'objecao',
    nome: 'Cliente levantou uma objeção',
    objetivo: 'Entender o que está por trás da objeção antes de responder.',
    proximaAcao: 'Use a ficha da objeção correspondente. Responda à preocupação real e proponha um próximo passo pequeno.',
    mensagens: {
      semSite:
        'Entendo, [nome], faz sentido você pensar nisso. Me ajuda a entender melhor o que pesa mais para você nessa decisão?',
      siteAntigo:
        'Faz sentido. Para eu não responder errado: essa preocupação é mais com o investimento, com o trabalho de trocar ou com o resultado?',
      sistema:
        'Ótimo você trazer isso agora. Prefiro tratar essa preocupação antes de qualquer coisa. Pode me contar um pouco mais do que te preocupa?',
    },
    roteiroLigacao: 'Entendo, e é importante falarmos disso. Me conta um pouco mais: o que exatamente te preocupa?',
    assuntoEmail: 'Sobre sua dúvida — [tema da objeção]',
    cuidado: 'Não rebata imediatamente com argumentos. Primeiro entenda; depois responda à preocupação real.',
  },
  {
    id: 'indeciso',
    nome: 'Cliente ficou indeciso',
    objetivo: 'Descobrir o que falta para decidir e facilitar a decisão, sem pressão.',
    proximaAcao: 'Se houver uma dúvida específica, resolva. Se for momento, combine uma data. Considere oferecer uma versão menor.',
    mensagens: {
      semSite:
        'Oi, [nome]! Sei que é uma decisão que pede calma. De 0 a 10, quanto o site faz sentido para você hoje? E o que faltaria para ser 10?',
      siteAntigo:
        'Oi, [nome]! Se ajudar a decidir, dá para fazer em etapas: primeiro os ajustes mais urgentes do site atual e depois o restante. Quer que eu monte essa opção?',
      sistema:
        'Oi, [nome]. Se a dúvida for o tamanho do projeto, podemos começar por uma primeira fase menor, só com [módulo principal], e decidir o resto depois de vocês usarem. Faz sentido eu detalhar essa opção?',
    },
    roteiroLigacao:
      'Oi, [nome], tudo bem? Sei que você está avaliando. Tem alguma parte que ficou em dúvida e que eu possa esclarecer agora?',
    assuntoEmail: 'Uma opção mais simples para começar — [empresa]',
    cuidado: 'Não crie urgência falsa ("só hoje", "última vaga") e não ofereça desconto sem mudar o escopo.',
  },
  {
    id: 'parou-de-responder',
    nome: 'Cliente parou de responder',
    objetivo: 'Retomar com leveza, facilitar uma resposta curta e, se não houver retorno, encerrar com elegância.',
    proximaAcao: 'Faça no máximo 2–3 tentativas espaçadas. Depois, envie a mensagem de encerramento e pare.',
    mensagens: {
      semSite:
        'Oi, [nome]! Imagino que a rotina esteja corrida. Para eu saber como seguir, me responde só com um número: 1 – quero continuar; 2 – mais pra frente; 3 – não é para mim agora. Qualquer resposta ajuda!',
      siteAntigo:
        'Oi, [nome]! Passando para saber se a ideia de atualizar o site ainda faz sentido. Se o momento mudou, sem problema — só me avisa para eu não ficar te chamando.',
      sistema:
        'Oi, [nome]. Retomando nossa conversa sobre o [processo]: ainda é uma prioridade para vocês ou mudou o momento? Se preferir, posso te procurar em outro mês.',
    },
    roteiroLigacao:
      'Oi, [nome], aqui é [seu nome]. Liguei rapidinho para saber se ainda faz sentido conversarmos sobre o site, ou se é melhor eu te procurar mais para frente.',
    assuntoEmail: 'Ainda faz sentido? — [empresa]',
    cuidado: 'Nada de "vi que você visualizou". Não mande várias mensagens no mesmo dia.',
  },
  {
    id: 'recusou',
    nome: 'Cliente recusou',
    objetivo: 'Encerrar com profissionalismo, aprender com a recusa e preservar a relação.',
    proximaAcao: 'Registre o motivo. Não insista. Só volte a contatar se ele autorizar ou se algo relevante mudar.',
    mensagens: {
      semSite:
        'Entendido, [nome], e obrigado pela sinceridade. Se puder me dizer o principal motivo, me ajuda a melhorar. Desejo sucesso para vocês e, se um dia fizer sentido, é só me chamar.',
      siteAntigo:
        'Tudo bem, [nome]! Obrigado pelo retorno. Se em algum momento precisar de um ajuste pontual no site atual, fico à disposição.',
      sistema:
        'Compreendo, [nome]. Agradeço o tempo que vocês dedicaram às conversas. Se a necessidade voltar, a análise que fizemos continua valendo como ponto de partida. Sucesso!',
    },
    roteiroLigacao: 'Entendo perfeitamente, obrigado por me dizer com clareza. Posso só te perguntar o principal motivo? Me ajuda a melhorar.',
    assuntoEmail: 'Obrigado pelo retorno — [empresa]',
    cuidado: 'Recusa explícita encerra a sequência. Não tente "mais uma vez" e não coloque o contato em listas sem permissão.',
  },
  {
    id: 'aceitou-reuniao',
    nome: 'Cliente aceitou uma reunião',
    objetivo: 'Confirmar data, formato e pauta, e chegar preparado com perguntas — não com uma apresentação longa.',
    proximaAcao: 'Envie confirmação no dia anterior. Na reunião, faça diagnóstico antes de apresentar. Depois, envie um resumo.',
    mensagens: {
      semSite:
        'Combinado, [nome]! Fica confirmado [dia] às [hora], por [chamada/presencial]. Vou te fazer algumas perguntas sobre como os clientes chegam até vocês e te mostro exemplos. Se puder, separa o logo e algumas fotos — não é obrigatório.',
      siteAntigo:
        'Confirmado: [dia] às [hora]. Vou abrir o site atual com você, ouvir o que te incomoda e mostrar as opções. Leva uns 20 minutos.',
      sistema:
        'Confirmado para [dia] às [hora]. Pauta: (1) como o processo funciona hoje; (2) onde estão os maiores gargalos; (3) próximos passos. Se puder incluir quem opera o processo no dia a dia, ajuda muito.',
    },
    roteiroLigacao: 'Perfeito, fica marcado. Te mando a confirmação por mensagem com o horário e o link. Até lá!',
    assuntoEmail: 'Confirmação: conversa sobre o projeto da [empresa] — [dia], [hora]',
    cuidado: 'Não transforme a reunião em palestra. O cliente deve falar mais do que você nos primeiros 10 minutos.',
  },
];

export const COLD_STRATEGIES: { titulo: string; descricao: string; passos: string[] }[] = [
  {
    titulo: 'Lista curta e qualificada',
    descricao: 'Vinte empresas bem escolhidas rendem mais do que duzentas mensagens genéricas.',
    passos: [
      'Escolha um nicho e uma região.',
      'Selecione empresas com sinais reais de necessidade (sem site, site fora do ar, agenda só pelo direct).',
      'Anote para cada uma um fato verificável que você observou.',
    ],
  },
  {
    titulo: 'Observação verdadeira antes do pitch',
    descricao: 'A primeira mensagem mostra que você olhou o negócio — sem inventar análise.',
    passos: [
      'Cite algo concreto e verificável (ex.: "o link da bio leva para uma página que não abre").',
      'Faça uma pergunta, não uma oferta.',
      'Nunca diga que preparou algo personalizado se não preparou.',
    ],
  },
  {
    titulo: 'Diagnóstico gratuito e honesto',
    descricao: 'Ofereça uma análise curta e útil, mesmo que o cliente não feche.',
    passos: [
      'Verifique como a empresa aparece no Google e no celular.',
      'Envie 2–3 pontos práticos com prints.',
      'Termine com uma pergunta aberta, sem pressão.',
    ],
  },
  {
    titulo: 'Parcerias que indicam',
    descricao: 'Contadores, fotógrafos, gráficas e agências de tráfego conhecem quem precisa de site.',
    passos: [
      'Mapeie profissionais que atendem o mesmo público que você.',
      'Ofereça indicação recíproca, não comissão logo de início.',
      'Entregue bem os primeiros indicados — é isso que mantém a parceria.',
    ],
  },
  {
    titulo: 'Visita presencial no horário certo',
    descricao: 'Para comércio local, a visita gera confiança, se respeitar o movimento.',
    passos: [
      'Evite horários de pico (almoço em restaurantes, sábado em salões).',
      'Leve 2–3 exemplos no celular, não um catálogo impresso.',
      'Peça um horário para conversar em vez de apresentar na hora.',
    ],
  },
  {
    titulo: 'Cadência respeitosa',
    descricao: 'Persistência sem insistência: poucos contatos, espaçados e úteis.',
    passos: [
      'Primeiro contato + 1 lembrete após 3–4 dias + 1 contato de valor após 10 dias.',
      'Cada mensagem deve trazer algo novo (exemplo, dica, pergunta).',
      'Sem resposta após isso, encerre e registre para recontato em alguns meses.',
    ],
  },
];
