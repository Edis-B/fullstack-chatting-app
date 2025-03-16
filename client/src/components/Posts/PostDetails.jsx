import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { host } from "../../common/appConstants.js";
import { dateToString } from "../../utils/dateUtils.js";
import { Link } from "react-router";
import {
	commentOnPost,
	removeCommentFromPost,
	likeComment,
	likePost,
	removeLikeFromComment,
	removeLikeFromPost,
} from "../../services/postAPIs.js";
import { useUser } from "../../contexts/UserContext.jsx";

import "../../css/post.css";

export default function PostDetails() {
	const { userId, setErrors, socket } = useUser();
	const { postId } = useParams();

	const [post, setPost] = useState({});
	const [myComment, setMyComment] = useState(null);

	useEffect(() => {
		if (!postId) return;

		fetchPostData();
	}, [postId]);

	async function fetchPostData() {
		try {
			const response = await fetch(
				`${host}/post/get-post?postId=${postId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			setPost(data);
		} catch (err) {
			console.log(err);
		}
	}

	if (!post.user) {
		return <span>Loading...</span>;
	}

	return (
		<div className="m-3 p-3 d-flex justify-content-around">
			{/* Post Details (Left Side) */}
			<div className="post-box card p-3 shadow-sm">
				{/* Card Header */}
				<Link to={`/profile/${post.user._id}`}>
					<div className="d-flex align-items-center border-bottom pb-2">
						<img
							src={post.user.image}
							className="rounded-circle me-2"
							alt="Profile"
							width="40"
							height="40"
						/>
						<div>
							<h6 className="mb-0">{post.user.username}</h6>
							<p className="text-muted small mb-0">
								{dateToString(post.date)}
							</p>
						</div>
					</div>
				</Link>

				{/* Card Body (Content) */}
				<div className="mt-2">
					<p>{post.content}</p>
					{post.images.length > 0 && (
						<div className="d-flex flex-wrap">
							{post.images.map((image, index) => (
								<img
									key={index}
									src={image}
									className="img-fluid rounded me-2 mb-2"
									alt="Post"
									style={{ maxWidth: "100px" }}
								/>
							))}
						</div>
					)}
				</div>

				{/* Card Footer (Interactions) */}
				<div className="d-flex justify-content-between mt-3 border-top pt-2">
					<Link
						to={`/post/${post._id}`}
						className="btn btn-outline-primary btn-sm"
					>
						View Details
					</Link>
					<div>
						<span className="m-1">{post.likes.length}</span>
						{post.liked ? (
							<button
								onClick={async () =>
									await removeLikeFromPost(
										postId,
										userId,
										setErrors
									)
								}
								className="btn btn-outline-primary btn-sm"
							>
								Unlike
							</button>
						) : (
							<button
								onClick={async () =>
									await likePost(postId, userId, setErrors)
								}
								className="btn btn-outline-primary btn-sm"
							>
								Like
							</button>
						)}
					</div>
					<button className="btn btn-outline-success btn-sm">
						Share
					</button>
				</div>
			</div>

			{/* Comment Section (Right Side) */}
			<div className="comment-section ms-3">
				<h6>Comments</h6>
				{/* Add Comment Box */}
				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						onChange={(e) => setMyComment(e.target.value)}
						placeholder="Add a comment..."
					/>
					<button
						className="btn btn-outline-primary"
						onClick={async () => {
							const newComment = await commentOnPost(
								postId,
								userId,
								myComment,
								setErrors
							);

							if (newComment) {
								setPost((prev) => ({
									...prev,
									comments: [newComment, ...prev.comments], // ✅ Immutably update state
								}));
							}
						}}
					>
						Post
					</button>
				</div>

				{/* Comments */}
				{post.comments?.length > 0 ? (
					<div className="comment">
						{post.comments.map((comment) => (
							<div
								key={comment._id}
								className="d-flex align-items-start justify-content-around gap-2 p-2 border rounded"
							>
								{/* Profile Picture */}
								<img
									src={comment.user.image}
									alt={`${comment.user.username}'s profile`}
									className="rounded-circle"
									width="40"
									height="40"
								/>

								{/* Comment Content */}
								<div>
									<strong>{comment.user.username}</strong>{" "}
									<small className="text-muted d-block">
										{dateToString(comment.date)}
									</small>
									<p className="mb-0">{comment.content}</p>
								</div>

								{/* Like Button (Heart) */}
								{comment.liked ? (
									<button
										className="btn p-0"
										onClick={async () => {
											if (
												await removeLikeFromComment(
													postId,
													userId,
													comment._id,
													setErrors
												)
											) {
												setPost((prevPost) => ({
													...prevPost,
													comments:
														prevPost.comments.map(
															(c) =>
																c._id ===
																comment._id
																	? {
																			...c,
																			liked: !c.liked,
																	  }
																	: c
														),
												}));
											}
										}}
									>
										<i
											className="bi bi-heart-fill text-danger"
											style={{ fontSize: "1.2rem" }}
										></i>
									</button>
								) : (
									<button
										className="btn p-0"
										onClick={async () => {
											if (
												await likeComment(
													postId,
													userId,
													comment._id,
													setErrors
												)
											) {
												setPost((prevPost) => ({
													...prevPost,
													comments:
														prevPost.comments.map(
															(c) =>
																c._id ===
																comment._id
																	? {
																			...c,
																			liked: !c.liked,
																	  }
																	: c
														),
												}));
											}
										}}
									>
										<i
											className="bi bi-heart"
											style={{ fontSize: "1.2rem" }}
										></i>
									</button>
								)}
							</div>
						))}
					</div>
				) : (
					<p>No comments yet!</p>
				)}
			</div>
		</div>
	);
}
