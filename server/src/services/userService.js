import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import friendStatuses from "../common/friendStatusConstants.js";
import { attachAuthCookie } from "../utils/authUtils.js";

export default {
	async registerUser(res, body) {
		if (body.password !== body.confirmPassword) {
			throw new Error("Passwords do not match");
		}

		if (await userModel.findOne().where("username").equals(body.username)) {
			throw new Error("Username is already taken");
		}

		if (await userModel.findOne().where("email").equals(body.email)) {
			throw new Error("Email is already registered");
		}

		let user;
		try {
			user = await userModel.create({
				...body,
				image:
					body.image ??
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTugGK9j-9h5_GoIWKVFC4m2yg-Sxs-N50A-w&s",
			});
		} catch (err) {
			throw new Error(
				"There was an error creating registering the account!"
			);
		}

		user = user.toObject();
		attachAuthCookie(res, user, false);

		return "Successfully registered!";
	},
	async getUserProfileData(req) {
		const identifier = req.query.userId;
		const owner = req.user?.id === req.query.userId;

		const userObj = await userModel
			.findById(identifier)
			.select("username image banner about")
			.lean();

		if (!userObj) {
			throw new Error("User not found!");
		}

		if (!owner) {
			if (req.user) {
				const currentUser = (
					await userModel.findById(req.user.id)
				).toObject();

				currentUser.friends = currentUser.friends.filter((fObj) =>
					fObj.friend.equals(userObj._id)
				);

				if (currentUser.friends.length > 0) {
					userObj.ourStatus = currentUser.friends[0].status;
				} else {
					userObj.ourStatus = friendStatuses.NOT_FRIENDS;
				}
			}
		}

		return { ...userObj, owner };
	},
	async loginUser(body, res) {
		const isEmail = body.identifier.includes("@");

		const user = await userModel
			.findOne()
			.where(isEmail ? "email" : "username")
			.equals(body.identifier)
			.lean();

		if (!user) {
			throw new Error("Incorrect identifier or password");
		}

		// Compare the provided password with the stored password hash
		const isPasswordValid = await bcrypt.compare(
			body.password,
			user.password
		);

		if (!isPasswordValid) {
			throw new Error("Incorrect identifier or password");
		}

		attachAuthCookie(res, user, body.rememberMe);

		return true;
	},
	logoutUser(req, res) {
		if (!req.user) {
			throw new Error("User is not logged in!");
		}

		res.clearCookie("userId");
	},
	// Returns false or the user entity
	getUserFromReq(req) {
		if (!req.cookies || !req.cookies.userId) {
			return false;
		}

		const parsedCookie = JSON.parse(req.cookies.userId);
		const expiryDate = new Date(parsedCookie.expires);

		if (expiryDate < Date.now()) {
			return false;
		}

		const user = userModel.findOne({ username: parsedCookie.username });

		return user;
	},
	async getUserByUsername(username) {
		if (!username) {
			return;
		}

		return userModel.findOne({ username: username });
	},
	async getAllFriendsOfUsername(username) {
		const user = await this.getUserByUsername(username).populate("friends");

		return user.friends;
	},
	async getAllFriendsOfUser(req) {
		let identifier = req.query.userId;
		const user = await userModel.findById(identifier);

		if (!user) {
			throw new Error("User not found!");
		}

		const userObj = (
			await user.populate("friends.friend")
		).toObject();

		const result = {};
		result.friends = userObj.friends.filter(
			(f) => f.status === friendStatuses.FRIENDS
		);

		result.owner = req.user?.id == userObj._id; 
		if (!result.owner) {
			return result;
		}

		result.incoming = userObj.friends.filter(
			(f) => f.status === friendStatuses.INCOMING_REQUEST
		);

		result.outgoing = userObj.friends.filter(
			(f) => f.status === friendStatuses.OUTGOING_REQUEST
		);

		result.blocked = userObj.friends.filter(
			(f) => f.status === friendStatuses.BLOCKED
		);

		return result;
	},
	async getPeopleByUserSubstring(req) {
		const exclude = req.query.exclude === "true";
		const filter = {
			username: { $regex: req.query.usernameSubstr, $options: "i" },
		};

		if (exclude && req.user) {
			filter.username.$ne = req.user.username;
		}

		return await userModel.find(filter).limit(10);
	},
	async sendFriendRequest(req) {
		const { senderId, receiverId } = req.body;

		if (receiverId === senderId) {
			throw new Error("Invalid friend request!");
		}

		if (senderId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		const receiver = await userModel
			.findById(receiverId)
			.populate("friends.friend");

		const receiverFriend = receiver.toObject().friends.filter((fObj) => {
			const check = fObj.friend._id.toString() == senderId;
			return check;
		});

		let currentStatus;
		if (receiverFriend.length > 0) {
			currentStatus = receiver.friends[0].status;
		}

		if (currentStatus === friendStatuses.INCOMING_REQUEST) {
			throw new Error("Friend Request already active!");
		}

		if (currentStatus && currentStatus !== friendStatuses.NOT_FRIENDS) {
			throw new Error("Cannot send friend request!");
		}

		const sender = await userModel.findById(senderId);

		try {
			sender.friends.push({
				status: friendStatuses.OUTGOING_REQUEST,
				friend: receiverId,
			});

			receiver.friends.push({
				status: friendStatuses.INCOMING_REQUEST,
				friend: senderId,
			});

			await sender.save();
			await receiver.save();
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error!");
		}

		return "Sent friend request successfully!";
	},
	async acceptFriendRequest(req) {
		const { senderId, receiverId } = req.body;

		if (receiverId === senderId) {
			throw new Error("Invalid friend request!");
		}

		if (senderId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		const receiver = await userModel
			.findById(receiverId)
			.populate("friends.friend");

		const receiverFriend = receiver.toObject().friends.filter((fObj) => {
			const check = fObj.friend._id.toString() == senderId;
			return check;
		});

		let currentStatus;
		if (receiverFriend.length > 0) {
			currentStatus = receiver.friends[0].status;
		}

		if (currentStatus === friendStatuses.FRIENDS) {
			throw new Error("Already friends with user!");
		}

		if (currentStatus !== friendStatuses.OUTGOING_REQUEST) {
			throw new Error("Cannot accept friend request!");
		}

		try {
			await userModel.bulkWrite([
				{
					updateOne: {
						filter: { _id: senderId, "friends.friend": receiverId },
						update: {
							$set: {
								"friends.$.status": friendStatuses.FRIENDS,
							},
						},
					},
				},
				{
					updateOne: {
						filter: { _id: receiverId, "friends.friend": senderId },
						update: {
							$set: {
								"friends.$.status": friendStatuses.FRIENDS,
							},
						},
					},
				},
			]);
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error!");
		}

		return "Friend request accepted successfully!";
	},
	async declineFriendRequest(req) {
		const { senderId, receiverId } = req.body;

		if (receiverId === senderId) {
			throw new Error("Invalid friend request!");
		}

		if (senderId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		const receiver = await userModel
			.findById(receiverId)
			.populate("friends.friend");

		const receiverFriend = receiver.toObject().friends.filter((fObj) => {
			const check = fObj.friend._id.toString() == senderId;
			return check;
		});

		let currentStatus;
		if (receiverFriend.length > 0) {
			currentStatus = receiver.friends[0].status;
		}

		if (currentStatus !== friendStatuses.OUTGOING_REQUEST) {
			throw new Error("Cannot decline friend request!");
		}

		try {
			await userModel.updateOne(
				{ _id: receiverId },
				{ $pull: { friends: senderId } }
			);

			await userModel.updateOne(
				{ _id: senderId },
				{ $pull: { friends: receiverId } }
			);
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error!");
		}

		return "Declined friend request successfully!";
	},
	async cancelFriendRequest(req) {
		const { senderId, receiverId } = req.body;

		if (receiverId === senderId) {
			throw new Error("Cannot cancel friend request!");
		}

		if (senderId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		const receiver = await userModel
			.findById(receiverId)
			.populate("friends.friend");

		const receiverFriend = receiver.toObject().friends.filter((fObj) => {
			const check = fObj.friend._id.toString() == senderId;
			return check;
		});

		let currentStatus;
		if (receiverFriend.length > 0) {
			currentStatus = receiver.friends[0].status;
		}

		if (
			!currentStatus ||
			currentStatus !== friendStatuses.INCOMING_REQUEST
		) {
			throw new Error("No friend request to decline!");
		}

		try {
			await userModel.updateOne(
				{ _id: receiverId },
				{ $pull: { friends: senderId } }
			);

			await userModel.updateOne(
				{ _id: senderId },
				{ $pull: { friends: receiverId } }
			);
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error!");
		}

		return "Canceled friend request successfully!";
	},
};

export function autherize(req, role) {
	if (role && !req.user.roles.role) {
		throw new Error("Unauthorized!");
	}
	if (!req.user) {
		throw new Error("Not logged in!");
	}
}
