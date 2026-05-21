import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'ava';
import {
	defaultConfig,
	loadConfig,
	saveConfig,
} from '../dist/source/lib/config-storage.js';
import {
	loadBookmarks,
	saveBookmarks,
} from '../dist/source/lib/bookmarks-storage.js';

test.before(() => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mfx-ava-'));
	process.env.MFX_CONFIG_DIR = dir;
});

test('defaultConfig includes theme and intervals', t => {
	const d = defaultConfig();
	t.is(d.themeKey, 'default');
	t.is(d.setupComplete, false);
	t.is(d.priceRefreshSeconds, 30);
});

test('config roundtrip respects theme key', t => {
	const base = loadConfig();
	saveConfig({...base, themeKey: 'dracula'});
	const next = loadConfig();
	t.is(next.themeKey, 'dracula');
});

test('bookmarks persist to disk', t => {
	saveBookmarks([
		{
			body: 'hello',
			id: 't1',
			savedAt: '2024-01-01T00:00:00.000Z',
			source: 'Demo',
			title: 'Headline',
			url: 'mfx://t1',
		},
	]);
	const list = loadBookmarks();
	t.is(list.length, 1);
	t.is(list[0]?.title, 'Headline');
});
