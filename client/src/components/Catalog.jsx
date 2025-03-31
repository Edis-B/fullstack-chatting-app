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
			const { response, responseData } = await request.get(
				`${host}/post/get-trending-posts`
			);

			const { status, results, data } = responseData;

			if (!response.ok) {
				return;
			}

			setTrendingPosts()

		} catch (err) {}
	}

	return (
		<>
			{/* Post({ post, user, likeState }) */}
			<Post></Post>
		</>
	);
}
