import { Router } from "express";
import userService from "../services/userService.js";

const userController = Router();

userController.get("/register", (req, res) => {
	res.render("register");
});

userController.post("/register", async (req, res) => {
	const result = await userService.createAccount(req.body);

	if (result == true) {
		return res.redirect("/login");
	}

	console.log(result);

	return res.redirect("/register");
});

userController.get("/login", (req, res) => {
    return res.render("login");
});

userController.post("/login", async (req, res) => {    
    const result = await userService.loginUser(req.body, res);

    if (result == true) {
        return res.redirect("/");
    }

    console.log(result);
    
    return res.redirect('/login');
});

userController.post("/sendFriendRequest", async (req, res) => {
    const result = await userService.sendFriendRequest(req);

    res.redirect('/chats');
})

export default userController;
