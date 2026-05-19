import {Box, Text} from 'ink';
import React, {useState} from 'react';
import {BigText} from '@/components/ui/big-text';
import {PasswordInput} from '@/components/ui/password-input';
import {TextInput} from '@/components/ui/text-input';
import {useTheme} from '@/components/ui/theme-provider';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {useAuth} from '@/source/context/auth-context';
import {APP_VERSION} from '@/source/version';

export function LoginScreen() {
	const theme = useTheme();
	const {rows, columns} = useTerminalViewport();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | undefined>();
	const [busy, setBusy] = useState(false);
	const {login} = useAuth();

	async function submit(): Promise<void> {
		setError(undefined);
		setBusy(true);
		try {
			await login(email, password);
		} catch (e: unknown) {
			const raw = e instanceof Error ? e.message : 'Login failed.';
			const msg =
				raw.toLowerCase().includes('invalid') || raw.includes('wrong')
					? 'Invalid credentials. Please try again.'
					: raw;
			setError(msg);
		}

		setBusy(false);
	}

	return (
		<Box
			borderColor={theme.colors.border}
			borderStyle="double"
			flexDirection="column"
			height={rows}
			width={columns}
		>
			<Box
				alignItems="center"
				flexDirection="column"
				flexGrow={1}
				justifyContent="center"
				paddingBottom={2}
				paddingX={2}
			>
				<BigText color={theme.colors.primary} font="shade">MFX</BigText>
				<Text color={theme.colors.mutedForeground}>
					Commodities & Forex Terminal · v{APP_VERSION}
				</Text>
				<Box height={1} />
				<Box
					borderColor={theme.colors.border}
					borderStyle="single"
					flexDirection="column"
					gap={1}
					paddingX={2}
					paddingY={1}
					width={52}
				>
					<Text bold color={theme.colors.foreground}>
						Sign in to your account
					</Text>
					{busy ? (
						<Text dimColor>Signing in...</Text>
					) : (
						<>
							<TextInput
								autoFocus
								borderStyle="single"
								id="mex-email"
								label="Email"
								onChange={setEmail}
								onSubmit={() => {
									/* tab to password */
								}}
								placeholder="trader@example.com"
								value={email}
								width={44}
							/>
							<PasswordInput
								borderStyle="single"
								id="mex-password"
								label="Password"
								mask="•"
								onChange={setPassword}
								onSubmit={() => {
									void submit();
								}}
								value={password}
								width={44}
							/>
							<Box marginTop={1}>
								<Text
									backgroundColor={theme.colors.success}
									color={theme.colors.successForeground}
								>
									{'  '}▶ Sign In{'  '}
								</Text>
							</Box>
						</>
					)}
				</Box>
				{error && (
					<Box marginTop={1}>
						<Text color={theme.colors.error}>! {error}</Text>
					</Box>
				)}
			</Box>
			<Box justifyContent="center" paddingBottom={1}>
				<Text color={theme.colors.mutedForeground} dimColor>
					Tab to move between fields · Enter to submit · Ctrl+C to quit
				</Text>
			</Box>
		</Box>
	);
}
