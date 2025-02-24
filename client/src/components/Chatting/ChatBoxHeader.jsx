import { useState, useEffect } from "react";
import { host } from "../../common/appConstants.js";

export default function ChatBoxHeader(props) {
	const [header, setHeader] = useState({});
	const chatId = props.chatId;

	useEffect(() => {
		async function setHeaderData() {
			const headerInfo = await fetchChatHeaderInfo();

			setHeader(headerInfo);
		}

		setHeaderData();
	}, []);

	async function fetchChatHeaderInfo() {
		try {
			if (!chatId) {
				return;
			}

			const response = await fetch(
				`${host}/chat/get-chat-header?chatId=${chatId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();
			if (!response.ok) {
				alert(data);
			}
			return data;
		} catch (err) {
			alert(`There has been an error: ${err}`);
			console.log(err);
		}
	}
	return (
		<div className="chat-header d-flex align-items-center p-3 border-bottom">
			<img
				src={header.image || "https://via.placeholder.com/40"}
				alt="User Profile"
				className="rounded-circle me-2"
				width="40"
				height="40"
			/>

			<h5 className="mb-0">{header.name || "Unknown User"}</h5>
		</div>
	);
}
