import type { ActionDef, PageSpec } from '@viyv/agent-ui-schema';
import { interpolateUrl } from '@viyv/agent-ui-engine';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useHookDataContext } from './hook-data-provider.js';

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

interface ActionHandlerDeps {
	setState: (key: string, value: unknown) => void;
	stateRef: React.RefObject<Record<string, unknown>>;
	setHookData: (hookId: string, value: unknown) => void;
	hookDataRef: React.RefObject<Record<string, unknown>>;
}

function applyOnComplete(
	actionDef: { onComplete?: Record<string, unknown> },
	setState: (key: string, value: unknown) => void,
): void {
	if (actionDef.onComplete) {
		for (const [k, v] of Object.entries(actionDef.onComplete)) {
			setState(k, v);
		}
	}
}

function createActionHandler(
	actionDef: ActionDef,
	deps: ActionHandlerDeps,
): (...args: unknown[]) => void {
	switch (actionDef.type) {
		case 'setState':
			return (...args: unknown[]) => {
				const val = actionDef.value !== undefined ? actionDef.value : args[0];
				deps.setState(actionDef.key, val);
				applyOnComplete(actionDef, deps.setState);
			};

		case 'refreshHook':
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
			return async () => {
				try {
					const res = await fetch(actionDef.url, {
						method: actionDef.method ?? 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(deps.stateRef.current),
					});
					if (actionDef.stateKey) {
						if (!res.ok) {
							deps.setState(actionDef.stateKey, { success: false, error: `HTTP ${res.status}` });
							return;
						}
						const data = await res.json();
						deps.setState(actionDef.stateKey, data);
					}
					applyOnComplete(actionDef, deps.setState);
				} catch (err) {
					if (actionDef.stateKey) {
						deps.setState(actionDef.stateKey, { success: false, error: String(err) });
					}
				}
			};

		case 'addItem':
			return () => {
				const currentData = deps.hookDataRef.current[actionDef.hookId];
				if (!Array.isArray(currentData)) return;
				const newItem = { ...(deps.stateRef.current[actionDef.stateKey] as Record<string, unknown> ?? {}) };
				const idField = actionDef.idField ?? 'id';
				if (actionDef.idPrefix && !newItem[idField]) {
					newItem[idField] = `${actionDef.idPrefix}-${String(Date.now()).slice(-6)}`;
				}
				deps.setHookData(actionDef.hookId, [...currentData, newItem]);
				applyOnComplete(actionDef, deps.setState);
			};

		case 'removeItem':
			return () => {
				const currentData = deps.hookDataRef.current[actionDef.hookId];
				if (!Array.isArray(currentData)) return;
				const stateObj = deps.stateRef.current[actionDef.stateKey];
				const matchValue = (stateObj && typeof stateObj === 'object' && !Array.isArray(stateObj))
					? (stateObj as Record<string, unknown>)[actionDef.key]
					: stateObj;
				deps.setHookData(
					actionDef.hookId,
					currentData.filter((item) => (item as Record<string, unknown>)[actionDef.key] !== matchValue),
				);
				applyOnComplete(actionDef, deps.setState);
			};

		case 'updateItem':
			return () => {
				const currentData = deps.hookDataRef.current[actionDef.hookId];
				if (!Array.isArray(currentData)) return;
				const updatedItem = deps.stateRef.current[actionDef.stateKey] as Record<string, unknown>;
				if (!updatedItem) return;
				const matchValue = updatedItem[actionDef.key];
				deps.setHookData(
					actionDef.hookId,
					currentData.map((item) => {
						const row = item as Record<string, unknown>;
						return row[actionDef.key] === matchValue ? { ...row, ...updatedItem } : item;
					}),
				);
				applyOnComplete(actionDef, deps.setState);
			};

		default:
			return () => {};
	}
}

export function InteractionProvider({ spec, children }: InteractionProviderProps) {
	const [pageState, setPageState] = useState<Record<string, unknown>>(spec.state);
	const { hookData, setHookData } = useHookDataContext();

	const setState = useCallback((key: string, value: unknown) => {
		if (key.includes('.')) {
			const dotIndex = key.indexOf('.');
			const topKey = key.slice(0, dotIndex);
			const nestedKey = key.slice(dotIndex + 1);
			setPageState((prev) => {
				const existing = prev[topKey];
				if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
					return { ...prev, [topKey]: { ...(existing as Record<string, unknown>), [nestedKey]: value } };
				}
				return { ...prev, [topKey]: { [nestedKey]: value } };
			});
		} else {
			setPageState((prev) => ({ ...prev, [key]: value }));
		}
	}, []);

	const stateRef = useRef(pageState);
	stateRef.current = pageState;

	const hookDataRef = useRef(hookData);
	hookDataRef.current = hookData;

	const actions = useMemo(() => {
		const result: Record<string, (...args: unknown[]) => void> = {};
		const deps: ActionHandlerDeps = { setState, stateRef, setHookData, hookDataRef };

		for (const [id, actionDef] of Object.entries(spec.actions)) {
			result[id] = createActionHandler(actionDef, deps);
		}

		return result;
	}, [spec.actions, setState, setHookData]);

	const value = useMemo(
		() => ({ state: pageState, setState, actions }),
		[pageState, setState, actions],
	);

	return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
}

export function useInteractionContext(): InteractionContextValue {
	return useContext(InteractionContext);
}
