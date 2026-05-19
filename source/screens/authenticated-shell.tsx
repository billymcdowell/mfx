import {Box, Text, useApp} from 'ink';
import React, {useMemo, useState} from 'react';
import {KeyboardShortcuts} from '@/components/ui/keyboard-shortcuts';
import {Sidebar, type SidebarItem} from '@/components/ui/sidebar';
import {Spinner} from '@/components/ui/spinner';
import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {
	ShellFocusProvider,
	useShellFocus,
} from '@/source/context/shell-focus-context';
import {useChromeGate} from '@/source/context/chrome-gate-context';
import {useConfig} from '@/source/context/config-context';
import {useNews} from '@/source/context/news-context';
import {usePrices} from '@/source/context/prices-context';
import {useRouter} from '@/source/context/router-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {themeLabelForKey} from '@/source/theme-registry';
import type {Screen} from '@/source/types';
import {ArticleDetailScreen} from '@/source/screens/article-detail-screen';
import {BookmarksScreen} from '@/source/screens/bookmarks-screen';
import {NewsScreen} from '@/source/screens/news-screen';
import {PricesScreen} from '@/source/screens/prices-screen';
import {PriceDetailScreen} from '@/source/screens/price-detail-screen';
import {SettingsScreen} from '@/source/screens/settings-screen';

const SHORTCUT_ROWS = [
	{category: 'Navigation', description: 'Move down', key: 'j / ↓'},
	{category: 'Navigation', description: 'Move up', key: 'k / ↑'},
	{category: 'Navigation', description: 'Open / select', key: 'Enter / →'},
	{
		category: 'Navigation',
		description: 'Focus drawer (root screens)',
		key: '←',
	},
	{
		category: 'Navigation',
		description: 'Go back / close (overlays)',
		key: 'Esc / ←',
	},
	{
		category: 'Prices',
		description: 'Refresh prices now',
		key: 'r',
	},
	{
		category: 'Prices',
		description: 'Toggle filter (All / Commodities / Forex)',
		key: 'f',
	},
	{
		category: 'Prices',
		description: 'Open price detail',
		key: 'Enter',
	},
	{
		category: 'Prices',
		description: 'Search symbol or name',
		key: '/',
	},
	{
		category: 'Prices',
		description: 'Clear search',
		key: 'Esc',
	},
	{
		category: 'Prices',
		description: 'Toggle watchlist symbol',
		key: 's',
	},
	{
		category: 'Prices',
		description: 'Toggle watchlist-only view',
		key: 'v',
	},
	{
		category: 'News',
		description: 'Open search',
		key: '/',
	},
	{category: 'News', description: 'Clear search', key: 'Esc'},
	{
		category: 'News',
		description: 'Bookmark highlighted article',
		key: 'b',
	},
	{
		category: 'News',
		description: 'Open article in browser',
		key: 'o',
	},
	{
		category: 'Bookmarks',
		description: 'Delete bookmark (with confirm)',
		key: 'd',
	},
	{category: 'Global', description: 'Toggle this help overlay', key: '?'},
	{category: 'Global', description: 'Quit the app', key: 'q'},
];

const SIDEBAR_ITEMS: SidebarItem[] = [
	{key: 'prices', label: 'Prices'},
	{key: 'news', label: 'News'},
	{key: 'bookmarks', label: 'Bookmarks'},
	{key: 'settings', label: 'Settings'},
];

function sidebarActiveKey(screen: Screen): string {
	switch (screen) {
		case 'articleDetail': {
			return 'news';
		}
		case 'bookmarks': {
			return 'bookmarks';
		}
		case 'news': {
			return 'news';
		}
		case 'priceDetail': {
			return 'prices';
		}
		case 'settings': {
			return 'settings';
		}
		default: {
			return 'prices';
		}
	}
}

