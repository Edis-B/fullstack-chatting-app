import { useUser } from "../../contexts/UserContext";
import { removeCommentFromPost } from "../../services/postAPIs";

export default function DeleteComment({ value }) {
	const { userId, enqueueError } = useUser();
	const { postId, commentId, stateChange } = value;

	return (
		<div>
			<button
				className="btn btn-outline-danger p-0 border-2 custom-delete-btn d-flex flex-row p-1"
				onClick={async () => {
					const allow = confirm(
						"Are you sure you want to delete this comment?"
					);

					if (!allow) return;

					await removeCommentFromPost(
						postId,
						userId,
						commentId,
						enqueueError
					);

					stateChange(commentId);
				}}
			>
				<i
					className="bi bi-trash align-items-center d-flex m-1"
					style={{ fontSize: "1.2rem" }}
				/>
				<p className="m-0">Delete comment</p>
			</button>
		</div>
	);
}
