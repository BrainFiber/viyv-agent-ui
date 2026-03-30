import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Chat } from '../chat/chat.js';

// Mock useChat to control state
vi.mock('../chat/use-chat.js', () => ({
	useChat: vi.fn(),
	chatReducer: vi.fn(),
}));

// Mock useMarkdown
vi.mock('../chat/use-markdown.js', () => ({
	useMarkdown: () => ({
		render: (md: string) => `<p>${md}</p>`,
		ready: true,
	}),
}));

import { useChat } from '../chat/use-chat.js';
const mockUseChat = vi.mocked(useChat);

function mockChatState(overrides: Partial<ReturnType<typeof useChat>> = {}) {
	const defaults: ReturnType<typeof useChat> = {
		messages: [],
		status: 'idle',
		sessionId: null,
		pendingHitl: null,
		error: null,
		send: vi.fn(),
		resolveHitl: vi.fn(),
		clear: vi.fn(),
	};
	mockUseChat.mockReturnValue({ ...defaults, ...overrides });
}

describe('Chat', () => {
	afterEach(cleanup);

	it('renders with title and empty state', () => {
		mockChatState();
		render(<Chat endpoint="http://gw:8080" title="AI Assistant" />);

		expect(screen.getByText('AI Assistant')).toBeTruthy();
		expect(screen.getByText('Send a message to start')).toBeTruthy();
	});

	it('renders welcome message when no messages', () => {
		mockChatState();
		render(<Chat endpoint="http://gw:8080" welcomeMessage="Hello! How can I help?" />);

		expect(screen.getByText('Hello! How can I help?')).toBeTruthy();
	});

	it('renders user messages', () => {
		mockChatState({
			messages: [
				{ id: 'msg_1', role: 'user', content: 'Hi there', timestamp: new Date().toISOString() },
			],
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText('Hi there')).toBeTruthy();
	});

	it('renders assistant messages', () => {
		mockChatState({
			messages: [
				{ id: 'msg_1', role: 'assistant', content: 'Hello!', timestamp: new Date().toISOString() },
			],
		});
		render(<Chat endpoint="http://gw:8080" />);

		// Markdown rendered content
		expect(screen.getByRole('article')).toBeTruthy();
	});

	it('renders error state', () => {
		mockChatState({ error: 'Connection refused' });
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText('Connection refused')).toBeTruthy();
		expect(screen.getByRole('alert')).toBeTruthy();
	});

	it('disables input while streaming', () => {
		mockChatState({ status: 'streaming' });
		render(<Chat endpoint="http://gw:8080" />);

		const textarea = screen.getByRole('textbox');
		expect(textarea).toHaveProperty('disabled', true);
	});

	it('renders HITL panel when pendingHitl is set', () => {
		mockChatState({
			pendingHitl: {
				requestId: 'req_1',
				type: 'approval',
				prompt: 'Delete important file?',
				toolName: 'delete_file',
			},
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText('Approval Required')).toBeTruthy();
		expect(screen.getByText('Delete important file?')).toBeTruthy();
		expect(screen.getByText('Approve')).toBeTruthy();
		expect(screen.getByText('Deny')).toBeTruthy();
	});

	it('calls send on input submit', () => {
		const send = vi.fn();
		mockChatState({ send });
		render(<Chat endpoint="http://gw:8080" />);

		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: 'Hello' } });
		fireEvent.click(screen.getByLabelText('Send message'));

		expect(send).toHaveBeenCalledWith('Hello');
	});

	it('calls clear when clear button clicked', () => {
		const clear = vi.fn();
		mockChatState({ clear });
		render(<Chat endpoint="http://gw:8080" title="Test" />);

		fireEvent.click(screen.getByLabelText('Clear messages'));
		expect(clear).toHaveBeenCalled();
	});

	it('has chat messages area with role="log"', () => {
		mockChatState();
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByRole('log')).toBeTruthy();
	});

	it('shows responding indicator when streaming', () => {
		mockChatState({ status: 'streaming' });
		render(<Chat endpoint="http://gw:8080" title="AI" />);

		expect(screen.getByText('responding...')).toBeTruthy();
	});

	it('renders streaming message with cursor', () => {
		mockChatState({
			status: 'streaming',
			messages: [
				{
					id: 'msg_1',
					role: 'assistant',
					content: 'Thinking about it',
					timestamp: new Date().toISOString(),
					isStreaming: true,
					toolCalls: [],
				},
			],
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText(/Thinking about it/)).toBeTruthy();
	});

	it('sends message on Enter key', () => {
		const send = vi.fn();
		mockChatState({ send });
		render(<Chat endpoint="http://gw:8080" />);

		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: 'Hello via Enter' } });
		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

		expect(send).toHaveBeenCalledWith('Hello via Enter');
	});

	it('does not send on Shift+Enter', () => {
		const send = vi.fn();
		mockChatState({ send });
		render(<Chat endpoint="http://gw:8080" />);

		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: 'line1' } });
		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

		expect(send).not.toHaveBeenCalled();
	});

	it('renders HITL question type with text input', () => {
		mockChatState({
			pendingHitl: {
				requestId: 'req_2',
				type: 'question',
				prompt: 'What is the file name?',
			},
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText('Question')).toBeTruthy();
		expect(screen.getByText('What is the file name?')).toBeTruthy();
		expect(screen.getByPlaceholderText('Enter your answer...')).toBeTruthy();
		expect(screen.getByText('Submit')).toBeTruthy();
	});

	it('renders HITL plan_review type with Revise button', () => {
		mockChatState({
			pendingHitl: {
				requestId: 'req_3',
				type: 'plan_review',
				prompt: 'Review this plan',
			},
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText('Plan Review')).toBeTruthy();
		expect(screen.getByText('Approve')).toBeTruthy();
		expect(screen.getByText('Revise')).toBeTruthy();
	});

	it('renders assistant message with tool calls', () => {
		mockChatState({
			messages: [
				{
					id: 'msg_1',
					role: 'assistant',
					content: 'Found it',
					timestamp: new Date().toISOString(),
					toolCalls: [
						{ id: 'tc_1', tool: 'read_file', input: { path: 'x.ts' }, status: 'completed', output: 'content' },
					],
				},
			],
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByText('read_file')).toBeTruthy();
		expect(screen.getByLabelText('Tool: read_file')).toBeTruthy();
	});

	it('does not send empty messages', () => {
		const send = vi.fn();
		mockChatState({ send });
		render(<Chat endpoint="http://gw:8080" />);

		// Click send without typing
		fireEvent.click(screen.getByLabelText('Send message'));
		expect(send).not.toHaveBeenCalled();

		// Type only whitespace
		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: '   ' } });
		fireEvent.click(screen.getByLabelText('Send message'));
		expect(send).not.toHaveBeenCalled();
	});

	it('renders multiple messages in conversation', () => {
		mockChatState({
			messages: [
				{ id: 'u1', role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
				{ id: 'a1', role: 'assistant', content: 'Hi there!', timestamp: new Date().toISOString() },
				{ id: 'u2', role: 'user', content: 'Follow up', timestamp: new Date().toISOString() },
			],
		});
		render(<Chat endpoint="http://gw:8080" />);

		const articles = screen.getAllByRole('article');
		expect(articles.length).toBeGreaterThanOrEqual(3);
	});

	it('HITL alert has correct aria role', () => {
		mockChatState({
			pendingHitl: {
				requestId: 'req_1',
				type: 'approval',
				prompt: 'Approve this?',
			},
		});
		render(<Chat endpoint="http://gw:8080" />);

		expect(screen.getByRole('alert')).toBeTruthy();
	});
});
