import {Box, Text} from 'ink';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export type DrawerEdge = 'left' | 'right' | 'top' | 'bottom';

export type DrawerProps = {
	readonly isOpen?: boolean;
	readonly edge?: DrawerEdge;
	readonly title?: string;
	readonly children: ReactNode;
	readonly onClose?: () => void;
	readonly width?: number;
	readonly height?: number;
};

export function Drawer({
	isOpen = false,
	edge = 'right',
	title,
	children,
	onClose,
	width = 40,
	height = 10,
}: DrawerProps) {
	const theme = useTheme();

	useInput(
		(_input, key) => {
			if (!isOpen) {
				return;
			}

			if (key.escape) {
				onClose?.();
			}
		},
		{isActive: isOpen},
	);

	if (!isOpen) {
		return null;
	}

	const isHorizontal = edge === 'left' || edge === 'right';

	return (
		<Box
			flexDirection="column"
			borderStyle="single"
			borderColor={theme.colors.border}
			width={isHorizontal ? width : undefined}
			height={isHorizontal ? undefined : height}
			paddingX={1}
			paddingY={0}
		>
			<Box justifyContent="space-between" marginBottom={1}>
				{title ? (
					<Text bold color={theme.colors.primary}>
						{title}
					</Text>
				) : (
					<Text> </Text>
				)}
				<Text dimColor color={theme.colors.mutedForeground}>
					Esc to close
				</Text>
			</Box>
			<Box flexDirection="column" flexGrow={1}>
				{children}
			</Box>
		</Box>
	);
}
