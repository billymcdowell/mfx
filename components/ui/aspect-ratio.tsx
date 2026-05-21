import {Box} from 'ink';
import type {ReactNode} from 'react';

export type AspectRatioProps = {
	readonly children: ReactNode;
	readonly ratio?: number;
	readonly width?: number;
};

export function AspectRatio({
	children,
	ratio = 16 / 9,
	width = 80,
}: AspectRatioProps) {
	const height = Math.round(width / ratio / 2);

	return (
		<Box width={width} height={height} overflow="hidden">
			{children}
		</Box>
	);
}
