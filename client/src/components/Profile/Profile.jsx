import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";

import { useProfile } from "../../contexts/ProfileContext.jsx";
import { contentTypes } from "../../common/appConstants.js";

import ProfileHeader from "./ProfileHeader.jsx";
import ProfileHeaderEdit from "./ProfileHeaderEdit.jsx";
import UserPosts from "./UserPosts.jsx";
import Friends from "./Friends.jsx";
import Photos from "./Photos.jsx";

export default function Profile() {
	const { content, profileUserId } = useParams();
	const { profileId, setProfileId, editActive } = useProfile();

	const [selectedNav, setSelectedNav] = useState({});

	useEffect(() => {
		setSelectedNav(content);
	}, [content]);

	useEffect(() => {
		setProfileId(profileUserId);
	}, [profileId]);

	function generateContent(type) {
		if (!type || type == contentTypes.POSTS) {
			return <UserPosts />;
		} else if (type == contentTypes.FRIENDS) {
			return <Friends />;
		} else if (type == contentTypes.FRIENDS) {
			return <Friends />;
		} else if (type == contentTypes.PHOTOS) {
			return <Photos />;
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

			{generateContent(content)}
		</div>
	);
}
