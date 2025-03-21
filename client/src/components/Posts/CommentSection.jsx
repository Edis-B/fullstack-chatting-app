import { useParams } from "react-router";
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
			{/* Comments */}
			{comments?.length > 0 ? (
				<div className="comment">
					{comments.map((comment) => (
						<div
							key={comment._id}
							className="comment-container d-flex align-items-start justify-content-between gap-2 p-2 border rounded"
						>
							{/* Profile Picture */}
							<div
								className="d-inline align-items-center justify-content-center"
								style={{ height: "100%" }}
							>
								<img
									src={comment.user.image}
									alt={`${comment.user.username}'s profile`}
									className="rounded-circle"
									width="40"
									height="40"
								/>
							</div>

							{/* Comment Content */}
							<div style={{ width: "auto" }}>
								<strong>{comment.user.username}</strong>{" "}
								<small className="text-muted d-block">
									{dateToString(comment.date)}
								</small>
								<p className="mb-0">{comment.content}</p>
							</div>

							<div className="d-flex flex-column">
								{/* Like Button (Heart) */}
								<LikeComment
									value={{
										postId,
										comment,
										stateFlip: flipLikeState,
									}}
								/>

								<div>
									{comment.user._id == userId && (
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
						</div>
					))}
				</div>
			) : (
				<p>No comments yet!</p>
			)}
		</>
	);
}
