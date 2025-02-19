import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header>
			{/* Header (Navbar) */}
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
							<li className="nav-item">
								<Link className="nav-link text-white" to="/">
									Home
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link text-white" to="/friends">
									Friends
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link text-white" to="/chats">
									Chats
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link text-white" to="/notifications">
									Notifications
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
}
