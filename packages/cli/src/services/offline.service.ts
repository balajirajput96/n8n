import { Service } from '@n8n/di';
import { GlobalConfig } from '@n8n/config';

@Service()
export class OfflineService {
	constructor(private readonly globalConfig: GlobalConfig) {}

	/**
	 * Check if n8n is running in offline mode
	 */
	isOfflineMode(): boolean {
		return this.globalConfig.generic.offlineMode;
	}

	/**
	 * Check if a feature should be disabled in offline mode
	 */
	shouldDisableFeature(feature: string): boolean {
		if (!this.isOfflineMode()) {
			return false;
		}

		const disabledFeatures = [
			'version-check',
			'telemetry',
			'community-packages',
			'template-import',
			'external-webhooks',
			'cloud-features'
		];

		return disabledFeatures.includes(feature);
	}

	/**
	 * Get offline mode status for frontend
	 */
	getOfflineStatus() {
		return {
			offline: this.isOfflineMode(),
			disabledFeatures: this.isOfflineMode() ? [
				'Version updates',
				'Community package installation',
				'Template imports',
				'External webhook testing',
				'Cloud integrations',
				'Telemetry'
			] : []
		};
	}
}