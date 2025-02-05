import { Router } from "express";
import chatTypes from "../../common/chatTypeConstants.js";

const chatApiController = Router();

chatApiController.get("/chat-types", (req, res) => {
    res.json(chatTypes);
})

export default chatApiController;
