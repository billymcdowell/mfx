import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type DigitSize = 'sm' | 'md' | 'lg';

export type DigitsProps = {
	readonly value: string | number;
	readonly color?: string;
	readonly size?: DigitSize;
};

const SEGMENTS_MD: Record<string, string[]> = {
	'': ['', '', '', '', ''],
	'-': ['', '', '─', '', ''],
	'.': ['', '', '', '', '●'],
	'0': ['╭─╮', '│', '│', '│', '╰─╯'],
	'1': ['│', '│', '│', '│', '│'],
	'2': ['╭─╮', '│', '╭─╯', '│', '╰─╴'],
	'3': ['╭─╮', '│', '─┤', '│', '╰─╯'],
	'4': ['╷', '│', '╰─┤', '│', '╵'],
	'5': ['╭─╴', '│', '╰─╮', '│', '╰─╯'],
	'6': ['╭─╴', '│', '├─╮', '│', '╰─╯'],
	'7': ['╭─╮', '│', '│', '│', '╵'],
	'8': ['╭─╮', '│', '├─┤', '│', '╰─╯'],
	'9': ['╭─╮', '│', '╰─┤', '│', '╰─╯'],
	':': ['', '●', '', '●', ''],
};

const SEGMENTS_LG: Record<string, string[]> = {
	'': ['', '', '', '', ''],
	'-': ['', '', '───', '', ''],
	'.': ['', '', '', '', '●'],
	'0': ['╭───╮', '│', '│', '│', '╰───╯'],
	'1': ['╷', '│', '│', '│', '╵'],
	'2': ['╭───╮', '│', '───╯', '│', '╰───╴'],
	'3': ['╭───╮', '│', '───┤', '│', '╰───╯'],
	'4': ['╷', '│', '╰───┤', '│', '╵'],
	'5': ['╭───╴', '│', '╰───╮', '│', '╰───╯'],
	'6': ['╭───╴', '│', '├───╮', '│', '╰───╯'],
	'7': ['╭───╮', '│', '│', '│', '╵'],
	'8': ['╭───╮', '│', '├───┤', '│', '╰───╯'],
	'9': ['╭───╮', '│', '╰───┤', '│', '╰───╯'],
	':': ['', '●', '', '●', ''],
};

const getSegmentMap = (size: DigitSize): Record<string, string[]> =>
	size === 'lg' ? SEGMENTS_LG : SEGMENTS_MD;

const getFallback = (size: DigitSize): string[] => {
	const w = size === 'lg' ? 5 : 3;
	const bar = '─'.repeat(w - 2);
	const side = `│${''.repeat(w - 2)}│`;
	return [`╭${bar}╮`, side, side, side, `╰${bar}╯`];
};

export function Digits({value, color, size = 'md'}: DigitsProps) {
	const theme = useTheme();
	const resolvedColor = color ?? theme.colors.primary;
	const string_ = String(value);

	if (size === 'sm') {
		return (
			<Text bold color={resolvedColor}>
				{string_}
			</Text>
		);
	}

	const segMap = getSegmentMap(size);
	const fallback = getFallback(size);
	const chars = [...string_];
	const rows = 5;

	return (
		<Box flexDirection="column">
			{Array.from({length: rows}, (_, rowIdx) => (
				<Box key={rowIdx} flexDirection="row">
					{chars.map((ch, charIdx) => {
						const segments = segMap[ch] ?? fallback;
						const rowString =
							segments[rowIdx] ?? ''.repeat(size === 'lg' ? 5 : 3);
						return (
							<Text key={charIdx} color={resolvedColor}>
								{rowString}
							</Text>
						);
					})}
				</Box>
			))}
		</Box>
	);
}
