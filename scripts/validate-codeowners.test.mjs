import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateCodeowners } from './validate-codeowners.mjs';

function fixtureRoot() {
	const root = mkdtempSync(join(tmpdir(), 'n8n-codeowners-'));
	mkdirSync(join(root, '.github', 'workflows'), { recursive: true });
	writeFileSync(join(root, '.github', 'workflows', 'ci.yml'), 'name: ci\n');
	return root;
}

test('accepts exact paths and team owners', () => {
	const root = fixtureRoot();
	assert.deepEqual(validateCodeowners('.github/workflows @n8n-io/qa-dx\n', root), []);
});

test('rejects missing owners and invalid owner syntax', () => {
	const root = fixtureRoot();
	const issues = validateCodeowners('.github/workflows\n.github/workflows invalid-owner\n', root);
	assert.equal(issues.length, 2);
});

test('rejects duplicate patterns and missing exact paths', () => {
	const root = fixtureRoot();
	const issues = validateCodeowners(
		'missing/file @n8n-io/qa-dx\nmissing/file @n8n-io/qa-dx\n',
		root,
	);
	assert.equal(issues.length, 3);
	assert.match(issues[0], /does not exist/);
	assert.match(issues[1], /duplicate/);
});
