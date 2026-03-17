import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AreaChart } from '../chart/area-chart.js';
import { BarChart } from '../chart/bar-chart.js';
import { LineChart } from '../chart/line-chart.js';
import { PieChart } from '../chart/pie-chart.js';

afterEach(cleanup);

// ResponsiveContainer needs real DOM dimensions — mock it to render children directly.
vi.mock('recharts', async () => {
	const actual = await vi.importActual<typeof import('recharts')>('recharts');
	return {
		...actual,
		ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	};
});

const sampleXY = [
	{ name: 'A', value: 10 },
	{ name: 'B', value: 20 },
	{ name: 'C', value: 30 },
];

const samplePie = [
	{ category: 'X', count: 40 },
	{ category: 'Y', count: 60 },
];

// ---------- aria-label on chart wrapper ----------

describe('Chart aria-label', () => {
	it('sets aria-label to title when provided', () => {
		render(<BarChart data={sampleXY} xKey="name" yKey="value" title="Sales" />);
		expect(screen.getByLabelText('Sales')).toBeTruthy();
	});

	it('falls back to "Chart" when title is omitted', () => {
		render(<BarChart data={sampleXY} xKey="name" yKey="value" />);
		expect(screen.getByLabelText('Chart')).toBeTruthy();
	});
});

// ---------- BarChart ----------

describe('BarChart', () => {
	it('renders title when provided', () => {
		render(<BarChart data={sampleXY} xKey="name" yKey="value" title="Sales" />);
		expect(screen.getByText('Sales')).toBeTruthy();
	});

	it('does not render title when omitted', () => {
		render(<BarChart data={sampleXY} xKey="name" yKey="value" />);
		expect(screen.queryByText('Sales')).toBeNull();
	});

	it('shows empty state for empty array', () => {
		render(<BarChart data={[]} xKey="name" yKey="value" title="Empty" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('shows empty state for undefined data', () => {
		render(<BarChart data={undefined} xKey="name" yKey="value" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('normalizes { rows } wrapper', () => {
		render(<BarChart data={{ rows: sampleXY }} xKey="name" yKey="value" title="Wrapped" />);
		expect(screen.getByText('Wrapped')).toBeTruthy();
		expect(screen.queryByText('No data')).toBeNull();
	});

	it('applies className', () => {
		const { container } = render(
			<BarChart data={sampleXY} xKey="name" yKey="value" className="custom-class" />,
		);
		expect(container.firstElementChild?.classList.contains('custom-class')).toBe(true);
	});

	it('handles stringified number values from SQL', () => {
		const stringData = [
			{ name: 'A', value: '100' },
			{ name: 'B', value: '200' },
		];
		render(<BarChart data={stringData} xKey="name" yKey="value" title="SQL" />);
		expect(screen.getByText('SQL')).toBeTruthy();
		expect(screen.queryByText('No data')).toBeNull();
	});

	it('shows empty state for null data', () => {
		render(<BarChart data={null} xKey="name" yKey="value" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('renders with custom color prop', () => {
		render(<BarChart data={sampleXY} xKey="name" yKey="value" color="#ff0000" title="Red" />);
		expect(screen.getByText('Red')).toBeTruthy();
		expect(screen.queryByText('No data')).toBeNull();
	});
});

// ---------- LineChart ----------

describe('LineChart', () => {
	it('renders title when provided', () => {
		render(<LineChart data={sampleXY} xKey="name" yKey="value" title="Trend" />);
		expect(screen.getByText('Trend')).toBeTruthy();
	});

	it('shows empty state for empty array', () => {
		render(<LineChart data={[]} xKey="name" yKey="value" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('shows empty state for undefined data', () => {
		render(<LineChart data={undefined} xKey="name" yKey="value" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('normalizes { rows } wrapper', () => {
		render(<LineChart data={{ rows: sampleXY }} xKey="name" yKey="value" title="Wrapped" />);
		expect(screen.queryByText('No data')).toBeNull();
	});

	it('applies className', () => {
		const { container } = render(
			<LineChart data={sampleXY} xKey="name" yKey="value" className="line-cls" />,
		);
		expect(container.firstElementChild?.classList.contains('line-cls')).toBe(true);
	});

	it('renders with custom color prop', () => {
		render(<LineChart data={sampleXY} xKey="name" yKey="value" color="#00ff00" title="Green" />);
		expect(screen.getByText('Green')).toBeTruthy();
	});
});

// ---------- AreaChart ----------

describe('AreaChart', () => {
	it('renders title when provided', () => {
		render(<AreaChart data={sampleXY} xKey="name" yKey="value" title="Area" />);
		expect(screen.getByText('Area')).toBeTruthy();
	});

	it('shows empty state for empty array', () => {
		render(<AreaChart data={[]} xKey="name" yKey="value" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('shows empty state for undefined data', () => {
		render(<AreaChart data={undefined} xKey="name" yKey="value" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('normalizes { rows } wrapper', () => {
		render(<AreaChart data={{ rows: sampleXY }} xKey="name" yKey="value" title="Wrapped" />);
		expect(screen.queryByText('No data')).toBeNull();
	});

	it('applies className', () => {
		const { container } = render(
			<AreaChart data={sampleXY} xKey="name" yKey="value" className="area-cls" />,
		);
		expect(container.firstElementChild?.classList.contains('area-cls')).toBe(true);
	});

	it('renders with custom color prop', () => {
		render(<AreaChart data={sampleXY} xKey="name" yKey="value" color="#0000ff" title="Blue" />);
		expect(screen.getByText('Blue')).toBeTruthy();
	});
});

// ---------- PieChart ----------

describe('PieChart', () => {
	it('renders title when provided', () => {
		render(<PieChart data={samplePie} nameKey="category" valueKey="count" title="Pie" />);
		expect(screen.getByText('Pie')).toBeTruthy();
	});

	it('shows empty state for empty array', () => {
		render(<PieChart data={[]} nameKey="category" valueKey="count" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('shows empty state for undefined data', () => {
		render(<PieChart data={undefined} nameKey="category" valueKey="count" />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('normalizes { rows } wrapper', () => {
		render(
			<PieChart data={{ rows: samplePie }} nameKey="category" valueKey="count" title="Wrapped" />,
		);
		expect(screen.queryByText('No data')).toBeNull();
	});

	it('applies className', () => {
		const { container } = render(
			<PieChart data={samplePie} nameKey="category" valueKey="count" className="pie-cls" />,
		);
		expect(container.firstElementChild?.classList.contains('pie-cls')).toBe(true);
	});
});
