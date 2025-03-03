import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { host } from "../../common/appConstants.js";

export default function Profile(props) {
	const params = useParams();
	const userId = params.id ?? props.userId ?? "";
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
		fetchProfileData();
	}, [userId]);

	useEffect(() => {});

	async function fetchProfileData() {
		try {
			const response = await fetch(
				`${host}/user/get-user-profile-data?userId=${userId ?? ""}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			setProfileData(data);
		} catch (err) {
			console.log(err);
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
						<Link>
							<Link className="btn btn-primary">
								Edit Profile
							</Link>
						</Link>
						<button className="btn btn-outline-secondary">
							Settings
						</button>
					</div>
				) : (
					<div className="ms-auto">
						<button className="btn btn-primary">Message</button>
						{profileData.ourStatus ===
						friendStatuses.NOT_FRIENDS ? (
							<button className="btn btn-outline-secondary">
								Add friend
							</button>
						) : (
							<button className="btn btn-outline-secondary">
								Unfriend
							</button>
						)}
					</div>
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
			{/* Posts Section */}
			<div className="mt-3">
				<div className="card mb-3">
					<div className="card-body">
						<div className="d-flex">
							<img
								src="https://via.placeholder.com/50"
								className="rounded-circle me-2"
								alt="Profile"
							/>
							<div>
								<h6 className="mb-0">John Doe</h6>
								<p className="text-muted small">2 hours ago</p>
							</div>
						</div>
						<p className="mt-2">
							Just enjoying a great day at the park! ☀️
						</p>
						<img
							src="https://via.placeholder.com/600x300"
							className="img-fluid rounded"
							alt="Post Image"
						/>
						<div className="d-flex justify-content-between mt-3">
							<button className="btn btn-outline-primary btn-sm">
								Like
							</button>
							<button className="btn btn-outline-secondary btn-sm">
								Comment
							</button>
							<button className="btn btn-outline-success btn-sm">
								Share
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
