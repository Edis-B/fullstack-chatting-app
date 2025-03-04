import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";
import {
	acceptFriendRequest,
	cancelFriendRequest,
	declineFriendRequest,
	sendFriendRequest,
} from "../../services/userAPIs.js";
import Friends from "./Friends";

export default function Profile() {
	const navigate = useNavigate();

	const { profileUserId } = useParams();
	const { userId } = useUser();

	const [profileId, setProfileId] = useState(null);
	const [profileData, setProfileData] = useState({});

	const friendStatuses = {
		OUTGOING_REQUEST: "outgoing request",
		INCOMING_REQUEST: "incoming request",
		FRIENDS: "friends",
		NOT_FRIENDS: "not friends",
		BLOCKED: "blocked",
		BLOCKED_BY: "blocked by",
	};

	useEffect(() => {
		setProfileId(profileUserId);

		fetchProfileData();
	}, [profileUserId, profileId]);

	async function fetchProfileData() {
		try {
			const response = await fetch(
				`${host}/user/get-user-profile-data?userId=${profileId ?? ""}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			if (!profileUserId) {
				navigate(`/profile/${data}`);
				return;
			}

			setProfileData(data);
		} catch (err) {
			console.log(err);
		}
	}

	function friendStatusButton(status) {
		if (status === friendStatuses.OUTGOING_REQUEST) {
			return (
				<button
					className="btn btn-outline-secondary"
					onClick={(e) => cancelFriendRequest(userId, profileId)}
				>
					Cancel request
				</button>
			);
		} else if (status === friendStatuses.INCOMING_REQUEST) {
			return (
				<>
					<button
						className="btn btn-outline-secondary"
						onClick={(e) => declineFriendRequest(userId, profileId)}
					>
						Decline request
					</button>

					<button
						className="btn btn-outline-secondary"
						onClick={(e) => acceptFriendRequest(userId, profileId)}
					>
						Accept request
					</button>
				</>
			);
		} else if (status === friendStatuses.FRIENDS) {
			return;
		} else if (!status || status === friendStatuses.NOT_FRIENDS) {
			return (
				<button
					className="btn btn-outline-secondary"
					onClick={(e) => sendFriendRequest(userId, profileId)}
				>
					Add friend
				</button>
			);
		}
	}

	return (
		<div className="container mt-3">
			{/* Cover Photo */}
			<div className="cover-photo rounded" />

			{/* Profile Info */}
			<div className="d-flex align-items-end p-3">
				<img
					src={profileData.image}
					alt="Profile"
					className="rounded-circle profile-picture"
				/>

				<div className="ms-3">
					<h2 className="mb-0">{profileData.username}</h2>
					<p className="mb-0 text-muted">
						{profileData.about ?? "No details yet."}
					</p>
				</div>

				{profileData.owner ? (
					<div className="ms-auto">
						<Link className="btn btn-primary">Edit Profile</Link>
						<button className="btn btn-outline-secondary">
							Settings
						</button>
					</div>
				) : (
					!!userId && (
						<div className="ms-auto">
							<button className="btn btn-primary">Message</button>
							{friendStatusButton(profileData.ourStatus)}
						</div>
					)
				)}
			</div>
			{/* Navigation Tabs */}
			<ul className="nav nav-tabs mt-3">
				<li className="nav-item">
					<a className="nav-link active" href="#">
						Posts
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">
						Friends
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">
						About
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">
						Photos
					</a>
				</li>
			</ul>

			<Friends />
		</div>
	);
}
