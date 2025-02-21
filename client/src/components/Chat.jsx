import React, { useState, useEffect } from "react";
import { host } from "../common/appConstants.js";

export default function Chat() {
	const [search, setSearch] = useState();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	// Search bar
	useEffect(() => {
		async function fetchUsers(substring) {
			try {
				if (!substring) {
					return setUsers([]);
				}

				const response = await fetch(
					`${host}/user/get-users-by-username?usernameSubstr=${substring}`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				const data = await response.json();
				setUsers(data);
			} catch (err) {
				console.error(`There has been an error: ${err}`);
			}
		}

		const delayDebounce = setTimeout(() => {
			fetchUsers(search);
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [search]);

	async function sendFriendRequest(username) {
		try {
			const response = await fetch(`${host}/user/send-friend-request`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ receiverName: username }),
			});
			const data = await response.json();
			console.log(data);
		} catch (err) {
			console.error("Error sending friend request:", err);
		}
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
			console.log(data);

			if (data.exists) {
				return (window.location.href = `${host}/chat/${data.chatId}`);
			}

			let currentUser = await fetch(`${host}/user/get-username`);
			currentUser = await currentUser.json();

			let chatTypes = await fetch(`${host}/chat/chat-types`);
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
			console.log(data2);
		} catch (err) {
			console.error("Error checking chat:", err);
		}
	}

	function toggleUserMenu(username) {
		const set = selectedUser === username ? null : username;
		
		setSelectedUser(set);
	}

	return (
		<div className="container-fluid chat-container d-flex">
			{/* User List (Docked Left) */}
			<div className="user-list p-3 bg-light" style={{flex: 1}} >
				<h5>Users</h5>

				<input
					type="text"
					className="form-control search-bar mb-3"
					placeholder="Search users..."
					id="searchUsers"
					onChange={(e) => setSearch(e.target.value)}
				/>

				<ul className="list-group mt-3">
					{Array.isArray(users) &&
						users.map((user) => (
							<li
								id={user.username}
								className="list-group-item d-flex align-items-center"
								onClick={(e) => toggleUserMenu(e.target.id)}
							>
								<img
									src={user.image}
									className="rounded-circle me-2"
								/>
								{user.username}

								{/* Popup Buttons */}
								{selectedUser === user.username && (
									<ul
										className="list-group-item d-flex align-items-center"
									>
										<li
											className="btn btn-sm btn-primary w-100 mb-1"
											onClick={() =>
												sendFriendRequest(user.username)
											}
										>
											Add Friend
										</li>
										<li
											className="btn btn-sm btn-secondary w-100"
											onClick={() =>
												redirectToChat(user.username)
											}
										>
											Message
										</li>
									</ul>
								)}
							</li>
						))}
				</ul>
			</div>

			{/* Chat Box */}
			<div className="chat-box p-3" style={{flex: 4}}>
				<div className="messages" id="messages">
					<div className="message received d-flex align-items-center mb-3">
						<img
							src="https://via.placeholder.com/40"
							alt="User 1"
							className="rounded-circle me-2"
						/>
						<div>
							<strong>User 1:</strong> Hi! How are you?
						</div>
					</div>
					<div className="message sent d-flex align-items-center justify-content-end mb-3">
						<div>
							<strong>You:</strong> I'm good! What about you?
						</div>
						<img
							src="https://via.placeholder.com/40"
							alt="You"
							className="rounded-circle ms-2"
						/>
					</div>
					<div className="message received d-flex align-items-center mb-3">
						<img
							src="https://via.placeholder.com/40"
							alt="User 1"
							className="rounded-circle me-2"
						/>
						<div>
							<strong>User 1:</strong> I'm doing great, thanks for
							asking!
						</div>
					</div>
				</div>
				{/* Message Input */}
				<div className="d-flex mt-auto">
					<input
						type="text"
						className="form-control"
						placeholder="Type a message..."
						id="messageInput"
					/>
					<button
						className="btn btn-primary ms-2"
						id="sendMessageBtn"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
