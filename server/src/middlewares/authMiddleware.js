import userService from "../services/userService.js";

export const attachUserToRequest = async (req, res, next) => {
	req.user = await userService.getUserFromReq(req);
	next();
}

const authMiddleware = {
	attachUserToRequest,
};

export default authMiddleware;
