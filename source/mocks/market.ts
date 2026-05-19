import type {Article, Instrument} from '@/source/types';

function series(base: number, points: number, drift: number): number[] {
	const out: number[] = [];
	let v = base;
	for (let i = 0; i < points; i++) {
		v += (Math.random() - 0.5) * drift;
		out.push(v);
	}

	return out;
}

export function seedInstruments(): Instrument[] {
	const points = 48;
	const goldHist = series(2341.5, points, 4);
	const silverHist = series(27.34, points, 0.09);
	const oilHist = series(78.54, points, 0.35);
	const gasHist = series(1.98, points, 0.05);
	const eurusdHist = series(1.0823, points, 0.001);
	const gbpusdHist = series(1.2654, points, 0.001);
	const usdjpyHist = series(154.32, points, 0.15);
	const usdchfHist = series(0.9042, points, 0.0002);

	return [
		{
			symbol: 'XAUUSD',
			name: 'Gold / USD',
			type: 'commodity',
			spotPrice: goldHist.at(-1)!,
			change24h: 0.42,
			bid: goldHist.at(-1)! - 0.05,
			ask: goldHist.at(-1)! + 0.07,
			history: goldHist,
		},
		{
			symbol: 'XAGUSD',
			name: 'Silver / USD',
			type: 'commodity',
			spotPrice: silverHist.at(-1)!,
			change24h: 1.12,
			bid: silverHist.at(-1)! - 0.01,
			ask: silverHist.at(-1)! + 0.015,
			history: silverHist,
		},
		{
			symbol: 'XTIUSD',
			name: 'WTI Crude Oil / USD',
			type: 'commodity',
			spotPrice: oilHist.at(-1)!,
			change24h: -0.83,
			bid: oilHist.at(-1)! - 0.02,
			ask: oilHist.at(-1)! + 0.03,
			history: oilHist,
		},
		{
			symbol: 'XNGUSD',
			name: 'Natural Gas / USD',
			type: 'commodity',
			spotPrice: gasHist.at(-1)!,
			change24h: -2.31,
			bid: gasHist.at(-1)! - 0.005,
			ask: gasHist.at(-1)! + 0.009,
			history: gasHist,
		},
		{
			symbol: 'EURUSD',
			name: 'Euro / USD',
			type: 'forex',
			spotPrice: eurusdHist.at(-1)!,
			change24h: -0.11,
			bid: eurusdHist.at(-1)! - 0.00012,
			ask: eurusdHist.at(-1)! + 0.0001,
			history: eurusdHist,
		},
		{
			symbol: 'GBPUSD',
			name: 'GBP / USD',
			type: 'forex',
			spotPrice: gbpusdHist.at(-1)!,
			change24h: 0.28,
			bid: gbpusdHist.at(-1)! - 0.00015,
			ask: gbpusdHist.at(-1)! + 0.00012,
			history: gbpusdHist,
		},
		{
			symbol: 'USDJPY',
			name: 'USD / Japanese Yen',
			type: 'forex',
			spotPrice: usdjpyHist.at(-1)!,
			change24h: 0.55,
			bid: usdjpyHist.at(-1)! - 0.02,
			ask: usdjpyHist.at(-1)! + 0.02,
			history: usdjpyHist,
		},
		{
			symbol: 'USDCHF',
			name: 'USD / Swiss Franc',
			type: 'forex',
			spotPrice: usdchfHist.at(-1)!,
			change24h: -0.07,
			bid: usdchfHist.at(-1)! - 0.00012,
			ask: usdchfHist.at(-1)! + 0.00012,
			history: usdchfHist,
		},
	];
}

