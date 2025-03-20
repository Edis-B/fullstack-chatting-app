import galleryModel from "../models/Gallery.js";
import userModel from "../models/User.js";

const galleryService = {
	async getUserGalleries(req) {
		const { userId } = req.query;

		const user = await userModel
			.findById(userId)
			.populate({
				path: "galleries",
				populate: "images",
			})
			.lean();

		if (!user) {
			throw new Error("User with such id not found!");
		}

		const galleries = user.galleries ?? [];

		if (galleries && galleries.length > 0) {
			galleries.map((g) => (g.previews = g.images.limit(4)));
		}

		return galleries;
	},
	async getGallery(req) {
		const { userId, galleryId } = req.query;

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
};

export default galleryService;
