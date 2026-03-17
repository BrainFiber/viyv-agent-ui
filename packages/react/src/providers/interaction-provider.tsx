import type { ActionDef, PageSpec } from '@viyv/agent-ui-schema';
import { interpolateUrl } from '@viyv/agent-ui-engine';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
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

	const stateRef = useRef(pageState);
	stateRef.current = pageState;

	const actions = useMemo(() => {
		const result: Record<string, (...args: unknown[]) => void> = {};

		for (const [id, actionDef] of Object.entries(spec.actions)) {
			if (actionDef.type === 'submitForm') {
				result[id] = async () => {
					try {
						const res = await fetch(actionDef.url, {
							method: actionDef.method ?? 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(stateRef.current),
						});
						if (actionDef.stateKey) {
							if (!res.ok) {
								setState(actionDef.stateKey, { success: false, error: `HTTP ${res.status}` });
								return;
							}
							const data = await res.json();
							setState(actionDef.stateKey, data);
						}
						if (actionDef.onComplete) {
							for (const [key, value] of Object.entries(actionDef.onComplete)) {
								setState(key, value);
							}
						}
					} catch (err) {
						if (actionDef.stateKey) {
							setState(actionDef.stateKey, { success: false, error: String(err) });
						}
					}
				};
			} else {
				result[id] = createActionHandler(actionDef, setState);
			}
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
			return (...args: unknown[]) => {
				const val = actionDef.value !== undefined ? actionDef.value : args[0];
				setState(actionDef.key, val);
			};

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

		default:
			return () => {};
	}
}
