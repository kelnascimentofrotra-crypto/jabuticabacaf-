import type { QuickReply } from '../types';

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'pedir-15-min',
    titulo: 'Pedir 15 minutos de conversa',
    texto:
      'Acho que fica mais fácil te mostrar do que explicar por mensagem. Você teria 15 minutos esta semana para uma chamada rápida? Pode ser [dia] às [hora] ou [dia] às [hora].',
  },
  {
    id: 'confirmar-recebimento',
    titulo: 'Confirmar que vai responder depois',
    texto: 'Recebi, [nome]! Vou olhar com calma e te respondo até [dia/horário]. Obrigado pela paciência.',
  },
  {
    id: 'enviar-portfolio',
    titulo: 'Enviar portfólio com contexto',
    texto:
      'Separei três projetos que têm mais a ver com o seu negócio. Em cada um coloquei o que o cliente precisava resolver e o que foi feito: [links]. Algum deles se parece com o que você imagina?',
  },
  {
    id: 'explicar-etapas',
    titulo: 'Explicar as etapas do projeto',
    texto:
      'Funciona assim: (1) conversa para entender o negócio; (2) você aprova a estrutura e o visual; (3) eu desenvolvo e te mostro prévias; (4) ajustes; (5) publicação e treinamento. Você acompanha e aprova cada etapa.',
  },
  {
    id: 'pedir-material',
    titulo: 'Pedir material para começar',
    texto:
      'Para começarmos, preciso de: logo (se tiver), algumas fotos do seu trabalho, lista de serviços e seus contatos. Pode me mandar aos poucos por aqui. O que faltar a gente resolve junto.',
  },
  {
    id: 'faixa-de-preco',
    titulo: 'Passar faixa de preço sem fugir',
    texto:
      'Projetos assim costumam ficar entre R$ [faixa], dependendo de quantas páginas e funções. Me responde duas perguntas rápidas que eu te passo o valor exato: o que o site precisa fazer e se você já tem logo e fotos?',
  },
  {
    id: 'proposta-enviada',
    titulo: 'Avisar que a proposta foi enviada',
    texto:
      'Proposta enviada, [nome]! Ela tem o que será feito, prazo e investimento. Quer que eu te explique em 10 minutos por chamada ou prefere ler com calma e me mandar as dúvidas?',
  },
  {
    id: 'combinar-retorno',
    titulo: 'Combinar data de retorno',
    texto: 'Combinado! Posso te chamar na [dia] para retomarmos? Se surgir qualquer dúvida antes, é só me mandar.',
  },
  {
    id: 'encerrar-educado',
    titulo: 'Encerrar com elegância',
    texto:
      'Entendido, [nome], e obrigado pela sinceridade. Vou parar de te chamar sobre isso. Se em algum momento fizer sentido, é só me procurar. Sucesso!',
  },
  {
    id: 'pos-entrega',
    titulo: 'Mensagem pós-entrega',
    texto:
      'O site está no ar, [nome]! Te mandei os acessos e o vídeo de treinamento. Nos próximos [N] dias, qualquer ajuste ou dúvida, é só me chamar. Se ficou satisfeito, uma indicação ou avaliação ajuda muito o meu trabalho.',
  },
  {
    id: 'pedir-indicacao',
    titulo: 'Pedir indicação sem constrangimento',
    texto:
      'Que bom que você gostou do resultado! Você conhece algum outro empresário que esteja passando pela mesma situação que você estava? Se puder me apresentar, prometo cuidar com o mesmo carinho.',
  },
  {
    id: 'alinhar-escopo',
    titulo: 'Alinhar pedido fora do escopo',
    texto:
      'Ótima ideia! Esse item não estava no escopo que aprovamos, então vou te mandar o impacto em prazo e valor para você decidir se entra agora ou numa próxima fase. Enquanto isso, sigo com o cronograma combinado.',
  },
];

/** Exemplos exibidos sob a busca principal do painel. */
export const SEARCH_EXAMPLES = [
  'Já tenho Instagram.',
  'Está muito caro.',
  'Meu sobrinho faz um site.',
  'Vou pensar e te aviso.',
  'Não preciso de um sistema.',
  'Me mande uma proposta.',
  'Preciso falar com meu sócio.',
  'Como sei que você vai entregar?',
  'Não quero pagar mensalidade.',
  'Já tenho um site.',
];

/**
 * Seleção editorial usada no painel enquanto não houver dados reais
 * de uso suficientes para montar o ranking.
 */
export const EDITORIAL_TOP = [
  'esta-muito-caro',
  'ja-tenho-instagram',
  'vou-pensar',
  'manda-os-precos',
  'sobrinho-faz',
  'falar-com-socio',
  'nao-quero-mensalidade',
  'medo-nao-entregar',
];
