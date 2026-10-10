import { describe, expect, it } from 'vitest';
import { BASE_CONTENT, mergeContent } from '../data/content';
import { buildIndex, search } from './search';
import { compose } from './composer';
import { evaluateByRules } from './evaluator';
import { discountSuggestions, emptyProposal, newItem, proposalToText } from './proposal';
import { maxMessages, schedule } from './followup';
import { applyTone, detectExplicitRefusal, placeholders } from './text';
import { normalize, similarity } from './normalize';

const index = buildIndex(BASE_CONTENT.objections, BASE_CONTENT.niches);
const top = (q: string) => search(index, q, 3)[0]?.doc.key;

describe('busca por frases do cliente', () => {
  it.each([
    ['Já tenho Instagram.', 'o:ja-tenho-instagram'],
    ['Está muito caro.', 'o:esta-muito-caro'],
    ['Meu sobrinho faz um site.', 'o:sobrinho-faz'],
    ['Vou pensar e te aviso.', 'o:vou-pensar'],
    ['Me mande uma proposta.', 'o:manda-proposta-primeiro'],
    ['Preciso falar com meu sócio.', 'o:falar-com-socio'],
    ['Como sei que você vai entregar?', 'o:medo-nao-entregar'],
    ['Não quero pagar mensalidade.', 'o:nao-quero-mensalidade'],
    ['Já tenho um site.', 'o:ja-tenho-site'],
    ['o zap resolve', 'o:clientes-chegam-whatsapp'],
    ['faço no chatgpt', 'o:faco-com-ia'],
    ['quem fica com o código fonte?', 'o:quem-dono-codigo'],
  ])('“%s” encontra %s', (q, expected) => {
    expect(top(q)).toBe(expected);
  });

  it('encontra objeção sobre sistema ao buscar "Não preciso de um sistema"', () => {
    const keys = search(index, 'Não preciso de um sistema.', 3).map((h) => h.doc.key);
    expect(keys).toContain('o:nao-preciso-sistema-agora');
  });

  it('entende mensagem longa colada, com várias frases', () => {
    const keys = search(index, 'Oi! Achei salgado. Um amigo meu faz por bem menos, vou ver e te falo.', 5).map((h) => h.doc.key);
    expect(keys).toEqual(expect.arrayContaining(['o:outro-cobra-mais-barato']));
  });

  it('inclui objeções específicas de nichos', () => {
    expect(top('aqui o cliente chega e espera')).toBe('n:barbearias:cliente-chega-na-hora');
  });

  it('ignora acentos e caixa', () => {
    expect(normalize('NÃO É O MOMENTO')).toBe('nao e o momento');
    expect(similarity('está muito caro', 'esta muito caro')).toBe(1);
  });

  it('não retorna nada para texto sem relação', () => {
    expect(search(index, 'xyzzy quux', 5)).toEqual([]);
  });
});

