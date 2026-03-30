import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WebSocketManager } from '../data/websocket-manager.js';

// Mock the ws module
const mockSend = vi.fn();
const mockClose = vi.fn();
const listeners = new Map<string, ((...args: unknown[]) => void)[]>();

vi.mock('ws', () => {
	return {
		default: class MockWebSocket {
			on(event: string, cb: (...args: unknown[]) => void) {
				if (!listeners.has(event)) listeners.set(event, []);
				listeners.get(event)!.push(cb);
			}
			send = mockSend;
			close = mockClose;
		},
	};
});

function emitWsEvent(event: string, ...args: unknown[]) {
	const cbs = listeners.get(event);
	if (cbs) {
		for (const cb of cbs) cb(...args);
	}
}

function clearListeners() {
	listeners.clear();
}

describe('WebSocketManager', () => {
	let manager: WebSocketManager;

	beforeEach(() => {
		clearListeners();
		mockSend.mockClear();
		mockClose.mockClear();
		manager = new WebSocketManager({
			idleTimeoutMs: 1000,
			gcIntervalMs: 60_000, // disable auto-gc in tests
			maxReconnectAttempts: 3,
		});
	});

	afterEach(() => {
		manager.shutdown();
	});

	it('creates a connection on first getOrCreate call', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		expect(key).toBeTruthy();
		expect(typeof key).toBe('string');
	});

	it('returns same key for identical options (deduplication)', () => {
		const key1 = manager.getOrCreate({ url: 'wss://example.com', subscribe: { a: 1 }, bufferSize: 10 });
		clearListeners(); // clear for second create
		const key2 = manager.getOrCreate({ url: 'wss://example.com', subscribe: { a: 1 }, bufferSize: 10 });
		expect(key1).toBe(key2);
	});

	it('returns different keys for different URLs', () => {
		const key1 = manager.getOrCreate({ url: 'wss://example.com/a', bufferSize: 10 });
		clearListeners();
		const key2 = manager.getOrCreate({ url: 'wss://example.com/b', bufferSize: 10 });
		expect(key1).not.toBe(key2);
	});

	it('sends subscribe message on connection open', () => {
		const subscribe = { APIKey: 'test-key', filter: 'tanker' };
		manager.getOrCreate({ url: 'wss://example.com', subscribe, bufferSize: 10 });
		emitWsEvent('open');
		expect(mockSend).toHaveBeenCalledWith(JSON.stringify(subscribe));
	});

	it('buffers messages and returns them via getMessages', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		emitWsEvent('open');
		emitWsEvent('message', JSON.stringify({ lat: 28.83, lng: 50.89 }));
		emitWsEvent('message', JSON.stringify({ lat: 29.0, lng: 51.0 }));

		const snapshot = manager.getMessages(key);
		expect(snapshot.messages).toHaveLength(2);
		expect(snapshot.state).toBe('open');
		expect(snapshot.messageCount).toBe(2);
	});

	it('respects bufferSize limit (evicts oldest)', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 3 });
		emitWsEvent('open');
		for (let i = 0; i < 5; i++) {
			emitWsEvent('message', JSON.stringify({ index: i }));
		}

		const snapshot = manager.getMessages(key);
		expect(snapshot.messages).toHaveLength(3);
		expect((snapshot.messages[0] as any).index).toBe(2);
		expect((snapshot.messages[2] as any).index).toBe(4);
		expect(snapshot.messageCount).toBe(5);
	});

	it('ignores non-JSON messages', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		emitWsEvent('open');
		emitWsEvent('message', 'not-json');
		emitWsEvent('message', JSON.stringify({ valid: true }));

		const snapshot = manager.getMessages(key);
		expect(snapshot.messages).toHaveLength(1);
	});

	it('returns empty snapshot for unknown connection key', () => {
		const snapshot = manager.getMessages('nonexistent');
		expect(snapshot.messages).toEqual([]);
		expect(snapshot.state).toBe('closed');
		expect(snapshot.messageCount).toBe(0);
	});

	it('reports connecting state before open', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		const snapshot = manager.getMessages(key);
		expect(snapshot.state).toBe('connecting');
	});

	it('shutdown closes all connections', () => {
		manager.getOrCreate({ url: 'wss://example.com/a', bufferSize: 10 });
		clearListeners();
		manager.getOrCreate({ url: 'wss://example.com/b', bufferSize: 10 });
		manager.shutdown();
		expect(mockClose).toHaveBeenCalledTimes(2);
	});

	it('close removes a specific connection', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		manager.close(key);
		expect(mockClose).toHaveBeenCalledTimes(1);
		const snapshot = manager.getMessages(key);
		expect(snapshot.state).toBe('closed');
	});

	it('does not send subscribe message when subscribe is undefined', () => {
		manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		emitWsEvent('open');
		expect(mockSend).not.toHaveBeenCalled();
	});

	it('getMessages returns a snapshot copy (mutation-safe)', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 10 });
		emitWsEvent('open');
		emitWsEvent('message', JSON.stringify({ id: 1 }));

		const snapshot1 = manager.getMessages(key);
		snapshot1.messages.push({ id: 'injected' }); // mutate returned array

		const snapshot2 = manager.getMessages(key);
		expect(snapshot2.messages).toHaveLength(1); // internal buffer unaffected
		expect((snapshot2.messages[0] as any).id).toBe(1);
	});

	it('returns different keys for same URL with different subscribe', () => {
		const key1 = manager.getOrCreate({ url: 'wss://example.com', subscribe: { key: 'a' }, bufferSize: 10 });
		clearListeners();
		const key2 = manager.getOrCreate({ url: 'wss://example.com', subscribe: { key: 'b' }, bufferSize: 10 });
		expect(key1).not.toBe(key2);
	});

	it('totalMessageCount tracks all messages including evicted ones', () => {
		const key = manager.getOrCreate({ url: 'wss://example.com', bufferSize: 2 });
		emitWsEvent('open');
		for (let i = 0; i < 10; i++) {
			emitWsEvent('message', JSON.stringify({ i }));
		}
		const snapshot = manager.getMessages(key);
		expect(snapshot.messages).toHaveLength(2);
		expect(snapshot.messageCount).toBe(10);
	});
});
