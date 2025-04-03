import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { host, client } from "../../common/appConstants.js";
import ChatBoxHeader from "./ChatBoxHeader";
import { useChat } from "../../contexts/ChatContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { dateTimeFormat } from "../../utils/dateUtils.js";
import request from "../../utils/request.js";

export default function ChatBox() {
	const { user, socket, enqueueError } = useUser();
	const { chatId } = useChat();

	const chatBoxRef = useRef(null);
	const [chatHistory, setChatHistory] = useState([]);

	const [isAtBottom, setIsAtBottom] = useState(true);
	const [isAtTop, setIsAtTop] = useState(false);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const div = chatBoxRef.current;

		if (!div) return;

		div.addEventListener("scroll", handleScroll);

		return () => {
			if (div) {
				div.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	useEffect(() => {
		if (!chatId) return;

		setChatHistory([]);
		setPage(1);

		fetchChatHistory(chatId, 1);

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

	useEffect(() => {
		if (isAtTop) {
			fetchChatHistory(chatId, page);
		}
	}, [isAtTop]);

	const handleScroll = (e) => {
		const chatBox = chatBoxRef.current;

		if (!chatBox) return;

		const isAtTop = chatBox.scrollTop <= 10;
		const atBottom =
			chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight <=
			20;

		setIsAtBottom(atBottom);
		setIsAtTop(isAtTop);
	};

	function scrollToBottom() {
		const chatBox = chatBoxRef.current;
		if (!chatBox) return;
		chatBox.scrollTop = chatBox.scrollHeight;
	}

	const handleMessage = (data) => {
		if (data.message.chat === chatId) {
			setChatHistory((prev) => [...prev, data.message]);
		}
	};

	async function fetchChatHistory(id, page) {
		try {
			const { response, responseData } = await request.get(
				`${host}/chat/get-chat-history`,
				{
					chatId: id,
					page,
				}
			);

			const { data } = responseData;

			if (response.ok && data?.length > 0) {
				setChatHistory((prev) => {
					if (prev.some((m) => m._id == data[0]._id)) {
						return prev;
					}

					const newArr = [...data.reverse(), ...prev].flat();
					return newArr;
				});

				setPage((prev) => prev + 1);
			}

			if (!response.ok) {
				enqueueError(responseData.message);
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	let previousDate;
	return (
		<div className="chatbox-container d-flex flex-column h-auto">
			{/* Chat Box Header */}
			<ChatBoxHeader className="chatbox-header flex-none bg-light p-3 border-bottom" />

			{/* Messages */}
			<div
				className="messages flex-grow-1 overflow-auto p-3"
				ref={chatBoxRef}
				style={{ height: "calc(100vh - 150px)" }} // Adjust based on header and input height
			>
				{chatHistory.length > 0 ? (
					chatHistory.map((message, index) => {
						const isCurrentUser =
							message.user?.username === user?.username;

						previousDate = chatHistory[index - 1]?.date;
						const within5Minutes =
							new Date(message.date) - new Date(previousDate) >
							1000 * 60 * 5;

						return (
							<div key={message._id}>
								{(previousDate === undefined ||
									within5Minutes) && (
									<div
										className="text-muted d-flex justify-content-center"
										key={message.date}
									>
										{dateTimeFormat.format(
											new Date(message.date)
										)}
									</div>
								)}

								{isCurrentUser ? (
									// Current User's Message (Right-Aligned)
									<div
										className="message d-flex align-items-start mb-3 justify-content-end"
										key={message._id}
									>
										{/* Message Content */}
										<div className="d-flex flex-column align-items-end">
											{/* Username */}
											<div className="text-muted small">
												{message.user.username}
											</div>
											{/* Message */}
											<div className="message-content bg-primary text-white p-2 rounded">
												<p className="mb-0">
													{message.text}
												</p>
											</div>
										</div>
										{/* Profile Picture */}
										<img
											src={message.user.image}
											alt={message.user.username}
											className="rounded-circle ms-2"
											style={{
												width: "48px",
												height: "48px",
												objectFit: "cover",
											}}
										/>
									</div>
								) : (
									// Sender's Message (Left-Aligned)
									<div
										className="message d-flex align-items-start mb-3"
										key={message._id}
									>
										{/* Profile Picture */}
										<img
											src={message.user.image}
											alt={message.user.username}
											className="rounded-circle me-2"
											style={{
												width: "48px",
												height: "48px",
												objectFit: "cover",
											}}
										/>
										{/* Message Content */}
										<div className="d-flex flex-column align-items-start">
											{/* Username */}
											<div className="text-muted small">
												{message.user.username}
											</div>
											{/* Message */}
											<div className="message-content bg-light p-2 rounded">
												<p className="mb-0">
													{message.text}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})
				) : (
					<p>No messages yet.</p>
				)}
			</div>
		</div>
	);
}
