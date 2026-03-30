import React, { useMemo, useState } from 'react';
import { cn } from '../lib/cn.js';
import { Bot, Wrench, Loader2, Check, ChevronDown, Brain, ShieldCheck } from '../lib/icons.js';
import { useMarkdown } from './use-markdown.js';
import type { ChatMessage as ChatMessageType, ToolCall, HitlRequest, HitlResponse } from './types.js';

// ── ChatMessage ──

interface ChatMessageProps {
	message: ChatMessageType;
	showTokenUsage?: boolean;
}

export const ChatMessage = React.memo(function ChatMessage({ message, showTokenUsage }: ChatMessageProps) {
	if (message.role === 'user') {
		return <UserBubble content={message.content} timestamp={message.timestamp} />;
	}

	return (
		<AssistantBubble
			message={message}
			showTokenUsage={showTokenUsage}
		/>
	);
});

// ── User Bubble ──

function UserBubble({ content, timestamp }: { content: string; timestamp: string }) {
	return (
		<div className="flex flex-col items-end gap-1" role="article" aria-label={`User message: ${content.slice(0, 60)}`}>
			<div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-fg">
				<p className="text-sm whitespace-pre-wrap break-words">{content}</p>
			</div>
			<time className="text-[10px] text-fg-subtle px-1">{formatTime(timestamp)}</time>
		</div>
	);
}

// ── Assistant Bubble ──

