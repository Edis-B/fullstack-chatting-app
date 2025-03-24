import { Link } from "react-router";

import { contentTypes } from "../../common/appConstants.js";
import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";
import { useProfile } from "../../contexts/ProfileContext.jsx";

import "../../css/profile.css";

export default function ProfileHeaderEdit() {
	const { enqueueError, enqueueInfo } = useUser();

	const { profileId, profileData, setProfileData, setEditActive } = useProfile();

	function handleChange(e) {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	}

	async function handleSaveChanges() {
		try {
			const response = await fetch(`${host}/user/update-profile`, {
				method: "PUT",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					profileData,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				enqueueError(data);
				return;
			}

			enqueueInfo(data);
			setProfileData(profileData);
			setEditActive(false);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<div>
				{/* Cover Photo */}
				<div className="banner-div">
					<img
						src={profileData.banner ? profileData.banner : null}
						alt="Banner"
						className="banner-photo"
					/>
				</div>

				{/* Profile Info */}
				<div className="d-flex align-items-end p-3">
					<img
						src={profileData.image ? profileData.image : null}
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
								? `${profileData.about.slice(
										0,
										20
								  )} ...View More`
								: profileData.about || "No details yet."}
						</Link>
					</div>
				</div>
			</div>

			<div className="d-flex flex-column p-3">
				<label>Profile Image URL</label>
				<input
					type="text"
					name="image"
					value={profileData.image}
					onChange={handleChange}
					placeholder="e.g., https://example.com/profile.jpg"
					className="form-control m-2"
				/>

				<label>Banner Image URL</label>
				<input
					type="text"
					name="banner"
					value={profileData.banner}
					onChange={handleChange}
					placeholder="e.g., https://example.com/banner.jpg"
					className="form-control m-2"
				/>

				<label>Username</label>
				<input
					type="text"
					name="username"
					value={profileData.username}
					onChange={handleChange}
					placeholder="e.g., johndoe123"
					className="form-control m-2"
				/>

				<label>About</label>
				<input
					type="text"
					name="about"
					value={profileData.about}
					onChange={handleChange}
					placeholder="e.g., I like playing football..."
					className="form-control m-2"
				/>
			</div>

			<div className="ms-auto d-flex justify-content-end">
				<button onClick={handleSaveChanges} className="btn btn-primary">
					Save Changes
				</button>
				<button
					onClick={() => {
						setEditActive(false);
					}}
					className="btn btn-outline-secondary"
				>
					Cancel
				</button>
			</div>
		</>
	);
}
