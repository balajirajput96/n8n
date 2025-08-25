import { LmChatPerplexity } from '../LmChatPerplexity.node';
import { NodeConnectionTypes } from 'n8n-workflow';

describe('LmChatPerplexity', () => {
	let perplexityNode: LmChatPerplexity;

	beforeEach(() => {
		perplexityNode = new LmChatPerplexity();
	});

	describe('Node Configuration', () => {
		it('should have correct basic properties', () => {
			const { description } = perplexityNode;
			
			expect(description.displayName).toBe('Perplexity AI Chat Model');
			expect(description.name).toBe('lmChatPerplexity');
			expect(description.icon).toBe('file:perplexity.svg');
			expect(description.group).toEqual(['transform']);
			expect(description.version).toBe(1);
		});

		it('should have correct connection configuration', () => {
			const { description } = perplexityNode;
			
			expect(description.inputs).toEqual([]);
			expect(description.outputs).toEqual([NodeConnectionTypes.AiLanguageModel]);
			expect(description.outputNames).toEqual(['Model']);
		});

		it('should require perplexityApi credentials', () => {
			const { description } = perplexityNode;
			
			expect(description.credentials).toHaveLength(1);
			expect(description.credentials?.[0]).toEqual({
				name: 'perplexityApi',
				required: true,
			});
		});

		it('should have correct request defaults', () => {
			const { description } = perplexityNode;
			
			expect(description.requestDefaults?.baseURL).toBe('https://api.perplexity.ai');
		});

		it('should have model parameter with correct configuration', () => {
			const { description } = perplexityNode;
			const modelProperty = description.properties?.find(prop => prop.name === 'model');
			
			expect(modelProperty).toBeDefined();
			expect(modelProperty?.type).toBe('options');
			expect(modelProperty?.default).toBe('llama-3.1-sonar-small-128k-online');
		});

		it('should have options parameter with correct sub-options', () => {
			const { description } = perplexityNode;
			const optionsProperty = description.properties?.find(prop => prop.name === 'options');
			
			expect(optionsProperty).toBeDefined();
			expect(optionsProperty?.type).toBe('collection');
			
			const optionsConfig = optionsProperty?.options;
			expect(optionsConfig).toBeDefined();
			
			// Check for key options
			const maxTokensOption = optionsConfig?.find(opt => opt.name === 'maxTokens');
			const temperatureOption = optionsConfig?.find(opt => opt.name === 'temperature');
			const searchWebOption = optionsConfig?.find(opt => opt.name === 'searchWeb');
			
			expect(maxTokensOption).toBeDefined();
			expect(temperatureOption).toBeDefined();
			expect(searchWebOption).toBeDefined();
			expect(searchWebOption?.default).toBe(true);
		});

		it('should have correct codex configuration', () => {
			const { description } = perplexityNode;
			
			expect(description.codex?.categories).toEqual(['AI']);
			expect(description.codex?.subcategories?.AI).toEqual(['Language Models', 'Root Nodes']);
		});
	});
});