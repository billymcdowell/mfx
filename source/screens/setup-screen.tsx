import {Box, Text, useApp} from 'ink';
import React, {useMemo, useState} from 'react';

import {useTheme, type ColorTokens} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useConfig} from '@/source/context/config-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {getConfigFilePath} from '@/source/lib/paths';
import {THEME_OPTIONS} from '@/source/theme-registry';
import type {ThemeKey} from '@/source/types';

function PreviewQuotes({colors}: {readonly colors: ColorTokens}) {
	return (
		<Box
			borderColor={colors.border}
			borderStyle="single"
			flexDirection="column"
			paddingX={1}
		>
			<Text>
				<Text bold color={colors.foreground}>
					XAUUSD
				</Text>
				<Text color={colors.mutedForeground}> Gold / USD </Text>
				<Text color={colors.warning}>2,341.80</Text>
				<Text color={colors.success}> ▲ +0.42%</Text>
				<Text color={colors.mutedForeground}> bid 2341.50 ask 2342.10 </Text>
				<Text color={colors.mutedForeground}>~~~~╱</Text>
			</Text>
			<Text>
				<Text bold color={colors.foreground}>
					EURUSD
				</Text>
				<Text color={colors.mutedForeground}> Euro / USD </Text>
				<Text color={colors.foreground}>1.0823</Text>
				<Text color={colors.error}> ▼ -0.11%</Text>
				<Text color={colors.mutedForeground}> bid 1.0821 ask 1.0825 </Text>
				<Text color={colors.mutedForeground}>╲~~~╱</Text>
			</Text>
		</Box>
	);
}

export function SetupScreen() {
	const theme = useTheme();
	const {rows, columns} = useTerminalViewport();
	const {exit} = useApp();
	const {setConfig, config} = useConfig();
	const [step, setStep] = useState(0);
	const [focusIndex, setFocusIndex] = useState(() =>
		Math.max(
			0,
			THEME_OPTIONS.findIndex(o => o.key === config.themeKey),
		),
	);

	const cfgPath = useMemo(() => getConfigFilePath(), []);
	const draft = THEME_OPTIONS[focusIndex] ?? THEME_OPTIONS[0]!;
	const draftColors = draft.theme.colors;

	useInput((input, key) => {
		if (step === 0) {
			if (key.escape) {
				exit();
				return;
			}

			if (input === 'j' || key.downArrow) {
				setFocusIndex(i => Math.min(THEME_OPTIONS.length - 1, i + 1));
			} else if (input === 'k' || key.upArrow) {
				setFocusIndex(i => Math.max(0, i - 1));
			} else if (key.return) {
				setStep(1);
			}
		} else if (key.escape) {
			setStep(0);
		} else if (key.return) {
			const picked = THEME_OPTIONS[focusIndex]?.key as ThemeKey | undefined;
			if (picked) {
				setConfig({setupComplete: true, themeKey: picked});
			}
		}
	});

	return (
		<Box
			borderColor={theme.colors.border}
			borderStyle="double"
			flexDirection="column"
			height={rows}
			paddingX={2}
			paddingY={1}
			width={columns}
		>
			{step === 0 ? (
				<Box flexDirection="column" gap={1}>
					<Text bold color={theme.colors.foreground}>
						Welcome to MFX! Let&apos;s get you set up.
					</Text>
					<Text color={theme.colors.border}>{'─'.repeat(40)}</Text>
					<Text color={theme.colors.mutedForeground}>
						Step 1 of 2 — Choose your theme
					</Text>
					<Text color={theme.colors.mutedForeground}>
						The theme is saved to {cfgPath} and can be changed anytime in
						Settings.
					</Text>
					<Box
						borderColor={theme.colors.border}
						borderStyle="single"
						flexDirection="column"
						paddingX={1}
						paddingY={1}
					>
						{THEME_OPTIONS.map((opt, idx) => {
							const active = idx === focusIndex;
							const swatch = opt.swatchColors ?? [
								opt.theme.colors.primary,
								opt.theme.colors.info,
								opt.theme.colors.success,
								opt.theme.colors.error,
							];
							return (
								<Box key={opt.key} flexDirection="row" paddingY={0}>
									<Text
										backgroundColor={active ? theme.colors.success : undefined}
										color={
											active
												? theme.colors.successForeground
												: theme.colors.foreground
										}
									>
										{active ? '❯ ' : '  '}
									</Text>
									<Text
										backgroundColor={active ? theme.colors.success : undefined}
										color={
											active
												? theme.colors.successForeground
												: theme.colors.foreground
										}
									>
										{`${opt.label}  `}
									</Text>
									<Box flexDirection="row" gap={0}>
										{swatch.slice(0, 4).map((c, si) => (
											<Text key={`${opt.key}-s${si}`} backgroundColor={c}>
												████
											</Text>
										))}
									</Box>
									<Text
										backgroundColor={active ? theme.colors.success : undefined}
										color={theme.colors.mutedForeground}
									>
										{'  '}
										{opt.description ?? ''}
									</Text>
								</Box>
							);
						})}
					</Box>
					<Text bold color={theme.colors.foreground}>
						Preview
					</Text>
					<PreviewQuotes colors={draftColors} />
					<Box marginTop={1}>
						<Text dimColor color={theme.colors.mutedForeground}>
							↑↓ to select · Enter to confirm · Esc to quit
						</Text>
					</Box>
				</Box>
			) : (
				<Box flexDirection="column" gap={1}>
					<Text bold color={theme.colors.foreground}>
						Step 2 of 2 — Confirm
					</Text>
					<Text>
						You chose{' '}
						<Text bold color={theme.colors.warning}>
							{draft.label}
						</Text>
						.
					</Text>
					<Text dimColor>
						Press Enter to finish. Esc returns to theme list.
					</Text>
				</Box>
			)}
		</Box>
	);
}
