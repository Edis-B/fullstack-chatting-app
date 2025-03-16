import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../common/secretKeys.js";

export function isValidToken(token) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		console.log("Token is valid:", decoded);
		return decoded;
	} catch (error) {
		console.error("Invalid token:", error.message);
		return false;
	}
}

export function attachAuthCookie(res, user, rememberMe) {
	const userIdCookie = {
		_id: user._id,
		username: user.username,
		email: user.email,
	};

	const cookieExpirationDate = rememberMe
		? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Days
		: new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 Hours

	userIdCookie.expires = cookieExpirationDate.toISOString();

	res.cookie("userId", JSON.stringify(userIdCookie), {
		httpOnly: true,
		expires: cookieExpirationDate,
		sameSite: "Lax",
	});
}

export function autherize(req, role) {
	if (role && !req.user.roles.role) {
		throw new Error("Unauthorized!");
	}
	if (!req.user) {
		throw new Error("Not logged in!");
	}
}

const authUtils = {
	isValidToken,
	attachAuthCookie,
	autherize,
};

export default authUtils;
