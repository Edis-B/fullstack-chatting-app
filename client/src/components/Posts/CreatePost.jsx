import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { host, httpUrlRegex } from "../../common/appConstants.js";

import "../../css/create-post.css";
import request from "../../utils/request.js";
export default function CreatePost() {
	const navigate = useNavigate();
	const { userId, enqueueError, enqueueInfo } = useUser();

	const [content, setContent] = useState("");
	const [images, setImages] = useState([]);
	const [imageInput, setImageInput] = useState("");

	const postData = {
		content,
		images,
	};

	async function addImage() {
		if (!httpUrlRegex.test(imageInput)) {
			enqueueError("Image must start with http:// or https://");
		}

		if (images?.length >= 10) {
			enqueueError("Maximum 10 images per post");
			return;
		}

		let array = [...images, imageInput];

		setImages(array);
		setImageInput("");
	}

	async function removeImage(index) {
		let array = [...images];
		array.splice(index, 1);

		setImages(array);
	}

	async function createPost(e) {
		e.preventDefault();

		try {
			const { response, responseData } = await request.post(
				`${host}/post/create-post`,
				{
					...postData,
					userId,
				}
			);

			const { status, results, data } = responseData;

			if (!response.ok) {
				enqueueError(data);
				return;
			}

			enqueueInfo("Successfully created post");
			navigate(`/post/${data}`);
		} catch (err) {
			enqueueError(err);
		}
	}

	return (
		<div className="container mt-4">
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">Create a New Post</h5>

					<form onSubmit={createPost}>
						<div className="mb-3">
							<label className="form-label">Content</label>
							<textarea
								className="form-control"
								rows="3"
								value={content}
								onChange={(e) => setContent(e.target.value)}
							></textarea>
						</div>

						<div className="mb-3">
							<label className="form-label">Images</label>
							{images?.length > 0 ? (
								images.map((image, index) => (
									<div
										className="d-flex flex-column image-container"
										key={`${image}-${index}`}
									>
										<img
											className="preview-image"
											src={image}
										/>
										<button
											type="button"
											onClick={() => removeImage(index)}
											className="m-2"
										>
											Remove image
										</button>
									</div>
								))
							) : (
								<span className="d-block text-muted">
									No images yet.
								</span>
							)}
						</div>

						<div className="mb-3">
							<label className="form-label">Image URL</label>

							<div className="d-flex">
								<input
									type="url"
									className="form-control m-1"
									value={imageInput}
									onChange={(e) =>
										setImageInput(e.target.value)
									}
									placeholder="Enter image URL"
								/>
								<button
									type="button"
									className="btn btn-secondary m-1"
									onClick={addImage}
								>
									Add image
								</button>
							</div>
						</div>

						<button type="submit" className="btn btn-primary">
							Post
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
