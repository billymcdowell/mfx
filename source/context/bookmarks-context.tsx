import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import type {Article, Bookmark} from '@/source/types';
import {loadBookmarks, saveBookmarks} from '@/source/lib/bookmarks-storage';

type BookmarksContextValue = {
	items: Bookmark[];
	add: (article: Article) => void;
	remove: (id: string) => void;
	isBookmarked: (id: string) => boolean;
};

const BookmarksContext = createContext<BookmarksContextValue | undefined>(
	undefined,
);

export function BookmarksProvider({children}: {children: React.ReactNode}) {
	const [items, setItems] = useState(() => loadBookmarks());

	const persist = useCallback((next: Bookmark[]) => {
		setItems(next);
		saveBookmarks(next);
	}, []);

	const add = useCallback(
		(article: Article) => {
			if (items.some(b => b.id === article.id)) {
				return;
			}

			const next: Bookmark[] = [
				...items,
				{
					body: article.body,
					id: article.id,
					savedAt: new Date().toISOString(),
					source: article.source,
					title: article.title,
					url: article.url ?? `mfx://article/${article.id}`,
				},
			];
			persist(next);
		},
		[items, persist],
	);

	const remove = useCallback(
		(id: string) => {
			persist(items.filter(b => b.id !== id));
		},
		[items, persist],
	);

	const isBookmarked = useCallback(
		(id: string) => items.some(b => b.id === id),
		[items],
	);

	const value = useMemo(
		() => ({
			add,
			isBookmarked,
			items,
			remove,
		}),
		[add, isBookmarked, items, remove],
	);

	return (
		<BookmarksContext.Provider value={value}>
			{children}
		</BookmarksContext.Provider>
	);
}

export function useBookmarks(): BookmarksContextValue {
	const v = useContext(BookmarksContext);
	if (!v) {
		throw new Error('useBookmarks must be used inside BookmarksProvider');
	}

	return v;
}
