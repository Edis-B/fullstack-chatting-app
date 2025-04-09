import { useState } from "react";
import { Button } from "react-bootstrap";
import { host, visibilityTypes } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";
import request from "../../utils/request.js";

export default function EditPostVisibility({ post, userId, setPostStatus }) {
	const { enqueueError, enqueueInfo } = useUser();
	const [isEditActive, setIsEditActive] = useState(false);
	const [newStatus, setNewStatus] = useState(post.visibility);

	const handleSave = async () => {
		try {
			const { response, payload } = await request.put(
				`${host}/post/update-post-visibility`,
				{
					userId,
					postId: post._id,
					newStatus,
				}
			);
		
			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
				return;
			}

			enqueueInfo(data);
			setIsEditActive(false);
			setPostStatus(newStatus);
		} catch (err) {
			enqueueError("An error occurred while updating visibility");
			console.log(err);
		}
	};

	return (
		<div className="d-flex flex-row align-items-center">
			{isEditActive ? (
				<div className="d-flex align-items-center">
					<p className="m-1">Visibility:</p>
					<select
						value={newStatus}
						onChange={(e) => setNewStatus(e.target.value)}
						className="form-select"
					>
						{Object.values(visibilityTypes).map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
					<Button
						variant="primary"
						className="m-2"
						onClick={handleSave}
					>
						Save
					</Button>
					<Button
						variant="secondary"
						className="m-2"
						onClick={() => setIsEditActive(false)}
					>
						Cancel
					</Button>
				</div>
			) : (
				<div className="d-flex align-items-center">
					<p className="m-1">Visibility:</p>
					<b className="m-1">{post.visibility}</b>
					<Button
						variant="primary"
						className="m-2"
						onClick={() => setIsEditActive(true)}
					>
						Edit
					</Button>
				</div>
			)}
		</div>
	);
}
