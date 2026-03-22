import { useQueries } from '@tanstack/react-query';
import { applyDerivedOperations, buildHookDAG } from '@viyv/agent-ui-engine';
import type { DerivedParams } from '@viyv/agent-ui-engine';
import type { HookDef, PageSpec } from '@viyv/agent-ui-schema';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface HookDataContextValue {
	hookData: Record<string, unknown>;
	isLoading: boolean;
	errors: Record<string, Error>;
	setHookData: (hookId: string, value: unknown) => void;
	refetchHook: (hookId: string) => void;
}

const HookDataContext = createContext<HookDataContextValue>({
	hookData: {},
	isLoading: false,
	errors: {},
	setHookData: () => {},
	refetchHook: () => {},
});

export interface HookDataProviderProps {
	spec: PageSpec;
	queryEndpoint: string;
	pageId?: string;
	previewId?: string;
	searchParams?: Record<string, string | string[] | undefined>;
	children: ReactNode;
}

async function fetchHookData(
	queryEndpoint: string,
	hookId: string,
	pageId?: string,
	previewId?: string,
): Promise<unknown> {
	const body: Record<string, unknown> = { hookId };
	if (previewId) {
		body.previewId = previewId;
	} else if (pageId) {
		body.pageId = pageId;
	}

	const response = await fetch(`${queryEndpoint}/hooks/execute`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`Hook fetch failed: ${response.status}`);
	}

	const result = await response.json();
	return result.data;
}

export function HookDataProvider({
	spec,
	queryEndpoint,
	pageId,
	previewId,
	searchParams,
	children,
}: HookDataProviderProps) {
	const [useStateOverrides, setUseStateOverrides] = useState<Record<string, unknown>>({});

	const setHookData = useCallback((hookId: string, value: unknown) => {
		setUseStateOverrides((prev) => ({ ...prev, [hookId]: value }));
	}, []);

	const dag = useMemo(() => buildHookDAG(spec.hooks), [spec.hooks]);

	// Identify server-side hooks (need API call) vs client-side hooks
	const serverHookIds = useMemo(
		() =>
			dag.order.filter((id) => {
				const hook = spec.hooks[id];
				return (
					hook.use === 'useFetch' || hook.use === 'useSqlQuery' || hook.use === 'useAgentQuery'
				);
			}),
		[dag.order, spec.hooks],
	);

	const queries = useQueries({
		queries: serverHookIds.map((hookId) => {
			const hook = spec.hooks[hookId];
			const refreshInterval = getRefreshInterval(hook);
			return {
				queryKey: ['agent-ui-hook', pageId ?? previewId, hookId],
				queryFn: () => fetchHookData(queryEndpoint, hookId, pageId, previewId),
				refetchInterval: refreshInterval,
				staleTime: refreshInterval ? refreshInterval / 2 : 60_000,
			};
		}),
	});

	// C5: refetchHook — map serverHookId to query for refetch
	const refetchHook = useCallback(
		(hookId: string) => {
			const idx = serverHookIds.indexOf(hookId);
			if (idx >= 0 && queries[idx]) {
				queries[idx].refetch();
			}
		},
		[serverHookIds, queries],
	);

	// C3: useDerived memoization cache
	const derivedCacheRef = useRef<Map<string, { sourceData: unknown; result: unknown }>>(new Map());

	const value = useMemo(() => {
		const hookData: Record<string, unknown> = {};
		const errors: Record<string, Error> = {};

		// Inject URL search params as _params
		if (searchParams) {
			const flat: Record<string, string> = {};
			for (const [k, v] of Object.entries(searchParams)) {
				if (typeof v === 'string') flat[k] = v;
				else if (Array.isArray(v) && v.length > 0) flat[k] = v[0];
			}
			hookData['_params'] = flat;
		}

		// Set useState hooks
		for (const [id, hook] of Object.entries(spec.hooks)) {
			if (hook.use === 'useState') {
				hookData[id] = id in useStateOverrides ? useStateOverrides[id] : hook.params.initial;
			}
		}

		// Set server hook results
		for (let i = 0; i < serverHookIds.length; i++) {
			const hookId = serverHookIds[i];
			const query = queries[i];
			if (query.data !== undefined) {
				hookData[hookId] = query.data;
			}
			if (query.error) {
				errors[hookId] = query.error as Error;
			}
		}

		// Compute derived hooks in DAG order (with memoization)
		for (const hookId of dag.order) {
			const hook = spec.hooks[hookId];
			if (hook.use === 'useDerived') {
				const sourceData = hookData[hook.from];
				if (sourceData !== undefined) {
					const cached = derivedCacheRef.current.get(hookId);
					if (cached && cached.sourceData === sourceData) {
						hookData[hookId] = cached.result;
					} else {
						const result = applyDerivedOperations(sourceData, hook.params as DerivedParams);
						hookData[hookId] = result;
						derivedCacheRef.current.set(hookId, { sourceData, result });
					}
				}
			}
		}

		const isLoading = queries.some((q) => q.isLoading);

		return { hookData, isLoading, errors, setHookData, refetchHook };
	}, [queries, dag.order, spec.hooks, serverHookIds, searchParams, useStateOverrides, setHookData, refetchHook]);

	return <HookDataContext.Provider value={value}>{children}</HookDataContext.Provider>;
}

export function useHookDataContext(): HookDataContextValue {
	return useContext(HookDataContext);
}

function getRefreshInterval(hook: HookDef): number | undefined {
	if (hook.use === 'useFetch') return hook.params.refreshInterval;
	if (hook.use === 'useSqlQuery') return hook.params.refreshInterval;
	if (hook.use === 'useAgentQuery') return hook.params.refreshInterval;
	return undefined;
}
