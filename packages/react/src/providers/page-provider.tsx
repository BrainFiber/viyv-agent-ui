import type { PageSpec } from '@viyv/agent-ui-schema';
import { createContext, useContext, useMemo } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { ComponentRegistry } from '../registry.js';

export interface PageContextValue {
	spec: PageSpec;
	registry: ComponentRegistry;
	queryEndpoint: string;
	pageId?: string;
	previewId?: string;
	/** Component type names that use `open` prop instead of conditional rendering */
	overlayTypes?: Set<string>;
}

const PageContext = createContext<PageContextValue | null>(null);

export function PageProvider({
	spec,
	registry,
	queryEndpoint,
	pageId,
	previewId,
	overlayTypes,
	children,
}: PageContextValue & { children: ReactNode }) {
	const value = useMemo(
		() => ({ spec, registry, queryEndpoint, pageId, previewId, overlayTypes }),
		[spec, registry, queryEndpoint, pageId, previewId, overlayTypes],
	);

	return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePageContext(): PageContextValue {
	const ctx = useContext(PageContext);
	if (!ctx) {
		throw new Error('usePageContext must be used within a PageProvider');
	}
	return ctx;
}

export function usePageSpec(): PageSpec {
	return usePageContext().spec;
}

export function useComponent(type: string): ComponentType<Record<string, unknown>> | undefined {
	const { registry } = usePageContext();
	return registry.get(type);
}