export const MOCK_ARTICLES: Article[] = [
	{
		body: "Markets are pricing fewer cuts after sticky prints across services. The Fed's next move will be data-dependent, officials stressed.\n\n> Labour and inflation remain the twin focal points for the March meeting.",
		id: 'a1',
		publishedAt: new Date(Date.now() - 840_000).toISOString(),
		source: 'Reuters',
		summary: 'Dovish repricing paused.',
		tags: ['MACRO'],
		title: 'Fed signals caution on rate cuts as inflation data remains sticky',
		url: 'https://example.com/news/fed-caution',
	},
	{
		body: 'Gold futures climbed to their highest level in three weeks on Wednesday as investors sought safe-haven assets ahead of Friday\'s US non-farm payrolls report, which could influence the Federal Reserve\'s next policy decision.\n\nSpot gold rose 0.4% to $2,341.80 per troy ounce by 13:30 GMT, after touching an intraday high of $2,349.20. US gold futures gained 0.5% to $2,353.60.\n\n"The market is positioning defensively ahead of payrolls," said David Meger, director of metals trading at High Ridge Futures.\n\nThe dollar index slipped 0.1%, making gold cheaper for buyers holding other currencies. Ten-year Treasury yields edged down to 4.58%, further supporting non-yielding bullion.\n\nSilver also gained, rising 1.1% to $27.34, while platinum added 0.3%. Palladium was little changed.',
		id: 'a2',
		publishedAt: new Date(Date.now() - 1_920_000).toISOString(),
		source: 'Bloomberg',
		summary: 'Safe-haven bid into payrolls week.',
		tags: ['GOLD'],
		title: 'Gold hits 3-week high on safe-haven demand ahead of US jobs report',
		url: 'https://example.com/news/gold-jobs',
	},
	{
		body: 'Crude benchmarks drifted lower as traders weighed a fragile OPEC+ agreement against softening demand signals from Asia.\n\n> Watch voluntary cuts vs compliance chatter into the weekend.',
		id: 'a3',
		publishedAt: new Date(Date.now() - 2_460_000).toISOString(),
		source: 'FT',
		summary: 'Supply politics overhang.',
		tags: ['OIL'],
		title:
			'Oil dips below $79 as OPEC+ output deal faces renewed member pressure',
		url: 'https://example.com/news/oil-opec',
	},
	{
		body: 'EUR/USD extended losses after German factory orders missed expectations, dragging the euro through prior support.\n\n> Volatility remains compressed but downside gamma builds.',
		id: 'a4',
		publishedAt: new Date(Date.now() - 5_700_000).toISOString(),
		source: 'FX Street',
		summary: 'Data miss hits euro longs.',
		tags: ['EUR/USD'],
		title:
			'EUR/USD slides to 1-month low after German factory orders miss estimates',
		url: 'https://example.com/news/eurusd',
	},
	{
		body: 'Industrial demand narratives for silver improved after WGC highlighted photovoltaic-linked consumption.\n\n> ETF flows were modest but supportive.',
		id: 'a5',
		publishedAt: new Date(Date.now() - 10_800_000).toISOString(),
		source: 'Kitco',
		summary: 'Silver catching a structural bid.',
		tags: ['SILVER'],
		title:
			'Silver outperforms gold as industrial demand forecast upgraded by WGC',
		url: 'https://example.com/news/silver-wgc',
	},
	{
		body: 'The dollar index pushed higher after a strong ADP print while USD/JPY broke above 154 as yen weakness returned.\n\n> Real yields remained supportive of USD.',
		id: 'a6',
		publishedAt: new Date(Date.now() - 12_240_000).toISOString(),
		source: 'MarketWatch',
		summary: 'USD strength broad-based.',
		tags: ['USD', 'JPY'],
		title: 'Dollar index climbs on strong ADP payrolls; yen slides past 154',
		url: 'https://example.com/news/dxy-adp',
	},
	{
		body: 'Henry Hub sold off as weather models leaned warmer for the two-week horizon, shifting storage expectations.\n\n> Spreads along the curve flattened.',
		id: 'a7',
		publishedAt: new Date(Date.now() - 15_480_000).toISOString(),
		source: 'Reuters',
		summary: 'Weather takes the bid away.',
		tags: ['NAT GAS'],
		title: 'Natural gas futures tumble 2% on warmer-than-expected forecasts',
		url: 'https://example.com/news/gas-weather',
	},
	{
		body: 'Cable hugged the mid-1.26 handle despite a soft services PMI as traders looked ahead to BOE minutes.\n\n> Implied volatility ticked down.',
		id: 'a8',
		publishedAt: new Date(Date.now() - 17_520_000).toISOString(),
		source: 'Sky News',
		summary: 'Range trade in GBP.',
		tags: ['GBP/USD'],
		title:
			'GBP holds steady despite UK services PMI miss; traders eye BOE minutes',
		url: 'https://example.com/news/gbp-pmi',
	},
	{
		body: 'OPEC+ nudged its demand outlook higher for 2024 even as Chinese consumption data disappointed.\n\n> Traders remain skeptical about compliance.',
		id: 'a9',
		publishedAt: new Date(Date.now() - 259_200_000).toISOString(),
		source: 'Reuters',
		summary: 'Outlook vs China reality.',
		tags: ['OIL'],
		title: 'OPEC+ raises 2024 demand forecast despite weak China data',
		url: 'https://example.com/news/opec-china',
	},
];

export function jitterInstruments(previous: Instrument[]): Instrument[] {
	return previous.map(row => {
		const jitter = row.spotPrice * (0.0009 + Math.random() * 0.001);
		const delta = (Math.random() - 0.48) * jitter;
		const nextSpot = Number(
			(row.spotPrice + delta).toFixed(row.type === 'forex' ? 5 : 3),
		);
		const spread = Math.max(Math.abs(row.ask - row.bid), 0.01);
		const bid = Number(
			(nextSpot - spread / 2).toFixed(row.type === 'forex' ? 5 : 3),
		);
		const ask = Number(
			(nextSpot + spread / 2).toFixed(row.type === 'forex' ? 5 : 3),
		);
		const hist = [...row.history.slice(1), nextSpot];
		const prevHist = row.history[row.history.length - 2] ?? hist[0]!;
		const change24h = Number(
			(((nextSpot - prevHist) / prevHist) * 100).toFixed(2),
		);
		return {
			...row,
			ask,
			bid,
			change24h,
			history: hist,
			spotPrice: nextSpot,
		};
	});
}
