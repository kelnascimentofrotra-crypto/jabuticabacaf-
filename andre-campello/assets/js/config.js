/*
 * ============================================================
 *  CONFIGURAÇÃO DO SITE — André Campello · Agro Assessoria Jurídica
 * ============================================================
 *  Preencha os campos abaixo quando os dados estiverem disponíveis.
 *  Campos vazios ("") ficam ocultos ou usam um comportamento seguro:
 *  os botões levam ao formulário de contato em vez de abrir um canal
 *  que ainda não existe.
 * ============================================================
 */
window.SITE_CONFIG = {
  // WhatsApp: somente números, com DDI + DDD. Ex.: "5562999999999"
  whatsapp: "",

  // Mensagem inicial ao abrir o WhatsApp pelos botões do site
  whatsappMessage: "Olá! Vim pelo site e gostaria de falar com a equipe da André Campello Agro Assessoria Jurídica.",

  // E-mail de contato. Ex.: "contato@seudominio.com.br"
  email: "",

  // Usuário do Instagram (sem @) — informado nas referências
  instagram: "agroassessoria.adv",

  // Link completo do Linktree. Ex.: "https://linktr.ee/seuusuario"
  linktree: "",

  // Endpoint para receber o formulário (Formspree, Getform, backend próprio…).
  // Ex.: "https://formspree.io/f/xxxxxxx". Se vazio, o formulário usa
  // o WhatsApp e, na falta dele, o e-mail configurado acima.
  formEndpoint: "",

  // Registro profissional exibido no rodapé. Ex.: "OAB/GO 00.000"
  oab: "",

  // Endereço ou cidade de atendimento exibido no rodapé (opcional)
  endereco: ""
};
