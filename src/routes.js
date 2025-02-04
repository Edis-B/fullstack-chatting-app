import { Router } from "express";

import userController from "./controllers/userController.js";
import homeController from "./controllers/homeController.js";
import chatsController from "./controllers/chatsController.js";

const routes = Router();

routes.use(homeController);
routes.use(userController);
routes.use(chatsController);

export default routes;
