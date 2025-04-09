import { useState } from "react";
import { useFetchUserPhotos } from "../../hooks/photos.jsx";
import { useNavigate } from "react-router";

import request from "../../utils/request";
import { host } from "../../common/appConstants";

import "../../css/create-gallery.css";
import { useUser } from "../../contexts/UserContext";

export default function CreateGallery() {
	const navigate = useNavigate();

	const { userId, enqueueError } = useUser();
	const [galleryName, setGalleryName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedImages, setSelectedImages] = useState([]);

	const [images, setImages] = useFetchUserPhotos();

	async function handleCreateGallery() {
		const { response, payload } = await request.post(
			`${host}/gallery/create-gallery`,
			{
				photos: selectedImages.map(img => img._id),
				name: galleryName,
				description,
				userId
			}
		);

		const { data } = payload;

		if (!response.ok) {
			enqueueError(payload.message);
			return;
		}

		navigate(`/gallery/${data}`);
		return;
	}

	const handleClickSelect = (image) => {
		setImages((prev) => prev.filter((img) => img._id !== image._id));
		setSelectedImages((prev) => [...prev, image]);
	};

	const handleClickRemove = (image) => {
		setSelectedImages((prev) =>
			prev.filter((img) => img._id !== image._id)
		);
		setImages((prev) => [...prev, image]);
	};

	return (
		<div className="gallery-main">
			{/* Settings Section */}
			<div className="gallery-settings">
				<h2>Create New Gallery</h2>
				<input
					type="text"
					className="gallery-input"
					placeholder="Gallery Name"
					value={galleryName}
					onChange={(e) => setGalleryName(e.target.value)}
				/>

				<textarea
					className="gallery-textarea"
					placeholder="Gallery Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<button
					className="gallery-button"
					onClick={handleCreateGallery}
				>
					Create Gallery
				</button>
			</div>

			<div className="d-flex flex-row">
				{/* Selected Images Section */}
				<div className="gallery-section">
					<h3>Selected Images</h3>
					<div className="image-grid">
						{selectedImages.map((img) => (
							<img
								className="single-image"
								key={img._id}
								src={img.url}
								alt="Selected Preview"
								onDoubleClick={() => handleClickRemove(img)}
							/>
						))}
					</div>
				</div>

				{/* Images Section */}
				<div className="gallery-section">
					<h3>Available Images - Double click to select images</h3>
					<div className="image-grid">
						{images.map((img) => (
							<img
								className="single-image"
								key={img._id}
								src={img.url}
								alt="Available Preview"
								onDoubleClick={() => handleClickSelect(img)}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
