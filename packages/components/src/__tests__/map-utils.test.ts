import { describe, expect, it } from 'vitest';
import { normalizeMarkers, normalizeOverlays } from '../map/map-utils.js';

describe('normalizeMarkers', () => {
	it('normalizes a plain array', () => {
		const data = [
			{ lat: 35.68, lng: 139.76, label: 'Tokyo', popup: 'Capital' },
			{ lat: 34.69, lng: 135.5, label: 'Osaka' },
		];
		const result = normalizeMarkers(data);
		expect(result).toEqual([
			{ lat: 35.68, lng: 139.76, label: 'Tokyo', popup: 'Capital' },
			{ lat: 34.69, lng: 135.5, label: 'Osaka', popup: undefined },
		]);
	});

	it('normalizes { rows: [...] } wrapper', () => {
		const data = { rows: [{ lat: 35.68, lng: 139.76 }] };
		const result = normalizeMarkers(data);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ lat: 35.68, lng: 139.76, label: undefined, popup: undefined });
	});

	it('supports custom latKey / lngKey', () => {
		const data = [{ latitude: 35.68, longitude: 139.76 }];
		const result = normalizeMarkers(data, { latKey: 'latitude', lngKey: 'longitude' });
		expect(result[0].lat).toBe(35.68);
		expect(result[0].lng).toBe(139.76);
	});

	it('supports custom labelKey / popupKey', () => {
		const data = [{ lat: 35.68, lng: 139.76, name: 'Shop', address: '1-2-3' }];
		const result = normalizeMarkers(data, { labelKey: 'name', popupKey: 'address' });
		expect(result[0].label).toBe('Shop');
		expect(result[0].popup).toBe('1-2-3');
	});

	it('skips entries with non-numeric lat/lng', () => {
		const data = [
			{ lat: 'invalid', lng: 139.76 },
			{ lat: 35.68, lng: 'bad' },
			{ lat: 35.68, lng: 139.76 },
		];
		const result = normalizeMarkers(data);
		expect(result).toHaveLength(1);
		expect(result[0].lat).toBe(35.68);
	});

	it('skips entries with null/undefined lat/lng', () => {
		const data = [
			{ lat: null, lng: 139.76 },
			{ lat: 35.68, lng: undefined },
			{ lat: 35.68, lng: 139.76 },
		];
		const result = normalizeMarkers(data);
		expect(result).toHaveLength(1);
		expect(result[0].lat).toBe(35.68);
	});

	it('skips non-object entries', () => {
		const data = [null, undefined, 'string', 42, { lat: 35.68, lng: 139.76 }];
		const result = normalizeMarkers(data);
		expect(result).toHaveLength(1);
	});

	it('returns empty array for null/undefined data', () => {
		expect(normalizeMarkers(null)).toEqual([]);
		expect(normalizeMarkers(undefined)).toEqual([]);
	});

	it('returns empty array for non-array, non-object data', () => {
		expect(normalizeMarkers('string')).toEqual([]);
		expect(normalizeMarkers(42)).toEqual([]);
	});

	it('returns empty array for empty array', () => {
		expect(normalizeMarkers([])).toEqual([]);
	});

	it('returns empty array when rows property is not an array', () => {
		expect(normalizeMarkers({ rows: 'not-an-array' })).toEqual([]);
		expect(normalizeMarkers({ rows: 42 })).toEqual([]);
		expect(normalizeMarkers({ rows: null })).toEqual([]);
	});

	it('supports all four custom keys simultaneously', () => {
		const data = [{ latitude: 35.68, longitude: 139.76, storeName: 'HQ', storeAddr: 'Tokyo' }];
		const result = normalizeMarkers(data, {
			latKey: 'latitude',
			lngKey: 'longitude',
			labelKey: 'storeName',
			popupKey: 'storeAddr',
		});
		expect(result).toEqual([{ lat: 35.68, lng: 139.76, label: 'HQ', popup: 'Tokyo' }]);
	});

	it('coerces stringified numbers from SQL', () => {
		const data = [{ lat: '35.68', lng: '139.76' }];
		const result = normalizeMarkers(data);
		expect(result[0].lat).toBe(35.68);
		expect(result[0].lng).toBe(139.76);
	});
});

