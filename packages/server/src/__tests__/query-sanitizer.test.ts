import { describe, expect, it } from 'vitest';
import { sanitizeQuery } from '../data/query-sanitizer.js';

describe('sanitizeQuery', () => {
	it('allows valid SELECT queries', () => {
		expect(sanitizeQuery('SELECT * FROM users').safe).toBe(true);
		expect(sanitizeQuery('SELECT id, name FROM products WHERE active = true').safe).toBe(true);
		expect(sanitizeQuery('SELECT COUNT(*) FROM orders').safe).toBe(true);
	});

	it('rejects non-SELECT queries', () => {
		expect(sanitizeQuery('INSERT INTO users VALUES (1)').safe).toBe(false);
		expect(sanitizeQuery('UPDATE users SET name = "x"').safe).toBe(false);
		expect(sanitizeQuery('DELETE FROM users').safe).toBe(false);
		expect(sanitizeQuery('DROP TABLE users').safe).toBe(false);
	});

	it('rejects multiple statements', () => {
		expect(sanitizeQuery('SELECT 1; DROP TABLE users').safe).toBe(false);
	});

	it('rejects SQL comments', () => {
		expect(sanitizeQuery('SELECT * FROM users -- comment').safe).toBe(false);
		expect(sanitizeQuery('SELECT * FROM users /* comment */').safe).toBe(false);
	});

	it('reports multiple errors', () => {
		const result = sanitizeQuery('DELETE FROM users; DROP TABLE users');
		expect(result.safe).toBe(false);
		expect(result.errors.length).toBeGreaterThan(1);
	});
});
