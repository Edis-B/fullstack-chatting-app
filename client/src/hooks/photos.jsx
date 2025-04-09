import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import request from "../utils/request.js";
import { host } from "../common/appConstants.js";
import { useUser } from "../contexts/UserContext.jsx";

export function useFetchUserPhotos() {
	const { userId, enqueueError } = useUser();
	const [images, setImages] = useState([]);

	async function fetchImages() {
		try {
			const { response, payload } = await request.get(
				`${host}/photo/get-user-photos`,
				{
					userId,
				}
			);
		
			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
				return;
			}

			setImages(data);
		} catch (error) {
			console.error("Failed to fetch images:", error);
		}
	}

	useEffect(() => {
		if (!userId) return;

		fetchImages();
	}, [userId]);

	return [images, setImages];
}

export function useImageModal() {
	const [selectedImage, setSelectedImage] = useState(null);

	function Image(url, index) {
		return (
			<img
				key={index}
				src={url}
				className="img-fluid rounded me-2 mb-2"
				alt="Post"
				style={{ maxWidth: "100px", cursor: "pointer" }}
				onClick={() => setSelectedImage(url)}
			/>
		);
	}

	function ImageModal(user) {
		return (
			<Modal
				show={!!selectedImage}
				onHide={() => {
					setSelectedImage(null);
				}}
				centered
			>
				<Modal.Body className="text-center">
					<div className="d-flex flex-row align-items-center justify-content-between mb-3">
						<div className="d-flex align-items-center">
							<img
								src={user?.image || "/default-pfp.png"}
								alt="User PFP"
								className="rounded-circle m-2"
								style={{
									width: "50px",
									height: "50px",
									objectFit: "cover",
								}}
							/>
							<div>
								<h5 className="mb-0">
									{user?.username || "User error"}
								</h5>
							</div>
						</div>
						<div>
							<button
								className="btn btn-outline-secondary"
								onClick={() => setSelectedImage(null)}
							>
								Close
							</button>
						</div>
					</div>

					<div>
						<img
							src={selectedImage || "/default-image.jpg"} // Use default image if `url` is missing
							alt="Preview"
							className="img-fluid rounded"
							style={{
								maxHeight: "500px",
								objectFit: "contain",
							}}
						/>
					</div>
				</Modal.Body>
			</Modal>
		);
	}

	return { Image, ImageModal };
}
