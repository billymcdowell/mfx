import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolves to repo `package.json` when running from `dist/source/*.js`. */
export const APP_VERSION: string = (() => {
	try {
		const raw = readFileSync(join(__dirname, '../../package.json'), 'utf8');
		const parsed = JSON.parse(raw) as {version?: string};
		return typeof parsed.version === 'string' ? parsed.version : '0.0.0';
	} catch {
		return '0.0.0';
	}
})();
