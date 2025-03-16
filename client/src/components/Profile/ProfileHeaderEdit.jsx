import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import { host } from "../../common/appConstants.js";
import { useUser } from "../../contexts/UserContext.jsx";
import { useProfile } from "../../contexts/ProfileContext.jsx";
import { friendStatusButton } from "../../utils/friendUtils.jsx";

export default function ProfileHeaderEdit() {
	const navigate = useNavigate();

	const { profileUserId } = useParams();
	const { userId, setErrors } = useUser();

	const { profileId, setEditActive } = useProfile();

	const [profileData, setProfileData] = useState({
		username: "",
		image: "",
		banner: "",
		about: "",
	});

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
				setErrors((prev) => [...prev, data]);
				return;
			}

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
				<div className="cover-photo">
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
						<p className="mb-0 text-muted">
							{profileData.about ?? "No details yet."}
						</p>
					</div>
				</div>
			</div>

			<div className="d-flex align-items-end p-3">
				<div className="d-flex flex-row">
					<div className="d-flex flex-column">
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
					</div>
				</div>

				<div className="ms-auto">
					<button
						onClick={handleSaveChanges}
						className="btn btn-primary"
					>
						Save Changes
					</button>
					<button
						onClick={() => {
							console.log("Button clicked");
							setEditActive(false);
						}}
						className="btn btn-outline-secondary"
					>
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}
