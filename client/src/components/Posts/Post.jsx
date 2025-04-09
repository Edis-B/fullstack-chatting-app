import { Link } from "react-router";

import { dateToString } from "../../utils/dateUtils.js";
import { likePost } from "../../services/postAPIs.js";
import LikePost from "../Buttons/LikePost.jsx";
import { useImageModal } from "../../hooks/photos.jsx";

export default function Post({ post, user, likeStateChange }) {
	if (!post) {
		return <p>Loading...</p>;
	}

	const { Image, ImageModal } = useImageModal();

	return (
		<div
			className="card m-3 p-3 shadow-sm d-flex flex-column justify-content-between"
			style={{
				width: "60%",
				minHeight: "400px",
			}}
		>
			<div className="d-flex flex-column justify-content-start">
				{/* Card Header */}
				<Link
					className="d-flex align-items-center border-bottom pb-2"
					to={`/profile/${user._id}`}
				>
					<img
						src={user.image}
						className="rounded-circle me-2"
						alt="Profile"
						width="40"
						height="40"
					/>
					<div>
						<h6 className="mb-0">{user.username}</h6>
						<p className="text-muted small mb-0">
							{dateToString(post.date)}
						</p>
					</div>
				</Link>

				{/* Card Body (Content) */}
				<div className="mt-2">
					<p>{post.content}</p>
					{post.images.length > 0 && (
						<div className="d-flex flex-wrap">
							{post.images.map((image, index) =>
								Image(image, index)
							)}
						</div>
					)}
				</div>
			</div>

			{/* Card Footer (Interactions) */}
			<div className="d-flex justify-content-between mt-3 border-top pt-2">
				<Link
					to={`/post/${post._id}`}
					className="btn btn-outline-primary btn-sm"
				>
					View Details
				</Link>
				<LikePost value={{ post, likeStateChange }} />
				<Link
					to={`/post/${post._id}`}
					className="btn btn-outline-secondary btn-sm"
				>
					Comment
				</Link>
			</div>

			{ImageModal(user)}
		</div>
	);
}
