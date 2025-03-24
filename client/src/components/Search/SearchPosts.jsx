import { useEffect, useState } from "react";

import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";

import { host } from "../../common/appConstants";
import request from "../../utils/request.js";

import Post from "../Posts/Post";

export default function SearchPosts() {
	const { enqueueError } = useUser();
	const { query } = useSearch().queryParameters;
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts(query);
	}, [query]);

	async function fetchPosts(query) {
		try {
			const { response, data } = await request.get(
				`${host}/post/get-posts-by-query`,
				{ query }
			);

			if (!response.ok) {
				enqueueError(data);
				return;
			}

			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<h3>Posts</h3>
			{posts.length > 0 ? (
				posts.map((post) => (
					<Post key={post._id} post={post} user={post.user} />
				))
			) : (
				<p>No posts found!</p>
			)}
		</>
	);
}
