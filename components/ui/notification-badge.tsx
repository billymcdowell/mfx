import {Text} from 'ink';

import {useTheme} from '@/components/ui/theme-provider';

export type NotificationBadgeProps = {
	readonly count: number;
	readonly color?: string;
};

export function NotificationBadge({count, color}: NotificationBadgeProps) {
	const theme = useTheme();
	if (count === 0) {
		return null;
	}

	const resolvedColor = color ?? theme.colors.error;
	return <Text color={resolvedColor}>[{count}]</Text>;
}
