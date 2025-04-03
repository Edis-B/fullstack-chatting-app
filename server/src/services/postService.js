import {
	friendStatuses,
	visibilityTypes,
} from "../common/entityConstraints.js";
import commentModel from "../models/Comment.js";
import postModel from "../models/Post.js";
import userModel from "../models/User.js";
import { AppError } from "../utils/errorUtils.js";

const postService = {
	async updatePostVisibility(req) {
		const { userId, postId, newStatus } = req.body;

		if (!userId || !postId || !newStatus) {
			throw new AppError("Missing required fields", 400);
		}

		const post = await postModel.findById(postId).populate("user");

		if (!post) {
			throw new AppError("Post not found", 404);
		}

		if (post.user._id.toString() !== userId) {
			throw new AppError("Unauthorized to update this post", 403);
		}

		if (!Object.values(visibilityTypes).includes(newStatus)) {
			throw new AppError("Invalid visibility status", 400);
		}

		try {
			post.visibility = newStatus;
			await post.save();
			return `Successfully updated post visibility to ${newStatus}`;
		} catch (err) {
			console.error("Update post visibility error:", err);
			throw new AppError("Failed to update post visibility", 500);
		}
	},

	async getPostsFromQuery(req) {
		const { query, page = 1 } = req.query;

		if (!query) {
			throw new AppError("Search query is required", 400);
		}

		const pageSize = 20;
		const skip = (page - 1) * pageSize;

		try {
			const posts = await postModel
				.find({
					content: { $regex: query, $options: "i" },
				})
				.populate("user")
				.skip(skip)
				.limit(pageSize)
				.lean();

			return posts;
		} catch (err) {
			console.error("Search posts error:", err);
			throw new AppError("Failed to search posts", 500);
		}
	},

	async getUserPosts(req) {
		const { profileId } = req.query;
		const userId = req.user?.id;

		if (!profileId) {
			throw new AppError("Profile ID is required", 400);
		}

		try {
			const userObj = await userModel
				.findById(profileId)
				.populate("posts")
				.populate({
					path: "friends.friend",
					match: { _id: userId },
				})
				.lean();

			if (!userObj) {
				throw new AppError("User not found", 404);
			}

			const posibilities = [visibilityTypes.PUBLIC];

			if (userObj.friends?.length > 0) {
				const friendShipStatus = userObj.friends[0].status;
				if (friendShipStatus === friendStatuses.FRIENDS) {
					posibilities.push(visibilityTypes.FRIENDS);
				}
			}

			if (userId === profileId) {
				posibilities.push(visibilityTypes.ONLY_ME);
				posibilities.push(visibilityTypes.FRIENDS);
			}

			if (!userObj.posts) {
				return;
			}

			userObj.posts = userObj.posts.filter((p) => {
				return posibilities.includes(p.visibility);
			});

			let { posts, ...user } = userObj;

			if (posts?.length > 0) {
				for (const post of posts) {
					post.liked = post.likes.some(
						(p) => p._id.toString() === req.user?.id
					);
				}
			}

			return { user, posts };
		} catch (err) {
			console.error("Get user posts error:", err);
			throw new AppError("Failed to get user posts", 500);
		}
	},

	async createPost(req) {
		const { userId, content, images } = req.body;

		if (!userId || !content) {
			throw new AppError("User ID and content are required", 400);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to create post", 403);
		}

		const post = {
			date: Date.now(),
			user: userId,
			content,
			images: images || [],
			visibility: visibilityTypes.PUBLIC, // Default visibility
		};

		try {
			const newPost = await postModel.create(post);
			await userModel.findByIdAndUpdate(userId, {
				$push: { posts: newPost._id },
			});
			return newPost._id;
		} catch (err) {
			console.error("Create post error:", err);
			throw new AppError("Failed to create post", 500);
		}
	},

	async getPost(req) {
		const { postId } = req.query;
		const userId = req.user?.id;

		if (!postId) {
			throw new AppError("Post ID is required", 400);
		}

		try {
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
				throw new AppError("Post not found", 404);
			}

			// Check post visibility
			if (
				post.visibility === visibilityTypes.ONLY_ME &&
				post.user._id.toString() !== userId
			) {
				throw new AppError("This post is private", 403);
			}

			if (
				post.visibility === visibilityTypes.FRIENDS &&
				!post.user.friends.some((f) => f._id.toString() === userId)
			) {
				throw new AppError(
					"Friends-only post: You must be friends to view",
					403
				);
			}

			// Process comments
			post.comments.forEach((comment) => {
				if (userId) {
					comment.liked = comment.likes.some(
						(uId) => uId.toString() === userId
					);
				}
				comment.likesCount = comment.likes.length;
			});

			post.liked = post.likes.some((obj) => obj._id.toString() === userId);

			return post;
		} catch (err) {
			console.error("Get post error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to get post", 500);
		}
	},

	async likePost(req) {
		const { postId, userId } = req.body;

		if (!postId || !userId) {
			throw new AppError("Post ID and User ID are required", 400);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to like this post", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			const user = await userModel.findById(userId);
			if (!user) throw new AppError("User not found", 404);

			const hasAlreadyLiked = post.likes.some(
				(p) => p._id.toString() === userId
			);

			if (hasAlreadyLiked) {
				throw new AppError("You have already liked this post", 400);
			}

			await postModel.findByIdAndUpdate(postId, {
				$push: { likes: userId },
			});

			await userModel.findByIdAndUpdate(userId, {
				$push: { likedPosts: postId },
			});

			return "Successfully liked the post!";
		} catch (err) {
			console.error("Like post error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to like post", 500);
		}
	},

	async removeLikeFromPost(req) {
		const { postId, userId } = req.body;

		if (!postId || !userId) {
			throw new AppError("Post ID and User ID are required", 400);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to unlike this post", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			const user = await userModel.findById(userId);
			if (!user) throw new AppError("User not found", 404);

			const hasLiked = post.likes.some(
				(p) => p._id.toString() === userId
			);
			if (!hasLiked) {
				throw new AppError("You haven't liked this post yet", 400);
			}

			await postModel.findByIdAndUpdate(postId, {
				$pull: { likes: userId },
			});

			await userModel.findByIdAndUpdate(userId, {
				$pull: { likedPosts: postId },
			});

			return "Successfully unliked the post!";
		} catch (err) {
			console.error("Unlike post error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to unlike post", 500);
		}
	},

	async commentOnPost(req) {
		const { postId, userId, content } = req.body;

		if (!postId || !userId || !content) {
			throw new AppError(
				"Post ID, User ID and content are required",
				400
			);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to comment on this post", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			const user = await userModel.findById(userId);
			if (!user) throw new AppError("User not found", 404);

			const newComment = {
				date: Date.now(),
				content,
				user: userId,
			};

			const comment = await commentModel.create(newComment);

			await userModel.findByIdAndUpdate(userId, {
				$push: { comments: comment._id },
			});

			await postModel.findByIdAndUpdate(postId, {
				$push: { comments: comment._id },
			});

			await comment.populate("user");
			return comment.toObject();
		} catch (err) {
			console.error("Create comment error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to create comment", 500);
		}
	},

	async removeCommentFromPost(req) {
		const { postId, userId, commentId } = req.body;

		if (!postId || !userId || !commentId) {
			throw new AppError(
				"Post ID, User ID and Comment ID are required",
				400
			);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to remove this comment", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			const user = await userModel.findById(userId);
			if (!user) throw new AppError("User not found", 404);

			const commentExists = post.comments.some(
				(c) => c.toString() === commentId
			);
			if (!commentExists) {
				throw new AppError("Comment not found on this post", 404);
			}

			await userModel.findByIdAndUpdate(userId, {
				$pull: { comments: commentId },
			});

			await postModel.findByIdAndUpdate(postId, {
				$pull: { comments: commentId },
			});

			return "Successfully removed comment";
		} catch (err) {
			console.error("Remove comment error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to remove comment", 500);
		}
	},

	async likeComment(req) {
		const { postId, userId, commentId } = req.body;

		if (!postId || !userId || !commentId) {
			throw new AppError(
				"Post ID, User ID and Comment ID are required",
				400
			);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to like this comment", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			const user = await userModel.findById(userId);
			if (!user) throw new AppError("User not found", 404);

			const comment = await commentModel.findById(commentId);
			if (!comment) throw new AppError("Comment not found", 404);

			const hasAlreadyLiked = comment.likes.some(
				(uId) => uId.toString() === userId
			);
			
			if (hasAlreadyLiked) {
				throw new AppError("You have already liked this comment", 400);
			}

			await commentModel.findByIdAndUpdate(commentId, {
				$push: { likes: userId },
			});

			return "Successfully liked comment";
		} catch (err) {
			console.error("Like comment error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to like comment", 500);
		}
	},

	async removeLikeFromComment(req) {
		const { postId, userId, commentId } = req.body;

		if (!postId || !userId || !commentId) {
			throw new AppError(
				"Post ID, User ID and Comment ID are required",
				400
			);
		}

		if (req.user?.id !== userId) {
			throw new AppError("Unauthorized to unlike this comment", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			const user = await userModel.findById(userId);
			if (!user) throw new AppError("User not found", 404);

			const comment = await commentModel.findById(commentId);
			if (!comment) throw new AppError("Comment not found", 404);

			const hasLiked = comment.likes.some(
				(uId) => uId.toString() === userId
			);
			if (!hasLiked) {
				throw new AppError("You haven't liked this comment yet", 400);
			}

			await commentModel.findByIdAndUpdate(commentId, {
				$pull: { likes: userId },
			});

			return "Successfully unliked comment";
		} catch (err) {
			console.error("Unlike comment error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to unlike comment", 500);
		}
	},

	async deletePost(req) {
		const { userId, postId } = req.body;

		if (!userId || !postId) {
			throw new AppError("User ID and Post ID are required", 400);
		}

		if (userId !== req.user?.id) {
			throw new AppError("Unauthorized to delete this post", 403);
		}

		try {
			const post = await postModel.findById(postId);
			if (!post) throw new AppError("Post not found", 404);

			await postModel.findByIdAndDelete(postId);
			await userModel.findByIdAndUpdate(userId, {
				$pull: {
					posts: postId,
					likedPosts: postId,
				},
			});

			return "Successfully deleted post";
		} catch (err) {
			console.error("Delete post error:", err);
			if (err instanceof AppError) throw err;
			throw new AppError("Failed to delete post", 500);
		}
	},

	async getTrendingPosts(req) {
		try {
			const trendingPosts = await postModel
				.find()
				.sort({ likes: -1, comments: -1, date: -1 })
				.limit(10)
				.populate("user")
				.populate("comments")
				.lean();

			if (!trendingPosts.length) {
				throw new AppError("No trending posts found", 404);
			}

			return trendingPosts;
		} catch (error) {
			console.error("Error fetching trending posts:", error);
			throw new AppError("Failed to fetch trending posts", 500);
		}
	},
};

export default postService;
