import type { PageSpec } from '@viyv/agent-ui-schema';
import { useEffect, useState } from 'react';
import { ElementRenderer } from './element-renderer.js';
import { HookDataProvider } from './providers/hook-data-provider.js';
import { InteractionProvider } from './providers/interaction-provider.js';
import { PageProvider } from './providers/page-provider.js';
import type { ComponentRegistry } from './registry.js';

export interface PageRendererProps {
	/** Page ID to load from server */
	pageId?: string;
	/** Preview ID to load from server */
	previewId?: string;
	/** Direct spec (for inline rendering) */
	spec?: PageSpec;
	/** API endpoint base URL */
	queryEndpoint: string;
	/** Component registry */
	registry: ComponentRegistry;
	/** Loading component */
	loading?: React.ReactNode;
	/** Error component */
	error?: React.ComponentType<{ error: Error }>;
	/** URL search params (forwarded to hooks as _params) */
	searchParams?: Record<string, string | string[] | undefined>;
}

export function PageRenderer({
	pageId,
	previewId,
	spec: directSpec,
	queryEndpoint,
	registry,
	loading,
	error: ErrorComponent,
	searchParams,
}: PageRendererProps) {
	const [spec, setSpec] = useState<PageSpec | null>(directSpec ?? null);
	const [loadError, setLoadError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(!directSpec);

	useEffect(() => {
		if (directSpec) {
			setSpec(directSpec);
			setIsLoading(false);
			return;
		}

		const controller = new AbortController();

		const fetchSpec = async () => {
			setIsLoading(true);
			setLoadError(null);
			try {
				let url: string;
				if (previewId) {
					url = `${queryEndpoint}/pages/preview/${previewId}`;
				} else if (pageId) {
					url = `${queryEndpoint}/pages/${pageId}`;
				} else {
					throw new Error('pageId, previewId, or spec is required');
				}

				const response = await fetch(url, { signal: controller.signal });
				if (!response.ok) {
					throw new Error(`Failed to load page: ${response.status}`);
				}
				const data = await response.json();
				if (!controller.signal.aborted) {
					setSpec(data);
				}
			} catch (err) {
				if (!controller.signal.aborted) {
					setLoadError(err instanceof Error ? err : new Error(String(err)));
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		fetchSpec();

		return () => {
			controller.abort();
		};
	}, [pageId, previewId, directSpec, queryEndpoint]);

	if (isLoading) {
		return <>{loading ?? <div>Loading...</div>}</>;
	}

	if (loadError) {
		if (ErrorComponent) return <ErrorComponent error={loadError} />;
		return <div>Error: {loadError.message}</div>;
	}

	if (!spec) {
		return <div>No page spec provided</div>;
	}

	return (
		<PageProvider
			spec={spec}
			registry={registry}
			queryEndpoint={queryEndpoint}
			pageId={pageId}
			previewId={previewId}
		>
			<HookDataProvider
				spec={spec}
				queryEndpoint={queryEndpoint}
				pageId={pageId}
				previewId={previewId}
				searchParams={searchParams}
			>
				<InteractionProvider spec={spec}>
					<ElementRenderer elementId={spec.root} />
				</InteractionProvider>
			</HookDataProvider>
		</PageProvider>
	);
}
