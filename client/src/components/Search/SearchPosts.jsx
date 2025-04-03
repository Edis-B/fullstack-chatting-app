import { useEffect, useState } from "react";

import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";

import { host } from "../../common/appConstants";
import request from "../../utils/request.js";

import Post from "../Posts/Post";

export default function SearchPosts() {
	const { enqueueError } = useUser();
	const { searchParams } = useSearch();
	const { query } = searchParams;

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts(query);
	}, [query]);

	async function fetchPosts(query) {
		try {
			const { response, responseData } = await request.get(
				`${host}/post/get-posts-by-query`,
				{ query: query || "" }
			);
		
			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="d-flex flex-column align-items-center">
			<h3>Posts</h3>
			{posts.length > 0 ? (
				posts.map((post) => (
					<Post key={post._id} post={post} user={post.user} />
				))
			) : (
				<p>No posts found!</p>
			)}
		</div>
	);
}
