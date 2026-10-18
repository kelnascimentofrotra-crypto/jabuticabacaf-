// Conteúdo central do site SMUG MODAS.
// Edite este arquivo e rode `node build.mjs` para gerar o index.html.
//
// Regra de ouro: nada de dados inventados. Campos vazios ('') ficam fora
// do site (sem links) e aparecem como pendência no terminal durante o build.

export const site = {
  name: 'SMUG MODAS',
  lang: 'pt-BR',
  // URL pública final, sem barra no fim (ex.: 'https://www.smugmodas.com.br').
  // Necessária para canonical, Open Graph e dados estruturados.
  url: '',
  title: 'SMUG MODAS — Moda é mais que roupa, é expressão',
  description:
    'SMUG MODAS: roupas, calçados e acessórios escolhidos com carinho para você se sentir bem, do seu jeito. Conheça a loja e a história da Fabielly.',
  themeColor: '#160D09',
  shareImage: 'assets/img/og-smug-modas.jpg',
};

// Dados de contato. As referências de design traziam valores ilustrativos
// ("(xx) xxxx-xxxx", "Rua Exemplo, 123"), que NÃO devem ir para o ar.
// Preencha somente com dados confirmados pela loja.
export const contact = {
  whatsapp: {
    // Somente dígitos, com DDI e DDD. Ex.: '5511912345678'.
    number: '',
    // Como o número aparece no site. Ex.: '(11) 91234-5678'.
    display: '',
    note: 'Atendimento rápido e prático.',
  },
  email: {
    // Na referência aparece 'contato@smugmodas.com.br' — confirme antes de usar.
    address: '',
    note: 'Respondemos em até 24h.',
  },
  address: {
    // Ex.: ['Rua ..., 123 - Centro', 'Cidade - UF']
    lines: [],
    // Link do Google Maps (ou similar) para o botão "Venha nos visitar".
    mapsUrl: '',
    note: 'Venha nos visitar!',
  },
  hours: {
    // Na referência aparece 'Segunda a Sábado' / '09h às 18h' — confirme antes de usar.
    lines: [],
    note: 'Estamos te esperando!',
  },
  social: {
    instagram: '', // URL completa do perfil
  },
};

// Envio do formulário de contato.
// - endpoint: URL que recebe POST (ex.: Formspree, Web3Forms, API própria).
//   Com endpoint, a confirmação só aparece se o servidor responder com sucesso.
// - Sem endpoint, mas com WhatsApp configurado: o botão vira "Enviar pelo WhatsApp"
//   e abre a conversa com a mensagem pronta (o envio é concluído pela pessoa).
// - Sem endpoint e sem WhatsApp, mas com e-mail: abre o aplicativo de e-mail.
// - Sem nenhum dos três: o formulário valida, mas avisa que o envio online
//   ainda não está disponível (nunca simula uma entrega).
export const form = {
  endpoint: '',
  // 'json' envia application/json; 'form' envia multipart/form-data.
  format: 'json',
};

// Condições comerciais exibidas no topo do site (vindas da referência).
// CONFIRME com a loja antes de publicar — `confirmed: false` gera aviso no build.
export const heroBenefits = [
  { icon: 'truck', title: 'Frete Grátis', text: 'Em compras acima de R$\u00a0299', confirmed: false },
  { icon: 'card', title: 'Pagamento Seguro', text: 'Diversas formas de pagamento', confirmed: false },
  { icon: 'dress', title: 'Coleções Exclusivas', text: 'Sempre as últimas tendências', confirmed: false },
  { icon: 'headset', title: 'Suporte 24/7', text: 'Estamos sempre com você', confirmed: false },
];

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'loja', label: 'Nossa loja' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'sobre', label: 'Sobre a Fabielly' },
  { id: 'contato', label: 'Contato' },
];

// Ações do header. Ainda não existe loja virtual: cada botão mostra um aviso
// de que o site é apenas uma versão de demonstração ({feature} vem de cada item).
export const headerActions = {
  items: [
    { icon: 'search', label: 'Pesquisar', feature: 'a pesquisa de produtos' },
    { icon: 'user', label: 'Minha conta', feature: 'a área do cliente' },
    { icon: 'heart', label: 'Favoritos', feature: 'a lista de favoritos' },
    { icon: 'bag', label: 'Sacola', feature: 'a sacola de compras', badge: 0 },
  ],
  demoNotice: {
    title: 'Versão de demonstração',
    text: 'Este site é apenas uma versão de demonstração: {feature} ainda não está disponível.',
  },
};

export const hero = {
  brand: 'SMUG',
  tagline: ['Moda é mais', 'que roupa,', 'é expressão.'],
  // Fundo da hero: parede com luz do sol, extraído da referência (sem textos nem pessoas)
  background: { src: 'assets/img/hero-fundo.webp', width: 1600, height: 853, alt: '' },
  photo: {
    src: 'assets/img/fabielly-hero.webp',
    width: 531,
    height: 971,
    alt: 'Fabielly, fundadora da SMUG MODAS, sorrindo, com colete e calça cor vinho e blusa creme.',
  },
};

// Faixa em movimento logo abaixo da hero
export const marquee = ['Moda é mais que roupa, é expressão', 'SMUG MODAS', 'Mais que moda, é você', 'Estilo · Conforto · Você'];

