import { PerplexityApi } from '../PerplexityApi.credentials';

describe('PerplexityApi', () => {
	let perplexityApi: PerplexityApi;

	beforeEach(() => {
		perplexityApi = new PerplexityApi();
	});

	describe('Credential Configuration', () => {
		it('should have correct name', () => {
			expect(perplexityApi.name).toBe('perplexityApi');
		});

		it('should have correct display name', () => {
			expect(perplexityApi.displayName).toBe('Perplexity AI');
		});

		it('should have correct documentation URL', () => {
			expect(perplexityApi.documentationUrl).toBe('perplexity');
		});

		it('should have required properties', () => {
			expect(perplexityApi.properties).toHaveLength(2);
			
			const apiKeyProperty = perplexityApi.properties[0];
			expect(apiKeyProperty.name).toBe('apiKey');
			expect(apiKeyProperty.type).toBe('string');
			expect(apiKeyProperty.required).toBe(true);
			expect(apiKeyProperty.typeOptions?.password).toBe(true);

			const urlProperty = perplexityApi.properties[1];
			expect(urlProperty.name).toBe('url');
			expect(urlProperty.type).toBe('hidden');
			expect(urlProperty.default).toBe('https://api.perplexity.ai');
		});

		it('should have correct authentication configuration', () => {
			expect(perplexityApi.authenticate.type).toBe('generic');
			expect(perplexityApi.authenticate.properties.headers.Authorization).toBe('=Bearer {{$credentials.apiKey}}');
		});

		it('should have correct test configuration', () => {
			expect(perplexityApi.test.request.baseURL).toBe('={{ $credentials.url }}');
			expect(perplexityApi.test.request.url).toBe('/models');
		});
	});
});