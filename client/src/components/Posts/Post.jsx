import { Link } from "react-router";
import { dateToString } from "../../utils/dateUtils.js";
import { likePost } from "../../services/postAPIs.js";

export default function Post({ post, user }) {
	return (
		<div className="card m-3 p-3 shadow-sm">
			{/* Card Header */}
			<div className="d-flex align-items-center border-bottom pb-2">
				<img
					src={user.image}
					className="rounded-circle me-2"
					alt="Profile"
					width="40"
					height="40"
				/>
				<div>
					<h6 className="mb-0">{user.username}</h6>
					<p className="text-muted small mb-0">{dateToString(post.date)}</p>
				</div>
			</div>

			{/* Card Body (Content) */}
			<div className="mt-2">
				<p>{post.content}</p>
				{post.images.length > 0 && (
					<div className="d-flex flex-wrap">
						{post.images.map((image, index) => (
							<img
								key={index}
								src={image}
								className="img-fluid rounded me-2 mb-2"
								alt="Post"
								style={{ maxWidth: "100px" }}
							/>
						))}
					</div>
				)}
			</div>

			{/* Card Footer (Interactions) */}
			<div className="d-flex justify-content-between mt-3 border-top pt-2">
				<Link
					to={`/post/${post._id}`}
					className="btn btn-outline-primary btn-sm"
				>
					View Details
				</Link>
				<button onClick={() => likePost(postId, user._id, setErrors)} className="btn btn-outline-primary btn-sm">Like</button>
				<Link
					to={`/post/${post._id}`}
					className="btn btn-outline-secondary btn-sm"
				>
					Comment
				</Link>
				<button className="btn btn-outline-success btn-sm">
					Share
				</button>
			</div>
		</div>
	);
}
