import {Box, useStdout} from 'ink';
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

/**
 * Rows consumed outside the main pane scroll region (outer frame, pane header,
 * footers, padding). Tune with `authenticated-shell` layout.
 */
const SHELL_CHROME_ROWS = 8;

/** Sidebar width (see AuthenticatedShell) plus main column horizontal padding. */
const MAIN_COLUMN_WIDTH_OFFSET = 23;

export type TerminalViewportValue = {
	columns: number;
	rows: number;
	/** Inner width of the main pane (right of sidebar). */
	mainInnerWidth: number;
	/** Vertical space for the shell row containing sidebar + main content. */
	shellMainColumnHeight: number;
};

const TerminalViewportContext = createContext<
	TerminalViewportValue | undefined
>(undefined);

export function TerminalViewportProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const {stdout} = useStdout();
	const [columns, setColumns] = useState(() => stdout.columns ?? 80);
	const [rows, setRows] = useState(() => stdout.rows ?? 24);

	useEffect(() => {
		const onResize = () => {
			setColumns(stdout.columns ?? 80);
			setRows(stdout.rows ?? 24);
		};

		stdout.on('resize', onResize);
		return () => {
			stdout.off('resize', onResize);
		};
	}, [stdout]);

	const value = useMemo<TerminalViewportValue>(() => {
		const shellMainColumnHeight = Math.max(6, rows - SHELL_CHROME_ROWS);
		return {
			columns,
			mainInnerWidth: Math.max(40, columns - MAIN_COLUMN_WIDTH_OFFSET),
			rows,
			shellMainColumnHeight,
		};
	}, [columns, rows]);

	return (
		<TerminalViewportContext.Provider value={value}>
			<Box flexDirection="column" height={rows} width={columns}>
				<Box flexDirection="column" flexGrow={1} width={columns}>
					{children}
				</Box>
			</Box>
		</TerminalViewportContext.Provider>
	);
}

export function useTerminalViewport(): TerminalViewportValue {
	const v = useContext(TerminalViewportContext);
	if (!v) {
		throw new Error(
			'useTerminalViewport must be used inside TerminalViewportProvider',
		);
	}

	return v;
}
