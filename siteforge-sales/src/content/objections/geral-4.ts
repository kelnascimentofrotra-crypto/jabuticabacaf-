import type { Objection } from '../../types';

export const GERAL_4: Objection[] = [
  {
    id: 'nao-preciso-sistema-agora',
    biblioteca: 'geral',
    frase: 'Não preciso de um sistema agora.',
    categoria: 'sistemas',
    gatilhos: ['sistema não é prioridade', 'mais pra frente penso em sistema', 'ainda não preciso de sistema', 'sistema é para empresa grande', 'por enquanto não'],
    resistencia: 'media',
    etapas: ['respondeu', 'interesse', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['descobrir-necessidade', 'agendar-retorno'],
    significados: [
      'O volume atual realmente não justifica um sistema.',
      'Ele não percebe o custo do processo manual.',
      'Está focado em outras prioridades.',
    ],
    estrategia:
      'Concorde que pode não ser o momento. Investigue sinais de que o processo manual está no limite: erros, retrabalho, informações que se perdem, dependência de uma pessoa. Se não houver sinais, combine um retorno quando o volume crescer.',
    descobrir: [
      'Quais processos são feitos manualmente.',
      'Quanto tempo por semana a equipe gasta neles.',
      'Se já houve erro ou perda de informação.',
    ],
    respostas: {
      curta:
        'Pode ser que não precise mesmo, e é melhor assim do que investir sem necessidade. Só uma pergunta: hoje tem alguma tarefa que toma muito tempo da equipe ou depende de uma pessoa só para funcionar?',
      consultiva:
        'Entendo. Como vocês controlam hoje [agenda/pedidos/orçamentos]? Funciona bem mesmo nos dias mais cheios?',
      persuasiva:
        'Sistema faz sentido quando o processo manual começa a custar caro: horas de retrabalho, erros, informação que se perde ou dependência de uma pessoa. Se nada disso acontece, você está certo em esperar. Se algum desses sinais aparecer, dá para começar pequeno, só com o processo que mais dói.',
      ligacao:
        'Faz sentido. Posso te fazer duas perguntas rápidas só para eu entender se é isso mesmo? Quanto tempo por semana vocês gastam organizando [processo]? E já aconteceu de perder alguma informação importante?',
      reuniao:
        'Mapeie com ele um processo do início ao fim (ex.: do pedido à entrega). Marque pontos de redigitação, controle paralelo e dependência de pessoas. Se houver poucos, concorde que não é o momento. Se houver muitos, apresente um piloto pequeno.',
    },
    alternativas: [
      'Tranquilo! Se em algum momento o controle começar a apertar, me chama que a gente vê o que vale automatizar.',
      'Entendido. Só por curiosidade: o que faria você sentir que chegou a hora de um sistema?',
    ],
    perguntaEstrategica: 'Se a pessoa que controla tudo hoje faltasse por uma semana, o que aconteceria?',
    proximoPasso: 'Sem dor clara: combine retorno em alguns meses. Com dor clara: proponha um piloto com um único processo.',
    naoDizer: [
      '"Sem sistema sua empresa não cresce" — generalização.',
      '"Planilha é coisa do passado" — desqualifica.',
      'Apresentar uma solução grande sem diagnóstico.',
    ],
    variacoes: {
      sistema: 'Comece por um processo, com escopo pequeno e mensurável.',
      site: 'Talvez o momento seja de site com formulário organizado, e o sistema venha depois.',
      recorrente: 'Ofereça uma consultoria curta de processos como porta de entrada.',
    },
    relacionadas: ['resolve-por-planilhas', 'planilha-ja-resolve', 'precisa-sistema-proprio'],
  },
  {
    id: 'resolve-por-planilhas',
    biblioteca: 'geral',
    frase: 'Minha empresa resolve tudo por planilhas.',
    categoria: 'sistemas',
    gatilhos: ['uso excel para tudo', 'controlo tudo em planilha', 'google planilhas resolve', 'tudo no excel', 'planilhas funcionam'],
    resistencia: 'media',
    etapas: ['respondeu', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'As planilhas funcionam e a equipe está acostumada.',
      'Há várias planilhas paralelas e ninguém tem a visão geral.',
      'Medo de mudar algo que funciona minimamente.',
    ],
    estrategia:
      'Não ataque as planilhas — elas mostram que a empresa já organiza processos. Pergunte quantas são, quem edita e como as informações se cruzam. O ponto de dor costuma estar na integração entre planilhas e no tempo para montar relatórios.',
    descobrir: [
      'Quantas planilhas existem e quem as mantém.',
      'Quanto tempo leva para responder uma pergunta gerencial (ex.: faturamento por cliente).',
      'Se já houve dado sobrescrito ou versão errada.',
    ],
    respostas: {
      curta:
        'Isso mostra que a empresa já é organizada, o que facilita muito qualquer melhoria. Me conta: são várias planilhas ou uma principal? E quanto tempo leva para juntar as informações quando você precisa de um relatório?',
      consultiva:
        'Bacana! Quantas pessoas editam essas planilhas hoje? Já aconteceu de alguém apagar ou sobrescrever alguma informação?',
      persuasiva:
        'Planilhas são ótimas para começar. O limite aparece quando são muitas, várias pessoas editam ao mesmo tempo e alguém precisa consolidar tudo à mão. Um sistema pode manter a mesma lógica que vocês já usam, só que com histórico, permissões e relatórios automáticos. Não é trocar tudo de uma vez: dá para começar pela planilha que mais dá trabalho.',
      ligacao:
        'Que bom, isso mostra organização. Me conta uma coisa: quando você precisa de um número, tipo vendas do mês por cliente, quanto tempo leva para ter essa resposta?',
      reuniao:
        'Peça para ver as planilhas (sem dados sensíveis, se preferir). Identifique a mais crítica e a que mais gera retrabalho. Proponha transformar só ela em sistema como piloto, mantendo a mesma lógica e permitindo exportação para Excel.',
    },
    alternativas: [
      'Ótimo, planilhas organizadas são meio caminho andado. Qual delas te dá mais trabalho hoje?',
      'Faz sentido! Se em algum momento começarem a ficar pesadas ou confusas, dá para transformar só a principal em sistema.',
    ],
    perguntaEstrategica: 'Qual planilha, se quebrasse amanhã, pararia a empresa?',
    proximoPasso: 'Proponha analisar a planilha mais crítica e estimar um piloto com ela.',
    naoDizer: [
      '"Planilha é amadorismo" — ofende a forma como a empresa trabalha.',
      '"Vamos jogar tudo fora e começar do zero" — assusta.',
      'Prometer que o sistema elimina todos os erros.',
    ],
    variacoes: {
      sistema: 'Piloto com a planilha mais crítica, mantendo exportação para Excel.',
      recorrente: 'Ofereça dashboards conectados às planilhas existentes como passo intermediário.',
    },
    relacionadas: ['planilha-ja-resolve', 'nao-preciso-sistema-agora', 'medo-perder-dados'],
  },
  {
    id: 'ja-tenho-software-gestao',
    biblioteca: 'geral',
    frase: 'Já tenho um software de gestão.',
    categoria: 'sistemas',
    gatilhos: ['já uso erp', 'tenho sistema', 'uso um sistema pronto', 'já temos software', 'já pago um sistema'],
    resistencia: 'media',
    etapas: ['primeiro-contato', 'respondeu', 'objecao'],
    servicos: ['sistema', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'O software atende bem e não há motivo para mudar.',
      'Atende parcialmente e há processos feitos por fora (planilhas, papel).',
      'Medo do trabalho de migrar.',
    ],
    estrategia:
      'Não proponha substituir. Investigue o que o software não cobre e é feito por fora. Muitas vezes a oportunidade é um complemento ou uma integração, não um sistema novo.',
    descobrir: [
      'O que o software faz bem.',
      'O que é controlado fora dele.',
      'Se o software permite integração (API, exportação).',
    ],
    respostas: {
      curta:
        'Ótimo, ter um sistema já ajuda bastante. E ele cobre tudo o que vocês precisam ou ainda tem alguma parte que é controlada em planilha ou no papel?',
      consultiva:
        'Legal! Qual parte da rotina ainda fica fora do sistema?',
      persuasiva:
        'Não faz sentido trocar um sistema que funciona. O que costumo fazer em casos assim é complementar: criar o que o software não cobre, ou integrar com ele para evitar redigitação. Se você me contar o que ainda é feito por fora, consigo te dizer se vale a pena — e se não valer, te digo também.',
      ligacao:
        'Que bom. Não estou ligando para trocar o seu sistema. Só queria entender se tem algo que vocês ainda fazem fora dele, porque às vezes dá para resolver com um complemento.',
      reuniao:
        'Mapeie os processos: o que está no software, o que está fora. Para o que está fora, avalie se um complemento ou integração resolve. Verifique a documentação do software atual antes de prometer integração.',
    },
    alternativas: [
      'Show! Se tiver algo que ele não resolve, posso pensar num complemento. Tem alguma coisa que vocês ainda fazem na mão?',
      'Ótimo! Se um dia quiserem integrar o sistema com o site ou outra ferramenta, me chama.',
    ],
    perguntaEstrategica: 'O que vocês ainda precisam redigitar ou controlar fora do sistema?',
    proximoPasso: 'Se houver lacunas, proponha uma análise de complemento ou integração, verificando a API do software atual.',
    naoDizer: [
      '"Esse sistema é ruim" — sem conhecer a fundo.',
      '"Faço um melhor" — promessa sem diagnóstico.',
      'Prometer integração sem verificar se o software permite.',
    ],
    variacoes: {
      sistema: 'Complemento ou módulo específico que o software atual não cobre.',
      recorrente: 'Integração via API e manutenção dessa integração.',
      site: 'Integrar o site ao software (ex.: catálogo, pedidos) se houver API.',
    },
    relacionadas: ['conversar-outro-software', 'software-pronto', 'integrar-sistema-atual'],
  },
  {
    id: 'sistema-complicado-equipe',
    biblioteca: 'geral',
    frase: 'O sistema parece complicado para minha equipe.',
    categoria: 'sistemas',
    gatilhos: ['minha equipe não vai saber usar', 'muito complicado', 'meu pessoal não é de tecnologia', 'vão resistir', 'difícil de aprender'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema', 'loja'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Experiência anterior de sistema que ninguém usou.',
      'Equipe com pouca familiaridade digital.',
      'Medo de perder produtividade durante a adaptação.',
    ],
    estrategia:
      'Leve a sério: adoção é o maior risco de qualquer sistema. Mostre como você reduz a complexidade (telas só com o necessário, envolvimento da equipe nos testes, treinamento, período de adaptação). Proponha envolver um usuário-chave desde o início.',
    descobrir: ['Quem são os usuários e qual a familiaridade deles.', 'Experiências anteriores com sistemas.', 'Quem poderia ser o responsável interno.'],
    respostas: {
      curta:
        'Essa preocupação é muito importante, porque sistema que ninguém usa não serve para nada. Por isso eu envolvo a equipe desde o começo, faço telas só com o que eles precisam e um treinamento prático. Quem da equipe usaria mais?',
      consultiva:
        'Faz sentido. Hoje a equipe usa o celular para o trabalho, tipo WhatsApp e planilhas? Isso me ajuda a pensar no nível de simplicidade.',
      persuasiva:
        'Um sistema bem feito precisa ser mais fácil que o processo atual — senão a equipe volta para o papel. Por isso: (1) converso com quem vai usar antes de desenhar as telas, (2) mostro protótipos para a equipe testar, (3) faço treinamento prático e gravado, e (4) acompanho as primeiras semanas de uso para ajustar o que for confuso.',
      ligacao:
        'Ótimo você pensar nisso, é o ponto mais importante. Posso te contar como eu faço para a equipe se adaptar sem sofrimento?',
      reuniao:
        'Proponha que um ou dois usuários participem da reunião de requisitos. Mostre um protótipo simples e peça para alguém da equipe tentar usar. Inclua no cronograma treinamento e período de acompanhamento.',
    },
    alternativas: [
      'Concordo, tem que ser simples. Que tal eu mostrar um protótipo para a equipe testar antes de desenvolver?',
      'Faz sentido. Eu desenho as telas com base em como eles já trabalham, para a mudança ser pequena.',
    ],
    perguntaEstrategica: 'Quem na sua equipe seria o primeiro a usar e poderia ajudar os outros?',
    proximoPasso: 'Proponha um protótipo para teste com usuários reais antes do desenvolvimento.',
    naoDizer: [
      '"É intuitivo, qualquer um usa" — sem testar com a equipe dele.',
      '"A equipe que se adapte" — ignora o maior risco do projeto.',
      'Incluir funcionalidades além do necessário.',
    ],
    variacoes: {
      sistema: 'Protótipo, usuário-chave, treinamento e acompanhamento pós-implantação.',
      loja: 'Treinamento focado nas tarefas de rotina (cadastro, pedidos), com vídeos curtos.',
      recorrente: 'Ofereça suporte dedicado nos primeiros meses.',
    },
    relacionadas: ['funcionarios-nao-sabem', 'nao-pode-parar-operacao', 'testar-antes'],
  },
  {
    id: 'medo-perder-dados',
    biblioteca: 'geral',
    frase: 'Tenho medo de perder meus dados.',
    categoria: 'sistemas',
    gatilhos: ['e se perder tudo', 'meus dados estão seguros', 'e se o sistema cair', 'medo de vazamento', 'onde ficam meus dados', 'backup'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema', 'loja', 'recorrente'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Já perdeu dados (computador queimado, planilha apagada).',
      'Preocupação com LGPD e dados de clientes.',
      'Desconfiança de armazenar informações "na nuvem".',
    ],
    estrategia:
      'Explique com clareza onde os dados ficam, como são feitos os backups, quem tem acesso e como ele pode exportar tudo. Nunca prometa risco zero. Compare com o risco atual (planilha num computador, papel).',
    descobrir: ['Onde os dados estão hoje e se há backup.', 'Que tipo de dado é (clientes, financeiro, saúde).', 'Se já houve perda.'],
    respostas: {
      curta:
        'Preocupação muito válida. No sistema, os dados ficam em servidor com backup automático, acesso só com login e você pode exportar tudo quando quiser. Não existe risco zero, mas é bem mais seguro que uma planilha num computador. Hoje vocês têm backup de onde guardam as informações?',
      consultiva:
        'Entendo. Você já passou por alguma perda de informação? Onde ficam os dados hoje?',
      persuasiva:
        'Proteção de dados precisa ser tratada com seriedade. Na prática: backups automáticos periódicos, conexão criptografada, login individual com permissões, registro de quem alterou o quê e exportação dos dados a qualquer momento — os dados são seus e isso fica em contrato. Nenhum sistema é invulnerável, e desconfie de quem diz o contrário; o objetivo é reduzir o risco e conseguir recuperar rápido se algo acontecer.',
      ligacao:
        'Faz todo sentido se preocupar com isso. Deixa eu te explicar exatamente onde os dados ficariam e como funciona o backup — em linguagem simples.',
      reuniao:
        'Explique o ciclo: onde os dados ficam, quem acessa, como é o backup e como se recupera. Mostre a função de exportação. Se envolver dados sensíveis (saúde, financeiro), discuta LGPD e recomende validação jurídica.',
    },
    alternativas: [
      'Justo! Backup automático, acesso por login e exportação a qualquer momento. Quer que eu detalhe por escrito?',
      'Faz sentido. Os dados continuam sendo seus — você pode baixar tudo quando quiser. E isso fica no contrato.',
    ],
    perguntaEstrategica: 'Se o computador onde estão as planilhas parasse hoje, o que vocês perderiam?',
    proximoPasso: 'Envie por escrito a política de backup, acesso e exportação de dados.',
    naoDizer: [
      '"É 100% seguro" — promessa falsa.',
      '"Na nuvem nada se perde" — simplificação enganosa.',
      'Usar termos técnicos sem explicar.',
    ],
    variacoes: {
      sistema: 'Backup, criptografia em trânsito, permissões, logs, exportação e cláusula de propriedade dos dados.',
      loja: 'Dados de pagamento ficam com o intermediador, não na loja — reduz o risco.',
      recorrente: 'Monitoramento e teste periódico de restauração de backup.',
    },
    relacionadas: ['protecao-dados', 'backup', 'quem-dono-codigo'],
  },
  {
    id: 'conversar-outro-software',
    biblioteca: 'geral',
    frase: 'Preciso que o sistema converse com outro software.',
    categoria: 'sistemas',
    gatilhos: ['integração', 'integrar com', 'puxar dados do', 'conectar com meu erp', 'sincronizar', 'api'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'loja', 'recorrente'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Requisito real: evitar redigitação.',
      'Não sabe se o outro software permite integração.',
      'Pode ser um teste para ver se você entende do assunto.',
    ],
    estrategia:
      'Não prometa antes de verificar. Pergunte qual software, que dados precisam ir e vir e com que frequência. Explique que integração depende da API do outro sistema e pode ter custos ou limites. Considere uma fase de investigação.',
    descobrir: ['Qual software e versão.', 'Que dados e em que direção.', 'Se é em tempo real ou pode ser periódico.'],
    respostas: {
      curta:
        'Dá para avaliar, sim. Integração depende de o outro software ter uma API ou forma de exportação. Qual é o software e que informações precisam passar de um para o outro? Eu verifico a documentação antes de te prometer qualquer coisa.',
      consultiva:
        'Boa! Que informação precisa ir de um lado para o outro e com que frequência — na hora ou uma vez por dia resolve?',
      persuasiva:
        'Integração é o que acaba com a redigitação, então vale muito a pena quando é possível. O processo honesto é: verifico se o outro software oferece API, quais dados ela permite acessar, se tem custo e limites de uso. Com isso, te passo o que é viável, quanto custa e o que pode mudar se o fornecedor alterar a API no futuro.',
      ligacao:
        'Entendi. Me fala o nome do software que eu dou uma olhada na documentação. Prefiro te dar uma resposta certa do que prometer e depois descobrir que não dá.',
      reuniao:
        'Desenhe o fluxo de dados: origem, destino, frequência, quem dispara. Identifique o que é obrigatório e o que é desejável. Combine uma etapa de verificação técnica antes do orçamento final da integração.',
    },
    alternativas: [
      'Dá para ver! Qual o software? Vou checar se ele permite integração antes de te passar valor.',
      'Integração é possível em muitos casos, mas depende do outro sistema. Me passa o nome e o que precisa sincronizar.',
    ],
    perguntaEstrategica: 'Que informação vocês hoje digitam duas vezes, em dois sistemas diferentes?',
    proximoPasso: 'Verifique a documentação da API e envie viabilidade, custos e limitações antes do orçamento final.',
    naoDizer: [
      '"Integra com tudo" — nem todo software permite.',
      'Prometer integração em tempo real sem verificar limites.',
      'Ignorar custos de uso de APIs de terceiros.',
    ],
    variacoes: {
      sistema: 'Integração via API com tratamento de erros e logs; verifique antes de orçar.',
      loja: 'Integrações comuns: pagamento, frete, ERP, nota fiscal — confirme quais são suportadas.',
      recorrente: 'Manutenção da integração quando a API do fornecedor mudar.',
    },
    relacionadas: ['integrar-sistema-atual', 'integrar-whatsapp', 'ja-tenho-software-gestao'],
  },
  {
    id: 'personalizado-sem-pagar-muito',
    biblioteca: 'geral',
    frase: 'Quero tudo personalizado, mas não quero pagar muito.',
    categoria: 'preco',
    gatilhos: ['personalizado e barato', 'do meu jeito mas barato', 'quero exclusivo mas sem gastar', 'tudo sob medida com pouco dinheiro'],
    resistencia: 'alta',
    etapas: ['perguntou-preco', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'loja', 'sistema'],
    objetivos: ['negociar-escopo', 'explicar-servico'],
    significados: [
      'Expectativa desalinhada com o mercado.',
      'Orçamento limitado e vontade de ter algo único.',
      'Não sabe o que é essencial e o que é detalhe.',
    ],
    estrategia:
      'Explique a relação entre personalização e custo de forma simples. Ajude-o a escolher onde personalizar (o que diferencia o negócio) e onde usar soluções padrão (o que é igual para todos). Ofereça fases.',
    descobrir: ['O que é realmente único no negócio dele.', 'Orçamento disponível.', 'O que pode seguir um padrão já testado.'],
    respostas: {
      curta:
        'Entendo! Uma forma de equilibrar é personalizar o que realmente diferencia o seu negócio e usar soluções prontas no que é padrão, como formulário, pagamento e login. Assim o investimento vai para o que importa. O que você considera mais único no seu negócio?',
      consultiva:
        'Faz sentido querer algo com a sua cara. Quais partes você sente que precisam ser exclusivas e quais podem seguir um padrão?',
      persuasiva:
        'Personalização tem custo porque cada detalhe exclusivo precisa ser desenhado, desenvolvido e testado. O caminho inteligente é concentrar a personalização no que o seu cliente percebe e valoriza, e usar componentes já testados para o resto. Assim você tem um resultado com identidade própria sem pagar para reinventar o que já existe.',
      ligacao:
        'Faz total sentido. Vamos pensar juntos onde vale personalizar e onde dá para usar algo pronto sem perder qualidade?',
      reuniao:
        'Liste os itens desejados e classifique com ele: "diferencial" (personalizar) ou "padrão" (usar pronto). Apresente valores das duas abordagens. Proponha fase 1 com diferenciais essenciais.',
    },
    alternativas: [
      'Dá para personalizar o essencial e usar padrão no resto. Quer que eu monte duas opções para comparar?',
      'Entendo. Posso montar uma versão com identidade própria, mas com estrutura já testada, que fica bem mais em conta.',
    ],
    perguntaEstrategica: 'Se você só pudesse personalizar três coisas, quais seriam?',
    proximoPasso: 'Envie duas opções: personalização total e personalização focada, com valores e prazos.',
    naoDizer: [
      'Prometer personalização total pelo menor preço.',
      '"Então usa um template" de forma desdenhosa.',
      'Cortar etapas de teste para caber no valor.',
    ],
    variacoes: {
      site: 'Template de qualidade + identidade visual personalizada.',
      loja: 'Plataforma pronta com layout personalizado em vez de loja do zero.',
      sistema: 'Componentes padrão (login, permissões, relatórios básicos) + regras de negócio personalizadas.',
    },
    relacionadas: ['sistema-preco-de-site', 'esta-muito-caro', 'nao-pagar-desenvolvimento'],
  },
  {
    id: 'todas-funcionalidades-ja',
    biblioteca: 'geral',
    frase: 'Preciso de todas as funcionalidades imediatamente.',
    categoria: 'sistemas',
    gatilhos: ['quero tudo de uma vez', 'preciso de tudo agora', 'não dá pra fazer em fases', 'quero completo', 'tudo pronto já'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema', 'loja', 'site'],
    objetivos: ['negociar-escopo', 'explicar-servico'],
    significados: [
      'Urgência real de operação.',
      'Medo de que as fases seguintes nunca aconteçam.',
      'Não sabe priorizar.',
    ],
    estrategia:
      'Entenda a urgência e mostre os riscos de entregar tudo junto (atraso, mais erros, adaptação difícil). Proponha entregas por fases com datas, em que a primeira já resolve o mais urgente. Se ele realmente precisar de tudo, seja transparente sobre prazo e custo.',
    descobrir: ['O que é urgente e por quê.', 'O que acontece se uma funcionalidade chegar um mês depois.', 'Se ele teme que as fases não aconteçam.'],
    respostas: {
      curta:
        'Entendo a urgência. Posso fazer tudo, mas aí o prazo fica maior. Uma alternativa é entregar primeiro o que vocês mais precisam, já funcionando, e as outras partes em sequência, com datas definidas. O que é indispensável para o primeiro dia?',
      consultiva:
        'Faz sentido. Das funcionalidades, quais vocês usariam todos os dias desde o início e quais podem chegar algumas semanas depois?',
      persuasiva:
        'Entregar tudo de uma vez parece mais rápido, mas costuma ser o contrário: o projeto fica maior, os testes demoram e a equipe tem que aprender tudo junto. Com fases, vocês começam a usar antes, os ajustes da primeira fase melhoram as seguintes e o investimento é distribuído. As datas de cada fase ficam no contrato, para você ter segurança de que tudo será entregue.',
      ligacao:
        'Entendo, e dá para fazer. Só quero te mostrar uma forma de vocês começarem a usar mais cedo. Posso te explicar?',
      reuniao:
        'Liste as funcionalidades e peça para ele ordenar por urgência. Mostre duas linhas do tempo: "tudo junto" (uma data distante) e "por fases" (primeira entrega antes). Coloque datas de cada fase no contrato.',
    },
    alternativas: [
      'Dá para fazer tudo! Mas se começarmos pelo essencial, vocês já usam antes. Quer ver as duas opções de prazo?',
      'Entendo. Posso colocar no contrato as datas de todas as fases, para você ter segurança de que nada fica para trás.',
    ],
    perguntaEstrategica: 'Se só uma funcionalidade ficasse pronta no primeiro mês, qual mudaria mais o dia a dia de vocês?',
    proximoPasso: 'Apresente cronograma por fases com datas contratuais e a opção "tudo junto" com prazo real.',
    naoDizer: [
      'Aceitar entregar tudo num prazo curto irreal.',
      '"Não dá" sem oferecer alternativa.',
      'Prometer fases sem datas.',
    ],
    variacoes: {
      sistema: 'Fases com entregas utilizáveis, homologação e datas em contrato.',
      loja: 'Primeira fase com catálogo e pagamento; depois cupons, integrações e relatórios.',
      site: 'Publicar as páginas principais primeiro e as secundárias depois.',
    },
    relacionadas: ['vai-demorar', 'sistema-preco-de-site', 'nao-pode-parar-operacao'],
  },
  {
    id: 'visualizou-nao-respondeu',
    biblioteca: 'geral',
    frase: '[Cliente visualizou a proposta e não respondeu]',
    categoria: 'sumiu',
    gatilhos: ['visualizou e não respondeu', 'deixou no vácuo', 'leu e não respondeu', 'sumiu depois da proposta', 'não responde mais', 'ignorou a proposta'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'parou-de-responder'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['recuperar-lead', 'agendar-retorno', 'encerrar'],
    significados: [
      'Está ocupado e esqueceu de responder.',
      'Ficou com alguma dúvida e não quis perguntar.',
      'Achou caro e não sabe como dizer.',
      'Escolheu outro fornecedor ou desistiu.',
    ],
    estrategia:
      'Retome com leveza, sem cobrança. Facilite a resposta oferecendo opções curtas. Após 2 a 3 tentativas espaçadas sem resposta, envie uma mensagem de encerramento respeitosa.',
    descobrir: ['Se ainda há interesse.', 'Se ficou alguma dúvida.', 'Se o momento mudou.'],
    respostas: {
      curta:
        'Oi, [nome]! Tudo bem? Passando só para saber se conseguiu olhar a proposta com calma. Ficou alguma dúvida que eu possa esclarecer?',
      consultiva:
        'Oi, [nome]! Sei que a rotina é corrida. Para facilitar: a proposta faz sentido, precisa de algum ajuste ou o momento não é agora? Qualquer resposta me ajuda.',
      persuasiva:
        'Oi, [nome]! Revisando a proposta, pensei numa alternativa que pode facilitar: começar pela parte [principal] e deixar o restante para uma segunda etapa. Se fizer sentido, te mostro como ficaria. Se não for o momento, sem problema também.',
      ligacao:
        'Oi, [nome], aqui é [seu nome]. Te liguei rapidinho só para saber se você conseguiu ver a proposta e se ficou alguma dúvida. Tem um minuto?',
      reuniao:
        'Se conseguir retomar a conversa, não pergunte "por que não respondeu?". Pergunte o que ele achou e o que mudaria na proposta. Ajuste e combine o próximo passo com data.',
    },
    alternativas: [
      'Oi, [nome]! Responde só com um número: 1 – quero seguir; 2 – preciso de ajustes; 3 – agora não é o momento. Assim eu não fico te incomodando.',
      'Oi, [nome]! Vou entender seu silêncio como "agora não é o momento", tudo bem? Se mudar, é só me chamar.',
    ],
    perguntaEstrategica: 'O que precisaria mudar na proposta para ela fazer sentido para você?',
    proximoPasso: 'Siga uma sequência de 2 a 3 contatos espaçados (ex.: 2, 5 e 10 dias). Sem resposta, envie o encerramento.',
    naoDizer: [
      '"Vi que você visualizou..." — soa como vigilância.',
      '"Estou esperando sua resposta" — cobrança.',
      'Mandar várias mensagens no mesmo dia.',
    ],
    variacoes: {
      site: 'Retome com uma informação útil (exemplo de projeto parecido), não com cobrança.',
      landing: 'Se havia campanha com data, lembre o prazo real de produção.',
      loja: 'Ofereça tirar dúvidas sobre custos recorrentes, que costumam travar a decisão.',
      sistema: 'Ofereça uma conversa para revisar o escopo; propostas de sistema costumam gerar dúvidas não verbalizadas.',
      recorrente: 'Ofereça um plano menor ou período de teste.',
    },
    relacionadas: ['vou-ver-e-te-falo', 'sumiu-depois-do-preco', 'vou-pensar'],
  },
  {
    id: 'vou-ver-e-te-falo',
    biblioteca: 'geral',
    frase: 'Vou ver aqui e te dou um retorno.',
    categoria: 'sumiu',
    gatilhos: ['te dou retorno', 'vou ver e te falo', 'depois te respondo', 'vou verificar', 'deixa eu ver aqui', 'te aviso'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'indeciso', 'parou-de-responder'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['agendar-retorno', 'descobrir-necessidade'],
    significados: [
      'Vai realmente avaliar e responder.',
      'Precisa consultar alguém ou verificar o caixa.',
      'Forma de encerrar a conversa sem compromisso.',
    ],
    estrategia:
      'Combine o retorno: quando e como. Pergunte se há algo que ele precisa verificar e se você pode ajudar. Isso transforma um "depois" vago em um próximo passo concreto.',
    descobrir: ['O que ele precisa verificar.', 'Prazo realista para a resposta.'],
    respostas: {
      curta:
        'Perfeito! O que você precisa verificar? Se for algo que eu possa ajudar, já te mando. E se eu não tiver notícias até [dia], posso te chamar?',
      consultiva:
        'Combinado! Ficou alguma dúvida que você precisa resolver antes, ou é mais questão de organizar a agenda/caixa?',
      persuasiva:
        'Claro, fica à vontade. Para facilitar, vou te mandar um resumo curto com o que conversamos: escopo, prazo e investimento. Assim você não precisa reler tudo. Se até [dia] eu não tiver notícias, te dou um alô rápido, pode ser?',
      ligacao:
        'Claro, sem problema. Só para eu me organizar: posso te ligar na [dia] para saber o que você decidiu?',
      reuniao:
        'Antes de sair, pergunte o que ele precisa verificar e com quem. Marque na agenda dos dois a data do retorno, de preferência ainda durante a reunião.',
    },
    alternativas: [
      'Combinado! Posso te chamar na [dia] se não tiver notícia antes? Só para não ficar te cobrando.',
      'Tranquilo! Te mando um resumo para facilitar. Fico no aguardo.',
    ],
    perguntaEstrategica: 'O que você precisa verificar para conseguir decidir?',
    proximoPasso: 'Envie o resumo e registre a data combinada para o retorno.',
    naoDizer: [
      '"Quando?" de forma seca.',
      'Aceitar o "depois" sem combinar data.',
      'Pressionar com prazo falso.',
    ],
    variacoes: {
      site: 'Resumo de uma página facilita a decisão.',
      sistema: 'Ofereça responder dúvidas técnicas de quem mais vai avaliar.',
      loja: 'Ofereça uma simulação de custos mensais.',
    },
    relacionadas: ['vou-pensar', 'visualizou-nao-respondeu', 'falar-com-socio'],
  },
  {
    id: 'sumiu-depois-do-preco',
    biblioteca: 'geral',
    frase: '[Cliente parou de responder depois de saber o preço]',
    categoria: 'sumiu',
    gatilhos: ['sumiu depois do preço', 'não respondeu depois do valor', 'passei o preço e sumiu', 'achou caro e sumiu', 'silêncio depois do orçamento'],
    resistencia: 'alta',
    etapas: ['perguntou-preco', 'parou-de-responder'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['recuperar-lead', 'negociar-escopo', 'encerrar'],
    significados: [
      'O valor ficou acima do esperado e ele ficou sem graça de dizer.',
      'Estava só fazendo cotação.',
      'Não entendeu o que estava incluso.',
    ],
    estrategia:
      'Facilite que ele diga que achou caro, sem constrangimento. Ofereça uma alternativa menor sem desvalorizar a proposta original. Se não houver resposta, encerre com respeito.',
    descobrir: ['Se o valor foi o problema.', 'Qual faixa ele imaginava.', 'Se uma versão menor resolveria.'],
    respostas: {
      curta:
        'Oi, [nome]! Fiquei pensando: se o valor ficou fora do que você imaginava, me fala sem problema nenhum. Dá para montar uma versão mais enxuta, com o essencial. Quer que eu te mostre?',
      consultiva:
        'Oi, [nome]! Tudo bem? Fiquei curioso: o valor ficou dentro do que você esperava? Se não ficou, me diz qual faixa faria sentido e eu vejo o que dá para entregar nela.',
      persuasiva:
        'Oi, [nome]! Muita gente se assusta um pouco com o valor completo, e é normal. Por isso também trabalho com uma versão inicial: [versão enxuta] por R$ [valor], que já resolve [problema principal], e o restante pode vir depois. Se quiser, te mando os detalhes.',
      ligacao:
        'Oi, [nome], tudo bem? Te liguei porque fiquei com a impressão de que o valor pode ter ficado acima do que você imaginava. Se for isso, fica tranquilo — tenho outras formas de começar. Posso te explicar?',
      reuniao:
        'Normalmente não haverá reunião nessa etapa. Se houver, pergunte diretamente a faixa de investimento que ele considera e apresente duas opções ajustadas ao escopo.',
    },
    alternativas: [
      'Oi, [nome]! Se o valor pesou, me fala que eu monto uma opção menor. Se preferir deixar para outro momento, tudo bem também.',
      'Oi, [nome]! Só para fechar o ciclo: posso considerar que agora não é o momento? Se mudar, estou por aqui.',
    ],
    perguntaEstrategica: 'Qual faixa de investimento faria sentido para você neste momento?',
    proximoPasso: 'Envie uma alternativa enxuta. Sem resposta após 2 contatos, envie mensagem de encerramento.',
    naoDizer: [
      '"Faço com desconto se fechar hoje" — desespero e urgência falsa.',
      '"Achou caro?" de forma irônica.',
      'Baixar o preço do mesmo escopo.',
    ],
    variacoes: {
      site: 'Ofereça página única como versão inicial.',
      landing: 'Ofereça template adaptado em vez de página totalmente personalizada.',
      loja: 'Ofereça catálogo com pedido pelo WhatsApp em vez de checkout completo.',
      sistema: 'Ofereça MVP com um único módulo ou uma fase de descoberta paga.',
      recorrente: 'Ofereça plano básico ou atendimento avulso.',
    },
    relacionadas: ['esta-muito-caro', 'visualizou-nao-respondeu', 'manda-os-precos'],
  },
];
