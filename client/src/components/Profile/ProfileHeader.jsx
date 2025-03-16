import { useNavigate, useParams, Link } from "react-router";
import { useEffect, useState } from "react";

import { host } from "../../common/appConstants.js";

import { friendStatusButton } from "../../utils/friendUtils.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { useProfile } from "../../contexts/ProfileContext.jsx";
import { contentTypes } from "../../common/appConstants.js";

export default function ProfileHeader() {
	const navigate = useNavigate();

	const { profileUserId } = useParams();

	const { userId } = useUser();
	const { profileId, setEditActive } = useProfile();

	const [profileData, setProfileData] = useState({});

	useEffect(() => {
		fetchProfileData(profileId);
	}, [profileId]);

	async function fetchProfileData(id) {
		try {
			const response = await fetch(
				`${host}/user/get-user-profile-data?userId=${id ?? ""}`,
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

	return (
		<>
			{/* Cover Photo */}
			<div className="cover-photo">
				<img
					src={profileData.banner}
					alt="Banner"
					className="banner-photo"
				/>
			</div>

			{/* Profile Info */}
			<div className="d-flex align-items-end p-3">
				<img
					src={profileData.image}
					alt="Profile"
					className="rounded-circle profile-pic"
				/>

				<div className="ms-3">
					<h2 className="mb-0">{profileData.username}</h2>
					<p className="mb-0 text-muted">
						{profileData.about ?? "No details yet."}
					</p>
				</div>

				{profileData.owner ? (
					<div className="ms-auto">
						<button
							onClick={() => setEditActive(true)}
							className="btn btn-primary"
						>
							Edit Profile
						</button>
						<button className="btn btn-outline-secondary">
							Settings
						</button>
					</div>
				) : (
					!!userId && (
						<div className="ms-auto">
							<button className="btn btn-primary">Message</button>
							{friendStatusButton(
								profileData.ourStatus,
								userId,
								profileId
							)}
						</div>
					)
				)}
			</div>
		</>
	);
}
