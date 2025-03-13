import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useProfile } from "../../contexts/ProfileContext.jsx";
import { host, httpUrlRegex } from "../../common/appConstants.js";

export default function Photos() {
	const { userId, setError } = useUser();
	const { profileId } = useProfile();

	const [photos, setPhotos] = useState([]);
	const [imageUrl, setImageUrl] = useState("");
	const [preview, setPreview] = useState(null);

	useEffect(() => {
		if (!userId) return;

		fetchUserPhotos(userId);
	}, [userId]);

	function isValidImageUrl(url) {
		return url.match(httpUrlRegex);
	}

	function handleUrlChange(event) {
		const url = event.target.value.trim();
		setImageUrl(url);

		if (!isValidImageUrl(url)) {
			setError(
				"Please enter a valid image URL ending in .jpg, .png, etc."
			);
			setPreview(null);
		} else {
			setError("");
			setPreview(url); // Show the image preview
		}
	}

	async function handleUpload() {
		if (!imageUrl) {
			setError("Please enter a valid image URL before uploading.");
			return;
		}

		await uploadPhoto(userId, imageUrl);

		// Clear input after upload
		setImageUrl("");
		setPreview(null);
	}

	async function fetchUserPhotos(userId) {
		try {
			const response = await fetch(
				`${host}/user/get-user-photos?userId=${userId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setError(data);
				return;
			}

			setPhotos(data);
		} catch (err) {
			console.log(err);
			setError("Something went wrong getting images");
			return;
		}
	}

	async function uploadPhoto(userId, imageUrl) {
		try {
			const response = await fetch(`${host}/user/upload-photo`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					userId,
					imageUrl,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data);
				return;
			}
		} catch (err) {
			console.log(err);
			setError("Something went wrong uploading image");
			return;
		}
	}

	return (
		<div className="d-flex flex-column align-items-center p-3 border rounded">
			{profileId === userId && (
				<>
					<h5>Upload Profile Photo (via URL)</h5>

					{/* Image Preview */}
					{preview && (
						<img
							src={preview}
							alt="Preview"
							className="rounded-circle mb-3"
							width="100"
							height="100"
							style={{
								objectFit: "cover",
								border: "2px solid #ddd",
							}}
						/>
					)}

					{/* URL Input */}
					<input
						type="text"
						placeholder="Enter image URL"
						value={imageUrl}
						className="form-control mb-2"
						onChange={handleUrlChange}
					/>

					{/* Upload Button */}
					<button
						className="btn btn-primary"
						onClick={handleUpload}
						disabled={!imageUrl}
					>
						Upload
					</button>
				</>
			)}

			{/* Gallery of Uploaded Photos */}
			<div className="mt-4 w-100">
				<h5>Uploaded Photos</h5>
				<div className="d-flex flex-wrap justify-content-center">
					{photos.length > 0 ? (
						photos.map((photo, index) => (
							<div key={photo._id} className="m-2">
								<img
									src={photo.url}
									alt={`Uploaded ${index}`}
									className="rounded mb-2"
									width="100"
									height="100"
									style={{
										objectFit: "cover",
										border: "2px solid #ddd",
									}}
								/>
							</div>
						))
					) : (
						<p>No photos uploaded yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
