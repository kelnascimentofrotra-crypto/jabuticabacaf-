import type { Niche } from '../../types';

const CUIDADO_ALIMENTOS =
  'Informe alergênicos e ingredientes com precisão e mantenha preços e disponibilidade atualizados — informação errada em cardápio gera reclamação e problema com o consumidor.';

export const ALIMENTACAO: Niche[] = [
  {
    id: 'restaurantes',
    nome: 'Restaurantes',
    categoria: 'alimentacao',
    resumo:
      'Movimento concentrado em horários de pico (almoço e jantar), salão + delivery + reservas. Margem apertada e dependência crescente dos aplicativos de delivery, que cobram comissão. Cardápio muda com sazonalidade e custo de insumos.',
    comoClientesChegam: ['Passagem e localização', 'Aplicativos de delivery', 'Google Maps e avaliações', 'Instagram com pratos'],
    dores: [
      'Comissão alta dos aplicativos de delivery',
      'Pedidos e reservas pelo WhatsApp no horário de pico',
      'Cardápio desatualizado em vários lugares',
    ],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Cardápio digital com pedido direto para o WhatsApp, sem comissão por pedido.' },
      { servico: 'site-negocio-local', porque: 'Horários, reservas, cardápio e rota integrados ao Google.' },
      { servico: 'sis-pedidos', porque: 'Organiza pedidos de delivery e retirada em um painel.' },
    ],
    argumentos: [
      'Cliente que já te conhece pode pedir direto, sem comissão para o aplicativo.',
      'Cardápio digital atualizado num lugar só evita preço errado e prato esgotado.',
      'Pedido chega escrito e organizado, sem erro de anotação no pico.',
    ],
    perguntas: [
      'Quanto você paga de comissão aos aplicativos por mês?',
      'Quantos pedidos chegam pelo WhatsApp por dia?',
      'Vocês fazem reservas? Como controlam?',
    ],
    objecoes: [
      {
        id: 'app-delivery-resolve',
        frase: 'O aplicativo de delivery já resolve.',
        porTras: 'O app traz volume e ele teme perder.',
        resposta:
          'Ele traz clientes novos, e faz sentido continuar. O cardápio próprio é para o cliente que já te conhece pedir direto, sem comissão. Que parte dos seus pedidos vem de clientes que já compraram antes?',
        pergunta: 'Quanto foi a comissão total paga aos aplicativos no último mês?',
        proximoPasso: 'Proponha cardápio próprio divulgado na embalagem e no salão para clientes recorrentes.',
      },
      {
        id: 'cardapio-muda',
        frase: 'Meu cardápio muda toda semana.',
        porTras: 'Medo de manter tudo atualizado.',
        resposta:
          'Por isso o cardápio vem com painel para você mudar preço e marcar prato esgotado pelo celular em segundos. Quem atualiza o cardápio do aplicativo hoje?',
        pergunta: 'Quem é responsável por atualizar o cardápio hoje?',
        proximoPasso: 'Demonstre a atualização rápida no celular.',
      },
      {
        id: 'sem-tempo-no-pico',
        frase: 'No pico não tenho tempo para olhar sistema.',
        porTras: 'Operação intensa.',
        resposta:
          'Justamente no pico o pedido escrito ajuda: chega organizado, com endereço e forma de pagamento, e não precisa de conversa. Quantos pedidos dão errado por anotação numa semana?',
        pergunta: 'Quantos pedidos tiveram erro de anotação no último mês?',
        proximoPasso: 'Proponha teste do cardápio digital em um dia de movimento menor.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quanto do delivery de vocês vem dos aplicativos e quanto vem direto pelo WhatsApp?' },
      { autor: 'cliente', texto: 'Uns 70% aplicativo. A comissão pesa.' },
      { autor: 'vendedor', texto: 'Imagino. Um cardápio próprio com pedido direto no WhatsApp ajuda a trazer os clientes fiéis para fora da comissão. Quer ver como funciona?' },
    ],
    angulos: {
      preco: 'Compare com a comissão mensal dos aplicativos; o cardápio próprio costuma se justificar pela economia em pedidos recorrentes.',
      necessidade: 'Pedido direto sem comissão e cardápio atualizado.',
      confianca: 'Mostre a atualização de preços e a chegada do pedido no WhatsApp.',
      prazo: 'Antes de datas fortes (Dia das Mães, Dia dos Namorados, fim de ano).',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Quanto do delivery de vocês hoje vem dos aplicativos e quanto vem direto pelo WhatsApp?',
  },
  {
    id: 'lanchonetes',
    nome: 'Lanchonetes',
    categoria: 'alimentacao',
    resumo:
      'Ticket baixo, alto giro, público de bairro, escritório ou escola. Pedidos rápidos, muitas vezes por WhatsApp para retirada ou entrega próxima. O dono costuma estar no balcão ou na chapa.',
    comoClientesChegam: ['Público do bairro e de trabalho próximo', 'WhatsApp de clientes frequentes', 'Aplicativos de delivery'],
    dores: ['Pedidos por áudio no horário de pico', 'Erro em pedidos com muitas variações', 'Cardápio enviado por foto desatualizada'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Pedido montado pelo cliente com adicionais, enviado pronto.' },
      { servico: 'sis-pedidos', porque: 'Painel de pedidos para retirada e entrega.' },
      { servico: 'site-negocio-local', porque: 'Horário, cardápio e localização no Google.' },
    ],
    argumentos: [
      'Pedido escrito com adicionais evita "era sem cebola".',
      'Cliente do escritório pede antes e só busca: menos fila no horário de almoço.',
      'Link fixo do cardápio substitui fotos desatualizadas.',
    ],
    perguntas: ['Quantos pedidos por WhatsApp no horário de almoço?', 'Vocês têm muitos adicionais e variações?', 'Fazem entrega ou só retirada?'],
    objecoes: [
      {
        id: 'ticket-baixo',
        frase: 'Meu lanche é barato, não compensa investir.',
        porTras: 'Margem por item pequena.',
        resposta:
          'Justamente com ticket baixo, o que importa é volume e agilidade. Se o cardápio agiliza 10 pedidos por dia, a conta muda. Quantos pedidos vocês fazem num dia bom?',
        pergunta: 'Quantos pedidos por dia vocês atendem?',
        proximoPasso: 'Proponha cardápio simples com investimento enxuto.',
      },
      {
        id: 'cliente-manda-audio',
        frase: 'Meu cliente manda áudio, não vai usar link.',
        porTras: 'Hábito do público.',
        resposta:
          'Alguns vão continuar, e tudo bem. Mas o link na mensagem automática ajuda os que preferem ver o cardápio e já mandam tudo escrito. Dá para testar por um mês.',
        pergunta: 'Quantos áudios vocês precisam ouvir em pleno pico?',
        proximoPasso: 'Configure o link na saudação automática do WhatsApp Business.',
      },
      {
        id: 'ja-tenho-cardapio-foto',
        frase: 'Já mando o cardápio em foto.',
        porTras: 'Solução gratuita existente.',
        resposta:
          'Funciona, até mudar o preço e a foto ficar velha circulando. O cardápio online se atualiza na hora para todo mundo. Quando foi a última mudança de preço?',
        pergunta: 'Quantas fotos de cardápio antigas ainda circulam com preço errado?',
        proximoPasso: 'Mostre a atualização instantânea.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! No horário do almoço vocês recebem muito pedido por áudio no WhatsApp?' },
      { autor: 'cliente', texto: 'Muito, e às vezes sai errado.' },
      { autor: 'vendedor', texto: 'Com um cardápio online, o cliente escolhe os adicionais e manda o pedido escrito. Quer ver?' },
    ],
    angulos: {
      preco: 'Volume e agilidade: compare com poucos pedidos a mais por dia.',
      necessidade: 'Pedido sem erro e agilidade no pico.',
      confianca: 'Demonstre o pedido chegando pronto no WhatsApp.',
      prazo: 'Antes da volta às aulas ou de abrir delivery.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'No horário de almoço, vocês recebem muito pedido por áudio no WhatsApp?',
  },
  {
    id: 'pizzarias',
    nome: 'Pizzarias',
    categoria: 'alimentacao',
    resumo:
      'Delivery noturno concentrado em sextas, sábados e domingos. Pedidos com muitas combinações (meio a meio, borda, tamanhos). Concorrência intensa, fidelização por promoções e programas de pontos. Dependência forte de aplicativos.',
    comoClientesChegam: ['Aplicativos de delivery', 'Clientes recorrentes no WhatsApp', 'Panfletos e ímãs de geladeira', 'Instagram'],
    dores: ['Pedidos meio a meio com erro', 'Pico de sexta à noite', 'Comissão dos aplicativos'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Monta pizza meio a meio, borda e tamanho, com pedido pronto.' },
      { servico: 'sis-pedidos', porque: 'Painel com status (no forno, saiu para entrega) e impressão de comanda.' },
      { servico: 'sis-clientes', porque: 'Programa de fidelidade e recompra.' },
    ],
    argumentos: [
      'Meio a meio com borda escolhido pelo cliente elimina erro de comunicação.',
      'Pedido direto sem comissão aumenta a margem dos clientes fiéis.',
      'Painel de pedidos dá controle no pico de sexta.',
    ],
    perguntas: ['Quantos pedidos numa sexta à noite?', 'Quanto paga de comissão ao mês?', 'Vocês têm programa de fidelidade?'],
    objecoes: [
      {
        id: 'panfleto-funciona',
        frase: 'Panfleto e ímã ainda funcionam aqui.',
        porTras: 'Mídia local eficaz.',
        resposta:
          'Que bom! Dá para colocar um QR Code no ímã levando direto ao cardápio. Aí o panfleto vira pedido mais rápido. Vocês imprimem quantos por mês?',
        pergunta: 'Quantos pedidos vocês acham que vêm do panfleto hoje?',
        proximoPasso: 'Proponha QR Code no material impresso apontando para o cardápio.',
      },
      {
        id: 'pedido-complexo',
        frase: 'Pedido de pizza é complicado para site.',
        porTras: 'Acha que o sistema não comporta combinações.',
        resposta:
          'É exatamente por isso que vale: o cliente escolhe sabor de cada metade, borda e tamanho, e o pedido chega certinho. Quais combinações dão mais erro hoje?',
        pergunta: 'Quantas pizzas por semana saem erradas?',
        proximoPasso: 'Demonstre a montagem meio a meio.',
      },
      {
        id: 'app-traz-cliente-novo',
        frase: 'Não posso sair do aplicativo.',
        porTras: 'Medo de perder volume.',
        resposta:
          'Nem precisa. A ideia é ter os dois: aplicativo para clientes novos e pedido direto para os fiéis. Um cupom no próximo pedido direto ajuda na migração.',
        pergunta: 'Que porcentagem dos clientes do aplicativo já pediu mais de uma vez?',
        proximoPasso: 'Proponha estratégia de migração gradual com cupom na embalagem.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Na sexta à noite, quantos pedidos vocês recebem pelo WhatsApp?' },
      { autor: 'cliente', texto: 'Uns 60, fora o aplicativo.' },
      { autor: 'vendedor', texto: 'É muita coisa para anotar! Com um cardápio online, o cliente monta meio a meio e borda e o pedido chega pronto. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com comissão mensal e pizzas refeitas por erro.',
      necessidade: 'Pedido sem erro e pico organizado.',
      confianca: 'Demonstre pedido meio a meio e painel de status.',
      prazo: 'Antes de fins de semana prolongados, Copa, finais de campeonato.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Numa sexta à noite, quantos pedidos de pizza chegam pelo WhatsApp de vocês?',
  },
  {
    id: 'hamburguerias',
    nome: 'Hamburguerias',
    categoria: 'alimentacao',
    resumo:
      'Público jovem, forte apelo visual, combos e adicionais. Muitas operam como dark kitchen (só delivery). Instagram é vitrine principal; ticket médio maior que lanchonete. Promoções em dias específicos são comuns.',
    comoClientesChegam: ['Instagram com fotos e vídeos', 'Aplicativos de delivery', 'Indicação', 'Promoções em dias de semana'],
    dores: ['Comissão dos aplicativos', 'Adicionais e combos com erro', 'Promoções divulgadas sem um link de pedido'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Cardápio com combos e adicionais, pedido direto sem comissão.' },
      { servico: 'loja-checkout', porque: 'Pagamento online no pedido, reduzindo trote e calote.' },
      { servico: 'sis-clientes', porque: 'Cupons e fidelidade para recompra.' },
    ],
    argumentos: [
      'Cliente vê o vídeo do burger e pede em dois cliques, sem esperar resposta.',
      'Pagamento antecipado protege contra pedido falso.',
      'Cupom de recompra traz o cliente do aplicativo para o canal próprio.',
    ],
    perguntas: ['Vocês são delivery only?', 'Quanto paga de comissão?', 'Como divulgam as promoções?'],
    objecoes: [
      {
        id: 'cliente-acha-no-app',
        frase: 'Meu cliente me acha no aplicativo.',
        porTras: 'Descoberta via app.',
        resposta:
          'Para clientes novos, sim. Para os que já pediram e amaram, o pedido direto é mais barato para você e, com cupom, para eles também. Você coloca algo na embalagem hoje?',
        pergunta: 'O que vai na embalagem junto com o pedido?',
        proximoPasso: 'Proponha cartão com QR Code e cupom na embalagem.',
      },
      {
        id: 'pagamento-online-caro',
        frase: 'Taxa de pagamento online é cara.',
        porTras: 'Custo de transação.',
        resposta:
          'É um custo real. Dá para oferecer Pix, que costuma ter taxa menor, e deixar pagamento na entrega também. Quer ver as opções e as taxas lado a lado?',
        pergunta: 'Quantos pedidos falsos ou cancelados vocês têm por mês?',
        proximoPasso: 'Compare taxas de intermediadores com o cliente.',
      },
      {
        id: 'promo-no-insta',
        frase: 'Divulgo promoção no Instagram e já vende.',
        porTras: 'Canal funcionando.',
        resposta:
          'Ótimo! O link de pedido na bio e nos stories transforma o interesse em pedido na hora. Hoje, depois de ver a promoção, o cliente precisa chamar no direct?',
        pergunta: 'Quantas mensagens chegam perguntando "a promoção vale hoje?"',
        proximoPasso: 'Mostre o link de pedido nos stories.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Que burgers bonitos! Quem vê o vídeo e quer pedir precisa chamar no direct ou tem link?' },
      { autor: 'cliente', texto: 'Chama no WhatsApp ou no aplicativo.' },
      { autor: 'vendedor', texto: 'Um link de pedido direto, com combos e adicionais, transforma o vídeo em pedido sem comissão. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com a comissão de aplicativos e o valor de pedidos recorrentes.',
      necessidade: 'Canal próprio de pedidos e pagamento antecipado.',
      confianca: 'Demonstre combos, adicionais e pedido chegando pronto.',
      prazo: 'Antes de lançar novos combos ou promoções.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Quem vê seus vídeos e quer pedir precisa chamar no direct ou já tem um link de pedido?',
  },
  {
    id: 'confeitarias',
    nome: 'Confeitarias',
    categoria: 'alimentacao',
    resumo:
      'Bolos personalizados e de festa sob encomenda, doces finos, pronta-entrega. Orçamentos dependem de tamanho, sabores, decoração e data. Agenda de produção limitada: datas comemorativas esgotam rápido. Muitas operam em casa, com a dona fazendo tudo.',
    comoClientesChegam: ['Instagram com fotos de bolos', 'Indicação em festas', 'Datas comemorativas', 'Buffets e decoradores parceiros'],
    dores: [
      'Orçamento de bolo personalizado com 15 mensagens de ida e volta',
      'Controle de encomendas por data e capacidade de produção',
      'Pedidos de última hora e sinais não pagos',
    ],
    solucoes: [
      { servico: 'site-formulario-orcamento', porque: 'Formulário com data, número de pessoas, sabores e referência de decoração.' },
      { servico: 'catalogo-whatsapp', porque: 'Catálogo de bolos e doces de pronta-entrega ou encomenda com pedido pelo WhatsApp.' },
      { servico: 'sis-pedidos', porque: 'Agenda de encomendas por data com limite de produção e controle de sinal.' },
    ],
    argumentos: [
      'O orçamento chega com data, número de convidados e referência: você responde o valor em minutos.',
      'Calendário de produção avisa quando a data está lotada antes de você prometer.',
      'Catálogo com sabores e tamanhos responde as perguntas mais repetidas.',
    ],
    perguntas: [
      'Quantas encomendas vocês conseguem produzir por fim de semana?',
      'Quantas mensagens leva para fechar um bolo personalizado?',
      'Como controlam sinal e data de retirada?',
    ],
    objecoes: [
      {
        id: 'cada-bolo-unico',
        frase: 'Cada bolo é único, não dá para colocar em site.',
        porTras: 'Trabalho artesanal e personalizado.',
        resposta:
          'Verdade, e é isso que torna seu trabalho especial. O site não fixa o bolo — ele coleta as informações para você orçar: data, pessoas, sabores e uma foto de referência. Quantas mensagens você troca antes de passar o valor?',
        pergunta: 'Que informações você sempre precisa perguntar antes de orçar?',
        proximoPasso: 'Proponha formulário de orçamento com envio de foto de referência.',
      },
      {
        id: 'producao-limitada',
        frase: 'Não dou conta de mais pedidos.',
        porTras: 'Capacidade de produção no limite.',
        resposta:
          'Então o objetivo não é mais pedido, é menos tempo no WhatsApp e encomendas organizadas. E dá para priorizar os pedidos de maior valor. Você recusa encomendas hoje?',
        pergunta: 'Quantas encomendas você recusou no último mês por falta de agenda?',
        proximoPasso: 'Proponha calendário de produção com limite por data.',
      },
      {
        id: 'clientes-pedem-no-direct',
        frase: 'Minhas clientes pedem no direct.',
        porTras: 'Canal estabelecido.',
        resposta:
          'E podem continuar. O formulário vira o link que você manda na resposta automática, para a cliente já mandar tudo de uma vez. Vale testar?',
        pergunta: 'Quanto tempo por dia você passa respondendo pedidos de orçamento?',
        proximoPasso: 'Configure o link do formulário na resposta automática do Instagram e WhatsApp.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Seus bolos são lindos. Quando alguém pede orçamento de bolo de festa, quantas mensagens costuma levar até você passar o valor?' },
      { autor: 'cliente', texto: 'Muitas! Data, quantas pessoas, sabor, decoração...' },
      { autor: 'vendedor', texto: 'Um formulário curto com essas perguntas e espaço para foto de referência resolve isso de uma vez. Você responde o valor direto. Quer ver como fica?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um ou dois bolos de festa e com as horas de orçamento por mensagem.',
      necessidade: 'Orçamentos completos e calendário de produção.',
      confianca: 'Mostre como ela fecha datas lotadas e atualiza o catálogo.',
      prazo: 'Antes de Páscoa, Dia das Mães e Natal, quando as encomendas disparam.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Quando chega um pedido de bolo personalizado, quantas mensagens costumam ir e voltar até você passar o valor?',
  },
  {
    id: 'padarias',
    nome: 'Padarias',
    categoria: 'alimentacao',
    resumo:
      'Movimento diário de bairro, alta recorrência, produção própria (pães, bolos, salgados) e encomendas para festas e cafés corporativos. Muitas vendem cestas de café da manhã em datas especiais.',
    comoClientesChegam: ['Clientela do bairro', 'Google Maps', 'Encomendas para festas e empresas', 'Instagram'],
    dores: ['Encomendas de salgados e tortas por telefone', 'Cestas de café da manhã vendidas manualmente', 'Horários de fornada que ninguém sabe'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Encomendas de salgados, tortas e cestas com pedido organizado.' },
      { servico: 'loja-checkout', porque: 'Venda de cestas de café da manhã com pagamento e agendamento de entrega.' },
      { servico: 'site-negocio-local', porque: 'Horários, fornadas, encomendas e localização.' },
    ],
    argumentos: [
      'Encomenda de cento de salgado com data e horário de retirada chega completa.',
      'Cesta de café da manhã vendida online com entrega agendada é presente que vende sozinho.',
      'Empresas encontram e pedem cafés corporativos com facilidade.',
    ],
    perguntas: ['Quantas encomendas de festa por semana?', 'Vocês vendem cestas de café da manhã?', 'Atendem empresas?'],
    objecoes: [
      {
        id: 'cliente-e-do-bairro',
        frase: 'Meu cliente é do bairro, vem a pé.',
        porTras: 'Negócio local consolidado.',
        resposta:
          'E esse é o seu maior patrimônio. O catálogo é para encomendas: festa, cesta, café de empresa — que geralmente são pedidos maiores. Quantas encomendas vocês fazem por mês?',
        pergunta: 'Quanto representam as encomendas no faturamento?',
        proximoPasso: 'Proponha catálogo focado em encomendas.',
      },
      {
        id: 'encomenda-por-telefone',
        frase: 'Encomenda eu pego por telefone.',
        porTras: 'Processo conhecido.',
        resposta:
          'Funciona, mas toma tempo do balcão e às vezes a anotação se perde. Com o pedido escrito e data de retirada, a produção se organiza melhor. Já aconteceu de esquecer uma encomenda?',
        pergunta: 'Como a produção fica sabendo das encomendas do dia?',
        proximoPasso: 'Proponha painel de encomendas por data.',
      },
      {
        id: 'cesta-so-em-data',
        frase: 'Cesta é só no Dia das Mães.',
        porTras: 'Sazonalidade.',
        resposta:
          'Dá para vender o ano todo: aniversários, Dia dos Namorados, empresas. Com a página pronta, você só ativa nas datas. Quantas cestas vendeu no último Dia das Mães?',
        pergunta: 'Quantos pedidos de cesta vocês recusaram por falta de organização?',
        proximoPasso: 'Proponha página de cestas ativável por data.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Vocês fazem encomenda de salgados para festa? Como os clientes costumam pedir?' },
      { autor: 'cliente', texto: 'Por telefone ou no balcão.' },
      { autor: 'vendedor', texto: 'Um catálogo de encomendas com data e horário de retirada deixa tudo escrito para a produção. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de encomendas maiores (festas, empresas, cestas).',
      necessidade: 'Organizar encomendas e vender cestas.',
      confianca: 'Mostre o painel de encomendas por data.',
      prazo: 'Antes de Dia das Mães, Páscoa e Natal.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Como os clientes fazem encomenda de salgados e tortas aí hoje: telefone, balcão ou WhatsApp?',
  },
  {
    id: 'docerias',
    nome: 'Docerias',
    categoria: 'alimentacao',
    resumo:
      'Doces finos, brigadeiros gourmet, caixas presenteáveis e encomendas para festas e casamentos. Ticket varia de pronta-entrega a grandes encomendas. Datas comemorativas concentram vendas (Páscoa, Dia das Mães, Natal).',
    comoClientesChegam: ['Instagram', 'Indicação em festas', 'Cerimonialistas', 'Datas comemorativas'],
    dores: ['Orçamentos por quantidade e sabores', 'Pedidos concentrados em datas', 'Caixas presenteáveis vendidas por mensagem'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Caixas e kits com pedido direto.' },
      { servico: 'site-formulario-orcamento', porque: 'Orçamento de festa com data, quantidade e sabores.' },
      { servico: 'loja-checkout', porque: 'Pagamento antecipado de presentes em datas comemorativas.' },
    ],
    argumentos: [
      'Caixa presenteável com pagamento online vende sozinha na véspera da data.',
      'Orçamento de festa chega com quantidade e sabores definidos.',
      'Calendário de produção evita prometer mais do que dá para fazer.',
    ],
    perguntas: ['Quanto vendem na Páscoa e no Natal?', 'Fazem doces para casamentos?', 'Como recebem pagamento das encomendas?'],
    objecoes: [
      {
        id: 'producao-artesanal',
        frase: 'Minha produção é artesanal, não dá para vender online.',
        porTras: 'Medo de não dar conta.',
        resposta:
          'Dá para limitar a quantidade por data no próprio catálogo: quando esgota, fecha. Você mantém o controle da produção. Quantas caixas você consegue fazer num fim de semana?',
        pergunta: 'Qual é sua capacidade máxima por dia?',
        proximoPasso: 'Configure limite de pedidos por data.',
      },
      {
        id: 'so-encomenda',
        frase: 'Trabalho só com encomenda.',
        porTras: 'Modelo sob demanda.',
        resposta:
          'Perfeito, então o catálogo vira um cardápio de encomendas, com prazo mínimo de antecedência. A cliente escolhe e você confirma. Qual antecedência você precisa?',
        pergunta: 'Com quantos dias de antecedência você precisa receber o pedido?',
        proximoPasso: 'Proponha catálogo de encomendas com antecedência mínima.',
      },
      {
        id: 'pix-funciona',
        frase: 'O Pix já resolve o pagamento.',
        porTras: 'Pagamento manual funciona.',
        resposta:
          'Resolve, e pode continuar sendo a forma principal. O que muda é a conferência: no pedido online o pagamento é confirmado automaticamente. Em datas de pico, conferir dezenas de comprovantes dá trabalho, né?',
        pergunta: 'Quanto tempo você gasta conferindo comprovantes em datas de pico?',
        proximoPasso: 'Mostre o Pix com confirmação automática.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Na Páscoa e no Dia das Mães, como vocês organizam os pedidos de caixas?' },
      { autor: 'cliente', texto: 'WhatsApp e Pix, fica uma loucura.' },
      { autor: 'vendedor', texto: 'Um catálogo com limite por data e pagamento confirmado automaticamente deixaria tudo mais tranquilo. Quer ver antes da próxima data?' },
    ],
    angulos: {
      preco: 'Compare com o faturamento de uma data comemorativa.',
      necessidade: 'Organizar picos de encomendas e pagamentos.',
      confianca: 'Limite de produção configurável e pagamento automático.',
      prazo: 'Pronto pelo menos 3 semanas antes da data comemorativa.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Em datas como Páscoa e Dia das Mães, como vocês organizam os pedidos e os pagamentos?',
  },
  {
    id: 'buffets',
    nome: 'Empresas de buffet',
    categoria: 'alimentacao',
    resumo:
      'Eventos sociais e corporativos com orçamento por pessoa, cardápios, serviços inclusos (garçons, louça, decoração) e reserva de data com antecedência. Ticket alto, ciclo de venda longo, degustação como etapa de fechamento.',
    comoClientesChegam: ['Indicação', 'Busca por "buffet para casamento/aniversário" + cidade', 'Feiras de noivas', 'Cerimonialistas'],
    dores: [
      'Orçamentos longos e personalizados',
      'Datas disputadas e reservas sem contrato',
      'Apresentar cardápios e estrutura sem visita',
    ],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Páginas por tipo de evento com cardápios e o que está incluso.' },
      { servico: 'site-formulario-orcamento', porque: 'Orçamento com data, número de convidados, tipo de evento e local.' },
      { servico: 'sis-orcamentos', porque: 'Orçamento padronizado por pessoa com opcionais e PDF.' },
    ],
    argumentos: [
      'Orçamento por pessoa calculado na hora reduz dias de espera do cliente.',
      'Data e número de convidados no formulário dizem se você pode atender antes de qualquer conversa.',
      'Páginas por tipo de evento ajudam a noiva e a empresa a se imaginarem no evento.',
    ],
    perguntas: ['Quanto tempo leva para enviar um orçamento?', 'Quantos orçamentos fecham?', 'Vocês fazem degustação?'],
    objecoes: [
      {
        id: 'orcamento-personalizado',
        frase: 'Cada evento é personalizado.',
        porTras: 'Medo de padronizar demais.',
        resposta:
          'Sim, e o sistema respeita isso: parte padronizada (preço por pessoa, itens fixos) e opcionais. Você ajusta o que for especial. Quanto tempo leva hoje para montar um orçamento?',
        pergunta: 'Quanto tempo você gasta montando cada orçamento?',
        proximoPasso: 'Proponha sistema de orçamento com base + opcionais.',
      },
      {
        id: 'indicacao-de-cerimonialista',
        frase: 'Vivo de indicação de cerimonialistas.',
        porTras: 'Canal B2B forte.',
        resposta:
          'Ótimo canal! O site profissional facilita para o cerimonialista te indicar: ele manda o link com cardápios e estrutura. Hoje ele manda o quê?',
        pergunta: 'O que o cerimonialista envia para a noiva quando te indica?',
        proximoPasso: 'Proponha página de apresentação compartilhável para parceiros.',
      },
      {
        id: 'cliente-quer-visitar',
        frase: 'O cliente quer visitar e provar antes.',
        porTras: 'Degustação decide.',
        resposta:
          'E deve. O site leva o cliente certo até a degustação, já sabendo o que é oferecido. Quantas degustações vocês fazem por mês e quantas fecham?',
        pergunta: 'Quantas degustações viram contrato?',
        proximoPasso: 'Inclua agendamento de degustação no site.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quanto tempo vocês levam para mandar um orçamento depois que o cliente pede?' },
      { autor: 'cliente', texto: 'Uns dois ou três dias, é tudo manual.' },
      { autor: 'vendedor', texto: 'Com um orçamento padronizado por pessoa e opcionais, dá para enviar no mesmo dia, ainda com o seu toque pessoal. Posso mostrar?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um único evento fechado a mais.',
      necessidade: 'Agilidade no orçamento e apresentação profissional.',
      confianca: 'Mostre o orçamento em PDF com a marca e a reserva de data.',
      prazo: 'Antes da temporada de casamentos e festas de fim de ano.',
    },
    cuidados: [CUIDADO_ALIMENTOS, 'Fotos de eventos com convidados só com autorização.'],
    aberturaProspeccao: 'Quanto tempo vocês levam hoje para enviar um orçamento de evento depois do pedido?',
  },
  {
    id: 'food-trucks',
    nome: 'Food trucks',
    categoria: 'alimentacao',
    resumo:
      'Operação móvel: muda de ponto, participa de feiras e eventos e faz eventos privados (festas, empresas, casamentos). O cliente precisa saber onde o truck está hoje. Eventos privados têm ticket alto e são a parte mais lucrativa para muitos.',
    comoClientesChegam: ['Instagram com a agenda da semana', 'Feiras e eventos', 'Indicação para eventos privados'],
    dores: ['Comunicar onde o truck estará', 'Orçamentos de eventos privados', 'Cardápio enxuto que muda por evento'],
    solucoes: [
      { servico: 'lp-servicos', porque: 'Página com a agenda de pontos e eventos e o cardápio.' },
      { servico: 'site-formulario-orcamento', porque: 'Orçamento de evento privado com data, local e número de pessoas.' },
      { servico: 'catalogo-whatsapp', porque: 'Pedido antecipado para retirada no ponto do dia.' },
    ],
    argumentos: [
      'Uma página fixa com a agenda da semana responde "onde vocês estão hoje?".',
      'Evento privado bem apresentado é o pedido mais lucrativo do mês.',
      'Pedido antecipado reduz fila em eventos cheios.',
    ],
    perguntas: ['Quanto do faturamento vem de eventos privados?', 'Como divulgam a agenda de pontos?', 'Fazem casamentos e festas de empresa?'],
    objecoes: [
      {
        id: 'stories-avisam',
        frase: 'Aviso nos stories onde estou.',
        porTras: 'Canal funciona para seguidores.',
        resposta:
          'Funciona para quem te segue e viu o story nas últimas 24h. A página com a agenda fica fixa e dá para mandar o link para qualquer pessoa. Quantos pedidos de evento privado você recebe por mês?',
        pergunta: 'Quantos eventos privados você fez no último trimestre?',
        proximoPasso: 'Proponha página com agenda e formulário de eventos.',
      },
      {
        id: 'sem-ponto-fixo',
        frase: 'Não tenho endereço fixo, site não faz sentido.',
        porTras: 'Associa site a negócio fixo.',
        resposta:
          'Por isso mesmo: o site vira o seu "endereço fixo" na internet, com agenda e contato para eventos. Como alguém que provou seu lanche numa feira te encontra depois?',
        pergunta: 'Como um cliente de feira te contrata para um evento depois?',
        proximoPasso: 'Destaque eventos privados na proposta.',
      },
      {
        id: 'evento-por-indicacao',
        frase: 'Evento privado vem por indicação.',
        porTras: 'Já recebe pedidos.',
        resposta:
          'Que ótimo. Com uma página de eventos com fotos, cardápio e formulário, quem foi indicado já chega sabendo como funciona. Você perde muito tempo explicando a estrutura?',
        pergunta: 'Que informações você sempre precisa passar para um evento?',
        proximoPasso: 'Proponha página de eventos com orçamento.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vocês fazem eventos privados, tipo festas e empresas?' },
      { autor: 'cliente', texto: 'Fazemos, é o que mais dá dinheiro.' },
      { autor: 'vendedor', texto: 'Uma página com fotos, cardápio e formulário de evento ajuda a fechar mais rápido. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um evento privado.',
      necessidade: 'Agenda de pontos e captação de eventos privados.',
      confianca: 'Fotos de eventos reais e processo de orçamento claro.',
      prazo: 'Antes da temporada de festas e eventos ao ar livre.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Quanto do seu faturamento vem de eventos privados e como as pessoas te contratam para eles?',
  },
  {
    id: 'marmitarias',
    nome: 'Marmitarias',
    categoria: 'alimentacao',
    resumo:
      'Almoço do dia com cardápio rotativo, entrega para trabalhadores e empresas, marmitas congeladas e planos semanais/mensais. Pedido concentrado entre 10h e 12h. Margem depende de volume e previsibilidade.',
    comoClientesChegam: ['WhatsApp com cardápio do dia', 'Empresas da região', 'Indicação', 'Aplicativos'],
    dores: ['Enviar o cardápio do dia para lista de transmissão', 'Pedidos concentrados num curto período', 'Controle de planos e pagamentos mensais'],
    solucoes: [
      { servico: 'catalogo-whatsapp', porque: 'Cardápio do dia em link fixo, pedido organizado para o WhatsApp.' },
      { servico: 'sis-assinaturas', porque: 'Planos semanais e mensais com cobrança recorrente.' },
      { servico: 'sis-pedidos', porque: 'Consolidação de pedidos por empresa e rota de entrega.' },
    ],
    argumentos: [
      'Link fixo do cardápio do dia: você atualiza uma vez e todo mundo vê.',
      'Planos mensais dão previsibilidade de produção e caixa.',
      'Pedidos de empresa consolidados facilitam a entrega.',
    ],
    perguntas: ['Quantas marmitas por dia?', 'Como enviam o cardápio do dia?', 'Têm clientes de plano mensal?'],
    objecoes: [
      {
        id: 'lista-transmissao',
        frase: 'Mando o cardápio por lista de transmissão.',
        porTras: 'Ferramenta gratuita e conhecida.',
        resposta:
          'Funciona! O pedido é que chega bagunçado depois, né? Com o link, a pessoa escolhe e o pedido chega organizado, com endereço. Quantos pedidos entre 10h e 12h?',
        pergunta: 'Quantos pedidos vocês recebem na janela da manhã?',
        proximoPasso: 'Mantenha a lista de transmissão, mas com link de pedido.',
      },
      {
        id: 'cardapio-todo-dia',
        frase: 'Meu cardápio muda todo dia.',
        porTras: 'Medo de trabalho diário.',
        resposta:
          'Dá para cadastrar os pratos uma vez e só marcar os do dia, em um minuto pelo celular. Quem monta o cardápio hoje?',
        pergunta: 'Quanto tempo você leva para montar a arte do cardápio do dia?',
        proximoPasso: 'Demonstre a ativação dos pratos do dia.',
      },
      {
        id: 'empresa-paga-fim-mes',
        frase: 'Empresa paga no fim do mês, é bagunçado.',
        porTras: 'Controle financeiro manual.',
        resposta:
          'Um controle por empresa, com o total do mês somado automaticamente, resolve isso. Quantas empresas vocês atendem?',
        pergunta: 'Quanto tempo leva para fechar a conta de cada empresa?',
        proximoPasso: 'Proponha controle de pedidos por empresa com fechamento mensal.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Vocês mandam o cardápio do dia por lista de transmissão?' },
      { autor: 'cliente', texto: 'Sim, e aí chove pedido.' },
      { autor: 'vendedor', texto: 'Com um link de pedido, cada cliente monta e envia certinho, com endereço. Organiza a janela das 10h às 12h. Quer ver?' },
    ],
    angulos: {
      preco: 'Volume diário: poucos pedidos a mais ou erros a menos pagam o investimento.',
      necessidade: 'Organizar a janela de pedidos e planos mensais.',
      confianca: 'Mostre a ativação diária do cardápio em um minuto.',
      prazo: 'Antes de iniciar atendimento a empresas ou planos.',
    },
    cuidados: [CUIDADO_ALIMENTOS],
    aberturaProspeccao: 'Como vocês enviam o cardápio do dia e recebem os pedidos hoje?',
  },
];
