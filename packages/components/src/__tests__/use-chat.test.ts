import { describe, it, expect } from 'vitest';
import { chatReducer } from '../chat/use-chat.js';
import type { ChatState } from '../chat/types.js';

const initialState: ChatState = {
	messages: [],
	status: 'idle',
	sessionId: null,
	pendingHitl: null,
	error: null,
};

describe('chatReducer', () => {
	it('ADD_USER_MESSAGE adds a user message and sets status to sending', () => {
		const state = chatReducer(initialState, {
			type: 'ADD_USER_MESSAGE',
			id: 'msg_1',
			content: 'Hello',
		});

		expect(state.status).toBe('sending');
		expect(state.error).toBeNull();
		expect(state.messages).toHaveLength(1);
		expect(state.messages[0].role).toBe('user');
		expect(state.messages[0].content).toBe('Hello');
		expect(state.messages[0].id).toBe('msg_1');
	});

	it('START_ASSISTANT_MESSAGE adds an empty streaming assistant message', () => {
		const withUser = chatReducer(initialState, {
			type: 'ADD_USER_MESSAGE',
			id: 'msg_1',
			content: 'Hi',
		});
		const state = chatReducer(withUser, {
			type: 'START_ASSISTANT_MESSAGE',
			id: 'msg_2',
		});

		expect(state.status).toBe('streaming');
		expect(state.messages).toHaveLength(2);
		const assistantMsg = state.messages[1];
		expect(assistantMsg.role).toBe('assistant');
		expect(assistantMsg.content).toBe('');
		expect(assistantMsg.isStreaming).toBe(true);
		expect(assistantMsg.toolCalls).toEqual([]);
	});

	it('APPEND_TEXT appends delta to last message content', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, { type: 'APPEND_TEXT', delta: 'Hello' });
		state = chatReducer(state, { type: 'APPEND_TEXT', delta: ' world' });

		expect(state.messages[0].content).toBe('Hello world');
	});

	it('SET_THINKING appends thinking content', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, { type: 'SET_THINKING', content: 'Let me think...' });
		state = chatReducer(state, { type: 'SET_THINKING', content: ' more thinking' });

		expect(state.messages[0].thinkingContent).toBe('Let me think... more thinking');
	});

	it('ADD_TOOL_CALL adds a tool call to the last message', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, {
			type: 'ADD_TOOL_CALL',
			toolCall: { id: 'tc_1', tool: 'search', input: { q: 'test' }, status: 'running' },
		});

		expect(state.messages[0].toolCalls).toHaveLength(1);
		expect(state.messages[0].toolCalls![0].tool).toBe('search');
		expect(state.messages[0].toolCalls![0].status).toBe('running');
	});

	it('UPDATE_TOOL_RESULT updates the matching tool call', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, {
			type: 'ADD_TOOL_CALL',
			toolCall: { id: 'tc_1', tool: 'search', input: { q: 'test' }, status: 'running' },
		});
		state = chatReducer(state, {
			type: 'UPDATE_TOOL_RESULT',
			toolId: 'tc_1',
			output: ['result1', 'result2'],
		});

		const tc = state.messages[0].toolCalls![0];
		expect(tc.status).toBe('completed');
		expect(tc.output).toEqual(['result1', 'result2']);
	});

	it('COMPLETE sets status to idle, saves sessionId, and marks message as not streaming', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, { type: 'APPEND_TEXT', delta: 'Done' });
		state = chatReducer(state, {
			type: 'COMPLETE',
			sessionId: 'ses_abc',
			usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
		});

		expect(state.status).toBe('idle');
		expect(state.sessionId).toBe('ses_abc');
		expect(state.messages[0].isStreaming).toBe(false);
		expect(state.messages[0].usage?.totalTokens).toBe(150);
	});

	it('COMPLETE preserves existing sessionId if not provided', () => {
		let state = { ...initialState, sessionId: 'ses_old' };
		state = chatReducer(state, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, { type: 'COMPLETE' });

		expect(state.sessionId).toBe('ses_old');
	});

	it('SET_ERROR sets error status and marks streaming message as not streaming', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, { type: 'SET_ERROR', error: 'Connection failed' });

		expect(state.status).toBe('error');
		expect(state.error).toBe('Connection failed');
		expect(state.messages[0].isStreaming).toBe(false);
	});

	it('SET_HITL sets pending HITL request', () => {
		const hitl = {
			requestId: 'req_1',
			type: 'approval' as const,
			prompt: 'Delete file?',
			toolName: 'delete_file',
		};
		const state = chatReducer(initialState, { type: 'SET_HITL', hitl });

		expect(state.pendingHitl).toEqual(hitl);
	});

	it('SET_HITL clears pending HITL when null', () => {
		let state = chatReducer(initialState, {
			type: 'SET_HITL',
			hitl: { requestId: 'req_1', type: 'approval', prompt: 'OK?' },
		});
		state = chatReducer(state, { type: 'SET_HITL', hitl: null });

		expect(state.pendingHitl).toBeNull();
	});

	it('CLEAR resets to initial state', () => {
		let state = chatReducer(initialState, { type: 'ADD_USER_MESSAGE', id: 'msg_1', content: 'Hi' });
		state = chatReducer(state, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_2' });
		state = chatReducer(state, { type: 'COMPLETE', sessionId: 'ses_1' });
		state = chatReducer(state, { type: 'CLEAR' });

		expect(state.messages).toHaveLength(0);
		expect(state.status).toBe('idle');
		expect(state.sessionId).toBeNull();
		expect(state.pendingHitl).toBeNull();
		expect(state.error).toBeNull();
	});

	it('ADD_USER_MESSAGE clears previous error', () => {
		let state = chatReducer(initialState, { type: 'SET_ERROR', error: 'old error' });
		state = chatReducer(state, { type: 'ADD_USER_MESSAGE', id: 'msg_1', content: 'retry' });

		expect(state.error).toBeNull();
	});

	it('COMPLETE is idempotent — second dispatch is a no-op', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });
		state = chatReducer(state, { type: 'APPEND_TEXT', delta: 'Done' });
		state = chatReducer(state, { type: 'COMPLETE', sessionId: 'ses_1', usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 } });

		// Second COMPLETE (safety dispatch) should be no-op
		const state2 = chatReducer(state, { type: 'COMPLETE' });
		expect(state2).toBe(state); // exact same reference
		expect(state2.sessionId).toBe('ses_1');
		expect(state2.messages[0].usage?.totalTokens).toBe(15);
	});

	it('multi-turn conversation preserves sessionId across turns', () => {
		// Turn 1
		let state = chatReducer(initialState, { type: 'ADD_USER_MESSAGE', id: 'u1', content: 'Hello' });
		state = chatReducer(state, { type: 'START_ASSISTANT_MESSAGE', id: 'a1' });
		state = chatReducer(state, { type: 'APPEND_TEXT', delta: 'Hi!' });
		state = chatReducer(state, { type: 'COMPLETE', sessionId: 'ses_abc' });

		expect(state.sessionId).toBe('ses_abc');
		expect(state.messages).toHaveLength(2);

		// Turn 2
		state = chatReducer(state, { type: 'ADD_USER_MESSAGE', id: 'u2', content: 'Follow up' });
		state = chatReducer(state, { type: 'START_ASSISTANT_MESSAGE', id: 'a2' });
		state = chatReducer(state, { type: 'APPEND_TEXT', delta: 'Sure!' });
		state = chatReducer(state, { type: 'COMPLETE', sessionId: 'ses_abc' });

		expect(state.sessionId).toBe('ses_abc');
		expect(state.messages).toHaveLength(4);
		expect(state.messages[2].role).toBe('user');
		expect(state.messages[3].role).toBe('assistant');
		expect(state.messages[3].content).toBe('Sure!');
	});

	it('handles multiple tool calls with selective result updates', () => {
		let state = chatReducer(initialState, { type: 'START_ASSISTANT_MESSAGE', id: 'msg_1' });

		// Add two tool calls
		state = chatReducer(state, {
			type: 'ADD_TOOL_CALL',
			toolCall: { id: 'tc_1', tool: 'read_file', input: { path: 'a.ts' }, status: 'running' },
		});
		state = chatReducer(state, {
			type: 'ADD_TOOL_CALL',
			toolCall: { id: 'tc_2', tool: 'search', input: { q: 'test' }, status: 'running' },
		});

		expect(state.messages[0].toolCalls).toHaveLength(2);

		// Complete only the first
		state = chatReducer(state, { type: 'UPDATE_TOOL_RESULT', toolId: 'tc_1', output: 'file content' });

		const tcs = state.messages[0].toolCalls!;
		expect(tcs[0].status).toBe('completed');
		expect(tcs[0].output).toBe('file content');
		expect(tcs[1].status).toBe('running');
		expect(tcs[1].output).toBeUndefined();
	});

	it('SET_ERROR on empty messages does not crash', () => {
		const state = chatReducer(initialState, { type: 'SET_ERROR', error: 'fail' });
		expect(state.status).toBe('error');
		expect(state.error).toBe('fail');
		expect(state.messages).toHaveLength(0);
	});
});
