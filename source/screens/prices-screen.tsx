import {Box, Text} from 'ink';
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView} from '@/components/ui/scroll-view';
import type {ColorTokens} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useConfig} from '@/source/context/config-context';
import {usePriceFavorites} from '@/source/context/price-favorites-context';
import {usePrices} from '@/source/context/prices-context';
import {useRouter} from '@/source/context/router-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {historyToTrendStrip} from '@/source/lib/spark-trend';
import type {Instrument, InstrumentType} from '@/source/types';

function formatSpotCell(value: number, type: InstrumentType): string {
	if (type === 'forex') {
		return value.toFixed(4);
	}

	return value.toLocaleString('en-US', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});
}

function formatBidAsk(value: number, type: InstrumentType): string {
	if (type === 'forex') {
		return value.toFixed(4);
	}

	return value.toLocaleString('en-US', {
		maximumFractionDigits: 3,
		minimumFractionDigits: 3,
	});
}

function pad(s: string, w: number): string {
	return s.slice(0, w).padEnd(w, ' ');
}

type Filter = 'all' | 'commodity' | 'forex';

function filterLabel(f: Filter): string {
	switch (f) {
		case 'commodity': {
			return 'Commodities';
		}
		case 'forex': {
			return 'Forex';
		}
		default: {
			return 'All';
		}
	}
}

