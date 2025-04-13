import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { host, client } from "../../common/appConstants.js";
import { useChat } from "../../contexts/ChatContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import SearchBar from "../Search/SearchBar.jsx";
import request from "../../utils/request.js";

export default function UserList() {
	const { id } = useParams();

	const { userId, socket, enqueueError } = useUser();
	const { setChatId } = useChat();

	const navigate = useNavigate();

	const [search, setSearch] = useState(null);
	const [allChats, setAllChats] = useState([]);
	const [filteredChats, setFilteredChats] = useState([]);

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
				setFilteredChats([]);
				return;
			}

			setFilteredChats(
				allChats.filter((c) => c.chatName.includes(search))
			);
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [search]);

	const handleMessage = (data) => {
		setAllChats((prev) => {
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
			const { response, payload } = await request.get(
				`${host}/chat/get-user-chats`,
				{
					userId,
				}
			);

			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
			}

			if (!id) {
				navigate(`/chat/${data[0].chatId}`, { replace: true });
				return;
			}

			setAllChats(data);
		} catch (err) {
			console.log(err);
		}
	}

	function getLastMessageDisplay(chat, userId) {
		if (!chat.lastMessage) {
			return "No messages yet";
		}

		const sender =
			chat.lastMessage.owner === userId ? "You" : chat.chatName;
		return `${sender}: ${chat.lastMessage.text}`;
	}

	function iterateChats(chats) {
		return chats.map((chat) => (
			<li
				key={chat.chatId}
				className="list-group-item d-flex cursor-pointer p-1"
			>
				<Link
					to={`/chat/${chat.chatId}`}
					className="text-decoration-none text-dark w-100 d-flex align-items-center"
				>
					<img
						src={chat.chatImage}
						className="person-avatar m-2"
						style={{
							width: "40px",
							height: "40px",
						}}
					/>
					<div>
						<p className="m-0">{chat.chatName}</p>
						<p className="m-0 text-muted">
							{getLastMessageDisplay(chat, userId)}
						</p>
					</div>
				</Link>
			</li>
		));
	}

	function searchBar() {
		return (
			<div className="d-flex flex-row">
				<p>Search for users:</p>
				<SearchBar />
			</div>
		);
	}

	return (
		<div className="user-list p-3 bg-light">
			<h5>Chats</h5>

			<input
				type="text"
				className="form-control search-bar mb-3"
				placeholder="Search chat..."
				id="searchUsers"
				onChange={(e) => setSearch(e.target.value)}
			/>

			<ul className="list-group mt-3">
				{!search ? (
					allChats.length > 0 ? (
						iterateChats(allChats)
					) : (
						<div>
							<b>No chats yet? </b>
							{searchBar()}
						</div>
					)
				) : filteredChats.length > 0 ? (
					iterateChats(filteredChats)
				) : (
					<div>
						<b>Not finding chat?</b>
						{searchBar()}
					</div>
				)}
			</ul>
		</div>
	);
}
