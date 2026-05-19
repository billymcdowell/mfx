import fs from 'node:fs';
import type {MfxConfig, ThemeKey} from '@/source/types';
import {getConfigFilePath} from '@/source/lib/paths';

const THEMES = new Set<ThemeKey>([
	'default',
	'catppuccin',
	'dracula',
	'tokyo-night',
	'gruvbox-dark',
	'nord',
	'one-dark',
	'solarized-dark',
	'kanagawa',
]);

export function defaultConfig(): MfxConfig {
	return {
		themeKey: 'default',
		setupComplete: false,
		priceRefreshSeconds: 30,
		newsRefreshMinutes: 5,
	};
}

function pickRefreshSeconds(value: unknown, fallback: number): number {
	const n = Number(value);
	if (n === 0) {
		return 0;
	}

	return [15, 30, 60].includes(n) ? n : fallback;
}

function normalize(parsed: Partial<MfxConfig>): MfxConfig {
	const base = defaultConfig();
	const themeKey =
		parsed.themeKey && THEMES.has(parsed.themeKey)
			? parsed.themeKey
			: base.themeKey;
	return {
		...base,
		...parsed,
		themeKey,
		priceRefreshSeconds: pickRefreshSeconds(
			parsed.priceRefreshSeconds,
			base.priceRefreshSeconds,
		),
		newsRefreshMinutes: Math.max(
			1,
			Number(parsed.newsRefreshMinutes) || base.newsRefreshMinutes,
		),
		setupComplete: Boolean(parsed.setupComplete),
	};
}

export function loadConfig(): MfxConfig {
	const file = getConfigFilePath();
	if (!fs.existsSync(file)) {
		return defaultConfig();
	}

	try {
		const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<MfxConfig>;
		return normalize(raw);
	} catch {
		return defaultConfig();
	}
}

export function saveConfig(cfg: MfxConfig): void {
	const filePath = getConfigFilePath();
	fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), 'utf8');
}
