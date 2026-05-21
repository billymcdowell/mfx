import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type HeatMapProps = {
	readonly data: number[][];
	readonly rowLabels?: string[];
	readonly colLabels?: string[];
	readonly colorScale?: string[];
	readonly cellWidth?: number;
	readonly showValues?: boolean;
};

const DEFAULT_COLOR_SCALE = [
	'#1e3a5f',
	'#1a5276',
	'#1f618d',
	'#2980b9',
	'#5dade2',
	'#f39c12',
	'#e67e22',
	'#e74c3c',
	'#c0392b',
];

const SHADE_CHARS = ['', '░', '▒', '▓', '█'];

const getColorForValue = (
	value: number,
	min: number,
	max: number,
	scale: string[],
): string => {
	if (max === min) {
		return scale[Math.floor(scale.length / 2)] ?? '#888888';
	}

	const t = (value - min) / (max - min);
	const idx = Math.min(scale.length - 1, Math.round(t * (scale.length - 1)));
	return scale[idx] ?? scale[0] ?? '#888888';
};

const getShadeForValue = (value: number, min: number, max: number): string => {
	if (max === min) {
		return SHADE_CHARS[2] ?? '▒';
	}

	const t = (value - min) / (max - min);
	const idx = Math.min(
		SHADE_CHARS.length - 1,
		Math.round(t * (SHADE_CHARS.length - 1)),
	);
	return SHADE_CHARS[idx] ?? SHADE_CHARS[0] ?? '';
};

const padCenter = (string_: string, width: number): string => {
	if (string_.length >= width) {
		return string_.slice(0, width);
	}

	const total = width - string_.length;
	const left = Math.floor(total / 2);
	const right = total - left;
	return ''.repeat(left) + `${string_} `.repeat(right);
};

const padStart = (string_: string, width: number): string => {
	if (string_.length >= width) {
		return string_.slice(0, width);
	}

	return ''.repeat(width - string_.length) + string_;
};

export function HeatMap({
	data,
	rowLabels,
	colLabels,
	colorScale = DEFAULT_COLOR_SCALE,
	cellWidth = 5,
	showValues = false,
}: HeatMapProps) {
	const theme = useTheme();

	if (data.length === 0 || data[0].length === 0) {
		return <Text color={theme.colors.mutedForeground}>No data</Text>;
	}

	const _numberRows = data.length;
	const numberCols = data[0].length;

	const allValues = data.flat();
	const min = Math.min(...allValues);
	const max = Math.max(...allValues);

	const rowLabelWidth = rowLabels
		? Math.max(...rowLabels.map(l => l.length)) + 1
		: 0;

	return (
		<Box flexDirection="column">
			{colLabels && (
				<Box flexDirection="row">
					{rowLabelWidth > 0 && <Text>{''.repeat(rowLabelWidth + 1)}</Text>}
					{Array.from({length: numberCols}, (_, ci) => (
						<Text key={ci} color={theme.colors.mutedForeground}>
							{padCenter(colLabels[ci] ?? String(ci), cellWidth)}
						</Text>
					))}
				</Box>
			)}

			{data.map((row, ri) => (
				<Box key={ri} flexDirection="row">
					{rowLabels && (
						<Text color={theme.colors.mutedForeground}>
							{padStart(rowLabels[ri] ?? String(ri), rowLabelWidth)}
						</Text>
					)}

					{row.map((value, ci) => {
						const cellColor = getColorForValue(value, min, max, colorScale);
						const shadeChar = getShadeForValue(value, min, max);
						const cellContent = showValues
							? padCenter(String(Math.round(value)), cellWidth)
							: shadeChar.repeat(cellWidth);

						return (
							<Text key={ci} color={cellColor}>
								{cellContent}
							</Text>
						);
					})}
				</Box>
			))}

			<Box flexDirection="row" gap={1} marginTop={1}>
				<Text color={theme.colors.mutedForeground}>Low</Text>
				{colorScale.map((c, idx) => (
					<Text key={idx} color={c}>
						█
					</Text>
				))}
				<Text color={theme.colors.mutedForeground}>High</Text>
			</Box>
		</Box>
	);
}
