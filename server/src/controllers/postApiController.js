import { Router } from "express";
import postService from "../services/postService.js";
import { catchAsync } from "../utils/errorUtils.js";

const postApiController = Router();

// Apply catchAsync to all route handlers to avoid try-catch blocks
postApiController.put(
	"/update-post-visibility",
	catchAsync(async (req, res) => {
		const result = await postService.updatePostVisibility(req);
		res.json(result);
	})
);

postApiController.get(
	"/get-trending-posts",
	catchAsync(async (req, res) => {
		const result = await postService.getTrendingPosts(req);
		res.json(result);
	})
);

postApiController.delete(
	"/delete-post",
	catchAsync(async (req, res) => {
		const result = await postService.deletePost(req);
		res.json({
			status: "success",
			data: result,
		});
	})
);

postApiController.get(
	"/get-posts-by-content",
	catchAsync(async (req, res) => {
		const result = await postService.getPostsFromQuery(req);
		res.json({
			status: "success",
			results: result.length,
			data: result,
		});
	})
);

postApiController.post(
	"/remove-like-from-comment",
	catchAsync(async (req, res) => {
		const result = await postService.removeLikeFromComment(req);
		res.json({
			status: "success",
			data: result,
		});
	})
);

postApiController.post(
	"/like-comment",
	catchAsync(async (req, res) => {
		const result = await postService.likeComment(req);
		res.json({
			status: "success",
			data: result,
		});
	})
);

postApiController.post(
	"/remove-comment-from-post",
	catchAsync(async (req, res) => {
		const result = await postService.removeCommentFromPost(req);
		res.json({
			status: "success",
			data: result,
		});
	})
);

postApiController.post(
	"/comment-on-post",
	catchAsync(async (req, res) => {
		const result = await postService.commentOnPost(req);
		res.status(201).json({
			status: "success",
			data: result,
		});
	})
);

postApiController.post(
	"/remove-like-from-post",
	catchAsync(async (req, res) => {
		const result = await postService.removeLikeFromPost(req);
		res.json({
			status: "success",
			data: result,
		});
	})
);

postApiController.post(
	"/like-post",
	catchAsync(async (req, res) => {
		const result = await postService.likePost(req);
		res.status(201).json({
			status: "success",
			data: result,
		});
	})
);

postApiController.get(
	"/get-post",
	catchAsync(async (req, res) => {
		const result = await postService.getPost(req);
		res.json({
			status: "success",
			data: result,
		});
	})
);

postApiController.post(
	"/create-post",
	catchAsync(async (req, res) => {
		const result = await postService.createPost(req);
		res.status(201).json({
			status: "success",
			data: result,
		});
	})
);

postApiController.get(
	"/get-user-posts",
	catchAsync(async (req, res) => {
		const result = await postService.getUserPosts(req);
		res.json({
			status: "success",
			results: result.posts.length,
			data: result,
		});
	})
);

export default postApiController;
