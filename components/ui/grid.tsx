import {Box} from 'ink';
import React, {Children} from 'react';
import type {ReactNode} from 'react';

export type GridProps = {
	readonly columns: number;
	readonly gap?: number;
	readonly children: ReactNode;
};

export function Grid({columns, gap = 0, children}: GridProps) {
	const items = Children.toArray(children);
	const rows: ReactNode[][] = [];

	for (let i = 0; i < items.length; i += columns) {
		rows.push(items.slice(i, i + columns));
	}

	return (
		<Box flexDirection="column" gap={gap}>
			{rows.map((row, rowIdx) => (
				<Box key={rowIdx} flexDirection="row" gap={gap}>
					{row.map((cell, colIdx) => (
						<Box key={colIdx} flexGrow={1}>
							{cell}
						</Box>
					))}
				</Box>
			))}
		</Box>
	);
}