export const store = {
  eyebrow: 'Nossa loja',
  title: { plain: 'Mais que uma loja,', italic: 'um espaço feito para você.' },
  paragraphs: [
    'Aqui na SMUG MODAS, cada detalhe foi pensado para que você se sinta bem, confortável e à vontade para escolher o que mais combina com o seu estilo.',
    'Nosso ambiente é acolhedor, moderno e cheio de inspirações, para tornar sua experiência de compra ainda mais especial.',
  ],
  cta: 'Venha nos visitar',
  photo: {
    src: 'assets/img/loja-ambiente.webp',
    srcset: [['assets/img/loja-ambiente-480.webp', 480], ['assets/img/loja-ambiente.webp', 851]],
    width: 851,
    height: 612,
    alt: 'Interior da loja SMUG MODAS: parede ripada iluminada com letreiro neon “good vibes only”, araras de roupas e expositor de tênis.',
  },
  benefits: [
    { icon: 'sofa', title: 'Ambiente Confortável', text: 'Espaço climatizado e acolhedor para você.' },
    { icon: 'hanger', title: 'Variedade de Estilos', text: 'Do casual ao sofisticado, sempre com novidades.' },
    { icon: 'diamond', title: 'Qualidade em Cada Detalhe', text: 'Peças selecionadas com muito carinho.' },
    { icon: 'heart', title: 'Atendimento Especial', text: 'Nossa equipe está sempre pronta para te ajudar.' },
  ],
};

export const categories = {
  eyebrow: 'SMUG MODAS',
  title: { plain: 'Nossas', italic: 'Categorias' },
  text: 'Do básico ao sofisticado, encontre o que faz o seu estilo em cada categoria. Tudo pensado para você se sentir bem, em todos os momentos.',
  cta: 'Ver todas as categorias',
  // Se existir um catálogo/loja virtual, coloque a URL aqui e em cada categoria.
  // Sem URL, os cards levam ao formulário com o interesse já preenchido.
  catalogUrl: '',
  background: {
    src: 'assets/img/categorias-loja.webp',
    width: 365,
    height: 494,
  },
  items: [
    {
      name: 'Roupas',
      text: 'Estilo em todas as ocasiões.',
      url: '',
      image: { src: 'assets/img/cat-roupas.webp', width: 368, height: 292, alt: 'Look com blazer bege, blusa de tricô e calça de alfaiataria.' },
    },
    {
      name: 'Calçados',
      text: 'Conforto que te acompanha.',
      url: '',
      image: { src: 'assets/img/cat-calcados.webp', width: 367, height: 292, alt: 'Par de tênis brancos em expositor de mármore.' },
    },
    {
      name: 'Acessórios',
      text: 'Detalhes que fazem a diferença.',
      url: '',
      image: { src: 'assets/img/cat-acessorios.webp', width: 368, height: 262, alt: 'Bolsa preta matelassê com óculos de sol e relógio dourado.' },
    },
    {
      name: 'Feminino',
      text: 'Beleza, estilo e autenticidade.',
      url: '',
      image: { src: 'assets/img/cat-feminino.webp', width: 367, height: 262, alt: 'Vestidos em tons de vinho e off-white em cabides de madeira.' },
    },
    {
      name: 'Lançamentos',
      text: 'Novidades para você se destacar.',
      url: '',
      wide: true,
      image: { src: 'assets/img/cat-lancamentos.webp', width: 409, height: 215, alt: 'Manequim com blazer bege e blusa vinho.' },
    },
  ],
  closing: {
    words: ['SMUG MODAS', 'Estilo', 'Conforto', 'Você'],
    script: 'Mais que moda, é você.',
  },
};

export const about = {
  eyebrow: 'Sobre a',
  title: 'Fabielly',
  quote: ['Mais do que uma loja,', 'é um sonho que se veste.'],
  paragraphs: [
    'Olá! Eu sou Fabielly, e sou a mente e o coração por trás da SMUG MODAS. Sempre acreditei que a moda vai muito além de roupas — ela é autoestima, é liberdade, é expressão.',
    'A SMUG nasceu do meu desejo de oferecer para você mais do que peças, mas sim uma experiência. Cada detalhe da nossa loja é pensado com carinho, para que você se sinta bem, confortável e ainda mais linda, do seu jeito.',
  ],
  signature: 'Fabielly',
  role: 'Fundadora da SMUG MODAS',
  photo: {
    src: 'assets/img/fabielly-retrato.webp',
    srcset: [['assets/img/fabielly-retrato-480.webp', 480], ['assets/img/fabielly-retrato.webp', 852]],
    width: 852,
    height: 630,
    alt: 'Fabielly dentro da SMUG MODAS, ao lado de araras de roupas e do letreiro neon “good vibes only”.',
  },
  values: [
    { icon: 'heart', title: 'Paixão pela moda', text: 'Porque cada detalhe importa.' },
    { icon: 'diamond', title: 'Qualidade em cada peça', text: 'Você merece o melhor.' },
    { icon: 'people', title: 'Atendimento especial', text: 'Aqui você é única.' },
    { icon: 'star', title: 'Confiança sempre', text: 'Sua satisfação é a nossa maior conquista.' },
  ],
};

export const contactSection = {
  eyebrow: 'Fale conosco',
  title: { plain: 'Estamos', italic: 'aqui para você!' },
  text: 'Tem alguma dúvida, sugestão ou precisa de ajuda? Nossa equipe está pronta para te atender com todo o carinho e atenção que você merece.',
  photo: {
    src: 'assets/img/contato-recepcao.webp',
    width: 374,
    height: 838,
  },
  formTitle: 'Envie sua mensagem',
  formText: 'Preencha o formulário abaixo e entraremos em contato o mais breve possível.',
};

export const footer = {
  tagline: 'Mais que moda, é você.',
};
