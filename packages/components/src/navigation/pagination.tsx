import { cn } from '../lib/cn.js';

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	onPageChange,
	className,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const start = currentPage * pageSize + 1;
	const end = Math.min((currentPage + 1) * pageSize, totalItems);

	return (
		<div
			className={cn(
				'flex items-center justify-between border-t px-4 py-3 text-sm text-fg-muted',
				className,
			)}
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
					className="rounded border px-3 py-1 hover:bg-surface-alt disabled:opacity-40 disabled:hover:bg-transparent"
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
					className="rounded border px-3 py-1 hover:bg-surface-alt disabled:opacity-40 disabled:hover:bg-transparent"
				>
					次へ
				</button>
			</div>
		</div>
	);
}
