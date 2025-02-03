import userModel from "../models/User.js";

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

        const { confirmPassword, ...userData } = body;

        console.log(userData);
        
		userModel.create(userData);

		return true;
	},
};
