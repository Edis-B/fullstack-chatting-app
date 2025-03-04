import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { host } from "../common/appConstants.js";
import { useUser } from "../contexts/UserContext.jsx";

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
		<header>
			<nav className="navbar navbar-expand-lg navbar-light">
				<div className="container-fluid">
					<Link className="navbar-brand text-white" to="/">
						Socialize
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav ms-auto">
							{!!image ? (
								<li className="nav-item">
									<Link to={`profile/${userId}`}>
										<img
											src={image}
											alt="Profile"
											className="rounded-circle"
											style={{
												width: "40px",
												height: "40px",
												objectFit: "cover",
											}}
										/>
									</Link>
								</li>
							) : (
								<li className="nav-item">
									<Link
										className="nav-link text-white"
										to="/login"
									>
										Login
									</Link>
								</li>
							)}

							<li className="nav-item">
								<Link
									className="nav-link text-white"
									to="/catalog"
								>
									Catalog
								</Link>
							</li>

							<li className="nav-item">
								<Link
									className="nav-link text-white"
									to="/chat"
								>
									Chats
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
}
