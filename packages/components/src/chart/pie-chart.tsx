import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { Cell, Legend, Pie, PieChart as RPieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, ChartContainer, ChartEmptyState, normalizeChartData, toNumber, type ChartBaseProps } from './chart-utils.js';

export interface PieChartProps extends ChartBaseProps {
	nameKey: string;
	valueKey: string;
}

export function PieChart({ data, nameKey, valueKey, title, className }: PieChartProps) {
	const rows = normalizeChartData(data);

	if (rows.length === 0) {
		return <ChartEmptyState title={title} className={className} />;
	}

	const chartData = rows.map((row) => ({ ...row, [valueKey]: toNumber(row[valueKey]) }));

	return (
		<ChartContainer title={title} className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<RPieChart>
					<Pie data={chartData} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={100}>
						{chartData.map((_, i) => (
							<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</RPieChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}

export const pieChartMeta: ComponentMeta = {
	type: 'PieChart',
	label: 'Pie Chart',
	description: 'Pie chart for proportional distribution (auto-colored slices)',
	category: 'chart',
	propsSchema: z.object({
		data: z.unknown(),
		nameKey: z.string(),
		valueKey: z.string(),
		title: z.string().optional(),
	}),
	acceptsChildren: false,
};
