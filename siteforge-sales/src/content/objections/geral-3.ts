import type { Objection } from '../../types';

export const GERAL_3: Objection[] = [
  {
    id: 'ja-contratei-nao-deu-certo',
    biblioteca: 'geral',
    frase: 'Já contratei alguém e não deu certo.',
    categoria: 'confianca',
    gatilhos: [
      'já fui enganado',
      'tive experiência ruim',
      'o último sumiu',
      'paguei e não entregaram',
      'já fizeram site para mim e ficou ruim',
      'agência me decepcionou',
    ],
    resistencia: 'alta',
    etapas: ['respondeu', 'interesse', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'Experiência real e dolorosa: dinheiro perdido, projeto abandonado ou mal feito.',
      'Ele quer evitar repetir o erro e precisa entender o que deu errado.',
      'Pode haver um site parado que precisa ser recuperado.',
    ],
    estrategia:
      'Escute antes de oferecer qualquer coisa. Pergunte o que aconteceu, o que faltou e o que ele faria diferente. Use as respostas para mostrar, concretamente, como seu processo evita aquele problema — sem falar mal do profissional anterior.',
    descobrir: [
      'O que exatamente deu errado (prazo, qualidade, comunicação, sumiço).',
      'Se ele tem acesso ao que foi feito (domínio, hospedagem).',
      'O que ele espera de diferente agora.',
    ],
    respostas: {
      curta:
        'Sinto muito que isso tenha acontecido, é frustrante mesmo. Se você puder me contar o que deu errado, consigo te explicar como trabalho para que isso não se repita — e, se for o caso, ver se dá para aproveitar algo do que já foi feito.',
      consultiva:
        'Que chato. O que mais te incomodou naquela experiência: prazo, resultado, comunicação ou suporte depois?',
      persuasiva:
        'Entendo a desconfiança, e ela é justa. Pelo que você me contou, o problema foi [problema]. Na minha forma de trabalhar, isso é tratado assim: [contrato com prazos / prévias semanais / pagamento por etapas / acessos no seu nome]. Não peço que você confie de olhos fechados — o processo foi pensado para você acompanhar cada passo.',
      ligacao:
        'Poxa, sinto muito. Se você não se importar, me conta o que aconteceu? Não para falar mal de ninguém, mas para eu entender o que é importante para você agora.',
      reuniao:
        'Dedique os primeiros minutos a ouvir. Anote os problemas citados. Para cada um, mostre o mecanismo concreto do seu processo que o previne. Verifique se ele tem acesso ao domínio e à hospedagem anteriores — ajudar a recuperar isso gera confiança.',
    },
    alternativas: [
      'Infelizmente isso é mais comum do que deveria. O que mais te frustrou? Quero entender para fazer diferente.',
      'Entendo totalmente sua cautela. Posso te mostrar como acompanho o projeto passo a passo, para você nunca ficar no escuro?',
    ],
    perguntaEstrategica: 'Se você pudesse voltar no tempo, o que teria exigido naquele primeiro contrato?',
    proximoPasso: 'Proponha um processo com etapas visíveis e, se possível, ajude a recuperar acessos do projeto anterior.',
    naoDizer: [
      '"Esse pessoal é tudo amador" — falar mal do anterior não te torna melhor.',
      '"Comigo não acontece" — promessa vazia.',
      'Passar rápido pelo assunto para falar de preço.',
    ],
    variacoes: {
      site: 'Verifique domínio e hospedagem antigos; recuperar acessos pode ser o primeiro serviço.',
      landing: 'Mostre prévias rápidas e testes de integração antes de publicar.',
      loja: 'Mostre o processo de testes de pagamento e frete antes de abrir a loja.',
      sistema: 'Proponha entregas por módulos, com homologação do cliente, código em repositório acessível a ele e documentação.',
      recorrente: 'Relatório mensal de atividades e plano sem fidelidade longa.',
    },
    relacionadas: ['medo-nao-entregar', 'tem-portfolio', 'nao-quero-depender'],
  },
  {
    id: 'tem-portfolio',
    biblioteca: 'geral',
    frase: 'Você tem portfólio?',
    categoria: 'confianca',
    gatilhos: ['tem trabalhos', 'me mostra sites que você fez', 'tem exemplos', 'cadê seus trabalhos', 'já fez para alguém do meu ramo', 'referências'],
    resistencia: 'baixa',
    etapas: ['respondeu', 'interesse'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['explicar-servico', 'reuniao'],
    significados: [
      'Interesse real: quer ver qualidade antes de avançar.',
      'Quer saber se você já atendeu o segmento dele.',
      'Está comparando profissionais.',
    ],
    estrategia:
      'Mostre poucos trabalhos relevantes, não todos. Explique o contexto de cada um (problema, solução). Se não tiver projetos do nicho, seja honesto e mostre o que mais se aproxima. Nunca mostre trabalho que não é seu.',
    descobrir: ['O que ele quer ver (visual, funcionalidade, nicho).', 'O que o fez perguntar.'],
    respostas: {
      curta:
        'Tenho sim! Vou te mandar três projetos que têm mais a ver com o seu negócio, com o link para você navegar. Quer ver algo específico, como agendamento ou catálogo?',
      consultiva:
        'Claro! Para eu te mostrar o que é mais relevante: você quer ver mais o visual ou como o site funciona, tipo agenda, pedidos, formulário?',
      persuasiva:
        'Tenho! Separei [N] projetos parecidos com o que você precisa. Em cada um, coloquei o que o cliente queria resolver e o que foi feito, para você ver além da aparência. Se quiser, também posso pedir autorização para você conversar com algum desses clientes.',
      ligacao:
        'Tenho sim. Posso te mandar agora no WhatsApp os que têm mais a ver com o seu ramo? Aí você olha com calma e me diz o que achou.',
      reuniao:
        'Abra os projetos no celular (é como o cliente dele vai ver). Para cada um, conte a história: problema, solução, o que mudou. Pergunte o que ele gostou e o que não gostou — isso alimenta o briefing.',
    },
    alternativas: [
      'Tenho! Te mando os links agora. Algum ramo ou funcionalidade que você queira ver em especial?',
      'Claro! Ainda não fiz para o seu segmento exatamente, mas tenho projetos com a mesma lógica. Te mostro e explico.',
    ],
    perguntaEstrategica: 'Dos sites que você conhece e gosta, qual é o mais parecido com o que você imagina?',
    proximoPasso: 'Envie 2 a 3 projetos relevantes com contexto e marque uma conversa para comentar.',
    naoDizer: [
      'Mostrar trabalhos de outras pessoas como se fossem seus.',
      'Mandar 20 links sem contexto.',
      '"Não tenho, mas confia" — se não tiver, ofereça alternativas honestas (projeto pessoal, piloto com preço justo).',
    ],
    variacoes: {
      site: 'Mostre sites no ar, de preferência no celular.',
      landing: 'Mostre páginas e, se autorizado, números de conversão reais.',
      loja: 'Mostre lojas com fluxo de compra completo.',
      sistema: 'Mostre telas ou vídeos de sistemas (com dados fictícios para proteger clientes) e explique o problema resolvido.',
    },
    relacionadas: ['muito-novo', 'medo-nao-entregar', 'agencia-grande'],
  },
  {
    id: 'muito-novo',
    biblioteca: 'geral',
    frase: 'Você é muito novo para fazer esse trabalho.',
    categoria: 'confianca',
    gatilhos: ['você é muito jovem', 'pouca experiência', 'quantos anos você tem', 'tem experiência', 'há quanto tempo você faz isso', 'é iniciante'],
    resistencia: 'media',
    etapas: ['respondeu', 'interesse', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Preocupação com responsabilidade e continuidade.',
      'Associa idade a falta de experiência.',
      'Quer ser convencido com provas, não com palavras.',
    ],
    estrategia:
      'Não se ofenda nem se justifique demais. Responda com fatos: projetos feitos, processo, contrato, prazos cumpridos. Transforme a preocupação em critério objetivo.',
    descobrir: ['O que preocupa de fato (prazo, qualidade, suporte).', 'Que prova o deixaria tranquilo.'],
    respostas: {
      curta:
        'Entendo a preocupação, e é natural. Em vez de pedir que confie, prefiro te mostrar: aqui estão alguns projetos que entreguei, e trabalho com contrato e entregas por etapas. Assim você avalia pelo trabalho. O que mais te preocupa?',
      consultiva:
        'Faz sentido querer segurança. O que te deixaria tranquilo: ver projetos, falar com clientes ou ter etapas com aprovação?',
      persuasiva:
        'Entendo, e acho justo avaliar experiência. Trabalho com [tempo] desenvolvendo sites, já entreguei [N] projetos e sigo um processo com contrato, prazos e aprovações em cada etapa. Você não precisa confiar na minha idade — pode confiar no processo e no que já está no ar.',
      ligacao:
        'Entendo totalmente, e prefiro que você me avalie pelo trabalho. Posso te mandar alguns projetos e explicar como conduzo cada etapa?',
      reuniao:
        'Seja objetivo e profissional: apresente processo, contrato, cronograma e portfólio. Pergunte quais critérios ele usa para escolher fornecedores e responda a cada um com evidências.',
    },
    alternativas: [
      'Justo! Te mando alguns projetos que já entreguei e você avalia pelo resultado.',
      'Entendo. Posso te passar contato de clientes para você perguntar como foi trabalhar comigo?',
    ],
    perguntaEstrategica: 'Que critérios você usa para escolher um fornecedor de confiança?',
    proximoPasso: 'Envie portfólio, referências e o modelo de contrato com etapas.',
    naoDizer: [
      '"Idade não importa" — encerra a conversa sem responder a preocupação.',
      'Mentir sobre tempo de experiência.',
      'Responder com irritação.',
    ],
    variacoes: {
      site: 'Portfólio + processo simples já resolvem na maioria dos casos.',
      landing: 'Projetos curtos permitem demonstrar competência rapidamente.',
      loja: 'Mostre lojas funcionando e o processo de testes.',
      sistema: 'Para sistemas, mostre documentação de projetos, organização e testes. Considere começar com um módulo menor para construir confiança.',
    },
    relacionadas: ['tem-portfolio', 'agencia-grande', 'medo-nao-entregar'],
  },
  {
    id: 'agencia-grande',
    biblioteca: 'geral',
    frase: 'Prefiro contratar uma agência grande.',
    categoria: 'concorrencia',
    gatilhos: ['agência maior', 'empresa grande', 'prefiro uma empresa', 'freelancer não', 'quero uma agência', 'agência renomada'],
    resistencia: 'media',
    etapas: ['respondeu', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['descobrir-necessidade', 'defender-valor', 'encerrar'],
    significados: [
      'Busca segurança: acha que agência grande não some.',
      'O projeto é realmente grande e exige uma equipe.',
      'Valoriza marca e status.',
    ],
    estrategia:
      'Descubra o que ele associa a "agência grande" (segurança, equipe, prazo). Responda a cada ponto com seu modelo de trabalho. Se o projeto exigir mesmo uma equipe grande, reconheça — e, se fizer sentido, indique.',
    descobrir: ['O que ele espera de uma agência grande.', 'O tamanho real do projeto.', 'Quem seria o contato dele no dia a dia.'],
    respostas: {
      curta:
        'Faz sentido querer segurança. Posso te perguntar o que você espera de uma agência grande? Assim te digo com sinceridade se meu trabalho atende — e, se não atender, te falo.',
      consultiva:
        'Entendo. O que mais pesa para você: estrutura de equipe, garantia de continuidade ou outra coisa?',
      persuasiva:
        'Agências grandes têm vantagens, como equipe e estrutura. Trabalhando comigo, você fala direto com quem faz, sem intermediários, com respostas rápidas e contrato com prazos e entregas definidas. Para projetos que exigem várias especialidades, trabalho com parceiros. O importante é você escolher o modelo que atende seu projeto.',
      ligacao:
        'Entendo totalmente. Me conta o que você espera da agência, porque dependendo do projeto, pode ser mesmo a melhor escolha — e se não for, te explico por quê.',
      reuniao:
        'Liste com ele os critérios de escolha (prazo, comunicação, continuidade, preço, especialidades). Responda cada um honestamente. Se a necessidade for maior que sua capacidade, sugira parceria ou indique alguém.',
    },
    alternativas: [
      'Justo! Uma diferença comigo é que você fala direto com quem faz o projeto. O que é mais importante para você nessa escolha?',
      'Entendo. Se quiser comparar, posso te mandar meu processo e você coloca lado a lado com o da agência.',
    ],
    perguntaEstrategica: 'Quem seria a pessoa que vai cuidar do seu projeto no dia a dia, na agência?',
    proximoPasso: 'Envie seu processo e contrato para comparação, ou indique parceiros se o projeto exigir uma equipe maior.',
    naoDizer: [
      '"Agência grande só cobra caro" — generalização.',
      '"Lá você vai ser só mais um" — pode não ser verdade.',
      'Fingir ter uma equipe que não tem.',
    ],
    variacoes: {
      site: 'Para sites institucionais, freelancers e pequenas agências costumam atender muito bem.',
      landing: 'Agilidade e comunicação direta são vantagens fortes.',
      loja: 'Projetos com logística complexa podem exigir parcerias.',
      sistema: 'Sistemas grandes exigem equipe e continuidade. Seja honesto sobre sua capacidade e plano de continuidade (documentação, código acessível ao cliente).',
      recorrente: 'Suporte com tempo de resposta definido em contrato responde à preocupação com continuidade.',
    },
    relacionadas: ['muito-novo', 'tem-portfolio', 'outro-cobra-mais-barato'],
  },
  {
    id: 'garantia-resultados',
    biblioteca: 'geral',
    frase: 'Preciso de garantia de resultados.',
    categoria: 'resultados',
    gatilhos: ['você garante', 'garantia de vendas', 'e se não der resultado', 'quero garantia', 'garante quantos clientes', 'devolve o dinheiro se não vender'],
    resistencia: 'alta',
    etapas: ['recebeu-proposta', 'objecao', 'indeciso'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Medo de perder dinheiro.',
      'Expectativa de que o site, sozinho, gere vendas.',
      'Outro profissional prometeu garantias e ele está comparando.',
    ],
    estrategia:
      'Seja honesto: você garante a entrega, não as vendas, porque elas dependem de fatores fora do seu controle. Mostre o que você garante (escopo, prazo, funcionamento, suporte) e como vocês vão medir resultados juntos.',
    descobrir: ['Qual resultado ele espera.', 'O que mais contribui para esse resultado (divulgação, atendimento, preço).', 'Se alguém prometeu garantia.'],
    respostas: {
      curta:
        'Vou ser transparente: ninguém sério pode garantir vendas, porque elas dependem também de divulgação, preço e atendimento. O que eu garanto é a entrega do que está no contrato, funcionando, no prazo, com suporte. E combino com você como medir os resultados. Faz sentido?',
      consultiva:
        'Entendo. Que resultado você espera nos primeiros meses? Assim vejo se o projeto está alinhado com essa expectativa.',
      persuasiva:
        'Desconfie de quem garante vendas — essa pessoa está prometendo algo que não controla. O que eu posso garantir e coloco em contrato: escopo, prazo, funcionamento em celular e computador, correção de erros por [período] e suporte. Além disso, deixo o site preparado para medir contatos e cliques, para você acompanhar resultados reais e decidir os próximos passos com dados.',
      ligacao:
        'Ótimo você perguntar, porque prefiro ser honesto agora do que te decepcionar depois. Deixa eu te explicar o que eu consigo garantir e o que depende de outros fatores.',
      reuniao:
        'Separe em duas colunas: "o que eu garanto" (entregas, prazos, funcionamento, suporte) e "o que influencia resultados" (divulgação, preço, atendimento, mercado). Combine indicadores e uma revisão após 60–90 dias.',
    },
    alternativas: [
      'Garanto entrega, prazo e funcionamento. Vendas dependem de mais coisas, e prefiro ser honesto sobre isso. Posso te mostrar como acompanhamos resultados?',
      'Quem garante vendas está prometendo o que não controla. O que posso fazer é te ajudar a medir e melhorar com dados.',
    ],
    perguntaEstrategica: 'Além do site, o que mais precisa funcionar bem para esse resultado acontecer?',
    proximoPasso: 'Defina por escrito as garantias de entrega e os indicadores que serão acompanhados.',
    naoDizer: [
      '"Garanto que você vai vender mais" — promessa falsa.',
      '"Devolvo seu dinheiro se não vender" — compromisso insustentável.',
      'Desviar da pergunta.',
    ],
    variacoes: {
      site: 'Garanta entrega, funcionamento, responsividade e suporte.',
      landing: 'Garanta velocidade, integrações e rastreamento corretos; resultados dependem da campanha.',
      loja: 'Garanta funcionamento do checkout e integrações; vendas dependem de tráfego, preço e logística.',
      sistema: 'Garanta requisitos aprovados, homologação e período de garantia para correções.',
      recorrente: 'Garanta entregas mensais e relatórios; para SEO, nunca garanta posição.',
    },
    relacionadas: ['nao-sei-se-traz-clientes', 'pagar-quando-vender', 'recuperar-investimento'],
  },
  {
    id: 'pagar-quando-vender',
    biblioteca: 'geral',
    frase: 'Quero pagar somente quando vender.',
    categoria: 'pagamento',
    gatilhos: ['pago quando der resultado', 'paga por comissão', 'te pago com as vendas', 'faz por porcentagem', 'risco compartilhado', 'pagar no sucesso'],
    resistencia: 'alta',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja'],
    objetivos: ['explicar-servico', 'negociar-escopo', 'encerrar'],
    significados: [
      'Não tem caixa e quer transferir o risco.',
      'Desconfia do resultado.',
      'Já viu modelos de comissão em outros mercados.',
    ],
    estrategia:
      'Explique por que esse modelo não funciona para desenvolvimento (você não controla as vendas). Ofereça alternativas reais: parcelamento, fases, escopo menor. Em casos raros, modelo híbrido (valor menor + comissão), só se houver controle e medição claros.',
    descobrir: ['Se é falta de caixa ou falta de confiança.', 'Volume de vendas atual.', 'Se ele aceitaria fases.'],
    respostas: {
      curta:
        'Entendo a ideia de dividir o risco. O problema é que as vendas dependem de muitas coisas que eu não controlo, como preço, divulgação e atendimento. O que posso fazer é dividir o pagamento em etapas ou começar com uma versão menor. Quer que eu te mostre?',
      consultiva:
        'Faz sentido querer reduzir o risco. O que te preocupa mais: o investimento agora ou não saber se vai dar resultado?',
      persuasiva:
        'Entendo, e é uma proposta comum. Só que o desenvolvimento do site é um trabalho que eu entrego por completo, independente de como ele será divulgado ou de como o atendimento converte. Para reduzir seu risco, posso dividir o pagamento por entregas, começar com uma versão essencial ou parcelar. Assim você não paga por nada que não viu.',
      ligacao:
        'Entendo a lógica. Deixa eu te explicar por que esse modelo não funciona para criação de site e quais alternativas eu tenho para reduzir o seu risco.',
      reuniao:
        'Explique a diferença entre serviço entregue (site) e resultado (vendas). Apresente as alternativas com números: fases, parcelamento, escopo reduzido. Se houver interesse em modelo híbrido, só considere com medição clara, contrato e um valor fixo que cubra seus custos.',
    },
    alternativas: [
      'Infelizmente não trabalho por comissão, porque as vendas dependem de fatores fora do meu controle. Mas posso dividir em etapas para ficar mais leve. Topa?',
      'Entendo! Que tal começarmos com uma versão menor, com investimento reduzido, e ampliarmos quando você sentir resultado?',
    ],
    perguntaEstrategica: 'Se o pagamento fosse dividido conforme você aprova cada entrega, isso resolveria sua preocupação?',
    proximoPasso: 'Ofereça pagamento por etapas ou fase 1 reduzida. Se a resposta continuar sendo "só por comissão", encerre com cordialidade.',
    naoDizer: [
      'Aceitar comissão sem forma de medir as vendas.',
      '"Você não confia no próprio negócio?" — provocação.',
      'Concordar e depois tentar renegociar.',
    ],
    variacoes: {
      site: 'Site institucional não tem venda direta mensurável: comissão é inviável.',
      landing: 'Em landing pages com tráfego pago, um bônus por meta pode ser discutido, com valor fixo garantido.',
      loja: 'Em e-commerce, modelo híbrido é possível (fixo + % sobre vendas da loja), com acesso aos dados e contrato claro.',
      sistema: 'Inviável: sistemas geram eficiência, não vendas diretas.',
    },
    relacionadas: ['garantia-resultados', 'sem-dinheiro-agora', 'faca-primeiro'],
  },
  {
    id: 'faca-primeiro',
    biblioteca: 'geral',
    frase: 'Faça primeiro para eu avaliar.',
    categoria: 'confianca',
    gatilhos: ['faz um modelo primeiro', 'me mostra pronto', 'faz de graça e se eu gostar pago', 'faz um teste', 'quero ver antes de pagar', 'manda uma prévia'],
    resistencia: 'alta',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Medo de pagar por algo que não vai gostar.',
      'Desconfiança após experiência ruim.',
      'Está pedindo para vários profissionais fazerem de graça e escolher.',
    ],
    estrategia:
      'Recuse com elegância o trabalho gratuito completo e ofereça formas de reduzir o risco: portfólio, aprovação de layout antes do desenvolvimento, pagamento vinculado a aprovação. Se quiser oferecer algo, ofereça uma etapa pequena e paga.',
    descobrir: ['O que ele quer avaliar: visual, funcionamento, seu comprometimento.', 'Se outros profissionais estão fazendo "de graça".'],
    respostas: {
      curta:
        'Entendo que você queira ver antes. Trabalho assim: você paga uma entrada, eu te apresento o layout e só sigo para o desenvolvimento depois da sua aprovação. Se precisar de ajustes, faço antes de continuar. Assim você vê antes de investir o restante.',
      consultiva:
        'Faz sentido querer segurança. O que você precisa ver para se sentir confiante: o visual, exemplos parecidos ou como funciona o processo?',
      persuasiva:
        'Não faço o projeto completo antes, porque é um trabalho personalizado para o seu negócio. Mas o processo é pensado para você não comprar no escuro: primeiro você vê meu portfólio, depois aprova a estrutura e o layout antes de qualquer desenvolvimento, e os pagamentos acompanham as aprovações. Você enxerga o resultado em cada etapa.',
      ligacao:
        'Entendo a preocupação. Deixa eu te explicar como você consegue ver e aprovar cada parte antes de eu avançar — assim você tem segurança sem eu precisar fazer tudo antes.',
      reuniao:
        'Mostre projetos semelhantes e o fluxo de aprovação. Se ele insistir, ofereça uma etapa pequena e paga (ex.: layout da página inicial), com valor abatido do projeto se ele continuar.',
    },
    alternativas: [
      'Eu te mostro o layout para aprovação antes de desenvolver, e você só segue se gostar. Funciona para você?',
      'Projeto completo antes não faço, mas você aprova cada etapa antes de pagar a próxima. Quer ver como funciona?',
    ],
    perguntaEstrategica: 'Se você pudesse aprovar o visual antes do desenvolvimento, ainda precisaria ver o projeto pronto?',
    proximoPasso: 'Ofereça etapa inicial paga (estrutura + layout) com aprovação antes de seguir.',
    naoDizer: [
      'Aceitar fazer de graça "só para mostrar" — ensina que seu trabalho não tem valor.',
      '"Isso é coisa de quem quer explorar" — acusação.',
      'Enviar arquivos editáveis antes do pagamento.',
    ],
    variacoes: {
      site: 'Aprovação do layout da página inicial antes de desenvolver as demais.',
      landing: 'Wireframe ou estrutura de seções para aprovação rápida.',
      loja: 'Aprovação de layout + demonstração em plataforma de teste.',
      sistema: 'Ofereça uma fase de descoberta paga (requisitos + protótipo navegável) como primeira etapa.',
    },
    relacionadas: ['medo-nao-entregar', 'tem-portfolio', 'pagar-quando-vender'],
  },
  {
    id: 'nao-quero-contrato',
    biblioteca: 'geral',
    frase: 'Não quero contrato.',
    categoria: 'pagamento',
    gatilhos: ['sem contrato', 'contrato pra quê', 'confio na palavra', 'contrato complica', 'não gosto de assinar nada', 'acordo de boca'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema', 'recorrente'],
    objetivos: ['explicar-servico', 'fechar'],
    significados: [
      'Acha que contrato é burocracia ou desconfiança.',
      'Medo de multa ou fidelidade.',
      'Quer flexibilidade para mudar escopo depois.',
    ],
    estrategia:
      'Explique que o contrato protege os dois lados e não precisa ser complicado. Mostre que é curto, sem fidelidade abusiva, e que define o que será entregue. Ofereça aceite digital simples.',
    descobrir: ['O que o preocupa no contrato (multa, fidelidade, burocracia).', 'Se teve problema com contrato antes.'],
    respostas: {
      curta:
        'Entendo, ninguém gosta de burocracia. Meu contrato é curto — uma ou duas páginas — e serve para proteger você: deixa escrito o que vou entregar, o prazo e o valor. Dá para assinar digitalmente pelo celular. Posso te mandar para você ler?',
      consultiva:
        'Faz sentido. O que te incomoda num contrato: tempo de fidelidade, multa ou a burocracia de assinar?',
      persuasiva:
        'O contrato não é desconfiança, é clareza. Ele garante que você recebe exatamente o que combinamos, no prazo, e define o que acontece se algo mudar. Sem ele, qualquer mal-entendido vira palavra contra palavra. O meu é simples, sem fidelidade abusiva, e você assina pelo celular.',
      ligacao:
        'Entendo totalmente. Posso te explicar o que tem no meu contrato? É bem curto e protege principalmente você.',
      reuniao:
        'Mostre o contrato e leia junto as cláusulas principais (escopo, prazo, pagamento, propriedade, cancelamento). Pergunte se algo o incomoda e ajuste o que for razoável.',
    },
    alternativas: [
      'Entendo! O meu contrato é curto e protege você. Te mando para ler, se tiver algo que queira ajustar, a gente conversa.',
      'Pode ser um aceite simples da proposta por escrito, com escopo, prazo e valor. O importante é ficar claro para nós dois.',
    ],
    perguntaEstrategica: 'O que você gostaria que estivesse escrito para se sentir protegido caso algo dê errado?',
    proximoPasso: 'Envie o contrato simplificado ou um aceite formal da proposta.',
    naoDizer: [
      'Aceitar trabalhar sem nada por escrito em projetos de valor relevante.',
      '"Contrato é obrigatório, senão não faço" logo de cara, sem explicar.',
      'Usar contrato com cláusulas abusivas.',
    ],
    variacoes: {
      site: 'Contrato simples ou aceite formal da proposta.',
      landing: 'Aceite formal com escopo e prazo costuma bastar.',
      loja: 'Contrato com responsabilidades sobre produtos, pagamentos e políticas.',
      sistema: 'Contrato é indispensável: escopo, propriedade do código, dados, garantia, manutenção e confidencialidade.',
      recorrente: 'Contrato sem fidelidade longa, com aviso prévio de cancelamento.',
    },
    relacionadas: ['medo-nao-entregar', 'nao-quero-mensalidade', 'quem-dono-codigo'],
  },
  {
    id: 'nao-quero-hospedagem',
    biblioteca: 'geral',
    frase: 'Não quero gastar com hospedagem.',
    categoria: 'pagamento',
    gatilhos: ['hospedagem é cara', 'pra que hospedagem', 'tem hospedagem grátis', 'não quero pagar servidor', 'domínio é caro'],
    resistencia: 'baixa',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Não entende o que é hospedagem e domínio.',
      'Acha que é um custo escondido.',
      'Conhece opções gratuitas e quer usar.',
    ],
    estrategia:
      'Explique de forma simples (domínio = endereço; hospedagem = terreno). Mostre os custos reais, quem recebe o dinheiro e as opções disponíveis, inclusive mais baratas, com prós e contras.',
    descobrir: ['O que ele entende por hospedagem.', 'Se ele já tem domínio.', 'Que tipo de site é (estático simples pode ter hospedagem de baixo custo).'],
    respostas: {
      curta:
        'Te explico rapidinho: o domínio é o endereço (seunegocio.com.br) e a hospedagem é onde o site fica guardado. São custos de qualquer site, pagos direto para as empresas que fornecem, não para mim. Para o seu caso, fica em torno de R$ [valor] por ano. Quer que eu te mostre as opções?',
      consultiva:
        'Entendo. Você já tem um domínio registrado em seu nome?',
      persuasiva:
        'Faz sentido querer economizar. Para sites simples existem opções de hospedagem com custo baixo, e eu escolho a mais adequada ao seu projeto. O importante é que tudo fique no seu nome. Hospedagem gratuita até existe, mas costuma ter limitações de endereço, velocidade ou suporte — te mostro as opções e você decide.',
      ligacao:
        'Boa pergunta. Deixa eu te explicar o que é cada coisa e quanto custa de verdade, porque geralmente é bem menos do que as pessoas imaginam.',
      reuniao:
        'Desenhe: domínio (endereço), hospedagem (onde fica), e-mail profissional (opcional). Mostre valores reais de mercado para cada um e quem paga a quem. Ofereça configurar no nome dele.',
    },
    alternativas: [
      'É um custo pequeno, anual, e fica no seu nome. Para site simples, dá para usar opção bem econômica. Quer ver?',
      'Sem problema, eu te indico a opção mais barata que funciona bem para o seu site.',
    ],
    perguntaEstrategica: 'Você prefere pagar a hospedagem direto ou que eu administre para você?',
    proximoPasso: 'Envie uma tabela simples com domínio, hospedagem e opções, com valores anuais.',
    naoDizer: [
      'Embutir margem alta na hospedagem sem informar.',
      'Registrar o domínio em seu nome.',
      'Usar jargão técnico (DNS, servidor, VPS) sem explicar.',
    ],
    variacoes: {
      site: 'Site estático simples permite hospedagem de baixo custo.',
      landing: 'Para campanhas temporárias, hospedagem pelo período da campanha.',
      loja: 'Lojas precisam de hospedagem robusta ou plataforma; o custo é inevitável.',
      sistema: 'Sistemas exigem servidor e banco de dados; explique custos de infraestrutura com transparência e estimativa por volume de uso.',
    },
    relacionadas: ['nao-quero-mensalidade', 'plataforma-pronta', 'nao-quero-depender'],
  },
  {
    id: 'plataforma-pronta',
    biblioteca: 'geral',
    frase: 'Já uso uma plataforma pronta.',
    categoria: 'concorrencia',
    gatilhos: ['uso wix', 'tenho wordpress', 'uso nuvemshop', 'uso shopify', 'construtor de site', 'fiz no canva', 'uso google sites', 'uso linktree'],
    resistencia: 'media',
    etapas: ['respondeu', 'objecao'],
    servicos: ['site', 'loja', 'sistema'],
    objetivos: ['descobrir-necessidade', 'explicar-servico', 'encerrar'],
    significados: [
      'A plataforma atende e ele está satisfeito.',
      'Ele fez sozinho e tem orgulho disso.',
      'A plataforma tem limitações que ele ainda não percebeu ou não sabe resolver.',
    ],
    estrategia:
      'Valorize a iniciativa dele. Descubra se há limitações reais (funcionalidade, custo, desempenho, visual). Se a plataforma atende, ofereça ajuda dentro dela (configuração, design, SEO) em vez de forçar uma troca.',
    descobrir: ['Qual plataforma usa e há quanto tempo.', 'O que ele gostaria de fazer e não consegue.', 'Quanto paga por mês somando apps/planos.'],
    respostas: {
      curta:
        'Que legal! Essas plataformas resolvem bem muita coisa. Está atendendo tudo o que você precisa ou tem algo que você queria fazer e não consegue?',
      consultiva:
        'Bacana! Você mesmo configurou? O que você mais gostaria de melhorar nela hoje?',
      persuasiva:
        'Plataformas prontas são uma ótima escolha para muitos negócios, e às vezes o melhor caminho é continuar nelas. Eu posso te ajudar a melhorar o que você já tem — visual, velocidade, organização — ou, se a plataforma estiver limitando, avaliar com você se vale migrar. Sem empurrar troca.',
      ligacao:
        'Ótimo, essas plataformas ajudam bastante. Me conta: tem alguma coisa que você gostaria de fazer e a plataforma não deixa?',
      reuniao:
        'Peça para ver o painel e o site. Liste as limitações que ele mesmo mencionar. Calcule o custo mensal total (plano + apps). Apresente duas opções: otimizar na plataforma atual ou migrar, com prós e contras de cada uma.',
    },
    alternativas: [
      'Show! Se ela atende, continua nela. Se quiser, posso te ajudar a deixar mais profissional sem trocar de plataforma.',
      'Legal! Tem alguma limitação que te incomoda? Dependendo, dá para resolver na própria plataforma.',
    ],
    perguntaEstrategica: 'Quanto você paga por mês somando o plano e os aplicativos extras da plataforma?',
    proximoPasso: 'Ofereça uma melhoria dentro da plataforma ou uma análise comparativa de migração.',
    naoDizer: [
      '"Essas plataformas são amadoras" — desqualifica a escolha dele.',
      '"Você vai ter que trocar" — sem diagnóstico.',
      'Exagerar limitações técnicas para gerar medo.',
    ],
    variacoes: {
      site: 'Ofereça redesign dentro da plataforma, SEO ou migração apenas se houver limitação real.',
      loja: 'Compare taxas, apps pagos e limitações. Muitas vezes a melhor oferta é otimizar a loja existente.',
      sistema: 'Plataformas prontas raramente resolvem processos internos complexos; investigue se a dor é interna.',
      recorrente: 'Ofereça manutenção, conteúdo ou SEO para a plataforma atual.',
    },
    relacionadas: ['faco-com-ia', 'sobrinho-faz', 'nao-quero-hospedagem'],
  },
  {
    id: 'faco-com-ia',
    biblioteca: 'geral',
    frase: 'Consigo fazer isso sozinho com inteligência artificial.',
    categoria: 'concorrencia',
    gatilhos: ['faço com chatgpt', 'ia faz site', 'inteligência artificial faz', 'gero no chatgpt', 'ia cria site sozinha', 'faço com ia'],
    resistencia: 'media',
    etapas: ['respondeu', 'perguntou-preco', 'objecao'],
    servicos: ['site', 'landing', 'loja', 'sistema'],
    objetivos: ['descobrir-necessidade', 'defender-valor', 'encerrar'],
    significados: [
      'Ele realmente consegue gerar algo simples com IA.',
      'Acha que o valor está apenas em "gerar o código".',
      'Está usando como argumento de preço.',
    ],
    estrategia:
      'Não negue: a IA ajuda mesmo. Mostre onde está o valor do seu trabalho — entender o negócio, definir estrutura e mensagem, publicar, configurar domínio, segurança, integrações, suporte e responsabilidade. Se o caso dele for simples e ele tiver tempo, pode ser mesmo a melhor opção.',
    descobrir: ['Se ele já tentou e onde travou.', 'Quanto tempo ele tem para fazer.', 'O que o site precisa fazer.'],
    respostas: {
      curta:
        'Dá para fazer bastante coisa com IA hoje, é verdade — eu também uso no meu trabalho. A diferença está no que vem em volta: definir o que o site precisa comunicar, publicar com domínio, garantir que funcione bem no celular e ter alguém para resolver quando algo der errado. Você já chegou a testar?',
      consultiva:
        'Legal! Você já tentou? Onde sentiu mais dificuldade: no visual, nos textos ou em colocar no ar?',
      persuasiva:
        'A IA é uma ótima ferramenta, e eu uso para acelerar partes do trabalho. O que você contrata comigo não é o código, é o resultado pronto e sob responsabilidade: estrutura pensada para o seu cliente, textos ajustados, publicação, domínio, segurança, integrações, testes e suporte. Se o seu tempo é melhor investido no seu negócio, faz sentido delegar. Se você tem tempo e o projeto é simples, pode ser uma boa opção fazer sozinho.',
      ligacao:
        'Faz sentido, a IA ajuda muito. Me conta: você já tentou? Pergunto porque normalmente a parte difícil não é gerar a página, é deixar tudo funcionando e no ar.',
      reuniao:
        'Seja honesto sobre o que a IA faz bem. Liste com ele todas as etapas além da geração (domínio, hospedagem, SSL, responsividade, formulários, integrações, LGPD, manutenção). Pergunte quantas horas ele dedicaria a isso e quanto vale a hora dele.',
    },
    alternativas: [
      'Dá mesmo! Se travar em alguma parte, como publicar ou configurar domínio, me chama que eu ajudo.',
      'Com certeza a IA ajuda. A pergunta é: o seu tempo vale mais fazendo isso ou atendendo clientes?',
    ],
    perguntaEstrategica: 'Quantas horas você imagina gastar até o site estar no ar e funcionando?',
    proximoPasso: 'Se ele já tentou e travou, ofereça ajuda pontual (publicação, ajustes) ou o projeto completo.',
    naoDizer: [
      '"IA faz site ruim" — nem sempre é verdade e ele pode provar o contrário.',
      '"IA vai acabar com seu negócio" — fora de contexto.',
      'Esconder que você usa IA no seu processo, se usa.',
    ],
    variacoes: {
      site: 'O valor está em estratégia, publicação, domínio e suporte.',
      landing: 'O valor está em conversão, integrações e rastreamento corretos.',
      loja: 'Loja envolve pagamento, frete, segurança e operação — difícil de resolver só com IA.',
      sistema: 'Sistemas com dados, usuários e segurança exigem arquitetura, testes e responsabilidade. Código gerado sem revisão pode criar riscos.',
    },
    relacionadas: ['plataforma-pronta', 'sobrinho-faz', 'outro-cobra-mais-barato'],
  },
  {
    id: 'sistema-preco-de-site',
    biblioteca: 'geral',
    frase: 'Quero um sistema completo pelo preço de um site.',
    categoria: 'preco',
    gatilhos: ['sistema barato', 'só um sistema simples', 'achei que era mais barato', 'sistema por 1000 reais', 'por que sistema é tão caro', 'é só um sisteminha'],
    resistencia: 'alta',
    etapas: ['perguntou-preco', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['negociar-escopo', 'explicar-servico', 'defender-valor'],
    significados: [
      'Não sabe a diferença de complexidade entre site e sistema.',
      'Viu preços baixos de soluções prontas ou de templates.',
      'Orçamento limitado para uma necessidade real.',
    ],
    estrategia:
      'Explique a diferença sem jargão (site mostra informações; sistema processa dados, tem usuários, regras e segurança). Proponha um MVP: o menor conjunto de funcionalidades que resolve o problema principal dentro do orçamento. Avalie se uma ferramenta pronta resolve melhor.',
    descobrir: ['Qual problema principal o sistema deve resolver.', 'Orçamento disponível.', 'Quantos usuários e quais regras são essenciais.'],
    respostas: {
      curta:
        'Entendo! A diferença é que um site mostra informações, e um sistema trabalha com dados, usuários e regras, por isso leva mais tempo para construir e testar. O que dá para fazer é começar pela parte que mais resolve o seu problema, dentro do seu orçamento, e crescer depois. Qual é a função mais importante?',
      consultiva:
        'Faz sentido querer otimizar. Se você tivesse que escolher uma única coisa que o sistema precisa fazer bem, qual seria?',
      persuasiva:
        'Um sistema completo envolve cadastros, regras de negócio, permissões, segurança, testes e dados que precisam estar protegidos — é outro tipo de trabalho. Em vez de cortar qualidade, sugiro reduzir o escopo: começamos com um MVP focado no problema principal, que você já consegue usar, e adicionamos o resto em fases. Também vale avaliar se alguma ferramenta pronta resolve parte disso por menos.',
      ligacao:
        'Entendo, e é normal ter essa referência. Deixa eu te explicar rapidinho por que sistema é diferente de site, e como dá para começar com algo que caiba no seu orçamento.',
      reuniao:
        'Liste todas as funcionalidades desejadas. Classifique com ele: essencial / importante / desejável. Estime apenas as essenciais como MVP. Apresente o roadmap em fases com valores separados. Se o orçamento não cobrir nem o MVP, indique alternativas prontas.',
    },
    alternativas: [
      'Dá para começar com uma versão menor, só com o essencial, e evoluir depois. Quer que eu monte essa proposta?',
      'Sistema e site são trabalhos bem diferentes. Mas posso te ajudar a encontrar o que cabe no seu orçamento, inclusive se for uma ferramenta pronta.',
    ],
    perguntaEstrategica: 'Qual é o problema que, se resolvido, já faria o investimento valer a pena?',
    proximoPasso: 'Proponha uma fase de MVP com escopo enxuto e um roadmap das próximas fases.',
    naoDizer: [
      'Aceitar fazer "o sistema completo" pelo valor de um site e entregar algo frágil.',
      '"Você não entende de tecnologia" — desqualifica.',
      'Prometer funcionalidades sem levantamento.',
    ],
    variacoes: {
      sistema: 'MVP + fases; deixe claro custo de infraestrutura e manutenção.',
      site: 'Se o problema puder ser resolvido com site + formulário + planilha, ofereça isso como alternativa honesta.',
      loja: 'Se o "sistema" for uma loja, plataforma pronta pode ser a melhor relação custo-benefício.',
    },
    relacionadas: ['personalizado-sem-pagar-muito', 'esta-muito-caro', 'todas-funcionalidades-ja'],
  },
];
