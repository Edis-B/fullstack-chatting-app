import { Router } from "express";

import userApiController from "./controllers/userApiController.js";
import chatApiController from "./controllers/chatApiController.js";
import postApiController from "./controllers/postApiController.js";
import galleryApiController from "./controllers/galleryApiController.js";
const routes = Router();

// Api
routes.use("/user", userApiController);
routes.use("/chat", chatApiController);
routes.use("/post", postApiController);
routes.use("/gallery", galleryApiController);

export default routes;
