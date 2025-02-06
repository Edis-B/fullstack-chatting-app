import { Router } from "express";
import chatTypes from "../../common/chatTypeConstants.js";
import chatService from "../../services/chatService.js";

const chatApiController = Router();

chatApiController.get("/chat-types", (req, res) => {
    res.json(chatTypes);
})

chatApiController.get("/does-chat-exist-cookie/:receiver", async (req, res) => {
    res.json(await chatService.checkIfDMsExistFromCookie(req, req.params.receiver));
})

export default chatApiController;
