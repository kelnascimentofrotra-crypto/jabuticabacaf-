/**
 * Conteúdo do site, separado da apresentação.
 *
 * As coordenadas dos hotspots estão em pixels da arte original
 * ([x0, y0, x1, y1]) e foram medidas na inspeção de cada arquivo.
 * O build converte para porcentagens relativas à própria imagem.
 */

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'solucoes', label: 'Soluções' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'duvidas', label: 'Dúvidas' },
  { id: 'contato', label: 'Contato' },
];

export const hero = {
  kicker: 'Seu telhado pode render mais',
  // Copy segura, usada enquanto o percentual não for validado.
  titleSafe: { accent: 'Menos gastos', rest: 'na sua conta de luz.' },
  // Texto da arte original (só aparece com claims.heroPercentValidated).
  titleClaim: 'Até 90% menos na sua conta de luz.',
  support: ['Gaste menos com energia.', 'Abra espaço para novos planos.'],
  primary: 'Descobrir minha economia',
  secondary: 'Falar com especialista',
  note: 'A economia varia conforme o projeto e o consumo.',
};

export const sections = {
  solucoes: {
    kicker: 'Soluções sob medida',
    title: ['Seu espaço.', 'Sua energia.'],
    titleAccent: 'Sua economia.',
    lead: 'Uma solução solar para cada realidade. Encontre a ideal para você.',
  },
  'como-funciona': {
    kicker: 'Como funciona',
    title: ['Da sua conta', 'à sua própria'],
    titleAccent: 'energia.',
    lead: 'Simples de entender. Feito para você.',
  },
  projetos: {
    kicker: 'Projetos',
    title: ['Energia que transforma'],
    titleAccent: 'o cenário.',
    lead: 'Explore possibilidades para sua casa, sua empresa e o seu campo.',
  },
  duvidas: {
    kicker: 'Dúvidas frequentes',
    titleAccentFirst: 'Clareza',
    title: ['para dar o próximo passo.'],
    lead: 'As respostas que você procura sobre energia solar.',
  },
  contato: {
    kicker: 'Vamos conversar',
    title: ['A próxima conta de luz', 'pode contar'],
    titleAccent: 'outra história.',
    lead: 'Converse com a nossa equipe e descubra uma solução solar para o seu imóvel.',
    cta: 'Conversar pelo WhatsApp',
    complement: 'Sua economia começa com uma boa conversa.',
  },
};

export const solutions = [
  { id: 'residencial', label: 'Residencial', text: 'Economize na conta e valorize seu imóvel.' },
  { id: 'empresarial', label: 'Empresarial', text: 'Reduza custos e invista no seu crescimento.' },
  { id: 'rural', label: 'Rural', text: 'Mais eficiência para a sua produção.' },
];

export const steps = [
  { title: 'Análise do seu consumo', text: 'Entendemos sua conta de luz e sua rotina.' },
  { title: 'Projeto sob medida', text: 'Uma solução pensada para o seu imóvel.' },
  { title: 'Instalação e conexão', text: 'Da montagem à conexão com a rede.' },
  { title: 'Geração e acompanhamento', text: 'Acompanhe a energia que você produz.' },
];

// Vitrine conceitual. Só existe uma cena aprovada; novos itens entram aqui
// e o contador e as setas passam a funcionar sozinhos.
export const projects = [
  {
    tipo: 'residencial',
    kicker: 'Projeto conceitual • Residencial',
    title: 'Um novo olhar para o seu telhado.',
    text: 'Arquitetura e energia solar em perfeita sintonia.',
  },
];

export const projectTypes = [
  {
    id: 'residencial',
    label: 'Residencial',
    empty: '',
  },
  {
    id: 'empresarial',
    label: 'Empresarial',
    empty: 'Ainda não há uma cena de projeto empresarial nesta vitrine. Converse com a equipe para avaliar o telhado ou a área disponível da sua empresa.',
  },
  {
    id: 'rural',
    label: 'Rural',
    empty: 'Ainda não há uma cena de projeto rural nesta vitrine. Converse com a equipe para avaliar a sua propriedade e a sua produção.',
  },
];

