import { Router } from "express";

import userController from "./controllers/userController.js";
import homeController from "./controllers/homeController.js";
import chatsController from "./controllers/chatsController.js";

import userApiController from "./controllers/apiControllers/userApiController.js";

const routes = Router();

routes.use(homeController);
routes.use("/user", userController);
routes.use("/chats", chatsController);

// Api
routes.use("/api/user", userApiController);

export default routes;
