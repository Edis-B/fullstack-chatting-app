import { useState, useEffect } from "react";
import { host } from "../../common/appConstants.js";
import { useChat } from "../../contexts/ChatContext.jsx";
import { Link } from "react-router-dom";
export default function ChatBoxHeader() {
	const { chatId } = useChat();
	const [header, setHeader] = useState({});

	useEffect(() => {
		async function setHeaderData() {
			const headerInfo = await fetchChatHeaderInfo();

			setHeader(headerInfo);
		}

		setHeaderData();
	}, [chatId]);

	async function fetchChatHeaderInfo() {
		try {
			if (!chatId) {
				return;
			}

			const response = await fetch(
				`${host}/chat/get-chat-header?chatId=${chatId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();
			if (!response.ok) {
				alert(data);
			}
			return data;
		} catch (err) {
			console.log(err);
		}
	}

	if (!header) return <div>Loading...</div>; // Show a loading state

	return (
		<Link
			to={`/profile/${header._id}`}
		>
			<div className="chat-header d-flex align-items-center p-3 border-bottom">
				<img
					src={header.image || "https://via.placeholder.com/40"}
					alt="User Profile"
					className="rounded-circle me-2"
					width="40"
					height="40"
				/>

				<h5 className="mb-0">{header.name || "Unknown User"}</h5>
			</div>
		</Link>
	);
}
