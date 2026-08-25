#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OWNER = /^@[A-Za-z0-9][A-Za-z0-9-]*(?:\/[A-Za-z0-9][A-Za-z0-9-]*)?$/;

export function validateCodeowners(contents, rootDirectory) {
	const issues = [];
	const patterns = new Set();

	for (const [index, raw] of contents.split(/\r?\n/).entries()) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;

		const fields = line.split(/\s+/);
		const [pattern, ...owners] = fields;
		const prefix = `line ${index + 1}`;

		if (!pattern || owners.length === 0) {
			issues.push(`${prefix}: each entry needs one pattern and at least one owner.`);
			continue;
		}
		if (patterns.has(pattern)) issues.push(`${prefix}: duplicate pattern "${pattern}".`);
		patterns.add(pattern);
		if (pattern.startsWith('!'))
			issues.push(`${prefix}: negated patterns are not supported by CODEOWNERS.`);
		if (owners.some((owner) => !OWNER.test(owner))) {
			issues.push(`${prefix}: every owner must use @org/team or @user syntax.`);
		}

		if (!/[?*\[]/.test(pattern)) {
			const relativePath = pattern.replace(/^\//, '');
			if (!existsSync(resolve(rootDirectory, relativePath))) {
				issues.push(`${prefix}: exact path "${pattern}" does not exist in the repository.`);
			}
		}
	}

	return issues;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const codeownersPath = process.argv[2] ?? '.github/CODEOWNERS';
	const rootDirectory = process.argv[3] ?? process.cwd();
	if (!existsSync(codeownersPath)) {
		console.error(`CODEOWNERS file not found: ${codeownersPath}`);
		process.exit(1);
	}
	const issues = validateCodeowners(readFileSync(codeownersPath, 'utf8'), rootDirectory);
	if (issues.length) {
		for (const issue of issues) console.error(`- ${issue}`);
		process.exit(1);
	}
	console.log('CODEOWNERS validation: PASS');
}
