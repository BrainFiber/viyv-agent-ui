import { describe, expect, it } from 'vitest';
import { interpolateUrl } from '../template.js';

describe('interpolateUrl', () => {
	it('replaces placeholders with values', () => {
		expect(interpolateUrl('/pages/{{id}}', { id: 42 })).toBe('/pages/42');
	});

	it('handles multiple placeholders', () => {
		expect(interpolateUrl('/{{org}}/{{repo}}', { org: 'acme', repo: 'app' })).toBe(
			'/acme/app',
		);
	});

	it('URI-encodes values', () => {
		expect(interpolateUrl('/search?q={{q}}', { q: 'hello world' })).toBe(
			'/search?q=hello%20world',
		);
	});

	it('replaces missing keys with empty string', () => {
		expect(interpolateUrl('/pages/{{id}}', {})).toBe('/pages/');
	});

	it('replaces null/undefined values with empty string', () => {
		expect(interpolateUrl('/pages/{{id}}', { id: null })).toBe('/pages/');
		expect(interpolateUrl('/pages/{{id}}', { id: undefined })).toBe('/pages/');
	});

	it('returns template as-is when no placeholders', () => {
		expect(interpolateUrl('/static/page', { id: 1 })).toBe('/static/page');
	});

	it('converts non-string values to string', () => {
		expect(interpolateUrl('/items/{{flag}}', { flag: true })).toBe('/items/true');
	});
});
