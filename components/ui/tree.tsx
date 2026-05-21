import {Box, Text} from 'ink';
import React, {useState, useMemo} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export type TreeNode = {
	key: string;
	label: string;
	children?: TreeNode[];
	icon?: string;
};

export type TreeProps = {
	readonly nodes: TreeNode[];
	readonly onSelect?: (node: TreeNode) => void;
	readonly defaultExpanded?: string[];
	readonly expandedIcon?: string;
	readonly collapsedIcon?: string;
	readonly leafIcon?: string;
};

type FlatNode = {
	node: TreeNode;
	depth: number;
	hasChildren: boolean;
};

const flattenTree = (
	nodes: TreeNode[],
	expandedKeys: Set<string>,
	depth = 0,
): FlatNode[] => {
	const result: FlatNode[] = [];
	for (const node of nodes) {
		const hasChildren = Boolean(node.children && node.children.length > 0);
		result.push({depth, hasChildren, node});
		if (hasChildren && expandedKeys.has(node.key)) {
			const childFlat = flattenTree(
				node.children ?? [],
				expandedKeys,
				depth + 1,
			);
			result.push(...childFlat);
		}
	}

	return result;
};

export function Tree({
	nodes,
	onSelect,
	defaultExpanded = [],
	expandedIcon = '▼',
	collapsedIcon = '▶',
	leafIcon = '•',
}: TreeProps) {
	const theme = useTheme();
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
		new Set(defaultExpanded),
	);
	const [activeIndex, setActiveIndex] = useState(0);

	const flatNodes = useMemo(
		() => flattenTree(nodes, expandedKeys),
		[nodes, expandedKeys],
	);

	useInput((_input, key) => {
		const current = flatNodes[activeIndex];

		if (key.upArrow) {
			setActiveIndex(i => Math.max(0, i - 1));
		} else if (key.downArrow) {
			setActiveIndex(i => Math.min(flatNodes.length - 1, i + 1));
		} else if (key.rightArrow || _input === '') {
			if (current?.hasChildren && !expandedKeys.has(current.node.key)) {
				setExpandedKeys(previous => new Set([...previous, current.node.key]));
			}
		} else if (key.leftArrow) {
			if (current?.hasChildren && expandedKeys.has(current.node.key)) {
				setExpandedKeys(previous => {
					const next = new Set(previous);
					next.delete(current.node.key);
					return next;
				});
			}
		} else if (key.return && current) {
			onSelect?.(current.node);
		}
	});

	return (
		<Box flexDirection="column">
			{flatNodes.map(({node, depth, hasChildren}, idx) => {
				const isActive = idx === activeIndex;
				const isExpanded = expandedKeys.has(node.key);

				const prefix = ''.repeat(depth);
				let indicator: string;
				if (hasChildren) {
					indicator = isExpanded ? expandedIcon : collapsedIcon;
				} else {
					indicator = node.icon ?? leafIcon;
				}

				return (
					<Box key={node.key} flexDirection="row">
						<Text>{prefix}</Text>
						<Text
							color={
								isActive ? theme.colors.primary : theme.colors.mutedForeground
							}
						>
							{indicator}
						</Text>
						<Text
							bold={isActive}
							color={isActive ? theme.colors.primary : theme.colors.foreground}
						>
							{node.label}
						</Text>
					</Box>
				);
			})}
		</Box>
	);
}
