import { Router } from "express";
import chatService from "../services/chatService.js";

const chatsController = Router();

chatsController.get("/", (req, res) => {
	res.render("chats");
});

chatsController.post("/create-new-chat", async (req, res) => {
	const newId = await chatService.createNewChat(req);

	res.redirect(`/chat/${newId}`);
});

chatsController.post("/send-message", async (req, res) => {
	await chatService.sendMessage();
})


export default chatsController;
