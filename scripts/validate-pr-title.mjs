#!/usr/bin/env node

const TYPES = new Set(['feat', 'fix', 'perf', 'test', 'docs', 'refactor', 'build', 'ci', 'chore']);
const STATIC_SCOPES = new Set([
	'API',
	'core',
	'editor',
	'benchmark',
	'ai-builder',
	'engine',
	'deps',
]);
const NO_CHANGELOG = '(no-changelog)';

export function validatePrTitle(title) {
	const issues = [];
	const match = title.match(/^(?<type>\w+)(?:\((?<scope>.*)\))?!?: (?<subject>.+)$/);

	if (!match) {
		return ['PR title must use type: Subject or type(scope): Subject; subject must not be empty.'];
	}

	if (/n8n-\d{3,5}/i.test(title)) issues.push('PR title must not contain a ticket number.');
	if (/#\d{5,7}/.test(title)) issues.push('PR title must not contain a pull request number.');

	const { type, scope, subject } = match.groups;
	if (!TYPES.has(type)) {
		issues.push(`Unknown type "${type}". Allowed types: ${[...TYPES].join(', ')}.`);
	}

	if (scope) {
		if (/,[^\s]/.test(scope)) {
			issues.push('Use a space after each comma in a multi-scope title.');
		}
		for (const item of scope.split(', ').filter(Boolean)) {
			if (!STATIC_SCOPES.has(item) && !/^.+ Node$/.test(item)) {
				issues.push(
					`Unknown scope "${item}". Use a supported repository scope or a display-name Node scope.`,
				);
			}
		}
	}

	if (/^[a-z]/.test(subject)) issues.push('The subject must start with an uppercase letter.');
	if (subject.startsWith('(')) issues.push('The subject must not start with parentheses.');
	if (subject.endsWith('.')) issues.push('The subject must not end with a period.');
	if (subject.split(' ')[0].endsWith('ed')) issues.push('The subject must use present tense.');
	if (subject.includes(NO_CHANGELOG) && !subject.endsWith(` ${NO_CHANGELOG}`)) {
		issues.push(`${NO_CHANGELOG} must appear at the end of the subject.`);
	}

	return issues;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const title = process.argv.slice(2).join(' ').trim();
	if (!title) {
		console.error('A pull request title is required.');
		process.exit(1);
	}
	const issues = validatePrTitle(title);
	if (issues.length) {
		for (const issue of issues) console.error(`- ${issue}`);
		process.exit(1);
	}
	console.log('PR title convention: PASS');
}
