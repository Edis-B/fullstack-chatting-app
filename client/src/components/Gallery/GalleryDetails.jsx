import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Modal and Button for styling

import { host, visibilityTypes } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";

import request from "../../utils/request.js";

import "../../css/gallery-details.css";

export default function GalleryDetails() {
	const navigate = useNavigate();

	const { galleryId } = useParams();
	const { userId, enqueueError } = useUser();

	const [selectedImage, setSelectedImage] = useState(null);

	const [gallery, setGallery] = useState({});

	const [isEditActive, setIsEditActive] = useState(false);
	const [editedGallery, setEditedGallery] = useState({});

	const [isAddImagesActive, setIsAddImagesActive] = useState(false);

	useEffect(() => {
		if (!galleryId) return;

		fetchGallery(galleryId);
	}, [galleryId]);

	// Fetch gallery data from the server
	async function fetchGallery(galleryId) {
		const { response, data } = await request.get(
			`${host}/gallery/get-gallery`,
			{
				galleryId,
			}
		);

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		setGallery(data);
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

	async function saveEditGallery() {
		const { response, data } = await request.put(
			`${host}/gallery/edit-gallery`,
			{
				userId,
				galleryId,
				galleryData: editedGallery,
			}
		);

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		handleCloseMenus();
	}

	// Handle editing the gallery settings
	const handleEditGallery = () => {
		setEditedGallery(gallery);
		setIsEditActive(true);
		setIsAddImagesActive(false); // Ensure only one menu is active at a time
	};

	// Handle adding more images to the gallery
	const handleAddImages = () => {
		setIsAddImagesActive(true);
		setIsEditActive(false); // Ensure only one menu is active at a time
	};

	// Close both menus (when clicking outside or canceling)
	const handleCloseMenus = () => {
		setIsEditActive(false);
		setIsAddImagesActive(false);
	};

	return (
		<div className="container mt-5 gallery-details">
			{/* User Header */}
			<div className="gallery.user-header d-flex align-items-center m-2">
				<img
					src={gallery.user?.image || "/default-avatar.png"}
					alt="User Profile"
					className="rounded-circle"
					style={{
						width: "50px",
						height: "50px",
						objectFit: "cover",
					}}
				/>
				<div className="m-3">
					<h4 className="m-0">
						{gallery.user?.username || "Anonymous"}
					</h4>
				</div>

				<div className="ms-auto">
					<p className="m-0 p-1">Publicity: {gallery.visibility}</p>
				</div>
			</div>

			<hr />

			{/* Gallery Title and Description */}
			<h2 className="gallery-title">{gallery.name}</h2>
			<p className="gallery-description">
				{gallery.description || "No description yet."}
			</p>

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

			{/* Edit Gallery Menu */}
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

			{/* Add More Images Menu */}
			{isAddImagesActive && (
				<div className="menu-overlay mt-4">
					<div className="menu-content">
						<h4>Add More Images</h4>
						{/* Add your upload image form or options here */}
						<p>Form or options to add images can go here.</p>
						<Button variant="secondary" onClick={handleCloseMenus}>
							Close
						</Button>
					</div>
				</div>
			)}

			{/* editedGallery Photos */}
			<div className="row g-3 mt-3 mb-3">
				{gallery.photos?.length > 0 ? (
					gallery.photos.map((img) => (
						<div key={img._id} className="col-6 col-md-4 col-lg-3">
							<img
								src={img.url}
								key={img._id}
								alt="Gallery"
								className="img-fluid rounded shadow-sm gallery-img"
								onClick={() => setSelectedImage(img.url)}
							/>
						</div>
					))
				) : (
					<p>No images yet.</p>
				)}
			</div>

			{/* Modal for Image Preview */}
			<Modal
				show={!!selectedImage}
				onHide={() => setSelectedImage(null)}
				centered
			>
				<Modal.Body className="text-center">
					<img
						src={selectedImage}
						alt="Preview"
						className="img-fluid rounded"
					/>
				</Modal.Body>
			</Modal>
		</div>
	);
}
