import UserList from "./UserList";
import MessageInput from "./MessageInput";
import ChatBox from "./ChatBox";
import { ChatProvider } from "../../contexts/ChatContext";

export default function Chat() {
	return (
		<div className="container-fluid chat-container d-flex">
			<ChatProvider>
				{/* User List */}
				<UserList />

				<div className="chat-box p-3">
					{/* Chat Box */}
					<ChatBox />

					{/* Message Input */}
					<MessageInput />
				</div>
			</ChatProvider>
		</div>
	);
}
