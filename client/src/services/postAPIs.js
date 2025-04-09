import { host } from "../common/appConstants.js";
import { useUser } from "../contexts/UserContext.jsx";
import request from "../utils/request.js";

export async function likePost(postId, userId, { enqueueError, enqueueInfo }) {
	try {
		if (!postId) return;
		if (!userId) return;

		const { response, payload } = await request.post(
			`${host}/post/like-post`,
			{
				postId,
				userId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		enqueueInfo(data);
		return { message: data, success: true };
	} catch (err) {
		console.log(err);
		enqueueError("There has been a problem liking post");
	}
}

export async function removeLikeFromPost(
	postId,
	userId,
	{ enqueueError, enqueueInfo }
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const { response, payload } = await request.post(
			`${host}/post/remove-like-from-post`,
			{
				postId,
				userId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		enqueueInfo(data);
		return { message: data, success: true };
	} catch (err) {
		console.log(err);
		enqueueError("There has been a problem unliking post");
	}
}

export async function commentOnPost(
	postId,
	userId,
	content,
	{ enqueueError, enqueueInfo }
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const { response, payload } = await request.post(
			`${host}/post/comment-on-post`,
			{
				postId,
				userId,
				content,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		return data;
	} catch (err) {
		console.log(err);
		enqueueError("There has been a problem commenting on post");
	}
}

export async function removeCommentFromPost(
	postId,
	userId,
	commentId,
	{ enqueueError, enqueueInfo }
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const { response, payload } = await request.post(
			`${host}/post/remove-comment-from-post`,
			{
				postId,
				userId,
				commentId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		enqueueInfo(data);
		return data;
	} catch (err) {
		console.log(err);
		enqueueError(
			"There has been a problem removing the comment from the post"
		);
	}
}

export async function likeComment(
	postId,
	userId,
	commentId,
	{ enqueueError, enqueueInfo }
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const { response, payload } = await request.post(
			`${host}/post/like-comment`,
			{
				postId,
				userId,
				commentId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		enqueueInfo(data);
		return { data: data, success: true };
	} catch (err) {
		console.log(err);
		enqueueError("There has been a problem liking comment");
		return;
	}
}

export async function removeLikeFromComment(
	postId,
	userId,
	commentId,
	{ enqueueError, enqueueInfo }
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const { response, payload } = await request.post(
			`${host}/post/remove-like-from-comment`,
			{
				postId,
				userId,
				commentId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		enqueueInfo(data);
		return { data: data, success: true };
	} catch (err) {
		console.log(err);
		enqueueError("There has been a problem unliking comment");
		return;
	}
}
