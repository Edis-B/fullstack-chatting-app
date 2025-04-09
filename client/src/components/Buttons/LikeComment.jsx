import { useUser } from "../../contexts/UserContext";
import { likeComment, removeLikeFromComment } from "../../services/postAPIs";
import { useNavigate } from "react-router";

export default function LikeComment({ value }) {
	const { userId, notifications } = useUser();
	const { postId, comment, stateFlip } = value;
	const navigate = useNavigate();

	const { _id: commentId, likes, liked } = comment;
	const likesCount =
		comment.likesCount !== undefined ? comment.likesCount : likes.length;

	const unlikeCommentAction = async () => {
		if (!userId) {
			navigate("/login");
		}

		const result = await removeLikeFromComment(
			postId,
			userId,
			commentId,
			notifications
		);

		if (!result.success) {
			return;
		}

		stateFlip(commentId);
	};

	const likeCommentAction = async () => {
		if (!userId) {
			navigate("/login");
		}

		const result = await likeComment(
			postId,
			userId,
			commentId,
			notifications
		);

		if (!result.success) {
			return;
		}

		stateFlip(commentId);
	};

	return (
		<div className="d-flex">
			{liked ? (
				<button className="btn p-0" onClick={unlikeCommentAction}>
					<span className="m-2">{likesCount}</span>
					<i
						className="bi bi-heart-fill"
						style={{ fontSize: "1.2rem" }}
					/>
				</button>
			) : (
				<button className="btn p-0" onClick={likeCommentAction}>
					<span className="m-2">{likesCount}</span>
					<i className="bi bi-heart" style={{ fontSize: "1.2rem" }} />
				</button>
			)}
		</div>
	);
}
