import { useCallback, useEffect, useState } from 'react';

/* ── usePagination hook ── */

export interface UsePaginationOptions<T> {
	data: T[];
	pageSize?: number;
}

export interface UsePaginationResult<T> {
	pagedData: T[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	setCurrentPage: (page: number) => void;
	resetPage: () => void;
}

export function usePagination<T>({ data, pageSize }: UsePaginationOptions<T>): UsePaginationResult<T> {
	const [currentPage, setCurrentPage] = useState(0);

	const totalItems = data.length;
	const effectivePageSize = pageSize && pageSize > 0 ? pageSize : totalItems || 1;
	const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
	const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

	useEffect(() => {
		if (currentPage !== safePage) setCurrentPage(safePage);
	}, [currentPage, safePage]);

	const pagedData =
		pageSize && pageSize > 0 ? data.slice(safePage * pageSize, (safePage + 1) * pageSize) : data;

	const resetPage = useCallback(() => setCurrentPage(0), []);

	return {
		pagedData,
		currentPage: safePage,
		totalPages,
		totalItems,
		pageSize: effectivePageSize,
		setCurrentPage,
		resetPage,
	};
}

/* ── Pagination UI ── */

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const start = currentPage * pageSize + 1;
	const end = Math.min((currentPage + 1) * pageSize, totalItems);

	return (
		<div
			className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-600"
			role="navigation"
			aria-label="Pagination"
		>
			<span>
				{totalItems}件中 {start}–{end}件
			</span>
			<div className="flex items-center gap-2">
				<button
					type="button"
					disabled={currentPage === 0}
					onClick={() => onPageChange(currentPage - 1)}
					className="rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
				>
					前へ
				</button>
				<span>
					{currentPage + 1} / {totalPages}
				</span>
				<button
					type="button"
					disabled={currentPage >= totalPages - 1}
					onClick={() => onPageChange(currentPage + 1)}
					className="rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
				>
					次へ
				</button>
			</div>
		</div>
	);
}
