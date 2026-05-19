import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import {useInterval} from '@/hooks/use-interval';
import {useAuth} from '@/source/context/auth-context';
import {useConfig} from '@/source/context/config-context';
import type {Article} from '@/source/types';
import {MOCK_ARTICLES} from '@/source/mocks/market';

type NewsContextValue = {
	articles: Article[];
	lastUpdated: Date;
	loading: boolean;
	refresh: () => Promise<void>;
};

const NewsContext = createContext<NewsContextValue | undefined>(undefined);

function shuffleHeadlines(input: Article[]): Article[] {
	const copy = [...input];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j]!, copy[i]!];
	}

	return copy;
}

export function NewsProvider({children}: {children: React.ReactNode}) {
	const {isAuthenticated} = useAuth();
	const {config} = useConfig();
	const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
	const [loading, setLoading] = useState(false);
	const [lastUpdated, setLastUpdated] = useState(() => new Date());

	const refresh = useCallback(async () => {
		setLoading(true);
		await new Promise<void>(r => {
			setTimeout(r, 250);
		});
		setArticles(shuffleHeadlines(MOCK_ARTICLES));
		setLastUpdated(new Date());
		setLoading(false);
	}, []);

	useInterval(
		() => {
			void refresh();
		},
		isAuthenticated ? config.newsRefreshMinutes * 60_000 : null,
	);

	const value = useMemo(
		() => ({
			articles,
			lastUpdated,
			loading,
			refresh,
		}),
		[articles, lastUpdated, loading, refresh],
	);

	return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews(): NewsContextValue {
	const v = useContext(NewsContext);
	if (!v) {
		throw new Error('useNews must be used inside NewsProvider');
	}

	return v;
}
