import { Router } from "express";
import userService from "../../services/userService.js";

const userApiController = Router();

userApiController.get("/get-user-friends", async (req, res) => {
	const friends = await userService.getAllFriendsOfCookie(req);

	return res.json({ friends });
});

userApiController.get("/get-username", (req, res) => {
	const username = JSON.parse(req.cookies.userId).username;

	res.json({ username });
});

export default userApiController;
