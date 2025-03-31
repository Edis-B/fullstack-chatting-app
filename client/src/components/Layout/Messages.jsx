import { useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";

export default function Messages() {
	const { messages, setMessages } = useUser();

	useEffect(() => {
		if (!messages || messages.length === 0) {
			return;
		}

		const timers = messages.map((msg) => {
			if (!msg.timer) {
				setTimeout(() => {
					setMessages((prevMessages) =>
						prevMessages.filter((m) => m.id !== msg.id)
					);
				}, 3000);
			}
			msg.timer = true;
		});

		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, [messages, setMessages]);

	return (
		<div className="message-container">
			{messages?.map((msg) => (
				<div
					key={msg.id}
					className={`message-box ${
						msg.type === "error" ? "error" : "info"
					}`}
				>
					<p className="m-0">{msg.message}</p>
				</div>
			))}
		</div>
	);
}
