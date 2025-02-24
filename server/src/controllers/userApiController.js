import { Router } from "express";

import userService from "../services/userService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const userApiController = Router();

userApiController.get("/get-user-friends", async (req, res) => {
	const friends = await userService.getAllChatsOfUser(req);

	res.json({ friends });
});

userApiController.get("/get-username", (req, res) => {
	if (!req.user) {
		return res.status(400).json(null);
	}

	res.json(req.user.username);
});

userApiController.get("/get-users-by-username", async (req, res) => {
	try {
		const result = await userService.getPeopleByUserSubstring(req);

		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/register", async (req, res) => {
	let result;
	try {
		result = await userService.registerUser(res, req.body);
	} catch (err) {
		result = getErrorMessage(err);
		res.status(400);
	}

	res.json(result);
});

userApiController.post("/login", async (req, res) => {
	try {
		const result = await userService.loginUser(req.body, res);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.get("/logout", (req, res) => {
	let result = "Successfully logged out!";
	try {
		userService.logoutUser(res);
	} catch (err) {
		result = getErrorMessage(err);
	}

	res.json(result);
});

userApiController.post("/send-friend-request", async (req, res) => {
	try {
		const result = await userService.sendFriendRequest(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

export default userApiController;
