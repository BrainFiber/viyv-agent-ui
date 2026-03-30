/**
 * Server-side WebSocket connection manager with message buffering.
 *
 * Maintains persistent WebSocket connections on behalf of `useWebSocket` hooks.
 * Connections are keyed by (url + subscribe message) for deduplication — multiple
 * pages / users sharing the same parameters share one connection and buffer.
 *
 * Clients poll via REST; the manager returns a snapshot of the current buffer.
 */

import { createHash } from 'node:crypto';
import WebSocket from 'ws';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WebSocketManagerOptions {
	/** Close connections not polled for this many ms (default 300 000 = 5 min). */
	idleTimeoutMs?: number;
	/** How often to check for idle connections (default 60 000 = 1 min). */
	gcIntervalMs?: number;
	/** Max reconnect attempts before giving up (default 10). */
	maxReconnectAttempts?: number;
}

export interface WebSocketConnectionOptions {
	url: string;
	subscribe?: Record<string, unknown>;
	bufferSize: number;
	/** Extract a sub-object from each message before buffering (e.g. "MetaData"). */
	messageKey?: string;
}

export interface WebSocketSnapshot {
	messages: unknown[];
	state: 'connecting' | 'open' | 'reconnecting' | 'closed';
	messageCount: number;
}

interface BufferedConnection {
	ws: WebSocket;
	url: string;
	subscribe: Record<string, unknown> | undefined;
	bufferSize: number;
	messageKey: string | undefined;
	messages: unknown[];
	totalMessageCount: number;
	state: 'connecting' | 'open' | 'reconnecting' | 'closed';
	lastPolledAt: number;
	reconnectAttempts: number;
	reconnectTimer: ReturnType<typeof setTimeout> | null;
}

// ---------------------------------------------------------------------------
// Manager
// ---------------------------------------------------------------------------

export class WebSocketManager {
	private connections = new Map<string, BufferedConnection>();
	private gcTimer: ReturnType<typeof setInterval> | null = null;
	private readonly idleTimeoutMs: number;
	private readonly maxReconnectAttempts: number;

	constructor(options?: WebSocketManagerOptions) {
		this.idleTimeoutMs = options?.idleTimeoutMs ?? 300_000;
		this.maxReconnectAttempts = options?.maxReconnectAttempts ?? 10;
		const gcIntervalMs = options?.gcIntervalMs ?? 60_000;

		this.gcTimer = setInterval(() => this.gc(), gcIntervalMs);
		// Allow the process to exit even if the timer is running
		if (this.gcTimer.unref) this.gcTimer.unref();
	}

	// -----------------------------------------------------------------------
	// Public API
	// -----------------------------------------------------------------------

	/**
	 * Get or create a WebSocket connection. Returns the connection key.
	 */
	getOrCreate(options: WebSocketConnectionOptions): string {
		const key = this.buildKey(options.url, options.subscribe);
		if (!this.connections.has(key)) {
			this.createConnection(key, options);
		}
		return key;
	}

	/**
	 * Return a snapshot of buffered messages and reset the idle timer.
	 */
	getMessages(connectionKey: string): WebSocketSnapshot {
		const conn = this.connections.get(connectionKey);
		if (!conn) {
			return { messages: [], state: 'closed', messageCount: 0 };
		}
		conn.lastPolledAt = Date.now();
		return {
			messages: [...conn.messages],
			state: conn.state,
			messageCount: conn.totalMessageCount,
		};
	}

	/**
	 * Close a specific connection and remove it.
	 */
	close(connectionKey: string): void {
		const conn = this.connections.get(connectionKey);
		if (!conn) return;
		this.teardown(conn);
		this.connections.delete(connectionKey);
	}

	/**
	 * Close all connections and stop the GC timer.
	 */
	shutdown(): void {
		for (const [key, conn] of this.connections) {
			this.teardown(conn);
			this.connections.delete(key);
		}
		if (this.gcTimer) {
			clearInterval(this.gcTimer);
			this.gcTimer = null;
		}
	}

	// -----------------------------------------------------------------------
	// Internals
	// -----------------------------------------------------------------------

	private buildKey(url: string, subscribe?: Record<string, unknown>): string {
		const payload = JSON.stringify({ url, subscribe });
		return createHash('sha256').update(payload).digest('hex').slice(0, 16);
	}

	private createConnection(key: string, options: WebSocketConnectionOptions): void {
		console.log(`[WebSocketManager] Creating connection: ${key} → ${options.url}`);
		const ws = new WebSocket(options.url);

		const conn: BufferedConnection = {
			ws,
			url: options.url,
			subscribe: options.subscribe,
			bufferSize: options.bufferSize,
			messageKey: options.messageKey,
			messages: [],
			totalMessageCount: 0,
			state: 'connecting',
			lastPolledAt: Date.now(),
			reconnectAttempts: 0,
			reconnectTimer: null,
		};

		this.attachListeners(key, conn);
		this.connections.set(key, conn);
	}

	private attachListeners(key: string, conn: BufferedConnection): void {
		conn.ws.on('open', () => {
			console.log(`[WebSocketManager] Connection open: ${conn.url}`);
			conn.state = 'open';
			conn.reconnectAttempts = 0;
			if (conn.subscribe) {
				conn.ws.send(JSON.stringify(conn.subscribe));
			}
		});

		conn.ws.on('message', (data: WebSocket.RawData) => {
			try {
				const parsed = JSON.parse(data.toString());
				const value = conn.messageKey ? (parsed as Record<string, unknown>)[conn.messageKey] : parsed;
				if (value == null) return;
				conn.messages.push(value);
				conn.totalMessageCount++;
				if (conn.messages.length > conn.bufferSize) {
					conn.messages.splice(0, conn.messages.length - conn.bufferSize);
				}
			} catch {
				// Non-JSON message — skip silently
			}
		});

		conn.ws.on('close', () => {
			if (conn.state !== 'closed') {
				this.scheduleReconnect(key, conn);
			}
		});

		conn.ws.on('error', (err: Error) => {
			console.error(`[WebSocketManager] Error on ${conn.url}:`, err.message);
		});
	}

	private scheduleReconnect(key: string, conn: BufferedConnection): void {
		if (conn.reconnectAttempts >= this.maxReconnectAttempts) {
			conn.state = 'closed';
			return;
		}

		conn.state = 'reconnecting';
		conn.reconnectAttempts++;

		const delay = Math.min(1000 * 2 ** (conn.reconnectAttempts - 1), 30_000);
		const jitter = Math.random() * 1000;

		conn.reconnectTimer = setTimeout(() => {
			conn.reconnectTimer = null;
			if (!this.connections.has(key)) return; // connection was removed

			const ws = new WebSocket(conn.url);
			conn.ws = ws;
			this.attachListeners(key, conn);
		}, delay + jitter);

		if (conn.reconnectTimer.unref) conn.reconnectTimer.unref();
	}

	private teardown(conn: BufferedConnection): void {
		conn.state = 'closed';
		if (conn.reconnectTimer) {
			clearTimeout(conn.reconnectTimer);
			conn.reconnectTimer = null;
		}
		try {
			conn.ws.close();
		} catch {
			// Ignore close errors
		}
	}

	private gc(): void {
		const now = Date.now();
		for (const [key, conn] of this.connections) {
			if (now - conn.lastPolledAt > this.idleTimeoutMs) {
				this.teardown(conn);
				this.connections.delete(key);
			}
		}
	}
}
