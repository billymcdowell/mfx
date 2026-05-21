import {Box, Text} from 'ink';
import {useMemo} from 'react';
import plot from 'simple-ascii-chart';
import type {Settings} from 'simple-ascii-chart';

import {useTheme} from '@/components/ui/theme-provider';

export type LineChartDataPoint = number | {label?: string; value: number};

export type LineChartProps = {
	readonly data: LineChartDataPoint[];
	readonly width?: number;
	readonly height?: number;
	readonly title?: string;
	readonly color?: string;
	readonly showAxes?: boolean;
};

const getValue = (d: LineChartDataPoint): number =>
	typeof d === 'number' ? d : d.value;

const toPoints = (data: LineChartDataPoint[]): Array<[number, number]> =>
	data.map((d, i) => [i, getValue(d)]);

export function LineChart({
	data,
	width = 40,
	height = 10,
	title,
	showAxes = true,
}: LineChartProps) {
	const theme = useTheme();

	const lines = useMemo(() => {
		if (data.length === 0) {
			return [];
		}

		const points = toPoints(data);
		const plotWidth = Math.max(12, width);
		const plotHeight = Math.max(4, height);

		const lastX = Math.max(0, points.length - 1);
		const tickSpan = lastX < 2 ? [0, lastX] : [0, Math.floor(lastX / 2), lastX];
		const customXAxisTicks = [...new Set(tickSpan)].sort((a, b) => a - b);

		const settings: Settings = {
			width: plotWidth,
			height: plotHeight,
			showTickLabel: true,
			color: 'ansiMagenta',
			...(title ? {title} : {}),
			...(showAxes
				? {customXAxisTicks}
				: {
						hideXAxis: true,
						hideYAxis: true,
						hideXAxisTicks: true,
						hideYAxisTicks: true,
				  }),
		};

		return plot(points, settings)
			.split('\n')
			.filter(line => line.length > 0);
	}, [data, height, showAxes, title, width]);

	if (data.length === 0) {
		return <Text color={theme.colors.mutedForeground}>No data</Text>;
	}

	return (
		<Box flexDirection="column">
			{lines.map((line, i) => (
				<Text key={i}>{line}</Text>
			))}
		</Box>
	);
}
