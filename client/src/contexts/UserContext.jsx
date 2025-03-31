import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { host, unauthorizedString } from "../common/appConstants.js";
import { io } from "socket.io-client";
const UserContext = createContext();

export function UserProvider({ children }) {
	const [userId, setUserId] = useState(null);
	const [socket, setSocket] = useState(null);
	const [messages, setMessages] = useState([]);
	const [autherized, setAutherized] = useState(null);

	useEffect(() => {
		fetchUser();
	}, [userId]);

	useEffect(() => {
		if (userId && !socket) {
			const newSocket = io(host, {
				query: { userId },
				withCredentials: true,
			});

			setSocket(newSocket);

			// Cleanup on unmount or userId change
			return () => {
				newSocket.disconnect();
			};
		}
	}, [userId]); // Run only when userId changes

	function logout() {
		setUserId(null);
		setSocket(null);
		setMessages([]);
		setAutherized(null);

		if (socket) {
			socket.disconnect();
		}

		window.location.reload();
	}

	async function fetchUser() {
		try {
			const response = await fetch(`${host}/user/get-user-id`, {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			setUserId(data.id);
			setAutherized(data.autherized);

			return data;
		} catch (err) {
			console.log(err);
		}
	}

	const enqueueInfo = async (message) => {
		setMessages((prev) => [
			...prev,
			{ type: "info", message, id: uuidv4() },
		]);
	};

	const enqueueError = async (message) => {
		setMessages((prev) => [
			...prev,
			{ type: "error", message, id: uuidv4() },
		]);
	};

	return (
		<UserContext.Provider
			value={{
				userId,
				setUserId,
				socket,
				setSocket,
				messages,
				setMessages,
				autherized,
				logout,
				enqueueInfo,
				enqueueError,
				notifications: { enqueueError, enqueueInfo },
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
