import { useCallback, useRef } from 'react';
import { ElementRenderer } from '../element-renderer.js';
import { ItemProvider } from '../providers/item-provider.js';
import type { TypeHandlerProps } from './index.js';

const COLUMN_ACCENTS = [
	{ bg: '#f1f5f9', headerBg: '#e2e8f0', headerText: '#475569', dot: '#94a3b8' },  // slate
	{ bg: '#eff6ff', headerBg: '#bfdbfe', headerText: '#1e40af', dot: '#3b82f6' },  // blue
	{ bg: '#fefce8', headerBg: '#fde68a', headerText: '#92400e', dot: '#f59e0b' },  // amber
	{ bg: '#f0fdf4', headerBg: '#bbf7d0', headerText: '#166534', dot: '#22c55e' },  // green
	{ bg: '#faf5ff', headerBg: '#e9d5ff', headerText: '#6b21a8', dot: '#a855f7' },  // purple
	{ bg: '#fff1f2', headerBg: '#fecdd3', headerText: '#9f1239', dot: '#f43f5e' },  // rose
] as const;

function useGrabScroll() {
	const ref = useRef<HTMLDivElement>(null);
	const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

	const onMouseDown = useCallback((e: React.MouseEvent) => {
		const el = ref.current;
		if (!el) return;
		// Only grab on background / column header, not on card content
		drag.current = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft };
		el.style.cursor = 'grabbing';
		el.style.userSelect = 'none';
	}, []);

	const onMouseMove = useCallback((e: React.MouseEvent) => {
		if (!drag.current.active) return;
		const el = ref.current;
		if (!el) return;
		const dx = e.pageX - drag.current.startX;
		el.scrollLeft = drag.current.scrollLeft - dx;
	}, []);

	const onMouseUp = useCallback(() => {
		drag.current.active = false;
		const el = ref.current;
		if (el) {
			el.style.cursor = 'grab';
			el.style.userSelect = '';
		}
	}, []);

	return { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp };
}

export function KanbanRenderer({ element, resolvedProps }: TypeHandlerProps) {
	const data = resolvedProps.data;
	const groupKey = resolvedProps.groupKey as string;
	const columns = resolvedProps.columns as Array<{ value: string; label: string }> | undefined;
	const keyField = resolvedProps.keyField as string | undefined;
	const emptyMessage = resolvedProps.emptyMessage as string | undefined;

	const items = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
	const grab = useGrabScroll();

	// Group items by groupKey
	const grouped = new Map<string, Record<string, unknown>[]>();
	for (const item of items) {
		const group = String(item[groupKey] ?? '');
		if (!grouped.has(group)) grouped.set(group, []);
		grouped.get(group)!.push(item);
	}

	// Determine column order
	const cols = columns
		? columns
		: [...grouped.keys()].sort().map((v) => ({ value: v, label: v }));

	if (items.length === 0) {
		return (
			<div role="region" aria-label="Kanban Board">
				<p className="py-8 text-center text-sm text-gray-500">
					{emptyMessage ?? 'データがありません'}
				</p>
			</div>
		);
	}

	return (
		<div
			ref={grab.ref}
			role="region"
			aria-label="Kanban Board"
			className="flex overflow-x-auto gap-4 p-4 -m-4 min-h-[400px]"
			style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', cursor: 'grab' }}
			onMouseDown={grab.onMouseDown}
			onMouseMove={grab.onMouseMove}
			onMouseUp={grab.onMouseUp}
			onMouseLeave={grab.onMouseLeave}
		>
			{cols.map((col, colIdx) => {
				const colItems = grouped.get(col.value) ?? [];
				const accent = COLUMN_ACCENTS[colIdx % COLUMN_ACCENTS.length];
				return (
					<div
						key={col.value}
						className="flex flex-col shrink-0 rounded-xl overflow-hidden"
						style={{ width: '300px', backgroundColor: accent.bg }}
						aria-label={`${col.label} (${colItems.length} 件)`}
					>
						{/* Column header */}
						<div
							className="flex items-center justify-between px-4 py-3"
							style={{ backgroundColor: accent.headerBg }}
						>
							<div className="flex items-center gap-2">
								<div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent.dot }} />
								<h3 className="text-sm font-bold" style={{ color: accent.headerText }}>
									{col.label}
								</h3>
							</div>
							<span
								className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-full px-2 text-xs font-bold"
								style={{ backgroundColor: accent.dot, color: '#fff' }}
							>
								{colItems.length}
							</span>
						</div>

						{/* Card list */}
						<div className="flex flex-col gap-3 p-3 flex-1">
							{colItems.map((item, idx) => {
								const key = keyField
									? String(item[keyField])
									: String(idx);
								const label = keyField
									? String(item[keyField])
									: `Item ${idx + 1}`;
								return (
									<div
										key={key}
										aria-label={label}
										className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200/80"
										style={{ cursor: 'default' }}
									>
										<ItemProvider item={item} index={idx}>
											{element.children?.map((childId) => (
												<ElementRenderer key={childId} elementId={childId} />
											))}
										</ItemProvider>
									</div>
								);
							})}
							{colItems.length === 0 && (
								<div className="flex items-center justify-center py-12 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
									アイテムなし
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
