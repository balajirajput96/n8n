<template>
	<div v-if="showOfflineBanner" class="offline-banner">
		<n8n-icon icon="exclamation-triangle" size="small" />
		<span class="offline-banner__text">
			{{ offlineMessage }}
		</span>
		<n8n-button
			v-if="!offlineMode && !isOnline"
			type="tertiary"
			size="mini"
			@click="checkConnection"
			:loading="checking"
		>
			{{ $locale.baseText('offlineBanner.retry') }}
		</n8n-button>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { useOfflineDetection } from '@/composables/useOfflineDetection';

const { isOnline, offlineMode } = useOfflineDetection();
const { $locale } = useI18n();
const checking = ref(false);

const showOfflineBanner = computed(() => !isOnline || offlineMode);

const offlineMessage = computed(() => {
	if (offlineMode) {
		return $locale.baseText('offlineBanner.offlineMode');
	}
	return $locale.baseText('offlineBanner.noConnection');
});

async function checkConnection() {
	checking.value = true;
	try {
		// Try to fetch a small resource to check connectivity
		await fetch('/api/health', { method: 'HEAD' });
		location.reload();
	} catch {
		// Connection still not available
	} finally {
		checking.value = false;
	}
}
</script>

<style lang="scss" scoped>
.offline-banner {
	display: flex;
	align-items: center;
	gap: var(--spacing-2xs);
	padding: var(--spacing-2xs) var(--spacing-xs);
	background-color: var(--color-warning-tint-2);
	border-bottom: 1px solid var(--color-warning);
	color: var(--color-warning-shade-1);
	font-size: var(--font-size-2xs);

	&__text {
		flex: 1;
	}
}
</style>