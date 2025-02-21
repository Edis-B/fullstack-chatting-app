import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { cookieProtectorKey } from "./common/secretKeys.js";
import sessionMiddleware from "./middlewares/sessionMiddleware.js";
import { frontEnd } from "./common/appConstants.js";
import {
	isLoggedInLocal,
	attachUserToRequest,
} from "./middlewares/authMiddleware.js";
import routes from "./routes.js";

const app = express();
const port = 5000;

// DB Config
try {
	const uri = "mongodb://localhost:27017/BlogApp";

	await mongoose.connect(uri);
	console.log("Successfully connected to DB");
} catch (err) {
	console.log("Could not connect to DB");
	console.log(err.message);
}

// Middleware
app.use(cors({ origin: frontEnd, credentials: true })); // React frontend

app.use("/static", express.static("src/public"));
app.use(cookieParser(cookieProtectorKey));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => sessionMiddleware.persistCookie(req, res, next));
app.use((req, res, next) => attachUserToRequest(req, res, next));
app.use((req, res, next) => isLoggedInLocal(req, res, next));

// Routing
app.use(routes);

app.get("*", (req, res) => {
	res.status(404);
});

// Start Server
app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
