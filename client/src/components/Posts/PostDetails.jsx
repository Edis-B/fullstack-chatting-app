import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";

import { host } from "../../common/appConstants.js";
import { dateToString } from "../../utils/dateUtils.js";
import {
	commentOnPost,
	likePost,
	removeLikeFromPost,
} from "../../services/postAPIs.js";

import { useUser } from "../../contexts/UserContext.jsx";

import CommentSection from "./CommentSection.jsx";
import LikePost from "../Buttons/LikePost.jsx";

import "../../css/post.css";
import DeletePost from "../Buttons/DeletePost.jsx";
import { useImageModal } from "../../hooks/photos.jsx";
import EditPostVisibility from "./EditPostVisibility.jsx";
import request from "../../utils/request.js";

export default function PostDetails() {
	const navigate = useNavigate();

	const { userId, notifications } = useUser();
	const { postId } = useParams();

	const [post, setPost] = useState({});
	const [myComment, setMyComment] = useState("");

	const [isErrorIntentional, setIsErrorIntentional] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const { Image, ImageModal } = useImageModal();

	useEffect(() => {
		if (!postId) return;

		fetchPostData();
	}, [postId]);

	async function fetchPostData() {
		try {
			const { response, payload } = await request.get(
				`${host}/post/get-post`,
				{
					postId,
				}
			);

			const { data } = payload;

			if (!response.ok) {
				notifications.enqueueError(payload.message);

				// Check if error is intentional
				if (payload.extraProps) {
					setIsErrorIntentional(
						payload.extraProps.intentional || false
					);
					setErrorMessage(
						payload.extraProps.message || "An error occurred."
					);
				}

				return;
			}

			setPost(data);
		} catch (err) {
			console.log(err);
		}
	}

	function likeStateChange() {
		setPost((prevPost) => {
			prevPost.liked = !prevPost.liked;
			return prevPost;
		});
	}

	function setPostStatus(newStatus) {
		setPost((prev) => ({
			...prev,
			visibility: newStatus,
		}));
	}

	if (!post || Object.keys(post).length === 0) {
		return (
			<>
				{/* Display error message if the error was intentional */}
				{isErrorIntentional && errorMessage ? (
					<div className="alert alert-warning mt-3">
						<p>{errorMessage}</p>
					</div>
				) : (
					<p>Loading...</p>
				)}
			</>
		);
	}

	const commentOnPostAction = async () => {
		if (!userId) {
			navigate("/login");
		}

		const newComment = await commentOnPost(
			postId,
			userId,
			myComment,
			notifications
		);

		if (newComment) {
			setMyComment("");
			setPost((prev) => ({
				...prev,
				comments: [newComment, ...prev.comments],
			}));
		}
	};

	return (
		<div className="m-3 p-3 d-flex justify-content-around">
			{/* Post Details (Left Side) */}
			<div className="post-box d-flex flex-column justify-content-between card p-3 shadow-sm">
				<div>
					{/* Card Header */}
					<div className="border-bottom pb-2 d-flex flex-row justify-content-between">
						<Link
							to={`/profile/${post.user._id}`}
							className="d-flex align-items-center "
						>
							<img
								src={post.user.image}
								className="person-avatar me-2"
								alt="Profile"
								style={{
									width: "40px",
									height: "40px",
								}}
							/>
							<div>
								<h6 className="mb-0">{post.user.username}</h6>
								<p className="text-muted small mb-0">
									{dateToString(post.date)}
								</p>
							</div>
						</Link>

						{userId === post.user._id ? (
							<EditPostVisibility
								post={post}
								userId={userId}
								setPostStatus={setPostStatus}
							/>
						) : (
							<div className="d-flex flex-row">
								<p className="m-1">Visibility:</p>
								<b className="m-1">{post.visibility}</b>
							</div>
						)}
					</div>

					{/* Card Body (Content) */}
					<div className="mt-2 d-flex justify-content-start flex-wrap">
						<p>{post.content}</p>
					</div>
					{post.images?.length > 0 && (
						<div className="d-flex flex-wrap">
							{post.images.map((image, index) =>
								Image(image, index)
							)}
						</div>
					)}
				</div>

				{/* Card Footer (Interactions) */}
				<div className="d-flex justify-content-between align-items-center mt-3 border-top pt-2">
					{post.user._id === userId && (
						<DeletePost
							value={{
								postId,
								action: () => navigate("/profile"),
							}}
						/>
					)}

					<LikePost value={{ post, likeStateChange }} />
				</div>
			</div>

			{/* Comments */}
			<div className="comment-section ms-3">
				<h6>Comments</h6>
				{/* Add Comment Box */}
				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						onChange={(e) => setMyComment(e.target.value)}
						value={myComment}
						placeholder="Add a comment..."
					/>

					<button
						className="btn btn-outline-primary"
						onClick={commentOnPostAction}
					>
						Post
					</button>
				</div>

				<CommentSection post={post} />
			</div>

			{ImageModal(post.user)}
		</div>
	);
}
