import {Box, Text} from 'ink';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';

export type HeadingLevel = 1 | 2 | 3 | 4;

export type HeadingProps = {
	readonly level?: HeadingLevel;
	readonly children: ReactNode;
	readonly color?: string;
	readonly prefix1?: string;
	readonly prefix2?: string;
	readonly prefix3?: string;
	readonly uppercase?: boolean;
};

export function Heading({
	level = 1,
	children,
	color,
	prefix1 = '██',
	prefix2 = '▌',
	prefix3 = '›',
	uppercase = true,
}: HeadingProps) {
	const theme = useTheme();
	const resolvedColor = color ?? theme.colors.primary;

	switch (level) {
		case 1: {
			return (
				<Box>
					<Text bold color={resolvedColor}>
						{prefix1}
					</Text>
					<Text bold color={resolvedColor}>
						{uppercase && typeof children === 'string'
							? children.toUpperCase()
							: children}
					</Text>
				</Box>
			);
		}

		case 2: {
			return (
				<Box>
					<Text bold color={resolvedColor}>
						{prefix2}
					</Text>
					<Text bold color={resolvedColor}>
						{children}
					</Text>
				</Box>
			);
		}

		case 3: {
			return (
				<Box>
					<Text bold>{prefix3}</Text>
					<Text bold>{children}</Text>
				</Box>
			);
		}

		case 4: {
			return (
				<Box>
					<Text underline dimColor>
						{children}
					</Text>
				</Box>
			);
		}

		default: {
			return (
				<Box>
					<Text>{children}</Text>
				</Box>
			);
		}
	}
}
