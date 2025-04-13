import { useState, useEffect } from "react";
import { Link } from "react-router";

import { errorImage, host } from "../../common/appConstants.js";
import { useChat } from "../../contexts/ChatContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import request from "../../utils/request.js";

export default function ChatBoxHeader() {
	const { enqueueError } = useUser();
	const { chatId } = useChat();
	const [header, setHeader] = useState({});

	useEffect(() => {
		async function setHeaderData() {
			const headerInfo = await fetchChatHeaderInfo();

			setHeader(headerInfo);
		}

		setHeaderData();
	}, [chatId]);

	async function fetchChatHeaderInfo() {
		try {
			if (!chatId) {
				return;
			}

			const { response, payload } = await request.get(
				`${host}/chat/get-chat-header`,
				{
					chatId,
				}
			);

			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
			}
			return data;
		} catch (err) {
			console.log(err);
		}
	}

	if (!header) return <div>Loading...</div>; // Show a loading state

	return (
		<Link to={`/profile/${header._id}`}>
			<div className="chat-header d-flex align-items-center p-3 border-bottom">
				<img
					src={header.image || errorImage}
					alt="User Profile"
					className="person-avatar me-2"
					style={{
						width: "40px",
						height: "40px",
					}}
				/>

				<h5 className="mb-0">{header.name || "Unknown User"}</h5>
			</div>
		</Link>
	);
}
