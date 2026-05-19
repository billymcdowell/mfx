import React, {useMemo} from 'react';
import {ErrorBoundary} from '@/components/ui/error-boundary';
import {ThemeProvider} from '@/components/ui/theme-provider';
import {getThemeForKey} from '@/source/theme-registry';
import {AuthProvider, useAuth} from '@/source/context/auth-context';
import {BookmarksProvider} from '@/source/context/bookmarks-context';
import {PriceFavoritesProvider} from '@/source/context/price-favorites-context';
import {ChromeGateProvider} from '@/source/context/chrome-gate-context';
import {ConfigProvider, useConfig} from '@/source/context/config-context';
import {NewsProvider} from '@/source/context/news-context';
import {PricesProvider} from '@/source/context/prices-context';
import {type RouteFrame, RouterProvider} from '@/source/context/router-context';
import {TerminalViewportProvider} from '@/source/context/terminal-viewport-context';
import {SetupScreen} from '@/source/screens/setup-screen';
import {LoginScreen} from '@/source/screens/login-screen';
import {AuthenticatedShell} from '@/source/screens/authenticated-shell';

function ThemedApp({children}: {children: React.ReactNode}) {
	const {config} = useConfig();
	const themeObj = useMemo(
		() => getThemeForKey(config.themeKey),
		[config.themeKey],
	);
	return <ThemeProvider theme={themeObj}>{children}</ThemeProvider>;
}

const authedBootstrap: RouteFrame = {params: {}, screen: 'prices'};

function AuthedSessions() {
	return (
		<BookmarksProvider>
			<PriceFavoritesProvider>
				<PricesProvider>
					<NewsProvider>
						<ChromeGateProvider>
							<RouterProvider initial={authedBootstrap}>
								<AuthenticatedShell />
							</RouterProvider>
						</ChromeGateProvider>
					</NewsProvider>
				</PricesProvider>
			</PriceFavoritesProvider>
		</BookmarksProvider>
	);
}

export default function App() {
	return (
		<TerminalViewportProvider>
			<ConfigProvider>
				<ThemedApp>
					<ErrorBoundary title="Ink runtime">
						<AuthProvider>
							<GatedExperience />
						</AuthProvider>
					</ErrorBoundary>
				</ThemedApp>
			</ConfigProvider>
		</TerminalViewportProvider>
	);
}

function GatedExperience() {
	const {isAuthenticated} = useAuth();
	const {config} = useConfig();

	if (!isAuthenticated) {
		return <LoginScreen />;
	}

	if (!config.setupComplete) {
		return <SetupScreen />;
	}

	return <AuthedSessions />;
}
