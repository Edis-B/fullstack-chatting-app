import { useEffect, useState } from "react";
import Post from "./Posts/Post";
import PostDetails from "./Posts/PostDetails";
import { useUser } from "../contexts/UserContext";
import request from "../utils/request";

export default function Catalog() {
	const [trendingPosts, setTrendingPosts] = useState([]);

	useEffect(() => {
		fetchTrendingPosts();
	}, []);
	
	async function fetchTrendingPosts() {
		try {
			const { response, data } = await request.get(
				`/post/get-trending-posts`
			);
		} catch (err) {}
	}

	return (
		<>
			{/* Post({ post, user, likeState }) */}
			<Post></Post>
		</>
	);
}
