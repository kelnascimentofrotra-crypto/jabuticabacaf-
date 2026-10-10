import type { FollowUpSequence } from '../types';

const NAO_FAZER_PADRAO = [
  'Enviar mensagens no mesmo dia ou em sequência sem resposta.',
  'Usar urgência falsa ("só hoje", "última vaga").',
  'Continuar depois de uma recusa explícita.',
];

export const FOLLOWUPS: FollowUpSequence[] = [
  {
    id: 'recebeu-orcamento',
    nome: 'Cliente que recebeu orçamento',
    situacao: 'O orçamento foi enviado e o cliente ainda não deu retorno.',
    principios: [
      'O primeiro contato confirma o recebimento e oferece ajuda, não cobra decisão.',
      'Cada mensagem traz algo útil: um esclarecimento, um exemplo, uma alternativa.',
    ],
    mensagens: [
      {
        diaSugerido: 2,
        objetivo: 'Confirmar recebimento e abrir espaço para dúvidas',
        texto:
          'Oi, [nome]! Tudo bem? Conseguiu dar uma olhada no orçamento? Se alguma parte ficou confusa, posso te explicar rapidinho por aqui ou numa chamada de 10 minutos.',
      },
      {
        diaSugerido: 5,
        objetivo: 'Agregar valor com um exemplo',
        texto:
          'Oi, [nome]! Lembrei de você porque finalizei um projeto parecido com o seu, para [tipo de negócio]. Se quiser ver como ficou, te mando o link. Ajuda a visualizar o resultado.',
      },
      {
        diaSugerido: 10,
        objetivo: 'Facilitar a resposta',
        texto:
          'Oi, [nome]! Para eu me organizar: o orçamento faz sentido, precisa de ajustes ou o momento não é agora? Pode responder só com uma palavra, sem problema nenhum.',
      },
    ],
    encerramento:
      'Oi, [nome]! Como não tive retorno, vou entender que agora não é o momento, e tudo bem. Vou parar de te chamar sobre isso. Se em algum momento quiser retomar, é só me mandar uma mensagem. Sucesso!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Mandar o orçamento novamente sem que ele peça.'],
  },
  {
    id: 'pediu-chamar-depois',
    nome: 'Cliente que pediu para chamar depois',
    situacao: 'O cliente pediu para ser procurado em outro momento.',
    principios: [
      'Respeite exatamente a data combinada — nem antes, nem muito depois.',
      'Retome o contexto da última conversa para ele não precisar lembrar.',
    ],
    mensagens: [
      {
        diaSugerido: 0,
        objetivo: 'Confirmar a data combinada',
        texto: 'Combinado, [nome]! Anotei aqui para te chamar no dia [data]. Até lá, se surgir qualquer dúvida, é só me mandar.',
      },
      {
        diaSugerido: 14,
        objetivo: 'Retomar no dia combinado',
        texto:
          'Oi, [nome]! Tudo bem? Como combinamos, estou passando para retomar nossa conversa sobre [projeto]. Na última vez você comentou sobre [ponto que ele disse]. Ainda faz sentido conversarmos agora?',
      },
      {
        diaSugerido: 21,
        objetivo: 'Segunda tentativa leve',
        texto:
          'Oi, [nome]! Sei que a rotina aperta. Prefere que eu te procure em outro momento ou podemos marcar 10 minutos esta semana?',
      },
    ],
    encerramento:
      'Oi, [nome]! Não quero ficar te incomodando, então vou deixar a conversa em aberto. Quando for o momento certo, é só me chamar que retomamos de onde paramos.',
    naoFazer: [...NAO_FAZER_PADRAO, 'Chamar antes da data combinada "só para lembrar".'],
  },
  {
    id: 'visualizou-nao-respondeu',
    nome: 'Cliente que visualizou e não respondeu',
    situacao: 'A mensagem ou proposta foi lida, mas não houve resposta.',
    principios: ['Nunca mencione que viu a confirmação de leitura.', 'Facilite uma resposta curta e sem constrangimento.'],
    mensagens: [
      {
        diaSugerido: 3,
        objetivo: 'Retomar com leveza',
        texto: 'Oi, [nome]! Tudo certo por aí? Fiquei pensando se ficou alguma dúvida sobre o que conversamos. Se quiser, te explico rapidinho.',
      },
      {
        diaSugerido: 7,
        objetivo: 'Oferecer opções de resposta',
        texto:
          'Oi, [nome]! Para facilitar, me responde só com um número: 1 – quero seguir; 2 – preciso de ajustes; 3 – agora não é o momento. Qualquer resposta me ajuda a não te incomodar à toa.',
      },
    ],
    encerramento:
      'Oi, [nome]! Vou considerar que agora não é o momento, tudo bem? Fico à disposição se mudar. Obrigado pela atenção!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Dizer "vi que você visualizou".'],
  },
  {
    id: 'interesse-e-sumiu',
    nome: 'Cliente que demonstrou interesse e sumiu',
    situacao: 'O cliente parecia interessado, chegou a fazer perguntas e parou de responder.',
    principios: ['Retome a partir do interesse que ele mostrou.', 'Ofereça um próximo passo pequeno e concreto.'],
    mensagens: [
      {
        diaSugerido: 3,
        objetivo: 'Retomar pelo interesse dele',
        texto:
          'Oi, [nome]! Lembrei da nossa conversa sobre [o que ele queria resolver]. Separei um exemplo que tem bastante a ver. Quer que eu te mande?',
      },
      {
        diaSugerido: 8,
        objetivo: 'Propor um passo pequeno',
        texto:
          'Oi, [nome]! Se ajudar, podemos fazer uma chamada de 10 minutos só para eu te mostrar como ficaria. Sem compromisso. Algum horário bom esta semana?',
      },
      {
        diaSugerido: 15,
        objetivo: 'Checar se o momento mudou',
        texto: 'Oi, [nome]! O assunto [projeto] ainda está nos seus planos ou mudou a prioridade? Me fala sem problema.',
      },
    ],
    encerramento:
      'Oi, [nome]! Como não consegui retorno, vou pausar por aqui. Se o projeto voltar a ser prioridade, é só me chamar. Abraço!',
    naoFazer: NAO_FAZER_PADRAO,
  },
  {
    id: 'disse-caro',
    nome: 'Cliente que disse que está caro',
    situacao: 'O cliente achou o valor alto e a conversa esfriou.',
    principios: ['Não baixe o preço do mesmo escopo.', 'Ofereça alternativas reais: escopo menor, fases ou outra condição de pagamento.'],
    mensagens: [
      {
        diaSugerido: 1,
        objetivo: 'Entender a referência de valor',
        texto:
          'Oi, [nome]! Fiquei pensando no que você falou sobre o valor. Para eu ver o que dá para ajustar: você tinha uma faixa em mente?',
      },
      {
        diaSugerido: 4,
        objetivo: 'Apresentar alternativa de escopo',
        texto:
          'Oi, [nome]! Montei uma opção mais enxuta: [versão reduzida], por R$ [valor]. Ela resolve [problema principal] e o restante pode vir numa segunda etapa. Quer que eu te mande os detalhes?',
      },
      {
        diaSugerido: 10,
        objetivo: 'Verificar interesse',
        texto: 'Oi, [nome]! A versão mais enxuta fez sentido para você ou prefere deixar para outro momento?',
      },
    ],
    encerramento:
      'Oi, [nome]! Entendo que o investimento não cabe agora, e tudo bem. Se a situação mudar, me chama que montamos algo dentro do possível. Sucesso!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Oferecer desconto no mesmo escopo para "fechar logo".'],
  },
  {
    id: 'consultar-socio',
    nome: 'Cliente que precisa consultar o sócio',
    situacao: 'A decisão depende de outra pessoa (sócio, cônjuge, diretoria).',
    principios: ['Ajude o cliente a apresentar a proposta.', 'Ofereça conversar com o outro decisor.'],
    mensagens: [
      {
        diaSugerido: 0,
        objetivo: 'Facilitar a apresentação ao sócio',
        texto:
          'Perfeito, [nome]! Te mando um resumo de uma página com o problema que resolvemos, o que está incluso, prazo e investimento, para facilitar a conversa com seu sócio.',
      },
      {
        diaSugerido: 4,
        objetivo: 'Oferecer conversa com o outro decisor',
        texto:
          'Oi, [nome]! Conseguiram conversar? Se surgiu alguma dúvida, posso explicar diretamente para vocês dois numa chamada rápida.',
      },
      {
        diaSugerido: 9,
        objetivo: 'Checar decisão',
        texto: 'Oi, [nome]! Chegaram a alguma conclusão? Se precisarem de algum ajuste na proposta, me falem.',
      },
    ],
    encerramento:
      'Oi, [nome]! Vou deixar a proposta em aberto e parar de chamar por enquanto. Quando vocês decidirem, é só me avisar. Obrigado!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Tentar contornar o cliente e falar com o sócio sem permissão.'],
  },
  {
    id: 'gostou-demonstracao',
    nome: 'Cliente que gostou da demonstração',
    situacao: 'A reunião ou demonstração foi positiva, mas ainda não houve fechamento.',
    principios: ['Envie resumo no mesmo dia, enquanto o interesse está alto.', 'Deixe o próximo passo claro e simples.'],
    mensagens: [
      {
        diaSugerido: 0,
        objetivo: 'Resumo e próximo passo',
        texto:
          'Oi, [nome]! Obrigado pela conversa de hoje. Resumindo o que combinamos: [pontos principais]. O próximo passo seria [enviar contrato / aprovar proposta]. Posso seguir?',
      },
      {
        diaSugerido: 3,
        objetivo: 'Remover atritos',
        texto:
          'Oi, [nome]! Para começar, só preciso de [itens: logo, fotos, confirmação]. Se preferir, te mando um checklist simples. Ficou alguma dúvida da demonstração?',
      },
      {
        diaSugerido: 7,
        objetivo: 'Reservar agenda',
        texto:
          'Oi, [nome]! Estou organizando a agenda das próximas semanas. Quer que eu reserve a data de início do seu projeto?',
      },
    ],
    encerramento:
      'Oi, [nome]! Vou liberar a data que tinha reservado, tudo bem? Quando quiser retomar, me chama que vejo a próxima disponibilidade.',
    naoFazer: [...NAO_FAZER_PADRAO, 'Dizer que a agenda está lotada se não estiver.'],
  },
  {
    id: 'adiou-contratacao',
    nome: 'Cliente que adiou a contratação',
    situacao: 'O cliente decidiu adiar para outro mês ou temporada.',
    principios: ['Pergunte o motivo e a nova data.', 'Retome perto da data, com o contexto atualizado.'],
    mensagens: [
      {
        diaSugerido: 0,
        objetivo: 'Combinar a nova data',
        texto: 'Entendido, [nome]! Posso te procurar no início de [mês]? Assim já vemos o cronograma com calma.',
      },
      {
        diaSugerido: 30,
        objetivo: 'Retomar perto da data',
        texto:
          'Oi, [nome]! Como combinamos, estou passando para retomar o projeto do [site/sistema]. Ainda faz sentido começarmos agora?',
      },
      {
        diaSugerido: 37,
        objetivo: 'Checar novo momento',
        texto: 'Oi, [nome]! Se o momento ainda não chegou, me diz quando prefere que eu volte a te procurar.',
      },
    ],
    encerramento:
      'Oi, [nome]! Vou deixar a conversa em aberto e parar de te chamar por enquanto. Quando for a hora, é só me procurar. Sucesso!',
    naoFazer: NAO_FAZER_PADRAO,
  },
  {
    id: 'sem-orcamento',
    nome: 'Cliente que recusou por falta de orçamento',
    situacao: 'O cliente disse não por falta de dinheiro agora.',
    principios: [
      'Agradeça e peça permissão para um recontato futuro.',
      'Só envie as mensagens seguintes se ele autorizou o recontato.',
    ],
    mensagens: [
      {
        diaSugerido: 0,
        objetivo: 'Agradecer e pedir permissão',
        texto:
          'Entendo perfeitamente, [nome], e obrigado pela sinceridade. Posso te procurar daqui a alguns meses para ver se o momento mudou? Se preferir que não, tudo bem também.',
      },
      {
        diaSugerido: 90,
        objetivo: 'Recontato autorizado',
        texto:
          'Oi, [nome]! Como combinamos, estou passando depois de alguns meses. Hoje tenho também uma opção mais enxuta, a partir de R$ [valor]. Faz sentido conversarmos?',
      },
    ],
    encerramento: 'Oi, [nome]! Fica registrado. Não vou mais te chamar sobre isso, mas estou à disposição se precisar. Sucesso!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Enviar recontato sem a autorização do cliente.', 'Sugerir que ele se endivide para contratar.'],
  },
  {
    id: 'site-antigo',
    nome: 'Cliente que possui um site antigo',
    situacao: 'A empresa tem um site desatualizado e mostrou alguma abertura para melhorar.',
    principios: ['Seja específico e verdadeiro sobre o que observou.', 'Ofereça uma melhoria pequena antes de um projeto grande.'],
    mensagens: [
      {
        diaSugerido: 2,
        objetivo: 'Mostrar uma observação concreta',
        texto:
          'Oi, [nome]! Dei uma olhada no site no celular e notei [observação concreta e verificável]. Quer que eu te mande um print com o que vi?',
      },
      {
        diaSugerido: 6,
        objetivo: 'Oferecer melhoria pontual',
        texto:
          'Oi, [nome]! Se fizer sentido, dá para começar só corrigindo [ponto principal], sem refazer o site todo. É rápido e já melhora a experiência de quem acessa.',
      },
      {
        diaSugerido: 14,
        objetivo: 'Checar interesse',
        texto: 'Oi, [nome]! Ainda faz sentido mexermos no site agora ou fica para mais tarde?',
      },
    ],
    encerramento:
      'Oi, [nome]! Vou parar de te chamar sobre o site por enquanto. Se quiser retomar, é só me avisar. Abraço!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Criticar o trabalho do desenvolvedor anterior.'],
  },
  {
    id: 'funcionalidades-adicionais',
    nome: 'Cliente que pediu funcionalidades adicionais',
    situacao: 'Durante a negociação, o cliente pediu itens fora do escopo inicial.',
    principios: ['Registre os pedidos por escrito.', 'Mostre impacto em prazo e valor antes de aceitar.'],
    mensagens: [
      {
        diaSugerido: 1,
        objetivo: 'Confirmar o que foi pedido',
        texto:
          'Oi, [nome]! Anotei os itens novos que você comentou: [lista]. Vou te mandar como eles impactam prazo e investimento, para você decidir com clareza.',
      },
      {
        diaSugerido: 3,
        objetivo: 'Apresentar opções',
        texto:
          'Oi, [nome]! Segue: opção A — projeto original, R$ [valor], prazo [x]; opção B — com os itens novos, R$ [valor], prazo [y]; opção C — original agora e os itens novos numa segunda fase. Qual faz mais sentido?',
      },
      {
        diaSugerido: 8,
        objetivo: 'Checar decisão',
        texto: 'Oi, [nome]! Conseguiu avaliar as opções? Posso esclarecer algum ponto?',
      },
    ],
    encerramento:
      'Oi, [nome]! Vou deixar as três opções registradas. Quando decidir, é só me dizer qual seguimos. Obrigado!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Aceitar itens novos sem ajustar prazo e valor.', 'Incluir funcionalidades "de brinde" sem registrar.'],
  },
  {
    id: 'nao-aprovou-proposta',
    nome: 'Cliente que não aprovou a proposta',
    situacao: 'O cliente respondeu que a proposta não foi aprovada.',
    principios: ['Pergunte o motivo com humildade.', 'Só proponha nova versão se o motivo permitir um ajuste real.'],
    mensagens: [
      {
        diaSugerido: 0,
        objetivo: 'Entender o motivo',
        texto:
          'Obrigado pelo retorno, [nome]. Se puder me dizer o principal motivo — valor, escopo, prazo ou outra coisa —, me ajuda muito, e talvez dê para ajustar.',
      },
      {
        diaSugerido: 3,
        objetivo: 'Proposta ajustada (se fizer sentido)',
        texto:
          'Oi, [nome]! Com base no que você comentou, ajustei a proposta: [mudança concreta]. Se fizer sentido, te mando. Se não, sem problema.',
      },
    ],
    encerramento: 'Oi, [nome]! Agradeço de verdade a oportunidade. Fico à disposição se um dia fizer sentido. Sucesso!',
    naoFazer: [...NAO_FAZER_PADRAO, 'Pedir para "reconsiderar" sem mudar nada na proposta.'],
  },
];
