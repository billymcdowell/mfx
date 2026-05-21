import {Box} from 'ink';
import type {ReactNode} from 'react';

export type CenterProps = {
	readonly children: ReactNode;
	readonly axis?: 'both' | 'horizontal' | 'vertical';
};

export function Center({children, axis = 'both'}: CenterProps) {
	const justifyContent =
		axis === 'both' || axis === 'horizontal' ? 'center' : undefined;
	const alignItems =
		axis === 'both' || axis === 'vertical' ? 'center' : undefined;

	return (
		<Box flexGrow={1} justifyContent={justifyContent} alignItems={alignItems}>
			{children}
		</Box>
	);
}
