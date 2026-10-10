import type { Objection } from '../../types';

export const GERAL_2: Objection[] = [
  {
    id: 'manda-os-precos',
    biblioteca: 'geral',
    frase: 'Me manda os preços.',
    categoria: 'preco',
    gatilhos: [
      'quanto custa',
      'qual o valor',
      'me passa o preço',
      'quanto fica',
      'tabela de preços',
      'qual o investimento',
      'quanto você cobra',
      'valor de um site',
    ],
    resistencia: 'baixa',
    etapas: ['respondeu', 'interesse', 'perguntou-preco'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'explicar-servico', 'reuniao'],
    significados: [
      'Interesse real: ele quer saber se cabe no orçamento antes de gastar tempo.',
      'Está fazendo cotação com vários profissionais.',
      'Quer encerrar rápido a conversa — o preço será o motivo para dizer não.',
    ],
    estrategia:
      'Não esconda o preço — isso irrita. Dê uma faixa honesta e explique do que ela depende, pedindo duas ou três informações para chegar no valor exato. Preço sem contexto vira comparação só por número.',
    descobrir: [
      'O que ele precisa (páginas, funcionalidades, loja, agenda).',
      'Se já tem logo, textos e fotos.',
      'Para quando ele precisa.',
    ],
    respostas: {
      curta:
        'Claro! Para te passar um valor certo, preciso entender duas coisas rapidinho: você precisa de um site de apresentação ou também quer vender/agendar por ele? E já tem logo e fotos? Projetos desse tipo costumam ficar entre R$ [faixa], dependendo disso.',
      consultiva:
        'Te passo sim! O valor muda bastante conforme o que o site precisa fazer. O que você espera que ele resolva no seu negócio?',
      persuasiva:
        'Posso te passar uma faixa agora: sites como o que você descreveu ficam entre R$ [faixa]. O que define o valor é a quantidade de páginas, as funcionalidades e se eu também cuido de textos e fotos. Me responde três perguntas rápidas e eu te mando uma proposta com valor fechado e tudo o que está incluso, para você comparar com segurança.',
      ligacao:
        'Te passo sim, sem rodeio. Só preciso de duas informações para não te dar um número errado: o que você precisa que o site faça e se já tem o material, como logo e fotos. Tem um minuto agora?',
      reuniao:
        'Apresente faixas por tipo de projeto (Essencial, Profissional, Completo) logo no início, para tirar a ansiedade do preço. Depois faça as perguntas de diagnóstico e indique qual faixa se encaixa. Feche com prazo para envio da proposta formal.',
    },
    alternativas: [
      'Te passo! Um site de apresentação começa em R$ [valor]. Se precisar de agenda ou loja, muda. Me conta rapidinho o que você precisa?',
      'Claro! Para não te mandar um número genérico, me diz: quantos serviços você quer mostrar e se quer receber contatos ou pedidos pelo site?',
    ],
    perguntaEstrategica: 'O que precisa acontecer para você considerar que o site valeu o investimento?',
    proximoPasso: 'Envie uma faixa de valor imediatamente e, após as respostas, uma proposta com escopo e valor fechados.',
    naoDizer: [
      '"Depende" sem explicar do quê — soa como enrolação.',
      'Recusar-se a falar de preço até a reunião — gera desconfiança.',
      'Mandar só o número, sem dizer o que está incluso.',
    ],
    variacoes: {
      site: 'Faixa por número de páginas e se inclui textos, fotos e SEO básico.',
      landing: 'Faixa por página e integrações (formulário, CRM, pixel).',
      loja: 'Separe implantação de custos recorrentes (plataforma, taxas, frete).',
      sistema:
        'Não dê preço fechado sem levantamento. Informe uma faixa ampla e ofereça uma reunião de escopo — explique que o valor depende das funcionalidades.',
      recorrente: 'Informe o valor mensal e o que está incluso por mês.',
    },
    relacionadas: ['esta-muito-caro', 'manda-proposta-primeiro', 'sumiu-depois-do-preco'],
  },
  {
    id: 'manda-proposta-primeiro',
    biblioteca: 'geral',
    frase: 'Manda uma proposta primeiro.',
    categoria: 'decisao',
    gatilhos: [
      'me manda uma proposta',
      'manda por email',
      'manda um orçamento',
      'me envia o material',
      'manda o pdf',
      'manda tudo por escrito',
    ],
    resistencia: 'baixa',
    etapas: ['respondeu', 'interesse', 'perguntou-preco'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'reuniao', 'explicar-servico'],
    significados: [
      'Ele quer avaliar com calma e por escrito.',
      'Precisa mostrar para outra pessoa (sócio, cônjuge, financeiro).',
      'É uma forma de encerrar a conversa sem dizer não.',
    ],
    estrategia:
      'Proposta sem diagnóstico vira só um número. Concorde em enviar e peça poucas informações para que a proposta seja útil. Combine quando ele vai olhar e como será o retorno.',
    descobrir: ['Quem mais vai avaliar a proposta.', 'Quais critérios ele vai usar.', 'Quando pretende decidir.'],
    respostas: {
      curta:
        'Mando sim! Para a proposta já vir certinha, me responde três coisas rápidas: o que você quer que o site resolva, se já tem logo/fotos e para quando precisa. Aí te envio até [dia].',
      consultiva:
        'Claro! E quem mais vai participar dessa decisão com você? Pergunto para a proposta já responder as dúvidas dessa pessoa também.',
      persuasiva:
        'Envio, sim. Para não ser uma proposta genérica, que normalmente não ajuda ninguém a decidir, eu preciso entender um pouco melhor seu objetivo. Podemos fazer 15 minutos de chamada ou você me responde algumas perguntas por aqui — o que for melhor para você. Depois disso, a proposta chega com escopo, prazo e valor claros.',
      ligacao:
        'Mando, com certeza. Você teria 10 minutos agora para eu entender o que é importante para você? Assim a proposta já chega do jeito certo e você não perde tempo lendo coisa que não serve.',
      reuniao:
        'Se a proposta foi pedida em reunião, recapitule as necessidades ditas e confirme com ele. Pergunte quem mais vai ler e o que essa pessoa costuma questionar. Combine data de envio e data de conversa sobre a proposta.',
    },
    alternativas: [
      'Mando sim! Você prefere por e-mail ou aqui no WhatsApp? E me confirma o principal objetivo do site, para eu montar certinho.',
      'Combinado! Te mando até [dia]. Podemos marcar 10 minutos depois para eu tirar suas dúvidas sobre ela?',
    ],
    perguntaEstrategica: 'O que uma proposta precisa ter para você conseguir decidir com segurança?',
    proximoPasso: 'Envie a proposta no prazo combinado e marque uma conversa curta para apresentá-la.',
    naoDizer: [
      '"Só passo valor em reunião" — rígido demais.',
      'Enviar proposta genérica de 20 páginas sem diagnóstico.',
      'Enviar e desaparecer, esperando ele responder.',
    ],
    variacoes: {
      site: 'Proposta de uma a duas páginas: objetivo, páginas, prazo, valor, condições.',
      landing: 'Inclua integrações, prazo e o que você precisa dele (textos, oferta).',
      loja: 'Inclua custos recorrentes e responsabilidades (cadastro, fotos, logística).',
      sistema: 'Sem levantamento, envie uma proposta de diagnóstico/descoberta paga ou uma estimativa por faixas, deixando claro que o valor final depende do escopo.',
      recorrente: 'Proposta com tabela clara do que está incluso por mês.',
    },
    relacionadas: ['manda-os-precos', 'vou-pensar', 'falar-com-socio'],
  },
  {
    id: 'falar-com-socio',
    biblioteca: 'geral',
    frase: 'Preciso conversar com meu sócio.',
    categoria: 'decisao',
    gatilhos: [
      'vou falar com meu sócio',
      'preciso ver com minha esposa',
      'vou ver com meu marido',
      'tenho que consultar',
      'não decido sozinho',
      'vou levar para a diretoria',
      'preciso de aprovação',
    ],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'indeciso', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['reuniao', 'agendar-retorno', 'explicar-servico'],
    significados: [
      'A decisão é realmente compartilhada.',
      'Ele está interessado, mas precisa convencer alguém.',
      'Uma forma de ganhar tempo ou adiar sem dizer não.',
    ],
    estrategia:
      'Ajude-o a apresentar a proposta ao sócio. Pergunte o que o sócio costuma valorizar e quais dúvidas ele terá. Ofereça participar de uma conversa rápida com os dois.',
    descobrir: [
      'O papel do sócio na decisão (financeiro, operacional).',
      'O que o sócio vai questionar.',
      'Se ele próprio está convencido.',
    ],
    respostas: {
      curta:
        'Claro, decisão a dois é o certo. Quer que eu prepare um resumo curto para você mostrar a ele? Ou, se preferir, posso conversar rapidinho com vocês dois para tirar dúvidas.',
      consultiva:
        'Faz sentido! E você, pessoalmente, acha que o projeto faz sentido para a empresa? O que acha que seu sócio vai perguntar primeiro?',
      persuasiva:
        'Perfeito. Para facilitar, posso te mandar um resumo de uma página com o problema que o projeto resolve, o que está incluso, prazo e investimento. Assim ele vê o essencial sem precisar ler toda a conversa. E se ele tiver alguma dúvida técnica, posso responder diretamente, por chamada ou mensagem.',
      ligacao:
        'Claro, totalmente compreensível. Me conta: o que você acha que ele vai querer saber? Se for algo técnico ou de valores, posso participar de uma ligação rápida com vocês dois.',
      reuniao:
        'Antes de encerrar, pergunte: "Se dependesse só de você, faria?". Se sim, pergunte o que o sócio prioriza (custo, prazo, resultado) e prepare o resumo com esse foco. Proponha uma conversa de 15 minutos com os dois e marque a data na hora.',
    },
    alternativas: [
      'Combinado! Te mando um resumo para mostrar a ele. Quando vocês conversam? Posso te chamar no dia seguinte.',
      'Claro! Se ajudar, posso explicar diretamente para ele em 10 minutos. Qual horário costuma ser bom para vocês?',
    ],
    perguntaEstrategica: 'Se a decisão fosse só sua, você seguiria com o projeto?',
    proximoPasso: 'Envie um resumo de uma página e proponha uma conversa rápida com os dois decisores.',
    naoDizer: [
      '"Mas quem manda é você, né?" — constrange.',
      '"Seu sócio não vai entender" — desrespeita a outra pessoa.',
      'Pressionar para fechar antes da conversa entre eles.',
    ],
    variacoes: {
      site: 'Resumo focado em imagem da empresa e facilidade de contato.',
      landing: 'Resumo focado no impacto nas campanhas e no custo por contato.',
      loja: 'Resumo com custos recorrentes e responsabilidades operacionais, que costumam ser a preocupação do sócio.',
      sistema: 'Proponha apresentar o escopo para todos os decisores: sistemas costumam envolver o financeiro e o operacional.',
      recorrente: 'Mostre a tabela do que está incluso por mês e a possibilidade de cancelamento.',
    },
    relacionadas: ['vou-pensar', 'manda-proposta-primeiro', 'visualizou-nao-respondeu'],
  },
  {
    id: 'sem-tempo',
    biblioteca: 'geral',
    frase: 'Agora estou sem tempo.',
    categoria: 'prazo',
    gatilhos: [
      'estou sem tempo',
      'correria',
      'agora não posso',
      'muito ocupado',
      'estou atolado',
      'não tenho tempo pra isso',
      'tá corrido',
    ],
    resistencia: 'media',
    etapas: ['primeiro-contato', 'respondeu', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['agendar-retorno', 'explicar-servico'],
    significados: [
      'Falta de tempo real para conversar agora.',
      'Acha que o projeto vai exigir muito dele.',
      'Desinteresse educado.',
    ],
    estrategia:
      'Diferencie "sem tempo para conversar agora" de "sem tempo para participar do projeto". Respeite o momento, ofereça um horário futuro e explique quanto do tempo dele o projeto realmente exige.',
    descobrir: ['Se é falta de tempo para conversar ou para tocar o projeto.', 'Qual período é menos corrido.', 'Quem poderia ajudar com o material.'],
    respostas: {
      curta:
        'Imagino, a rotina é puxada! Não quero tomar seu tempo agora. Qual seria um dia melhor para eu te chamar? E já adianto: o projeto exige pouco de você — umas duas conversas curtas e o envio de fotos.',
      consultiva:
        'Entendo totalmente. Quando você diz sem tempo, é para conversar agora ou para acompanhar um projeto desses?',
      persuasiva:
        'Super entendo. É justamente pensando em quem não tem tempo que eu organizo o processo: uma conversa inicial de 20 minutos, você me manda o material que já tem, e eu cuido do resto. Você só aprova. Se quiser, te chamo numa semana mais tranquila.',
      ligacao:
        'Entendo, então não vou te prender. Qual o melhor dia e horário para eu te ligar de novo? Prometo ser rápido.',
      reuniao:
        'Se ele reclamar de tempo durante a reunião, mostre o cronograma com o que depende dele em cada etapa (em horas). Ofereça cuidar de textos e organização do material para reduzir o esforço dele.',
    },
    alternativas: [
      'Sem problema! Me fala um dia melhor que eu te procuro. Coisa de 10 minutos.',
      'Tranquilo! Posso te mandar um áudio de 1 minuto explicando a ideia, para você ouvir quando der?',
    ],
    perguntaEstrategica: 'Se o projeto exigisse só uma hora do seu tempo no total, ainda seria um problema?',
    proximoPasso: 'Combine um dia e horário específicos para retomar, ou ofereça material curto para consumo assíncrono.',
    naoDizer: [
      '"É rapidinho" e depois falar por 10 minutos.',
      '"Quem não tem tempo para crescer..." — julgamento.',
      'Ligar de novo no mesmo dia.',
    ],
    variacoes: {
      site: 'Mostre que você pode cuidar dos textos e da organização do conteúdo.',
      landing: 'Destaque que landing page é rápida de produzir quando a oferta está definida.',
      loja: 'Seja honesto: loja exige tempo de cadastro de produtos. Ofereça fazer os primeiros cadastros.',
      sistema: 'Sistema exige participação no levantamento e nos testes. Planeje as etapas no período menos corrido dele.',
    },
    relacionadas: ['proximo-mes', 'vou-pensar', 'todas-funcionalidades-ja'],
  },
  {
    id: 'proximo-mes',
    biblioteca: 'geral',
    frase: 'Talvez no próximo mês.',
    categoria: 'prazo',
    gatilhos: [
      'mês que vem',
      'mais pra frente',
      'depois do carnaval',
      'ano que vem',
      'depois das férias',
      'no próximo semestre',
      'quando melhorar',
      'agora não é o momento',
    ],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'indeciso', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['agendar-retorno', 'descobrir-necessidade', 'negociar-escopo'],
    significados: [
      'Existe uma razão concreta (caixa, sazonalidade, mudança).',
      'O projeto não é prioridade.',
      'Uma forma educada de adiar indefinidamente.',
    ],
    estrategia:
      'Descubra o que muda no próximo mês. Se houver motivo concreto, agende o retorno com data. Se não houver, investigue se é prioridade. Se fizer sentido, mostre o prazo de produção para que a data desejada seja realista.',
    descobrir: ['O que muda no próximo mês.', 'Se há uma data em que o site precisa estar no ar.', 'O que ele perde (ou não) esperando.'],
    respostas: {
      curta:
        'Combinado! Só para eu me organizar: o que muda no próximo mês? Pergunto porque, se você quer o site no ar em uma data específica, a gente precisa começar um pouco antes.',
      consultiva:
        'Tranquilo. Tem alguma data importante para o seu negócio em que seria bom já ter o site funcionando?',
      persuasiva:
        'Faz sentido esperar se o momento é melhor. Só te passo uma informação para ajudar no planejamento: o projeto leva cerca de [prazo] do início até ficar no ar. Se a ideia é estar pronto para [data/temporada], o ideal seria começar até [data]. Se for mais tranquilo, podemos reservar a data de início agora e você só confirma lá.',
      ligacao:
        'Sem problema nenhum. Posso já anotar para te ligar no dia [data]? E tem alguma coisa que você gostaria de ver até lá, para decidir com mais segurança?',
      reuniao:
        'Pergunte sobre o calendário do negócio (alta temporada, datas comerciais). Faça a conta de trás para frente: data desejada menos prazo de produção. Apresente a data real de início. Ofereça reservar a agenda sem compromisso de pagamento.',
    },
    alternativas: [
      'Combinado! Te chamo no dia [data] então. Se mudar alguma coisa antes, me avisa.',
      'Fechado. Se ajudar, já deixo a proposta reservada com as mesmas condições até [data].',
    ],
    perguntaEstrategica: 'O que precisa acontecer até o próximo mês para esse projeto virar prioridade?',
    proximoPasso: 'Registre a data combinada e envie um lembrete curto e útil próximo a ela.',
    naoDizer: [
      '"Os preços vão aumentar mês que vem" — só se for verdade e comunicado com antecedência.',
      '"Cada mês sem site é dinheiro perdido" — promessa sem base.',
      'Retornar antes da data combinada cobrando decisão.',
    ],
    variacoes: {
      site: 'Mostre o prazo de produção e as datas comerciais do nicho.',
      landing: 'Se há campanha marcada, a data da campanha define o início.',
      loja: 'Datas comerciais (Dia das Mães, Black Friday, Natal) exigem antecedência; mencione apenas se forem relevantes para ele.',
      sistema: 'Proponha começar o levantamento de requisitos agora e o desenvolvimento depois, se fizer sentido.',
      recorrente: 'Pergunte se ele prefere começar com um plano menor desde já.',
    },
    relacionadas: ['sem-tempo', 'sem-dinheiro-agora', 'vou-pensar'],
  },
  {
    id: 'nao-sei-se-traz-clientes',
    biblioteca: 'geral',
    frase: 'Não sei se isso vai trazer clientes.',
    categoria: 'resultados',
    gatilhos: [
      'será que funciona',
      'não sei se dá resultado',
      'vai trazer cliente',
      'site vende',
      'tenho dúvida se vale',
      'não sei se compensa',
    ],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao', 'indeciso'],
    servicos: ['site', 'landing', 'loja', 'recorrente'],
    objetivos: ['explicar-servico', 'descobrir-necessidade', 'defender-valor'],
    significados: [
      'Dúvida legítima: ele quer retorno e não tem como prever.',
      'Já investiu em algo digital que não trouxe resultado.',
      'Espera que o site, sozinho, gere vendas.',
    ],
    estrategia:
      'Seja honesto: o site não traz clientes sozinho. Explique o papel dele no processo (ser encontrado, gerar confiança, facilitar o contato) e o que mais é necessário (divulgação, atendimento). Combine como medir.',
    descobrir: ['Como ele mede resultado hoje.', 'Se pretende divulgar o site.', 'Qual experiência anterior gerou essa dúvida.'],
    respostas: {
      curta:
        'É uma dúvida justa, e vou ser sincero: o site sozinho não traz cliente. Ele ajuda quem já se interessou a confiar e entrar em contato com mais facilidade. Hoje, como as pessoas costumam chegar até você?',
      consultiva:
        'Faz sentido. Para você, o que seria um bom resultado nos primeiros meses com o site?',
      persuasiva:
        'Ninguém sério pode garantir quantos clientes um site vai trazer. O que dá para fazer é construir o site para cumprir um papel claro — ser encontrado por quem procura, mostrar seu trabalho e facilitar o contato — e medir: quantas pessoas clicaram no WhatsApp, quantos formulários chegaram. Assim você acompanha com números e decide o que ajustar.',
      ligacao:
        'Que bom que você perguntou isso, porque prefiro ser honesto: site não é mágica. Ele funciona junto com o que você já faz. Posso te explicar em dois minutos como ele ajudaria no seu caso e como a gente mediria?',
      reuniao:
        'Desenhe o caminho do cliente: onde ele descobre a empresa, onde confere, onde entra em contato, onde fecha. Mostre em qual etapa o site atua. Combine dois ou três indicadores simples e como acompanhá-los após o lançamento.',
    },
    alternativas: [
      'Ótima pergunta. O site ajuda, mas não faz milagre — funciona junto com divulgação e bom atendimento. Quer que eu te explique como dá para acompanhar os resultados?',
      'Entendo a dúvida. Se você já tem clientes chegando por indicação ou redes, o site ajuda a converter melhor essas pessoas. Onde você sente que perde mais clientes hoje?',
    ],
    perguntaEstrategica: 'Em que momento do contato você sente que perde mais clientes hoje?',
    proximoPasso: 'Defina com ele indicadores simples (cliques no WhatsApp, formulários) e mostre como serão acompanhados.',
    naoDizer: [
      '"Vai dobrar suas vendas" — promessa que você não controla.',
      '"Todo mundo que fez comigo vendeu mais" — generalização sem prova.',
      '"Se não der resultado é porque você não divulgou" — transfere culpa antecipadamente.',
    ],
    variacoes: {
      site: 'O site atua na confiança e no contato; o volume depende de divulgação e busca.',
      landing: 'Landing page é mais mensurável: dá para acompanhar o custo por contato junto com os anúncios.',
      loja: 'Loja precisa de tráfego, catálogo e logística. Seja claro sobre o investimento em divulgação.',
      sistema: 'Sistema não traz clientes; ele economiza tempo e reduz erros. Reposicione o argumento para eficiência.',
      recorrente: 'Em SEO e manutenção, mostre relatórios mensais como forma de acompanhar resultados.',
    },
    relacionadas: ['recuperar-investimento', 'garantia-resultados', 'pagar-quando-vender'],
  },
  {
    id: 'recuperar-investimento',
    biblioteca: 'geral',
    frase: 'Como vou recuperar o investimento?',
    categoria: 'resultados',
    gatilhos: ['retorno do investimento', 'roi', 'em quanto tempo se paga', 'vale o investimento', 'como eu ganho com isso', 'quanto vou ganhar'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['defender-valor', 'descobrir-necessidade'],
    significados: [
      'Pensamento de empresário: quer comparar custo e benefício.',
      'Orçamento apertado: precisa justificar cada real.',
      'Insegurança sobre resultado.',
    ],
    estrategia:
      'Faça a conta com os números dele, não com promessas. Pergunte o ticket médio e quantos clientes novos pagariam o projeto. Para sistemas, calcule horas economizadas. Deixe claro que é uma estimativa, não uma garantia.',
    descobrir: ['Ticket médio e margem.', 'Quanto vale um cliente ao longo do tempo.', 'Quanto tempo a equipe gasta com tarefas manuais (para sistemas).'],
    respostas: {
      curta:
        'Ótima pergunta. Vamos fazer uma conta simples: quanto vale um cliente novo para você, em média? Com isso dá para ver quantos clientes pagariam o projeto — sem promessa, só para você ter a referência.',
      consultiva:
        'Faz todo sentido pensar assim. Qual é o valor médio de um serviço seu e quantas vezes um cliente costuma voltar?',
      persuasiva:
        'Não dá para prometer retorno, mas dá para colocar em perspectiva. Se um cliente novo deixa em média R$ [ticket] e volta algumas vezes por ano, o projeto se paga com [N] clientes que não chegariam de outra forma ou que fechariam com mais facilidade. É uma referência para decidir com números, não uma garantia.',
      ligacao:
        'Boa pergunta, e prefiro responder com números seus do que com promessa minha. Quanto vale um cliente novo para você? Faço a conta com você agora.',
      reuniao:
        'Monte a conta junto, num papel ou planilha: ticket médio × recorrência = valor do cliente. Investimento ÷ valor do cliente = clientes necessários. Para sistemas: horas economizadas × custo da hora. Deixe explícito que são hipóteses e combine como medir depois.',
    },
    alternativas: [
      'Vamos fazer essa conta juntos? Me fala o valor médio de um cliente que eu te mostro quantos clientes cobrem o investimento.',
      'Pergunta certa! Não prometo retorno, mas te ajudo a calcular o ponto de equilíbrio com os seus números.',
    ],
    perguntaEstrategica: 'Quanto vale para você um cliente novo ao longo de um ano?',
    proximoPasso: 'Envie a conta de ponto de equilíbrio por escrito, com as premissas usadas.',
    naoDizer: [
      '"Se paga no primeiro mês" — sem base.',
      'Inventar números de mercado ou estatísticas.',
      '"É investimento, não custo" — clichê sem conta.',
    ],
    variacoes: {
      site: 'Ponto de equilíbrio em número de clientes novos ou recorrentes.',
      landing: 'Use custo por contato e taxa de fechamento atuais dele.',
      loja: 'Considere margem, não faturamento: taxas, frete e custos da plataforma reduzem o ganho por venda.',
      sistema: 'Use horas economizadas, erros evitados e capacidade de atender mais sem contratar.',
      recorrente: 'Compare com o custo de resolver problemas emergenciais sem plano.',
    },
    relacionadas: ['nao-sei-se-traz-clientes', 'garantia-resultados', 'esta-muito-caro'],
  },
  {
    id: 'nao-quero-mensalidade',
    biblioteca: 'geral',
    frase: 'Não quero pagar mensalidade.',
    categoria: 'pagamento',
    gatilhos: [
      'sem mensalidade',
      'não quero pagar todo mês',
      'pagamento único',
      'não quero custo fixo',
      'mensalidade não',
      'quero pagar uma vez só',
    ],
    resistencia: 'media',
    etapas: ['perguntou-preco', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'recorrente'],
    objetivos: ['explicar-servico', 'negociar-escopo', 'defender-valor'],
    significados: [
      'Já tem muitos custos fixos e quer evitar mais um.',
      'Não entende por que um site teria custo depois de pronto.',
      'Teve experiência ruim com mensalidade sem entrega clara.',
    ],
    estrategia:
      'Separe o que é custo inevitável (domínio, hospedagem) do que é serviço opcional (manutenção, alterações). Ofereça alternativas: pagamento único com hospedagem anual, ou contratação por demanda. Transparência sobre o que acontece se ele não pagar nada depois.',
    descobrir: ['O que ele imagina que a mensalidade cobre.', 'Com que frequência ele altera informações.', 'Se prefere pagar anual ou por demanda.'],
    respostas: {
      curta:
        'Entendo, ninguém gosta de mais um custo fixo. Te explico o que é obrigatório e o que é opcional: domínio e hospedagem têm custo anual pequeno (e ficam no seu nome); manutenção é opcional — você pode chamar só quando precisar. Quer que eu te mostre as duas opções?',
      consultiva:
        'Faz sentido. Você costuma mudar informações com frequência, como preços, fotos ou serviços?',
      persuasiva:
        'Dá para fazer sem mensalidade comigo. O que não tem como evitar é o custo do domínio e da hospedagem, que é de qualquer site, e pode ser pago anualmente direto no seu nome. Se em algum momento você precisar de alteração ou suporte, cobro por demanda. A mensalidade só faz sentido para quem quer alguém cuidando continuamente — e aí ela tem entregas claras.',
      ligacao:
        'Entendo perfeitamente. Deixa eu te explicar o que é obrigatório e o que é opcional, porque muita gente acha que é tudo uma coisa só. Tem dois minutinhos?',
      reuniao:
        'Mostre uma tabela com três colunas: custos obrigatórios (domínio, hospedagem), serviços opcionais (manutenção, alterações) e quem paga para quem. Ofereça o modelo "pagamento único + por demanda" e o modelo "plano mensal", com os valores reais de cada um em 12 meses.',
    },
    alternativas: [
      'Tranquilo! Dá para fazer com pagamento único e você só paga hospedagem e domínio por ano. Alterações eu cobro avulso, quando você precisar.',
      'Sem problema. A manutenção mensal é opcional. Quer ver quanto ficaria no ano em cada modelo para comparar?',
    ],
    perguntaEstrategica: 'Quantas vezes por ano você imagina que vai precisar mudar algo no site?',
    proximoPasso: 'Envie uma comparação simples de 12 meses entre pagamento único + avulso e plano mensal.',
    naoDizer: [
      '"Todo site precisa de mensalidade" — não é verdade em todos os casos.',
      'Esconder custos de domínio e hospedagem para parecer mais barato.',
      '"Se não pagar, o site sai do ar" — sem explicar por quê, soa como ameaça.',
    ],
    variacoes: {
      site: 'Site estático simples pode ter custo recorrente mínimo; explique as opções de hospedagem.',
      landing: 'Para campanhas temporárias, ofereça hospedagem pelo período da campanha.',
      loja: 'Lojas têm custos recorrentes inevitáveis (plataforma, gateway). Mostre todos com transparência.',
      sistema: 'Sistemas sempre têm custo de servidor e banco de dados. Explique que o valor vai para infraestrutura, não para o desenvolvedor.',
      recorrente: 'Quando o serviço é recorrente por natureza (SEO, monitoramento), mostre o que é entregue a cada mês.',
    },
    relacionadas: ['nao-quero-hospedagem', 'quem-vai-atualizar', 'nao-quero-depender'],
  },
  {
    id: 'nao-quero-depender',
    biblioteca: 'geral',
    frase: 'Não quero depender de desenvolvedor.',
    categoria: 'manutencao',
    gatilhos: [
      'quero autonomia',
      'quero mexer sozinho',
      'não quero ficar preso',
      'quero editar eu mesmo',
      'não quero pedir para alguém toda vez',
      'quero independência',
    ],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'loja', 'sistema', 'recorrente'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Já ficou "refém" de alguém que sumiu ou demorava.',
      'Quer atualizar coisas simples sem custo.',
      'Desconfia de profissionais em geral.',
    ],
    estrategia:
      'Valide a preocupação — ela é legítima. Explique o que ele vai conseguir fazer sozinho (painel, treinamento) e o que é seu dele por direito (domínio, acessos, código quando aplicável). Autonomia é um argumento de venda, não uma ameaça.',
    descobrir: ['Experiência anterior com desenvolvedor.', 'O que ele quer editar sozinho.', 'Se ele tem tempo e disposição para editar.'],
    respostas: {
      curta:
        'Concordo com você, ninguém deveria ficar preso. Por isso o domínio fica no seu nome, você recebe todos os acessos e eu deixo um painel para você editar textos, fotos e preços sozinho, com um treinamento rápido. Já passou por alguma situação ruim com isso?',
      consultiva:
        'Entendo. O que você gostaria de conseguir mudar sozinho no dia a dia?',
      persuasiva:
        'Essa preocupação é muito válida — já vi muita empresa sem acesso ao próprio domínio. Na minha forma de trabalhar, tudo que é seu fica no seu nome: domínio, hospedagem e acessos. O site tem painel para as alterações do dia a dia e você recebe um treinamento gravado. Eu fico disponível para o que for técnico, mas a decisão de me chamar é sempre sua.',
      ligacao:
        'Faz todo sentido, e eu prefiro cliente que exige isso. Deixa eu te explicar o que fica com você e o que você consegue fazer sozinho depois que o site estiver pronto.',
      reuniao:
        'Faça uma demonstração do painel ao vivo: peça para ele mesmo trocar um texto ou uma foto. Mostre a lista de acessos que ele receberá na entrega. Inclua essa lista no contrato.',
    },
    alternativas: [
      'Justo! Você vai ter acesso a tudo e um painel para editar o básico. Quer ver como funciona?',
      'Concordo totalmente. Inclusive coloco no contrato que domínio e acessos ficam no seu nome.',
    ],
    perguntaEstrategica: 'Você já teve dificuldade para conseguir acesso a algo que era da sua empresa?',
    proximoPasso: 'Demonstre o painel de edição e envie a lista de acessos que serão entregues.',
    naoDizer: [
      '"Você não vai conseguir mexer sozinho" — desqualifica.',
      '"Se mexer, quebra" — gera medo.',
      'Manter domínio ou acessos no seu nome como forma de garantir o cliente.',
    ],
    variacoes: {
      site: 'Painel de edição de conteúdo + treinamento + acessos no nome do cliente.',
      loja: 'Painel de produtos, estoque e pedidos; treinamento para quem vai operar.',
      sistema: 'Documentação, propriedade do código definida em contrato e acesso ao repositório e ao banco de dados.',
      recorrente: 'Planos sem fidelidade longa e com entrega de acessos ao final.',
    },
    relacionadas: ['quem-vai-atualizar', 'e-se-precisar-mudar', 'nao-quero-mensalidade'],
  },
  {
    id: 'quem-vai-atualizar',
    biblioteca: 'geral',
    frase: 'Quem vai atualizar meu site?',
    categoria: 'manutencao',
    gatilhos: ['quem atualiza', 'como faço pra atualizar', 'vou ter que pagar para atualizar', 'quem mexe no site depois', 'e depois de pronto'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['site', 'landing', 'loja', 'recorrente'],
    objetivos: ['explicar-servico'],
    significados: [
      'Dúvida prática sobre o pós-entrega.',
      'Medo de ter um site desatualizado.',
      'Quer saber se haverá custo adicional.',
    ],
    estrategia:
      'Responda com clareza as duas opções: ele atualiza (com painel e treinamento) ou você atualiza (plano ou avulso). Diga quanto custa cada uma.',
    descobrir: ['O que vai mudar com frequência.', 'Quem na empresa poderia atualizar.', 'Preferência por autonomia ou por delegar.'],
    respostas: {
      curta:
        'Boa pergunta! Você tem duas opções: atualizar sozinho pelo painel (eu te ensino, é simples) ou me mandar pelo WhatsApp e eu atualizo — por plano mensal ou avulso. O que você imagina que vai mudar com mais frequência?',
      consultiva:
        'Ótimo pensar nisso antes. Na sua equipe, tem alguém que cuida das redes sociais e poderia cuidar do site também?',
      persuasiva:
        'O site é entregue com painel de edição e um treinamento gravado, então textos, fotos e preços você consegue mudar sozinho em minutos. Para mudanças maiores, como uma página nova, você pode contratar avulso ou ter um plano mensal. Assim você nunca fica com informação desatualizada nem dependente de alguém.',
      ligacao:
        'Ótima pergunta. Você pode atualizar sozinho, porque eu deixo tudo preparado e te ensino, ou pode deixar comigo. Você prefere ter autonomia ou delegar?',
      reuniao:
        'Mostre o painel. Liste com ele o que muda com frequência e classifique: ele faz sozinho / você faz. Apresente os valores de alteração avulsa e do plano.',
    },
    alternativas: [
      'Você mesmo, se quiser — o site vem com painel e treinamento. Ou eu, se preferir delegar. Te passo os valores das duas formas.',
      'Pode ficar com você ou comigo. O mais comum é o cliente mudar o básico e me chamar para o resto.',
    ],
    perguntaEstrategica: 'O que no seu negócio muda toda semana ou todo mês?',
    proximoPasso: 'Inclua na proposta as duas opções de atualização com valores claros.',
    naoDizer: ['"Isso a gente vê depois" — gera insegurança.', 'Prometer alterações ilimitadas gratuitas.', 'Dizer que é fácil sem demonstrar.'],
    variacoes: {
      site: 'Painel de conteúdo + treinamento.',
      landing: 'Landing pages costumam mudar por campanha; combine um pacote de ajustes por campanha.',
      loja: 'Cadastro de produtos é rotina: treinamento é obrigatório, e o cliente precisa ter alguém responsável.',
      recorrente: 'Detalhe a quantidade de alterações por mês incluídas no plano.',
    },
    relacionadas: ['nao-quero-depender', 'e-se-precisar-mudar', 'nao-quero-mensalidade'],
  },
  {
    id: 'e-se-precisar-mudar',
    biblioteca: 'geral',
    frase: 'E se eu precisar mudar alguma coisa?',
    categoria: 'manutencao',
    gatilhos: ['e se eu quiser alterar', 'posso mudar depois', 'alterações estão inclusas', 'quantas revisões', 'se eu não gostar'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['explicar-servico', 'fechar'],
    significados: [
      'Medo de não gostar do resultado.',
      'Quer saber se alterações custam extra.',
      'Sinal de interesse: já está imaginando o uso.',
    ],
    estrategia:
      'É um sinal de compra. Explique como funcionam as rodadas de ajuste durante o projeto e as alterações depois da entrega. Deixe claro o que está incluso e o que é cobrado.',
    descobrir: ['Se a preocupação é com o resultado visual ou com mudanças futuras.', 'Experiência anterior com revisões.'],
    respostas: {
      curta:
        'Pode mudar, sim! Durante o projeto você tem [N] rodadas de ajustes inclusas antes de publicar. Depois de pronto, o que for texto, foto e preço você muda sozinho pelo painel, e alterações maiores eu orço à parte. Quer que eu coloque isso por escrito na proposta?',
      consultiva:
        'Claro! Você está pensando mais em ajustes durante a criação ou em mudanças no futuro, quando o negócio mudar?',
      persuasiva:
        'O processo é feito para você não ser surpreendido: antes de desenvolver, você aprova a estrutura e o visual. Depois, tem rodadas de ajuste inclusas. Após a entrega, você tem autonomia para o dia a dia e, se o negócio mudar, o site cresce junto — com novas páginas ou funções orçadas de forma transparente.',
      ligacao:
        'Pode sim, e é ótimo que você pense nisso. Deixa eu te explicar como funcionam as aprovações e os ajustes, para você saber exatamente o que está incluso.',
      reuniao:
        'Mostre o fluxo do projeto com os pontos de aprovação. Explique a diferença entre ajuste (incluso) e mudança de escopo (orçada). Pergunte se ele quer que isso conste em contrato — normalmente sim.',
    },
    alternativas: [
      'Pode sim! Tem ajustes inclusos antes de publicar e, depois, painel para você mudar o básico.',
      'Com certeza. Eu te mostro cada etapa antes de seguir, então dificilmente algo sai diferente do combinado.',
    ],
    perguntaEstrategica: 'O que te deixaria seguro de que o resultado vai ficar do seu jeito?',
    proximoPasso: 'Formalize na proposta o número de rodadas de ajuste e a política de alterações pós-entrega.',
    naoDizer: [
      '"Pode mudar quantas vezes quiser" — gera projetos sem fim.',
      '"Depois de pronto, toda mudança é cobrada" — sem explicar o que ele pode fazer sozinho.',
      'Responder de forma vaga.',
    ],
    variacoes: {
      site: 'Rodadas de ajuste de layout e conteúdo + painel.',
      landing: 'Inclua ajustes durante a campanha, se for o caso.',
      loja: 'Explique o que o painel permite (produtos, banners) e o que exige desenvolvimento.',
      sistema:
        'Mudanças em sistema afetam outras partes. Explique o processo de solicitação de mudança, estimativa e aprovação antes de executar.',
    },
    relacionadas: ['quem-vai-atualizar', 'nao-quero-depender', 'medo-nao-entregar'],
  },
  {
    id: 'medo-nao-entregar',
    biblioteca: 'geral',
    frase: 'Tenho medo de pagar e você não entregar.',
    categoria: 'confianca',
    gatilhos: [
      'e se você sumir',
      'como sei que vai entregar',
      'medo de golpe',
      'já levei calote',
      'como confiar',
      'e se não ficar pronto',
      'como sei que você vai entregar',
    ],
    resistencia: 'alta',
    etapas: ['recebeu-proposta', 'objecao', 'indeciso'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['defender-valor', 'explicar-servico', 'fechar'],
    significados: [
      'Já foi enganado ou conhece alguém que foi.',
      'Ele não conhece você e não tem como verificar.',
      'O valor é alto para ele, e o risco percebido também.',
    ],
    estrategia:
      'Não leve para o lado pessoal. Reduza o risco de forma concreta: contrato, pagamento em etapas vinculado a entregas, CNPJ, portfólio verificável, contatos de clientes, acompanhamento do andamento.',
    descobrir: ['Se já passou por isso.', 'Que tipo de garantia o deixaria seguro.', 'Se prefere pagamento por etapas.'],
    respostas: {
      curta:
        'Sua preocupação é totalmente válida — infelizmente acontece. Por isso trabalho com contrato e pagamento dividido por etapas: você paga uma parte para começar e o restante conforme aprova as entregas. Também posso te passar o contato de clientes para você conversar. Ajudaria?',
      consultiva:
        'Entendo, e acho certo você se proteger. Você já passou por alguma situação assim? O que te deixaria mais seguro?',
      persuasiva:
        'Faz todo sentido ter esse cuidado. Para reduzir o seu risco: (1) contrato com escopo, prazos e valores; (2) pagamento por etapas, cada uma liberada após você aprovar a entrega; (3) acompanhamento do andamento com prévias; (4) portfólio com sites no ar que você pode visitar e clientes que você pode contatar. Assim você nunca paga por algo que não viu.',
      ligacao:
        'Entendo completamente, e prefiro que você pergunte. Deixa eu te explicar como eu trabalho para você nunca pagar por algo que não viu.',
      reuniao:
        'Apresente o contrato modelo e o cronograma de pagamentos vinculados às entregas. Mostre projetos no ar e ofereça referências. Mostre seus dados (CNPJ, endereço, redes). Pergunte que outra garantia o deixaria tranquilo.',
    },
    alternativas: [
      'Justo! Trabalho com contrato e pagamento por etapas, você só paga a próxima parte depois de aprovar a anterior.',
      'Entendo totalmente. Quer conversar com algum cliente meu antes de decidir? Posso pedir autorização e te passar o contato.',
    ],
    perguntaEstrategica: 'O que precisaria estar no contrato para você se sentir seguro?',
    proximoPasso: 'Envie contrato modelo, cronograma de pagamento por etapas e referências verificáveis.',
    naoDizer: [
      '"Pode confiar em mim" — palavras não reduzem risco.',
      '"Você está me chamando de golpista?" — defensividade.',
      'Exigir 100% adiantado para clientes novos.',
    ],
    variacoes: {
      site: 'Pagamento em 2 ou 3 etapas: início, aprovação do layout, publicação.',
      landing: 'Prazo curto permite pagamento 50/50 com entrega rápida de prévia.',
      loja: 'Etapas por marco: layout, catálogo cadastrado, pagamentos testados, publicação.',
      sistema: 'Divida por módulos ou sprints, com entregas utilizáveis e homologação pelo cliente antes de cada pagamento.',
      recorrente: 'Plano mensal sem fidelidade longa e relatório do que foi feito a cada mês.',
    },
    relacionadas: ['ja-contratei-nao-deu-certo', 'tem-portfolio', 'nao-quero-contrato'],
  },
];
