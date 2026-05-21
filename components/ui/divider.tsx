import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type DividerProps = {
	readonly variant?: 'single' | 'double' | 'bold';
	readonly orientation?: 'horizontal' | 'vertical';
	readonly color?: string;
	readonly label?: string;
	readonly labelColor?: string;
	readonly dividerChar?: string;
	readonly titlePadding?: number;
	readonly padding?: number;
	readonly height?: number;
	readonly width?: number | 'auto';
};

const DIVIDER_CHARS: Record<NonNullable<DividerProps['variant']>, string> = {
	bold: '┃',
	double: '║',
	single: '│',
};

export function Divider({
	variant = 'single',
	orientation = 'horizontal',
	color,
	label,
	labelColor,
	dividerChar,
	titlePadding = 1,
	padding = 0,
	height = 1,
	width = 'auto',
}: DividerProps) {
	const theme = useTheme();
	const resolvedColor = color ?? theme.colors.border;
	const vChar = dividerChar ?? DIVIDER_CHARS[variant];

	if (orientation === 'vertical') {
		const lines = Array.from({length: height}, (_, i) => i);
		return (
			<Box flexDirection="column">
				{lines.map(i => (
					<Text key={i} color={resolvedColor}>
						{vChar}
					</Text>
				))}
			</Box>
		);
	}

	const paddingString = ''.repeat(padding);
	const titlePad = ''.repeat(titlePadding);

	if (label) {
		const resolvedLabelColor = labelColor ?? resolvedColor;
		return (
			<Box flexDirection="row" width={width === 'auto' ? undefined : width}>
				{padding > 0 && <Text>{paddingString}</Text>}
				<Box
					borderTop
					flexGrow={1}
					borderStyle="single"
					borderColor={resolvedColor}
					borderBottom={false}
					borderLeft={false}
					borderRight={false}
				/>
				<Text color={resolvedLabelColor}>
					{titlePad}
					{label}
					{titlePad}
				</Text>
				<Box
					borderTop
					flexGrow={1}
					borderStyle="single"
					borderColor={resolvedColor}
					borderBottom={false}
					borderLeft={false}
					borderRight={false}
				/>
				{padding > 0 && <Text>{paddingString}</Text>}
			</Box>
		);
	}

	return (
		<Box flexDirection="row" width={width === 'auto' ? undefined : width}>
			{padding > 0 && <Text>{paddingString}</Text>}
			<Box
				borderTop
				flexGrow={1}
				borderStyle="single"
				borderColor={resolvedColor}
				borderBottom={false}
				borderLeft={false}
				borderRight={false}
			/>
			{padding > 0 && <Text>{paddingString}</Text>}
		</Box>
	);
}
