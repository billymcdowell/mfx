import {Box, Text} from 'ink';
import React, {useMemo, useState} from 'react';
import {Markdown} from '@/components/ui/markdown';
import {ProgressBar} from '@/components/ui/progress-bar';
import {ScrollView} from '@/components/ui/scroll-view';
import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useBookmarks} from '@/source/context/bookmarks-context';
import {useNews} from '@/source/context/news-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {newsTagStyle} from '@/source/lib/news-tag-colors';
import {openUrlInBrowser} from '@/source/lib/open-url';
import {formatNewsTime} from '@/source/lib/relative-time';
import type {Article} from '@/source/types';

export function ArticleDetailScreen({
	mainInputActive,
	articleId,
}: {
	mainInputActive: boolean;
	articleId: string;
}) {
	const theme = useTheme();
	const {mainInnerWidth, shellMainColumnHeight} = useTerminalViewport();
	const {articles} = useNews();
	const {items: bookmarks, add} = useBookmarks();
	const [scrollTop, setScrollPair] = useState({max: 0, top: 0});

	const article = useMemo(() => {
		const hit = articles.find(a => a.id === articleId);
		if (hit) {
			return hit;
		}

		const saved = bookmarks.find(b => b.id === articleId);
		if (saved) {
			const synthetic: Article = {
				body: saved.body,
				id: saved.id,
				publishedAt: saved.savedAt,
				source: saved.source,
				summary: '',
				tags: [],
				title: saved.title,
				url: saved.url,
			};
			return synthetic;
		}

		return undefined;
	}, [articleId, articles, bookmarks]);

	useInput(
		(input, _key) => {
			if (!mainInputActive || !article) {
				return;
			}

			if (input === 'b' || input === 'B') {
				add(article);
				return;
			}

			if (input === 'o' || input === 'O') {
				const u = article.url;
				if (u && u.startsWith('http')) {
					openUrlInBrowser(u);
				}
			}
		},
		{isActive: mainInputActive},
	);

	if (!article) {
		return (
			<Box flexDirection="column">
				<Text color={theme.colors.warning}>
					Story not loaded (bookmark only id mismatch).
				</Text>
				<Text dimColor>Press [q] to go back.</Text>
			</Box>
		);
	}

	const articleChromeLines = 8;
	const scrollHeight = Math.max(8, shellMainColumnHeight - articleChromeLines);
	const wrapWidth = Math.min(92, Math.max(40, mainInnerWidth));
	const contentLines = Math.max(10, Math.ceil(article.body.length / wrapWidth));
	const pct =
		scrollTop.max <= 0
			? 100
			: Math.min(
					100,
					Math.round((scrollTop.top / Math.max(1, scrollTop.max)) * 100),
			  );

	return (
		<Box flexDirection="column" flexGrow={1} gap={0}>
			<Box flexDirection="row" gap={1} marginBottom={1}>
				{article.tags.length > 0
					? article.tags.slice(0, 2).map(t => {
							const st = newsTagStyle(t);
							return (
								<Text
									backgroundColor={st.backgroundColor}
									color={st.color}
									key={t}
								>
									{` ${t.toUpperCase()} `}
								</Text>
							);
					  })
					: null}
			</Box>
			<Text bold color={theme.colors.primary}>
				{article.title}
			</Text>
			<Text color={theme.colors.mutedForeground}>
				{article.source} · Today at {formatNewsTime(article.publishedAt)}
			</Text>
			<Text color={theme.colors.border}>
				{'─'.repeat(Math.min(72, wrapWidth))}
			</Text>
			<ScrollView
				contentHeight={contentLines + 12}
				height={scrollHeight}
				onScrollTopChange={(top, max) => {
					setScrollPair({max, top});
				}}
				scrollInputActive={mainInputActive}
			>
				<Markdown width={wrapWidth}>{article.body}</Markdown>
			</ScrollView>
			<Box flexDirection="row" gap={1} marginTop={1}>
				<Text color={theme.colors.mutedForeground}>
					↓ Scroll for more ({pct}%)
				</Text>
				<ProgressBar
					color={theme.colors.mutedForeground}
					value={pct}
					width={40}
				/>
			</Box>
		</Box>
	);
}
