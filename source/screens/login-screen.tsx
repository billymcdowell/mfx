import {Box, Text} from 'ink';
import React, {useState} from 'react';
import {BigText} from '@/components/ui/big-text';
import {PasswordInput} from '@/components/ui/password-input';
import {TextInput} from '@/components/ui/text-input';
import {useTheme} from '@/components/ui/theme-provider';
import {useTerminalViewport} from '@/source/context/terminal-viewport-context';
import {useAuth} from '@/source/context/auth-context';
import {APP_VERSION} from '@/source/version';
import {RainbowTitle} from '@/components/rainbow-text';

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
		} catch (error_: unknown) {
			const raw = error_ instanceof Error ? error_.message : 'Login failed.';
			const message =
				raw.toLowerCase().includes('invalid') || raw.includes('wrong')
					? 'Invalid credentials. Please try again.'
					: raw;
			setError(message);
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
				{/* <BigText color={theme.colors.primary} font="shade">MFX</BigText> */}
				<RainbowTitle text="MFX CLI" fps={24} />
				<Box height={2} />
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
						<Box
							flexDirection="column"
							gap={1}
							alignItems="flex-start"
							justifyContent="flex-start"
						>
							<TextInput
								autoFocus
								borderStyle="single"
								id="mex-email"
								label="Email"
								placeholder="trader@example.com"
								value={email}
								width={44}
								onChange={setEmail}
								onSubmit={() => {
									/* Tab to password */
								}}
							/>
							<PasswordInput
								borderStyle="single"
								id="mex-password"
								label="Password"
								mask="•"
								placeholder="********"
								value={password}
								width={44}
								onChange={setPassword}
								onSubmit={() => {
									void submit();
								}}
							/>
							<Box
								marginTop={1}
								backgroundColor={theme.colors.success}
								paddingY={1}
								paddingX={2}
							>
								<Text color={theme.colors.successForeground}>
									{'  '}▶ Sign In{'  '}
								</Text>
							</Box>
						</Box>
					)}
				</Box>
				{error && (
					<Box marginTop={1}>
						<Text color={theme.colors.error}>! {error}</Text>
					</Box>
				)}
			</Box>
			<Box justifyContent="center" paddingBottom={1}>
				<Text dimColor color={theme.colors.mutedForeground}>
					Tab to move between fields · Enter to submit · Ctrl+C to quit
				</Text>
			</Box>
		</Box>
	);
}
