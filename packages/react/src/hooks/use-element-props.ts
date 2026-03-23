import { resolveProps } from '@viyv/agent-ui-engine';
import type { EvalContext } from '@viyv/agent-ui-engine';
import { useMemo } from 'react';
import { useHookDataContext } from '../providers/hook-data-provider.js';
import { useInteractionContext } from '../providers/interaction-provider.js';
import { useItemContext } from '../providers/item-provider.js';

export function useEvalContext(): EvalContext {
	const { hookData, params } = useHookDataContext();
	const { state, actions } = useInteractionContext();
	const itemCtx = useItemContext();
	return useMemo(
		() => ({ hooks: hookData, state, actions, item: itemCtx?.item, params }),
		[hookData, state, actions, itemCtx?.item, params],
	);
}

export function useElementProps(props: Record<string, unknown>): Record<string, unknown> {
	const ctx = useEvalContext();
	return useMemo(() => resolveProps(props, ctx), [props, ctx]);
}
