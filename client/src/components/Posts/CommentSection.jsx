import {
	removeCommentFromPost,
	likeComment,
	removeLikeFromComment,
} from "../../services/postAPIs.js";

import { useParams } from "react-router";

import { dateToString } from "../../utils/dateUtils.js";
import { useUser } from "../../contexts/UserContext.jsx";
import { useEffect, useState } from "react";

export default function CommentSection({ post }) {
	const [postState, setPostState] = useState({});

	useEffect(() => {
		setPostState(post);
	}, [post]);

	const { userId, setErrors } = useUser();
	const { postId } = useParams();

	if (!postState) return;

	return (
		<>
			{/* Comments */}
			{postState.comments?.length > 0 ? (
				<div className="comment">
					{postState.comments.map((comment) => (
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
								<div>
									{comment.liked ? (
										<button
											className="btn p-0 d-flex align-content-center"
											onClick={async () => {
												if (
													await removeLikeFromComment(
														postId,
														userId,
														comment._id,
														setErrors
													)
												) {
													setPostState(
														(prevPost) => ({
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
														})
													);
												}
											}}
										>
											<span>{comment.likesCount}</span>
											<i
												className="bi bi-heart-fill text-danger"
												style={{ fontSize: "1.2rem" }}
											/>
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
													setPostState(
														(prevPost) => ({
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
														})
													);
												}
											}}
										>
											<span className="m-2">{comment.likesCount}</span>
											<i
												className="bi bi-heart"
												style={{ fontSize: "1.2rem" }}
											/>
										</button>
									)}
								</div>

								<div>
									{comment.user._id == userId && (
										<button
											className="btn p-0"
											onClick={async () => {
												const allow = confirm(
													"Are you sure you want to delete comment!"
												);

												if (allow) {
													const result =
														await removeCommentFromPost(
															postState._id,
															userId,
															comment._id,
															setErrors
														);

													alert(result);
												}
											}}
										>
											<i
												className="bi bi-trash text-danger"
												style={{ fontSize: "1.2rem" }}
											/>
										</button>
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
