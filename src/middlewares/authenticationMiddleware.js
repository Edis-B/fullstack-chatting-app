import { isLoggedIn } from "../services/userService.js";

export async function isLoggedInLocal(req, res, next) {
	res.locals.isLoggedIn = !!(await isLoggedIn(req)); // Set based on your session/cookie logic
	next();
}
