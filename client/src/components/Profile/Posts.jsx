import { useEffect, useState } from "react";
import { host } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";

export default function Posts() {
	const { userId } = useUser();

	const [posts, setPosts] = useState(null);

	useEffect(() => {
		fetchPosts();
	}, [userId]);

	async function fetchPosts() {
		try {
			const response = await fetch(
				`${host}/post/get-users-posts?userId=${userId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			{/* Posts Section */}
			<div className="mt-3">
				<div className="card mb-3">
					{Array.isArray(posts) ? (
						posts.map((post) => {
							<div className="card-body">
								<div className="d-flex">
									<img
										src={post.image}
										className="rounded-circle me-2"
										alt="Profile"
									/>
									<div>
										<h6 className="mb-0">
											{post.user.username}
										</h6>
										<p className="text-muted small">
											{post.date}
										</p>
									</div>
								</div>
								<p className="mt-2">{post.content}</p>

								{post.images.map((image) => {
									<img
										src={image}
										className="img-fluid rounded"
										alt="Post Image"
									/>;
								})}
                                
								<div className="d-flex justify-content-between mt-3">
									<button className="btn btn-outline-primary btn-sm">
										Like
									</button>
									<button className="btn btn-outline-secondary btn-sm">
										Comment
									</button>
									<button className="btn btn-outline-success btn-sm">
										Share
									</button>
								</div>
							</div>;
						})
					) : (
						<span>No posts.</span>
					)}
				</div>
			</div>
		</>
	);
}
