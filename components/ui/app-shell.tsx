import {Box, Text} from 'ink';
import React, {useState} from 'react';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

export type AppShellProps = {
	readonly children: ReactNode;
	readonly fullscreen?: boolean;
};

export type AppShellHeaderProps = {
	readonly children: ReactNode;
};

export type AppShellTipProps = {
	readonly children: ReactNode;
};

export type AppShellInputProps = {
	readonly value?: string;
	readonly onChange?: (value: string) => void;
	readonly onSubmit?: (value: string) => void;
	readonly placeholder?: string;
	readonly borderStyle?: 'single' | 'double' | 'round' | 'bold';
	readonly borderColor?: string;
	readonly prefix?: string;
};

export type AppShellContentProps = {
	readonly children: ReactNode;
	readonly autoscroll?: boolean;
	readonly height?: number;
};

export type AppShellHintsProps = {
	readonly items?: string[];
	readonly children?: ReactNode;
};

function AppShellRoot({children}: AppShellProps) {
	return (
		<Box flexDirection="column" flexGrow={1}>
			{children}
		</Box>
	);
}

function AppShellHeader({children}: AppShellHeaderProps) {
	return <Box flexDirection="column">{children}</Box>;
}

function AppShellTip({children}: AppShellTipProps) {
	return (
		<Box paddingLeft={2} paddingY={0}>
			<Text dimColor>Tip:</Text>
			<Text dimColor>{children}</Text>
		</Box>
	);
}

function AppShellInput({
	value: controlledValue,
	onChange,
	onSubmit,
	placeholder = 'Type something...',
	borderStyle = 'single',
	borderColor,
	prefix = '>',
}: AppShellInputProps) {
	const [internalValue, setInternalValue] = useState('');
	const theme = useTheme();
	const value = controlledValue ?? internalValue;

	useInput((input, key) => {
		if (key.return) {
			onSubmit?.(value);
			if (!controlledValue) {
				setInternalValue('');
			}

			return;
		}

		if (key.backspace || key.delete) {
			const next = value.slice(0, -1);
			if (onChange) {
				onChange(next);
			} else {
				setInternalValue(next);
			}

			return;
		}

		if (key.escape || key.upArrow || key.downArrow || key.tab) {
			return;
		}

		const next = value + input;
		if (onChange) {
			onChange(next);
		} else {
			setInternalValue(next);
		}
	});

	return (
		<Box
			borderStyle={borderStyle}
			borderColor={borderColor ?? theme.colors.border}
			flexDirection="row"
			paddingX={1}
		>
			{prefix && (
				<Text bold color={theme.colors.primary}>
					{`${prefix} `}
				</Text>
			)}
			<Text>{value || <Text dimColor>{placeholder}</Text>}</Text>
			<Text color={theme.colors.focusRing}>█</Text>
		</Box>
	);
}

function AppShellContent({children, height = 20}: AppShellContentProps) {
	const [scrollTop, setScrollTop] = useState(0);

	useInput((_input, key) => {
		if (key.upArrow) {
			setScrollTop(s => Math.max(0, s - 1));
		} else if (key.downArrow) {
			setScrollTop(s => s + 1);
		}
	});

	return (
		<Box flexDirection="row" height={height} overflow="hidden">
			<Box flexGrow={1} flexDirection="column" marginTop={-scrollTop}>
				{children}
			</Box>
		</Box>
	);
}

function AppShellHints({items, children}: AppShellHintsProps) {
	const theme = useTheme();
	const content = items ? items.join('|') : children;
	return (
		<Box paddingX={1}>
			<Text dimColor color={theme.colors.mutedForeground}>
				{content as string}
			</Text>
		</Box>
	);
}

export const AppShell = Object.assign(AppShellRoot, {
	Content: AppShellContent,
	Header: AppShellHeader,
	Hints: AppShellHints,
	Input: AppShellInput,
	Tip: AppShellTip,
});