const FOOTER_HINTS: Partial<Record<Screen, string>> = {
	articleDetail:
		'j/k or ↑↓ to scroll · b to bookmark · o to open in browser · Esc to go back',
	bookmarks:
		'j/k to navigate · Enter to open article · d to delete · ← drawer · Esc to cancel dialog',
	news: 'j/k to navigate · Enter to open article · b to bookmark · / to search · ← drawer',
	priceDetail: 'Esc / ← back · r refresh · s toggle watchlist',
	prices:
		'j/k rows · Enter detail · f or 1–3 filter · v watchlist view · s star row · / search · r refresh · ← drawer',
	settings:
		'j/k move Theme & Refresh · past last/first item jumps sections · Enter selects · ← drawer',
};

function resolvePaneHeaderTitle(
	screen: Screen,
	params: {symbol?: string},
	instruments: {symbol: string; name: string}[],
): string {
	switch (screen) {
		case 'articleDetail': {
			return '← Back to News';
		}
		case 'bookmarks': {
			return 'Bookmarks';
		}
		case 'news': {
			return 'News';
		}
		case 'priceDetail': {
			const sym = params.symbol ?? '';
			const inst = instruments.find(i => i.symbol === sym);
			return inst ? `← Back   ${sym} — ${inst.name}` : `← Back   ${sym}`;
		}
		case 'settings': {
			return 'Settings';
		}
		default: {
			return 'Prices';
		}
	}
}

function paneHeaderActions(screen: Screen): string {
	switch (screen) {
		case 'articleDetail': {
			return '[b] Bookmark  [o] Open URL';
		}
		case 'news': {
			return '[/] Search';
		}
		case 'priceDetail': {
			return '[r] Refresh  [s] Watchlist';
		}
		case 'prices': {
			return '[r] Refresh  [/] Search';
		}
		default: {
			return '';
		}
	}
}

