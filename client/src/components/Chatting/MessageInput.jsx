import { host } from "../../common/appConstants.js";

export default function MessageInput(props) {
	const text = document.getElementById("messageInput");

	async function sendButtonHandler() {
		const response = await fetch(`${host}/chat/send-message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				chat: props.chatId,
				text: text.value,
			}),
		});

		const data = await response.json();
		
		if (!response.ok) {
			alert(data)
		}
		
		console.log(data);
	}

	return (
		<div className="d-flex mt-auto">
			<input
				type="text"
				className="form-control"
				placeholder="Type a message..."
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
