import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { host } from "../../common/appConstants.js";


export default function MessageInput(props) {
	const socket = io(host);
	
	const chatId = props.chatId;
	const [message, setMessage] = useState("");
	
	function sendMessage(room, messageData) {
		socket.emit("send_message", { room, message: messageData });
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
			alert(`There has been an error: ${data}`);
		}
		
		sendMessage(chatId, data);
	}
	
	return (
		<div className="d-flex mt-auto">
			<input
				type="text"
				className="form-control"
				placeholder="Type a message..."
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
