import { useUser } from "../../contexts/UserContext";
import { likePost, removeLikeFromPost } from "../../services/postAPIs";

export default function LikePost({ value }) {
	const { userId, enqueueError } = useUser();
	const { post, stateFlip } = value;

	const likesCount =
		post.likesCount !== undefined ? post.likesCount : post.likes.length;

	return (
		<div>
			{post.liked ? (
				<button
					className="btn p-0"
					onClick={async () => {
						const result = await removeLikeFromPost(
							post._id,
							userId,
							enqueueError
						);

						if (!result.success) return;

						stateFlip();
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
						const result = await likePost(
							post._id,
							userId,
							enqueueError
						);

						if (!result.success) return;

						stateFlip();
					}}
				>
					<span className="m-2">{likesCount}</span>
					<i className="bi bi-heart" style={{ fontSize: "1.2rem" }} />
				</button>
			)}
		</div>
	);
}
