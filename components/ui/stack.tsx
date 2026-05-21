import {Box} from 'ink';
import type {ReactNode} from 'react';

export type StackProps = {
	readonly direction?: 'vertical' | 'horizontal';
	readonly gap?: number;
	readonly children: ReactNode;
	readonly width?: number | string;
	readonly height?: number | string;
	readonly alignItems?: 'flex-start' | 'center' | 'flex-end';
	readonly justifyContent?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'space-between'
		| 'space-around';
};

export function Stack({
	direction = 'vertical',
	gap = 0,
	children,
	width,
	height,
	alignItems,
	justifyContent,
}: StackProps) {
	return (
		<Box
			flexDirection={direction === 'vertical' ? 'column' : 'row'}
			gap={gap}
			width={width as number}
			height={height as number}
			alignItems={alignItems}
			justifyContent={justifyContent}
		>
			{children}
		</Box>
	);
}
