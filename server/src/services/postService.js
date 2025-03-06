import postModel from "../models/Post.js";
import userModel from "../models/User.js";

export default {
	async getUserPosts(req) {
		const identifier = req.query.userId;

		const userObj = userModel
			.findById(identifier)
			.populate("posts")
			.populate("user")
			.lean();

		if (!userObj) {
			throw new Error("User not found!");
		}

		return userObj.posts;
	},
	async createPost(req) {
		const { userId, content, images } = req.body;
		if (req.user?.id != userId) {
			throw new Error("Unauthorized");
		}

		const post = {
			date: Date.now(),
			user: userId,
			content,
			images,
		};

		const newPostId = await postModel.create(post);

		userModel.findByIdAndUpdate(userId, {
			$push: { posts: newPostId },
		});

		return "Successfully created post";
	},
};
