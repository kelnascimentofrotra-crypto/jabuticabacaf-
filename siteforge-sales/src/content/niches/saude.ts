import type { Niche } from '../../types';

const CUIDADO_SAUDE =
  'Publicidade em saúde segue regras do conselho profissional. Inclua nome e número de registro do responsável técnico, evite promessas de resultado e valide todo o conteúdo com o profissional antes de publicar.';
const CUIDADO_LGPD =
  'Dados de saúde são dados pessoais sensíveis pela LGPD: colete o mínimo necessário em formulários e nunca exponha informações de pacientes.';

export const SAUDE: Niche[] = [
  {
    id: 'clinicas-odontologicas',
    nome: 'Clínicas odontológicas',
    categoria: 'saude',
    resumo:
      'Mistura de procedimentos de rotina (limpeza, restauração) e tratamentos de ticket alto (implantes, ortodontia, lentes). O paciente pesquisa, compara e precisa confiar antes de iniciar tratamentos longos. Convênios e particulares convivem; a recepção agenda e confirma consultas.',
    comoClientesChegam: ['Indicação', 'Busca por "dentista" + bairro', 'Convênios', 'Instagram e anúncios para tratamentos específicos'],
    dores: [
      'Faltas em consultas agendadas',
      'Paciente que pede preço de implante pelo WhatsApp sem avaliação',
      'Transmitir confiança para tratamentos caros',
      'Recall de pacientes para limpeza e manutenção',
    ],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Uma página por tratamento (implante, ortodontia, clareamento) com explicação e convite para avaliação.' },
      { servico: 'sis-agendamento', porque: 'Agendamento online e confirmação de consultas para reduzir faltas.' },
      { servico: 'sis-clientes', porque: 'Lembretes de retorno e recall de manutenção.' },
    ],
    argumentos: [
      'Quem pesquisa "implante dentário" + bairro precisa encontrar uma explicação clara e um caminho para a avaliação.',
      'Confirmação de consulta e lembretes de retorno trabalham pela agenda sem sobrecarregar a recepção.',
      'Mostrar a equipe, a estrutura e os registros profissionais gera confiança antes da primeira visita.',
    ],
    perguntas: [
      'Quais tratamentos vocês mais querem atrair: implante, ortodontia, estética?',
      'Quantas faltas acontecem por semana?',
      'Como vocês chamam os pacientes de volta para manutenção?',
    ],
    objecoes: [
      {
        id: 'cfo-nao-permite',
        frase: 'O CFO não deixa fazer propaganda.',
        porTras: 'Receio de infringir regras éticas.',
        resposta:
          'Existem regras importantes, como não divulgar preços e promoções e não prometer resultado. Mas informar tratamentos, equipe, estrutura e contato é permitido. Todo o conteúdo passa pela sua validação antes de publicar. Quer que eu te mostre um exemplo dentro dessas regras?',
        pergunta: 'Que informações você gostaria que o paciente soubesse antes de vir?',
        proximoPasso: 'Proponha estrutura de conteúdo informativo e validação pelo responsável técnico.',
      },
      {
        id: 'convenio-traz-paciente',
        frase: 'O convênio já me manda pacientes.',
        porTras: 'Fluxo garantido pelo convênio.',
        resposta:
          'Ótimo canal de volume. O site ajuda a atrair os tratamentos particulares, que normalmente têm outra margem — como implantes e estética. Vocês gostariam de aumentar a parte particular?',
        pergunta: 'Qual a proporção hoje entre convênio e particular?',
        proximoPasso: 'Foque a proposta em páginas de tratamentos particulares.',
      },
      {
        id: 'paciente-quer-preco',
        frase: 'Paciente só quer saber o preço do implante.',
        porTras: 'Leads frios comparando valores.',
        resposta:
          'Entendo. Como o valor depende da avaliação, o site pode explicar o que influencia o tratamento e convidar para a avaliação. Assim o paciente entende por que não existe um preço único. Como vocês respondem hoje essa pergunta?',
        pergunta: 'Dos que perguntam preço, quantos marcam avaliação?',
        proximoPasso: 'Crie página de implante com FAQ e agendamento de avaliação.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá, tudo bem? Hoje os pacientes de vocês costumam agendar mais por telefone, WhatsApp ou chegam por indicação?' },
      { autor: 'cliente', texto: 'Mais WhatsApp e indicação. Mas tem muita falta.' },
      { autor: 'vendedor', texto: 'Faltas são comuns mesmo. Vocês confirmam as consultas um dia antes?' },
      { autor: 'cliente', texto: 'Quando a recepção consegue.' },
      { autor: 'vendedor', texto: 'Dá para automatizar essa confirmação e liberar a recepção. Posso te mostrar como funcionaria em 15 minutos?' },
    ],
    angulos: {
      preco: 'Compare com o valor de uma única consulta perdida por semana ou de um tratamento particular fechado.',
      necessidade: 'Faltas, recall e explicação de tratamentos particulares.',
      confianca: 'Mostrar equipe, registros profissionais e estrutura, dentro das regras do CFO.',
      prazo: 'Antes do início do ano e de campanhas de tratamentos sazonais.',
    },
    cuidados: [
      'O Código de Ética Odontológica e resoluções do CFO restringem publicidade (preços, promoções, promessas de resultado). Valide todo o conteúdo com o cirurgião-dentista responsável e inclua o número de inscrição no CRO.',
      CUIDADO_LGPD,
    ],
    aberturaProspeccao: 'Hoje vocês conseguem confirmar todas as consultas do dia seguinte ou a recepção fica sobrecarregada?',
  },
  {
    id: 'clinicas-medicas',
    nome: 'Clínicas médicas',
    categoria: 'saude',
    resumo:
      'Várias especialidades ou uma especialidade com vários médicos, convênios e particulares. O paciente precisa saber se a clínica atende o convênio, quais médicos e como agendar. Credibilidade e privacidade são centrais; a decisão costuma passar por indicação e busca.',
    comoClientesChegam: ['Busca por especialidade + cidade', 'Lista do convênio', 'Indicação de outros médicos', 'Indicação de pacientes'],
    dores: [
      'Telefone e WhatsApp sobrecarregados com dúvidas de convênio e horário',
      'Agendas de vários médicos em ferramentas diferentes',
      'Necessidade de transmitir credibilidade e seguir regras do CFM',
    ],
    solucoes: [
      { servico: 'site-profissional', porque: 'Corpo clínico, especialidades, convênios aceitos e localização.' },
      { servico: 'sis-agendamento', porque: 'Agendamento online por médico e tipo de consulta.' },
      { servico: 'site-seo', porque: 'Ser encontrado em buscas por especialidade na cidade.' },
    ],
    argumentos: [
      'Responder "atende meu convênio?" no site tira dezenas de ligações por semana.',
      'Corpo clínico com CRM e especialidades transmite segurança antes da consulta.',
      'Agenda online permite marcar fora do horário da recepção.',
    ],
    perguntas: [
      'Quais são as perguntas mais frequentes que chegam por telefone?',
      'Cada médico usa uma agenda diferente?',
      'Quais especialidades vocês querem fortalecer?',
    ],
    objecoes: [
      {
        id: 'medico-nao-quer-exposicao',
        frase: 'Os médicos não gostam de exposição.',
        porTras: 'Desconforto com marketing pessoal.',
        resposta:
          'Entendo, e o site pode ser sóbrio e informativo: nome, CRM, especialidade e formação. Nada de marketing pessoal, só o que o paciente precisa para escolher com segurança. Faz sentido assim?',
        pergunta: 'Que informação o paciente precisa ter para confiar no médico?',
        proximoPasso: 'Proponha um modelo institucional sóbrio, com validação pelo diretor técnico.',
      },
      {
        id: 'agenda-sistema-clinico',
        frase: 'Já temos sistema de prontuário com agenda.',
        porTras: 'Não quer duplicar ferramentas.',
        resposta:
          'Perfeito, então o ideal é o site levar para essa agenda, se o sistema permitir agendamento online. Qual sistema vocês usam? Eu verifico a integração antes de propor qualquer coisa.',
        pergunta: 'O sistema de vocês tem agendamento online para pacientes?',
        proximoPasso: 'Verifique o sistema atual e proponha site integrado.',
      },
      {
        id: 'lgpd-preocupa',
        frase: 'E a privacidade dos pacientes?',
        porTras: 'Preocupação legítima com dados sensíveis.',
        resposta:
          'Prioridade total. O site não armazena prontuário; formulários coletam só o necessário (nome, contato, motivo geral) e com aviso de privacidade. Dados clínicos ficam no sistema de vocês. Quer que eu detalhe por escrito?',
        pergunta: 'Vocês já têm política de privacidade e responsável pelos dados?',
        proximoPasso: 'Inclua aviso de privacidade e coleta mínima no escopo.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Qual é a dúvida que mais chega no telefone de vocês: convênio, horários ou endereço?' },
      { autor: 'cliente', texto: 'Convênio, sem dúvida.' },
      { autor: 'vendedor', texto: 'Se o site mostrasse os convênios por especialidade e um botão de agendamento, quanto dessas ligações vocês acham que reduziria?' },
      { autor: 'cliente', texto: 'Bastante, mas os médicos não querem nada chamativo.' },
      { autor: 'vendedor', texto: 'Faz sentido. A proposta é um site sóbrio e informativo, validado pela direção técnica. Posso te mostrar um exemplo?' },
    ],
    angulos: {
      preco: 'Relacione com as horas de recepção ocupadas com dúvidas repetidas e com consultas particulares.',
      necessidade: 'Informação clara de convênios e especialidades, agendamento e credibilidade.',
      confianca: 'Sobriedade, CRM/RQE e privacidade — nada de promessas.',
      prazo: 'Antes de inaugurar uma especialidade ou unidade.',
    },
    cuidados: [
      'Siga as regras de publicidade médica do CFM: inclua nome, CRM e RQE do diretor técnico e dos especialistas quando aplicável; nada de promessa de resultado.',
      CUIDADO_LGPD,
    ],
    aberturaProspeccao: 'Qual é a pergunta que mais chega no telefone de vocês: convênio, horário ou especialidade?',
  },
  {
    id: 'psicologos',
    nome: 'Psicólogos',
    categoria: 'saude',
    resumo:
      'Profissional autônomo ou em consultório compartilhado, atendimento presencial e online. O paciente escolhe por abordagem, afinidade e confiança, muitas vezes em momento de fragilidade. A decisão é íntima; sigilo e acolhimento são tudo.',
    comoClientesChegam: ['Indicação', 'Busca por "psicólogo online" ou por tema', 'Plataformas de agendamento', 'Instagram com conteúdo educativo'],
    dores: [
      'Explicar abordagem, valores e funcionamento da terapia online repetidamente',
      'Agenda e pagamento de sessões controlados manualmente',
      'Dependência de plataformas que cobram comissão ou mensalidade',
    ],
    solucoes: [
      { servico: 'lp-autonomo', porque: 'Página acolhedora com abordagem, formação, CRP, modalidades e contato.' },
      { servico: 'sis-agendamento', porque: 'Agenda de sessões com lembretes e link de atendimento online.' },
      { servico: 'site-seo', porque: 'Ser encontrado por quem pesquisa temas específicos (ansiedade, terapia de casal).' },
    ],
    argumentos: [
      'O paciente escolhe por afinidade: uma página que explica a sua abordagem ajuda a pessoa certa a te encontrar.',
      'Responder dúvidas comuns (duração, valor, online) antes do contato torna o primeiro contato mais leve para quem já está fragilizado.',
      'Página própria reduz a dependência de plataformas.',
    ],
    perguntas: [
      'Você atende presencial, online ou os dois?',
      'Que tipo de paciente você mais gostaria de atender?',
      'Quanto você paga hoje para plataformas de agendamento?',
    ],
    objecoes: [
      {
        id: 'nao-quero-me-vender',
        frase: 'Não gosto da ideia de me vender.',
        porTras: 'Desconforto ético com marketing.',
        resposta:
          'Faz todo sentido, e não é sobre se vender. É sobre informar com clareza: quem você é, como trabalha e como a pessoa pode te procurar. Para quem está buscando ajuda, essa clareza é um cuidado. Faz sentido para você?',
        pergunta: 'O que você gostaria que um paciente soubesse antes da primeira sessão?',
        proximoPasso: 'Proponha página informativa, sóbria, validada por você.',
      },
      {
        id: 'plataforma-ja-agenda',
        frase: 'Já atendo por uma plataforma.',
        porTras: 'Canal que traz pacientes.',
        resposta:
          'A plataforma ajuda a ser encontrado. A página própria é para pacientes que chegam por indicação ou pesquisa direta, sem comissão. Quanto você paga à plataforma por mês ou por sessão?',
        pergunta: 'Quantos pacientes vieram por indicação no último ano?',
        proximoPasso: 'Ofereça página simples que convive com a plataforma.',
      },
      {
        id: 'sigilo',
        frase: 'E o sigilo dos pacientes?',
        porTras: 'Preocupação ética central.',
        resposta:
          'É prioridade. O site não guarda informações clínicas; o contato é só nome e forma de retorno, com aviso de privacidade. Nada de depoimentos de pacientes. Quer que eu te mostre como fica o formulário?',
        pergunta: 'Como você prefere receber o primeiro contato: WhatsApp, e-mail ou formulário?',
        proximoPasso: 'Defina o canal de contato com coleta mínima.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Você atende presencial, online ou os dois? Pergunto porque muita gente procura "psicólogo online" e não encontra informações claras.' },
      { autor: 'cliente', texto: 'Os dois, mas não gosto de ficar me expondo.' },
      { autor: 'vendedor', texto: 'Entendo. A ideia não é exposição, é uma página sóbria explicando sua abordagem, formação e como agendar. Quem está buscando ajuda se sente mais seguro com essa clareza. Quer ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com comissões e mensalidades de plataformas e com o valor de poucas sessões.',
      necessidade: 'Clareza sobre abordagem e modalidades para atrair o paciente certo.',
      confianca: 'Sigilo, sobriedade e respeito às regras do CFP.',
      prazo: 'Início do ano e retorno de férias costumam aumentar a procura.',
    },
    cuidados: [
      'Siga as orientações do CFP sobre publicidade: informe nome, CRP e abordagem; não use depoimentos de pacientes nem promessas de resultado.',
      CUIDADO_LGPD,
    ],
    aberturaProspeccao: 'Hoje a maior parte dos seus pacientes chega por indicação, por plataformas ou por busca na internet?',
  },
  {
    id: 'nutricionistas',
    nome: 'Nutricionistas',
    categoria: 'saude',
    resumo:
      'Consultas presenciais e online, muitas vezes com retorno e acompanhamento por pacote. Paciente busca emagrecimento, desempenho esportivo, saúde intestinal, gestação. Concorrência alta com conteúdo gratuito nas redes; diferencial é a especialização.',
    comoClientesChegam: ['Instagram com conteúdo', 'Indicação de médicos e academias', 'Busca por especialidade (ex.: nutrição esportiva)'],
    dores: [
      'Vender acompanhamento (pacotes) e não só consulta avulsa',
      'Envio de planos alimentares e materiais desorganizado',
      'Concorrência com conteúdo gratuito',
    ],
    solucoes: [
      { servico: 'lp-autonomo', porque: 'Página com especialidade, formato de acompanhamento, CRN e agendamento.' },
      { servico: 'sis-membros', porque: 'Área do paciente com planos, materiais e receitas organizados.' },
      { servico: 'sis-agendamento', porque: 'Consultas e retornos com lembretes.' },
    ],
    argumentos: [
      'Página que explica o acompanhamento ajuda o paciente a entender por que não é só uma dieta.',
      'Área do paciente organiza materiais e valoriza o pacote.',
      'Especialização comunicada com clareza diferencia da massa de conteúdo genérico.',
    ],
    perguntas: [
      'Qual público você mais quer atender?',
      'Você vende consulta avulsa ou acompanhamento?',
      'Como você envia planos e materiais hoje?',
    ],
    objecoes: [
      {
        id: 'instagram-ja-atrai',
        frase: 'Meu Instagram já traz pacientes.',
        porTras: 'O conteúdo funciona como vitrine.',
        resposta:
          'Ótimo! Então o site serve para o próximo passo: explicar como funciona o acompanhamento e facilitar o agendamento. Quem vê seu conteúdo e quer começar, sabe o que fazer?',
        pergunta: 'Quantas mensagens perguntando "como funciona a consulta" você recebe por semana?',
        proximoPasso: 'Proponha página de acompanhamento com agendamento.',
      },
      {
        id: 'antes-depois',
        frase: 'Quero postar fotos de antes e depois.',
        porTras: 'Acha que é a prova mais forte.',
        resposta:
          'É um ponto sensível: as regras do CFN restringem esse tipo de imagem e promessa de resultado. O site pode mostrar sua metodologia e formação. Vale confirmar com o conselho o que é permitido.',
        pergunta: 'Que outros diferenciais você pode mostrar, além de resultados?',
        proximoPasso: 'Construa a página em torno de metodologia e especialização.',
      },
      {
        id: 'paciente-online',
        frase: 'Atendo muita gente online, site faz diferença?',
        porTras: 'Dúvida sobre o papel do site em atendimento remoto.',
        resposta:
          'Faz ainda mais: para quem não pode te visitar, a página é a principal forma de conhecer seu trabalho e marcar. Você atende pessoas de outras cidades?',
        pergunta: 'Quantos pacientes de outras cidades você atende hoje?',
        proximoPasso: 'Destaque atendimento online e agendamento com pagamento.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vi seu conteúdo sobre nutrição esportiva. Quem chega pelo Instagram costuma entender como funciona seu acompanhamento?' },
      { autor: 'cliente', texto: 'Não, sempre me perguntam como é a consulta e quanto custa.' },
      { autor: 'vendedor', texto: 'Uma página explicando o acompanhamento, com agendamento, responderia antes. Quer ver como ficaria?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um pacote de acompanhamento.',
      necessidade: 'Explicar o acompanhamento e organizar materiais do paciente.',
      confianca: 'Formação, CRN e metodologia, sem promessas de resultado.',
      prazo: 'Antes de janeiro e da preparação para o verão, picos de procura.',
    },
    cuidados: [
      'Siga as regras do CFN para publicidade: inclua o CRN e evite promessas de resultado e uso indevido de imagens de pacientes.',
      CUIDADO_LGPD,
    ],
    aberturaProspeccao: 'Quem conhece seu conteúdo e quer começar o acompanhamento costuma entender como funciona ou pergunta tudo no direct?',
  },
  {
    id: 'fisioterapeutas',
    nome: 'Fisioterapeutas',
    categoria: 'saude',
    resumo:
      'Atendimento em clínica ou domiciliar, com sessões frequentes (2–3 por semana) e pacotes. Pacientes chegam por encaminhamento médico, lesões esportivas, pós-cirúrgico ou dor crônica. Alguns atendem convênio. Recorrência e controle de sessões são centrais.',
    comoClientesChegam: ['Encaminhamento médico', 'Indicação', 'Busca por "fisioterapia" + bairro/especialidade', 'Academias e assessorias esportivas'],
    dores: [
      'Controle de sessões, pacotes e faltas',
      'Agenda de atendimentos domiciliares com deslocamento',
      'Explicar especialidades (pilates, RPG, esportiva, pélvica)',
    ],
    solucoes: [
      { servico: 'sis-agendamento', porque: 'Agenda de sessões recorrentes com controle de pacotes.' },
      { servico: 'site-paginas-servicos', porque: 'Uma página por especialidade, atraindo o paciente certo.' },
      { servico: 'sis-clientes', porque: 'Evolução do paciente e lembretes de retorno.' },
    ],
    argumentos: [
      'Sessões recorrentes exigem agenda organizada: um sistema evita conflitos e controla pacotes.',
      'Página por especialidade ajuda médicos e pacientes a entenderem para que vocês servem.',
      'Lembrete de sessão reduz faltas num tratamento que depende de continuidade.',
    ],
    perguntas: [
      'Quantos pacientes ativos vocês têm por semana?',
      'Como controlam as sessões de cada pacote?',
      'Recebem muitos encaminhamentos médicos?',
    ],
    objecoes: [
      {
        id: 'encaminhamento-basta',
        frase: 'Meus pacientes vêm encaminhados pelo médico.',
        porTras: 'Canal principal é B2B (médicos).',
        resposta:
          'Ótimo canal. Um site com suas especialidades também ajuda o médico a indicar e o paciente a confiar antes de ligar. Quantos médicos te encaminham hoje?',
        pergunta: 'O que os médicos que te indicam sabem sobre seus serviços?',
        proximoPasso: 'Proponha site com páginas por especialidade para facilitar indicações.',
      },
      {
        id: 'agenda-papel',
        frase: 'Controlo a agenda no papel e funciona.',
        porTras: 'Volume administrável.',
        resposta:
          'Funciona até o dia em que alguém remarca três sessões de uma vez, né? Quantos pacientes você atende por semana?',
        pergunta: 'Quantas remarcações acontecem por semana?',
        proximoPasso: 'Demonstre agenda recorrente e controle de pacotes.',
      },
      {
        id: 'convenio-paga-pouco',
        frase: 'Convênio paga pouco, não sobra para investir.',
        porTras: 'Margem apertada.',
        resposta:
          'Entendo. Um dos objetivos pode ser justamente atrair mais particulares em especialidades específicas, como pilates ou fisioterapia esportiva. Você tem interesse em aumentar a parte particular?',
        pergunta: 'Qual especialidade particular você gostaria de fortalecer?',
        proximoPasso: 'Foque em uma página de especialidade particular.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Vocês atendem por especialidade, como esportiva ou pilates? Quem procura isso no Google consegue encontrar vocês?' },
      { autor: 'cliente', texto: 'Acho que não, a maioria vem por médico.' },
      { autor: 'vendedor', texto: 'Faz sentido. Uma página por especialidade ajuda tanto o paciente que pesquisa quanto o médico que indica. Posso te mostrar uma ideia?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um pacote de sessões particulares.',
      necessidade: 'Controle de sessões e comunicação de especialidades.',
      confianca: 'Mostre registro no CREFITO, formação e estrutura.',
      prazo: 'Antes de abrir nova especialidade ou unidade.',
    },
    cuidados: [CUIDADO_SAUDE + ' Inclua o número do CREFITO.', CUIDADO_LGPD],
    aberturaProspeccao: 'Hoje os pacientes de vocês chegam mais por encaminhamento médico ou procurando por conta própria?',
  },
  {
    id: 'clinicas-veterinarias',
    nome: 'Clínicas veterinárias',
    categoria: 'saude',
    resumo:
      'Consultas, vacinas, cirurgias, exames e, muitas vezes, banho e tosa e pet shop. Tutor tem vínculo emocional forte e busca confiança. Emergência e plantão são decisivos. Vacinação e retornos geram recorrência previsível.',
    comoClientesChegam: ['Busca "veterinário perto de mim" / plantão 24h', 'Indicação', 'Instagram', 'Pet shop no mesmo espaço'],
    dores: [
      'Lembrar o tutor de vacinas e vermifugação',
      'Agenda de consultas, banho e tosa no mesmo WhatsApp',
      'Informar plantão e emergência com clareza',
    ],
    solucoes: [
      { servico: 'sis-clientes', porque: 'Ficha do pet com vacinas e lembretes automáticos de reforço.' },
      { servico: 'site-negocio-local', porque: 'Horários, plantão, serviços e rota em destaque.' },
      { servico: 'sis-agendamento', porque: 'Agenda separada para consultas e banho e tosa.' },
    ],
    argumentos: [
      'Lembrete de vacina traz o pet de volta na data certa e o tutor agradece.',
      'Plantão e telefone de emergência precisam estar a um toque de distância.',
      'Agenda online de banho e tosa libera o atendimento para casos clínicos.',
    ],
    perguntas: [
      'Como vocês avisam os tutores sobre reforço de vacina?',
      'Vocês têm plantão ou atendimento de emergência?',
      'Banho e tosa e consultas usam o mesmo WhatsApp?',
    ],
    objecoes: [
      {
        id: 'tutores-chamam-whatsapp',
        frase: 'Os tutores já me chamam no WhatsApp.',
        porTras: 'O canal funciona.',
        resposta:
          'E vai continuar. O sistema ajuda a vocês chamarem o tutor na hora certa, para vacina e retorno, sem depender de alguém lembrar. Como vocês fazem isso hoje?',
        pergunta: 'Quantos pets deixaram de voltar para o reforço da vacina?',
        proximoPasso: 'Proponha ficha do pet com lembretes de vacina.',
      },
      {
        id: 'ja-tem-sistema-vet',
        frase: 'Já uso um sistema veterinário.',
        porTras: 'Software clínico já adotado.',
        resposta:
          'Ótimo. Nesse caso o site complementa: plantão, serviços e agendamento levando para o sistema, se ele permitir. Qual sistema vocês usam?',
        pergunta: 'O sistema tem agendamento online para tutores?',
        proximoPasso: 'Verifique integração e proponha site institucional local.',
      },
      {
        id: 'cliente-fiel',
        frase: 'Minha clientela é fiel.',
        porTras: 'Não vê necessidade de atrair.',
        resposta:
          'Isso vale muito. Clientela fiel se beneficia de lembretes e agendamento fácil. E quem se muda para o bairro precisa te encontrar. Vocês recebem tutores novos com frequência?',
        pergunta: 'Quantos tutores novos chegam por mês?',
        proximoPasso: 'Foque em retenção (lembretes) e presença local.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como vocês avisam os tutores quando chega a hora do reforço da vacina?' },
      { autor: 'cliente', texto: 'A recepção tenta, mas não dá conta de todos.' },
      { autor: 'vendedor', texto: 'É bem comum. Um sistema com a ficha de cada pet pode mandar o lembrete automaticamente. Quer ver como funciona?' },
    ],
    angulos: {
      preco: 'Compare com a receita de vacinas e retornos que não acontecem por falta de lembrete.',
      necessidade: 'Lembretes de vacina, plantão claro e agenda de banho e tosa.',
      confianca: 'Equipe, CRMV, estrutura e plantão.',
      prazo: 'Antes de campanhas de vacinação e do verão (pico de banho e tosa).',
    },
    cuidados: ['Inclua o CRMV do responsável técnico.', 'Evite prometer diagnóstico ou resultado de tratamento.'],
    aberturaProspeccao: 'Como vocês lembram hoje os tutores sobre reforço de vacina dos pets?',
  },
  {
    id: 'laboratorios',
    nome: 'Laboratórios',
    categoria: 'saude',
    resumo:
      'Coleta de exames com e sem agendamento, convênios, preparo específico por exame e entrega de resultados. Volume alto de dúvidas operacionais (jejum, horários, convênios). Resultados são dados sensíveis.',
    comoClientesChegam: ['Pedido médico', 'Convênio', 'Proximidade', 'Coleta domiciliar e empresas'],
    dores: [
      'Ligações sobre preparo de exames e horários',
      'Entrega de resultados por e-mail/WhatsApp com risco à privacidade',
      'Agendamento de coleta domiciliar',
    ],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Guia de preparo por exame, convênios e unidades.' },
      { servico: 'sis-membros', porque: 'Portal de resultados com login seguro.' },
      { servico: 'sis-agendamento', porque: 'Agendamento de coleta domiciliar e exames com hora marcada.' },
    ],
    argumentos: [
      'Guia de preparo online reduz exames remarcados por preparo errado.',
      'Portal com login protege dados sensíveis melhor do que envio por mensagem.',
      'Agendamento de coleta domiciliar organiza rotas e equipe.',
    ],
    perguntas: [
      'Quantas ligações por dia são sobre preparo e horários?',
      'Como os pacientes recebem os resultados hoje?',
      'Vocês fazem coleta domiciliar?',
    ],
    objecoes: [
      {
        id: 'resultado-whatsapp',
        frase: 'Mandamos resultado pelo WhatsApp e ninguém reclama.',
        porTras: 'Conveniência acima de segurança.',
        resposta:
          'É prático, sim. O cuidado é que resultado de exame é dado sensível pela LGPD, e mensagens podem ir para o número errado. Um portal com login mantém a praticidade com mais segurança. Já aconteceu de enviar para o contato errado?',
        pergunta: 'Como vocês confirmam a identidade antes de enviar o resultado?',
        proximoPasso: 'Proponha portal de resultados com acesso por login ou código.',
      },
      {
        id: 'sistema-laboratorial',
        frase: 'Nosso sistema laboratorial já tem portal.',
        porTras: 'Ferramenta existente.',
        resposta:
          'Perfeito, então não faz sentido criar outro. O site pode explicar preparo, unidades e convênios e levar para o portal. Como está a parte de informações de preparo hoje?',
        pergunta: 'Onde o paciente encontra o preparo de cada exame?',
        proximoPasso: 'Foque em guia de preparo e integração com o portal existente.',
      },
      {
        id: 'publico-idoso',
        frase: 'Nosso público é mais velho, não usa site.',
        porTras: 'Percepção sobre o público.',
        resposta:
          'Muitos usam com ajuda de filhos e netos, que costumam pesquisar por eles. Um site claro, com letras grandes e telefone em destaque, atende os dois. Quem costuma ligar para tirar dúvida?',
        pergunta: 'Quem marca os exames dos pacientes mais velhos?',
        proximoPasso: 'Proponha site acessível, com telefone e preparo em destaque.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! A recepção de vocês recebe muitas ligações perguntando sobre jejum e preparo de exames?' },
      { autor: 'cliente', texto: 'O dia todo.' },
      { autor: 'vendedor', texto: 'Um guia de preparo por exame no site, fácil de achar pelo celular, costuma reduzir bastante isso. Querem ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com exames remarcados por preparo errado e horas de atendimento telefônico.',
      necessidade: 'Informação de preparo, privacidade nos resultados e coleta domiciliar.',
      confianca: 'Segurança de dados e clareza técnica.',
      prazo: 'Antes de abrir unidade ou serviço de coleta domiciliar.',
    },
    cuidados: [CUIDADO_LGPD, 'Inclua responsável técnico e registros exigidos para o laboratório.'],
    aberturaProspeccao: 'Quantas ligações por dia vocês recebem perguntando sobre preparo de exames?',
  },
  {
    id: 'oftalmologistas',
    nome: 'Oftalmologistas',
    categoria: 'saude',
    resumo:
      'Consultas de rotina, exames especializados e cirurgias (catarata, refrativa). Muitos têm ótica associada. Público amplo, de crianças a idosos. Cirurgias têm ciclo de decisão longo e precisam de muita explicação.',
    comoClientesChegam: ['Convênios', 'Indicação', 'Busca por exame ou cirurgia', 'Ótica parceira'],
    dores: [
      'Explicar cirurgias e exames repetidamente',
      'Agendamento de exames que exigem preparo (dilatação)',
      'Separar consulta, exame e ótica na comunicação',
    ],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Páginas sobre cirurgias e exames com orientações e FAQ.' },
      { servico: 'sis-agendamento', porque: 'Agendamento por tipo de consulta e exame, com orientações de preparo.' },
      { servico: 'lp-captacao', porque: 'Página de avaliação para cirurgia refrativa ou catarata.' },
    ],
    argumentos: [
      'Quem pensa em cirurgia refrativa pesquisa muito: conteúdo claro e validado gera confiança.',
      'Orientações de preparo (ex.: dilatação, não dirigir) evitam surpresas no dia.',
      'Página de avaliação organiza os interessados em cirurgia.',
    ],
    perguntas: [
      'Quais procedimentos vocês querem destacar?',
      'Os pacientes chegam preparados para exames com dilatação?',
      'A ótica é parte da clínica?',
    ],
    objecoes: [
      {
        id: 'cirurgia-depende-avaliacao',
        frase: 'Cirurgia não se vende pela internet.',
        porTras: 'Ética e complexidade.',
        resposta:
          'Concordo, quem decide é o médico na avaliação. O site informa com responsabilidade e convida para a avaliação. Quantas pessoas perguntam sobre cirurgia refrativa por mês?',
        pergunta: 'O que o paciente mais pergunta antes da avaliação de cirurgia?',
        proximoPasso: 'Crie página informativa validada com agendamento de avaliação.',
      },
      {
        id: 'convenio-lota',
        frase: 'O convênio já lota a agenda.',
        porTras: 'Volume suficiente.',
        resposta:
          'Ótimo. Nesse caso o foco pode ser atrair procedimentos particulares e organizar exames. Faz sentido aumentar a parte de cirurgias?',
        pergunta: 'Qual procedimento particular é mais estratégico?',
        proximoPasso: 'Foque em uma página de procedimento particular.',
      },
      {
        id: 'otica-separada',
        frase: 'A ótica tem o próprio Instagram.',
        porTras: 'Comunicação separada.',
        resposta:
          'Pode continuar separada. O site da clínica pode indicar a ótica de forma discreta, respeitando as regras éticas. O foco é consultas e procedimentos.',
        pergunta: 'Como vocês preferem separar clínica e ótica na comunicação?',
        proximoPasso: 'Defina com o médico como tratar a ótica no site.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Vocês recebem muitas perguntas sobre cirurgia para tirar os óculos?' },
      { autor: 'cliente', texto: 'Bastante, mas a pessoa precisa vir para avaliação.' },
      { autor: 'vendedor', texto: 'Exato. Uma página explicando com responsabilidade como funciona e convidando para a avaliação ajuda a pessoa a chegar preparada. Quer ver um modelo?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um procedimento particular.',
      necessidade: 'Explicação de procedimentos e organização de exames.',
      confianca: 'Conteúdo validado pelo médico, CRM e RQE.',
      prazo: 'Antes de campanhas de prevenção ou de adquirir novos equipamentos.',
    },
    cuidados: [
      'Siga as regras de publicidade médica do CFM, com CRM e RQE; nada de promessas de resultado em cirurgias.',
      CUIDADO_LGPD,
    ],
    aberturaProspeccao: 'Vocês recebem muitas perguntas sobre cirurgia refrativa antes de o paciente marcar a avaliação?',
  },
  {
    id: 'fonoaudiologos',
    nome: 'Fonoaudiólogos',
    categoria: 'saude',
    resumo:
      'Atendimento de linguagem infantil, voz, audição, deglutição, motricidade orofacial. Muitos pacientes são crianças, e a decisão é dos pais, frequentemente por indicação de pediatras e escolas. Tratamentos longos, com sessões semanais.',
    comoClientesChegam: ['Indicação de pediatras, escolas e otorrinos', 'Busca por "fonoaudiólogo infantil"', 'Grupos de pais'],
    dores: [
      'Explicar áreas de atuação (muita gente não sabe o que a fono faz)',
      'Agenda semanal recorrente com crianças',
      'Comunicação com pais e escolas',
    ],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Explicar cada área de atuação e sinais de alerta para os pais.' },
      { servico: 'sis-agendamento', porque: 'Sessões semanais recorrentes com lembretes.' },
      { servico: 'lp-autonomo', porque: 'Página profissional para quem atende sozinho.' },
    ],
    argumentos: [
      'Pais pesquisam sinais de alerta: conteúdo claro leva a família ao profissional certo.',
      'Páginas por área ajudam pediatras e escolas a indicar.',
      'Agenda recorrente reduz conflitos e faltas.',
    ],
    perguntas: [
      'Quais áreas você atende?',
      'Quem mais te indica: pediatras, escolas ou pais?',
      'Seus pacientes são mais crianças ou adultos?',
    ],
    objecoes: [
      {
        id: 'indicacao-pediatra',
        frase: 'Recebo pacientes por indicação de pediatras.',
        porTras: 'Canal B2B suficiente.',
        resposta:
          'Ótimo canal. Uma página com suas áreas ajuda o pediatra a indicar e os pais a confiarem antes de ligar. Quantos pediatras te indicam?',
        pergunta: 'Quando o pediatra te indica, o que ele passa para os pais?',
        proximoPasso: 'Proponha página com áreas de atuação para compartilhar com indicadores.',
      },
      {
        id: 'nao-sei-o-que-postar',
        frase: 'Não sei o que colocar num site.',
        porTras: 'Insegurança com conteúdo.',
        resposta:
          'Eu te ajudo: áreas de atuação, como funciona a avaliação, sinais de alerta comuns e contato. Você valida tudo. Quais dúvidas os pais mais te fazem?',
        pergunta: 'Quais são as perguntas que os pais mais fazem na primeira consulta?',
        proximoPasso: 'Construa o conteúdo a partir das perguntas reais.',
      },
      {
        id: 'agenda-fixa',
        frase: 'Minha agenda já está cheia.',
        porTras: 'Sem necessidade de mais pacientes.',
        resposta:
          'Que bom! Então o foco pode ser organização: lembretes, remarcações e comunicação com os pais. Faltas acontecem?',
        pergunta: 'Quantas sessões são remarcadas por semana?',
        proximoPasso: 'Proponha agenda recorrente com lembretes.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Os pais costumam saber quando procurar uma fono, ou chegam com muitas dúvidas?' },
      { autor: 'cliente', texto: 'Muitas dúvidas, e às vezes chegam tarde.' },
      { autor: 'vendedor', texto: 'Uma página explicando suas áreas e quando procurar ajuda pode orientar os pais e facilitar as indicações. Quer ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um mês de sessões de um paciente.',
      necessidade: 'Informar áreas de atuação e facilitar indicações.',
      confianca: 'CRFa, formação e linguagem acolhedora para pais.',
      prazo: 'Início do ano letivo, quando escolas mais indicam.',
    },
    cuidados: [CUIDADO_SAUDE + ' Inclua o número do CRFa.', 'Imagens de crianças só com autorização expressa dos responsáveis.'],
    aberturaProspeccao: 'Hoje quem mais te indica pacientes: pediatras, escolas ou os próprios pais?',
  },
  {
    id: 'clinicas-multidisciplinares',
    nome: 'Clínicas multidisciplinares',
    categoria: 'saude',
    resumo:
      'Reúnem várias especialidades (psicologia, fono, nutrição, fisioterapia, terapia ocupacional), muitas vezes com foco infantil ou reabilitação. Agenda complexa com muitas salas e profissionais, alguns como parceiros. Comunicação com famílias e convênios.',
    comoClientesChegam: ['Indicação médica', 'Convênios', 'Escolas', 'Busca por especialidade'],
    dores: [
      'Agenda de muitas salas e profissionais',
      'Repasse e comissões de profissionais parceiros',
      'Comunicar todas as especialidades sem confundir',
    ],
    solucoes: [
      { servico: 'sis-agendamento', porque: 'Agenda por profissional e sala, com recorrência.' },
      { servico: 'sis-gestao', porque: 'Controle de repasses, convênios e relatórios por profissional.' },
      { servico: 'site-paginas-servicos', porque: 'Uma página por especialidade e equipe.' },
    ],
    argumentos: [
      'Agenda que entende salas evita dois atendimentos no mesmo espaço.',
      'Repasse calculado pelo sistema reduz conflitos com parceiros.',
      'Família encontra todas as especialidades num lugar só.',
    ],
    perguntas: [
      'Quantos profissionais e salas vocês têm?',
      'Como calculam os repasses?',
      'Quais especialidades têm mais procura?',
    ],
    objecoes: [
      {
        id: 'cada-profissional-sua-agenda',
        frase: 'Cada profissional cuida da própria agenda.',
        porTras: 'Modelo descentralizado.',
        resposta:
          'Funciona até haver conflito de sala ou a recepção não saber quem está livre. Uma agenda única mantém a autonomia de cada um e dá visão para a gestão. Já houve conflito de sala?',
        pergunta: 'Como a recepção sabe quem está livre para um paciente novo?',
        proximoPasso: 'Proponha agenda centralizada com visão por profissional.',
      },
      {
        id: 'sistema-pronto-clinica',
        frase: 'Existem sistemas prontos para clínica.',
        porTras: 'Comparação com SaaS do setor.',
        resposta:
          'Existem, e vale avaliar. O personalizado faz sentido se as regras de repasse, convênios ou terapias forem específicas demais. Vocês já testaram algum?',
        pergunta: 'O que os sistemas que vocês testaram não resolveram?',
        proximoPasso: 'Compare requisitos com sistemas prontos antes de propor desenvolvimento.',
      },
      {
        id: 'muitas-especialidades',
        frase: 'Temos especialidades demais para um site.',
        porTras: 'Complexidade de comunicação.',
        resposta:
          'Por isso a organização é essencial: uma página por especialidade e uma por profissional, com filtros. A família encontra o que precisa sem se perder.',
        pergunta: 'Quais especialidades as famílias mais procuram?',
        proximoPasso: 'Proponha estrutura de navegação por especialidade.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Com tantos profissionais e salas, como vocês organizam a agenda hoje?' },
      { autor: 'cliente', texto: 'Planilha compartilhada, mas sempre dá conflito.' },
      { autor: 'vendedor', texto: 'É o cenário mais comum. Uma agenda que conhece as salas e os profissionais resolve os conflitos e ainda ajuda no cálculo de repasses. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com horas de gestão em planilhas e conflitos de repasse.',
      necessidade: 'Agenda por sala/profissional e gestão de repasses.',
      confianca: 'Mostre perfis de acesso por profissional e privacidade dos dados.',
      prazo: 'Antes da entrada de novos profissionais ou abertura de nova unidade.',
    },
    cuidados: [CUIDADO_SAUDE, CUIDADO_LGPD],
    aberturaProspeccao: 'Como vocês organizam hoje a agenda de tantos profissionais e salas?',
  },
];
