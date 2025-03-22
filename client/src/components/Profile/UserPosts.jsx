import { useEffect, useState } from "react";
import { host } from "../../common/appConstants";
import { useProfile } from "../../contexts/ProfileContext";
import Post from "../Posts/Post";
import request from "../../utils/request";
import { useUser } from "../../contexts/UserContext";

export default function UserPosts() {
	const { enqueueError}  = useUser();
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
			console.error(err);
		}
	}

	return (
		<div>
			{postsData.posts?.length > 0 ? (
				postsData.posts.map((post) => (
					<Post key={post._id} post={post} user={postsData.user} />
				))
			) : (
				<span>No posts.</span>
			)}
		</div>
	);
}
