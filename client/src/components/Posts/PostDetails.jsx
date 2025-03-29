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

export default function PostDetails() {
	const navigate = useNavigate();

	const { userId, enqueueError } = useUser();
	const { postId } = useParams();

	const [post, setPost] = useState({});
	const [myComment, setMyComment] = useState(null);

	const { Image, ImageModal } = useImageModal();

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

	function likeStateChange() {
		setPost((prevPost) => {
			prevPost.liked = !prevPost.liked;
			return prevPost;
		});
	}

	if (!post.user) {
		return <span>Loading...</span>;
	}

	return (
		<div className="m-3 p-3 d-flex justify-content-around">
			{/* Post Details (Left Side) */}
			<div className="post-box d-flex flex-column justify-content-between card p-3 shadow-sm">
				<div>
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
						{post.images?.length > 0 && (
							<div className="d-flex flex-wrap">
								{post.images.map((image, index) =>
									Image(image, index)
								)}
							</div>
						)}
					</div>
				</div>

				{/* Card Footer (Interactions) */}
				<div className="d-flex justify-content-between mt-3 border-top pt-2">
					{post.user._id === userId && (
						<DeletePost
							value={{
								postId,
								action: () => navigate("/profile"),
							}}
						/>
					)}

					<LikePost value={{ post, likeStateChange }} />

					<button className="btn btn-outline-success btn-sm">
						Share
					</button>
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
						placeholder="Add a comment..."
					/>

					<button
						className="btn btn-outline-primary"
						onClick={async () => {
							const newComment = await commentOnPost(
								postId,
								userId,
								myComment,
								enqueueError
							);

							if (newComment) {
								setPost((prev) => ({
									...prev,
									comments: [newComment, ...prev.comments],
								}));
							}
						}}
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
