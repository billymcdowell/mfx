import type {InstrumentType} from '@/source/types';

export function formatPrice(value: number, type: InstrumentType): string {
	return type === 'forex' ? value.toFixed(5) : value.toFixed(3);
}

export function formatSpread(
	bid: number,
	ask: number,
	type: InstrumentType,
): string {
	const s = ask - bid;
	return type === 'forex' ? s.toFixed(5) : s.toFixed(3);
}
