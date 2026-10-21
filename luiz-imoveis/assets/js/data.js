/*
 * Dados do protótipo — Luiz · Curadoria Imobiliária
 * ------------------------------------------------------------------
 * Todos os imóveis, valores, números e contatos abaixo são ILUSTRATIVOS.
 * Na implementação final, este arquivo é substituído por conteúdo
 * estático (JSON/MDX) ou por um CMS headless (fase 2).
 */
window.LUIZ = window.LUIZ || {};

LUIZ.config = {
  // Somente dígitos, com DDI + DDD (ex.: '5511999999999').
  // Enquanto estiver vazio, os botões de WhatsApp levam ao formulário de contato.
  whatsapp: '',
  email: 'luiz@example.com',
  phoneDisplay: '+55 11 0000-0000',
  creci: 'CRECI 000000-F',
  instagram: 'https://www.instagram.com/',
  city: 'São Paulo'
};

/* Fotos de referência (Unsplash) — substituir pelo acervo fotográfico próprio. */
LUIZ.photos = {
  poolDusk: '1600596542815-ffad4c1539a9',
  modernFacade: '1600585154340-be6161a56a0c',
  whiteVilla: '1613490493576-7fde63acd811',
  whitePool: '1512917774080-9991f1c4c750',
  modernHouse: '1580587771525-78b9dba3b914',
  housePool: '1564013799919-ab600027ffc6',
  luxuryPool: '1605276374104-dee2a0ed3cd6',
  villaA: '1613977257363-707ba9348227',
  villaB: '1613977257592-4871e5fcd7c4',
  tropicalPool: '1571055107559-3e67626fa8be',
  exteriorA: '1600047509807-ba8f99d2cdde',
  exteriorB: '1600566753086-00f18fb6b3ea',
  modernHouseB: '1523217582562-09d0def993a6',
  beachHouse: '1499793983690-e29da59ef1c2',
  livingA: '1600607687939-ce8a6c25118c',
  livingB: '1600566753190-17f0baa2a6c3',
  livingC: '1600210492486-724fe5c67fb0',
  livingD: '1586023492125-27b2c045efd7',
  livingE: '1616594039964-ae9021a400a0',
  livingF: '1618221195710-dd6b41faaea6',
  kitchenA: '1600607687644-c7171b42498f',
  kitchenB: '1600121848594-d8644e57abab',
  kitchenC: '1556909114-f6e7ad7d3136',
  kitchenD: '1484154218962-a197022b5858',
  interiorA: '1600573472550-8090b5e0745e',
  interiorB: '1600585154526-990dced4db0d',
  interiorC: '1493809842364-78817add7ffb',
  bedroomA: '1540518614846-7eded433c457',
  bedroomB: '1505693416388-ac5ce068fe85',
  bedroomC: '1617806118233-18e1de247200',
  bathA: '1552321554-5fefe8c9ef14',
  aptA: '1522708323590-d24dbb6b0267',
  aptB: '1502672260266-1c1ef2d93688',
  aptC: '1560448204-e02f11c3d0e2',
  buildingA: '1545324418-cc1a3fa10c00',
  buildingB: '1486406146926-c627a92ad1ab',
  buildingC: '1512918728675-ed5a9ecdebfd',
  buildingD: '1460317442991-0ec209397118'
};

LUIZ.categories = {
  venda: { label: 'Venda', plural: 'Residências à venda' },
  aluguel: { label: 'Aluguel', plural: 'Residências para locação' },
  lancamento: { label: 'Lançamentos', plural: 'Lançamentos' }
};

LUIZ.priceRanges = {
  venda: [
    { value: 'ate-15', label: 'Até R$ 15 milhões', min: 0, max: 15e6 },
    { value: '15-25', label: 'R$ 15 a 25 milhões', min: 15e6, max: 25e6 },
    { value: '25-40', label: 'R$ 25 a 40 milhões', min: 25e6, max: 40e6 },
    { value: 'acima-40', label: 'Acima de R$ 40 milhões', min: 40e6, max: Infinity }
  ],
  aluguel: [
    { value: 'ate-40', label: 'Até R$ 40 mil/mês', min: 0, max: 40e3 },
    { value: '40-60', label: 'R$ 40 a 60 mil/mês', min: 40e3, max: 60e3 },
    { value: 'acima-60', label: 'Acima de R$ 60 mil/mês', min: 60e3, max: Infinity }
  ]
};
LUIZ.priceRanges.lancamento = LUIZ.priceRanges.venda;