export function PricesScreen({
	mainInputActive,
	themeColors,
}: {
	mainInputActive: boolean;
	themeColors: Pick<
		ColorTokens,
		| 'border'
		| 'error'
		| 'focusRing'
		| 'foreground'
		| 'mutedForeground'
		| 'primary'
		| 'selection'
		| 'success'
	>;
}) {
	const {shellMainColumnHeight} = useTerminalViewport();
	const {instruments, loading, refresh, secondsUntilRefresh} = usePrices();
	const {config} = useConfig();
	const {navigate} = useRouter();
	const {entries, isFavorite, toggle} = usePriceFavorites();
	const [filter, setFilter] = useState<Filter>('all');
	const [row, setRow] = useState(0);
	const [query, setQuery] = useState('');
	const [searchMode, setSearchMode] = useState(false);
	const [favoritesOnly, setFavoritesOnly] = useState(false);

	const favoriteSymbols = useMemo(
		() => new Set(entries.map(e => e.symbol)),
		[entries],
	);

	const filtered = useMemo(() => {
		let list = instruments.filter(i => filter === 'all' || i.type === filter);
		const q = query.trim().toLowerCase();
		if (q) {
			list = list.filter(
				i =>
					i.symbol.toLowerCase().includes(q) ||
					i.name.toLowerCase().includes(q),
			);
		}

		if (favoritesOnly) {
			list = list.filter(i => favoriteSymbols.has(i.symbol));
		}

		return list;
	}, [instruments, filter, query, favoritesOnly, favoriteSymbols]);

	useEffect(() => {
		setRow(r => Math.min(r, Math.max(filtered.length - 1, 0)));
	}, [filtered.length]);

	useInput(
		(input, key) => {
			if (!mainInputActive) {
				return;
			}

			if (searchMode) {
				if (key.escape) {
					setQuery('');
					setSearchMode(false);
					return;
				}

				if (key.return) {
					setSearchMode(false);
					return;
				}

				if (key.backspace || key.delete) {
					setQuery(q => q.slice(0, -1));
					return;
				}

				if (input && !key.ctrl && input.length === 1) {
					setQuery(q => q + input);
				}

				return;
			}

			if (input === '/' && !key.ctrl) {
				setSearchMode(true);
				return;
			}

			if (input === 'v' || input === 'V') {
				setFavoritesOnly(v => !v);
				return;
			}

			if (input === 's' || input === 'S') {
				const rowData = filtered[row];
				if (rowData) {
					toggle(rowData.symbol);
				}

				return;
			}

			if (input === '1') {
				setFilter('all');
			} else if (input === '2') {
				setFilter('commodity');
			} else if (input === '3') {
				setFilter('forex');
			} else if (input === 'f' || input === 'F') {
				setFilter(f =>
					f === 'all' ? 'commodity' : f === 'commodity' ? 'forex' : 'all',
				);
			} else if (input === 'r' || input === 'R') {
				void refresh();
			} else if (key.upArrow || input === 'k' || input === 'K') {
				setRow(r => Math.max(0, r - 1));
			} else if (key.downArrow || input === 'j' || input === 'J') {
				setRow(r => Math.min(Math.max(0, filtered.length - 1), r + 1));
			} else if (key.return) {
				const rowData = filtered[row];
				if (rowData) {
					navigate('priceDetail', {symbol: rowData.symbol});
				}
			}
		},
		{
			isActive: mainInputActive,
		},
	);

	const col = {
		ask: 10,
		bid: 10,
		chg: 10,
		name: 20,
		spot: 12,
		sym: 9,
		trend: 12,
	} as const;

	const topRule = `┌${'─'.repeat(col.sym)}┬${'─'.repeat(col.name)}┬${'─'.repeat(
		col.spot,
	)}┬${'─'.repeat(col.chg)}┬${'─'.repeat(col.bid)}┬${'─'.repeat(
		col.ask,
	)}┬${'─'.repeat(col.trend)}┐`;
	const midRule = `├${'─'.repeat(col.sym)}┼${'─'.repeat(col.name)}┼${'─'.repeat(
		col.spot,
	)}┼${'─'.repeat(col.chg)}┼${'─'.repeat(col.bid)}┼${'─'.repeat(
		col.ask,
	)}┼${'─'.repeat(col.trend)}┤`;
	const botRule = `└${'─'.repeat(col.sym)}┴${'─'.repeat(col.name)}┴${'─'.repeat(
		col.spot,
	)}┴${'─'.repeat(col.chg)}┴${'─'.repeat(col.bid)}┴${'─'.repeat(
		col.ask,
	)}┴${'─'.repeat(col.trend)}┘`;

	const searchExtraLines = searchMode ? 5 : query.trim() ? 1 : 0;
	const pricesChromeLines = 6 + searchExtraLines;
	const scrollHeight = Math.max(6, shellMainColumnHeight - pricesChromeLines);
	const contentHeight = Math.max(scrollHeight, filtered.length * 2 + 8);

	const intervalSec = config.priceRefreshSeconds;
	const countdown =
		intervalSec > 0
			? `00:${String(secondsUntilRefresh).padStart(2, '0')}`
			: '—';

	return (
		<Box flexDirection="column" flexGrow={1} gap={0}>
			<Box flexDirection="row" flexWrap="wrap" gap={1} marginBottom={1}>
				<Text color={themeColors.mutedForeground}>Filter:</Text>
				{(['all', 'commodity', 'forex'] as const).map(f => (
					<Text
						backgroundColor={filter === f ? themeColors.selection : undefined}
						color={
							filter === f
								? themeColors.foreground
								: themeColors.mutedForeground
						}
						key={f}
					>
						[{filterLabel(f)} ▾]
					</Text>
				))}
				<Text color={themeColors.mutedForeground}>│</Text>
				<Text
					backgroundColor={favoritesOnly ? themeColors.selection : undefined}
					color={
						favoritesOnly ? themeColors.foreground : themeColors.mutedForeground
					}
				>
					[* Watchlist ▾]
				</Text>
			</Box>
			{searchMode ? (
				<Box flexDirection="column" marginBottom={1}>
					<Text bold color={themeColors.foreground}>
						Search
					</Text>
					<Box flexDirection="row">
						<Text color={themeColors.mutedForeground}>──────▶│</Text>
						<Box
							borderColor={themeColors.focusRing}
							borderStyle="single"
							flexGrow={1}
							paddingX={1}
						>
							<Text>
								{query}
								<Text color={themeColors.focusRing}>▌</Text>
							</Text>
						</Box>
					</Box>
					<Text color={themeColors.mutedForeground} dimColor>
						{filtered.length} results for &quot;{query}&quot;
					</Text>
				</Box>
			) : query.trim() ? (
				<Box marginBottom={1}>
					<Text color={themeColors.mutedForeground} dimColor>
						{filtered.length} results for &quot;{query}&quot; · [/] edit search
					</Text>
				</Box>
			) : null}
			<ScrollView
				contentHeight={contentHeight}
				height={scrollHeight}
				scrollInputActive={false}
			>
				<Box flexDirection="column">
					<Text color={themeColors.mutedForeground}>{topRule}</Text>
					<Text bold color={themeColors.primary}>
						│{pad('Symbol', col.sym)}│{pad('Name', col.name)}│
						{pad('Spot', col.spot)}│{pad('24h Chg', col.chg)}│
						{pad('Bid', col.bid)}│{pad('Ask', col.ask)}│
						{pad('Trend', col.trend)}│
					</Text>
					<Text color={themeColors.mutedForeground}>{midRule}</Text>
					{filtered.map((inst, i) => (
						<InstrumentTableRow
							active={i === row}
							col={col}
							favorite={isFavorite(inst.symbol)}
							inst={inst}
							key={inst.symbol}
							midRule={midRule}
							themeColors={themeColors}
						/>
					))}
					<Text color={themeColors.mutedForeground}>{botRule}</Text>
				</Box>
			</ScrollView>
			<Box marginTop={1}>
				<Text color={themeColors.mutedForeground} dimColor>
					{filtered.length} instruments
					{favoritesOnly ? ' · watchlist' : ''}
					{intervalSec > 0
						? ` · Auto-refreshing every ${intervalSec}s · Next refresh in ${countdown}`
						: ' · Manual refresh only'}{' '}
					{loading ? '· refreshing…' : ''}
				</Text>
			</Box>
		</Box>
	);
}

