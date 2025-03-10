import { useEffect, useState } from "react";
import { Link } from "react-router";
import { host } from "../../common/appConstants.js";
import { useProfile } from "../../contexts/ProfileContext.jsx";

import { friendStatusButton } from "../../utils/friendUtils.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

export default function Friends() {
	const { userId } = useUser();
	const { profileId } = useProfile();
	const [friendsArray, setFriends] = useState({});

	useEffect(() => {
		if (!profileId) {
			return;
		}

		fetchFriendsData();
	}, [profileId]);

	async function fetchFriendsData() {
		try {
			const response = await fetch(
				`${host}/user/get-user-friends?userId=${profileId}`,
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
			<div className="card mb-3">
				<div className="card-header">Current Friends</div>
				<ul className="list-group list-group-flush">
					{friendsArray.friends?.length > 0 ? (
						friendsArray.friends.map((friendObj) => (
							<li
								key={friendObj.friend._id}
								className="list-group-item d-flex justify-content-between align-items-center"
							>
								<span>{friendObj.friend.username}</span>
								{friendStatusButton(
									friendObj.status,
									userId,
									friendObj.friend._id
								)}
								<Link
									to={`/profile/${friendObj.friend._id}`}
									className="btn btn-primary btn-sm"
								>
									View
								</Link>
							</li>
						))
					) : (
						<li className="list-group-item text-muted">
							No friends.
						</li>
					)}
				</ul>
			</div>

			{friendsArray.owner && (
				<>
					<div className="card mb-3">
						<div className="card-header">
							Incoming Friend Requests
						</div>
						<ul className="list-group list-group-flush">
							{friendsArray.incoming?.length > 0 ? (
								friendsArray.incoming.map((friendObj) => (
									<li
										key={friendObj.friend._id}
										className="list-group-item d-flex justify-content-between align-items-center"
									>
										<span>{friendObj.friend.username}</span>
										{friendStatusButton(
											friendObj.status,
											userId,
											friendObj.friend._id
										)}
										<Link
											to={`/profile/${friendObj.friend._id}`}
											className="btn btn-primary btn-sm"
										>
											View
										</Link>
									</li>
								))
							) : (
								<li className="list-group-item text-muted">
									No friends.
								</li>
							)}
						</ul>
					</div>
					<div className="card mb-3">
						<div className="card-header">
							Outgoing Friend Requests
						</div>
						<ul className="list-group list-group-flush">
							{friendsArray.outgoing?.length > 0 ? (
								friendsArray.outgoing.map((friendObj) => (
									<li
										key={friendObj.friend._id}
										className="list-group-item d-flex justify-content-between align-items-center"
									>
										<span>{friendObj.friend.username}</span>
										{friendStatusButton(
											friendObj.status,
											userId,
											friendObj.friend._id
										)}
										<Link
											to={`/profile/${friendObj.friend._id}`}
											className="btn btn-primary btn-sm"
										>
											View
										</Link>
									</li>
								))
							) : (
								<li className="list-group-item text-muted">
									No outgoing request.
								</li>
							)}
						</ul>
					</div>
					<div className="card mb-3">
						<div className="card-header">Blocked Users</div>
						<ul className="list-group list-group-flush">
							{friendsArray.blocked?.length > 0 ? (
								friendsArray.blocked.map((friendObj) => (
									<li
										key={friendObj.friend._id}
										className="list-group-item d-flex justify-content-between align-items-center"
									>
										<span>{friendObj.friend.username}</span>
										{friendStatusButton(
											friendObj.status,
											userId,
											friendObj.friend._id
										)}
										<Link
											to={`/profile/${friendObj.friend._id}`}
											className="btn btn-primary btn-sm"
										>
											View
										</Link>
									</li>
								))
							) : (
								<li className="list-group-item text-muted">
									No friends.
								</li>
							)}
						</ul>
					</div>
				</>
			)}
		</div>
	);
}
