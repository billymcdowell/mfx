import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export type CheckboxGroupOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

export type CheckboxGroupProps = {
	readonly label?: string;
	readonly options: CheckboxGroupOption[];
	readonly value?: string[];
	readonly onChange?: (values: string[]) => void;
	readonly min?: number;
	readonly max?: number;
};

export function CheckboxGroup({
	label,
	options,
	value: controlledValue,
	onChange,
	min,
	max,
}: CheckboxGroupProps) {
	const theme = useTheme();
	const [activeIndex, setActiveIndex] = useState(0);
	const [internalSelected, setInternalSelected] = useState<string[]>([]);
	const [error, setError] = useState<string | undefined>();

	const selected = controlledValue ?? internalSelected;

	const validateAndUpdate = (next: string[]) => {
		if (min !== undefined && next.length < min) {
			setError(`Select at least ${min} option${min === 1 ? '' : 's'}.`);
		} else if (max !== undefined && next.length > max) {
			setError(`Select at most ${max} option${max === 1 ? '' : 's'}.`);
			return;
		} else {
			setError(undefined);
		}

		if (controlledValue === undefined) {
			setInternalSelected(next);
		}

		onChange?.(next);
	};

	useInput((input, key) => {
		if (key.upArrow) {
			setActiveIndex(i => {
				let next = i - 1;
				while (next >= 0 && options[next]?.disabled) {
					next -= 1;
				}

				return next < 0 ? i : next;
			});
		} else if (key.downArrow) {
			setActiveIndex(i => {
				let next = i + 1;
				while (next < options.length && options[next]?.disabled) {
					next += 1;
				}

				return next >= options.length ? i : next;
			});
		} else if (input === '') {
			const opt = options[activeIndex];
			if (!opt || opt.disabled) {
				return;
			}

			const isSelected = selected.includes(opt.value);
			const next = isSelected
				? selected.filter(v => v !== opt.value)
				: [...selected, opt.value];
			validateAndUpdate(next);
		}
	});

	return (
		<Box flexDirection="column" width="100%">
			{label && (
				<Box flexShrink={0}>
					<Text bold color={theme.colors.foreground}>
						{label}
					</Text>
				</Box>
			)}
			{options.map((opt, idx) => {
				const isActive = idx === activeIndex;
				const isSelected = selected.includes(opt.value);
				const marker = isSelected ? '[x]' : '[ ]';

				let optLabelColor: string;
				if (opt.disabled) {
					optLabelColor = theme.colors.mutedForeground;
				} else if (isActive) {
					optLabelColor = theme.colors.primary;
				} else {
					optLabelColor = theme.colors.foreground;
				}

				const prefix = isActive ? '› ' : '  ';

				return (
					<Box key={idx} flexShrink={0}>
						<Text>
							<Text color={isActive ? theme.colors.primary : undefined}>
								{`${prefix}${marker} `}
							</Text>
							<Text
								color={optLabelColor}
								bold={isActive}
								dimColor={opt.disabled}
							>
								{opt.label}
							</Text>
						</Text>
					</Box>
				);
			})}
			{error && <Text color={theme.colors.error}>{error}</Text>}
		</Box>
	);
}