LUIZ.neighborhoods = {
  'Jardim Europa': 'Ruas arborizadas, baixa circulação e algumas das residências mais emblemáticas de São Paulo — a poucos minutos de galerias, restaurantes e da Avenida Brasil.',
  'Vila Nova Conceição': 'Vizinha ao Parque Ibirapuera, reúne edifícios de alto padrão, gastronomia de assinatura e uma rara sensação de tranquilidade urbana.',
  'Cidade Jardim': 'Topografia generosa, lotes amplos e muito verde, com acesso rápido às marginais e aos principais centros de compras da cidade.',
  'Itaim Bibi': 'Vida urbana a pé: escritórios, restaurantes e boutiques em um raio curto, com a praticidade de um dos bairros mais conectados de São Paulo.',
  'Alto de Pinheiros': 'Bairro-jardim de traçado sinuoso, praças silenciosas e casas de grande valor arquitetônico, ao lado da Praça Pôr do Sol.',
  'Jardins': 'Endereço clássico entre a Avenida Paulista e o Jardim Europa, com o melhor da cultura, da moda e da gastronomia da cidade.',
  'Fazenda Boa Vista': 'Condomínio de campo com hípica, golfe e áreas de preservação no interior paulista — privacidade e natureza em escala rara.',
  'Baleia': 'Uma das praias mais desejadas do Litoral Norte, de águas calmas e condomínios discretos entre a serra e o mar.',
  'Riviera de São Lourenço': 'Bairro planejado à beira-mar, com infraestrutura completa, ciclovias e uma orla extensa preservada.'
};

