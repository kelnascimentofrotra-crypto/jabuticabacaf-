import { describe, expect, it } from 'vitest';
import { BASE_CONTENT, validateContent, type ContentBundle } from '../data/content';
import { STAGES, CATEGORIES, SERVICE_KINDS, OBJECTIVES } from './taxonomy';
import type { ContentKind } from '../types';

const { objections, niches, services, scenarios, followups, prospect, quick } = BASE_CONTENT;

const unique = (ids: string[]) => new Set(ids).size === ids.length;

/** Frases que não podem aparecer em respostas prontas (promessas e pressão). */
const BANNED = [
  /garanto que (você|vc) vai/i,
  /vai dobrar (suas|as) vendas/i,
  /100% segur/i,
  /\bsó hoje\b/i,
  /última chance/i,
  /você está perdendo clientes/i,
  /primeira posição garantida/i,
];

describe('volume mínimo de conteúdo', () => {
  it('tem ao menos 60 nichos, divididos em todas as categorias pedidas', () => {
    expect(niches.length).toBeGreaterThanOrEqual(60);
    for (const cat of ['beleza', 'saude', 'alimentacao', 'construcao', 'profissionais', 'comercio']) {
      expect(niches.filter((n) => n.categoria === cat).length, cat).toBe(10);
    }
  });

  it('tem mais de 10 objeções gerais e mais de 10 de sistemas', () => {
    expect(objections.filter((o) => o.biblioteca === 'geral').length).toBeGreaterThanOrEqual(44);
    expect(objections.filter((o) => o.biblioteca === 'sistema').length).toBeGreaterThanOrEqual(27);
  });

  it('cobre o catálogo de serviços, follow-ups, cenários e etapas', () => {
    expect(services.length).toBeGreaterThanOrEqual(39);
    expect(followups.length).toBe(12);
    expect(scenarios.length).toBe(10);
    expect(prospect.map((p) => p.id).sort()).toEqual(STAGES.map((s) => s.id).sort());
    expect(quick.length).toBeGreaterThanOrEqual(10);
  });
});

describe('integridade das referências', () => {
  it('ids são únicos em cada tipo', () => {
    for (const key of Object.keys(BASE_CONTENT) as (keyof ContentBundle)[]) {
      expect(unique((BASE_CONTENT[key] as { id: string }[]).map((i) => i.id)), key).toBe(true);
    }
    for (const n of niches) expect(unique(n.objecoes.map((o) => o.id)), n.id).toBe(true);
  });

  it('objeções relacionadas, serviços e taxonomia existem', () => {
    const ids = new Set(objections.map((o) => o.id));
    const svc = new Set(services.map((s) => s.id));
    const stageIds = new Set(STAGES.map((s) => s.id));
    for (const o of objections) {
      for (const r of o.relacionadas) expect(ids.has(r), `${o.id} → ${r}`).toBe(true);
      for (const s of o.servicosRelacionados ?? []) expect(svc.has(s), `${o.id} → ${s}`).toBe(true);
      for (const e of o.etapas) expect(stageIds.has(e), `${o.id} etapa ${e}`).toBe(true);
      for (const k of o.servicos) expect(k in SERVICE_KINDS, `${o.id} serviço ${k}`).toBe(true);
      for (const ob of o.objetivos) expect(ob in OBJECTIVES, `${o.id} objetivo ${ob}`).toBe(true);
      expect(o.categoria in CATEGORIES).toBe(true);
    }
    for (const n of niches) for (const s of n.solucoes) expect(svc.has(s.servico), `${n.id} → ${s.servico}`).toBe(true);
    const nicheIds = new Set(niches.map((n) => n.id));
    for (const s of scenarios) {
      if (s.nicho) expect(nicheIds.has(s.nicho), s.id).toBe(true);
      if (s.servico) expect(svc.has(s.servico), s.id).toBe(true);
    }
  });

  it('todo conteúdo original passa na validação usada pelo painel admin', () => {
    const map: Record<ContentKind, { id: string }[]> = {
      objection: objections,
      niche: niches,
      service: services,
      scenario: scenarios,
      followup: followups,
      prospect,
      quick,
    };
    for (const [kind, list] of Object.entries(map) as [ContentKind, { id: string }[]][]) {
      for (const item of list) expect(validateContent(kind, item), `${kind}:${item.id}`).toEqual([]);
    }
  });
});

