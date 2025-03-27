import { useEffect, useState } from "react";
import { Link } from "react-router";
import { friendStatuses, host } from "../../common/appConstants.js";
import { useProfile } from "../../contexts/ProfileContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

import AutoFriendButton from "./AutoFriendButton.jsx";

export default function Friends() {
	const { userId } = useUser();
	const { profileId } = useProfile();
	const [friendsObj, setFriendsArray] = useState({});

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

	let sections = [
		{
			title: "Current Friends",
			status: friendStatuses.FRIENDS,
			emptyMsg: "No friends.",
		},
		{
			title: "Incoming Friend Requests",
			status: friendStatuses.INCOMING_REQUEST,
			emptyMsg: "No friend requests.",
		},
		{
			title: "Outgoing Friend Requests",
			status: friendStatuses.OUTGOING_REQUEST,
			emptyMsg: "No outgoing requests.",
		},
		{
			title: "Blocked Users",
			status: friendStatuses.BLOCKED,
			emptyMsg: "No blocked users.",
		},
	];

	if (!friendsObj.owner) sections = sections.slice(0, 1);

	return (
		<div className="container mt-4">
			<h2>Friends</h2>
			{sections.map((section) => (
				<div className="card mb-3" key={section.status}>
					<div className="card-header">{section.title}</div>
					<ul className="list-group list-group-flush">
						{friendsObj[section.status]?.length > 0 ? (
							friendsObj[section.status].map((friend) => (
								<li
									key={friend._id}
									className="list-group-item d-flex justify-content-between align-items-center"
								>
									<Link to={`/profile/${friend._id}`}>
										{friend.image && (
											<img
												className="friend-pfp"
												src={friend.image}
												alt="Profile"
											/>
										)}
										<span className="m-1">
											{friend.username}
										</span>
									</Link>

									<AutoFriendButton
										params={{
											status: section.status,
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
								{section.emptyMsg}
							</li>
						)}
					</ul>
				</div>
			))}
		</div>
	);
}
