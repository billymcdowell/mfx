import fs from 'node:fs';
import type {PriceFavoriteEntry} from '@/source/types';
import {getPriceFavoritesFilePath} from '@/source/lib/paths';

export function loadPriceFavorites(): PriceFavoriteEntry[] {
	const file = getPriceFavoritesFilePath();
	if (!fs.existsSync(file)) {
		return [];
	}

	try {
		const data = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown;
		if (!Array.isArray(data)) {
			return [];
		}

		return data as PriceFavoriteEntry[];
	} catch {
		return [];
	}
}

export function savePriceFavorites(items: PriceFavoriteEntry[]): void {
	fs.writeFileSync(
		getPriceFavoritesFilePath(),
		JSON.stringify(items, null, 2),
		'utf8',
	);
}
