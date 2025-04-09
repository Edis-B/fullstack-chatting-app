import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import { friendStatuses } from "../common/entityConstraints.js";
import { attachAuthCookie } from "../utils/authUtils.js";
import photoModel from "../models/Photo.js";

const userService = {
	checkIf2UsersAreFriends(user1, user2Id) {
		return (
			user1.friends.some((obj) => obj.friend._id === user2Id) ||
			user1._id.toString() === user2Id
		);
	},

	async updateProfile(req, res) {
		const { profileData } = req.body;

		const user = await userModel
			.findByIdAndUpdate(
				profileData._id,
				{
					image: profileData.image,
					banner: profileData.banner,
					username: profileData.username,
					about: profileData.about,
				},
				{ new: true }
			)
			.lean();

		attachAuthCookie(res, user, false);

		return "Successfully updated profile!";
	},
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
	async loginUser(req, res) {
		const body = req.body;
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

		return "Successfully logged out!";
	},
	// Returns false or the user entity
	async getUserFromReq(req) {
		if (!req.cookies || !req.cookies.userId) {
			return false;
		}

		const parsedCookie = JSON.parse(req.cookies.userId);
		const expiryDate = new Date(parsedCookie.expires);

		if (expiryDate < Date.now()) {
			return false;
		}

		const user = await userModel.findById(parsedCookie._id);

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

		const userObj = (await user.populate("friends.friend")).toObject();

		const result = {};

		for (const type of Object.values(friendStatuses)) {
			result[type] = [];
		}

		for (const friendObj of userObj.friends) {
			result[friendObj.status].push(friendObj.friend);
		}

		result.owner = req.user?.id == userObj._id;

		return result;
	},
	async getPeopleByUserSubstring(req) {
		const { usernameSubstr } = req.query;
		const exclude = req.query.exclude === "true";
		const page = Number(req.query.page) || 1;

		const filter = [
			{
				username: { $regex: usernameSubstr, $options: "i" },
			},
		];

		if (exclude && req.user) {
			filter.push({ username: { $ne: req.user.username } });
		}

		const mongoFilter = {
			$and: [
				{ username: { $regex: usernameSubstr, $options: "i" } },
				{ username: { $ne: req.user.username } },
			],
		};

		const pageSize = 10;
		const users = await userModel
			.find(mongoFilter)
			.skip(pageSize * (page - 1))
			.limit(pageSize)
			.lean();

		if (req.user) {
			const myFriends = (await userModel.findById(req.user.id).lean())
				.friends;

			for (const user of users) {
				const friendObj = myFriends.find((f) =>
					f.friend._id.equals(user._id)
				);

				if (friendObj) {
					user.friendshipStatus = friendObj.status;
					continue;
				}
			}
		}

		return users;
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
			currentStatus = receiverFriend[0].status;
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
			currentStatus = receiverFriend[0].status;
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
			currentStatus = receiverFriend[0].status;
		}

		if (currentStatus !== friendStatuses.OUTGOING_REQUEST) {
			throw new Error("Cannot decline friend request!");
		}

		try {
			await userModel.updateOne(
				{ _id: receiverId },
				{ $pull: { friends: { friend: senderId } } }
			);

			await userModel.updateOne(
				{ _id: senderId },
				{ $pull: { friends: { friend: receiverId } } }
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
			currentStatus = receiverFriend[0].status;
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
				{ $pull: { friends: { friend: senderId } } }
			);

			await userModel.updateOne(
				{ _id: senderId },
				{ $pull: { friends: { friend: receiverId } } }
			);
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error!");
		}

		return "Canceled friend request successfully!";
	},
	async unfriend(req) {
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
			currentStatus = receiverFriend[0].status;
		}

		if (currentStatus && currentStatus !== friendStatuses.FRIENDS) {
			throw new Error("Not friends with user!");
		}

		try {
			await userModel.updateOne(
				{ _id: receiverId },
				{ $pull: { friends: { friend: senderId } } }
			);

			await userModel.updateOne(
				{ _id: senderId },
				{ $pull: { friends: { friend: receiverId } } }
			);
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error!");
		}

		return "Removed friend successfully!";
	},
};

export default userService;
