import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type GitStatusProps = {
	readonly branch: string;
	readonly staged?: number;
	readonly modified?: number;
	readonly ahead?: number;
	readonly behind?: number;
};

export function GitStatus({
	branch,
	staged = 0,
	modified = 0,
	ahead = 0,
	behind = 0,
}: GitStatusProps) {
	const theme = useTheme();
	return (
		<Box flexDirection="column" gap={0}>
			<Text color={theme.colors.primary}>
				<Text bold>Branch </Text>
				{branch}
			</Text>
			<Text color={theme.colors.mutedForeground}>
				{ahead}↑ {behind}↓ · staged {staged} · modified {modified}
			</Text>
		</Box>
	);
}
