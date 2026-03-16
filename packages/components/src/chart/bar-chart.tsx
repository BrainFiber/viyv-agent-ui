import {
	BarChart as RBarChart,
	Bar,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { cn } from '../lib/cn.js';
import { CHART_COLORS, ChartEmptyState, normalizeChartData, toNumber, type ChartBaseProps } from './chart-utils.js';

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
		<div className={cn('min-h-[300px]', className)}>
			{title && <h4 className="mb-2 text-sm font-medium text-gray-700">{title}</h4>}
			<ResponsiveContainer width="100%" height={300}>
				<RBarChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={xKey} />
					<YAxis />
					<Tooltip />
					<Bar dataKey={yKey} fill={color ?? CHART_COLORS[0]} />
				</RBarChart>
			</ResponsiveContainer>
		</div>
	);
}
