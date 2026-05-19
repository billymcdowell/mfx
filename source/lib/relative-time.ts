export function formatNewsTime(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

export function formatRelativeSaved(iso: string): string {
	const d = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const days = Math.floor(diffMs / 86_400_000);
	const t = d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
	if (days === 0) {
		return `today ${t}`;
	}

	if (days === 1) {
		return `yesterday ${t}`;
	}

	if (days < 7) {
		return `${days} days ago`;
	}

	return d.toLocaleDateString();
}
