export function dateToString(date) {
	const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
	if (seconds < 60) {
		return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	}

	const days = Math.floor(hours / 24);
	if (days < 365) {
		return `${days} day${days === 1 ? "" : "s"} ago`;
	}

	const years = Math.floor(days / 365);
	return `${years} year${years === 1 ? "" : "s"} ago`;
}
