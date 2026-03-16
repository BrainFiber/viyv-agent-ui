import type { ActionDef, PageSpec } from '@viyv/agent-ui-schema';
import { interpolateUrl } from '@viyv/agent-ui-engine';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface InteractionContextValue {
	state: Record<string, unknown>;
	setState: (key: string, value: unknown) => void;
	actions: Record<string, (...args: unknown[]) => void>;
}

const InteractionContext = createContext<InteractionContextValue>({
	state: {},
	setState: () => {},
	actions: {},
});

export interface InteractionProviderProps {
	spec: PageSpec;
	children: ReactNode;
}

export function InteractionProvider({ spec, children }: InteractionProviderProps) {
	const [pageState, setPageState] = useState<Record<string, unknown>>(spec.state);

	const setState = useCallback((key: string, value: unknown) => {
		setPageState((prev) => ({ ...prev, [key]: value }));
	}, []);

	const actions = useMemo(() => {
		const result: Record<string, (...args: unknown[]) => void> = {};

		for (const [id, actionDef] of Object.entries(spec.actions)) {
			result[id] = createActionHandler(actionDef, setState);
		}

		return result;
	}, [spec.actions, setState]);

	const value = useMemo(
		() => ({ state: pageState, setState, actions }),
		[pageState, setState, actions],
	);

	return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
}

export function useInteractionContext(): InteractionContextValue {
	return useContext(InteractionContext);
}

function createActionHandler(
	actionDef: ActionDef,
	setState: (key: string, value: unknown) => void,
): (...args: unknown[]) => void {
	switch (actionDef.type) {
		case 'setState':
			return () => setState(actionDef.key, actionDef.value);

		case 'refreshHook':
			// Hook refresh is handled via React Query invalidation
			// For now, return a no-op; full implementation would use queryClient
			return () => {};

		case 'navigate':
			return (...args: unknown[]) => {
				let url = actionDef.url;
				const data = args[0];
				if (data && typeof data === 'object' && !Array.isArray(data)) {
					url = interpolateUrl(url, data as Record<string, unknown>);
				}
				if (typeof window !== 'undefined') {
					window.location.href = url;
				}
			};

		case 'submitForm':
			return () => {};

		default:
			return () => {};
	}
}
