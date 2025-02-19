import jwt from "jsonwebtoken"

import { JWT_SECRET } from "../config.js";

export function isValidToken(token) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET); // Ensure you use the correct secret
		console.log("Token is valid:", decoded);
		return decoded;
	} catch (error) {
		console.error("Invalid token:", error.message);
		return false;
	}
};

const authUtils = {
	isValidToken,
};

export default authUtils;
