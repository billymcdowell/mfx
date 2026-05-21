import {Box, Text} from 'ink';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export type ModalProps = {
	readonly open: boolean;
	readonly onClose?: () => void;
	readonly title?: string;
	readonly width?: number;
	readonly children?: ReactNode;
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
	readonly titleBorderStyle?:
		| 'single'
		| 'double'
		| 'round'
		| 'bold'
		| 'singleDouble'
		| 'doubleSingle'
		| 'classic';
	readonly closeHint?: string | false;
};

export function Modal({
	open,
	onClose,
	title,
	width = 60,
	children,
	borderStyle = 'round',
	borderColor,
	paddingX = 1,
	paddingY = 0,
	titleBorderStyle = 'single',
	closeHint = 'Press Esc to close',
}: ModalProps) {
	const theme = useTheme();
	const resolvedBorderColor = borderColor ?? theme.colors.primary;

	useInput(
		(input, key) => {
			if (!open) {
				return;
			}

			if (key.escape) {
				onClose?.();
			}
		},
		{isActive: open},
	);

	if (!open) {
		return null;
	}

	return (
		<Box
			flexDirection="column"
			borderStyle={borderStyle}
			borderColor={resolvedBorderColor}
			width={width}
			paddingX={paddingX}
			paddingY={paddingY}
		>
			{title && (
				<Box
					marginBottom={1}
					borderStyle={titleBorderStyle}
					borderColor={theme.colors.border}
					paddingX={1}
				>
					<Text bold color={resolvedBorderColor}>
						{title}
					</Text>
				</Box>
			)}
			<Box flexDirection="column">{children}</Box>
			{closeHint !== false && (
				<Box marginTop={1}>
					<Text dimColor color={theme.colors.mutedForeground}>
						{closeHint}
					</Text>
				</Box>
			)}
		</Box>
	);
}
