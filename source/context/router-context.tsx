import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import type {RouterParams, Screen} from '@/source/types';

export type RouteFrame = {
	params: RouterParams;
	screen: Screen;
};

type RouterContextValue = {
	current: RouteFrame;
	goBack: () => void;
	historyLength: number;
	navigate: (screen: Screen, params?: RouterParams) => void;
	replaceRoot: (frame: RouteFrame) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function RouterProvider({
	children,
	initial,
}: {
	children: React.ReactNode;
	initial: RouteFrame;
}) {
	const [stack, setStack] = useState<RouteFrame[]>([initial]);

	const current = stack[stack.length - 1]!;

	const navigate = useCallback((screen: Screen, params: RouterParams = {}) => {
		setStack(s => [...s, {params, screen}]);
	}, []);

	const goBack = useCallback(() => {
		setStack(s => (s.length <= 1 ? s : s.slice(0, -1)));
	}, []);

	const replaceRoot = useCallback((frame: RouteFrame) => {
		setStack([frame]);
	}, []);

	const value = useMemo(
		() => ({
			current,
			goBack,
			historyLength: stack.length,
			navigate,
			replaceRoot,
		}),
		[current, goBack, navigate, replaceRoot, stack.length],
	);

	return (
		<RouterContext.Provider value={value}>{children}</RouterContext.Provider>
	);
}

export function useRouter(): RouterContextValue {
	const v = useContext(RouterContext);
	if (!v) {
		throw new Error('useRouter must be used inside RouterProvider');
	}

	return v;
}
