import type { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'barbearia-sem-necessidade',
    titulo: 'Dono de barbearia que não vê necessidade de site',
    persona: 'Marcos, 34 anos, dono de uma barbearia com 3 cadeiras. Atende o dia todo e responde mensagens nos intervalos.',
    nicho: 'barbearias',
    servico: 'site-negocio-local',
    contexto: 'Você mandou uma mensagem pelo WhatsApp depois de ver o Instagram da barbearia.',
    objetivoTreino: 'Valorizar o canal atual e descobrir uma dor real antes de oferecer qualquer coisa.',
    dificuldade: 'media',
    rodadas: [
      {
        cliente: 'Fala, mano. Já tenho Instagram, meus clientes me acham lá. Não preciso de site não.',
        palavrasValor: ['instagram', 'agenda', 'agendar', 'horário', 'serviços', 'endereço', 'google', 'perguntas', 'complementar', 'whatsapp'],
        respostaModelo:
          'Boa! O Instagram ajuda bastante na divulgação, e a ideia não seria substituir. Só por curiosidade: hoje, quando alguém quer marcar, ele chama no direct ou no WhatsApp? Você consegue responder no meio dos cortes?',
        porque:
          'Concordar com o valor do Instagram baixa a defesa. A pergunta sobre agendamento investiga uma dor provável (responder mensagens durante o trabalho) sem afirmar nada que você não sabe.',
      },
      {
        cliente: 'Respondo quando dá. Às vezes demoro, mas o cliente espera.',
        clienteFrio: 'Cara, tô no meio de um corte. Fala logo o que você quer vender.',
        palavrasValor: ['horário', 'noite', 'fora', 'link', 'sozinho', 'agenda', 'tempo', 'perder', 'outro', 'lembrete'],
        respostaModelo:
          'Faz sentido. E quem manda mensagem às 22h querendo horário para amanhã — consegue marcar ou espera até você responder? Uma agenda online deixa o cliente escolher o horário sozinho, a qualquer hora, e você continua com o Instagram e o WhatsApp como estão.',
        porque:
          'A resposta aprofunda a dor com uma situação concreta (mensagem fora de hora) e só então apresenta a solução, ligada ao que ele disse, sem desmerecer o processo atual.',
      },
      {
        cliente: 'Tá, e quanto custa isso? Porque se for caro nem adianta.',
        clienteFrio: 'Não sei não... deve ser caro. Quanto é?',
        palavrasValor: ['corte', 'cortes', 'faixa', 'simples', 'começar', 'link', 'agenda', 'mês', 'valor', 'mostrar'],
        respostaModelo:
          'Te passo sim: uma página simples com serviços, preços, endereço e agenda online fica entre R$ [faixa], o equivalente a alguns cortes por mês no primeiro ano. Se quiser, te mostro um exemplo em 10 minutos e você vê se faz sentido para a barbearia.',
        porque:
          'Responde o preço sem rodeio, ancora no próprio negócio dele (valor de cortes) e termina com um próximo passo pequeno e opcional.',
      },
    ],
    dicas: [
      'Não diga que ele está perdendo clientes sem evidência.',
      'Use as palavras dele: "cortes", "cadeira", "direct".',
      'Mensagens curtas: ele está atendendo.',
    ],
  },
  {
    id: 'medico-credibilidade',
    titulo: 'Médico preocupado com credibilidade e privacidade',
    persona: 'Dra. Helena, dermatologista, consultório próprio, 45 anos. Muito cuidadosa com a imagem profissional.',
    nicho: 'clinicas-medicas',
    servico: 'site-profissional',
    contexto: 'Ela aceitou uma ligação depois de uma indicação de um colega.',
    objetivoTreino: 'Transmitir segurança, respeitar regras éticas e tratar privacidade com seriedade.',
    dificuldade: 'alta',
    rodadas: [
      {
        cliente: 'Olha, eu não gosto dessas coisas de marketing médico. Acho que desvaloriza a profissão.',
        palavrasValor: ['sóbrio', 'informativo', 'crm', 'cfm', 'regras', 'validar', 'formação', 'paciente', 'credibilidade', 'sem promessa'],
        respostaModelo:
          'Concordo com a senhora, e não é esse o caminho. A proposta é um site sóbrio e informativo: formação, CRM, RQE, especialidades e como agendar — dentro das regras do CFM e com todo o conteúdo validado pela senhora antes de publicar.',
        porque:
          'Valida a preocupação ética e reposiciona o site como informação, não marketing. Citar CRM/RQE e validação mostra que você conhece o contexto regulatório.',
      },
      {
        cliente: 'E a privacidade dos pacientes? Não quero ninguém mandando foto de lesão por formulário.',
        clienteFrio: 'Não sei se você entende como funciona um consultório médico.',
        palavrasValor: ['lgpd', 'mínimo', 'nome', 'contato', 'aviso', 'privacidade', 'não armazena', 'sistema', 'prontuário', 'sensível'],
        respostaModelo:
          'Faz todo sentido. O formulário pede só nome, contato e o motivo geral da consulta, com aviso de privacidade, e não aceita anexos. Dados clínicos continuam somente no prontuário da senhora. Dado de saúde é sensível pela LGPD, e o site é construído para coletar o mínimo.',
        porque:
          'Resposta concreta, com o que será e o que não será coletado, mostra domínio técnico e respeito ao sigilo médico.',
      },
      {
        cliente: 'Certo. E se eu quiser tirar algo do ar depois?',
        clienteFrio: 'Não sei... e se eu me arrepender e quiser tirar tudo do ar?',
        palavrasValor: ['acesso', 'painel', 'domínio', 'seu nome', 'contrato', 'alterar', 'remover', 'autonomia', 'suporte', 'prazo'],
        respostaModelo:
          'A senhora terá controle total: domínio no seu nome, acesso ao painel e um prazo de atendimento definido em contrato para qualquer alteração ou remoção. Se preferir, posso te mostrar um exemplo de site de consultório nesse formato numa conversa de 15 minutos.',
        porque: 'Responde com garantias concretas (propriedade, controle, contrato) e propõe um próximo passo de baixo risco.',
      },
    ],
    dicas: ['Linguagem formal e precisa.', 'Nunca prometa resultados ou "mais pacientes".', 'Mostre conhecimento de CFM, CRM/RQE e LGPD.'],
  },
  {
    id: 'corretor-portais',
    titulo: 'Corretor que já utiliza portais imobiliários',
    persona: 'Ricardo, corretor autônomo há 8 anos, carteira de 40 imóveis, investe em dois portais.',
    nicho: 'corretores-de-imoveis',
    servico: 'sis-imobiliaria',
    contexto: 'Ele respondeu a sua mensagem no WhatsApp, mas está cético.',
    objetivoTreino: 'Complementar o canal atual sem atacá-lo e mostrar a vantagem da carteira própria.',
    dificuldade: 'media',
    rodadas: [
      {
        cliente: 'Eu já pago dois portais. Meus leads vêm de lá. Para que eu ia querer site?',
        palavrasValor: ['portais', 'continuar', 'carteira', 'concorrente', 'indicação', 'instagram', 'link', 'seus imóveis', 'investe', 'complementar'],
        respostaModelo:
          'Faz sentido manter os portais, eles trazem volume. A pergunta é: quando você manda um imóvel para alguém que veio por indicação ou Instagram, ele abre o link do portal e vê imóveis de outros corretores ao lado. Com um site seu, ele navega só na sua carteira. Quanto você investe nos portais hoje?',
        porque: 'Não ataca o portal, mostra um problema concreto (concorrência ao lado) e faz uma pergunta que quantifica o custo atual.',
      },
      {
        cliente: 'Uns R$ 900 por mês. Mas cadastrar imóvel em dois lugares dá muito trabalho.',
        clienteFrio: 'Ah, mas aí vou ter que cadastrar tudo de novo. Não tenho tempo pra isso.',
        palavrasValor: ['integração', 'exportar', 'uma vez', 'verificar', 'xml', 'portais', 'tempo', 'cadastro', 'confirmar', 'antes'],
        respostaModelo:
          'Dá trabalho mesmo, e eu não quero te criar mais tarefa. Muitos portais aceitam receber os imóveis de um sistema próprio por integração. Me diz quais você usa que eu verifico antes de te prometer qualquer coisa — se der, você cadastra uma vez só.',
        porque: 'Reconhece o custo operacional e oferece verificação técnica honesta em vez de promessa.',
      },
      {
        cliente: 'Se der para integrar, aí pode ser interessante.',
        clienteFrio: 'Vou pensar.',
        palavrasValor: ['verificar', 'retorno', 'mostrar', 'exemplo', 'dia', 'conversa', 'proposta', 'faixa', 'portais', 'carteira'],
        respostaModelo:
          'Combinado. Vou verificar a integração com os dois portais e te retorno até quinta com o que é possível e uma faixa de investimento. Se fizer sentido, marcamos 15 minutos para eu te mostrar um exemplo com a sua carteira. Pode ser?',
        porque: 'Fecha com compromisso concreto, data e próximo passo pequeno.',
      },
    ],
    dicas: ['Use números dele (investimento nos portais).', 'Não prometa integração sem verificar.', 'Fale de comissão de uma venda, não de "mais leads".'],
  },
  {
    id: 'sistema-orcamento-reduzido',
    titulo: 'Empresário que quer um sistema completo com orçamento reduzido',
    persona: 'Paulo, dono de uma distribuidora com 12 funcionários. Quer "um sistema que faça tudo".',
    nicho: 'distribuidoras',
    servico: 'sis-gestao',
    contexto: 'Reunião por vídeo após ele pedir orçamento.',
    objetivoTreino: 'Negociar escopo, propor MVP e ser transparente sobre custos.',
    dificuldade: 'alta',
    rodadas: [
      {
        cliente: 'Quero um sistema com estoque, financeiro, pedidos, rota de entrega, app para vendedor e relatórios. Tenho uns R$ 5 mil.',
        palavrasValor: ['prioridade', 'primeiro', 'fase', 'mvp', 'essencial', 'processo', 'mais dói', 'começar', 'escopo', 'pronto'],
        respostaModelo:
          'Obrigado por abrir o orçamento, isso ajuda muito. Com esse valor, não seria honesto prometer tudo isso de uma vez. O que eu proponho é a gente descobrir qual desses processos mais dói hoje e começar por ele. Se você tivesse que escolher um, qual seria?',
        porque: 'Transparência sobre a incompatibilidade, sem humilhar, e pergunta de priorização que leva ao MVP.',
      },
      {
        cliente: 'Pedidos. Os vendedores mandam por WhatsApp e duas pessoas digitam tudo.',
        clienteFrio: 'Mas eu preciso de tudo. Outro cara falou que fazia tudo por esse valor.',
        palavrasValor: ['pedidos', 'digitar', 'horas', 'erro', 'repetir', 'tabela', 'fase', 'depois', 'comparar', 'incluso'],
        respostaModelo:
          'Então começamos por aí: um portal de pedidos onde o vendedor lança no celular, com a tabela de preço de cada cliente, e o pedido já cai organizado. Isso tira boa parte da digitação. Estoque e financeiro entram nas fases seguintes, quando você ver o resultado da primeira.',
        porque: 'Usa a dor concreta (digitação) para definir a fase 1 e deixa o roadmap claro.',
      },
      {
        cliente: 'E depois de pronto, tem mensalidade?',
        clienteFrio: 'Tá, mas e depois? Vou ficar pagando você para sempre?',
        palavrasValor: ['servidor', 'infraestrutura', 'seu nome', 'opcional', 'manutenção', 'transparente', 'custo', 'código', 'mês', 'contrato'],
        respostaModelo:
          'Tem o custo do servidor e do banco de dados, que fica no nome da sua empresa e é pago direto ao provedor — para esse volume, algo em torno de R$ [valor] por mês. Manutenção comigo é opcional, com valor fixo ou por demanda. Tudo isso vai por escrito na proposta.',
        porque: 'Transparência sobre custos recorrentes e propriedade, sem esconder nada.',
      },
    ],
    dicas: ['Nunca aceite escopo total por orçamento incompatível.', 'Fale de fases com datas.', 'Mostre custos recorrentes desde o início.'],
  },
  {
    id: 'restaurante-whatsapp',
    titulo: 'Restaurante que só recebe pedidos pelo WhatsApp',
    persona: 'Dona Cida, proprietária de um restaurante de comida caseira, faz delivery no almoço. Filha ajuda no WhatsApp.',
    nicho: 'restaurantes',
    servico: 'catalogo-whatsapp',
    contexto: 'Visita presencial às 15h, fora do horário de pico.',
    objetivoTreino: 'Mostrar que a solução respeita o canal atual e resolve o pico de pedidos.',
    dificuldade: 'baixa',
    rodadas: [
      {
        cliente: 'Aqui é tudo pelo WhatsApp, meu filho. A clientela já está acostumada.',
        palavrasValor: ['whatsapp', 'continua', 'pedido', 'pronto', 'escrito', 'pico', 'almoço', 'anotar', 'erro', 'link'],
        respostaModelo:
          'E vai continuar pelo WhatsApp, Dona Cida. A ideia é só o cliente montar o pedido num cardápio no celular e ele chegar já escrito no WhatsApp de vocês, com endereço e forma de pagamento. No horário do almoço, vocês conseguem anotar tudo sem erro?',
        porque: 'Garante que nada muda no canal, explica de forma simples e pergunta sobre a dor do pico.',
      },
      {
        cliente: 'Às vezes sai errado, sim. Mas minha filha dá conta.',
        clienteFrio: 'Ah, não sei, essas coisas de internet complicam.',
        palavrasValor: ['filha', 'tempo', 'áudio', 'pedido escrito', 'atualizar', 'prato', 'esgotado', 'celular', 'simples', 'mostrar'],
        respostaModelo:
          'Ela deve ser ótima! Com o pedido chegando escrito, ela não precisa ouvir áudio no meio da correria, e vocês marcam prato esgotado pelo celular em segundos. Posso mostrar para ela como funciona? Leva 5 minutos.',
        porque: 'Valoriza quem faz o trabalho hoje e envolve a usuária real na demonstração.',
      },
      {
        cliente: 'E quanto fica?',
        clienteFrio: 'Deve ser caro, né?',
        palavrasValor: ['aplicativo', 'comissão', 'mês', 'valor', 'pedidos', 'sem comissão', 'faixa', 'testar', 'simples', 'começar'],
        respostaModelo:
          'Fica em R$ [valor], sem comissão por pedido — diferente dos aplicativos. Se vocês fazem uns 40 pedidos por dia, isso dá centavos por pedido. Quer que eu deixe um teste com o cardápio de vocês para usarem na semana que vem?',
        porque: 'Compara com uma referência que ela conhece (comissão dos aplicativos) e propõe teste prático.',
      },
    ],
    dicas: ['Linguagem simples e calorosa.', 'Envolver quem opera o WhatsApp.', 'Mostrar no celular, não falar de tecnologia.'],
  },
  {
    id: 'loja-ecommerce-custos',
    titulo: 'Loja que quer e-commerce, mas teme os custos',
    persona: 'Juliana, dona de uma loja de roupas femininas com loja física e 8 mil seguidores.',
    nicho: 'lojas-de-roupas',
    servico: 'ecommerce',
    contexto: 'Ela pediu orçamento de e-commerce e ficou assustada com os custos que pesquisou.',
    objetivoTreino: 'Separar custos com transparência e propor um caminho em fases.',
    dificuldade: 'media',
    rodadas: [
      {
        cliente: 'Quero vender online, mas vi que tem plataforma, taxa de cartão, frete... tenho medo de gastar e não vender.',
        palavrasValor: ['custos', 'separar', 'implantação', 'taxa', 'catálogo', 'começar', 'whatsapp', 'fase', 'testar', 'transparente'],
        respostaModelo:
          'Seu medo é muito legítimo, e é bom pensar nisso antes. Dá para separar: o que é investimento inicial, o que é custo fixo por mês e o que é taxa por venda. E existe um caminho mais leve para começar: catálogo online com pedido pelo WhatsApp, sem taxa de plataforma, para testar a procura antes do e-commerce completo.',
        porque: 'Valida o medo, organiza os custos e oferece um caminho de menor risco.',
      },
      {
        cliente: 'Mas aí eu não recebo pelo site...',
        clienteFrio: 'Mas aí não é loja online de verdade.',
        palavrasValor: ['pix', 'link de pagamento', 'depois', 'evoluir', 'checkout', 'volume', 'outras cidades', 'medir', 'fase 2', 'dados'],
        respostaModelo:
          'Verdade. No começo, o pagamento é por Pix ou link de pagamento no WhatsApp. Quando você vir que as vendas de fora da cidade cresceram, evoluímos para checkout completo. Assim você investe no e-commerce com base em números, não em aposta.',
        porque: 'Responde à objeção técnica e mostra a evolução por fases baseada em dados.',
      },
      {
        cliente: 'Faz sentido. E quanto dá cada etapa?',
        clienteFrio: 'Não sei se vale a pena...',
        palavrasValor: ['fase 1', 'fase 2', 'valor', 'proposta', 'escrito', 'mês', 'taxa', 'comparar', 'detalhar', 'decidir'],
        respostaModelo:
          'Te mando uma proposta com as duas fases separadas: fase 1 (catálogo) por R$ [valor] e fase 2 (checkout, frete e pagamentos) por R$ [valor], com os custos mensais e as taxas de cada uma. Aí você decide com tudo na mesa. Pode ser até amanhã?',
        porque: 'Fecha com clareza e prazo, sem pressão.',
      },
    ],
    dicas: ['Mostre todos os custos, inclusive os que não são seus.', 'Fases reduzem risco percebido.', 'Não prometa vendas.'],
  },
  {
    id: 'empresa-planilhas',
    titulo: 'Empresa que precisa automatizar planilhas',
    persona: 'Renata, gerente administrativa de uma empresa de climatização, controla manutenções e contratos em planilhas.',
    nicho: 'climatizacao',
    servico: 'sis-gestao',
    contexto: 'Ela procurou você depois de um erro na planilha que gerou uma visita técnica esquecida.',
    objetivoTreino: 'Diagnosticar o processo antes de propor solução e tratar migração com cuidado.',
    dificuldade: 'media',
    rodadas: [
      {
        cliente: 'Nossa planilha de manutenções virou um caos. Esquecemos uma visita de um cliente grande semana passada.',
        palavrasValor: ['como funciona', 'quantas', 'pessoas', 'planilha', 'processo', 'quem', 'contratos', 'equipamentos', 'entender', 'hoje'],
        respostaModelo:
          'Que situação chata, sinto muito. Antes de propor qualquer coisa, queria entender o processo: quantas pessoas editam essa planilha, como vocês sabem qual manutenção vence na semana e onde ficam os dados de cada equipamento?',
        porque: 'Empatia rápida e diagnóstico antes da solução: perguntas sobre quem, como e onde.',
      },
      {
        cliente: 'Três pessoas mexem. Cada uma tem uma aba. O vencimento a gente olha no olho.',
        clienteFrio: 'Ah, é uma planilha normal. Só quero um sistema.',
        palavrasValor: ['lembrete', 'vencimento', 'automático', 'histórico', 'equipamento', 'permissão', 'importar', 'mesma lógica', 'piloto', 'contratos'],
        respostaModelo:
          'Entendi. O que um sistema resolveria aqui: vencimentos com alerta automático, histórico por equipamento e cada pessoa vendo o que é dela, sem sobrescrever a aba da outra. E dá para importar a planilha atual, mantendo a mesma lógica que vocês já usam.',
        porque: 'Liga cada funcionalidade a uma dor que ela descreveu e reduz o medo de mudança (importação, mesma lógica).',
      },
      {
        cliente: 'E vamos ter que parar tudo para trocar?',
        clienteFrio: 'Não posso parar a operação para isso.',
        palavrasValor: ['paralelo', 'gradual', 'piloto', 'migração', 'testar', 'treinamento', 'não parar', 'semana', 'equipe', 'plano'],
        respostaModelo:
          'Não. Primeiro importamos os dados e testamos; depois vocês usam o sistema em paralelo com a planilha por algumas semanas, até confiarem. Só desligamos a planilha quando estiver tudo certo. Inclusive o treinamento é com as três pessoas que usam.',
        porque: 'Plano de implantação gradual e concreto, respondendo ao medo de interrupção.',
      },
    ],
    dicas: ['Pergunte antes de propor.', 'Mencione importação e uso em paralelo.', 'Envolva quem usa a planilha.'],
  },
  {
    id: 'cliente-desconto',
    titulo: 'Cliente que exige desconto em todas as propostas',
    persona: 'Sérgio, dono de uma oficina mecânica, negociador nato. Pede desconto em tudo.',
    nicho: 'oficinas-mecanicas',
    servico: 'site-negocio-local',
    contexto: 'Ele recebeu a proposta e respondeu no mesmo minuto.',
    objetivoTreino: 'Defender o valor e negociar escopo, não preço.',
    dificuldade: 'alta',
    rodadas: [
      {
        cliente: 'Gostei, mas me faz 30% de desconto que eu fecho agora.',
        palavrasValor: ['escopo', 'incluso', 'ajustar', 'tirar', 'versão', 'fase', 'pagamento', 'parcelar', 'valor', 'mesmo trabalho'],
        respostaModelo:
          'Fico feliz que gostou! Desconto no mesmo trabalho eu não consigo dar, porque o valor está ligado ao que é entregue. O que dá para fazer é ajustar o escopo: tirar [item] e deixar para uma segunda fase, o que reduz o valor para R$ [valor]. Ou manter tudo e parcelar. Qual faz mais sentido para você?',
        porque: 'Mantém o valor do trabalho, oferece alternativas concretas (escopo ou pagamento) e devolve a escolha ao cliente.',
      },
      {
        cliente: 'Todo mundo me dá desconto. Você vai perder o cliente por causa disso?',
        clienteFrio: 'Então não vou fechar. Tem gente que faz mais barato.',
        palavrasValor: ['entendo', 'justo', 'comparar', 'incluso', 'qualidade', 'prazo', 'suporte', 'opção', 'respeito', 'decisão'],
        respostaModelo:
          'Entendo, Sérgio, e respeito sua forma de negociar. Prefiro ser transparente: meu preço já é o justo para o que está incluso — [itens], suporte e prazo garantido. Se outra proposta entregar o mesmo por menos, faz sentido você avaliar. Se quiser, te ajudo a comparar item por item.',
        porque: 'Firmeza com cordialidade, sem leilão. Oferecer ajuda para comparar demonstra segurança.',
      },
      {
        cliente: 'Tá bom. Se eu pagar à vista, tem alguma condição?',
        clienteFrio: 'Vou pensar.',
        palavrasValor: ['à vista', 'condição', 'pagamento', 'antecipado', 'política', 'escrito', 'contrato', 'iniciar', 'data', 'próximo passo'],
        respostaModelo:
          'Para pagamento à vista eu tenho uma condição fixa de [x]%, que vale para todos os clientes. Se fecharmos, te mando o contrato hoje e reservamos a data de início. Pode ser?',
        porque: 'Uma condição comercial real e padronizada (não um desconto arrancado), seguida de próximo passo claro.',
      },
    ],
    dicas: ['Negocie escopo e condições, não o valor do mesmo trabalho.', 'Condições de pagamento devem ser políticas fixas, não improviso.', 'Firmeza sem arrogância.'],
  },
  {
    id: 'tres-orcamentos',
    titulo: 'Empresário que recebeu três orçamentos',
    persona: 'Fernanda, dona de uma clínica de estética, recebeu três orçamentos de site com valores muito diferentes.',
    nicho: 'clinicas-de-estetica',
    servico: 'site-paginas-servicos',
    contexto: 'Ela está comparando e pediu para você explicar por que o seu é mais caro.',
    objetivoTreino: 'Ajudar a comparar escopos de forma honesta, sem falar mal de concorrentes.',
    dificuldade: 'media',
    rodadas: [
      {
        cliente: 'Recebi três orçamentos: R$ 800, R$ 2.500 e o seu, de R$ 4.000. Por que o seu é tão mais caro?',
        palavrasValor: ['comparar', 'incluso', 'páginas', 'procedimentos', 'domínio', 'suporte', 'item', 'escopo', 'mesma coisa', 'ajudar'],
        respostaModelo:
          'Ótima pergunta, e é normal ter essa diferença. Para comparar de forma justa, vale ver o que cada um inclui: quantas páginas, se cada procedimento tem a própria página, se os textos estão inclusos, se o domínio fica no seu nome, se tem suporte depois. Se quiser, me mostra os outros que eu te ajudo a comparar — mesmo que no fim outro seja melhor para você.',
        porque: 'Não ataca concorrentes e transforma a comparação em critérios objetivos.',
      },
      {
        cliente: 'O de R$ 800 é um site de uma página só. O de R$ 2.500 tem 5 páginas mas não tem textos.',
        clienteFrio: 'Não entendo muito disso. Para mim site é site.',
        palavrasValor: ['procedimento', 'página', 'texto', 'google', 'avaliação', 'anúncio', 'objetivo', 'precisa', 'trabalho', 'tempo'],
        respostaModelo:
          'Então já ficou mais claro. No meu, cada procedimento tem uma página com explicação, perguntas frequentes e convite para avaliação, e eu cuido dos textos com você. Isso faz diferença se você quer que quem pesquisa um procedimento específico encontre e entenda. Se o objetivo for só um cartão de visitas, a opção de uma página pode atender bem.',
        porque: 'Liga a diferença de preço ao objetivo do cliente e reconhece quando a opção mais barata pode ser adequada.',
      },
      {
        cliente: 'Quero que as clientes entendam os procedimentos. Mas R$ 4.000 está pesado agora.',
        clienteFrio: 'Vou fechar com o mais barato mesmo.',
        palavrasValor: ['fase', 'principais', 'procedimentos', 'começar', 'depois', 'valor', 'reduzir', 'escopo', 'proposta', 'opção'],
        respostaModelo:
          'Entendo. Uma opção é começar com as páginas dos 3 procedimentos que mais vendem, por R$ [valor], e adicionar os outros depois. Assim você tem o essencial agora e o investimento acompanha o resultado. Quer que eu monte essa versão?',
        porque: 'Ajusta escopo em vez de preço e mantém o objetivo principal da cliente.',
      },
    ],
    dicas: ['Nunca fale mal dos outros orçamentos.', 'Compare escopo, não preço.', 'Admita quando a opção mais barata atende.'],
  },
  {
    id: 'fora-do-escopo',
    titulo: 'Cliente que deseja funcionalidades não incluídas no escopo',
    persona: 'André, dono de uma escola de idiomas. O site está em desenvolvimento e ele pede novas funções toda semana.',
    servico: 'site-profissional',
    contexto: 'Projeto em andamento. Ele mandou mensagem pedindo uma área do aluno "rapidinho".',
    objetivoTreino: 'Proteger o escopo sem prejudicar a relação, apresentando impacto em prazo e valor.',
    dificuldade: 'media',
    rodadas: [
      {
        cliente: 'Ah, aproveita e coloca uma área do aluno com login, para eles verem as notas. É rapidinho, né?',
        palavrasValor: ['escopo', 'combinado', 'novo', 'login', 'impacto', 'prazo', 'valor', 'avaliar', 'fase', 'anotar'],
        respostaModelo:
          'Boa ideia, André, faz sentido para a escola! Só que área do aluno com login não é rapidinho: envolve cadastro, senha, segurança e dados dos alunos. Ela não está no escopo atual, então vou anotar e te mandar o impacto em prazo e valor para você decidir se entra agora ou numa segunda fase.',
        porque: 'Valoriza a ideia, explica a complexidade sem jargão e trata como mudança de escopo formal.',
      },
      {
        cliente: 'Mas eu achei que estava incluso... outros sites têm isso.',
        clienteFrio: 'Poxa, achei que você ia colaborar.',
        palavrasValor: ['proposta', 'escrito', 'combinamos', 'entendo', 'transparência', 'opções', 'segunda fase', 'prazo atual', 'colaborar', 'dados'],
        respostaModelo:
          'Entendo a expectativa. Na proposta que aprovamos estão [itens]; a área do aluno não estava lá. Quero muito te ajudar, e por isso prefiro ser transparente: incluir agora mudaria o prazo de entrega do site. Te mando duas opções: incluir agora com novo prazo e valor, ou entregar o site no prazo e fazer a área do aluno em seguida.',
        porque: 'Retoma o acordo escrito com cordialidade e oferece opções em vez de um "não".',
      },
      {
        cliente: 'Tá, me manda as opções.',
        clienteFrio: 'Deixa, então. Mas fiquei chateado.',
        palavrasValor: ['hoje', 'opções', 'valor', 'prazo', 'decidir', 'segunda fase', 'continuar', 'entrega', 'compromisso', 'obrigado'],
        respostaModelo:
          'Te mando hoje até as 18h, com valor e prazo de cada opção. Enquanto isso sigo com o site no cronograma, para não atrasar nada do que já combinamos. Obrigado por entender!',
        porque: 'Compromisso com prazo, continuidade do projeto e encerramento cordial.',
      },
    ],
    dicas: ['Registre toda solicitação nova por escrito.', 'Nunca faça "de brinde" sem formalizar.', 'Ofereça opções, não recusas.'],
  },
];
