import { Router } from "express";
import userService from "../services/userService.js";
import { autherize } from "../utils/authUtils.js";
import { catchAsync } from "../utils/errorUtils.js";

const userApiController = Router();

// Profile Updates
userApiController.put(
	"/update-profile",
	catchAsync(async (req, res) => {
		const updatedProfile = await userService.updateProfile(req, res);
		res.json({
			status: "success",
			data: updatedProfile,
		});
	})
);

// Friend Management
userApiController.post(
	"/unfriend",
	catchAsync(async (req, res) => {
		await userService.unfriend(req);
		res.json({
			status: "success",
			data: null,
		});
	})
);

userApiController.post(
	"/send-friend-request",
	catchAsync(async (req, res) => {
		const request = await userService.sendFriendRequest(req);
		res.status(201).json({
			status: "success",
			data: request,
		});
	})
);

userApiController.post(
	"/accept-friend-request",
	catchAsync(async (req, res) => {
		const friendship = await userService.acceptFriendRequest(req);
		res.json({
			status: "success",
			data: friendship,
		});
	})
);

userApiController.post(
	"/decline-friend-request",
	catchAsync(async (req, res) => {
		await userService.declineFriendRequest(req);
		res.json({
			status: "success",
			data: null,
		});
	})
);

userApiController.post(
	"/cancel-friend-request",
	catchAsync(async (req, res) => {
		await userService.cancelFriendRequest(req);
		res.json({
			status: "success",
			data: null,
		});
	})
);

// User Data
userApiController.get(
	"/get-user-profile-data",
	catchAsync(async (req, res) => {
		if (!req.query.userId) {
			return res.json({
				status: "success",
				data: { id: req.user?.id },
			});
		}
		const profile = await userService.getUserProfileData(req);
		res.json({
			status: "success",
			data: profile,
		});
	})
);

userApiController.get(
	"/get-user-friends",
	catchAsync(async (req, res) => {
		const friends = await userService.getAllFriendsOfUser(req);
		res.json({
			status: "success",
			results: friends.length,
			data: friends,
		});
	})
);

// Auth Related
userApiController.get("/get-image-url", (req, res) => {
	try {
		autherize(req);
		res.json({
			status: "success",
			data: req.user.image,
		});
	} catch (err) {
		res.status(401).json({
			status: "fail",
			message: "Unauthorized",
		});
	}
});

userApiController.get("/get-user-id", (req, res) => {
	res.json({
		status: "success",
		data: {
			id: req.user?.id,
			autherized: !!req.user?.id,
		},
	});
});

userApiController.get("/get-username", (req, res) => {
	if (!req.user) {
		return res.status(401).json({
			status: "fail",
			message: "Unauthorized",
		});
	}
	res.json({
		status: "success",
		data: req.user.username,
	});
});

userApiController.get("/get-current-user-data", (req, res) => {
	if (!req.user) {
		return res.status(401).json({
			status: "fail",
			message: "Unauthorized",
		});
	}
	res.json({
		status: "success",
		data: { ...req.user.toObject(), autherized: true },
	});
});

// Search
userApiController.get(
	"/get-users-by-username",
	catchAsync(async (req, res) => {
		const users = await userService.getPeopleByUserSubstring(req);
		res.json({
			status: "success",
			results: users.length,
			data: users,
		});
	})
);

// Authentication
userApiController.post(
	"/register",
	catchAsync(async (req, res) => {
		const user = await userService.registerUser(res, req.body);
		res.status(201).json({
			status: "success",
			data: user,
		});
	})
);

userApiController.post(
	"/login",
	catchAsync(async (req, res) => {
		const authData = await userService.loginUser(req, res);
		res.json({
			status: "success",
			data: authData,
		});
	})
);

userApiController.post("/logout", (req, res) => {
	userService.logoutUser(req, res);
	res.json({
		status: "success",
		data: null,
	});
});

export default userApiController;
