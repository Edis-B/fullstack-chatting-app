import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import { useUser } from "../../contexts/UserContext";

import { host, visibilityTypes } from "../../common/appConstants.js";
import request from "../../utils/request.js";

export default function EditGalleryMenu({ gallery, photosState }) {
	const { userId, enqueueError } = useUser();
	const galleryId = gallery?._id;

	const [isEditActive, setIsEditActive] = useState(false);
	const [editedGallery, setEditedGallery] = useState({});

	const [isAddImagesActive, setIsAddImagesActive] = useState(false);
	const [uploadedPhotos, setUploadedPhotos] = useState([]);
	const [selectedPhotos, setSelectedPhotos] = useState([]);
	const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);

	const [imageUrl, setImageUrl] = useState("");
	const [isUrlUploadActive, setIsUrlUploadActive] = useState(true);

	const handleImageUrlChange = (e) => {
		setImageUrl(e.target.value);
	};

	// Fetch user's uploaded images
	const fetchUploadedImages = async () => {
		if (!userId) return;
		setIsFetchingPhotos(true);
		
		try {
			const currentPhotos = gallery.photos.map((p) => p._id);
			const { response, responseData } = await request.get(
				`${host}/photo/get-user-photos`,
				{ userId, excluded: currentPhotos }
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
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
			const { response, responseData } = await request.post(
				`${host}/gallery/create-image-urls-to-gallery`,
				{
					imageUrls: [imageUrl],
					galleryId,
					userId,
				}
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			// Reset the input after adding
			setImageUrl("");
			photosState(data);
		} catch (error) {
			console.error("Failed to add image by URL", error);
		}
	};

	async function saveEditGallery() {
		const { response, responseData } = await request.put(
			`${host}/gallery/edit-gallery`,
			{
				userId,
				galleryData: editedGallery,
			}
		);

		const { data } = responseData;

		if (!response.ok) {
			enqueueError(responseData.message);
			return;
		}

		handleCloseMenus();
	}

	async function deleteGallery(galleryId) {
		const { response, responseData } = await request.delete(
			`${host}/gallery/delete-gallery`,
			{
				galleryId,
				userId,
			}
		);

		const { data } = responseData;

		if (!response.ok) {
			enqueueError(responseData.message);
			return;
		}

		navigate("/profile");
	}

	const handleAddSelectedImages = async () => {
		try {
			const { response, responseData } = await request.post(
				`${host}/gallery/add-photos-to-gallery`,
				{
					galleryId,
					photoIds: selectedPhotos.map((p) => p._id),
				}
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			// Reset after adding images
			setSelectedPhotos([]);
			photosState(data);
		} catch (error) {
			console.error("Failed to add selected images", error);
		}
	};

	const toggleImageSelection = (photo) => {
		setSelectedPhotos((prev) => {
			const contains = prev.some((p) => p === photo);

			return contains
				? prev.filter((url) => url !== photo)
				: [...prev, photo];
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

						{/* Toggle Buttons */}
						<div className="d-flex justify-content-around mb-3">
							<Button
								variant={
									isUrlUploadActive ? "primary" : "secondary"
								}
								onClick={() => setIsUrlUploadActive(true)}
							>
								Add by URL
							</Button>
							<Button
								variant={
									!isUrlUploadActive ? "primary" : "secondary"
								}
								onClick={() => {
									setSelectedPhotos([]);
									setIsUrlUploadActive(false);
									fetchUploadedImages();
								}}
							>
								View Uploaded Images
							</Button>
						</div>

						{/* Option 1: Add by URL */}
						{isUrlUploadActive && (
							<div className="mb-3">
								<label
									htmlFor="image-url"
									className="form-label"
								>
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
						)}

						{/* Option 2: Select uploaded images */}
						{!isUrlUploadActive && (
							<div className="mb-3">
								{uploadedPhotos.length > 0 ? (
									<div className="row">
										{uploadedPhotos.map((image) => (
											<div
												key={image.url}
												className="col-6 col-md-4 col-lg-3"
											>
												<img
													src={image.url}
													alt="Uploaded"
													className="img-fluid rounded shadow-sm gallery-img m-2"
													onClick={() =>
														toggleImageSelection(
															image
														)
													}
													style={{
														cursor: "pointer",
														border: selectedPhotos?.some(
															(i) =>
																i._id ===
																image._id
														)
															? "6px solid green"
															: "none",
													}}
												/>
											</div>
										))}
									</div>
								) : (
									<p>No uploaded images found.</p>
								)}
							</div>
						)}

						{/* Add Selected Images */}
						{selectedPhotos?.length > 0 && (
							<Button
								variant="success"
								className="m-2"
								onClick={handleAddSelectedImages}
							>
								Add Selected Images
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
					</div>
				</div>
			)}

			{isEditActive && (
				<div className="menu-overlay mt-4">
					<div className="menu-content">
						<h4>Edit Gallery</h4>
						<hr />

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
