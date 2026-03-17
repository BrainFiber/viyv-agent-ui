import { describe, expect, it } from 'vitest';
import { normalizeMarkers } from '../map/map-utils.js';

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
