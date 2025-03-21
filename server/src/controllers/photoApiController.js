import { Router } from "express";
import photoService from "../services/photoService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const photoApiController = Router();

photoApiController.get("/get-user-photos", async (req, res) => {
	try {
		const result = await photoService.getUserPhotos(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

photoApiController.post("/remove-photo", async (req, res) => {
	try {
		const result = await photoService.removePhoto(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

photoApiController.post("/upload-photo", async (req, res) => {
	try {
		const result = await photoService.uploadPhotos(req);
		res.json(result);
	} catch (err) {
		const errMessage = getErrorMessage(err);
		res.status(400).json(errMessage);
	}
});

export default photoApiController;