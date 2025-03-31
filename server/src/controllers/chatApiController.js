import { Router } from "express";
import { chatTypes } from "../common/entityConstraints.js";
import chatService from "../services/chatService.js";
import { catchAsync } from "../utils/errorUtils.js";

const chatApiController = Router();

chatApiController.get(
	"/latest-chat's-id",
	catchAsync(async (req, res) => {
		const chatId = await chatService.getLatestChatId(req);
		res.json({
			status: "success",
			data: { chatId },
		});
	})
);

chatApiController.get("/chat-types", (req, res) => {
	res.json({
		status: "success",
		data: chatTypes,
	});
});

chatApiController.get(
	"/get-user-chats",
	catchAsync(async (req, res) => {
		const chats = await chatService.getUserChats(req);
		res.json({
			status: "success",
			results: chats.length,
			data: chats,
		});
	})
);

chatApiController.get(
	"/does-chat-exist-with-cookie",
	catchAsync(async (req, res) => {
		const chatId = await chatService.checkIfDMsExistWithUser(req);
		res.json({
			status: "success",
			data: {
				chatId,
				exists: !!chatId,
			},
		});
	})
);

chatApiController.post(
	"/create-new-chat",
	catchAsync(async (req, res) => {
		const newChatId = await chatService.createNewChat(req);
		if (!newChatId) {
			throw new Error("Failed to create new chat");
		}
		res.status(201).json({
			status: "success",
			data: { chatId: newChatId },
		});
	})
);

chatApiController.post(
	"/send-message",
	catchAsync(async (req, res) => {
		const message = await chatService.sendMessage(req);
		res.status(201).json({
			status: "success",
			data: message,
		});
	})
);

chatApiController.get(
	"/get-chat-history",
	catchAsync(async (req, res) => {
		const history = await chatService.getChatHistory(req);
		res.json({
			status: "success",
			results: history.length,
			data: history,
		});
	})
);

chatApiController.get(
	"/get-chat-header",
	catchAsync(async (req, res) => {
		const header = await chatService.getChatHeader(req);
		res.json({
			status: "success",
			data: header,
		});
	})
);

export default chatApiController;
