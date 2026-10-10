import type { Niche } from '../../types';

export const COMERCIO: Niche[] = [
  {
    id: 'lojas-de-roupas',
    nome: 'Lojas de roupas',
    categoria: 'comercio',
    resumo:
      'Coleções que giram rápido, grade de tamanhos e cores, vendas pelo Instagram e WhatsApp com "provador por foto". Muitas fazem malinha/condicional e vendem para outras cidades. Trocas e estoque são os grandes desafios.',
    comoClientesChegam: ['Instagram com looks', 'Loja física', 'WhatsApp de clientes fiéis', 'Lives e grupos de VIP'],
    dores: ['Responder "tem no M?" o dia todo', 'Estoque desencontrado entre loja e redes', 'Trocas e devoluções sem processo'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Catálogo com tamanhos e cores, pedido pelo WhatsApp e entrega local.' },
      { servico: 'ecommerce', porque: 'Loja completa para vender para outras cidades com frete e pagamento.' },
      { servico: 'loja-gestao-produtos', porque: 'Grade de estoque por tamanho/cor sincronizada.' },
    ],
    argumentos: [
      'Catálogo com grade responde "tem no M?" sem ninguém parar de atender.',
      'Cliente de outra cidade compra sozinho, com frete calculado.',
      'Estoque único evita vender a mesma peça duas vezes.',
    ],
    perguntas: ['Quantas peças novas por semana?', 'Vende para outras cidades?', 'Como controla estoque hoje?'],
    objecoes: [
      {
        id: 'venda-no-direct',
        frase: 'Vendo tudo pelo direct.',
        porTras: 'Canal funcionando.',
        resposta:
          'Ótimo sinal de que o Instagram funciona. O catálogo entra para quem quer ver tudo de uma vez e escolher sem esperar resposta. Quantas mensagens "tem no M?" chegam por dia?',
        pergunta: 'Quanto tempo a equipe passa respondendo disponibilidade?',
        proximoPasso: 'Proponha catálogo com link na bio e nos stories.',
      },
      {
        id: 'cadastro-de-pecas',
        frase: 'Cadastrar cada peça dá muito trabalho.',
        porTras: 'Trabalho operacional.',
        resposta:
          'Dá, e vale planejar: fotografar a coleção de uma vez e cadastrar pelo celular. Dá para começar só com as novidades. Quantas peças por coleção?',
        pergunta: 'Quem fotografa as peças hoje?',
        proximoPasso: 'Proponha fluxo de cadastro por coleção.',
      },
      {
        id: 'e-commerce-caro',
        frase: 'E-commerce é caro e complicado.',
        porTras: 'Medo de custo e operação.',
        resposta:
          'Pode começar sem e-commerce completo: catálogo com pedido pelo WhatsApp já resolve boa parte. Quando o volume justificar, evolui para checkout.',
        pergunta: 'Quantas vendas por mês são para fora da cidade?',
        proximoPasso: 'Ofereça catálogo como fase 1.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Quantas mensagens "tem no M?" vocês recebem por dia?' },
      { autor: 'cliente', texto: 'Perdi a conta.' },
      { autor: 'vendedor', texto: 'Um catálogo com a grade de tamanhos responde isso sozinho, e o pedido chega pronto no WhatsApp. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com as horas da equipe respondendo disponibilidade e com vendas para fora da cidade.',
      necessidade: 'Catálogo com grade, estoque e vendas a distância.',
      confianca: 'Mostre o cadastro de peça pelo celular.',
      prazo: 'Antes do lançamento de coleção ou de datas como Dia das Mães e Black Friday.',
    },
    cuidados: ['Publique política de trocas conforme o Código de Defesa do Consumidor (direito de arrependimento em compras a distância).'],
    aberturaProspeccao: 'Quantas mensagens perguntando "tem no M?" vocês recebem por dia?',
  },
  {
    id: 'lojas-de-calcados',
    nome: 'Lojas de calçados',
    categoria: 'comercio',
    resumo:
      'Grade de numeração extensa, ticket médio intermediário, trocas frequentes por tamanho. Concorrência com grandes e-commerces e marketplaces. Vantagem local: atendimento, prova e troca rápida.',
    comoClientesChegam: ['Loja física', 'Instagram', 'WhatsApp', 'Marketplaces'],
    dores: ['Consulta de numeração por mensagem', 'Trocas por tamanho', 'Estoque por numeração'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Catálogo por modelo e numeração com reserva para retirada.' },
      { servico: 'loja-gestao-produtos', porque: 'Estoque por numeração atualizado.' },
      { servico: 'ecommerce', porque: 'Venda online com política de troca clara.' },
    ],
    argumentos: [
      'Reserva online para provar na loja combina o melhor dos dois mundos.',
      'Estoque por numeração evita prometer o que não tem.',
      'Troca rápida na loja física é um diferencial contra grandes e-commerces.',
    ],
    perguntas: ['Quantos modelos ativos?', 'Quantas trocas por tamanho?', 'Clientes pedem reserva?'],
    objecoes: [
      {
        id: 'cliente-quer-provar',
        frase: 'Cliente quer provar sapato.',
        porTras: 'Venda depende de prova.',
        resposta:
          'Verdade. Por isso a proposta é catálogo com reserva: ele vê o modelo, reserva a numeração e vem provar. Você já recebe pedidos de reserva?',
        pergunta: 'Quantos clientes perguntam se tem o número antes de vir?',
        proximoPasso: 'Proponha catálogo com reserva para retirada.',
      },
      {
        id: 'grandes-sites',
        frase: 'Não ganho dos grandes sites.',
        porTras: 'Concorrência de preço.',
        resposta:
          'Em preço, talvez não. Em prova, troca na hora e atendimento, sim. O catálogo leva o cliente local até a sua loja.',
        pergunta: 'Que vantagem a sua loja tem sobre os grandes sites?',
        proximoPasso: 'Posicione o catálogo como apoio à loja física.',
      },
      {
        id: 'estoque-sistema-caixa',
        frase: 'O estoque está no sistema do caixa.',
        porTras: 'Ferramenta existente.',
        resposta:
          'Ótimo. Vale verificar se o sistema do caixa exporta ou integra o estoque, para não duplicar trabalho. Qual sistema vocês usam?',
        pergunta: 'O sistema do caixa permite exportar estoque?',
        proximoPasso: 'Verifique integração antes de orçar.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Clientes perguntam muito se tem tal número antes de ir à loja?' },
      { autor: 'cliente', texto: 'Sempre.' },
      { autor: 'vendedor', texto: 'Um catálogo com reserva por numeração resolve: ele reserva e vem provar. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com vendas perdidas por cliente que não veio sem confirmação de numeração.',
      necessidade: 'Consulta de numeração e reserva.',
      confianca: 'Integração com o estoque existente, quando possível.',
      prazo: 'Antes da volta às aulas e datas comemorativas.',
    },
    cuidados: ['Política de troca clara e conforme o Código de Defesa do Consumidor.'],
    aberturaProspeccao: 'Os clientes costumam perguntar se tem a numeração antes de ir até a loja?',
  },
  {
    id: 'lojas-de-moveis',
    nome: 'Lojas de móveis',
    categoria: 'comercio',
    resumo:
      'Ticket alto, decisão demorada (casal, medidas do ambiente), entrega e montagem agendadas. Mistura de pronta-entrega e sob encomenda/planejados. O cliente pesquisa muito antes de visitar.',
    comoClientesChegam: ['Busca por produto + cidade', 'Instagram', 'Loja física', 'Indicação'],
    dores: ['Cliente perguntando medidas e cores por mensagem', 'Agendamento de entrega e montagem', 'Orçamento de planejados'],
    solucoes: [
      { servico: 'catalogo-digital', porque: 'Catálogo com medidas, acabamentos e disponibilidade.' },
      { servico: 'site-formulario-orcamento', porque: 'Orçamento de planejados com medidas e fotos do ambiente.' },
      { servico: 'sis-agendamento', porque: 'Agenda de entregas e montagens.' },
    ],
    argumentos: [
      'Medidas e acabamentos no catálogo evitam a pergunta mais repetida.',
      'Quem pesquisa antes chega na loja já decidido entre dois modelos.',
      'Agenda de montagem organizada reduz reclamações.',
    ],
    perguntas: ['Vendem planejados?', 'Como agendam entregas?', 'Quanto tempo o cliente leva para decidir?'],
    objecoes: [
      {
        id: 'moveis-se-vendem-na-loja',
        frase: 'Móvel se vende na loja.',
        porTras: 'Experiência física decisiva.',
        resposta:
          'O fechamento, sim. Mas a pesquisa acontece antes, no celular. Se ele encontra seus modelos com medidas, a visita já vem com intenção. Quantos clientes chegam dizendo "vi no Instagram"?',
        pergunta: 'Quantos clientes chegam já sabendo o que querem?',
        proximoPasso: 'Proponha catálogo de pesquisa que leva à visita.',
      },
      {
        id: 'catalogo-grande',
        frase: 'Meu catálogo é enorme.',
        porTras: 'Trabalho de cadastro.',
        resposta:
          'Dá para começar pelos mais vendidos e pelas linhas que você quer destacar. Os fornecedores costumam ter fotos e fichas técnicas.',
        pergunta: 'Os fornecedores fornecem fotos e medidas?',
        proximoPasso: 'Planeje cadastro inicial com os produtos estratégicos.',
      },
      {
        id: 'planejados-orcamento',
        frase: 'Planejado depende de projeto.',
        porTras: 'Venda consultiva.',
        resposta:
          'Sim. O formulário coleta as medidas e fotos do ambiente para a primeira conversa ser produtiva. Quanto tempo leva um orçamento de planejado?',
        pergunta: 'Quantas medições não viram venda?',
        proximoPasso: 'Proponha formulário de pré-projeto.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Clientes perguntam muito medidas e cores pelo WhatsApp antes de visitar?' },
      { autor: 'cliente', texto: 'Muito, mando foto da etiqueta.' },
      { autor: 'vendedor', texto: 'Um catálogo com medidas e acabamentos resolve isso e traz o cliente já decidido. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o ticket de uma venda de móvel ou planejado.',
      necessidade: 'Informação para pesquisa prévia e agenda de entregas.',
      confianca: 'Medidas corretas e prazos de entrega claros.',
      prazo: 'Antes de datas como Black Friday e mudança de ano.',
    },
    cuidados: ['Prazos de entrega e montagem devem ser realistas e informados por escrito.'],
    aberturaProspeccao: 'Os clientes costumam pedir medidas e cores pelo WhatsApp antes de visitar a loja?',
  },
  {
    id: 'materiais-de-construcao',
    nome: 'Lojas de materiais de construção',
    categoria: 'comercio',
    resumo:
      'Milhares de itens, clientes que são pedreiros, empreiteiros e donos de obra. Orçamentos por lista de materiais, entrega com caminhão, venda a prazo para profissionais. Preço e disponibilidade decidem.',
    comoClientesChegam: ['Proximidade da obra', 'Profissionais fidelizados', 'Orçamento por lista no WhatsApp', 'Busca local'],
    dores: ['Listas de materiais por foto/áudio', 'Orçamentos demorados', 'Agenda de entregas'],
    solucoes: [
      { servico: 'site-formulario-orcamento', porque: 'Envio da lista de materiais (texto ou foto) com endereço da obra.' },
      { servico: 'sis-orcamentos', porque: 'Orçamento rápido com tabela de preços e PDF.' },
      { servico: 'sis-pedidos', porque: 'Agenda de entregas por caminhão e região.' },
    ],
    argumentos: [
      'Orçamento de lista respondido primeiro ganha a venda.',
      'Pedido com endereço e prazo organiza a rota de entrega.',
      'Profissionais fiéis pedem pelo link e recebem mais rápido.',
    ],
    perguntas: ['Quantos orçamentos de lista por dia?', 'Quanto tempo leva para responder?', 'Como agendam entregas?'],
    objecoes: [
      {
        id: 'muitos-itens',
        frase: 'Tenho itens demais para colocar online.',
        porTras: 'Catálogo gigante.',
        resposta:
          'Não precisa colocar tudo. O foco é receber as listas organizadas e responder rápido. O catálogo pode ter só as categorias e os mais vendidos.',
        pergunta: 'Quanto tempo leva para orçar uma lista hoje?',
        proximoPasso: 'Proponha formulário de lista + sistema de orçamento.',
      },
      {
        id: 'pedreiro-manda-audio',
        frase: 'Pedreiro manda lista por áudio.',
        porTras: 'Hábito do público.',
        resposta:
          'E pode continuar. O que muda é o lado da loja: um sistema de orçamento onde o atendente monta a lista rápido e gera o PDF. Quanto tempo o atendente leva hoje?',
        pergunta: 'Quantos orçamentos são perdidos por demora?',
        proximoPasso: 'Foque no sistema interno de orçamento.',
      },
      {
        id: 'preco-muda-sempre',
        frase: 'Preço muda toda semana.',
        porTras: 'Volatilidade de custos.',
        resposta:
          'Por isso a tabela fica num sistema atualizável (ou importada do sistema do caixa), e o orçamento tem validade. Assim ninguém promete preço velho.',
        pergunta: 'O sistema do caixa exporta a tabela de preços?',
        proximoPasso: 'Verifique integração com o sistema atual.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quanto tempo vocês levam para responder um orçamento de lista de materiais?' },
      { autor: 'cliente', texto: 'Depende, às vezes um dia.' },
      { autor: 'vendedor', texto: 'E quem responde primeiro costuma levar, né? Um sistema de orçamento rápido com a tabela de vocês acelera muito isso. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com o valor de orçamentos de obra perdidos por demora.',
      necessidade: 'Velocidade de orçamento e logística de entregas.',
      confianca: 'Integração com a tabela de preços existente.',
      prazo: 'Antes da temporada de obras (estação seca na região).',
    },
    cuidados: ['Orçamentos devem ter validade e condições de pagamento por escrito.'],
    aberturaProspeccao: 'Quanto tempo vocês levam hoje para responder um orçamento de lista de materiais?',
  },
  {
    id: 'oficinas-mecanicas',
    nome: 'Oficinas mecânicas',
    categoria: 'comercio',
    resumo:
      'Revisões, reparos, diagnósticos. Cliente desconfiado de preço e serviço desnecessário; confiança é tudo. Orçamento após diagnóstico, aprovação do cliente e comunicação do andamento. Recorrência por revisões e troca de óleo.',
    comoClientesChegam: ['Indicação', 'Busca "mecânico perto de mim"', 'Clientes recorrentes', 'Seguradoras e frotas'],
    dores: ['Cliente desconfiado do orçamento', 'Ligações perguntando se o carro está pronto', 'Lembrar revisões'],
    solucoes: [
      { servico: 'sis-orcamentos', porque: 'Orçamento com peças, mão de obra e fotos do problema para aprovação.' },
      { servico: 'sis-clientes', porque: 'Histórico por veículo e lembretes de revisão e troca de óleo.' },
      { servico: 'site-negocio-local', porque: 'Serviços, especialidades e agendamento.' },
    ],
    argumentos: [
      'Orçamento com foto da peça danificada responde à desconfiança com transparência.',
      'Histórico por placa mostra profissionalismo e gera retorno.',
      'Lembrete de troca de óleo traz o cliente de volta.',
    ],
    perguntas: ['Como enviam orçamentos?', 'Clientes questionam muito o valor?', 'Avisam sobre revisões?'],
    objecoes: [
      {
        id: 'cliente-de-confianca',
        frase: 'Meus clientes confiam em mim.',
        porTras: 'Clientela fiel.',
        resposta:
          'Isso é o mais valioso. O sistema ajuda a manter essa confiança com novos clientes: orçamento com fotos e histórico do carro. E lembra os antigos da revisão.',
        pergunta: 'Quantos clientes novos chegam por mês?',
        proximoPasso: 'Proponha orçamento com fotos + lembretes.',
      },
      {
        id: 'mecanico-sem-tempo',
        frase: 'Mecânico não tem tempo para sistema.',
        porTras: 'Equipe com mãos ocupadas.',
        resposta:
          'Por isso precisa ser rápido: foto pelo celular, peças e valor, e o cliente aprova pelo link. Menos ligação, mais tempo no carro.',
        pergunta: 'Quantas ligações vocês fazem por dia para aprovar orçamento?',
        proximoPasso: 'Demonstre o fluxo no celular.',
      },
      {
        id: 'ja-uso-sistema-oficina',
        frase: 'Já uso um sistema de oficina.',
        porTras: 'Ferramenta adotada.',
        resposta:
          'Ótimo. Ele envia orçamento com fotos e lembretes automáticos? Se sim, o foco pode ser só a presença online.',
        pergunta: 'O sistema atual faz lembrete de revisão?',
        proximoPasso: 'Identifique lacunas antes de propor.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Os clientes costumam questionar o orçamento quando o carro está na oficina?' },
      { autor: 'cliente', texto: 'Sempre acham que estou inventando.' },
      { autor: 'vendedor', texto: 'Um orçamento com foto da peça e explicação, enviado por link para aprovação, ajuda muito nessa confiança. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com serviços aprovados mais rápido e revisões que voltam.',
      necessidade: 'Transparência no orçamento e recorrência.',
      confianca: 'Fotos, histórico por veículo e garantia do serviço.',
      prazo: 'Antes de férias e feriados prolongados (revisões de viagem).',
    },
    cuidados: ['Orçamento prévio e aprovação do cliente são exigidos pelo Código de Defesa do Consumidor.'],
    aberturaProspeccao: 'Como vocês enviam os orçamentos para o cliente aprovar quando o carro está na oficina?',
  },
  {
    id: 'autoescolas',
    nome: 'Autoescolas',
    categoria: 'comercio',
    resumo:
      'Processo de habilitação com etapas reguladas pelo Detran (exames, aulas teóricas e práticas, provas). Pacotes por categoria, agendamento de aulas práticas e muito atendimento sobre etapas e documentos. Público jovem.',
    comoClientesChegam: ['Indicação', 'Busca "autoescola" + bairro', 'Instagram', 'Proximidade'],
    dores: ['Explicar as etapas da habilitação repetidamente', 'Agendamento de aulas práticas', 'Acompanhamento do aluno'],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Etapas da habilitação, pacotes por categoria e documentos.' },
      { servico: 'sis-agendamento', porque: 'Agendamento de aulas práticas por instrutor e veículo.' },
      { servico: 'sis-membros', porque: 'Área do aluno com etapas concluídas e próximas.' },
    ],
    argumentos: [
      'Etapas explicadas no site reduzem dúvidas e transmitem organização.',
      'Aluno que agenda aula prática sozinho não ocupa a secretaria.',
      'Acompanhamento das etapas evita alunos perdidos no processo.',
    ],
    perguntas: ['Quantos alunos ativos?', 'Como agendam aulas práticas?', 'Quais categorias oferecem?'],
    objecoes: [
      {
        id: 'regras-mudam',
        frase: 'As regras do Detran mudam muito.',
        porTras: 'Medo de informação desatualizada.',
        resposta:
          'Por isso o conteúdo fica num painel fácil de atualizar, e o site indica as fontes oficiais. Quem acompanha as mudanças aí?',
        pergunta: 'Com que frequência vocês atualizam as informações para os alunos?',
        proximoPasso: 'Inclua painel para editar etapas e links oficiais.',
      },
      {
        id: 'alunos-por-indicacao',
        frase: 'Alunos vêm por indicação.',
        porTras: 'Canal suficiente.',
        resposta:
          'E a pessoa indicada compara preço e organização antes de fechar. Um site claro com pacotes e etapas ajuda a converter. Quantos pedem orçamento e não fecham?',
        pergunta: 'Quantos interessados não voltam após pedir valores?',
        proximoPasso: 'Proponha site com pacotes e etapas.',
      },
      {
        id: 'agenda-pratica-planilha',
        frase: 'Agendo as aulas práticas na planilha.',
        porTras: 'Processo manual.',
        resposta:
          'Funciona, até haver troca de instrutor ou veículo. Um sistema mostra disponibilidade de instrutor e carro ao mesmo tempo. Quantas aulas por semana?',
        pergunta: 'Quantas remarcações por semana?',
        proximoPasso: 'Proponha agenda de aulas práticas.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Os alunos perguntam muito sobre as etapas da habilitação?' },
      { autor: 'cliente', texto: 'O tempo todo, a secretaria vive explicando.' },
      { autor: 'vendedor', texto: 'Uma página com o passo a passo, documentos e pacotes resolve boa parte disso. Querem ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de alguns pacotes de habilitação.',
      necessidade: 'Explicar etapas e organizar aulas práticas.',
      confianca: 'Credenciamento no Detran e informação atualizada.',
      prazo: 'Antes de férias escolares, quando aumenta a procura.',
    },
    cuidados: ['Não prometa aprovação em exames; indique fontes oficiais do Detran para regras e taxas.'],
    aberturaProspeccao: 'Quanto tempo a secretaria de vocês passa explicando as etapas da habilitação para novos alunos?',
  },
  {
    id: 'escolas-particulares',
    nome: 'Escolas particulares',
    categoria: 'comercio',
    resumo:
      'Educação infantil, fundamental e médio. Decisão longa e emocional dos pais, com visitas. Rematrícula e captação concentradas no segundo semestre. Comunicação constante com famílias e muitos dados de menores.',
    comoClientesChegam: ['Indicação de outros pais', 'Busca por escola + bairro', 'Visitas e eventos abertos', 'Instagram'],
    dores: ['Captação de matrículas e agendamento de visitas', 'Comunicação com pais dispersa', 'Proteção de dados e imagens de alunos'],
    solucoes: [
      { servico: 'site-profissional', porque: 'Proposta pedagógica, estrutura, segmentos e agendamento de visita.' },
      { servico: 'lp-captacao', porque: 'Página de campanha de matrículas com agendamento de visita.' },
      { servico: 'sis-membros', porque: 'Portal das famílias com comunicados, agenda e documentos.' },
    ],
    argumentos: [
      'Pais pesquisam muito antes de visitar: proposta pedagógica clara gera visitas mais qualificadas.',
      'Agendamento de visita online organiza a campanha de matrículas.',
      'Portal das famílias centraliza comunicados que se perdem em grupos.',
    ],
    perguntas: ['Quando começa a campanha de matrículas?', 'Como agendam visitas?', 'Como se comunicam com os pais?'],
    objecoes: [
      {
        id: 'escola-tradicional',
        frase: 'Somos uma escola tradicional, todo mundo conhece.',
        porTras: 'Reputação consolidada.',
        resposta:
          'Reputação é o maior ativo. Famílias novas no bairro, porém, conhecem a escola pelo que encontram online. O site precisa estar à altura da reputação. O site atual reflete a escola de hoje?',
        pergunta: 'Quantas matrículas novas vocês buscam por ano?',
        proximoPasso: 'Proponha site institucional alinhado à reputação.',
      },
      {
        id: 'grupos-whatsapp',
        frase: 'A comunicação com os pais é por grupos de WhatsApp.',
        porTras: 'Canal conhecido.',
        resposta:
          'Funciona para avisos rápidos, mas informação importante se perde e expõe números de todos. Um portal guarda comunicados e documentos, e o WhatsApp só avisa.',
        pergunta: 'Os pais reclamam de não ver comunicados?',
        proximoPasso: 'Proponha portal com notificação por WhatsApp/e-mail.',
      },
      {
        id: 'imagem-alunos',
        frase: 'Não podemos expor alunos.',
        porTras: 'Preocupação com LGPD e menores.',
        resposta:
          'Cuidado essencial. Usamos apenas imagens autorizadas pelos responsáveis, priorizando estrutura e atividades sem identificação. Dados de alunos ficam em área restrita.',
        pergunta: 'Vocês já têm termo de autorização de imagem?',
        proximoPasso: 'Defina política de imagens com a direção.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Na campanha de matrículas, como as famílias agendam as visitas?' },
      { autor: 'cliente', texto: 'Ligando para a secretaria.' },
      { autor: 'vendedor', texto: 'Uma página da campanha com agendamento online organiza as visitas e funciona até à noite, quando os pais pesquisam. Querem ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor anual de uma ou duas matrículas novas.',
      necessidade: 'Captação de matrículas e comunicação com famílias.',
      confianca: 'Proteção de dados de menores e imagens autorizadas.',
      prazo: 'Pronto antes do início da campanha de matrículas (geralmente no segundo semestre).',
    },
    cuidados: [
      'Dados de crianças e adolescentes exigem consentimento específico dos responsáveis (LGPD, art. 14). Use apenas imagens autorizadas.',
    ],
    aberturaProspeccao: 'Na campanha de matrículas, como as famílias agendam as visitas hoje?',
  },
  {
    id: 'academias',
    nome: 'Academias',
    categoria: 'comercio',
    resumo:
      'Planos mensais, trimestrais e anuais, alta rotatividade de alunos e sazonalidade (janeiro, pré-verão). Modalidades com aulas em horários fixos e lotação. Retenção é o maior desafio.',
    comoClientesChegam: ['Proximidade', 'Instagram', 'Indicação', 'Aplicativos de benefícios corporativos'],
    dores: ['Cancelamentos e inadimplência', 'Reserva de vagas em aulas', 'Comunicação de planos e horários'],
    solucoes: [
      { servico: 'sis-assinaturas', porque: 'Planos com cobrança recorrente e gestão de inadimplência.' },
      { servico: 'sis-agendamento', porque: 'Reserva de vagas em aulas com lotação.' },
      { servico: 'site-negocio-local', porque: 'Planos, horários, modalidades e aula experimental.' },
    ],
    argumentos: [
      'Cobrança recorrente reduz inadimplência e trabalho de cobrança.',
      'Reserva de aula evita sala lotada e aluno frustrado.',
      'Página de aula experimental captura interessados em janeiro.',
    ],
    perguntas: ['Quantos alunos ativos?', 'Como é feita a cobrança?', 'Aulas têm limite de vagas?'],
    objecoes: [
      {
        id: 'sistema-academia',
        frase: 'Já uso sistema de academia.',
        porTras: 'Software de gestão.',
        resposta:
          'Ótimo. Nesse caso o site pode integrar ou levar para ele. O que o sistema não resolve hoje?',
        pergunta: 'O que mais te incomoda no sistema atual?',
        proximoPasso: 'Proponha site integrado ao sistema existente.',
      },
      {
        id: 'aluno-cancela',
        frase: 'Aluno cancela de qualquer jeito.',
        porTras: 'Rotatividade estrutural.',
        resposta:
          'Parte sim. Mas dá para agir antes: identificar quem parou de frequentar e chamar. Vocês acompanham a frequência?',
        pergunta: 'Vocês sabem quem está há 15 dias sem treinar?',
        proximoPasso: 'Proponha relatório de frequência e alerta de risco de cancelamento.',
      },
      {
        id: 'publico-local',
        frase: 'Meu público é do bairro.',
        porTras: 'Negócio local.',
        resposta:
          'E o vizinho que se mudou ontem pesquisa "academia perto de mim". Aparecer com planos, horários e aula experimental é o que transforma a busca em visita.',
        pergunta: 'Quantos alunos novos vocês buscam em janeiro?',
        proximoPasso: 'Proponha página local com aula experimental.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como é feita a cobrança das mensalidades hoje?' },
      { autor: 'cliente', texto: 'Na recepção, e muita gente atrasa.' },
      { autor: 'vendedor', texto: 'Cobrança recorrente automática reduz atraso e trabalho. Querem ver como funciona?' },
    ],
    angulos: {
      preco: 'Compare com a receita perdida por inadimplência e cancelamentos.',
      necessidade: 'Cobrança recorrente, retenção e reserva de aulas.',
      confianca: 'Integração com sistema existente e transparência nas cobranças.',
      prazo: 'Antes de janeiro e do pré-verão.',
    },
    cuidados: ['Evite promessas de resultado físico; informe o CREF dos profissionais quando aplicável.'],
    aberturaProspeccao: 'Como vocês fazem hoje a cobrança das mensalidades e o controle de quem atrasou?',
  },
  {
    id: 'organizadores-de-eventos',
    nome: 'Organizadores de eventos',
    categoria: 'comercio',
    resumo:
      'Cerimonialistas, produtores de eventos sociais e corporativos, organizadores de cursos e congressos. Trabalho com muitos fornecedores, cronogramas e convidados. Venda por portfólio e indicação; eventos abertos precisam de inscrições.',
    comoClientesChegam: ['Indicação', 'Instagram com eventos realizados', 'Fornecedores parceiros', 'Feiras'],
    dores: ['Lista de convidados e confirmações', 'Inscrições e pagamentos de eventos abertos', 'Portfólio desorganizado'],
    solucoes: [
      { servico: 'lp-eventos', porque: 'Página do evento com programação e inscrição.' },
      { servico: 'site-profissional', porque: 'Portfólio de eventos por tipo e processo de trabalho.' },
      { servico: 'sis-membros', porque: 'Área para clientes acompanharem cronograma e fornecedores.' },
    ],
    argumentos: [
      'Página com confirmação de presença (RSVP) acaba com planilhas de convidados.',
      'Inscrição com pagamento online organiza eventos abertos.',
      'Portfólio por tipo de evento vende para o cliente certo.',
    ],
    perguntas: ['Organiza eventos sociais, corporativos ou abertos?', 'Como controla convidados?', 'Usa plataforma de ingressos?'],
    objecoes: [
      {
        id: 'plataforma-ingressos',
        frase: 'Uso plataforma de ingressos.',
        porTras: 'Ferramenta adotada.',
        resposta:
          'Ótimo para vender. A página própria cuida da apresentação e leva para a compra, com sua marca e patrocinadores. Vocês destacam patrocinadores hoje?',
        pergunta: 'Que informações do evento ficam de fora da plataforma?',
        proximoPasso: 'Proponha página do evento integrada à plataforma.',
      },
      {
        id: 'cada-evento-diferente',
        frase: 'Cada evento é diferente.',
        porTras: 'Personalização.',
        resposta:
          'Por isso o modelo de página é reaproveitável: muda conteúdo e identidade, a estrutura (programação, local, inscrição) fica. Quantos eventos por ano?',
        pergunta: 'Quantos eventos você organiza por ano?',
        proximoPasso: 'Proponha modelo de página reutilizável.',
      },
      {
        id: 'cliente-vem-indicado',
        frase: 'Clientes vêm por indicação de fornecedores.',
        porTras: 'Canal de parceiros.',
        resposta:
          'Ótimo. Um portfólio online facilita a indicação: o fornecedor manda o link e o cliente vê seus eventos. O que eles enviam hoje?',
        pergunta: 'O que o cliente indicado vê antes de falar com você?',
        proximoPasso: 'Proponha site de portfólio compartilhável.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como vocês controlam as confirmações de convidados nos eventos?' },
      { autor: 'cliente', texto: 'Planilha e WhatsApp.' },
      { autor: 'vendedor', texto: 'Uma página do evento com confirmação de presença organiza isso automaticamente. Querem ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um evento e com horas gastas em listas de convidados.',
      necessidade: 'Inscrições, confirmações e portfólio.',
      confianca: 'Integração com plataformas de pagamento e privacidade dos convidados.',
      prazo: 'Antes da abertura de inscrições do próximo evento.',
    },
    cuidados: ['Lista de convidados contém dados pessoais: acesso restrito.', 'Fotos de convidados só com autorização.'],
    aberturaProspeccao: 'Como vocês controlam hoje as confirmações de presença dos convidados?',
  },
  {
    id: 'turismo',
    nome: 'Empresas de turismo',
    categoria: 'comercio',
    resumo:
      'Agências de viagem, receptivos e passeios. Venda de pacotes, roteiros e excursões com datas e vagas limitadas. Concorrência com grandes plataformas; diferencial é curadoria, atendimento e experiência local.',
    comoClientesChegam: ['Instagram com destinos', 'Indicação', 'Grupos e excursões', 'Busca por passeio + destino'],
    dores: ['Controle de vagas e pagamentos de excursões', 'Roteiros explicados um por um', 'Concorrência com grandes plataformas'],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Página por roteiro com datas, inclusos e vagas.' },
      { servico: 'loja-checkout', porque: 'Reserva com sinal ou pagamento online.' },
      { servico: 'sis-pedidos', porque: 'Lista de passageiros, vagas e pagamentos por saída.' },
    ],
    argumentos: [
      'Página do roteiro com o que está incluso evita a mesma explicação 50 vezes.',
      'Reserva com sinal online garante a vaga e reduz desistências.',
      'Lista de passageiros organizada por saída evita erro de vaga.',
    ],
    perguntas: ['Vendem pacotes, passeios ou excursões?', 'Como controlam vagas?', 'Têm Cadastur?'],
    objecoes: [
      {
        id: 'grandes-plataformas',
        frase: 'Não compito com as grandes plataformas de viagem.',
        porTras: 'Pressão de preço.',
        resposta:
          'Em pacotes padrão, é difícil. Em roteiros próprios, grupos e experiência local, você é único. O site mostra isso. Qual roteiro só vocês fazem?',
        pergunta: 'Que experiência vocês oferecem que as plataformas não oferecem?',
        proximoPasso: 'Proponha páginas de roteiros exclusivos.',
      },
      {
        id: 'vendas-whatsapp',
        frase: 'Vendo excursão pelo WhatsApp.',
        porTras: 'Canal funcionando.',
        resposta:
          'E pode continuar. O controle de vagas e sinal é que costuma dar dor de cabeça. Como vocês sabem quantas vagas restam?',
        pergunta: 'Já aconteceu de vender vaga a mais?',
        proximoPasso: 'Proponha controle de vagas com reserva online.',
      },
      {
        id: 'sazonalidade',
        frase: 'Turismo é sazonal.',
        porTras: 'Caixa irregular.',
        resposta:
          'Por isso vale preparar antes da temporada, com pré-venda aberta. O site permite vender com antecedência.',
        pergunta: 'Quando começa a procura pela próxima temporada?',
        proximoPasso: 'Planeje lançamento antes da temporada.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como vocês controlam as vagas e os sinais das excursões?' },
      { autor: 'cliente', texto: 'Planilha e comprovante no WhatsApp.' },
      { autor: 'vendedor', texto: 'Uma página por saída, com reserva e sinal online, atualiza as vagas sozinha. Querem ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de uma excursão lotada.',
      necessidade: 'Controle de vagas, reservas e roteiros exclusivos.',
      confianca: 'Cadastur, políticas de cancelamento e pagamento seguro.',
      prazo: 'Antes da abertura das vendas da temporada.',
    },
    cuidados: ['Agências de turismo devem informar o número do Cadastur.', 'Publique política de cancelamento e reembolso clara.'],
    aberturaProspeccao: 'Como vocês controlam hoje as vagas e os pagamentos de cada saída?',
  },
];
