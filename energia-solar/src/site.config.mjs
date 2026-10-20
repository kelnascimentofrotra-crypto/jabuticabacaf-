/**
 * Configuração central do site. Depois de editar, rode `node build.mjs`.
 *
 * Tudo o que depende de validação comercial fica aqui, num único lugar.
 */
export default {
  brand: {
    // "Energia Solar" é a marca provisória presente nas referências.
    name: 'Energia Solar',
    wordmark: 'ENERGIA SOLAR',
  },

  // Apenas dígitos, com código do país e DDD. Ex.: '5591999999999'.
  // Vazio = canal pendente: os botões de WhatsApp mostram um aviso honesto
  // e não abrem conversa com ninguém.
  whatsappNumber: '',

  hero: {
    // true: mostra a arte aprovada da hero (casa + "Até 90% menos na sua conta de luz.").
    // false: troca pela hero nativa em HTML com a copy segura
    // "Menos gastos na sua conta de luz." (sem percentual).
    showOriginalArt: true,
  },

  claims: {
    // O "Até 90%" da arte ainda precisa ser validado pela empresa antes da
    // publicação. Enquanto for false, o build avisa a pendência.
    heroPercentValidated: false,
  },

  owner: {
    name: 'Eude Militão',
    role: 'Proprietário',
  },

  // Mensagens enviadas ao WhatsApp, uma por origem de clique.
  // {tipo}, {perfil} e {faixa} são preenchidos pelo site.
  messages: {
    geral: 'Olá! Vi o site de energia solar e gostaria de conversar sobre uma solução para o meu imóvel.',
    especialista: 'Olá! Vi o site de energia solar e gostaria de falar com um especialista.',
    duvidas: 'Olá! Li as dúvidas frequentes no site de energia solar e ainda tenho uma pergunta.',
    solucao: 'Olá! Tenho interesse em energia solar para um imóvel {tipo} e gostaria de uma análise.',
    projeto: 'Olá! Vi o projeto conceitual {tipo} no site de energia solar e gostaria de conversar sobre um projeto assim.',
    analise:
      'Olá! Vim pelo site de energia solar e gostaria de solicitar uma análise.\nPerfil do imóvel: {perfil}\nFaixa da conta de luz: {faixa}',
  },
};
