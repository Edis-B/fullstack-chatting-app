import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { contentTypes } from "../../common/appConstants";
import { useSearch } from "../../contexts/SearchContext";

import SearchPeople from "./SearchPeople";
import SearchPosts from "./SearchPosts";
import "../../css/search.css";

export default function Search() {
	const navigate = useNavigate();

	const { searchParams } = useSearch();
	const content = searchParams.get("content");

	function updateParameters(newParameters) {
		const updatedParameters = {
			...Object.fromEntries(searchParams.entries()),
			...newParameters,
		};
		
		const queryString = new URLSearchParams(updatedParameters).toString();

		navigate(`/search?${queryString}`);
	}

	function getContent(content) {
		if (!content || content === contentTypes.PEOPLE) {
			return <SearchPeople />;
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

				<div className="col-md-9 mt-2">{getContent(content)}</div>
			</div>
		</div>
	);
}
