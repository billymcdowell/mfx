import {Box} from 'ink';
import type {ReactNode} from 'react';

export type ChatThreadProps = {
	readonly maxHeight?: number;
	readonly autoScroll?: boolean;
	readonly children?: ReactNode;
};

export function ChatThread({
	maxHeight,
	autoScroll = true,
	children,
}: ChatThreadProps) {
	void autoScroll;

	const containerProps = maxHeight
		? {height: maxHeight, overflow: 'hidden' as const}
		: {
				/* Noop */
		  };

	return (
		<Box flexDirection="column" {...containerProps}>
			{children}
		</Box>
	);
}
