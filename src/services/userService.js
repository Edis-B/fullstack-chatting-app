import userModel from "../models/User.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

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
	async isLoggedIn(req) {
		if (!req.cookies || !req.cookies.userId) {
			return false;
		}

		const parsedCookie = JSON.parse(req.cookies.userId);
		const expiryDate = new Date(parsedCookie.expires);

		if (expiryDate < Date.now) {
			return false;
		} 

		return userModel.findOne().where("username").equals(parsedCookie.username);
	}
};
