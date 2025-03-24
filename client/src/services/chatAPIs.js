import request from "../utils/request.js";
import { host } from "../common/appConstants.js";

export async function redirectToChat(username, navigate) {
	try {
		// Check if the chat already exists
		const { data } = await request.get(
			`${host}/chat/does-chat-exist-with-cookie`,
			{
				receiverUsername: username,
			}
		);

		// Redirect
		if (data.exists) {
			return navigate(`/chat/${data.chatId}`);
		}

		const { data: currentUser } = await request.get(
			`${host}/user/get-username`
		);
		const { data: chatTypes } = await request.get(
			`${host}/chat/chat-types`
		);

		// Create a new chat
		const { data: newChatData } = await request.post(
			`${host}/chat/create-new-chat`,
			{
				participants: [username, currentUser],
				type: chatTypes.DIRECT_MESSAGES,
			}
		);

		if (newChatData) {
			return navigate(`/chat/${newChatData.chatId}`);
		}
	} catch (err) {
		console.error("Error checking or creating chat:", err);
	}
}
