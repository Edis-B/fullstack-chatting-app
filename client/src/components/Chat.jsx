import { useParams } from "react-router-dom";

import UserList from "./Chatting/UserList";
import MessageInput from "./Chatting/MessageInput";
import ChatBox from "./Chatting/ChatBox";
import ChatBoxHeader from "./Chatting/ChatBoxHeader";

export default function Chat() {
	const params = useParams();
	const chatId = params.id;

	return (
		<div className="container-fluid chat-container d-flex">
			{/* User List */}
			<UserList />

			{chatId && (
				<div className="chat-box p-3" style={{ flex: 4 }}>
					{/* Chat Box */}
					<ChatBox chatId={chatId} />

					{/* Message Input */}
					<MessageInput chatId={chatId} />
				</div>
			)}
		</div>
	);
}
