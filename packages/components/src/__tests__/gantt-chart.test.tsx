import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GanttChart } from '../chart/gantt-chart.js';

afterEach(cleanup);

const sampleTasks = [
	{ task: 'Task A', start: '2026-03-01', end: '2026-03-10', progress: 80, phase: 'Phase 1' },
	{ task: 'Task B', start: '2026-03-05', end: '2026-03-15', progress: 40, phase: 'Phase 1' },
	{ task: 'Task C', start: '2026-03-10', end: '2026-03-20', progress: 0, phase: 'Phase 2' },
];

describe('GanttChart', () => {
	it('renders task bars', () => {
		render(
			<GanttChart data={sampleTasks} taskKey="task" startKey="start" endKey="end" />,
		);
		expect(screen.getByText('Task A')).toBeTruthy();
		expect(screen.getByText('Task B')).toBeTruthy();
		expect(screen.getByText('Task C')).toBeTruthy();
	});

	it('shows today marker', () => {
		// Use a date range that includes today
		const today = new Date();
		const before = new Date(today.getTime() - 10 * 86400000).toISOString().slice(0, 10);
		const after = new Date(today.getTime() + 10 * 86400000).toISOString().slice(0, 10);

		const data = [{ task: 'Current', start: before, end: after, progress: 50 }];
		const { container } = render(
			<GanttChart data={data} taskKey="task" startKey="start" endKey="end" />,
		);
		const todayMarker = container.querySelector('[aria-label="Today"]');
		expect(todayMarker).toBeTruthy();
	});

	it('renders progress within bars', () => {
		const { container } = render(
			<GanttChart
				data={sampleTasks}
				taskKey="task"
				startKey="start"
				endKey="end"
				progressKey="progress"
			/>,
		);
		// Task A has 80% progress - check that the progress bar has aria-label with percentage
		const barA = container.querySelector('[aria-label*="Task A"][aria-label*="80%"]');
		expect(barA).toBeTruthy();
	});

	it('handles empty data', () => {
		render(
			<GanttChart data={[]} taskKey="task" startKey="start" endKey="end" />,
		);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('has aria-labels on bars', () => {
		const { container } = render(
			<GanttChart
				data={sampleTasks}
				taskKey="task"
				startKey="start"
				endKey="end"
				progressKey="progress"
			/>,
		);
		const labels = container.querySelectorAll('[aria-label]');
		const barLabels = Array.from(labels)
			.map((el) => el.getAttribute('aria-label'))
			.filter((l) => l?.startsWith('Task'));
		expect(barLabels.length).toBe(3);
		expect(barLabels[0]).toContain('Task A');
	});

	it('applies groupKey colors', () => {
		const { container } = render(
			<GanttChart
				data={sampleTasks}
				taskKey="task"
				startKey="start"
				endKey="end"
				groupKey="phase"
			/>,
		);
		// Should render bars with different colors for Phase 1 and Phase 2
		const bars = container.querySelectorAll('[aria-label*="Task"]');
		expect(bars.length).toBe(3);
		// Phase 1 bars (A, B) should have same color, Phase 2 (C) different
		const colorA = (bars[0] as HTMLElement).style.backgroundColor;
		const colorB = (bars[1] as HTMLElement).style.backgroundColor;
		const colorC = (bars[2] as HTMLElement).style.backgroundColor;
		expect(colorA).toBe(colorB);
		expect(colorA).not.toBe(colorC);
	});

	it('applies custom className', () => {
		const { container } = render(
			<GanttChart data={sampleTasks} taskKey="task" startKey="start" endKey="end" className="mt-4" />,
		);
		// ChartContainer wraps with the className
		expect(container.firstElementChild?.className).toContain('mt-4');
	});
});
