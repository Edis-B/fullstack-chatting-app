import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { host } from "../../common/appConstants.js";
import { fetchUsers } from "../../services/userAPIs";
import { friendStatusButton } from "../../utils/friendUtils.jsx";

import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";

export default function People() {
	const navigate = useNavigate();

	const { query } = useSearch().queryParameters;
	const { userId } = useUser();
	const [people, setPeople] = useState([]);

	useEffect(() => {
		fetchPeopleByQuery(query);
	}, [query]);

	async function fetchPeopleByQuery(query) {
		const people = await fetchUsers(query);

		setPeople(people);
	}

	async function redirectToChat(username) {
		try {
			const response = await fetch(
				`${host}/chat/does-chat-exist-with-cookie?receiverUsername=${username}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const data = await response.json();

			if (data.exists) {
				return navigate(`/chat/${data.chatId}`);
			}

			let currentUser = await fetch(`${host}/user/get-username`, {
				method: "GET",
				credentials: "include",
			});
			currentUser = await currentUser.json();

			let chatTypes = await fetch(`${host}/chat/chat-types`, {
				method: "GET",
			});
			chatTypes = await chatTypes.json();

			const response2 = await fetch(`${host}/chat/create-new-chat`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					participants: [username, currentUser],
					type: chatTypes.DIRECT_MESSAGES,
				}),
			});

			const data2 = await response2.json();

			if (data2) {
				return navigate(`/chat/${data2}`);
			}
		} catch (err) {
			console.error("Error checking chat:", err);
		}
	}

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
							<div>
								<img
									src={person.image}
									alt={person.username}
									className="mr-3 rounded-circle"
									width="64"
									height="64"
								/>

								<span className="fw-bold p-2">
									{person.username}
								</span>
							</div>

							<div className="d-flex flex-row">
								<div className="m-2">
									{friendStatusButton(
										person.friendshipStatus,
										userId,
										person._id
									)}
								</div>

								<div className="m-2">
									<button
										className="btn btn-primary"
										onClick={() =>
											redirectToChat(person.username)
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
