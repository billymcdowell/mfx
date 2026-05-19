import {Box, Text} from 'ink';
import React, {useEffect, useState} from 'react';
import {Confirm} from '@/components/ui/confirm';
import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';
import {useBookmarks} from '@/source/context/bookmarks-context';
import {useChromeGate} from '@/source/context/chrome-gate-context';
import {useRouter} from '@/source/context/router-context';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {newsTagStyle} from '@/source/lib/news-tag-colors';
import {formatRelativeSaved} from '@/source/lib/relative-time';

function inferBookmarkTag(title: string): string {
	const tl = title.toLowerCase();
	if (tl.includes('gold')) {
		return 'GOLD';
	}

	if (tl.includes('oil') || tl.includes('opec')) {
		return 'OIL';
	}

	if (tl.includes('eur')) {
		return 'EUR/USD';
	}

	if (tl.includes('fed') || tl.includes('rate')) {
		return 'MACRO';
	}

	return 'NOTE';
}

export function BookmarksScreen({mainInputActive}: {mainInputActive: boolean}) {
	const theme = useTheme();
	const {mainInnerWidth} = useTerminalViewport();
	const {items, remove} = useBookmarks();
	const {navigate} = useRouter();
	const [row, setRow] = useState(0);
	const [pendingDelete, setPendingDelete] = useState<string | undefined>();
	const {setBlocked} = useChromeGate();

	useEffect(() => {
		setRow(r => Math.min(r, Math.max(items.length - 1, 0)));
	}, [items.length]);

	useEffect(() => {
		setBlocked(Boolean(pendingDelete));
		return () => {
			setBlocked(false);
		};
	}, [pendingDelete, setBlocked]);

	useInput(
		(input, key) => {
			if (pendingDelete || !mainInputActive) {
				return;
			}

			if (key.upArrow || input === 'k' || input === 'K') {
				setRow(r => Math.max(0, r - 1));
			} else if (key.downArrow || input === 'j' || input === 'J') {
				setRow(r => Math.min(Math.max(0, items.length - 1), r + 1));
			} else if (key.return) {
				const b = items[row];
				if (b) {
					navigate('articleDetail', {articleId: b.id});
				}
			} else if (input === 'd' || input === 'D') {
				const b = items[row];
				if (b) {
					setPendingDelete(b.id);
				}
			}
		},
		{isActive: mainInputActive && !pendingDelete},
	);

	const current = items[row];
	const dividerWidth = Math.max(12, mainInnerWidth - 6);

	return (
		<Box flexDirection="column" flexGrow={1} gap={0}>
			<Box
				borderColor={theme.colors.border}
				borderStyle="single"
				flexDirection="column"
				paddingX={1}
				width="100%"
			>
				{items.length === 0 ? (
					<Text dimColor>Nothing saved yet — press [b] in News.</Text>
				) : (
					items.map((b, idx) => {
						const hi = idx === row;
						const tag = inferBookmarkTag(b.title);
						const st = newsTagStyle(tag);
						return (
							<Box flexDirection="column" key={b.id} width="100%">
								<Box
									backgroundColor={hi ? theme.colors.selection : undefined}
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
												backgroundColor={hi ? theme.colors.selection : undefined}
												color={
													hi ? theme.colors.success : theme.colors.foreground
												}
											>
												{hi ? '> ' : '  '}
											</Text>
											<Box flexGrow={1} flexShrink={1} minWidth={0}>
												<Text
													backgroundColor={hi ? theme.colors.selection : undefined}
													bold={hi}
													wrap="truncate-end"
												>
													{b.title}
												</Text>
											</Box>
										</Box>
										<Box flexShrink={0}>
											<Text backgroundColor={st.backgroundColor} color={st.color}>
												{` ${tag} `}
											</Text>
										</Box>
									</Box>
									<Box flexGrow={1} minWidth={0} paddingLeft={2} width="100%">
										<Text
											backgroundColor={hi ? theme.colors.selection : undefined}
											color={theme.colors.mutedForeground}
											wrap="truncate-end"
										>
											{b.source} · Saved {formatRelativeSaved(b.savedAt)}
										</Text>
									</Box>
								</Box>
								{idx < items.length - 1 && (
									<Text color={theme.colors.border}>
										{'─'.repeat(dividerWidth)}
									</Text>
								)}
							</Box>
						);
					})
				)}
			</Box>
			{items.length > 0 && (
				<Box marginTop={1}>
					<Text dimColor>{items.length} saved articles</Text>
				</Box>
			)}
			{pendingDelete && current && (
				<Box marginTop={1}>
					<Confirm
						cancelLabel="Cancel"
						confirmLabel="Yes, delete"
						message={`Remove bookmark?\n"${current.title.slice(0, 52)}…"`}
						onCancel={() => {
							setPendingDelete(undefined);
						}}
						onConfirm={() => {
							remove(pendingDelete);
							setPendingDelete(undefined);
							setRow(r => Math.max(0, Math.min(r, items.length - 2)));
						}}
						variant="danger"
					/>
				</Box>
			)}
		</Box>
	);
}
