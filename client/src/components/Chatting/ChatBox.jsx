import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { host, client } from "../../common/appConstants.js";
import ChatBoxHeader from "./ChatBoxHeader";
import { useChat } from "../../contexts/ChatContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

export default function ChatBox() {
	const { socket } = useUser();
	const { chatId } = useChat();

	const chatBoxRef = useRef(null);
	const [currentUsername, setCurrentUsername] = useState("");
	const [chatHistory, setChatHistory] = useState([]);
	const [isAtBottom, setIsAtBottom] = useState(true);

	useEffect(() => {
		fetchData();

		if (socket) {
			socket.on("receive_message", handleMessage);

			// Cleanup
			return () => {
				socket.off("receive_message", handleMessage);
			};
		}
	}, [chatId, socket]);

	useEffect(() => {
		if (isAtBottom) {
			scrollToBottom();
		}
	}, [chatHistory]); // Scroll to bottom when chat history updates

	function scrollToBottom() {
		const chatBox = chatBoxRef.current;
		chatBox.scrollTop = chatBox.scrollHeight;
	}

	async function fetchData() {
		if (!chatId) {
			return;
		}

		try {
			const response = await fetch(`${host}/user/get-username`, {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			setCurrentUsername(data);
		} catch (err) {
			console.log(err);
		}

		const messages = await fetchChatHistory(chatId);
		if (messages) {
			setChatHistory(messages);
		}
	}

	const handleMessage = (data) => {
		if (data.message.chat === chatId) {
			const chatBox = chatBoxRef.current;

			const atBottom =
				chatBox.scrollHeight -
					chatBox.scrollTop -
					chatBox.clientHeight <=
				20;

			setIsAtBottom(atBottom);

			setChatHistory((prev) => [...prev, data.message]);
		}
	};

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

			<div className="messages" id="messages" ref={chatBoxRef}>
				{Array.isArray(chatHistory) &&
					chatHistory.map((message) => {
						return (
							<div
								className={
									message.user.username === currentUsername
										? "message sent d-flex align-items-center justify-content-end h-auto mb-3"
										: "message received d-flex align-items-center h-auto mb-3"
								}
								key={message._id}
							>
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
