import { useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";

export default function Messages() {
	const { messages, setMessages } = useUser();

	const messagesWithId = messages?.map((msg, index) => ({
		id: msg.id || `message-${Date.now()}-${index}`,
		message: msg.message || msg,
		type: msg.type || "info",
	}));

	useEffect(() => {
		if (!messagesWithId || messagesWithId.length === 0) {
			return;
		}

		const timers = messagesWithId.map((_, index) => {
			return setTimeout(() => {
				setMessages((prevMessages) =>
					prevMessages.filter((_, i) => i !== index)
				);
			}, 3000);
		});

		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, [messagesWithId, setMessages]);

	return (
		<div className="message-container">
			{messagesWithId?.map((msg) => (
				<div
					key={msg.id}
					className={`message-box ${msg.type === "error" ? "error" : "info"}`}
				>
					<p className="m-0">{msg.message}</p>
				</div>
			))}
		</div>
	);
}
