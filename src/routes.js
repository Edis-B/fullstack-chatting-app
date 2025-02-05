import { Router } from "express";

import userController from "./controllers/userController.js";
import homeController from "./controllers/homeController.js";
import chatsController from "./controllers/chatController.js";

import userApiController from "./controllers/apiControllers/userApiController.js";
import chatApiController from "./controllers/apiControllers/chatApiController.js";

const routes = Router();

routes.use(homeController);
routes.use("/user", userController);
routes.use("/chat", chatsController);

// Api
routes.use("/api/user", userApiController);
routes.use("/api/chat", chatApiController);

export default routes;
