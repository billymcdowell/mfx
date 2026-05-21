import {Box, Text} from 'ink';
import React, {useState} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useFocus} from '@/hooks/use-focus';
import {useInput} from '@/hooks/use-input';

export type EmailInputProps = {
	readonly value?: string;
	readonly onChange?: (value: string) => void;
	readonly onSubmit?: (value: string) => void;
	readonly label?: string;
	readonly placeholder?: string;
	readonly autoFocus?: boolean;
	readonly id?: string;
	readonly width?: number;
	readonly suggestions?: string[];
};

const isValidEmail = (email: string): boolean => {
	const atIdx = email.indexOf('@');
	if (atIdx < 1) {
		return false;
	}

	const domain = email.slice(atIdx + 1);
	return domain.includes('.');
};

const getBorderColor = (
	error: string | undefined,
	isFocused: boolean,
	theme: ReturnType<typeof useTheme>,
): string => {
	if (error) {
		return theme.colors.error;
	}

	if (isFocused) {
		return theme.colors.focusRing;
	}

	return theme.colors.border;
};

export function EmailInput({
	value: controlledValue,
	onChange,
	onSubmit,
	label,
	placeholder = 'you@example.com',
	autoFocus = false,
	id,
	width = 40,
	suggestions = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
}: EmailInputProps) {
	const [internalValue, setInternalValue] = useState('');
	const [error, setError] = useState<string | undefined>();
	const theme = useTheme();
	const {isFocused} = useFocus({autoFocus, id});

	const value = controlledValue ?? internalValue;

	const applyChange = (newValue: string) => {
		if (onChange) {
			onChange(newValue);
		} else {
			setInternalValue(newValue);
		}
	};

	const getSuggestion = (value_: string): string | undefined => {
		const atIdx = value_.indexOf('@');
		if (atIdx === -1) {
			return undefined;
		}

		const afterAt = value_.slice(atIdx + 1);
		if (afterAt.length === 0) {
			return undefined;
		}

		const match = suggestions.find(s => s.startsWith(afterAt) && s !== afterAt);
		if (!match) {
			return undefined;
		}

		return match.slice(afterAt.length);
	};

	useInput((input, key) => {
		if (!isFocused) {
			return;
		}

		if (key.return) {
			if (!isValidEmail(value)) {
				setError('Please enter a valid email address');
				return;
			}

			setError(undefined);
			onSubmit?.(value);
			return;
		}

		if (key.tab) {
			const hint = getSuggestion(value);
			if (hint) {
				const newValue = value + hint;
				applyChange(newValue);
			}

			return;
		}

		if (key.backspace || key.delete) {
			setError(undefined);
			const newValue = value.slice(0, -1);
			applyChange(newValue);
			return;
		}

		if (key.escape || key.upArrow || key.downArrow) {
			return;
		}

		setError(undefined);
		const newValue = value + input;
		applyChange(newValue);
	});

	const borderColor = getBorderColor(error, isFocused, theme);

	const suggestion = getSuggestion(value);

	return (
		<Box flexDirection="column">
			{label && <Text bold>{label}</Text>}
			<Box
				borderStyle="round"
				borderColor={borderColor}
				width={width}
				paddingX={1}
			>
				<Text
					color={value ? theme.colors.foreground : theme.colors.mutedForeground}
				>
					{value || placeholder}
				</Text>
				{isFocused && suggestion && (
					<Text dimColor color={theme.colors.mutedForeground}>
						{suggestion}
					</Text>
				)}
				{isFocused && <Text color={theme.colors.focusRing}>█</Text>}
			</Box>
			{error && <Text color={theme.colors.error}>{error}</Text>}
			{isFocused && suggestion && (
				<Text dimColor color={theme.colors.mutedForeground}>
					Tab to complete: {value}
					{suggestion}
				</Text>
			)}
		</Box>
	);
}
