import galleryModel from "../models/Gallery.js";
import photoModel from "../models/Photo.js";
import userModel from "../models/User.js";

const galleryService = {
	async editGallery(req) {
		const { userId, galleryData } = req.body;

		const galleryId = galleryData._id;

		let gallery = await galleryModel.findById(galleryId);

		if (gallery.user != userId) {
			throw new Error("Unauthorized");
		}

		try {
			gallery = Object.assign(gallery, galleryData); // Merge gallery data

			await gallery.save();
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong editting Gallery settings");
		}
	},
	async getUserGalleries(req) {
		const { profileId } = req.query;

		const user = await userModel
			.findById(profileId)
			.populate({
				path: "galleries",
				populate: "photos",
			})
			.lean();

		if (!user) {
			throw new Error("User with such id not found!");
		}

		let galleries = user.galleries ?? [];

		if (galleries && galleries.length > 0) {
			galleries = galleries.map((g) => {
				return {
					...g,
					previews: !!g.photos ? g.photos.slice(0, 4) : [],
				};
			});
		}

		return galleries;
	},
	async getGallery(req) {
		const { galleryId } = req.query;

		const gallery = await galleryModel
			.findById(galleryId)
			.populate("user photos")
			.lean();

		if (!gallery) {
			throw new Error("Gallery not found");
		}

		return gallery;
	},
	async createGallery(req) {
		const { userId, name, description, photos } = req.body;

		if (req.user?.id != userId) {
			throw new Error("Unauthorized!");
		}

		try {
			const newGallery = await galleryModel.create({
				name,
				description,
				user: userId,
				photos: photos,
				dateCreated: Date.now(),
			});

			await userModel.findByIdAndUpdate(userId, {
				$push: { galleries: newGallery._id },
			});

			return newGallery._id;
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong creating gallery!");
		}
	},
	async deleteGallery(req) {
		const { userId, galleryId } = req.body;

		const gallery = await galleryModel.findById(galleryId);

		if (gallery.user != userId) {
			throw new Error("Unauthorized");
		}

		try {
			await galleryModel.findByIdAndDelete(galleryId);

			await userModel.findByIdAndUpdate(userId, {
				$pull: { galleries: galleryId },
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong deleting gallery!");
		}
		return "Successfully deleted gallery";
	},
	async addExistingPhotosToGallery(req) {
		const { photoIds, galleryId } = req.body;

		const photos = await photoModel.find({
			_id: { $in: photoIds },
		});

		try {
			const gallery = await galleryModel
				.findByIdAndUpdate(galleryId, {
					$push: {
						photos: photoIds,
					},
				})
				.lean();

			return photos;
		} catch (err) {
			throw new Error("Something went wrong saving photos.");
		}
	},
	async createImagesAndAddToGallery(req) {
		const { imageUrls, galleryId, userId } = req.body;

		const user = await userModel.findById(userId);

		if (!user) {
			throw new Error("Unauthorized");
		}

		const photos = await Promise.all(
			imageUrls.map(async (img) => {
				const photo = await photoModel.create({
					user: userId,
					gallery: galleryId,
					date: Date.now(),
					url: img,
				});

				user.photos.push(photo._id);
				await user.save();

				return photo;
			})
		);

		try {
			const gallery = await galleryModel
				.findByIdAndUpdate(galleryId, {
					$push: {
						photos: photos.map((p) => p._id),
					},
				})
				.lean();

			return photos;
		} catch (err) {
			throw new Error("Something went wrong saving photos.");
		}
	},
	async removePhotoFromGallery(req) {
		const { galleryId, userId, photoId } = req.body;

		if (userId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		try {
			await galleryModel.findByIdAndUpdate(galleryId, {
				$pull: { photos: photoId },
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong removing photo!");
		}
		
		return "Successfully removed photo from gallery";
	},
};

export default galleryService;
