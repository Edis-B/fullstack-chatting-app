import { useUser } from "../../contexts/UserContext";
import { likePost, removeLikeFromPost } from "../../services/postAPIs";

import { useNavigate } from "react-router";

export default function LikePost({ value }) {
	const { userId, notifications } = useUser();
	const { post, likeStateChange } = value;
	const navigate = useNavigate();

	const likesCount =
		post.likesCount !== undefined ? post.likesCount : post.likes.length;

	const likePostAction = async () => {
		if (!userId) {
			navigate("/login");
		}

		const result = await removeLikeFromPost(
			post._id,
			userId,
			notifications
		);

		if (!result.success) {
			return;
		}

		likeStateChange(post._id);
	};

	const unlikePostAction = async () => {
		if (!userId) {
			navigate("/login");
		}

		const result = await likePost(post._id, userId, notifications);

		if (!result.success) {
			return;
		}

		likeStateChange(post._id);
	};

	return (
		<div className="d-flex">
			{post.liked ? (
				<button className="btn p-0" onClick={likePostAction}>
					<span className="m-2">{likesCount}</span>
					<i
						className="bi bi-heart-fill"
						style={{ fontSize: "1.2rem" }}
					/>
				</button>
			) : (
				<button className="btn p-0" onClick={unlikePostAction}>
					<span className="m-2">{likesCount}</span>
					<i className="bi bi-heart" style={{ fontSize: "1.2rem" }} />
				</button>
			)}
		</div>
	);
}
