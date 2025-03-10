import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { host } from "../common/appConstants.js";
import { dateToString } from "../utils/dateUtils.js";
export default function Post() {
	const { postId } = useParams();
	const [post, setPost] = useState({});

	useEffect(() => {
		if (!postId) return;

		fetchPostData();
	}, [postId]);

	async function fetchPostData() {
		try {
			const response = await fetch(
				`${host}/post/get-post?postId=${postId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			setPost(data);
		} catch (err) {
			console.log(err);
		}
	}

	if (!post.user) {
		return <span>Loading...</span>;
	}
	
	return (
		<div className="post-card">
			<div className="d-flex">
				<img
					src="https://via.placeholder.com/150"
					alt="User"
					className="profile-pic me-3"
				/>
				<div>
					<h6 className="card-title">{post.user.username}</h6>
					<p className="text-muted">{dateToString(post.date)}</p>
				</div>
			</div>

			<p className="mt-3">
				{post.content} <a href="#">#Exciting</a>
			</p>

			{post.images?.length > 0 ? (
				post.images.map((image) => (
					<img
						src={image}
						className="img-fluid mt-3"
						alt="Post Image"
					/>
				))
			) : (
				<span>No images</span>
			)}

			<div className="d-flex justify-content-between mt-3">
				<button className="btn btn-outline-primary">Like</button>
				<button className="btn btn-outline-secondary">Comment</button>
			</div>
		</div>
	);
}
