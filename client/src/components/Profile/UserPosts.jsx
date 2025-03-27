import { useEffect, useState } from "react";
import { host } from "../../common/appConstants";
import { useProfile } from "../../contexts/ProfileContext";
import Post from "../Posts/Post";
import request from "../../utils/request";
import { useUser } from "../../contexts/UserContext";

export default function UserPosts() {
	const { enqueueError } = useUser();
	const { profileId } = useProfile() || {};
	const [postsData, setPostsData] = useState({ posts: [], user: {} });

	useEffect(() => {
		if (!profileId) return;

		const controller = new AbortController();

		fetchPosts(controller.signal);

		return () => controller.abort();
	}, [profileId]);

	async function fetchPosts(signal) {
		try {
			const { response, data } = await request.get(
				`${host}/post/get-users-posts`,
				{
					userId: profileId,
					signal,
				}
			);

			if (!response.ok) {
				enqueueError(data);
				return;
			}

			setPostsData(data);
		} catch (err) {
			if (err.name !== "AbortError") console.error(err);
		}
	}

	function likeStateChange(id) {
		setPostsData((prev) => ({
			...prev,
			posts: prev.posts.map((p) =>
				p._id == id
					? {
							...p,
							liked: !p.liked,
					  }
					: p
			),
		}));
	}

	return (
		<div>
			{postsData.posts?.length > 0 ? (
				postsData.posts.map((post) => (
					<Post
						key={post._id}
						post={post}
						user={postsData.user}
						likeState={likeStateChange}
					/>
				))
			) : (
				<span>No posts.</span>
			)}
		</div>
	);
}
