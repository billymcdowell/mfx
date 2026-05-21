import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useFocus} from '@/hooks/use-focus';
import {useInput} from '@/hooks/use-input';

export type CheckboxProps = {
	readonly checked?: boolean;
	readonly onChange?: (checked: boolean) => void;
	readonly label?: string;
	readonly indeterminate?: boolean;
	readonly disabled?: boolean;
	readonly id?: string;
	readonly checkedIcon?: string;
	readonly uncheckedIcon?: string;
	readonly indeterminateIcon?: string;
};

export function Checkbox({
	checked: controlledChecked,
	onChange,
	label,
	indeterminate = false,
	disabled = false,
	id,
	checkedIcon = '■',
	uncheckedIcon = '□',
	indeterminateIcon = '▪',
}: CheckboxProps) {
	const [internalChecked, setInternalChecked] = useState(false);
	const theme = useTheme();
	const {isFocused} = useFocus({id});

	const checked = controlledChecked ?? internalChecked;

	useInput(input => {
		if (!isFocused || disabled) {
			return;
		}

		if (input === '') {
			const next = !checked;
			if (onChange) {
				onChange(next);
			} else {
				setInternalChecked(next);
			}
		}
	});

	const checkedIcon_ = checked ? checkedIcon : uncheckedIcon;
	const icon = indeterminate ? indeterminateIcon : checkedIcon_;
	const activeColor =
		checked || indeterminate ? theme.colors.primary : theme.colors.border;
	const iconColor = disabled ? theme.colors.mutedForeground : activeColor;

	return (
		<Box gap={1}>
			<Text
				color={isFocused ? theme.colors.focusRing : iconColor}
				bold={isFocused}
			>
				{icon}
			</Text>
			{label && (
				<Text
					color={
						disabled ? theme.colors.mutedForeground : theme.colors.foreground
					}
					dimColor={disabled}
				>
					{label}
				</Text>
			)}
		</Box>
	);
}