function ShellInterior() {
	const theme = useTheme();
	const {rows} = useTerminalViewport();
	const {exit} = useApp();
	const {config} = useConfig();
	const {blocked} = useChromeGate();
	const {current, goBack, replaceRoot} = useRouter();
	const {toggleShellZone, mainInputActive, shellZone, setShellZone} =
		useShellFocus();
	const [showHelp, setShowHelp] = useState(false);
	const {
		loading: pricesLoading,
		lastUpdated: pricesAt,
		instruments,
	} = usePrices();
	const {loading: newsLoading, lastUpdated: newsAt} = useNews();

	useInput(
		(input, key) => {
			if (blocked) {
				return;
			}

			if (showHelp) {
				if (key.escape || input === '?') {
					setShowHelp(false);
				}

				return;
			}

			if (input === '?') {
				setShowHelp(true);
				return;
			}

			if (key.tab && !key.shift) {
				toggleShellZone();
				return;
			}

			const isOverlay =
				current.screen === 'articleDetail' || current.screen === 'priceDetail';

			if (key.leftArrow && isOverlay) {
				goBack();
				return;
			}

			if (key.leftArrow && !isOverlay && shellZone === 'main' && !showHelp) {
				setShellZone('sidebar');
				return;
			}

			if (input === 'q' || key.escape) {
				if (isOverlay) {
					goBack();
				} else {
					exit();
				}
			}
		},
		{isActive: !blocked},
	);

	const compositeLastUpdated =
		pricesAt.getTime() > newsAt.getTime() ? pricesAt : newsAt;

	const main = useMemo(() => {
		if (showHelp) {
			return (
				<Box flexDirection="column" flexGrow={1} paddingLeft={1}>
					<Text
						backgroundColor={theme.colors.panel}
						color={theme.colors.mutedForeground}
					>
						{'▒'.repeat(Math.min(120, Math.max(20, 40)))}
					</Text>
					<Box
						alignItems="center"
						flexDirection="column"
						flexGrow={1}
						justifyContent="center"
						paddingY={1}
					>
						<Box
							borderColor={theme.colors.border}
							borderStyle="double"
							flexDirection="column"
							paddingX={2}
							paddingY={1}
						>
							<Box
								flexDirection="row"
								justifyContent="space-between"
								marginBottom={1}
								width={62}
							>
								<Text bold color={theme.colors.foreground}>
									Keyboard Shortcuts
								</Text>
								<Text color={theme.colors.mutedForeground}>[?] Close</Text>
							</Box>
							<KeyboardShortcuts columns={1} shortcuts={SHORTCUT_ROWS} />
						</Box>
					</Box>
				</Box>
			);
		}

		switch (current.screen) {
			case 'articleDetail': {
				return (
					<ArticleDetailScreen
						articleId={current.params.articleId ?? ''}
						mainInputActive={mainInputActive}
					/>
				);
			}
			case 'bookmarks': {
				return <BookmarksScreen mainInputActive={mainInputActive} />;
			}
			case 'news': {
				return <NewsScreen mainInputActive={mainInputActive} />;
			}
			case 'priceDetail': {
				return (
					<PriceDetailScreen
						mainInputActive={mainInputActive}
						symbol={current.params.symbol ?? ''}
					/>
				);
			}
			case 'settings': {
				return <SettingsScreen mainInputActive={mainInputActive} />;
			}
			default: {
				return (
					<PricesScreen
						mainInputActive={mainInputActive}
						themeColors={theme.colors}
					/>
				);
			}
		}
	}, [
		showHelp,
		current.screen,
		current.params.articleId,
		current.params.symbol,
		mainInputActive,
		theme.colors,
		instruments,
	]);

	const themedLabel = themeLabelForKey(config.themeKey);
	const headerRight = paneHeaderActions(current.screen);
	const footerHint =
		FOOTER_HINTS[current.screen] ??
		`Tab ⇄ sidebar · ? help · q quit${showHelp ? '' : ''}`;

	return (
		<Box
			borderColor={theme.colors.border}
			borderStyle="double"
			flexDirection="column"
			height={rows}
			width="100%"
		>
			<Box flexDirection="row" flexGrow={1} width="100%">
				<Sidebar
					activeKey={sidebarActiveKey(current.screen)}
					brandedTitle
					inputActive={shellZone === 'sidebar' && !showHelp}
					items={SIDEBAR_ITEMS}
					onSelect={key => {
						replaceRoot({params: {}, screen: key as Screen});
						setShellZone('main');
					}}
					title="M F X"
					width={20}
				/>
				<Box flexDirection="column" flexGrow={1} height="100%">
					<Box
						borderBottom
						borderColor={theme.colors.border}
						borderStyle="single"
						flexDirection="row"
						justifyContent="space-between"
						paddingX={1}
					>
						<Text bold color={theme.colors.foreground}>
							{resolvePaneHeaderTitle(
								current.screen,
								current.params,
								instruments,
							)}
						</Text>
						<Box flexDirection="row" gap={2}>
							{(pricesLoading || newsLoading) && <Spinner type="dots" />}
							{headerRight && (
								<Text color={theme.colors.mutedForeground}>{headerRight}</Text>
							)}
						</Box>
					</Box>
					<Box
						flexDirection="column"
						flexGrow={1}
						overflow="hidden"
						paddingRight={1}
						paddingTop={0}
						paddingX={1}
					>
						{main}
					</Box>
				</Box>
			</Box>
			<Box flexDirection="column" paddingX={1}>
				<Text dimColor color={theme.colors.mutedForeground}>
					{config.email ?? 'session'} · Last updated{' '}
					{compositeLastUpdated.toLocaleTimeString()} · Theme: {themedLabel} ·
					[?] Help
				</Text>
				<Text color={theme.colors.mutedForeground} dimColor>
					{footerHint}
				</Text>
			</Box>
		</Box>
	);
}

export function AuthenticatedShell() {
	return (
		<ShellFocusProvider>
			<ShellInterior />
		</ShellFocusProvider>
	);
}
