import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";

export default function SearchBar() {
	const navigate = useNavigate();
	const { enqueueError } = useUser();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = () => {
		if (!searchQuery) {
			enqueueError("Input search query!");
			return;
		}

		setSearchQuery("");
		navigate(`/search?query=${searchQuery}`);
	};

	return (
		<div className="search-container">
			<input
				type="text"
				placeholder="Search..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="search-input"
			/>

			<div className="search-button" onClick={handleSearch}>
				🔍
			</div>
		</div>
	);
}
