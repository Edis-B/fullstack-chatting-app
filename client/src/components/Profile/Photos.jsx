import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { useProfile } from "../../contexts/ProfileContext.jsx";
import { host, httpUrlRegex } from "../../common/appConstants.js";
import request from "../../utils/request.js";
import ImagePreviewModal from "../Photos/ImagePreviewModal.jsx";

export default function Photos() {
	const { userId, enqueueError, enqueueInfo } = useUser();
	const { profileId } = useProfile();

	const [photos, setPhotos] = useState([]);
	const [galleries, setGalleries] = useState([]);

	const [imageUrl, setImageUrl] = useState("");
	const [preview, setPreview] = useState(null);

	const [selectedImage, setSelectedImage] = useState(null);

	useEffect(() => {
		if (!profileId) return;

		fetchUserPhotos(profileId);
	}, [profileId]);

	useEffect(() => {
		if (!profileId) return;

		fetchUserGalleries(profileId);
	}, [profileId]);

	function isValidImageUrl(url) {
		return url.match(httpUrlRegex);
	}

	function handleUrlChange(event) {
		const url = event.target.value.trim();
		setImageUrl(url);

		if (!isValidImageUrl(url)) {
			enqueueError("Photo url must begin with http:// or https://");
			setPreview(null);
		} else {
			setPreview(url); // Show the image preview
		}
	}

	async function handleUpload() {
		if (!imageUrl || !isValidImageUrl(imageUrl)) {
			enqueueError("Photo url must begin with http:// or https://");
			return;
		}

		const { message, data } = await uploadPhoto(userId, imageUrl);

		const asdfa = [...photos, ...data];
		setPhotos(asdfa);

		// Clear input after upload
		setImageUrl("");
		setPreview(null);
	}

	async function fetchUserPhotos(profileId) {
		try {
			const { response, responseData } = await request.get(
				`${host}/photo/get-user-photos`,
				{
					userId: profileId,
				}
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			setPhotos(data);
		} catch (err) {
			console.log(err);
			enqueueError("Something went wrong getting images");
			return;
		}
	}

	async function fetchUserGalleries(profileId) {
		try {
			const { response, responseData } = await request.get(
				`${host}/gallery/get-user-galleries`,
				{ profileId }
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			setGalleries(data);
		} catch (err) {
			console.log(err);
			enqueueError(err);
		}
	}

	async function uploadPhoto(userId, imageUrl) {
		try {
			const { response, responseData } = await request.post(
				`${host}/photo/upload-photo`,
				{
					userId,
					imageUrls: imageUrl,
				}
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			enqueueInfo(data.message);
			return data;
		} catch (err) {
			console.log(err);
			enqueueError("Something went wrong uploading image");

			return;
		}
	}

	const changeCaptionState = (photoId, newCaption) => {
		setPhotos((prev) =>
			prev.map((photo) =>
				photo._id === photoId
					? {
							...photo,
							caption: newCaption,
					  }
					: photo
			)
		);
	};

	return (
		<div className="d-flex flex-column align-items-center p-3 border rounded">
			{profileId === userId && (
				<>
					<h5>Upload Photo (via URL)</h5>

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
									onClick={() => setSelectedImage(photo)}
									className="rounded mb-2"
									width="100"
									height="100"
									style={{
										objectFit: "cover",
										cursor: "pointer",
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

			{/* Galleries */}
			<div className="mt-4 w-100">
				<h5>Photo Galleries</h5>
				<div className="d-flex flex-wrap justify-content-center gap-3">
					{userId === profileId && (
						<Link
							to="/gallery/create"
							className="p-3 border rounded bg-light shadow-sm text-center d-flex flex-column align-items-center justify-content-center"
							style={{
								width: "100px",
								height: "100px",
								cursor: "pointer",
							}}
						>
							<h2 className="text-primary mb-2">+</h2>
							<div className="mb-0">Create Gallery</div>
						</Link>
					)}

					{galleries.length > 0 ? (
						galleries.map((gallery) => (
							<Link
								key={gallery._id}
								to={`/gallery/${gallery._id}`}
							>
								<div className="p-3 border rounded bg-light shadow-sm text-center">
									<div
										className="d-grid gap-1"
										style={{
											width: "100px",
											height: "100px",
											gridTemplateColumns:
												"repeat(2, 1fr)", // 2 columns
											gridTemplateRows: "repeat(2, 1fr)", // 2 rows
											overflow: "hidden",
										}}
									>
										{gallery.previews?.length > 0
											? gallery.previews
													.slice(0, 4)
													.map((img) => (
														<img
															key={img._id}
															src={img.url}
															alt="Preview"
															style={{
																width: "100%",
																height: "100%",
																objectFit:
																	"cover",
															}}
														/>
													))
											: null}
									</div>

									<h6 className="mt-2">{gallery.name}</h6>
								</div>
							</Link>
						))
					) : (
						<p>No galleries.</p>
					)}
				</div>
			</div>

			<ImagePreviewModal
				selectedImage={selectedImage}
				setSelectedImage={setSelectedImage}
				changeCaptionState={changeCaptionState}
			/>
		</div>
	);
}
