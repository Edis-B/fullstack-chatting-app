import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import request from "../../utils/request";
import { host } from "../../common/appConstants";

export default function ImagePreviewModal({
	selectedImage,
	setSelectedImage,
	user,
}) {
	if (!user) {
		user = selectedImage?.user;
	}

	const [caption, setCaption] = useState("");
	const [isEditActive, setIsEditActive] = useState(false);
	const { userId, enqueueError, enqueueInfo } = useUser();

	// Handle caption update
	async function handleUpdateSaveChanges(photoId) {
		try {
			const { response, responseData } = await request.put(
				`${host}/photo/update-photo-caption`,
				{ photoId, caption }
			);
		
			const { status, results, data } = responseData;

			if (!response.ok) {
				enqueueError(data);
				return;
			}

			enqueueInfo(data);
		} catch (err) {
			enqueueError("Something went wrong saving changes");
		}
	}

	// Return early if there's no selectedImage
	if (!selectedImage) return null;

	return (
		<Modal
			show={true}
			onHide={() => {
				setSelectedImage(null);
				setIsEditActive(false);
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
						src={selectedImage?.url || "/default-image.jpg"} // Use default image if `url` is missing
						alt="Preview"
						className="img-fluid rounded"
						style={{
							maxHeight: "500px",
							objectFit: "contain",
						}}
					/>
				</div>

				{/* Caption Section */}
				{user?._id === userId ? (
					<div>
						<div>
							{isEditActive ? (
								<textarea
									className="form-control mt-2"
									placeholder="Add a caption..."
									value={caption || ""}
									onChange={(e) => setCaption(e.target.value)}
									rows="3"
								></textarea>
							) : (
								<div className="m-2">
									<p className="m-0">
										{selectedImage?.caption ||
											"No caption."}
									</p>
								</div>
							)}

							<div className="d-flex justify-content-end">
								{isEditActive ? (
									<>
										<Button
											variant="secondary"
											className="m-2"
											onClick={() =>
												setIsEditActive(false)
											}
										>
											Close
										</Button>
										<Button
											variant="success"
											className="m-2"
											onClick={() =>
												handleUpdateSaveChanges(
													selectedImage._id
												)
											}
										>
											Save Changes
										</Button>
									</>
								) : (
									<Button
										variant="primary"
										className="m-2"
										onClick={() => {
											setIsEditActive(true);
											setCaption(
												selectedImage.caption || ""
											); // Ensure caption is set
										}}
									>
										Edit Caption
									</Button>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className="m-2">
						<p className="m-0">
							{selectedImage?.caption || "No caption."}
						</p>
					</div>
				)}
			</Modal.Body>
		</Modal>
	);
}
