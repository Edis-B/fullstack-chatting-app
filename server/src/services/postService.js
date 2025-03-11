import commentModel from "../models/Comment.js";
import postModel from "../models/Post.js";
import userModel from "../models/User.js";

export default {
	async getUserPosts(req) {
		const identifier = req.query.userId;

		const userObj = await userModel
			.findById(identifier)
			.populate("posts")
			.lean();

		if (!userObj) {
			throw new Error("User not found!");
		}

		const { posts, ...user } = userObj;
		return { user, posts };
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

		try {
			await userModel.findByIdAndUpdate(userId, {
				$push: { posts: newPostId },
			});
		} catch (err) {
			console.log(err);
			throw new Error("Somehing went wrong creating post!");
		}

		return "Successfully created post";
	},
	async getPost(req) {
		const { postId } = req.query;

		const post = await postModel
			.findById(postId)
			.populate("user")
			.populate("images")
			.populate({
				path: "comments",
				populate: { path: "user" },
			})
			.populate("likes")
			.lean();

		if (!post) {
			throw new Error("Could not find post!");
		}

		return post;
	},
	async likePost(req) {
		const { postId, userId } = req.body;

		const post = await postModel.findById(postId);
		if (!post) throw new Error("Post not found");

		if (req.user?.id != userId) throw new Error("Unauthorized!");
		const user = await userModel.findById(userId);

		if (!user) throw new Error("Could not find user");

		if (post.user == userId) throw new Error("Cannot like your own post!");

		const hasAlreadyLiked = post.likes.some(
			(p) => p._id.toString() == userId
		);

		if (hasAlreadyLiked)
			throw new Error("You have already liked this post!");

		try {
			await postModel.findByIdAndUpdate(postId, {
				$push: {
					likes: userId,
				},
			});

			await userModel.findByIdAndUpdate(userId, {
				$push: {
					likedPosts: postId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong liking the post");
		}

		return "Successfully liked the post!";
	},
	async removeLikeFromPost(req) {
		const { postId, userId } = req.body;

		const post = await postModel.findById(postId);
		if (!post) throw new Error("Post not found");

		if (req.user?.id != userId) throw new Error("Unauthorized!");
		const user = await userModel.findById(userId);

		if (!user) throw new Error("Could not find user");

		if (post.user == userId)
			throw new Error("Cannot unlike your own post!");

		const hasAlreadyLiked = post.likes.some(
			(p) => p._id.toString() == userId
		);

		if (!hasAlreadyLiked) throw new Error("You have not liked this post!");

		try {
			await postModel.findByIdAndUpdate(postId, {
				$pull: {
					likes: userId,
				},
			});

			await userModel.findByIdAndUpdate(userId, {
				$pull: {
					likedPosts: postId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong unliking the post");
		}

		return "Successfully unliked the post!";
	},
	async commentOnPost(req) {
		const { postId, userId, content } = req.body;

		const post = await postModel.findById(postId);
		if (!post) throw new Error("Post not found");

		if (req.user?.id != userId) throw new Error("Unauthorized!");
		const user = await userModel.findById(userId);

		if (!user) throw new Error("Could not find user");

		const newComment = {
			date: Date.now(),
			content,
			user: userId,
		};

		let comment;

		try {
			comment = await commentModel.create(newComment);

			await userModel.findByIdAndUpdate(userId, {
				$push: {
					comments: comment._id,
				},
			});

			await postModel.findByIdAndUpdate(postId, {
				$push: {
					comments: comment._id,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error creating commment");
		}

		return comment.toObject();
	},
	async removeCommentFromPost(req) {
		const { postId, userId, commentId } = req.body;

		const post = await postModel.findById(postId);
		if (!post) throw new Error("Post not found");

		if (req.user?.id != userId) throw new Error("Unauthorized!");
		const user = await userModel.findById(userId);

		if (!user) throw new Error("Could not find user");

		const exists = post.comments.some(
			(p) => p.comment.toString() == commentId
		);

		if (!exists)
			throw new Error("Such a comment does not exist on this post!");

		try {
			await userModel.findByIdAndUpdate(userId, {
				$pull: {
					comments: commentId,
				},
			});

			await postModel.findByIdAndUpdate(postId, {
				$pull: {
					comments: commentId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error creating commment");
		}

		return "Successfully removed comment";
	},
	async likeComment(req) {
		const { postId, userId, commentId } = req.body;

		const post = await postModel.findById(postId);
		if (!post) throw new Error("Post not found");

		if (req.user?.id != userId) throw new Error("Unauthorized!");
		const user = await userModel.findById(userId);

		if (!user) throw new Error("Could not find user");

		const comment = post.comments.find(
			(p) => p.comment.toString() === commentId
		);

		if (!comment)
			throw new Error("Such a comment does not exist on this post!");

		try {
			await userModel.findByIdAndUpdate(commentId, {
				$pull: {
					likes: userId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error liking commment");
		}

		return "Successfully liked comment";
	},
	async removeLikeFromComment(req) {
		const { postId, userId, commentId } = req.body;

		const post = await postModel.findById(postId);
		if (!post) throw new Error("Post not found");

		if (req.user?.id != userId) throw new Error("Unauthorized!");
		const user = await userModel.findById(userId);

		if (!user) throw new Error("Could not find user");

		const comment = post.comments.find(
			(p) => p.comment.toString() === commentId
		);

		if (!comment)
			throw new Error("Such a comment does not exist on this post!");

		try {
			await userModel.findByIdAndUpdate(commentId, {
				$pull: {
					likes: userId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("There has been an error unliking the commment");
		}

		return "Successfully unliked comment";
	},
};
