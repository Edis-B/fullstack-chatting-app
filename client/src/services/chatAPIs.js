import request from "../utils/request.js";
import { host } from "../common/appConstants.js";

export async function redirectToChat(userId, profileId, navigate) {
	try {
		if (!userId) {
			navigate("/login");
		}
		
		// Check if the chat already exists
		const { response, payload: chatResponse } = await request.get(
			`${host}/chat/do-dms-exist`,
			{
				userId,
				profileId,
			}
		);

		// Redirect
		if (chatResponse.data?.chatId) {
			const { data } = chatResponse;
			return navigate(`/chat/${data.chatId}`);
		}

		const { payload: chatTypes } = await request.get(
			`${host}/chat/chat-types`
		);

		// Create a new chat
		const { payload: newChatId } = await request.post(
			`${host}/chat/create-new-chat`,
			{
				participants: [userId, profileId],
				type: chatTypes.data.DIRECT_MESSAGES,
			}
		);

		const chatId = newChatId.data.chatId;

		if (newChatId.success) {
			return navigate(`/chat/${chatId}`);
		}
	} catch (err) {
		console.error("Error checking or creating chat:", err);
	}
}
