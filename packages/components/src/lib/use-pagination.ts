import { useCallback, useEffect, useState } from 'react';

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
