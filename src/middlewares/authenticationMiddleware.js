import { isLoggedIn } from "../services/userService.js";

const isLoggedInLocal = async (req, res, next) => {
    res.locals.isLoggedIn = !!(await isLoggedIn(req)); // Set based on your session/cookie logic
    next();
};

exports.isLoggedInLocal = isLoggedInLocal;