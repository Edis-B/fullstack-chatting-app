import UserList from "./UserList";
import MessageInput from "./MessageInput";
import ChatBox from "./ChatBox";
import { ChatProvider } from "../../contexts/ChatContext";

import "../../css/chat.css"

export default function Chat() {
	return (
		<div className="container-fluid chat-container d-flex">
			<ChatProvider>
				{/* User List */}
				<UserList />

				<div className="chat-box p-3" style={{ maxHeight: "calc(100vh - 80px)" }}>
					{/* Chat Box */}
					<ChatBox />

					{/* Message Input */}
					<MessageInput />
				</div>
			</ChatProvider>
		</div>
	);
}
