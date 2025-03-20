import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";

import { host } from "../../common/appConstants";
import { useUser } from "../../contexts/UserContext";

import request from "../../utils/request.js";

import "../../css/gallery-details.css";

export default function GalleryDetails() {
	const { galleryId } = useParams();
	const { userId, enqueueError } = useUser();

	const [selectedImage, setSelectedImage] = useState(null);

	const [gallery, setGallery] = useState({});

	useEffect(() => {
		if (!galleryId) return;

		fetchGallery(galleryId, userId);
	}, [galleryId]);

	async function fetchGallery(galleryId, userId) {
		const { response, data } = await request.get(`${host}/gallery/get-gallery`, {
			galleryId,
			userId,
		});

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		setGallery(data);
	}

	return (
		<div className="container mt-5 gallery-details">
			<h2 className="gallery-title">{gallery.name}</h2>
			<p className="gallery-description">{gallery.description}</p>

			<div className="row g-3">
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
