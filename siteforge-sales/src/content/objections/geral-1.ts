import type { Objection } from '../../types';

export const GERAL_1: Objection[] = [
  {
    id: 'ja-tenho-instagram',
    biblioteca: 'geral',
    frase: 'Já tenho Instagram.',
    categoria: 'necessidade',
    gatilhos: [
      'tenho insta',
      'uso o instagram',
      'minhas redes sociais resolvem',
      'divulgo no instagram',
      'o instagram já funciona',
      'tenho página no facebook',
      'rede social já basta',
    ],
    resistencia: 'media',
    etapas: ['primeiro-contato', 'respondeu', 'objecao'],
    servicos: ['site', 'landing', 'loja'],
    objetivos: ['descobrir-necessidade', 'explicar-servico', 'reuniao'],
    significados: [
      'O Instagram realmente traz clientes e ele não vê o que um site acrescentaria.',
      'Ele associa site a algo caro, difícil de manter ou "coisa de empresa grande".',
      'É uma forma educada de encerrar a conversa com um desconhecido.',
      'Já teve um site que ninguém acessava e não quer repetir a experiência.',
    ],
    estrategia:
      'Valorize o Instagram em vez de competir com ele. Descubra o que acontece depois que alguém se interessa por um post: onde a pessoa encontra serviços, preços, endereço e como agenda. Só apresente o site se houver um problema real nesse caminho.',
    descobrir: [
      'Quanto do faturamento vem de clientes que chegam pelo Instagram.',
      'Que perguntas repetidas ele responde no Direct e no WhatsApp.',
      'O que aparece quando alguém pesquisa o nome da empresa no Google.',
    ],
    respostas: {
      curta:
        'Boa! O Instagram ajuda bastante na divulgação. A ideia do site seria complementar o que você já faz, reunindo serviços, localização, horários e um caminho fácil para o cliente entrar em contato. Hoje, seus clientes encontram essas informações com facilidade?',
      consultiva:
        'Entendi! E hoje, quando alguém pesquisa o nome da sua empresa no Google, encontra facilmente seus serviços, endereço e formas de contato?',
      persuasiva:
        'Não precisa abandonar o Instagram — ele é ótimo para mostrar o dia a dia. O site entra como o endereço fixo: reúne serviços, perguntas frequentes e contato num lugar que não depende do algoritmo nem de a pessoa rolar o feed. A proposta é conectar os canais e facilitar o caminho de quem já tem interesse. Se fizer sentido, posso te mostrar uma ideia de como isso funcionaria para o seu negócio.',
      ligacao:
        'Que ótimo que o Instagram está funcionando, é um canal importante. Me conta uma coisa: quando alguém vê seu post e se interessa, o que essa pessoa faz em seguida? Chama no Direct, no WhatsApp?',
      reuniao:
        'Comece pedindo para ele abrir o próprio perfil e mostrar de onde vêm os clientes. Pesquise juntos o nome da empresa no Google e observe o resultado sem comentar de forma negativa. Pergunte quais dúvidas aparecem sempre no Direct. Depois, mostre como um site organizaria essas respostas e levaria para o mesmo WhatsApp. Feche perguntando se esse caminho resolveria algo que ele sente hoje.',
    },
    alternativas: [
      'Que bom que o Instagram está trazendo resultado! O site não substitui, ele soma: é o lugar fixo onde ficam serviços, endereço e contato, sem depender do feed. Hoje você responde muitas perguntas repetidas no Direct?',
      'Faz sentido! Muita gente chega pelo Instagram mesmo. A dúvida que eu teria é: quem te encontra pelo Google ou por indicação, para onde vai? Se esse caminho já está resolvido, talvez você nem precise de site agora.',
    ],
    perguntaEstrategica:
      'Quando alguém que nunca te seguiu recebe sua indicação, onde essa pessoa confere se vale a pena te chamar?',
    proximoPasso:
      'Se ele reconhecer algum problema (perguntas repetidas, informação difícil de achar), proponha uma demonstração curta mostrando como o site e o Instagram trabalhariam juntos.',
    naoDizer: [
      '"Instagram não vende nada" — desqualifica um canal que dá resultado para ele.',
      '"Você está perdendo clientes" — sem evidência, soa como pressão e ele não tem como verificar.',
      '"Toda empresa séria tem site" — insinua que o negócio dele não é sério.',
    ],
    variacoes: {
      site: 'Posicione o site como o endereço fixo que reúne o que fica espalhado no feed: serviços, localização, FAQ e contato.',
      landing:
        'Uma landing page faz sentido se ele investe em impulsionamento: em vez de mandar o anúncio para o perfil, manda para uma página com uma oferta clara.',
      loja: 'Se ele vende produtos pelo Direct, o argumento é o catálogo organizado: o cliente vê preços e disponibilidade sem esperar resposta.',
      sistema:
        'Raramente é a objeção certa para sistema. Se ele usa o Instagram para receber pedidos ou agendamentos, investigue o volume e o retrabalho de organizar isso manualmente.',
      recorrente: 'Para manutenção ou SEO, conecte ao que o Instagram não faz: aparecer em buscas e manter informações atualizadas fora do feed.',
    },
    relacionadas: ['clientes-chegam-whatsapp', 'nao-preciso-de-site', 'nao-preciso-google'],
  },
  {
    id: 'nao-preciso-de-site',
    biblioteca: 'geral',
    frase: 'Não preciso de site.',
    categoria: 'necessidade',
    gatilhos: [
      'site não serve pra mim',
      'não vejo necessidade',
      'site é desnecessário',
      'pra que site',
      'não faz falta',
      'nunca precisei de site',
    ],
    resistencia: 'alta',
    etapas: ['primeiro-contato', 'respondeu', 'recusou'],
    servicos: ['site', 'landing', 'loja'],
    objetivos: ['descobrir-necessidade', 'encerrar', 'agendar-retorno'],
    significados: [
      'Ele pode estar certo: o negócio funciona bem sem site e a agenda está cheia.',
      'Não entende o que um site faria na prática para ele.',
      'Recebe muitas abordagens de venda e responde assim para todas.',
      'Já investiu em algo digital que não trouxe retorno.',
    ],
    estrategia:
      'Aceite a possibilidade de ele ter razão. Faça uma ou duas perguntas sobre como os clientes chegam e o que acontece quando querem saber mais. Se não houver dor, encerre com elegância e deixe a porta aberta — insistir aqui queima a relação.',
    descobrir: [
      'Se ele quer crescer ou está satisfeito com o volume atual.',
      'Como novos clientes conhecem o negócio.',
      'Se já teve alguma experiência ruim com site ou agência.',
    ],
    respostas: {
      curta:
        'Tranquilo, e pode ser que você não precise mesmo agora. Só por curiosidade: hoje seus clientes novos chegam mais por indicação ou por redes sociais?',
      consultiva:
        'Entendo. Se hoje sua agenda está cheia e os clientes chegam bem, talvez não seja prioridade mesmo. Você está buscando crescer nos próximos meses ou o volume atual está bom?',
      persuasiva:
        'Faz sentido, nem todo negócio precisa de site no mesmo momento. Normalmente ele passa a fazer diferença quando a empresa quer atender clientes que ainda não a conhecem — quem pesquisa no Google ou recebe uma indicação e quer conferir antes de chamar. Se em algum momento esse for o seu objetivo, posso te mostrar como funcionaria, sem compromisso.',
      ligacao:
        'Tudo bem, agradeço a sinceridade. Posso te fazer só uma pergunta antes de desligar? Hoje, quando um cliente novo quer te conhecer, onde ele procura informação sobre o seu trabalho?',
      reuniao:
        'Se a reunião aconteceu mesmo com essa objeção, há algum interesse. Pergunte sobre metas: o que ele quer para o negócio nos próximos 12 meses. Ligue o site apenas às metas que ele mencionar (novos clientes, outra região, novo serviço). Se nenhuma meta depender de presença digital, diga isso abertamente — essa honestidade gera indicações.',
    },
    alternativas: [
      'Entendido! Não vou insistir. Se em algum momento você quiser atrair clientes que ainda não te conhecem, me chama que eu te mostro algumas ideias.',
      'Sem problema. Posso só te perguntar o que te faz sentir que não precisa? Assim eu entendo melhor e não te incomodo com algo que não faz sentido.',
    ],
    perguntaEstrategica: 'Se você pudesse ter mais clientes de um tipo específico, que tipo de cliente seria?',
    proximoPasso:
      'Sem dor identificada: agradeça, encerre e programe um contato leve em 3 a 6 meses. Com dor identificada: proponha mostrar um exemplo curto ligado a ela.',
    naoDizer: [
      '"Hoje em dia todo mundo precisa de site" — genérico e fácil de rebater.',
      '"Seus concorrentes já têm" — pode gerar defensividade.',
      'Insistir com três argumentos seguidos depois de um "não" claro.',
    ],
    variacoes: {
      site: 'Investigue se há clientes que pesquisam antes de contratar. Sem isso, o site perde força como argumento.',
      landing: 'Se ele faz alguma divulgação paga ou campanha sazonal, uma página única pode ser uma porta de entrada mais leve que um site completo.',
      loja: 'Pergunte se ele vende para quem está longe ou fora do horário. Se não vende e não quer vender, a loja não faz sentido.',
      sistema: 'A conversa muda: investigue processos internos (agenda, pedidos, orçamentos), não presença online.',
    },
    relacionadas: ['ja-tenho-instagram', 'negocio-pequeno', 'nao-preciso-google'],
  },
  {
    id: 'negocio-pequeno',
    biblioteca: 'geral',
    frase: 'Meu negócio é pequeno.',
    categoria: 'necessidade',
    gatilhos: [
      'sou pequeno',
      'empresa pequena',
      'é só eu',
      'trabalho sozinho',
      'não sou empresa grande',
      'meu negócio é simples',
      'sou mei',
    ],
    resistencia: 'media',
    etapas: ['respondeu', 'interesse', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo', 'descobrir-necessidade'],
    significados: [
      'Acha que site é coisa cara, feita para empresas grandes.',
      'Tem receio de não conseguir manter ou atualizar.',
      'O orçamento é realmente apertado.',
      'Não quer parecer maior do que é — valoriza o atendimento pessoal.',
    ],
    estrategia:
      'Mostre que o projeto se ajusta ao tamanho do negócio. Pergunte o que ele precisa que o cliente saiba e ofereça uma versão enxuta. Evite apresentar o pacote mais completo primeiro.',
    descobrir: [
      'Qual é o principal serviço ou produto que ele quer vender mais.',
      'Quanto ele investe hoje em divulgação (mesmo que seja só tempo).',
      'Se ele planeja crescer ou manter o tamanho atual.',
    ],
    respostas: {
      curta:
        'Faz total sentido. E é justamente para negócio pequeno que um site simples costuma funcionar bem: uma página bem feita com seus serviços, fotos e WhatsApp, sem nada complicado. Quer que eu te mostre como seria uma versão enxuta?',
      consultiva:
        'Entendi. Me conta: se você tivesse que escolher uma coisa para o cliente saber sobre o seu trabalho antes de te chamar, o que seria?',
      persuasiva:
        'Negócio pequeno costuma depender muito de confiança — o cliente quer ver seu trabalho antes de chamar. Uma página simples, com fotos reais, serviços e contato, ajuda quem recebeu uma indicação a decidir. E dá para começar pequeno: o projeto se ajusta ao seu momento, não o contrário.',
      ligacao:
        'Entendo perfeitamente, e não estou falando de nada grande. Muitos dos projetos que eu faço são para quem trabalha sozinho. A ideia é algo simples, que você consiga usar. Posso te perguntar o que mais te pedem hoje?',
      reuniao:
        'Leve dois exemplos: um projeto enxuto e um mais completo, e comece pelo enxuto. Pergunte o que ele mais gostaria que o cliente soubesse. Mostre que o investimento é proporcional e que é possível crescer em fases. Feche alinhando uma versão inicial com escopo e valor claros.',
    },
    alternativas: [
      'Justamente por isso a proposta seria algo simples: uma página com o que você faz, fotos e contato. Nada que te dê trabalho para manter. Faz sentido conversarmos sobre uma versão básica?',
      'Entendo! Tamanho não é problema — o projeto acompanha o seu negócio. O que te faria considerar que valeu a pena?',
    ],
    perguntaEstrategica: 'Você pretende continuar do tamanho atual ou gostaria de crescer nos próximos meses?',
    proximoPasso: 'Ofereça uma versão Essencial com escopo fechado e a possibilidade de evoluir depois.',
    naoDizer: [
      '"Com um site você vai parecer uma empresa grande" — ele pode valorizar justamente ser pequeno.',
      'Apresentar primeiro o pacote mais caro.',
      '"É barato, qualquer um pode pagar" — desvaloriza seu trabalho e pode não ser verdade para ele.',
    ],
    variacoes: {
      site: 'Proponha uma página única ou site de até 3 páginas, com o essencial.',
      landing: 'Uma landing page simples costuma ser a melhor porta de entrada para pequenos negócios e autônomos.',
      loja: 'Sugira catálogo com pedido pelo WhatsApp antes de um e-commerce completo.',
      sistema:
        'Para negócio pequeno, sistema só faz sentido se resolver um gargalo específico (agenda, orçamento). Considere indicar uma ferramenta pronta se for mais adequada.',
      recorrente: 'Ofereça um plano básico ou pagamento por demanda em vez de mensalidade fixa.',
    },
    relacionadas: ['nao-preciso-de-site', 'sem-dinheiro-agora', 'esta-muito-caro'],
  },
  {
    id: 'sem-dinheiro-agora',
    biblioteca: 'geral',
    frase: 'Não tenho dinheiro agora.',
    categoria: 'preco',
    gatilhos: [
      'estou sem grana',
      'sem dinheiro',
      'sem orçamento',
      'momento difícil',
      'caixa apertado',
      'não tenho como investir',
      'tô apertado',
      'não cabe no bolso agora',
    ],
    resistencia: 'alta',
    etapas: ['perguntou-preco', 'recebeu-proposta', 'objecao', 'recusou'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['negociar-escopo', 'agendar-retorno', 'encerrar'],
    significados: [
      'Falta de caixa real no momento.',
      'O valor percebido ainda está abaixo do preço.',
      'Há outras prioridades na frente (equipamento, estoque, dívida).',
      'Forma educada de dizer que não tem interesse.',
    ],
    estrategia:
      'Respeite a situação financeira — nunca sugira que ele "dê um jeito". Descubra se é questão de caixa (timing), de prioridade ou de valor. Se for caixa, ofereça fases ou combine um retorno. Se for valor, volte ao problema que o site resolve.',
    descobrir: [
      'Se existe interesse real ou se é uma recusa educada.',
      'Quando a situação de caixa deve melhorar.',
      'Qual parte do projeto é mais importante para ele.',
    ],
    respostas: {
      curta:
        'Entendo, e agradeço por ser direto. Não faz sentido apertar o caixa agora. Quer que eu te chame mais para frente, ou prefere que eu monte uma versão inicial menor para caber no momento?',
      consultiva:
        'Super entendo. Só para eu não te incomodar à toa: o projeto em si faz sentido para você e a questão é o momento, ou ainda não está claro se vale o investimento?',
      persuasiva:
        'Entendo totalmente. Uma alternativa que alguns clientes escolhem é começar pelo essencial — uma página com serviços e contato — e incluir o restante numa segunda etapa, quando o caixa permitir. Assim você não fica parado e o investimento acompanha o seu momento. Se fizer sentido, eu te mostro como ficaria essa primeira fase.',
      ligacao:
        'Entendo, e obrigado por falar abertamente. Não quero te colocar numa situação difícil. Posso te perguntar se, resolvendo a questão do valor, o projeto faria sentido para você?',
      reuniao:
        'Não discuta a situação financeira. Confirme se o projeto resolve um problema real e, se sim, apresente a divisão em fases com valores separados. Se mesmo a primeira fase não couber, combine uma data concreta de retorno e registre o que foi conversado.',
    },
    alternativas: [
      'Sem problema nenhum, é o momento que manda. Posso te procurar em [mês]? Assim você se organiza com calma.',
      'Entendido. Se ajudar, dá para dividir o projeto em etapas menores. Mas se agora não é hora, tudo bem — me avisa quando for.',
    ],
    perguntaEstrategica: 'Se o investimento não fosse o problema, esse projeto seria prioridade para você agora?',
    proximoPasso:
      'Questão de timing: combine uma data de retorno. Questão de valor: retome o diagnóstico. Questão de escopo: ofereça a fase 1.',
    naoDizer: [
      '"É só parcelar no cartão" — empurra o cliente para dívida.',
      '"Quem não investe não cresce" — soa como julgamento.',
      'Oferecer desconto imediato no mesmo escopo — ensina que seu preço é negociável sem critério.',
    ],
    variacoes: {
      site: 'Ofereça uma página única como fase 1 e as demais páginas depois.',
      landing: 'Landing page já é a versão enxuta; foque em condições de pagamento ou data de início.',
      loja: 'Sugira começar com catálogo e pedido pelo WhatsApp, deixando checkout e integrações para depois.',
      sistema: 'Proponha um MVP com o módulo mais crítico. Mostre custos recorrentes para evitar surpresa futura.',
      recorrente: 'Ofereça um plano menor ou pagamento por demanda até a situação melhorar.',
    },
    relacionadas: ['esta-muito-caro', 'proximo-mes', 'personalizado-sem-pagar-muito'],
  },
  {
    id: 'esta-muito-caro',
    biblioteca: 'geral',
    frase: 'Está muito caro.',
    categoria: 'preco',
    gatilhos: [
      'caro',
      'muito caro',
      'tá salgado',
      'puxado',
      'acima do que eu esperava',
      'fora do meu orçamento',
      'não vale isso',
      'achei o valor alto',
      'carinho',
      'pesado',
    ],
    resistencia: 'media',
    etapas: ['perguntou-preco', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['defender-valor', 'negociar-escopo', 'comparacao-preco'],
    significados: [
      'Ele está comparando com uma referência (outro orçamento, plataforma gratuita, um conhecido).',
      'Não entendeu tudo o que está incluso.',
      'O orçamento disponível é realmente menor.',
      'Está testando se há margem de negociação.',
    ],
    estrategia:
      'Não baixe o preço nem se justifique de imediato. Descubra a referência: caro comparado a quê? Em seguida, deixe claro o que está incluso e, se for o caso, ajuste o escopo — nunca o preço do mesmo escopo.',
    descobrir: [
      'Qual valor ele tinha em mente.',
      'Com o que ele está comparando.',
      'Quais itens da proposta são mais importantes para ele.',
    ],
    respostas: {
      curta:
        'Entendo! Posso te perguntar: está caro em relação a algum outro orçamento ou ao valor que você tinha em mente? Assim eu vejo se dá para ajustar o escopo para ficar adequado.',
      consultiva:
        'Faz sentido avaliar com cuidado. Para eu entender melhor: qual parte da proposta você sente que não está valendo o investimento?',
      persuasiva:
        'Entendo a preocupação. Nesse valor estão incluídos [itens principais], além de suporte após a entrega e o domínio no seu nome. Quando a comparação é feita item por item, a diferença costuma estar no que fica de fora. Se o orçamento for o limite, prefiro ajustar o escopo a entregar algo incompleto — posso montar uma versão mais enxuta para você comparar.',
      ligacao:
        'Entendo, obrigado por me dizer. Me ajuda a entender: você tinha um valor em mente? Porque aí eu consigo ver o que cabe nesse valor sem comprometer o que é mais importante para você.',
      reuniao:
        'Peça para revisar a proposta junto. Para cada item, pergunte se é importante para ele. Marque o que pode ficar para uma segunda fase. No fim, apresente duas opções: o projeto completo e uma versão ajustada com valor menor. A decisão fica com ele, com clareza sobre o que muda.',
    },
    alternativas: [
      'Obrigado por falar! Caro em relação a quê? Se for outro orçamento, posso te ajudar a comparar o que cada um inclui.',
      'Entendo. Prefiro ajustar o que entra no projeto do que fazer o mesmo trabalho pela metade. Quer que eu monte uma versão com o essencial?',
    ],
    perguntaEstrategica: 'Que valor você imaginava investir, e o que precisaria estar incluso nele?',
    proximoPasso: 'Envie uma proposta alternativa com escopo reduzido ou dividida em fases, mantendo a original disponível.',
    naoDizer: [
      '"Mas está barato!" — invalida a percepção dele.',
      '"Posso fazer por menos" sem mudar o escopo — desvaloriza o trabalho e gera desconfiança.',
      '"Você vai recuperar isso em um mês" — promessa de resultado que você não controla.',
    ],
    variacoes: {
      site: 'Compare com o custo de manter a informação desorganizada e mostre o que está incluso: domínio, SSL, responsividade, suporte.',
      landing: 'Relacione o valor ao investimento em anúncios: a página precisa fazer o dinheiro do tráfego render.',
      loja: 'Separe o custo de desenvolvimento das taxas e custos recorrentes. Considere começar por catálogo.',
      sistema:
        'Compare com o custo atual do processo manual (horas, erros, retrabalho) e com o custo total de um software pronto em alguns anos. Ofereça MVP.',
      recorrente: 'Detalhe o que está incluso por mês e ofereça a opção avulsa para comparação.',
    },
    relacionadas: ['outro-cobra-mais-barato', 'sem-dinheiro-agora', 'personalizado-sem-pagar-muito'],
  },
  {
    id: 'outro-cobra-mais-barato',
    biblioteca: 'geral',
    frase: 'Outro desenvolvedor cobra mais barato.',
    categoria: 'concorrencia',
    gatilhos: [
      'achei mais barato',
      'outro orçamento mais barato',
      'fulano faz por menos',
      'recebi proposta menor',
      'vi gente cobrando metade',
      'tem gente que faz por 300',
    ],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao', 'indeciso'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['comparacao-preco', 'defender-valor', 'negociar-escopo'],
    significados: [
      'Ele realmente tem uma proposta menor e está em dúvida.',
      'Está usando a comparação para negociar.',
      'Não sabe avaliar diferenças técnicas entre as propostas.',
    ],
    estrategia:
      'Não critique o concorrente. Ofereça ajuda para comparar escopos de forma justa: o que está incluso, quem é dono do domínio, prazo, suporte, quantidade de páginas, responsividade. Se o outro realmente for melhor para ele, diga isso — sua credibilidade vale mais que uma venda.',
    descobrir: [
      'O que exatamente está incluso na outra proposta.',
      'O que o fez pedir mais de um orçamento.',
      'O que pesa mais para ele: preço, prazo, segurança ou suporte.',
    ],
    respostas: {
      curta:
        'Faz sentido comparar! Se quiser, me manda o que está incluso na outra proposta que eu te ajudo a comparar item por item. Às vezes a diferença está no que fica de fora.',
      consultiva:
        'Entendo. Além do valor, o que mais você está levando em conta para decidir entre as propostas?',
      persuasiva:
        'É natural encontrar valores diferentes — cada profissional inclui coisas diferentes. Vale conferir: o domínio fica no seu nome? Tem suporte depois da entrega? Quantas alterações estão inclusas? Funciona bem no celular? Minha proposta inclui [itens]. Se a outra entregar o mesmo por menos, pode ser uma boa opção para você, e eu entendo.',
      ligacao:
        'Que bom que você está pesquisando, é o certo a fazer. Você se importaria de me dizer o que está incluso na outra proposta? Assim eu te ajudo a ver se estamos comparando a mesma coisa.',
      reuniao:
        'Monte com ele uma tabela simples de comparação: entregáveis, prazo, suporte, propriedade do domínio, alterações inclusas, formas de pagamento. Preencha com honestidade, inclusive onde o concorrente for melhor. Feche perguntando qual critério pesa mais para ele.',
    },
    alternativas: [
      'Ótimo que você tem outra opção! Quer uma lista do que vale conferir em qualquer orçamento de site? Ajuda a decidir com segurança, independentemente de quem você escolher.',
      'Entendo. Não vou falar mal de ninguém — só sugiro comparar o que está incluso. Se ficar igual e mais barato, faz sentido fechar com ele.',
    ],
    perguntaEstrategica: 'Se os dois valores fossem iguais, qual proposta você escolheria e por quê?',
    proximoPasso: 'Envie um checklist de comparação ou proponha uma versão com escopo ajustado, sem reduzir o preço do mesmo escopo.',
    naoDizer: [
      '"Esse cara faz site de baixa qualidade" — falar mal do concorrente reduz sua credibilidade.',
      '"Eu cubro qualquer oferta" — vira leilão e desvaloriza seu trabalho.',
      '"Barato sai caro" — clichê que soa arrogante.',
    ],
    variacoes: {
      site: 'Compare domínio, SSL, hospedagem, número de páginas, responsividade, SEO básico e suporte.',
      landing: 'Compare integrações, rastreamento de conversões e velocidade de carregamento.',
      loja: 'Compare meios de pagamento, frete, painel de produtos, treinamento e taxas da plataforma.',
      sistema:
        'Compare levantamento de requisitos, propriedade do código, documentação, testes, garantia e custos recorrentes. Proposta muito barata de sistema geralmente omite etapas.',
      recorrente: 'Compare tempo de resposta, o que está incluso por mês, backups e relatórios.',
    },
    relacionadas: ['esta-muito-caro', 'sobrinho-faz', 'agencia-grande'],
  },
  {
    id: 'sobrinho-faz',
    biblioteca: 'geral',
    frase: 'Meu sobrinho faz para mim.',
    categoria: 'concorrencia',
    gatilhos: [
      'meu filho faz',
      'um amigo faz',
      'conheço alguém que faz',
      'meu primo mexe com isso',
      'tenho um conhecido que faz site',
      'parente faz de graça',
    ],
    resistencia: 'media',
    etapas: ['primeiro-contato', 'respondeu', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['descobrir-necessidade', 'explicar-servico', 'encerrar'],
    significados: [
      'Ele realmente tem alguém próximo que pode fazer, possivelmente de graça.',
      'É uma forma de dizer que não quer pagar.',
      'O parente prometeu fazer, mas ainda não fez.',
    ],
    estrategia:
      'Respeite a relação familiar e nunca desqualifique o parente. Pergunte com leveza sobre o andamento. Muitas vezes o projeto está parado. Posicione-se como alternativa profissional para quando ele precisar de prazo, suporte e compromisso.',
    descobrir: [
      'Se o site já existe ou está só prometido.',
      'Há quanto tempo está "para fazer".',
      'Quem vai cuidar das atualizações e problemas depois.',
    ],
    respostas: {
      curta:
        'Que legal ter alguém de confiança na família! Ele já está fazendo ou ainda vai começar? Se em algum momento precisar de ajuda com alguma parte, pode contar comigo.',
      consultiva:
        'Bacana! E como ele está fazendo: já tem uma previsão de quando o site fica pronto?',
      persuasiva:
        'Ótimo ter essa ajuda. O que costuma diferenciar um trabalho profissional é o compromisso com prazo, contrato, suporte depois da entrega e alguém disponível quando algo para de funcionar. Se em algum momento você precisar disso — ou se ele quiser ajuda em alguma parte técnica — estou à disposição.',
      ligacao:
        'Que bom, ajuda de família é sempre bem-vinda. Ele já começou? Pergunto porque muita gente me procura depois que o projeto fica parado — e tudo bem, a vida de todo mundo é corrida.',
      reuniao:
        'Se ele aceitou reunião mesmo tendo um parente que faz, provavelmente há algo travado. Pergunte o que já foi feito, o que falta e o que ele espera. Mostre seu processo (prazos, entregas, suporte) sem comparar diretamente com o parente.',
    },
    alternativas: [
      'Que bom! Se precisar de uma segunda opinião ou de ajuda com hospedagem e domínio, me chama.',
      'Entendi! Desejo sucesso no projeto. Se o tempo dele apertar, fico à disposição.',
    ],
    perguntaEstrategica: 'Quando o site estiver no ar, quem vai cuidar das atualizações e de qualquer problema técnico?',
    proximoPasso:
      'Deixe a porta aberta e programe um contato leve em 30 a 60 dias perguntando se o projeto andou.',
    naoDizer: [
      '"Sobrinho não faz site profissional" — ofende a família dele.',
      '"Vai ficar amador" — você não viu o trabalho.',
      '"Depois não reclama" — arrogante e encerra a relação.',
    ],
    variacoes: {
      site: 'Destaque compromisso com prazo, suporte e propriedade do domínio.',
      landing: 'Destaque integração com anúncios e rastreamento, que exigem conhecimento específico.',
      loja: 'Loja envolve pagamentos, segurança e logística: o compromisso de suporte pesa mais.',
      sistema:
        'Sistemas exigem manutenção, documentação e responsabilidade sobre dados. Pergunte quem responderia por isso no longo prazo.',
    },
    relacionadas: ['outro-cobra-mais-barato', 'faco-com-ia', 'nao-quero-depender'],
  },
  {
    id: 'ja-tenho-site',
    biblioteca: 'geral',
    frase: 'Já tenho um site.',
    categoria: 'necessidade',
    gatilhos: ['já tenho site', 'tenho site', 'já fiz um site', 'meu site já existe', 'já temos site'],
    resistencia: 'baixa',
    etapas: ['primeiro-contato', 'respondeu'],
    servicos: ['site', 'landing', 'loja', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'Ele está satisfeito com o site atual.',
      'O site existe, mas está desatualizado e ele sabe disso.',
      'Ele não sabe avaliar se o site está bom.',
    ],
    estrategia:
      'Não critique o site atual sem ser convidado. Pergunte o que ele acha do site e se o site cumpre o papel que ele espera. Se você notou algo concreto (não abre no celular, informação desatualizada), pergunte antes de apontar.',
    descobrir: [
      'Quando o site foi feito e quem cuida dele.',
      'Se ele consegue atualizar sozinho.',
      'Se o site gera contatos ou é só uma vitrine.',
    ],
    respostas: {
      curta:
        'Ótimo! E como está sendo a experiência com ele? Você consegue atualizar quando precisa e ele traz contatos?',
      consultiva:
        'Legal! O site faz hoje tudo o que você gostaria que ele fizesse, ou tem alguma coisa que você mudaria?',
      persuasiva:
        'Que bom que você já tem presença online. Muitas vezes o trabalho não é fazer do zero, e sim ajustar o que já existe: atualizar informações, melhorar no celular, deixar o contato mais fácil ou trazer novos serviços. Se você quiser, posso te dar uma opinião sincera sobre o que manteria e o que melhoraria.',
      ligacao:
        'Ah, que bom! Posso te perguntar quem cuida dele hoje? E você está satisfeito com o resultado ou tem alguma coisa que te incomoda?',
      reuniao:
        'Abra o site junto com ele no celular. Pergunte o que ele gosta e o que mudaria. Anote as respostas. Só depois ofereça sua leitura, focando em 2 ou 3 pontos práticos. Proponha ajuste ou nova versão conforme o que ele valorizar.',
    },
    alternativas: [
      'Show! Você está satisfeito com ele ou tem algo que gostaria de melhorar?',
      'Legal! Se em algum momento quiser uma segunda opinião sobre ele, posso olhar e te dizer com sinceridade o que vale manter.',
    ],
    perguntaEstrategica: 'Quando foi a última vez que você atualizou alguma informação no site?',
    proximoPasso: 'Se ele demonstrar abertura, ofereça uma análise breve do site atual e só depois uma proposta.',
    naoDizer: [
      '"Seu site está horrível" — mesmo que seja verdade, você não foi convidado a julgar.',
      '"Isso está ultrapassado" — sem explicar o impacto prático.',
      'Enviar uma proposta de site novo sem saber o que ele quer.',
    ],
    variacoes: {
      site: 'Ofereça revisão, ajustes pontuais ou redesign, conforme a necessidade.',
      landing: 'Uma landing page pode complementar o site existente para campanhas específicas.',
      loja: 'Se o site não vende, investigue se ele quer vender online; o catálogo pode ser um módulo do site atual.',
      sistema: 'O site pode continuar; o sistema resolve algo interno (agenda, pedidos) e pode ser integrado.',
      recorrente: 'Ofereça manutenção, SEO ou atualizações para o site que ele já tem.',
    },
    relacionadas: ['site-atual-funciona', 'quem-vai-atualizar', 'ja-contratei-nao-deu-certo'],
  },
  {
    id: 'site-atual-funciona',
    biblioteca: 'geral',
    frase: 'Meu site atual funciona.',
    categoria: 'necessidade',
    gatilhos: ['meu site está bom', 'site funciona bem', 'não precisa mexer no site', 'estou satisfeito com meu site', 'site atende'],
    resistencia: 'media',
    etapas: ['respondeu', 'objecao'],
    servicos: ['site', 'loja', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'encerrar'],
    significados: [
      'Funciona mesmo, e não há motivo para mudar.',
      '"Funciona" significa apenas que está no ar, não que traz resultado.',
      'Ele tem receio do custo e do trabalho de mudar.',
    ],
    estrategia:
      'Concorde e aprofunde: o que significa "funcionar" para ele? Se o site atende ao objetivo, ofereça apenas serviços complementares (manutenção, SEO) ou encerre. Não force uma troca.',
    descobrir: ['O que ele espera do site.', 'Se ele mede resultado (contatos, vendas).', 'Se o site é seguro e atualizado.'],
    respostas: {
      curta:
        'Que ótimo! Se está cumprindo o papel, não tem por que mudar. Só por curiosidade: hoje ele traz contatos ou funciona mais como cartão de visitas?',
      consultiva:
        'Bom saber! Para você, o que seria um sinal de que o site está funcionando bem?',
      persuasiva:
        'Se o site está fazendo o que você precisa, ótimo — não faz sentido trocar por trocar. O que às vezes vale revisar são detalhes que não aparecem no dia a dia: velocidade no celular, segurança, certificado, informações desatualizadas. Se quiser, posso fazer uma checagem rápida e te dizer se está tudo em ordem.',
      ligacao:
        'Que bom, então não tem por que mexer. Você acompanha quantos contatos chegam por ele? Pergunto porque às vezes funciona bem e só precisa de pequenos ajustes.',
      reuniao:
        'Pergunte quais objetivos o site cumpre. Se ele não mede nada, mostre como medir (formulários, cliques no WhatsApp). Ofereça um plano de melhorias pequenas em vez de um site novo. Respeite se a resposta for "está bom assim".',
    },
    alternativas: [
      'Ótimo! Se um dia quiser uma revisão de segurança ou velocidade, me chama.',
      'Entendido! Posso te perguntar como você sabe que ele está funcionando — chegam contatos por ele?',
    ],
    perguntaEstrategica: 'Você sabe quantos clientes chegaram pelo site no último mês?',
    proximoPasso: 'Ofereça uma checagem técnica simples, ou encerre deixando contato para manutenção futura.',
    naoDizer: [
      '"Funcionar não é suficiente" — soa arrogante.',
      'Apontar falhas técnicas com jargão para assustar.',
      'Insistir num redesign que ele não pediu.',
    ],
    variacoes: {
      site: 'Ofereça melhorias incrementais em vez de um site novo.',
      loja: 'Pergunte sobre taxa de abandono de carrinho e facilidade de cadastro de produtos.',
      recorrente: 'Manutenção e segurança são o caminho natural quando o site já funciona.',
      sistema: 'Se o site funciona, o sistema pode ser um complemento interno, não uma substituição.',
    },
    relacionadas: ['ja-tenho-site', 'quem-vai-atualizar', 'nao-quero-mensalidade'],
  },
  {
    id: 'clientes-chegam-whatsapp',
    biblioteca: 'geral',
    frase: 'Meus clientes chegam pelo WhatsApp.',
    categoria: 'necessidade',
    gatilhos: [
      'tudo pelo whatsapp',
      'atendo pelo zap',
      'resolvo no whats',
      'meus clientes me chamam no whatsapp',
      'o zap resolve',
      'vendo pelo whatsapp',
    ],
    resistencia: 'media',
    etapas: ['primeiro-contato', 'respondeu', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['descobrir-necessidade', 'explicar-servico', 'reuniao'],
    significados: [
      'O WhatsApp é realmente o canal principal e funciona.',
      'Ele imagina que o site substituiria o WhatsApp.',
      'Não percebe o tempo gasto respondendo as mesmas perguntas.',
    ],
    estrategia:
      'Mostre que o site leva para o WhatsApp, não o substitui. Investigue o volume de perguntas repetidas e de quem chega sem contexto ("quanto custa?"). O argumento é qualificar e agilizar o atendimento que já existe.',
    descobrir: [
      'Quantas mensagens ele recebe por dia.',
      'Quais perguntas se repetem.',
      'Como as pessoas conseguem o número dele.',
    ],
    respostas: {
      curta:
        'Perfeito, e o WhatsApp continua sendo o centro do atendimento. A ideia do site é fazer o cliente chegar no seu WhatsApp já sabendo seus serviços e o que quer, em vez de começar com "quanto custa?". Hoje você responde muitas perguntas repetidas?',
      consultiva:
        'Ótimo! E como as pessoas chegam ao seu WhatsApp — indicação, Instagram, Google?',
      persuasiva:
        'O WhatsApp é ótimo para fechar, e o site não muda isso. O que ele faz é preparar o cliente antes: mostra serviços, fotos, perguntas frequentes e um botão que já abre o seu WhatsApp com a mensagem certa. Você ganha tempo e as conversas começam mais adiantadas.',
      ligacao:
        'Excelente, o WhatsApp é onde a venda acontece mesmo. Me conta: quantas mensagens por dia você recebe perguntando a mesma coisa, tipo preço, endereço, horário?',
      reuniao:
        'Peça para ele mostrar (sem dados pessoais) as perguntas mais comuns que recebe. Liste-as e mostre como cada uma seria respondida no site antes do contato. Demonstre o botão de WhatsApp com mensagem pré-preenchida por serviço.',
    },
    alternativas: [
      'Show! O site não substitui o WhatsApp, ele manda mais gente para lá — e já preparada. Você perde muito tempo explicando a mesma coisa?',
      'Faz sentido! Muitos dos meus clientes vendem 100% pelo WhatsApp. O site entra como vitrine que leva para a conversa. Quer ver um exemplo?',
    ],
    perguntaEstrategica: 'Quais são as três perguntas que você mais responde no WhatsApp toda semana?',
    proximoPasso: 'Mostre um exemplo de site com botões de WhatsApp por serviço e mensagens pré-preenchidas.',
    naoDizer: [
      '"WhatsApp não é profissional" — é o canal que ele domina.',
      '"Com site você não vai precisar mais responder" — falso e assustador.',
      '"Você deveria usar um chatbot" — muda de assunto sem diagnóstico.',
    ],
    variacoes: {
      site: 'Site com botões de WhatsApp por serviço e FAQ para reduzir perguntas repetidas.',
      landing: 'Landing page de campanha com botão de WhatsApp e mensagem identificando a origem do contato.',
      loja: 'Catálogo com pedido enviado pronto para o WhatsApp: o cliente monta o pedido e a loja só confirma.',
      sistema:
        'Se o volume é alto, o sistema pode organizar pedidos/agendamentos que chegam pelo WhatsApp. Integração oficial com a API do WhatsApp tem custos e regras próprias — explique antes.',
    },
    relacionadas: ['ja-tenho-instagram', 'nao-preciso-de-site', 'nao-preciso-google'],
  },
  {
    id: 'nao-preciso-google',
    biblioteca: 'geral',
    frase: 'Não preciso aparecer no Google.',
    categoria: 'necessidade',
    gatilhos: ['google não importa', 'ninguém me procura no google', 'não ligo pro google', 'meu cliente não pesquisa', 'não preciso de seo'],
    resistencia: 'media',
    etapas: ['respondeu', 'objecao'],
    servicos: ['site', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'O público dele realmente não pesquisa (venda por relacionamento, B2B fechado).',
      'Ele acha que "aparecer no Google" exige anúncio caro.',
      'Ele confunde SEO com promessa de primeira posição.',
    ],
    estrategia:
      'Diferencie "ser encontrado" de "estar em primeiro lugar". Muitas buscas são pelo nome da empresa — quem já ouviu falar e quer conferir. Pergunte como novos clientes validam a empresa antes de contratar.',
    descobrir: ['Se os clientes pesquisam o nome da empresa.', 'Se há concorrentes aparecendo no lugar dele.', 'Se o Perfil da Empresa no Google está atualizado.'],
    respostas: {
      curta:
        'Entendo. E não precisa mesmo estar em primeiro lugar em tudo. Só pergunto: quando alguém recebe sua indicação e pesquisa o nome da sua empresa, encontra as informações certas?',
      consultiva:
        'Faz sentido. Seus clientes costumam te conhecer como: indicação, passando na frente, redes sociais?',
      persuasiva:
        'Aparecer no Google não é só disputar primeira posição. Muitas pesquisas são de quem já ouviu falar de você e quer confirmar endereço, telefone, horário ou ver o trabalho. Ter essas informações corretas e organizadas evita que a pessoa desista ou chame um concorrente que aparece mais fácil.',
      ligacao:
        'Entendo. Posso te pedir uma coisa rápida? Pesquisa o nome da sua empresa no Google agora e me diz o que aparece. É só para a gente ver juntos se está tudo certo.',
      reuniao:
        'Pesquise junto com ele o nome da empresa e o serviço + cidade. Observe sem julgar. Se o resultado estiver bom, diga isso. Se estiver confuso ou desatualizado, mostre como corrigir — às vezes só o Perfil da Empresa no Google resolve, e você pode oferecer isso.',
    },
    alternativas: [
      'Tudo bem! Só vale garantir que, quando alguém procura pelo seu nome, encontra informações corretas. Já conferiu como aparece hoje?',
      'Entendido. Se seus clientes chegam só por indicação, faz sentido. Mesmo assim, quem recebe a indicação costuma pesquisar antes. Quer que eu veja como está aparecendo?',
    ],
    perguntaEstrategica: 'O que você acha que um cliente indicado faz antes de te ligar pela primeira vez?',
    proximoPasso: 'Ofereça uma verificação de como a empresa aparece hoje e, se fizer sentido, ajuste no Perfil da Empresa no Google + site simples.',
    naoDizer: [
      '"Quem não está no Google não existe" — exagero.',
      '"Eu coloco você em primeiro lugar" — promessa que ninguém pode cumprir.',
      'Usar termos técnicos de SEO sem explicar.',
    ],
    variacoes: {
      site: 'Site simples, bem estruturado, ajuda o nome da empresa a aparecer com informações corretas.',
      landing: 'Landing pages normalmente não são feitas para SEO; se ele não quer Google, a landing pode servir para anúncios e redes.',
      loja: 'Para lojas, busca por produto pode ser relevante; investigue antes.',
      recorrente: 'SEO recorrente só faz sentido se houver busca relevante. Sem isso, ofereça manutenção.',
    },
    relacionadas: ['ja-tenho-instagram', 'clientes-chegam-whatsapp', 'nao-sei-se-traz-clientes'],
  },
  {
    id: 'vou-pensar',
    biblioteca: 'geral',
    frase: 'Vou pensar e te aviso.',
    categoria: 'decisao',
    gatilhos: [
      'vou pensar',
      'deixa eu pensar',
      'depois te falo',
      'vou analisar',
      'vou ver com calma',
      'te dou um retorno',
      'qualquer coisa te chamo',
      'vou avaliar',
    ],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'indeciso', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'agendar-retorno', 'fechar'],
    significados: [
      'Ele realmente precisa de tempo para avaliar o investimento.',
      'Há uma dúvida que ele não verbalizou (preço, confiança, sócio).',
      'É uma forma educada de dizer não.',
      'Vai comparar com outros orçamentos.',
    ],
    estrategia:
      'Respeite o tempo dele e descubra o que precisa ser pensado. Pergunte, sem pressionar, se existe algum ponto específico que ficou em dúvida. Combine um retorno com data em vez de "qualquer coisa me chama".',
    descobrir: [
      'Qual é a principal dúvida.',
      'Se outra pessoa participa da decisão.',
      'Quando ele pretende decidir.',
    ],
    respostas: {
      curta:
        'Claro, decisão importante tem que ser pensada mesmo. Para eu te ajudar: ficou alguma dúvida sobre valor, prazo ou o que está incluso? Se quiser, combinamos de eu te chamar na [dia] para conversarmos.',
      consultiva:
        'Tranquilo! Só para eu entender: o que pesa mais na sua decisão agora — o investimento, o momento ou alguma parte do projeto?',
      persuasiva:
        'Super justo. Normalmente quem pensa com calma decide melhor. Para facilitar, posso te mandar um resumo com o que está incluso, o prazo e as condições, para você avaliar sem precisar reler toda a conversa. E se surgir qualquer dúvida enquanto pensa, pode me chamar.',
      ligacao:
        'Claro, faz todo sentido. Posso te perguntar só uma coisa para te ajudar a pensar: tem alguma parte que ainda não ficou clara? Às vezes é algo que eu consigo explicar agora em um minuto.',
      reuniao:
        'Antes de encerrar, faça um resumo do que foi conversado e pergunte, numa escala de 0 a 10, quanto o projeto faz sentido. Se a resposta for menor que 8, pergunte o que falta para chegar a 10. Combine data e canal para o retorno.',
    },
    alternativas: [
      'Sem pressa! Posso te chamar na [dia] para saber o que achou? Assim não fico te incomodando antes.',
      'Combinado. Se ajudar a pensar, me diz qual parte gera mais dúvida que eu explico melhor.',
    ],
    perguntaEstrategica: 'De 0 a 10, quanto essa proposta resolve o que você precisa? O que falta para ser 10?',
    proximoPasso: 'Envie um resumo objetivo da proposta e combine uma data concreta de retorno.',
    naoDizer: [
      '"A promoção acaba hoje" — urgência falsa destrói confiança.',
      '"Pensar em quê?" — soa desrespeitoso.',
      'Mandar mensagem no dia seguinte cobrando resposta sem ter combinado.',
    ],
    variacoes: {
      site: 'Ofereça um resumo de uma página com escopo, prazo e investimento.',
      landing: 'Se há uma campanha com data, lembre o prazo real (sem urgência falsa).',
      loja: 'Ofereça uma conversa sobre logística e custos recorrentes, que costumam ser a dúvida escondida.',
      sistema: 'Em sistemas, "vou pensar" muitas vezes esconde dúvida de escopo. Ofereça uma reunião de esclarecimento técnico.',
      recorrente: 'Ofereça começar com um mês de teste ou plano menor, se fizer sentido para você.',
    },
    relacionadas: ['falar-com-socio', 'manda-proposta-primeiro', 'vou-ver-e-te-falo'],
  },
];
