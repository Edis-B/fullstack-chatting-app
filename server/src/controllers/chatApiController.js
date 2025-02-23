import { Router } from "express";

import chatTypes from "../common/chatTypeConstants.js";
import chatService from "../services/chatService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const chatApiController = Router();

chatApiController.get("/chat-types", (req, res) => {
	res.json(chatTypes);
});

chatApiController.get("/does-chat-exist-with-cookie", async (req, res) => {
	try {
		const result = await chatService.checkIfDMsExistWithUser(req);
		res.json({ chatId: result, exists: !!result });
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

chatApiController.post("/create-new-chat", async (req, res) => {
	try {
		const newId = await chatService.createNewChat(req);
		if (!newId) {
			return res.json("Something went wrong");
		}
		res.json(newId);
	} catch (err) {
		res.status(400).json(getErrorMessage(err));
	}
});

chatApiController.post("/send-message", async (req, res) => {
	try {
		const result = await chatService.sendMessage(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

chatApiController.get("/get-chat-history", async (req, res) => {
	try {
		const result = await chatService.getChatHistory(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

export default chatApiController;
