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

// ---------------------------------------------------------------------------
// Overlay types
// ---------------------------------------------------------------------------

/** Shared styling options for all overlay types (maps to Leaflet PathOptions). */
export interface OverlayPathOptions {
	color?: string;
	fillColor?: string;
	fillOpacity?: number;
	opacity?: number;
	weight?: number;
	dashArray?: string;
}

interface OverlayBase extends OverlayPathOptions {
	/** Permanent label shown via Leaflet Tooltip. */
	label?: string;
	/** Detail text shown on click via Leaflet Popup. */
	popup?: string;
}

export interface CircleOverlay extends OverlayBase {
	type: 'circle';
	center: [number, number];
	/** Radius in metres. */
	radius: number;
}

export interface PolylineOverlay extends OverlayBase {
	type: 'polyline';
	positions: [number, number][];
}

export interface PolygonOverlay extends OverlayBase {
	type: 'polygon';
	positions: [number, number][];
}

export interface RectangleOverlay extends OverlayBase {
	type: 'rectangle';
	bounds: [[number, number], [number, number]];
}

export type MapOverlay = CircleOverlay | PolylineOverlay | PolygonOverlay | RectangleOverlay;

// ---------------------------------------------------------------------------
// normalizeOverlays — defensive parsing (same pattern as normalizeMarkers)
// ---------------------------------------------------------------------------

function toRows(data: unknown): unknown[] {
	if (Array.isArray(data)) return data;
	if (data && typeof data === 'object' && 'rows' in data) {
		const inner = (data as { rows: unknown }).rows;
		if (Array.isArray(inner)) return inner;
	}
	return [];
}

function parseLatLng(val: unknown): [number, number] | null {
	if (!Array.isArray(val) || val.length < 2) return null;
	const lat = Number(val[0]);
	const lng = Number(val[1]);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	return [lat, lng];
}

function parsePositions(val: unknown, minLength: number): [number, number][] | null {
	if (!Array.isArray(val)) return null;
	const result: [number, number][] = [];
	for (const item of val) {
		const parsed = parseLatLng(item);
		if (parsed) result.push(parsed);
	}
	return result.length >= minLength ? result : null;
}

function parseBounds(val: unknown): [[number, number], [number, number]] | null {
	if (!Array.isArray(val) || val.length < 2) return null;
	const sw = parseLatLng(val[0]);
	const ne = parseLatLng(val[1]);
	if (!sw || !ne) return null;
	return [sw, ne];
}

function coerceFinite(val: unknown): number | undefined {
	if (val == null) return undefined;
	const n = Number(val);
	return Number.isFinite(n) ? n : undefined;
}

function extractPathOptions(r: Record<string, unknown>): OverlayPathOptions {
	const opts: OverlayPathOptions = {};
	if (typeof r.color === 'string') opts.color = r.color;
	if (typeof r.fillColor === 'string') opts.fillColor = r.fillColor;
	const fillOpacity = coerceFinite(r.fillOpacity);
	if (fillOpacity != null) opts.fillOpacity = fillOpacity;
	const opacity = coerceFinite(r.opacity);
	if (opacity != null) opts.opacity = opacity;
	const weight = coerceFinite(r.weight);
	if (weight != null) opts.weight = weight;
	if (typeof r.dashArray === 'string') opts.dashArray = r.dashArray;
	return opts;
}

/**
 * Normalize raw data into an array of MapOverlay objects.
 *
 * Accepts plain arrays or `{ rows: [...] }` wrappers. Invalid entries are
 * silently skipped (same defensive behaviour as normalizeMarkers).
 */
export function normalizeOverlays(data: unknown): MapOverlay[] {
	const rows = toRows(data);
	const overlays: MapOverlay[] = [];

	for (const row of rows) {
		if (!row || typeof row !== 'object') continue;
		const r = row as Record<string, unknown>;
		const label = r.label != null ? String(r.label) : undefined;
		const popup = r.popup != null ? String(r.popup) : undefined;
		const pathOpts = extractPathOptions(r);

		switch (r.type) {
			case 'circle': {
				const center = parseLatLng(r.center);
				const radius = Number(r.radius);
				if (!center || !Number.isFinite(radius) || radius <= 0) continue;
				overlays.push({ type: 'circle', center, radius, label, popup, ...pathOpts });
				break;
			}
			case 'polyline': {
				const positions = parsePositions(r.positions, 2);
				if (!positions) continue;
				overlays.push({ type: 'polyline', positions, label, popup, ...pathOpts });
				break;
			}
			case 'polygon': {
				const positions = parsePositions(r.positions, 3);
				if (!positions) continue;
				overlays.push({ type: 'polygon', positions, label, popup, ...pathOpts });
				break;
			}
			case 'rectangle': {
				const bounds = parseBounds(r.bounds);
				if (!bounds) continue;
				overlays.push({ type: 'rectangle', bounds, label, popup, ...pathOpts });
				break;
			}
			default:
				continue;
		}
	}
	return overlays;
}
