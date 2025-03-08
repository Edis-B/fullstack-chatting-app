import { useEffect, useState } from "react";
import { host } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";
import { useProfile } from "../../contexts/ProfileContext";

export default function Posts() {
	const { profileId } = useProfile();

	const [postsData, setPostsData] = useState({});

	useEffect(() => {
		if (!profileId) {
			return;
		}
		fetchPosts();
	}, [profileId]);

	async function fetchPosts() {
		try {
			const response = await fetch(
				`${host}/post/get-users-posts?userId=${profileId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();
			setPostsData(data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="mt-3">
			<div className="card mb-3">
				{postsData.posts?.length > 0 ? (
					postsData.posts.map((post) => {
						return (
							<div className="card-body">
								<div className="d-flex">
									<img
										src={postsData.user.image}
										className="rounded-circle me-2"
										alt="Profile"
									/>
									<div>
										<h6 className="mb-0">
											{postsData.user.username}
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
							</div>
						);
					})
				) : (
					<span>No posts.</span>
				)}
			</div>
		</div>
	);
}