(function () {
  var P = LUIZ.photos;

  LUIZ.properties = [
    {
      id: 'casa-jacaranda',
      name: 'Casa Jacarandá',
      category: 'venda',
      type: 'Casa',
      style: 'Contemporâneo',
      neighborhood: 'Jardim Europa',
      city: 'São Paulo',
      price: 38000000,
      area: 1150, land: 1400, bedrooms: 5, parking: 6, year: 2021,
      featured: true,
      tagline: 'Concreto aparente, madeira e luz natural em uma das ruas mais reservadas do Jardim Europa.',
      description: [
        'Implantada em um terreno de 1.400 m², a Casa Jacarandá foi desenhada a partir da luz: grandes panos de vidro, pé-direito duplo na sala de estar e uma sequência de jardins internos que conduzem o olhar do hall à piscina.',
        'O programa se divide com clareza entre o social — generoso e integrado ao paisagismo — e o íntimo, protegido no pavimento superior. São cinco suítes, sendo a master com closet duplo, sala de banho em mármore e terraço privativo voltado para as copas das árvores.',
        'Acabamentos selecionados, automação integral e um projeto de iluminação cênica completam uma residência pensada para receber com elegância e viver em silêncio.'
      ],
      highlights: ['Pé-direito duplo de 7 m na sala de estar', 'Piscina aquecida com raia de 25 m', 'Adega climatizada para 1.200 rótulos', 'Paisagismo autoral com espécies nativas', 'Automação integral e gerador full-house', 'Suíte master com terraço privativo'],
      images: [P.poolDusk, P.livingA, P.kitchenA, P.bedroomA, P.bathA, P.modernFacade, P.livingB]
    },
    {
      id: 'cobertura-horizonte',
      name: 'Cobertura Horizonte',
      category: 'venda',
      type: 'Cobertura',
      style: 'Minimalista',
      neighborhood: 'Vila Nova Conceição',
      city: 'São Paulo',
      price: 24500000,
      area: 620, land: null, bedrooms: 4, parking: 5, year: 2019,
      featured: true,
      tagline: 'Duplex suspensa sobre o verde do Ibirapuera, com terraço de 180 m² e piscina de borda infinita.',
      description: [
        'No último andar de um edifício de apenas um apartamento por andar, a Cobertura Horizonte se abre em 360 graus para a cidade — e, ao sul, para a massa verde do Parque Ibirapuera.',
        'O living integrado, com caixilhos piso-teto, conduz ao terraço com piscina de borda infinita, espaço gourmet e jardim suspenso. No pavimento inferior, quatro suítes amplas garantem privacidade absoluta à família.',
        'Uma residência de linhas puras, materiais nobres e silêncio surpreendente para a localização.'
      ],
      highlights: ['Terraço de 180 m² com piscina de borda infinita', 'Elevador privativo com hall exclusivo', 'Vista permanente para o Parque Ibirapuera', 'Cinco vagas e depósito privativo', 'Climatização central e automação', 'Edifício com segurança 24 h'],
      images: [P.livingC, P.livingE, P.kitchenB, P.bedroomB, P.interiorA, P.buildingA]
    },
    {
      id: 'villa-aroeira',
      name: 'Villa Aroeira',
      category: 'venda',
      type: 'Casa de campo',
      style: 'Contemporâneo',
      neighborhood: 'Fazenda Boa Vista',
      city: 'Porto Feliz',
      price: 52000000,
      priceOnRequest: true,
      area: 1400, land: 6200, bedrooms: 6, parking: 8, year: 2022,
      featured: true,
      tagline: 'Arquitetura horizontal entre gramados, lagos e silêncio absoluto.',
      description: [
        'A Villa Aroeira se estende sobre um terreno de 6.200 m² com um único gesto arquitetônico: um longo volume térreo, protegido por beirais profundos, que se abre por inteiro para o gramado e o lago.',
        'São seis suítes distribuídas em alas independentes, salas de estar e jantar integradas, cozinha profissional, spa com sauna e uma casa de hóspedes com entrada própria.',
        'Uma propriedade negociada com absoluta discrição. Informações completas e visitas apenas mediante agendamento.'
      ],
      highlights: ['Terreno de 6.200 m² com vista para o lago', 'Casa de hóspedes independente', 'Spa com sauna seca e úmida', 'Piscina aquecida de 30 m', 'Adega e sala de degustação', 'Garagem para oito veículos'],
      images: [P.villaA, P.livingF, P.kitchenC, P.bedroomC, P.luxuryPool, P.villaB]
    },
    {
      id: 'casa-do-mirante',
      name: 'Casa do Mirante',
      category: 'venda',
      type: 'Casa de praia',
      style: 'Tropical moderno',
      neighborhood: 'Baleia',
      city: 'São Sebastião',
      price: 19800000,
      area: 850, land: 1600, bedrooms: 6, parking: 4, year: 2020,
      featured: true,
      tagline: 'Pé na areia, sombra de amendoeiras e um mirante voltado para o mar aberto.',
      description: [
        'Entre a mata e a areia, a Casa do Mirante foi pensada para dias longos: varandas profundas, madeira de demolição, pedra natural e ventilação cruzada em todos os ambientes.',
        'Seis suítes voltadas para o mar, uma área social que se dissolve no jardim e, no último pavimento, o mirante que dá nome à casa — perfeito para o fim de tarde.',
        'Uma casa de praia com alma de refúgio, a poucos passos da água.'
      ],
      highlights: ['Acesso direto à praia', 'Mirante com vista panorâmica para o mar', 'Piscina com deck em madeira', 'Seis suítes com varanda', 'Casa de funcionários independente', 'Condomínio com segurança 24 h'],
      images: [P.beachHouse, P.tropicalPool, P.livingD, P.bedroomA, P.whiteVilla, P.interiorB]
    },
    {
      id: 'residencia-ipe',
      name: 'Residência Ipê',
      category: 'aluguel',
      type: 'Casa',
      style: 'Clássico',
      neighborhood: 'Cidade Jardim',
      city: 'São Paulo',
      price: 65000,
      area: 780, land: 1100, bedrooms: 4, parking: 6, year: 2015,
      featured: true,
      tagline: 'Proporções clássicas, jardim maduro e uma biblioteca com lareira.',
      description: [
        'Uma casa de linguagem clássica, restaurada com rigor e equipada para a vida contemporânea. O hall com escada escultural distribui os ambientes sociais — sala de estar com lareira, biblioteca, sala de jantar para doze pessoas — todos voltados ao jardim.',
        'No pavimento superior, quatro suítes, incluindo a master com dois closets e varanda. Disponível para locação com contrato flexível e possibilidade de mobília.'
      ],
      highlights: ['Biblioteca com lareira', 'Jardim maduro com pomar', 'Piscina e quadra de tênis', 'Sala de jantar para 12 pessoas', 'Possibilidade de mobília completa', 'Contrato flexível'],
      images: [P.exteriorA, P.livingB, P.kitchenD, P.bedroomB, P.interiorC]
    },
    {
      id: 'apartamento-paineira',
      name: 'Apartamento Paineira',
      category: 'aluguel',
      type: 'Apartamento',
      style: 'Minimalista',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      price: 38000,
      area: 310, land: null, bedrooms: 3, parking: 4, year: 2020,
      featured: false,
      tagline: 'Mobiliado com peças de design brasileiro, pronto para morar.',
      description: [
        'Planta livre, marcenaria sob medida e uma curadoria de mobiliário de design brasileiro fazem do Apartamento Paineira uma opção rara de locação: tudo pronto, nada genérico.',
        'Três suítes, living com varanda integrada e um edifício com serviços completos, no coração do Itaim.'
      ],
      highlights: ['Totalmente mobiliado e equipado', 'Varanda integrada ao living', 'Edifício com serviços pay-per-use', 'Academia, spa e coworking', 'Quatro vagas', 'Pet friendly'],
      images: [P.aptA, P.aptB, P.aptC, P.kitchenD, P.bedroomC]
    },
    {
      id: 'casa-das-dunas',
      name: 'Casa das Dunas',
      category: 'aluguel',
      type: 'Casa de praia',
      style: 'Tropical moderno',
      neighborhood: 'Riviera de São Lourenço',
      city: 'Bertioga',
      price: 52000,
      area: 640, land: 1000, bedrooms: 5, parking: 4, year: 2018,
      featured: false,
      tagline: 'Temporadas longas à beira-mar, com serviço de governança incluído.',
      description: [
        'Uma casa de praia de linhas retas e materiais naturais, a uma quadra da orla. Cinco suítes, área gourmet integrada à piscina e jardim tropical que garante privacidade.',
        'Disponível para locação mensal, com governança, manutenção da piscina e jardinagem incluídas.'
      ],
      highlights: ['A uma quadra do mar', 'Governança incluída', 'Área gourmet com forno a lenha', 'Piscina aquecida', 'Cinco suítes', 'Bicicletas e equipamentos de praia'],
      images: [P.whitePool, P.livingD, P.kitchenC, P.bedroomA, P.housePool]
    },
    {
      id: 'alameda-jardins',
      name: 'Alameda Jardins',
      category: 'lancamento',
      type: 'Apartamento',
      style: 'Contemporâneo',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      price: 9800000,
      area: 280, areaMax: 520, bedrooms: 4, bedroomsMin: 3, parking: 4, delivery: 2028,
      featured: true,
      tagline: 'Vinte e quatro residências com fachada em pedra, assinadas por um escritório premiado.',
      description: [
        'Um edifício boutique de apenas vinte e quatro unidades, com fachada em pedra natural, varandas profundas e um térreo pensado como um jardim privativo.',
        'Plantas de 280 a 520 m², com três ou quatro suítes, e coberturas com piscina. Condições exclusivas na fase de pré-lançamento, mediante atendimento personalizado.'
      ],
      highlights: ['Apenas 24 residências', 'Plantas de 280 a 520 m²', 'Coberturas com piscina privativa', 'Lobby com pé-direito triplo', 'Spa, adega e sala de concertos', 'Condições de pré-lançamento'],
      images: [P.buildingC, P.livingE, P.kitchenB, P.interiorB, P.bathA]
    },
    {
      id: 'reserva-cedro',
      name: 'Reserva Cedro',
      category: 'lancamento',
      type: 'Casa em condomínio',
      style: 'Contemporâneo',
      neighborhood: 'Alto de Pinheiros',
      city: 'São Paulo',
      price: 14200000,
      area: 540, areaMax: 690, bedrooms: 4, parking: 4, delivery: 2027,
      featured: false,
      tagline: 'Oito casas em uma vila arborizada, com segurança e serviços compartilhados.',
      description: [
        'Oito casas independentes implantadas ao redor de um bosque preservado, com acesso controlado, serviços compartilhados e a sensação de morar em uma vila.',
        'Plantas de 540 a 690 m², quatro suítes e personalização de acabamentos até a fase de estrutura.'
      ],
      highlights: ['Apenas 8 casas', 'Bosque central preservado', 'Personalização de acabamentos', 'Portaria e segurança 24 h', 'Piscina em todas as unidades', 'Entrega prevista para 2027'],
      images: [P.exteriorB, P.livingC, P.kitchenA, P.bedroomC, P.modernHouse]
    },
    {
      id: 'casa-figueira',
      name: 'Casa Figueira',
      category: 'venda',
      type: 'Casa',
      style: 'Modernista',
      neighborhood: 'Alto de Pinheiros',
      city: 'São Paulo',
      price: 16900000,
      area: 640, land: 900, bedrooms: 4, parking: 4, year: 1968,
      featured: false,
      tagline: 'Uma casa modernista de 1968, restaurada com respeito absoluto ao projeto original.',
      description: [
        'Concreto, tijolo aparente e grandes vãos: a Casa Figueira é um exemplar raro da arquitetura modernista paulista, restaurado com acompanhamento técnico e atualizado em instalações, conforto térmico e segurança.',
        'Uma casa para quem coleciona arte, valoriza história e procura um lar com assinatura.'
      ],
      highlights: ['Projeto modernista original de 1968', 'Restauro completo com laudo técnico', 'Painéis e caixilhos originais preservados', 'Jardim com figueira centenária', 'Ateliê independente', 'Quatro suítes'],
      images: [P.modernHouseB, P.interiorC, P.livingA, P.kitchenD, P.bedroomB]
    },
    {
      id: 'cobertura-atlantica',
      name: 'Cobertura Atlântica',
      category: 'venda',
      type: 'Cobertura',
      style: 'Contemporâneo',
      neighborhood: 'Riviera de São Lourenço',
      city: 'Bertioga',
      price: 12400000,
      area: 420, land: null, bedrooms: 4, parking: 4, year: 2021,
      featured: false,
      tagline: 'Frente para o mar, com terraço gourmet e piscina privativa.',
      description: [
        'Uma cobertura duplex de frente para o mar, com terraço gourmet, piscina privativa e quatro suítes com vista.',
        'Entregue decorada, com projeto de interiores assinado e enxoval completo.'
      ],
      highlights: ['Frente para o mar', 'Piscina privativa no terraço', 'Entregue decorada', 'Quatro suítes com vista', 'Quatro vagas', 'Serviço de praia do condomínio'],
      images: [P.whiteVilla, P.livingF, P.kitchenC, P.bedroomA, P.interiorA]
    },
    {
      id: 'torre-ybira',
      name: 'Ybirá',
      category: 'lancamento',
      type: 'Apartamento',
      style: 'Minimalista',
      neighborhood: 'Vila Nova Conceição',
      city: 'São Paulo',
      price: 21000000,
      area: 450, areaMax: 780, bedrooms: 4, parking: 6, delivery: 2029,
      featured: false,
      tagline: 'Um apartamento por andar, a uma quadra do Parque Ibirapuera.',
      description: [
        'Uma torre esbelta com apenas um apartamento por andar, implantada a uma quadra do Parque Ibirapuera. Plantas de 450 a 780 m², quatro suítes e terraços com vista desimpedida para o verde.',
        'Lazer completo com piscina coberta de 25 m, spa e salão de eventos com cozinha profissional.'
      ],
      highlights: ['Um apartamento por andar', 'A uma quadra do Ibirapuera', 'Plantas de 450 a 780 m²', 'Piscina coberta de 25 m', 'Seis vagas por unidade', 'Entrega prevista para 2029'],
      images: [P.buildingB, P.livingB, P.kitchenB, P.bedroomC, P.buildingD]
    }
  ];

  /* Galeria editorial da Home (masonry). ratio = largura/altura do recorte. */
  LUIZ.gallery = [
    { photo: P.livingA, ratio: 4 / 5, property: 'casa-jacaranda' },
    { photo: P.luxuryPool, ratio: 3 / 2, property: 'villa-aroeira' },
    { photo: P.kitchenB, ratio: 1, property: 'cobertura-horizonte' },
    { photo: P.bedroomA, ratio: 3 / 4, property: 'casa-do-mirante' },
    { photo: P.interiorC, ratio: 3 / 2, property: 'casa-figueira' },
    { photo: P.livingE, ratio: 4 / 5, property: 'alameda-jardins' },
    { photo: P.bathA, ratio: 3 / 4, property: 'casa-jacaranda' },
    { photo: P.tropicalPool, ratio: 4 / 3, property: 'casa-do-mirante' }
  ];

  /* Depoimentos — apenas iniciais, por privacidade dos clientes. */
  LUIZ.testimonials = [
    { quote: 'Em nenhum momento me senti diante de um vendedor. Luiz entendeu a casa que procurávamos antes de nós mesmos.', author: 'M. A.', detail: 'Empresário · Jardim Europa' },
    { quote: 'Discrição absoluta do primeiro contato à escritura. Exatamente o que esperávamos — e raramente encontramos.', author: 'R. e C. T.', detail: 'Família · Fazenda Boa Vista' },
    { quote: 'Visitamos apenas três imóveis. Os três eram perfeitos. Isso diz tudo sobre a curadoria.', author: 'L. F.', detail: 'Investidora · Vila Nova Conceição' }
  ];
})();
