import {Box, Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type Shortcut = {
	key: string;
	description: string;
	category?: string;
};

export type KeyboardShortcutsProps = {
	readonly shortcuts: Shortcut[];
	readonly columns?: number;
	readonly title?: string;
};

function KeyLabel({
	label,
	color,
}: {
	readonly label: string;
	readonly color: string;
}) {
	return (
		<Box borderStyle="single" borderColor={color} paddingX={1}>
			<Text bold color={color}>
				{label}
			</Text>
		</Box>
	);
}

function ShortcutRow({
	shortcut,
	keyColor,
	descColor,
}: {
	readonly shortcut: Shortcut;
	readonly keyColor: string;
	readonly descColor: string;
}) {
	return (
		<Box gap={1} alignItems="center">
			<KeyLabel label={shortcut.key} color={keyColor} />
			<Text color={descColor}>{shortcut.description}</Text>
		</Box>
	);
}

function ShortcutGrid({
	items,
	columns,
	theme,
}: {
	readonly items: Shortcut[];
	readonly columns: number;
	readonly theme: ReturnType<typeof useTheme>;
}) {
	const rows: Shortcut[][] = [];
	for (let i = 0; i < items.length; i += columns) {
		rows.push(items.slice(i, i + columns));
	}

	return (
		<Box flexDirection="column" gap={0}>
			{rows.map((row, ri) => (
				<Box key={ri} gap={3}>
					{row.map((s, ci) => (
						<ShortcutRow
							key={ci}
							shortcut={s}
							keyColor={theme.colors.primary}
							descColor={theme.colors.foreground}
						/>
					))}
				</Box>
			))}
		</Box>
	);
}

export function KeyboardShortcuts({
	shortcuts,
	columns = 1,
	title,
}: KeyboardShortcutsProps) {
	const theme = useTheme();

	const hasCategories = shortcuts.some(s => s.category);

	if (hasCategories) {
		const grouped: Record<string, Shortcut[]> = {
			/* Noop */
		};
		for (const s of shortcuts) {
			const cat = s.category ?? 'General';
			if (!grouped[cat]) {
				grouped[cat] = [];
			}

			grouped[cat].push(s);
		}

		return (
			<Box flexDirection="column" gap={1}>
				{title && (
					<Text bold color={theme.colors.primary}>
						⌨ {title}
					</Text>
				)}
				{Object.entries(grouped).map(([category, items]) => (
					<Box key={category} flexDirection="column" gap={0}>
						<Text bold underline color={theme.colors.mutedForeground}>
							{category}
						</Text>
						{columns > 1 ? (
							<ShortcutGrid items={items} columns={columns} theme={theme} />
						) : (
							items.map((s, i) => (
								<ShortcutRow
									key={i}
									shortcut={s}
									keyColor={theme.colors.primary}
									descColor={theme.colors.foreground}
								/>
							))
						)}
					</Box>
				))}
			</Box>
		);
	}

	return (
		<Box flexDirection="column" gap={1}>
			{title && (
				<Text bold color={theme.colors.primary}>
					⌨ {title}
				</Text>
			)}
			{columns > 1 ? (
				<ShortcutGrid items={shortcuts} columns={columns} theme={theme} />
			) : (
				shortcuts.map((s, i) => (
					<ShortcutRow
						key={i}
						shortcut={s}
						keyColor={theme.colors.primary}
						descColor={theme.colors.foreground}
					/>
				))
			)}
		</Box>
	);
}
