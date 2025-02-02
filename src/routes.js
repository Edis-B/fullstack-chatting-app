import { Router } from "express";

import userController from "./controllers/userController.js"

const routes = Router();

routes.use(userController);

export default routes;