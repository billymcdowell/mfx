import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

type ChromeGateContextValue = {
	blocked: boolean;
	setBlocked: (value: boolean) => void;
};

const ChromeGateContext = createContext<ChromeGateContextValue | undefined>(
	undefined,
);

export function ChromeGateProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const [blocked, setBlockedState] = useState(false);
	const setBlocked = useCallback((value: boolean) => {
		setBlockedState(value);
	}, []);

	const value = useMemo(() => ({blocked, setBlocked}), [blocked, setBlocked]);

	return (
		<ChromeGateContext.Provider value={value}>
			{children}
		</ChromeGateContext.Provider>
	);
}

export function useChromeGate(): ChromeGateContextValue {
	const v = useContext(ChromeGateContext);
	if (!v) {
		throw new Error('useChromeGate expects ChromeGateProvider');
	}

	return v;
}
