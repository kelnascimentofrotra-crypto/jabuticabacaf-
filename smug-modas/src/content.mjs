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
    'SMUG MODAS: roupas, vestidos, calçados e acessórios escolhidos com carinho para você se sentir bem, do seu jeito. Conheça a loja e a história da Fabielly.',
  themeColor: '#160D09',
  shareImage: 'assets/img/og-smug-modas.jpg',
};

// Canais de atendimento. As referências de design traziam valores ilustrativos
// ("(xx) xxxx-xxxx", "Rua Exemplo, 123"), que NÃO devem ir para o ar.
// Preencha somente com dados confirmados pela loja. Linhas vazias não aparecem no site.
export const contact = {
  whatsapp: {
    // Somente dígitos, com DDI e DDD. Ex.: '5511912345678'.
    number: '',
    // Como o número aparece no site. Ex.: '(11) 91234-5678'.
    display: '',
    // Mensagem inicial das conversas abertas pelo site.
    message: 'Olá! Vim pelo site da SMUG MODAS e gostaria de mais informações.',
  },
  email: {
    // Na referência aparece 'contato@smugmodas.com.br' — confirme antes de usar.
    address: '',
  },
  address: {
    // Ex.: ['Rua ..., 123 - Centro', 'Cidade - UF']
    lines: [],
    // Link do Google Maps (ou similar). Habilita o botão "Venha nos visitar".
    mapsUrl: '',
  },
  hours: {
    // Na referência aparece 'Segunda a Sábado' / '09h às 18h' — confirme antes de usar.
    lines: [],
  },
  social: {
    instagram: '', // URL completa do perfil
  },
};

// Formulário de contato: só aparece no site quando existe um serviço real de envio
// (ex.: Formspree, Web3Forms, API própria). A confirmação só é exibida se o
// servidor responder com sucesso. Sem endpoint, a seção mostra os canais diretos.
export const form = {
  endpoint: '',
  // 'json' envia application/json; 'form' envia multipart/form-data.
  format: 'json',
};

// Catálogo real (opcional). Com uma URL aqui, "Conhecer a coleção" e as categorias
// passam a abrir o catálogo. Cada categoria também aceita sua própria `url`.
export const catalog = {
  url: '',
};

// "Escolhas da semana" — aparece logo após a hero somente quando houver produtos reais.
// Não cadastre itens ilustrativos. Formato de cada produto:
// {
//   name: 'Vestido midi vinho',
//   price: 'R$ 189,90',              // apenas preço confirmado ('' oculta)
//   colors: ['Vinho', 'Off-white'],   // opcional
//   sizes: ['P', 'M', 'G'],           // opcional
//   image: { src: 'assets/img/produtos/vestido-1.webp', width: 900, height: 1200, alt: '...', position: '50% 20%' },
//   imageHover: { src: '...', width: 900, height: 1200, alt: '' }, // outra foto do MESMO produto (opcional)
//   url: '',                          // página do produto, se houver; senão abre o WhatsApp
// }
export const products = {
  eyebrow: 'Novidades',
  title: { plain: 'Escolhas', italic: 'da semana' },
  // Usada quando a peça não tem `url` e o WhatsApp está configurado.
  whatsappMessage: 'Olá! Vim pelo site da SMUG MODAS e tenho interesse na peça “{produto}”.',
  items: [],
};

// Faixa logo abaixo da hero. Itens neutros, baseados nos textos da própria loja.
// Condições comerciais (frete, pagamento, horário de suporte) só aparecem com
// `confirmed: true` — confirme com a loja antes de ativar.
export const highlights = [
  { icon: 'sofa', title: 'Ambiente acolhedor', text: 'Um espaço pensado para você escolher com calma.' },
  { icon: 'hanger', title: 'Do casual ao sofisticado', text: 'Peças para diferentes ocasiões.' },
  { icon: 'diamond', title: 'Peças selecionadas', text: 'Escolhidas com carinho, detalhe a detalhe.' },
  { icon: 'heart', title: 'Atendimento atencioso', text: 'Ajuda para encontrar o que combina com você.' },
];
export const commercialHighlights = [
  { icon: 'truck', title: 'Frete grátis', text: 'Em compras acima de R$ 299', confirmed: false },
  { icon: 'card', title: 'Pagamento seguro', text: 'Diversas formas de pagamento', confirmed: false },
  { icon: 'headset', title: 'Suporte 24/7', text: 'Estamos sempre com você', confirmed: false },
];

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'loja', label: 'Nossa loja' },
  { id: 'sobre', label: 'Sobre a Fabielly' },
  { id: 'contato', label: 'Contato' },
];

export const hero = {
  brand: 'SMUG',
  eyebrow: 'SMUG MODAS',
  tagline: { plain: 'Moda é mais que roupa,', italic: 'é expressão.' },
  primaryCta: 'Conhecer a coleção',
  secondaryCta: 'Falar com a loja',
  // Fundo da hero: parede com luz do sol, extraído da referência (sem textos nem pessoas)
  background: { src: 'assets/img/hero-fundo.webp', width: 1600, height: 853, alt: '' },
  photo: {
    src: 'assets/img/fabielly-hero.webp',
    width: 531,
    height: 971,
    alt: 'Fabielly, fundadora da SMUG MODAS, sorrindo, com colete e calça cor vinho e blusa creme.',
  },
};

