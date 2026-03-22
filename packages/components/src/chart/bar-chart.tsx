import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import {
	BarChart as RBarChart,
	Bar,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { CHART_COLORS, ChartContainer, ChartEmptyState, normalizeChartData, toNumber, type ChartBaseProps } from './chart-utils.js';

export interface BarChartProps extends ChartBaseProps {
	xKey: string;
	yKey: string;
}

export function BarChart({ data, xKey, yKey, title, color, className }: BarChartProps) {
	const rows = normalizeChartData(data);

	if (rows.length === 0) {
		return <ChartEmptyState title={title} className={className} />;
	}

	const chartData = rows.map((row) => ({ ...row, [yKey]: toNumber(row[yKey]) }));

	return (
		<ChartContainer title={title} className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<RBarChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={xKey} />
					<YAxis />
					<Tooltip />
					<Bar dataKey={yKey} fill={color ?? CHART_COLORS[0]} />
				</RBarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}

export const barChartMeta: ComponentMeta = {
	type: 'BarChart',
	label: 'Bar Chart',
	description: 'Vertical bar chart for category comparison',
	category: 'chart',
	propsSchema: z.object({
		data: z.unknown(),
		xKey: z.string(),
		yKey: z.string(),
		title: z.string().optional(),
		color: z.string().optional(),
	}),
	acceptsChildren: false,
};
