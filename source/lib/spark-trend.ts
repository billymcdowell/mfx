/**
 * Compact ASCII trend strip from a price series (mock-style).
 */
export function historyToTrendStrip(history: number[], width = 12): string {
	if (history.length < 2) {
		return '─'.repeat(width);
	}

	const slice = history.slice(-width - 1);
	const chars: string[] = [];
	for (let i = 1; i < slice.length && chars.length < width; i++) {
		const a = slice[i - 1]!;
		const b = slice[i]!;
		const d = b - a;
		const t = Math.abs(d) < 1e-9 ? '~' : d > 0 ? '╱' : '╲';
		chars.push(t);
	}

	while (chars.length < width) {
		chars.push('~');
	}

	return chars.slice(-width).join('');
}
