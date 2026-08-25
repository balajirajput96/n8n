import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePrTitle } from './validate-pr-title.mjs';

test('accepts n8n conventional dependency title', () => {
	assert.deepEqual(validatePrTitle('build(deps): Bump workspace dependencies'), []);
});

test('accepts a supported static scope and no-changelog suffix', () => {
	assert.deepEqual(validatePrTitle('docs(editor): Update guide (no-changelog)'), []);
});

test('rejects unknown types and lowercase subjects', () => {
	const issues = validatePrTitle('unknown(core): update title');
	assert.equal(issues.length, 2);
	assert.match(issues[0], /Unknown type/);
	assert.match(issues[1], /uppercase/);
});

test('rejects ticket and pull request numbers', () => {
	const issues = validatePrTitle('fix(core): Resolve n8n-1234 issue #12345');
	assert.equal(issues.length, 2);
	assert.match(issues[0], /ticket/);
	assert.match(issues[1], /pull request/);
});

test('rejects malformed title structure', () => {
	assert.equal(validatePrTitle('build(deps) Bump dependencies').length, 1);
});
