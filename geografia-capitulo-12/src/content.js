/* Conteúdo do capítulo: fichas das formações vegetais, faixas de latitude,
   estações, adaptações e quiz. Coordenadas em graus (lon, lat). */

window.BIOMES = [
  {
    id: "tropical", name: "Florestas equatoriais e tropicais", badge: "Faixa intertropical", color: "#4dfc8a",
    img: "amazon_aerial", goto: "s02-a",
    desc: "As florestas mais densas e ricas em espécies do planeta.",
    clima: "Quente e úmido o ano todo", veg: "Árvores altas, de folhas largas e sempre verdes", local: "Amazônia, Congo, Sudeste Asiático",
    intro: "Formam-se perto do Equador, onde o calor é constante e as chuvas são abundantes. A vegetação é densa, alta e organizada em estratos, com enorme variedade de espécies em uma pequena área.",
    strip: [["Temperatura", "24 a 28 °C"], ["Chuva anual", "acima de 2.000 mm"], ["Estações", "pouca variação"]],
    vegList: ["Árvores de 30 a 50 m, com emergentes ainda mais altas", "Folhas largas (latifoliadas) e sempre verdes", "Muitas epífitas, como bromélias e orquídeas, e cipós", "Grande variedade de espécies (heterogênea)"],
    adapt: ["Folhas com ponta afinada, que escorrem a água da chuva", "Raízes tabulares (sapopemas), que sustentam árvores enormes em solos rasos", "Copas que disputam a luz no alto do dossel"],
    pins: [["Amazônia", -62, -4], ["Bacia do Congo", 22, 0], ["Bornéu", 114, 1], ["Mata Atlântica", -43, -21], ["Nova Guiné", 143, -6]],
    fauna: "Onças, macacos, araras, tucanos, botos, preguiças e milhares de espécies de insetos.",
    threats: "Desmatamento para pecuária e lavouras, garimpo, extração ilegal de madeira e queimadas.",
    fun: "Em uma única árvore da Amazônia peruana, o biólogo Edward O. Wilson encontrou 43 espécies de formigas."
  },
  {
    id: "conifer", name: "Florestas de coníferas (taiga)", badge: "Altas latitudes · Norte", color: "#9fd2e0",
    img: "lapland", goto: "s03-a",
    desc: "O grande cinturão de pinheiros e abetos do Hemisfério Norte.",
    clima: "Frio, com invernos longos", veg: "Coníferas com folhas em forma de agulha", local: "Canadá, Escandinávia, Rússia",
    intro: "Também chamada de floresta boreal, ocupa as altas latitudes do Hemisfério Norte. Poucas espécies de árvores predominam, todas adaptadas ao frio intenso e à neve.",
    strip: [["Inverno", "abaixo de −20 °C"], ["Precipitação", "moderada, muito como neve"], ["Verão", "curto e ameno"]],
    vegList: ["Pinheiros, abetos, espruces e lariços", "Vegetação homogênea: poucas espécies", "Sub-bosque com musgos, liquens e pequenos arbustos", "Árvores de formato cônico"],
    adapt: ["Folhas em forma de agulha, cobertas de cera, que perdem pouca água", "Formato cônico: a neve escorrega e os galhos não quebram", "Folhagem perene e escura, que aproveita cada dia de Sol"],
    pins: [["Alasca", -150, 64], ["Canadá", -100, 56], ["Escandinávia", 18, 63], ["Sibéria", 100, 60], ["Extremo Oriente russo", 135, 57]],
    fauna: "Alces, renas, ursos, lobos, linces, martas e corujas.",
    threats: "Corte raso para madeira e celulose, incêndios intensificados pelo aquecimento global e pragas de insetos.",
    fun: "O lariço é uma conífera diferente: perde as agulhas no outono e fica com os galhos nus no inverno."
  },
  {
    id: "tundra", name: "Tundra", badge: "Ártico", color: "#cfeaff",
    img: "tundra_kola", goto: "s04-a",
    desc: "Vegetação rasteira sobre um solo permanentemente congelado.",
    clima: "Polar, com verão curtíssimo", veg: "Musgos, liquens e arbustos anões", local: "Norte do Canadá, Alasca, Sibéria",
    intro: "Aparece ao redor do Oceano Ártico, além do limite onde as árvores conseguem crescer. Sob a superfície está o permafrost. A vegetação é baixa e só se desenvolve no curto verão.",
    strip: [["Verão", "de 0 a 10 °C"], ["Precipitação", "menos de 250 mm"], ["Crescimento", "50 a 60 dias"]],
    vegList: ["Musgos e liquens", "Gramíneas e juncos", "Bétulas e salgueiros anões", "Flores de ciclo rápido"],
    adapt: ["Porte baixo, protegido do vento e coberto pela neve", "Crescimento em tufos e almofadas", "Ciclo de vida rápido durante o verão", "Raízes rasas, acima do permafrost"],
    pins: [["Norte do Alasca", -155, 69], ["Ártico canadense", -100, 67], ["Groenlândia (litoral)", -52, 69], ["Península de Kola", 35, 68], ["Sibéria ártica", 120, 71]],
    fauna: "Renas e caribus, bois-almiscarados, raposas-do-ártico, lemingues e aves migratórias.",
    threats: "Degelo do permafrost causado pelo aquecimento global e exploração de petróleo, gás e minérios.",
    fun: "No verão ártico, o Sol pode passar semanas sem se pôr: é o chamado Sol da meia-noite."
  },
  {
    id: "temperate", name: "Florestas temperadas", badge: "Latitudes médias", color: "#ff9a4d",
    img: "temp_autumn", goto: "s05-a",
    desc: "Florestas que mudam de cor a cada estação do ano.",
    clima: "Temperado, com quatro estações", veg: "Árvores que perdem as folhas no outono", local: "Europa, leste dos EUA, leste da Ásia",
    intro: "Desenvolvem-se nas latitudes médias, onde as quatro estações são bem definidas. Muitas árvores perdem as folhas no outono e voltam a brotar na primavera.",
    strip: [["Temperatura", "verão quente, inverno frio"], ["Chuva anual", "750 a 1.500 mm"], ["Estações", "quatro bem definidas"]],
    vegList: ["Carvalhos, faias, bordos, castanheiras e nogueiras", "Árvores latifoliadas caducifólias", "Florestas mistas com coníferas", "Sub-bosque que floresce na primavera"],
    adapt: ["Perda das folhas no outono, para poupar água e energia", "Brotação rápida na primavera", "Repouso (dormência) durante o inverno"],
    pins: [["Leste dos EUA", -80, 40], ["Europa Ocidental", 2, 48], ["Europa Central", 16, 50], ["China e Coreia", 124, 37], ["Japão", 139, 37], ["Sul do Chile", -73, -40], ["Nova Zelândia", 172, -42]],
    fauna: "Cervos, javalis, esquilos, raposas, ursos e pica-paus.",
    threats: "Ocupação antiga por cidades e agricultura: na Europa restam poucas áreas de floresta original.",
    fun: "A folha do bordo, árvore típica dessas florestas, é o símbolo da bandeira do Canadá."
  },
  {
    id: "savana", name: "Savanas", badge: "Tropical · seca marcada", color: "#f1cf6b",
    img: "savanna_serengeti", goto: "s06-c",
    desc: "Mar de gramíneas com árvores e arbustos espalhados.",
    clima: "Tropical, com estação seca", veg: "Gramíneas altas e árvores esparsas", local: "África, Cerrado, Austrália",
    intro: "Ocorrem em áreas tropicais com uma estação chuvosa e outra seca bem definidas. As gramíneas cobrem o chão, e árvores e arbustos aparecem espalhados. O fogo é um elemento natural desse ambiente.",
    strip: [["Temperatura", "quente o ano todo"], ["Chuva anual", "cerca de 500 a 1.500 mm"], ["Estações", "chuvosa e seca"]],
    vegList: ["Gramíneas que rebrotam após o fogo", "Acácias e baobás nas savanas africanas", "No Cerrado, árvores de troncos tortuosos"],
    adapt: ["Casca grossa, que protege do fogo", "Raízes profundas, que alcançam a água subterrânea", "Plantas que perdem as folhas na estação seca"],
    pins: [["Serengeti", 35, -2.3], ["Savanas da África Austral", 26, -16], ["Sahel", 5, 13], ["Cerrado", -48, -15], ["Llanos", -68, 7], ["Norte da Austrália", 133, -16]],
    fauna: "Leões, zebras, girafas e elefantes na África; lobo-guará, tamanduá-bandeira e ema no Cerrado.",
    threats: "Expansão de lavouras e pastagens, queimadas fora de época e caça.",
    fun: "O baobá armazena água no tronco e pode viver mais de mil anos."
  },
  {
    id: "pradaria", name: "Pradarias", badge: "Temperado · campos", color: "#c8d86a",
    img: "prairie", goto: "s06-c",
    desc: "Campos de gramíneas sobre solos muito férteis.",
    clima: "Temperado, chuvas moderadas", veg: "Gramíneas, quase sem árvores", local: "Grandes Planícies, Pampas",
    intro: "Formação herbácea das latitudes médias, dominada por gramíneas. Os solos escuros e ricos em matéria orgânica transformaram as pradarias em grandes áreas de produção de grãos.",
    strip: [["Temperatura", "verão quente, inverno frio"], ["Chuva anual", "cerca de 500 a 900 mm"], ["Estações", "quatro estações"]],
    vegList: ["Gramíneas altas e baixas", "Flores silvestres", "Árvores apenas perto dos rios"],
    adapt: ["Raízes profundas e emaranhadas, que resistem à seca e ao pisoteio", "Rebrota rápida após o fogo e o pastejo"],
    pins: [["Grandes Planícies (EUA)", -100, 41], ["Pradarias do Canadá", -106, 51], ["Pampa argentino", -61, -35], ["Pampa (RS, Brasil)", -54, -30]],
    fauna: "Bisões e cães-da-pradaria na América do Norte; emas e veados-campeiros no Pampa.",
    threats: "Conversão em lavouras de trigo, milho e soja e erosão do solo.",
    fun: "Nos anos 1930, a erosão nas pradarias dos EUA provocou o Dust Bowl, uma série de enormes tempestades de poeira."
  },
  {
    id: "estepe", name: "Estepes", badge: "Continental · seco", color: "#d9b26a",
    img: "steppe", goto: "s06-c",
    desc: "Gramíneas baixas em regiões secas e de invernos rigorosos.",
    clima: "Temperado continental, semiárido", veg: "Gramíneas baixas e esparsas", local: "Ucrânia, Cazaquistão, Mongólia",
    intro: "Mais seca que a pradaria, a estepe tem gramíneas baixas e espaçadas. Ocupa o interior dos continentes, longe da umidade do mar, com verões quentes e invernos muito frios.",
    strip: [["Temperatura", "grande variação no ano"], ["Chuva anual", "cerca de 250 a 500 mm"], ["Inverno", "rigoroso"]],
    vegList: ["Gramíneas baixas", "Arbustos espalhados", "Plantas que completam o ciclo na primavera"],
    adapt: ["Folhas estreitas, que perdem pouca água", "Repouso durante o verão seco e o inverno"],
    pins: [["Ucrânia", 34, 47], ["Cazaquistão", 68, 49], ["Mongólia", 105, 47], ["Patagônia", -69, -45]],
    fauna: "Cavalos-de-Przewalski, antílopes-saiga e marmotas.",
    threats: "Excesso de pastoreio, desertificação e expansão agrícola.",
    fun: "Povos nômades da Mongólia criam rebanhos na estepe há milhares de anos."
  },
  {
    id: "mediterranea", name: "Vegetação mediterrânea", badge: "Verão seco", color: "#d98bb5",
    img: "maquis", goto: "s06-c",
    desc: "Arbustos de folhas duras, adaptados à seca e ao fogo.",
    clima: "Verão seco, inverno chuvoso", veg: "Arbustos de folhas duras (esclerófilos)", local: "Mediterrâneo, Califórnia, Chile",
    intro: "Formação arbustiva típica do clima mediterrâneo, que tem verões quentes e secos e invernos amenos e chuvosos. Predominam arbustos e pequenas árvores de folhas duras.",
    strip: [["Inverno", "ameno e chuvoso"], ["Chuva anual", "cerca de 300 a 900 mm"], ["Verão", "quente e seco"]],
    vegList: ["Arbustos aromáticos, como alecrim, lavanda e tomilho", "Oliveiras e sobreiros", "Maquis, garrigue, chaparral, matorral e fynbos"],
    adapt: ["Folhas pequenas, duras e cobertas de cera", "Rebrota após incêndios", "Raízes profundas para atravessar o verão seco"],
    pins: [["Córsega", 9, 42], ["Grécia", 22, 38], ["Califórnia", -120, 36], ["Chile central", -71, -33], ["Cabo (África do Sul)", 19, -34], ["Sudoeste da Austrália", 116, -32]],
    fauna: "Lagartos, javalis, aves migratórias e muitos insetos polinizadores.",
    threats: "Incêndios, urbanização do litoral, turismo e agricultura.",
    fun: "A cortiça das rolhas é retirada da casca do sobreiro, árvore típica do Mediterrâneo."
  },
  {
    id: "desertica", name: "Vegetação de deserto", badge: "Árido", color: "#e39a5b",
    img: "desert", goto: "s06-c",
    desc: "Plantas xerófilas que sobrevivem com pouquíssima água.",
    clima: "Árido, chuvas escassas", veg: "Cactos, suculentas e arbustos", local: "Sonora, Saara, Atacama",
    intro: "Nos desertos, a chuva é rara e irregular. A vegetação é esparsa e formada por plantas xerófilas, capazes de armazenar água ou de passar longos períodos em repouso.",
    strip: [["Temperatura", "grande variação entre dia e noite"], ["Chuva anual", "menos de 250 mm"], ["Chuvas", "raras e irregulares"]],
    vegList: ["Cactos e plantas suculentas", "Arbustos espinhosos", "Plantas anuais que brotam após a chuva"],
    adapt: ["Folhas transformadas em espinhos", "Caules que armazenam água", "Raízes muito profundas ou espalhadas perto da superfície"],
    pins: [["Deserto de Sonora", -112, 31], ["Saara", 10, 23], ["Atacama", -69.5, -24], ["Kalahari", 22, -23], ["Interior da Austrália", 133, -25]],
    fauna: "Dromedários, cobras, escorpiões, lagartos e raposas-do-deserto.",
    threats: "Excesso de pastoreio e desertificação nas bordas, uso excessivo da água subterrânea.",
    fun: "O cacto saguaro pode passar de 12 metros de altura e viver mais de 150 anos."
  }
];