// Conteúdo sugerido no briefing; revisar com a operação da empresa.
export const faq = [
  {
    q: 'Como descubro minha economia?',
    a: 'Começamos pela sua conta de luz e pelo perfil do imóvel. Assim, avaliamos uma solução adequada ao seu consumo.',
  },
  {
    q: 'O sistema funciona em dias nublados?',
    a: 'Os painéis também aproveitam a luz difusa, mas a geração varia com a luminosidade e com as condições do sistema. A análise do projeto considera essas variações.',
  },
  {
    q: 'Como funciona a instalação?',
    a: 'A equipe avalia o imóvel, define o projeto e orienta as etapas de montagem e conexão necessárias para aquela instalação.',
  },
  {
    q: 'Posso instalar na minha empresa ou no campo?',
    a: 'A viabilidade depende das características do imóvel, do consumo e do espaço disponível. Converse com a equipe para avaliar seu caso.',
  },
  {
    q: 'Como acompanho a energia gerada?',
    a: 'O acompanhamento depende dos equipamentos e da solução de monitoramento previstos no projeto. A equipe deve orientar o uso dos recursos disponíveis.',
  },
];

// Pré-análise: só perfil do imóvel e faixa da conta. Não calcula economia.
export const analysis = {
  perfis: [
    { id: 'Residencial', hint: 'Casa ou apartamento' },
    { id: 'Empresarial', hint: 'Comércio, escritório ou indústria' },
    { id: 'Rural', hint: 'Propriedade rural ou produção' },
  ],
  faixas: [
    'Até R$ 300',
    'De R$ 300 a R$ 700',
    'De R$ 700 a R$ 1.500',
    'Acima de R$ 1.500',
    'Prefiro informar na conversa',
  ],
};

/* ------------------------------------------------------------------ */
/* Artes aprovadas (modo B: composição integral)                      */
/* ------------------------------------------------------------------ */

// Ações dos hotspots:
//   nav:<id>               rola até a seção
//   menu                   abre o menu (artes mobile)
//   analise                abre a pré-análise
//   wa:<mensagem>[:<tipo>] WhatsApp com a mensagem daquela origem
//   deck:<deck>[:<item>]   abre o painel HTML real da seção (desktop)
//                          ou leva ao painel nativo (celular/tablet)

const navDesk = (xs, y0 = 34, y1 = 85) => {
  // xs são as divisas entre os links: 7 valores = 6 links (com Dúvidas).
  const ids = xs.length === 7
    ?['inicio', 'solucoes', 'como-funciona', 'projetos', 'duvidas', 'contato']
    : ['inicio', 'solucoes', 'como-funciona', 'projetos', 'contato'];
  return ids.map((id, i) => ({
    box: [xs[i], y0, xs[i + 1], y1],
    action: `nav:${id}`,
    kind: 'nav',
    label: nav.find((n) => n.id === id).label,
  }));
};

const logo = (box) => ({ box, action: 'nav:inicio', kind: 'logo', label: 'Energia Solar — voltar ao início' });
const proposta = (box) => ({ box, action: 'analise', kind: 'cta', label: 'Solicitar proposta' });
const menu = (box) => ({ box, action: 'menu', kind: 'menu', label: 'Abrir menu' });

