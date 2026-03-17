/** Pure utility functions for the Map component. No external dependencies. */

export interface MapMarker {
	lat: number;
	lng: number;
	label?: string;
	popup?: string;
}

export interface NormalizeOptions {
	latKey?: string;
	lngKey?: string;
	labelKey?: string;
	popupKey?: string;
}

/**
 * Normalize raw data into an array of MapMarker objects.
 *
 * Handles both raw arrays and `{ rows: [...] }` wrappers (same pattern as
 * chart-utils normalizeChartData). Entries with non-numeric lat/lng are
 * silently skipped.
 */
export function normalizeMarkers(data: unknown, options: NormalizeOptions = {}): MapMarker[] {
	const { latKey = 'lat', lngKey = 'lng', labelKey = 'label', popupKey = 'popup' } = options;

	let rows: unknown[];
	if (Array.isArray(data)) {
		rows = data;
	} else if (data && typeof data === 'object' && 'rows' in data) {
		const inner = (data as { rows: unknown }).rows;
		rows = Array.isArray(inner) ? inner : [];
	} else {
		return [];
	}

	const markers: MapMarker[] = [];
	for (const row of rows) {
		if (!row || typeof row !== 'object') continue;
		const r = row as Record<string, unknown>;
		const rawLat = r[latKey];
		const rawLng = r[lngKey];
		if (rawLat == null || rawLng == null) continue;
		const lat = Number(rawLat);
		const lng = Number(rawLng);
		if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
		markers.push({
			lat,
			lng,
			label: r[labelKey] != null ? String(r[labelKey]) : undefined,
			popup: r[popupKey] != null ? String(r[popupKey]) : undefined,
		});
	}
	return markers;
}
