import { Router } from "express";

import chatTypes from "../common/chatTypeConstants.js";
import chatService from "../services/chatService.js";

const chatApiController = Router();

chatApiController.get("/chat-types", (req, res) => {
    res.json(chatTypes);
})

chatApiController.get("/does-chat-exist-cookie/:receiver", async (req, res) => {
    res.json(await chatService.checkIfDMsExistWithUser(req, req.params.receiver));
})

chatApiController.get("/:id", async (req, res) => {
	const chatHistory = await chatService.getChatHistory(req.params.id);

	if (chatHistory == false) {
		return res.status(400).json('Chat not created');
	}

	res.json(chatHistory);
});

chatApiController.post("/create-new-chat", async (req, res) => {
	const newId = await chatService.createNewChat(req);

	if (!newId) {
		res.json('Something went wrong')
	}

	res.json(`Chat created ${newId}`);
});

chatApiController.post("/send-message", async (req, res) => {
	await chatService.sendMessage();

	res.json()
})

export default chatApiController;
