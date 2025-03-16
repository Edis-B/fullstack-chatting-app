import { Router } from "express";

import userService from "../services/userService.js";
import { autherize } from "../utils/authUtils.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const userApiController = Router();

userApiController.put("/update-profile", async (req, res) => {
	try {
		const result = await userService.updateProfile(req, res);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.get("/get-user-photos", async (req, res) => {
	try {
		const result = await userService.getUserPhotos(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/remove-photo", async (req, res) => {
	try {
		const result = await userService.removePhoto(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/upload-photo", async (req, res) => {
	try {
		const result = await userService.uploadPhoto(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/unfriend", async (req, res) => {
	try {
		const result = await userService.unfriend(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
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

userApiController.post("/accept-friend-request", async (req, res) => {
	try {
		const result = await userService.acceptFriendRequest(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/decline-friend-request", async (req, res) => {
	try {
		const result = await userService.declineFriendRequest(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/cancel-friend-request", async (req, res) => {
	try {
		const result = await userService.cancelFriendRequest(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.get("/get-user-profile-data", async (req, res) => {
	try {
		if (!req.query.userId) {
			return res.json(req.user?.id);
		}
		const result = await userService.getUserProfileData(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.get("/get-user-id", async (req, res) => {
	try {
		res.json({ id: req.user.id, autherized: !!req.user?.id });
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.get("/get-user-friends", async (req, res) => {
	try {
		const friends = await userService.getAllFriendsOfUser(req);
		res.json(friends);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.get("/get-image-url", async (req, res) => {
	try {
		autherize(req);
		res.json(req.user.image);
	} catch (err) {
		res.status(400).json("");
	}
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
		const result = await userService.loginUser(req, res);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

userApiController.post("/logout", (req, res) => {
	try {
		const result = userService.logoutUser(req, res);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
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