function AssistantBubble({ message, showTokenUsage }: { message: ChatMessageType; showTokenUsage?: boolean }) {
	const { render, ready } = useMarkdown();

	const htmlContent = useMemo(() => {
		if (message.isStreaming || !ready) return null;
		if (!message.content) return null;
		return render(message.content);
	}, [message.content, message.isStreaming, ready, render]);

	return (
		<div className="flex gap-3 items-start" role="article" aria-label={`Assistant message: ${message.content.slice(0, 60)}`}>
			{/* Avatar */}
			<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
				<Bot className="h-4 w-4 text-primary" aria-hidden="true" />
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0 space-y-2">
				{/* Thinking */}
				{message.thinkingContent && (
					<ThinkingPanel content={message.thinkingContent} />
				)}

				{/* Tool calls */}
				{message.toolCalls?.map((tc) => (
					<ToolCallPanel key={tc.id} toolCall={tc} />
				))}

				{/* Message body */}
				{(message.content || message.isStreaming) && (
					<div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-alt px-4 py-2.5">
						{message.isStreaming || !htmlContent ? (
							<p className="text-sm whitespace-pre-wrap break-words text-fg">
								{message.content}
								{message.isStreaming && (
									<span className="inline-block w-[2px] h-4 bg-fg ml-0.5 align-text-bottom animate-pulse" />
								)}
							</p>
						) : (
							<div
								className="text-sm text-fg prose prose-sm max-w-none
									prose-headings:text-fg prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
									prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0
									prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
									prose-pre:bg-[var(--color-muted)] prose-pre:rounded-lg prose-pre:p-3 prose-pre:my-2
									prose-a:text-primary prose-a:no-underline hover:prose-a:underline
									prose-blockquote:border-primary/30 prose-blockquote:text-fg-muted
									prose-table:text-xs prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1"
								dangerouslySetInnerHTML={{ __html: htmlContent }}
							/>
						)}
					</div>
				)}

				{/* Footer: timestamp + token usage */}
				<div className="flex items-center gap-2 px-1">
					<time className="text-[10px] text-fg-subtle">{formatTime(message.timestamp)}</time>
					{showTokenUsage && message.usage && !message.isStreaming && (
						<span className="text-[10px] text-fg-subtle">
							{message.usage.totalTokens.toLocaleString()} tokens
							{message.usage.model && ` · ${message.usage.model}`}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

// ── Tool Call Panel ──

function ToolCallPanel({ toolCall }: { toolCall: ToolCall }) {
	const [open, setOpen] = useState(false);

	return (
		<div
			className="border-l-2 border-primary/30 pl-3 my-1"
			aria-label={`Tool: ${toolCall.tool}`}
		>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 text-xs text-fg-muted hover:text-fg transition-colors"
			>
				<Wrench className="h-3 w-3" aria-hidden="true" />
				<span className="font-medium">{toolCall.tool}</span>
				{toolCall.status === 'running'
					? <Loader2 className="h-3 w-3 animate-spin text-primary" aria-hidden="true" />
					: <Check className="h-3 w-3 text-success" aria-hidden="true" />
				}
				<ChevronDown
					className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')}
					aria-hidden="true"
				/>
			</button>
			{open && (
				<div className="mt-1.5 space-y-1">
					<pre className="text-[11px] bg-surface-alt rounded-md p-2 overflow-x-auto text-fg-muted font-mono">
						{JSON.stringify(toolCall.input, null, 2)}
					</pre>
					{toolCall.output != null && (
						<pre className="text-[11px] bg-surface-alt rounded-md p-2 overflow-x-auto text-fg-muted font-mono">
							{typeof toolCall.output === 'string'
								? toolCall.output.slice(0, 2000)
								: JSON.stringify(toolCall.output, null, 2).slice(0, 2000)}
						</pre>
					)}
				</div>
			)}
		</div>
	);
}

// ── Thinking Panel ──

function ThinkingPanel({ content }: { content: string }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="my-1">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex items-center gap-1.5 text-xs text-fg-subtle hover:text-fg-muted transition-colors"
			>
				<Brain className="h-3 w-3" aria-hidden="true" />
				<span className="italic">Thinking...</span>
				<ChevronDown
					className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')}
					aria-hidden="true"
				/>
			</button>
			{open && (
				<div className="mt-1 pl-4 border-l border-border">
					<p className="text-xs text-fg-subtle italic whitespace-pre-wrap">{content}</p>
				</div>
			)}
		</div>
	);
}

// ── HITL Panel ──

interface HitlPanelProps {
	hitl: HitlRequest;
	onResolve: (requestId: string, response: HitlResponse) => Promise<void>;
}

export function HitlPanel({ hitl, onResolve }: HitlPanelProps) {
	const [answer, setAnswer] = useState('');
	const [resolving, setResolving] = useState(false);

	const handleResolve = async (response: HitlResponse) => {
		setResolving(true);
		try {
			await onResolve(hitl.requestId, response);
		} finally {
			setResolving(false);
		}
	};

	return (
		<div
			className="rounded-lg border border-warning bg-warning/5 p-4 my-2 space-y-3"
			role="alert"
			aria-label={`${hitl.type === 'approval' ? 'Approval' : hitl.type === 'question' ? 'Question' : 'Plan review'} required`}
		>
			{/* Header */}
			<div className="flex items-center gap-2 text-sm font-medium text-warning-fg">
				<ShieldCheck className="h-4 w-4" aria-hidden="true" />
				<span>
					{hitl.type === 'approval' && 'Approval Required'}
					{hitl.type === 'question' && 'Question'}
					{hitl.type === 'plan_review' && 'Plan Review'}
				</span>
			</div>

			{/* Prompt */}
			<p className="text-sm text-fg whitespace-pre-wrap">{hitl.prompt}</p>

			{hitl.toolName && (
				<p className="text-xs text-fg-muted">
					Tool: <code className="bg-muted px-1 py-0.5 rounded text-xs">{hitl.toolName}</code>
				</p>
			)}

			{/* Actions */}
			{hitl.type === 'question' ? (
				<div className="flex gap-2">
					<input
						type="text"
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						placeholder="Enter your answer..."
						className="flex-1 rounded-md border border-border-input bg-surface px-3 py-1.5 text-sm
							focus:border-primary focus:ring-2 focus:ring-ring/30 focus:outline-none"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && answer.trim()) {
								handleResolve({ answer: answer.trim() });
							}
						}}
					/>
					<button
						type="button"
						onClick={() => handleResolve({ answer: answer.trim() })}
						disabled={resolving || !answer.trim()}
						className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-fg hover:bg-primary-hover disabled:opacity-50 transition-colors"
					>
						Submit
					</button>
				</div>
			) : (
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => handleResolve({ decision: 'approve' })}
						disabled={resolving}
						className="rounded-md bg-success px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:opacity-50 transition-colors"
					>
						Approve
					</button>
					<button
						type="button"
						onClick={() => handleResolve(
							hitl.type === 'plan_review'
								? { revise: true }
								: { decision: 'deny' },
						)}
						disabled={resolving}
						className="rounded-md bg-surface border border-border px-3 py-1.5 text-sm text-fg hover:bg-muted disabled:opacity-50 transition-colors"
					>
						{hitl.type === 'plan_review' ? 'Revise' : 'Deny'}
					</button>
				</div>
			)}
		</div>
	);
}

// ── Utilities ──

function formatTime(iso: string): string {
	if (!iso) return '';
	try {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '';
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	} catch {
		return '';
	}
}
