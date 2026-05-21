import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type DefinitionItem = {
	term: string;
	description: string;
};

export type DefinitionProps = {
	readonly items: DefinitionItem[];
	readonly termColor?: string;
};

export function Definition({items, termColor}: DefinitionProps) {
	const theme = useTheme();
	const resolvedTermColor = termColor ?? theme.colors.primary;

	return (
		<Box flexDirection="column">
			{items.map((item, idx) => (
				<Box
					key={idx}
					flexDirection="column"
					marginBottom={idx < items.length - 1 ? 1 : 0}
				>
					<Text bold color={resolvedTermColor}>
						{item.term}
					</Text>
					<Box paddingLeft={2}>
						<Text color={theme.colors.foreground}>{item.description}</Text>
					</Box>
				</Box>
			))}
		</Box>
	);
}
