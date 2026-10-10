import type { Proposal, ProposalItem, ProposalTier } from '../types';
import { formatBRL, uid } from './text';

export const TIER_NAMES: ProposalTier['nome'][] = ['Essencial', 'Profissional', 'Completa'];

export function emptyProposal(): Proposal {
  const now = new Date().toISOString();
  return {
    id: uid('p_'),
    cliente: '',
    nicho: '',
    servico: '',
    escopo: '',
    hospedagem: '',
    manutencao: '',
    integracoes: '',
    pagamento: '',
    limites: '',
    opcionais: '',
    validade: '15 dias',
    tiers: TIER_NAMES.map((nome, i) => ({
      nome,
      ativo: i < 2,
      funcionalidades: [],
      prazo: '',
      valorImplantacao: null,
      mensalidade: null,
      observacao: '',
    })),
    createdAt: now,
    updatedAt: now,
  };
}

export function newItem(texto = '', prioritario = true): ProposalItem {
  return { id: uid('i_'), texto, prioritario };
}

/** Alternativas mais simples para funcionalidades comuns — sugestões, nunca preço. */
const SIMPLER: { match: RegExp; sugestao: string }[] = [
  { match: /checkout|pagamento online|carrinho/i, sugestao: 'pedido enviado pronto para o WhatsApp, com pagamento por Pix/link na primeira fase' },
  { match: /\bapp\b|aplicativo/i, sugestao: 'sistema web responsivo (atalho na tela inicial) em vez de app nas lojas' },
  { match: /integra/i, sugestao: 'importação/exportação de planilha no lugar da integração automática, numa primeira fase' },
  { match: /relat[óo]rio/i, sugestao: 'exportação para Excel no lugar de relatórios personalizados' },
  { match: /blog|artigos/i, sugestao: 'blog na fase 2, depois que as páginas principais estiverem no ar' },
  { match: /área do cliente|area do cliente|login|portal/i, sugestao: 'envio de documentos por e-mail na primeira fase, com área do cliente depois' },
  { match: /multil[ií]ngue|idiomas|ingl[êe]s/i, sugestao: 'site em um idioma agora e segundo idioma numa próxima fase' },
  { match: /chat|chatbot|rob[ôo]/i, sugestao: 'botão de WhatsApp com mensagem pronta em vez de chatbot' },
  { match: /anima[çc]/i, sugestao: 'animações simples padrão em vez de animações personalizadas' },
  { match: /fotos?|sess[ãa]o de fotos/i, sugestao: 'uso das fotos que o cliente já tem e sessão profissional depois' },
  { match: /textos?|copy|reda[çc]/i, sugestao: 'textos escritos pelo cliente com revisão sua, em vez de redação completa' },
];

export interface DiscountSuggestion {
  titulo: string;
  detalhe: string;
  itens?: string[];
}

