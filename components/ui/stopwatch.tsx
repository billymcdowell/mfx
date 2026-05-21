import {Box, Text} from 'ink';
import React, {useState, useCallback, useRef} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useInterval} from '@/hooks/use-interval';

export type StopwatchProps = {
	readonly autoStart?: boolean;
	readonly color?: string;
	readonly showLaps?: boolean;
};

const pad = (n: number, length = 2) => String(n).padStart(length, '0');

const formatElapsed = (ms: number): string => {
	const totalSeconds = Math.floor(ms / 1000);
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	const centis = Math.floor((ms % 1000) / 10);

	return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(centis)}`;
};

const getStatus = (running: boolean, elapsed: number): string => {
	if (running) {
		return 'Running';
	}

	if (elapsed === 0) {
		return 'Ready';
	}

	return 'Stopped';
};

const getStatusColor = (
	running: boolean,
	elapsed: number,
	resolvedColor: string,
	theme: ReturnType<typeof useTheme>,
): string => {
	if (running) {
		return resolvedColor;
	}

	if (elapsed === 0) {
		return theme.colors.mutedForeground;
	}

	return theme.colors.warning;
};

export function Stopwatch({
	autoStart = false,
	color,
	showLaps = true,
}: StopwatchProps) {
	const theme = useTheme();
	const resolvedColor = color ?? theme.colors.primary;

	const [running, setRunning] = useState(autoStart);
	const [elapsed, setElapsed] = useState(0);
	const [laps, setLaps] = useState<number[]>([]);
	const lastTickRef = useRef<number>(autoStart ? Date.now() : 0);
	const elapsedRef = useRef(0);

	const tick = useCallback(() => {
		const now = Date.now();
		const delta = now - lastTickRef.current;
		lastTickRef.current = now;
		elapsedRef.current += delta;
		setElapsed(elapsedRef.current);
	}, []);

	useInterval(tick, running ? 50 : undefined);

	useInput(input => {
		if (input === '') {
			if (!running) {
				lastTickRef.current = Date.now();
			}

			setRunning(r => !r);
		} else if (input === 'l' && running) {
			setLaps(previous => [...previous, elapsedRef.current]);
		} else if (input === 'r') {
			setRunning(false);
			setElapsed(0);
			elapsedRef.current = 0;
			setLaps([]);
		}
	});

	const status = getStatus(running, elapsed);
	const statusColor = getStatusColor(running, elapsed, resolvedColor, theme);

	return (
		<Box flexDirection="column" gap={0}>
			<Box gap={2} alignItems="center">
				<Text bold color={resolvedColor}>
					{formatElapsed(elapsed)}
				</Text>
				<Text color={statusColor}>[{status}]</Text>
			</Box>
			<Text dimColor color={theme.colors.mutedForeground}>
				space start/stop · l lap · r reset
			</Text>
			{showLaps && laps.length > 0 && (
				<Box flexDirection="column" marginTop={1}>
					<Text bold color={theme.colors.mutedForeground}>
						Laps:
					</Text>
					{laps.map((lapTime, i) => {
						const previousLap = laps[i - 1] ?? 0;
						const split = i === 0 ? lapTime : lapTime - previousLap;
						return (
							<Box key={i} gap={2}>
								<Text color={theme.colors.mutedForeground}>
									#{String(i + 1).padStart(2, '0')}
								</Text>
								<Text color={resolvedColor}>{formatElapsed(lapTime)}</Text>
								<Text dimColor color={theme.colors.mutedForeground}>
									+{formatElapsed(split)}
								</Text>
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
}
