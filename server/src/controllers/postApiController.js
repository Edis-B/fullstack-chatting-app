import { Router } from "express";
import postService from "../services/postService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const postApiController = Router()

postApiController.get("/get-post", async (req, res) => {
    try {
        const result  = await postService.getPost(req)
        res.json(result);
    } catch (err) {
        const errMessage = getErrorMessage(err);
        res.status(400).json(errMessage);
    }
})

postApiController.post("/create-post", async (req, res) => {
    try {
        const result  = await postService.createPost(req)
        res.json(result);
    } catch (err) {
        const errMessage = getErrorMessage(err);
        res.status(400).json(errMessage);
    }
})

postApiController.get("/get-users-posts", async (req, res) => {
    try {
        const result  = await postService.getUserPosts(req)
        res.json(result);
    } catch (err) {
        const errMessage = getErrorMessage(err);
        res.status(400).json(errMessage);
    }
})
export default postApiController;