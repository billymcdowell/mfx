import React, {createContext, useCallback, useContext, useMemo} from 'react';
import {useConfig} from '@/source/context/config-context';

type AuthContextValue = {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function mockAuthenticate(
	email: string,
	password: string,
): Promise<{expiresAt: string; token: string}> {
	await new Promise<void>(r => {
		setTimeout(r, 400);
	});

	if (!email.trim()) {
		throw new Error('Enter your email address.');
	}

	if (!password) {
		throw new Error('Enter your password.');
	}

	if (password === 'wrong') {
		throw new Error('Invalid email or password.');
	}

	const expiresAt = new Date(Date.now() + 30 * 86400_000).toISOString();
	const token = Buffer.from(
		JSON.stringify({demo: true, sub: email.trim(), iat: Date.now()}),
		'utf8',
	).toString('base64url');
	return {expiresAt, token};
}

export function AuthProvider({children}: {children: React.ReactNode}) {
	const {config, setConfig} = useConfig();

	const isAuthenticated =
		Boolean(config.token) &&
		Boolean(config.expiresAt) &&
		new Date(config.expiresAt!).getTime() > Date.now();

	const login = useCallback(
		async (email: string, password: string) => {
			const {expiresAt, token} = await mockAuthenticate(email, password);
			setConfig({email: email.trim(), expiresAt, token});
		},
		[setConfig],
	);

	const logout = useCallback(() => {
		setConfig({email: undefined, expiresAt: undefined, token: undefined});
	}, [setConfig]);

	const value = useMemo(
		() => ({
			isAuthenticated,
			login,
			logout,
		}),
		[isAuthenticated, login, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const v = useContext(AuthContext);
	if (!v) {
		throw new Error('useAuth must be used inside AuthProvider');
	}

	return v;
}
