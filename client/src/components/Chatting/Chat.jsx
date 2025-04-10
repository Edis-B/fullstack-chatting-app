import UserList from "./UserList";
import MessageInput from "./MessageInput";
import ChatBox from "./ChatBox";

import "../../css/chat.css";
import { useChat } from "../../contexts/ChatContext";

export default function Chat() {
	const { chatId } = useChat();

	return (
		<div className="container-fluid chat-container d-flex">
			{/* User List */}
			<UserList />

			<div
				className="chat-box p-3"
				style={{ height: "calc(100vh - 100px)" }}
			>
				{!!chatId ? (
					<>
						{/* Chat Box */}
						<ChatBox />

						{/* Message Input */}
						<MessageInput />
					</>
				) : (
					<p>No chat selected.</p>
				)}
			</div>
		</div>
	);
}
