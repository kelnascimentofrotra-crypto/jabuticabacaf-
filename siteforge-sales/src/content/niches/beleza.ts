import type { Niche } from '../../types';

export const BELEZA: Niche[] = [
  {
    id: 'barbearias',
    nome: 'Barbearias',
    categoria: 'beleza',
    resumo:
      'Vive de agenda cheia e recorrência: o cliente volta a cada 2–4 semanas. A decisão de compra é rápida, guiada por indicação, fotos de cortes e localização. O dono geralmente também é barbeiro, atende o dia inteiro e responde mensagens nos intervalos.',
    comoClientesChegam: [
      'Indicação de amigos e clientes fiéis',
      'Instagram com fotos de cortes',
      'Busca "barbearia perto de mim" no Google Maps',
      'Passagem na frente do ponto',
    ],
    dores: [
      'Agenda controlada pelo WhatsApp: mensagens fora de hora e conflitos de horário',
      'Faltas sem aviso que deixam a cadeira vazia',
      'Perguntas repetidas sobre preço, horário e endereço',
      'Dificuldade de vender planos/assinaturas e produtos',
    ],
    solucoes: [
      { servico: 'sis-agendamento', porque: 'Cliente escolhe barbeiro e horário sozinho, a qualquer hora, com lembrete.' },
      { servico: 'site-negocio-local', porque: 'Serviços, preços, endereço e botão de agendamento num link só, reforçando o Google Maps.' },
      { servico: 'sis-assinaturas', porque: 'Planos mensais de corte/barba com cobrança recorrente dão previsibilidade.' },
    ],
    argumentos: [
      'Agenda online trabalha enquanto o barbeiro atende: ninguém precisa largar a tesoura para responder horário.',
      'Lembrete automático ajuda a reduzir faltas — cada cadeira vazia é receita que não volta.',
      'Um link fixo com serviços e preços responde as perguntas repetidas do Direct.',
    ],
    perguntas: [
      'Hoje, como os clientes marcam horário: WhatsApp, Direct ou chegando na hora?',
      'Quantas faltas sem aviso acontecem numa semana normal?',
      'Quantos barbeiros atendem e cada um tem agenda própria?',
      'Você já oferece algum plano mensal?',
    ],
    objecoes: [
      {
        id: 'cliente-chega-na-hora',
        frase: 'Aqui o cliente chega e espera, não precisa de agenda.',
        porTras: 'O modelo por ordem de chegada funciona e ele teme perder o cliente que passa na porta.',
        resposta:
          'Faz sentido, o movimento de quem chega é importante. Dá para manter os dois: parte dos horários fica para quem chega e parte para quem prefere marcar. Hoje tem cliente que desiste quando vê a barbearia cheia?',
        pergunta: 'Quantas pessoas por semana vão embora porque a espera estava longa?',
        proximoPasso: 'Proponha testar agenda online só para um barbeiro ou só em horários de pico.',
      },
      {
        id: 'cliente-nao-usa-app',
        frase: 'Meu cliente não vai usar link para marcar.',
        porTras: 'Acha que o público prefere conversar e tem receio de parecer impessoal.',
        resposta:
          'Alguns vão continuar mandando mensagem, e tudo bem. O link entra como opção para quem quer marcar às 23h sem esperar resposta. Você recebe muita mensagem de agendamento fora do horário?',
        pergunta: 'Quantas mensagens de agendamento chegam depois que a barbearia fecha?',
        proximoPasso: 'Mostre como fica o link na bio e na mensagem automática do WhatsApp Business.',
      },
      {
        id: 'ja-uso-app-agenda',
        frase: 'Já uso um aplicativo de agenda.',
        porTras: 'Já resolveu a agenda e não quer trocar algo que funciona.',
        resposta:
          'Ótimo, então a agenda está resolvida. Nesse caso o site entra só como vitrine: serviços, fotos, endereço e o botão levando para o seu app de agenda. Ele já tem uma página bonita com seus cortes?',
        pergunta: 'Quanto você paga por mês pelo app, considerando todos os barbeiros?',
        proximoPasso: 'Ofereça site simples integrado ao app atual, sem trocar a agenda.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi, tudo bem? Vi os cortes de vocês no Instagram, trabalho bonito demais. Posso te fazer uma pergunta rápida sobre a agenda da barbearia?' },
      { autor: 'cliente', texto: 'Pode, mas já tenho Instagram, não preciso de site.' },
      {
        autor: 'vendedor',
        texto:
          'Boa! O Instagram ajuda bastante na divulgação. A ideia do site seria complementar o que você já faz, reunindo serviços, localização, horários e um caminho fácil para o cliente entrar em contato. Hoje, seus clientes encontram essas informações com facilidade?',
      },
      { autor: 'cliente', texto: 'Mais ou menos. Me perguntam preço toda hora no direct.' },
      {
        autor: 'vendedor',
        texto:
          'Entendi! E hoje, quando alguém pesquisa o nome da sua barbearia no Google, encontra facilmente seus serviços, endereço e formas de agendamento?',
      },
      {
        autor: 'vendedor',
        texto:
          'Não precisa abandonar o Instagram. A proposta é conectar os canais e facilitar o caminho de quem já tem interesse em conhecer ou agendar com vocês. Se fizer sentido, posso te mostrar uma ideia de como isso funcionaria para a barbearia.',
      },
    ],
    angulos: {
      preco:
        'Discuta utilidade e escopo: uma página com serviços, preços e agendamento resolve. Compare com o valor de poucos cortes por mês e ofereça começar só com página + link de agenda.',
      necessidade:
        'Foque em facilidade de contato e agenda: perguntas repetidas no Direct, mensagens fora de hora e faltas.',
      confianca: 'Mostre um exemplo de barbearia no ar e como o barbeiro atualiza horários e preços pelo celular.',
      prazo: 'Datas de pico (fim de ano, véspera de feriado) são bons marcos para ter a agenda online funcionando.',
    },
    cuidados: ['Não use fotos de clientes sem autorização.', 'Evite dizer que a barbearia "está perdendo clientes" sem dados.'],
    aberturaProspeccao:
      'Hoje a maior parte dos agendamentos de vocês chega pelo WhatsApp, pelo Direct ou o cliente chega direto?',
  },
  {
    id: 'saloes-de-beleza',
    nome: 'Salões de beleza',
    categoria: 'beleza',
    resumo:
      'Vários profissionais e serviços com durações diferentes (corte, coloração, escova, química). A agenda é o coração do negócio e encaixes são comuns. Muitas profissionais trabalham por comissão e a recepção concentra o atendimento por WhatsApp.',
    comoClientesChegam: ['Indicação de clientes', 'Instagram com transformações', 'Google Maps', 'Clientes antigas que voltam por recorrência'],
    dores: [
      'Agenda complexa: serviços longos, encaixes e várias profissionais',
      'Recepção sobrecarregada respondendo orçamento de química e coloração',
      'Faltas em serviços longos, que bloqueiam horas da agenda',
      'Controle de comissões feito no caderno ou planilha',
    ],
    solucoes: [
      { servico: 'sis-agendamento', porque: 'Agenda por profissional com duração por serviço evita encaixes impossíveis.' },
      { servico: 'site-paginas-servicos', porque: 'Explicar coloração, mechas e tratamentos reduz perguntas e prepara a cliente para o orçamento.' },
      { servico: 'sis-clientes', porque: 'Histórico de fórmulas, química e preferências por cliente, acessível para toda a equipe.' },
    ],
    argumentos: [
      'Agenda que entende a duração de cada serviço evita o caos de encaixar uma progressiva às 17h50.',
      'Ficha da cliente com histórico de coloração dá segurança mesmo quando a profissional muda.',
      'Página explicando serviços químicos ajuda a cliente a chegar com expectativa realista.',
    ],
    perguntas: [
      'Quantas profissionais atendem e como fica a agenda de cada uma?',
      'Quanto tempo a recepção passa respondendo orçamento pelo WhatsApp?',
      'Onde vocês anotam a fórmula de coloração de cada cliente?',
    ],
    objecoes: [
      {
        id: 'preco-depende-avaliacao',
        frase: 'Não dá para colocar preço no site, cada cabelo é um caso.',
        porTras: 'Medo de a cliente se apegar a um valor que muda após avaliação.',
        resposta:
          'Faz total sentido. Dá para mostrar "a partir de" ou só explicar o serviço e convidar para avaliação. O objetivo é a cliente entender o que é cada procedimento antes de chamar. Vocês recebem muita pergunta de "quanto custa uma mecha" sem foto?',
        pergunta: 'Quantos pedidos de orçamento de química chegam por semana sem informação suficiente?',
        proximoPasso: 'Proponha páginas de serviço sem preço fechado, com formulário de avaliação com envio de foto.',
      },
      {
        id: 'profissionais-nao-vao-usar',
        frase: 'As meninas não vão usar sistema.',
        porTras: 'Equipe acostumada ao caderno; dona teme conflito.',
        resposta:
          'Entendo. A ideia é cada profissional só ver a própria agenda no celular, como se fosse o WhatsApp. Quem cuida da agenda hoje? Começamos por ela.',
        pergunta: 'Quem centraliza os agendamentos hoje?',
        proximoPasso: 'Demonstre a visão da profissional no celular e proponha piloto com a recepção.',
      },
      {
        id: 'ja-tem-muita-cliente',
        frase: 'Minha agenda já vive cheia.',
        porTras: 'Não vê necessidade de atrair clientes.',
        resposta:
          'Que ótimo! Então o foco não é atrair, é organizar: reduzir faltas, encaixes errados e tempo da recepção no WhatsApp. Faz sentido olhar por esse lado?',
        pergunta: 'Se uma cliente de progressiva falta, quantas horas ficam vazias?',
        proximoPasso: 'Reposicione a oferta para agenda e ficha de cliente, não para divulgação.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vi o trabalho de coloração de vocês, ficou lindo. Hoje a agenda das profissionais é controlada pela recepção pelo WhatsApp?' },
      { autor: 'cliente', texto: 'É sim, mas funciona. A recepção resolve.' },
      { autor: 'vendedor', texto: 'Que bom que funciona. Ela consegue acompanhar tudo nos dias mais cheios, tipo sexta e sábado, ou acaba ficando muita mensagem acumulada?' },
      { autor: 'cliente', texto: 'Sábado é um caos, às vezes marca duas no mesmo horário.' },
      {
        autor: 'vendedor',
        texto:
          'Isso é bem comum com serviços de durações diferentes. Uma agenda online que já sabe quanto tempo leva cada serviço evita esse conflito. Posso te mostrar como ficaria com as profissionais de vocês? Leva 15 minutos.',
      },
    ],
    angulos: {
      preco: 'Relacione o investimento às horas perdidas com faltas em serviços longos e ao tempo da recepção. Ofereça começar pela agenda.',
      necessidade: 'Organização da agenda complexa e histórico técnico das clientes, não divulgação.',
      confianca: 'Mostre como cada profissional vê só a própria agenda e como a dona controla tudo.',
      prazo: 'Implante antes de datas de pico (formaturas, casamentos, fim de ano) e treine a equipe num dia mais calmo.',
    },
    cuidados: ['Fotos de antes e depois somente com autorização da cliente.', 'Procedimentos químicos: evite prometer resultado garantido.'],
    aberturaProspeccao: 'Hoje quem organiza a agenda das profissionais aí no salão, a recepção ou cada uma marca a sua?',
  },
  {
    id: 'clinicas-de-estetica',
    nome: 'Clínicas de estética',
    categoria: 'beleza',
    resumo:
      'Vendem procedimentos de ticket médio/alto, muitas vezes em pacotes de sessões. A cliente pesquisa bastante antes, compara clínicas e precisa confiar na profissional e na segurança. Há avaliação inicial e o fechamento depende de explicar bem o procedimento.',
    comoClientesChegam: ['Instagram e anúncios', 'Busca pelo procedimento + bairro', 'Indicação', 'Promoções sazonais'],
    dores: [
      'Leads de anúncio que perguntam preço e somem',
      'Explicar o mesmo procedimento dezenas de vezes no WhatsApp',
      'Controle de pacotes de sessões e retornos',
      'Necessidade de transmitir segurança e responsabilidade técnica',
    ],
    solucoes: [
      { servico: 'lp-anuncios', porque: 'Página por procedimento alinhada ao anúncio, com FAQ e convite para avaliação.' },
      { servico: 'site-paginas-servicos', porque: 'Cada procedimento explicado com indicações, contraindicações e cuidados.' },
      { servico: 'sis-agendamento', porque: 'Agenda de sessões, controle de pacotes e lembretes de retorno.' },
    ],
    argumentos: [
      'Quem chega já sabendo como funciona o procedimento vai para a avaliação mais preparada.',
      'Página por procedimento permite medir quais anúncios geram avaliações, não só mensagens.',
      'Controle de pacotes evita sessões esquecidas e aumenta a confiança da cliente.',
    ],
    perguntas: [
      'Quais procedimentos vocês mais querem vender nos próximos meses?',
      'Dos contatos que chegam pelo anúncio, quantos agendam avaliação?',
      'Como vocês controlam as sessões restantes de cada pacote?',
    ],
    objecoes: [
      {
        id: 'cliente-so-quer-preco',
        frase: 'O cliente só quer saber o preço, site não muda isso.',
        porTras: 'Frustração com leads frios que comparam só valor.',
        resposta:
          'Isso é muito comum. O site não elimina a pergunta de preço, mas ajuda a cliente a entender o que está incluso, quem faz e por que vale a avaliação. Hoje vocês respondem preço direto ou convidam para avaliação?',
        pergunta: 'De cada 10 pessoas que perguntam preço, quantas vêm para a avaliação?',
        proximoPasso: 'Proponha landing de um procedimento com FAQ e agendamento de avaliação para testar.',
      },
      {
        id: 'regras-conselho',
        frase: 'Tenho medo de publicar algo que o conselho não permite.',
        porTras: 'Preocupação legítima com regras de publicidade em saúde/estética.',
        resposta:
          'Cuidado muito importante. O conteúdo é feito com você e validado pela responsável técnica antes de publicar: nada de promessa de resultado, e fotos só se as regras permitirem e com autorização. Quem é a responsável técnica aí?',
        pergunta: 'Vocês já têm alguma orientação do conselho sobre o que pode ser divulgado?',
        proximoPasso: 'Inclua no processo uma etapa de validação do conteúdo pela responsável técnica.',
      },
      {
        id: 'instagram-ja-converte',
        frase: 'Meu Instagram já converte bem.',
        porTras: 'O Instagram traz resultado e ela não quer dispersar esforço.',
        resposta:
          'Ótimo sinal! Então o site pode servir para o que o Instagram não faz bem: explicar cada procedimento em detalhe e aparecer para quem pesquisa no Google. Algum procedimento seu é muito pesquisado na sua cidade?',
        pergunta: 'Que procedimento você gostaria que fosse encontrado por quem pesquisa no Google?',
        proximoPasso: 'Proponha uma página para o procedimento mais rentável como primeira etapa.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Vi que vocês estão anunciando [procedimento]. Os contatos do anúncio têm agendado avaliação ou muitos só perguntam o preço?' },
      { autor: 'cliente', texto: 'Muita gente só pergunta preço e some.' },
      {
        autor: 'vendedor',
        texto:
          'Isso acontece bastante. Uma página do procedimento, com como funciona, para quem é indicado e quem faz, ajuda a pessoa a chegar mais decidida. Hoje o anúncio leva para o WhatsApp direto?',
      },
      { autor: 'cliente', texto: 'Sim, direto pro WhatsApp.' },
      { autor: 'vendedor', texto: 'Dá para testar com um procedimento só e comparar com o que acontece hoje. Quer que eu te mostre como ficaria?' },
    ],
    angulos: {
      preco: 'Compare com o custo do anúncio desperdiçado em leads frios. Comece por uma landing de um procedimento.',
      necessidade: 'Explicar procedimentos, qualificar leads e controlar pacotes de sessões.',
      confianca: 'Transmitir segurança: responsável técnica, estrutura, cuidados — sem promessas de resultado.',
      prazo: 'Antes de campanhas sazonais (verão, Dia das Mães) é o momento de ter páginas prontas.',
    },
    cuidados: [
      'Publicidade de procedimentos segue regras dos conselhos profissionais (medicina, biomedicina, odontologia, fisioterapia etc.). Valide com a responsável técnica, especialmente fotos de antes e depois.',
      'Não prometa resultados nem use termos como "sem riscos".',
    ],
    aberturaProspeccao: 'Hoje os contatos que chegam pelos anúncios de vocês costumam agendar avaliação ou ficam mais na pergunta de preço?',
  },
  {
    id: 'nail-designers',
    nome: 'Nail designers',
    categoria: 'beleza',
    resumo:
      'Profissional autônoma ou pequeno estúdio, atendimento de 1h a 3h por cliente (alongamento, blindagem, nail art), manutenção a cada 2–4 semanas. Portfólio visual decide a escolha. Agenda costuma ser gerida pela própria profissional entre um atendimento e outro.',
    comoClientesChegam: ['Instagram/TikTok com fotos e vídeos', 'Indicação', 'Clientes de manutenção recorrente'],
    dores: [
      'Responder mensagens com as mãos ocupadas (e com produto)',
      'Clientes que não comparecem em horários longos',
      'Explicar diferenças entre técnicas e manutenção',
      'Divulgar cursos (quando também é educadora)',
    ],
    solucoes: [
      { servico: 'lp-autonomo', porque: 'Página com portfólio, técnicas, valores e link de agenda — o "link da bio" profissional.' },
      { servico: 'sis-agendamento', porque: 'Agenda online com sinal/pré-pagamento opcional para reduzir faltas em horários longos.' },
      { servico: 'lp-lancamento', porque: 'Para quem dá curso: página de inscrição de turmas.' },
    ],
    argumentos: [
      'Agenda online evita parar o atendimento para responder "tem horário sábado?".',
      'Uma página com as técnicas explicadas reduz a dúvida "qual a diferença entre gel e fibra?".',
      'Política de sinal clara e automatizada protege horários longos.',
    ],
    perguntas: [
      'Quanto dura um atendimento de alongamento e quantas faltas você tem por mês?',
      'Você responde as mensagens durante os atendimentos?',
      'Você dá cursos ou pretende dar?',
    ],
    objecoes: [
      {
        id: 'sou-so-eu',
        frase: 'Sou só eu, não preciso de site.',
        porTras: 'Acha que site é para empresa com equipe.',
        resposta:
          'Justamente por ser só você, cada minuto parada respondendo mensagem pesa. Uma página simples com seus trabalhos e um link de agenda trabalha por você. Quantas mensagens você responde por dia entre uma cliente e outra?',
        pergunta: 'Quantas vezes por dia você para um atendimento para responder mensagem?',
        proximoPasso: 'Ofereça página única + agenda com investimento enxuto.',
      },
      {
        id: 'cobrar-sinal-assusta',
        frase: 'Cobrar sinal vai assustar minhas clientes.',
        porTras: 'Medo de perder clientes por exigência.',
        resposta:
          'Dá para cobrar só de clientes novas ou só em horários longos. Muitas profissionais adotam e as clientes fiéis entendem. Quantas faltas você teve no último mês?',
        pergunta: 'Quanto você deixa de faturar com as faltas em um mês?',
        proximoPasso: 'Configure a regra de sinal como opcional e teste por um mês.',
      },
      {
        id: 'linktree-resolve',
        frase: 'O Linktree já resolve.',
        porTras: 'Ferramenta gratuita que atende o básico.',
        resposta:
          'Resolve para juntar links, sim. A página própria mostra seu portfólio organizado, técnicas e valores, com seu nome no endereço. Suas clientes costumam pedir fotos de trabalhos antes de marcar?',
        pergunta: 'Você costuma mandar fotos de trabalhos pelo WhatsApp quando uma cliente nova pergunta?',
        proximoPasso: 'Mostre um exemplo de página de nail designer com portfólio e agenda.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Que trabalho caprichado nas suas fotos. Você costuma conseguir responder as mensagens durante os atendimentos?' },
      { autor: 'cliente', texto: 'Quase nunca, respondo à noite.' },
      { autor: 'vendedor', texto: 'Imagino. E quem quer marcar acaba esperando até a noite... Já perdeu cliente por demorar a responder?' },
      { autor: 'cliente', texto: 'Já, várias marcam com outra.' },
      { autor: 'vendedor', texto: 'Uma agenda online resolveria isso: a cliente vê seus horários e marca sozinha. Quer que eu te mostre um exemplo simples?' },
    ],
    angulos: {
      preco: 'Compare com o valor de 2 ou 3 atendimentos e com o faturamento perdido em faltas.',
      necessidade: 'Tempo de resposta e faltas em horários longos, não "presença online".',
      confianca: 'Mostre como ela mesma bloqueia horários e muda valores pelo celular.',
      prazo: 'Antes de datas de alta (formaturas, fim de ano, Carnaval).',
    },
    cuidados: ['Não divulgue fotos de clientes sem autorização.'],
    aberturaProspeccao: 'Você consegue responder as mensagens de agendamento durante os atendimentos ou acaba deixando para depois?',
  },
  {
    id: 'bronzeamento',
    nome: 'Profissionais de bronzeamento',
    categoria: 'beleza',
    resumo:
      'Bronzeamento natural (com fita, ao sol, em laje ou espaço aberto) ou a jato/spray. Negócio fortemente sazonal (primavera e verão) e dependente do clima: chuva remarca a agenda inteira. Público jovem, decisão rápida, muito influenciado por vídeos e resultados.',
    comoClientesChegam: ['Instagram/TikTok com vídeos de resultado', 'Indicação entre amigas', 'Promoções de temporada'],
    dores: [
      'Remarcar dezenas de horários quando chove',
      'Perguntas repetidas sobre cuidados pré e pós-bronze',
      'Picos de procura concentrados em poucos meses',
      'Venda de pacotes e produtos (hidratantes, acelerador)',
    ],
    solucoes: [
      { servico: 'sis-agendamento', porque: 'Agenda com remarcação fácil e aviso em massa para os dias de chuva.' },
      { servico: 'lp-servicos', porque: 'Página com tipos de bronze, cuidados e FAQ reduz as dúvidas repetidas.' },
      { servico: 'catalogo-whatsapp', porque: 'Venda de produtos de cuidado com pedido pelo WhatsApp.' },
    ],
    argumentos: [
      'Quando chove, remarcar pela agenda é muito mais rápido que conversar uma por uma.',
      'FAQ de cuidados poupa horas de mensagens e melhora o resultado da cliente.',
      'Na temporada, cada minuto conta: o agendamento sozinho libera a profissional.',
    ],
    perguntas: [
      'Num dia de chuva, quantas clientes você precisa remarcar?',
      'Quais dúvidas as clientes mais perguntam antes de vir?',
      'Você vende produtos ou pacotes?',
    ],
    objecoes: [
      {
        id: 'so-temporada',
        frase: 'Só trabalho alguns meses, não compensa.',
        porTras: 'Investimento parece alto para uso sazonal.',
        resposta:
          'Faz sentido pensar assim. Justamente por concentrar tudo em poucos meses, a agenda precisa estar organizada no pico. E dá para pausar o plano fora de temporada, dependendo da solução. Quantas clientes você atende por semana no verão?',
        pergunta: 'No pico da temporada, quantas mensagens por dia você recebe?',
        proximoPasso: 'Proponha solução com custo reduzido ou pausável fora de temporada.',
      },
      {
        id: 'cliente-quer-video',
        frase: 'Minhas clientes querem ver vídeo, não site.',
        porTras: 'O conteúdo em vídeo é o que vende.',
        resposta:
          'Verdade, o vídeo vende muito. O site não substitui: ele é para onde a cliente vai depois de ver o vídeo, para saber valores, cuidados e marcar. Hoje, depois do vídeo, ela chama você no direct?',
        pergunta: 'Depois que a cliente vê o vídeo, o que ela precisa fazer para marcar?',
        proximoPasso: 'Mostre a página com vídeos incorporados e agendamento.',
      },
      {
        id: 'agenda-no-caderno',
        frase: 'Anoto tudo no caderno e dá certo.',
        porTras: 'Hábito e baixo volume fora da temporada.',
        resposta:
          'Funciona bem até o dia de chuva, né? Aí é caderno, ligação e mensagem uma por uma. Como você faz hoje para remarcar todo mundo?',
        pergunta: 'Quanto tempo você gastou remarcando clientes na última chuva?',
        proximoPasso: 'Demonstre a remarcação em massa.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vi seus vídeos de resultado, ficou muito natural. Pergunta curiosa: quando chove, como você faz para remarcar as clientes?' },
      { autor: 'cliente', texto: 'Mando mensagem pra uma por uma, é horrível.' },
      { autor: 'vendedor', texto: 'Imagino na temporada! Tem como deixar isso mais rápido com uma agenda online que avisa todo mundo e deixa a cliente escolher outro horário. Quer ver como funciona?' },
    ],
    angulos: {
      preco: 'Compare com o faturamento de poucos dias de temporada e ofereça plano pausável.',
      necessidade: 'Remarcações por clima e dúvidas de cuidados repetidas.',
      confianca: 'Demonstre remarcação em massa e a facilidade de uso pelo celular.',
      prazo: 'Ter tudo pronto antes da primavera — depois que a temporada começa, não há tempo para implantar.',
    },
    cuidados: [
      'Câmaras de bronzeamento artificial com radiação UV são proibidas pela ANVISA (RDC 56/2009). Não divulgue esse tipo de serviço.',
      'Inclua orientações de cuidados com o sol sem fazer promessas de saúde.',
    ],
    aberturaProspeccao: 'Quando chove em plena temporada, como você faz hoje para remarcar as clientes?',
  },
  {
    id: 'cabeleireiros',
    nome: 'Cabeleireiros',
    categoria: 'beleza',
    resumo:
      'Profissional autônomo ou que atende em espaço alugado/cadeira em salão. Forte relação pessoal com a clientela, especialização (cachos, loiros, cortes masculinos/femininos) e agenda própria. A reputação pessoal vale mais que a marca do salão.',
    comoClientesChegam: ['Clientes fiéis que seguem o profissional', 'Instagram com transformações', 'Indicação'],
    dores: [
      'Clientela presa ao salão onde trabalha, não ao profissional',
      'Agenda gerida pelo próprio celular',
      'Dificuldade de comunicar a especialidade (ex.: cachos, loiro)',
    ],
    solucoes: [
      { servico: 'lp-autonomo', porque: 'Página com o nome do profissional, especialidade, portfólio e agenda — a marca pessoal.' },
      { servico: 'sis-agendamento', porque: 'Agenda própria que acompanha o profissional, mesmo se mudar de salão.' },
      { servico: 'sis-clientes', porque: 'Histórico de cada cliente (química, preferências) que é do profissional.' },
    ],
    argumentos: [
      'Uma página com o seu nome leva a clientela com você, independentemente do salão.',
      'Especialidade bem comunicada atrai o cliente certo (e evita o que você não quer atender).',
      'Ficha de clientes é patrimônio do seu trabalho.',
    ],
    perguntas: [
      'Você atende em salão próprio ou em espaço de outra pessoa?',
      'Qual é a sua especialidade e o tipo de cliente que você mais quer atrair?',
      'Se você mudasse de salão, suas clientes saberiam onde te encontrar?',
    ],
    objecoes: [
      {
        id: 'salao-ja-divulga',
        frase: 'O salão onde trabalho já tem Instagram.',
        porTras: 'Não percebe o valor da marca pessoal.',
        resposta:
          'E ajuda, claro. Só que a página é do salão. Uma página sua, com seu nome, garante que as clientes te encontrem onde você estiver. Já pensou em ter seu próprio espaço um dia?',
        pergunta: 'Quantas clientes são suas, e não do salão?',
        proximoPasso: 'Ofereça página pessoal simples com portfólio e agenda.',
      },
      {
        id: 'cliente-me-chama-direto',
        frase: 'Minhas clientes me chamam direto.',
        porTras: 'Relação próxima com a clientela.',
        resposta:
          'Isso é ótimo, mostra fidelidade. A página é mais para quem ainda não te conhece, como a indicação de uma cliente que quer ver seu trabalho antes. Você recebe muita indicação?',
        pergunta: 'Quando uma cliente te indica, o que ela manda para a amiga ver?',
        proximoPasso: 'Mostre como a página facilita indicações.',
      },
      {
        id: 'nao-tenho-fotos',
        frase: 'Não tenho fotos boas para colocar.',
        porTras: 'Insegurança com o portfólio.',
        resposta:
          'Dá para começar com poucas fotos boas e ir completando. Posso te passar dicas simples de como fotografar com o celular no salão. Você costuma postar seus trabalhos?',
        pergunta: 'Quais trabalhos você mais tem orgulho de mostrar?',
        proximoPasso: 'Inclua no escopo um guia de fotos ou seleção do material existente.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vi seus trabalhos com cachos, muito bonitos. Você atende em salão próprio ou em espaço de outro salão?' },
      { autor: 'cliente', texto: 'Alugo uma cadeira num salão.' },
      { autor: 'vendedor', texto: 'Entendi. E hoje, quando alguém quer agendar com você, procura o salão ou você direto?' },
      { autor: 'cliente', texto: 'Às vezes o salão, às vezes eu.' },
      { autor: 'vendedor', texto: 'Uma página com o seu nome e a sua agenda ajuda as clientes a chegarem direto em você, onde você estiver. Quer ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com o valor de poucos atendimentos e destaque que é um ativo pessoal, que acompanha a carreira.',
      necessidade: 'Marca pessoal e especialização, independência do salão.',
      confianca: 'Mostre como ele mesmo atualiza portfólio e agenda.',
      prazo: 'Momentos de mudança (abrir espaço próprio, mudar de salão) são ideais.',
    },
    cuidados: ['Use apenas fotos com autorização das clientes.'],
    aberturaProspeccao: 'Quando alguém quer marcar com você, a pessoa procura o salão ou fala direto com você?',
  },
  {
    id: 'maquiadores',
    nome: 'Maquiadores',
    categoria: 'beleza',
    resumo:
      'Trabalham com eventos (noivas, formaturas, festas), muitas vezes com deslocamento até a cliente. Ticket varia muito com pacotes (noiva + madrinhas, teste de maquiagem). Fechamento antecipado, com sinal, e agenda disputada em datas de alta.',
    comoClientesChegam: ['Instagram com portfólio', 'Indicação de cerimonialistas, fotógrafos e salões', 'Feiras de noivas'],
    dores: [
      'Orçamentos longos por WhatsApp (local, número de pessoas, horário)',
      'Datas concorridas e reservas sem sinal',
      'Portfólio espalhado em posts antigos',
    ],
    solucoes: [
      { servico: 'lp-autonomo', porque: 'Portfólio organizado por tipo de evento e pacotes.' },
      { servico: 'site-formulario-orcamento', porque: 'Formulário com data, local, número de pessoas e horário do evento — orçamento chega completo.' },
      { servico: 'sis-agendamento', porque: 'Calendário de datas reservadas com controle de sinal.' },
    ],
    argumentos: [
      'Formulário de orçamento com data e local já mostra se você está disponível antes de começar a conversa.',
      'Portfólio por tipo de evento ajuda a noiva a se imaginar no resultado.',
      'Parceiros (cerimonialistas, fotógrafos) indicam com mais facilidade quando há um link profissional.',
    ],
    perguntas: [
      'Quantos orçamentos de noivas você faz por mês e quantos fecham?',
      'Quais informações você sempre precisa perguntar antes de passar valor?',
      'Você trabalha com parceiros que te indicam?',
    ],
    objecoes: [
      {
        id: 'noiva-quer-conversar',
        frase: 'Noiva quer conversar, não preencher formulário.',
        porTras: 'O atendimento pessoal é parte do serviço.',
        resposta:
          'Concordo, a conversa é essencial. O formulário só adianta data, local e número de pessoas para você já chegar na conversa sabendo se tem a data livre. Quantas vezes você conversou tudo e a data já estava ocupada?',
        pergunta: 'Quanto tempo você gasta em orçamentos que não fecham?',
        proximoPasso: 'Proponha formulário curto + conversa por WhatsApp na sequência.',
      },
      {
        id: 'portfolio-no-instagram',
        frase: 'Meu portfólio está todo no Instagram.',
        porTras: 'Acha que o Instagram é suficiente.',
        resposta:
          'E deve continuar lá. No site o portfólio fica organizado por noiva, formatura, festa — sem a cliente precisar rolar meses de posts. Você recebe muito pedido de "me manda fotos de noivas"?',
        pergunta: 'O que a noiva pede para ver antes de fechar?',
        proximoPasso: 'Mostre um portfólio organizado por tipo de evento.',
      },
      {
        id: 'baixa-temporada',
        frase: 'Agora é baixa temporada, depois eu vejo.',
        porTras: 'Caixa menor fora da época de casamentos.',
        resposta:
          'Faz sentido. Na verdade, a baixa temporada é o melhor momento para preparar, porque na alta você não terá tempo. Que tal deixarmos pronto antes da temporada de casamentos?',
        pergunta: 'Quando começam as reservas para a próxima temporada?',
        proximoPasso: 'Proponha cronograma com entrega antes da temporada e pagamento parcelado.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vi suas maquiagens de noiva, muito delicadas. Quando uma noiva te pede orçamento, que informações você sempre precisa perguntar?' },
      { autor: 'cliente', texto: 'Data, local, quantas pessoas, horário... é um interrogatório.' },
      { autor: 'vendedor', texto: 'E às vezes, depois disso tudo, a data já está ocupada, né? Um formulário curto resolve a primeira parte e você conversa já sabendo se pode atender. Quer ver como fica?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um pacote de noiva e com o tempo gasto em orçamentos que não fecham.',
      necessidade: 'Qualificar pedidos de orçamento e organizar portfólio por evento.',
      confianca: 'Mostre como ela atualiza o portfólio e bloqueia datas.',
      prazo: 'Pronto antes da temporada de casamentos e formaturas.',
    },
    cuidados: ['Autorização de imagem das clientes para portfólio.'],
    aberturaProspeccao: 'Quando uma noiva te pede orçamento, quantas mensagens costuma levar até você conseguir passar o valor?',
  },
  {
    id: 'spas',
    nome: 'Spas',
    categoria: 'beleza',
    resumo:
      'Experiência premium: massagens, day spa, pacotes para casais, vale-presente. Ticket alto e compra muitas vezes por presente ou ocasião especial. A experiência visual e a reserva sem atrito são decisivas.',
    comoClientesChegam: ['Busca por "day spa" + cidade', 'Presentes (aniversário, Dia das Mães, Dia dos Namorados)', 'Hotéis e parcerias', 'Instagram'],
    dores: [
      'Vender vale-presente sem processo (Pix, PDF montado à mão)',
      'Reservas de pacotes com várias salas e profissionais',
      'Transmitir a experiência premium antes da visita',
    ],
    solucoes: [
      { servico: 'loja-checkout', porque: 'Venda de vale-presente online com pagamento e envio automático do voucher.' },
      { servico: 'site-profissional', porque: 'Apresentação visual da experiência, pacotes e ambientes.' },
      { servico: 'sis-agendamento', porque: 'Reserva de pacotes com salas e profissionais.' },
    ],
    argumentos: [
      'Vale-presente vendido online funciona até de madrugada, na véspera da data comemorativa.',
      'A experiência premium começa no site: fotos do ambiente e pacotes claros.',
      'Reserva organizada evita conflito de salas em pacotes para casais.',
    ],
    perguntas: [
      'Quanto do faturamento vem de vale-presente?',
      'Como vocês vendem e entregam o vale hoje?',
      'Quais datas concentram mais procura?',
    ],
    objecoes: [
      {
        id: 'vale-pelo-whatsapp',
        frase: 'Vendo vale-presente pelo WhatsApp e funciona.',
        porTras: 'Processo manual funcionando em volume baixo.',
        resposta:
          'Funciona, e em datas de pico deve dar trabalho, né? Com a venda online, quem compra recebe o voucher na hora e você só confere no dia. No último Dia das Mães, quantos vales vocês venderam?',
        pergunta: 'Quanto tempo leva para montar e enviar cada vale manualmente?',
        proximoPasso: 'Proponha a loja de vale-presente antes da próxima data comemorativa.',
      },
      {
        id: 'publico-premium',
        frase: 'Meu público é exigente, não pode ter site simples.',
        porTras: 'Medo de prejudicar a imagem premium.',
        resposta:
          'Concordo totalmente: o site precisa ter o mesmo padrão da experiência. Por isso o foco é em fotos de qualidade, textos cuidadosos e reserva sem fricção. Vocês têm fotos profissionais do espaço?',
        pergunta: 'O que o cliente sente quando entra no spa e como transmitir isso antes?',
        proximoPasso: 'Inclua sessão de fotos ou curadoria do material no escopo.',
      },
      {
        id: 'hotel-ja-vende',
        frase: 'O hotel parceiro já vende os pacotes.',
        porTras: 'Dependência de canal parceiro.',
        resposta:
          'Ótimo canal! O site próprio é para quem não está hospedado — moradores da cidade e quem quer presentear. Quanto do movimento vem de fora do hotel?',
        pergunta: 'Quanto do faturamento vem de clientes que não são hóspedes?',
        proximoPasso: 'Proponha site focado em vale-presente e day spa para o público local.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Vocês vendem bastante vale-presente em datas como Dia das Mães?' },
      { autor: 'cliente', texto: 'Muito, mas é tudo no WhatsApp e no Pix, uma loucura.' },
      { autor: 'vendedor', texto: 'Imagino! Com uma página de vale-presente, a pessoa escolhe o pacote, paga e recebe o voucher na hora, até de madrugada. Quer que eu te mostre antes da próxima data?' },
    ],
    angulos: {
      preco: 'Relacione ao volume de vales em datas comemorativas e ao tempo manual de cada venda.',
      necessidade: 'Venda de vale-presente e reserva de pacotes, com imagem premium.',
      confianca: 'Mostre o fluxo de compra e validação do voucher no balcão.',
      prazo: 'Pronto antes de Dia das Mães, Dia dos Namorados e Natal.',
    },
    cuidados: ['Massagens terapêuticas: evite alegações de tratamento de saúde.'],
    aberturaProspeccao: 'Como vocês vendem e entregam o vale-presente hoje, especialmente em datas como Dia das Mães?',
  },
  {
    id: 'clinicas-de-depilacao',
    nome: 'Clínicas de depilação',
    categoria: 'beleza',
    resumo:
      'Depilação com cera ou a laser, vendida em sessões e pacotes por área do corpo. Recorrência alta e muitas promoções. No laser, há avaliação, número de sessões e intervalo entre elas — o controle de pacotes é crítico.',
    comoClientesChegam: ['Anúncios com promoções', 'Busca por "depilação a laser" + bairro', 'Indicação', 'Clientes de recorrência'],
    dores: [
      'Controle de sessões por área e intervalo entre sessões',
      'Dúvidas repetidas (dói? quantas sessões? pode tomar sol?)',
      'Leads de promoção que não comparecem',
    ],
    solucoes: [
      { servico: 'sis-agendamento', porque: 'Agenda com controle de pacotes, sessões restantes e intervalo mínimo.' },
      { servico: 'lp-anuncios', porque: 'Página da promoção com FAQ e agendamento de avaliação.' },
      { servico: 'sis-clientes', porque: 'Ficha com áreas tratadas, parâmetros e observações da profissional.' },
    ],
    argumentos: [
      'Controle de sessões evita a cliente se perder no pacote — e você perder a recompra.',
      'FAQ (dor, número de sessões, cuidados) responde antes do contato.',
      'Lembrete de intervalo entre sessões traz a cliente de volta na hora certa.',
    ],
    perguntas: [
      'Como vocês controlam as sessões restantes de cada cliente?',
      'Quais perguntas mais chegam antes do agendamento?',
      'Das clientes da promoção, quantas comparecem?',
    ],
    objecoes: [
      {
        id: 'ja-tenho-sistema-franquia',
        frase: 'A franquia já tem sistema.',
        porTras: 'Unidade franqueada com ferramentas obrigatórias.',
        resposta:
          'Entendi, então a agenda está resolvida pela rede. Vale ver se a unidade pode ter páginas locais ou campanhas próprias, dentro das regras da franquia. A rede permite ações locais?',
        pergunta: 'O que a franquia permite fazer de marketing local?',
        proximoPasso: 'Se permitido, ofereça landing de campanha local; se não, encerre com cordialidade.',
      },
      {
        id: 'promocao-ja-lota',
        frase: 'Minhas promoções já lotam a agenda.',
        porTras: 'Volume não é o problema.',
        resposta:
          'Ótimo! Então o foco é reter: controlar sessões e trazer a cliente de volta no intervalo certo. Quantas clientes da promoção fecham o pacote completo?',
        pergunta: 'Quantas clientes da promoção viram clientes de pacote?',
        proximoPasso: 'Proponha sistema de pacotes e lembretes de retorno.',
      },
      {
        id: 'cliente-tem-medo-laser',
        frase: 'Cliente tem medo do laser, site não resolve.',
        porTras: 'A barreira é emocional, não informativa.',
        resposta:
          'O medo é real e quem tira é a profissional na avaliação. O site ajuda explicando de forma honesta como funciona e convidando para a avaliação sem compromisso. Quais são os medos mais comuns?',
        pergunta: 'O que a cliente mais pergunta na avaliação?',
        proximoPasso: 'Crie uma página com as dúvidas reais coletadas na avaliação.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vocês trabalham com pacotes de laser por área? Como fazem para controlar as sessões de cada cliente?' },
      { autor: 'cliente', texto: 'Numa planilha, mas às vezes dá confusão.' },
      { autor: 'vendedor', texto: 'É comum, principalmente com várias áreas e intervalos diferentes. Um sistema simples mostra as sessões restantes e avisa quando a cliente pode voltar. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de pacotes que a cliente abandona por falta de acompanhamento.',
      necessidade: 'Controle de pacotes, intervalo entre sessões e FAQ.',
      confianca: 'Mostre como a recepção vê as sessões restantes em segundos.',
      prazo: 'Implantar antes do inverno, época em que mais se inicia laser (menos exposição ao sol).',
    },
    cuidados: [
      'Procedimentos a laser seguem regras sanitárias e de conselhos profissionais; não prometa resultado definitivo nem "sem dor".',
    ],
    aberturaProspeccao: 'Como vocês controlam hoje as sessões e os intervalos de cada cliente nos pacotes de laser?',
  },
  {
    id: 'lojas-de-cosmeticos',
    nome: 'Lojas de cosméticos',
    categoria: 'beleza',
    resumo:
      'Varejo com muitos produtos, marcas e variações (cor, tamanho). Compra por impulso e reposição. Concorrência forte com marketplaces e grandes redes; o diferencial é atendimento, curadoria e entrega rápida local.',
    comoClientesChegam: ['Loja física', 'Instagram com lançamentos', 'WhatsApp de clientes fiéis', 'Marketplaces'],
    dores: [
      'Mandar fotos e preços um por um no WhatsApp',
      'Estoque desatualizado entre loja e redes',
      'Concorrência de preço com grandes plataformas',
    ],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Catálogo com preços e pedido pronto para o WhatsApp, entrega local.' },
      { servico: 'ecommerce', porque: 'Loja completa para vender para outras cidades.' },
      { servico: 'loja-gestao-produtos', porque: 'Painel de estoque e variações para quem tem muitos SKUs.' },
    ],
    argumentos: [
      'Catálogo online responde "tem tal batom?" sem você parar o atendimento do balcão.',
      'Entrega local rápida é um diferencial que o marketplace grande não tem na sua cidade.',
      'Pedido chega organizado no WhatsApp, com cor e quantidade certas.',
    ],
    perguntas: [
      'Quantos pedidos por WhatsApp vocês recebem por semana?',
      'Quantos produtos vocês têm ativos?',
      'Vocês fazem entrega na cidade?',
    ],
    objecoes: [
      {
        id: 'marketplace-mais-barato',
        frase: 'Não consigo competir com o preço do marketplace.',
        porTras: 'Sente-se em desvantagem de preço.',
        resposta:
          'Em preço, muitas vezes não dá mesmo. O catálogo próprio é para a cliente que já é sua e valoriza entrega rápida e atendimento. Quanto das suas vendas é de clientes que voltam?',
        pergunta: 'Que vantagem a sua loja oferece que o marketplace não oferece?',
        proximoPasso: 'Proponha catálogo focado em clientes recorrentes e entrega local.',
      },
      {
        id: 'muitos-produtos',
        frase: 'Tenho produtos demais para cadastrar.',
        porTras: 'Medo do trabalho operacional.',
        resposta:
          'É um trabalho real, e é bom saber antes. Dá para começar pelos mais vendidos e importar o resto por planilha. Vocês têm uma lista de produtos no sistema do caixa?',
        pergunta: 'O sistema do caixa permite exportar a lista de produtos?',
        proximoPasso: 'Verifique a exportação do sistema de caixa e proponha importação inicial.',
      },
      {
        id: 'regularizacao-produtos',
        frase: 'E os produtos de revenda, posso vender online?',
        porTras: 'Dúvida sobre regras de venda online.',
        resposta:
          'Boa pergunta. Produtos regularizados podem ser vendidos online normalmente; vale conferir com o fornecedor e manter as informações do rótulo. Eu cuido da parte técnica e você confirma o que pode ser anunciado.',
        pergunta: 'Algum produto é manipulado ou de fabricação própria?',
        proximoPasso: 'Liste os produtos com atenção especial antes de cadastrar.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vocês recebem muito pedido de cliente perguntando se tem tal produto pelo WhatsApp?' },
      { autor: 'cliente', texto: 'O dia inteiro, mando foto de tudo.' },
      { autor: 'vendedor', texto: 'Um catálogo online resolveria: a cliente vê o que tem, escolhe e manda o pedido pronto. Você só confirma e entrega. Quer ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com o tempo da equipe mandando fotos e com comissões de marketplace.',
      necessidade: 'Catálogo e estoque organizados, entrega local como diferencial.',
      confianca: 'Mostre o painel de produtos e a facilidade de marcar "esgotado".',
      prazo: 'Antes de datas comerciais (Dia das Mães, Black Friday, Natal).',
    },
    cuidados: [
      'Cosméticos vendidos devem estar regularizados; mantenha informações do rótulo e evite alegações terapêuticas.',
    ],
    aberturaProspeccao: 'Quantas vezes por dia vocês mandam foto de produto e preço pelo WhatsApp?',
  },
];
