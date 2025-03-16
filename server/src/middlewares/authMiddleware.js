import userService from "../services/userService.js";

export async function attachUserToRequest(req, res, next) {
	req.user = await userService.getUserFromReq(req);
	next();
}

const authMiddleware = {
	attachUserToRequest,
};

export default authMiddleware;
