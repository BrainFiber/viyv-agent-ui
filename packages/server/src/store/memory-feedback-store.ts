import type {
	FeedbackAuthor,
	FeedbackComment,
	FeedbackStatus,
	FeedbackStore,
	FeedbackThread,
} from '@viyv/agent-ui-schema';
import { nanoid } from 'nanoid';

export class MemoryFeedbackStore implements FeedbackStore {
	private threads = new Map<string, FeedbackThread>();

	async listByPage(
		pageId: string,
		status?: FeedbackStatus,
	): Promise<FeedbackThread[]> {
		return [...this.threads.values()]
			.filter((t) => t.pageId === pageId)
			.filter((t) => !status || t.status === status)
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}

	async get(threadId: string): Promise<FeedbackThread | null> {
		return this.threads.get(threadId) ?? null;
	}

	async create(params: {
		pageId: string;
		elementId: string;
		author: FeedbackAuthor;
		body: string;
	}): Promise<FeedbackThread> {
		const now = new Date().toISOString();
		const threadId = nanoid(12);
		const comment: FeedbackComment = {
			id: nanoid(12),
			threadId,
			author: params.author,
			body: params.body,
			createdAt: now,
		};
		const thread: FeedbackThread = {
			id: threadId,
			pageId: params.pageId,
			elementId: params.elementId,
			status: 'open',
			createdAt: now,
			updatedAt: now,
			comments: [comment],
		};
		this.threads.set(threadId, thread);
		return thread;
	}

	async addComment(params: {
		threadId: string;
		author: FeedbackAuthor;
		body: string;
	}): Promise<FeedbackComment> {
		const thread = this.threads.get(params.threadId);
		if (!thread) {
			throw new Error(`Feedback thread "${params.threadId}" not found`);
		}
		const now = new Date().toISOString();
		const comment: FeedbackComment = {
			id: nanoid(12),
			threadId: params.threadId,
			author: params.author,
			body: params.body,
			createdAt: now,
		};
		thread.comments.push(comment);
		thread.updatedAt = now;
		return comment;
	}

	async resolve(params: {
		threadId: string;
		author: FeedbackAuthor;
		body?: string;
	}): Promise<FeedbackThread> {
		const thread = this.threads.get(params.threadId);
		if (!thread) {
			throw new Error(`Feedback thread "${params.threadId}" not found`);
		}
		const now = new Date().toISOString();
		if (params.body) {
			thread.comments.push({
				id: nanoid(12),
				threadId: params.threadId,
				author: params.author,
				body: params.body,
				createdAt: now,
			});
		}
		thread.status = 'resolved';
		thread.updatedAt = now;
		return thread;
	}

	async complete(threadId: string): Promise<FeedbackThread> {
		const thread = this.threads.get(threadId);
		if (!thread) {
			throw new Error(`Feedback thread "${threadId}" not found`);
		}
		thread.status = 'completed';
		thread.updatedAt = new Date().toISOString();
		return thread;
	}

	async reopen(threadId: string): Promise<FeedbackThread> {
		const thread = this.threads.get(threadId);
		if (!thread) {
			throw new Error(`Feedback thread "${threadId}" not found`);
		}
		thread.status = 'open';
		thread.updatedAt = new Date().toISOString();
		return thread;
	}

	async delete(threadId: string): Promise<void> {
		this.threads.delete(threadId);
	}
}
