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
		res.json(result);

	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.json(errMessage);
	}
});

chatApiController.get("/:id", async (req, res) => {
	const chatHistory = await chatService.getChatHistory(req.params.id);

	if (chatHistory == false) {
		return res.status(400).json("Chat not created");
	}

	res.json(chatHistory);
});

chatApiController.post("/create-new-chat", async (req, res) => {
	const newId = await chatService.createNewChat(req);

	if (!newId) {
		res.json("Something went wrong");
	}

	res.json(newId);
});

chatApiController.post("/send-message", async (req, res) => {
	await chatService.sendMessage();

	res.json();
});

export default chatApiController;
