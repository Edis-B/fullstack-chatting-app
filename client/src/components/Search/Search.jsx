import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { contentTypes } from "../../common/appConstants";
import { useSearch } from "../../contexts/SearchContext";

import People from "./People";
import SearchPosts from "./SearchPosts";
import "../../css/search.css";

export default function Search() {
	const navigate = useNavigate();

	const { queryParameters, setQueryParameters } = useSearch();

	const [searchParams] = useSearchParams();
	const query = searchParams.get("query");
	const content = searchParams.get("content");

	useEffect(() => {
		setQueryParameters((prev) => ({
			...prev,
			content,
		}));
	}, [content, setQueryParameters]);

	useEffect(() => {
		setQueryParameters((prev) => ({
			...prev,
			query,
		}));
	}, [query, setQueryParameters]);

	function updateParameters(newParameters) {
		const updatedParameters = {
			...queryParameters,
			...newParameters,
		};

		const queryString = new URLSearchParams(updatedParameters).toString();

		navigate(`/search?${queryString}`);
	}

	function getContent(content) {
		if (!content || content === contentTypes.PEOPLE) {
			return <People />;
		} else if (content === contentTypes.POSTS) {
			return <SearchPosts />;
		}
	}

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-3 filter-menu">
					<h5>Filters</h5>
					<nav className="nav flex-column">
						<button
							className="custom-button"
							onClick={() =>
								updateParameters({
									content: contentTypes.POSTS,
								})
							}
						>
							Posts
						</button>
						<button
							className="custom-button"
							onClick={() =>
								updateParameters({
									content: contentTypes.PEOPLE,
								})
							}
						>
							People
						</button>
					</nav>
				</div>

				<div className="col-md-9">{getContent(content)}</div>
			</div>
		</div>
	);
}
