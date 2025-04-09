import { useEffect, useState } from "react";
import Post from "./Posts/Post";
import PostDetails from "./Posts/PostDetails";
import { useUser } from "../contexts/UserContext";
import request from "../utils/request";
import { host } from "../common/appConstants";

export default function Catalog() {
	const [trendingPosts, setTrendingPosts] = useState([]);

	useEffect(() => {
		fetchTrendingPosts();
	}, []);

	async function fetchTrendingPosts() {
		try {
			const { response, payload } = await request.get(
				`${host}/post/get-trending-posts`
			);

			if (!response.ok) {
				return;
			}

			setTrendingPosts(payload);
		} catch (err) {}
	}

	const likeState = (postId) => {
		setTrendingPosts((prev) =>
			prev.map((post) =>
				postId === post._id
					? {
							...post,
							liked: !post.liked,
					  }
					: post
			)
		);
	};

	return (
		<div className="d-flex flex-column align-items-center">
			{trendingPosts?.length > 0 ? (
				trendingPosts.map((post) => (
					<Post
						key={post._id}
						post={post}
						user={post.user}
						likeStateChange={likeState}
					></Post>
				))
			) : (
				<p>No posts.</p>
			)}
		</div>
	);
}