function InstrumentTableRow({
	inst,
	active,
	favorite,
	themeColors,
	col,
	midRule,
}: {
	inst: Instrument;
	active: boolean;
	favorite: boolean;
	themeColors: Pick<
		ColorTokens,
		'error' | 'foreground' | 'mutedForeground' | 'selection' | 'success'
	>;
	col: {
		ask: number;
		bid: number;
		chg: number;
		name: number;
		spot: number;
		sym: number;
		trend: number;
	};
	midRule: string;
}) {
	const t: InstrumentType = inst.type;
	const up = inst.change24h >= 0;
	const pct = `${up ? '+' : ''}${inst.change24h.toFixed(2)}%`;
	const trend = historyToTrendStrip(inst.history, col.trend);
	const bg = active ? themeColors.selection : undefined;
	const symCell = pad(`${favorite ? '*' : ' '}${inst.symbol}`, col.sym);
	return (
		<Box flexDirection="column">
			<Box backgroundColor={bg} flexDirection="row">
				<Text backgroundColor={bg}>│</Text>
				<Text
					backgroundColor={bg}
					bold={active}
					color={active ? themeColors.success : themeColors.foreground}
				>
					{symCell}
				</Text>
				<Text backgroundColor={bg}>│</Text>
				<Text backgroundColor={bg} color={themeColors.mutedForeground}>
					{pad(inst.name.slice(0, col.name), col.name)}
				</Text>
				<Text backgroundColor={bg}>│</Text>
				<Text backgroundColor={bg} bold={active}>
					{pad(formatSpotCell(inst.spotPrice, t), col.spot)}
				</Text>
				<Text backgroundColor={bg}>│</Text>
				<Text
					backgroundColor={bg}
					color={up ? themeColors.success : themeColors.error}
				>
					{pad(`${up ? '▲' : '▼'} ${pct}`, col.chg)}
				</Text>
				<Text backgroundColor={bg}>│</Text>
				<Text backgroundColor={bg} color={themeColors.mutedForeground}>
					{pad(formatBidAsk(inst.bid, t), col.bid)}
				</Text>
				<Text backgroundColor={bg}>│</Text>
				<Text backgroundColor={bg} color={themeColors.mutedForeground}>
					{pad(formatBidAsk(inst.ask, t), col.ask)}
				</Text>
				<Text backgroundColor={bg}>│</Text>
				<Text backgroundColor={bg} color={themeColors.mutedForeground}>
					{pad(trend, col.trend)}
				</Text>
				<Text backgroundColor={bg}>│</Text>
			</Box>
			<Text color={themeColors.mutedForeground}>{midRule}</Text>
		</Box>
	);
}
