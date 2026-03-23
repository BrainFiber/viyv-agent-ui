export interface FeedbackAuthor {
	name: string;
	type: 'human' | 'ai';
}

export interface FeedbackComment {
	id: string;
	threadId: string;
	author: FeedbackAuthor;
	body: string;
	createdAt: string;
}

export type FeedbackStatus = 'open' | 'resolved' | 'completed';

export interface FeedbackThread {
	id: string;
	pageId: string;
	elementId: string;
	status: FeedbackStatus;
	createdAt: string;
	updatedAt: string;
	comments: FeedbackComment[];
}

export interface FeedbackStore {
	listByPage(pageId: string, status?: FeedbackStatus): Promise<FeedbackThread[]>;
	get(threadId: string): Promise<FeedbackThread | null>;
	create(params: {
		pageId: string;
		elementId: string;
		author: FeedbackAuthor;
		body: string;
	}): Promise<FeedbackThread>;
	addComment(params: {
		threadId: string;
		author: FeedbackAuthor;
		body: string;
	}): Promise<FeedbackComment>;
	resolve(params: {
		threadId: string;
		author: FeedbackAuthor;
		body?: string;
	}): Promise<FeedbackThread>;
	complete(threadId: string): Promise<FeedbackThread>;
	reopen(threadId: string): Promise<FeedbackThread>;
	delete(threadId: string): Promise<void>;
}
