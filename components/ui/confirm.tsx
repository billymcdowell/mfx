import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export type ConfirmProps = {
	readonly message: string;
	readonly onConfirm?: () => void;
	readonly onCancel?: () => void;
	readonly confirmLabel?: string;
	readonly cancelLabel?: string;
	readonly defaultValue?: boolean;
	readonly variant?: 'default' | 'danger';
};

export function Confirm({
	message,
	onConfirm,
	onCancel,
	confirmLabel = 'Yes',
	cancelLabel = 'No',
	defaultValue = false,
	variant = 'default',
}: ConfirmProps) {
	const theme = useTheme();
	const [selected, setSelected] = useState<boolean>(defaultValue);

	useInput((input, key) => {
		if (key.escape) {
			onCancel?.();
			return;
		}

		if (key.leftArrow || key.rightArrow) {
			setSelected(s => !s);
		} else if (key.return) {
			if (selected) {
				onConfirm?.();
			} else {
				onCancel?.();
			}
		} else if (input === 'y' || input === 'Y') {
			onConfirm?.();
		} else if (input === 'n' || input === 'N') {
			onCancel?.();
		}
	});

	const yesColor =
		variant === 'danger' ? theme.colors.error : theme.colors.primary;

	return (
		<Box flexDirection="column" gap={0}>
			<Text>
				<Text color={theme.colors.primary}>?</Text>
				{message}
			</Text>
			<Box gap={2} paddingLeft={2}>
				<Box gap={1}>
					{selected ? (
						<Text bold color={yesColor}>
							›{confirmLabel}
						</Text>
					) : (
						<Text color={theme.colors.mutedForeground}>{confirmLabel}</Text>
					)}
				</Box>
				<Box gap={1}>
					{selected ? (
						<Text color={theme.colors.mutedForeground}>{cancelLabel}</Text>
					) : (
						<Text bold>›{cancelLabel}</Text>
					)}
				</Box>
			</Box>
		</Box>
	);
}
