import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";

import { host } from "../../common/appConstants.js";

import { useSearch } from "../../contexts/SearchContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import request from "../../utils/request.js";
import { redirectToChat } from "../../services/chatAPIs.js";
import AutoFriendButton from "../Profile/AutoFriendButton.jsx";

export default function SearchPeople() {
	const navigate = useNavigate();

	const { searchParams } = useSearch();
	const query = searchParams.get("query");
	const page = searchParams.get("page");

	const { userId, enqueueError } = useUser();

	const [people, setPeople] = useState([]);

	useEffect(() => {
		if (query === undefined) return;

		fetchPeopleByQuery(query, page);
	}, [query]);

	async function fetchPeopleByQuery(query, page) {
		try {
			const { response, payload } = await request.get(
				`${host}/user/get-users-by-username`,
				{ usernameSubstr: query || "", page, exclude: true }
			);

			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
				return;
			}

			setPeople(data);
		} catch (err) {
			console.error("Error fetching people:", err);
		}
	}

	const changeStatus = ({ id, type }) => {
		setPeople((prev) =>
			prev.map((p) =>
				p._id == id
					? {
							...p,
							friendshipStatus: type,
					  }
					: p
			)
		);
	};

	return (
		<div className="people-list">
			<h3>People</h3>
			<ul className="list-unstyled">
				{people.length > 0 ? (
					people.map((person) => (
						<li
							key={person._id}
							className="media mb-3 d-flex flex-row justify-content-between border p-2"
						>
							<Link to={`/profile/${person._id}`}>
								<img
									src={person.image}
									alt={person.username}
									className="person-avatar"
								/>

								<span className="fw-bold p-2">
									{person.username}
								</span>
							</Link>

							<div className="d-flex flex-row">
								<div className="m-2">
									<AutoFriendButton
										params={{
											status: person.friendshipStatus,
											senderId: userId,
											receiverId: person._id,
											changeStatus,
										}}
									/>
								</div>

								<div className="m-2">
									<button
										className="btn btn-primary"
										onClick={() =>
											redirectToChat(
												userId,
												person._id,
												navigate
											)
										}
									>
										Chat
									</button>
								</div>
							</div>
						</li>
					))
				) : (
					<p>No people found!</p>
				)}
			</ul>
		</div>
	);
}
