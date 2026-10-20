// Testes unitários: `node --test tests/`
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeWhatsappNumber, waHref, normalizeSearch, boxToPercent, fill } from '../src/lib.mjs';
import { waAttrs } from '../src/render.mjs';
import config from '../src/site.config.mjs';
import { arts } from '../src/content.mjs';

test('número de WhatsApp vira apenas dígitos com código do país', () => {
  assert.equal(normalizeWhatsappNumber('+55 (91) 99999-0000'), '5591999990000');
  assert.equal(normalizeWhatsappNumber(''), '');
  assert.equal(normalizeWhatsappNumber(undefined), '');
});

test('número sem código do país ou com dígitos demais é recusado', () => {
  assert.throws(() => normalizeWhatsappNumber('(91) 99999-0000'), /código do país/);
  assert.throws(() => normalizeWhatsappNumber('1234567890123456'), /dígitos demais/);
});

test('link do WhatsApp codifica a mensagem com encodeURIComponent', () => {
  const href = waHref('5591999990000', 'Olá! Perfil: Rural\nFaixa: Até R$ 300');
  assert.equal(
    href,
    'https://wa.me/5591999990000?text=Ol%C3%A1!%20Perfil%3A%20Rural%0AFaixa%3A%20At%C3%A9%20R%24%20300',
  );
});

test('sem número configurado, o botão não aponta para o wa.me', () => {
  const attrs = waAttrs({ config, wa: '' }, 'geral');
  assert.match(attrs, /href="#contato"/);
  assert.doesNotMatch(attrs, /wa\.me/);
});

test('com número configurado, cada origem leva a sua própria mensagem', () => {
  const ctx = { config, wa: '5591999990000' };
  const solucao = waAttrs(ctx, 'solucao', 'rural');
  assert.match(solucao, /https:\/\/wa\.me\/5591999990000\?text=/);
  assert.ok(solucao.includes(encodeURIComponent('imóvel rural')));
  assert.ok(waAttrs(ctx, 'duvidas').includes(encodeURIComponent('dúvidas frequentes')));
});

test('busca ignora maiúsculas e acentos', () => {
  assert.equal(normalizeSearch('  Instalação NUBLADOS '), 'instalacao nublados');
  assert.ok(normalizeSearch('Como funciona a instalação?').includes(normalizeSearch('INSTALACAO')));
});

test('mensagens preenchem apenas as variáveis conhecidas', () => {
  assert.equal(fill('imóvel {tipo} {x}', { tipo: 'rural' }), 'imóvel rural {x}');
});

test('hotspots ficam dentro da própria arte e viram porcentagens', () => {
  for (const [id, art] of Object.entries(arts)) {
    for (const variant of ['desktop', 'mobile']) {
      const { size, spots } = art[variant];
      for (const spot of spots) {
        const [x0, y0, x1, y1] = spot.box;
        assert.ok(x0 >= 0 && y0 >= 0 && x1 <= size[0] && y1 <= size[1] && x1 > x0 && y1 > y0, `${id}/${variant}: ${spot.label}`);
      }
    }
  }
  assert.deepEqual(boxToPercent([0, 0, 836, 470.5], [1672, 941]), {
    left: '0%',
    top: '0%',
    width: '50%',
    height: '50%',
  });
});
