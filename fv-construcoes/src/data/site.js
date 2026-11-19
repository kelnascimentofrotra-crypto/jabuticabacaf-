/**
 * Conteúdo e dados institucionais da FV Construções e Serviços.
 * Toda informação de contato e todo texto comercial do site saem daqui:
 * para atualizar telefone, endereço ou descrições, edite apenas este arquivo.
 */

export const company = {
  name: 'FV Construções e Serviços',
  shortName: 'FV',
  city: 'Chapadinha',
  state: 'MA',
  years: 'mais de 12 anos',
  phone: {
    display: '(98) 98859-9037',
    e164: '+5598988599037',
    whatsapp: '5598988599037',
  },
  address: {
    street: 'Av. Ataliba Vieira de Almeida, 1749-1799',
    city: 'Chapadinha',
    state: 'MA',
    zip: '65500-000',
  },
  rating: { value: 4.6, display: '4,6', count: 25, source: 'Google' },
};

export const fullAddress = `${company.address.street}, ${company.address.city} - ${company.address.state}, ${company.address.zip}`;

/** Monta um link de WhatsApp (wa.me) com mensagem pré-preenchida. */
export function whatsappLink(message = 'Olá! Vim pelo site da FV Construções e Serviços e gostaria de mais informações.') {
  return `https://wa.me/${company.phone.whatsapp}?text=${encodeURIComponent(message)}`;
}

const mapsQuery = encodeURIComponent(`${company.name}, ${fullAddress}`);

export const links = {
  whatsapp: whatsappLink(),
  specialist: whatsappLink('Olá! Vim pelo site e gostaria de falar com um especialista da FV.'),
  phone: `tel:${company.phone.e164}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`,
  googleReviews: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=16&output=embed`,
};

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'empresa', label: 'A empresa' },
  { id: 'produtos', label: 'Produtos' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'contato', label: 'Contato' },
];

/** Linhas exibidas no letreiro real da loja. */
export const storeLines = ['Ferramentas', 'Máquinas', 'Hidráulicos', 'Elétrica'];

/**
 * Imagens otimizadas em public/img (geradas em AVIF e WebP).
 * width/height são as dimensões do maior arquivo, usadas para reservar espaço (sem CLS).
 */
export const images = {
  hero: { name: 'hero-industrial', widths: [720, 1080, 1544], width: 1544, height: 1610 },
  facade: { name: 'fachada', widths: [640, 960, 1280, 1620], width: 1620, height: 1270 },
  panorama: { name: 'fachada-panorama', widths: [800, 1200, 1784], width: 1784, height: 740 },
  eletricas: { name: 'produto-eletricas', widths: [480, 716], width: 716, height: 580 },
  bombas: { name: 'produto-bombas', widths: [480, 648], width: 648, height: 580 },
  jardinagem: { name: 'produto-jardinagem', widths: [480, 696], width: 696, height: 580 },
  maquinas: { name: 'produto-maquinas', widths: [480, 756], width: 756, height: 580 },
  acessorios: { name: 'produto-acessorios', widths: [480, 744], width: 744, height: 500 },
};

export const categories = [
  {
    id: 'eletricas',
    title: 'Ferramentas elétricas',
    text: 'Furadeiras, parafusadeiras, serras mármore e esmerilhadeiras para obra, oficina e manutenção.',
    image: images.eletricas,
    alt: 'Parafusadeira, serra e esmerilhadeira elétricas sobre bancada escura',
  },
  {
    id: 'bombas',
    title: "Bombas d'água e motores",
    text: "Bombas d'água e motores para abastecimento, obra e campo.",
    image: images.bombas,
    alt: "Bomba d'água centrífuga azul acoplada a motor elétrico",
  },
  {
    id: 'jardinagem',
    title: 'Jardinagem e corte',
    text: 'Roçadeiras e motosserras para limpeza de terreno e manutenção de áreas verdes.',
    image: images.jardinagem,
    alt: 'Roçadeira e motosserra laranja sobre piso de galpão',
  },
  {
    id: 'maquinas',
    title: 'Máquinas e equipamentos',
    text: 'Compressores e máquinas de solda para oficinas, serralherias e obras.',
    image: images.maquinas,
    alt: 'Compressor de ar amarelo ao lado de uma máquina de solda',
  },
  {
    id: 'acessorios',
    title: 'Ferramentas manuais e acessórios',
    text: 'Itens do dia a dia da obra e da manutenção para completar cada serviço.',
    image: images.acessorios,
    alt: 'Mangueiras, escadas e carrinhos de mão expostos na entrada da loja FV',
    tag: 'Foto da loja',
  },
].map((c, i) => ({
  ...c,
  index: String(i + 1).padStart(2, '0'),
  href: whatsappLink(`Olá! Vim pelo site e gostaria de consultar a linha de ${c.title.toLowerCase()}.`),
}));

export const differentials = [
  {
    kicker: 'Experiência',
    title: 'Mais de 12 anos de mercado',
    text: 'Uma trajetória construída ao lado de quem trabalha com construção, manutenção, campo e indústria em Chapadinha e região.',
  },
  {
    kicker: 'Variedade',
    title: 'Muitas linhas em um só endereço',
    text: 'Ferramentas elétricas e manuais, bombas e motores, jardinagem, máquinas, itens hidráulicos e de elétrica.',
  },
  {
    kicker: 'Localização',
    title: 'Loja física em Chapadinha',
    text: 'Na Av. Ataliba Vieira de Almeida, para ver os produtos de perto e conversar com a equipe antes de decidir.',
  },
  {
    kicker: 'Atendimento',
    title: 'Atendimento próximo',
    text: 'Contato direto com a equipe, na loja ou pelo WhatsApp, para entender a aplicação e indicar o equipamento adequado.',
  },
];

export const services = [
  {
    title: 'Fornecimento para profissionais, empresas e obras',
    text: 'Ferramentas, máquinas e equipamentos para quem está com serviço em andamento. Envie sua lista e a equipe confirma o que está disponível.',
    action: {
      label: 'Enviar lista pelo WhatsApp',
      href: whatsappLink('Olá! Gostaria de enviar uma lista de produtos para consultar a disponibilidade.'),
      external: true,
    },
  },
  {
    title: 'Orientação na escolha do equipamento',
    text: 'Conte qual é o trabalho e receba a indicação do equipamento mais adequado para a aplicação antes de fechar a compra.',
    action: {
      label: 'Falar com um especialista',
      href: whatsappLink('Olá! Gostaria de uma orientação para escolher um equipamento.'),
      external: true,
    },
  },
  {
    title: 'Atendimento na loja',
    text: 'Veja os produtos de perto e converse com a equipe na Av. Ataliba Vieira de Almeida, em Chapadinha.',
    action: { label: 'Como chegar', href: links.directions, external: true },
  },
  {
    title: 'Atendimento por telefone e WhatsApp',
    text: 'Tire dúvidas, envie fotos da peça ou do equipamento e consulte produtos sem precisar sair da obra.',
    action: { label: company.phone.display, href: links.phone },
  },
];
