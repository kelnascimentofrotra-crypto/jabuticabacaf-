import type { Objection } from '../../types';

export const SISTEMAS_2: Objection[] = [
  {
    id: 'acesso-admin-completo',
    biblioteca: 'sistema',
    frase: 'Quero acesso administrativo completo.',
    categoria: 'sistemas',
    gatilhos: ['acesso total', 'quero ser admin', 'quero controlar tudo', 'senha de administrador', 'acesso root', 'acesso ao servidor'],
    resistencia: 'baixa',
    etapas: ['recebeu-proposta', 'interesse'],
    servicos: ['sistema', 'site', 'loja'],
    servicosRelacionados: ['sis-painel-admin', 'sis-multiusuario'],
    objetivos: ['explicar-servico', 'fechar'],
    significados: [
      'Quer garantir que não ficará dependente.',
      'Já teve problema com fornecedor que reteve acessos.',
      'Pode estar confundindo administrador do sistema com acesso técnico ao servidor.',
    ],
    estrategia:
      'Concorde: é direito dele. Diferencie os níveis: administrador da aplicação (gerencia usuários, dados, configurações), acesso técnico (servidor, banco, código) e contas de serviços. Entregue todos, com orientação sobre boas práticas (não usar o admin no dia a dia, não compartilhar senha).',
    descobrir: ['Se ele quer gerenciar o sistema ou ter acesso técnico.', 'Quem mais na empresa precisa de acesso.'],
    respostas: {
      curta:
        'Com certeza, o sistema é de vocês. Você terá o perfil de administrador da aplicação e também recebe os acessos técnicos (servidor, banco e código) na entrega. Só recomendo criar perfis separados para a equipe, cada um com o que precisa.',
      consultiva:
        'Claro! Você quer acesso para gerenciar usuários e dados no sistema, ou também os acessos técnicos de servidor e código? Os dois são seus, só quero entregar de forma organizada.',
      persuasiva:
        'Acesso completo é um direito seu e faço questão de entregar: administrador da aplicação, contas de infraestrutura no nome da empresa, repositório do código e documentação. Por segurança, recomendo que o administrador não seja usado no dia a dia e que cada funcionário tenha o seu login com permissões adequadas — assim, se algo der errado, dá para saber quem fez o quê.',
      ligacao:
        'Sem dúvida, os acessos são seus. Deixa eu só te explicar os diferentes tipos de acesso para te entregar tudo de forma organizada e segura.',
      reuniao:
        'Liste os acessos que serão entregues e coloque no contrato. Defina com ele os perfis da equipe. Combine como as senhas serão guardadas (gerenciador de senhas, cofre).',
    },
    alternativas: [
      'Acesso total é seu. Entrego admin do sistema, servidor, banco e código, tudo documentado.',
      'Claro! Só sugiro perfis separados para a equipe, por segurança. Mas o controle total fica com você.',
    ],
    perguntaEstrategica: 'Quem mais na empresa deve ter acesso administrativo, além de você?',
    proximoPasso: 'Inclua a lista de acessos entregues no contrato e defina perfis da equipe.',
    naoDizer: [
      'Negar acesso ao cliente para "proteger o sistema".',
      'Entregar acessos sem orientação de segurança.',
      'Manter contas de infraestrutura em seu nome.',
    ],
    variacoes: {
      sistema: 'Admin da aplicação + acessos técnicos + documentação.',
      site: 'Painel do site, domínio, hospedagem e e-mails no nome do cliente.',
      loja: 'Admin da loja, contas de pagamento e frete no nome do cliente.',
    },
    relacionadas: ['niveis-de-acesso', 'quem-dono-codigo', 'depender-da-empresa'],
    transparencia: {
      propriedade: 'Lista de acessos entregues (aplicação, servidor, banco, repositório, domínio) no contrato.',
      seguranca: 'Recomende perfis individuais, autenticação forte e não usar o admin na rotina.',
    },
  },
  {
    id: 'mudar-de-desenvolvedor',
    biblioteca: 'sistema',
    frase: 'E se eu quiser mudar de desenvolvedor?',
    categoria: 'manutencao',
    gatilhos: ['trocar de programador', 'outro desenvolvedor continuar', 'se você sumir', 'portabilidade', 'migrar para outro fornecedor'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['sistema'],
    objetivos: ['explicar-servico', 'defender-valor'],
    significados: [
      'Preocupação com continuidade (e se você sumir?).',
      'Quer liberdade comercial.',
      'Já ficou preso a um sistema que ninguém mais conseguia mexer.',
    ],
    estrategia:
      'Responda com o que torna a troca possível: código acessível, tecnologias de mercado, documentação, ambiente reproduzível, dados exportáveis e transição colaborativa prevista em contrato.',
    descobrir: ['Se é medo de sumiço ou desejo de liberdade.', 'Se há equipe técnica interna.'],
    respostas: {
      curta:
        'Pode mudar, e o sistema é feito para isso ser possível: código acessível a vocês, tecnologias usadas no mercado, documentação e acesso ao banco de dados. E no contrato fica previsto que eu ajudo na transição, se precisar.',
      consultiva:
        'Faz sentido pensar nisso. A preocupação é mais com continuidade, caso eu não esteja disponível, ou com ter liberdade de escolha?',
      persuasiva:
        'Liberdade de trocar é uma garantia importante, e eu prefiro ter vocês como clientes por escolha. Para isso: código em repositório de vocês, tecnologias amplamente conhecidas, documentação de instalação e das regras de negócio, dados exportáveis e uma cláusula de transição em que eu passo o conhecimento para o novo responsável.',
      ligacao:
        'Pode, sim, e eu faço questão que seja possível. Deixa eu te explicar o que vocês recebem para que qualquer desenvolvedor consiga continuar.',
      reuniao:
        'Mostre exemplo de documentação técnica e estrutura de repositório. Inclua cláusula de transição (horas de passagem de conhecimento) e de entrega de acessos.',
    },
    alternativas: [
      'Pode! Código, documentação e acessos ficam com vocês. Coloco no contrato.',
      'Escolho tecnologias de mercado justamente para isso: qualquer desenvolvedor experiente consegue continuar.',
    ],
    perguntaEstrategica: 'O que precisaria estar documentado para um novo desenvolvedor assumir sem dificuldade?',
    proximoPasso: 'Inclua no contrato cláusulas de acesso ao código, documentação e transição.',
    naoDizer: [
      '"Ninguém vai entender meu código" — sinal de alerta para o cliente.',
      'Usar tecnologia obscura para criar dependência.',
      'Cobrar valores abusivos para liberar acessos.',
    ],
    variacoes: {
      sistema: 'Repositório, documentação, stack de mercado, dados exportáveis e transição em contrato.',
      recorrente: 'Ao fim do plano, entrega de acessos e relatório do estado do sistema.',
    },
    relacionadas: ['depender-da-empresa', 'quem-dono-codigo', 'acesso-admin-completo'],
    transparencia: {
      propriedade: 'Código e dados acessíveis ao cliente; cláusula de transição.',
      manutencao: 'Documentação técnica atualizada a cada entrega.',
    },
  },
  {
    id: 'quem-dono-codigo',
    biblioteca: 'sistema',
    frase: 'Quem será o proprietário do código?',
    categoria: 'sistemas',
    gatilhos: ['código fonte', 'propriedade intelectual', 'o código é meu', 'direitos do sistema', 'licença do código', 'código fica com quem'],
    resistencia: 'baixa',
    etapas: ['recebeu-proposta'],
    servicos: ['sistema', 'site', 'loja'],
    objetivos: ['explicar-servico', 'fechar'],
    significados: [
      'Preocupação com propriedade e continuidade.',
      'Investidores ou sócios exigem.',
      'Pretende revender ou licenciar o sistema.',
    ],
    estrategia:
      'Responda com clareza e coloque em contrato. Modelos comuns: cessão total dos direitos ao cliente após pagamento; ou licença de uso quando o sistema usa componentes próprios reaproveitados por você. Componentes de código aberto de terceiros seguem as próprias licenças.',
    descobrir: ['Se ele pretende revender/licenciar.', 'Se há exigência de investidores.', 'Se aceita que componentes genéricos sejam reutilizados por você.'],
    respostas: {
      curta:
        'Boa pergunta, e isso fica por escrito. No meu modelo, após a quitação, o código desenvolvido para vocês é de vocês, com acesso ao repositório. Bibliotecas de código aberto usadas no projeto seguem as licenças delas. Quer que eu te mande a cláusula para você ler?',
      consultiva:
        'Ótimo pensar nisso. Vocês pretendem algum dia revender ou licenciar o sistema para outras empresas? Isso muda o tipo de cláusula.',
      persuasiva:
        'Propriedade do código precisa ser clara desde o início. O que proponho: o código específico do projeto é cedido a vocês após o pagamento, com repositório e documentação; componentes genéricos que eu já tinha (como um módulo de login) podem ser licenciados para uso perpétuo, sem custo extra; e bibliotecas de código aberto seguem suas licenças. Tudo isso por escrito, para não haver dúvida no futuro.',
      ligacao:
        'Excelente pergunta. Posso te explicar como fica a propriedade do código e te mandar a cláusula do contrato para você avaliar com calma?',
      reuniao:
        'Apresente a cláusula de propriedade intelectual. Se o cliente pretende revender o sistema, discuta cessão total e exclusividade (e o impacto no valor). Recomende revisão jurídica do contrato.',
    },
    alternativas: [
      'Depois de quitado, o código do projeto é de vocês. Fica em contrato.',
      'O código é de vocês, com repositório e documentação. Te mando a cláusula para ler.',
    ],
    perguntaEstrategica: 'Vocês pretendem usar o sistema só internamente ou comercializar no futuro?',
    proximoPasso: 'Envie a cláusula de propriedade intelectual e recomende revisão jurídica.',
    naoDizer: [
      'Responder de forma vaga ("depois a gente vê").',
      'Reter o código como garantia de pagamento futuro sem previsão contratual.',
      'Prometer exclusividade de componentes de terceiros.',
    ],
    variacoes: {
      sistema: 'Cessão do código específico + licença de componentes reutilizáveis + licenças open source.',
      site: 'Em sites com tema ou construtor de terceiros, explique as licenças envolvidas.',
      loja: 'Em plataformas prontas, o cliente é dono do conteúdo e dos dados, não do código da plataforma.',
    },
    relacionadas: ['mudar-de-desenvolvedor', 'depender-da-empresa', 'acesso-admin-completo'],
    transparencia: {
      propriedade: 'Defina em contrato: cessão ou licença, momento da transferência, componentes reutilizáveis e licenças de terceiros.',
      custos: 'Exclusividade total sobre componentes reutilizáveis pode alterar o valor; deixe claro.',
    },
  },
  {
    id: 'novas-funcoes-depois',
    biblioteca: 'sistema',
    frase: 'Quero incluir novas funções depois.',
    categoria: 'sistemas',
    gatilhos: ['adicionar funcionalidades depois', 'o sistema cresce', 'escalável', 'evoluir o sistema', 'novos módulos'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'loja'],
    servicosRelacionados: ['rec-melhorias'],
    objetivos: ['explicar-servico', 'fechar'],
    significados: [
      'Sinal de compra: está pensando no longo prazo.',
      'Quer saber se o sistema vai permitir crescimento.',
      'Quer entender como serão cobradas as evoluções.',
    ],
    estrategia:
      'Confirme que o sistema será construído para evoluir e explique o processo de novas funções: solicitação, estimativa, aprovação, desenvolvimento, testes. Ofereça plano de evolução contínua ou orçamento por demanda.',
    descobrir: ['Que funções ele já imagina para o futuro.', 'Ritmo de evolução esperado.'],
    respostas: {
      curta:
        'Dá, sim — o sistema é construído para crescer. Novas funções seguem um processo simples: você pede, eu estimo prazo e valor, você aprova e eu desenvolvo. Já tem alguma função em mente para o futuro? Saber agora ajuda a preparar a estrutura.',
      consultiva:
        'Ótimo! Que funções você imagina para daqui a 6 meses ou um ano? Mesmo que não entrem agora, ajudam a planejar a base.',
      persuasiva:
        'Começar enxuto e evoluir é o melhor caminho. Construo a base pensando nas próximas etapas que você já imagina, para que novas funções não exijam refazer o que existe. Para evoluir, você pode orçar cada função separadamente ou ter um plano mensal com horas reservadas — o que fizer mais sentido para o seu ritmo.',
      ligacao:
        'Pode incluir, sim, e é o ideal. Me conta o que você já imagina para o futuro, porque isso me ajuda a preparar a base desde agora.',
      reuniao:
        'Monte um roadmap com ele: fase 1 (agora), fase 2 e 3 (futuro provável). Explique o processo de solicitação de mudança e as duas formas de contratação (avulso ou plano).',
    },
    alternativas: [
      'Pode sim! Quanto mais você me contar do que imagina, melhor eu preparo a base.',
      'Totalmente possível. Você pode orçar por função ou ter um plano mensal de evolução.',
    ],
    perguntaEstrategica: 'Que funções você imagina precisar daqui a um ano?',
    proximoPasso: 'Registre o roadmap futuro na proposta e apresente as opções de contratação de evoluções.',
    naoDizer: [
      '"Depois é só pedir" sem explicar que tem custo.',
      'Construir a base sem considerar o roadmap informado.',
      'Prometer que qualquer função futura será simples.',
    ],
    variacoes: {
      sistema: 'Roadmap + processo de mudança + plano de evolução opcional.',
      loja: 'Explique o que a plataforma permite via apps/plugins e o que exige desenvolvimento.',
      recorrente: 'Plano de melhorias com backlog priorizado mensalmente.',
    },
    relacionadas: ['pagar-cada-alteracao', 'todas-funcionalidades-ja', 'nao-sei-funcionalidades'],
    transparencia: {
      escopo: 'Funções futuras não estão no escopo atual; ficam registradas como roadmap.',
      custos: 'Explique as duas formas de contratar evoluções e seus valores.',
      manutencao: 'Diferencie evolução (nova função) de manutenção (correção e atualização).',
    },
  },
  {
    id: 'pagar-cada-alteracao',
    biblioteca: 'sistema',
    frase: 'Não quero pagar por cada alteração.',
    categoria: 'manutencao',
    gatilhos: ['alteração é cobrada', 'toda mudança custa', 'quero alterações inclusas', 'cobrar por ajuste', 'pacote de alterações'],
    resistencia: 'media',
    etapas: ['recebeu-proposta', 'objecao'],
    servicos: ['sistema', 'site', 'recorrente'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Teve experiência com fornecedor que cobrava qualquer coisa.',
      'Prevê muitas mudanças pequenas.',
      'Não entende a diferença entre correção e alteração.',
    ],
    estrategia:
      'Diferencie: correção de erro (sem custo na garantia), ajuste pequeno (pode entrar num pacote mensal) e nova funcionalidade (orçada). Ofereça um plano com horas ou número de alterações incluídas e regras claras.',
    descobrir: ['Volume esperado de alterações.', 'Experiência anterior.', 'O que ele considera "alteração".'],
    respostas: {
      curta:
        'Entendo. Funciona assim: erro do sistema eu corrijo sem custo na garantia; ajustes pequenos podem entrar num plano mensal com horas incluídas; e só funções novas são orçadas à parte. Quantas mudanças você imagina por mês?',
      consultiva:
        'Faz sentido. Que tipo de alteração você imagina pedir com frequência: textos, regras, relatórios?',
      persuasiva:
        'O ideal é ter regras claras desde o início: correção de erro não é alteração; ajustes pequenos (um campo, um texto, um filtro) entram num plano com horas mensais; funcionalidades novas são estimadas e aprovadas antes. Assim você não paga a cada detalhe e também não paga por algo que não usa. Também deixo no painel o que você mesmo pode alterar sem me chamar.',
      ligacao:
        'Entendo totalmente. Deixa eu te explicar a diferença entre correção, ajuste e nova função, porque isso resolve boa parte da preocupação.',
      reuniao:
        'Defina com ele exemplos de cada tipo (correção, ajuste, nova função). Proponha um plano mensal com horas e regras de uso (acúmulo, prazo de execução). Coloque no contrato.',
    },
    alternativas: [
      'Dá para ter um plano com horas mensais para ajustes. Só funções novas são orçadas à parte.',
      'Correção de erro não é cobrada na garantia. Para ajustes, um pacote mensal costuma sair mais em conta.',
    ],
    perguntaEstrategica: 'Nos últimos meses, quantas mudanças você precisou fazer no seu processo ou no seu sistema atual?',
    proximoPasso: 'Inclua na proposta a definição de correção/ajuste/nova função e um plano mensal opcional.',
    naoDizer: [
      'Prometer alterações ilimitadas.',
      'Cobrar correção de erro dentro da garantia.',
      'Deixar a política de alterações vaga.',
    ],
    variacoes: {
      sistema: 'Plano de horas mensais com regras claras.',
      site: 'Painel para autonomia + pacote de alterações.',
      recorrente: 'Número de alterações ou horas por mês, com prazo de execução.',
    },
    relacionadas: ['novas-funcoes-depois', 'sistema-com-erros', 'e-se-precisar-mudar'],
    transparencia: {
      manutencao: 'Defina correção, ajuste e nova função com exemplos.',
      custos: 'Valores do plano mensal e da hora avulsa por escrito.',
      escopo: 'O painel administrativo reduz a necessidade de alterações técnicas.',
    },
  },
  {
    id: 'backup',
    biblioteca: 'sistema',
    frase: 'Como será feito o backup?',
    categoria: 'sistemas',
    gatilhos: ['backup', 'cópia de segurança', 'recuperar dados', 'se apagar sem querer', 'restaurar'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'loja', 'recorrente'],
    servicosRelacionados: ['rec-monitoramento', 'rec-hospedagem'],
    objetivos: ['explicar-servico'],
    significados: [
      'Preocupação legítima com continuidade.',
      'Já perdeu dados.',
      'Quer avaliar sua seriedade técnica.',
    ],
    estrategia:
      'Responda com detalhes objetivos: frequência, retenção, local de armazenamento, quem pode restaurar, tempo estimado de restauração e teste periódico. Diferencie backup do provedor de backups adicionais.',
    descobrir: ['Quanto de perda de dados é aceitável (ex.: um dia?).', 'Se há exigência regulatória.'],
    respostas: {
      curta:
        'O banco de dados tem backup automático diário, guardado por [N] dias, em local separado do servidor principal. Se algo for apagado por engano, dá para restaurar. E faço testes periódicos de restauração, porque backup que nunca foi testado não garante nada.',
      consultiva:
        'Boa pergunta. Se vocês perdessem as informações de um dia de trabalho, qual seria o impacto? Isso define a frequência ideal do backup.',
      persuasiva:
        'O plano de backup tem: (1) cópias automáticas com frequência definida conforme o impacto de perda para vocês; (2) retenção por um período para recuperar versões anteriores; (3) armazenamento separado do servidor principal; (4) teste periódico de restauração; e (5) exportação manual que vocês podem fazer a qualquer momento. Tudo isso descrito por escrito.',
      ligacao:
        'Ótima pergunta. Te explico: com que frequência é feito, onde fica guardado e como a gente recupera se precisar.',
      reuniao:
        'Pergunte o quanto de dados eles toleram perder e quanto tempo podem ficar sem o sistema. Defina frequência e retenção com base nisso. Documente o procedimento de restauração.',
    },
    alternativas: [
      'Backup automático diário, guardado em local separado, com teste de restauração. Quer por escrito?',
      'Além do backup automático, vocês podem exportar os dados quando quiserem.',
    ],
    perguntaEstrategica: 'Quanto tempo de dados vocês aceitariam perder no pior caso: uma hora, um dia?',
    proximoPasso: 'Documente a política de backup (frequência, retenção, local, teste) na proposta.',
    naoDizer: [
      '"O servidor já faz, não precisa se preocupar" — sem verificar.',
      'Prometer recuperação instantânea sem plano.',
      'Nunca testar a restauração.',
    ],
    variacoes: {
      sistema: 'Política de backup documentada com testes de restauração.',
      loja: 'Backup de produtos, pedidos e clientes; em plataformas prontas, verifique a política do fornecedor.',
      recorrente: 'Teste mensal de restauração no plano de monitoramento.',
    },
    relacionadas: ['protecao-dados', 'medo-perder-dados', 'sistema-com-erros'],
    transparencia: {
      seguranca: 'Frequência, retenção, local separado e teste de restauração documentados.',
      custos: 'Backups adicionais ou de maior retenção podem ter custo de armazenamento.',
      manutencao: 'Teste de restauração periódico faz parte da manutenção.',
    },
  },
  {
    id: 'relatorios-personalizados',
    biblioteca: 'sistema',
    frase: 'Preciso de relatórios personalizados.',
    categoria: 'sistemas',
    gatilhos: ['relatórios', 'indicadores', 'gráficos', 'exportar relatório', 'relatório gerencial', 'dashboard'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema'],
    servicosRelacionados: ['sis-dashboards', 'sis-gestao'],
    objetivos: ['descobrir-necessidade', 'negociar-escopo'],
    significados: [
      'Precisa tomar decisões com dados.',
      'Hoje monta relatórios manualmente.',
      'Pode estar pedindo "todos os relatórios possíveis" sem prioridade.',
    ],
    estrategia:
      'Pergunte quais decisões os relatórios apoiam. Defina 3 a 5 relatórios essenciais com campos, filtros e periodicidade. Ofereça exportação para Excel como complemento flexível.',
    descobrir: ['Que decisões ele toma com relatórios.', 'Quais relatórios monta hoje e quanto tempo leva.', 'Quem consome os relatórios.'],
    respostas: {
      curta:
        'Dá, sim. Para não virar uma lista enorme, me conta quais decisões você toma olhando números — vendas por período, por vendedor, por cliente? Defino os relatórios essenciais e deixo exportação para Excel para o resto.',
      consultiva:
        'Ótimo. Qual relatório você monta hoje que mais dá trabalho? Começo por ele.',
      persuasiva:
        'Relatório bom é o que responde a uma pergunta que você faz com frequência. O caminho é definir os 3 a 5 relatórios que apoiam suas decisões principais — com filtros por período, responsável e categoria — e deixar exportação para Excel para análises pontuais. Relatórios novos podem ser incluídos depois, conforme surgirem novas perguntas.',
      ligacao:
        'Dá para fazer. Me fala quais números você mais olha no mês, que eu começo pelos relatórios que mais vão te ajudar.',
      reuniao:
        'Peça exemplos de relatórios atuais (planilhas, prints). Para cada um, defina: pergunta que responde, campos, filtros, quem acessa. Priorize. Inclua os essenciais no escopo e liste os demais como evolução.',
    },
    alternativas: [
      'Claro! Quais números você mais acompanha? Começo pelos relatórios que respondem isso.',
      'Dá para ter relatórios no sistema e exportação para Excel para análises livres.',
    ],
    perguntaEstrategica: 'Que pergunta sobre o negócio você gostaria de responder em 10 segundos?',
    proximoPasso: 'Defina os relatórios essenciais com campos e filtros, e inclua no escopo.',
    naoDizer: [
      'Aceitar "todos os relatórios" sem definir.',
      'Prometer qualquer relatório futuro sem custo.',
      'Esquecer de perguntar quem pode ver cada relatório.',
    ],
    variacoes: {
      sistema: 'Relatórios essenciais + exportação + permissões de visualização.',
      recorrente: 'Novos relatórios como parte do plano de evolução.',
    },
    relacionadas: ['controlar-em-um-painel', 'niveis-de-acesso', 'nao-sei-funcionalidades'],
    transparencia: {
      escopo: 'Liste os relatórios incluídos com campos e filtros. Outros entram como evolução.',
      prazo: 'Relatórios complexos dependem da qualidade dos dados; considere tempo de ajuste.',
    },
  },
  {
    id: 'controlar-em-um-painel',
    biblioteca: 'sistema',
    frase: 'Quero controlar tudo em um painel.',
    categoria: 'sistemas',
    gatilhos: ['tudo em um lugar', 'painel único', 'centralizar tudo', 'visão geral', 'um sistema para tudo'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema'],
    servicosRelacionados: ['sis-painel-admin', 'sis-dashboards'],
    objetivos: ['descobrir-necessidade', 'negociar-escopo'],
    significados: [
      'Cansado de usar várias ferramentas.',
      'Quer visão gerencial.',
      'Pode estar subestimando o tamanho de "tudo".',
    ],
    estrategia:
      'Entenda o que é "tudo". Mapeie ferramentas e processos atuais. Diferencie centralizar dados (integrar e mostrar num painel) de substituir todas as ferramentas (projeto muito maior). Proponha começar pela visão gerencial e pelas integrações mais valiosas.',
    descobrir: ['Quais ferramentas usa hoje.', 'Quais informações quer ver juntas.', 'O que é mais urgente centralizar.'],
    respostas: {
      curta:
        'Faz muito sentido querer tudo num lugar. Me conta: quais ferramentas e planilhas vocês usam hoje? Às vezes dá para juntar as informações num painel sem precisar substituir tudo de uma vez.',
      consultiva:
        'Quando você diz "tudo", quais são as três informações que você mais gostaria de ver juntas logo de manhã?',
      persuasiva:
        'Existem dois caminhos: substituir todas as ferramentas por um sistema único (projeto grande e longo) ou integrar o que vocês já usam e mostrar tudo num painel central (mais rápido e com menos risco). Normalmente o segundo caminho resolve a maior parte da dor, e depois dá para substituir as ferramentas que fizerem sentido, uma de cada vez.',
      ligacao:
        'Entendo, centralizar facilita muito. Quais ferramentas vocês usam hoje? Quero ver se dá para conectar antes de pensar em trocar tudo.',
      reuniao:
        'Desenhe o mapa de ferramentas atuais. Marque o que pode ser integrado e o que precisa ser substituído. Proponha o painel central como fase 1.',
    },
    alternativas: [
      'Dá para começar por um painel que junta as informações das ferramentas que vocês já usam.',
      'Quais números você quer ver todo dia? Começo o painel por eles.',
    ],
    perguntaEstrategica: 'Que informação você hoje precisa procurar em três lugares diferentes?',
    proximoPasso: 'Mapeie ferramentas atuais e proponha painel central com integrações prioritárias.',
    naoDizer: [
      'Prometer substituir tudo de uma vez.',
      'Ignorar as ferramentas que funcionam bem.',
      'Orçar "tudo" sem mapeamento.',
    ],
    variacoes: {
      sistema: 'Painel central + integrações prioritárias; substituições em fases.',
      recorrente: 'Manutenção das integrações que alimentam o painel.',
    },
    relacionadas: ['relatorios-personalizados', 'integrar-sistema-atual', 'todas-funcionalidades-ja'],
    transparencia: {
      escopo: 'Defina quais fontes de dados entram no painel na fase 1.',
      integracoes: 'Cada fonte depende de API ou exportação; verifique antes.',
      custos: 'Integrações com ferramentas pagas podem exigir planos superiores dessas ferramentas.',
    },
  },
  {
    id: 'niveis-de-acesso',
    biblioteca: 'sistema',
    frase: 'O sistema precisa ter diferentes níveis de acesso.',
    categoria: 'sistemas',
    gatilhos: ['permissões', 'perfis de usuário', 'cada um vê uma coisa', 'gerente e funcionário', 'acesso restrito', 'controle de acesso'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema'],
    servicosRelacionados: ['sis-multiusuario'],
    objetivos: ['descobrir-necessidade', 'explicar-servico'],
    significados: [
      'Equipe com funções diferentes.',
      'Preocupação com informações sensíveis (financeiro, salários).',
      'Filiais ou clientes externos acessando.',
    ],
    estrategia:
      'Mapeie papéis (quem é quem) e o que cada papel pode ver e fazer. Mantenha poucos perfis claros. Considere se há separação por filial ou cliente (dados isolados), que aumenta a complexidade.',
    descobrir: ['Quais papéis existem.', 'O que cada um pode ver, criar, editar e excluir.', 'Se há filiais/clientes com dados separados.'],
    respostas: {
      curta:
        'Perfeito, isso é importante. Me lista os tipos de pessoa que vão usar (ex.: dono, gerente, atendente) e o que cada um precisa ver ou fazer. Com isso eu defino os perfis.',
      consultiva:
        'Ótimo. Tem alguma informação que só você deve ver, como financeiro ou comissões?',
      persuasiva:
        'Níveis de acesso protegem a empresa e simplificam a vida da equipe: cada um vê só o que precisa. O ideal é ter poucos perfis bem definidos, com uma tabela simples de quem pode ver, criar, editar e excluir cada coisa. Se houver filiais ou clientes externos, os dados de cada um ficam isolados — o que precisa ser previsto desde o início.',
      ligacao:
        'Faz todo sentido. Me conta quem vai usar e o que cada pessoa pode fazer, que eu monto os perfis.',
      reuniao:
        'Monte com ele uma matriz de permissões (perfis × ações × módulos). Valide com casos reais ("o atendente pode dar desconto?"). Inclua a matriz no escopo.',
    },
    alternativas: [
      'Dá sim! Me passa os tipos de usuário e o que cada um faz, que eu monto a tabela de permissões.',
      'Perfeito. Poucos perfis bem definidos funcionam melhor do que muitas opções.',
    ],
    perguntaEstrategica: 'Que informação, se um funcionário visse, poderia causar problema?',
    proximoPasso: 'Defina uma matriz de permissões por perfil e inclua no escopo.',
    naoDizer: [
      'Criar dezenas de permissões granulares sem necessidade.',
      'Deixar todo mundo como administrador "para facilitar".',
      'Ignorar isolamento de dados entre filiais/clientes.',
    ],
    variacoes: {
      sistema: 'Matriz de permissões + isolamento por filial/cliente quando necessário.',
      loja: 'Perfis para quem cadastra produtos, quem atende pedidos e quem vê financeiro.',
    },
    relacionadas: ['acesso-admin-completo', 'protecao-dados', 'funcionarios-nao-sabem'],
    transparencia: {
      escopo: 'Matriz de permissões definida no escopo; novos perfis depois são evolução.',
      seguranca: 'Permissões verificadas no servidor (não apenas escondendo botões na tela).',
    },
  },
  {
    id: 'integrar-pagamentos',
    biblioteca: 'sistema',
    frase: 'Quero integrar pagamentos.',
    categoria: 'sistemas',
    gatilhos: ['pix automático', 'cartão de crédito', 'cobrança online', 'gateway', 'boleto', 'link de pagamento', 'recorrência'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'loja'],
    servicosRelacionados: ['loja-checkout', 'sis-assinaturas'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Quer receber online e automatizar a confirmação.',
      'Quer cobrança recorrente.',
      'Não sabe que existem taxas e regras dos intermediadores.',
    ],
    estrategia:
      'Explique que a integração é feita com um intermediador de pagamento (que processa cartão/Pix e cuida da segurança dos dados de cartão). Defina meios de pagamento, fluxo (avulso, recorrente, divisão), confirmação automática e estornos. Informe taxas e prazos de recebimento do intermediador escolhido.',
    descobrir: ['Meios de pagamento desejados.', 'Se é avulso ou recorrente.', 'Se já tem conta em algum intermediador.'],
    respostas: {
      curta:
        'Dá, sim. A integração é feita com um intermediador de pagamento, que processa Pix e cartão e confirma automaticamente no sistema. Você já tem conta em algum? E vai ser cobrança avulsa ou recorrente?',
      consultiva:
        'Ótimo. Como seus clientes preferem pagar hoje, e é cobrança única ou mensal?',
      persuasiva:
        'Integrar pagamentos tira a conferência manual do seu dia: o cliente paga, o sistema recebe a confirmação e atualiza o pedido ou a assinatura sozinho. Os dados de cartão ficam com o intermediador, não no seu sistema — o que reduz risco. Antes, vale comparar taxas e prazos de recebimento entre intermediadores; eu te ajudo a escolher e a integração fica no escopo com testes de pagamento, estorno e falha.',
      ligacao:
        'Dá para integrar. Me conta como você quer cobrar — Pix, cartão, mensalidade — que eu te digo o caminho e os custos envolvidos.',
      reuniao:
        'Defina meios, fluxos (pagamento, falha, estorno, cancelamento de assinatura), notificações e conciliação. Compare intermediadores por taxa, prazo e recursos. Inclua cenários de teste no escopo.',
    },
    alternativas: [
      'Integra sim! Pix e cartão com confirmação automática. Você já tem conta em algum intermediador?',
      'Dá para integrar. Só vale comparar as taxas antes de escolher o intermediador. Te ajudo nisso.',
    ],
    perguntaEstrategica: 'Quanto tempo vocês gastam hoje conferindo pagamentos manualmente?',
    proximoPasso: 'Escolha do intermediador com o cliente e definição dos fluxos de pagamento no escopo.',
    naoDizer: [
      'Armazenar dados de cartão no próprio sistema.',
      'Omitir taxas e prazos do intermediador.',
      'Não testar estorno e falha de pagamento.',
    ],
    variacoes: {
      sistema: 'Integração via API do intermediador com webhooks de confirmação.',
      loja: 'Checkout com Pix e cartão; plataformas prontas costumam ter integração nativa.',
      recorrente: 'Manutenção quando o intermediador atualizar a API.',
    },
    relacionadas: ['integrar-whatsapp', 'integrar-sistema-atual', 'protecao-dados'],
    transparencia: {
      integracoes: 'Integração com intermediador via API e webhooks; teste de pagamento, falha e estorno.',
      custos: 'Taxas por transação e prazos de recebimento do intermediador, pagos pelo cliente.',
      seguranca: 'Dados de cartão processados e armazenados pelo intermediador, não pelo sistema.',
    },
  },
  {
    id: 'integrar-whatsapp',
    biblioteca: 'sistema',
    frase: 'Quero integrar WhatsApp ou outros serviços.',
    categoria: 'sistemas',
    gatilhos: ['mandar mensagem automática', 'whatsapp automático', 'chatbot', 'integrar e-mail', 'notificação no whatsapp', 'api do whatsapp'],
    resistencia: 'baixa',
    etapas: ['interesse', 'recebeu-proposta'],
    servicos: ['sistema', 'site', 'loja'],
    servicosRelacionados: ['rec-integracoes-api', 'site-whatsapp'],
    objetivos: ['explicar-servico', 'negociar-escopo'],
    significados: [
      'Quer automatizar lembretes, confirmações e avisos.',
      'Imagina um chatbot que atenda sozinho.',
      'Não sabe das regras e custos da API oficial.',
    ],
    estrategia:
      'Diferencie: (1) botão/link que abre o WhatsApp (simples, sem custo); (2) envio automático via API oficial do WhatsApp Business (exige aprovação, modelos de mensagem e custo por conversa); (3) soluções não oficiais (risco de bloqueio do número — não recomende). Para outros serviços (e-mail, SMS, agenda), verifique APIs e custos.',
    descobrir: ['Que mensagens precisam ser automáticas.', 'Volume mensal.', 'Se o número é o mesmo usado no atendimento.'],
    respostas: {
      curta:
        'Dá, e existem jeitos diferentes. O mais simples é um botão que abre o WhatsApp com a mensagem pronta (sem custo). Para envio automático, como lembretes, usamos a API oficial do WhatsApp Business, que tem regras de aprovação e custo por conversa. Que mensagens você quer automatizar?',
      consultiva:
        'Legal! Você quer mandar avisos automáticos (lembrete, confirmação) ou ter um atendimento automatizado respondendo dúvidas?',
      persuasiva:
        'Automatizar mensagens pode economizar muito tempo, mas precisa ser feito do jeito certo. A API oficial do WhatsApp Business exige cadastro e aprovação de modelos de mensagem e cobra por conversa — vale incluir esse custo na conta. Soluções não oficiais existem, mas violam os termos do WhatsApp e podem levar ao bloqueio do número, então não recomendo. Com o volume e as mensagens definidos, te passo a viabilidade e o custo mensal estimado.',
      ligacao:
        'Dá para integrar. Só quero te explicar as opções, porque cada uma tem regras e custos diferentes, e eu não quero que você corra risco de ter o número bloqueado.',
      reuniao:
        'Liste as mensagens desejadas (gatilho, conteúdo, destinatário). Classifique: link simples, notificação via API oficial, atendimento automatizado. Estime volume e custo. Explique o processo de aprovação de modelos.',
    },
    alternativas: [
      'Integra sim! Para lembretes automáticos, uso a API oficial — tem custo por conversa, mas é seguro para o seu número.',
      'O botão com mensagem pronta é simples e gratuito. Automação de envio tem regras e custo. Quer ver as duas?',
    ],
    perguntaEstrategica: 'Que mensagem você ou sua equipe enviam manualmente dezenas de vezes por semana?',
    proximoPasso: 'Defina mensagens, volume e canal; apresente viabilidade e custo recorrente estimado.',
    naoDizer: [
      'Recomendar automação não oficial sem avisar do risco de bloqueio.',
      'Omitir o custo por conversa da API oficial.',
      'Prometer um chatbot que "atende tudo sozinho".',
    ],
    variacoes: {
      sistema: 'Notificações via API oficial com modelos aprovados; outros serviços via API.',
      site: 'Botões de WhatsApp com mensagem pré-preenchida, sem custo.',
      loja: 'Confirmação de pedido por e-mail e, opcionalmente, WhatsApp via API oficial.',
    },
    relacionadas: ['integrar-pagamentos', 'integrar-sistema-atual', 'clientes-chegam-whatsapp'],
    transparencia: {
      integracoes: 'API oficial do WhatsApp Business: aprovação de modelos e regras de envio. Outras APIs: verificar documentação.',
      custos: 'Custo por conversa da API oficial e de provedores de e-mail/SMS, pagos pelo cliente.',
      manutencao: 'Mudanças de regras das plataformas exigem ajustes; inclua no plano.',
    },
  },
  {
    id: 'parecido-concorrente',
    biblioteca: 'sistema',
    frase: 'Preciso de um sistema parecido com um concorrente.',
    categoria: 'sistemas',
    gatilhos: ['igual ao concorrente', 'parecido com', 'clone de', 'quero um igual ao', 'copiar o sistema de'],
    resistencia: 'baixa',
    etapas: ['interesse', 'respondeu'],
    servicos: ['sistema', 'site', 'loja'],
    objetivos: ['descobrir-necessidade', 'negociar-escopo'],
    significados: [
      'Usa o concorrente como referência do que quer.',
      'Subestima o tamanho do sistema do concorrente.',
      'Quer competir com a mesma experiência.',
    ],
    estrategia:
      'Use o concorrente como referência, não como escopo. Pergunte o que exatamente ele admira (funções, experiência, visual). Lembre que você vê só a parte externa. Defina o essencial para o negócio dele e evite copiar marca, textos ou design protegido.',
    descobrir: ['O que ele admira no concorrente.', 'O que o concorrente faz que ele não precisa.', 'O diferencial que ele quer ter.'],
    respostas: {
      curta:
        'Ótimo ter uma referência, ajuda muito! O que você mais gosta no sistema deles? Assim a gente pega o que faz sentido para você e já pensa no que pode ser diferente.',
      consultiva:
        'Legal! Das coisas que o sistema deles faz, quais você usaria de verdade no seu dia a dia?',
      persuasiva:
        'Referência é ótima para alinhar expectativa. Só tenho dois cuidados: primeiro, a gente vê apenas a parte de fora do sistema deles — por trás pode haver anos de desenvolvimento, então vale focar no que é essencial para você; segundo, a ideia é se inspirar nas funções, não copiar marca, textos ou visual. Com isso definido, dá para construir algo que atenda o seu processo e até ter um diferencial que eles não têm.',
      ligacao:
        'Ótimo ter um exemplo. Me conta o que você mais admira nele, que eu te ajudo a separar o essencial do que pode vir depois.',
      reuniao:
        'Naveguem juntos no sistema de referência (parte pública). Liste as funções e classifique: essencial / desejável / desnecessário. Pergunte qual seria o diferencial dele. Defina MVP a partir do essencial.',
    },
    alternativas: [
      'Ajuda muito ter referência! Vamos separar o que é essencial para você do que é "legal de ter"?',
      'Dá para se inspirar sim. E se a gente pensar também no que você faria melhor que eles?',
    ],
    perguntaEstrategica: 'O que você faria diferente — ou melhor — que o concorrente?',
    proximoPasso: 'Classifique as funções da referência e defina o MVP a partir do essencial.',
    naoDizer: [
      'Prometer "igualzinho" sem conhecer o sistema por dentro.',
      'Copiar marca, textos ou design protegido.',
      'Orçar com base apenas na aparência.',
    ],
    variacoes: {
      sistema: 'Referência para escopo; MVP com o essencial e diferencial próprio.',
      site: 'Inspiração em estrutura e funcionalidades, com identidade própria.',
      loja: 'Referência de experiência de compra, ajustada ao catálogo e logística dele.',
    },
    relacionadas: ['nao-sei-funcionalidades', 'todas-funcionalidades-ja', 'sistema-preco-de-site'],
    transparencia: {
      escopo: 'A referência orienta, mas o escopo é definido pelas necessidades do cliente.',
      propriedade: 'Não reproduza marca, textos, imagens ou design de terceiros.',
      prazo: 'Sistemas de referência podem ter anos de evolução; ajuste a expectativa de prazo.',
    },
  },
  {
    id: 'precisa-sistema-proprio',
    biblioteca: 'sistema',
    frase: 'Não sei se minha empresa precisa de um sistema próprio.',
    categoria: 'sistemas',
    gatilhos: ['será que preciso de sistema', 'vale a pena sistema próprio', 'sistema próprio ou pronto', 'não sei se compensa sistema'],
    resistencia: 'baixa',
    etapas: ['respondeu', 'interesse'],
    servicos: ['sistema'],
    objetivos: ['descobrir-necessidade', 'reuniao'],
    significados: [
      'Dúvida honesta: quer orientação, não venda.',
      'Viu concorrentes com sistemas e ficou em dúvida.',
      'Tem dores operacionais, mas não sabe se sistema é a solução.',
    ],
    estrategia:
      'Atue como consultor. Use critérios objetivos: o processo é diferencial? Há volume que justifique? Ferramentas prontas atendem? Há orçamento para manutenção? Se a resposta indicar ferramenta pronta, recomende — isso gera confiança e indicações.',
    descobrir: ['Processos que mais doem.', 'Ferramentas já testadas.', 'Volume e crescimento esperado.'],
    respostas: {
      curta:
        'Ótima dúvida, e a resposta pode ser "não precisa". Alguns sinais de que faz sentido: o processo é muito específico, nenhum software pronto atende bem, há muito retrabalho ou várias planilhas que não conversam. Algum desses acontece aí?',
      consultiva:
        'Boa pergunta. Qual processo hoje mais consome tempo ou gera erro na empresa?',
      persuasiva:
        'Sistema próprio faz sentido quando: (1) o processo é um diferencial do negócio; (2) ferramentas prontas exigem muitas adaptações ou ficam caras com o crescimento; (3) há volume e retrabalho suficientes para justificar; (4) a empresa consegue manter o sistema. Se não for o caso, uma ferramenta pronta bem configurada pode ser a melhor escolha. Posso fazer essa análise com você e te dizer com sinceridade.',
      ligacao:
        'Ótima pergunta, e eu prefiro te ajudar a decidir do que te vender algo. Posso te fazer algumas perguntas rápidas para a gente avaliar juntos?',
      reuniao:
        'Aplique um checklist de decisão (diferencial, aderência de prontos, volume, manutenção, orçamento). Mostre o resultado com honestidade. Se indicar ferramenta pronta, ofereça ajuda na implantação.',
    },
    alternativas: [
      'Vamos descobrir juntos? Te faço 4 perguntas e a gente vê se compensa sistema próprio ou ferramenta pronta.',
      'Pode ser que uma ferramenta pronta resolva. Me conta o processo que mais dá trabalho hoje.',
    ],
    perguntaEstrategica: 'O jeito como vocês fazem esse processo é um diferencial em relação aos concorrentes?',
    proximoPasso: 'Proponha uma conversa de diagnóstico com checklist de decisão.',
    naoDizer: [
      '"Toda empresa precisa de sistema próprio" — falso.',
      'Ignorar alternativas prontas.',
      'Transformar o diagnóstico em pressão de venda.',
    ],
    variacoes: {
      sistema: 'Diagnóstico com critérios objetivos; MVP se fizer sentido.',
      recorrente: 'Implantação e configuração de ferramenta pronta como serviço.',
    },
    relacionadas: ['nao-sei-funcionalidades', 'software-pronto', 'planilha-ja-resolve'],
    transparencia: {
      custos: 'Mostre o custo total do sistema próprio (desenvolvimento + infraestrutura + manutenção) ao lado do pronto.',
      manutencao: 'Sistema próprio exige manutenção contínua; a empresa precisa estar preparada.',
      escopo: 'O diagnóstico define se há escopo para um sistema próprio.',
    },
  },
];
