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
		let id,
			owner = false;
		if (req.query.userId) {
			id = req.query.userId;
		} else {
			owner = true;
			id = req.user.id;
		}

		const user = userModel
			.findById(id)
			.select("username image banner about posts friends photos");

		if (!user) {
			throw new Error("User not found!");
		}

		const userObj = await user.populate("posts").lean();
		if (!owner) {
			if (req.user) {
				const currentUser = await userModel
					.findById(req.user.id)
					.select({
						friends: {
							$elemMatch: { friend: userObj._id },
						},
					});

				if (currentUser.friends.length > 0) {
					userObj.ourStatus = currentUser.friends[0].status;
				} else {
					userObj.ourStatus = friendStatuses.NOT_FRIENDS;
				}
			}

			userObj.friends = userObj.friends.filter(
				(f) => f.status === friendStatuses.FRIENDS
			);
		}

		await userModel.populate(userObj, {
			path: "friends.friend",
			select: "username image",
		});

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
	async sendFriendRequest(req) {
		const sender = req.user;
		if (!sender) {
			throw new Error("Not Logged in!");
		}

		const receiver = await this.getUserByUsername(req.body.receiver);
		if (!receiver || sender.username === receiver.username) {
			throw new Error("Invalid friend request!");
		}

		const areAlreadyConnected = sender.friends.some((x) => {
			return x.friend.equals(receiver._id);
		});

		if (areAlreadyConnected) {
			throw new Error("You are already friends with user!");
		}

		try {
			sender.friends.push({
				status: friendStatuses.OUTGOING_REQUEST,
				friend: receiver._id,
			});
			receiver.friends.push({
				status: friendStatuses.INCOMING_REQUEST,
				friend: sender._id,
			});

			await sender.save();
			await receiver.save();
		} catch (err) {
			console.log(err);

			throw new Error("There has been an error!");
		}

		return "Sent friend request successfully!";
	},
	async getAllFriendsOfUsername(username) {
		const user = await this.getUserByUsername(username).populate("friends");

		return user.friends;
	},
	async getAllChatsOfUser(req) {
		let user = await userModel.findOne({ _id: req.user._id });

		const friends = (await user.populate("friends.friend")).friends;
		const chats = (await user.populate("chats.chat")).chats;

		return friends;
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
};

export function autherize(req, role) {
	if (role && !req.user.roles.role) {
		throw new Error("Unauthorized!");
	}

	if (!req.user) {
		throw new Error("Not logged in!");
	}
}
