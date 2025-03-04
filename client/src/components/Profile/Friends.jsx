import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";

export default function Friends() {
	const { userId } = useUser();
	const [friends, setFriends] = useState({});

	useEffect(() => {
		fetchFriendsData();
	}, [userId]);

	async function fetchFriendsData() {
		try {
			const response = await fetch(
				`${host}/get-user-friends?userId=${userId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			setFriends(data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="container mt-4">
			<h2>Friends</h2>

			{/* Current Friends */}
			<div className="card mb-3">
				<div className="card-header">Current Friends</div>
				<ul className="list-group list-group-flush">
					{Array.isArray(friends) ? (
						friends.map((friend) => {
							return (
								<li className="list-group-item d-flex justify-content-between align-items-center">
									<span>{friend.username}</span>
									<Link
										to={`/profile/${friend._id}`}
										className="btn btn-primary btn-sm"
									>
										View
									</Link>
								</li>
							);
						})
					) : (
						<li className="list-group-item text-muted">
							No friends.
						</li>
					)}
				</ul>
			</div>

			{/* Incoming Requests */}
			<div className="card mb-3">
				<div className="card-header">Incoming Friend Requests</div>
				<ul className="list-group list-group-flush">
					{Array.isArray(friends) ? (
						friends.map((friend) => {
							return (
								<li className="list-group-item d-flex justify-content-between align-items-center">
									<span>{friend.username}</span>
									<Link
										to={`/profile/${friend._id}`}
										className="btn btn-primary btn-sm"
									>
										View
									</Link>
								</li>
							);
						})
					) : (
						<li className="list-group-item text-muted">
							No friends.
						</li>
					)}
				</ul>
			</div>

			{/* Outgoing Requests */}
			<div className="card mb-3">
				<div className="card-header">Outgoing Friend Requests</div>
				<ul className="list-group list-group-flush">
					{Array.isArray(friends) ? (
						friends.map((friend) => {
							return (
								<li className="list-group-item d-flex justify-content-between align-items-center">
									<span>{friend.username}</span>
									<Link
										to={`/profile/${friend._id}`}
										className="btn btn-primary btn-sm"
									>
										View
									</Link>
								</li>
							);
						})
					) : (
						<li className="list-group-item text-muted">
							No friends.
						</li>
					)}
				</ul>
			</div>

			{/* Blocked Users */}
			<div className="card mb-3">
				<div className="card-header">Blocked Users</div>
				<ul className="list-group list-group-flush">
					{Array.isArray(friends) ? (
						friends.map((friend) => {
							return (
								<li className="list-group-item d-flex justify-content-between align-items-center">
									<span>{friend.username}</span>
									<Link
										to={`/profile/${friend._id}`}
										className="btn btn-primary btn-sm"
									>
										View
									</Link>
								</li>
							);
						})
					) : (
						<li className="list-group-item text-muted">
							No friends.
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
