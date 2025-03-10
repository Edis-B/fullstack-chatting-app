import { useEffect, useState } from "react";
import { Link } from "react-router";
import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";

import "../../css/header.css"; // Import the new CSS file

export default function Header() {
	const { userId } = useUser();
	const [image, setImage] = useState("");

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

	return (
		<header className="header">
			<div className="nav-container">
				<Link className="logo" to="/">
					Socialize
				</Link>

				<nav className="nav-links">
					<Link to="/catalog">Catalog</Link>
					<Link to="/chat">Chats</Link>

					{!!image ? (
						<Link to={`profile/${userId}`} className="profile-link">
							<img
								src={image}
								alt="Profile"
								className="profile-img"
							/>
						</Link>
					) : (
						<Link to="/login" className="login-btn">
							Login
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
}
