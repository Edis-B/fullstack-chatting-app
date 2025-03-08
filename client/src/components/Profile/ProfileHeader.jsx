import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { host } from "../../common/appConstants.js";

import { friendStatusButton } from "../../utils/friendUtils.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { useProfile } from "../../contexts/ProfileContext.jsx";
import { contentTypes } from "../../common/appConstants.js";

export default function ProfileHeader() {
	const navigate = useNavigate();

	const { profileUserId } = useParams();
	const { content } = useParams();

	const { userId } = useUser();
	const { profileId, setProfileId } = useProfile();

	const [selectedNav, setSelectedNav] = useState({});
	const [profileData, setProfileData] = useState({});

	useEffect(() => {
		setProfileId(profileUserId);

		if (profileUserId == profileId) {
			fetchProfileData();
		}
	}, [profileUserId, profileId]);

	useEffect(() => {
		setSelectedNav(content);
	}, [content]);

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

	return (
		<>
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
							{friendStatusButton(
								profileData.ourStatus,
								userId,
								profileId
							)}
						</div>
					)
				)}
			</div>

			{/* Navigation Tabs */}
			<ul className="nav nav-tabs mt-3">
				<li className="nav-item">
					<Link
						className={
							!selectedNav || selectedNav === contentTypes.POSTS
								? "nav-link active"
								: "nav-link"
						}
						to={`/profile/${profileId}/${contentTypes.POSTS}`}
					>
						Posts
					</Link>
				</li>
				<li className="nav-item">
					<Link
						className={
							selectedNav === contentTypes.FRIENDS
								? "nav-link active"
								: "nav-link"
						}
						to={`/profile/${profileId}/${contentTypes.FRIENDS}`}
					>
						Friends
					</Link>
				</li>
				<li className="nav-item">
					<Link
						className={
							selectedNav === contentTypes.ABOUT
								? "nav-link active"
								: "nav-link"
						}
						to={`/profile/${profileId}/${contentTypes.ABOUT}`}
					>
						About
					</Link>
				</li>
				<li className="nav-item">
					<Link
						className={
							selectedNav === contentTypes.PHOTOS
								? "nav-link active"
								: "nav-link"
						}
						to={`/profile/${profileId}/${contentTypes.PHOTOS}`}
					>
						Photos
					</Link>
				</li>
			</ul>
		</>
	);
}
