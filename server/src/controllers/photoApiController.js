import { Router } from "express";
import photoService from "../services/photoService.js";
import { catchAsync } from "../utils/errorUtils.js";

const photoApiController = Router();

photoApiController.put(
	"/update-photo-caption",
	catchAsync(async (req, res) => {
		const updatedPhoto = await photoService.updatePhotoCaption(req);
		res.json({
			status: "success",
			data: updatedPhoto,
		});
	})
);

photoApiController.get(
	"/get-user-photos",
	catchAsync(async (req, res) => {
		const photos = await photoService.getUserPhotos(req);
		res.json({
			status: "success",
			results: photos.length,
			data: photos,
		});
	})
);

photoApiController.post(
	"/remove-photo",
	catchAsync(async (req, res) => {
		await photoService.removePhoto(req);
		res.status(204).json({
			status: "success",
			data: null,
		});
	})
);

photoApiController.post(
	"/upload-photo",
	catchAsync(async (req, res) => {
		const uploadedPhotos = await photoService.uploadPhotos(req);
		res.status(201).json({
			status: "success",
			results: uploadedPhotos.length,
			data: uploadedPhotos,
		});
	})
);

export default photoApiController;
