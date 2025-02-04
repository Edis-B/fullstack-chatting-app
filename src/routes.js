import { Router } from "express";

import userController from "./controllers/userController.js"
import homeController from "./controllers/homeController.js";

const routes = Router();

routes.use(homeController)
routes.use(userController);

export default routes;