import {Box} from 'ink';

export type SpacerProps = {
	readonly size?: number;
	readonly direction?: 'horizontal' | 'vertical';
};

export function Spacer({size, direction = 'horizontal'}: SpacerProps) {
	if (size === undefined) {
		return <Box flexGrow={1} />;
	}

	if (direction === 'vertical') {
		return <Box height={size} />;
	}

	return <Box width={size} />;
}
