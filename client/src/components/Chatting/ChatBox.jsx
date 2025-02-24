import { useState, useEffect } from "react";
import { host, client } from "../../common/appConstants.js";
import ChatBoxHeader from "./ChatBoxHeader"

export default function ChatBox(props) {
	const chatId = props.chatId;
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

			if (!response.ok) {
				alert(data);
			}

			return data;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	return (
		<>
			{/* Chat Box Header */}
			<ChatBoxHeader chatId={chatId} />

			<div className="messages" id="messages">
				{Array.isArray(chatHistory) &&
					chatHistory.map((message) => {
						return (
							<div
								className={
									message.isMine
										? "message sent d-flex align-items-center justify-content-end h-auto mb-3"
										: "message received d-flex align-items-center h-auto mb-3"
								}
							>
								{/* <div className="message received d-flex align-items-center mb-3"> */}
								<img
									src={message.user.image}
									alt={message.user.username}
									className="rounded-circle me-2"
								/>
								<div>
									<strong>{message.user.username}:</strong>
									{message.text}
								</div>
							</div>
						);
					})}
			</div>
		</>
	);
}
