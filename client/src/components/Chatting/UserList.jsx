import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { host, client } from "../../common/appConstants.js";
import { useChat } from "../../contexts/ChatContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

import { sendFriendRequest } from "../../services/userAPIs.js";

export default function UserList() {
	const { id } = useParams();

	const { userId, socket } = useUser();
	const { chatId, setChatId } = useChat();

	const navigate = useNavigate();

	const [search, setSearch] = useState();
	const [chats, setChats] = useState([]);
	const [users, setUsers] = useState([]);
	const [showChats, setShowChats] = useState(true);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		if (socket) {
			socket.on("receive_message", handleMessage);
		}
	}, [socket]);

	useEffect(() => {
		setChatId(id ?? "");
		fetchChats();
	}, [id]);

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

	const handleMessage = (data) => {
		setChats((prev) => {
			const indexOfUpdated = prev.findIndex(
				(c) => c.chatId === data.header.chatId
			);

			const updatedChat = data.header;
			const updatedChats = prev.filter((_, i) => i !== indexOfUpdated);

			return [updatedChat, ...updatedChats];
		});
	};

	async function fetchChats() {
		try {
			const response = await fetch(`${host}/chat/get-user-chats`, {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			if (!response.ok) {
				alert(data);
			}

			if (!id) {
				navigate(`/chat/${data[0].chatId}`, { replace: true });
				return;
			}

			setChats(data);
		} catch (err) {
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
			console.log(err);
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
				return (window.location.href = `${client}/chat/${data.chatId}`);
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
				return (window.location.href = `${client}/chat/${data2}`);
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
				{!showChats &&
					Array.isArray(users) &&
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
											sendFriendRequest(userId, user._id)
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

				{showChats &&
					Array.isArray(chats) &&
					chats.map((chat) => (
						<li
							key={chat.chatId}
							className="list-group-item d-flex cursor-pointer"
						>
							<Link
								to={`/chat/${chat.chatId}`}
								className="text-decoration-none text-dark w-100 d-flex align-items-center"
							>
								<img
									src={chat.chatImage}
									className="rounded-circle m-2"
									style={{
										width: "40px",
										height: "40px",
										objectFit: "cover",
									}}
								/>
								<div>
									<p className="m-0">{chat.chatName}</p>
									<p className="m-0 text-muted">
										{chat.lastMessage.owner === userId
											? "You"
											: chat.chatName}
										: {chat.lastMessage.text}
									</p>
								</div>
							</Link>
						</li>
					))}
			</ul>
		</div>
	);
}