describe('normalizeOverlays', () => {
	// -- happy path per type ---------------------------------------------------

	it('normalizes circle overlays', () => {
		const data = [{ type: 'circle', center: [28.83, 50.89], radius: 10000, color: '#ff0000', fillOpacity: 0.4, label: 'Zone A', popup: 'Details' }];
		const result = normalizeOverlays(data);
		expect(result).toEqual([
			{ type: 'circle', center: [28.83, 50.89], radius: 10000, color: '#ff0000', fillOpacity: 0.4, label: 'Zone A', popup: 'Details' },
		]);
	});

	it('normalizes polyline overlays', () => {
		const data = [{ type: 'polyline', positions: [[28.9, 50.8], [29.1, 51.0]], color: 'blue', weight: 4 }];
		const result = normalizeOverlays(data);
		expect(result).toEqual([
			{ type: 'polyline', positions: [[28.9, 50.8], [29.1, 51.0]], color: 'blue', weight: 4, label: undefined, popup: undefined },
		]);
	});

	it('normalizes polygon overlays', () => {
		const data = [{ type: 'polygon', positions: [[28.7, 50.7], [28.7, 51.1], [29.0, 50.9]], fillColor: 'green', fillOpacity: 0.3 }];
		const result = normalizeOverlays(data);
		expect(result).toEqual([
			{ type: 'polygon', positions: [[28.7, 50.7], [28.7, 51.1], [29.0, 50.9]], fillColor: 'green', fillOpacity: 0.3, label: undefined, popup: undefined },
		]);
	});

	it('normalizes rectangle overlays', () => {
		const data = [{ type: 'rectangle', bounds: [[28.5, 50.5], [29.0, 51.0]], color: 'orange', opacity: 0.8 }];
		const result = normalizeOverlays(data);
		expect(result).toEqual([
			{ type: 'rectangle', bounds: [[28.5, 50.5], [29.0, 51.0]], color: 'orange', opacity: 0.8, label: undefined, popup: undefined },
		]);
	});

	// -- mixed types + order ---------------------------------------------------

	it('normalizes mixed overlay types preserving order', () => {
		const data = [
			{ type: 'circle', center: [28.83, 50.89], radius: 5000 },
			{ type: 'polyline', positions: [[28.9, 50.8], [29.1, 51.0]] },
			{ type: 'polygon', positions: [[28.7, 50.7], [28.7, 51.1], [29.0, 50.9]] },
		];
		const result = normalizeOverlays(data);
		expect(result).toHaveLength(3);
		expect(result[0].type).toBe('circle');
		expect(result[1].type).toBe('polyline');
		expect(result[2].type).toBe('polygon');
	});

	// -- label / popup ---------------------------------------------------------

	it('coerces non-string label and popup to string', () => {
		const data = [{ type: 'circle', center: [28.83, 50.89], radius: 1000, label: 42, popup: true }];
		const result = normalizeOverlays(data);
		expect(result[0].label).toBe('42');
		expect(result[0].popup).toBe('true');
	});

	it('sets label and popup to undefined when not provided', () => {
		const data = [{ type: 'circle', center: [28.83, 50.89], radius: 1000 }];
		const result = normalizeOverlays(data);
		expect(result[0].label).toBeUndefined();
		expect(result[0].popup).toBeUndefined();
	});

	// -- pathOptions -----------------------------------------------------------

	it('extracts all path options', () => {
		const data = [{
			type: 'circle', center: [0, 0], radius: 100,
			color: 'red', fillColor: 'pink', fillOpacity: 0.5, opacity: 0.8, weight: 2, dashArray: '5,10',
		}];
		const result = normalizeOverlays(data);
		expect(result[0].color).toBe('red');
		expect(result[0].fillColor).toBe('pink');
		expect(result[0].fillOpacity).toBe(0.5);
		expect(result[0].opacity).toBe(0.8);
		expect(result[0].weight).toBe(2);
		expect(result[0].dashArray).toBe('5,10');
	});

	// -- defensive: empty / invalid input --------------------------------------

	it('returns empty array for null/undefined data', () => {
		expect(normalizeOverlays(null)).toEqual([]);
		expect(normalizeOverlays(undefined)).toEqual([]);
	});

	it('returns empty array for non-array, non-object data', () => {
		expect(normalizeOverlays('string')).toEqual([]);
		expect(normalizeOverlays(42)).toEqual([]);
	});

	it('returns empty array for empty array', () => {
		expect(normalizeOverlays([])).toEqual([]);
	});

	it('handles { rows: [...] } wrapper', () => {
		const data = { rows: [{ type: 'circle', center: [0, 0], radius: 100 }] };
		const result = normalizeOverlays(data);
		expect(result).toHaveLength(1);
		expect(result[0].type).toBe('circle');
	});

	it('returns empty array when rows property is not an array', () => {
		expect(normalizeOverlays({ rows: 'not-an-array' })).toEqual([]);
		expect(normalizeOverlays({ rows: 42 })).toEqual([]);
		expect(normalizeOverlays({ rows: null })).toEqual([]);
	});

	it('skips entries with unknown type', () => {
		const data = [
			{ type: 'hexagon', center: [0, 0], radius: 100 },
			{ type: 'circle', center: [0, 0], radius: 100 },
		];
		const result = normalizeOverlays(data);
		expect(result).toHaveLength(1);
		expect(result[0].type).toBe('circle');
	});

	it('skips entries without type', () => {
		const data = [{ center: [0, 0], radius: 100 }];
		expect(normalizeOverlays(data)).toEqual([]);
	});

	it('skips non-object entries', () => {
		const data = [null, undefined, 'string', 42, { type: 'circle', center: [0, 0], radius: 100 }];
		const result = normalizeOverlays(data);
		expect(result).toHaveLength(1);
	});

	// -- circle-specific -------------------------------------------------------

	it('skips circle with non-numeric radius', () => {
		const data = [{ type: 'circle', center: [0, 0], radius: 'big' }];
		expect(normalizeOverlays(data)).toEqual([]);
	});

	it('skips circle with negative or zero radius', () => {
		expect(normalizeOverlays([{ type: 'circle', center: [0, 0], radius: 0 }])).toEqual([]);
		expect(normalizeOverlays([{ type: 'circle', center: [0, 0], radius: -100 }])).toEqual([]);
	});

	it('skips circle with invalid center', () => {
		expect(normalizeOverlays([{ type: 'circle', center: 'bad', radius: 100 }])).toEqual([]);
		expect(normalizeOverlays([{ type: 'circle', center: [NaN, 0], radius: 100 }])).toEqual([]);
	});

	// -- position-specific -----------------------------------------------------

	it('skips polyline with fewer than 2 valid positions', () => {
		expect(normalizeOverlays([{ type: 'polyline', positions: [[0, 0]] }])).toEqual([]);
	});

	it('skips polygon with fewer than 3 valid positions', () => {
		expect(normalizeOverlays([{ type: 'polygon', positions: [[0, 0], [1, 1]] }])).toEqual([]);
	});

	it('filters out invalid positions then checks minimum count', () => {
		const data = [{ type: 'polyline', positions: [[0, 0], ['bad', 1], [1, 1]] }];
		const result = normalizeOverlays(data);
		expect(result).toHaveLength(1);
		expect((result[0] as any).positions).toEqual([[0, 0], [1, 1]]);
	});

	// -- rectangle-specific ----------------------------------------------------

	it('skips rectangle with invalid bounds', () => {
		expect(normalizeOverlays([{ type: 'rectangle', bounds: 'bad' }])).toEqual([]);
		expect(normalizeOverlays([{ type: 'rectangle', bounds: [[0, 0]] }])).toEqual([]);
		expect(normalizeOverlays([{ type: 'rectangle', bounds: [['a', 0], [1, 1]] }])).toEqual([]);
	});

	// -- stringified numbers ---------------------------------------------------

	it('coerces stringified numbers in coordinates and radius', () => {
		const data = [{ type: 'circle', center: ['28.83', '50.89'], radius: '10000' }];
		const result = normalizeOverlays(data);
		expect(result).toHaveLength(1);
		expect(result[0].type).toBe('circle');
		expect((result[0] as any).center).toEqual([28.83, 50.89]);
		expect((result[0] as any).radius).toBe(10000);
	});

	it('coerces stringified numbers in path options', () => {
		const data = [{ type: 'circle', center: [0, 0], radius: 100, fillOpacity: '0.3', opacity: '0.8', weight: '2' }];
		const result = normalizeOverlays(data);
		expect(result[0].fillOpacity).toBe(0.3);
		expect(result[0].opacity).toBe(0.8);
		expect(result[0].weight).toBe(2);
	});
});
