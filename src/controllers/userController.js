import { Router } from "express";

const userController = Router();

userController.get('/Register', ( req, res ) => {
    res.render('register');
})

export default userController;