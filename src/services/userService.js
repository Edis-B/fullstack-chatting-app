import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import friendStatuses from "../common/friendStatusConstants.js";

export default {
	async createAccount(body) {
		if (body.password !== body.confirmPassword) {
			return "Passwords do not match";
		}

		if (await userModel.findOne().where("username").equals(body.username)) {
			return "Username is already taken";
		}

		if (await userModel.findOne().where("email").equals(body.email)) {
			return "Email is already registered";
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

		let { friends, _id, passwordHash, ...userIdCookie } = user.toObject();

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
	async isLoggedIn(req) {
		if (!req.cookies || !req.cookies.userId) {
			return false;
		}

		const parsedCookie = JSON.parse(req.cookies.userId);
		const expiryDate = new Date(parsedCookie.expires);

		if (expiryDate < Date.now) {
			return false;
		}

		return userModel
			.findOne()
			.where("username")
			.equals(parsedCookie.username);
	},
	async getUserByUsername(username) {
		if (!username) {
			return;
		}

		return userModel.findOne().where("username").equals(username);
	},
	async sendFriendRequest(req) {
		const sender = await this.isLoggedIn(req);

		if (!!sender) {
			return false;
		}

		const receiver = await this.getUserByUsername(req.body.receiver);

		if (!!receiver) {
			return false;
		}

		sender.friends.push({
			_id: receiver._id,
			status: friendStatuses.OUTGOING_REQUEST,
		});
		
		receiver.friends.push({
			_id: sender._id,
			status: friendStatuses.INCOMING_REQUEST,
		});

		return true;
	},
};
