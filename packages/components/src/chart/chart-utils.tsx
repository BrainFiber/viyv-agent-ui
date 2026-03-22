/** Shared types, colors, and utilities for chart components. */

import type React from 'react';
import { cn } from '../lib/cn.js';

/** Common props inherited by all chart components. */
export interface ChartBaseProps {
	data: unknown;
	title?: string;
	/** Override the primary series colour (default: CHART_COLORS[0]). */
	color?: string;
	className?: string;
}

export const CHART_COLORS = [
	'#3b82f6',
	'#6366f1',
	'#8b5cf6',
	'#ec4899',
	'#f59e0b',
	'#10b981',
	'#06b6d4',
	'#f43f5e',
] as const;

/**
 * Defensive data normalisation for chart components.
 *
 * The primary unwrap of `{ rows }` wrappers is handled by the engine layer
 * (derived-operators). This helper acts as a safety-net so charts gracefully
 * handle both raw arrays and wrapped objects.
 */
export function normalizeChartData(data: unknown): Record<string, unknown>[] {
	if (Array.isArray(data)) return data as Record<string, unknown>[];
	if (data && typeof data === 'object' && 'rows' in data) {
		const rows = (data as { rows: unknown }).rows;
		if (Array.isArray(rows)) return rows as Record<string, unknown>[];
	}
	return [];
}

/** Coerce a value to a number (handles stringified SQL numbers). */
export function toNumber(val: unknown): number {
	const n = Number(val);
	return Number.isNaN(n) ? 0 : n;
}

/** Shared wrapper for all chart components — provides title + aria-label. */
export function ChartContainer({ title, className, children }: { title?: string; className?: string; children: React.ReactNode }) {
	return (
		<div className={cn('min-h-[300px]', className)} aria-label={title ?? 'Chart'}>
			{title && <h4 className="mb-2 text-sm font-medium text-fg-secondary">{title}</h4>}
			{children}
		</div>
	);
}

/** Shared empty state rendered when chart has no data rows. */
export function ChartEmptyState({ title, className }: { title?: string; className?: string }) {
	return (
		<div className={cn('flex min-h-[300px] flex-col items-center justify-center rounded-lg border', className)}>
			{title && <h4 className="mb-2 text-sm font-medium text-fg-secondary">{title}</h4>}
			<p className="text-sm text-fg-subtle">No data</p>
		</div>
	);
}
