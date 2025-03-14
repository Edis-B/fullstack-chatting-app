import { useEffect, useState } from "react";
import { useSearch } from "../../contexts/SearchContext";
import { fetchUsers } from "../../services/userAPIs";

export default function People() {
	const { query } = useSearch();
	const [people, setPeople] = useState([]);

	useEffect(() => {
		setUsers(query);
	}, [query]);

	async function setUsers(query) {
		const people = await fetchUsers(query);

		setPeople(people);
	}

	return (
		<div className="people-list">
			<h3>People</h3>
			<ul className="list-unstyled">
				{people.map((person) => (
					<li key={person._id} className="media mb-3">
						<img
							src={person.image}
							alt={person.username}
							className="mr-3 rounded-circle"
							width="64"
							height="64"
						/>
						<div className="media-body">
							<h5 className="mt-0 mb-1">{person.username}</h5>
							<button className="btn btn-primary btn-sm">
								Follow
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
