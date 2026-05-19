import {Box, Text} from 'ink';
import React, {useEffect, useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export interface SelectOption<T = string> {
	value: T;
	label: string;
	hint?: string;
	disabled?: boolean;
}

export interface SelectProps<T = string> {
	options: SelectOption<T>[];
	value?: T;
	onChange?: (value: T) => void;
	onSubmit?: (value: T) => void;
	label?: string;
	cursor?: string;
	cursorColor?: string;
	inputActive?: boolean;
	/** Fired when ↑ is pressed while the first option is focused. */
	onFocusLeaveStart?: () => void;
	/** Fired when ↓ is pressed while the last option is focused. */
	onFocusLeaveEnd?: () => void;
}

export const Select = <T = string,>({
	options,
	value: controlledValue,
	onChange,
	onSubmit,
	label,
	cursor = '›',
	cursorColor,
	inputActive = true,
	onFocusLeaveStart,
	onFocusLeaveEnd,
}: SelectProps<T>) => {
	const theme = useTheme();
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (controlledValue === undefined) {
			return;
		}

		const idx = options.findIndex(o => o.value === controlledValue);
		if (idx >= 0) {
			setActiveIndex(idx);
		}
	}, [controlledValue, options]);

	useInput(
		(input, key) => {
			const up = key.upArrow || input === 'k' || input === 'K';
			const down = key.downArrow || input === 'j' || input === 'J';
			if (up) {
				setActiveIndex(i => {
					let next = i - 1;
					while (next >= 0 && options[next]?.disabled) {
						next -= 1;
					}
					if (next < 0) {
						onFocusLeaveStart?.();
						return i;
					}
					return next;
				});
			} else if (down) {
				setActiveIndex(i => {
					let next = i + 1;
					while (next < options.length && options[next]?.disabled) {
						next += 1;
					}
					if (next >= options.length) {
						onFocusLeaveEnd?.();
						return i;
					}
					return next;
				});
			} else if (key.return) {
				const opt = options[activeIndex];
				if (opt && !opt.disabled) {
					onChange?.(opt.value);
					onSubmit?.(opt.value);
				}
			}
		},
		{isActive: inputActive},
	);

	return (
		<Box flexDirection="column" flexShrink={0} width="100%">
			{label && (
				<Box flexShrink={0}>
					<Text bold>{label}</Text>
				</Box>
			)}
			{options.map((opt, idx) => {
				const isActive = idx === activeIndex;
				const isSelected =
					controlledValue !== undefined && opt.value === controlledValue;

				let optColor: string;
				if (opt.disabled) {
					optColor = theme.colors.mutedForeground;
				} else if (isActive) {
					optColor = theme.colors.selectionForeground;
				} else {
					optColor = theme.colors.foreground;
				}

				const rowBg = isActive ? theme.colors.selection : undefined;
				const prefix = isActive ? `${cursor} ` : '  ';

				return (
					<Box key={idx} flexDirection="row" flexShrink={0}>
						<Text
							backgroundColor={rowBg}
							bold={isActive || isSelected}
							color={
								isActive
									? cursorColor ?? theme.colors.selectionForeground
									: optColor
							}
							dimColor={opt.disabled}
						>
							{`${prefix}${opt.label}`}
						</Text>
						{opt.hint ? (
							<Text
								backgroundColor={rowBg}
								color={theme.colors.mutedForeground}
								dimColor
							>
								{`  ${opt.hint}`}
							</Text>
						) : null}
					</Box>
				);
			})}
		</Box>
	);
};
