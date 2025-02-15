import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import friendStatuses from "../common/friendStatusConstants.js";

export default {
	async createAccount(body) {
		if (body.password !== body.confirmPassword) {
			throw new Error("Passwords do not match");
		}

		if (await userModel.findOne().where("username").equals(body.username)) {
			throw new Error("Username is already taken");
		}

		if (await userModel.findOne().where("email").equals(body.email)) {
			throw new Error("Email is already registered");
		}

		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const passwordHash = await bcrypt.hash(body.password, salt);

		userModel.create({ ...body, passwordHash });

		return true;
	},
	async loginUser(body, res) {
		let isEmail = body.identifier.includes("@");

		let user = await userModel
			.findOne()
			.where(isEmail ? "email" : "username")
			.equals(body.identifier);

		if (!user) {
			return "Incorrect identifier or password";
		}

		// Compare the provided password with the stored password hash
		let isPasswordValid = await bcrypt.compare(
			body.password,
			user.passwordHash
		);

		if (!isPasswordValid) {
			return "Incorrect identifier or password";
		}

		let { friends, passwordHash, ...userIdCookie } = user.toObject();

		const cookieExpirationDate = body.rememberMe
			? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Days
			: new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 Hours

		userIdCookie.expires = cookieExpirationDate.toISOString();

		res.cookie("userId", JSON.stringify(userIdCookie), {
			httpOnly: true,
			expires: cookieExpirationDate,
			sameSite: "Strict",
		});

		return true;
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

		const user = userModel
			.findOne({ username: parsedCookie.username});

		return user;
	},
	async getUserByUsername(username) {
		if (!username) {
			return;
		}

		return userModel.findOne({ username: username });
	},
	async sendFriendRequest(req) {
		const sender = await this.getUserFromReq(req);
		if (!sender) {
			return false;
		}

		const receiver = await this.getUserByUsername(req.body.receiver);
		if (!receiver || sender == receiver) {
			return false;
		}

		const areAlreadyConnected = sender.friends.includes(receiver._id);
		if (areAlreadyConnected) {
			return false;
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
			return false;
		}

		return true;
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
};
