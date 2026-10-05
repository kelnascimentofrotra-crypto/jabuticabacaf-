/*
 * Dados do site. Tudo o que muda de corretor para corretor fica aqui:
 * configurações, imóveis e avaliações. O resto do código só lê
 * window.SITE_DATA, então dá para trocar este arquivo por uma consulta
 * ao Supabase (ou outra API) sem mexer no HTML, no CSS ou no app.js.
 */
window.SITE_DATA = {
  config: {
    nome: 'Nathan Ferreira',
    // assinatura do topo: "Nathan" + monograma "NF" + "Ferreira"
    assinatura: { antes: 'Nathan', iniciais: 'NF', depois: 'Ferreira' },
    segmento: 'Corretor de imóveis',
    regiao: 'Fortaleza e região',
    whatsapp: '5585999999999',            // só números, com DDI e DDD
    instagram: 'nathanferreira.corretor', // sem @
    email: '',
    telefone: '(85) 99999-9999',
    endereco: '',
    familias: null,                       // ex.: 120 (vazio esconde o item)
    anos: null,                           // ex.: 8
    privacidade:
      'Usamos os dados enviados pelo formulário (nome, e-mail, telefone e mensagem) ' +
      'apenas para responder ao seu contato sobre imóveis. Não vendemos nem ' +
      'compartilhamos essas informações com terceiros. Para pedir a exclusão dos ' +
      'seus dados, fale com a gente pelo WhatsApp.'
  },

  imoveis: [
    {
      slug: 'casa-condominio-eusebio',
      titulo: 'Casa em Condomínio',
      descricao:
        'Casa térrea de alto padrão em condomínio fechado, pronta para morar.\n' +
        'Living integrado à varanda gourmet, com pé-direito duplo e muita luz natural.\n' +
        'Área de lazer completa com piscina aquecida e hidromassagem.\n' +
        'Quatro suítes, sendo a master com closet e banheira.',
      preco: 1250000,
      tipo: 'casa',
      finalidade: 'venda',
      cidade: 'Eusébio',
      uf: 'CE',
      bairro: 'Coaçu',
      quartos: 4,
      suites: 4,
      banheiros: 5,
      vagas: 3,
      area: 320,
      frente: null,
      selos: ['Piscina'],
      caracteristicas: ['Piscina aquecida', 'Hidromassagem', 'Cozinha gourmet', 'Pé-direito duplo', 'Varanda integrada', 'Segurança 24h'],
      status: 'disponivel',
      destaque: true,
      fotos: [
        'assets/imoveis/casa-condominio-eusebio-1.webp',
        'assets/imoveis/casa-condominio-eusebio-2.webp',
        'assets/imoveis/casa-condominio-eusebio-3.webp',
        'assets/imoveis/casa-condominio-eusebio-4.webp'
      ],
      ordem: 1
    },
    {
      slug: 'apartamento-meireles',
      titulo: 'Apartamento',
      descricao:
        'Apartamento com vista para o mar, a poucos passos da Beira-Mar.\n' +
        'Sala ampla com janelas do piso ao teto e varanda gourmet.\n' +
        'Armários planejados em todos os ambientes.',
      preco: 780000,
      tipo: 'apartamento',
      finalidade: 'venda',
      cidade: 'Fortaleza',
      uf: 'CE',
      bairro: 'Meireles',
      quartos: 3,
      suites: 1,
      banheiros: 2,
      vagas: 2,
      area: 120,
      frente: null,
      selos: ['Com planejados'],
      caracteristicas: ['Vista para o mar', 'Varanda gourmet', 'Armários planejados', 'Piscina no condomínio', 'Academia'],
      status: 'disponivel',
      destaque: true,
      fotos: [
        'assets/imoveis/apartamento-meireles-1.webp',
        'assets/imoveis/apartamento-meireles-2.webp'
      ],
      ordem: 2
    },
    {
      slug: 'terreno-porto-das-dunas',
      titulo: 'Terreno',
      descricao:
        'Lote plano em condomínio fechado, com rua calçada e alameda de coqueiros.\n' +
        'A poucos minutos da praia, ótimo para construir a casa de veraneio.',
      preco: 320000,
      tipo: 'terreno',
      finalidade: 'venda',
      cidade: 'Aquiraz',
      uf: 'CE',
      bairro: 'Porto das Dunas',
      quartos: null,
      suites: null,
      banheiros: null,
      vagas: null,
      area: 450,
      frente: 15,
      selos: ['Condomínio fechado'],
      caracteristicas: ['Condomínio fechado', 'Rua calçada', 'Próximo à praia', 'Documentação em dia'],
      status: 'disponivel',
      destaque: false,
      fotos: [
        'assets/imoveis/terreno-porto-das-dunas-1.webp',
        'assets/imoveis/terreno-porto-das-dunas-2.webp',
        'assets/imoveis/terreno-porto-das-dunas-3.webp'
      ],
      ordem: 3
    }
  ],

  avaliacoes: [
    // trocar pelas reais
    { nome: 'Carla Mendes', nota: 5, subtitulo: 'Comprou casa em Eusébio',
      texto: 'Nathan foi incrível do início ao fim! Me ajudou em todo o processo, sempre muito atencioso e profissional. Recomendo de olhos fechados!' },
    // trocar pelas reais
    { nome: 'Rafael Sousa', nota: 5, subtitulo: 'Comprou apartamento em Fortaleza',
      texto: 'Encontramos nosso apartamento em poucas semanas. Ele entendeu exatamente o que a família precisava e cuidou de toda a documentação.' },
    // trocar pelas reais
    { nome: 'Juliana Lima', nota: 5, subtitulo: 'Comprou terreno em Aquiraz',
      texto: 'Comprei meu primeiro terreno com toda a segurança. Atendimento rápido, transparente e sempre disponível para tirar dúvidas.' }
  ]
};
