import {Box, Text} from 'ink';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';

export type InfoBoxProps = {
	readonly borderStyle?: 'single' | 'round' | 'double' | 'bold';
	readonly borderColor?: string;
	readonly padding?: [number, number];
	readonly width?: number | 'full';
	readonly children: ReactNode;
};

export type InfoBoxHeaderProps = {
	readonly icon?: string;
	readonly iconColor?: string;
	readonly label: string;
	readonly description?: string;
	readonly version?: string;
	readonly versionColor?: string;
};

export type InfoBoxRowProps = {
	readonly label: string;
	readonly value?: string;
	readonly valueDetail?: string;
	readonly valueColor?: string;
	readonly bold?: boolean;
	readonly tree?: boolean;
	readonly color?: string;
};

function InfoBoxRoot({
	borderStyle = 'single',
	borderColor,
	padding = [0, 1],
	width,
	children,
}: InfoBoxProps) {
	const theme = useTheme();
	const resolvedBorderColor = borderColor ?? theme.colors.border;

	return (
		<Box
			borderStyle={borderStyle}
			borderColor={resolvedBorderColor}
			flexDirection="column"
			paddingX={padding[1]}
			paddingY={padding[0]}
			width={width === 'full' ? undefined : width}
			flexGrow={width === 'full' ? 1 : undefined}
		>
			{children}
		</Box>
	);
}

function InfoBoxHeader({
	icon,
	iconColor = 'green',
	label,
	description,
	version,
	versionColor = 'cyan',
}: InfoBoxHeaderProps) {
	return (
		<Box flexDirection="row" gap={1}>
			{icon && <Text color={iconColor}>{icon}</Text>}
			<Text bold>{label}</Text>
			{description && <Text dimColor>{description}</Text>}
			{version && <Text color={versionColor}>{version}</Text>}
		</Box>
	);
}

function InfoBoxRow({
	label,
	value,
	valueDetail,
	valueColor,
	bold: boldValue = false,
	tree = false,
	color,
}: InfoBoxRowProps) {
	const theme = useTheme();
	const prefix = tree ? '└' : '';

	return (
		<Box flexDirection="row">
			<Text color={color ?? theme.colors.mutedForeground}>
				{prefix}
				{label}
				{value ? ':' : ''}
			</Text>
			{value && (
				<Text bold={boldValue} color={color}>
					{value}
				</Text>
			)}
			{valueDetail && (
				<Text color={valueColor ?? 'cyan'}>{`  ${valueDetail}`}</Text>
			)}
		</Box>
	);
}

function InfoBoxTreeRow(props: Omit<InfoBoxRowProps, 'tree'>) {
	return <InfoBoxRow {...props} tree />;
}

export const InfoBox = Object.assign(InfoBoxRoot, {
	Header: InfoBoxHeader,
	Row: InfoBoxRow,
	TreeRow: InfoBoxTreeRow,
});
