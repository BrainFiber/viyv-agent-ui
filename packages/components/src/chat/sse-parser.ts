import type { SSEEvent } from './types.js';

/**
 * Parse an SSE text/event-stream from a ReadableStream into an async generator.
 *
 * SSE format:
 *   event: text_chunk
 *   data: {"delta":"Hello"}
 *   (blank line = end of event)
 */
export async function* parseSSEStream(
	stream: ReadableStream<Uint8Array>,
	signal?: AbortSignal,
): AsyncGenerator<SSEEvent> {
	const decoder = new TextDecoderStream();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TextDecoderStream typing mismatch in TS lib
	const reader = stream.pipeThrough(decoder as any).getReader() as ReadableStreamDefaultReader<string>;
	let buffer = '';
	let currentEvent = '';
	let currentData = '';

	try {
		while (true) {
			if (signal?.aborted) break;
			const { done, value } = await reader.read();
			if (done) break;

			buffer += value;
			const lines = buffer.split('\n');
			buffer = lines.pop() ?? '';

			for (const rawLine of lines) {
				const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;
				if (line.startsWith('event: ')) {
					currentEvent = line.slice(7);
				} else if (line.startsWith('data: ')) {
					currentData += (currentData ? '\n' : '') + line.slice(6);
				} else if (line === '' && currentEvent) {
					yield { event: currentEvent, data: currentData };
					currentEvent = '';
					currentData = '';
				}
				// Lines starting with ':' are comments (heartbeat etc.) — ignored
			}
		}
	} finally {
		reader.releaseLock();
	}
}
