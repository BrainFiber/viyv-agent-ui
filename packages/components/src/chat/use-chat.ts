/**
 * Application logic hook for the Chat component.
 * Composes chat-api (HTTP) + sse-parser (protocol) with useReducer (state).
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { submitTask, openTaskStream, resolveHitlRequest } from './chat-api.js';
import { parseSSEStream } from './sse-parser.js';
import type { ChatMessage, ChatState, ChatStatus, HitlRequest, HitlResponse, ToolCall, TokenUsage } from './types.js';

// ── Reducer ──

type ChatAction =
	| { type: 'ADD_USER_MESSAGE'; id: string; content: string }
	| { type: 'START_ASSISTANT_MESSAGE'; id: string }
	| { type: 'APPEND_TEXT'; delta: string }
	| { type: 'SET_THINKING'; content: string }
	| { type: 'ADD_TOOL_CALL'; toolCall: ToolCall }
	| { type: 'UPDATE_TOOL_RESULT'; toolId: string; output: unknown }
	| { type: 'COMPLETE'; sessionId?: string; usage?: TokenUsage }
	| { type: 'SET_ERROR'; error: string }
	| { type: 'SET_HITL'; hitl: HitlRequest | null }
	| { type: 'CLEAR' };

const initialState: ChatState = {
	messages: [],
	status: 'idle',
	sessionId: null,
	pendingHitl: null,
	error: null,
};

function updateLastMessage(messages: ChatMessage[], updater: (msg: ChatMessage) => ChatMessage): ChatMessage[] {
	if (messages.length === 0) return messages;
	const updated = [...messages];
	updated[updated.length - 1] = updater({ ...updated[updated.length - 1] });
	return updated;
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
	switch (action.type) {
		case 'ADD_USER_MESSAGE':
			return {
				...state,
				status: 'sending',
				error: null,
				messages: [
					...state.messages,
					{
						id: action.id,
						role: 'user',
						content: action.content,
						timestamp: new Date().toISOString(),
					},
				],
			};

		case 'START_ASSISTANT_MESSAGE':
			return {
				...state,
				status: 'streaming',
				messages: [
					...state.messages,
					{
						id: action.id,
						role: 'assistant',
						content: '',
						timestamp: new Date().toISOString(),
						isStreaming: true,
						toolCalls: [],
					},
				],
			};

		case 'APPEND_TEXT':
			return {
				...state,
				messages: updateLastMessage(state.messages, (msg) => ({
					...msg,
					content: msg.content + action.delta,
				})),
			};

		case 'SET_THINKING':
			return {
				...state,
				messages: updateLastMessage(state.messages, (msg) => ({
					...msg,
					thinkingContent: (msg.thinkingContent ?? '') + action.content,
				})),
			};

		case 'ADD_TOOL_CALL':
			return {
				...state,
				messages: updateLastMessage(state.messages, (msg) => ({
					...msg,
					toolCalls: [...(msg.toolCalls ?? []), action.toolCall],
				})),
			};

		case 'UPDATE_TOOL_RESULT':
			return {
				...state,
				messages: updateLastMessage(state.messages, (msg) => ({
					...msg,
					toolCalls: (msg.toolCalls ?? []).map((tc) =>
						tc.id === action.toolId ? { ...tc, output: action.output, status: 'completed' as const } : tc,
					),
				})),
			};

		case 'COMPLETE':
			// Idempotent: if already idle (e.g. safety dispatch after stream end), no-op
			if (state.status === 'idle') return state;
			return {
				...state,
				status: 'idle',
				sessionId: action.sessionId ?? state.sessionId,
				messages: updateLastMessage(state.messages, (msg) => ({
					...msg,
					isStreaming: false,
					usage: action.usage ?? msg.usage,
				})),
			};

		case 'SET_ERROR':
			return {
				...state,
				status: 'error',
				error: action.error,
				// Mark streaming message as not streaming anymore
				messages: updateLastMessage(state.messages, (msg) =>
					msg.isStreaming ? { ...msg, isStreaming: false } : msg,
				),
			};

		case 'SET_HITL':
			return { ...state, pendingHitl: action.hitl };

		case 'CLEAR':
			return { ...initialState };

		default:
			return state;
	}
}

// ── Stream processor ──

async function processStream(
	endpoint: string,
	taskId: string,
	dispatch: React.Dispatch<ChatAction>,
	signal: AbortSignal,
): Promise<void> {
	const body = await openTaskStream(endpoint, taskId, signal);

	const msgId = typeof crypto !== 'undefined' && crypto.randomUUID
		? crypto.randomUUID()
		: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

	dispatch({ type: 'START_ASSISTANT_MESSAGE', id: msgId });

	for await (const event of parseSSEStream(body, signal)) {
		let envelope: Record<string, unknown>;
		try {
			envelope = JSON.parse(event.data) as Record<string, unknown>;
		} catch {
			continue; // skip non-JSON data
		}

		// Gateway wraps event payload: { seq, taskId, type, data: { ...payload } }
		// Extract the inner data object, fall back to envelope itself for flat formats
		const data = (typeof envelope.data === 'object' && envelope.data !== null
			? envelope.data
			: envelope) as Record<string, unknown>;

		switch (event.event) {
			case 'text_chunk':
				if (typeof data.delta === 'string') {
					dispatch({ type: 'APPEND_TEXT', delta: data.delta });
				}
				break;

			case 'tool_use':
				dispatch({
					type: 'ADD_TOOL_CALL',
					toolCall: {
						id: (data.id as string) ?? '',
						tool: ((data.tool ?? data.toolName) as string) ?? '',
						input: (data.input as Record<string, unknown>) ?? {},
						status: 'running',
					},
				});
				break;

			case 'tool_result':
				dispatch({
					type: 'UPDATE_TOOL_RESULT',
					toolId: (data.id as string) ?? '',
					output: data.output,
				});
				break;

			case 'thinking':
				if (typeof data.content === 'string') {
					dispatch({ type: 'SET_THINKING', content: data.content });
				}
				break;

			case 'hitl:created':
				dispatch({
					type: 'SET_HITL',
					hitl: {
						requestId: data.requestId as string,
						type: data.type as HitlRequest['type'],
						prompt: data.prompt as string,
						toolName: data.toolName as string | undefined,
						agentName: data.agentName as string | undefined,
					},
				});
				break;

			case 'hitl:resolved':
				dispatch({ type: 'SET_HITL', hitl: null });
				break;

			case 'complete':
				dispatch({
					type: 'COMPLETE',
					sessionId: data.sessionId as string | undefined,
					usage: data.usage as TokenUsage | undefined,
				});
				break;

			case 'error':
				dispatch({ type: 'SET_ERROR', error: (data.error as string) ?? 'Unknown error' });
				break;

			// Ignore: text (accumulated), rate_limit, status
		}
	}
}

// ── Hook ──

export interface UseChatReturn {
	messages: ChatMessage[];
	status: ChatStatus;
	sessionId: string | null;
	pendingHitl: HitlRequest | null;
	error: string | null;
	send: (prompt: string) => Promise<void>;
	resolveHitl: (requestId: string, response: HitlResponse) => Promise<void>;
	clear: () => void;
}

export function useChat(endpoint: string, agent?: string): UseChatReturn {
	const [state, dispatch] = useReducer(chatReducer, initialState);
	const abortRef = useRef<AbortController | null>(null);
	const sessionRef = useRef<string | null>(null);

	// Keep sessionRef in sync with state
	useEffect(() => {
		sessionRef.current = state.sessionId;
	}, [state.sessionId]);

	// Abort stream on unmount
	useEffect(() => () => { abortRef.current?.abort(); }, []);

	const send = useCallback(async (prompt: string) => {
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		const id = typeof crypto !== 'undefined' && crypto.randomUUID
			? crypto.randomUUID()
			: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

		dispatch({ type: 'ADD_USER_MESSAGE', id, content: prompt });

		try {
			const { taskId } = await submitTask(endpoint, prompt, agent, sessionRef.current ?? undefined);
			await processStream(endpoint, taskId, dispatch, controller.signal);
			// Safety: if stream ended without explicit complete/error event, finalize the message
			if (!controller.signal.aborted) {
				dispatch({ type: 'COMPLETE' });
			}
		} catch (err) {
			if (!controller.signal.aborted) {
				dispatch({ type: 'SET_ERROR', error: (err as Error).message });
			}
		}
	}, [endpoint, agent]);

	const handleResolveHitl = useCallback(async (requestId: string, response: HitlResponse) => {
		try {
			await resolveHitlRequest(endpoint, requestId, response);
			dispatch({ type: 'SET_HITL', hitl: null });
		} catch (err) {
			dispatch({ type: 'SET_ERROR', error: (err as Error).message });
		}
	}, [endpoint]);

	const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

	return {
		messages: state.messages,
		status: state.status,
		sessionId: state.sessionId,
		pendingHitl: state.pendingHitl,
		error: state.error,
		send,
		resolveHitl: handleResolveHitl,
		clear,
	};
}
