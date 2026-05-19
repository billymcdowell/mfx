import {execFile} from 'node:child_process';
import process from 'node:process';

export function openUrlInBrowser(url: string): void {
	if (!url.startsWith('http')) {
		return;
	}

	const platform = process.platform;
	if (platform === 'darwin') {
		execFile('open', [url], {windowsHide: true}, () => {});
	} else if (platform === 'win32') {
		execFile('cmd', ['/c', 'start', '', url], {windowsHide: true}, () => {});
	} else {
		execFile('xdg-open', [url], {windowsHide: true}, () => {});
	}
}
