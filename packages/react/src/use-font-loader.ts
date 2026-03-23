import { useEffect } from 'react';

/**
 * Dynamically loads Google Fonts by injecting a <link> into document.head.
 * SSR-safe: only runs on the client via useEffect.
 */
export function useFontLoader(fontFamily?: { primary?: string; accent?: string }): void {
	const primary = fontFamily?.primary;
	const accent = fontFamily?.accent;

	useEffect(() => {
		const families: string[] = [];
		if (primary) families.push(primary);
		if (accent) families.push(accent);
		if (families.length === 0) return;

		const id = `viyv-google-fonts-${families.map((f) => f.replace(/\s+/g, '-').toLowerCase()).join('_')}`;
		if (document.getElementById(id)) return;

		const link = document.createElement('link');
		link.id = id;
		link.rel = 'stylesheet';
		link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700`).join('&')}&display=swap`;
		document.head.appendChild(link);

		return () => {
			link.remove();
		};
	}, [primary, accent]);
}
