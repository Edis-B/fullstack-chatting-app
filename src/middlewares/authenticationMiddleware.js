import userService from "../services/userService.js";

export async function isLoggedInLocal(req, res, next) {
	res.locals.isLoggedIn = !!(await userService.isLoggedIn(req));
	next();
}
