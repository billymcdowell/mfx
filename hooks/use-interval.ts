import * as React from 'react';

export const useInterval = (
	callback: () => void,
	delay: number | undefined,
): void => {
	const savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		if (delay === undefined) {
			return;
		}

		const id = setInterval(() => {
			savedCallback.current();
		}, delay);
		return () => {
			clearInterval(id);
		};
	}, [delay]);
};
