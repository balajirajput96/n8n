import { ref, onMounted, onUnmounted } from 'vue';

export function useOfflineDetection() {
	const isOnline = ref(navigator.onLine);
	const offlineMode = ref(window.N8N_OFFLINE_MODE === 'true' || false);

	function updateOnlineStatus() {
		isOnline.value = navigator.onLine;
	}

	onMounted(() => {
		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
	});

	onUnmounted(() => {
		window.removeEventListener('online', updateOnlineStatus);
		window.removeEventListener('offline', updateOnlineStatus);
	});

	return {
		isOnline: isOnline.value,
		isOffline: !isOnline.value || offlineMode.value,
		offlineMode: offlineMode.value,
	};
}