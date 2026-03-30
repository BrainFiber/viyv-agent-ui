import { useEffect, useMemo, useRef } from 'react';
import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { Bot, RotateCcw, CircleX } from '../lib/icons.js';
import { useChat } from './use-chat.js';
import { ChatMessage, HitlPanel } from './chat-message.js';
import { ChatInput } from './chat-input.js';
import type { ChatMessage as ChatMessageType } from './types.js';

// ── Props ──

export interface ChatProps {
	endpoint: string;
	agent?: string;
	title?: string;
	placeholder?: string;
	height?: number;
	showTokenUsage?: boolean;
	welcomeMessage?: string;
	className?: string;
}

// ── Component ──

export function Chat({
	endpoint,
	agent,
	title,
	placeholder,
	height = 500,
	showTokenUsage,
	welcomeMessage,
	className,
}: ChatProps) {
	const { messages, status, pendingHitl, error, send, resolveHitl, clear } = useChat(endpoint, agent);

	// ── Auto-scroll ──
	const scrollRef = useRef<HTMLDivElement>(null);
	const isNearBottom = useRef(true);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
	};

	useEffect(() => {
		if (isNearBottom.current && scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, pendingHitl, error]);

	// ── Display messages (include welcome message if no messages yet) ──
	const displayMessages = useMemo<ChatMessageType[]>(() => {
		if (welcomeMessage && messages.length === 0) {
			return [{
				id: '__welcome__',
				role: 'assistant',
				content: welcomeMessage,
				timestamp: '',
			}];
		}
		return messages;
	}, [welcomeMessage, messages]);

	return (
		<div
			className={cn(
				'flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden',
				className,
			)}
			style={{ height: `${height}px` }}
		>
			{/* ── Header ── */}
			{title && (
				<div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
					<div className="flex items-center gap-2">
						<Bot className="h-5 w-5 text-primary" aria-hidden="true" />
						<span className="font-medium text-sm text-fg">{title}</span>
						{status === 'streaming' && (
							<span className="text-[10px] text-fg-subtle animate-pulse">responding...</span>
						)}
					</div>
					<button
						type="button"
						onClick={clear}
						className="rounded-md p-1.5 text-fg-muted hover:text-fg hover:bg-muted transition-colors"
						aria-label="Clear messages"
					>
						<RotateCcw className="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
			)}

			{/* ── Messages ── */}
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
				role="log"
				aria-live="polite"
				aria-label="Chat messages"
			>
				{/* Empty state */}
				{displayMessages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full gap-3 text-fg-muted">
						<Bot className="h-10 w-10 opacity-30" aria-hidden="true" />
						<p className="text-sm">Send a message to start</p>
					</div>
				)}

				{/* Message list */}
				{displayMessages.map((msg) => (
					<ChatMessage key={msg.id} message={msg} showTokenUsage={showTokenUsage} />
				))}

				{/* HITL panel */}
				{pendingHitl && (
					<HitlPanel hitl={pendingHitl} onResolve={resolveHitl} />
				)}

				{/* Error */}
				{error && (
					<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 text-danger text-sm" role="alert">
						<CircleX className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
						<span>{error}</span>
					</div>
				)}
			</div>

			{/* ── Input ── */}
			<ChatInput
				onSend={send}
				disabled={status === 'streaming' || status === 'sending'}
				placeholder={placeholder}
			/>
		</div>
	);
}

// ── ComponentMeta ──

export const chatMeta: ComponentMeta = {
	type: 'Chat',
	label: 'Chat',
	description:
		'Interactive chat interface connecting to an AI agent gateway via SSE streaming. ' +
		'Supports multi-turn conversation, tool use display, thinking process, and human-in-the-loop approval. ' +
		'Configure with endpoint URL and agent name.',
	category: 'data',
	propsSchema: z.object({
		endpoint: z.string().describe('Gateway API base URL (e.g. http://localhost:8080)'),
		agent: z.string().optional().describe('Target agent name (default: "default")'),
		title: z.string().optional().describe('Header title text'),
		placeholder: z.string().optional().describe('Input placeholder text'),
		height: z.number().optional().describe('Container height in px (default: 500)'),
		showTokenUsage: z.boolean().optional().describe('Show token usage after each response'),
		welcomeMessage: z.string().optional().describe('Initial welcome message from assistant'),
		className: z.string().optional(),
	}),
	acceptsChildren: false,
};
