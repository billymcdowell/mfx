import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function getConfigDirectory(): string {
	const override = process.env.MFX_CONFIG_DIR?.trim();
	if (override) {
		fs.mkdirSync(override, {recursive: true});
		return override;
	}

	const home = os.homedir();

	if (process.platform === 'win32') {
		const base = process.env.APPDATA?.trim().length
			? process.env.APPDATA!
			: path.join(home, 'AppData', 'Roaming');
		const dir = path.join(base, 'mfx');
		fs.mkdirSync(dir, {recursive: true});
		return dir;
	}

	const dir = path.join(home, '.config', 'mfx');
	fs.mkdirSync(dir, {recursive: true});
	return dir;
}

export function getConfigFilePath(): string {
	return path.join(getConfigDirectory(), 'config.json');
}

export function getBookmarksFilePath(): string {
	return path.join(getConfigDirectory(), 'bookmarks.json');
}

export function getPriceFavoritesFilePath(): string {
	return path.join(getConfigDirectory(), 'price-favorites.json');
}
