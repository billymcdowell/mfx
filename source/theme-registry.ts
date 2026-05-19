import type {Theme} from '@/components/ui/theme-provider';
import {catppuccinTheme} from '@/lib/terminal-themes/catppuccin';
import {defaultTheme} from '@/lib/terminal-themes/default';
import {draculaTheme} from '@/lib/terminal-themes/dracula';
import {gruvboxDarkTheme} from '@/lib/terminal-themes/gruvbox-dark';
import {kanagawaTheme} from '@/lib/terminal-themes/kanagawa';
import {nordTheme} from '@/lib/terminal-themes/nord';
import {oneDarkTheme} from '@/lib/terminal-themes/one-dark';
import {solarizedDarkTheme} from '@/lib/terminal-themes/solarized-dark';
import {tokyoNightTheme} from '@/lib/terminal-themes/tokyo-night';
import type {ThemeKey, ThemeOptionEntry} from '@/source/types';

const themeMap: Record<ThemeKey, Theme> = {
	catppuccin: catppuccinTheme,
	default: defaultTheme,
	dracula: draculaTheme,
	'gruvbox-dark': gruvboxDarkTheme,
	kanagawa: kanagawaTheme,
	nord: nordTheme,
	'one-dark': oneDarkTheme,
	'solarized-dark': solarizedDarkTheme,
	'tokyo-night': tokyoNightTheme,
};

export const THEME_OPTIONS: ThemeOptionEntry[] = [
	{
		description: 'Soft dark, pastel accents',
		key: 'catppuccin',
		label: 'Catppuccin Mocha',
		preview: '█',
		swatchColors: ['#CBA6F7', '#89B4FA', '#A6E3A1', '#F38BA8'],
		theme: catppuccinTheme,
	},
	{
		description: 'High contrast purple/pink',
		key: 'dracula',
		label: 'Dracula',
		preview: '█',
		swatchColors: ['#BD93F9', '#FF79C6', '#50FA7B', '#8BE9FD'],
		theme: draculaTheme,
	},
	{
		description: 'Deep blue, electric accents',
		key: 'tokyo-night',
		label: 'Tokyo Night',
		preview: '█',
		swatchColors: ['#7AA2F7', '#BB9AF7', '#9ECE6A', '#F7768E'],
		theme: tokyoNightTheme,
	},
	{
		description: 'Warm amber on dark brown',
		key: 'gruvbox-dark',
		label: 'Gruvbox Dark',
		preview: '█',
		swatchColors: ['#D79921', '#689D6A', '#458588', '#CC241D'],
		theme: gruvboxDarkTheme,
	},
	{
		description: 'Arctic blues and frost',
		key: 'nord',
		label: 'Nord',
		preview: '█',
		swatchColors: ['#88C0D0', '#81A1C1', '#A3BE8C', '#BF616A'],
		theme: nordTheme,
	},
	{
		description: 'Classic editor dark theme',
		key: 'one-dark',
		label: 'One Dark',
		preview: '█',
		swatchColors: ['#61AFEF', '#C678DD', '#98C379', '#E06C75'],
		theme: oneDarkTheme,
	},
	{
		description: 'Low contrast, amber highlights',
		key: 'solarized-dark',
		label: 'Solarized Dark',
		preview: '█',
		swatchColors: ['#268BD2', '#2AA198', '#859900', '#DC322F'],
		theme: solarizedDarkTheme,
	},
	{
		description: 'Japanese ink painting tones',
		key: 'kanagawa',
		label: 'Kanagawa',
		preview: '█',
		swatchColors: ['#7E9CD8', '#957FB8', '#98BB6C', '#E82424'],
		theme: kanagawaTheme,
	},
	{
		description: 'Baseline slate palette',
		key: 'default',
		label: 'Default',
		preview: '·',
		swatchColors: ['#60A5FA', '#A78BFA', '#4ADE80', '#F87171'],
		theme: defaultTheme,
	},
];

export function getThemeForKey(key: ThemeKey): Theme {
	return themeMap[key] ?? defaultTheme;
}

export function themeLabelForKey(key: ThemeKey): string {
	return THEME_OPTIONS.find(o => o.key === key)?.label ?? key;
}
