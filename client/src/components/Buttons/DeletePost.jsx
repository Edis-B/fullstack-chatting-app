import { host } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";
import { removeCommentFromPost } from "../../services/postAPIs";
import request from "../../utils/request.js";

export default function DeletePost({ value }) {
	const { userId, enqueueError } = useUser();

    // Required values
	const { postId, action } = value;

	async function deletePost() {
		try {
			const { response, data } = await request.delete(
				`${host}/post/delete-post`,
				{ userId, postId }
			);

			if (!response.ok) {
				enqueueError(data);
				return;
			}
		} catch (err) {
			console.log(err);
			enqueueError(err);
		}
	}

	return (
		<div>
			<button
				className="btn btn-outline-danger p-0 border-2 custom-delete-btn d-flex flex-row p-1"
				onClick={async () => {
					const allow = confirm(
						"Are you sure you want to delete this post?"
					);

					if (!allow) return;

					await deletePost();

					action(postId);
				}}
			>
				<i
					className="bi bi-trash align-items-center d-flex m-1"
					style={{ fontSize: "1.2rem" }}
				/>
				<p className="m-0">Delete post</p>
			</button>
		</div>
	);
}
