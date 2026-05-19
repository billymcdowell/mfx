import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export interface SidebarItem {
	key: string;
	label: string;
	icon?: string;
	badge?: string | number;
	children?: SidebarItem[];
}

export interface SidebarProps {
	items: SidebarItem[];
	activeKey?: string;
	onSelect?: (key: string) => void;
	collapsed?: boolean;
	width?: number;
	title?: string;
	brandedTitle?: boolean;
	inputActive?: boolean;
}

const flattenItems = (
	items: SidebarItem[],
	expandedKeys: Set<string>,
	depth = 0,
): {item: SidebarItem; depth: number}[] => {
	const result: {item: SidebarItem; depth: number}[] = [];
	for (const item of items) {
		result.push({depth, item});
		if (item.children && expandedKeys.has(item.key)) {
			result.push(...flattenItems(item.children, expandedKeys, depth + 1));
		}
	}

	return result;
};

export const Sidebar = ({
	items,
	activeKey,
	onSelect,
	collapsed = false,
	width = 12,
	title,
	brandedTitle = false,
	inputActive = true,
}: SidebarProps) => {
	const theme = useTheme();
	const [focusIndex, setFocusIndex] = useState(0);
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

	const effectiveWidth = collapsed ? 3 : width;
	const flatItems = flattenItems(items, expandedKeys);

	const toggleExpand = (key: string) => {
		setExpandedKeys(prev => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}

			return next;
		});
	};

	useInput(
		(input, key) => {
			const up = key.upArrow || input === 'k' || input === 'K';
			const down = key.downArrow || input === 'j' || input === 'J';
			if (up) {
				setFocusIndex(prev => Math.max(0, prev - 1));
			} else if (down) {
				setFocusIndex(prev => Math.min(flatItems.length - 1, prev + 1));
			} else if (key.return) {
				const entry = flatItems[focusIndex];
				if (!entry) {
					return;
				}

				if (entry.item.children && entry.item.children.length > 0) {
					toggleExpand(entry.item.key);
				} else {
					onSelect?.(entry.item.key);
				}
			} else if (key.rightArrow) {
				const entry = flatItems[focusIndex];
				if (entry?.item.children && entry.item.children.length > 0) {
					setExpandedKeys(prev => new Set([...prev, entry.item.key]));
				} else if (entry) {
					onSelect?.(entry.item.key);
				}
			} else if (key.leftArrow) {
				const entry = flatItems[focusIndex];
				if (entry?.item.children && expandedKeys.has(entry.item.key)) {
					setExpandedKeys(prev => {
						const next = new Set(prev);
						next.delete(entry.item.key);
						return next;
					});
				}
			}
		},
		{isActive: inputActive},
	);

	return (
		<Box
			borderColor={theme.colors.border}
			borderStyle="single"
			flexDirection="column"
			height="100%"
			paddingX={1}
			paddingY={0}
			width={effectiveWidth}
		>
			{title && !collapsed && brandedTitle && (
				<Box flexDirection="column" marginBottom={1}>
					<Text bold color={theme.colors.foreground}>
						{title}
					</Text>
					<Text color={theme.colors.border}>
						{'─'.repeat(Math.max(4, effectiveWidth - 2))}
					</Text>
				</Box>
			)}
			{title && !collapsed && !brandedTitle && (
				<Box marginBottom={1}>
					<Text bold color={theme.colors.primary}>
						{title}
					</Text>
				</Box>
			)}
			{flatItems.map(({item, depth}, idx) => {
				const isFocused = idx === focusIndex;
				const isActive = item.key === activeKey;
				const indent = collapsed ? 0 : depth * 2;
				const hasChildren = item.children && item.children.length > 0;
				const isExpanded = expandedKeys.has(item.key);

				if (collapsed) {
					let collapsedColor: string;
					if (isActive) {
						collapsedColor = theme.colors.success;
					} else if (isFocused) {
						collapsedColor = theme.colors.foreground;
					} else {
						collapsedColor = theme.colors.mutedForeground;
					}

					return (
						<Box key={item.key} paddingX={0}>
							<Text bold={isActive} color={collapsedColor}>
								{item.icon ?? item.label.charAt(0)}
							</Text>
						</Box>
					);
				}

				const rowBg = isActive ? theme.colors.selection : undefined;
				const chevron = isActive ? '❯ ' : '  ';

				return (
					<Box backgroundColor={rowBg} flexDirection="row" key={item.key}>
						<Text color={isActive ? theme.colors.success : 'transparent'}>
							{chevron}
						</Text>
						{indent > 0 && <Text>{''.repeat(indent)}</Text>}
						{hasChildren ? (
							<Text color={theme.colors.mutedForeground}>
								{isExpanded ? '▾ ' : '▸ '}
							</Text>
						) : (
							<Text />
						)}
						{item.icon && (
							<Text
								color={
									isActive
										? theme.colors.foreground
										: theme.colors.mutedForeground
								}
							>
								{item.icon}
							</Text>
						)}
						<Text
							bold={isActive || isFocused}
							color={
								isActive
									? theme.colors.foreground
									: isFocused
									? theme.colors.foreground
									: theme.colors.mutedForeground
							}
						>
							{item.label}
						</Text>
						{item.badge !== undefined && (
							<Box marginLeft={1}>
								<Text color={theme.colors.primary}>{item.badge}</Text>
							</Box>
						)}
					</Box>
				);
			})}
		</Box>
	);
};