/* Faixas aproximadas de latitude (graus). Valores negativos = Hemisfério Sul. */
window.LAT_BANDS = [
  { id: "tropical", name: "Florestas equatoriais", color: "#4dfc8a", ranges: [[-10, 10]],
    text: "Perto do Equador, entre cerca de 10° N e 10° S, calor e chuva o ano todo formam florestas densas: Amazônia, bacia do Congo e Indonésia.",
    pins: ["Amazônia", "Bacia do Congo", "Bornéu"], from: "tropical" },
  { id: "savana", name: "Savanas", color: "#f1cf6b", ranges: [[5, 20], [-20, -5]],
    text: "Entre cerca de 5° e 20°, há uma estação seca bem marcada: gramíneas com árvores esparsas. Exemplos: Serengeti, Cerrado e Llanos.",
    pins: ["Serengeti", "Cerrado", "Llanos"], from: "savana" },
  { id: "deserto", name: "Desertos", color: "#e39a5b", ranges: [[15, 35], [-35, -15]],
    text: "Perto dos trópicos, entre 15° e 35°, o ar seco que desce das zonas de alta pressão dificulta a formação de nuvens: Saara, Atacama e desertos da Austrália.",
    pins: ["Saara", "Atacama", "Interior da Austrália"], from: "desertica" },
  { id: "mediterranea", name: "Mediterrânea", color: "#d98bb5", ranges: [[30, 42], [-38, -30]],
    text: "Entre 30° e 40°, sobretudo no lado oeste dos continentes, os verões são secos e os invernos, chuvosos. Exemplos: Mediterrâneo, Califórnia e Chile central.",
    pins: ["Córsega", "Califórnia", "Chile central"], from: "mediterranea" },
  { id: "temperada", name: "Temperadas e pradarias", color: "#ff9a4d", ranges: [[35, 55], [-55, -35]],
    text: "Nas latitudes médias, entre 35° e 55°, há florestas temperadas onde chove bem e pradarias e estepes no interior mais seco dos continentes.",
    pins: ["Europa Central", "Leste dos EUA", "Japão"], from: "temperate", extra: [["Grandes Planícies (EUA)", "pradaria"], ["Mongólia", "estepe"]] },
  { id: "taiga", name: "Taiga", color: "#9fd2e0", ranges: [[50, 70]],
    text: "Entre 50° e 70° N, os invernos são longos e muito frios. A taiga só existe no Hemisfério Norte, onde há grandes continentes nessas latitudes.",
    pins: ["Canadá", "Escandinávia", "Sibéria"], from: "conifer" },
  { id: "tundra", name: "Tundra", color: "#cfeaff", ranges: [[63, 78]],
    text: "Ao redor do Oceano Ártico, acima de cerca de 65° N, o solo fica congelado e a vegetação é rasteira.",
    pins: ["Norte do Alasca", "Ártico canadense", "Sibéria ártica"], from: "tundra" },
  { id: "gelo", name: "Gelo polar", color: "#ffffff", ranges: [[78, 90], [-90, -62]],
    text: "Nos polos, o gelo é permanente. O interior da Groenlândia e a Antártida quase não têm vegetação. Lembre-se: subir uma montanha alta também leva a paisagens frias, mesmo perto do Equador.",
    pins: [], from: null }
];

