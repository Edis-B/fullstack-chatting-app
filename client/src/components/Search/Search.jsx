import { Link, useParams, useSearchParams } from "react-router";
import { useEffect } from "react";

import { contentTypes } from "../../common/appConstants";
import { useSearch } from "../../contexts/SearchContext";

import People from "./People";
import "../../css/search.css";

export default function Search() {
	const { setContent, setQuery } = useSearch();

	const { content } = useParams();
	const [searchParams] = useSearchParams();
	const query = searchParams.get("query");

	useEffect(() => {
		setContent(content);
	}, [content]);

	useEffect(() => {
		setQuery(query);
	}, [query]);

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
						<Link
							className="nav-link"
							to={`/search/${contentTypes.POSTS}`}
						>
							Posts
						</Link>
						<Link
							className="nav-link"
							to={`/search/${contentTypes.PEOPLE}`}
						>
							People
						</Link>
					</nav>
				</div>

				<div className="col-md-9">{getContent(content)}</div>
			</div>
		</div>
	);
}
