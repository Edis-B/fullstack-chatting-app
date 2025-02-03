import { Router } from "express";
import userService from "../services/userService.js";

const userController = Router();

userController.get('/register', ( req, res ) => {
    res.render('register');
})

userController.post('/register', async ( req, res ) => {
    const result = await userService.createAccount(req.body);
    
    if (result == true) {
        return res.redirect('/login');
    }

    console.log(result);
    
    return res.redirect('/register')
})

userController.get('/login', (req,res) => {
    res.render('login');
})

export default userController;