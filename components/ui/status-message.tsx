import {Box, Text} from 'ink';
import type {ReactNode} from 'react';

import {Spinner} from './spinner';
import {useTheme} from '@/components/ui/theme-provider';

export type StatusVariant =
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'loading'
	| 'pending';

const ICONS: Record<Exclude<StatusVariant, 'loading'>, string> = {
	error: '✗',
	info: 'ℹ',
	pending: '○',
	success: '✓',
	warning: '⚠',
};

export type StatusMessageProps = {
	readonly variant?: StatusVariant;
	readonly children: ReactNode;
	readonly icon?: string;
};

export function StatusMessage({
	variant = 'info',
	children,
	icon,
}: StatusMessageProps) {
	const theme = useTheme();

	const variantColor = (() => {
		switch (variant) {
			case 'success': {
				return theme.colors.success;
			}

			case 'error': {
				return theme.colors.error;
			}

			case 'warning': {
				return theme.colors.warning;
			}

			case 'loading': {
				return theme.colors.primary;
			}

			case 'pending': {
				return theme.colors.muted;
			}

			default: {
				return theme.colors.info;
			}
		}
	})();

	return (
		<Box gap={1} flexDirection="row">
			{variant === 'loading' ? (
				<Spinner type="dots" color={variantColor} />
			) : (
				<Text color={variantColor}>{icon ?? ICONS[variant]}</Text>
			)}
			<Text>{children}</Text>
		</Box>
	);
}
