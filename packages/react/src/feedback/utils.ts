/**
 * Generate a consistent color from a name string (hash-based HSL hue).
 */
export function authorColor(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = ((hash % 360) + 360) % 360;
	return `hsl(${hue}, 65%, 55%)`;
}

/**
 * Format an ISO timestamp as relative time (e.g. "3分前", "1時間前", "2日前").
 */
export function formatTimeAgo(isoString: string): string {
	const now = Date.now();
	const then = new Date(isoString).getTime();
	const diff = Math.max(0, now - then);

	const seconds = Math.floor(diff / 1000);
	if (seconds < 60) return 'たった今';

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}分前`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}時間前`;

	const days = Math.floor(hours / 24);
	return `${days}日前`;
}
