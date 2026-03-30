// ── Chat Message ──

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
	isStreaming?: boolean;
	toolCalls?: ToolCall[];
	thinkingContent?: string;
	usage?: TokenUsage;
}

export interface ToolCall {
	id: string;
	tool: string;
	input: Record<string, unknown>;
	output?: unknown;
	status: 'running' | 'completed';
}

export interface TokenUsage {
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	costUsd?: number;
	model?: string;
}

// ── HITL ──

export interface HitlRequest {
	requestId: string;
	type: 'approval' | 'question' | 'plan_review';
	prompt: string;
	toolName?: string;
	agentName?: string;
}

export interface HitlResponse {
	approved?: boolean;
	decision?: 'approve' | 'deny';
	answer?: string;
	reason?: string;
	revise?: boolean;
}

// ── SSE ──

export interface SSEEvent {
	event: string;
	data: string;
}

// ── State ──

export type ChatStatus = 'idle' | 'sending' | 'streaming' | 'error';

export interface ChatState {
	messages: ChatMessage[];
	status: ChatStatus;
	sessionId: string | null;
	pendingHitl: HitlRequest | null;
	error: string | null;
}
