import { createContext, useContext, useEffect, useState } from "react";
import { host } from "../common/appConstants.js";
import { io } from "socket.io-client";

const UserContext = createContext();

export function UserProvider({ children }) {
	const [userId, setUserId] = useState(null);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		fetchUser();
	}, []);

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

	async function fetchUser() {
		try {
			const response = await fetch(`${host}/user/get-user-id`, {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			setUserId(data);

			return data;
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<UserContext.Provider value={{ userId, setUserId, socket, setSocket }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