describe('gerador sem IA (composição pela biblioteca)', () => {
  const ctx = { index, niches: BASE_CONTENT.niches, services: BASE_CONTENT.services };

  it('gera respostas natural, estratégica e comercial com a objeção identificada', () => {
    const r = compose({ mensagem: 'Achei caro demais', objetivo: 'reuniao', tom: 'proximo' }, ctx);
    expect(r.match?.objection?.id).toBe('esta-muito-caro');
    expect(r.respostas.map((x) => x.tipo)).toEqual(['natural', 'estrategica', 'comercial']);
    for (const x of r.respostas) expect(x.versoes.length).toBeGreaterThanOrEqual(1);
    // o fechamento da resposta comercial segue o objetivo escolhido
    expect(r.respostas[2].versoes[0]).toContain('15 minutos');
  });

  it('usa o ângulo do nicho e a variação do serviço quando informados', () => {
    const r = compose({ mensagem: 'Já tenho Instagram', nicheId: 'barbearias', serviceId: 'sis-agendamento', objetivo: 'descobrir-necessidade', tom: 'proximo' }, ctx);
    expect(r.anguloNicho).toBeTruthy();
    expect(r.variacaoServico).toBe(BASE_CONTENT.objections.find((o) => o.id === 'ja-tenho-instagram')!.variacoes.sistema);
    expect(r.cuidados.length).toBeGreaterThan(0);
  });

  it('recusa explícita muda a recomendação para encerrar', () => {
    const r = compose({ mensagem: 'Não tenho interesse, pare de me mandar mensagem.', objetivo: 'fechar', tom: 'proximo' }, ctx);
    expect(r.recusaExplicita).toBe(true);
    expect(r.porque).toMatch(/encerrar/);
    expect(r.respostas[0].versoes[0]).not.toMatch(/reunião|chamada/i);
  });

  it('permite escolher outra objeção sugerida', () => {
    const first = compose({ mensagem: 'Achei caro, meu sobrinho faz', objetivo: 'reuniao', tom: 'proximo' }, ctx);
    const alt = first.outros[0];
    const forced = compose({ mensagem: 'Achei caro, meu sobrinho faz', objetivo: 'reuniao', tom: 'proximo', forcedKey: alt.doc.key }, ctx);
    expect(forced.match?.objection?.id ?? forced.match?.nicheObjection?.id).toBe(alt.doc.objection?.id ?? alt.doc.nicheObjection?.id);
  });

  it('sem correspondência, não inventa respostas', () => {
    const r = compose({ mensagem: 'qwerty asdfg', objetivo: 'reuniao', tom: 'proximo' }, ctx);
    expect(r.match).toBeUndefined();
    expect(r.respostas).toEqual([]);
  });
});

describe('ajuste de tom e campos', () => {
  it('formal remove interjeições e informalidades', () => {
    expect(applyTone('Boa! Te mando pra você rapidinho.', 'formal')).toBe('Entendo. Te mando para você rapidamente.');
  });
  it('direto mantém a primeira frase e a pergunta', () => {
    expect(applyTone('Entendo. Isso é comum. Muita gente sente. Posso te perguntar algo?', 'direto')).toBe('Entendo. Posso te perguntar algo?');
  });
  it('lista campos entre colchetes', () => {
    expect(placeholders('Oi, [nome]! Fica R$ [valor]. [nome]')).toEqual(['[nome]', '[valor]']);
  });
  it('detecta recusa explícita no histórico', () => {
    expect(detectExplicitRefusal('Obrigado', 'Ele disse: não tenho interesse')).toBe(true);
    expect(detectExplicitRefusal('Vou pensar')).toBe(false);
  });
});

describe('avaliação do simulador por regras', () => {
  const round = BASE_CONTENT.scenarios.find((s) => s.id === 'barbearia-sem-necessidade')!.rodadas[0];

  it('resposta modelo tem nota alta e resposta agressiva tem nota baixa', () => {
    const good = evaluateByRules(round.respostaModelo, round);
    const bad = evaluateByRules('Você está perdendo clientes! Só hoje faço 30% de desconto, garanto que vai vender mais.', round);
    expect(good.media).toBeGreaterThanOrEqual(70);
    expect(bad.media).toBeLessThan(45);
    expect(bad.erros.join(' ')).toMatch(/promessa|Pressão|desconto/i);
    expect(good.alternativa).toBe(round.respostaModelo);
  });

  it('aponta falta de pergunta e de próximo passo', () => {
    const ev = evaluateByRules('Site é importante para qualquer negócio hoje em dia.', round);
    expect(ev.notas.diagnostico).toBeLessThan(4);
    expect(ev.erros.some((e) => /pergunta/i.test(e))).toBe(true);
    expect(ev.erros.some((e) => /próximo passo/i.test(e))).toBe(true);
  });

  it('pergunta de diagnóstico conta como condução, mas sugere próximo passo', () => {
    const ev = evaluateByRules('Entendo, o Instagram ajuda muito. Me conta: hoje o cliente marca pelo direct ou pelo WhatsApp?', round);
    expect(ev.notas.conducao).toBeGreaterThanOrEqual(5);
    expect(ev.erros.some((e) => /abertura/.test(e))).toBe(true);
    expect(ev.media).toBeGreaterThanOrEqual(70);
  });

  it('notas ficam entre 0 e 10', () => {
    const ev = evaluateByRules('!!!!!', round);
    for (const v of Object.values(ev.notas)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(10);
    }
  });
});

