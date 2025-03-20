import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useFetchUserPhotos } from "../../hooks/images";

export default function CreateGallery() {
	const [galleryName, setGalleryName] = useState("");
	const [description, setDescription] = useState("");

	const [images] = useFetchUserPhotos();

	const handleCreateGallery = () => {
		console.log("Gallery Created:", galleryName, description, images);
	};

	return (
		<div className="flex h-screen">
			{/* Settings Section */}
			<div className="w-1/2 p-4 border-r flex flex-col gap-4">
				<h2 className="text-xl font-semibold">Create New Gallery</h2>
				<input
					type="text"
					placeholder="Gallery Name"
					className="p-2 border rounded"
					value={galleryName}
					onChange={(e) => setGalleryName(e.target.value)}
				/>
				<textarea
					placeholder="Gallery Description"
					className="p-2 border rounded h-32"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<button
					className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					onClick={handleCreateGallery}
				>
					Create Gallery
				</button>
			</div>

			{/* Images Section */}
			<div className="w-1/2 p-4 grid grid-cols-3 gap-2 overflow-y-auto">
				{images.map((img, index) => (
					<img
						key={img._id}
						src={img.url}
						alt={`Preview ${index + 1}`}
						className="w-full h-32 object-cover rounded shadow"
					/>
				))}
			</div>
		</div>
	);
}
