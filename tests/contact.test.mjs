import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_EMAIL, prepareContact, validateContact } from '../src/contact.js';

const valid = { email: 'hola@example.com', idea: 'Tienda & catálogo', message: 'Quiero vender café.\n¿Podemos conversar?' };

test('rejects whitespace-only fields and malformed email before preparing a message', () => {
  assert.deepEqual(Object.keys(validateContact({ email: ' ', idea: '\n ', message: '  ' })), ['email', 'idea', 'message']);
  for (const email of ['example.com', 'a@@b.com', 'a@b', 'a b@example.com']) {
    assert.ok(validateContact({ ...valid, email }).email);
  }
  assert.throws(() => prepareContact({ ...valid, message: ' ' }));
});

test('preserves accents, punctuation and paragraphs without injecting mailto headers', () => {
  const prepared = prepareContact({ ...valid, idea: 'Catálogo?cc=otro@example.com&body=texto' });
  const url = new URL(prepared.url);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.match(url.searchParams.get('subject'), /Catálogo\?cc=/);
  assert.ok(url.searchParams.get('body').includes(valid.message));
  assert.ok(url.searchParams.get('body').includes(valid.email));
  assert.ok(prepared.text.startsWith(`Para: ${CONTACT_EMAIL}`));
});

test('long messages and subject newlines are handled explicitly', () => {
  assert.ok(validateContact({ ...valid, message: 'x'.repeat(1501) }).message);
  assert.ok(validateContact({ ...valid, idea: 'x'.repeat(121) }).idea);
  const url = new URL(prepareContact({ ...valid, idea: 'Una idea\r\nOtra línea' }).url);
  assert.ok(!/[\r\n]/.test(url.searchParams.get('subject')));
});
