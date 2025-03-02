import userModel from "../models/User.js";

export default {
	async getUserPosts(req) {
		const identifier = req.query.userId;

		const userObj = userModel.findById(identifier).populate("posts").lean();

		if (!userObj) {
			throw new Error("User not found!");
		}

		return userObj.posts;
	},
};
