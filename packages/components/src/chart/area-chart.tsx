import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import {
	Area,
	AreaChart as RAreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { CHART_COLORS, ChartContainer, ChartEmptyState, normalizeChartData, toNumber, type ChartBaseProps } from './chart-utils.js';

export interface AreaChartProps extends ChartBaseProps {
	xKey: string;
	yKey: string;
}

export function AreaChart({ data, xKey, yKey, title, color, className }: AreaChartProps) {
	const rows = normalizeChartData(data);

	if (rows.length === 0) {
		return <ChartEmptyState title={title} className={className} />;
	}

	const chartData = rows.map((row) => ({ ...row, [yKey]: toNumber(row[yKey]) }));
	const fill = color ?? CHART_COLORS[0];

	return (
		<ChartContainer title={title} className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<RAreaChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={xKey} />
					<YAxis />
					<Tooltip />
					<Area type="monotone" dataKey={yKey} stroke={fill} fill={fill} fillOpacity={0.3} />
				</RAreaChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}

export const areaChartMeta: ComponentMeta = {
	type: 'AreaChart',
	label: 'Area Chart',
	description: 'Filled area chart for cumulative trends',
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