export const categories = {
  eyebrow: 'Categorias',
  title: { plain: 'Encontre o', italic: 'seu estilo' },
  text: 'Do básico ao sofisticado, escolha por onde começar.',
  // Mensagem enviada pelo WhatsApp ao tocar em uma categoria ({categoria} em minúsculas).
  whatsappMessage: 'Olá! Vim pelo site da SMUG MODAS e gostaria de conhecer os modelos de {categoria}.',
  background: {
    src: 'assets/img/categorias-loja.webp',
    width: 365,
    height: 494,
  },
  // Nomes baseados nas fotos disponíveis — confirme com a loja se correspondem ao acervo.
  items: [
    {
      name: 'Roupas',
      text: 'Estilo em todas as ocasiões.',
      url: '',
      image: { src: 'assets/img/cat-roupas.webp', width: 368, height: 292, position: '50% 30%', alt: 'Look com blazer bege, blusa de tricô e calça de alfaiataria.' },
    },
    {
      name: 'Vestidos',
      text: 'Beleza, estilo e autenticidade.',
      url: '',
      image: { src: 'assets/img/cat-feminino.webp', width: 367, height: 262, position: '45% 35%', alt: 'Vestidos em tons de vinho e off-white em cabides de madeira.' },
    },
    {
      name: 'Calçados',
      text: 'Conforto que te acompanha.',
      url: '',
      image: { src: 'assets/img/cat-calcados.webp', width: 367, height: 292, position: '60% 50%', alt: 'Par de tênis brancos em expositor de mármore.' },
    },
    {
      name: 'Acessórios',
      text: 'Detalhes que fazem a diferença.',
      url: '',
      image: { src: 'assets/img/cat-acessorios.webp', width: 368, height: 262, position: '50% 45%', alt: 'Bolsa preta matelassê com óculos de sol e relógio dourado.' },
    },
  ],
};

export const store = {
  eyebrow: 'Nossa loja',
  title: { plain: 'Mais que uma loja,', italic: 'um espaço feito para você.' },
  text: 'Aqui na SMUG MODAS, cada detalhe foi pensado para que você se sinta bem e à vontade para escolher o que combina com o seu estilo — num ambiente acolhedor, moderno e cheio de inspirações.',
  cta: 'Venha nos visitar',
  photo: {
    src: 'assets/img/loja-ambiente.webp',
    srcset: [['assets/img/loja-ambiente-480.webp', 480], ['assets/img/loja-ambiente.webp', 851]],
    width: 851,
    height: 612,
    alt: 'Interior da loja SMUG MODAS: parede ripada iluminada com letreiro neon “good vibes only”, araras de roupas e expositor de tênis.',
  },
};

export const about = {
  eyebrow: 'Sobre a',
  title: 'Fabielly',
  quote: ['Mais do que uma loja,', 'é um sonho que se veste.'],
  paragraphs: [
    'Olá! Eu sou Fabielly, a mente e o coração por trás da SMUG MODAS. Sempre acreditei que a moda vai muito além de roupas — ela é autoestima, é liberdade, é expressão.',
    'A SMUG nasceu do meu desejo de oferecer mais do que peças: uma experiência. Cada detalhe da loja é pensado com carinho, para que você se sinta bem, confortável e ainda mais linda, do seu jeito.',
  ],
  signature: 'Fabielly',
  role: 'Fundadora da SMUG MODAS',
  photo: {
    src: 'assets/img/fabielly-retrato.webp',
    srcset: [['assets/img/fabielly-retrato-480.webp', 480], ['assets/img/fabielly-retrato.webp', 852]],
    width: 852,
    height: 712,
    alt: 'Fabielly dentro da SMUG MODAS, ao lado de araras de roupas e do letreiro neon “good vibes only”.',
  },
};

export const contactSection = {
  eyebrow: 'Fale conosco',
  title: { plain: 'Estamos', italic: 'aqui para você' },
  text: 'Tem alguma dúvida ou quer saber mais sobre as peças? Fale com a gente — vamos adorar ajudar.',
  // Exibido enquanto nenhum canal nem formulário estiver configurado (sem fingir atendimento).
  pendingText: 'Os canais de atendimento da SMUG MODAS serão publicados aqui em breve.',
  photo: {
    src: 'assets/img/contato-recepcao.webp',
    width: 374,
    height: 838,
    alt: 'Recepção da SMUG MODAS, com balcão de mármore, logotipo dourado e letreiro neon.',
  },
  formTitle: 'Envie sua mensagem',
  formText: 'Preencha os campos e responderemos o mais breve possível.',
};

export const footer = {
  tagline: 'Mais que moda, é você.',
};
