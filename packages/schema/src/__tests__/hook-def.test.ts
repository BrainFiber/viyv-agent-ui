import { describe, expect, it } from 'vitest';
import { UseWebSocketHookSchema, HookDefSchema } from '../hook-def.js';

describe('UseWebSocketHookSchema', () => {
	it('parses a valid hook definition', () => {
		const result = UseWebSocketHookSchema.parse({
			use: 'useWebSocket',
			params: {
				url: 'wss://stream.example.com/v1',
				subscribe: { APIKey: '$secret.MY_KEY', filters: ['test'] },
				bufferSize: 100,
				refreshInterval: 10000,
			},
		});
		expect(result.use).toBe('useWebSocket');
		expect(result.params.url).toBe('wss://stream.example.com/v1');
		expect(result.params.bufferSize).toBe(100);
		expect(result.params.refreshInterval).toBe(10000);
	});

	it('applies defaults for bufferSize and refreshInterval', () => {
		const result = UseWebSocketHookSchema.parse({
			use: 'useWebSocket',
			params: { url: 'wss://example.com' },
		});
		expect(result.params.bufferSize).toBe(50);
		expect(result.params.refreshInterval).toBe(5000);
	});

	it('allows subscribe to be omitted', () => {
		const result = UseWebSocketHookSchema.parse({
			use: 'useWebSocket',
			params: { url: 'wss://example.com' },
		});
		expect(result.params.subscribe).toBeUndefined();
	});

	it('rejects invalid URL', () => {
		expect(() =>
			UseWebSocketHookSchema.parse({
				use: 'useWebSocket',
				params: { url: 'not-a-url' },
			}),
		).toThrow();
	});

	it('rejects non-positive bufferSize', () => {
		expect(() =>
			UseWebSocketHookSchema.parse({
				use: 'useWebSocket',
				params: { url: 'wss://example.com', bufferSize: 0 },
			}),
		).toThrow();

		expect(() =>
			UseWebSocketHookSchema.parse({
				use: 'useWebSocket',
				params: { url: 'wss://example.com', bufferSize: -1 },
			}),
		).toThrow();
	});

	it('rejects non-positive refreshInterval', () => {
		expect(() =>
			UseWebSocketHookSchema.parse({
				use: 'useWebSocket',
				params: { url: 'wss://example.com', refreshInterval: 0 },
			}),
		).toThrow();
	});
});

describe('HookDefSchema with useWebSocket', () => {
	it('parses useWebSocket via discriminated union', () => {
		const result = HookDefSchema.parse({
			use: 'useWebSocket',
			params: { url: 'wss://example.com' },
		});
		expect(result.use).toBe('useWebSocket');
	});

	it('still parses other hook types correctly', () => {
		const fetchResult = HookDefSchema.parse({
			use: 'useFetch',
			params: { url: 'https://api.example.com/data' },
		});
		expect(fetchResult.use).toBe('useFetch');
	});
});
