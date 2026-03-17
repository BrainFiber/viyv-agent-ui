import { ElementRenderer } from '../element-renderer.js';
import { ItemProvider } from '../providers/item-provider.js';
import type { TypeHandlerProps } from './index.js';
import { Pagination, usePagination } from './pagination.js';

export function RepeaterRenderer({ element, resolvedProps }: TypeHandlerProps) {
	const data = resolvedProps.data;
	const keyField = resolvedProps.keyField as string | undefined;
	const pageSize = resolvedProps.pageSize as number | undefined;

	const items = Array.isArray(data) ? (data as unknown[]) : [];

	const {
		pagedData,
		currentPage,
		totalPages,
		totalItems,
		pageSize: effectivePageSize,
		setCurrentPage,
	} = usePagination({ data: items, pageSize });

	if (items.length === 0) return null;

	return (
		<>
			{pagedData.map((item, localIndex) => {
				const globalIndex = pageSize ? currentPage * pageSize + localIndex : localIndex;
				const key =
					keyField && item && typeof item === 'object'
						? String((item as Record<string, unknown>)[keyField])
						: String(globalIndex);
				return (
					<ItemProvider key={key} item={item} index={globalIndex}>
						{element.children?.map((childId) => (
							<ElementRenderer key={childId} elementId={childId} />
						))}
					</ItemProvider>
				);
			})}
			{pageSize && pageSize > 0 && totalPages > 1 && (
				<div style={{ gridColumn: '1 / -1' }}>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						pageSize={effectivePageSize}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</>
	);
}
