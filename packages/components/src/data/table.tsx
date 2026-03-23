import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface TableColumn {
	key: string;
	label: string;
}

export interface TableProps {
	columns: TableColumn[];
	data: Array<Record<string, unknown>>;
	striped?: boolean;
	bordered?: boolean;
	compact?: boolean;
	className?: string;
}

export function Table({
	columns,
	data,
	striped,
	bordered,
	compact,
	className,
}: TableProps) {
	return (
		<div className={cn('w-full overflow-auto', className)}>
			<table
				className={cn(
					'w-full caption-bottom text-sm',
					bordered && 'border border-border-strong',
				)}
			>
				<thead className={cn('border-b border-border-strong [&_tr]:border-b')}>
					<tr>
						{columns.map((col) => (
							<th
								key={col.key}
								className={cn(
									'text-left font-medium text-fg-secondary',
									compact ? 'px-3 py-1.5' : 'px-4 py-3',
									bordered && 'border-r border-border-strong last:border-r-0',
								)}
							>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="[&_tr:last-child]:border-0">
					{data.map((row, rowIdx) => (
						<tr
							key={rowIdx}
							className={cn(
								'border-b border-border transition-colors hover:bg-muted/50',
								striped && rowIdx % 2 === 1 && 'bg-muted/30',
							)}
						>
							{columns.map((col) => (
								<td
									key={col.key}
									className={cn(
										'text-fg',
										compact ? 'px-3 py-1.5' : 'px-4 py-3',
										bordered && 'border-r border-border-strong last:border-r-0',
									)}
								>
									{row[col.key] != null ? String(row[col.key]) : ''}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export const tableMeta: ComponentMeta = {
	type: 'Table',
	label: 'Table',
	description: 'Simple display-only data table',
	category: 'data',
	propsSchema: z.object({
		columns: z.array(z.object({ key: z.string(), label: z.string() })),
		data: z.array(z.record(z.unknown())),
		striped: z.boolean().optional(),
		bordered: z.boolean().optional(),
		compact: z.boolean().optional(),
	}),
	acceptsChildren: false,
};
