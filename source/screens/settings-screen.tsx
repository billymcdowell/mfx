import {Box, Text} from 'ink';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Confirm} from '@/components/ui/confirm';
import {RadioGroup} from '@/components/ui/radio-group';
import {Select} from '@/components/ui/select';
import {useTheme} from '@/components/ui/theme-provider';
import {useClipboard} from '@/hooks/use-clipboard';
import {useInput} from '@/hooks/use-input';
import {useAuth} from '@/source/context/auth-context';
import {useChromeGate} from '@/source/context/chrome-gate-context';
import {useConfig} from '@/source/context/config-context';
import {getBookmarksFilePath, getConfigFilePath} from '@/source/lib/paths';
import {THEME_OPTIONS} from '@/source/theme-registry';
import type {ThemeKey} from '@/source/types';
import {APP_VERSION} from '@/source/version';

type SettingsRow =
	| 'theme'
	| 'refresh'
	| 'copyConfig'
	| 'copyBookmarks'
	| 'logout';

export function SettingsScreen({mainInputActive}: {mainInputActive: boolean}) {
	const theme = useTheme();
	const {config, setConfig} = useConfig();
	const {logout} = useAuth();
	const {setBlocked} = useChromeGate();
	const {write: copyToClipboard} = useClipboard();
	const [confirmSignOut, setConfirmSignOut] = useState(false);
	const [focusRow, setFocusRow] = useState<SettingsRow>('theme');
	const [copyFlash, setCopyFlash] = useState<'cfg' | 'bm' | undefined>();

	useEffect(() => {
		setBlocked(confirmSignOut);
		return () => {
			setBlocked(false);
		};
	}, [confirmSignOut, setBlocked]);

	const pathConfig = useMemo(() => getConfigFilePath(), []);
	const pathBookmarks = useMemo(() => getBookmarksFilePath(), []);

	const rowsOrdered: SettingsRow[] = useMemo(
		() => ['theme', 'refresh', 'copyConfig', 'copyBookmarks', 'logout'],
		[],
	);

	const themeSelect = useMemo(
		() =>
			THEME_OPTIONS.map(x => ({
				label: x.label,
				value: x.key,
			})),
		[],
	);

	const bumpFocus = useCallback(
		(delta: number) => {
			const i = rowsOrdered.indexOf(focusRow);
			const next = Math.max(0, Math.min(rowsOrdered.length - 1, i + delta));
			setFocusRow(rowsOrdered[next]!);
		},
		[focusRow, rowsOrdered],
	);

	useInput(
		(input, key) => {
			if (!mainInputActive || confirmSignOut) {
				return;
			}

			/** Theme Select + refresh RadioGroup own j/k; avoid double-handling (layout glitches). */
			const vertical =
				input === 'j' ||
				input === 'J' ||
				input === 'k' ||
				input === 'K' ||
				key.downArrow ||
				key.upArrow;
			if (
				vertical &&
				(focusRow === 'theme' || focusRow === 'refresh')
			) {
				return;
			}

			if (input === 'j' || key.downArrow) {
				bumpFocus(1);
				return;
			}

			if (input === 'k' || key.upArrow) {
				bumpFocus(-1);
				return;
			}

			if (input === 'c' || input === 'C') {
				if (focusRow === 'copyConfig') {
					void copyToClipboard(pathConfig);
					setCopyFlash('cfg');
					setTimeout(() => {
						setCopyFlash(undefined);
					}, 1200);
				} else if (focusRow === 'copyBookmarks') {
					void copyToClipboard(pathBookmarks);
					setCopyFlash('bm');
					setTimeout(() => {
						setCopyFlash(undefined);
					}, 1200);
				}
				return;
			}

			if (
				focusRow === 'logout' &&
				(key.return || input === 'x' || input === 'X')
			) {
				setConfirmSignOut(true);
			}
		},
		{isActive: mainInputActive && !confirmSignOut},
	);

	const sessionLine = useMemo(() => {
		if (!config.expiresAt) {
			return 'Session expires —';
		}

		const d = new Date(config.expiresAt);
		return `Session expires  ${d.toLocaleString([], {
			dateStyle: 'medium',
			timeStyle: 'short',
		})}`;
	}, [config.expiresAt]);

	if (confirmSignOut) {
		return (
			<Confirm
				message="Sign out and clear this session?"
				onCancel={() => {
					setConfirmSignOut(false);
				}}
				onConfirm={() => {
					logout();
					setConfirmSignOut(false);
				}}
				variant="danger"
			/>
		);
	}

	const rowBg = (row: SettingsRow) =>
		focusRow === row ? theme.colors.selection : undefined;
	const rowFg = (row: SettingsRow) =>
		focusRow === row ? theme.colors.selectionForeground : undefined;

	return (
		<Box flexDirection="column" flexShrink={0} width="100%">
			<Box flexDirection="column" flexShrink={0} marginBottom={1} width="100%">
				<Text bold color={theme.colors.foreground}>
					Appearance
				</Text>
				<Text color={theme.colors.border}>─────────</Text>
				<Box
					backgroundColor={rowBg('theme')}
					flexDirection="column"
					flexShrink={0}
					marginTop={1}
					width="100%"
				>
					<Text
						backgroundColor={rowBg('theme')}
						color={rowFg('theme')}
					>
						Theme
					</Text>
					<Select<ThemeKey>
						inputActive={mainInputActive && focusRow === 'theme'}
						onChange={k => {
							setConfig({themeKey: k});
						}}
						onFocusLeaveEnd={() => {
							setFocusRow('refresh');
						}}
						options={themeSelect}
						value={config.themeKey}
					/>
				</Box>
			</Box>
			<Box flexDirection="column" flexShrink={0} marginBottom={1} width="100%">
				<Text bold color={theme.colors.foreground}>
					Data
				</Text>
				<Text color={theme.colors.border}>─────</Text>
				<Box
					backgroundColor={rowBg('refresh')}
					flexDirection="column"
					flexShrink={0}
					marginTop={1}
					width="100%"
				>
					<Text
						backgroundColor={rowBg('refresh')}
						color={rowFg('refresh')}
					>
						Price Auto-Refresh Interval
					</Text>
					<RadioGroup<number>
						inputActive={mainInputActive && focusRow === 'refresh'}
						onChange={v => {
							setConfig({priceRefreshSeconds: v});
						}}
						onFocusLeaveEnd={() => {
							setFocusRow('copyConfig');
						}}
						onFocusLeaveStart={() => {
							setFocusRow('theme');
						}}
						options={[
							{label: '15 seconds', value: 15},
							{label: '30 seconds', value: 30},
							{label: '60 seconds', value: 60},
							{label: 'Off (manual only)', value: 0},
						]}
						value={config.priceRefreshSeconds}
					/>
				</Box>
			</Box>
			<Box flexDirection="column" flexShrink={0} marginBottom={1} width="100%">
				<Text bold color={theme.colors.foreground}>
					Account
				</Text>
				<Text color={theme.colors.border}>───────</Text>
				<Box flexDirection="column" flexShrink={0} marginTop={1}>
					<Text>Logged in as {config.email ?? '—'}</Text>
					<Text dimColor>{sessionLine}</Text>
				</Box>
			</Box>
			<Box flexDirection="column" flexShrink={0} marginBottom={1} width="100%">
				<Text bold color={theme.colors.foreground}>
					About
				</Text>
				<Text color={theme.colors.border}>─────</Text>
				<Box
					backgroundColor={rowBg('copyConfig')}
					flexDirection="row"
					flexShrink={0}
					marginTop={1}
				>
					<Text backgroundColor={rowBg('copyConfig')} color={rowFg('copyConfig')}>
						Config file {pathConfig}
					</Text>
					<Text color={theme.colors.info}> [c] Copy path</Text>
					{copyFlash === 'cfg' && (
						<Text color={theme.colors.success}> copied</Text>
					)}
				</Box>
				<Box
					backgroundColor={rowBg('copyBookmarks')}
					flexDirection="row"
					flexShrink={0}
					marginTop={1}
				>
					<Text
						backgroundColor={rowBg('copyBookmarks')}
						color={rowFg('copyBookmarks')}
					>
						Bookmarks file {pathBookmarks}
					</Text>
					<Text color={theme.colors.info}> [c] Copy path</Text>
					{copyFlash === 'bm' && (
						<Text color={theme.colors.success}> copied</Text>
					)}
				</Box>
				<Box flexShrink={0} marginTop={1}>
					<Text>Version v{APP_VERSION}</Text>
				</Box>
			</Box>
			<Box flexShrink={0} marginTop={1}>
				<Box
					backgroundColor={rowBg('logout')}
					borderColor={
						focusRow === 'logout' ? theme.colors.error : theme.colors.border
					}
					borderStyle="single"
					paddingX={1}
					width={32}
				>
					<Text backgroundColor={rowBg('logout')} color={theme.colors.error}>
						Log Out
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
