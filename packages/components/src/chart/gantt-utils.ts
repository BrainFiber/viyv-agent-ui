/** Utilities for GanttChart date calculations and tick generation. */

/**
 * Parse all dates from data and return the overall min/max range with padding.
 */
export function parseDateRange(
	data: Record<string, unknown>[],
	startKey: string,
	endKey: string,
): { rangeStart: Date; rangeEnd: Date } {
	let min = Infinity;
	let max = -Infinity;

	for (const row of data) {
		const s = new Date(String(row[startKey])).getTime();
		const e = new Date(String(row[endKey])).getTime();
		if (!Number.isNaN(s) && s < min) min = s;
		if (!Number.isNaN(e) && e > max) max = e;
	}

	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		const now = new Date();
		return { rangeStart: now, rangeEnd: new Date(now.getTime() + 30 * 86400000) };
	}

	// Add 1 day padding on each side
	const pad = 86400000;
	return {
		rangeStart: new Date(min - pad),
		rangeEnd: new Date(max + pad),
	};
}

/**
 * Convert a date to a percentage position within a range.
 */
export function dateToPercent(date: Date, rangeStart: Date, rangeEnd: Date): number {
	const total = rangeEnd.getTime() - rangeStart.getTime();
	if (total <= 0) return 0;
	const offset = date.getTime() - rangeStart.getTime();
	return (offset / total) * 100;
}

/**
 * Generate date tick marks for the header.
 * Automatically selects day/week/month granularity based on range span.
 */
export function generateDateTicks(
	rangeStart: Date,
	rangeEnd: Date,
): { date: Date; label: string; percent: number }[] {
	const span = rangeEnd.getTime() - rangeStart.getTime();
	const dayMs = 86400000;
	const spanDays = span / dayMs;

	const ticks: { date: Date; label: string; percent: number }[] = [];

	if (spanDays <= 14) {
		// Daily ticks
		const d = new Date(rangeStart);
		d.setHours(0, 0, 0, 0);
		d.setDate(d.getDate() + 1);
		while (d.getTime() <= rangeEnd.getTime()) {
			ticks.push({
				date: new Date(d),
				label: `${d.getMonth() + 1}/${d.getDate()}`,
				percent: dateToPercent(d, rangeStart, rangeEnd),
			});
			d.setDate(d.getDate() + 1);
		}
	} else if (spanDays <= 90) {
		// Weekly ticks (every Monday)
		const d = new Date(rangeStart);
		d.setHours(0, 0, 0, 0);
		// Move to next Monday
		const dow = d.getDay();
		d.setDate(d.getDate() + ((8 - dow) % 7 || 7));
		while (d.getTime() <= rangeEnd.getTime()) {
			ticks.push({
				date: new Date(d),
				label: `${d.getMonth() + 1}/${d.getDate()}`,
				percent: dateToPercent(d, rangeStart, rangeEnd),
			});
			d.setDate(d.getDate() + 7);
		}
	} else {
		// Monthly ticks
		const d = new Date(rangeStart);
		d.setHours(0, 0, 0, 0);
		d.setDate(1);
		d.setMonth(d.getMonth() + 1);
		while (d.getTime() <= rangeEnd.getTime()) {
			ticks.push({
				date: new Date(d),
				label: `${d.getFullYear()}/${d.getMonth() + 1}`,
				percent: dateToPercent(d, rangeStart, rangeEnd),
			});
			d.setMonth(d.getMonth() + 1);
		}
	}

	return ticks;
}
