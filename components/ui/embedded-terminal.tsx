import {Box, Text} from 'ink';
import {useEffect, useMemo, useState} from 'react';
import stripAnsi from 'strip-ansi';

type IPty = {
	kill: () => void;
	onData: (cb: (data: string) => void) => void;
	onExit: (cb: (e: {exitCode: number}) => void) => void;
};

type NodePtyModule = {
	spawn: (
		command: string,
		args: string[],
		options: {cols: number; cwd?: string; name: string; rows: number},
	) => IPty;
};

export type EmbeddedTerminalProps = {
	readonly command: string;
	readonly args?: string[];
	readonly cwd?: string;
	readonly width?: number;
	readonly height?: number;
	readonly onExit?: (code: number) => void;
};

/**
 * Renders a pseudo-terminal session inside the TUI.
 * Requires optional dependency `node-pty` (native build).
 */
export function EmbeddedTerminal({
	command,
	args = [],
	cwd,
	width = 80,
	height = 24,
	onExit,
}: EmbeddedTerminalProps) {
	const [raw, setRaw] = useState('');
	const [error, setError] = useState<string | undefined>();

	useEffect(() => {
		let p: IPty | undefined;
		let cancelled = false;

		(async () => {
			try {
				const loadPty = new Function(
					'return import("node-pty")',
				) as () => Promise<NodePtyModule>;
				const mod = await loadPty();
				if (cancelled) {
					return;
				}

				const pty = mod.spawn(command, args, {
					cols: width,
					cwd,
					name: 'xterm-color',
					rows: height,
				});
				p = pty;
				pty.onData((d: string) => {
					setRaw(previous => (previous + d).slice(-500_000));
				});
				pty.onExit((e: {exitCode: number}) => {
					onExit?.(e.exitCode);
				});
			} catch {
				setError(
					'Install optional peer: node-pty (native build required for your platform).',
				);
			}
		})();

		return () => {
			cancelled = true;
			if (p) {
				p.kill();
			}
		};
	}, [command, args, cwd, width, height, onExit]);

	const lines = useMemo(
		() => stripAnsi(raw).split('').slice(-height),
		[raw, height],
	);

	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="cyan"
			width={width}
		>
			{error ? (
				<Text color="red">{error}</Text>
			) : (
				lines.map((line, i) => <Text key={i}>{line}</Text>)
			)}
		</Box>
	);
}
