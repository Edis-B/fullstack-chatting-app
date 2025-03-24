import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

import { host } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";

import EditGalleryMenu from "./EditGalleryMenu.jsx";

import request from "../../utils/request.js";

import "../../css/gallery-details.css";
import ImagePreviewModal from "../Photos/ImagePreviewModal.jsx";

export default function GalleryDetails() {
	const { galleryId } = useParams();
	const { userId, enqueueError } = useUser();

	const [selectedImage, setSelectedImage] = useState(null);
	const [gallery, setGallery] = useState({});

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

	function pushNewPhotos(photos) {
		setGallery((prev) => ({
			...prev,
			photos: [...prev.photos, ...photos],
		}));
	}

	async function removePhotoFromGallery(galleryId, userId, photoId) {
		const { response, data } = await request.delete(
			`${host}/gallery/remove-photo-from-gallery`,
			{
				galleryId,
				photoId,
				userId,
			}
		);

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		setGallery((prev) => ({
			...prev,
			photos: prev.photos.filter((p) => p._id != photoId),
		}));
	}

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

			<EditGalleryMenu gallery={gallery} photosState={pushNewPhotos} />

			{/* Gallery Photos */}
			<div className="row g-3 mt-3 mb-3">
				{gallery.photos?.length > 0 ? (
					gallery.photos.map((img) => (
						<div key={img._id} className="col-6 col-md-4 col-lg-3">
							<img
								src={img.url}
								key={img._id}
								alt="Gallery"
								className="img-fluid rounded shadow-sm gallery-img"
								onClick={() => setSelectedImage(img)}
							/>

							<div className="d-flex justify-content-end m-1">
								<Button
									variant="danger"
									onClick={() => {
										if (
											confirm(
												"Are you sure you want to remove this photo from the gallery?"
											)
										) {
											removePhotoFromGallery(
												galleryId,
												userId,
												img._id
											);
										}
									}}
								>
									<i
										className="bi bi-trash align-items-center d-flex flex-row m-1"
										style={{ fontSize: "1.2rem" }}
									/>
								</Button>
							</div>
						</div>
					))
				) : (
					<p>No images yet.</p>
				)}
			</div>

			{/* Modal for Image Preview */}
			<ImagePreviewModal
				selectedImage={selectedImage}
				setSelectedImage={setSelectedImage}
				user={gallery.user}
				gallery={gallery}
			/>
		</div>
	);
}
