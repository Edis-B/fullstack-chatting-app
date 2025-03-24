import { useEffect, useState } from "react";
import { Link } from "react-router";
import { friendStatuses, host } from "../../common/appConstants.js";
import { useProfile } from "../../contexts/ProfileContext.jsx";

import { useUser } from "../../contexts/UserContext.jsx";
import AutoFriendButton from "./AutoFriendButton.jsx";

export default function Friends() {
	const { userId } = useUser();
	const { profileId } = useProfile();
	const [friendsArray, setFriendsArray] = useState({});

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
			setFriendsArray(data);
		} catch (err) {
			console.log(err);
		}
	}

	const changeStatus = ({ id, type, prevType }) => {
		setFriendsArray((prev) => {
			const guy = prev[prevType].find((p) => p._id == id);

			const newObj = {
				...prev,
				[prevType]: prev[prevType]?.filter((p) => p._id != id),
			};

			if (type) {
				newObj[type].push(guy);
			}

			return newObj;
		});
	};

	return (
		<div className="container mt-4">
			<h2>Friends</h2>
			<div className="card mb-3">
				<div className="card-header">Current Friends</div>
				<ul className="list-group list-group-flush">
					{friendsArray[friendStatuses.FRIENDS]?.length > 0 ? (
						friendsArray[friendStatuses.FRIENDS].map((friend) => (
							<li
								key={friend._id}
								className="list-group-item d-flex justify-content-between align-items-center"
							>
								<span>{friend.username}</span>
								<AutoFriendButton
									params={{
										status: friendStatuses.FRIENDS,
										senderId: userId,
										receiverId: friend._id,
										changeStatus,
									}}
								/>
								<Link
									to={`/profile/${friend._id}`}
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
							{friendsArray[friendStatuses.INCOMING_REQUEST]
								?.length > 0 ? (
								friendsArray[
									friendStatuses.INCOMING_REQUEST
								].map((friend) => (
									<li
										key={friend._id}
										className="list-group-item d-flex justify-content-between align-items-center"
									>
										<span>{friend.username}</span>
										<AutoFriendButton
											params={{
												status: friendStatuses.INCOMING_REQUEST,
												senderId: userId,
												receiverId: friend._id,
												changeStatus,
											}}
										/>
										<Link
											to={`/profile/${friend._id}`}
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
							{friendsArray[friendStatuses.OUTGOING_REQUEST]
								?.length > 0 ? (
								friendsArray[
									friendStatuses.OUTGOING_REQUEST
								].map((friend) => (
									<li
										key={friend._id}
										className="list-group-item d-flex justify-content-between align-items-center"
									>
										<span>{friend.username}</span>
										<AutoFriendButton
											params={{
												status: friendStatuses.OUTGOING_REQUEST,
												senderId: userId,
												receiverId: friend._id,
												changeStatus,
											}}
										/>
										<Link
											to={`/profile/${friend._id}`}
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
							{friendsArray[friendStatuses.BLOCKED]?.length >
							0 ? (
								friendsArray[friendStatuses.BLOCKED].map(
									(friend) => (
										<li
											key={friend._id}
											className="list-group-item d-flex justify-content-between align-items-center"
										>
											<span>{friend.username}</span>
											<AutoFriendButton
												params={{
													status: friendStatuses.BLOCKED,
													senderId: userId,
													receiverId: friend._id,
													changeStatus,
												}}
											/>
											<Link
												to={`/profile/${friend._id}`}
												className="btn btn-primary btn-sm"
											>
												View
											</Link>
										</li>
									)
								)
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