window.SEASONS = {
  primavera: { color: "#a6e35d", img: "temp_spring", text: "Primavera: os dias ficam mais longos e as árvores produzem folhas novas e flores." },
  verao: { color: "#2fbf6b", img: "temp_summer", text: "Verão: copas cheias e fotossíntese no máximo. É a época de maior crescimento." },
  outono: { color: "#ff8a3d", img: "temp_autumn", text: "Outono: os dias encurtam, a clorofila se desfaz e as folhas ficam amarelas, laranja e vermelhas antes de cair." },
  inverno: { color: "#bcd3e8", img: "temp_winter", text: "Inverno: galhos nus, muitas vezes cobertos de neve. As árvores entram em repouso até a primavera." }
};

window.ADAPT = {
  cone: ["Formato cônico", "Os galhos são mais curtos no alto e mais longos embaixo. Assim, a neve escorrega e os galhos não quebram com o peso."],
  agulha: ["Folhas em forma de agulha", "São finas e cobertas por uma camada de cera (aciculifoliadas). Expõem pouca superfície, perdem pouca água e resistem ao congelamento — no inverno, a água do solo congelado não pode ser absorvida."],
  perene: ["Sempre verde e escura", "A maioria não perde as folhas no inverno: assim que o tempo esquenta, já pode fazer fotossíntese. A cor escura absorve mais calor do Sol. Exceção: o lariço, que perde as agulhas no outono."],
  semente: ["Sementes em cones", "As coníferas são gimnospermas: não formam frutos. As sementes ficam protegidas em cones, também chamados de estróbilos — daí o nome “coníferas”."],
  resina: ["Resina", "Substância grudenta que fecha ferimentos no tronco e protege a árvore contra insetos e fungos."]
};

