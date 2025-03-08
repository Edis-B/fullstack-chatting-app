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
		if (!chatBox) return;
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
		<div className="chatbox-container flex flex-col h-screen">
			{/* Chat Box Header */}
			<ChatBoxHeader className="chatbox-header flex-none bg-gray-200 p-4 border-b border-gray-300" />

			{/* Messages */}
			<div
				className="messages flex-1 overflow-y-auto p-4 space-y-4 m-0"
				ref={chatBoxRef}
				 // Adjust based on header height
			>
				{Array.isArray(chatHistory) &&
					chatHistory.map((message) => {
						const isCurrentUser =
							message.user.username === currentUsername;

						return isCurrentUser ? (
							// Current User's Message (Right-Aligned)
							<div
								className="message flex items-start space-x-3 m-0 justify-end"
								key={message._id}
							>
								{/* Message Content */}
								<div className="flex flex-col space-y-1 items-end">
									{/* Username */}
									<div className="text-xs font-medium text-gray-600">
										{message.user.username}
									</div>
									{/* Message */}
									<div className="message-content max-w-[70%] p-3 rounded-lg bg-blue-500 text-white break-words">
										<p className="m-0">{message.text}</p>
									</div>
								</div>
								{/* Profile Picture */}
								<img
									src={message.user.image}
									alt={message.user.username}
									className="rounded-full w-12 h-12 object-cover"
								/>
							</div>
						) : (
							// Sender's Message (Left-Aligned)
							<div
								className="message flex items-start space-x-3 m-0 justify-start"
								key={message._id}
							>
								{/* Profile Picture */}
								<img
									src={message.user.image}
									alt={message.user.username}
									className="rounded-full w-12 h-12 object-cover"
								/>
								{/* Message Content */}
								<div className="flex flex-col space-y-1 items-start">
									{/* Username */}
									<div className="text-xs font-medium text-gray-600">
										{message.user.username}
									</div>
									{/* Message */}
									<div className="message-content max-w-[70%] p-3 rounded-lg bg-gray-100 break-words">
										<p className="m-0">{message.text}</p>
									</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}
