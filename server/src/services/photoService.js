import photoModel from "../models/Photo.js";
import userModel from "../models/User.js";

const photoService = {
	async uploadPhotos(req) {
		const { userId } = req.body;
		let { imageUrls } = req.body;
		imageUrls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

		if (userId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		if (!imageUrls) throw new Error("Image url is required!");

		const user = await userModel.findById(userId).lean();

		const photos = [];
		try {
			for (const imageUrl of imageUrls) {
				const photo = await photoModel.create({
					url: imageUrl,
					date: Date.now(),
					user: userId,
				});

				await userModel.findByIdAndUpdate(userId, {
					$push: {
						photos: photo._id,
					},
				});

				photos.push({ ...photo.toObject(), user });
			}
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong saving photo!");
		}

		return { message: "Successfully saved image!", data: photos };
	},
	async removePhoto(req) {
		const { userId, photoId } = req.body;

		if (userId != req.user?.id) {
			throw new Error("Unauthorized");
		}

		if (!photoId) throw new Error("Photo id was not found!");

		try {
			await userModel.findByIdAndUpdate(userId, {
				$pull: {
					photos: photoId,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong removing photo!");
		}

		return "Successfully removed photo.";
	},
	async getUserPhotos(req) {
		const { userId } = req.query;
		let { excluded } = req.query;

		if (!userId) {
			throw new Error("User id missing!");
		}

		const user = await userModel
			.findById(userId)
			.populate({ path: "photos", populate: "user" })
			.lean();

		if (!user) {
			throw new Error("User not found!");
		}

		if (excluded?.length > 0) {
			excluded = excluded.split(",");
			user.photos = user.photos.filter((p) => {
				const test = excluded.some((e) => e == p._id.toString());
				return !test;
			});
		}

		return user.photos;
	},
	async updatePhotoCaption(req) {
		const { photoId, caption } = req.body;

		const photo = await photoModel.findById(photoId);

		if (!photo) {
			throw new Error("Could not find photo by id!");
		}

		if (photo.user._id != req.user?.id) {
			throw new Error("Unauthorized");
		}

		try {
			photo.caption = caption;
			await photo.save();
		} catch (err) {
			console.log(err);
			throw new Error("Something went wrong saving photo caption");
		}

		return "Successfully updated caption";
	},
};

export default photoService;
