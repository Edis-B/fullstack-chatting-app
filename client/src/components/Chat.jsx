import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { host, client } from "../common/appConstants.js";
import UserList from "./Chatting/UserList";
import MessageInput from "./Chatting/MessageInput";

export default function Chat() {
	const params = useParams();
	const chatId = params.id;

	const [chatHistory, setChatHistory] = useState([]);

	useEffect(() => {
		async function fetchData() {
			if (!chatId) {
				return;
			}

			const messages = await fetchChatHistory(chatId);

			if (messages) {
				setChatHistory(messages);
			}
		}

		fetchData();
	}, []);

	async function fetchChatHistory(id) {
		try {
			const response = await fetch(
				`${host}/chat/get-chat-history?chatId=${id}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();
			console.log(data);

			return data;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	return (
		<div className="container-fluid chat-container d-flex">
			{/* User List */}
			<UserList />

			{/* Chat Box */}
			<div className="chat-box p-3" style={{ flex: 4 }}>
				<div className="messages" id="messages">
					{Array.isArray(chatHistory) &&
						chatHistory.map((message) => {
							return (
								<div className="message sent d-flex align-items-center justify-content-end mb-3">
									{/* <div className="message received d-flex align-items-center mb-3"> */}
									<img
										src={message.user.image}
										alt={message.user.username}
										className="rounded-circle w-50 h-50 me-2"
									/>
									<div>
										<strong>
											{message.user.username}:
										</strong>
										{message.text}
									</div>
								</div>
							);
						})}
				</div>
				{/* Message Input */}
				<MessageInput chatId={chatId} />
			</div>
		</div>
	);
}
