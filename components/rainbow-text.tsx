import React, {useState, useEffect} from 'react';
import {Text, Box} from 'ink';
import figlet from 'figlet';

const BLOCK = '█';

type Cell = {filled: boolean; baseHue: number};
type Grid = Cell[][];

function hslToHex(h: number, s: number, l: number): string {
	h = ((h % 360) + 360) % 360;
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * col)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

function buildGrid(art: string): Grid {
	const rows = art.split('\n');
	return rows.map((row: string, rowIdx: number) =>
		[...row].map((ch, colIdx) => {
			if (ch === '#') {
				const hue = (colIdx * 7 + rowIdx * 23) % 360;
				return {filled: true, baseHue: hue};
			}
			return {filled: false, baseHue: 0};
		}),
	);
}

export function RainbowTitle({text, fps = 24}: {text: string; fps?: number}) {
	const [grid, setGrid] = useState<Grid | null>(null);
	const [tick, setTick] = useState(0);

	useEffect(() => {
		figlet.text(text, {font: 'Banner3'}, (err, result) => {
			if (!err && result) setGrid(buildGrid(result));
		});
	}, [text]);

	useEffect(() => {
		const id = setInterval(() => setTick(t => t + 1), Math.floor(1000 / fps));
		return () => clearInterval(id);
	}, [fps]);

	if (!grid) return <Text color="gray">Loading…</Text>;

	const hueShift = tick * 3;

	return (
		<Box flexDirection="column">
			{grid.map((row, rIdx) => (
				<Box key={rIdx} flexDirection="row">
					{row.map((cell, cIdx) => {
						if (!cell.filled) return <Text key={cIdx}> </Text>;
						const hue = (cell.baseHue + hueShift) % 360;
						return (
							<Text key={cIdx} color={hslToHex(hue, 100, 55)} bold>
								{BLOCK}
							</Text>
						);
					})}
				</Box>
			))}
		</Box>
	);
}
