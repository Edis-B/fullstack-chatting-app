import { useState, useEffect } from "react";
import { host, client } from "../../common/appConstants.js";

export default function UserList() {
	const [search, setSearch] = useState();
	const [chats, setChats] = useState([]);
	const [users, setUsers] = useState([]);
	const [showChats, setShowChats] = useState(true);
	const [selectedUser, setSelectedUser] = useState(null);

	// Search bar
	useEffect(() => {
		const delayDebounce = setTimeout(async () => {
			if (!search) {
				setShowChats(true);
				return;
			}

			const allUsers = await fetchUsers(search);

			setUsers(allUsers);
			setShowChats(false);
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [search]);

	useEffect(() => {
		async function setChatsEffect() {
			const chatsData = await fetchChats();

			setChats(chatsData);
		}

		setChatsEffect();
	}, []);

	async function fetchChats() {
		try {
			const response = await fetch(`${host}/chat/get-users-chats`, {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			if (!response.ok) {
				alert(data);
			}

			return data;
		} catch (err) {
			alert(`There has been an error: ${err}`);
			console.log(err);
		}
	}

	async function fetchUsers(substring) {
		try {
			if (!substring) {
				return setUsers([]);
			}

			const response = await fetch(
				`${host}/user/get-users-by-username?usernameSubstr=${substring}&exclude=true`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();
			return data;
		} catch (err) {
			alert(`There has been an error: ${err}`);
		}
	}

	async function sendFriendRequest(username) {
		try {
			const response = await fetch(`${host}/user/send-friend-request`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ receiver: username }),
			});

			const data = await response.json();
			alert(data);
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

			if (data.exists) {
				return (window.location.href = `${client}/chats/${data.chatId}`);
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
				return (window.location.href = `${client}/chats/${data2}`);
			}
		} catch (err) {
			console.error("Error checking chat:", err);
		}
	}

	function toggleUserMenu(username) {
		const set = selectedUser === username ? null : username;

		setSelectedUser(set);
	}

	return (
		<div className="user-list p-3 bg-light" style={{ flex: 1 }}>
			<h5>Users</h5>

			<input
				type="text"
				className="form-control search-bar mb-3"
				placeholder="Search users..."
				id="searchUsers"
				onChange={(e) => setSearch(e.target.value)}
			/>

			<ul className="list-group mt-3">
				{(!showChats && Array.isArray(users)) &&
					users.map((user) => (
						<li
							key={user._id}
							id={user.username}
							className="list-group-item d-flex align-items-center"
							onClick={(e) => toggleUserMenu(e.target.id)}
						>
							<img
								src={user.image}
								className="rounded-circle"
								style={{
									width: "40px",
									height: "40px",
									objectFit: "cover",
								}}
							/>

							{user.username}

							{/* Popup Buttons */}
							{selectedUser === user.username && (
								<div
									className="list-group-item d-flex align-items-center"
									style={{
										zIndex: 10,
										width: "100px",
										margin: "auto",
									}}
								>
									<button
										className="btn btn-sm btn-primary w-100 mb-1"
										onClick={() =>
											sendFriendRequest(user.username)
										}
									>
										Add Friend
									</button>
									<button
										className="btn btn-sm btn-secondary w-100"
										onClick={() =>
											redirectToChat(user.username)
										}
									>
										Message
									</button>
								</div>
							)}
						</li>
					))}

				{(showChats && Array.isArray(chats)) &&
					chats.map((chat) => (
						<li
							key={chat._id}
							className="list-group-item d-flex align-items-center"
						>
							<img
								src={chat.chatImage}
								className="rounded-circle"
								style={{
									width: "40px",
									height: "40px",
									objectFit: "cover",
								}}
							/>

							{chat.chatName}
						</li>
					))}
			</ul>
		</div>
	);
}
