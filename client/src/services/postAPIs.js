import { host } from "../common/appConstants.js";
import { useUser } from "../contexts/UserContext.jsx";

export async function likePost(postId, userId, setErrors) {
	try {
		if (!postId) return;
		if (!userId) return;

		const response = await fetch(`${host}/post/like-post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				postId,
				userId,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			setErrors((prev) => [...prev, data]);
			return;
		}

		return data;
	} catch (err) {
		console.log(err);
		setErrors((prev) => [...prev, "There has been a problem liking post"]);
	}
}

export async function removeLikeFromPost(postId, userId, setErrors) {
	try {
		if (!postId) return;
		if (!userId) return;

		const response = await fetch(`${host}/post/remove-like-from-post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				postId,
				userId,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			setErrors((prev) => [...prev, data]);
			return;
		}

		return data;
	} catch (err) {
		console.log(err);
		setErrors((prev) => [
			...prev,
			"There has been a problem unliking post",
		]);
	}
}

export async function commentOnPost(postId, userId, content, setErrors) {
	try {
		if (!postId) return;
		if (!userId) return;

		const response = await fetch(`${host}/post/comment-on-post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				postId,
				userId,
				content,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			setErrors((prev) => [...prev, data]);
			return;
		}

		return data;
	} catch (err) {
		console.log(err);
		setErrors((prev) => [
			...prev,
			"There has been a problem commenting on post",
		]);
	}
}

export async function removeCommentFromPost(
	postId,
	userId,
	commentId,
	setErrors
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const response = await fetch(`${host}/post/remove-comment-from-post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				postId,
				userId,
				commentId,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			setErrors((prev) => [...prev, data]);
			return;
		}

		return data;
	} catch (err) {
		console.log(err);
		setErrors((prev) => [
			...prev,
			"There has been a problem removing the comment from the post",
		]);
	}
}

export async function likeComment(postId, userId, commentId, setErrors) {
	try {
		if (!postId) return;
		if (!userId) return;

		const response = await fetch(`${host}/post/like-comment`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				postId,
				userId,
				commentId,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			setErrors((prev) => [...prev, data]);
			return;
		}

		alert(data);
		return data;
	} catch (err) {
		console.log(err);
		setErrors((prev) => [
			...prev,
			"There has been a problem liking comment",
		]);
		return;
	}
}

export async function removeLikeFromComment(
	postId,
	userId,
	commentId,
	setErrors
) {
	try {
		if (!postId) return;
		if (!userId) return;

		const response = await fetch(`${host}/post/remove-like-from-comment`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				postId,
				userId,
				commentId,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			setErrors((prev) => [...prev, data]);
			return;
		}

		alert(data);
		return data;
	} catch (err) {
		console.log(err);
		setErrors((prev) => [
			...prev,
			"There has been a problem unliking comment",
		]);
		return;
	}
}
