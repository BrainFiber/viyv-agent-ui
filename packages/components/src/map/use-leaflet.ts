/**
 * Infrastructure hook: dynamic-loads leaflet + react-leaflet, injects CSS,
 * and fixes the default marker icon. All side-effects are contained here.
 */

import { useEffect, useState } from 'react';

export interface LeafletModules {
	L: typeof import('leaflet');
	RL: typeof import('react-leaflet');
}

let cached: LeafletModules | null = null;
let loadFailed = false;
let loading: Promise<LeafletModules | null> | null = null;

const CSS_ID = '__leaflet_css__';
const CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

function injectCss(): Promise<void> {
	if (typeof document === 'undefined') return Promise.resolve();
	if (document.getElementById(CSS_ID)) return Promise.resolve();

	return new Promise<void>((resolve) => {
		const link = document.createElement('link');
		link.id = CSS_ID;
		link.rel = 'stylesheet';
		link.href = CSS_URL;
		link.onload = () => resolve();
		link.onerror = () => resolve(); // graceful — map still usable without css
		document.head.appendChild(link);
	});
}

function fixDefaultIcon(L: typeof import('leaflet')) {
	// Webpack/Vite breaks the default marker icon paths. Override with CDN URLs.
	// biome-ignore lint/suspicious/noExplicitAny: Leaflet Icon.Default internal
	delete (L.Icon.Default.prototype as any)._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
		iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
		shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
	});
}

async function load(): Promise<LeafletModules | null> {
	try {
		const [L, RL] = await Promise.all([import('leaflet'), import('react-leaflet')]);
		await injectCss();
		fixDefaultIcon(L);
		return { L, RL };
	} catch {
		loadFailed = true;
		return null;
	}
}

export interface UseLeafletResult {
	modules: LeafletModules | null;
	error: boolean;
}

/**
 * Dynamically loads leaflet and react-leaflet modules.
 * Returns `{ modules: null, error: false }` while loading,
 * `{ modules, error: false }` on success,
 * `{ modules: null, error: true }` if the import fails (peer deps not installed).
 * Module-level caching prevents redundant loads across re-mounts.
 */
export function useLeaflet(): UseLeafletResult {
	const [modules, setModules] = useState<LeafletModules | null>(cached);
	const [error, setError] = useState(loadFailed);

	useEffect(() => {
		if (cached) {
			setModules(cached);
			return;
		}
		if (loadFailed) {
			setError(true);
			return;
		}
		if (!loading) {
			loading = load();
		}
		let cancelled = false;
		loading.then((m) => {
			if (m) cached = m;
			if (!cancelled) {
				setModules(m);
				if (!m) setError(true);
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return { modules, error };
}
