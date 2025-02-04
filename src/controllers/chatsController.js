import { Router } from "express";

const chatsController = Router();

chatsController.get("/chats", (req, res) => {
	res.render("chats");
});

export default chatsController;