window.SPECTRUM = [
  { name: "Estepe", at: 7, text: "Gramíneas baixas e espaçadas, em clima seco e de invernos rigorosos. Quase não há arbustos." },
  { name: "Pradaria", at: 22, text: "Gramíneas altas e densas cobrem todo o solo; árvores só aparecem nas margens dos rios." },
  { name: "Savana", at: 50, text: "Mistura equilibrada: tapete de gramíneas com árvores e arbustos espalhados." },
  { name: "Caatinga", at: 74, text: "Arbustos e árvores baixas, muitas com espinhos, e cactos. Na seca, quase todas perdem as folhas." },
  { name: "Mediterrânea", at: 92, text: "Arbustos densos de folhas duras; as gramíneas ficam em segundo plano." }
];

window.QUIZ = [
  { q: "Quais condições explicam as florestas densas da faixa equatorial?",
    o: ["Temperaturas altas e chuvas abundantes durante todo o ano", "Solos sempre muito férteis e profundos", "Invernos rigorosos e verões curtos", "Baixa umidade do ar e ventos fortes"], a: 0,
    e: "Calor constante e muita chuva permitem crescimento o ano inteiro. Os solos tropicais, aliás, costumam ser pobres: a fertilidade vem da decomposição rápida das folhas." },
  { q: "Folhas em forma de agulha e copa em formato de cone são adaptações típicas de qual formação?",
    o: ["Savana", "Floresta equatorial", "Floresta de coníferas (taiga)", "Vegetação mediterrânea"], a: 2,
    e: "As agulhas perdem pouca água e resistem ao congelamento, e o formato cônico faz a neve escorregar sem quebrar os galhos." },
  { q: "O que é o permafrost?",
    o: ["Um tipo de líquen que alimenta as renas", "A camada do subsolo que permanece congelada o ano todo", "O vento gelado que sopra na tundra", "A estação chuvosa do Ártico"], a: 1,
    e: "O permafrost fica congelado por pelo menos dois anos seguidos. No verão, só a camada ativa, na superfície, descongela." },
  { q: "Por que muitas árvores das florestas temperadas perdem as folhas no outono?",
    o: ["Para economizar água e energia durante o inverno frio", "Porque chove demais no outono", "Para atrair animais polinizadores", "Porque o solo fica quente demais"], a: 0,
    e: "São árvores caducifólias. No inverno, o solo congelado dificulta a absorção de água; sem folhas, a árvore perde menos água e entra em repouso." },
  { q: "Clima tropical com estação seca bem marcada, gramíneas e árvores espalhadas. Que formação é essa?",
    o: ["Tundra", "Taiga", "Estepe", "Savana"], a: 3,
    e: "As savanas, como o Serengeti e o Cerrado, combinam um tapete de gramíneas com árvores e arbustos esparsos." },
  { q: "Qual é a diferença entre pradarias e estepes?",
    o: ["As estepes são florestas densas e as pradarias, desertos", "As estepes são mais secas e têm gramíneas mais baixas e esparsas", "As pradarias só existem perto dos polos", "As duas são dominadas por cactos"], a: 1,
    e: "Ambas são formações herbáceas de clima temperado, mas a estepe recebe menos chuva — por isso o capim é mais baixo e espaçado." },
  { q: "Qual descrição combina com a vegetação mediterrânea?",
    o: ["Arbustos de folhas duras, adaptados a verões quentes e secos", "Árvores latifoliadas e perenes de clima equatorial", "Musgos e liquens sobre solo congelado", "Coníferas que suportam invernos de −40 °C"], a: 0,
    e: "No clima mediterrâneo chove no inverno e o verão é seco. Arbustos de folhas duras, como os do maquis e do chaparral, resistem à seca e ao fogo." },
  { q: "Qual conjunto de características descreve a vegetação da floresta equatorial?",
    o: ["Aciculifoliada e homogênea", "Latifoliada, perenifólia e heterogênea", "Rasteira, com liquens e musgos", "Caducifólia, com quatro estações"], a: 1,
    e: "Folhas largas, sempre verdes e enorme variedade de espécies, organizadas em estratos." },
  { q: "Por que o degelo do permafrost preocupa os cientistas?",
    o: ["Porque transforma a tundra em floresta tropical", "Porque diminui o efeito estufa", "Porque libera gás carbônico e metano, intensificando o aquecimento global", "Porque não tem relação com o clima"], a: 2,
    e: "A matéria orgânica congelada há milhares de anos se decompõe ao descongelar e libera gases de efeito estufa — um ciclo que alimenta mais aquecimento." },
  { q: "Qual ação ajuda a recuperar áreas degradadas?",
    o: ["Usar queimadas para limpar o terreno", "Ampliar o garimpo nas margens dos rios", "Drenar nascentes para abrir pastagens", "Reflorestar com espécies nativas e proteger as matas ciliares"], a: 3,
    e: "Mudas nativas e matas ciliares protegem o solo, as nascentes e os rios, e devolvem o habitat à fauna." }
];

window.SECTION_NAMES = {
  abertura: "Abertura",
  s01: "A cobertura verde do planeta azul",
  s02: "Florestas equatoriais e tropicais",
  s03: "Florestas de coníferas",
  s04: "Tundra",
  s05: "Florestas temperadas",
  s06: "Formações arbustivas e herbáceas",
  s07: "O ser humano e a natureza",
  s08: "Exercitando o que aprendemos",
  s09: "Encerramento"
};
