import type { Niche } from '../../types';

export const PROFISSIONAIS: Niche[] = [
  {
    id: 'corretores-de-imoveis',
    nome: 'Corretores de imóveis',
    categoria: 'profissionais',
    resumo:
      'Autônomo ou associado a imobiliária, vive de captação de imóveis e de leads compradores. Depende muito dos portais imobiliários, que cobram por anúncio. Relacionamento e velocidade de resposta definem quem fecha. O ciclo de venda é longo e o ticket, alto.',
    comoClientesChegam: ['Portais imobiliários', 'Indicação', 'Instagram com tours de imóveis', 'Placas e captação ativa'],
    dores: [
      'Custo e dependência dos portais',
      'Leads frios que pedem informação e somem',
      'Carteira de imóveis espalhada em mensagens e pastas',
    ],
    solucoes: [
      { servico: 'sis-imobiliaria', porque: 'Site com a carteira do corretor, filtros e formulário de interesse por imóvel.' },
      { servico: 'lp-autonomo', porque: 'Página pessoal com especialidade, região de atuação e CRECI.' },
      { servico: 'sis-crm', porque: 'Acompanhamento de leads compradores e proprietários.' },
    ],
    argumentos: [
      'No seu site, o comprador vê só os seus imóveis, sem o concorrente ao lado como no portal.',
      'Cada contato chega associado ao imóvel de interesse.',
      'CRM evita perder lead quente no meio de dezenas de conversas.',
    ],
    perguntas: ['Quanto investe nos portais por mês?', 'Quantos imóveis tem na carteira?', 'Como acompanha seus leads hoje?'],
    objecoes: [
      {
        id: 'portais-ja-trazem',
        frase: 'Já uso portais imobiliários.',
        porTras: 'Canal principal de leads.',
        resposta:
          'E faz sentido continuar. O site próprio é onde você manda quem chegou por indicação, Instagram ou placa — e onde o cliente vê só a sua carteira. Quanto você investe nos portais hoje?',
        pergunta: 'Quantos dos seus fechamentos vieram de fora dos portais?',
        proximoPasso: 'Proponha site com carteira própria convivendo com os portais.',
      },
      {
        id: 'carteira-pequena',
        frase: 'Minha carteira é pequena.',
        porTras: 'Acha que não justifica.',
        resposta:
          'Carteira pequena bem apresentada vale muito. Você pode destacar especialidade e região, e cada imóvel ganha uma página própria para compartilhar. Qual é a sua região de atuação?',
        pergunta: 'Em que tipo de imóvel e região você é especialista?',
        proximoPasso: 'Proponha página pessoal com especialidade e imóveis em destaque.',
      },
      {
        id: 'cadastro-duplo',
        frase: 'Cadastrar imóvel em dois lugares dá trabalho.',
        porTras: 'Tempo operacional.',
        resposta:
          'Dá mesmo. Vale verificar se dá para cadastrar uma vez e exportar para os portais que aceitam integração. Quais portais você usa?',
        pergunta: 'Quanto tempo você leva para cadastrar um imóvel?',
        proximoPasso: 'Verifique formatos de integração dos portais antes de prometer.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quando você manda um imóvel para um cliente, manda fotos soltas ou um link?' },
      { autor: 'cliente', texto: 'Mando o link do portal.' },
      { autor: 'vendedor', texto: 'E no portal ele vê imóveis de outros corretores logo ao lado, né? Com um site seu, ele navega só na sua carteira. Quer ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com o investimento mensal em portais e com a comissão de uma única venda.',
      necessidade: 'Carteira própria, leads associados ao imóvel e independência dos portais.',
      confianca: 'CRECI, especialidade regional e apresentação profissional.',
      prazo: 'Antes de lançamentos ou da captação de novos imóveis.',
    },
    cuidados: ['Anúncios de imóveis devem conter o número de inscrição no CRECI do corretor.', 'Use fotos e descrições autorizadas pelo proprietário.'],
    aberturaProspeccao: 'Quando você envia um imóvel para um cliente, manda o link do portal ou de uma página sua?',
  },
  {
    id: 'imobiliarias',
    nome: 'Imobiliárias',
    categoria: 'profissionais',
    resumo:
      'Venda e locação com equipe de corretores, carteira grande e administração de aluguéis. Precisa de busca de imóveis eficiente, distribuição de leads entre corretores e, na locação, gestão de contratos, vistorias e repasses.',
    comoClientesChegam: ['Portais', 'Site próprio', 'Placas', 'Indicação de proprietários'],
    dores: [
      'Leads distribuídos sem controle entre corretores',
      'Site desatualizado em relação à carteira',
      'Atendimento a proprietários e inquilinos sobrecarregado',
    ],
    solucoes: [
      { servico: 'sis-imobiliaria', porque: 'Busca por filtros, painel de imóveis e exportação para portais (quando suportado).' },
      { servico: 'sis-crm', porque: 'Distribuição e acompanhamento de leads por corretor.' },
      { servico: 'sis-membros', porque: 'Área do proprietário e do inquilino com documentos e repasses.' },
    ],
    argumentos: [
      'Lead distribuído e acompanhado vira venda; lead esquecido vira venda do concorrente.',
      'Busca bem feita no site mantém o cliente navegando na sua carteira.',
      'Área do proprietário reduz ligações sobre repasses e documentos.',
    ],
    perguntas: ['Quantos corretores e quantos imóveis?', 'Como os leads são distribuídos?', 'Vocês administram locações?'],
    objecoes: [
      {
        id: 'ja-tem-sistema-imobiliario',
        frase: 'Já usamos um sistema imobiliário.',
        porTras: 'Software do setor adotado.',
        resposta:
          'Ótimo. Nesse caso a pergunta é o que ele não resolve bem: site, distribuição de leads, área do proprietário? Às vezes o melhor é complementar, não trocar.',
        pergunta: 'O que o sistema atual não resolve?',
        proximoPasso: 'Mapeie lacunas e proponha complemento ou integração.',
      },
      {
        id: 'corretores-nao-alimentam',
        frase: 'Os corretores não alimentam o CRM.',
        porTras: 'Problema de adoção.',
        resposta:
          'É o maior desafio de todo CRM. A solução é exigir o mínimo e dar algo em troca: lembretes, leads novos só para quem atualiza. O que eles mais reclamam hoje?',
        pergunta: 'O que faria o corretor querer usar o sistema?',
        proximoPasso: 'Proponha CRM enxuto com regras de distribuição que incentivem o uso.',
      },
      {
        id: 'portal-traz-tudo',
        frase: 'O portal traz quase todos os leads.',
        porTras: 'Dependência.',
        resposta:
          'E o custo do portal sobe todo ano, né? O site próprio bem posicionado reduz essa dependência ao longo do tempo. Quanto vocês investem por mês?',
        pergunta: 'Quanto representa o portal no orçamento de marketing?',
        proximoPasso: 'Proponha site + SEO local como estratégia de médio prazo.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como os leads que chegam são distribuídos entre os corretores?' },
      { autor: 'cliente', texto: 'A secretária repassa pelo WhatsApp.' },
      { autor: 'vendedor', texto: 'E vocês conseguem saber quais foram atendidos e quais viraram visita? Um CRM simples mostra isso. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com o custo dos portais e com a comissão de uma venda perdida por lead esquecido.',
      necessidade: 'Distribuição de leads, carteira atualizada e atendimento a proprietários.',
      confianca: 'Integrações verificadas, CRECI da imobiliária e segurança de documentos.',
      prazo: 'Antes de campanhas de captação ou da entrada de novos corretores.',
    },
    cuidados: ['Inclua o CRECI jurídico da imobiliária nos anúncios.', 'Documentos de locação contêm dados pessoais: proteja o acesso.'],
    aberturaProspeccao: 'Como os leads que chegam para vocês são distribuídos e acompanhados entre os corretores?',
  },
  {
    id: 'advogados',
    nome: 'Advogados',
    categoria: 'profissionais',
    resumo:
      'Escritórios e advogados autônomos com áreas de atuação definidas. Clientes buscam informação e confiança em momentos delicados. A publicidade é regulada pela OAB (Provimento 205/2021): conteúdo informativo é permitido, captação mercantilizada não.',
    comoClientesChegam: ['Indicação', 'Busca por tema jurídico (ex.: "aposentadoria negada")', 'Conteúdo informativo nas redes', 'Parceiros (contadores)'],
    dores: ['Comunicar áreas de atuação respeitando a OAB', 'Triagem de casos que não são da área', 'Atendimento inicial repetitivo'],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Uma página por área de atuação, com conteúdo informativo.' },
      { servico: 'site-seo', porque: 'Artigos informativos sobre dúvidas comuns atraem quem pesquisa o tema.' },
      { servico: 'site-formulario-orcamento', porque: 'Formulário de triagem para agendamento de consulta.' },
    ],
    argumentos: [
      'Conteúdo informativo é permitido e é exatamente o que o cliente pesquisa.',
      'Triagem por área evita gastar tempo com casos que não são do escritório.',
      'Site sóbrio com equipe e áreas transmite a seriedade que o cliente busca.',
    ],
    perguntas: ['Quais áreas de atuação?', 'Que tipo de caso você mais quer atender?', 'Quantos contatos não são da sua área?'],
    objecoes: [
      {
        id: 'oab-proibe',
        frase: 'A OAB não deixa fazer propaganda.',
        porTras: 'Receio ético.',
        resposta:
          'A OAB proíbe mercantilização e captação indevida, mas permite conteúdo informativo, desde que sóbrio. O site segue isso: áreas de atuação, conteúdos e contato, sem preço, sem promessa de resultado. Você valida tudo antes.',
        pergunta: 'Que dúvidas jurídicas seus clientes mais trazem?',
        proximoPasso: 'Proponha estrutura informativa alinhada ao Provimento 205/2021.',
      },
      {
        id: 'indicacao-escritorio',
        frase: 'Meu escritório vive de indicação.',
        porTras: 'Modelo tradicional.',
        resposta:
          'E a indicação continua sendo o principal. O cliente indicado vai pesquisar seu nome antes de ligar. O que ele encontra hoje?',
        pergunta: 'Se o cliente indicado pesquisar seu nome, o que aparece?',
        proximoPasso: 'Pesquise junto e proponha site institucional sóbrio.',
      },
      {
        id: 'sem-tempo-conteudo',
        frase: 'Não tenho tempo para escrever artigos.',
        porTras: 'Rotina intensa.',
        resposta:
          'Dá para começar sem artigos: áreas de atuação bem explicadas já resolvem muito. Conteúdo pode vir depois, com um ritmo leve.',
        pergunta: 'Quais perguntas você responde toda semana em consultas?',
        proximoPasso: 'Proponha site sem blog na fase 1.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá, doutor(a)! Quando um cliente indicado pesquisa seu nome antes de ligar, o que ele encontra hoje?' },
      { autor: 'cliente', texto: 'Acho que só o perfil da OAB e o Instagram.' },
      { autor: 'vendedor', texto: 'Um site sóbrio com áreas de atuação e equipe, dentro das regras da OAB, ajuda essa pessoa a confiar antes do primeiro contato. Posso mostrar um modelo?' },
    ],
    angulos: {
      preco: 'Compare com os honorários de um único caso.',
      necessidade: 'Ser encontrado por quem pesquisa e confirmar a confiança da indicação.',
      confianca: 'Sobriedade, OAB, áreas claras e sem promessas.',
      prazo: 'Antes de mudanças de área de atuação ou abertura de escritório.',
    },
    cuidados: [
      'Siga o Provimento 205/2021 da OAB: conteúdo informativo e sóbrio; sem menção a valores de honorários, promessas de resultado ou captação ativa de clientela.',
    ],
    aberturaProspeccao: 'Quando um cliente indicado pesquisa o seu nome antes de ligar, o que ele encontra hoje?',
  },
  {
    id: 'contabilidade',
    nome: 'Escritórios de contabilidade',
    categoria: 'profissionais',
    resumo:
      'Atendem empresas com mensalidade recorrente: abertura de empresa, MEI, folha, impostos, declarações. Muito volume de documentos trocados por WhatsApp e e-mail. Concorrência com contabilidades online de preço baixo.',
    comoClientesChegam: ['Indicação', 'Busca por "abrir empresa" e "contador para MEI"', 'Parcerias'],
    dores: ['Documentos enviados por WhatsApp, perdidos em conversas', 'Clientes que esquecem prazos', 'Comparação com contabilidade online barata'],
    solucoes: [
      { servico: 'sis-membros', porque: 'Portal do cliente para envio e download de documentos e guias.' },
      { servico: 'site-paginas-servicos', porque: 'Páginas por serviço (abertura, MEI, folha) com explicação clara.' },
      { servico: 'lp-captacao', porque: 'Página de abertura de empresa para captar novos clientes.' },
    ],
    argumentos: [
      'Portal de documentos acaba com o "você recebeu a nota?" no WhatsApp.',
      'Atendimento consultivo bem apresentado se diferencia da contabilidade online.',
      'Página de abertura de empresa capta quem está começando e vira cliente recorrente.',
    ],
    perguntas: ['Quantos clientes ativos?', 'Como recebem documentos?', 'Abrem muitas empresas por mês?'],
    objecoes: [
      {
        id: 'cliente-manda-whatsapp',
        frase: 'Meus clientes mandam tudo pelo WhatsApp.',
        porTras: 'Hábito difícil de mudar.',
        resposta:
          'Hábito forte, eu sei. O portal pode começar com as guias que vocês enviam: o cliente acessa quando precisa. Com o tempo, o envio de documentos migra. Quanto tempo a equipe gasta procurando arquivos em conversas?',
        pergunta: 'Quantas vezes por semana alguém procura um documento antigo no WhatsApp?',
        proximoPasso: 'Proponha portal começando pelo envio de guias.',
      },
      {
        id: 'contabilidade-online-barata',
        frase: 'Não consigo competir com contabilidade online.',
        porTras: 'Pressão de preço.',
        resposta:
          'Em preço, talvez não. Mas em atendimento consultivo, sim. O site precisa comunicar isso: quem é o contador, como ele atende, o que está incluso. Qual é o seu diferencial?',
        pergunta: 'O que seus clientes mais valorizam no seu atendimento?',
        proximoPasso: 'Construa a página em torno do diferencial consultivo.',
      },
      {
        id: 'ja-tem-software-contabil',
        frase: 'O software contábil já tem portal.',
        porTras: 'Ferramenta existente.',
        resposta:
          'Ótimo, então não faz sentido duplicar. O foco pode ser o site para captar novos clientes e explicar os serviços. Os clientes usam esse portal?',
        pergunta: 'Os clientes usam o portal do software?',
        proximoPasso: 'Foque em site institucional e captação.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como os clientes enviam notas e documentos para vocês hoje?' },
      { autor: 'cliente', texto: 'WhatsApp e e-mail, uma bagunça.' },
      { autor: 'vendedor', texto: 'Um portal simples, onde cada cliente envia e baixa documentos, organiza isso. Dá para começar só pelas guias. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com a mensalidade de poucos clientes novos e com horas da equipe procurando documentos.',
      necessidade: 'Organização de documentos e diferenciação consultiva.',
      confianca: 'CRC, equipe e segurança de documentos.',
      prazo: 'Antes de períodos de declaração (IR) e do início do ano fiscal.',
    },
    cuidados: ['Documentos fiscais têm dados sensíveis: controle de acesso por cliente.', 'Inclua o registro no CRC.'],
    aberturaProspeccao: 'Como os clientes enviam notas e documentos para vocês hoje?',
  },
  {
    id: 'consultorias',
    nome: 'Consultorias empresariais',
    categoria: 'profissionais',
    resumo:
      'Vendem conhecimento (gestão, finanças, RH, processos, marketing) para empresas. Venda consultiva de ticket alto, baseada em autoridade, casos e método. Ciclo longo e decisão de sócios ou diretoria.',
    comoClientesChegam: ['Indicação', 'LinkedIn', 'Palestras e eventos', 'Conteúdo'],
    dores: ['Comunicar o método e os resultados sem prometer', 'Gerar autoridade', 'Organizar o pipeline comercial'],
    solucoes: [
      { servico: 'site-profissional', porque: 'Apresentação de método, serviços, casos e equipe.' },
      { servico: 'lp-captacao', porque: 'Material educativo (diagnóstico, guia) em troca de contato.' },
      { servico: 'sis-crm', porque: 'Pipeline de propostas e acompanhamento.' },
    ],
    argumentos: [
      'Método explicado no site prepara o cliente para valorizar a proposta.',
      'Casos (com autorização) valem mais que adjetivos.',
      'Material educativo atrai empresas no momento de busca.',
    ],
    perguntas: ['Qual é o método?', 'Quem é o cliente ideal?', 'Quantas propostas em aberto?'],
    objecoes: [
      {
        id: 'linkedin-basta',
        frase: 'Meu LinkedIn é suficiente.',
        porTras: 'Autoridade pessoal construída.',
        resposta:
          'Ótimo canal. O site complementa com o que não cabe no perfil: método detalhado, serviços e casos organizados. Quando o diretor de uma empresa quer te avaliar, o que ele vê?',
        pergunta: 'O que um decisor encontra quando pesquisa sua consultoria?',
        proximoPasso: 'Proponha site com método e casos.',
      },
      {
        id: 'resultados-confidenciais',
        frase: 'Meus resultados são confidenciais.',
        porTras: 'Sigilo com clientes.',
        resposta:
          'Faz sentido. Dá para apresentar casos anonimizados ("indústria de médio porte do setor X") e o método. Isso respeita o sigilo e mostra experiência.',
        pergunta: 'Algum cliente autorizaria depoimento?',
        proximoPasso: 'Estruture casos anonimizados.',
      },
      {
        id: 'venda-pessoal',
        frase: 'Consultoria se vende pessoalmente.',
        porTras: 'Venda relacional.',
        resposta:
          'Concordo. O site não vende sozinho: ele dá suporte ao que você diz na reunião e reforça a credibilidade depois dela. O que você costuma enviar após a primeira conversa?',
        pergunta: 'O que o cliente recebe após a primeira reunião?',
        proximoPasso: 'Proponha site como apoio à venda pessoal.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Depois da primeira reunião, o que o decisor da empresa recebe para conhecer melhor sua consultoria?' },
      { autor: 'cliente', texto: 'Mando uma apresentação em PDF.' },
      { autor: 'vendedor', texto: 'Um site com método, serviços e casos faz esse papel e ainda atrai quem pesquisa. Quer ver uma estrutura?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um contrato de consultoria.',
      necessidade: 'Autoridade, método e pipeline organizado.',
      confianca: 'Casos (anonimizados quando necessário) e equipe qualificada.',
      prazo: 'Antes de eventos, palestras ou lançamento de novo serviço.',
    },
    cuidados: ['Não prometa resultados financeiros específicos; apresente casos com autorização.'],
    aberturaProspeccao: 'Depois da primeira reunião, o que um decisor recebe para conhecer melhor a consultoria de vocês?',
  },
  {
    id: 'seguradoras',
    nome: 'Seguradoras e corretoras de seguros',
    categoria: 'profissionais',
    resumo:
      'Corretoras que vendem seguros de várias seguradoras (auto, vida, residencial, empresarial) com renovação anual. Cotação depende de muitos dados. Relacionamento e atendimento no sinistro fidelizam.',
    comoClientesChegam: ['Indicação', 'Renovação de clientes', 'Busca por cotação', 'Parcerias (concessionárias, imobiliárias)'],
    dores: ['Cotações com muitos dados por WhatsApp', 'Renovações esquecidas', 'Comparação com seguradoras diretas online'],
    solucoes: [
      { servico: 'site-formulario-orcamento', porque: 'Formulário de cotação por tipo de seguro com dados necessários.' },
      { servico: 'sis-crm', porque: 'Controle de renovações com lembretes antecipados.' },
      { servico: 'site-paginas-servicos', porque: 'Página por tipo de seguro explicando coberturas.' },
    ],
    argumentos: [
      'Renovação lembrada com antecedência é cliente mantido.',
      'Cotação com dados completos sai mais rápida e precisa.',
      'Explicar coberturas em linguagem simples diferencia o corretor consultivo.',
    ],
    perguntas: ['Quantas apólices renovam por mês?', 'Como controlam as renovações?', 'Quais seguros mais vendem?'],
    objecoes: [
      {
        id: 'sistema-calculo',
        frase: 'Já uso o multicálculo das seguradoras.',
        porTras: 'Ferramentas do setor.',
        resposta:
          'Ótimo para cotar. O que costuma faltar é a entrada (formulário com dados completos) e o controle de renovações. Como vocês lembram as renovações hoje?',
        pergunta: 'Quantas renovações foram perdidas no último ano?',
        proximoPasso: 'Proponha formulário de cotação + controle de renovações.',
      },
      {
        id: 'cliente-compra-preco',
        frase: 'Cliente compra o mais barato.',
        porTras: 'Pressão de preço.',
        resposta:
          'Muitos, sim. O site pode mostrar o que o corretor faz no sinistro, que é quando o cliente sente diferença. Você tem histórias de atendimento em sinistro?',
        pergunta: 'Como você ajuda o cliente na hora do sinistro?',
        proximoPasso: 'Inclua página sobre atendimento em sinistro.',
      },
      {
        id: 'dados-sensiveis',
        frase: 'Cotação tem dados pessoais demais.',
        porTras: 'Preocupação com LGPD.',
        resposta:
          'Verdade. O formulário pede só o necessário para a cotação, com aviso de privacidade, e os dados vão direto para você, sem ficar expostos. Quer ver como fica?',
        pergunta: 'Quais dados são realmente obrigatórios para cotar?',
        proximoPasso: 'Defina campos mínimos por tipo de seguro.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como vocês controlam as renovações dos clientes hoje?' },
      { autor: 'cliente', texto: 'Planilha, mas às vezes passa.' },
      { autor: 'vendedor', texto: 'Um controle com lembrete 30 e 15 dias antes evita perder renovação. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com a comissão de renovações perdidas.',
      necessidade: 'Cotações completas e renovações controladas.',
      confianca: 'Registro SUSEP, atendimento no sinistro e privacidade.',
      prazo: 'Antes de picos de renovação (início de ano, veículos novos).',
    },
    cuidados: ['Inclua o registro SUSEP do corretor/corretora.', 'Não prometa coberturas fora das condições gerais da apólice.'],
    aberturaProspeccao: 'Como vocês controlam as renovações das apólices para não deixar nenhuma passar?',
  },
  {
    id: 'despachantes',
    nome: 'Despachantes',
    categoria: 'profissionais',
    resumo:
      'Serviços documentais (veículos: transferência, licenciamento, 2ª via; e outros documentos). O cliente quer resolver rápido, com segurança, e precisa saber os documentos necessários. Acompanhamento do processo gera muitas perguntas.',
    comoClientesChegam: ['Busca por serviço ("transferência de veículo")', 'Indicação', 'Lojas de veículos e autoescolas'],
    dores: ['"Quais documentos preciso?" repetido', 'Clientes perguntando andamento', 'Concorrência com serviços online oficiais'],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Página por serviço com documentos necessários e prazos.' },
      { servico: 'sis-clientes', porque: 'Acompanhamento de processos com status visível ao cliente.' },
      { servico: 'site-seo', porque: 'Buscas por serviços específicos na cidade.' },
    ],
    argumentos: [
      'Lista de documentos por serviço evita idas e vindas.',
      'Status do processo consultável reduz ligações.',
      'Explicar o que o despachante faz de diferente justifica o serviço frente ao "faça você mesmo".',
    ],
    perguntas: ['Quais serviços mais procurados?', 'Como informam o andamento?', 'Atendem lojas de veículos?'],
    objecoes: [
      {
        id: 'detran-online',
        frase: 'Hoje dá para fazer muita coisa online no órgão oficial.',
        porTras: 'Concorrência com autoatendimento.',
        resposta:
          'Verdade. O despachante ajuda quem não tem tempo ou tem casos com pendências. O site pode explicar justamente isso: quando vale contratar. Quais casos dão mais trabalho para o cliente sozinho?',
        pergunta: 'Que situações seus clientes não conseguem resolver sozinhos?',
        proximoPasso: 'Proponha páginas sobre casos complexos.',
      },
      {
        id: 'cliente-vem-presencial',
        frase: 'Meu cliente vem pessoalmente.',
        porTras: 'Atendimento presencial.',
        resposta:
          'E vai continuar vindo. Se ele já chegar com os documentos certos, o atendimento é mais rápido. Quantos voltam porque faltou documento?',
        pergunta: 'Quantos clientes voltam por falta de documento?',
        proximoPasso: 'Proponha guia de documentos online.',
      },
      {
        id: 'lojas-indicam',
        frase: 'As lojas de carro me mandam tudo.',
        porTras: 'Canal B2B.',
        resposta:
          'Ótimo canal. Um painel de acompanhamento para as lojas parceiras mostrarem o status ao comprador pode fortalecer essa parceria.',
        pergunta: 'As lojas perguntam muito sobre o andamento?',
        proximoPasso: 'Proponha acompanhamento de processos para parceiros.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quantos clientes perguntam por dia quais documentos precisam trazer?' },
      { autor: 'cliente', texto: 'Muitos, e às vezes voltam porque faltou algo.' },
      { autor: 'vendedor', texto: 'Uma página por serviço com a lista de documentos resolve isso. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o tempo perdido com retornos por documento faltante.',
      necessidade: 'Guia de documentos e acompanhamento de processos.',
      confianca: 'Transparência de taxas e clareza de que não é órgão oficial.',
      prazo: 'Antes de períodos de licenciamento anual.',
    },
    cuidados: ['Deixe claro que é um serviço privado — não use cores, nomes ou logotipos que imitem órgãos oficiais.', 'Separe taxas oficiais dos honorários.'],
    aberturaProspeccao: 'Quantos clientes perguntam por dia quais documentos precisam trazer?',
  },
  {
    id: 'corretores-planos',
    nome: 'Corretores de planos e serviços regulamentados',
    categoria: 'profissionais',
    resumo:
      'Venda de planos de saúde, odontológicos, consórcios e outros produtos regulados. Cotação por faixa etária, região e número de vidas. Concorrência alta, leads comprados e regras rígidas de comunicação dos órgãos reguladores (ANS, Banco Central, SUSEP, conforme o produto).',
    comoClientesChegam: ['Leads de anúncios', 'Indicação', 'Empresas (planos coletivos)', 'Busca por cotação'],
    dores: ['Cotação com muitos dados', 'Leads frios comprados', 'Acompanhar propostas e documentos'],
    solucoes: [
      { servico: 'lp-captacao', porque: 'Página de cotação por produto, com coleta das informações necessárias.' },
      { servico: 'sis-crm', porque: 'Funil de propostas com documentos e prazos.' },
      { servico: 'site-paginas-servicos', porque: 'Explicação de cada produto em linguagem simples, dentro das regras.' },
    ],
    argumentos: [
      'Lead que preenche idade, região e número de vidas é cotado na hora.',
      'CRM organiza propostas que dependem de documentos e assinaturas.',
      'Conteúdo claro e regulado diferencia de corretores agressivos.',
    ],
    perguntas: ['Quais produtos vende?', 'Compra leads?', 'Atende pessoa física ou empresas?'],
    objecoes: [
      {
        id: 'leads-comprados',
        frase: 'Compro leads, não preciso de site.',
        porTras: 'Modelo de aquisição pago.',
        resposta:
          'Leads comprados são compartilhados com vários corretores. Uma página própria gera leads exclusivos, que só você atende. Quanto paga por lead hoje?',
        pergunta: 'Quantos dos leads comprados você fecha?',
        proximoPasso: 'Proponha landing de cotação para teste com anúncios próprios.',
      },
      {
        id: 'regras-comunicacao',
        frase: 'Tenho medo de falar algo errado no site.',
        porTras: 'Regulação.',
        resposta:
          'Cuidado importante. O conteúdo segue as informações oficiais das operadoras, sem promessa de cobertura ou preço fora das condições. Você valida antes de publicar.',
        pergunta: 'As operadoras fornecem material oficial para divulgação?',
        proximoPasso: 'Use material oficial e inclua validação no processo.',
      },
      {
        id: 'preco-muda',
        frase: 'Os preços mudam o tempo todo.',
        porTras: 'Medo de manter tabelas.',
        resposta:
          'Por isso o site não mostra tabela fixa: ele coleta os dados e você envia a cotação atualizada. Sem risco de preço desatualizado.',
        pergunta: 'Quantas cotações você faz por dia?',
        proximoPasso: 'Proponha formulário de cotação sem tabela pública.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Os leads que você atende hoje são comprados ou chegam direto para você?' },
      { autor: 'cliente', texto: 'Comprados, e caros.' },
      { autor: 'vendedor', texto: 'E normalmente vão para vários corretores, né? Uma página de cotação própria gera leads exclusivos. Quer testar?' },
    ],
    angulos: {
      preco: 'Compare com o custo por lead comprado e a taxa de fechamento.',
      necessidade: 'Leads exclusivos e organização de propostas.',
      confianca: 'Registro no órgão regulador e conteúdo oficial.',
      prazo: 'Antes de janelas de reajuste ou campanhas de operadoras.',
    },
    cuidados: [
      'Produtos regulados têm regras de comunicação próprias (ANS para planos de saúde, Banco Central para consórcios, SUSEP para seguros). Use material oficial das operadoras e não prometa coberturas, carências ou preços fora das condições contratuais.',
    ],
    aberturaProspeccao: 'Os leads que você atende hoje chegam direto para você ou são comprados e compartilhados?',
  },
  {
    id: 'administradoras-condominio',
    nome: 'Administradoras de condomínios',
    categoria: 'profissionais',
    resumo:
      'Gestão de vários condomínios: boletos, prestação de contas, assembleias, comunicados, manutenção. Síndicos e condôminos cobram transparência. Assembleias virtuais são permitidas por lei (Lei 14.309/2022), quando previstas.',
    comoClientesChegam: ['Indicação de síndicos', 'Busca por administradora', 'Troca de administradora em assembleia'],
    dores: ['Prestação de contas manual', 'Comunicados que não chegam', 'Síndicos cobrando transparência'],
    solucoes: [
      { servico: 'sis-membros', porque: 'Portal do condômino com boletos, comunicados, documentos e prestação de contas.' },
      { servico: 'sis-dashboards', porque: 'Painel financeiro por condomínio para o síndico.' },
      { servico: 'site-profissional', porque: 'Apresentação institucional para captar novos condomínios.' },
    ],
    argumentos: [
      'Transparência na prestação de contas é o que faz o síndico renovar contrato.',
      'Portal do condômino reduz ligações sobre boleto e comunicados.',
      'Site profissional pesa na decisão da assembleia de trocar de administradora.',
    ],
    perguntas: ['Quantos condomínios administram?', 'Como fazem a prestação de contas?', 'Já fazem assembleias virtuais?'],
    objecoes: [
      {
        id: 'ja-tem-sistema-condominio',
        frase: 'Já temos sistema de condomínio.',
        porTras: 'Software do setor.',
        resposta:
          'Ótimo. O que o sistema atual não resolve: portal, comunicação, relatórios para o síndico? Muitas vezes a oportunidade é complementar.',
        pergunta: 'Do que os síndicos mais reclamam?',
        proximoPasso: 'Mapeie lacunas antes de propor qualquer coisa.',
      },
      {
        id: 'condominos-idosos',
        frase: 'Muitos condôminos são idosos.',
        porTras: 'Barreira de uso.',
        resposta:
          'Dá para fazer o portal bem simples, e manter o boleto impresso para quem precisar. Familiares costumam ajudar. O importante é ter a informação disponível.',
        pergunta: 'Que informação os condôminos mais pedem?',
        proximoPasso: 'Proponha portal com acesso simplificado.',
      },
      {
        id: 'contratos-por-indicacao',
        frase: 'Novos condomínios vêm por indicação.',
        porTras: 'Canal tradicional.',
        resposta:
          'E na assembleia, os condôminos comparam administradoras. Um site profissional, com serviços e transparência, ajuda a vencer essa comparação.',
        pergunta: 'O que os síndicos perguntam quando estão avaliando trocar?',
        proximoPasso: 'Proponha site institucional focado em transparência.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como os síndicos acompanham a prestação de contas hoje?' },
      { autor: 'cliente', texto: 'Mandamos PDF por e-mail todo mês.' },
      { autor: 'vendedor', texto: 'Um painel por condomínio, com contas e documentos sempre disponíveis, aumenta muito a percepção de transparência. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um contrato de condomínio mantido ou conquistado.',
      necessidade: 'Transparência, comunicação e atendimento a condôminos.',
      confianca: 'Segurança de dados financeiros e perfis de acesso (síndico, conselho, condômino).',
      prazo: 'Antes de assembleias de prestação de contas e renovação.',
    },
    cuidados: ['Dados financeiros e pessoais de condôminos exigem controle de acesso por perfil.'],
    aberturaProspeccao: 'Como os síndicos dos condomínios que vocês administram acompanham a prestação de contas hoje?',
  },
  {
    id: 'empresas-de-engenharia',
    nome: 'Empresas de engenharia',
    categoria: 'profissionais',
    resumo:
      'Projetos, obras, consultoria técnica e manutenção para empresas e governo. Venda B2B por licitação, indicação e relacionamento. Portfólio técnico, certificações e capacidade de execução decidem.',
    comoClientesChegam: ['Relacionamento B2B', 'Licitações', 'Indicação', 'LinkedIn'],
    dores: ['Apresentar capacidade técnica e portfólio', 'Gestão de propostas e obras', 'Documentação técnica dispersa'],
    solucoes: [
      { servico: 'site-profissional', porque: 'Portfólio técnico, certificações, equipe e áreas de atuação.' },
      { servico: 'sis-gestao', porque: 'Gestão de obras, medições e documentos.' },
      { servico: 'sis-crm', porque: 'Pipeline de propostas e licitações.' },
    ],
    argumentos: [
      'Compradores B2B pesquisam a empresa antes de chamar para cotação.',
      'Portfólio com obras, números e certificações vale mais que slogan.',
      'Gestão de obras centralizada evita perda de documentos e medições.',
    ],
    perguntas: ['Quais setores atendem?', 'Participam de licitações?', 'Como controlam medições e documentos de obra?'],
    objecoes: [
      {
        id: 'b2b-nao-usa-site',
        frase: 'B2B não fecha por site.',
        porTras: 'Venda relacional.',
        resposta:
          'Não fecha, mas o comprador pesquisa antes de colocar você na lista de fornecedores. O que ele encontra hoje?',
        pergunta: 'Quando um comprador pesquisa sua empresa, o que encontra?',
        proximoPasso: 'Proponha site institucional técnico.',
      },
      {
        id: 'obras-sigilosas',
        frase: 'Muitas obras são sigilosas.',
        porTras: 'Contratos confidenciais.',
        resposta:
          'Dá para mostrar tipos de obra, porte e soluções sem identificar clientes. E destacar certificações e equipe.',
        pergunta: 'Quais obras podem ser mostradas?',
        proximoPasso: 'Estruture portfólio anonimizado.',
      },
      {
        id: 'erp-ja-existe',
        frase: 'Já temos ERP.',
        porTras: 'Sistema de gestão adotado.',
        resposta:
          'Ótimo. O ERP cuida do financeiro; a gestão de obra (medições, diário, fotos) muitas vezes fica de fora. Como vocês controlam isso?',
        pergunta: 'Onde ficam os diários e medições de obra hoje?',
        proximoPasso: 'Avalie complemento ao ERP para gestão de obras.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quando um comprador de uma indústria pesquisa a empresa de vocês, o que ele encontra?' },
      { autor: 'cliente', texto: 'Um site antigo, de anos atrás.' },
      { autor: 'vendedor', texto: 'Um site técnico atualizado, com obras, certificações e equipe, pesa na hora de entrar na lista de fornecedores. Quer ver uma estrutura?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um contrato B2B.',
      necessidade: 'Credibilidade técnica e gestão de obras.',
      confianca: 'Certificações, CREA e portfólio verificável.',
      prazo: 'Antes de licitações ou feiras do setor.',
    },
    cuidados: ['Inclua o registro no CREA e respeite cláusulas de confidencialidade dos contratos.'],
    aberturaProspeccao: 'Quando um comprador pesquisa a empresa de vocês antes de pedir cotação, o que ele encontra hoje?',
  },
];
