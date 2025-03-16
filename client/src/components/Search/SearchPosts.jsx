import { useDebugValue, useEffect, useState } from "react";
import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";
import { host } from "../../common/appConstants";
import Post from "../Posts/Post";
export default function SearchPosts() {
	const { setErrors } = useUser();
	const { query } = useSearch().queryParameters;
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts(query);
	}, [query]);

	async function fetchPosts(query) {
		try {
			const response = await fetch(
				`${host}/post/get-posts-by-query?query=${query}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setErrors((prev) => [...prev, data]);
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
