import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { FeedbackAuthor, FeedbackThread } from '@viyv/agent-ui-schema';
import { useCallback, useMemo } from 'react';

export interface UseFeedbackDataReturn {
	threads: FeedbackThread[];
	isLoading: boolean;
	elementsWithFeedback: Map<string, { open: number; resolved: number }>;
	createThread: (
		elementId: string,
		author: FeedbackAuthor,
		body: string,
	) => Promise<void>;
	addComment: (
		threadId: string,
		author: FeedbackAuthor,
		body: string,
	) => Promise<void>;
	resolveThread: (
		threadId: string,
		author: FeedbackAuthor,
		body?: string,
	) => Promise<void>;
	completeThread: (threadId: string) => Promise<void>;
	reopenThread: (threadId: string) => Promise<void>;
	refetch: () => void;
}

export function useFeedbackData(
	queryEndpoint: string,
	pageId: string,
): UseFeedbackDataReturn {
	const queryClient = useQueryClient();
	const queryKey = useMemo(() => ['agent-ui-feedback', pageId], [pageId]);

	const { data, isLoading, refetch } = useQuery<FeedbackThread[]>({
		queryKey,
		queryFn: async () => {
			const res = await fetch(
				`${queryEndpoint}/feedback?pageId=${encodeURIComponent(pageId)}`,
			);
			if (!res.ok) throw new Error(`Feedback fetch failed: ${res.status}`);
			return res.json();
		},
		refetchInterval: 10_000,
		staleTime: 5_000,
	});

	const threads = data ?? [];

	const elementsWithFeedback = useMemo(() => {
		const map = new Map<string, { open: number; resolved: number }>();
		for (const thread of threads) {
			// completed threads are fully done — no indicator needed
			if (thread.status === 'completed') continue;
			const existing = map.get(thread.elementId) ?? {
				open: 0,
				resolved: 0,
			};
			if (thread.status === 'open') existing.open++;
			else if (thread.status === 'resolved') existing.resolved++;
			map.set(thread.elementId, existing);
		}
		return map;
	}, [threads]);

	const invalidate = useCallback(() => {
		queryClient.invalidateQueries({ queryKey });
	}, [queryClient, queryKey]);

	const createThread = useCallback(
		async (elementId: string, author: FeedbackAuthor, body: string) => {
			await fetch(`${queryEndpoint}/feedback`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pageId, elementId, author, body }),
			});
			invalidate();
		},
		[queryEndpoint, pageId, invalidate],
	);

	const addComment = useCallback(
		async (threadId: string, author: FeedbackAuthor, body: string) => {
			await fetch(`${queryEndpoint}/feedback/${threadId}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ author, body }),
			});
			invalidate();
		},
		[queryEndpoint, invalidate],
	);

	const resolveThread = useCallback(
		async (threadId: string, author: FeedbackAuthor, body?: string) => {
			await fetch(`${queryEndpoint}/feedback/${threadId}/resolve`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ author, body }),
			});
			invalidate();
		},
		[queryEndpoint, invalidate],
	);

	const completeThread = useCallback(
		async (threadId: string) => {
			await fetch(`${queryEndpoint}/feedback/${threadId}/complete`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			});
			invalidate();
		},
		[queryEndpoint, invalidate],
	);

	const reopenThread = useCallback(
		async (threadId: string) => {
			await fetch(`${queryEndpoint}/feedback/${threadId}/reopen`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			});
			invalidate();
		},
		[queryEndpoint, invalidate],
	);

	const refetchFn = useCallback(() => {
		refetch();
	}, [refetch]);

	return {
		threads,
		isLoading,
		elementsWithFeedback,
		createThread,
		addComment,
		resolveThread,
		completeThread,
		reopenThread,
		refetch: refetchFn,
	};
}
