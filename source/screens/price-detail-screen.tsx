import {Box, Text} from 'ink';
import React, {useMemo} from 'react';
import {LineChart} from '@/components/ui/line-chart';
import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {usePriceFavorites} from '@/source/context/price-favorites-context';
import {usePrices} from '@/source/context/prices-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {formatPrice} from '@/source/lib/format';

function ohlcFromHistory(history: number[], bid: number, ask: number) {
	const open = history[0] ?? 0;
	const high = Math.max(...history);
	const low = Math.min(...history);
	const closePrev =
		history.length > 1 ? history.at(-2)! : history.at(-1) ?? open;
	const mid = (bid + ask) / 2;
	const spread = Math.abs(ask - bid);
	return {closePrev, high, low, mid, open, spread};
}

export function PriceDetailScreen({
	symbol,
	mainInputActive,
}: {
	mainInputActive: boolean;
	symbol: string;
}) {
	const theme = useTheme();
	const {instruments, refresh} = usePrices();
	const {isFavorite, toggle} = usePriceFavorites();
	const {mainInnerWidth, shellMainColumnHeight} = useTerminalViewport();

	useInput(
		input => {
			if (input === 'r' || input === 'R') {
				void refresh();
				return;
			}

			if (input === 's' || input === 'S') {
				toggle(symbol);
			}
		},
		{isActive: mainInputActive},
	);

	const instrument = useMemo(
		() => instruments.find(i => i.symbol === symbol),
		[instruments, symbol],
	);

	const starred = isFavorite(symbol);

	if (!instrument) {
		return (
			<Text color={theme.colors.warning}>Unknown instrument {symbol}</Text>
		);
	}

	const chartHeight = Math.max(8, shellMainColumnHeight - 16);
	const chartWidth = Math.min(96, Math.max(50, mainInnerWidth - 4));
	const {closePrev, high, low, mid, open, spread} = ohlcFromHistory(
		instrument.history,
		instrument.bid,
		instrument.ask,
	);
	const t = instrument.type;
	const spotColor: string =
		instrument.type === 'commodity'
			? theme.colors.warning
			: theme.colors.foreground;
	const up = instrument.change24h >= 0;
	const absChg = Math.abs((instrument.spotPrice * instrument.change24h) / 100);
	const changeDisplay = absChg.toFixed(instrument.type === 'forex' ? 4 : 2);
	const deltaSign = up ? '+' : '-';

	return (
		<Box flexDirection="column" gap={1}>
			<Text color={theme.colors.mutedForeground}>
				Watchlist:{' '}
				<Text
					bold
					color={starred ? theme.colors.success : theme.colors.foreground}
				>
					{starred ? 'on' : 'off'}
				</Text>
				<Text dimColor> · [s] toggle</Text>
			</Text>
			<Box flexDirection="row" gap={2}>
				<Box
					borderColor={theme.colors.border}
					borderStyle="single"
					flexDirection="column"
					paddingX={1}
					paddingY={1}
					width={36}
				>
					<Text bold color={theme.colors.mutedForeground}>
						Spot Price
					</Text>
					<Text bold color={spotColor}>
						$ {formatPrice(instrument.spotPrice, t)}
					</Text>
					<Text color={up ? theme.colors.success : theme.colors.error}>
						{up ? '▲' : '▼'} {deltaSign}
						{changeDisplay} {instrument.change24h.toFixed(2)}% (24h)
					</Text>
					<Text>
						Bid <Text bold>{formatPrice(instrument.bid, t)}</Text>
					</Text>
					<Text>
						Ask <Text bold>{formatPrice(instrument.ask, t)}</Text>
					</Text>
				</Box>
				<Box
					borderColor={theme.colors.border}
					borderStyle="single"
					flexDirection="column"
					paddingX={1}
					paddingY={1}
					width={38}
				>
					<Text bold color={theme.colors.mutedForeground}>
						24h Statistics
					</Text>
					<Text>
						Open <Text>{formatPrice(open, t)}</Text>
					</Text>
					<Text>
						High{' '}
						<Text color={theme.colors.success}>{formatPrice(high, t)}</Text>
					</Text>
					<Text>
						Low <Text color={theme.colors.error}>{formatPrice(low, t)}</Text>
					</Text>
					<Text>
						Close (prev) <Text>{formatPrice(closePrev, t)}</Text>
					</Text>
					<Text> </Text>
					<Text>
						Spread <Text>{formatPrice(spread, t)}</Text>
					</Text>
					<Text>
						Mid <Text>{formatPrice(mid, t)}</Text>
					</Text>
				</Box>
			</Box>
			<Text bold color={theme.colors.foreground}>
				24h Price Chart
			</Text>
			<Box
				borderColor={theme.colors.border}
				borderStyle="single"
				flexDirection="column"
				paddingX={1}
			>
				<LineChart
					data={instrument.history}
					height={chartHeight}
					title=""
					width={chartWidth}
				/>
				<Text color={theme.colors.mutedForeground} dimColor>
					00:00 04:00 08:00 12:00 16:00 20:00 now · current ●
				</Text>
			</Box>
		</Box>
	);
}
