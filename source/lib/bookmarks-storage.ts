import fs from 'node:fs';
import type {Bookmark} from '@/source/types';
import {getBookmarksFilePath} from '@/source/lib/paths';

export function loadBookmarks(): Bookmark[] {
	const file = getBookmarksFilePath();
	if (!fs.existsSync(file)) {
		return [];
	}

	try {
		const data = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown;
		if (!Array.isArray(data)) {
			return [];
		}

		return data as Bookmark[];
	} catch {
		return [];
	}
}

export function saveBookmarks(items: Bookmark[]): void {
	fs.writeFileSync(
		getBookmarksFilePath(),
		JSON.stringify(items, null, 2),
		'utf8',
	);
}
