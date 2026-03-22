import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { ChartContainer, ChartEmptyState, CHART_COLORS, normalizeChartData } from './chart-utils.js';
import { parseDateRange, dateToPercent, generateDateTicks } from './gantt-utils.js';

export interface GanttChartProps {
	data: unknown;
	taskKey: string;
	startKey: string;
	endKey: string;
	progressKey?: string;
	groupKey?: string;
	title?: string;
	className?: string;
}

export function GanttChart({
	data,
	taskKey,
	startKey,
	endKey,
	progressKey,
	groupKey,
	title,
	className,
}: GanttChartProps) {
	const rows = normalizeChartData(data);

	if (rows.length === 0) {
		return <ChartEmptyState title={title} className={className} />;
	}

	const { rangeStart, rangeEnd } = parseDateRange(rows, startKey, endKey);
	const ticks = generateDateTicks(rangeStart, rangeEnd);

	// Build group color map
	const groupColors = new Map<string, string>();
	if (groupKey) {
		const groups = [...new Set(rows.map((r) => String(r[groupKey] ?? '')))];
		groups.forEach((g, i) => {
			groupColors.set(g, CHART_COLORS[i % CHART_COLORS.length]);
		});
	}

	const today = new Date();
	const todayPercent = dateToPercent(today, rangeStart, rangeEnd);
	const showToday = todayPercent >= 0 && todayPercent <= 100;

	return (
		<ChartContainer title={title} className={className}>
			<div className="overflow-x-auto">
				<div className="flex">
					{/* Label column */}
					<div className="w-[160px] shrink-0">
						<div className="h-8 border-b border-gray-200" />
						{rows.map((row, i) => (
							<div
								key={`label-${i}`}
								className="h-10 border-b border-gray-100 flex items-center px-2"
							>
								<span className="text-sm text-gray-700 truncate" title={String(row[taskKey] ?? '')}>
									{String(row[taskKey] ?? '')}
								</span>
							</div>
						))}
					</div>

					{/* Bar area */}
					<div className="flex-1 relative min-w-0">
						{/* Header ticks */}
						<div className="relative h-8 border-b border-gray-200">
							{ticks.map((tick, i) => (
								<span
									key={`${tick.label}-${i}`}
									className="absolute text-xs text-gray-500 -translate-x-1/2"
									style={{ left: `${tick.percent}%` }}
								>
									{tick.label}
								</span>
							))}
						</div>

						{/* Today marker — positioned relative to bar area */}
						{showToday && (
							<div
								className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-400 z-10"
								style={{ left: `${todayPercent}%` }}
								aria-label="Today"
							/>
						)}

						{/* Task bars */}
						{rows.map((row, i) => {
							const taskName = String(row[taskKey] ?? '');
							const startDate = new Date(String(row[startKey]));
							const endDate = new Date(String(row[endKey]));
							const progress = progressKey ? Math.max(0, Math.min(100, Number(row[progressKey]) || 0)) : undefined;
							const group = groupKey ? String(row[groupKey] ?? '') : undefined;

							const left = dateToPercent(startDate, rangeStart, rangeEnd);
							const right = dateToPercent(endDate, rangeStart, rangeEnd);
							const width = Math.max(right - left, 0.5);

							const barColor = group ? groupColors.get(group) ?? CHART_COLORS[0] : CHART_COLORS[0];

							const startStr = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
							const endStr = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
							const ariaLabel = progress != null
								? `${taskName}: ${startStr} ~ ${endStr} (${progress}%)`
								: `${taskName}: ${startStr} ~ ${endStr}`;

							return (
								<div key={`bar-${i}`} className="relative h-10 border-b border-gray-100">
									<div
										className="absolute top-1.5 h-6 rounded"
										style={{
											left: `${left}%`,
											width: `${width}%`,
											backgroundColor: barColor,
											opacity: 0.8,
										}}
										aria-label={ariaLabel}
									>
										{progress != null && progress > 0 && (
											<div
												className={cn('h-full', progress >= 100 ? 'rounded' : 'rounded-l')}
												style={{
													width: `${progress}%`,
													backgroundColor: barColor,
													filter: 'brightness(0.75)',
												}}
											/>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</ChartContainer>
	);
}

export const ganttChartMeta: ComponentMeta = {
	type: 'GanttChart',
	label: 'Gantt Chart',
	description: 'Task timeline visualization with date-based bars, progress indicators, and today marker',
	category: 'chart',
	propsSchema: z.object({
		data: z.unknown(),
		taskKey: z.string(),
		startKey: z.string(),
		endKey: z.string(),
		progressKey: z.string().optional(),
		groupKey: z.string().optional(),
		title: z.string().optional(),
	}),
	acceptsChildren: false,
};