export const arts = {
  inicio: {
    file: '01-hero',
    desktop: {
      size: [1672, 941],
      spots: [
        logo([80, 28, 316, 90]),
        ...navDesk([520, 635, 742, 906, 1029, 1152]),
        proposta([1366, 29, 1588, 88]),
        { box: [92, 810, 442, 872], action: 'analise', kind: 'cta', primary: true, label: 'Descobrir minha economia' },
        { box: [456, 810, 740, 872], action: 'wa:especialista', kind: 'cta', label: 'Falar com especialista pelo WhatsApp' },
      ],
    },
    mobile: {
      size: [934, 1684],
      spots: [
        logo([70, 38, 446, 130]),
        menu([784, 40, 880, 130]),
        { box: [80, 1348, 856, 1466], action: 'analise', kind: 'cta', primary: true, label: 'Descobrir minha economia' },
        { box: [80, 1472, 856, 1586], action: 'wa:especialista', kind: 'cta', label: 'Falar com especialista pelo WhatsApp' },
      ],
    },
    alt: 'Casa moderna com painéis solares no telhado ao anoitecer, com o título “Até 90% menos na sua conta de luz.” atrás do telhado e os botões Descobrir minha economia e Falar com especialista.',
  },

  solucoes: {
    file: '02-solucoes',
    desktop: {
      size: [1672, 941],
      spots: [
        logo([80, 28, 316, 90]),
        ...navDesk([518, 613, 753, 905, 1028, 1158]),
        proposta([1366, 29, 1588, 89]),
        { box: [94, 490, 528, 582], action: 'deck:solucoes:residencial', kind: 'row', label: 'Residencial — Economize na conta e valorize seu imóvel.' },
        { box: [94, 584, 528, 676], action: 'deck:solucoes:empresarial', kind: 'row', label: 'Empresarial — Reduza custos e invista no seu crescimento.' },
        { box: [94, 678, 528, 770], action: 'deck:solucoes:rural', kind: 'row', label: 'Rural — Mais eficiência para a sua produção.' },
        { box: [93, 801, 462, 870], action: 'deck:solucoes', kind: 'cta', primary: true, label: 'Encontrar minha solução' },
      ],
    },
    mobile: {
      size: [934, 1683],
      spots: [
        logo([50, 24, 392, 112]),
        menu([802, 24, 896, 114]),
        { box: [56, 1092, 880, 1226], action: 'deck:solucoes:residencial', kind: 'row', label: 'Residencial — Economia para sua casa.' },
        { box: [56, 1228, 880, 1366], action: 'deck:solucoes:empresarial', kind: 'row', label: 'Empresarial — Menos custos para crescer.' },
        { box: [56, 1368, 880, 1498], action: 'deck:solucoes:rural', kind: 'row', label: 'Rural — Eficiência para sua produção.' },
        { box: [54, 1510, 880, 1628], action: 'deck:solucoes', kind: 'cta', primary: true, label: 'Encontrar minha solução' },
      ],
    },
    alt: 'Paisagem ao entardecer que reúne uma residência, um galpão empresarial e uma área rural com painéis solares, ao lado do título “Seu espaço. Sua energia. Sua economia.” e das opções Residencial, Empresarial e Rural.',
  },

  'como-funciona': {
    file: '03-como-funciona',
    desktop: {
      size: [1672, 941],
      spots: [
        logo([82, 30, 330, 90]),
        ...navDesk([499, 602, 717, 918, 1035, 1172]),
        proposta([1357, 29, 1599, 90]),
        ...[[446, 526], [528, 610], [612, 694], [696, 780]].map(([y0, y1], i) => ({
          box: [1118, y0, 1640, y1],
          action: `deck:como-funciona:${i + 1}`,
          kind: 'row',
          label: `Etapa ${String(i + 1).padStart(2, '0')}: ${steps[i].title}`,
        })),
        { box: [1124, 792, 1600, 866], action: 'analise', kind: 'cta', primary: true, label: 'Começar minha análise' },
      ],
    },
    mobile: {
      size: [933, 1686],
      spots: [
        logo([48, 20, 388, 106]),
        menu([789, 20, 881, 105]),
        ...[[1106, 1198], [1200, 1304], [1306, 1410], [1412, 1512]].map(([y0, y1], i) => ({
          box: [52, y0, 884, y1],
          action: `deck:como-funciona:${i + 1}`,
          kind: 'row',
          label: `Etapa ${String(i + 1).padStart(2, '0')}: ${steps[i].title}`,
        })),
        { box: [56, 1520, 878, 1630], action: 'analise', kind: 'cta', primary: true, label: 'Começar minha análise' },
      ],
    },
    alt: 'Dois técnicos instalam painéis solares no telhado de uma casa sob céu rosado, ao lado do título “Da sua conta à sua própria energia.” e das quatro etapas do processo.',
  },

  projetos: {
    file: '04-projetos',
    desktop: {
      size: [1672, 941],
      spots: [
        logo([82, 30, 328, 90]),
        ...navDesk([497, 602, 724, 887, 1049, 1172], 33, 86),
        proposta([1356, 28, 1599, 90]),
        { box: [1256, 211, 1381, 262], action: 'deck:projetos:residencial', kind: 'tab', label: 'Projetos residenciais' },
        { box: [1381, 211, 1503, 262], action: 'deck:projetos:empresarial', kind: 'tab', label: 'Projetos empresariais' },
        { box: [1503, 211, 1598, 262], action: 'deck:projetos:rural', kind: 'tab', label: 'Projetos rurais' },
        { box: [87, 809, 507, 882], action: 'wa:projeto:residencial', kind: 'cta', primary: true, label: 'Quero um projeto assim — conversar pelo WhatsApp' },
      ],
    },
    mobile: {
      size: [934, 1683],
      spots: [
        logo([60, 34, 390, 120]),
        menu([796, 36, 880, 120]),
        { box: [80, 510, 276, 590], action: 'deck:projetos:residencial', kind: 'tab', label: 'Projetos residenciais' },
        { box: [276, 510, 470, 590], action: 'deck:projetos:empresarial', kind: 'tab', label: 'Projetos empresariais' },
        { box: [470, 510, 628, 590], action: 'deck:projetos:rural', kind: 'tab', label: 'Projetos rurais' },
        { box: [68, 1486, 870, 1590], action: 'wa:projeto:residencial', kind: 'cta', primary: true, label: 'Quero um projeto assim — conversar pelo WhatsApp' },
      ],
    },
    alt: 'Projeto conceitual: casa com dois blocos de painéis solares e piscina iluminada sob o pôr do sol, com o título “Energia que transforma o cenário.” Imagem ilustrativa.',
    note: 'Os controles desenhados na arte (setas e contador) são apenas apresentação visual. A vitrine real tem uma cena conceitual: 01 de 01.',
  },

  duvidas: {
    file: '05-duvidas',
    desktop: {
      size: [1672, 941],
      spots: [
        logo([82, 30, 328, 90]),
        ...navDesk([481, 583, 697, 855, 949, 1088, 1190]),
        proposta([1344, 29, 1588, 90]),
        { box: [480, 310, 1198, 372], action: 'deck:duvidas:busca', kind: 'row', label: 'Buscar nas dúvidas frequentes' },
        ...[[386, 520], [522, 582], [584, 646], [648, 712], [714, 780]].map(([y0, y1], i) => ({
          box: [480, y0, 1198, y1],
          action: `deck:duvidas:${i + 1}`,
          kind: 'row',
          label: faq[i].q,
        })),
        { box: [754, 820, 1132, 884], action: 'wa:duvidas', kind: 'cta', primary: true, label: 'Falar com um especialista pelo WhatsApp' },
      ],
    },
    mobile: {
      size: [934, 1684],
      spots: [
        logo([50, 26, 394, 114]),
        menu([796, 22, 890, 110]),
        { box: [146, 622, 788, 712], action: 'deck:duvidas:busca', kind: 'row', label: 'Buscar nas dúvidas frequentes' },
        ...[[736, 964], [976, 1068], [1070, 1156], [1158, 1282], [1286, 1382]].map(([y0, y1], i) => ({
          box: [146, y0, 788, y1],
          action: `deck:duvidas:${i + 1}`,
          kind: 'row',
          label: faq[i].q,
        })),
        { box: [100, 1494, 836, 1618], action: 'wa:duvidas', kind: 'cta', primary: true, label: 'Falar com especialista pelo WhatsApp' },
      ],
    },
    alt: 'Painéis solares refletindo o céu avermelhado emolduram uma caixa clara de perguntas frequentes, abaixo do título “Clareza para dar o próximo passo.”',
  },

  contato: {
    file: '06-contato',
    desktop: {
      size: [1672, 941],
      spots: [
        logo([82, 30, 328, 92]),
        ...navDesk([481, 582, 696, 854, 960, 1053, 1189], 34, 87),
        proposta([1342, 28, 1589, 92]),
        { box: [93, 660, 575, 742], action: 'wa:geral', kind: 'cta', primary: true, label: 'Conversar pelo WhatsApp' },
      ],
    },
    mobile: {
      size: [934, 1685],
      spots: [
        logo([54, 30, 384, 116]),
        menu([802, 28, 886, 112]),
        { box: [60, 1476, 876, 1596], action: 'wa:geral', kind: 'cta', primary: true, label: 'Conversar pelo WhatsApp' },
      ],
    },
    alt: 'Eude Militão, proprietário, de camisa polo azul-marinho com a marca Energia Solar e braços cruzados, diante de uma casa com painéis solares ao pôr do sol. Título: “A próxima conta de luz pode contar outra história.”',
  },
};
