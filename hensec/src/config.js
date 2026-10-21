/**
 * Configuração central de contato da HENSEC.
 *
 * TODO(HENSEC): informar o número oficial de WhatsApp.
 * Formato internacional, apenas dígitos: 55 + DDD + número.
 * Exemplo de formato (NÃO é o número real): '5511900000000'.
 *
 * Enquanto estiver vazio, os botões abrem o WhatsApp com a mensagem
 * já preenchida, mas sem destinatário (a pessoa escolhe o contato).
 */
export const WHATSAPP_NUMBER = '';

/**
 * Mensagens pré-preenchidas por botão. A chave corresponde ao atributo
 * `data-wa` de cada link no index.html.
 */
export const WHATSAPP_MESSAGES = {
  geral: 'Olá, Hensec! Vim pelo site e gostaria de conversar sobre segurança.',
  seguranca: 'Olá! Quero mais segurança para meu imóvel.',
  cameras: 'Olá, Hensec! Gostaria de conhecer a solução de câmeras de segurança.',
  alarmes: 'Olá, Hensec! Gostaria de conhecer a solução de sistemas de alarme.',
  acesso: 'Olá, Hensec! Gostaria de conhecer a solução de controle de acesso.',
  escolha: 'Olá, Hensec! Quero ajuda para entender qual solução faz sentido para mim.',
  conversar: 'Olá, Hensec! Gostaria de conversar sobre a segurança do meu espaço.',
  chamar: 'Olá, Hensec! Quero contar o que preciso proteger.',
  duvidas: 'Olá, Hensec! Tenho algumas dúvidas sobre as soluções de vocês.',
};
