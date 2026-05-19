import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {useInterval} from '@/hooks/use-interval';
import {useAuth} from '@/source/context/auth-context';
import {useConfig} from '@/source/context/config-context';
import type {Instrument} from '@/source/types';
import {jitterInstruments, seedInstruments} from '@/source/mocks/market';

type PricesContextValue = {
	instruments: Instrument[];
	lastUpdated: Date;
	loading: boolean;
	refresh: () => Promise<void>;
	/** Wall-clock estimate of next auto-refresh; null when auto-refresh off. */
	nextRefreshAt: Date | null;
	/** Seconds until next auto-refresh; 0 when due or manual-only. */
	secondsUntilRefresh: number;
};

const PricesContext = createContext<PricesContextValue | undefined>(undefined);

export function PricesProvider({children}: {children: React.ReactNode}) {
	const {isAuthenticated} = useAuth();
	const {config} = useConfig();
	const [instruments, setInstruments] = useState(seedInstruments);
	const [loading, setLoading] = useState(false);
	const [lastUpdated, setLastUpdated] = useState(() => new Date());
	const [tick, setTick] = useState(0);

	const refresh = useCallback(async () => {
		setLoading(true);
		await new Promise<void>(r => {
			setTimeout(r, 320);
		});
		setInstruments(prev => jitterInstruments(prev));
		setLastUpdated(new Date());
		setLoading(false);
	}, []);

	const intervalMs =
		isAuthenticated && config.priceRefreshSeconds > 0
			? config.priceRefreshSeconds * 1000
			: null;

	useInterval(() => {
		void refresh();
	}, intervalMs);

	useInterval(
		() => {
			setTick(t => t + 1);
		},
		isAuthenticated && config.priceRefreshSeconds > 0 ? 1000 : null,
	);

	const nextRefreshAt = useMemo(() => {
		if (!isAuthenticated || !config.priceRefreshSeconds) {
			return null;
		}

		return new Date(lastUpdated.getTime() + config.priceRefreshSeconds * 1000);
	}, [isAuthenticated, config.priceRefreshSeconds, lastUpdated, tick]);

	const secondsUntilRefresh = useMemo(() => {
		if (!nextRefreshAt) {
			return 0;
		}

		const s = Math.ceil((nextRefreshAt.getTime() - Date.now()) / 1000);
		return Math.max(0, s);
	}, [nextRefreshAt, tick]);

	useEffect(() => {
		setTick(0);
	}, [lastUpdated, config.priceRefreshSeconds]);

	const value = useMemo(
		() => ({
			instruments,
			lastUpdated,
			loading,
			refresh,
			nextRefreshAt,
			secondsUntilRefresh,
		}),
		[
			instruments,
			lastUpdated,
			loading,
			refresh,
			nextRefreshAt,
			secondsUntilRefresh,
		],
	);

	return (
		<PricesContext.Provider value={value}>{children}</PricesContext.Provider>
	);
}

export function usePrices(): PricesContextValue {
	const v = useContext(PricesContext);
	if (!v) {
		throw new Error('usePrices must be used inside PricesProvider');
	}

	return v;
}
