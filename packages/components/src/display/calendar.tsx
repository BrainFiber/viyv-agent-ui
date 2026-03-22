import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState } from 'react';
import { cn } from '../lib/cn.js';

export interface CalendarEvent {
	date: string;
	label: string;
	color?: string;
}

export interface CalendarProps {
	events?: CalendarEvent[];
	defaultMonth?: string;
	onDateClick?: (date: string) => void;
	className?: string;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
	return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
	return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function Calendar({ events = [], defaultMonth, onDateClick, className }: CalendarProps) {
	const initial = defaultMonth ? new Date(`${defaultMonth}-01`) : new Date();
	const [year, setYear] = useState(initial.getFullYear());
	const [month, setMonth] = useState(initial.getMonth());

	const daysInMonth = getDaysInMonth(year, month);
	const firstDay = getFirstDayOfWeek(year, month);
	const today = new Date();
	const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

	const eventMap = new Map<string, CalendarEvent[]>();
	for (const ev of events) {
		const list = eventMap.get(ev.date) ?? [];
		list.push(ev);
		eventMap.set(ev.date, list);
	}

	const prevMonth = () => {
		if (month === 0) { setYear(year - 1); setMonth(11); }
		else { setMonth(month - 1); }
	};

	const nextMonth = () => {
		if (month === 11) { setYear(year + 1); setMonth(0); }
		else { setMonth(month + 1); }
	};

	const cells: (number | null)[] = [];
	for (let i = 0; i < firstDay; i++) cells.push(null);
	for (let d = 1; d <= daysInMonth; d++) cells.push(d);

	return (
		<div className={cn('rounded-xl border bg-surface p-4 shadow-sm', className)}>
			<div className="mb-4 flex items-center justify-between">
				<button type="button" onClick={prevMonth} aria-label="Previous month" className="rounded p-1 hover:bg-muted">
					&#x2039;
				</button>
				<span className="text-sm font-semibold">{year}年{month + 1}月</span>
				<button type="button" onClick={nextMonth} aria-label="Next month" className="rounded p-1 hover:bg-muted">
					&#x203A;
				</button>
			</div>
			<div role="grid" aria-label="Calendar" className="grid grid-cols-7 gap-1">
				{WEEKDAYS.map((day) => (
					<div key={day} className="py-1 text-center text-xs font-medium text-fg-muted">
						{day}
					</div>
				))}
				{cells.map((day, i) => {
					if (day === null) return <div key={`empty-${i}`} />;
					const dateStr = formatDate(year, month, day);
					const isToday = dateStr === todayStr;
					const dayEvents = eventMap.get(dateStr);
					return (
						<button
							key={dateStr}
							type="button"
							role="gridcell"
							aria-label={`${month + 1}月${day}日${dayEvents ? ` (${dayEvents.map(e => e.label).join(', ')})` : ''}`}
							onClick={() => onDateClick?.(dateStr)}
							className={cn(
								'relative flex h-10 w-full flex-col items-center justify-center rounded text-sm transition-colors hover:bg-muted',
								isToday && 'font-bold text-primary bg-primary/10 ring-1 ring-primary',
							)}
						>
							{day}
							{dayEvents && dayEvents.length > 0 && (
								<span
									className="absolute bottom-1 h-1 w-1 rounded-full"
									style={{ backgroundColor: dayEvents[0].color ?? 'var(--color-primary)' }}
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export const calendarMeta: ComponentMeta = {
	type: 'Calendar',
	label: 'Calendar',
	description: 'Monthly calendar display with events',
	category: 'display',
	propsSchema: z.object({
		events: z.array(z.object({
			date: z.string(),
			label: z.string(),
			color: z.string().optional(),
		})).optional(),
		defaultMonth: z.string().optional(),
	}),
	acceptsChildren: false,
};
