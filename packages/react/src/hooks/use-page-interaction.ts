import { useCallback } from 'react';
import { useInteractionContext } from '../providers/interaction-provider.js';

export function usePageState(key: string): [unknown, (value: unknown) => void] {
	const { state, setState } = useInteractionContext();
	const value = state[key];
	const setter = useCallback((newValue: unknown) => setState(key, newValue), [key, setState]);
	return [value, setter];
}

export function useAction(actionId: string): ((...args: unknown[]) => void) | undefined {
	const { actions } = useInteractionContext();
	return actions[actionId];
}
