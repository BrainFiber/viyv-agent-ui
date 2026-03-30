import { describe, it, expect } from 'vitest';
import { parseSSEStream } from '../chat/sse-parser.js';

function createStream(text: string): ReadableStream<Uint8Array> {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(text));
			controller.close();
		},
	});
}

function createChunkedStream(chunks: string[]): ReadableStream<Uint8Array> {
	return new ReadableStream({
		start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(new TextEncoder().encode(chunk));
			}
			controller.close();
		},
	});
}

async function collectEvents(stream: ReadableStream<Uint8Array>, signal?: AbortSignal) {
	const events: { event: string; data: string }[] = [];
	for await (const e of parseSSEStream(stream, signal)) {
		events.push(e);
	}
	return events;
}

describe('parseSSEStream', () => {
	it('parses a single event', async () => {
		const stream = createStream('event: text_chunk\ndata: {"delta":"Hello"}\n\n');
		const events = await collectEvents(stream);
		expect(events).toEqual([{ event: 'text_chunk', data: '{"delta":"Hello"}' }]);
	});

	it('parses multiple events', async () => {
		const text =
			'event: text_chunk\ndata: {"delta":"A"}\n\n' +
			'event: text_chunk\ndata: {"delta":"B"}\n\n' +
			'event: complete\ndata: {"result":"done"}\n\n';
		const events = await collectEvents(createStream(text));
		expect(events).toHaveLength(3);
		expect(events[0].event).toBe('text_chunk');
		expect(events[2].event).toBe('complete');
	});

	it('ignores comment lines (heartbeat)', async () => {
		const text = ': heartbeat\n\nevent: text_chunk\ndata: {"delta":"X"}\n\n';
		const events = await collectEvents(createStream(text));
		expect(events).toHaveLength(1);
		expect(events[0].event).toBe('text_chunk');
	});

	it('handles chunked data split across reads', async () => {
		const stream = createChunkedStream([
			'event: text_ch',
			'unk\ndata: {"delta',
			'":"split"}\n\n',
		]);
		const events = await collectEvents(stream);
		expect(events).toEqual([{ event: 'text_chunk', data: '{"delta":"split"}' }]);
	});

	it('handles multi-line data', async () => {
		const text = 'event: thinking\ndata: line1\ndata: line2\n\n';
		const events = await collectEvents(createStream(text));
		expect(events).toHaveLength(1);
		expect(events[0].data).toBe('line1\nline2');
	});

	it('stops on abort signal', async () => {
		const controller = new AbortController();
		controller.abort();
		const stream = createStream('event: text_chunk\ndata: {"delta":"X"}\n\n');
		const events = await collectEvents(stream, controller.signal);
		expect(events).toHaveLength(0);
	});

	it('returns empty for stream with no events', async () => {
		const stream = createStream(': comment\n\n');
		const events = await collectEvents(stream);
		expect(events).toHaveLength(0);
	});

	it('handles event without data gracefully', async () => {
		const text = 'event: status\n\n';
		const events = await collectEvents(createStream(text));
		expect(events).toEqual([{ event: 'status', data: '' }]);
	});

	it('handles \\r\\n line endings (Windows/HTTP standard)', async () => {
		const text = 'event: text_chunk\r\ndata: {"delta":"CRLF"}\r\n\r\n';
		const events = await collectEvents(createStream(text));
		expect(events).toEqual([{ event: 'text_chunk', data: '{"delta":"CRLF"}' }]);
	});

	it('handles completely empty stream', async () => {
		const stream = createStream('');
		const events = await collectEvents(stream);
		expect(events).toHaveLength(0);
	});

	it('handles mixed \\n and \\r\\n line endings', async () => {
		const text = 'event: test\r\ndata: {"x":1}\n\n';
		const events = await collectEvents(createStream(text));
		expect(events).toEqual([{ event: 'test', data: '{"x":1}' }]);
	});
});
