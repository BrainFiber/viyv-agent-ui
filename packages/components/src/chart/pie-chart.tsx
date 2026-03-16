import { Cell, Legend, Pie, PieChart as RPieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/cn.js';
import { CHART_COLORS, ChartEmptyState, normalizeChartData, toNumber, type ChartBaseProps } from './chart-utils.js';

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
		<div className={cn('min-h-[300px]', className)}>
			{title && <h4 className="mb-2 text-sm font-medium text-gray-700">{title}</h4>}
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
		</div>
	);
}
