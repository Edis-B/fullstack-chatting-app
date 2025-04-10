export const hostPort = 5000;
export const host = `http://localhost:${hostPort}`;

export const clientPort = 3000;
export const client = `http://localhost:${clientPort}`;

export const httpUrlRegex = /^https?\:\/\//i;

export const unauthorizedString = "Unauthorized!";

export const errorImage =
	"https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png";

export const visibilityTypes = {
	PUBLIC: "public",
	FRIENDS: "friends",
	ONLY_ME: "only me",
};

export const friendStatuses = {
	OUTGOING_REQUEST: "outgoing request",
	INCOMING_REQUEST: "incoming request",
	FRIENDS: "friends",
	NOT_FRIENDS: "not friends",
	BLOCKED: "blocked",
	BLOCKED_BY: "blocked by",
};

export const contentTypes = {
	POSTS: "posts",
	FRIENDS: "friends",
	ABOUT: "about",
	PHOTOS: "photos",
	PEOPLE: "people",
};

export const chatTypes = {
	DIRECT_MESSAGES: "direct messages",
	GROUP_CHAT: "group chat",
};
