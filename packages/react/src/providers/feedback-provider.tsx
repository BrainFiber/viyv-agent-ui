import type { FeedbackAuthor, FeedbackThread } from '@viyv/agent-ui-schema';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useFeedbackData } from '../feedback/use-feedback-data.js';

export interface FeedbackContextValue {
	// UI state
	enabled: boolean;
	toggle: () => void;
	selectedElementId: string | null;
	selectElement: (elementId: string | null) => void;
	panelOpen: boolean;
	setPanelOpen: (open: boolean) => void;
	authorName: string;
	setAuthorName: (name: string) => void;
	needsAuthorPrompt: boolean;
	dismissAuthorPrompt: () => void;
	// Data
	threads: FeedbackThread[];
	isLoading: boolean;
	elementsWithFeedback: Map<string, { open: number; resolved: number }>;
	createThread: (elementId: string, author: FeedbackAuthor, body: string) => Promise<void>;
	addComment: (threadId: string, author: FeedbackAuthor, body: string) => Promise<void>;
	resolveThread: (threadId: string, author: FeedbackAuthor, body?: string) => Promise<void>;
	completeThread: (threadId: string) => Promise<void>;
	reopenThread: (threadId: string) => Promise<void>;
	refetch: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const AUTHOR_STORAGE_KEY = 'agent-ui-feedback-author';

function loadAuthorName(): string {
	if (typeof window === 'undefined') return '';
	try {
		return localStorage.getItem(AUTHOR_STORAGE_KEY) ?? '';
	} catch {
		return '';
	}
}

function saveAuthorName(name: string): void {
	try {
		localStorage.setItem(AUTHOR_STORAGE_KEY, name);
	} catch {
		// ignore
	}
}

export interface FeedbackProviderProps {
	queryEndpoint: string;
	pageId: string;
	children: ReactNode;
}

export function FeedbackProvider({ queryEndpoint, pageId, children }: FeedbackProviderProps) {
	const [enabled, setEnabled] = useState(false);
	const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
	const [panelOpen, setPanelOpen] = useState(false);
	const [authorName, setAuthorNameState] = useState(loadAuthorName);
	const [needsAuthorPrompt, setNeedsAuthorPrompt] = useState(false);

	const data = useFeedbackData(queryEndpoint, pageId);

	const setAuthorName = useCallback((name: string) => {
		setAuthorNameState(name);
		saveAuthorName(name);
	}, []);

	const toggle = useCallback(() => {
		setEnabled((prev) => {
			const next = !prev;
			if (next && !authorName) {
				setNeedsAuthorPrompt(true);
			}
			if (!next) {
				setSelectedElementId(null);
			}
			// panelOpen follows enabled state
			setPanelOpen(next);
			return next;
		});
	}, [authorName]);

	const selectElement = useCallback((elementId: string | null) => {
		setSelectedElementId(elementId);
	}, []);

	const dismissAuthorPrompt = useCallback(() => {
		setNeedsAuthorPrompt(false);
	}, []);

	// Escape key handler
	useEffect(() => {
		if (!enabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				if (selectedElementId) {
					setSelectedElementId(null);
				} else if (panelOpen) {
					setPanelOpen(false);
				} else {
					setEnabled(false);
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [enabled, selectedElementId, panelOpen]);

	const value: FeedbackContextValue = {
		enabled,
		toggle,
		selectedElementId,
		selectElement,
		panelOpen,
		setPanelOpen,
		authorName,
		setAuthorName,
		needsAuthorPrompt,
		dismissAuthorPrompt,
		...data,
	};

	return (
		<FeedbackContext.Provider value={value}>
			{children}
		</FeedbackContext.Provider>
	);
}

export function useFeedbackContext(): FeedbackContextValue {
	const ctx = useContext(FeedbackContext);
	if (!ctx) {
		throw new Error('useFeedbackContext must be used within a FeedbackProvider');
	}
	return ctx;
}
