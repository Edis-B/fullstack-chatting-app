import UserList from "./UserList";
import MessageInput from "./MessageInput";
import ChatBox from "./ChatBox";
import { ChatProvider } from "../../contexts/ChatContext";

import "../../css/chat.css";

export default function Chat() {
	return (
		<ChatProvider>
			<div className="container-fluid chat-container d-flex">
				{/* User List */}
				<UserList />

				<div
					className="chat-box p-3"
					style={{ maxHeight: "calc(100vh - 100px)" }}
				>
					{/* Chat Box */}
					<ChatBox />

					{/* Message Input */}
					<MessageInput />
				</div>
			</div>
		</ChatProvider>
	);
}