describe('propostas e pedido de desconto', () => {
  const p = emptyProposal();
  p.cliente = 'Barbearia do Centro';
  p.pagamento = '50% no início, 50% na entrega';
  p.tiers[0] = { ...p.tiers[0], valorImplantacao: 1500, funcionalidades: [newItem('Página única')] };
  p.tiers[1] = {
    ...p.tiers[1],
    valorImplantacao: 3200,
    funcionalidades: [newItem('Agenda online'), newItem('Blog', false), newItem('Integração com Google Agenda', false)],
  };

  it('sugere escopo, fases, ajustes e versão menor sem alterar valores', () => {
    const before = JSON.stringify(p);
    const { sugestoes, mensagem } = discountSuggestions(p, 1, '20% de desconto');
    const titles = sugestoes.map((s) => s.titulo);
    expect(titles).toEqual(expect.arrayContaining(['Reduzir o escopo', 'Dividir a implantação em fases', 'Ajustar funcionalidades', 'Apresentar a versão Essencial', 'Condições de pagamento']));
    expect(sugestoes.find((s) => s.titulo === 'Dividir a implantação em fases')!.itens![0]).toContain('Agenda online');
    expect(mensagem).toContain('Barbearia do Centro');
    expect(mensagem).toMatch(/não consigo/);
    expect(JSON.stringify(p)).toBe(before);
  });

  it('gera texto da proposta só com versões ativas', () => {
    const text = proposalToText(p, BASE_CONTENT.services);
    expect(text).toContain('Versão Essencial');
    expect(text).toContain('Versão Profissional');
    expect(text).not.toContain('Versão Completa');
    expect(text).toContain('R$');
  });
});

describe('agenda de follow-up', () => {
  const seq = BASE_CONTENT.followups.find((f) => f.id === 'recebeu-orcamento')!;

  it('sempre termina com o encerramento e respeita a quantidade', () => {
    const plan = schedule(seq, { quantidade: 2, modo: 'sugerido', intervaloDias: 3, inicio: '2026-01-10' });
    expect(plan).toHaveLength(2);
    expect(plan[1].encerramento).toBe(true);
    expect(plan[1].texto).toBe(seq.encerramento);
    expect(plan[0].data).toBe('2026-01-12');
  });

  it('intervalo personalizado espaça as mensagens igualmente', () => {
    const plan = schedule(seq, { quantidade: maxMessages(seq), modo: 'intervalo', intervaloDias: 4, inicio: '2026-01-30' });
    expect(plan.map((m) => m.dia)).toEqual([2, 6, 10, 14]);
    expect(plan[1].data).toBe('2026-02-05');
  });
});

describe('camada de conteúdo editável', () => {
  it('aplica edição, criação, exclusão e ignora conteúdo inválido', () => {
    const edited = { ...BASE_CONTENT.quick[0], titulo: 'Editado' };
    const created = { id: 'nova', titulo: 'Nova', texto: 'Texto' };
    const { content, invalid } = mergeContent(BASE_CONTENT, [
      { kind: 'quick', id: edited.id, data: edited, deleted: false, updatedAt: '' },
      { kind: 'quick', id: 'nova', data: created, deleted: false, updatedAt: '' },
      { kind: 'quick', id: BASE_CONTENT.quick[1].id, data: null, deleted: true, updatedAt: '' },
      { kind: 'quick', id: 'quebrada', data: { id: 'quebrada' }, deleted: false, updatedAt: '' },
    ]);
    expect(content.quick.find((q) => q.id === edited.id)?.titulo).toBe('Editado');
    expect(content.quick.some((q) => q.id === 'nova')).toBe(true);
    expect(content.quick.some((q) => q.id === BASE_CONTENT.quick[1].id)).toBe(false);
    expect(invalid.map((i) => i.id)).toEqual(['quebrada']);
    expect(BASE_CONTENT.quick[0].titulo).not.toBe('Editado');
  });
});
