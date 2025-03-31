import { Router } from "express";
import galleryService from "../services/galleryService.js";
import { catchAsync } from "../utils/errorUtils.js";

const galleryApiController = Router();

galleryApiController.put(
	"/edit-gallery",
	catchAsync(async (req, res) => {
		const gallery = await galleryService.editGallery(req);
		res.json({
			status: "success",
			data: gallery,
		});
	})
);

galleryApiController.post(
	"/add-photos-to-gallery",
	catchAsync(async (req, res) => {
		const updatedGallery = await galleryService.addExistingPhotosToGallery(
			req
		);
		res.status(200).json({
			status: "success",
			data: updatedGallery,
		});
	})
);

galleryApiController.post(
	"/create-image-urls-to-gallery",
	catchAsync(async (req, res) => {
		const result = await galleryService.createImagesAndAddToGallery(req);
		res.status(201).json({
			status: "success",
			data: result,
		});
	})
);

galleryApiController.get(
	"/get-user-galleries",
	catchAsync(async (req, res) => {
		const galleries = await galleryService.getUserGalleries(req);
		res.json({
			status: "success",
			results: galleries.length,
			data: galleries,
		});
	})
);

galleryApiController.get(
	"/get-gallery",
	catchAsync(async (req, res) => {
		const gallery = await galleryService.getGallery(req);
		res.json({
			status: "success",
			data: gallery,
		});
	})
);

galleryApiController.post(
	"/create-gallery",
	catchAsync(async (req, res) => {
		const newGallery = await galleryService.createGallery(req);
		res.status(201).json({
			status: "success",
			data: newGallery,
		});
	})
);

galleryApiController.delete(
	"/delete-gallery",
	catchAsync(async (req, res) => {
		await galleryService.deleteGallery(req);
		res.status(204).json({
			status: "success",
			data: null,
		});
	})
);

galleryApiController.delete(
	"/remove-photo-from-gallery",
	catchAsync(async (req, res) => {
		const updatedGallery = await galleryService.removePhotoFromGallery(req);
		res.json({
			status: "success",
			data: updatedGallery,
		});
	})
);

export default galleryApiController;
