import type { Niche } from '../../types';

export const CONSTRUCAO: Niche[] = [
  {
    id: 'vidracarias',
    nome: 'Vidraçarias',
    categoria: 'construcao',
    resumo:
      'Box de banheiro, espelhos, janelas, fachadas e guarda-corpos sob medida. Todo serviço depende de medição e orçamento; a visita técnica é etapa obrigatória. Clientes são donos de imóveis, construtoras e arquitetos. Concorrência por preço é forte.',
    comoClientesChegam: ['Busca "vidraçaria perto de mim"', 'Indicação de pedreiros, arquitetos e construtoras', 'Instagram com obras'],
    dores: [
      'Pedidos de "quanto custa um box?" sem medidas',
      'Visitas técnicas que não viram venda',
      'Orçamentos manuais demorados',
    ],
    solucoes: [
      { servico: 'site-formulario-orcamento', porque: 'Formulário com tipo de serviço, medidas aproximadas e fotos do local.' },
      { servico: 'sis-orcamentos', porque: 'Cálculo de orçamento por m², tipo de vidro e ferragens, com PDF.' },
      { servico: 'site-paginas-servicos', porque: 'Uma página por produto (box, espelho, fachada) com fotos de obras.' },
    ],
    argumentos: [
      'Pedido de orçamento com foto e medida aproximada evita visita técnica para curioso.',
      'Orçamento calculado por regra (m², vidro, ferragem) sai em minutos e sem erro.',
      'Galeria de obras por tipo de produto convence arquitetos e clientes finais.',
    ],
    perguntas: [
      'Quantos orçamentos vocês fazem por semana e quantos fecham?',
      'Quantas visitas técnicas não viram venda?',
      'Como calculam o orçamento hoje?',
    ],
    objecoes: [
      {
        id: 'precisa-medir',
        frase: 'Sem medir no local não dá para orçar.',
        porTras: 'Medição é parte técnica do serviço.',
        resposta:
          'Concordo, a medida final é no local. O formulário serve para uma estimativa antes da visita: a pessoa manda foto e medida aproximada, você dá uma faixa e só vai medir quem já está de acordo com o valor. Quantas visitas por semana não viram venda?',
        pergunta: 'Quanto custa para você cada visita técnica (tempo e deslocamento)?',
        proximoPasso: 'Proponha formulário com foto para orçamento estimado antes da visita.',
      },
      {
        id: 'concorrencia-preco',
        frase: 'Cliente só olha preço.',
        porTras: 'Mercado competitivo.',
        resposta:
          'Muitos, sim. Um site com obras, tipos de vidro e garantia ajuda a mostrar por que o seu preço é justo. E o orçamento rápido ganha de quem demora três dias. Quanto tempo vocês levam para responder?',
        pergunta: 'Quanto tempo leva hoje entre o pedido e o envio do orçamento?',
        proximoPasso: 'Mostre sistema de orçamento com PDF profissional.',
      },
      {
        id: 'arquiteto-indica',
        frase: 'Trabalho mais com arquitetos e construtoras.',
        porTras: 'Canal B2B.',
        resposta:
          'Ótimo. Para eles, portfólio de obras e orçamento rápido e padronizado fazem diferença. Eles pedem orçamento formal hoje?',
        pergunta: 'Como os arquitetos solicitam orçamento a vocês?',
        proximoPasso: 'Proponha portfólio por tipo de obra e orçamento em PDF.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Vocês recebem muito "quanto custa um box?" sem medida nenhuma?' },
      { autor: 'cliente', texto: 'Direto. E aí tem que ir lá medir.' },
      { autor: 'vendedor', texto: 'Um formulário com foto e medida aproximada permite passar uma faixa de valor antes da visita. Só vai medir quem já está de acordo. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o custo de visitas técnicas que não fecham e com o valor de um único projeto de fachada.',
      necessidade: 'Orçamentos rápidos e qualificação antes da visita.',
      confianca: 'Portfólio de obras, garantia e PDF profissional.',
      prazo: 'Antes de períodos de alta da construção civil na região.',
    },
    cuidados: ['Não prometa prazos de instalação sem considerar a fabricação do vidro temperado.'],
    aberturaProspeccao: 'De cada dez pedidos de orçamento que chegam aí, quantos vêm sem medida e exigem visita técnica?',
  },
  {
    id: 'serralherias',
    nome: 'Serralherias',
    categoria: 'construcao',
    resumo:
      'Portões, grades, estruturas metálicas, coberturas, escadas e corrimãos sob medida. Orçamento depende de projeto, material e medidas. Serviço com prazo de fabricação e instalação; clientes residenciais e comerciais.',
    comoClientesChegam: ['Indicação', 'Busca local', 'Obras na vizinhança', 'Instagram com trabalhos'],
    dores: ['Orçamentos complexos e demorados', 'Clientes que não sabem o que querem', 'Comunicar prazos de fabricação'],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Galeria por tipo de serviço (portões, coberturas, escadas) para o cliente escolher o modelo.' },
      { servico: 'site-formulario-orcamento', porque: 'Pedido com tipo, medidas, fotos e referência de modelo.' },
      { servico: 'sis-orcamentos', porque: 'Orçamento com materiais, peso, mão de obra e PDF.' },
    ],
    argumentos: [
      'Galeria de modelos ajuda o cliente a decidir antes da visita.',
      'Orçamento padronizado evita esquecer material e perder margem.',
      'Mostrar etapas e prazo de fabricação reduz cobrança de cliente ansioso.',
    ],
    perguntas: ['Quais serviços mais vendem?', 'Como calculam o orçamento?', 'Quanto tempo leva entre pedido e instalação?'],
    objecoes: [
      {
        id: 'cada-servico-diferente',
        frase: 'Cada serviço é diferente.',
        porTras: 'Trabalho sob medida.',
        resposta:
          'Sim, e por isso a galeria de modelos ajuda: o cliente aponta "quero algo parecido com esse" e você já sabe o caminho. O orçamento continua personalizado. Quantas vezes você desenha a mesma coisa para explicar?',
        pergunta: 'Quanto tempo você gasta explicando opções de modelo?',
        proximoPasso: 'Proponha galeria por categoria com formulário de orçamento.',
      },
      {
        id: 'nao-tenho-fotos',
        frase: 'Não tenho fotos dos trabalhos.',
        porTras: 'Portfólio não organizado.',
        resposta:
          'A partir de agora dá para fotografar cada instalação com o celular. Posso te passar um roteiro simples de fotos. Enquanto isso, começamos com as que você tiver.',
        pergunta: 'Você tem clientes que autorizariam fotos dos trabalhos?',
        proximoPasso: 'Inclua orientação de fotos e comece com material existente.',
      },
      {
        id: 'cliente-e-da-regiao',
        frase: 'Só atendo minha região.',
        porTras: 'Negócio local.',
        resposta:
          'Perfeito, o site vai mostrar exatamente a área de atendimento, para chegar só pedido que você pode atender. Quais bairros e cidades você cobre?',
        pergunta: 'Qual a área máxima que compensa atender?',
        proximoPasso: 'Configure área de atendimento no site e no Perfil da Empresa.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quando um cliente pede um portão, ele já sabe o modelo ou você precisa mostrar opções?' },
      { autor: 'cliente', texto: 'Quase nunca sabe, mando foto no WhatsApp.' },
      { autor: 'vendedor', texto: 'Uma galeria de modelos no site resolve isso: ele escolhe e pede orçamento com as medidas. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um portão ou cobertura e com margem perdida em orçamentos errados.',
      necessidade: 'Ajudar o cliente a escolher e padronizar orçamentos.',
      confianca: 'Galeria de trabalhos reais e etapas claras de fabricação.',
      prazo: 'Antes de períodos de seca/chuva conforme o serviço (coberturas antes das chuvas).',
    },
    cuidados: ['Estruturas que exigem cálculo estrutural devem ter responsável técnico; não prometa sem avaliação.'],
    aberturaProspeccao: 'Quando um cliente pede um portão ou cobertura, ele já chega sabendo o modelo ou você precisa mostrar opções?',
  },
  {
    id: 'energia-solar',
    nome: 'Empresas de energia solar',
    categoria: 'construcao',
    resumo:
      'Venda consultiva de ticket alto, baseada em simulação de economia a partir da conta de luz. Financiamento é comum. Ciclo de decisão de semanas, comparação de várias propostas, e regras de compensação (Lei 14.300/2022) que mudam o cálculo.',
    comoClientesChegam: ['Anúncios', 'Indicação', 'Representantes e parceiros', 'Busca por "energia solar" + cidade'],
    dores: [
      'Leads que pedem simulação e somem',
      'Propostas montadas manualmente a partir da conta de luz',
      'Acompanhamento de vendas longas com vários representantes',
    ],
    solucoes: [
      { servico: 'lp-captacao', porque: 'Página que coleta consumo médio e conta de luz para simulação.' },
      { servico: 'sis-crm', porque: 'Funil de vendas com etapas (simulação, visita, proposta, financiamento, instalação).' },
      { servico: 'sis-orcamentos', porque: 'Proposta com dimensionamento, equipamentos e estimativas em PDF.' },
    ],
    argumentos: [
      'Lead que já enviou a conta de luz é um lead mais qualificado.',
      'CRM mostra em que etapa as vendas travam (financiamento? visita?).',
      'Proposta padronizada com premissas claras transmite seriedade.',
    ],
    perguntas: [
      'Quantos leads por mês e quantos viram proposta?',
      'Quanto tempo leva para montar uma proposta?',
      'Como os representantes registram os contatos?',
    ],
    objecoes: [
      {
        id: 'ja-uso-plataforma-simulacao',
        frase: 'O distribuidor já dá um sistema de proposta.',
        porTras: 'Ferramenta do fornecedor.',
        resposta:
          'Ótimo, então a proposta técnica está resolvida. O que costuma faltar é o funil: saber quem recebeu, quem sumiu e quem está no financiamento. Como vocês acompanham isso hoje?',
        pergunta: 'Quantas propostas enviadas no último mês vocês acompanharam até o fim?',
        proximoPasso: 'Proponha CRM integrado ao processo atual.',
      },
      {
        id: 'mercado-saturado',
        frase: 'O mercado está saturado, todo mundo vende solar.',
        porTras: 'Concorrência intensa.',
        resposta:
          'Exatamente por isso, quem responde mais rápido e acompanha melhor ganha. Uma página que qualifica e um CRM que não deixa lead esquecido são vantagens reais. Quantos leads ficam sem retorno?',
        pergunta: 'Qual o tempo médio de resposta a um lead novo?',
        proximoPasso: 'Proponha landing de qualificação + CRM.',
      },
      {
        id: 'promessa-economia',
        frase: 'Quero colocar no site que o cliente economiza 95%.',
        porTras: 'Argumento comercial agressivo.',
        resposta:
          'Entendo o apelo, mas economia depende de consumo, tarifa, irradiação e regras de compensação. O mais seguro é mostrar simulação como estimativa, com as premissas. Isso evita reclamação e passa mais credibilidade.',
        pergunta: 'Que premissas vocês usam nas simulações?',
        proximoPasso: 'Defina textos de economia como estimativas com premissas explícitas.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Dos leads que pedem simulação, quantos viram proposta enviada?' },
      { autor: 'cliente', texto: 'Uns 30%. O resto some.' },
      { autor: 'vendedor', texto: 'Uma página que já pede a conta de luz qualifica melhor, e um funil de vendas mostra onde cada um parou. Posso te mostrar como ficaria?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um único projeto instalado — o ticket alto justifica o investimento.',
      necessidade: 'Qualificação de leads e acompanhamento de vendas longas.',
      confianca: 'Propostas com premissas claras e sem promessas de economia garantida.',
      prazo: 'Antes de períodos de reajuste tarifário ou de campanhas de financiamento.',
    },
    cuidados: [
      'Apresente economia sempre como estimativa, com premissas (consumo, tarifa, irradiação, regras de compensação da Lei 14.300/2022).',
    ],
    aberturaProspeccao: 'Dos leads que pedem simulação para vocês, quantos chegam a receber proposta?',
  },
  {
    id: 'climatizacao',
    nome: 'Empresas de climatização',
    categoria: 'construcao',
    resumo:
      'Instalação, manutenção e higienização de ar-condicionado, residencial e comercial. Demanda sazonal (verão) e contratos recorrentes de manutenção com empresas, inclusive PMOC (Lei 13.589/2018) para ambientes climatizados de uso coletivo.',
    comoClientesChegam: ['Busca "instalação de ar-condicionado" + cidade', 'Lojas de eletro parceiras', 'Indicação', 'Contratos com empresas'],
    dores: [
      'Pico de pedidos no verão e ociosidade no inverno',
      'Controle de manutenções periódicas e PMOC de clientes empresariais',
      'Orçamentos de instalação dependentes de distância e infraestrutura',
    ],
    solucoes: [
      { servico: 'site-formulario-orcamento', porque: 'Orçamento com BTUs, tipo de instalação, distância entre condensadora e evaporadora e fotos.' },
      { servico: 'sis-clientes', porque: 'Agenda de manutenções periódicas por cliente e equipamento, com lembretes.' },
      { servico: 'sis-gestao', porque: 'Gestão de contratos PMOC, ordens de serviço e histórico por equipamento.' },
    ],
    argumentos: [
      'Lembrete de higienização traz o cliente de volta no inverno, quando a agenda está vazia.',
      'Contratos PMOC organizados num sistema dão previsibilidade e profissionalismo diante de empresas.',
      'Orçamento com fotos evita surpresa na instalação.',
    ],
    perguntas: [
      'Quanto o faturamento cai fora do verão?',
      'Vocês têm contratos de manutenção com empresas?',
      'Como controlam as manutenções e o PMOC?',
    ],
    objecoes: [
      {
        id: 'verao-lota',
        frase: 'No verão já não dou conta.',
        porTras: 'Excesso de demanda sazonal.',
        resposta:
          'E no inverno? A ideia é equilibrar: lembretes de higienização e contratos de manutenção trazem serviço para os meses fracos. Como fica a agenda em junho e julho?',
        pergunta: 'Quanto a agenda cai nos meses frios?',
        proximoPasso: 'Proponha sistema de manutenção recorrente com lembretes.',
      },
      {
        id: 'pmoc-planilha',
        frase: 'Controlo o PMOC em planilha.',
        porTras: 'Processo existente.',
        resposta:
          'Funciona com poucos clientes. Com mais contratos, fica difícil saber qual equipamento está vencido e gerar relatórios. Quantos contratos vocês têm?',
        pergunta: 'Quanto tempo leva para gerar os relatórios de cada cliente?',
        proximoPasso: 'Proponha piloto de gestão de manutenção por equipamento.',
      },
      {
        id: 'loja-me-indica',
        frase: 'A loja de eletro me indica.',
        porTras: 'Canal parceiro.',
        resposta:
          'Ótimo canal. Um site com orçamento rápido ajuda a converter essas indicações e a ter clientes próprios. Quanto depende da loja hoje?',
        pergunta: 'Se a loja parasse de indicar, quanto do faturamento perderia?',
        proximoPasso: 'Proponha site local com orçamento.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Como fica a agenda de vocês nos meses de inverno?' },
      { autor: 'cliente', texto: 'Cai bastante.' },
      { autor: 'vendedor', texto: 'Lembretes de higienização para clientes antigos e contratos de manutenção ajudam a equilibrar. Querem ver como organizar isso num sistema simples?' },
    ],
    angulos: {
      preco: 'Compare com o faturamento dos meses fracos que pode ser recuperado com recorrência.',
      necessidade: 'Equilibrar sazonalidade e organizar manutenções/PMOC.',
      confianca: 'Histórico por equipamento e relatórios para empresas.',
      prazo: 'Antes do verão para orçamentos; antes do inverno para campanhas de manutenção.',
    },
    cuidados: ['PMOC exige responsável técnico habilitado; o sistema organiza, mas não substitui a responsabilidade técnica.'],
    aberturaProspeccao: 'Como fica a agenda de vocês nos meses de inverno, quando cai a procura por instalação?',
  },
  {
    id: 'eletricistas',
    nome: 'Eletricistas',
    categoria: 'construcao',
    resumo:
      'Profissional autônomo ou pequena empresa: reparos, instalações, quadros de distribuição, padrão de entrada, projetos. Urgências são comuns. Confiança e segurança pesam muito: o cliente deixa um desconhecido entrar em casa.',
    comoClientesChegam: ['Indicação', 'Busca por "eletricista" + bairro', 'Grupos de bairro', 'Lojas de material elétrico'],
    dores: ['Pedidos urgentes sem informação', 'Clientes que comparam só preço', 'Transmitir confiança e qualificação'],
    solucoes: [
      { servico: 'lp-autonomo', porque: 'Página com serviços, área de atendimento, qualificações e contato rápido.' },
      { servico: 'site-negocio-local', porque: 'Presença local para buscas de urgência.' },
      { servico: 'site-formulario-orcamento', porque: 'Pedido com descrição e fotos do problema.' },
    ],
    argumentos: [
      'Página com qualificações e avaliações ajuda o cliente a confiar antes de abrir a porta.',
      'Fotos do problema permitem levar o material certo na primeira visita.',
      'Área de atendimento clara evita chamados longe demais.',
    ],
    perguntas: ['Quais serviços você mais faz?', 'Atende urgência?', 'Tem qualificações técnicas para mostrar?'],
    objecoes: [
      {
        id: 'indicacao-basta',
        frase: 'Vivo de indicação.',
        porTras: 'Canal suficiente.',
        resposta:
          'Isso mostra que seu trabalho é bom. Quando alguém te indica, a pessoa indicada costuma querer ver algo antes de chamar. Uma página com seus serviços e avaliações ajuda a fechar essa indicação.',
        pergunta: 'O que o cliente indicado recebe hoje: só o seu número?',
        proximoPasso: 'Proponha página simples com avaliações e qualificações.',
      },
      {
        id: 'servico-simples',
        frase: 'Meu serviço é simples, não preciso de site.',
        porTras: 'Não vê valor.',
        resposta:
          'O serviço pode ser simples, mas a decisão de deixar alguém entrar em casa não é. Uma página com quem você é, o que faz e onde atende transmite segurança. Quantos chamados novos você recebe por semana?',
        pergunta: 'Você perde chamados para quem tem mais avaliações no Google?',
        proximoPasso: 'Proponha página + Perfil da Empresa no Google bem configurado.',
      },
      {
        id: 'sem-tempo-atualizar',
        frase: 'Não tenho tempo de atualizar site.',
        porTras: 'Rotina em campo.',
        resposta:
          'A página de serviços quase não precisa de atualização. E se quiser adicionar uma foto de trabalho, é pelo celular, em um minuto.',
        pergunta: 'Com que frequência seus serviços ou preços mudam?',
        proximoPasso: 'Ofereça página estática de baixa manutenção.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quando alguém te indica, o que a pessoa indicada recebe para te conhecer?' },
      { autor: 'cliente', texto: 'Só meu número mesmo.' },
      { autor: 'vendedor', texto: 'Uma página com seus serviços, onde atende e avaliações ajuda quem foi indicado a confiar e chamar. Quer ver um exemplo?' },
    ],
    angulos: {
      preco: 'Compare com o valor de dois ou três chamados.',
      necessidade: 'Confiança e qualificação de chamados.',
      confianca: 'Qualificações, avaliações reais e área de atendimento.',
      prazo: 'Imediato: urgências acontecem o ano todo.',
    },
    cuidados: ['Mencione qualificações reais (cursos, registros) e não prometa serviços que exijam habilitação que o profissional não tem.'],
    aberturaProspeccao: 'Quando alguém te indica para um vizinho, o que essa pessoa recebe para te conhecer antes de chamar?',
  },
  {
    id: 'encanadores',
    nome: 'Encanadores',
    categoria: 'construcao',
    resumo:
      'Vazamentos, desentupimentos, instalações hidráulicas, caça-vazamento. Muitos chamados urgentes, em que o cliente escolhe quem responde primeiro. Confiança e preço justo são decisivos.',
    comoClientesChegam: ['Busca urgente no Google', 'Indicação', 'Imobiliárias e condomínios', 'Grupos de bairro'],
    dores: ['Urgências fora do horário', 'Orçamento sem ver o problema', 'Concorrência de quem responde mais rápido'],
    solucoes: [
      { servico: 'site-negocio-local', porque: 'Botão de ligação/WhatsApp, área de atendimento e serviços para buscas urgentes.' },
      { servico: 'site-formulario-orcamento', porque: 'Pedido com fotos e vídeo curto do problema.' },
      { servico: 'lp-autonomo', porque: 'Página pessoal com avaliações para quem trabalha sozinho.' },
    ],
    argumentos: [
      'Em urgência, quem aparece primeiro com telefone visível leva o chamado.',
      'Vídeo do vazamento permite estimar o serviço e levar a peça certa.',
      'Página para imobiliárias e condomínios abre clientes recorrentes.',
    ],
    perguntas: ['Atende urgência à noite?', 'Trabalha com imobiliárias ou condomínios?', 'Quais serviços mais faz?'],
    objecoes: [
      {
        id: 'cliente-liga-direto',
        frase: 'Cliente me liga direto.',
        porTras: 'Clientela estabelecida.',
        resposta:
          'Os seus clientes, sim. E quem está com vazamento agora e pesquisa no Google? Hoje você aparece?',
        pergunta: 'Se alguém pesquisar "encanador" no seu bairro, você aparece?',
        proximoPasso: 'Pesquise junto com ele e proponha presença local.',
      },
      {
        id: 'nao-quero-mais-chamado',
        frase: 'Já tenho serviço demais.',
        porTras: 'Agenda cheia.',
        resposta:
          'Então dá para focar nos serviços que dão mais retorno, como contratos com condomínios, e filtrar o que não compensa. Que serviço você gostaria de fazer mais?',
        pergunta: 'Qual serviço é mais rentável para você?',
        proximoPasso: 'Proponha página focada em serviços de maior valor.',
      },
      {
        id: 'site-caro-para-autonomo',
        frase: 'Site é caro para autônomo.',
        porTras: 'Orçamento limitado.',
        resposta:
          'Uma página simples cabe no bolso e dura anos. Compare com o valor de um ou dois chamados. Quer ver a versão básica?',
        pergunta: 'Quanto vale um chamado médio para você?',
        proximoPasso: 'Ofereça página enxuta.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Oi! Quando alguém tem um vazamento à noite e pesquisa no Google, você aparece?' },
      { autor: 'cliente', texto: 'Acho que não, nunca vi.' },
      { autor: 'vendedor', texto: 'Uma página com seus serviços e um botão de ligar, junto com o perfil do Google bem configurado, ajuda você a aparecer nessas horas. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de poucos chamados por mês.',
      necessidade: 'Aparecer na hora da urgência e qualificar chamados.',
      confianca: 'Avaliações reais, área de atendimento e transparência de preço de visita.',
      prazo: 'Imediato; a demanda é constante.',
    },
    cuidados: ['Seja transparente sobre taxa de visita e orçamento antes do serviço.'],
    aberturaProspeccao: 'Se alguém do seu bairro pesquisar "encanador" agora, você aparece no Google?',
  },
  {
    id: 'reformas',
    nome: 'Empresas de reformas',
    categoria: 'construcao',
    resumo:
      'Reformas residenciais e comerciais com orçamentos complexos, várias etapas e equipes. Ciclo de venda longo, cliente inseguro com prazos e custos. A confiança é o fator decisivo, e o pós-venda (acompanhamento da obra) define indicações.',
    comoClientesChegam: ['Indicação', 'Arquitetos', 'Instagram com antes e depois', 'Busca por "reforma de apartamento" + cidade'],
    dores: [
      'Clientes com medo de atraso e estouro de orçamento',
      'Orçamentos longos com muitos itens',
      'Comunicação com o cliente durante a obra',
    ],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Portfólio por tipo de reforma com etapas e prazos médios.' },
      { servico: 'sis-orcamentos', porque: 'Orçamento por etapas e itens com PDF e versões.' },
      { servico: 'sis-membros', porque: 'Área do cliente com cronograma, fotos da obra e documentos.' },
    ],
    argumentos: [
      'Mostrar o processo (etapas, prazos, acompanhamento) responde ao medo número um do cliente.',
      'Área do cliente com fotos e cronograma reduz ligações e gera indicações.',
      'Orçamento por etapas deixa claro o que está incluso.',
    ],
    perguntas: ['Qual o principal medo dos seus clientes?', 'Como você mantém o cliente informado durante a obra?', 'Quanto tempo leva um orçamento?'],
    objecoes: [
      {
        id: 'obra-por-indicacao',
        frase: 'Todas as minhas obras vêm por indicação.',
        porTras: 'Reputação sólida.',
        resposta:
          'Ótimo sinal. A pessoa indicada vai querer ver obras parecidas com a dela e entender como você trabalha. Um portfólio organizado fecha a indicação mais rápido.',
        pergunta: 'O que o cliente indicado pede para ver antes de fechar?',
        proximoPasso: 'Proponha portfólio por tipo de reforma com processo explicado.',
      },
      {
        id: 'cliente-nao-acessa-area',
        frase: 'Cliente não vai entrar em área do cliente.',
        porTras: 'Dúvida sobre uso.',
        resposta:
          'Quem está gastando dinheiro numa reforma quer ver como está a obra. Um link com fotos da semana e o cronograma costuma ser muito usado. Hoje você manda fotos pelo WhatsApp?',
        pergunta: 'Quantas vezes por semana o cliente pergunta como está a obra?',
        proximoPasso: 'Proponha piloto da área do cliente em uma obra.',
      },
      {
        id: 'orcamento-no-excel',
        frase: 'Faço orçamento no Excel.',
        porTras: 'Ferramenta conhecida.',
        resposta:
          'Funciona. O sistema ajuda a padronizar, manter versões e gerar PDF com sua marca. Já aconteceu de esquecer um item no orçamento?',
        pergunta: 'Quanto tempo leva para revisar um orçamento grande?',
        proximoPasso: 'Analise a planilha atual antes de propor sistema.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Qual é a maior preocupação dos clientes quando vão contratar uma reforma com vocês?' },
      { autor: 'cliente', texto: 'Atraso e o preço subir no meio da obra.' },
      { autor: 'vendedor', texto: 'Mostrar no site como vocês controlam prazo e orçamento, e dar ao cliente acesso ao cronograma, ajuda muito nessa confiança. Posso mostrar como funciona?' },
    ],
    angulos: {
      preco: 'Compare com o valor de uma obra fechada a mais ou com a margem perdida por itens esquecidos.',
      necessidade: 'Transmitir confiança e organizar orçamento e acompanhamento.',
      confianca: 'Processo claro, portfólio real e comunicação durante a obra.',
      prazo: 'Antes da temporada de reformas (início e meio do ano).',
    },
    cuidados: ['Obras que exigem projeto e responsabilidade técnica (ART/RRT) devem ter profissional habilitado.'],
    aberturaProspeccao: 'Qual é a maior preocupação dos seus clientes na hora de fechar uma reforma?',
  },
  {
    id: 'arquitetos',
    nome: 'Arquitetos',
    categoria: 'construcao',
    resumo:
      'Projetos residenciais, comerciais e de interiores. Venda baseada em portfólio, estilo e confiança. Honorários muitas vezes questionados por clientes que não entendem o valor do projeto. Ciclo longo e decisão do casal/família.',
    comoClientesChegam: ['Indicação', 'Instagram e Pinterest', 'Parceiros (lojas, construtoras)', 'Busca por estilo/serviço'],
    dores: [
      'Explicar o valor do projeto e as etapas',
      'Portfólio espalhado em redes',
      'Clientes que pedem "só uma ideia" de graça',
    ],
    solucoes: [
      { servico: 'site-profissional', porque: 'Portfólio curado com projetos, processo e escopo de cada serviço.' },
      { servico: 'site-paginas-servicos', porque: 'Páginas por tipo de projeto (interiores, residencial, comercial).' },
      { servico: 'sis-membros', porque: 'Área do cliente com pranchas, aprovações e documentos.' },
    ],
    argumentos: [
      'Explicar as etapas do projeto no site prepara o cliente para entender os honorários.',
      'Portfólio curado comunica estilo e atrai o cliente certo.',
      'Área do cliente organiza aprovações e evita "não recebi o arquivo".',
    ],
    perguntas: ['Que tipo de projeto você mais quer fazer?', 'Clientes questionam o valor do projeto?', 'Como entrega pranchas e aprovações?'],
    objecoes: [
      {
        id: 'instagram-portfolio',
        frase: 'Meu Instagram é meu portfólio.',
        porTras: 'Canal visual suficiente.',
        resposta:
          'E é ótimo para inspirar. O site complementa com o que o feed não mostra: o processo, as etapas e o escopo dos serviços. Isso ajuda o cliente a entender o valor antes de pedir orçamento.',
        pergunta: 'Seus clientes entendem o que está incluso no projeto antes da reunião?',
        proximoPasso: 'Proponha site com processo e portfólio curado.',
      },
      {
        id: 'publico-premium',
        frase: 'Meu público é premium, o site precisa ser impecável.',
        porTras: 'Exigência estética.',
        resposta:
          'Totalmente de acordo. O site precisa ter o mesmo cuidado do seu projeto: tipografia, fotos, espaço em branco. Que sites você admira?',
        pergunta: 'Quais referências visuais você admira?',
        proximoPasso: 'Colete referências e proponha um conceito visual.',
      },
      {
        id: 'nao-quero-preco',
        frase: 'Não quero mostrar preço.',
        porTras: 'Honorários personalizados.',
        resposta:
          'Não precisa. O site explica serviços e etapas e convida para uma conversa. Preço fica para a proposta.',
        pergunta: 'Como você prefere receber o primeiro contato?',
        proximoPasso: 'Inclua formulário de briefing inicial.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Seus clientes costumam entender o que está incluso no projeto antes da primeira reunião?' },
      { autor: 'cliente', texto: 'Não, sempre acham caro no começo.' },
      { autor: 'vendedor', texto: 'Um site que explica o processo e as etapas ajuda o cliente a chegar valorizando o projeto. Quer ver uma estrutura?' },
    ],
    angulos: {
      preco: 'Compare com os honorários de um projeto e com o tempo gasto explicando o processo.',
      necessidade: 'Explicar o valor do projeto e curar o portfólio.',
      confianca: 'Registro no CAU, processo claro, portfólio autoral.',
      prazo: 'Antes de lançar um novo serviço ou mudar de posicionamento.',
    },
    cuidados: ['Inclua o registro no CAU e respeite as regras éticas de publicidade do conselho; credite autoria e parceiros nas fotos.'],
    aberturaProspeccao: 'Seus clientes costumam chegar entendendo o que está incluso num projeto ou você precisa explicar tudo desde o início?',
  },
  {
    id: 'engenheiros',
    nome: 'Engenheiros',
    categoria: 'construcao',
    resumo:
      'Engenheiros civis, eletricistas, de segurança: laudos, projetos, regularizações, ART, vistorias. Clientes são pessoas físicas com uma necessidade pontual (laudo, aprovação de projeto) e empresas. Serviço técnico pouco compreendido pelo público.',
    comoClientesChegam: ['Busca por serviço específico (laudo, ART, regularização)', 'Indicação de arquitetos e construtoras', 'Prefeituras e cartórios'],
    dores: ['Explicar serviços técnicos de forma simples', 'Orçamentos que exigem documentos', 'Prazo dependente de órgãos públicos'],
    solucoes: [
      { servico: 'site-paginas-servicos', porque: 'Página por serviço (laudo, regularização, projeto) com documentos necessários.' },
      { servico: 'site-formulario-orcamento', porque: 'Pedido com envio de documentos e fotos.' },
      { servico: 'site-seo', porque: 'Buscas por "laudo técnico", "regularização de imóvel" têm intenção alta.' },
    ],
    argumentos: [
      'Quem pesquisa "laudo de vistoria" precisa do serviço agora: aparecer ali vale muito.',
      'Lista de documentos necessários no site acelera o orçamento.',
      'Explicar em linguagem simples diferencia de concorrentes técnicos demais.',
    ],
    perguntas: ['Quais serviços são mais procurados?', 'Que documentos você sempre pede?', 'Atende pessoa física ou mais empresas?'],
    objecoes: [
      {
        id: 'servico-tecnico-nao-vende-online',
        frase: 'Serviço técnico não se vende pela internet.',
        porTras: 'Venda consultiva.',
        resposta:
          'A venda continua na conversa. O site é para ser encontrado por quem pesquisa "laudo técnico" na sua cidade e chega já sabendo os documentos. Você recebe muitas dúvidas básicas?',
        pergunta: 'Que serviço você gostaria que mais gente encontrasse?',
        proximoPasso: 'Proponha páginas por serviço com foco em busca local.',
      },
      {
        id: 'clientes-de-parceiros',
        frase: 'Meus clientes vêm de arquitetos.',
        porTras: 'Canal B2B.',
        resposta:
          'Ótimo. Um site profissional facilita o arquiteto te indicar e o cliente confiar. E abre uma porta para clientes diretos. Que porcentagem vem de parceiros?',
        pergunta: 'Se um parceiro deixasse de indicar, quanto você perderia?',
        proximoPasso: 'Proponha site institucional com serviços.',
      },
      {
        id: 'prazo-orgao-publico',
        frase: 'O prazo depende da prefeitura.',
        porTras: 'Medo de criar expectativa.',
        resposta:
          'Exato, e o site pode explicar isso com clareza: o que depende de você e o que depende do órgão. Isso evita cobranças.',
        pergunta: 'Que expectativa errada os clientes costumam ter?',
        proximoPasso: 'Inclua FAQ de prazos e etapas.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quais serviços são mais procurados: laudos, regularização ou projetos?' },
      { autor: 'cliente', texto: 'Regularização de imóvel, principalmente.' },
      { autor: 'vendedor', texto: 'É uma busca muito comum. Uma página explicando o processo e os documentos necessários ajuda a aparecer e a receber pedidos completos. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor de um laudo ou regularização.',
      necessidade: 'Ser encontrado em buscas específicas e explicar o serviço.',
      confianca: 'Registro no CREA, explicação clara e prazos realistas.',
      prazo: 'Antes de mudanças em legislação municipal ou campanhas de regularização.',
    },
    cuidados: ['Inclua o registro no CREA e não prometa prazos que dependem de órgãos públicos.'],
    aberturaProspeccao: 'Quais serviços seus são mais procurados: laudos, regularizações ou projetos?',
  },
  {
    id: 'limpeza',
    nome: 'Empresas de limpeza',
    categoria: 'construcao',
    resumo:
      'Limpeza residencial, pós-obra, comercial e contratos recorrentes com empresas e condomínios. Orçamento por metragem, frequência e tipo de limpeza. Gestão de equipes e escalas é o desafio operacional.',
    comoClientesChegam: ['Indicação', 'Busca local', 'Contratos B2B', 'Plataformas de serviços'],
    dores: ['Orçamento por metragem e frequência', 'Escala de equipes', 'Confiança para entrar em residências'],
    solucoes: [
      { servico: 'site-formulario-orcamento', porque: 'Orçamento com tipo de limpeza, metragem, frequência e endereço.' },
      { servico: 'sis-agendamento', porque: 'Agenda de equipes e escalas por cliente.' },
      { servico: 'site-paginas-servicos', porque: 'Páginas por tipo de limpeza (pós-obra, comercial, residencial).' },
    ],
    argumentos: [
      'Orçamento por metragem e frequência chega pronto para cálculo.',
      'Escala organizada evita faltas e atrasos em clientes recorrentes.',
      'Mostrar processos, seleção e treinamento da equipe gera confiança.',
    ],
    perguntas: ['Quantos clientes recorrentes vocês têm?', 'Como montam a escala das equipes?', 'Qual serviço tem mais margem?'],
    objecoes: [
      {
        id: 'plataforma-traz-cliente',
        frase: 'Uso plataformas de serviço.',
        porTras: 'Canal com comissão.',
        resposta:
          'Elas trazem clientes novos. O site próprio é para clientes recorrentes e contratos B2B, sem comissão. Quanto você paga às plataformas?',
        pergunta: 'Quantos clientes recorrentes vieram de plataformas?',
        proximoPasso: 'Proponha site focado em contratos recorrentes.',
      },
      {
        id: 'escala-whatsapp',
        frase: 'Faço a escala pelo WhatsApp.',
        porTras: 'Processo manual.',
        resposta:
          'Funciona até alguém faltar e você precisar remanejar tudo. Quantas pessoas na equipe?',
        pergunta: 'Quanto tempo por semana você gasta montando escalas?',
        proximoPasso: 'Proponha agenda de equipes como piloto.',
      },
      {
        id: 'confianca-casa',
        frase: 'Cliente tem medo de deixar desconhecido em casa.',
        porTras: 'Barreira de confiança.',
        resposta:
          'Medo legítimo. O site pode mostrar como vocês selecionam e treinam a equipe, o uso de uniforme e identificação e avaliações reais. Isso ajuda muito.',
        pergunta: 'Que cuidados vocês já tomam na seleção da equipe?',
        proximoPasso: 'Inclua página de "como trabalhamos" com processos de segurança.',
      },
    ],
    conversa: [
      { autor: 'vendedor', texto: 'Olá! Quando alguém pede orçamento de limpeza, quais informações vocês sempre precisam?' },
      { autor: 'cliente', texto: 'Metragem, tipo e frequência.' },
      { autor: 'vendedor', texto: 'Um formulário com essas perguntas permite responder o valor rapidinho, sem idas e vindas. Quer ver?' },
    ],
    angulos: {
      preco: 'Compare com o valor mensal de um contrato recorrente.',
      necessidade: 'Orçamentos rápidos, escalas e confiança.',
      confianca: 'Processos de seleção, identificação da equipe e avaliações.',
      prazo: 'Antes do fim de ano (limpezas pós-obra e de fim de ano).',
    },
    cuidados: ['Não divulgue dados ou fotos das residências dos clientes.'],
    aberturaProspeccao: 'Quando alguém pede orçamento de limpeza, quantas mensagens leva até vocês conseguirem passar o valor?',
  },
];
