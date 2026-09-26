/* ==========================================================================
   CONFIGURAÇÃO DO SITE — preencha somente com informações reais.
   Tudo o que ficar vazio simplesmente não aparece no site
   (nenhum telefone, endereço, número ou avaliação é inventado).
   ========================================================================== */
window.SITE_CONFIG = {
  empresa: {
    nome: "Renove",              // nome curto, usado no logo
    descritor: "Serralheria",    // linha pequena abaixo do logo
    nomeCompleto: "Renove Serralheria"
  },

  // Cidade e região de atendimento (SEO local). Ex.: cidade: "Campinas", uf: "SP"
  local: {
    cidade: "",
    uf: "",
    regiao: "",                  // ex.: "Campinas e região"
    bairros: []                  // ex.: ["Cambuí", "Taquaral", "Barão Geraldo"]
  },

  contato: {
    whatsapp: "",                // só dígitos, com DDI e DDD. Ex.: "5519999999999"
    telefone: "",                // como deve aparecer. Ex.: "(19) 3333-3333"
    email: "",
    instagram: "",               // usuário, sem @
    endereco: { rua: "", bairro: "", cep: "" },   // cidade e UF vêm de "local"
    googleMaps: "",              // link do perfil no Google Maps (opcional)
    horario: [
      // { rotulo: "Segunda a sexta, 8h às 18h", dias: ["Mo","Tu","We","Th","Fr"], abre: "08:00", fecha: "18:00" }
    ]
  },

  // Números reais (aparecem com contador animado). Ex.: { valor: 12, prefixo: "", sufixo: "", rotulo: "anos de experiência" }
  numeros: [],

  // Avaliações reais, com autorização. Ex.: { nome: "Maria S.", servico: "Portão automático", nota: 5, texto: "…" }
  avaliacoes: {
    googleUrl: "",               // link para avaliar no Google (opcional)
    lista: []
  },

  // Projetos reais. Quando houver pelo menos um, eles substituem as ilustrações do portfólio.
  // Ex.: { titulo: "Portão de lâminas", categoria: "Residencial", imagem: "assets/img/obra-01.webp", alt: "…" }
  projetos: [],

  site: {
    url: "https://renove-local-seo.lovable.app/",
    avisoImagensIlustrativas: true
  }
};
