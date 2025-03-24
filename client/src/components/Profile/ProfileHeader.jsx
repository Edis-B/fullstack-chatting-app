import { Link } from "react-router";
import { useNavigate } from "react-router";

import { useProfile } from "../../contexts/ProfileContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import AutoFriendButton from "./AutoFriendButton.jsx";

import { contentTypes } from "../../common/appConstants.js";
import { redirectToChat } from "../../services/chatAPIs.js";

import "../../css/profile.css";

export default function ProfileHeader() {
	const navigate = useNavigate();
	const { userId } = useUser();
	const { profileId, setEditActive, profileData, setProfileData } =
		useProfile();

	const changeStatus = ({ type }) => {
		setProfileData((prev) => ({
			...prev,
			ourStatus: type,
		}));
	};

	return (
		<>
			{/* Cover Photo */}
			<div className="banner-div">
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
					<Link
						className="mb-0 text-muted"
						to={`/profile/${profileId}/${contentTypes.ABOUT}`}
					>
						{profileData.about?.length > 20
							? `${profileData.about.slice(0, 20)} ...View More`
							: profileData.about || "No details yet."}
					</Link>
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
							<button
								className="btn btn-primary"
								onClick={() =>
									redirectToChat(
										profileData.username,
										navigate
									)
								}
							>
								Message
							</button>
							<AutoFriendButton
								params={{
									status: profileData.ourStatus,
									senderId: userId,
									receiverId: profileId,
									changeStatus,
								}}
							/>
						</div>
					)
				)}
			</div>
		</>
	);
}
