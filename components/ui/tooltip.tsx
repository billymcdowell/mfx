import {Box, Text} from 'ink';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';

export type TooltipProps = {
	readonly children: ReactNode;
	readonly content: string;
	readonly position?: 'top' | 'bottom' | 'left' | 'right';
	readonly isVisible?: boolean;
	readonly borderStyle?:
		| 'single'
		| 'double'
		| 'round'
		| 'bold'
		| 'singleDouble'
		| 'doubleSingle'
		| 'classic';
	readonly borderColor?: string;
	readonly paddingX?: number;
	readonly paddingY?: number;
	readonly gap?: number;
	readonly arrowDown?: string;
	readonly arrowUp?: string;
};

export function Tooltip({
	children,
	content,
	position = 'top',
	isVisible = false,
	borderStyle = 'single',
	borderColor,
	paddingX = 1,
	paddingY = 0,
	gap = 1,
	arrowDown = '↓',
	arrowUp = '↑',
}: TooltipProps) {
	const theme = useTheme();
	const resolvedBorderColor = borderColor ?? theme.colors.border;

	const tooltipBox = (
		<Box
			borderStyle={borderStyle}
			borderColor={resolvedBorderColor}
			paddingX={paddingX}
			paddingY={paddingY}
		>
			<Text color={theme.colors.foreground}>{content}</Text>
		</Box>
	);

	if (!isVisible) {
		return <Box>{children}</Box>;
	}

	if (position === 'top') {
		return (
			<Box flexDirection="column" alignItems="flex-start">
				{tooltipBox}
				<Text color={theme.colors.mutedForeground}>{arrowDown}</Text>
				<Box>{children}</Box>
			</Box>
		);
	}

	if (position === 'bottom') {
		return (
			<Box flexDirection="column" alignItems="flex-start">
				<Box>{children}</Box>
				<Text color={theme.colors.mutedForeground}>{arrowUp}</Text>
				{tooltipBox}
			</Box>
		);
	}

	if (position === 'left') {
		return (
			<Box flexDirection="row" alignItems="center" gap={gap}>
				{tooltipBox}
				<Box>{children}</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="row" alignItems="center" gap={gap}>
			<Box>{children}</Box>
			{tooltipBox}
		</Box>
	);
}
