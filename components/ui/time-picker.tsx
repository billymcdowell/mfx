import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useFocus} from '@/hooks/use-focus';
import {useInput} from '@/hooks/use-input';

export type TimePickerProps = {
	readonly value?: {hours: number; minutes: number};
	readonly onChange?: (time: {hours: number; minutes: number}) => void;
	readonly onSubmit?: (time: {hours: number; minutes: number}) => void;
	readonly label?: string;
	readonly format?: 12 | 24;
	readonly autoFocus?: boolean;
	readonly id?: string;
};

export function TimePicker({
	value: controlledValue,
	onChange,
	onSubmit,
	label,
	format = 24,
	autoFocus = false,
	id,
}: TimePickerProps) {
	const theme = useTheme();
	const {isFocused} = useFocus({autoFocus, id});

	const now = new Date();
	const initialHours = controlledValue?.hours ?? now.getHours();
	const initialMinutes = controlledValue?.minutes ?? now.getMinutes();

	const [hours, setHours] = useState(initialHours);
	const [minutes, setMinutes] = useState(initialMinutes);
	const [ampm, setAmPm] = useState<'AM' | 'PM'>(
		initialHours < 12 ? 'AM' : 'PM',
	);
	const [field, setField] = useState<'hours' | 'minutes' | 'ampm'>('hours');

	const maxHours = format === 12 ? 12 : 23;
	const minHours = format === 12 ? 1 : 0;

	const notify = (h: number, m: number, ap: 'AM' | 'PM') => {
		let actualHours = h;
		if (format === 12) {
			if (ap === 'AM' && h === 12) {
				actualHours = 0;
			} else if (ap === 'PM' && h !== 12) {
				actualHours = h + 12;
			}
		}

		onChange?.({hours: actualHours, minutes: m});
	};

	useInput((_input, key) => {
		if (!isFocused) {
			return;
		}

		if (key.tab) {
			if (format === 12) {
				setField(f => {
					if (f === 'hours') {
						return 'minutes';
					}

					if (f === 'minutes') {
						return 'ampm';
					}

					return 'hours';
				});
			} else {
				setField(f => (f === 'hours' ? 'minutes' : 'hours'));
			}

			return;
		}

		if (key.return) {
			let actualHours = hours;
			if (format === 12) {
				if (ampm === 'AM' && hours === 12) {
					actualHours = 0;
				} else if (ampm === 'PM' && hours !== 12) {
					actualHours = hours + 12;
				}
			}

			onSubmit?.({hours: actualHours, minutes});
			return;
		}

		if (key.upArrow) {
			switch (field) {
				case 'hours': {
					const newH = hours >= maxHours ? minHours : hours + 1;
					setHours(newH);
					notify(newH, minutes, ampm);

					break;
				}

				case 'minutes': {
					const newM = minutes >= 59 ? 0 : minutes + 1;
					setMinutes(newM);
					notify(hours, newM, ampm);

					break;
				}

				case 'ampm': {
					const newAp: 'AM' | 'PM' = ampm === 'AM' ? 'PM' : 'AM';
					setAmPm(newAp);
					notify(hours, minutes, newAp);

					break;
				}
				// No default
			}
		} else if (key.downArrow) {
			switch (field) {
				case 'hours': {
					const newH = hours <= minHours ? maxHours : hours - 1;
					setHours(newH);
					notify(newH, minutes, ampm);

					break;
				}

				case 'minutes': {
					const newM = minutes <= 0 ? 59 : minutes - 1;
					setMinutes(newM);
					notify(hours, newM, ampm);

					break;
				}

				case 'ampm': {
					const newAp: 'AM' | 'PM' = ampm === 'AM' ? 'PM' : 'AM';
					setAmPm(newAp);
					notify(hours, minutes, newAp);

					break;
				}
				// No default
			}
		}
	});

	const fieldColor = (f: typeof field): string =>
		field === f && isFocused ? theme.colors.primary : theme.colors.foreground;

	const fieldBg = (f: typeof field): string | undefined =>
		field === f && isFocused ? theme.colors.selection : undefined;

	let displayHours: number;
	if (format !== 12) {
		displayHours = hours;
	} else if (hours === 0) {
		displayHours = 12;
	} else if (hours > 12) {
		displayHours = hours - 12;
	} else {
		displayHours = hours;
	}

	return (
		<Box flexDirection="column">
			{label && <Text bold>{label}</Text>}
			<Box
				gap={0}
				borderStyle="round"
				borderColor={isFocused ? theme.colors.focusRing : theme.colors.border}
				paddingX={1}
			>
				<Box flexDirection="column" alignItems="center">
					<Text color={fieldColor('hours')}>▲</Text>
					<Text
						color={fieldColor('hours')}
						backgroundColor={fieldBg('hours')}
						bold={field === 'hours'}
					>
						{String(displayHours).padStart(2, '0')}
					</Text>
					<Text color={fieldColor('hours')}>▼</Text>
				</Box>

				<Box flexDirection="column" alignItems="center" justifyContent="center">
					<Text color={theme.colors.border}> </Text>
					<Text bold color={theme.colors.foreground}>
						:
					</Text>
					<Text color={theme.colors.border}> </Text>
				</Box>

				<Box flexDirection="column" alignItems="center">
					<Text color={fieldColor('minutes')}>▲</Text>
					<Text
						color={fieldColor('minutes')}
						backgroundColor={fieldBg('minutes')}
						bold={field === 'minutes'}
					>
						{String(minutes).padStart(2, '0')}
					</Text>
					<Text color={fieldColor('minutes')}>▼</Text>
				</Box>

				{format === 12 && (
					<>
						<Box
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
						>
							<Text color={theme.colors.border}> </Text>
							<Text color={theme.colors.border}> </Text>
							<Text color={theme.colors.border}> </Text>
						</Box>
						<Box flexDirection="column" alignItems="center">
							<Text color={fieldColor('ampm')}>▲</Text>
							<Text
								color={fieldColor('ampm')}
								backgroundColor={fieldBg('ampm')}
								bold={field === 'ampm'}
							>
								{ampm}
							</Text>
							<Text color={fieldColor('ampm')}>▼</Text>
						</Box>
					</>
				)}
			</Box>
			{isFocused && (
				<Text dimColor color={theme.colors.mutedForeground}>
					↑↓: change · Tab: next field · Enter: confirm
				</Text>
			)}
		</Box>
	);
}
