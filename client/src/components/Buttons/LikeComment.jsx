import { useUser } from "../../contexts/UserContext";
import { likeComment, removeLikeFromComment } from "../../services/postAPIs";

export default function LikeComment({ value }) {
	const { enqueueError, enqueueInfo, userId } = useUser();

	// Required values
	const { postId, comment, stateFlip } = value;

	const { _id: commentId, likes, liked } = comment;

	const likesCount =
		comment.likesCount !== undefined ? comment.likesCount : likes.length;

	const userActions = { enqueueError, enqueueInfo };

	return (
		<div>
			{liked ? (
				<button
					className="btn p-0"
					onClick={async () => {
						if (
							await removeLikeFromComment(
								postId,
								userId,
								commentId,
								userActions
							)
						) {
							stateFlip(commentId);
						}
					}}
				>
					<span className="m-2">{likesCount}</span>
					<i
						className="bi bi-heart-fill"
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
								commentId,
								userActions
							)
						) {
							stateFlip(commentId);
						}
					}}
				>
					<span className="m-2">{likesCount}</span>
					<i className="bi bi-heart" style={{ fontSize: "1.2rem" }} />
				</button>
			)}
		</div>
	);
}
