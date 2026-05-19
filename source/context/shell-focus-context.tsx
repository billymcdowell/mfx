import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

export type ShellZone = 'sidebar' | 'main';

type ShellFocusContextValue = {
	mainInputActive: boolean;
	setShellZone: (z: ShellZone) => void;
	shellZone: ShellZone;
	toggleShellZone: () => void;
};

const ShellFocusContext = createContext<ShellFocusContextValue | undefined>(
	undefined,
);

export function ShellFocusProvider({children}: {children: React.ReactNode}) {
	const [shellZone, setShellZone] = useState<ShellZone>('sidebar');

	const toggleShellZone = useCallback(() => {
		setShellZone(z => (z === 'sidebar' ? 'main' : 'sidebar'));
	}, []);

	const mainInputActive = shellZone === 'main';

	const value = useMemo(
		() => ({
			mainInputActive,
			setShellZone,
			shellZone,
			toggleShellZone,
		}),
		[mainInputActive, shellZone, toggleShellZone],
	);

	return (
		<ShellFocusContext.Provider value={value}>
			{children}
		</ShellFocusContext.Provider>
	);
}

export function useShellFocus(): ShellFocusContextValue {
	const v = useContext(ShellFocusContext);
	if (!v) {
		throw new Error('useShellFocus must be used inside ShellFocusProvider');
	}

	return v;
}
