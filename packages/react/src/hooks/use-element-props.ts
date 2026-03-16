import { resolveProps } from '@viyv/agent-ui-engine';
import type { EvalContext } from '@viyv/agent-ui-engine';
import { useMemo } from 'react';
import { useHookDataContext } from '../providers/hook-data-provider.js';
import { useInteractionContext } from '../providers/interaction-provider.js';

export function useEvalContext(): EvalContext {
	const { hookData } = useHookDataContext();
	const { state, actions } = useInteractionContext();
	return useMemo(() => ({ hooks: hookData, state, actions }), [hookData, state, actions]);
}

export function useElementProps(props: Record<string, unknown>): Record<string, unknown> {
	const ctx = useEvalContext();
	return useMemo(() => resolveProps(props, ctx), [props, ctx]);
}
