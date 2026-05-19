import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import type {PriceFavoriteEntry} from '@/source/types';
import {
	loadPriceFavorites,
	savePriceFavorites,
} from '@/source/lib/price-favorites-storage';

type PriceFavoritesContextValue = {
	entries: PriceFavoriteEntry[];
	toggle: (symbol: string) => void;
	isFavorite: (symbol: string) => boolean;
};

const PriceFavoritesContext = createContext<
	PriceFavoritesContextValue | undefined
>(undefined);

function normalizeEntries(raw: PriceFavoriteEntry[]): PriceFavoriteEntry[] {
	const bySymbol = new Map<string, PriceFavoriteEntry>();
	for (const e of raw) {
		if (typeof e.symbol === 'string' && e.symbol.trim()) {
			bySymbol.set(e.symbol.trim(), {
				savedAt:
					typeof e.savedAt === 'string' && e.savedAt
						? e.savedAt
						: new Date().toISOString(),
				symbol: e.symbol.trim(),
			});
		}
	}

	return [...bySymbol.values()].sort(
		(a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
	);
}

export function PriceFavoritesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [entries, setEntries] = useState(() =>
		normalizeEntries(loadPriceFavorites()),
	);

	const persist = useCallback((next: PriceFavoriteEntry[]) => {
		const normalized = normalizeEntries(next);
		setEntries(normalized);
		savePriceFavorites(normalized);
	}, []);

	const toggle = useCallback(
		(symbol: string) => {
			const sym = symbol.trim();
			if (!sym) {
				return;
			}

			const exists = entries.some(e => e.symbol === sym);
			if (exists) {
				persist(entries.filter(e => e.symbol !== sym));
			} else {
				persist([...entries, {savedAt: new Date().toISOString(), symbol: sym}]);
			}
		},
		[entries, persist],
	);

	const isFavorite = useCallback(
		(symbol: string) => entries.some(e => e.symbol === symbol.trim()),
		[entries],
	);

	const value = useMemo(
		() => ({
			entries,
			isFavorite,
			toggle,
		}),
		[entries, isFavorite, toggle],
	);

	return (
		<PriceFavoritesContext.Provider value={value}>
			{children}
		</PriceFavoritesContext.Provider>
	);
}

export function usePriceFavorites(): PriceFavoritesContextValue {
	const v = useContext(PriceFavoritesContext);
	if (!v) {
		throw new Error(
			'usePriceFavorites must be used inside PriceFavoritesProvider',
		);
	}

	return v;
}
