import type { Objection } from '../../types';

export const SISTEMAS_1: Objection[] = [
  {
    id: 'planilha-ja-resolve',
    biblioteca: 'sistema',
    frase: 'Uma planilha já resolve.',
    categoria: 'sistemas',
    gatilhos: ['excel resolve', 'faço numa planilha', 'planilha é suficiente', 'google sheets dá conta', 'não preciso de sistema, tenho planilha'],
    resistencia: 'media',
    etapas: ['respondeu', 'objecao'],
    servicos: ['sistema'],
    servicosRelacionados: ['sis-banco-dados', 'sis-gestao', 'sis-orcamentos'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'Para o volume atual, a planilha atende de verdade.',
      'Ele não contabiliza o tempo gasto mantendo a planilha.',
      'Medo de trocar algo conhecido por algo novo e caro.',
    ],
    estrategia:
      'Concorde quando for verdade. Investigue os limites típicos da planilha: edição simultânea, histórico de alterações, permissões, fórmulas que quebram, dependência de quem a criou. Só proponha sistema se esses limites já estiverem doendo.',
    descobrir: [
      'Quantas pessoas editam e se ao mesmo tempo.',
      'Se já perderam dados ou trabalharam em versão errada.',
      'Quanto tempo leva por semana para manter e consolidar.',
    ],
    respostas: {
      curta:
        'Se está resolvendo, ótimo — não faz sentido trocar só por trocar. Me conta: quantas pessoas mexem nela e já aconteceu de alguém apagar ou sobrescrever algo sem querer?',
      consultiva:
        'Faz sentido. Quem criou a planilha ainda é quem cuida dela? O que aconteceria se essa pessoa saísse de férias?',
      persuasiva:
        'Planilha é ótima até certo volume. O que um sistema acrescenta é o que a planilha não faz bem: várias pessoas usando ao mesmo tempo sem conflito, histórico de quem alterou o quê, permissões (cada um vê o que precisa) e regras que impedem erro de digitação. Se nada disso é problema hoje, a planilha é a escolha certa. Se é, dá para transformar exatamente a sua planilha em sistema, mantendo a mesma lógica.',
      ligacao:
        'Faz sentido, planilha resolve muita coisa. Só para eu entender: ela é usada por quantas pessoas? E dá trabalho manter?',
      reuniao:
        'Peça para ver a planilha. Identifique colunas calculadas, abas de consolidação e controles manuais. Mostre como cada um ficaria no sistema e o que deixaria de ser manual. Proponha manter exportação para Excel para ele não se sentir preso.',
    },
    alternativas: [
      'Se resolve, mantém! Quando começar a dar trabalho demais ou erro, me chama que eu transformo ela em sistema sem mudar a lógica.',
      'Entendo! Só uma pergunta: quanto tempo por semana alguém gasta atualizando e conferindo essa planilha?',
    ],
    perguntaEstrategica: 'Quanto tempo por semana alguém da equipe gasta mantendo, conferindo e consolidando essa planilha?',
    proximoPasso: 'Se houver dor, proponha analisar a planilha e estimar um sistema que reproduz a mesma lógica com controles.',
    naoDizer: [
      '"Planilha não é profissional" — desqualifica a forma como ele trabalha.',
      '"O sistema vai eliminar todos os erros" — promessa exagerada.',
      'Propor um sistema maior do que a planilha atual.',
    ],
    variacoes: {
      sistema: 'Reproduza a lógica da planilha com permissões, histórico e validações; mantenha exportação.',
      recorrente: 'Dashboard conectado à planilha pode ser um passo intermediário mais barato.',
    },
    relacionadas: ['resolve-por-planilhas', 'precisa-sistema-proprio', 'nao-pagar-desenvolvimento'],
    transparencia: {
      escopo: 'O escopo inicial é reproduzir a planilha atual com controles — não inventar módulos novos sem necessidade.',
      implantacao: 'Planeje a importação dos dados da planilha e um período curto usando os dois em paralelo para conferência.',
      custos: 'Compare com o custo da planilha: zero de licença, mas horas de manutenção. O sistema terá custo de servidor mensal; informe o valor.',
      propriedade: 'Garanta que os dados possam ser exportados de volta para Excel a qualquer momento.',
    },
  },
  {
    id: 'software-pronto',
    biblioteca: 'sistema',
    frase: 'Prefiro comprar um software pronto.',
    categoria: 'sistemas',
    gatilhos: ['sistema pronto', 'saas', 'software de mercado', 'já existe pronto', 'por que fazer do zero', 'assinar um sistema'],
    resistencia: 'media',
    etapas: ['respondeu', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    servicosRelacionados: ['sis-gestao', 'sis-crm', 'sis-agendamento'],
    objetivos: ['comparacao-preco', 'descobrir-necessidade', 'encerrar'],
    significados: [
      'Software pronto pode atender bem e ser mais barato no começo.',
      'Ele acha arriscado depender de um desenvolvimento novo.',
      'Não sabe comparar custo total ao longo do tempo.',
    ],
    estrategia:
      'Seja um conselheiro, não um vendedor de código. Em muitos casos, software pronto é a melhor escolha. Ajude a comparar: aderência ao processo, adaptações necessárias, custo por usuário em alguns anos, integrações e propriedade dos dados.',
    descobrir: [
      'Quais softwares ele avaliou.',
      'O que esses softwares não fazem que ele precisa.',
      'Quantos usuários e qual o custo mensal estimado.',
    ],
    respostas: {
      curta:
        'Pode ser a melhor escolha, sim — eu mesmo indico software pronto quando ele atende. Você já encontrou algum que faz tudo do jeito que vocês trabalham?',
      consultiva:
        'Faz sentido. O que vocês precisam que os softwares que você viu não fazem bem?',
      persuasiva:
        'Software pronto é ótimo quando o processo da empresa se encaixa nele. Ele costuma ser mais barato no começo, mas a comparação justa considera alguns anos: mensalidade por usuário, módulos extras, adaptações que vocês fazem por fora e o quanto o processo precisa mudar para caber no software. O sistema próprio faz sentido quando o processo é um diferencial ou quando o custo recorrente fica alto com o crescimento. Posso te ajudar a fazer essa conta, mesmo que a conclusão seja comprar o pronto.',
      ligacao:
        'Faz total sentido avaliar o pronto primeiro. Posso te ajudar a comparar? Às vezes o pronto resolve e eu te digo isso sem problema.',
      reuniao:
        'Monte uma tabela: requisitos essenciais × software pronto A × software pronto B × sistema próprio. Some custos de 3 anos (licenças, implantação, adaptações). Seja honesto onde o pronto vence.',
    },
    alternativas: [
      'Ótima ideia testar o pronto. Se ele não encaixar no seu processo, me chama que a gente conversa.',
      'Concordo em olhar o pronto primeiro. Quer uma lista de perguntas para fazer ao fornecedor antes de assinar?',
    ],
    perguntaEstrategica: 'O que vocês teriam que mudar no jeito de trabalhar para caber no software pronto?',
    proximoPasso: 'Ofereça uma comparação de custo total em 3 anos e aderência aos requisitos essenciais.',
    naoDizer: [
      '"Software pronto é engessado" — generalização.',
      '"Com sistema próprio você economiza" — sem conta.',
      'Esconder que o sistema próprio também tem custos recorrentes.',
    ],
    variacoes: {
      sistema: 'Compare custo total, aderência e propriedade dos dados.',
      recorrente: 'Ofereça implantar e integrar o software pronto como serviço, se for melhor para o cliente.',
    },
    relacionadas: ['nao-pagar-desenvolvimento', 'precisa-sistema-proprio', 'ja-tenho-software-gestao'],
    transparencia: {
      custos:
        'Mostre o custo recorrente do sistema próprio (servidor, banco, manutenção) ao lado da mensalidade do pronto. A vantagem só aparece com volume ou necessidades específicas.',
      escopo: 'Liste o que o pronto não cobre. Se a lista for vazia, recomende o pronto.',
      propriedade: 'No pronto, os dados ficam no fornecedor: verifique como exportar. No próprio, defina em contrato.',
      manutencao: 'No pronto, a manutenção é do fornecedor. No próprio, precisa estar planejada e orçada.',
    },
  },
  {
    id: 'nao-pagar-desenvolvimento',
    biblioteca: 'sistema',
    frase: 'Não quero pagar desenvolvimento personalizado.',
    categoria: 'preco',
    gatilhos: ['desenvolvimento é caro', 'não quero pagar programação', 'customização cara', 'pagar por sistema sob medida'],
    resistencia: 'alta',
    etapas: ['perguntou-preco', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['negociar-escopo', 'defender-valor', 'comparacao-preco'],
    significados: [
      'O orçamento não comporta o investimento.',
      'Não vê valor suficiente em relação a alternativas prontas.',
      'Teve experiência com projeto personalizado que estourou prazo e custo.',
    ],
    estrategia:
      'Entenda a origem da resistência. Se for orçamento, proponha MVP ou alternativa pronta. Se for medo de estouro, mostre como o escopo e o orçamento são controlados (fases, escopo fechado, solicitações de mudança).',
    descobrir: ['Se já teve projeto que estourou.', 'Qual o orçamento possível.', 'Se existe alternativa pronta aceitável.'],
    respostas: {
      curta:
        'Entendo. Desenvolvimento sob medida só faz sentido quando nada pronto resolve bem. Você já olhou alternativas prontas? Se elas atendem, pode ser o melhor caminho — e eu te digo isso com sinceridade.',
      consultiva:
        'Faz sentido. O que te preocupa mais: o valor do investimento ou o risco de o projeto sair do controle?',
      persuasiva:
        'O medo de projeto personalizado é justificado — muitos estouram porque começam sem escopo claro. Por isso trabalho com escopo fechado por fase, entregas utilizáveis e qualquer mudança passando por estimativa e aprovação antes. E começamos pelo mínimo que resolve o problema principal, para o investimento ser proporcional ao retorno.',
      ligacao:
        'Entendo totalmente. Posso te perguntar o que te deixa mais receoso? Se é o valor, tenho formas de começar menor; se é o risco, te explico como controlo o escopo.',
      reuniao:
        'Explique o modelo de controle: escopo fechado, fases, change requests. Mostre uma estimativa de MVP. Apresente lado a lado a alternativa pronta mais próxima.',
    },
    alternativas: [
      'Justo! Se algo pronto resolver, é o caminho. Se não resolver, dá para começar pequeno, só com o essencial.',
      'Entendo. Posso te mostrar como fica um MVP mínimo, com escopo fechado e sem surpresa no valor?',
    ],
    perguntaEstrategica: 'Se o projeto tivesse escopo fechado e entregas em fases, o investimento ainda seria um impeditivo?',
    proximoPasso: 'Apresente MVP com escopo fechado e a alternativa pronta mais próxima, para comparação.',
    naoDizer: [
      '"Personalizado sempre vale mais a pena" — nem sempre.',
      'Baixar o valor sem reduzir escopo.',
      'Começar sem escopo para "caber no orçamento".',
    ],
    variacoes: {
      sistema: 'MVP com escopo fechado e controle de mudanças.',
      site: 'Se o problema for simples, um site com formulário e planilha pode resolver.',
    },
    relacionadas: ['software-pronto', 'sistema-preco-de-site', 'personalizado-sem-pagar-muito'],
    transparencia: {
      escopo: 'Escopo fechado por fase, com lista do que está e do que não está incluso.',
      custos: 'Informe os custos de infraestrutura e manutenção, não só o desenvolvimento.',
      prazo: 'Prazo por fase, após levantamento de requisitos.',
    },
  },
  {
    id: 'vai-demorar',
    biblioteca: 'sistema',
    frase: 'Vai demorar muito para ficar pronto.',
    categoria: 'prazo',
    gatilhos: ['quanto tempo leva', 'prazo muito longo', 'preciso rápido', 'demora muito', 'tenho pressa', 'quando fica pronto'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema', 'loja'],
    objetivos: ['negociar-escopo', 'explicar-servico'],
    significados: [
      'Existe uma data real (evento, temporada, contrato).',
      'Ele subestima a complexidade.',
      'Teve experiência com projeto que atrasou muito.',
    ],
    estrategia:
      'Entenda a data por trás da pressa. Mostre o que dá para entregar até essa data (MVP) e o que fica para depois. Nunca encurte o prazo cortando testes. Seja transparente sobre o que depende do cliente.',
    descobrir: ['Que data ele tem em mente e por quê.', 'O que é indispensável até essa data.', 'Disponibilidade dele para aprovar e testar.'],
    respostas: {
      curta:
        'Entendo a pressa. Tem alguma data específica em que precisa estar funcionando? Assim vejo o que dá para entregar até lá e o que pode vir numa segunda etapa.',
      consultiva:
        'Faz sentido. O que precisa estar funcionando primeiro para resolver o mais urgente?',
      persuasiva:
        'Prazo de sistema depende do escopo, e eu prefiro te dar um prazo real do que um curto que vai estourar. O que normalmente funciona: definimos o mínimo que resolve o urgente, entregamos isso primeiro, e o restante vem em fases. Também é importante saber que parte do prazo depende de vocês — aprovações, testes e envio de informações. Com tudo isso combinado, o cronograma fica previsível.',
      ligacao:
        'Entendo a urgência. Me conta qual é a data que você tem em mente? Quero ver o que é realista entregar até lá, sem te prometer algo que eu não cumpra.',
      reuniao:
        'Construa o cronograma de trás para frente a partir da data dele. Mostre o que cabe até a data (MVP) e o que fica para depois. Liste as dependências do cliente com datas.',
    },
    alternativas: [
      'Dá para acelerar entregando primeiro o essencial. Qual a sua data limite?',
      'Prefiro te passar um prazo real. Se for curto demais, a gente divide em fases e você começa a usar antes.',
    ],
    perguntaEstrategica: 'O que acontece se o sistema ficar pronto um mês depois da data que você imagina?',
    proximoPasso: 'Apresente cronograma com MVP até a data desejada e fases seguintes, incluindo dependências do cliente.',
    naoDizer: [
      'Prometer prazo sem levantamento.',
      '"Faço em uma semana" para fechar a venda.',
      'Cortar testes para cumprir prazo.',
    ],
    variacoes: {
      sistema: 'MVP + fases, com dependências do cliente explícitas.',
      loja: 'Plataforma pronta com layout personalizado pode reduzir prazo.',
      landing: 'Se a urgência for de comunicação, uma landing page pode ser publicada antes do sistema.',
    },
    relacionadas: ['todas-funcionalidades-ja', 'nao-pode-parar-operacao', 'nao-sei-funcionalidades'],
    transparencia: {
      prazo: 'Só informe prazo após levantamento. Separe prazo de desenvolvimento, testes e homologação.',
      escopo: 'Prazo e escopo andam juntos: reduzir prazo exige reduzir escopo, não qualidade.',
      implantacao: 'Inclua no cronograma o tempo de implantação e treinamento, que não é desenvolvimento.',
    },
  },
  {
    id: 'sistema-com-erros',
    biblioteca: 'sistema',
    frase: 'E se o sistema apresentar erros?',
    categoria: 'confianca',
    gatilhos: ['e se der bug', 'e se travar', 'e se der problema', 'garantia de funcionamento', 'quem conserta', 'sistema com defeito'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Medo de ficar sem suporte com a operação parada.',
      'Experiência anterior com sistema instável.',
      'Quer saber se correções serão cobradas.',
    ],
    estrategia:
      'Seja honesto: todo software pode ter erros. Explique como você reduz (testes, homologação) e como corrige (garantia por período definido, canal de suporte, tempo de resposta). Diferencie erro (corrigido sem custo na garantia) de melhoria.',
    descobrir: ['Impacto de uma parada na operação.', 'Experiência anterior.', 'Expectativa de tempo de resposta.'],
    respostas: {
      curta:
        'Boa pergunta. Todo sistema pode ter erro, e o que importa é como ele é evitado e corrigido. Antes de publicar, vocês testam e aprovam; depois, há um período de garantia em que correções de erro não são cobradas, com canal de suporte e prazo de resposta definidos. Quer que eu detalhe isso na proposta?',
      consultiva:
        'Faz sentido. Se o sistema ficasse fora por algumas horas, qual seria o impacto para vocês? Isso me ajuda a definir o nível de suporte adequado.',
      persuasiva:
        'Prometer sistema sem erro seria mentir. O que eu garanto é o processo: testes durante o desenvolvimento, homologação com vocês antes de publicar, garantia de [período] para correção de erros sem custo e um canal de suporte com tempo de resposta definido em contrato. Depois da garantia, um plano de manutenção mantém esse atendimento. Assim vocês sabem exatamente o que acontece se algo der errado.',
      ligacao:
        'Ótima pergunta, e eu prefiro ser honesto: todo sistema pode apresentar erro. Deixa eu te explicar como eu previno e como funciona a correção quando acontece.',
      reuniao:
        'Apresente o fluxo de qualidade: testes, homologação, publicação, garantia, suporte. Defina com ele níveis de prioridade (parado, com contorno, cosmético) e tempos de resposta. Coloque em contrato.',
    },
    alternativas: [
      'Erros podem acontecer, e por isso tem garantia de correção sem custo por [período] e suporte com prazo de resposta.',
      'Ótima pergunta! Vocês testam e aprovam antes de ir ao ar, e depois tem garantia. Quer ver como funciona o suporte?',
    ],
    perguntaEstrategica: 'Que tempo de resposta vocês precisariam se algo parasse?',
    proximoPasso: 'Inclua na proposta período de garantia, níveis de prioridade e tempos de resposta.',
    naoDizer: [
      '"Meus sistemas não dão erro" — falso.',
      '"Depois da entrega, qualquer coisa é cobrada" — sem garantia definida.',
      'Prometer suporte 24h sem ter estrutura para isso.',
    ],
    variacoes: {
      sistema: 'Garantia, homologação e níveis de suporte por prioridade.',
      recorrente: 'Plano de manutenção com tempo de resposta e monitoramento.',
      loja: 'Testes de checkout e frete antes de abrir a loja; monitoramento de pedidos.',
    },
    relacionadas: ['testar-antes', 'pagar-cada-alteracao', 'depender-da-empresa'],
    transparencia: {
      manutencao: 'Defina período de garantia para erros e diferencie erro de melhoria. Após a garantia, ofereça plano de manutenção.',
      implantacao: 'Homologação pelo cliente antes de publicar reduz erros em produção.',
      escopo: 'O que não foi especificado não é erro — é melhoria. Deixe isso claro desde o início.',
      custos: 'Informe o valor do plano de manutenção após a garantia.',
    },
  },
  {
    id: 'protecao-dados',
    biblioteca: 'sistema',
    frase: 'Como vocês vão proteger os dados?',
    categoria: 'sistemas',
    gatilhos: ['segurança dos dados', 'lgpd', 'vazamento', 'hacker', 'proteção de dados', 'dados de clientes seguros', 'criptografia'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'loja'],
    servicosRelacionados: ['sis-clientes', 'sis-multiusuario', 'rec-monitoramento'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Preocupação legítima com LGPD e reputação.',
      'Lida com dados sensíveis (saúde, financeiro, documentos).',
      'Quer avaliar seu nível técnico.',
    ],
    estrategia:
      'Responda com práticas concretas, sem jargão excessivo e sem prometer segurança absoluta. Diferencie o que é responsabilidade técnica (sua) do que é responsabilidade da empresa (políticas, consentimento, acessos). Recomende validação jurídica para LGPD.',
    descobrir: ['Que tipo de dado será armazenado.', 'Quem vai acessar.', 'Se a empresa já tem política de privacidade.'],
    respostas: {
      curta:
        'Ótima pergunta. Na prática: acesso só com login individual e permissões por função, conexão criptografada (HTTPS), senhas armazenadas com criptografia, backups automáticos e registro de quem acessou o quê. Nenhum sistema é 100% invulnerável, mas essas práticas reduzem muito o risco. Que tipo de dado vocês vão guardar?',
      consultiva:
        'Faz sentido. Os dados incluem informações sensíveis, como saúde, documentos ou dados financeiros? Isso muda o nível de cuidado necessário.',
      persuasiva:
        'Segurança é tratada em camadas: (1) quem acessa — login individual, senhas fortes e permissões por perfil; (2) como trafega — tudo criptografado em HTTPS; (3) como fica guardado — banco protegido, senhas com hash, backups; (4) rastreabilidade — registro de ações importantes; (5) atualização — dependências mantidas em dia. Para a LGPD, o sistema ajuda com coleta mínima e controle de acesso, e a parte jurídica (consentimento, política de privacidade) vale validar com um advogado. Não prometo risco zero; prometo boas práticas e transparência.',
      ligacao:
        'Ótima pergunta, e é bom tratar isso desde o início. Deixa eu te explicar em linguagem simples o que é feito para proteger as informações.',
      reuniao:
        'Explique as camadas de segurança com exemplos do sistema dele. Pergunte sobre dados sensíveis e quem acessa. Defina perfis de acesso juntos. Registre na proposta as práticas adotadas e as responsabilidades de cada parte.',
    },
    alternativas: [
      'Login individual, permissões, HTTPS, backups e registro de acessos. Quer que eu detalhe por escrito na proposta?',
      'Não prometo segurança absoluta, porque ninguém sério promete, mas aplico boas práticas e te explico cada uma.',
    ],
    perguntaEstrategica: 'Se essas informações vazassem, qual seria o impacto para os seus clientes?',
    proximoPasso: 'Envie por escrito as práticas de segurança e o mapa de responsabilidades (técnicas e da empresa).',
    naoDizer: [
      '"É 100% seguro" — impossível garantir.',
      '"Não precisa se preocupar com LGPD" — falso.',
      'Usar jargão para impressionar sem explicar.',
    ],
    variacoes: {
      sistema: 'Camadas de segurança, perfis de acesso, logs e LGPD.',
      loja: 'Dados de cartão ficam no intermediador de pagamento; a loja guarda o mínimo necessário.',
      recorrente: 'Monitoramento, atualizações de segurança e teste de backups.',
    },
    relacionadas: ['backup', 'niveis-de-acesso', 'medo-perder-dados'],
    transparencia: {
      seguranca:
        'Liste as práticas adotadas (HTTPS, hash de senhas, permissões, backups, logs, atualizações). Nunca prometa invulnerabilidade.',
      propriedade: 'Os dados pertencem ao cliente. Defina em contrato confidencialidade e o que acontece com os dados ao fim do contrato.',
      manutencao: 'Segurança exige atualização contínua de dependências; inclua isso no plano de manutenção.',
      custos: 'Ferramentas de segurança ou monitoramento adicionais podem ter custo mensal; informe.',
    },
  },
  {
    id: 'depender-da-empresa',
    biblioteca: 'sistema',
    frase: 'Não quero depender da sua empresa.',
    categoria: 'manutencao',
    gatilhos: ['ficar refém', 'ficar preso a vocês', 'e se vocês fecharem', 'dependência do fornecedor', 'lock-in'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Já ficou preso a um fornecedor.',
      'Pensa na continuidade do negócio a longo prazo.',
      'Desconfia do tamanho da sua empresa.',
    ],
    estrategia:
      'Transforme independência em parte da proposta: código no repositório do cliente (ou entregue), tecnologias de mercado, documentação, acesso ao banco de dados e às contas de infraestrutura. Isso aumenta a confiança e diferencia você.',
    descobrir: ['Experiência anterior com fornecedor.', 'O que ele precisaria receber para se sentir independente.'],
    respostas: {
      curta:
        'Concordo totalmente, e é assim que eu trabalho: o código fica em um repositório acessível a vocês, as contas de servidor no nome da empresa e eu entrego documentação. Se um dia quiserem seguir com outro profissional, conseguem. O que mais te deixaria tranquilo?',
      consultiva:
        'Faz sentido. Você já passou por alguma situação de ficar preso a um fornecedor? O que faltou naquela vez?',
      persuasiva:
        'Independência deveria ser padrão, e é o que eu proponho: (1) código em repositório de vocês; (2) servidor, domínio e banco em contas da empresa; (3) tecnologias amplamente usadas no mercado, para que outro desenvolvedor consiga dar continuidade; (4) documentação de instalação e das regras de negócio. Vocês continuam comigo pelo serviço, não por estarem presos.',
      ligacao:
        'Faz todo sentido, e eu prefiro cliente que pensa assim. Deixa eu te explicar o que vocês recebem para nunca ficarem dependentes de mim.',
      reuniao:
        'Apresente o "kit de independência": acessos, repositório, documentação, stack tecnológica. Coloque em contrato. Pergunte se há alguém técnico na empresa que deva receber os acessos.',
    },
    alternativas: [
      'Justo! Código, contas e documentação ficam com vocês. Quer que eu coloque isso no contrato?',
      'Concordo. Uso tecnologias de mercado justamente para que qualquer profissional consiga continuar o trabalho.',
    ],
    perguntaEstrategica: 'O que vocês precisariam ter em mãos para trocar de fornecedor sem trauma, se um dia quisessem?',
    proximoPasso: 'Inclua no contrato cláusulas de acesso ao código, contas e documentação.',
    naoDizer: [
      'Manter contas em seu nome para garantir o cliente.',
      'Usar tecnologia obscura ou proprietária sem necessidade.',
      '"Comigo você nunca vai precisar de outro" — arrogante.',
    ],
    variacoes: {
      sistema: 'Repositório, contas no nome do cliente, documentação e stack de mercado.',
      recorrente: 'Contrato de manutenção sem fidelidade longa e com entrega de acessos ao final.',
    },
    relacionadas: ['mudar-de-desenvolvedor', 'quem-dono-codigo', 'nao-quero-depender'],
    transparencia: {
      propriedade: 'Defina em contrato propriedade do código, dos dados e das contas. Entregue acessos.',
      manutencao: 'Documentação técnica permite que outro profissional faça manutenção.',
      custos: 'Contas de infraestrutura no nome do cliente deixam os custos visíveis para ele.',
    },
  },
  {
    id: 'funcionar-celular',
    biblioteca: 'sistema',
    frase: 'Preciso que funcione no celular.',
    categoria: 'sistemas',
    gatilhos: ['aplicativo', 'app', 'funcionar no celular', 'responsivo', 'usar no tablet', 'equipe em campo'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'loja'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'A equipe trabalha em campo ou longe do computador.',
      'Ele acha que precisa de um aplicativo nas lojas (App Store/Play Store).',
      'Os clientes dele usam principalmente o celular.',
    ],
    estrategia:
      'Diferencie sistema web responsivo (funciona no navegador do celular) de aplicativo nativo (lojas de app). Na maioria dos casos, web responsivo (ou PWA, que pode ser "instalado" na tela inicial) resolve com custo menor. Pergunte o que precisa funcionar no celular e se há necessidade de câmera, GPS ou uso sem internet.',
    descobrir: [
      'Quem usa no celular (equipe ou clientes).',
      'Quais telas são usadas no celular.',
      'Se precisa funcionar sem internet ou usar recursos do aparelho.',
    ],
    respostas: {
      curta:
        'Vai funcionar, sim. O sistema é feito para se adaptar ao celular e dá para colocar um atalho na tela inicial, como se fosse um app. Vocês precisam de algum recurso específico, como câmera, localização ou usar sem internet?',
      consultiva:
        'Ótimo! Quem vai usar mais pelo celular: a equipe em campo ou os clientes? Quais tarefas eles fariam por lá?',
      persuasiva:
        'Hoje o sistema web é construído primeiro para o celular. Ele abre no navegador e pode ser adicionado à tela inicial, sem precisar baixar nas lojas de aplicativos — o que reduz custo e simplifica atualizações. Aplicativo nativo só é necessário em casos específicos (uso intenso offline, notificações complexas, recursos avançados do aparelho), e aí eu te explico a diferença de custo.',
      ligacao:
        'Funciona sim. Só quero entender uma coisa: vocês precisam que esteja nas lojas de aplicativo, ou abrir pelo celular já resolve?',
      reuniao:
        'Mostre um sistema web funcionando no celular e o atalho na tela inicial. Liste as tarefas mobile e verifique se alguma exige recurso nativo. Se exigir, apresente o custo adicional separadamente.',
    },
    alternativas: [
      'Funciona no celular, sim! E dá para criar um atalho na tela inicial. Precisa de algum recurso especial?',
      'Sim! Quer que eu te mostre um exemplo funcionando no celular?',
    ],
    perguntaEstrategica: 'Que tarefa a equipe precisaria fazer pelo celular que hoje não consegue?',
    proximoPasso: 'Defina quais telas são prioritárias no celular e se há requisito nativo; ajuste o escopo.',
    naoDizer: [
      '"Fazemos app" sem explicar a diferença de custo e manutenção.',
      'Prometer funcionamento offline completo sem planejar.',
      'Desenhar só para computador e "adaptar depois".',
    ],
    variacoes: {
      sistema: 'Web responsivo/PWA na maioria dos casos; app nativo apenas com justificativa.',
      loja: 'Lojas precisam ser pensadas primeiro para o celular, onde ocorre a maior parte das compras.',
      site: 'Todo site deve ser responsivo — não é custo extra, é requisito.',
    },
    relacionadas: ['funcionarios-nao-sabem', 'controlar-em-um-painel', 'nao-sei-funcionalidades'],
    transparencia: {
      escopo: 'Defina quais telas e funções precisam ser otimizadas para celular.',
      custos: 'App nativo tem custos adicionais: contas de desenvolvedor nas lojas, publicação e manutenção de versões.',
      manutencao: 'Web responsivo é atualizado num lugar só; apps nativos exigem novas versões nas lojas.',
    },
  },
  {
    id: 'integrar-sistema-atual',
    biblioteca: 'sistema',
    frase: 'Quero integrar com meu sistema atual.',
    categoria: 'sistemas',
    gatilhos: ['integrar com erp', 'conectar com meu sistema', 'puxar dados do meu software', 'integração com sistema existente'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema'],
    servicosRelacionados: ['rec-integracoes-api', 'sis-gestao'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Necessidade real de evitar redigitação.',
      'Não quer abandonar o sistema atual.',
      'Não sabe se o sistema atual permite integração.',
    ],
    estrategia:
      'Peça nome, versão e fornecedor do sistema atual. Verifique se há API, exportação/importação ou acesso ao banco. Defina direção e frequência dos dados. Oriente que integrações podem depender de autorização e custo do fornecedor atual.',
    descobrir: ['Qual sistema e quem é o fornecedor.', 'Que dados e em que direção.', 'Se o fornecedor cobra pela API.'],
    respostas: {
      curta:
        'Dá para avaliar. Me passa o nome do sistema que vocês usam e quais informações precisam ir e vir. Vou verificar se ele tem API ou outra forma de integração antes de te passar escopo e valor.',
      consultiva:
        'Ótimo. Hoje, que informação vocês digitam nos dois sistemas? Isso define o que a integração precisa fazer.',
      persuasiva:
        'Integração bem feita evita redigitação e erro. O caminho honesto é: (1) verificar a documentação do sistema atual; (2) confirmar com o fornecedor se há custo ou autorização para uso da API; (3) definir o fluxo de dados; (4) construir com tratamento de erros e registro, para vocês saberem se algo falhou. Se o sistema atual não permitir integração, existem alternativas como importação de arquivos — e eu te explico os limites de cada uma.',
      ligacao:
        'Dá para avaliar sim. Qual é o sistema? Vou olhar a documentação e te retorno com o que é possível, antes de qualquer promessa.',
      reuniao:
        'Desenhe o fluxo de dados entre os sistemas. Identifique chave de identificação (código do cliente, CPF/CNPJ, SKU). Combine uma etapa de verificação técnica com o fornecedor atual antes do orçamento.',
    },
    alternativas: [
      'Possível! Depende do sistema atual permitir. Me passa o nome que eu verifico.',
      'Dá para ver. Se ele não tiver API, ainda dá para trabalhar com importação de arquivos. Vou checar.',
    ],
    perguntaEstrategica: 'Se a integração fosse uma vez por dia em vez de em tempo real, resolveria?',
    proximoPasso: 'Faça a verificação técnica (API, custos, limites) e só então orce a integração.',
    naoDizer: [
      'Prometer integração sem ver a documentação.',
      'Ignorar custos e limites da API do fornecedor atual.',
      'Acessar o banco do sistema atual sem autorização do fornecedor.',
    ],
    variacoes: {
      sistema: 'Verificação técnica + integração com tratamento de erros.',
      recorrente: 'Manutenção da integração quando o fornecedor atualizar a API.',
      loja: 'Integração com ERP para estoque e pedidos, se suportado.',
    },
    relacionadas: ['conversar-outro-software', 'integrar-pagamentos', 'integrar-whatsapp'],
    transparencia: {
      integracoes: 'Depende da API do outro sistema. Verifique documentação, autenticação, limites e custos antes de orçar.',
      manutencao: 'Mudanças no sistema de terceiros podem quebrar a integração; inclua monitoramento e manutenção.',
      custos: 'Algumas APIs cobram por uso ou exigem plano superior do fornecedor; informe ao cliente.',
      escopo: 'Defina exatamente quais dados, direção, frequência e o que acontece em caso de falha.',
    },
  },
  {
    id: 'nao-sei-funcionalidades',
    biblioteca: 'sistema',
    frase: 'Não sei exatamente quais funcionalidades preciso.',
    categoria: 'sistemas',
    gatilhos: ['não sei o que preciso', 'me ajuda a definir', 'não tenho escopo', 'quero algo mas não sei bem', 'não sei explicar o que quero'],
    resistencia: 'baixa',
    etapas: ['interesse', 'respondeu'],
    servicos: ['sistema'],
    objetivos: ['descobrir-necessidade', 'explicar-servico', 'reuniao'],
    significados: [
      'Tem um problema claro, mas não sabe traduzir em funcionalidades.',
      'Está no início da ideia e precisa de orientação.',
      'Quer saber se você entende do negócio dele.',
    ],
    estrategia:
      'Isso é uma oportunidade: ofereça uma etapa de descoberta (levantamento de requisitos), de preferência paga ou com escopo definido. Comece pelos problemas e processos, não por telas. O resultado é um documento de escopo que ele pode usar com qualquer fornecedor.',
    descobrir: ['Qual problema ele quer resolver.', 'Quem participa do processo.', 'Como é feito hoje.'],
    respostas: {
      curta:
        'Isso é normal, e é melhor do que chegar com uma lista enorme. A gente começa pelo problema: me conta o que hoje dá mais trabalho ou gera erro, e eu te ajudo a transformar isso nas funcionalidades certas.',
      consultiva:
        'Tranquilo! Me descreve como é um dia normal nesse processo, do começo ao fim. Onde trava?',
      persuasiva:
        'Não saber as funcionalidades é o ponto de partida mais comum, e o mais saudável. Por isso o primeiro passo é uma etapa de descoberta: conversamos com quem executa o processo, mapeamos como funciona hoje e definimos o mínimo que resolve o problema. O resultado é um documento de escopo com prioridades e estimativa — que fica com você, inclusive se decidir fazer com outra pessoa.',
      ligacao:
        'Sem problema nenhum, é assim que quase todo projeto começa. Me conta o problema que você quer resolver que eu te ajudo a chegar nas funcionalidades.',
      reuniao:
        'Conduza um mapeamento do processo atual (passo a passo, quem faz, onde registra). Liste problemas. Para cada problema, proponha uma funcionalidade. Priorize com ele (essencial / depois). Proponha a descoberta formal como primeira entrega.',
    },
    alternativas: [
      'Normal! Começamos pelo problema, não pela lista de telas. O que mais te incomoda hoje nesse processo?',
      'Posso conduzir uma etapa de levantamento para definirmos juntos. Quer que eu explique como funciona?',
    ],
    perguntaEstrategica: 'Se o sistema resolvesse uma única coisa, qual problema você escolheria?',
    proximoPasso: 'Proponha uma etapa de descoberta com entregável (documento de escopo priorizado) e valor definido.',
    naoDizer: [
      'Mandar uma lista padrão de funcionalidades para ele escolher.',
      'Orçar sem levantamento.',
      '"Faço tudo e depois vemos" — receita de estouro.',
    ],
    variacoes: {
      sistema: 'Descoberta paga ou com escopo fechado, gerando documento de requisitos.',
      site: 'Para sites, um briefing estruturado de uma hora costuma bastar.',
    },
    relacionadas: ['precisa-sistema-proprio', 'todas-funcionalidades-ja', 'parecido-concorrente'],
    transparencia: {
      escopo: 'O escopo nasce da descoberta. Até lá, qualquer valor é estimativa por faixa.',
      prazo: 'Prazo do desenvolvimento só é definido após a descoberta.',
      custos: 'Deixe claro se a descoberta é cobrada e se o valor é abatido do projeto.',
    },
  },
  {
    id: 'testar-antes',
    biblioteca: 'sistema',
    frase: 'Quero testar antes de contratar.',
    categoria: 'confianca',
    gatilhos: ['tem demonstração', 'período de teste', 'quero ver funcionando', 'teste grátis', 'demo'],
    resistencia: 'media',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Acostumado com softwares prontos que têm teste grátis.',
      'Medo de investir em algo que a equipe não vai usar.',
      'Desconfiança sobre sua capacidade.',
    ],
    estrategia:
      'Explique que um sistema personalizado não existe antes de ser construído, mas que há formas de testar antes do investimento total: protótipo navegável, demonstração de projetos semelhantes, MVP com escopo pequeno e entregas por fases com homologação.',
    descobrir: ['O que ele quer validar (usabilidade, aderência, sua competência).', 'Quem da equipe testaria.'],
    respostas: {
      curta:
        'Faz sentido querer ver antes. Como o sistema é feito sob medida, ele ainda não existe — mas dá para testar de outras formas: te mostro um protótipo navegável das telas principais para vocês aprovarem antes do desenvolvimento, e as entregas são em fases, com vocês testando cada uma. Ajuda?',
      consultiva:
        'Entendo. O que vocês querem validar no teste: se a equipe consegue usar, se atende o processo ou como eu trabalho?',
      persuasiva:
        'Em sistema personalizado, o "teste" acontece ao longo do projeto: primeiro um protótipo clicável para vocês sentirem o fluxo, depois entregas por fase que vocês homologam antes de seguir. Assim vocês nunca investem tudo sem ter visto. Também posso mostrar sistemas semelhantes que já desenvolvi, com dados fictícios.',
      ligacao:
        'Super entendo. Deixa eu te explicar como vocês conseguem ver e testar antes de investir tudo, mesmo sendo um sistema feito do zero.',
      reuniao:
        'Mostre um protótipo de outro projeto e o fluxo de fases com homologação. Proponha uma primeira fase pequena (protótipo + MVP) com valor reduzido para construir confiança.',
    },
    alternativas: [
      'Dá para testar um protótipo das telas antes de desenvolver. Quer ver como funciona?',
      'Posso começar com uma fase pequena, que vocês testam antes de seguir com o resto.',
    ],
    perguntaEstrategica: 'Se vocês pudessem navegar nas telas antes do desenvolvimento, isso resolveria a necessidade de testar?',
    proximoPasso: 'Ofereça protótipo navegável como primeira etapa e entregas por fases com homologação.',
    naoDizer: [
      'Desenvolver o sistema inteiro de graça para teste.',
      '"Não tem como testar" — fecha a conversa.',
      'Mostrar sistema de outro cliente com dados reais.',
    ],
    variacoes: {
      sistema: 'Protótipo navegável + fases com homologação.',
      recorrente: 'Para planos de manutenção, ofereça um primeiro mês sem fidelidade.',
    },
    relacionadas: ['faca-primeiro', 'sistema-com-erros', 'funcionarios-nao-sabem'],
    transparencia: {
      escopo: 'O protótipo é a validação do escopo; alterações depois dele viram mudança de escopo.',
      implantacao: 'Homologação de cada fase pelo cliente antes de liberar a próxima.',
      custos: 'Deixe claro o valor do protótipo e se ele é abatido do projeto.',
    },
  },
  {
    id: 'nao-pode-parar-operacao',
    biblioteca: 'sistema',
    frase: 'Não posso parar minha operação para implantar isso.',
    categoria: 'sistemas',
    gatilhos: ['não posso parar', 'implantação vai atrapalhar', 'não dá para parar a empresa', 'transição', 'migração atrapalha'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Operação contínua, sem margem para paradas.',
      'Experiência anterior de implantação traumática.',
      'Equipe pequena e sobrecarregada.',
    ],
    estrategia:
      'Apresente um plano de implantação gradual: migração de dados testada, período de uso em paralelo, implantação por módulo ou por equipe, treinamento em horários de menor movimento e um plano de retorno se algo der errado.',
    descobrir: ['Períodos de menor movimento.', 'Quantas pessoas precisam ser treinadas.', 'O que não pode parar de jeito nenhum.'],
    respostas: {
      curta:
        'Entendo, e a implantação é planejada justamente para não parar nada. Começamos em paralelo com o que vocês já usam, por uma área ou equipe, no período de menor movimento. Só desligamos o processo antigo quando o novo estiver funcionando. Qual é a época mais tranquila para vocês?',
      consultiva:
        'Faz sentido. O que não pode parar de jeito nenhum na operação? Começo planejando a partir disso.',
      persuasiva:
        'Implantação boa é aquela que quase ninguém percebe. O plano normalmente tem: migração dos dados testada antes; uso em paralelo por um período; entrada por etapas (um módulo ou uma equipe por vez); treinamento curto em horário tranquilo; e um plano de retorno, se algo inesperado acontecer. Vocês não trocam tudo num dia.',
      ligacao:
        'Faz todo sentido, e ninguém quer parar a empresa. Posso te explicar como eu faço a transição sem interromper a operação?',
      reuniao:
        'Desenhe o cronograma de implantação com ele: migração, piloto, paralelo, virada, acompanhamento. Defina quem da equipe é o responsável interno e quais são os critérios para desligar o processo antigo.',
    },
    alternativas: [
      'A implantação é gradual, em paralelo com o processo atual. Nada para de uma vez.',
      'Podemos começar por uma equipe piloto no período mais tranquilo. Quando estiver redondo, expandimos.',
    ],
    perguntaEstrategica: 'Qual é o período do ano ou da semana em que a operação está mais tranquila?',
    proximoPasso: 'Inclua na proposta um plano de implantação gradual com piloto e período paralelo.',
    naoDizer: [
      '"Vai ser rápido, nem vai sentir" — sem plano.',
      'Propor "virada" de um dia para o outro sem paralelo.',
      'Ignorar migração de dados.',
    ],
    variacoes: {
      sistema: 'Piloto, paralelo, virada planejada e plano de retorno.',
      loja: 'Para migração de loja, cuidado com URLs e redirecionamentos para não perder clientes.',
    },
    relacionadas: ['funcionarios-nao-sabem', 'sistema-complicado-equipe', 'vai-demorar'],
    transparencia: {
      implantacao: 'Plano com migração testada, piloto, uso em paralelo, treinamento e plano de retorno.',
      prazo: 'O período paralelo aumenta o prazo total, mas reduz o risco. Mostre isso no cronograma.',
      escopo: 'Migração de dados é escopo: defina o que será migrado e o que fica no arquivo antigo.',
    },
  },
  {
    id: 'funcionarios-nao-sabem',
    biblioteca: 'sistema',
    frase: 'Meus funcionários não sabem usar sistemas.',
    categoria: 'sistemas',
    gatilhos: ['equipe não sabe usar computador', 'funcionário não é de tecnologia', 'vão ter dificuldade', 'pessoal mais velho', 'não vão aprender'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Equipe com baixa familiaridade digital.',
      'Rotatividade alta: treinar sempre de novo.',
      'Resistência à mudança por parte da equipe.',
    ],
    estrategia:
      'Leve a sério e proponha um desenho para essa realidade: telas mínimas por função, botões grandes, linguagem do dia a dia, treinamento prático e vídeos curtos. Envolva um funcionário no teste do protótipo.',
    descobrir: ['O que a equipe já usa no celular (WhatsApp, apps de banco).', 'Rotatividade.', 'Quem pode ser multiplicador.'],
    respostas: {
      curta:
        'Isso é bem comum, e o sistema precisa ser desenhado para isso. Se eles usam WhatsApp, conseguem usar um sistema com telas simples, só com o que cada função precisa. Posso mostrar um protótipo para alguém da equipe testar antes?',
      consultiva:
        'Entendi. No dia a dia, que tarefa cada funcionário precisaria fazer no sistema? Às vezes é só um ou dois botões.',
      persuasiva:
        'O sistema se adapta à equipe, não o contrário. Para equipes pouco digitais: cada pessoa vê só a tela da função dela, com linguagem do dia a dia; treinamento prático no próprio posto de trabalho; vídeos de um minuto para consulta; e um funcionário-chave que ajuda os demais. E testamos o protótipo com eles antes de desenvolver.',
      ligacao:
        'Faz sentido. Me conta: eles usam WhatsApp no celular? Se usam, a gente consegue fazer um sistema que eles usem sem sofrimento.',
      reuniao:
        'Pergunte as tarefas por função e desenhe telas mínimas. Proponha teste com um funcionário. Inclua no escopo vídeos curtos de treinamento e acompanhamento nas primeiras semanas.',
    },
    alternativas: [
      'Dá para fazer telas bem simples, só com o que cada um precisa. Quer que alguém da equipe teste antes?',
      'Se eles usam WhatsApp, conseguem usar o sistema. A gente desenha pensando neles.',
    ],
    perguntaEstrategica: 'Quem na equipe tem mais facilidade e poderia ajudar os colegas?',
    proximoPasso: 'Proponha teste do protótipo com funcionários e treinamento prático no escopo.',
    naoDizer: [
      '"Eles que se adaptem" — garante o fracasso da implantação.',
      '"É muito fácil" sem testar.',
      'Incluir funcionalidades que a equipe não vai usar.',
    ],
    variacoes: {
      sistema: 'Telas por função, treinamento prático, vídeos curtos e usuário-chave.',
      loja: 'Treine quem cadastra produtos e quem separa pedidos, com roteiros simples.',
    },
    relacionadas: ['sistema-complicado-equipe', 'nao-pode-parar-operacao', 'niveis-de-acesso'],
    transparencia: {
      implantacao: 'Treinamento por função, vídeos curtos e acompanhamento nas primeiras semanas.',
      escopo: 'Simplicidade é escopo: menos funcionalidades por tela, mais clareza.',
      custos: 'Treinamento adicional ou presencial pode ter custo; deixe claro o que está incluso.',
    },
  },
  {
    id: 'sistema-sem-mensalidade',
    biblioteca: 'sistema',
    frase: 'Não quero pagar mensalidade pelo sistema.',
    categoria: 'pagamento',
    gatilhos: ['sistema sem mensalidade', 'pagamento único sistema', 'não quero custo mensal de servidor', 'compro e é meu'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Quer fugir do modelo de software por assinatura.',
      'Não sabe que sistemas web têm custos de infraestrutura.',
      'Quer previsibilidade de custos.',
    ],
    estrategia:
      'Separe: desenvolvimento (pode ser pagamento único), infraestrutura (servidor, banco — custo inevitável, pode ficar em conta do cliente pagando direto ao provedor) e manutenção (opcional, mas recomendada). Mostre valores reais e opções.',
    descobrir: ['Se ele entende a diferença entre desenvolvimento e infraestrutura.', 'Volume de uso esperado.', 'Se há alguém técnico interno.'],
    respostas: {
      curta:
        'Entendo. O desenvolvimento pode ser pagamento único e o sistema fica de vocês. O que não tem como evitar é o servidor onde ele roda — isso é pago ao provedor, pode ficar no nome da empresa e, para o seu volume, fica em torno de R$ [valor] por mês. Manutenção comigo é opcional. Quer que eu detalhe?',
      consultiva:
        'Faz sentido. O que te incomoda na mensalidade: o valor, a falta de clareza do que está pagando ou ficar preso ao fornecedor?',
      persuasiva:
        'O modelo que proponho separa as coisas com transparência: (1) desenvolvimento: pagamento único, código de vocês; (2) infraestrutura: servidor e banco de dados em conta da empresa, pagos direto ao provedor — é como a conta de luz do sistema; (3) manutenção: opcional, com valor fixo ou por demanda. Assim vocês sabem exatamente para onde vai cada real.',
      ligacao:
        'Entendo totalmente. Deixa eu te explicar o que é custo do sistema funcionando e o que é serviço opcional, porque são coisas diferentes.',
      reuniao:
        'Mostre uma tabela de custos em 12 e 36 meses: desenvolvimento, infraestrutura (estimada por volume) e manutenção (opcional). Compare com a mensalidade de um software pronto equivalente.',
    },
    alternativas: [
      'O desenvolvimento é pago uma vez. Só o servidor tem custo mensal, pago direto ao provedor e no nome da empresa.',
      'Manutenção é opcional. O único custo fixo é a infraestrutura, e eu te mostro quanto fica.',
    ],
    perguntaEstrategica: 'Você prefere pagar a infraestrutura direto ao provedor ou que eu administre?',
    proximoPasso: 'Envie tabela de custos separando desenvolvimento, infraestrutura e manutenção, em 12 e 36 meses.',
    naoDizer: [
      'Esconder custos de infraestrutura para parecer mais barato.',
      '"Sem mensalidade é impossível" — sem explicar.',
      'Embutir margem na infraestrutura sem informar.',
    ],
    variacoes: {
      sistema: 'Desenvolvimento único + infraestrutura transparente + manutenção opcional.',
      recorrente: 'Se oferecer plano, detalhe entregas mensais.',
    },
    relacionadas: ['nao-quero-mensalidade', 'pagar-cada-alteracao', 'depender-da-empresa'],
    transparencia: {
      custos: 'Liste servidor, banco, domínio, e-mails transacionais e serviços de terceiros, com estimativa por volume de uso.',
      propriedade: 'Contas de infraestrutura no nome do cliente.',
      manutencao: 'Sem manutenção, o sistema continua funcionando, mas atualizações de segurança e correções serão por demanda.',
    },
  },
];
