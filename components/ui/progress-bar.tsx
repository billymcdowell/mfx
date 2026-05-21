import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type ProgressBarProps = {
	readonly value: number;
	readonly total?: number;
	readonly width?: number;
	readonly showPercent?: boolean;
	readonly showEta?: boolean;
	readonly fillChar?: string;
	readonly emptyChar?: string;
	readonly color?: string;
	readonly label?: string;
};

export function ProgressBar({
	value,
	total,
	width = 30,
	showPercent = true,
	showEta: _showEta = false,
	fillChar = '█',
	emptyChar = '░',
	color,
	label,
}: ProgressBarProps) {
	const theme = useTheme();
	const resolvedColor = color ?? theme.colors.primary;

	const percent =
		total === undefined
			? Math.min(100, Math.round(value))
			: Math.min(100, Math.round((value / total) * 100));
	const filled = Math.round((percent / 100) * width);
	const empty = width - filled;

	const bar = fillChar.repeat(filled) + emptyChar.repeat(empty);

	return (
		<Box flexDirection="column">
			{label && <Text>{label}</Text>}
			<Box gap={1}>
				<Text color={resolvedColor}>{bar}</Text>
				{showPercent && (
					<Text color={theme.colors.mutedForeground}>{percent}%</Text>
				)}
				{total !== undefined && (
					<Text dimColor color={theme.colors.mutedForeground}>
						{value}/{total}
					</Text>
				)}
			</Box>
		</Box>
	);
}
