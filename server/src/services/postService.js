import commentModel from "../models/Comment.js";
import postModel from "../models/Post.js";
import userModel from "../models/User.js";

const postService = {
	async getPostsFromQuery(req) {
		const { query, page } = req.query;

		const pageSize = 20;

		const posts = await postModel
			.find({
				content: { $regex: query, $options: "i" },
			})
			.populate("user")
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.lean();

		return posts;
	},
	async getUserPosts(req) {
		const identifier = req.query.userId;

		const userObj = await userModel
			.findById(identifier)
			.populate("posts")
			.lean();

		if (!userObj) {
			throw new Error("User not found!");
		}

		let { posts, ...user } = userObj;

		for (const post of posts) {
			post.liked = post.likes.some((p) => p._id.toString() === req.user?.id);
		}

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

		try {
			const newPostId = await postModel.create(post);

			await userModel.findByIdAndUpdate(userId, {
				$push: { posts: newPostId },
			});

			return newPostId._id;
		} catch (err) {
			console.log(err);
			throw new Error("Somehing went wrong creating post!");
		}
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

		const userId = req.user?.id;

		post.comments.map((comment) => {
			if (userId) {
				const hasLiked = comment.likes.some(
					(uId) => uId.toString() === userId
				);
				comment.liked = hasLiked;
			}

			comment.likesCount = comment.likes.length;
		});

		post.liked = post.likes.some((id) => id.toString() === userId);

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

		try {
			await comment.populate("user");
		} catch (err) {
			console.log(err);
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

		const exists = post.comments.some((c) => c.toString() == commentId);

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

		const comment = post.comments.find((p) => p.toString() === commentId);

		if (!comment)
			throw new Error("Such a comment does not exist on this post!");

		try {
			await commentModel.findByIdAndUpdate(commentId, {
				$push: {
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

		const comment = post.comments.find((p) => p.toString() === commentId);

		if (!comment)
			throw new Error("Such a comment does not exist on this post!");

		try {
			await commentModel.findByIdAndUpdate(commentId, {
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
	async deletePost(req) {
		const { userId, postId } = req.body;

		if (userId != req.user._id) {
			throw new Error("Unauthorized");
		}

		try {
			await postModel.findByIdAndDelete(postId);
			await userModel.findByIdAndUpdate(userId, {
				$pull: {
					posts: postId,
					likedPosts: postId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong deleting post");
		}

		return "Successfully deleted post";
	},
};

export default postService;
