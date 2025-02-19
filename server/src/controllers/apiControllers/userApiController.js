import { Router } from "express";
import userService from "../../services/userService.js";

const userApiController = Router();

userApiController.get("/get-user-friends", async (req, res) => {
	const friends = await userService.getAllChatsOfUser(req);

	return res.json({ friends });
});

userApiController.get("/get-username", (req, res) => {
	res.json({ username: req.user.username });
});

export default userApiController;
