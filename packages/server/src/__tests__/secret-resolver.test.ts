import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveSecrets, containsSecrets } from '../data/secret-resolver.js';

describe('resolveSecrets', () => {
	const ORIGINAL_ENV = process.env;

	beforeEach(() => {
		process.env = { ...ORIGINAL_ENV, TEST_API_KEY: 'secret-value-123', ANOTHER_KEY: 'another-value' };
	});

	afterEach(() => {
		process.env = ORIGINAL_ENV;
	});

	it('resolves $secret.XXX to environment variable', () => {
		expect(resolveSecrets('$secret.TEST_API_KEY')).toBe('secret-value-123');
	});

	it('recursively resolves secrets in nested objects', () => {
		const input = {
			APIKey: '$secret.TEST_API_KEY',
			nested: { other: '$secret.ANOTHER_KEY' },
		};
		const result = resolveSecrets(input) as Record<string, unknown>;
		expect(result.APIKey).toBe('secret-value-123');
		expect((result.nested as Record<string, unknown>).other).toBe('another-value');
	});

	it('recursively resolves secrets in arrays', () => {
		const input = ['$secret.TEST_API_KEY', 'plain'];
		const result = resolveSecrets(input) as string[];
		expect(result[0]).toBe('secret-value-123');
		expect(result[1]).toBe('plain');
	});

	it('does not modify plain strings', () => {
		expect(resolveSecrets('plain text')).toBe('plain text');
	});

	it('does not modify non-string primitives', () => {
		expect(resolveSecrets(42)).toBe(42);
		expect(resolveSecrets(true)).toBe(true);
		expect(resolveSecrets(null)).toBe(null);
		expect(resolveSecrets(undefined)).toBe(undefined);
	});

	it('throws when env var is not set', () => {
		expect(() => resolveSecrets('$secret.MISSING_VAR')).toThrow('Secret "MISSING_VAR" is not set');
	});

	it('rejects invalid env var names (lowercase)', () => {
		// lowercase doesn't match the pattern, so it's returned as-is
		expect(resolveSecrets('$secret.lower_case')).toBe('$secret.lower_case');
	});

	it('does not resolve partial matches', () => {
		expect(resolveSecrets('prefix$secret.TEST_API_KEY')).toBe('prefix$secret.TEST_API_KEY');
		expect(resolveSecrets('$secret.TEST_API_KEY suffix')).toBe('$secret.TEST_API_KEY suffix');
	});

	it('handles deeply nested structures', () => {
		const input = { a: { b: { c: [{ key: '$secret.TEST_API_KEY' }] } } };
		const result = resolveSecrets(input) as any;
		expect(result.a.b.c[0].key).toBe('secret-value-123');
	});
});

describe('containsSecrets', () => {
	it('returns true for direct $secret reference', () => {
		expect(containsSecrets('$secret.API_KEY')).toBe(true);
	});

	it('returns false for plain strings', () => {
		expect(containsSecrets('plain text')).toBe(false);
	});

	it('returns true for nested objects with secrets', () => {
		expect(containsSecrets({ a: { b: '$secret.KEY' } })).toBe(true);
	});

	it('returns true for arrays with secrets', () => {
		expect(containsSecrets(['plain', '$secret.KEY'])).toBe(true);
	});

	it('returns false for non-string primitives', () => {
		expect(containsSecrets(42)).toBe(false);
		expect(containsSecrets(null)).toBe(false);
	});

	it('returns false when no secrets present', () => {
		expect(containsSecrets({ a: 'plain', b: [1, 2] })).toBe(false);
	});
});
