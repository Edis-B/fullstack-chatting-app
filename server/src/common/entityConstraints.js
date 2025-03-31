export const usernameMinLength = 3;
export const usernameMaxLength = 20;

export const emailRegex = /\S+@\S+\.\S+/;
export const urlRegex = /^https?\:\/\//;

export const passwordSaltRounds = 10;



export const visibilityTypes = {
    PUBLIC: "public",
    FRIENDS: "friends",
    ONLY_ME: "only me",
}

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