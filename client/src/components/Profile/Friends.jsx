import { useEffect, useState } from "react";
import { host } from "../../common/appConstants.js";

export default function Friends() {
	const [friends, setFriends] = useState({});

	useEffect(() => {}, [userId]);

	async function fetchFriendsData() {
		const response = await fetch(`${host}/get-user-friends?userId=${userId}`);
	}

	return (
		<div className="container mt-4">
			<h2>Friends</h2>

			{/* Current Friends */}
			<div className="card mb-3">
				<div className="card-header">Current Friends</div>
				<ul className="list-group list-group-flush">
					<li className="list-group-item d-flex justify-content-between align-items-center">
						<span>John Doe</span>
						<a href="/profile/1" className="btn btn-primary btn-sm">
							View
						</a>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center">
						<span>Jane Smith</span>
						<a href="/profile/2" className="btn btn-primary btn-sm">
							View
						</a>
					</li>
					<li className="list-group-item text-muted">
						No friends yet.
					</li>
				</ul>
			</div>

			{/* Incoming Requests */}
			<div className="card mb-3">
				<div className="card-header">Incoming Friend Requests</div>
				<ul className="list-group list-group-flush">
					<li className="list-group-item d-flex justify-content-between align-items-center">
						<span>Michael Johnson</span>
						<button className="btn btn-success btn-sm">
							Accept
						</button>
					</li>
					<li className="list-group-item text-muted">
						No incoming requests.
					</li>
				</ul>
			</div>

			{/* Outgoing Requests */}
			<div className="card mb-3">
				<div className="card-header">Outgoing Friend Requests</div>
				<ul className="list-group list-group-flush">
					<li className="list-group-item">
						Sarah Williams (Pending)
					</li>
					<li className="list-group-item text-muted">
						No outgoing requests.
					</li>
				</ul>
			</div>

			{/* Blocked Users */}
			<div className="card mb-3">
				<div className="card-header">Blocked Users</div>
				<ul className="list-group list-group-flush">
					<li className="list-group-item">Blocked User 1</li>
					<li className="list-group-item text-muted">
						No blocked users.
					</li>
				</ul>
			</div>
		</div>
	);
}
