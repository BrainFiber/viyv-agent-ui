import { ElementRenderer } from '../element-renderer.js';
import { ItemProvider } from '../providers/item-provider.js';
import type { TypeHandlerProps } from './index.js';
import { Pagination, usePagination } from './pagination.js';

export function FeedRenderer({ element, resolvedProps }: TypeHandlerProps) {
	const data = resolvedProps.data;
	const keyField = resolvedProps.keyField as string | undefined;
	const labelKey = resolvedProps.labelKey as string | undefined;
	const pageSize = resolvedProps.pageSize as number | undefined;
	const emptyMessage = resolvedProps.emptyMessage as string | undefined;
	const divider = resolvedProps.divider as boolean | undefined;

	const items = Array.isArray(data) ? (data as unknown[]) : [];

	const {
		pagedData,
		currentPage,
		totalPages,
		totalItems,
		pageSize: effectivePageSize,
		setCurrentPage,
	} = usePagination({ data: items, pageSize });

	if (items.length === 0) {
		return (
			<section role="feed" aria-label="Feed">
				<p className="py-8 text-center text-sm text-gray-500">
					{emptyMessage ?? 'データがありません'}
				</p>
			</section>
		);
	}

	return (
		<section role="feed" aria-label="Feed">
			{pagedData.map((item, localIndex) => {
				const globalIndex = pageSize ? currentPage * pageSize + localIndex : localIndex;
				const key =
					keyField && item && typeof item === 'object'
						? String((item as Record<string, unknown>)[keyField])
						: String(globalIndex);

				const articleLabel = getArticleLabel(item, labelKey, keyField, globalIndex);

				return (
					<div key={key}>
						{divider !== false && localIndex > 0 && (
							<hr className="border-gray-200" />
						)}
						<article
							aria-label={articleLabel}
							aria-posinset={globalIndex + 1}
							aria-setsize={items.length}
						>
							<ItemProvider item={item} index={globalIndex}>
								{element.children?.map((childId) => (
									<ElementRenderer key={childId} elementId={childId} />
								))}
							</ItemProvider>
						</article>
					</div>
				);
			})}
			{pageSize && pageSize > 0 && totalPages > 1 && (
				<div>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						pageSize={effectivePageSize}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</section>
	);
}

function getArticleLabel(
	item: unknown,
	labelKey: string | undefined,
	keyField: string | undefined,
	index: number,
): string {
	if (item && typeof item === 'object') {
		const rec = item as Record<string, unknown>;
		if (labelKey && rec[labelKey] != null) return String(rec[labelKey]);
		if (keyField && rec[keyField] != null) return String(rec[keyField]);
	}
	return `Item ${index + 1}`;
}
