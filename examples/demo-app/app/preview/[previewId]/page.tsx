'use client';

import { use } from 'react';
import { PageRenderer } from '@viyv/agent-ui-react';
import { defaultRegistry } from '@viyv/agent-ui-components';

function LoadingSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			<div className="h-8 w-1/3 rounded bg-gray-200" />
			<div className="h-64 rounded bg-gray-200" />
		</div>
	);
}

function ErrorDisplay({ error }: { error: Error }) {
	return (
		<div className="rounded-lg border border-red-200 bg-red-50 p-6">
			<h2 className="text-lg font-semibold text-red-800">プレビューの読み込みに失敗しました</h2>
			<p className="mt-2 text-sm text-red-600">{error.message}</p>
		</div>
	);
}

export default function PreviewPage({ params }: { params: Promise<{ previewId: string }> }) {
	const { previewId } = use(params);

	return (
		<div>
			<div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
				<p className="text-sm font-medium text-amber-800">
					プレビューモード — このプレビューは30分で期限切れになります。
				</p>
			</div>

			<PageRenderer
				previewId={previewId}
				queryEndpoint="/api/agent-ui"
				registry={defaultRegistry}
				loading={<LoadingSkeleton />}
				error={ErrorDisplay}
			/>
		</div>
	);
}
