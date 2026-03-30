import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from '../lib/icons.js';

interface ChatInputProps {
	onSend: (prompt: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
	const [value, setValue] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize: 1 line → max 5 lines (~160px)
	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
	}, [value]);

	const submit = useCallback(() => {
		const trimmed = value.trim();
		if (!trimmed || disabled) return;
		onSend(trimmed);
		setValue('');
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
		}
	}, [value, disabled, onSend]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Enter to send, Shift+Enter for newline
		// Don't send during IME composition (Japanese, Chinese input)
		if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			submit();
		}
	}, [submit]);

	return (
		<div className="flex items-end gap-2 p-3 border-t border-border bg-surface">
			<textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder ?? 'Send a message...'}
				disabled={disabled}
				rows={1}
				className="flex-1 resize-none rounded-lg border border-border-input bg-surface px-3 py-2
					text-sm text-fg placeholder:text-fg-subtle
					focus:border-primary focus:ring-2 focus:ring-ring/30 focus:outline-none
					disabled:opacity-50 disabled:cursor-not-allowed
					transition-colors"
				aria-label="Chat message input"
			/>
			<button
				type="button"
				onClick={submit}
				disabled={disabled || !value.trim()}
				className="flex-shrink-0 rounded-lg bg-primary p-2.5 text-primary-fg
					hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed
					transition-colors"
				aria-label="Send message"
			>
				<Send className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	);
}
