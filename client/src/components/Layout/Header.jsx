import { useEffect, useState } from "react";
import { Link } from "react-router";

import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";

import SearchBar from "../Search/SearchBar.jsx";

import "../../css/header.css"; // Import the new CSS file
import request from "../../utils/request.js";

export default function Header() {
	const { userId, enqueueError, logout } = useUser();
	const [image, setImage] = useState("");

	useEffect(() => {
		fetchUserImageUrl();
	}, []);

	async function fetchUserImageUrl() {
		try {
			const { response, responseData } = await request.get(
				`${host}/user/get-image-url`,
				{
					userId,
				}
			);

			const { data } = responseData;

			setImage(data);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleLogout() {
		try {
			const { response, responseData } = await request.post(
				`${host}/user/logout`
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			logout();
		} catch (err) {
			enqueueError("Something went wrong when trying to log out");
		}
	}

	return (
		<header className="header">
			<div className="nav-container">
				<Link className="logo" to="/">
					Socialize
				</Link>

				<SearchBar />

				<nav className="nav-links">
					<Link to="/chat">Chats</Link>
					<Link to="/post/create">New Post</Link>

					{!!image ? (
						<>
							<Link
								to={`profile/${userId}`}
								className="profile-link"
							>
								<img
									src={image}
									alt="Profile"
									className="profile-img"
								/>
							</Link>

							<button
								onClick={handleLogout}
								className="logout-btn"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="login-btn">
								Login
							</Link>
							<Link to="/register" className="register-btn">
								Register
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
