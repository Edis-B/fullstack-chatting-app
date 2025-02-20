import { Router } from "express";

import userApiController from "./controllers/userApiController.js";
import chatApiController from "./controllers/chatApiController.js";

const routes = Router();

// Api
routes.use("/user", userApiController);
routes.use("/chat", chatApiController);

export default routes;
