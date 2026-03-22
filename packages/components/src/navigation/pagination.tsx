import { cn } from '../lib/cn.js';
import { ChevronLeft, ChevronRight } from '../lib/icons.js';

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
					className="rounded-lg border border-border-strong px-3 py-1.5 text-sm shadow-sm transition-all hover:bg-muted disabled:opacity-40 disabled:text-fg-disabled disabled:cursor-not-allowed disabled:hover:bg-transparent"
				>
					<span className="inline-flex items-center gap-1">
						<ChevronLeft aria-hidden="true" className="h-4 w-4" />
						前へ
					</span>
				</button>
				<span>
					{currentPage + 1} / {totalPages}
				</span>
				<button
					type="button"
					disabled={currentPage >= totalPages - 1}
					onClick={() => onPageChange(currentPage + 1)}
					className="rounded-lg border border-border-strong px-3 py-1.5 text-sm shadow-sm transition-all hover:bg-muted disabled:opacity-40 disabled:text-fg-disabled disabled:cursor-not-allowed disabled:hover:bg-transparent"
				>
					<span className="inline-flex items-center gap-1">
						次へ
						<ChevronRight aria-hidden="true" className="h-4 w-4" />
					</span>
				</button>
			</div>
		</div>
	);
}
