import type {Theme} from '@/components/ui/theme-provider';

export type ThemeKey =
	| 'default'
	| 'catppuccin'
	| 'dracula'
	| 'tokyo-night'
	| 'gruvbox-dark'
	| 'nord'
	| 'one-dark'
	| 'solarized-dark'
	| 'kanagawa';

export type MfxConfig = {
	token?: string;
	expiresAt?: string;
	email?: string;
	themeKey: ThemeKey;
	setupComplete: boolean;
	priceRefreshSeconds: number;
	newsRefreshMinutes: number;
};

export type InstrumentType = 'commodity' | 'forex';

export type Instrument = {
	symbol: string;
	name: string;
	type: InstrumentType;
	spotPrice: number;
	change24h: number;
	bid: number;
	ask: number;
	history: number[];
};

export type Article = {
	id: string;
	title: string;
	source: string;
	publishedAt: string;
	tags: string[];
	summary: string;
	body: string;
	url?: string;
};

export type Bookmark = {
	id: string;
	title: string;
	source: string;
	url: string;
	body: string;
	savedAt: string;
};

export type PriceFavoriteEntry = {
	symbol: string;
	savedAt: string;
};

export type Screen =
	| 'login'
	| 'setup'
	| 'prices'
	| 'news'
	| 'bookmarks'
	| 'settings'
	| 'articleDetail'
	| 'priceDetail';

export type RouterParams = {
	symbol?: string;
	articleId?: string;
};

export type ThemeOptionEntry = {
	key: ThemeKey;
	label: string;
	preview: string;
	description?: string;
	/** Up to four hex colours for setup preview swatches. */
	swatchColors?: string[];
	theme: Theme;
};
