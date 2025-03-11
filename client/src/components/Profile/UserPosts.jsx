import { useEffect, useState } from "react";
import { host } from "../../common/appConstants";
import { useProfile } from "../../contexts/ProfileContext";
import Post from "../Posts/Post";

export default function UserPosts() {
	const { profileId } = useProfile();
	const [postsData, setPostsData] = useState({ posts: [], user: {} });

	useEffect(() => {
		if (!profileId) return;
		fetchPosts();
	}, [profileId]);

	async function fetchPosts() {
		try {
			const response = await fetch(
				`${host}/post/get-users-posts?userId=${profileId}`,
				{ method: "GET", credentials: "include" }
			);
			const data = await response.json();
			setPostsData(data);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="mt-3">
			{postsData.posts?.length > 0 ? (
				postsData.posts.map((post) => (
					<Post
						key={post._id}
						post={post}
						user={postsData.user}
					/>
				))
			) : (
				<span>No posts.</span>
			)}
		</div>
	);
}
