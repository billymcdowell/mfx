/**
 * Badge colours from mock (foreground on dark tag fill = dark text on bright bg).
 */
export function newsTagStyle(tag: string): {
	backgroundColor: string;
	color: string;
} {
	const t = tag.trim().toUpperCase();
	const dark = '#1E1E2E';

	if (t.includes('GOLD')) {
		return {backgroundColor: '#F9E2AF', color: dark};
	}

	if (
		t.includes('OIL') ||
		t.includes('GAS') ||
		t === 'ENERGY' ||
		t.includes('NAT')
	) {
		return {backgroundColor: '#89DCEB', color: dark};
	}

	if (t.includes('SILVER') || t.includes('METAL')) {
		return {backgroundColor: '#A6ADC8', color: dark};
	}

	if (
		t.includes('FOREX') ||
		t.includes('EUR') ||
		t.includes('USD') ||
		t.includes('GBP') ||
		t.includes('JPY') ||
		t.includes('CHF') ||
		t.includes('FX')
	) {
		return {backgroundColor: '#CBA6F7', color: dark};
	}

	if (t.includes('MACRO')) {
		return {backgroundColor: '#F38BA8', color: dark};
	}

	return {backgroundColor: '#89B4FA', color: dark};
}
