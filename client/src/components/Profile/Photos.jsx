import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { host, httpUrlRegex } from "../../common/appConstants.js";

export default function ProfilePhotoUploader() {
	const { userId, setError } = useUser();

	const [imageUrl, setImageUrl] = useState("");
	const [preview, setPreview] = useState(null);

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
			<h5>Upload Profile Photo (via URL)</h5>

			{/* Image Preview */}
			{preview && (
				<img
					src={preview}
					alt="Preview"
					className="rounded-circle mb-3"
					width="100"
					height="100"
					style={{ objectFit: "cover", border: "2px solid #ddd" }}
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
		</div>
	);
}
