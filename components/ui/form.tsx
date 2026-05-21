import {Box, Text} from 'ink';
import {useState, useCallback, useMemo, createContext, useContext} from 'react';
import type {ReactNode} from 'react';

import {useTheme} from '@/components/ui/theme-provider';
import {useInput} from '@/hooks/use-input';

type FormContextValue = {
	values: Record<string, unknown>;
	errors: Record<string, string>;
	isDirty: boolean;
	setFieldValue: (name: string, value: unknown) => void;
	setFieldError: (name: string, error: string) => void;
};

const FormContext = createContext<FormContextValue>({
	errors: {
		/* Noop */
	},
	isDirty: false,
	setFieldError() {
		/* Noop */
	},
	setFieldValue() {
		/* Noop */
	},
	values: {
		/* Noop */
	},
});

export const useFormContext = () => useContext(FormContext);

export type FormField = {
	name: string;
	validate?: (value: unknown) => string | undefined;
};

export type FormProps = {
	readonly onSubmit?: (values: Record<string, unknown>) => void;
	readonly initialValues?: Record<string, unknown>;
	readonly fields?: FormField[];
	readonly children: ReactNode;
};

export function Form({
	onSubmit,
	initialValues = {
		/* Noop */
	},
	fields = [],
	children,
}: FormProps) {
	const theme = useTheme();
	const [values, setValues] = useState<Record<string, unknown>>(initialValues);
	const [errors, setErrors] = useState<Record<string, string>>({
		/* Noop */
	});
	const [isDirty, setIsDirty] = useState(false);

	const setFieldValue = useCallback((name: string, value: unknown) => {
		setValues(v => ({...v, [name]: value}));
		setIsDirty(true);
	}, []);

	const setFieldError = useCallback((name: string, error: string) => {
		setErrors(e => ({...e, [name]: error}));
	}, []);

	useInput((input, key) => {
		if (key.ctrl && input === 's') {
			const newErrors: Record<string, string> = {
				/* Noop */
			};
			for (const field of fields) {
				const error = field.validate
					? field.validate(values[field.name])
					: null;
				if (error) {
					newErrors[field.name] = error;
				}
			}

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			}

			onSubmit?.(values);
		}
	});

	const contextValue = useMemo(
		() => ({errors, isDirty, setFieldError, setFieldValue, values}),
		[errors, isDirty, setFieldError, setFieldValue, values],
	);

	return (
		<FormContext.Provider value={contextValue}>
			<Box flexDirection="column" gap={1}>
				{children}
				<Text dimColor color={theme.colors.mutedForeground}>
					Press Ctrl+S to submit
				</Text>
			</Box>
		</FormContext.Provider>
	);
}
