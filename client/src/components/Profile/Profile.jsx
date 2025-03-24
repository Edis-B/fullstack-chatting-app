import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

import { useProfile } from "../../contexts/ProfileContext.jsx";
import { contentTypes, host } from "../../common/appConstants.js";

import ProfileHeader from "./ProfileHeader.jsx";
import ProfileHeaderEdit from "./ProfileHeaderEdit.jsx";
import UserPosts from "./UserPosts.jsx";
import Friends from "./Friends.jsx";
import Photos from "./Photos.jsx";

export default function Profile() {
	const navigate = useNavigate();

	const { content, profileUserId } = useParams();
	const { profileId, setProfileId, editActive, profileData, setProfileData } =
		useProfile() || {};

	const [selectedNav, setSelectedNav] = useState({});

	useEffect(() => {
		setSelectedNav(content);
	}, [content]);

	useEffect(() => {
		setProfileId(profileUserId);
	}, [profileUserId]);

	function generateContent(type) {
		if (!type || type == contentTypes.POSTS) {
			return <UserPosts />;
		} else if (type == contentTypes.FRIENDS) {
			return <Friends />;
		} else if (type == contentTypes.ABOUT) {
			return <p>{profileData.about || "No details yet."}</p>;
		} else if (type == contentTypes.PHOTOS) {
			return <Photos />;
		}
	}

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
		<div className="container mt-3">
			{editActive ? <ProfileHeaderEdit /> : <ProfileHeader />}

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

			<div className="p-3">{generateContent(content)}</div>
		</div>
	);
}
