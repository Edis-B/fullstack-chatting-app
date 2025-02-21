import userService from "../services/userService.js";
import userModel from "../models/User.js";

export async function isLoggedInLocal(req, res, next) {
	res.locals.isLoggedIn = !!req.user;
	
	next();
}

export async function attachUserToRequest(req, res, next) {
	req.user = await userService.getUserFromReq(req); 
	next();
}

const authMiddleware = {
	isLoggedInLocal,
	attachUserToRequest,
};

export default authMiddleware;
