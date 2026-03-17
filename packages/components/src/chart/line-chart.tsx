import {
	CartesianGrid,
	Line,
	LineChart as RLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { CHART_COLORS, ChartContainer, ChartEmptyState, normalizeChartData, toNumber, type ChartBaseProps } from './chart-utils.js';

export interface LineChartProps extends ChartBaseProps {
	xKey: string;
	yKey: string;
}

export function LineChart({ data, xKey, yKey, title, color, className }: LineChartProps) {
	const rows = normalizeChartData(data);

	if (rows.length === 0) {
		return <ChartEmptyState title={title} className={className} />;
	}

	const chartData = rows.map((row) => ({ ...row, [yKey]: toNumber(row[yKey]) }));

	return (
		<ChartContainer title={title} className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<RLineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={xKey} />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey={yKey} stroke={color ?? CHART_COLORS[0]} dot />
				</RLineChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
