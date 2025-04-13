import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { host } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";

import EditGalleryMenu from "./EditGalleryMenu.jsx";

import request from "../../utils/request.js";

import "../../css/gallery-details.css";
import ImagePreviewModal from "../Photos/ImagePreviewModal.jsx";

export default function GalleryDetails() {
	const { galleryId } = useParams();
	const { userId, enqueueError, enqueueInfo } = useUser();

	const [selectedImage, setSelectedImage] = useState(null);
	const [gallery, setGallery] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		if (!galleryId) return;

		fetchGallery(galleryId);
	}, [galleryId]);

	// Fetch gallery data from the server
	async function fetchGallery(galleryId) {
		const { response, payload } = await request.get(
			`${host}/gallery/get-gallery`,
			{
				galleryId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			if (payload.extraProps?.intentional) {
				setErrorMessage(payload.message);
			}
			enqueueError(payload.message);
			return;
		}

		setErrorMessage(null);
		setGallery(data);
	}

	function pushNewPhotos(photos) {
		setGallery((prev) => ({
			...prev,
			photos: [...prev.photos, ...photos],
		}));
	}

	async function removePhotoFromGallery(galleryId, userId, photoId) {
		const { response, payload } = await request.delete(
			`${host}/gallery/remove-photo-from-gallery`,
			{
				galleryId,
				photoId,
				userId,
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		setGallery((prev) => ({
			...prev,
			photos: prev.photos.filter((p) => p._id != photoId),
		}));

		enqueueInfo(data);
	}

	const changeCaptionState = (photoId, newCaption) => {
		setGallery((prev) => ({
			...prev,
			photos: prev.photos.map((photo) =>
				photo._id === photoId
					? {
							...photo,
							caption: newCaption,
					  }
					: photo
			),
		}));
	};

	if (!!errorMessage) {
		return (
			<div className="alert alert-warning mt-3">
				<p>{errorMessage}</p>
			</div>
		);
	}

	return (
		<div className="container mt-5 gallery-details">
			{/* User Header */}
			<div className="gallery.user-header d-flex align-items-center m-2">
				<Link
					to={`/profile/${gallery.user?._id}`}
					className="d-flex flex-row align-items-center"
				>
					<img
						src={gallery.user?.image || "/default-avatar.png"}
						alt="User Profile"
						className="person-avatar"
					/>

					<div className="m-3">
						<h4 className="m-0">
							{gallery.user?.username || "Anonymous"}
						</h4>
					</div>
				</Link>

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
					gallery.photos.map((photo) => (
						<div
							key={photo._id}
							className="col-6 col-md-4 col-lg-3"
						>
							<img
								src={photo.url}
								alt="Gallery"
								className="img-fluid rounded shadow-sm gallery-img"
								onClick={() => setSelectedImage(photo)}
							/>

							{gallery.user._id === userId && (
								<div className="d-flex justify-content-end m-1">
									<Button
										variant="danger"
										onClick={() => {
											const rep = confirm(
												"Are you sure you want to remove this photo from the gallery?"
											);

											if (!rep) {
												return;
											}

											const result =
												removePhotoFromGallery(
													galleryId,
													userId,
													photo._id
												);
										}}
									>
										<i
											className="bi bi-trash align-items-center d-flex flex-row m-1"
											style={{ fontSize: "1.2rem" }}
										/>
									</Button>
								</div>
							)}
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
				changeCaptionState={changeCaptionState}
				user={gallery.user}
				gallery={gallery}
			/>
		</div>
	);
}
