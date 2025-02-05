import { Router } from "express";
import userService from "../../services/userService.js";

const userApiController = Router();

userApiController.get("/get-user-friends", async (req, res) => {
	const friends = userService.getAllFriendsOfCookie(req);

	return res.json({ friends });
});

userApiController.get("/get-username", (req, res) => {
	res.json({ username: req.cookies.userId.username });
});

export default userApiController;
