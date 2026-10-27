import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('landing resource graph is local, complete and works under a hosting subdirectory', async () => {
  const visited = new Set();
  async function visit(file) {
    if (visited.has(file)) return;
    visited.add(file);
    assert.ok(file.startsWith(root + sep), `Resource escapes project: ${file}`);
    await access(file);
    const extension = extname(file);
    if (!['.html', '.css', '.js'].includes(extension)) return;
    const source = await readFile(file, 'utf8');
    const patterns = extension === '.html'
      ? [/(?:src|href)="([^"]+)"/g]
      : extension === '.css' ? [/url\(['"]?([^)'"\s]+)['"]?\)/g]
        : [/^import\s+.*?from\s+['"]([^'"]+)['"]/gm];
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        const reference = match[1];
        if (reference.startsWith('#') || reference.startsWith('mailto:')) continue;
        assert.ok(!/^(?:https?:|file:|[A-Z]:|\/)/i.test(reference), `Non-local or root-relative asset: ${reference}`);
        await visit(resolve(dirname(file), reference.split(/[?#]/)[0]));
      }
    }
  }
  await visit(resolve(root, 'index.html'));
  assert.ok(visited.size > 15, 'Expected the complete font/image/module dependency graph');
});

test('anchors and accessibility references have unique, existing targets', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate element IDs');
  for (const match of html.matchAll(/(?:aria-controls|aria-labelledby|aria-describedby|for)="([^"]+)"|href="#([^"]+)"/g)) {
    for (const id of (match[1] || match[2]).split(' ')) assert.ok(ids.includes(id), `Missing reference: ${id}`);
  }
});
