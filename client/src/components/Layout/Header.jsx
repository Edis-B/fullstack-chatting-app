import { useEffect, useState } from "react";
import { Link } from "react-router";
import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";

import "../../css/header.css"; // Import the new CSS file

export default function Header() {
	const { userId, setErrors, logout } = useUser();
	const [image, setImage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchUserImageUrl();
	}, []);

	async function fetchUserImageUrl() {
		try {
			const response = await fetch(`${host}/user/get-image-url`, {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setImage(data);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleLogout() {
		try {
			const response = await fetch(`${host}/user/logout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok) {
				setErrors((prev) => [...prev, data]);
				return;
			}

			logout();
		} catch (err) {
			setErrors((prev) => [
				...prev,
				"Something went wrong when trying to log out",
			]);
		}
	}

	return (
		<header className="header">
			<div className="nav-container">
				<Link className="logo" to="/">
					Socialize
				</Link>

				<div className="search-container">
					<input
						type="text"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
					<Link
						to={`/search?query=${searchQuery}`}
						className="search-button"
					>
						🔍
					</Link>
				</div>

				<nav className="nav-links">
					<Link to="/chat">Chats</Link>
					
					<Link to="/post/create-post">New Post</Link>

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
