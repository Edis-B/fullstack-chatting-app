import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../common/secretKeys.js"

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
	let { friends, password, ...userIdCookie } = user.toObject();

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

const authUtils = {
	isValidToken,
};

export default authUtils;
