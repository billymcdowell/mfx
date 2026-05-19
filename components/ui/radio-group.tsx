import {Box, Text} from 'ink';
import React, {useEffect, useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export interface RadioOption<T = string> {
	value: T;
	label: string;
	hint?: string;
	disabled?: boolean;
}

export interface RadioGroupProps<T = string> {
	options: RadioOption<T>[];
	value?: T;
	onChange?: (value: T) => void;
	name?: string;
	cursor?: string;
	inputActive?: boolean;
	/** Fired when ↑ is pressed while the first option is focused. */
	onFocusLeaveStart?: () => void;
	/** Fired when ↓ is pressed while the last option is focused. */
	onFocusLeaveEnd?: () => void;
}

const getOptionColor = (
	disabled: boolean | undefined,
	isHighlighted: boolean,
	theme: ReturnType<typeof useTheme>,
): string => {
	if (disabled) {
		return theme.colors.mutedForeground;
	}
	if (isHighlighted) {
		return theme.colors.primary;
	}
	return theme.colors.foreground;
};

export const RadioGroup = <T = string,>({
	options,
	value: controlledValue,
	onChange,
	name: _name,
	cursor = '›',
	inputActive = true,
	onFocusLeaveStart,
	onFocusLeaveEnd,
}: RadioGroupProps<T>) => {
	const theme = useTheme();
	const [activeIndex, setActiveIndex] = useState(() => {
		if (controlledValue === undefined) {
			return 0;
		}
		const idx = options.findIndex(o => o.value === controlledValue);
		return Math.max(idx, 0);
	});
	const [internalValue, setInternalValue] = useState<T | undefined>(
		controlledValue,
	);

	const selected = controlledValue ?? internalValue;

	useEffect(() => {
		if (controlledValue === undefined) {
			return;
		}

		const idx = options.findIndex(o => o.value === controlledValue);
		if (idx >= 0) {
			setActiveIndex(idx);
		}
	}, [controlledValue, options]);

	const select = (idx: number) => {
		const opt = options[idx];
		if (!opt || opt.disabled) {
			return;
		}
		if (controlledValue === undefined) {
			setInternalValue(opt.value);
		}
		onChange?.(opt.value);
	};

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
				select(activeIndex);
			}
		},
		{isActive: inputActive},
	);

	return (
		<Box flexDirection="column" flexShrink={0} width="100%">
			{options.map((opt, idx) => {
				const isActive = idx === activeIndex;
				const isSelected = selected !== undefined && opt.value === selected;
				/** ASCII markers only — wide glyphs (○, ◉) break column layout in many terminals. */
				const marker = isSelected ? '[x]' : '[ ]';
				const prefix = isActive ? `${cursor} ` : '  ';
				const rowBg = isActive ? theme.colors.selection : undefined;
				const rowFg = isActive ? theme.colors.selectionForeground : undefined;
				const labelColor = isActive
					? rowFg
					: getOptionColor(opt.disabled, isSelected, theme);

				return (
					<Box key={idx} flexDirection="row" flexShrink={0}>
						<Text
							backgroundColor={rowBg}
							bold={isActive || isSelected}
							color={labelColor}
							dimColor={opt.disabled && !isActive}
						>
							{`${prefix}${marker} ${opt.label}`}
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
