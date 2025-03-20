import { Router } from "express";

import userApiController from "./controllers/userApiController.js";
import chatApiController from "./controllers/chatApiController.js";
import postApiController from "./controllers/postApiController.js";
import galleryApiController from "./controllers/galleryApiController.js";
import photoApiController from "./controllers/photoApiController.js";
const routes = Router();

// Api
routes.use("/user", userApiController);
routes.use("/chat", chatApiController);
routes.use("/post", postApiController);
routes.use("/photo", photoApiController)
routes.use("/gallery", galleryApiController);

export default routes;
