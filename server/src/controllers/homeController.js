import { Router } from "express"
import userService from "../services/userService.js";

const homeController = Router();

homeController.get("/", async (req, res) => {
    const message = req.user;
	res.render("home", { message });
});

export default homeController;