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

		const galleries = user.galleries;

		galleries.map((g) => (g.previews = g.images.limit(4)));

		return galleries;
	},
	async createGallery(req) {
		const { userId, galleryName } = req.body;

		if (req.user?.id != userId) {
			throw new Error("Unauthorized!");
		}

		try {
			const newGallery = await galleryModel.create({
				dateCreated: Date.now(),
				name: galleryName,
				user: userId,
			});

			await userModel.findByIdAndUpdate(userId, {
				$push: { galleries: newGallery._id },
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong creating gallery!");
		}
		return newGallery._id;
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
