import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import { persistCookie } from "./middlewares/sessionMiddleware.js";
import { setUpSocket } from "./socket.js";
import { cookieProtectorKey } from "./common/secretKeys.js";
import { frontEnd } from "./common/appConstants.js";
import { attachUserToRequest } from "./middlewares/authMiddleware.js";
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
app.use(cookieParser(cookieProtectorKey));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: frontEnd, credentials: true })); // React front-end

// Set up RTA
const server = http.createServer(app); // Wrap Express with HTTP server
const io = new Server(server, {
	cors: {
		origin: frontEnd,
		credentials: true,
	},
});
setUpSocket(io);

app.use((req, res, next) => persistCookie(req, res, next));
app.use(async (req, res, next) => attachUserToRequest(req, res, next));

// Routing
app.use(routes);

app.get("*", (req, res) => {
	res.status(404);
});

// Start Server
server.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
	console.log(`Front-End on ${frontEnd}`);
});
