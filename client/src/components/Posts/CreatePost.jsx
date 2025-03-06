import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { host } from "../../common/appConstants.js";
export default function CreatePost() {
	const pattern = /^https?\:\/\//i;
	const { userId, setError } = useUser();

	const [content, setContent] = useState("");
	const [images, setImages] = useState([]);
	const [imageInput, setImageInput] = useState("");

	const postData = {
		content,
		images,
	};

	async function addImage() {
		if (!pattern.test(imageInput)) {
			setError("Image must start with http:// or https://");
		}

		if (images?.length >= 10) {
			setError("Maximum 10 images per post");
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
			const response = await fetch(`${host}/post/create-post`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...postData,
					userId,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data);
			}
		} catch (err) {
			setError(err);
		}
	}

	return (
		<div className="container mt-4">
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">Create a New Post</h5>
					{/* {error && <div className="alert alert-danger">{error}</div>} */}
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
							{Array.isArray(images) &&
								images.map((image, index) => (
									<div>
										<li>{image}</li>
										<button
											type="button"
											onClick={() => removeImage(index)}
										>
											Remove image
										</button>
									</div>
								))}
						</div>

						<div className="mb-3">
							<label className="form-label">Image URL</label>
							<input
								type="url"
								className="form-control"
								value={imageInput}
								onChange={(e) => setImageInput(e.target.value)}
								placeholder="Enter image URL"
							/>
							<button type="button" onClick={addImage}>
								Add image
							</button>
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
