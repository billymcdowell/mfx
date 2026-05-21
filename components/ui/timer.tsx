import {Box, Text} from 'ink';
import React, {useState, useCallback} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useInterval} from '@/hooks/use-interval';

export type TimerProps = {
	readonly duration: number;
	readonly onComplete?: () => void;
	readonly autoStart?: boolean;
	readonly format?: 'hms' | 'ms' | 's';
	readonly color?: string;
	readonly label?: string;
};

const padNumber = (n: number) => String(n).padStart(2, '0');

const formatTime = (seconds: number, format: 'hms' | 'ms' | 's'): string => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;

	if (format === 's') {
		return `${seconds}s`;
	}

	if (format === 'ms') {
		return `${padNumber(m)}:${padNumber(s)}`;
	}

	return `${padNumber(h)}:${padNumber(m)}:${padNumber(s)}`;
};

export function Timer({
	duration,
	onComplete,
	autoStart = false,
	format = 'hms',
	color,
	label,
}: TimerProps) {
	const theme = useTheme();
	const resolvedColor = color ?? theme.colors.primary;

	const [remaining, setRemaining] = useState(duration);
	const [running, setRunning] = useState(autoStart);
	const [completed, setCompleted] = useState(false);

	const tick = useCallback(() => {
		setRemaining(previous => {
			if (previous <= 1) {
				setRunning(false);
				setCompleted(true);
				onComplete?.();
				return 0;
			}

			return previous - 1;
		});
	}, [onComplete]);

	useInterval(tick, running ? 1000 : undefined);

	useInput(input => {
		if (input === '') {
			if (!completed) {
				setRunning(r => !r);
			}
		} else if (input === 'r') {
			setRemaining(duration);
			setRunning(false);
			setCompleted(false);
		}
	});

	const runningStatus = running ? 'Running' : 'Paused';
	const status = completed ? 'Done!' : runningStatus;
	const runningStatusColor = running
		? resolvedColor
		: theme.colors.mutedForeground;
	const statusColor = completed ? theme.colors.success : runningStatusColor;

	return (
		<Box flexDirection="column" gap={0}>
			{label && <Text color={theme.colors.mutedForeground}>{label}</Text>}
			<Box gap={2} alignItems="center">
				<Text bold color={resolvedColor}>
					{formatTime(remaining, format)}
				</Text>
				<Text color={statusColor}>[{status}]</Text>
			</Box>
			<Text dimColor color={theme.colors.mutedForeground}>
				{completed ? 'r to reset' : 'space pause/resume · r reset'}
			</Text>
		</Box>
	);
}
