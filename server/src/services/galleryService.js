import galleryModel from "../models/Gallery.js";
import photoModel from "../models/Photo.js";
import userModel from "../models/User.js";

import { AppError } from "../utils/errorUtils.js";
import { visibilityTypes } from "../common/entityConstraints.js";
import userService from "./userService.js";

const galleryService = {
	async editGallery(req) {
		const { userId, galleryData } = req.body;

		const galleryId = galleryData._id;

		let gallery = await galleryModel.findById(galleryId);

		if (gallery.user != userId) {
			throw new AppError("Unauthorized", 401);
		}

		try {
			gallery = Object.assign(gallery, galleryData); // Merge gallery data
			await gallery.save();
		} catch (err) {
			console.log(err);
			throw new AppError(
				"Something went wrong editing gallery settings",
				500
			);
		}
	},

	async getUserGalleries(req) {
		const { profileId } = req.query;
		const userId = req.user?.id;
	
		const user = await userModel
			.findById(profileId)
			.populate({
				path: "galleries",
				populate: "photos",
			})
			.lean();
	
		if (!user) {
			throw new AppError("User with such id not found!", 404);
		}
	
		let galleries = user.galleries ?? [];
	
		// Add previews
		for (const gallery of galleries) {
			gallery.previews = gallery.photos?.slice(0, 4) || [];
		}
	
		// Filter out galleries based on visibility
		galleries = galleries.filter((g) => {
			if (g.visibility === visibilityTypes.ONLY_ME && userId !== profileId) {
				return false;
			}

			if (
				g.visibility === visibilityTypes.FRIENDS &&
				!userService.checkIf2UsersAreFriends(user, userId)
			) {
				return false;
			}

			return true;
		});
	
		return galleries;
	},

	async getGallery(req) {
		const { galleryId } = req.query;
		const userId = req.user?.id;

		const gallery = await galleryModel
			.findById(galleryId)
			.populate("user photos")
			.lean();

		if (!gallery) {
			throw new AppError("Gallery not found", 404);
		}

		if (
			gallery.visibility === visibilityTypes.ONLY_ME &&
			gallery.user._id.toString() !== userId
		) {
			throw new AppError("This gallery is private", 403, {
				intentional: true,
			});
		}

		if (
			gallery.visibility === visibilityTypes.FRIENDS &&
			!userService.checkIf2UsersAreFriends(gallery.user, userId)
		) {
			throw new AppError(
				"Friends-only gallery: You must be friends to view",
				403,
				{ intentional: true }
			);
		}

		return gallery;
	},

	async createGallery(req) {
		const { userId, name, description, photos } = req.body;

		if (req.user?.id != userId) {
			throw new AppError("Unauthorized!", 401);
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
			throw new AppError("Something went wrong creating gallery!", 500);
		}
	},

	async deleteGallery(req) {
		const { userId, galleryId } = req.body;

		const gallery = await galleryModel.findById(galleryId);

		if (gallery.user != userId) {
			throw new AppError("Unauthorized", 401);
		}

		try {
			await galleryModel.findByIdAndDelete(galleryId);

			await userModel.findByIdAndUpdate(userId, {
				$pull: { galleries: galleryId },
			});
		} catch (err) {
			console.log(err);
			throw new AppError("Something went wrong deleting gallery!", 500);
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
			throw new AppError("Something went wrong saving photos.", 500);
		}
	},

	async createImagesAndAddToGallery(req) {
		const { imageUrls, galleryId, userId } = req.body;

		const user = await userModel.findById(userId);

		if (!user) {
			throw new AppError("Unauthorized", 401);
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
			throw new AppError("Something went wrong saving photos.", 500);
		}
	},

	async removePhotoFromGallery(req) {
		const { galleryId, userId, photoId } = req.body;

		if (userId != req.user?.id) {
			throw new AppError("Unauthorized", 401);
		}

		try {
			await galleryModel.findByIdAndUpdate(galleryId, {
				$pull: { photos: photoId },
			});
		} catch (err) {
			console.log(err);
			throw new AppError("Something went wrong removing photo!", 500);
		}

		return "Successfully removed photo from gallery";
	},
};

export default galleryService;
