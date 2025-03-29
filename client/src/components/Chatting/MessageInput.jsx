import { useEffect, useState } from "react";
import { host } from "../../common/appConstants.js";
import { useChat } from "../../contexts/ChatContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

export default function MessageInput() {
	const { socket } = useUser();
	const { chatId } = useChat();

	const [message, setMessage] = useState("");

	function sendMessage(messageData) {
		socket.emit("send_message", {
			receiverIds: messageData.participants,
			message: messageData,
		});
		setMessage("");
	}

	async function sendButtonHandler() {
		if (!message) {
			return;
		}

		const response = await fetch(`${host}/chat/send-message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				chat: chatId,
				text: message,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			console.log(data);
		}

		sendMessage(data);
	}

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			sendButtonHandler();
			return;
		}
	};

	return (
		<div className="d-flex m-3">
			<input
				type="text"
				className="form-control"
				placeholder="Type a message..."
				onKeyDown={handleKeyPress}
				onChange={(e) => setMessage(e.target.value)}
				value={message}
				id="messageInput"
			/>
			<button
				className="btn btn-primary ms-2"
				id="sendMessageBtn"
				onClick={sendButtonHandler}
			>
				Send
			</button>
		</div>
	);
}
