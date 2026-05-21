#!/usr/bin/env node
import fs from 'node:fs';
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import {getBookmarksFilePath, getConfigFilePath} from './lib/paths.js';

const ALT_SCREEN_ON = '\u001B[?1049h';
const ALT_SCREEN_OFF = '\u001B[?1049l';

const cli = meow(
	`
	Usage
	  $ mfx

	Options
	  --reset-config  Delete local mfx config & bookmarks (demo)

	Examples
	  $ mfx
	  $ mfx --reset-config
`,
	{
		importMeta: import.meta,
		flags: {
			resetConfig: {
				default: false,
				type: 'boolean',
			},
		},
	},
);

if (cli.flags.resetConfig) {
	try {
		fs.unlinkSync(getConfigFilePath());
	} catch {
		/* Noop */
	}

	try {
		fs.unlinkSync(getBookmarksFilePath());
	} catch {
		/* Noop */
	}
}

if (process.stdout.isTTY) {
	process.stdout.write(ALT_SCREEN_ON);
}

const ink = render(<App />);

void ink.waitUntilExit().finally(() => {
	if (process.stdout.isTTY) {
		process.stdout.write(ALT_SCREEN_OFF);
	}
});
