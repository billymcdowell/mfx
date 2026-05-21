import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useFocus} from '@/hooks/use-focus';
import {useInput} from '@/hooks/use-input';

export type PasswordInputProps = {
	readonly value?: string;
	readonly onChange?: (value: string) => void;
	readonly onSubmit?: (value: string) => void;
	readonly placeholder?: string;
	readonly mask?: string;
	readonly showToggle?: boolean;
	readonly label?: string;
	readonly id?: string;
	readonly borderStyle?:
		| 'single'
		| 'double'
		| 'round'
		| 'bold'
		| 'singleDouble'
		| 'doubleSingle'
		| 'classic';
	readonly paddingX?: number;
	readonly width?: number;
	readonly cursor?: string;
};

export function PasswordInput({
	value: controlledValue,
	onChange,
	onSubmit,
	placeholder = '',
	mask = '●',
	showToggle = false,
	label,
	id,
	borderStyle = 'round',
	paddingX = 1,
	width,
	cursor = '█',
}: PasswordInputProps) {
	const [internalValue, setInternalValue] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const theme = useTheme();
	const {isFocused} = useFocus({id});

	const value = controlledValue ?? internalValue;

	const setValue = (newValue: string) => {
		if (onChange) {
			onChange(newValue);
		} else {
			setInternalValue(newValue);
		}
	};

	useInput((input, key) => {
		if (!isFocused) {
			return;
		}

		if (showToggle && input === '\u0008') {
			setIsVisible(v => !v);
			return;
		}

		if (key.return) {
			onSubmit?.(value);
			return;
		}

		if (key.backspace || key.delete) {
			setValue(value.slice(0, -1));
			return;
		}

		if (key.escape || key.upArrow || key.downArrow || key.tab) {
			return;
		}

		if (input && input.length > 0) {
			setValue(value + input);
		}
	});

	const displayValue = isVisible ? value : mask.repeat(value.length);
	const borderColor = isFocused ? theme.colors.focusRing : theme.colors.border;

	return (
		<Box flexDirection="column">
			{label && <Text bold>{label}</Text>}
			<Box flexDirection="row" alignItems="center" gap={1}>
				<Box
					borderStyle={borderStyle}
					borderColor={borderColor}
					paddingX={paddingX}
					width={width}
				>
					<Text
						color={
							value ? theme.colors.foreground : theme.colors.mutedForeground
						}
					>
						{displayValue || placeholder}
					</Text>
					{isFocused && <Text color={theme.colors.focusRing}>{cursor}</Text>}
				</Box>
				{showToggle && isFocused && (
					<Text color={theme.colors.mutedForeground}>
						{isVisible ? 'Ctrl+H hide' : 'Ctrl+H show'}
					</Text>
				)}
			</Box>
		</Box>
	);
}
