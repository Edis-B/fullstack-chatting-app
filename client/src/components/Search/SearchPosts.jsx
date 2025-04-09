import { useEffect, useState } from "react";

import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";

import { host } from "../../common/appConstants";
import request from "../../utils/request.js";

import Post from "../Posts/Post";

export default function SearchPosts() {
	const { enqueueError } = useUser();
	const { searchParams } = useSearch();
	const query = searchParams.get("query");

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts(query);
	}, [query]);

	async function fetchPosts(query) {
		try {
			const { response, payload } = await request.get(
				`${host}/post/get-posts-by-content`,
				{ query: query || "" }
			);

			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
				return;
			}

			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	}

	const changeLikeState = (postId) => {
		setPosts((prev) =>
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
			<h3>Posts</h3>
			{posts.length > 0 ? (
				posts.map((post) => (
					<Post
						key={post._id}
						post={post}
						user={post.user}
						likeStateChange={changeLikeState}
					/>
				))
			) : (
				<p>No posts found!</p>
			)}
		</div>
	);
}
