import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import { useUser } from "../../contexts/UserContext";

import { host, visibilityTypes } from "../../common/appConstants.js";
import request from "../../utils/request.js";

export default function EditGalleryMenu({ gallery }) {
	const { userId, enqueueError } = useUser();
	const galleryId = gallery?._id;

	const [isEditActive, setIsEditActive] = useState(false);
	const [editedGallery, setEditedGallery] = useState({});

	const [isAddImagesActive, setIsAddImagesActive] = useState(false);
	const [uploadedPhotos, setUploadedPhotos] = useState([]);
	const [selectedPhotos, setSelectedPhotos] = useState([]);
	const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);

	const [imageUrl, setImageUrl] = useState("");

	const handleImageUrlChange = (e) => {
		setImageUrl(e.target.value);
	};

	// Fetch user's uploaded images
	const fetchUploadedImages = async () => {
		setIsFetchingPhotos(true);
		try {
			const { response, data } = await request.get(
				`${host}/photo/get-user-photos`,
				{ userId, excluded: gallery.photos.map((p) => p._id) }
			);

			if (!response.ok) {
				enqueueError(data);
				return;
			}

			setUploadedPhotos(data); // Assuming 'data' contains images
		} catch (error) {
			console.error("Failed to fetch uploaded images", error);
		} finally {
			setIsFetchingPhotos(false);
		}
	};

	const handleAddImageByUrl = async () => {
		if (!imageUrl) return;

		try {
			const { response, data } = await request.post(
				`${host}/gallery/create-image-urls-to-gallery`,
				{
					imageUrls: [imageUrl],
					galleryId,
					userId,
				}
			);

			if (response.ok) {
				enqueueError(data);
				return;
			}

			// Reset the input after adding
			setImageUrl("");
		} catch (error) {
			console.error("Failed to add image by URL", error);
		}
	};

	async function saveEditGallery() {
		const { response, data } = await request.put(
			`${host}/gallery/edit-gallery`,
			{
				userId,
				galleryData: editedGallery,
			}
		);

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		handleCloseMenus();
	}

	async function deleteGallery(galleryId) {
		const { response, data } = await request.delete(
			`${host}/gallery/delete-gallery`,
			{
				galleryId,
				userId,
			}
		);

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		navigate("/profile");
	}

	const handleAddSelectedImages = async () => {
		try {
			await request.post(`${host}/gallery/add-photos-to-gallery`, {
				galleryId,
				photoIds: selectedPhotos.map((p) => p._id),
			});

			// Reset after adding images
			setSelectedPhotos([]);
		} catch (error) {
			console.error("Failed to add selected images", error);
		}
	};

	const toggleImageSelection = (photo) => {
		setSelectedPhotos((prev) => {
			const contains = prev.some((p) => p.equals(photo));

			contains
				? prevSelected.filter((url) => url !== imageUrl)
				: [...prevSelected, imageUrl];
		});
	};

	const handleEditGallery = () => {
		setEditedGallery(gallery);
		setIsEditActive(true);
		setIsAddImagesActive(false);
	};

	const handleAddImages = () => {
		setIsAddImagesActive(true);
		setIsEditActive(false);
	};

	const handleCloseMenus = () => {
		setIsEditActive(false);
		setIsAddImagesActive(false);
	};
	return (
		<div>
			{/* Buttons for editing and adding images */}
			{gallery.user?._id === userId && (
				<div className="d-flex justify-content-between">
					<button
						className="btn btn-primary"
						onClick={handleEditGallery}
					>
						Edit Gallery Settings
					</button>
					<button
						className="btn btn-success"
						onClick={handleAddImages}
					>
						Add More Images
					</button>
					<button
						className="d-flex flex-row align-items-center btn btn-danger"
						onClick={() => {
							if (
								confirm(
									"Are you sure you want to delete this gallery?"
								)
							) {
								deleteGallery(galleryId);
							}
						}}
					>
						<i
							className="bi bi-trash align-items-center d-flex m-1"
							style={{ fontSize: "1.2rem" }}
						/>
						Delete Gallery
					</button>
				</div>
			)}

			{/* Add More Images Menu */}
			{isAddImagesActive && (
				<div className="menu-overlay mt-4">
					<div className="menu-content">
						<h4>Add More Images</h4>
						<hr />

						{/* Option 1: Add by URL */}
						<div className="mb-3 d-flex flex-row">
							<label htmlFor="image-url" className="form-label">
								Enter Image URL
							</label>
							<input
								type="text"
								id="image-url"
								className="form-control"
								placeholder="Enter image URL"
								value={imageUrl}
								onChange={handleImageUrlChange}
							/>
							<Button
								variant="primary"
								className="mt-2"
								onClick={handleAddImageByUrl}
							>
								Upload Image
							</Button>
						</div>

						{/* Option 2: Fetch and select already uploaded images */}
						<div className="mb-3">
							<Button
								variant="info"
								onClick={fetchUploadedImages}
								disabled={isFetchingPhotos}
							>
								{isFetchingPhotos
									? "Loading..."
									: "View Uploaded Images"}
							</Button>

							{/* Display uploaded images */}
							{uploadedPhotos.length > 0 ? (
								<div className="mt-3">
									<h5>Select images to add to the gallery</h5>
									<div className="row">
										{uploadedPhotos.map((image) => (
											<div
												key={image.url}
												className="col-6 col-md-4 col-lg-3"
											>
												<img
													src={image.url}
													alt="Uploaded"
													className="img-fluid rounded shadow-sm gallery-img"
													onClick={() =>
														toggleImageSelection(
															image
														)
													}
													style={{
														cursor: "pointer",
														border: selectedPhotos.some(
															(i) =>
																i.equals(image)
														)
															? "3px solid green"
															: "none",
													}}
												/>
											</div>
										))}
									</div>
								</div>
							) : (<p>No other images uploaded.</p>)}
						</div>

						{/* Button to add selected images */}
						{selectedPhotos.length > 0 && (
							<Button
								variant="success"
								className="mt-3"
								onClick={handleAddSelectedImages}
							>
								Add Selected Images to Gallery
							</Button>
						)}

						{/* Close Button */}
						<Button
							variant="secondary"
							className="m-2"
							onClick={handleCloseMenus}
						>
							Close
						</Button>

						<hr />
					</div>
				</div>
			)}

			{isEditActive && (
				<div className="menu-overlay mt-4">
					<div className="menu-content">
						<h4>Edit Gallery</h4>

						{/* Edit Gallery Form */}
						<form onSubmit={saveEditGallery}>
							{/* Name Field */}
							<div className="form-group mb-3">
								<label htmlFor="gallery-name">
									Gallery Name
								</label>
								<input
									type="text"
									id="gallery-name"
									className="form-control"
									placeholder="Enter gallery name"
									value={editedGallery.name}
									onChange={(e) =>
										setEditedGallery({
											...editedGallery,
											name: e.target.value,
										})
									}
								/>
							</div>

							{/* Description Field */}
							<div className="form-group mb-3">
								<label htmlFor="gallery-description">
									Description
								</label>
								<textarea
									id="gallery-description"
									className="form-control"
									rows="3"
									placeholder="Enter gallery description"
									value={editedGallery.description}
									onChange={(e) =>
										setEditedGallery({
											...editedGallery,
											description: e.target.value,
										})
									}
								/>
							</div>

							{/* Visibility Field (Select Menu) */}
							<div className="form-group mb-3">
								<label htmlFor="gallery-visibility">
									Visibility
								</label>
								<select
									id="gallery-visibility"
									className="form-control"
									value={editedGallery.visibility}
									onChange={(e) =>
										setEditedGallery({
											...editedGallery,
											visibility: e.target.value,
										})
									}
								>
									{Object.values(visibilityTypes).map(
										(visibilityType) => (
											<option
												key={visibilityType}
												value={visibilityType}
											>
												{visibilityType}
											</option>
										)
									)}
								</select>
							</div>

							{/* Close Button */}
							<Button
								variant="success"
								className="m-2"
								type="submit"
							>
								Save
							</Button>

							{/* Close Button */}
							<Button
								variant="secondary"
								className="m-2"
								onClick={handleCloseMenus}
							>
								Close
							</Button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
