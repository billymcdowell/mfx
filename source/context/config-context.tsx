import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import type {MfxConfig} from '@/source/types';
import {loadConfig, saveConfig} from '@/source/lib/config-storage';

export type ConfigContextValue = {
	config: MfxConfig;
	setConfig: (patch: Partial<MfxConfig>) => void;
};

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const [config, setState] = useState(() => loadConfig());
	const setConfig = useCallback((patch: Partial<MfxConfig>) => {
		setState(c => {
			const next = {...c, ...patch};
			saveConfig(next);
			return next;
		});
	}, []);

	const value = useMemo(
		() => ({
			config,
			setConfig,
		}),
		[config, setConfig],
	);

	return (
		<ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
	);
}

export function useConfig(): ConfigContextValue {
	const v = useContext(ConfigContext);
	if (!v) {
		throw new Error('useConfig must be used inside ConfigProvider');
	}

	return v;
}
