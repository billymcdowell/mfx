import {Box, Text} from 'ink';
import React, {useMemo, useState} from 'react';
import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useBookmarks} from '@/source/context/bookmarks-context';
import {useNews} from '@/source/context/news-context';
import {useRouter} from '@/source/context/router-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {newsTagStyle} from '@/source/lib/news-tag-colors';
import {formatNewsTime} from '@/source/lib/relative-time';

export function NewsScreen({mainInputActive}: {mainInputActive: boolean}) {
	const theme = useTheme();
	const {mainInnerWidth} = useTerminalViewport();
	const {articles, lastUpdated, loading, refresh} = useNews();
	const {add, isBookmarked} = useBookmarks();
	const {navigate} = useRouter();
	const [query, setQuery] = useState('');
	const [searchMode, setSearchMode] = useState(false);
	const [row, setRow] = useState(0);

	const filtered = useMemo(() => {
		if (!query.trim()) {
			return articles;
		}

		const q = query.toLowerCase();
		return articles.filter(
			a =>
				a.title.toLowerCase().includes(q) ||
				a.summary.toLowerCase().includes(q) ||
				a.tags.some(t => t.toLowerCase().includes(q)),
		);
	}, [articles, query]);

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

			if (input === 'b' || input === 'B') {
				const a = filtered[row];
				if (a) {
					add(a);
				}

				return;
			}

			if (input === 'r' || input === 'R') {
				void refresh();
				return;
			}

			if (key.upArrow || input === 'k' || input === 'K') {
				setRow(r => Math.max(0, r - 1));
			} else if (key.downArrow || input === 'j' || input === 'J') {
				setRow(r => Math.min(Math.max(0, filtered.length - 1), r + 1));
			} else if (key.return) {
				const piece = filtered[row];
				if (piece) {
					navigate('articleDetail', {articleId: piece.id});
				}
			}
		},
		{isActive: mainInputActive},
	);

	const relativeNewsAge = (): string => {
		const m = Math.floor((Date.now() - lastUpdated.getTime()) / 60_000);
		if (m <= 0) {
			return 'just now';
		}

		if (m === 1) {
			return '1 min ago';
		}

		return `${m} min ago`;
	};

	const dividerWidth = Math.max(12, mainInnerWidth - 6);

	return (
		<Box flexDirection="column" flexGrow={1} gap={0}>
			{searchMode ? (
				<Box flexDirection="column" marginBottom={1}>
					<Text bold>Search</Text>
					<Box flexDirection="row">
						<Text color={theme.colors.mutedForeground}>──────▶│</Text>
						<Box
							borderColor={theme.colors.focusRing}
							borderStyle="single"
							flexGrow={1}
							paddingX={1}
						>
							<Text>
								{query}
								<Text color={theme.colors.focusRing}>▌</Text>
							</Text>
						</Box>
					</Box>
					<Text dimColor>
						{filtered.length} results for &quot;{query}&quot;
					</Text>
				</Box>
			) : (
				<Text dimColor>
					{articles.length} articles · Refreshed {relativeNewsAge()}
					{loading ? ' …' : ''}
				</Text>
			)}
			<Box
				borderColor={theme.colors.border}
				borderStyle="single"
				flexDirection="column"
				marginTop={1}
				paddingX={1}
				width="100%"
			>
				{filtered.map((article, idx) => {
					const hi = idx === row;
					const selBg = hi ? theme.colors.selection : undefined;
					return (
						<Box flexDirection="column" key={article.id} width="100%">
							<Box
								backgroundColor={selBg}
								flexDirection="column"
								width="100%"
							>
								<Box flexDirection="row" width="100%">
									<Box
										flexDirection="row"
										flexGrow={1}
										flexShrink={1}
										minWidth={0}
									>
										<Text
											backgroundColor={selBg}
											color={hi ? theme.colors.success : theme.colors.foreground}
										>
											{hi ? '> ' : '  '}
										</Text>
										<Box flexGrow={1} flexShrink={1} minWidth={0}>
											<Text
												backgroundColor={selBg}
												bold={hi}
												wrap="truncate-end"
											>
												{article.title}
											</Text>
										</Box>
									</Box>
									<Box flexDirection="row" flexShrink={0} gap={1}>
										{article.tags.slice(0, 3).map(t => {
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
										})}
									</Box>
								</Box>
								<Box flexGrow={1} minWidth={0} paddingLeft={2} width="100%">
									<Text
										backgroundColor={selBg}
										color={theme.colors.mutedForeground}
										wrap="truncate-end"
									>
										{article.source} · {formatNewsTime(article.publishedAt)}
										{isBookmarked(article.id) ? ' · *' : ''}
									</Text>
								</Box>
							</Box>
							{idx < filtered.length - 1 && (
								<Text color={theme.colors.border}>
									{'─'.repeat(dividerWidth)}
								</Text>
							)}
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