describe('fichas completas (modelo obrigatório de cada objeção)', () => {
  it('cada objeção tem os 12 campos preenchidos', () => {
    for (const o of objections) {
      expect(o.frase.length, o.id).toBeGreaterThan(5);
      expect(o.significados.length, `${o.id} significados`).toBeGreaterThanOrEqual(3);
      expect(o.estrategia.length, `${o.id} estratégia`).toBeGreaterThan(60);
      expect(o.descobrir.length, `${o.id} descobrir`).toBeGreaterThanOrEqual(2);
      for (const k of ['curta', 'consultiva', 'persuasiva', 'ligacao', 'reuniao'] as const) {
        expect(o.respostas[k].length, `${o.id} resposta ${k}`).toBeGreaterThan(40);
      }
      expect(o.alternativas.length, `${o.id} alternativas`).toBeGreaterThanOrEqual(2);
      expect(o.perguntaEstrategica.length, o.id).toBeGreaterThan(15);
      expect(o.proximoPasso.length, o.id).toBeGreaterThan(15);
      expect(o.naoDizer.length, `${o.id} não dizer`).toBeGreaterThanOrEqual(3);
      expect(Object.keys(o.variacoes).length, `${o.id} variações`).toBeGreaterThanOrEqual(2);
      expect(o.relacionadas.length, `${o.id} relacionadas`).toBeGreaterThanOrEqual(3);
      expect(o.gatilhos.length, `${o.id} gatilhos`).toBeGreaterThanOrEqual(4);
    }
  });

  it('objeções de sistemas explicam transparência em pelo menos dois aspectos', () => {
    for (const o of objections.filter((x) => x.biblioteca === 'sistema')) {
      expect(Object.keys(o.transparencia ?? {}).length, o.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('cada nicho tem conteúdo próprio (não apenas troca de nome)', () => {
    const resumos = new Set(niches.map((n) => n.resumo));
    expect(resumos.size).toBe(niches.length);
    for (const n of niches) {
      expect(n.objecoes.length, n.id).toBeGreaterThanOrEqual(3);
      expect(n.conversa.length, n.id).toBeGreaterThanOrEqual(3);
      expect(n.argumentos.length, n.id).toBeGreaterThanOrEqual(3);
      expect(n.perguntas.length, n.id).toBeGreaterThanOrEqual(3);
      expect(n.solucoes.length, n.id).toBeGreaterThanOrEqual(3);
      for (const a of Object.values(n.angulos)) expect(a.length, n.id).toBeGreaterThan(30);
    }
  });
});

describe('qualidade e ética das respostas', () => {
  const texts: [string, string][] = [];
  for (const o of objections) {
    for (const [k, v] of Object.entries(o.respostas)) texts.push([`${o.id}.${k}`, v]);
    o.alternativas.forEach((a, i) => texts.push([`${o.id}.alt${i}`, a]));
  }
  for (const n of niches) for (const no of n.objecoes) texts.push([`${n.id}.${no.id}`, no.resposta]);
  for (const f of followups) {
    f.mensagens.forEach((m, i) => texts.push([`${f.id}.${i}`, m.texto]));
    texts.push([`${f.id}.encerramento`, f.encerramento]);
  }
  for (const p of prospect) for (const [k, v] of Object.entries(p.mensagens)) texts.push([`${p.id}.${k}`, v]);

  it('nenhuma resposta pronta contém promessa de resultado ou pressão', () => {
    for (const [id, t] of texts) {
      for (const re of BANNED) expect(re.test(t), `${id}: ${re}`).toBe(false);
    }
  });

  it('toda sequência de follow-up termina com encerramento respeitoso e dias crescentes', () => {
    for (const f of followups) {
      const dias = f.mensagens.map((m) => m.diaSugerido);
      expect([...dias].sort((a, b) => a - b), f.id).toEqual(dias);
      expect(f.encerramento.length, f.id).toBeGreaterThan(40);
      expect(f.naoFazer.some((n) => /recusa/i.test(n)), `${f.id} cita recusa explícita`).toBe(true);
    }
  });
});
