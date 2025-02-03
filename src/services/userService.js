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

		res.cookie("test", "testing");

		if (body.rememberMe) {
		}

		return true;
	},
};
