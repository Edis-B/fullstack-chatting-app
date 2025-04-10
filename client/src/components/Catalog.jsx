import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Post from "./Posts/Post";
import request from "../utils/request";
import { host } from "../common/appConstants";

import "../css/catalog-page.css";

export default function Catalog() {
	const [trendingPosts, setTrendingPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const navigate = useNavigate();
	const location = useLocation();

	const params = new URLSearchParams(location.search);
	const page = parseInt(params.get("page")) || 1;

	useEffect(() => {
		fetchTrendingPosts(page);
	}, [page]);

	async function fetchTrendingPosts(page) {
		try {
			const { response, payload } = await request.get(
				`${host}/post/get-trending-posts`,
				{ page }
			);

			if (!response.ok) {
				return;
			}

			setTrendingPosts(payload.posts);
			setTotalPages(payload.pagination.totalPages);
		} catch (err) {
			console.error("Error fetching posts:", err);
		}
	}

	const likeState = (postId) => {
		setTrendingPosts((prev) =>
			prev.map((post) =>
				postId === post._id ? { ...post, liked: !post.liked } : post
			)
		);
	};

	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= totalPages) {
			navigate(`/catalog?page=${newPage}`);
		}
	};

	const renderPagination = () => {
		if (trendingPosts.length === 0) return;

		return (
			<div className="pagination">
				<button
					onClick={() => handlePageChange(page - 1)}
					disabled={page === 1}
				>
					Previous
				</button>
				<span>
					Page {page} of {totalPages}
				</span>
				<button
					onClick={() => handlePageChange(page + 1)}
					disabled={page === totalPages}
				>
					Next
				</button>
			</div>
		);
	};

	return (
		<div className="d-flex flex-column align-items-center">
			{/* Pagination at the top */}
			{renderPagination()}

			{trendingPosts?.length > 0 ? (
				trendingPosts.map((post) => (
					<Post
						key={post._id}
						post={post}
						user={post.user}
						likeStateChange={likeState}
					/>
				))
			) : (
				<p>No posts.</p>
			)}

			{/* Pagination at the bottom */}
			{renderPagination()}
		</div>
	);
}
