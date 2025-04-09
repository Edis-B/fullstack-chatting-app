import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";

import { dateToString } from "../../utils/dateUtils.js";

import { useUser } from "../../contexts/UserContext.jsx";
import LikeComment from "../Buttons/LikeComment.jsx";
import DeleteComment from "../Buttons/DeleteComment.jsx";

export default function CommentSection({ post }) {
	const [postState, setPostState] = useState({});
	const { comments } = postState;

	useEffect(() => {
		setPostState(post);
	}, [post]);

	const { userId } = useUser();
	const { postId } = useParams();

	function flipLikeState(currId) {
		setPostState((prevPost) => ({
			...prevPost,
			comments: prevPost.comments.map((c) =>
				c._id === currId
					? {
							...c,
							liked: !c.liked,
					  }
					: c
			),
		}));
	}

	function deleteCommentState(currId) {
		setPostState((prev) => ({
			...prev,
			comments: prev.comments.filter((c) => c._id !== currId),
		}));
	}

	if (!postState) return;

	return (
		<>
			{/* Comments Section */}
			{comments?.length > 0 ? (
				<div className="comments-list">
					{comments.map((comment) => (
						<div key={comment._id} className="comment-item">
							{/* Profile Picture */}
							<Link
								to={`/profile/${comment.user._id}`}
								className="profile-picture-link"
							>
								<img
									src={comment.user.image}
									alt={`${comment.user.username}'s profile`}
									className="profile-picture"
								/>
								<strong>{comment.user.username}</strong>
							</Link>

							{/* Comment Content */}
							<div className="comment-content">
								<div className="comment-header">
									<small className="comment-date">
										{dateToString(comment.date)}
									</small>
								</div>
								<p className="comment-text">
									{comment.content}
								</p>
							</div>

							<div className="comment-actions">
								{/* Like Button (Heart) */}
								<LikeComment
									value={{
										postId,
										comment,
										stateFlip: flipLikeState,
									}}
								/>

								{(comment.user._id == userId ||
									post.user._id == userId) && (
									<DeleteComment
										value={{
											postId,
											commentId: comment._id,
											stateChange: deleteCommentState,
										}}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="no-comments-text">No comments yet!</p>
			)}
		</>
	);
}
