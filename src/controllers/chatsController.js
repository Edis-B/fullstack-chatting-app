import { Router } from "express";

const chatsController = Router();

chatsController.get("/", (req, res) => {
	res.render("chats");
});

export default chatsController;