export function discountSuggestions(p: Proposal, tierIndex: number, pedido: string): { sugestoes: DiscountSuggestion[]; mensagem: string } {
  const tier = p.tiers[tierIndex];
  const sugestoes: DiscountSuggestion[] = [];
  if (!tier) return { sugestoes, mensagem: '' };

  const naoPrioritarios = tier.funcionalidades.filter((f) => !f.prioritario && f.texto.trim());
  const prioritarios = tier.funcionalidades.filter((f) => f.prioritario && f.texto.trim());

  if (naoPrioritarios.length) {
    sugestoes.push({
      titulo: 'Reduzir o escopo',
      detalhe: 'Retire da versão atual os itens que você marcou como não prioritários e defina o novo valor com base no trabalho que sai.',
      itens: naoPrioritarios.map((f) => f.texto),
    });
  }

  if (prioritarios.length && naoPrioritarios.length) {
    sugestoes.push({
      titulo: 'Dividir a implantação em fases',
      detalhe: 'Fase 1 com o essencial, fase 2 com o restante. Defina o valor de cada fase — o total pode ser o mesmo, mas o desembolso inicial fica menor.',
      itens: [`Fase 1: ${prioritarios.map((f) => f.texto).join(', ')}`, `Fase 2: ${naoPrioritarios.map((f) => f.texto).join(', ')}`],
    });
  }

  const ajustes = tier.funcionalidades
    .map((f) => {
      const alt = SIMPLER.find((s) => s.match.test(f.texto));
      return alt ? `${f.texto} → ${alt.sugestao}` : null;
    })
    .filter((x): x is string => Boolean(x));
  if (ajustes.length) {
    sugestoes.push({
      titulo: 'Ajustar funcionalidades',
      detalhe: 'Troque funcionalidades por alternativas mais simples que resolvem o mesmo problema agora.',
      itens: ajustes,
    });
  }

  const cheaper = p.tiers
    .map((t, i) => ({ t, i }))
    .filter(({ t, i }) => i !== tierIndex && t.ativo && t.valorImplantacao !== null && tier.valorImplantacao !== null && t.valorImplantacao < (tier.valorImplantacao ?? 0));
  if (cheaper.length) {
    const c = cheaper[cheaper.length - 1].t;
    sugestoes.push({
      titulo: `Apresentar a versão ${c.nome}`,
      detalhe: `A proposta já tem a versão ${c.nome} por ${formatBRL(c.valorImplantacao)}. Mostre o que muda entre as versões em vez de abater o valor.`,
    });
  }

  sugestoes.push({
    titulo: 'Condições de pagamento',
    detalhe: p.pagamento.trim()
      ? `Reforce as condições já previstas na proposta: "${p.pagamento.trim()}". Só ofereça outras condições se fizerem parte da sua política.`
      : 'Defina no campo "Condições de pagamento" a sua política (entrada + parcelas, por etapa). Não crie condições na hora só para fechar.',
  });

  if (!tier.funcionalidades.length) {
    sugestoes.unshift({
      titulo: 'Liste as funcionalidades primeiro',
      detalhe: 'Cadastre as funcionalidades desta versão e marque quais são prioritárias para receber sugestões de escopo e fases.',
    });
  }

  const cliente = p.cliente.trim() || '[nome]';
  const pedidoTxt = pedido.trim() ? ` sobre ${pedido.trim().replace(/[.?!]+$/, '')}` : '';
  const opcao = sugestoes.find((s) => s.titulo === 'Dividir a implantação em fases')
    ? 'dividir em duas fases, começando pelo essencial'
    : sugestoes.find((s) => s.titulo === 'Reduzir o escopo')
      ? 'tirar alguns itens desta etapa e incluir depois'
      : 'ajustar o que entra nesta primeira versão';
  const mensagem = `Oi, ${cliente}! Obrigado por me falar${pedidoTxt}. Desconto no mesmo escopo eu não consigo, porque o valor está ligado ao trabalho entregue. O que posso fazer é ${opcao}, para o investimento inicial caber melhor agora. Quer que eu monte essa alternativa para você comparar?`;

  return { sugestoes, mensagem };
}

export function proposalToText(p: Proposal, services: { id: string; nome: string }[]): string {
  const servico = services.find((s) => s.id === p.servico)?.nome ?? p.servico;
  const lines: string[] = [];
  lines.push(`Proposta comercial — ${p.cliente || 'Cliente'}`);
  if (servico) lines.push(`Solução: ${servico}`);
  if (p.escopo) lines.push('', `Escopo: ${p.escopo}`);
  for (const t of p.tiers.filter((t) => t.ativo)) {
    lines.push('', `▸ Versão ${t.nome}`);
    for (const f of t.funcionalidades.filter((f) => f.texto.trim())) lines.push(`  • ${f.texto}`);
    if (t.prazo) lines.push(`  Prazo estimado: ${t.prazo}`);
    if (t.valorImplantacao !== null) lines.push(`  Implantação: ${formatBRL(t.valorImplantacao)}`);
    if (t.mensalidade !== null) lines.push(`  Mensal: ${formatBRL(t.mensalidade)}`);
    if (t.observacao) lines.push(`  Obs.: ${t.observacao}`);
  }
  const extra: [string, string][] = [
    ['Hospedagem', p.hospedagem],
    ['Manutenção', p.manutencao],
    ['Integrações', p.integracoes],
    ['Condições de pagamento', p.pagamento],
    ['Limites do projeto', p.limites],
    ['Itens opcionais', p.opcionais],
    ['Validade da proposta', p.validade],
  ];
  const filled = extra.filter(([, v]) => v.trim());
  if (filled.length) lines.push('');
  for (const [k, v] of filled) lines.push(`${k}: ${v}`);
  return lines.join('\n');
}
