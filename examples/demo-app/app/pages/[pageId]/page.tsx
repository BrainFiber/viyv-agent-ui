'use client';

import { use } from 'react';
import { PageRenderer } from '@viyv/agent-ui-react';
import { defaultRegistry, defaultOverlayTypes } from '@viyv/agent-ui-components';

function LoadingSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			<div className="h-8 w-1/3 rounded bg-muted-strong" />
			<div className="h-4 w-2/3 rounded bg-muted-strong" />
			<div className="grid grid-cols-3 gap-4">
				<div className="h-24 rounded bg-muted-strong" />
				<div className="h-24 rounded bg-muted-strong" />
				<div className="h-24 rounded bg-muted-strong" />
			</div>
			<div className="h-64 rounded bg-muted-strong" />
		</div>
	);
}

function ErrorDisplay({ error }: { error: Error }) {
	return (
		<div className="rounded-lg border border-danger-soft-border bg-danger-soft p-6">
			<h2 className="text-lg font-semibold text-danger-soft-fg">ページの読み込みに失敗しました</h2>
			<p className="mt-2 text-sm text-danger">{error.message}</p>
		</div>
	);
}

export default function PageView({
	params,
	searchParams,
}: {
	params: Promise<{ pageId: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const { pageId } = use(params);
	const sp = use(searchParams);

	return (
		<PageRenderer
			pageId={pageId}
			queryEndpoint="/api/agent-ui"
			registry={defaultRegistry}
			overlayTypes={defaultOverlayTypes}
			loading={<LoadingSkeleton />}
			error={ErrorDisplay}
			searchParams={sp}
			enableFeedback
		/>
	);
}
