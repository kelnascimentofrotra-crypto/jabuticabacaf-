import type { Service } from '../types';

export const SERVICES: Service[] = [
  // ---------------- Sites institucionais ----------------
  {
    id: 'site-profissional',
    nome: 'Site profissional para empresas',
    grupo: 'site',
    descricao:
      'Site institucional com apresentação da empresa, serviços, diferenciais, localização e canais de contato, com domínio próprio e e-mail profissional.',
    paraQuem: 'Empresas que precisam ser encontradas e transmitir credibilidade antes do primeiro contato.',
    entregaveis: [
      'Páginas Início, Sobre, Serviços e Contato',
      'Layout responsivo para celular',
      'Domínio próprio configurado',
      'Botão de WhatsApp e mapa',
      'Configuração básica de SEO e Google Search Console',
    ],
    argumentos: [
      'É o único canal digital em que a empresa controla 100% da informação, sem depender de algoritmo.',
      'Funciona como cartão de visitas para quem recebeu uma indicação e quer conferir antes de chamar.',
      'Concentra em um link só o que hoje está espalhado entre Instagram, WhatsApp e boca a boca.',
    ],
    objecoes: [
      {
        frase: 'Site institucional ninguém acessa.',
        resposta:
          'Faz sentido pensar assim se o site for só uma vitrine parada. A proposta é ele ser o lugar para onde você manda quem já demonstrou interesse — quem pesquisa seu nome, quem recebeu indicação, quem viu seu anúncio. Hoje, quando alguém pede mais informações, para onde você direciona?',
      },
      {
        frase: 'Preciso de algo simples, não de um site grande.',
        resposta:
          'Ótimo, simples costuma funcionar melhor. Dá para começar com uma página única bem organizada e crescer depois, se fizer sentido. O que não pode faltar de jeito nenhum para o seu cliente?',
      },
    ],
  },
  {
    id: 'site-apresentacao',
    nome: 'Site de apresentação de serviços',
    grupo: 'site',
    descricao:
      'Site focado em explicar com clareza o que a empresa faz, para quem e como contratar, com prova social e chamadas para contato.',
    paraQuem: 'Prestadores de serviço que perdem tempo explicando a mesma coisa em todo atendimento.',
    entregaveis: [
      'Estrutura de página orientada a serviço',
      'Seção de perguntas frequentes',
      'Depoimentos e fotos de trabalhos reais',
      'Chamadas para WhatsApp ou formulário',
    ],
    argumentos: [
      'Reduz perguntas repetidas no atendimento: o cliente chega já sabendo o básico.',
      'Organiza o serviço de forma que o cliente entenda o valor antes de perguntar o preço.',
    ],
    objecoes: [
      {
        frase: 'Eu explico tudo no atendimento, não preciso disso.',
        resposta:
          'E você explica bem, imagino. A ideia é que o cliente já chegue com o básico entendido, para o seu tempo no atendimento ir para o que importa: fechar. Quantas vezes por semana você responde as mesmas perguntas?',
      },
      {
        frase: 'Meu serviço é difícil de explicar em site.',
        resposta:
          'Por isso mesmo vale organizar. Um bom site de serviço não explica tudo — explica o suficiente para a pessoa querer conversar com você. Me conta como você explica para um cliente novo e eu te mostro como isso viraria página.',
      },
    ],
  },
  {
    id: 'site-negocio-local',
    nome: 'Site para negócios locais',
    grupo: 'site',
    descricao:
      'Site pensado para quem atende numa região: endereço, horário, rota, área de atendimento, avaliações e integração com o Perfil da Empresa no Google.',
    paraQuem: 'Comércios e serviços de bairro ou cidade que dependem de clientes próximos.',
    entregaveis: [
      'Página com mapa, rota e horários',
      'Área de atendimento por bairro/cidade',
      'Integração com o Perfil da Empresa no Google',
      'Botões de ligação e WhatsApp em destaque',
    ],
    argumentos: [
      'Quem procura "perto de mim" quer endereço, horário e telefone em segundos.',
      'O site reforça o Perfil da Empresa no Google com informações consistentes.',
    ],
    objecoes: [
      {
        frase: 'Todo mundo aqui já me conhece.',
        resposta:
          'Isso é um ótimo sinal — a sua reputação é o principal ativo. O site serve para quem ainda não te conhece, como quem mudou para o bairro ou recebeu sua indicação e quer conferir antes de ir. Hoje chega muita gente nova por indicação?',
      },
      {
        frase: 'O Google Maps já resolve.',
        resposta:
          'O Maps é essencial e você deve continuar usando. O site complementa com o que não cabe lá: serviços detalhados, fotos organizadas, perguntas frequentes. E dá para ligar os dois. Seu perfil no Google está atualizado hoje?',
      },
    ],
  },
  {
    id: 'site-paginas-servicos',
    nome: 'Site com páginas de serviços',
    grupo: 'site',
    descricao:
      'Site com uma página dedicada a cada serviço, permitindo explicar, mostrar exemplos e ser encontrado por buscas específicas.',
    paraQuem: 'Empresas com vários serviços diferentes, cada um com público e dúvidas próprias.',
    entregaveis: [
      'Uma página por serviço com texto, fotos e FAQ',
      'Estrutura de links internos',
      'Chamadas de contato específicas por serviço',
      'SEO on-page por página',
    ],
    argumentos: [
      'Quem pesquisa um serviço específico cai direto na página certa, não numa página genérica.',
      'Permite medir quais serviços despertam mais interesse.',
    ],
    objecoes: [
      {
        frase: 'Não preciso de uma página para cada serviço.',
        resposta:
          'Talvez não para todos. Normalmente vale separar os dois ou três serviços que mais vendem ou que têm mais dúvidas. Quais são os que você mais gostaria de vender?',
      },
      {
        frase: 'Isso vai ficar caro por ter muitas páginas.',
        resposta:
          'Dá para começar com as páginas dos serviços principais e acrescentar as demais depois, quando você sentir necessidade. Assim o investimento acompanha o resultado.',
      },
    ],
  },
  {
    id: 'site-formulario-orcamento',
    nome: 'Site com formulário de orçamento',
    grupo: 'site',
    descricao:
      'Site com formulário que coleta as informações necessárias para orçar (medidas, tipo de serviço, prazo, fotos), organizando os pedidos.',
    paraQuem: 'Negócios que fazem orçamento sob medida e perdem tempo com idas e vindas de informações.',
    entregaveis: [
      'Formulário com campos definidos com o cliente',
      'Envio por e-mail e/ou WhatsApp',
      'Upload de fotos quando necessário',
      'Aviso de privacidade (LGPD) no formulário',
    ],
    argumentos: [
      'O pedido de orçamento já chega completo, sem dez mensagens perguntando medidas.',
      'Ajuda a separar quem está só curioso de quem está pronto para contratar.',
    ],
    objecoes: [
      {
        frase: 'Meus clientes não gostam de preencher formulário.',
        resposta:
          'Faz sentido — por isso o formulário precisa ser curto e opcional. Quem prefere continua chamando no WhatsApp. Quais informações você sempre precisa pedir antes de orçar?',
      },
      {
        frase: 'Prefiro conversar com o cliente.',
        resposta:
          'E deve continuar conversando. O formulário só adianta a parte chata (medidas, endereço, fotos) para a conversa ser mais produtiva.',
      },
    ],
  },
  {
    id: 'site-whatsapp',
    nome: 'Site com integração ao WhatsApp',
    grupo: 'site',
    descricao:
      'Site com botões que abrem o WhatsApp com mensagem pré-preenchida por serviço, facilitando o primeiro contato e a identificação da origem.',
    paraQuem: 'Negócios cujo atendimento acontece todo pelo WhatsApp.',
    entregaveis: [
      'Botões de WhatsApp por serviço com mensagem pronta',
      'Botão flutuante em todas as páginas',
      'Identificação de que o contato veio do site',
      'Integração com WhatsApp Business (catálogo/link)',
    ],
    argumentos: [
      'Não substitui o WhatsApp: leva mais gente qualificada até ele.',
      'A mensagem pré-preenchida mostra de qual serviço o cliente veio, agilizando a resposta.',
    ],
    objecoes: [
      {
        frase: 'Meu WhatsApp já resolve tudo.',
        resposta:
          'E ele continua sendo o centro do atendimento. O site entra antes: é onde a pessoa conhece o serviço e chega no seu WhatsApp já sabendo o que quer. Você recebe muitas mensagens do tipo "quanto custa?" sem contexto?',
      },
      {
        frase: 'Para que site se é só para mandar para o WhatsApp?',
        resposta:
          'Porque quem ainda não te conhece costuma querer ver o trabalho antes de chamar. O site organiza essa primeira impressão e o WhatsApp fecha. Um ajuda o outro.',
      },
    ],
  },
  {
    id: 'site-seo',
    nome: 'Site otimizado para mecanismos de busca',
    grupo: 'site',
    descricao:
      'Site construído com boas práticas técnicas de SEO: velocidade, estrutura de títulos, conteúdo por intenção de busca e configuração de ferramentas do Google.',
    paraQuem: 'Empresas cujos clientes pesquisam no Google antes de contratar.',
    entregaveis: [
      'Pesquisa de palavras-chave básica',
      'Estrutura técnica otimizada (velocidade, títulos, metadados)',
      'Configuração do Google Search Console',
      'Textos orientados à busca para as páginas principais',
    ],
    argumentos: [
      'SEO é trabalho de médio prazo: o site certo é a base para aparecer de forma orgânica.',
      'Quem chega pela busca está procurando ativamente o serviço — é diferente de quem vê um post.',
    ],
    objecoes: [
      {
        frase: 'Você garante a primeira posição no Google?',
        resposta:
          'Ninguém pode garantir posição — quem garante está prometendo algo que não controla. O que eu entrego é um site tecnicamente preparado e conteúdo pensado para as buscas do seu cliente. A evolução depende também de concorrência e tempo, e eu te mostro como acompanhar.',
      },
      {
        frase: 'SEO demora muito.',
        resposta:
          'Demora mesmo, e é bom saber disso desde o início. Por isso o site também precisa funcionar para quem chega por indicação ou anúncio. O SEO é um investimento que vai somando com o tempo.',
      },
    ],
  },

  // ---------------- Landing pages ----------------
  {
    id: 'lp-captacao',
    nome: 'Landing page para captação de leads',
    grupo: 'landing',
    descricao:
      'Página única com uma oferta clara e um formulário ou botão para capturar contatos interessados, com integração a planilha, e-mail ou CRM.',
    paraQuem: 'Empresas que querem gerar contatos para o comercial a partir de anúncios ou conteúdo.',
    entregaveis: [
      'Página única com uma oferta e uma ação',
      'Formulário integrado (planilha, e-mail ou CRM)',
      'Pixel/tag de conversão configurados',
      'Página de obrigado',
    ],
    argumentos: [
      'Uma página com um único objetivo tende a converter melhor do que mandar o tráfego para um site genérico.',
      'Permite medir quanto custa cada contato gerado.',
    ],
    objecoes: [
      {
        frase: 'Já mando os anúncios para o WhatsApp.',
        resposta:
          'Isso funciona para muitos negócios. A landing page faz sentido quando você quer filtrar melhor quem chega ou entender de onde vêm os contatos. Hoje você consegue saber quantos contatos cada anúncio trouxe?',
      },
      {
        frase: 'Uma página só não vende.',
        resposta:
          'Sozinha, não — ela é uma peça do processo. A função dela é transformar o clique em contato. Quem vende continua sendo você, mas com contatos mais preparados.',
      },
    ],
  },
  {
    id: 'lp-anuncios',
    nome: 'Página para campanhas de anúncios',
    grupo: 'landing',
    descricao:
      'Página alinhada à mensagem do anúncio (Google ou Meta), com carregamento rápido e rastreamento de conversões para otimizar a campanha.',
    paraQuem: 'Quem já investe em tráfego pago ou pretende investir.',
    entregaveis: [
      'Página coerente com o anúncio',
      'Carregamento rápido no celular',
      'Eventos de conversão configurados',
      'Variações para teste A/B (quando contratado)',
    ],
    argumentos: [
      'Quando o anúncio promete uma coisa e a página mostra outra, o clique é desperdiçado.',
      'Com o rastreamento correto, o gestor de tráfego consegue otimizar com dados reais.',
    ],
    objecoes: [
      {
        frase: 'Meu gestor de tráfego disse que não precisa.',
        resposta:
          'Vale ouvir ele, que conhece sua campanha. Uma boa forma de decidir é olhar os números: quantos cliques viram contato hoje? Se estiver bom, ótimo. Se estiver baixo, a página pode ser um ponto a testar — posso conversar com ele também.',
      },
      {
        frase: 'Já gasto com anúncio, não quero gastar com página.',
        resposta:
          'Entendo. A página não é gasto a mais se ela fizer o dinheiro do anúncio render mais. Se hoje o custo por contato está alto, ela é uma das primeiras coisas a revisar.',
      },
    ],
  },
  {
    id: 'lp-lancamento',
    nome: 'Página para lançamentos',
    grupo: 'landing',
    descricao:
      'Páginas de captura, aquecimento e vendas para lançamento de cursos, produtos ou serviços, com contagem regressiva e integração com plataforma de pagamento.',
    paraQuem: 'Infoprodutores, especialistas e empresas lançando produtos com data marcada.',
    entregaveis: [
      'Página de captura e página de vendas',
      'Integração com plataforma de pagamento ou checkout',
      'Seções de prova social e FAQ',
      'Ajustes rápidos durante o lançamento (conforme combinado)',
    ],
    argumentos: [
      'Lançamento tem data: a página precisa estar pronta, testada e estável antes do dia.',
      'Ter alguém disponível para ajustes durante o lançamento evita perder vendas por detalhe técnico.',
    ],
    objecoes: [
      {
        frase: 'A plataforma de curso já tem página.',
        resposta:
          'Tem, e para muitos casos ela resolve. A página própria entra quando você quer mais controle sobre a apresentação, rastreamento e identidade visual. Qual é a sua expectativa de faturamento nesse lançamento?',
      },
      {
        frase: 'Preciso para semana que vem.',
        resposta:
          'Dá para avaliar. O prazo depende muito de você já ter os textos e a oferta definida. Se estiver tudo pronto, consigo te dizer hoje se é viável — prefiro te falar a verdade do que prometer e atrasar seu lançamento.',
      },
    ],
  },
  {
    id: 'lp-autonomo',
    nome: 'Página para profissionais autônomos',
    grupo: 'landing',
    descricao:
      'Página pessoal com apresentação, serviços, portfólio, depoimentos e contato — o "link da bio" profissional.',
    paraQuem: 'Autônomos e profissionais liberais que vendem a própria reputação.',
    entregaveis: [
      'Página única com apresentação e serviços',
      'Portfólio ou galeria de trabalhos',
      'Botões de contato e agenda',
      'Domínio com o nome do profissional',
    ],
    argumentos: [
      'Substitui o link genérico da bio por uma apresentação organizada e com o seu nome.',
      'É barato de manter e fácil de atualizar.',
    ],
    objecoes: [
      {
        frase: 'Uso um link da bio gratuito.',
        resposta:
          'Funciona bem para reunir links. A página própria faz sentido quando você quer apresentar seu trabalho com mais cuidado e ter um endereço com o seu nome. Quem te procura hoje costuma pedir portfólio?',
      },
      {
        frase: 'Sou autônomo, não sou empresa.',
        resposta:
          'Justamente: para autônomo, a reputação é o negócio. Uma página simples ajuda quem recebeu sua indicação a confiar antes de chamar.',
      },
    ],
  },
  {
    id: 'lp-servicos',
    nome: 'Página para divulgação de serviços',
    grupo: 'landing',
    descricao: 'Página dedicada a um serviço específico ou campanha sazonal, para divulgar em redes, anúncios e grupos.',
    paraQuem: 'Negócios que querem destacar um serviço ou promoção sem refazer o site inteiro.',
    entregaveis: ['Página com foco em um serviço', 'Chamada clara para contato', 'Versão otimizada para compartilhamento', 'Integração com WhatsApp'],
    argumentos: [
      'Uma página por campanha deixa a comunicação mais clara do que um post que some no feed.',
      'Pode ser reaproveitada em datas sazonais.',
    ],
    objecoes: [
      {
        frase: 'Um post resolve.',
        resposta:
          'Para avisar, resolve. A página serve quando você quer explicar melhor, reunir dúvidas e ter um link fixo para mandar no WhatsApp e em anúncios. Você costuma receber muitas perguntas sobre esse serviço?',
      },
      {
        frase: 'É só para uma campanha, não compensa.',
        resposta:
          'Dá para deixar a página pronta para ser reaproveitada nas próximas campanhas, trocando textos e imagens. Aí o investimento não fica preso a uma data só.',
      },
    ],
  },
  {
    id: 'lp-eventos',
    nome: 'Página para eventos',
    grupo: 'landing',
    descricao: 'Página com programação, local, palestrantes, inscrição ou venda de ingressos e informações práticas do evento.',
    paraQuem: 'Organizadores de eventos, workshops, congressos e festas.',
    entregaveis: [
      'Programação e informações do evento',
      'Integração com plataforma de ingressos ou formulário de inscrição',
      'Mapa e informações de acesso',
      'Atualizações até a data do evento',
    ],
    argumentos: [
      'Centraliza as informações que hoje se perdem em vários posts e mensagens.',
      'Reduz perguntas repetidas sobre horário, local e valores.',
    ],
    objecoes: [
      {
        frase: 'A plataforma de ingressos já tem página.',
        resposta:
          'Tem, e ela é ótima para vender o ingresso. A página do evento cuida da apresentação — programação, palestrantes, patrocinadores — e leva para a compra. Você tem patrocinadores para destacar?',
      },
      {
        frase: 'O evento é daqui a pouco, não dá tempo.',
        resposta:
          'Depende do que já está definido. Uma página objetiva com as informações essenciais costuma ser rápida de fazer. Me conta a data e o que você já tem pronto que eu te digo se é viável.',
      },
    ],
  },

  // ---------------- Lojas virtuais ----------------
  {
    id: 'ecommerce',
    nome: 'E-commerce',
    grupo: 'loja',
    descricao:
      'Loja virtual completa com catálogo, carrinho, pagamento online, cálculo de frete, gestão de pedidos e área do cliente.',
    paraQuem: 'Negócios que querem vender para além da região ou fora do horário de atendimento.',
    entregaveis: [
      'Catálogo com variações (tamanho, cor)',
      'Carrinho e checkout com meios de pagamento',
      'Cálculo de frete integrado',
      'Painel de pedidos e estoque',
      'Treinamento para cadastrar produtos',
    ],
    argumentos: [
      'A loja vende enquanto você atende outro cliente ou está fechado.',
      'Organiza pedidos e estoque num lugar só, em vez de controlar tudo pelo WhatsApp.',
    ],
    objecoes: [
      {
        frase: 'Loja virtual dá muito trabalho.',
        resposta:
          'Dá trabalho, sim — principalmente cadastro de produtos, fotos e logística. É bom saber disso antes. Por isso vale começar com os produtos que mais vendem e crescer aos poucos. Quem cuidaria dos pedidos no dia a dia?',
      },
      {
        frase: 'Já vendo pelo marketplace.',
        resposta:
          'O marketplace traz volume, mas cobra comissão e o cliente é dele. A loja própria serve para construir sua base de clientes e margem maior nas recompras. Muitos usam os dois. Quanto você paga de comissão hoje?',
      },
    ],
  },
  {
    id: 'catalogo-digital',
    nome: 'Catálogo digital',
    grupo: 'loja',
    descricao: 'Vitrine online com produtos, preços (ou "sob consulta"), fotos e categorias, sem pagamento online.',
    paraQuem: 'Lojas que querem mostrar produtos sem a complexidade de um e-commerce completo.',
    entregaveis: ['Catálogo por categorias', 'Painel para atualizar produtos e preços', 'Busca e filtros simples', 'Compartilhamento de produto por link'],
    argumentos: [
      'Responde a pergunta "o que vocês têm?" sem você mandar dezenas de fotos.',
      'É um passo intermediário mais barato antes do e-commerce.',
    ],
    objecoes: [
      {
        frase: 'Meus produtos mudam toda semana.',
        resposta:
          'Por isso o catálogo vem com painel para você atualizar em minutos, pelo celular. Dá para marcar como esgotado sem apagar. Quantos produtos novos entram por semana, mais ou menos?',
      },
      {
        frase: 'Mando fotos no WhatsApp e resolve.',
        resposta:
          'Resolve, mas toma tempo — e o cliente precisa esperar você responder. Com o catálogo, você manda um link e ele navega sozinho. Quanto tempo por dia você gasta mandando fotos?',
      },
    ],
  },
  {
    id: 'catalogo-whatsapp',
    nome: 'Catálogo com pedidos pelo WhatsApp',
    grupo: 'loja',
    descricao:
      'Catálogo online em que o cliente monta o pedido e envia pronto para o WhatsApp da loja, com itens, quantidades e observações.',
    paraQuem: 'Delivery, lojas de bairro e negócios que fecham venda no WhatsApp.',
    entregaveis: [
      'Carrinho que gera a mensagem do pedido',
      'Opções de entrega/retirada',
      'Painel para preços e disponibilidade',
      'Horário de funcionamento automático',
    ],
    argumentos: [
      'O pedido chega organizado, reduzindo erros de anotação.',
      'Não cobra comissão por pedido, diferente dos aplicativos de delivery.',
    ],
    objecoes: [
      {
        frase: 'Já estou no aplicativo de delivery.',
        resposta:
          'O aplicativo traz clientes novos, e faz sentido continuar. O catálogo próprio é para quem já te conhece pedir direto, sem comissão. Que porcentagem dos seus pedidos são de clientes que já compraram antes?',
      },
      {
        frase: 'Meus clientes vão continuar mandando áudio.',
        resposta:
          'Alguns vão, e tudo bem. O catálogo é uma opção a mais. Com o tempo, quem pede sempre costuma preferir porque é mais rápido. Dá para colocar o link na mensagem automática de saudação.',
      },
    ],
  },
  {
    id: 'loja-checkout',
    nome: 'Loja com checkout',
    grupo: 'loja',
    descricao: 'Loja com pagamento online (Pix, cartão, boleto) via intermediador, confirmação automática e notificações de pedido.',
    paraQuem: 'Quem quer receber antes de separar o pedido e reduzir calote.',
    entregaveis: [
      'Integração com gateway de pagamento',
      'Pix e cartão com confirmação automática',
      'E-mails de confirmação de pedido',
      'Política de troca e privacidade publicadas',
    ],
    argumentos: [
      'Recebe antes de enviar, reduzindo pedidos desistidos ou não pagos.',
      'O cliente compra no momento de interesse, sem esperar atendimento.',
    ],
    objecoes: [
      {
        frase: 'As taxas de cartão são altas.',
        resposta:
          'São um custo real, e vale colocar na conta. Dá para incentivar Pix com condição melhor e deixar o cartão como opção. Eu te mostro as taxas do intermediador antes de decidir, sem surpresa.',
      },
      {
        frase: 'Tenho medo de fraude.',
        resposta:
          'É uma preocupação válida. Os intermediadores de pagamento têm análise antifraude e você não armazena dados de cartão na loja. Não existe risco zero, mas existem boas práticas que reduzem muito — eu te explico quais.',
      },
    ],
  },
  {
    id: 'loja-gestao-produtos',
    nome: 'Loja com gerenciamento de produtos',
    grupo: 'loja',
    descricao: 'Loja com painel administrativo completo: produtos, variações, estoque, promoções, cupons e relatórios de vendas.',
    paraQuem: 'Lojas com muitos produtos ou equipe que precisa atualizar o catálogo com frequência.',
    entregaveis: ['Painel de produtos e estoque', 'Cupons e promoções', 'Relatórios de vendas', 'Usuários para a equipe'],
    argumentos: [
      'A equipe atualiza sem depender do desenvolvedor.',
      'Estoque sincronizado evita vender o que não tem.',
    ],
    objecoes: [
      {
        frase: 'Minha equipe não vai saber usar.',
        resposta:
          'Isso é comum e tem solução: treinamento gravado e painel simples, com só o que vocês usam. Quem da equipe cuidaria do cadastro? Posso fazer o treinamento direto com essa pessoa.',
      },
      {
        frase: 'Já controlo estoque em outro sistema.',
        resposta:
          'Então o ideal é avaliar se esse sistema permite integração, para não ter estoque duplicado. Qual sistema você usa? Eu verifico antes de te prometer qualquer coisa.',
      },
    ],
  },

  // ---------------- Sistemas e plataformas ----------------
  {
    id: 'sis-agendamento',
    nome: 'Sistema de agendamento',
    grupo: 'sistema',
    descricao:
      'Agenda online com horários disponíveis por profissional e serviço, confirmação, lembretes e painel para a equipe.',
    paraQuem: 'Negócios que vivem de horário marcado: salões, clínicas, consultórios, oficinas, estúdios.',
    entregaveis: [
      'Página de agendamento para o cliente',
      'Agenda por profissional e serviço',
      'Lembretes (e-mail/WhatsApp conforme integração)',
      'Bloqueio de horários e folgas',
      'Relatório de atendimentos',
    ],
    argumentos: [
      'O cliente agenda a qualquer hora, sem depender de alguém responder.',
      'Lembretes ajudam a reduzir faltas — e cada falta é um horário que não volta.',
    ],
    objecoes: [
      {
        frase: 'Já existem aplicativos de agenda prontos.',
        resposta:
          'Existem, e alguns são ótimos — às vezes eu mesmo indico. O sistema próprio faz sentido quando sua regra de agenda é específica (encaixes, pacotes, vários profissionais) ou a mensalidade por profissional fica cara. Como funciona a sua agenda hoje?',
      },
      {
        frase: 'Meus clientes preferem marcar pelo WhatsApp.',
        resposta:
          'Muitos preferem, e podem continuar. A agenda online atende quem quer marcar fora do horário e libera você de ficar trocando mensagens para achar um horário. Quantos agendamentos por dia vocês fazem?',
      },
    ],
  },
  {
    id: 'sis-gestao',
    nome: 'Sistema de gestão empresarial',
    grupo: 'sistema',
    descricao:
      'Sistema sob medida para os processos da empresa: cadastros, operações, financeiro básico, estoque e relatórios, conforme o levantamento.',
    paraQuem: 'Empresas com processos próprios que não se encaixam bem em sistemas prontos.',
    entregaveis: [
      'Levantamento de processos',
      'Módulos definidos em escopo',
      'Perfis de acesso',
      'Relatórios essenciais',
      'Implantação e treinamento',
    ],
    argumentos: [
      'O sistema se adapta ao processo, e não o contrário.',
      'Começa pelo módulo que mais dói e cresce por fases.',
    ],
    objecoes: [
      {
        frase: 'ERP pronto é mais barato.',
        resposta:
          'Na mensalidade inicial, muitas vezes é. A comparação justa inclui quanto do ERP vocês realmente usam, as adaptações que fazem por fora e quanto custa em alguns anos. Às vezes o ERP pronto é a melhor escolha — eu te ajudo a avaliar.',
      },
      {
        frase: 'Quero tudo de uma vez.',
        resposta:
          'Entendo a vontade. Projetos grandes feitos de uma vez costumam atrasar e ficar caros. Começar pelo processo mais crítico permite usar rápido e ajustar com base no uso real. Qual processo mais te dá dor de cabeça hoje?',
      },
    ],
  },
  {
    id: 'sis-crm',
    nome: 'CRM personalizado',
    grupo: 'sistema',
    descricao:
      'Sistema para acompanhar leads e clientes: funil de vendas, histórico de contatos, tarefas, propostas e relatórios do comercial.',
    paraQuem: 'Equipes comerciais que perdem oportunidades por falta de acompanhamento.',
    entregaveis: ['Funil com etapas personalizadas', 'Histórico por cliente', 'Tarefas e lembretes', 'Relatórios de conversão', 'Importação de planilhas'],
    argumentos: [
      'Mostra onde as vendas travam, com dados e não com impressão.',
      'Nenhum lead fica esquecido porque o vendedor saiu de férias.',
    ],
    objecoes: [
      {
        frase: 'Minha equipe não vai preencher o CRM.',
        resposta:
          'Esse é o principal risco de qualquer CRM, e é por isso que o personalizado precisa pedir só o essencial. Se o vendedor ganha tempo usando, ele usa. O que a sua equipe mais reclama de anotar hoje?',
      },
      {
        frase: 'Por que não usar um CRM pronto?',
        resposta:
          'Pode ser a melhor opção, e vale testar. O personalizado faz sentido quando o processo é muito específico ou quando o custo por usuário cresce muito com a equipe. Quantas pessoas usariam?',
      },
    ],
  },
  {
    id: 'sis-painel-admin',
    nome: 'Painel administrativo',
    grupo: 'sistema',
    descricao: 'Área restrita para a empresa gerenciar conteúdos, cadastros, pedidos ou usuários de um site ou aplicação.',
    paraQuem: 'Quem precisa atualizar informações sem depender do desenvolvedor.',
    entregaveis: ['Login com perfis de acesso', 'Cadastros com busca e filtros', 'Registro de alterações', 'Exportação de dados'],
    argumentos: [
      'Dá autonomia para atualizar sem abrir chamado a cada mudança.',
      'Perfis de acesso evitam que todo mundo mexa em tudo.',
    ],
    objecoes: [
      {
        frase: 'Não sei se vou usar o painel.',
        resposta:
          'Então vale entender o que muda com frequência no seu negócio. Se quase nada muda, talvez você não precise de painel agora. O que você atualiza toda semana?',
      },
      {
        frase: 'Quero acesso a tudo.',
        resposta:
          'Você terá acesso administrativo completo ao seu painel. Recomendo apenas perfis separados para a equipe, cada um com o que precisa. Isso protege seus dados.',
      },
    ],
  },
  {
    id: 'sis-orcamentos',
    nome: 'Sistema de orçamentos',
    grupo: 'sistema',
    descricao: 'Sistema para montar orçamentos padronizados com tabela de preços, cálculo automático, PDF e acompanhamento de status.',
    paraQuem: 'Empresas que fazem muitos orçamentos personalizados: vidraçarias, serralherias, gráficas, energia solar.',
    entregaveis: ['Tabela de preços e regras de cálculo', 'Geração de PDF com a marca', 'Status do orçamento (enviado, aprovado, perdido)', 'Histórico por cliente'],
    argumentos: [
      'Reduz erros de cálculo e o tempo para enviar orçamento.',
      'Mostra quantos orçamentos viram venda e por quê.',
    ],
    objecoes: [
      {
        frase: 'Faço orçamento no Excel e funciona.',
        resposta:
          'Se está funcionando bem, ótimo. O sistema faz sentido quando o volume cresce, mais de uma pessoa orça ou acontecem erros de cálculo. Quantos orçamentos vocês fazem por semana e quanto tempo leva cada um?',
      },
      {
        frase: 'Meus cálculos são muito específicos.',
        resposta:
          'É exatamente aí que um sistema próprio ajuda: a regra fica registrada e todo mundo calcula igual. Precisaria entender suas fórmulas com calma antes de estimar.',
      },
    ],
  },
  {
    id: 'sis-clientes',
    nome: 'Sistema de controle de clientes',
    grupo: 'sistema',
    descricao: 'Cadastro centralizado de clientes com histórico de compras, atendimentos, anexos e lembretes de retorno.',
    paraQuem: 'Negócios que vivem de recorrência e relacionamento.',
    entregaveis: ['Ficha completa do cliente', 'Histórico de atendimentos', 'Lembretes de retorno', 'Segmentação para campanhas'],
    argumentos: [
      'Saber quem não volta há 60 dias vira ação de reativação.',
      'A informação deixa de ficar só na cabeça de quem atende.',
    ],
    objecoes: [
      {
        frase: 'Tenho tudo na agenda do celular.',
        resposta:
          'Funciona enquanto é só você. Quando a base cresce ou entra alguém na equipe, a informação se perde. Quantos clientes ativos você tem hoje?',
      },
      {
        frase: 'E a LGPD?',
        resposta:
          'Boa pergunta, e precisa ser tratada desde o início: coletar só o necessário, controlar quem acessa e permitir corrigir ou excluir dados. Eu explico como o sistema trata isso, e a parte jurídica vale validar com seu advogado ou contador.',
      },
    ],
  },
  {
    id: 'sis-imobiliaria',
    nome: 'Sistema para imobiliárias',
    grupo: 'sistema',
    descricao:
      'Site com busca de imóveis por filtros, painel de cadastro, captação de interessados, gestão de leads e integração com portais quando houver API ou XML disponível.',
    paraQuem: 'Imobiliárias e corretores com carteira própria de imóveis.',
    entregaveis: ['Busca por tipo, bairro, preço e características', 'Painel de imóveis com fotos', 'Formulário de interesse por imóvel', 'Exportação para portais (quando suportado)'],
    argumentos: [
      'O cliente navega na sua carteira sem a concorrência ao lado, como acontece nos portais.',
      'Cada lead chega associado ao imóvel de interesse.',
    ],
    objecoes: [
      {
        frase: 'Os portais já trazem meus clientes.',
        resposta:
          'E devem continuar trazendo. O site próprio é onde o cliente vê só os seus imóveis e onde você direciona quem chegou por indicação ou redes sociais. Quanto você investe nos portais por mês?',
      },
      {
        frase: 'Cadastrar imóvel em dois lugares dá trabalho.',
        resposta:
          'Dá mesmo. Por isso vale verificar se dá para cadastrar uma vez e exportar para os portais que aceitam integração. Quais portais você usa? Eu confirmo antes de te prometer.',
      },
    ],
  },
  {
    id: 'sis-assinaturas',
    nome: 'Plataforma de assinaturas',
    grupo: 'sistema',
    descricao: 'Sistema de planos recorrentes com cobrança automática, área do assinante, controle de inadimplência e relatórios.',
    paraQuem: 'Clubes de assinatura, serviços recorrentes, academias, escolas e produtores de conteúdo.',
    entregaveis: ['Planos e cobrança recorrente via intermediador', 'Área do assinante', 'Gestão de inadimplência', 'Relatório de receita recorrente'],
    argumentos: [
      'Receita recorrente dá previsibilidade ao caixa.',
      'Cobrança automática reduz o trabalho de cobrar todo mês.',
    ],
    objecoes: [
      {
        frase: 'Meus clientes não vão querer assinar.',
        resposta:
          'Pode ser — e vale testar antes de investir pesado. Um plano piloto com poucos clientes mostra a aceitação. Algum cliente seu já compra todo mês do mesmo jeito?',
      },
      {
        frase: 'Plataformas prontas já fazem isso.',
        resposta:
          'Fazem, e podem ser a melhor opção para começar. O sistema próprio faz sentido quando as regras de plano são específicas ou as taxas da plataforma pesam muito no volume.',
      },
    ],
  },
  {
    id: 'sis-membros',
    nome: 'Portal de membros',
    grupo: 'sistema',
    descricao: 'Área exclusiva com login para clientes, alunos ou associados acessarem conteúdos, documentos, aulas ou benefícios.',
    paraQuem: 'Escolas, associações, consultorias, academias e produtores de conteúdo.',
    entregaveis: ['Cadastro e login de membros', 'Conteúdos por nível de acesso', 'Área de documentos/aulas', 'Painel de gestão de membros'],
    argumentos: [
      'Organiza conteúdos que hoje estão espalhados em grupos de WhatsApp e pastas.',
      'Controla quem tem acesso a quê.',
    ],
    objecoes: [
      {
        frase: 'O grupo de WhatsApp já funciona.',
        resposta:
          'Para avisos rápidos, funciona muito bem. O problema costuma ser encontrar um arquivo de três meses atrás ou controlar quem saiu. O portal guarda e organiza; o grupo continua para conversas.',
      },
      {
        frase: 'Meus membros não vão lembrar a senha.',
        resposta:
          'Dá para usar acesso por link no e-mail, sem senha. A ideia é ser o mais simples possível para quem entra.',
      },
    ],
  },
  {
    id: 'sis-pedidos',
    nome: 'Sistema de pedidos',
    grupo: 'sistema',
    descricao: 'Sistema para receber, organizar e acompanhar pedidos (balcão, delivery, B2B), com status, impressão e relatórios.',
    paraQuem: 'Restaurantes, distribuidoras, confeitarias e indústrias com muitos pedidos.',
    entregaveis: ['Recebimento de pedidos online', 'Painel de status (recebido, em produção, saiu)', 'Impressão de comanda', 'Relatórios por período e produto'],
    argumentos: [
      'Diminui pedido esquecido ou anotado errado.',
      'Mostra o que mais vende e em que horário.',
    ],
    objecoes: [
      {
        frase: 'No caderno eu nunca perdi pedido.',
        resposta:
          'Que bom, isso mostra organização. O sistema entra quando o volume cresce ou mais gente anota. Em dia de pico, quantos pedidos passam por vocês?',
      },
      {
        frase: 'E se a internet cair?',
        resposta:
          'Pergunta importante. Precisamos definir um plano de contingência (internet reserva pelo celular, registro manual temporário). Não existe sistema online que funcione sem internet nenhuma — e eu prefiro ser claro sobre isso.',
      },
    ],
  },
  {
    id: 'sis-dashboards',
    nome: 'Dashboard empresarial',
    grupo: 'sistema',
    descricao: 'Painel com indicadores do negócio (vendas, metas, financeiro, operação) a partir dos dados que a empresa já tem.',
    paraQuem: 'Gestores que tomam decisão olhando várias planilhas.',
    entregaveis: ['Definição dos indicadores com o gestor', 'Conexão com as fontes de dados', 'Gráficos e filtros por período', 'Acesso por perfil'],
    argumentos: [
      'Transforma horas montando relatório em minutos olhando o painel.',
      'Todo mundo olha o mesmo número.',
    ],
    objecoes: [
      {
        frase: 'Meus dados estão bagunçados.',
        resposta:
          'Isso é muito comum, e é a primeira etapa do trabalho: entender e organizar as fontes. Um painel com dados errados é pior que nenhum, então isso entra no escopo com transparência.',
      },
      {
        frase: 'Power BI já faz isso.',
        resposta:
          'Faz, e pode ser o caminho. A diferença está em quem vai montar, manter e se o painel precisa ficar dentro de um sistema próprio. Vocês têm alguém que cuida disso hoje?',
      },
    ],
  },
  {
    id: 'sis-multiusuario',
    nome: 'Plataforma com múltiplos usuários',
    grupo: 'sistema',
    descricao: 'Aplicação com diferentes tipos de usuário (admin, equipe, cliente, parceiro), permissões e dados separados por conta.',
    paraQuem: 'Empresas com equipe, filiais, franquias ou clientes que precisam acessar o sistema.',
    entregaveis: ['Perfis e permissões', 'Separação de dados por empresa/filial', 'Registro de atividades', 'Gestão de convites e acessos'],
    argumentos: [
      'Cada pessoa vê só o que precisa — mais segurança e menos confusão.',
      'Prepara o sistema para crescer com novas filiais ou clientes.',
    ],
    objecoes: [
      {
        frase: 'Todo mundo pode usar o mesmo login.',
        resposta:
          'Funciona até o dia em que algo é apagado e ninguém sabe quem foi, ou alguém sai da empresa com a senha. Logins individuais protegem você. Quantas pessoas usariam?',
      },
      {
        frase: 'Permissões deixam tudo complicado.',
        resposta:
          'Bem configuradas, ficam invisíveis para quem usa. A ideia é ter poucos perfis claros, não uma lista enorme de opções.',
      },
    ],
  },
  {
    id: 'sis-banco-dados',
    nome: 'Sistema com banco de dados',
    grupo: 'sistema',
    descricao: 'Aplicação web com banco de dados estruturado, backups, exportação e controle de acesso, substituindo planilhas compartilhadas.',
    paraQuem: 'Empresas que dependem de planilhas grandes, editadas por várias pessoas.',
    entregaveis: ['Modelagem dos dados', 'Telas de cadastro e consulta', 'Backup automático', 'Exportação para Excel'],
    argumentos: [
      'Acaba com o "quem apagou a linha?" e versões diferentes da mesma planilha.',
      'Os dados continuam exportáveis: você não fica preso.',
    ],
    objecoes: [
      {
        frase: 'Planilha é mais flexível.',
        resposta:
          'É, e essa flexibilidade é ótima no começo. O problema aparece quando várias pessoas editam e os erros passam despercebidos. Já aconteceu de alguém sobrescrever dados importantes?',
      },
      {
        frase: 'E se eu quiser sair do sistema?',
        resposta:
          'Seus dados são seus: o sistema permite exportar tudo, e isso fica escrito no contrato.',
      },
    ],
  },
  {
    id: 'sis-portal-marketplace',
    nome: 'Portal ou marketplace',
    grupo: 'sistema',
    descricao: 'Plataforma que conecta dois lados (fornecedores e clientes), com cadastro, busca, pedidos, comissões e moderação.',
    paraQuem: 'Empreendedores com um modelo de intermediação ou associações que querem reunir fornecedores.',
    entregaveis: ['Cadastro de fornecedores e clientes', 'Busca e filtros', 'Fluxo de pedido/contato', 'Moderação e painel administrativo'],
    argumentos: [
      'Começar com um MVP enxuto valida o modelo antes de investir no completo.',
      'O escopo por fases reduz o risco de construir funcionalidades que ninguém usa.',
    ],
    objecoes: [
      {
        frase: 'Quero algo igual ao [grande marketplace].',
        resposta:
          'Faz sentido usar como referência. Só é importante lembrar que essas plataformas levaram anos e equipes grandes. O caminho realista é identificar o essencial para validar a ideia e crescer a partir do uso. O que um cliente precisa conseguir fazer no primeiro dia?',
      },
      {
        frase: 'Como vou atrair os dois lados?',
        resposta:
          'Essa é a pergunta mais importante do projeto, e ela é de negócio, não de tecnologia. Antes de desenvolver, vale ter um plano para os primeiros fornecedores e clientes. Posso te ajudar a desenhar um MVP que permita testar isso.',
      },
    ],
  },

  // ---------------- Serviços recorrentes ----------------
  {
    id: 'rec-manutencao',
    nome: 'Manutenção de sites',
    grupo: 'recorrente',
    descricao: 'Plano mensal com atualizações técnicas, correções, pequenas alterações de conteúdo e suporte em horário definido.',
    paraQuem: 'Quem tem site ou sistema no ar e não quer se preocupar com a parte técnica.',
    entregaveis: ['Atualizações de segurança e plugins', 'Pequenas alterações mensais (limite definido)', 'Suporte por WhatsApp/e-mail', 'Relatório mensal do que foi feito'],
    argumentos: [
      'Site desatualizado tende a ficar mais vulnerável e lento com o tempo.',
      'Você tem a quem recorrer com prazo combinado.',
    ],
    objecoes: [
      {
        frase: 'Meu site não precisa de manutenção.',
        resposta:
          'Alguns sites quase não precisam mesmo, principalmente os estáticos. Sites com plugins, formulários e painel precisam de atualização periódica. Posso te explicar o que entra na manutenção do seu caso e você decide se vale.',
      },
      {
        frase: 'Só chamo quando der problema.',
        resposta:
          'É uma opção válida, cobrando por demanda. A diferença do plano é a prevenção e o prazo de atendimento garantido. Te passo as duas formas para comparar.',
      },
    ],
  },
  {
    id: 'rec-hospedagem',
    nome: 'Hospedagem e suporte',
    grupo: 'recorrente',
    descricao: 'Hospedagem gerenciada com certificado SSL, backups, monitoramento de disponibilidade e suporte técnico.',
    paraQuem: 'Clientes que não querem lidar com painel de hospedagem, DNS e e-mails.',
    entregaveis: ['Servidor configurado e SSL', 'Backups periódicos', 'Configuração de domínio e e-mail', 'Suporte técnico'],
    argumentos: [
      'Você não precisa saber o que é DNS: alguém cuida disso por você.',
      'Backup feito por quem conhece o site facilita a recuperação.',
    ],
    objecoes: [
      {
        frase: 'Hospedagem é barata, por que pagar mais?',
        resposta:
          'A hospedagem em si é barata mesmo. O que você paga a mais é a gestão: configuração, backup, SSL, monitoramento e alguém para resolver quando algo der errado. Se preferir contratar direto, eu te oriento e o domínio fica no seu nome.',
      },
      {
        frase: 'O domínio fica no nome de quem?',
        resposta:
          'No seu. Domínio e contas principais devem estar no nome do cliente. Eu tenho acesso para administrar, mas a propriedade é sua.',
      },
    ],
  },
  {
    id: 'rec-seo',
    nome: 'SEO',
    grupo: 'recorrente',
    descricao: 'Trabalho contínuo de conteúdo, otimização técnica, Perfil da Empresa no Google e relatórios de evolução orgânica.',
    paraQuem: 'Empresas com concorrência local ou nacional que dependem de busca.',
    entregaveis: ['Diagnóstico inicial', 'Conteúdos mensais', 'Otimizações técnicas', 'Relatório de posições e tráfego'],
    argumentos: [
      'É um canal que continua trazendo visitas mesmo quando você para de investir em anúncio.',
      'Resultados acumulam com o tempo — por isso exige constância.',
    ],
    objecoes: [
      {
        frase: 'Em quanto tempo eu apareço no Google?',
        resposta:
          'Depende da concorrência e do ponto de partida, e não dá para garantir posição. Normalmente avaliamos a evolução em meses, não em dias. Eu te mostro relatórios mensais para você acompanhar com transparência.',
      },
      {
        frase: 'Já paguei SEO e não vi nada.',
        resposta:
          'Isso é frustrante e infelizmente comum. Você lembra quais entregas recebia? Com relatórios claros de cada mês você consegue ver o que está sendo feito, e não só esperar.',
      },
    ],
  },
  {
    id: 'rec-atualizacoes',
    nome: 'Atualizações de conteúdo',
    grupo: 'recorrente',
    descricao: 'Pacote mensal de alterações: textos, fotos, banners, preços, cardápio, novos produtos ou páginas simples.',
    paraQuem: 'Negócios que mudam informações com frequência e não querem mexer no painel.',
    entregaveis: ['Banco de horas ou número de alterações por mês', 'Prazo de execução combinado', 'Histórico de pedidos'],
    argumentos: [
      'Site com informação velha passa sensação de empresa parada.',
      'Você manda pelo WhatsApp e alguém resolve.',
    ],
    objecoes: [
      {
        frase: 'Eu mesmo atualizo.',
        resposta:
          'Ótimo! Se o painel está tranquilo para você, não precisa contratar. O pacote é para quem prefere delegar. Posso deixar um treinamento rápido para você atualizar sozinho.',
      },
      {
        frase: 'Quase não tenho alterações.',
        resposta:
          'Então talvez faça mais sentido pagar só quando precisar. Te passo o valor avulso e você decide.',
      },
    ],
  },
  {
    id: 'rec-melhorias',
    nome: 'Melhorias de funcionalidades',
    grupo: 'recorrente',
    descricao: 'Evolução contínua de sistema ou site com novas funcionalidades priorizadas mensalmente.',
    paraQuem: 'Empresas com sistema em uso que querem evoluir aos poucos.',
    entregaveis: ['Backlog priorizado com o cliente', 'Entregas mensais', 'Testes antes de publicar', 'Documentação das mudanças'],
    argumentos: [
      'Evoluir aos poucos reduz risco e distribui o investimento.',
      'As prioridades vêm do uso real, não de suposição.',
    ],
    objecoes: [
      {
        frase: 'Prefiro pagar por funcionalidade.',
        resposta:
          'Funciona também. A diferença do plano mensal é ter capacidade reservada e previsibilidade. Te passo as duas formas e você escolhe.',
      },
      {
        frase: 'Não sei o que melhorar.',
        resposta:
          'Uma boa forma é olhar onde a equipe perde tempo ou reclama. Posso fazer uma conversa rápida com quem usa o sistema para listar as oportunidades.',
      },
    ],
  },
  {
    id: 'rec-monitoramento',
    nome: 'Monitoramento e segurança',
    grupo: 'recorrente',
    descricao: 'Monitoramento de disponibilidade, atualizações de segurança, verificação de backups e resposta a incidentes.',
    paraQuem: 'Sites e sistemas críticos para a operação ou que guardam dados de clientes.',
    entregaveis: ['Alerta de site fora do ar', 'Atualizações de segurança', 'Teste periódico de restauração de backup', 'Plano de resposta a incidentes'],
    argumentos: [
      'Saber que o site caiu antes do cliente reclamar.',
      'Backup só tem valor se for testado.',
    ],
    objecoes: [
      {
        frase: 'Nunca aconteceu nada com meu site.',
        resposta:
          'Ótimo, e o objetivo é que continue assim. Monitoramento é como seguro: você paga para reduzir o impacto do dia em que algo acontecer. Se o site parasse uma tarde, qual seria o impacto?',
      },
      {
        frase: 'Você garante que nunca vão invadir?',
        resposta:
          'Ninguém pode garantir isso com honestidade. O que eu garanto é aplicar boas práticas, manter atualizado e ter backup testado para recuperar rápido se algo acontecer.',
      },
    ],
  },
  {
    id: 'rec-integracoes-api',
    nome: 'Integrações com APIs',
    grupo: 'recorrente',
    descricao: 'Conexão do site ou sistema com outros serviços (pagamentos, ERP, CRM, WhatsApp, e-mail marketing, logística) e manutenção dessas integrações.',
    paraQuem: 'Empresas que redigitam dados entre sistemas.',
    entregaveis: ['Análise da documentação da API', 'Desenvolvimento da integração', 'Tratamento de erros e logs', 'Manutenção quando a API mudar'],
    argumentos: [
      'Acaba com a redigitação e os erros de copiar e colar.',
      'APIs mudam: manutenção evita que a integração pare de funcionar sem aviso.',
    ],
    objecoes: [
      {
        frase: 'É só conectar, por que é caro?',
        resposta:
          'Parece simples, mas envolve entender a API do outro sistema, tratar erros, evitar dados duplicados e manter quando a API muda. Antes de orçar, eu verifico a documentação para te dar um valor realista.',
      },
      {
        frase: 'Por que a integração precisa de manutenção?',
        resposta:
          'Porque o outro sistema pode mudar regras, versões ou limites sem te avisar. A manutenção garante que alguém percebe e ajusta rápido.',
      },
    ],
  },
];
